#!/usr/bin/env python3
"""Claude Code PreToolUse guard for Work Block source-write authority."""
from __future__ import annotations

import datetime as dt
import fnmatch
import json
import os
from pathlib import Path, PurePosixPath
import re
import subprocess
import sys

GATE_PATH = Path(".agent/active-work-block.json")
DEFAULT_COORDINATION = [
    ".agent/active-work-block.json",
    ".agent/critic-gate.md",
    ".agent/verification-gate.md",
    "docs/plans/**",
    "docs/specs/**",
    "docs/tasklist/**",
    "docs/reports/**",
    "docs/architecture/drafts/**",
    "memory_bank/**",
]


def deny(reason: str) -> None:
    print(
        json.dumps(
            {
                "continue": False,
                "hookSpecificOutput": {
                    "hookEventName": "PreToolUse",
                    "permissionDecision": "deny",
                    "permissionDecisionReason": reason,
                },
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


def normalize(raw: object, root: Path) -> str:
    value = str(raw or "").strip().strip("\"'")
    if not value:
        deny("Edit/Write input is missing tool_input.file_path.")
    path = Path(value)
    if path.is_absolute():
        try:
            path = path.resolve().relative_to(root)
        except (ValueError, OSError) as exc:
            deny(f"Write path is outside repository: {value}")
            raise AssertionError from exc
    pure = PurePosixPath(path.as_posix())
    if ".." in pure.parts:
        deny(f"Write path escapes repository: {value}")
    normalized = pure.as_posix().lstrip("./")
    if not normalized or normalized == ".":
        deny(f"Cannot resolve repository path: {value}")
    return normalized


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
        deny(f"Cannot inspect git state: {exc}")
    return result.stdout.strip()


def matches(path: str, patterns: list[str]) -> bool:
    candidate = path.rstrip("/")
    for raw in patterns:
        pattern = str(raw).strip().replace("\\", "/").lstrip("./")
        if not pattern:
            continue
        if pattern.endswith("/**"):
            prefix = pattern[:-3].rstrip("/")
            if candidate == prefix or candidate.startswith(prefix + "/"):
                return True
        if candidate == pattern.rstrip("/") or fnmatch.fnmatchcase(candidate, pattern):
            return True
    return False


def coordination(gate: dict) -> list[str]:
    values = gate.get("coordination_write_set")
    if isinstance(values, list) and any(str(value).strip() for value in values):
        return [str(value) for value in values if str(value).strip()]
    return DEFAULT_COORDINATION


def expiry(value: object) -> dt.datetime:
    if not isinstance(value, str) or not value.strip():
        deny("write_gate.expires_at must be a non-empty timestamp.")
    try:
        parsed = dt.datetime.fromisoformat(value.strip().replace("Z", "+00:00"))
    except ValueError as exc:
        deny(f"Invalid write_gate.expires_at: {exc}")
        raise AssertionError from exc
    if parsed.tzinfo is None:
        deny("write_gate.expires_at must include a timezone.")
    return parsed.astimezone(dt.timezone.utc)


def validate_source_gate(gate: dict, root: Path) -> list[str]:
    if gate.get("schema_version") != 1:
        deny("Unsupported active Work Block schema_version.")
    if not str(gate.get("work_block_id") or "").strip():
        deny("Active Work Block requires work_block_id.")

    write_gate = gate.get("write_gate")
    if not isinstance(write_gate, dict) or write_gate.get("status") != "READY":
        deny("Source writes require write_gate.status=READY.")
    expires = expiry(write_gate.get("expires_at"))
    if dt.datetime.now(dt.timezone.utc) >= expires:
        deny(f"Write gate expired at {expires.isoformat()}.")

    specification = gate.get("specification")
    if not isinstance(specification, dict):
        deny("Active Work Block requires specification state.")
    if not str(specification.get("path") or "").strip():
        deny("Active Work Block requires specification.path.")
    if not str(specification.get("revision") or "").strip():
        deny("Active Work Block requires specification.revision.")

    base = str(gate.get("base_commit") or "").strip()
    if not re.fullmatch(r"[0-9a-fA-F]{7,40}", base):
        deny("Active Work Block requires a valid base_commit SHA.")
    head = git(root, "rev-parse", "HEAD")
    if not head.startswith(base) and not base.startswith(head):
        deny(f"Stale gate: HEAD {head[:12]} != base_commit {base[:12]}.")

    critic = gate.get("critic")
    if not isinstance(critic, dict):
        deny("Active Work Block requires critic state.")
    required = critic.get("required") is True
    status = str(critic.get("status") or "")
    verdict = str(critic.get("verdict") or "")
    if required:
        if status not in {"READY", "DEGRADED", "FALLBACK", "SKIPPED"}:
            deny("Required Critic state is unresolved.")
        if status in {"READY", "DEGRADED", "FALLBACK"} and verdict not in {
            "APPROVE",
            "SUPPLEMENT",
        }:
            deny("Required Critic verdict must be APPROVE or SUPPLEMENT.")
        if status == "SKIPPED" and not str(critic.get("skip_reason") or "").strip():
            deny("Skipped Critic requires skip_reason.")
    elif status == "SKIPPED" and not str(critic.get("skip_reason") or "").strip():
        deny("Skipped Critic requires skip_reason.")

    write_set = gate.get("write_set")
    if not isinstance(write_set, list) or not any(str(value).strip() for value in write_set):
        deny("Active Work Block requires a non-empty write_set.")
    return [str(value) for value in write_set if str(value).strip()]


def main() -> None:
    event = read_event()
    tool = str(event.get("tool_name") or "")
    if tool not in {"Edit", "MultiEdit", "Write"}:
        return

    root = root_from(event.get("cwd"))
    tool_input = event.get("tool_input")
    raw_path = tool_input.get("file_path") if isinstance(tool_input, dict) else None
    if not raw_path and isinstance(tool_input, dict):
        raw_path = tool_input.get("path")
    path = normalize(raw_path, root)

    # The machine gate itself must remain repairable even when its JSON is invalid.
    if path == GATE_PATH.as_posix():
        return

    gate = load_gate(root)
    coordination_paths = coordination(gate)
    if matches(path, coordination_paths):
        return

    write_set = validate_source_gate(gate, root)
    if not matches(path, write_set):
        deny(
            f"Source write outside approved scope: {path}. "
            "Update the Work Block write_set before retrying."
        )


if __name__ == "__main__":
    main()
