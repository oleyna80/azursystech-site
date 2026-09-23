"""Sole controller-side hook entry point; future wrappers may call main(runtime)."""

from __future__ import annotations

import json
import subprocess
import sys
from pathlib import Path

from .adapters import decide, response
from .errors import ControllerError
from .policy import Decision
from .storage import read


def evaluate_event(runtime: str, raw: dict, state: dict, *, root: Path, branch: str) -> dict:
    decision = decide(runtime, raw, state, repository_root=str(root), branch=branch)
    return response(runtime, decision)


def main(runtime: str) -> int:
    try:
        if runtime not in {"codex", "claude"}:
            raise ValueError("unsupported runtime")
        raw = json.load(sys.stdin)
        if not isinstance(raw, dict):
            raise ValueError("event must be an object")
        root = Path(__file__).resolve().parents[3]
        cwd = Path(raw.get("cwd", "")).resolve(strict=True)
        if cwd != root:
            raise ValueError("event cwd differs from controller repository root")
        state = read(root / ".agent/active-work-block.json")
        branch = subprocess.run(
            ["git", "-C", str(root), "branch", "--show-current"],
            check=True, capture_output=True, text=True,
        ).stdout.strip()
        result = evaluate_event(runtime, raw, state, root=root, branch=branch)
    except (ControllerError, OSError, ValueError, subprocess.CalledProcessError) as exc:
        result = response(runtime, Decision(False, str(exc)))
    print(json.dumps(result, sort_keys=True))
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1] if len(sys.argv) == 2 else ""))
