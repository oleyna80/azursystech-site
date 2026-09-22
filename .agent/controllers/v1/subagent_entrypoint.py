"""Future bounded SubagentStart context for v1-bound Work Blocks."""

from __future__ import annotations

import json
import os
import sys
from pathlib import Path

from .controller import verify_live_binding
from .errors import ControllerError
from .hook_entrypoint import STATE_PATH, _root

ROLE_AUTHORITY = {
    "critic": "read-only; only the approved Critic report may be written",
    "reviewer": "read-only; only the approved Reviewer report may be written",
    "verifier": "read-only; only approved verification evidence may be written",
    "coder": "writes require active Execute, READY gate, and admitted write-set",
    "scoped_coder": "writes require active Execute, READY gate, and admitted write-set",
}


def _compact(value: object) -> str:
    if not isinstance(value, list):
        return "none"
    return ", ".join(item for item in value if isinstance(item, str) and item) or "none"


def main() -> int:
    try:
        event = json.load(sys.stdin)
        if not isinstance(event, dict):
            raise ValueError("SubagentStart event must be an object")
        root = _root(event.get("cwd") or os.getcwd())
        state = json.loads((root / STATE_PATH).read_text(encoding="utf-8"))
        if not isinstance(state, dict) or state.get("schema_version") != 4:
            raise ValueError("v1 active authority is missing or unsupported")
        binding = state.get("controller_binding")
        if not isinstance(binding, dict) or binding.get("generation") != "v1":
            raise ValueError("Work Block is not bound to controller generation v1")
        verify_live_binding(root, state)
        role = str(event.get("agent_type") or "default").lower().replace("-", "_")
        execution = event.get("execution_id")
        context = event.get("context_id")
        if not isinstance(execution, str) or not execution:
            raise ValueError("native runtime did not supply execution_id")
        if not isinstance(context, str) or not context:
            raise ValueError("native runtime did not supply context_id")
        authority = ROLE_AUTHORITY.get(role, "tool access does not expand assigned role authority")
        lines = [
            f"Logical role: {role}",
            f"Authority: {authority}",
            f"Work Block: {state.get('work_block_id')}",
            f"Controller generation: {binding.get('generation')}",
            f"Controller package identity: {binding.get('package_identity')}",
            f"Define identity: {(state.get('define') or {}).get('identity') if isinstance(state.get('define'), dict) else 'UNSET'}",
            f"Lifecycle: {state.get('lifecycle_status')} / {state.get('lifecycle_phase')}",
            f"Write gate: {(state.get('write_gate') or {}).get('status') if isinstance(state.get('write_gate'), dict) else 'BLOCKED'}",
            f"Write-set: {_compact(state.get('write_set'))}",
            f"Native execution ID: {execution}",
            f"Native context ID: {context}",
            f"Repository root: {root}",
        ]
    except (OSError, ValueError, json.JSONDecodeError, ControllerError) as exc:
        lines = [f"v1 authority context unavailable: {exc}", "Source writes are not authorized."]
    print(
        json.dumps(
            {
                "hookSpecificOutput": {
                    "hookEventName": "SubagentStart",
                    "additionalContext": "\n".join(lines),
                }
            },
            ensure_ascii=False,
        )
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
