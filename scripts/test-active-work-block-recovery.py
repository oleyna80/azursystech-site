#!/usr/bin/env python3
"""Regression matrix for missing/corrupt Work Block recovery and durability."""
from __future__ import annotations

import json
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
RECOVERY = ROOT / ".codex/scripts/recover-active-work-block.py"
LIFECYCLE = ROOT / ".codex/scripts/lifecycle.py"
CODEX_GATE = ROOT / ".codex/hooks/pre_tool_use_policy.py"
CLAUDE_GATE = ROOT / ".claude/hooks/work_block_gate.py"


def run(command: list[str], cwd: Path, expected: int | None = None) -> subprocess.CompletedProcess[str]:
    result = subprocess.run(command, cwd=cwd, text=True, capture_output=True, check=False)
    if expected is not None and result.returncode != expected:
        raise AssertionError(f"{command}: {result.returncode}\n{result.stdout}\n{result.stderr}")
    return result


def git_fixture(source: Path, destination: Path) -> None:
    shutil.copytree(source, destination, ignore=shutil.ignore_patterns(".git", "__pycache__"))
    run(["git", "init", "-q"], destination, 0)
    run(["git", "config", "user.email", "recovery-test@example.invalid"], destination, 0)
    run(["git", "config", "user.name", "Recovery Test"], destination, 0)
    run(["git", "add", ".agent/active-work-block.default.json"], destination, 0)
    run(["git", "commit", "-qm", "fixture"], destination, 0)


def invoke(
    cwd: Path, expected: int, recovery: Path | None = None
) -> subprocess.CompletedProcess[str]:
    helper = recovery or cwd / ".codex/scripts/recover-active-work-block.py"
    return run([sys.executable, str(helper)], cwd, expected)


def hook_denies(script: Path, cwd: Path) -> bool:
    event = json.dumps({"tool_name": "Bash", "cwd": str(cwd), "tool_input": {"command": "git status"}})
    result = subprocess.run([sys.executable, str(script)], cwd=cwd, input=event, text=True, capture_output=True, check=False)
    output = (result.stdout + result.stderr).lower()
    return result.returncode != 0 or "deny" in output or '"continue": false' in output


def main() -> int:
    lifecycle_source = LIFECYCLE.read_text(encoding="utf-8")
    assert lifecycle_source.count("os.fsync") >= 2
    assert "os.replace(temporary, path)" in lifecycle_source
    assert "os.O_DIRECTORY" in lifecycle_source
    with tempfile.TemporaryDirectory(prefix="active-work-block-recovery-") as holder:
        fixture = Path(holder) / "repo"
        git_fixture(ROOT, fixture)
        state_path = fixture / ".agent/active-work-block.json"
        template_path = fixture / ".agent/active-work-block.default.json"
        template = json.loads(template_path.read_text(encoding="utf-8"))

        state_path.unlink()
        assert hook_denies(CODEX_GATE, fixture)
        assert hook_denies(CLAUDE_GATE, fixture)
        invoke(fixture, 0)
        assert json.loads(state_path.read_text(encoding="utf-8")) == template

        state_path.write_text("{not-json", encoding="utf-8")
        assert hook_denies(CODEX_GATE, fixture)
        assert hook_denies(CLAUDE_GATE, fixture)
        invoke(fixture, 0)
        assert json.loads(state_path.read_text(encoding="utf-8")) == template

        active = json.loads(json.dumps(template))
        active.update({"work_block_id": "WB-active", "subject_branch": "feature/recovery"})
        active["write_gate"] = {"status": "READY", "opened_at": "2026-09-08T00:00:00Z"}
        state_path.write_text(json.dumps(active), encoding="utf-8")
        before = state_path.read_bytes()
        invoke(fixture, 2)
        assert state_path.read_bytes() == before

        state_path.write_text(json.dumps(template, indent=2) + "\n", encoding="utf-8")
        before = state_path.read_bytes()
        invoke(fixture, 0)
        assert state_path.read_bytes() == before

        state_path.write_text(json.dumps({"schema_version": 3}), encoding="utf-8")
        invoke(fixture, 0)
        assert json.loads(state_path.read_text(encoding="utf-8")) == template

        template_path.write_text("[]", encoding="utf-8")
        state_path.unlink()
        invoke(fixture, 2)
        assert not state_path.exists()

        template_path.write_text(json.dumps(template), encoding="utf-8")
        for mutation in (
            lambda value: value["specification"].update({"path": "docs/specs/residual.md"}),
            lambda value: value["integrations"]["approved"].append("residual-admission"),
        ):
            unsafe_template = json.loads(json.dumps(template))
            mutation(unsafe_template)
            template_path.write_text(json.dumps(unsafe_template), encoding="utf-8")
            state_path.write_text("{corrupt-state", encoding="utf-8")
            before = state_path.read_bytes()
            invoke(fixture, 2)
            assert state_path.read_bytes() == before
        template_path.write_text(json.dumps(template), encoding="utf-8")

        project_map = fixture / "PROJECT_MAP.md"
        project_map_contents = project_map.read_text(encoding="utf-8")
        project_map.unlink()
        state_path.unlink()
        invoke(fixture, 2)
        assert not state_path.exists()
        project_map.write_text(project_map_contents, encoding="utf-8")

        foreign = Path(holder) / "foreign-git-repository"
        foreign.mkdir()
        run(["git", "init", "-q"], foreign, 0)
        for marker in (
            "AGENTS.md",
            "PROJECT_MAP.md",
            ".agent/bootstrap-profile.json",
            ".agent/active-work-block.default.json",
            ".codex/scripts/lifecycle.py",
        ):
            source = ROOT / marker
            target = foreign / marker
            target.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(source, target)
        foreign_state = foreign / ".agent/active-work-block.json"
        invoke(foreign, 2, RECOVERY)
        assert not foreign_state.exists()

        run([sys.executable, str(LIFECYCLE), "--root", str(fixture), "prepare", "--reason", "durability test"], fixture, 0)
        assert json.loads(state_path.read_text(encoding="utf-8"))["write_gate"]["status"] == "BLOCKED"

        for argument in ("--help", "--root", "--template", "--output", "payload"):
            result = run(
                [sys.executable, str(fixture / ".codex/scripts/recover-active-work-block.py"), argument],
                fixture,
            )
            assert result.returncode == 2
        outside = Path(holder) / "outside"
        outside.mkdir()
        invoke(outside, 2)
    print("active Work Block recovery matrix: OK")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
