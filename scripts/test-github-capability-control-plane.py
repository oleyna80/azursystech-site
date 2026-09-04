#!/usr/bin/env python3
"""Executable contract tests for AzurSysTech schema-v3 GitHub capability authority."""
from __future__ import annotations

import copy
import json
import os
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


def assert_diagnostic(
    result: subprocess.CompletedProcess[str],
    cwd: Path,
    *,
    branch: str,
    work_block_id: str,
) -> None:
    text = result.stdout + result.stderr
    required = [
        f"root={cwd.resolve()}",
        f"branch={branch}",
        "HEAD=",
        f"work_block_id={work_block_id}",
        "command-local cd does not rebind it",
        "Start a new agent session from the intended worktree",
    ]
    missing = [value for value in required if value not in text]
    if missing:
        raise AssertionError(
            f"diagnostic context missing {missing}\nstdout={result.stdout}\nstderr={result.stderr}"
        )


def ready_gate(base: dict[str, object], cwd: Path) -> dict[str, object]:
    value = copy.deepcopy(base)
    value["work_block_id"] = "WB-TEST-GITHUB-CAPABILITY"
    value["specification"] = {
        "path": "docs/plans/test.md",
        "revision": "test-spec-v1",
    }
    value["subject_branch"] = git(cwd, "branch", "--show-current")
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
    git(cwd, "branch", "-M", "main")
    git(cwd, "switch", "-q", "-c", "feature/capability-test")
    base = json.loads(DEFAULT_GATE.read_text(encoding="utf-8"))
    write_gate(cwd, base)
    return holder, cwd, base


def make_parallel_worktrees() -> tuple[
    tempfile.TemporaryDirectory[str], Path, Path, dict[str, object], dict[str, object]
]:
    holder = tempfile.TemporaryDirectory(prefix="azursystech-worktree-binding-test-")
    primary = Path(holder.name) / "primary"
    secondary = Path(holder.name) / "secondary"
    primary.mkdir()
    git(primary, "init", "-q")
    git(primary, "config", "user.email", "fixture@example.invalid")
    git(primary, "config", "user.name", "Fixture")
    (primary / "README.md").write_text("fixture\n", encoding="utf-8")
    git(primary, "add", "README.md")
    git(primary, "commit", "-q", "-m", "fixture base")
    git(primary, "branch", "-M", "main")
    git(primary, "branch", "feature/worktree-one")
    git(primary, "branch", "feature/worktree-two")
    git(primary, "switch", "-q", "feature/worktree-one")
    git(primary, "worktree", "add", "-q", str(secondary), "feature/worktree-two")

    base = json.loads(DEFAULT_GATE.read_text(encoding="utf-8"))
    gate_one = ready_gate(base, primary)
    gate_one["work_block_id"] = "WB-TEST-WORKTREE-ONE"
    gate_two = ready_gate(base, secondary)
    gate_two["work_block_id"] = "WB-TEST-WORKTREE-TWO"
    write_gate(primary, gate_one)
    write_gate(secondary, gate_two)
    for cwd in (primary, secondary):
        (cwd / "src").mkdir()
        (cwd / "src/a.txt").write_text("a\n", encoding="utf-8")
    return holder, primary, secondary, gate_one, gate_two


def lifecycle_open(cwd: Path) -> subprocess.CompletedProcess[str]:
    return run(
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


def test_default_schema() -> None:
    gate = json.loads(DEFAULT_GATE.read_text(encoding="utf-8"))
    assert gate["schema_version"] == 3
    assert gate["authority_mode"] == "github_capability"
    assert gate["subject_branch"] == ""
    assert "authorization" not in gate
    assert "hard_stop_approvals" not in gate
    assert gate["write_gate"] == {"status": "BLOCKED", "opened_at": None}
    assert "protected_default_branch_mutation" in gate["external_hard_stops"]


def test_lifecycle() -> None:
    holder, cwd, _base = make_repo()
    try:
        result = lifecycle_open(cwd)
        if result.returncode != 0:
            raise AssertionError(f"lifecycle open failed: {result.stdout} {result.stderr}")
        opened = json.loads((cwd / ".agent/active-work-block.json").read_text())
        assert opened["schema_version"] == 3
        assert opened["authority_mode"] == "github_capability"
        assert opened["subject_branch"] == "feature/capability-test"
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


def test_reporting_only_closeout_inactive_coordination_scope() -> None:
    holder, cwd, _base = make_repo()
    try:
        result = lifecycle_open(cwd)
        if result.returncode != 0:
            raise AssertionError(f"lifecycle open failed: {result.stdout} {result.stderr}")
        active_path = cwd / ".agent/active-work-block.json"
        active = json.loads(active_path.read_text(encoding="utf-8"))
        active["assurance"] = {
            "review": {"required": True, "status": "BLOCKED", "verdict": "BLOCKED", "report": "", "isolation": "unknown", "skip_reason": ""},
            "verification": {"required": True, "status": "BLOCKED", "verdict": "BLOCKED", "report": "", "isolation": "unknown", "skip_reason": ""},
            "evaluation": {"required": False, "status": "SKIPPED", "verdict": "PENDING", "plan": "", "report": "", "rubric_revision": "", "benchmark_revision": "", "isolation": "unknown", "skip_reason": "not required for fixture"},
            "drift": {"required": False, "status": "SKIPPED", "verdict": "PENDING", "report": "", "isolation": "unknown", "skip_reason": "not required for fixture"},
        }
        write_gate(cwd, active)
        result = run(
            [sys.executable, str(LIFECYCLE), "--root", str(cwd), "close", "--mode", "reporting-only", "--reason", "fixture reporting-only closeout"],
            cwd,
        )
        if result.returncode != 0:
            raise AssertionError(f"lifecycle close failed: {result.stdout} {result.stderr}")
        inactive = json.loads(active_path.read_text(encoding="utf-8"))
        assert inactive["work_block_id"] == ""
        assert inactive["specification"] == {"path": "", "revision": ""}
        assert inactive["subject_branch"] == ""
        assert inactive["base_commit"] == ""
        assert inactive["write_set"] == []
        assert inactive["write_gate"] == {"status": "BLOCKED", "opened_at": None}
        assert inactive["closeout_mode"] == "reporting-only"
        assert inactive["coordination_write_set"] == _base["coordination_write_set"]
        assert inactive["coordination_write_set"] == [
            ".agent/active-work-block.json",
            ".agent/critic-gate.md",
            ".agent/verification-gate.md",
            ".codex/write-gate.md",
            "FILE_REGISTRY.yml",
            "PROJECT_MAP.md",
            "docs/plans/**",
            "docs/specs/**",
            "docs/tasklist/**",
            "docs/reports/**",
            "docs/architecture/drafts/**",
            "memory_bank/**",
        ]

        (cwd / "docs/plans").mkdir(parents=True)
        (cwd / "docs/plans/closeout.md").write_text("closeout\n", encoding="utf-8")
        (cwd / "FILE_REGISTRY.yml").write_text("release_state: {}\n", encoding="utf-8")
        (cwd / "PROJECT_MAP.md").write_text("# Project map\n", encoding="utf-8")
        (cwd / "src").mkdir()
        (cwd / "src/a.txt").write_text("source\n", encoding="utf-8")
        git(cwd, "add", "src/a.txt")
        git(cwd, "commit", "-q", "-m", "track fixture source")
        (cwd / "src/a.txt").write_text("changed source\n", encoding="utf-8")
        (cwd / "pathspecs.txt").write_text("src/a.txt\n", encoding="utf-8")
        assert_allow(
            hook(
                CODEX_GATE,
                cwd,
                "apply_patch",
                {"command": "*** Begin Patch\n*** Update File: FILE_REGISTRY.yml\n*** Update File: PROJECT_MAP.md\n*** Update File: docs/plans/closeout.md\n*** End Patch"},
            ),
            "Codex inactive complete coordination write",
        )
        for path in ("FILE_REGISTRY.yml", "PROJECT_MAP.md", "docs/plans/closeout.md"):
            assert_allow(
                hook(CLAUDE_GATE, cwd, "Edit", {"file_path": str(cwd / path)}),
                f"Claude inactive coordination write {path}",
            )
        for gate, edit_tool, source_input, label in (
            (CODEX_GATE, "apply_patch", {"command": "*** Begin Patch\n*** Update File: src/a.txt\n*** End Patch"}, "Codex"),
            (CLAUDE_GATE, "Edit", {"file_path": str(cwd / "src/a.txt")}, "Claude"),
        ):
            assert_deny(hook(gate, cwd, edit_tool, source_input), f"{label} inactive source write")

        git(cwd, "add", "FILE_REGISTRY.yml", "PROJECT_MAP.md", "docs/plans/closeout.md")
        assert_allow(hook(CODEX_GATE, cwd, "Bash", {"command": "git commit -m closeout"}), "Codex inactive coordination commit")
        assert_allow(hook(CLAUDE_GATE, cwd, "Bash", {"command": "git commit -m closeout"}), "Claude inactive coordination commit")
        unsafe_commits = (
            "git commit -a -m closeout",
            "git commit --all -m closeout",
            "git commit -i src/a.txt -m closeout",
            "git commit --include src/a.txt -m closeout",
            "git commit -o src/a.txt -m closeout",
            "git commit --only src/a.txt -m closeout",
            "git commit -m closeout -- src/a.txt",
            "git commit -m closeout --pathspec-from-file=pathspecs.txt",
            "git -C . commit -a -m closeout",
            "git -c color.ui=false commit -m closeout -- src/a.txt",
            "git --exec-path=/usr/lib/git-core commit -a -m closeout",
            "git --no-advice commit -a -m closeout",
            "command git commit -a -m closeout",
            "command -p git commit -a -m closeout",
            "env GIT_EDITOR=: git commit -a -m closeout",
            "env -C . git commit -a -m closeout",
        "env -u GIT_EDITOR git commit -a -m closeout",
        "env --ignore-signal git commit -a -m closeout",
        "env --ignore-signal HUP git commit -a -m closeout",
        "env -S 'git commit -a -m closeout'",
        "env -S'git commit -a -m closeout'",
        "env -S'env -u GIT_EDITOR git commit -a -m closeout'",
        "env --split-string='git commit -a -m closeout'",
        "/usr/bin/git commit -a -m closeout",
        )
        for command in unsafe_commits:
            assert_deny(hook(CODEX_GATE, cwd, "Bash", {"command": command}), f"Codex inactive selector {command}")
            assert_deny(hook(CLAUDE_GATE, cwd, "Bash", {"command": command}), f"Claude inactive selector {command}")
        git(cwd, "reset", "-q")
        git(cwd, "add", "src/a.txt")
        assert_deny(hook(CODEX_GATE, cwd, "Bash", {"command": "git commit -m source"}), "Codex inactive source commit")
        assert_deny(hook(CLAUDE_GATE, cwd, "Bash", {"command": "git commit -m source"}), "Claude inactive source commit")
    finally:
        holder.cleanup()


def test_lifecycle_rejects_default_and_detached() -> None:
    holder, cwd, _base = make_repo()
    try:
        git(cwd, "switch", "-q", "main")
        result = lifecycle_open(cwd)
        if result.returncode != 2 or "default branch" not in (result.stdout + result.stderr):
            raise AssertionError(
                f"lifecycle default-branch open should be BLOCKED\nstdout={result.stdout}\nstderr={result.stderr}"
            )

        git(cwd, "switch", "-q", "feature/capability-test")
        git(cwd, "switch", "-q", "--detach")
        result = lifecycle_open(cwd)
        if result.returncode != 2 or "detached" not in (result.stdout + result.stderr):
            raise AssertionError(
                f"lifecycle detached-HEAD open should be BLOCKED\nstdout={result.stdout}\nstderr={result.stderr}"
            )
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
        assert_deny(hook(HARD_STOP, cwd, "Bash", {"command": "git push origin --mirror"}), "mirror push")
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
        result = hook(
            CODEX_GATE,
            cwd,
            "apply_patch",
            {"command": "*** Begin Patch\n*** Update File: src/a.txt\n*** Move to: forbidden/a.txt\n*** End Patch"},
        )
        assert_deny(result, "apply_patch Move to outside write-set")
        assert_diagnostic(
            result,
            cwd,
            branch="feature/capability-test",
            work_block_id="WB-TEST-GITHUB-CAPABILITY",
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


def test_codex_coordination_commit_scope() -> None:
    holder, cwd, base = make_repo()
    try:
        gate = ready_gate(base, cwd)
        write_gate(cwd, gate)
        (cwd / ".agent/critic-gate.md").write_text("critic\n", encoding="utf-8")
        git(cwd, "add", ".agent/critic-gate.md")
        assert_allow(
            hook(CODEX_GATE, cwd, "Bash", {"command": "git commit -m coordination"}),
            "staged hidden coordination commit",
        )
    finally:
        holder.cleanup()


def test_binding_mismatch_coordination_and_repair() -> None:
    holder, cwd, base = make_repo()
    try:
        gate = ready_gate(base, cwd)
        gate["subject_branch"] = "feature/other-worktree"
        write_gate(cwd, gate)
        (cwd / "src").mkdir()
        (cwd / "src/a.txt").write_text("a\n", encoding="utf-8")

        codex_source = hook(
            CODEX_GATE,
            cwd,
            "apply_patch",
            {"command": "*** Begin Patch\n*** Update File: src/a.txt\n*** End Patch"},
        )
        assert_deny(codex_source, "Codex stale gate source write")
        assert_diagnostic(
            codex_source,
            cwd,
            branch="feature/capability-test",
            work_block_id="WB-TEST-GITHUB-CAPABILITY",
        )

        claude_source = hook(
            CLAUDE_GATE,
            cwd,
            "Edit",
            {"file_path": str(cwd / "src/a.txt")},
        )
        assert_deny(claude_source, "Claude stale gate source write")
        assert_diagnostic(
            claude_source,
            cwd,
            branch="feature/capability-test",
            work_block_id="WB-TEST-GITHUB-CAPABILITY",
        )

        codex_coordination = hook(
            CODEX_GATE,
            cwd,
            "apply_patch",
            {"command": "*** Begin Patch\n*** Add File: docs/plans/test.md\n*** End Patch"},
        )
        assert_deny(codex_coordination, "Codex stale gate coordination write")
        claude_coordination = hook(
            CLAUDE_GATE,
            cwd,
            "Edit",
            {"file_path": str(cwd / ".agent/critic-gate.md")},
        )
        assert_deny(claude_coordination, "Claude stale gate coordination write")

        (cwd / ".agent/critic-gate.md").write_text("critic\n", encoding="utf-8")
        git(cwd, "add", ".agent/critic-gate.md")
        stale_codex_commit = hook(CODEX_GATE, cwd, "Bash", {"command": "git commit -m coordination"})
        assert_deny(stale_codex_commit, "Codex stale gate coordination commit")
        assert_diagnostic(
            stale_codex_commit,
            cwd,
            branch="feature/capability-test",
            work_block_id="WB-TEST-GITHUB-CAPABILITY",
        )
        stale_claude_commit = hook(CLAUDE_GATE, cwd, "Bash", {"command": "git commit -m coordination"})
        assert_deny(stale_claude_commit, "Claude stale gate coordination commit")
        git(cwd, "reset", "-q")

        assert_allow(
            hook(
                CODEX_GATE,
                cwd,
                "apply_patch",
                {"command": "*** Begin Patch\n*** Update File: .agent/active-work-block.json\n*** End Patch"},
            ),
            "Codex active gate repair",
        )
        assert_allow(
            hook(
                CLAUDE_GATE,
                cwd,
                "Edit",
                {"file_path": str(cwd / ".agent/active-work-block.json")},
            ),
            "Claude active gate repair",
        )

        missing = copy.deepcopy(gate)
        missing["subject_branch"] = ""
        write_gate(cwd, missing)
        assert_deny(
            hook(
                CODEX_GATE,
                cwd,
                "apply_patch",
                {"command": "*** Begin Patch\n*** Update File: src/a.txt\n*** End Patch"},
            ),
            "Codex missing subject_branch",
        )
        assert_deny(
            hook(CLAUDE_GATE, cwd, "Edit", {"file_path": str(cwd / "src/a.txt")}),
            "Claude missing subject_branch",
        )

        attached = ready_gate(base, cwd)
        write_gate(cwd, attached)
        git(cwd, "switch", "-q", "--detach")
        codex_detached = hook(
            CODEX_GATE,
            cwd,
            "apply_patch",
            {"command": "*** Begin Patch\n*** Update File: src/a.txt\n*** End Patch"},
        )
        assert_deny(codex_detached, "Codex detached HEAD")
        assert_diagnostic(
            codex_detached,
            cwd,
            branch="<detached>",
            work_block_id="WB-TEST-GITHUB-CAPABILITY",
        )
        claude_detached = hook(
            CLAUDE_GATE,
            cwd,
            "Edit",
            {"file_path": str(cwd / "src/a.txt")},
        )
        assert_deny(claude_detached, "Claude detached HEAD")
    finally:
        holder.cleanup()


def test_parallel_worktree_isolation() -> None:
    holder, primary, secondary, gate_one, _gate_two = make_parallel_worktrees()
    try:
        for cwd, work_block_id in (
            (primary, "WB-TEST-WORKTREE-ONE"),
            (secondary, "WB-TEST-WORKTREE-TWO"),
        ):
            assert_allow(
                hook(
                    CODEX_GATE,
                    cwd,
                    "apply_patch",
                    {"command": "*** Begin Patch\n*** Update File: src/a.txt\n*** End Patch"},
                ),
                f"Codex matching gate in {cwd.name}",
            )
            assert_allow(
                hook(CLAUDE_GATE, cwd, "Edit", {"file_path": str(cwd / "src/a.txt")}),
                f"Claude matching gate in {cwd.name}",
            )
            assert work_block_id in (cwd / ".agent/active-work-block.json").read_text()

        write_gate(secondary, gate_one)
        codex_stale = hook(
            CODEX_GATE,
            secondary,
            "apply_patch",
            {"command": "*** Begin Patch\n*** Update File: src/a.txt\n*** End Patch"},
        )
        assert_deny(codex_stale, "Codex cross-worktree stale gate")
        assert_diagnostic(
            codex_stale,
            secondary,
            branch="feature/worktree-two",
            work_block_id="WB-TEST-WORKTREE-ONE",
        )
        claude_stale = hook(
            CLAUDE_GATE,
            secondary,
            "Edit",
            {"file_path": str(secondary / "src/a.txt")},
        )
        assert_deny(claude_stale, "Claude cross-worktree stale gate")
        assert_diagnostic(
            claude_stale,
            secondary,
            branch="feature/worktree-two",
            work_block_id="WB-TEST-WORKTREE-ONE",
        )
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
        outside = hook(CLAUDE_GATE, cwd, "Edit", {"file_path": str(cwd / "forbidden.txt")})
        assert_deny(outside, "Claude out-of-scope Edit")
        assert_diagnostic(
            outside,
            cwd,
            branch="feature/capability-test",
            work_block_id="WB-TEST-GITHUB-CAPABILITY",
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


def test_candidate_diff_check() -> None:
    base_branch = os.environ.get("GITHUB_BASE_REF", "").strip()
    if base_branch:
        base_ref = f"refs/remotes/origin/{base_branch}"
        fetched = run(
            [
                "git",
                "fetch",
                "--no-tags",
                "--depth=1",
                "origin",
                f"{base_branch}:{base_ref}",
            ],
            ROOT,
        )
        if fetched.returncode != 0:
            raise AssertionError(
                f"cannot fetch PR base for git diff --check: {fetched.stderr or fetched.stdout}"
            )
    else:
        base_ref = ""
        for candidate in ("origin/main", "main", "origin/master", "master"):
            resolved = run(["git", "rev-parse", "--verify", candidate], ROOT)
            if resolved.returncode == 0:
                base_ref = candidate
                break
        if not base_ref:
            raise AssertionError("cannot resolve repository base for git diff --check")

    checked = run(["git", "diff", "--check", base_ref, "HEAD"], ROOT)
    if checked.returncode != 0:
        raise AssertionError(
            f"git diff --check failed for {base_ref}..HEAD:\n{checked.stdout}{checked.stderr}"
        )


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
    test_reporting_only_closeout_inactive_coordination_scope,
    test_lifecycle_rejects_default_and_detached,
    test_hard_stops,
    test_codex_scope,
    test_codex_coordination_commit_scope,
    test_binding_mismatch_coordination_and_repair,
    test_parallel_worktree_isolation,
    test_claude_scope_and_closeout,
    test_candidate_diff_check,
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
