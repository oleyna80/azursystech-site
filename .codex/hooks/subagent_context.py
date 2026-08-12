#!/usr/bin/env python3
"""Provide bounded Work Block coordination context to project-scoped Codex agents."""

from __future__ import annotations

import json
import os
import subprocess
import sys
from pathlib import Path
from typing import Any

ROLE_AUTHORITY = {
    "architect": "Read-only for source/runtime; may write only an approved draft or report artifact.",
    "critic": "Read-only; may write only the approved Critic report artifact.",
    "coder": "May write only when the local source gate is READY and only inside the approved write-set.",
    "reviewer": "Read-only for source/runtime; may write only the approved Review report artifact.",
    "verifier": "Read-only for source/runtime; may write only approved verification evidence/report artifacts.",
}


def find_repo_root(cwd: Path) -> Path:
    try:
        result = subprocess.run(
            ["git", "-C", str(cwd), "rev-parse", "--show-toplevel"],
            check=True,
            capture_output=True,
            text=True,
            timeout=3,
        )
        return Path(result.stdout.strip()).resolve()
    except (OSError, subprocess.SubprocessError):
        current = cwd.resolve()
        for candidate in (current, *current.parents):
            if (candidate / ".git").exists() or (candidate / ".agent").exists():
                return candidate
        return current


def load_gate(root: Path) -> tuple[dict[str, Any] | None, str | None]:
    path = root / ".agent" / "active-work-block.json"
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except FileNotFoundError:
        return None, "machine-readable Work Block gate is missing"
    except (OSError, json.JSONDecodeError) as exc:
        return None, f"machine-readable Work Block gate is invalid: {exc}"
    if (
        not isinstance(data, dict)
        or data.get("schema_version") != 3
        or data.get("authority_mode") != "github_capability"
    ):
        return None, "machine-readable Work Block gate schema/authority mode is unsupported"
    return data, None


def compact_list(value: Any, limit: int = 20) -> str:
    if not isinstance(value, list):
        return "none"
    items = [str(item) for item in value if isinstance(item, str) and item.strip()]
    if not items:
        return "none"
    shown = items[:limit]
    suffix = f" (+{len(items) - limit} more)" if len(items) > limit else ""
    return ", ".join(shown) + suffix


def main() -> int:
    try:
        event = json.load(sys.stdin)
    except json.JSONDecodeError as exc:
        print(f"Invalid SubagentStart input: {exc}", file=sys.stderr)
        return 1
    if not isinstance(event, dict):
        print("Invalid SubagentStart input: expected object", file=sys.stderr)
        return 1

    cwd = Path(str(event.get("cwd") or os.getcwd()))
    root = find_repo_root(cwd)
    gate, error = load_gate(root)
    agent_type = str(event.get("agent_type") or "default")
    permission_mode = str(event.get("permission_mode") or "unknown")
    role = agent_type.lower().replace("-", "_")
    authority = ROLE_AUTHORITY.get(
        role,
        "Use the authority of the logical role assigned by the parent Work Block; tool access does not expand it.",
    )

    if gate is None:
        context = (
            f"Agent type: {agent_type}. Permission mode: {permission_mode}. "
            f"Authority: {authority} The {error}; source writes are not authorized by local Work Block scope. "
            "Read AGENTS.md and request a valid active Work Block before state-changing work."
        )
    else:
        spec = gate.get("specification") if isinstance(gate.get("specification"), dict) else {}
        write_gate = gate.get("write_gate") if isinstance(gate.get("write_gate"), dict) else {}
        critic = gate.get("critic") if isinstance(gate.get("critic"), dict) else {}
        context = "\n".join(
            [
                f"Logical agent type: {agent_type}",
                f"Permission mode: {permission_mode}",
                f"Authority: {authority}",
                f"Authority mode: {gate.get('authority_mode')}",
                f"Active Work Block: {gate.get('work_block_id') or 'UNSET'}",
                f"Governance profile: {gate.get('governance_profile') or 'UNSET'}",
                f"Specification: {spec.get('path') or 'UNSET'} @ {spec.get('revision') or 'UNSET'}",
                f"Planning baseline: {gate.get('base_commit') or 'UNSET'}",
                f"Local source write gate: {str(write_gate.get('status') or 'BLOCKED').upper()}",
                f"Critic: {str(critic.get('status') or 'PENDING').upper()} / {str(critic.get('verdict') or 'PENDING').upper()}",
                f"Approved write-set: {compact_list(gate.get('write_set'))}",
                f"Coordination paths: {compact_list(gate.get('coordination_write_set'))}",
                f"External Hard Stops: {compact_list(gate.get('external_hard_stops'))}",
                "This local context is a cooperative scope guard, not production/security authority. External GitHub/OS/credential boundaries remain authoritative.",
            ]
        )

    print(
        json.dumps(
            {
                "hookSpecificOutput": {
                    "hookEventName": "SubagentStart",
                    "additionalContext": context,
                }
            }
        )
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
