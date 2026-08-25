#!/usr/bin/env python3
"""Validate the committed shared analysis surface using Git index state."""

from __future__ import annotations

import subprocess
import sys
from pathlib import Path

REQUIRED = {
    "docs/project-context.md",
    "memory_bank/orchestrator-log.md",
    "memory_bank/context.md",
    "memory_bank/progress.md",
    "memory_bank/decisions.md",
}
MEMORY_ALLOWLIST = {
    "memory_bank/orchestrator-log.md",
    "memory_bank/context.md",
    "memory_bank/progress.md",
    "memory_bank/decisions.md",
}
SAFE_ENV_TEMPLATES = {".env.vps.example"}


def git(repo: Path, *args: str) -> list[str]:
    result = subprocess.run(
        ["git", *args],
        cwd=repo,
        check=True,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,
    )
    return result.stdout.splitlines()


def main() -> int:
    try:
        repo = Path(git(Path.cwd(), "rev-parse", "--show-toplevel")[0]).resolve()
        tracked = set(git(repo, "ls-files"))
    except (IndexError, subprocess.CalledProcessError) as error:
        print(f"shared-context: cannot read Git index: {error}", file=sys.stderr)
        return 2

    errors: list[str] = []
    for path in sorted(REQUIRED):
        if path not in tracked:
            errors.append(f"required path is not tracked: {path}")
        elif not (repo / path).is_file():
            errors.append(f"tracked required path is unavailable: {path}")

    for path in sorted(tracked):
        if path.startswith("memory_bank/") and path not in MEMORY_ALLOWLIST:
            errors.append(f"non-allowlisted memory path is tracked: {path}")
        if path == ".codex/worktrees" or path.startswith(".codex/worktrees/"):
            errors.append(f"worktree path is tracked: {path}")
        if path == "private_evidence" or path.startswith("private_evidence/"):
            errors.append(f"private evidence path is tracked: {path}")
        if path == ".env" or path.startswith(".env."):
            if path not in SAFE_ENV_TEMPLATES:
                errors.append(f"environment-value path is tracked: {path}")

    if errors:
        print("shared-context: FAIL")
        for error in errors:
            print(f"- {error}")
        return 1

    print("shared-context: PASS")
    print(f"- tracked required files: {len(REQUIRED)}")
    print("- memory_bank allowlist: exact")
    print("- forbidden tracked surfaces: none")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
