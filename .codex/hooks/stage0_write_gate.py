#!/usr/bin/env python3
"""Block write-capable Codex tool calls until Stage 0 is visibly ready."""

from __future__ import annotations

import datetime as dt
import json
import re
import subprocess
import sys
from pathlib import Path
from typing import Any


GATE_PATH = Path(".codex/write-gate.md")
MAX_READY_DAYS = 14
READY_RE = re.compile(r"^Status:\s*READY\s*$", re.IGNORECASE | re.MULTILINE)
EXPIRES_RE = re.compile(r"^Expires:\s*(\d{4}-\d{2}-\d{2})\s*$", re.MULTILINE)
WORK_BLOCK_RE = re.compile(r"^Work Block:\s*(.+?)\s*$", re.IGNORECASE | re.MULTILINE)
SCOPE_RE = re.compile(r"^Approved Scope:\s*(.+?)\s*$", re.IGNORECASE | re.MULTILINE)
CRITIC_RE = re.compile(r"^Codex Critic:\s*([A-Z_-]+)\s*$", re.IGNORECASE | re.MULTILINE)
CRITIC_VERDICT_RE = re.compile(
    r"^Critic Verdict:\s*(APPROVE|SUPPLEMENT|RECONSIDER)\s*$",
    re.IGNORECASE | re.MULTILINE,
)
CRITIC_SKIP_RE = re.compile(r"^Critic Skip Reason:\s*(.+?)\s*$", re.IGNORECASE | re.MULTILINE)
ORCH_RESPONSE_RE = re.compile(r"^Orchestrator Response:\s*(.+?)\s*$", re.IGNORECASE | re.MULTILINE)
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


def patch_paths(command: str) -> list[str]:
    return [match.strip() for match in PATCH_FILE_RE.findall(command)]


def only_gate_file(paths: list[str]) -> bool:
    normalized = {Path(path).as_posix().lstrip("./") for path in paths}
    return bool(normalized) and normalized <= {GATE_PATH.as_posix()}


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

    today = dt.date.today()
    if expires_on < today:
        return False, f"{GATE_PATH} expired on {expires_on.isoformat()}"

    if (expires_on - today).days > MAX_READY_DAYS:
        return False, f"{GATE_PATH} expiry is too far in the future; use <= {MAX_READY_DAYS} days"

    work_block = WORK_BLOCK_RE.search(text)
    work_block_text = work_block.group(1).strip() if work_block else ""
    if work_block_text.upper() in {"", "N/A", "TBD", "-"} or work_block_text.startswith("["):
        return False, f"{GATE_PATH} needs a concrete Work Block"

    scope = SCOPE_RE.search(text)
    scope_text = scope.group(1).strip() if scope else ""
    if scope_text.upper() in {"", "N/A", "TBD", "-"} or scope_text.startswith("["):
        return False, f"{GATE_PATH} needs a concrete Approved Scope"

    critic = CRITIC_RE.search(text)
    if not critic:
        return False, f"{GATE_PATH} does not contain Codex Critic status"

    critic_status = critic.group(1).upper()
    if critic_status == "REQUIRED":
        return False, f"{GATE_PATH} still has Codex Critic: REQUIRED"

    verdict = CRITIC_VERDICT_RE.search(text)
    if critic_status in {"READY", "FALLBACK"} and not verdict:
        return False, f"{GATE_PATH} needs Critic Verdict: APPROVE, SUPPLEMENT, or RECONSIDER"

    if verdict and verdict.group(1).upper() in {"SUPPLEMENT", "RECONSIDER"}:
        response = ORCH_RESPONSE_RE.search(text)
        response_text = response.group(1).strip() if response else ""
        if response_text.upper() in {"", "N/A", "TBD", "-"}:
            return False, f"{GATE_PATH} needs Orchestrator Response for {verdict.group(1).upper()}"

    if critic_status == "SKIPPED":
        skip = CRITIC_SKIP_RE.search(text)
        skip_reason = skip.group(1).strip() if skip else ""
        if skip_reason.upper() in {"", "N/A", "TBD", "-"}:
            return False, f"{GATE_PATH} needs a concrete Critic Skip Reason"

    if critic_status not in {"READY", "FALLBACK", "SKIPPED"}:
        return False, f"{GATE_PATH} has invalid Codex Critic status: {critic_status}"

    return True, "ready"


def main() -> None:
    payload = read_payload()
    tool_name, command = tool_command(payload)
    root = repo_root()

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
