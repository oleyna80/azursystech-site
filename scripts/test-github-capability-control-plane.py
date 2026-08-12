#!/usr/bin/env python3
"""Executable contract tests for AzurSysTech schema-v3 GitHub capability authority."""
from __future__ import annotations

import copy
import json
from pathlib import Path
import shutil
import subprocess
import sys
import tempfile

ROOT = Path(__file__).resolve().parents[1]
HARD_STOP = ROOT / ".agent/hooks/hard_stop_policy.py"
CODEX_GATE = ROOT / ".codex/hooks/pre_tool_use_policy.py"
CLAUDE_GATE = ROOT / ".claude/hooks/work_block_gate.py"
CLAUDE_ASSURANCE = ROOT / ".claude/hooks/assurance_gate.py"
LIFECYCLE = ROOT / ".codex/scripts/lifecycle.py"
EVAL_VALIDATOR = ROOT / "scripts/validate-evaluation.py"
DEFAULT_GATE = ROOT / ".agent/active-work-block.default.json"


def run(command: list[str], cwd: Path, *, input_text: str | None = None) -> subprocess.CompletedProcess[str]:
    return subprocess.run(
        command,
        cwd=cwd,
        input=input_text,
        text=True,
        capture_output=True,
        check=False,
        timeout=10,
    )


def git(cwd: Path, *args: str) -> str:
    result = run(["git", *args], cwd)
    if result.returncode != 0:
        raise AssertionError(result.stderr or result.stdout)
    return result.stdout.strip()


def event(tool_name: str, cwd: Path, tool_input: dict[str, object]) -> str:
    return json.dumps(
        {"tool_name": tool_name, "cwd": str(cwd), "tool_input": tool_input}
    )


def hook(script: Path, cwd: Path, tool_name: str, tool_input: dict[str, object]) -> subprocess.CompletedProcess[str]:
    return run(
        [sys.executable, str(script)],
        cwd,
        input_text=event(tool_name, cwd, tool_input),
    )


def denied(result: subprocess.CompletedProcess[str]) -> bool:
    text = (result.stdout + result.stderr).lower()
    return "\"permissiondecision\": \"deny\"" in text or '"continue": false' in text or '"decision": "block"' in text


def assert_allow(result: subprocess.CompletedProcess[str], label: str) -> None:
    if result.returncode != 0 or denied(result):
        raise AssertionError(f"{label}: expected ALLOW\nstdout={result.stdout}\nstderr={result.stderr}")


def assert_deny(result: subprocess.CompletedProcess[str], label: str) -> None:
    if result.returncode != 0 or not denied(result):
        raise AssertionError(f"{label}: expected DENY\nstdout={result.stdout}\nstderr={result.stderr}")


def ready_gate(base: dict[str, object], cwd: Path) -> dict[str, object]:
    value = copy.deepcopy(base)
    value["work_block_id"] = "WB-TEST-GITHUB-CAPABILITY"
    value["specification"] = {
        "path": "docs/plans/test.md",
        "revision": "test-spec-v1",
    }
    value["base_commit"] = git(cwd, "rev-parse", "HEAD")
    value["write_gate"] = {"status": "READY", "opened_at": "2026-08-12T00:00:00+00:00"}
    value["critic"] = {
        "required": True,
        "status": "READY",
        "verdict": "APPROVE",
        "report": "docs/reports/critic.md",
        "isolation": "same-session-degraded",
        "skip_reason": "",
    }
    value["write_set"] = ["src/**", "tests/**"]
    return value


def write_gate(cwd: Path, value: dict[str, object]) -> None:
    path = cwd / ".agent/active-work-block.json"
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value, indent=2) + "\n", encoding="utf-8")


def make_repo() -> tuple[tempfile.TemporaryDirectory[str], Path, dict[str, object]]:
    holder = tempfile.TemporaryDirectory(prefix="azursystech-capability-test-")
    cwd = Path(holder.name)
    git(cwd, "init", "-q")
    git(cwd, "config", "user.email", "fixture@example.invalid")
    git(cwd, "config", "user.name", "Fixture")
    (cwd / "README.md").write_text("fixture\n", encoding="utf-8")
    git(cwd, "add", "README.md")
    git(cwd, "commit", "-q", "-m", "fixture base")
    git(cwd, "switch", "-q", "-c", "feature/capability-test")
    base = json.loads(DEFAULT_GATE.read_text(encoding="utf-8"))
    write_gate(cwd, base)
    return holder, cwd, base


def test_default_schema() -> None:
    gate = json.loads(DEFAULT_GATE.read_text(encoding="utf-8"))
    assert gate["schema_version"] == 3
    assert gate["authority_mode"] == "github_capability"
    assert "authorization" not in gate
    assert "hard_stop_approvals" not in gate
    assert gate["write_gate"] == {"status": "BLOCKED", "opened_at": None}
    assert "protected_default_branch_mutation" in gate["external_hard_stops"]


def test_lifecycle() -> None:
    holder, cwd, _base = make_repo()
    try:
        result = run(
            [
                sys.executable,
                str(LIFECYCLE),
                "--root",
                str(cwd),
                "open",
                "--work-block-id",
                "WB-TEST-GITHUB-CAPABILITY",
                "--specification-path",
                "docs/plans/test.md",
                "--specification-revision",
                "test-spec-v1",
                "--write",
                "src/**",
                "--critic-status",
                "READY",
                "--critic-verdict",
                "APPROVE",
            ],
            cwd,
        )
        if result.returncode != 0:
            raise AssertionError(f"lifecycle open failed: {result.stdout} {result.stderr}")
        opened = json.loads((cwd / ".agent/active-work-block.json").read_text())
        assert opened["schema_version"] == 3
        assert opened["authority_mode"] == "github_capability"
        assert opened["write_gate"]["status"] == "READY"
        assert "authorization" not in opened
        assert "hard_stop_approvals" not in opened

        result = run(
            [
                sys.executable,
                str(LIFECYCLE),
                "--root",
                str(cwd),
                "freeze",
                "--reason",
                "fixture freeze",
            ],
            cwd,
        )
        if result.returncode != 0:
            raise AssertionError(f"lifecycle freeze failed: {result.stdout} {result.stderr}")
        frozen = json.loads((cwd / ".agent/active-work-block.json").read_text())
        assert frozen["write_gate"] == {"status": "BLOCKED", "opened_at": None}
    finally:
        holder.cleanup()


def test_hard_stops() -> None:
    holder, cwd, base = make_repo()
    try:
        write_gate(cwd, ready_gate(base, cwd))
        assert_allow(hook(HARD_STOP, cwd, "Bash", {"command": "git commit -m fixture"}), "normal local commit")
        assert_deny(hook(HARD_STOP, cwd, "Bash", {"command": "git push origin feature/capability-test"}), "Owner-controlled feature publication")
        assert_deny(hook(HARD_STOP, cwd, "Bash", {"command": "git push origin HEAD:main"}), "default branch push")
        assert_deny(hook(HARD_STOP, cwd, "Bash", {"command": "git push --force origin feature/capability-test"}), "force push")
        assert_deny(hook(HARD_STOP, cwd, "Bash", {"command": "git push origin --delete old-branch"}), "remote branch deletion")
        assert_deny(hook(HARD_STOP, cwd, "Bash", {"command": "git push --mirror origin"}), "mirror push")
        assert_deny(hook(HARD_STOP, cwd, "Bash", {"command": "git push --tags origin"}), "tag publication")
        assert_deny(hook(HARD_STOP, cwd, "Bash", {"command": "docker push ghcr.io/example/app:tag"}), "image publication")
        assert_deny(hook(HARD_STOP, cwd, "Bash", {"command": "ssh prod.example systemctl restart app"}), "live ssh")
        assert_deny(hook(HARD_STOP, cwd, "Bash", {"command": "rm -rf build"}), "recursive rm")
    finally:
        holder.cleanup()


def test_codex_scope() -> None:
    holder, cwd, base = make_repo()
    try:
        gate = ready_gate(base, cwd)
        write_gate(cwd, gate)
        (cwd / "src").mkdir()
        (cwd / "tests").mkdir()
        (cwd / "src/a.txt").write_text("a\n")
        (cwd / "tests/a.txt").write_text("a\n")

        assert_allow(
            hook(
                CODEX_GATE,
                cwd,
                "apply_patch",
                {"command": "*** Begin Patch\n*** Update File: src/a.txt\n*** End Patch"},
            ),
            "apply_patch in write-set",
        )
        assert_deny(
            hook(
                CODEX_GATE,
                cwd,
                "apply_patch",
                {"command": "*** Begin Patch\n*** Update File: src/a.txt\n*** Move to: forbidden/a.txt\n*** End Patch"},
            ),
            "apply_patch Move to outside write-set",
        )
        assert_deny(
            hook(
                CODEX_GATE,
                cwd,
                "Bash",
                {"command": "touch src/a.txt && touch forbidden/b.txt"},
            ),
            "complex mutating Bash",
        )
        assert_allow(hook(CODEX_GATE, cwd, "Bash", {"command": "git status --short"}), "read-only Bash")

        git(cwd, "add", "src/a.txt")
        assert_allow(hook(CODEX_GATE, cwd, "Bash", {"command": "git commit -m inside"}), "staged in-scope commit")
        git(cwd, "reset", "-q")
        (cwd / "forbidden.txt").write_text("no\n")
        git(cwd, "add", "forbidden.txt")
        assert_deny(hook(CODEX_GATE, cwd, "Bash", {"command": "git commit -m outside"}), "staged out-of-scope commit")
    finally:
        holder.cleanup()


def test_claude_scope_and_closeout() -> None:
    holder, cwd, base = make_repo()
    try:
        gate = ready_gate(base, cwd)
        write_gate(cwd, gate)
        (cwd / "src").mkdir()
        (cwd / "src/a.txt").write_text("a\n")
        assert_allow(
            hook(CLAUDE_GATE, cwd, "Edit", {"file_path": str(cwd / "src/a.txt")}),
            "Claude in-scope Edit",
        )
        assert_deny(
            hook(CLAUDE_GATE, cwd, "Edit", {"file_path": str(cwd / "forbidden.txt")}),
            "Claude out-of-scope Edit",
        )

        (cwd / "docs/reports").mkdir(parents=True)
        (cwd / "docs/reports/review.md").write_text("review\n")
        (cwd / "docs/reports/verification.md").write_text("verification\n")
        (cwd / "scripts").mkdir()
        shutil.copy2(EVAL_VALIDATOR, cwd / "scripts/validate-evaluation.py")

        gate["write_gate"] = {"status": "BLOCKED", "opened_at": None}
        gate["assurance"] = {
            "review": {
                "required": True,
                "status": "READY",
                "verdict": "READY",
                "report": "docs/reports/review.md",
                "isolation": "independent-readonly-root",
                "skip_reason": "",
            },
            "verification": {
                "required": True,
                "status": "READY",
                "verdict": "READY",
                "report": "docs/reports/verification.md",
                "isolation": "independent-readonly-root",
                "skip_reason": "",
            },
            "evaluation": {
                "required": False,
                "status": "SKIPPED",
                "verdict": "PENDING",
                "plan": "",
                "report": "",
                "rubric_revision": "",
                "benchmark_revision": "",
                "isolation": "unknown",
                "skip_reason": "deterministic control-plane migration",
            },
            "drift": {
                "required": False,
                "status": "SKIPPED",
                "verdict": "PENDING",
                "report": "",
                "isolation": "unknown",
                "skip_reason": "no separate drift gate required for fixture",
            },
        }
        gate["closeout_mode"] = "success-closeout"
        write_gate(cwd, gate)
        result = run([sys.executable, str(CLAUDE_ASSURANCE)], cwd, input_text=json.dumps({"cwd": str(cwd)}))
        assert_allow(result, "Claude assurance closeout")

        broken = copy.deepcopy(gate)
        broken["assurance"]["verification"]["status"] = "PENDING"
        broken["assurance"]["verification"]["verdict"] = "PENDING"
        write_gate(cwd, broken)
        result = run([sys.executable, str(CLAUDE_ASSURANCE)], cwd, input_text=json.dumps({"cwd": str(cwd)}))
        assert_deny(result, "Claude unresolved verification blocks closeout")
    finally:
        holder.cleanup()


def test_opencode_posture() -> None:
    config = json.loads((ROOT / "opencode.json").read_text(encoding="utf-8"))
    bash = config["permission"]["bash"]
    assert bash["git commit*"] == "allow"
    assert bash["git push*"] == "deny"
    assert bash["git reset --hard*"] == "deny"
    assert bash["git clean*"] == "deny"


TESTS = [
    test_default_schema,
    test_lifecycle,
    test_hard_stops,
    test_codex_scope,
    test_claude_scope_and_closeout,
    test_opencode_posture,
]


def main() -> int:
    failures = 0
    for test in TESTS:
        try:
            test()
        except Exception as exc:  # fixture runner intentionally reports all failures
            failures += 1
            print(f"FAIL {test.__name__}: {exc}")
        else:
            print(f"PASS {test.__name__}")
    print(f"PASS={len(TESTS) - failures} FAIL={failures}")
    return 1 if failures else 0


if __name__ == "__main__":
    raise SystemExit(main())
