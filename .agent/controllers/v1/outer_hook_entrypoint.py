"""Future shared outer hard-stop hook; it can only add a denial."""

from __future__ import annotations

import json
import sys
from pathlib import Path

from .hard_stop import evaluate_outer
from .package import controller_root


def _require_owner_cwd(cwd: object) -> Path:
    if not isinstance(cwd, str) or not cwd:
        raise ValueError("hook event must supply a repository cwd")
    owner = controller_root()
    try:
        Path(cwd).resolve().relative_to(owner)
    except ValueError as exc:
        raise ValueError("event repository differs from the executing controller package root") from exc
    return owner


def main() -> None:
    try:
        event = json.load(sys.stdin)
        if not isinstance(event, dict):
            raise ValueError("hook event must be an object")
        _require_owner_cwd(event.get("cwd"))
        payload = event.get("tool_input") or event.get("input") or {}
        if not isinstance(payload, dict):
            raise ValueError("hook payload must be an object")
        decision = evaluate_outer(payload)
    except (ValueError, json.JSONDecodeError) as exc:
        decision_reason = f"outer v1 hard-stop failed closed: {exc}"
    else:
        if decision.allowed:
            return
        decision_reason = f"{decision.code}: {decision.reason}"
    print(
        json.dumps(
            {
                "hookSpecificOutput": {
                    "hookEventName": "PreToolUse",
                    "permissionDecision": "deny",
                    "permissionDecisionReason": decision_reason,
                },
                "continue": False,
            },
            ensure_ascii=False,
        )
    )


if __name__ == "__main__":
    main()
