#!/usr/bin/env python3
"""Provider-neutral PreToolUse guard for consequential Bash operations.

The policy reads `.agent/active-work-block.json`. It is a project guardrail, not
an operating-system security boundary.
"""
from __future__ import annotations

import datetime as dt
import json
import os
from pathlib import Path
import re
import shlex
import subprocess
import sys

GATE_PATH = Path(".agent/active-work-block.json")

SIMPLE_PATTERNS = [
    (re.compile(r"\bgit\s+commit\b", re.I), "git_commit", "git commit"),
    (re.compile(r"\bgit\s+push\b", re.I), "git_push", "git push"),
    (
        re.compile(
            r"\b(git\s+reset\s+--hard|git\s+clean|terraform\s+destroy|"
            r"kubectl\s+delete|DROP\s+(DATABASE|TABLE))\b",
            re.I,
        ),
        "destructive",
        "destructive operation",
    ),
    (
        re.compile(
            r"\b(docker\s+push|kubectl\s+(apply|patch|replace|scale|rollout|set)|"
            r"terraform\s+apply|systemctl\s+(restart|stop|start)|"
            r"service\s+\S+\s+(restart|stop|start)|scp|rsync[^\n]*:)\b",
            re.I,
        ),
        "live_infra",
        "live infrastructure operation",
    ),
    (
        re.compile(
            r"\b(psql|mysql|mongosh|redis-cli)\b[^\n]*\b"
            r"(DELETE|UPDATE|INSERT|ALTER|DROP|TRUNCATE|CREATE)\b",
            re.I,
        ),
        "live_data",
        "direct data mutation",
    ),
    (
        re.compile(
            r"(^|[\s/])(\.env([.][\w.-]+)?|credentials|secrets)([\s/]|$)|"
            r"\b(rotate|revoke)\b[^\n]*(token|secret|key|credential)",
            re.I,
        ),
        "credentials",
        "credential or secret access/mutation",
    ),
    (
        re.compile(
            r"\b(sendmail|mailx|twilio|sendgrid|msmtp|ssmtp)\b|"
            r"\bcurl\b[^\n]*(messages|email|sms|notifications|whatsapp)[^\n]*"
            r"(-X\s*(POST|PUT|PATCH)|--data)",
            re.I,
        ),
        "client_communications",
        "client-facing communication",
    ),
]

RUNTIME_COMMANDS = {
    "codex": "codex-cli",
    "opencode": "opencode-cli",
    "claude": "claude-code-cli",
}


def deny(reason: str) -> None:
    print(
        json.dumps(
            {
                "hookSpecificOutput": {
                    "hookEventName": "PreToolUse",
                    "permissionDecision": "deny",
                    "permissionDecisionReason": reason,
                }
            },
            ensure_ascii=False,
        )
    )
    raise SystemExit(0)


def read_event() -> dict:
    try:
        event = json.load(sys.stdin)
    except (json.JSONDecodeError, OSError) as exc:
        deny(f"Cannot parse PreToolUse input: {exc}")
    if not isinstance(event, dict):
        deny("PreToolUse input must be a JSON object.")
    return event


def root_from(cwd: object) -> Path:
    start = Path(str(cwd or os.getcwd())).resolve()
    for root in (start, *start.parents):
        if (root / GATE_PATH).is_file():
            return root
    deny(f"Cannot find {GATE_PATH.as_posix()} from {start}.")


def load_gate(root: Path) -> dict:
    try:
        gate = json.loads((root / GATE_PATH).read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        deny(f"Invalid {GATE_PATH.as_posix()}: {exc}")
    if not isinstance(gate, dict):
        deny("Active Work Block gate must be a JSON object.")
    return gate


def git(root: Path, *args: str) -> str:
    try:
        result = subprocess.run(
            ["git", *args],
            cwd=root,
            check=True,
            capture_output=True,
            text=True,
            timeout=3,
        )
    except (OSError, subprocess.SubprocessError) as exc:
        deny(f"Cannot inspect git state for Hard Stop policy: {exc}")
    return result.stdout.strip()


def approval_window_ready(gate: dict) -> None:
    if gate.get("schema_version") != 2:
        deny("Hard Stop approval requires active-work-block schema_version=2.")
    if not str(gate.get("work_block_id") or "").strip():
        deny("Hard Stop approval requires a non-empty work_block_id.")

    write_gate = gate.get("write_gate")
    if not isinstance(write_gate, dict) or write_gate.get("status") != "READY":
        deny("Hard Stop approval requires write_gate.status=READY.")

    raw_expiry = write_gate.get("expires_at")
    if not isinstance(raw_expiry, str) or not raw_expiry.strip():
        deny("Hard Stop approval requires a timezone-aware write_gate.expires_at.")
    try:
        expiry = dt.datetime.fromisoformat(raw_expiry.strip().replace("Z", "+00:00"))
    except ValueError as exc:
        deny(f"Invalid write_gate.expires_at for Hard Stop approval: {exc}")
    if expiry.tzinfo is None:
        deny("Hard Stop approval expiry must include a timezone.")
    if dt.datetime.now(dt.timezone.utc) >= expiry.astimezone(dt.timezone.utc):
        deny(f"Hard Stop approval window expired at {expiry.isoformat()}.")


def require_fresh_base(gate: dict, root: Path) -> None:
    base = str(gate.get("base_commit") or "").strip()
    if not re.fullmatch(r"[0-9a-fA-F]{7,40}", base):
        deny("Approval requires a valid base_commit SHA.")
    head = git(root, "rev-parse", "HEAD")
    if not head.startswith(base) and not base.startswith(head):
        deny(
            f"Stale approval: HEAD {head[:12]} != base_commit {base[:12]}. "
            "Renew the Work Block gate before the operation."
        )


def approved(gate: dict, key: str) -> bool:
    approvals = gate.get("hard_stop_approvals")
    return isinstance(approvals, dict) and approvals.get(key) is True


def integration_state(gate: dict, integration_id: str) -> tuple[bool, bool]:
    integrations = gate.get("integrations")
    if not isinstance(integrations, dict):
        return False, False
    allowed = integrations.get("approved")
    records = integrations.get("admission_records")
    approved_id = isinstance(allowed, list) and integration_id in allowed
    has_record = isinstance(records, list) and any(
        isinstance(value, str) and value.strip() for value in records
    )
    return approved_id, has_record


def current_branch(root: Path) -> str:
    return git(root, "branch", "--show-current")


def recursive_rm(command: str) -> bool:
    """Detect recursive rm flags, including common sudo/command/env prefixes."""
    prefix = r"(?:(?:sudo|command|env)\s+)?"
    for match in re.finditer(
        rf"(?:^|[;&|\n]\s*){prefix}rm\s+([^;&|\n]+)",
        command,
        re.I,
    ):
        try:
            tokens = shlex.split(match.group(1), posix=True)
        except ValueError:
            return True
        for token in tokens:
            if token == "--":
                break
            if token == "--recursive":
                return True
            if token.startswith("-") and not token.startswith("--") and "r" in token[1:].lower():
                return True
    return False


def require_approval(gate: dict, key: str, label: str, root: Path) -> None:
    approval_window_ready(gate)
    if key in {"git_commit", "git_push"}:
        require_fresh_base(gate, root)
    if not approved(gate, key):
        deny(
            f"{label} requires hard_stop_approvals.{key}=true and "
            "recorded Owner approval."
        )


def require_integration(gate: dict, integration_id: str, root: Path) -> None:
    approval_window_ready(gate)
    require_fresh_base(gate, root)
    approved_id, has_record = integration_state(gate, integration_id)
    if not approved_id:
        deny(
            "External runtime invocation requires integrations.approved to "
            f"contain {integration_id!r}."
        )
    if not has_record:
        deny(
            "External runtime invocation requires at least one concrete "
            "integrations.admission_records evidence path."
        )


def runtime_invocations(command: str) -> set[str]:
    found: set[str] = set()
    prefix = r"(?:(?:sudo|command|env)\s+)?"
    for runtime, integration_id in RUNTIME_COMMANDS.items():
        if re.search(
            rf"(?:^|[;&|\n]\s*){prefix}{re.escape(runtime)}(?:\s|$)",
            command,
            re.I,
        ):
            found.add(integration_id)
    return found


def push_segments(command: str) -> list[str]:
    return [
        match.group(1).strip()
        for match in re.finditer(
            r"(?:^|[;&|\n]\s*)git\s+push\b([^;&|\n]*)",
            command,
            re.I,
        )
    ]


def pushes_default_branch(command: str, root: Path) -> bool:
    branch = current_branch(root)
    for segment in push_segments(command):
        if re.search(
            r"(?:^|\s)[+:]?(?:HEAD:)?(?:refs/heads/)?(?:main|master)(?:\s|$)",
            segment,
            re.I,
        ):
            return True
        if branch in {"main", "master"} and re.search(r"(?:^|\s)HEAD(?:\s|$)", segment):
            return True

        try:
            tokens = shlex.split(segment, posix=True)
        except ValueError:
            return branch in {"main", "master"}

        positional = [token for token in tokens if not token.startswith("-")]
        if branch in {"main", "master"} and len(positional) <= 1:
            return True
    return False


def check_command(command: str, gate: dict, root: Path) -> None:
    for integration_id in runtime_invocations(command):
        require_integration(gate, integration_id, root)

    if recursive_rm(command):
        require_approval(gate, "destructive", "destructive recursive rm", root)

    found: set[str] = set()
    for pattern, key, label in SIMPLE_PATTERNS:
        if pattern.search(command):
            found.add(key)
            require_approval(gate, key, label, root)

    if "git_push" in found and pushes_default_branch(command, root):
        require_approval(
            gate,
            "default_branch_push",
            "default-branch push",
            root,
        )


def main() -> None:
    event = read_event()
    if str(event.get("tool_name") or "") != "Bash":
        return
    value = event.get("tool_input")
    command = value.get("command") if isinstance(value, dict) else None
    if not isinstance(command, str):
        deny("Bash input is missing tool_input.command.")
    root = root_from(event.get("cwd"))
    gate = load_gate(root)
    check_command(command, gate, root)


if __name__ == "__main__":
    main()
