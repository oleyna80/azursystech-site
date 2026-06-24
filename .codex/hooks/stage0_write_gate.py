#!/usr/bin/env python3
"""Block write-capable Codex tool calls until Stage 0 is visibly ready.

Matchers: Bash, apply_patch, Edit, Write (per config.toml.template hook example).

Limitations: this hook enforces only a declaration/process gate (existence,
READY status, and expiration of .codex/write-gate.md). It does not validate
semantic correctness, sandbox safety, secret hygiene, Critic quality, or
write-set content. It is not a security boundary.
"""

from __future__ import annotations

import datetime as dt
import json
import re
import subprocess
import sys
from pathlib import Path
from typing import Any


GATE_PATH = Path(".codex/write-gate.md")
READY_RE = re.compile(r"^Status:\s*READY\s*$", re.IGNORECASE | re.MULTILINE)
EXPIRES_RE = re.compile(r"^Expires:\s*(\d{4}-\d{2}-\d{2})\s*$", re.MULTILINE)
PATCH_FILE_RE = re.compile(r"^\*\*\* (?:Add|Update|Delete) File: (.+)$", re.MULTILINE)

WRITE_SHELL_RE = re.compile(
    r"(^|\s)(apply_patch|tee|rm|mv|cp|mkdir|touch|chmod|chown|git\s+add|"
    r"git\s+commit|git\s+push|git\s+reset|git\s+clean|npm\s+install|"
    r"pnpm\s+add|yarn\s+add|sed\s+-i|perl\s+-pi)(\s|$)|[<>]",
    re.IGNORECASE,
)


def emit_allow(context: str | None = None) -> None:
    if context:
        print(
            json.dumps(
                {
                    "hookSpecificOutput": {
                        "hookEventName": "PreToolUse",
                        "additionalContext": context,
                    }
                }
            )
        )
    sys.exit(0)


def emit_deny(reason: str) -> None:
    print(
        json.dumps(
            {
                "hookSpecificOutput": {
                    "hookEventName": "PreToolUse",
                    "permissionDecision": "deny",
                    "permissionDecisionReason": reason,
                }
            }
        )
    )
    sys.exit(0)


def repo_root() -> Path:
    try:
        output = subprocess.check_output(
            ["git", "rev-parse", "--show-toplevel"],
            text=True,
            stderr=subprocess.DEVNULL,
        ).strip()
    except Exception:
        return Path.cwd()
    return Path(output)


def read_payload() -> dict[str, Any]:
    try:
        return json.load(sys.stdin)
    except Exception:
        return {}


def tool_command(payload: dict[str, Any]) -> tuple[str, str]:
    tool_name = str(payload.get("tool_name") or payload.get("toolName") or "")
    tool_input = payload.get("tool_input") or payload.get("toolInput") or {}
    command = ""
    if isinstance(tool_input, dict):
        command = str(tool_input.get("command") or "")
    return tool_name, command


def edit_write_path(payload: dict[str, Any]) -> str:
    """Extract file_path from Edit/Write payload."""
    tool_input = payload.get("tool_input") or payload.get("toolInput") or {}
    if isinstance(tool_input, dict):
        return str(tool_input.get("file_path") or tool_input.get("filePath") or "")
    return ""


def patch_paths(command: str) -> list[str]:
    return [match.strip() for match in PATCH_FILE_RE.findall(command)]


def only_gate_file(paths: list[str]) -> bool:
    normalized = {Path(path).as_posix().lstrip("./") for path in paths}
    gate = GATE_PATH.as_posix().lstrip("./")
    return bool(normalized) and normalized <= {gate}


def gate_ready(root: Path) -> tuple[bool, str]:
    gate_file = root / GATE_PATH
    if not gate_file.exists():
        return False, f"{GATE_PATH} is missing"

    text = gate_file.read_text(encoding="utf-8")
    if not READY_RE.search(text):
        return False, f"{GATE_PATH} does not contain 'Status: READY'"

    expires = EXPIRES_RE.search(text)
    if not expires:
        return False, f"{GATE_PATH} does not contain Expires: YYYY-MM-DD"

    try:
        expires_on = dt.date.fromisoformat(expires.group(1))
    except ValueError:
        return False, f"{GATE_PATH} has an invalid Expires date"

    if expires_on < dt.date.today():
        return False, f"{GATE_PATH} expired on {expires_on.isoformat()}"

    return True, "ready"


def main() -> None:
    payload = read_payload()
    tool_name, command = tool_command(payload)
    root = repo_root()

    if tool_name in ("Edit", "Write"):
        file_path = edit_write_path(payload)
        if file_path and only_gate_file([file_path]):
            emit_allow("Updating .codex/write-gate.md is allowed so Stage 0 can be refreshed.")

        ready, reason = gate_ready(root)
        if ready:
            emit_allow("Stage 0 write gate is READY.")
        emit_deny(
            f"Stage 0 write gate blocked {tool_name}: {reason}."
            " Refresh .codex/write-gate.md first."
        )

    if tool_name == "apply_patch":
        paths = patch_paths(command)
        if only_gate_file(paths):
            emit_allow("Updating .codex/write-gate.md is allowed so Stage 0 can be refreshed.")

        ready, reason = gate_ready(root)
        if ready:
            emit_allow("Stage 0 write gate is READY.")
        emit_deny(f"Stage 0 write gate blocked apply_patch: {reason}. Refresh .codex/write-gate.md first.")

    if tool_name == "Bash" and WRITE_SHELL_RE.search(command):
        ready, reason = gate_ready(root)
        if ready:
            emit_allow("Stage 0 write gate is READY.")
        emit_deny(f"Stage 0 write gate blocked write-like shell command: {reason}.")

    emit_allow()


if __name__ == "__main__":
    main()
