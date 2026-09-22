"""Future Claude Stop entry point for v1 terminal predicates."""

from __future__ import annotations

import json
import os
import sys

from .assurance_gate import require_reporting_only_terminal, require_success_terminal
from .controller import verify_live_binding, verify_live_package
from .errors import ControllerError
from .hook_entrypoint import STATE_PATH, _root
from .recovery import validate_canonical_inactive


def main() -> None:
    try:
        event = json.load(sys.stdin)
        if not isinstance(event, dict):
            event = {}
        root = _root(event.get("cwd") or os.getcwd())
        state = json.loads((root / STATE_PATH).read_text(encoding="utf-8"))
        if not isinstance(state, dict):
            raise ValueError("active authority must be an object")
        if state.get("lifecycle_status") == "INACTIVE":
            validate_canonical_inactive(state)
            verify_live_package(root)
            return
        verify_live_binding(root, state)
        terminal = state.get("terminal_authority")
        if isinstance(terminal, dict) and terminal.get("mode") == "reporting-only":
            require_reporting_only_terminal(state)
        else:
            require_success_terminal(state)
    except (OSError, ValueError, json.JSONDecodeError, ControllerError) as exc:
        print(json.dumps({"decision": "block", "reason": str(exc)}, ensure_ascii=False))


if __name__ == "__main__":
    main()
