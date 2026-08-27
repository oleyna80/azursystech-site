#!/usr/bin/env python3
"""Regression tests for the Git-index shared-context validator."""

from __future__ import annotations

import json
import re
import subprocess
import sys
import tempfile
from pathlib import Path


VALIDATOR = Path(__file__).with_name("validate-shared-context.py").resolve()
WORKFLOW = VALIDATOR.parents[1] / ".github/workflows/control-plane-contracts.yml"
REQUIRED = (
    "docs/project-context.md",
    "memory_bank/orchestrator-log.md",
    "memory_bank/context.md",
    "memory_bank/progress.md",
    "memory_bank/decisions.md",
)
REQUIRED_TRIGGER_PATTERNS = (
    ".env",
    ".env.*",
    "**/.env",
    "**/.env.*",
    "memory_bank/**",
    "docs/project-context.md",
    ".codex/worktrees/**",
    "private_evidence/**",
)
TRIGGER_CASES = {
    ".env": True,
    ".env.production": True,
    "web/.env.production": True,
    "nested/a/.env.local": True,
    "memory_bank/private-notes.md": True,
    "docs/project-context.md": True,
    "private_evidence/file.txt": True,
    ".codex/worktrees/foo/bar": True,
    "ordinary-product-file": False,
}


def run(command: list[str], repo: Path, *, force: bool = False) -> None:
    git_command = ["git", *command]
    if force:
        git_command.insert(1, "-c")
        git_command.insert(2, "advice.addIgnoredFile=false")
    subprocess.run(
        git_command,
        cwd=repo,
        check=True,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,
    )


def create_fixture(repo: Path, path: str) -> None:
    for required in REQUIRED:
        required_path = repo / required
        required_path.parent.mkdir(parents=True, exist_ok=True)
        required_path.write_text("DUMMY_VALUE=test\n", encoding="utf-8")

    (repo / ".gitignore").write_text(
        ".env*\n**/.env*\n", encoding="utf-8"
    )
    ordinary = repo / "ordinary-file.txt"
    ordinary.write_text("DUMMY_VALUE=test\n", encoding="utf-8")
    fixture = repo / path
    fixture.parent.mkdir(parents=True, exist_ok=True)
    fixture.write_text("DUMMY_VALUE=test\n", encoding="utf-8")

    run(["add", "--", *REQUIRED, ".gitignore", "ordinary-file.txt"], repo)
    run(["add", "-f", "--", path], repo)


def workflow_paths(event: str) -> set[str]:
    text = WORKFLOW.read_text(encoding="utf-8")
    match = re.search(
        rf"(?ms)^  {re.escape(event)}:\n.*?^    paths:\n"
        rf"(?P<paths>(?:      - \"[^\"]+\"\n)+)",
        text,
    )
    if not match:
        raise AssertionError(f"could not read {event}.paths from {WORKFLOW}")
    return {
        json.loads(line.strip()[2:])
        for line in match.group("paths").splitlines()
    }


def path_matches(pattern: str, path: str) -> bool:
    if pattern == path:
        return True
    if pattern in {".env", ".env.*"}:
        return path.startswith(".env.") if pattern == ".env.*" else False
    if pattern == "**/.env":
        return Path(path).name == ".env"
    if pattern == "**/.env.*":
        return Path(path).name.startswith(".env.")
    if pattern.endswith("/**"):
        prefix = pattern[:-3]
        return path == prefix or path.startswith(f"{prefix}/")
    return False


def validate_workflow_trigger_contract() -> None:
    event_patterns = {
        event: workflow_paths(event) for event in ("push", "pull_request")
    }
    for event, patterns in event_patterns.items():
        missing = sorted(set(REQUIRED_TRIGGER_PATTERNS) - patterns)
        if missing:
            raise AssertionError(f"{event}.paths missing protected triggers: {missing}")
        for path, expected in TRIGGER_CASES.items():
            actual = any(path_matches(pattern, path) for pattern in patterns)
            if actual != expected:
                raise AssertionError(
                    f"{event}.paths trigger mismatch for {path}: "
                    f"expected {expected}, got {actual}"
                )


def validate(path: str, expected_exit: int) -> None:
    with tempfile.TemporaryDirectory(prefix="shared-context-regression-") as directory:
        repo = Path(directory)
        run(["init", "--quiet"], repo)
        create_fixture(repo, path)
        result = subprocess.run(
            [sys.executable, str(VALIDATOR)],
            cwd=repo,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
        )
        if result.returncode != expected_exit:
            raise AssertionError(
                f"{path}: expected exit {expected_exit}, got {result.returncode}\n"
                f"stdout={result.stdout}\nstderr={result.stderr}"
            )
        expected_message = (
            f"environment-value path is tracked: {path}"
            if expected_exit
            else "shared-context: PASS"
        )
        if expected_message not in result.stdout:
            raise AssertionError(
                f"{path}: expected message {expected_message!r}\n"
                f"stdout={result.stdout}\nstderr={result.stderr}"
            )


def main() -> int:
    validate_workflow_trigger_contract()

    blocked = (
        ".env",
        ".env.local",
        ".env.production",
        "web/.env.production",
        "admin/.env.local",
        "showcase/.env",
        "nested/path/.env.test",
        "web/.env.vps.example",
        "foo/.env.vps.example",
    )
    allowed = (
        ".env.vps.example",
        "foo.env",
        "config.env.production",
        ".envrc",
        ".environment",
        "ordinary-file.txt",
    )

    for path in blocked:
        validate(path, 1)
    for path in allowed:
        validate(path, 0)

    print("shared-context regression: PASS")
    print(f"- blocked cases: {len(blocked)}")
    print(f"- allowed cases: {len(allowed)}")
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except (AssertionError, OSError, subprocess.CalledProcessError) as error:
        print(f"shared-context regression: FAIL: {error}", file=sys.stderr)
        raise SystemExit(1) from error
