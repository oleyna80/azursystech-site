"""Thin future Codex/Claude hook entry point for the canonical evaluator."""

from __future__ import annotations

import json
import os
import sys
from pathlib import Path
from typing import NoReturn

from .controller import verify_live_binding, verify_live_package
from .errors import ControllerError
from .package import controller_root
from .recovery import validate_canonical_inactive
from .runtime import decide

STATE_PATH = Path(".agent/active-work-block.json")


def _root(cwd: object) -> Path:
    start = Path(str(cwd or os.getcwd())).resolve()
    for candidate in (start, *start.parents):
        authority = candidate / STATE_PATH
        if authority.is_file():
            if authority.is_symlink():
                raise ValueError("active Work Block authority must not be a symlink")
            owner = controller_root()
            if candidate != owner:
                raise ValueError("event repository differs from the executing controller package root")
            return owner
    raise ValueError(f"cannot locate {STATE_PATH.as_posix()}")


def _deny(runtime: str, reason: str) -> NoReturn:
    output: dict[str, object] = {
        "hookSpecificOutput": {
            "hookEventName": "PreToolUse",
            "permissionDecision": "deny",
            "permissionDecisionReason": reason,
        }
    }
    if runtime == "claude":
        output["continue"] = False
    print(json.dumps(output, ensure_ascii=False))
    raise SystemExit(0)


def main(runtime: str) -> None:
    try:
        event = json.load(sys.stdin)
        if not isinstance(event, dict):
            raise ValueError("hook event must be an object")
        root = _root(event.get("cwd"))
        state = json.loads((root / STATE_PATH).read_text(encoding="utf-8"))
        if not isinstance(state, dict):
            raise ValueError("active Work Block state must be an object")
        if state.get("lifecycle_status") == "INACTIVE":
            validate_canonical_inactive(state)
            verify_live_package(root)
        else:
            verify_live_binding(root, state)
        decision = decide(runtime, event, state, repository_root=str(root))
    except (OSError, ValueError, json.JSONDecodeError, ControllerError) as exc:
        _deny(runtime, f"canonical v1 controller failed closed: {exc}")
    if not decision.allowed:
        _deny(runtime, f"{decision.code}: {decision.reason}")


if __name__ == "__main__":
    selected = os.environ.get("AZURSYSTECH_RUNTIME", "")
    if selected not in {"codex", "claude"}:
        _deny(selected, "canonical v1 hook requires an explicit supported runtime")
    main(selected)
