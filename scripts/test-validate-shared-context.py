#!/usr/bin/env python3
"""Regression tests for the Git-index shared-context validator."""

from __future__ import annotations

import subprocess
import sys
import tempfile
from pathlib import Path


VALIDATOR = Path(__file__).with_name("validate-shared-context.py").resolve()
REQUIRED = (
    "docs/project-context.md",
    "memory_bank/orchestrator-log.md",
    "memory_bank/context.md",
    "memory_bank/progress.md",
    "memory_bank/decisions.md",
)


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
