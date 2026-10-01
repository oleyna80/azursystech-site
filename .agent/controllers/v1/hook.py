"""Thin inert runtime hook wrapper over normalized events and shared policy."""

from __future__ import annotations

import json
import sys
from pathlib import Path

from . import adapters, policy, storage
from .errors import ControllerError, ValidationError
from .events import decision


def controller_root() -> Path:
    return Path(__file__).resolve().parents[3]


def evaluate_event(
    runtime: str,
    raw: dict,
    *,
    event_name: str = "PreToolUse",
    admission=None,
    repository_id: str | None = None,
    installed_root: Path | None = None,
) -> tuple[dict, dict | None]:
    installed = installed_root or controller_root()
    event = adapters.normalize(
        runtime,
        raw,
        controller_root=installed,
        event_name=event_name,
    )
    _, state = storage.load_for_worktree(Path(event.worktree_root))
    result = policy.evaluate(
        event,
        state,
        admission=admission,
        repository_id=repository_id,
    )
    return adapters.response(runtime, event_name, result, state=state), state


def _error_response(runtime: str, event_name: str, reason: str) -> dict:
    result = decision("DENY", "STATE_INVALID", reason)
    if event_name == "SubagentStart":
        return {
            "hookSpecificOutput": {
                "hookEventName": "SubagentStart",
                "additionalContext": (
                    "Controller context unavailable; no authority is granted. "
                    f"{result.code}: {result.reason}"
                ),
            }
        }
    return adapters.response(runtime, "PreToolUse", result)


def main(runtime: str, event_name: str | None = None) -> int:
    runtime = runtime.lower()
    selected = event_name or "PreToolUse"
    try:
        raw = json.load(sys.stdin)
        if not isinstance(raw, dict):
            raise ValidationError("runtime hook input must be an object")
        selected = str(raw.get("hook_event_name") or selected)
        response, _ = evaluate_event(runtime, raw, event_name=selected)
    except (ControllerError, ValidationError, OSError, ValueError, KeyError) as exc:
        response = _error_response(runtime, selected, str(exc))
    print(json.dumps(response, ensure_ascii=False, sort_keys=True))
    return 0


if __name__ == "__main__":
    raise SystemExit(
        main(
            sys.argv[1] if len(sys.argv) >= 2 else "",
            sys.argv[2] if len(sys.argv) >= 3 else None,
        )
    )
