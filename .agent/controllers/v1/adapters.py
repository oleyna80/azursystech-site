"""Codex and Claude event normalization; all decisions come from policy.evaluate."""

from __future__ import annotations

import re
import shlex
from collections.abc import Mapping

from .policy import Decision, Event, evaluate

PATCH_PATH = re.compile(r"^\*\*\*\s+(?:Add|Update|Delete)\s+File:\s+(.+?)\s*$", re.M)
PATCH_MOVE = re.compile(r"^\*\*\*\s+Move to:\s+(.+?)\s*$", re.M)
AMBIGUOUS = re.compile(r"[;&|<>\n\r\x60]|\$\(|\$\{|\*|\?")
READ_SHELL = {"pwd", "ls", "cat", "head", "tail", "stat", "git status", "git diff", "git rev-parse"}


def normalize(runtime: str, raw: Mapping[str, object], *, repository_root: str, branch: str) -> Event:
    if runtime not in {"codex", "claude"} or not isinstance(raw, Mapping):
        return Event(runtime, "unknown", repository_root, branch)
    tool = raw.get("tool_name") or raw.get("tool")
    payload = raw.get("tool_input") or raw.get("input") or raw.get("parameters") or {}
    if not isinstance(tool, str) or not isinstance(payload, Mapping):
        return Event(runtime, "unknown", repository_root, branch)
    name = tool.lower()
    if name in {"read", "read_file"}:
        return Event(runtime, "read", repository_root, branch)
    if name in {"write", "edit", "write_file"}:
        path = payload.get("file_path") or payload.get("path")
        return Event(runtime, "write", repository_root, branch, (path,) if isinstance(path, str) else ())
    if name in {"apply_patch", "applypatch"}:
        patch = payload.get("patch") or payload.get("input")
        if not isinstance(patch, str):
            return Event(runtime, "unknown", repository_root, branch)
        paths = PATCH_PATH.findall(patch) + PATCH_MOVE.findall(patch)
        return Event(runtime, "write", repository_root, branch, tuple(paths))
    if name not in {"bash", "shell", "exec_command"}:
        return Event(runtime, "unknown", repository_root, branch)
    command = payload.get("command") or payload.get("cmd")
    if not isinstance(command, str) or AMBIGUOUS.search(command):
        return Event(runtime, "unknown", repository_root, branch)
    try:
        tokens = shlex.split(command)
    except ValueError:
        return Event(runtime, "unknown", repository_root, branch)
    if not tokens:
        return Event(runtime, "unknown", repository_root, branch)
    if tokens[:2] == ["git", "push"]:
        # Shell text cannot prove candidate or branch protection facts. A future
        # trusted publication preflight must provide those to policy separately.
        return Event(runtime, "push", repository_root, branch, metadata={"command": command})
    if command in READ_SHELL or tokens[0] in {"pwd", "ls", "cat", "head", "tail", "stat"}:
        return Event(runtime, "read", repository_root, branch)
    if tokens[:3] == ["python", "-m", "v1.cli"] or tokens[:3] == ["python3", "-m", "v1.cli"]:
        return Event(runtime, "lifecycle", repository_root, branch, metadata={"command": command})
    if tokens[0] in {"rm", "rmdir"}:
        return Event(runtime, "unknown", repository_root, branch, effect="destructive")
    if tokens[0] in {"ssh", "scp", "terraform", "kubectl", "systemctl"}:
        return Event(runtime, "unknown", repository_root, branch, effect="infrastructure")
    return Event(runtime, "unknown", repository_root, branch, effect="unknown_effect")


def decide(runtime: str, raw: Mapping[str, object], state: dict, *, repository_root: str, branch: str) -> Decision:
    return evaluate(normalize(runtime, raw, repository_root=repository_root, branch=branch), state)


def response(runtime: str, decision: Decision) -> dict:
    if runtime == "claude":
        return {"hookSpecificOutput": {
            "hookEventName": "PreToolUse",
            "permissionDecision": "allow" if decision.allowed else "deny",
            "permissionDecisionReason": decision.reason,
        }}
    return {"decision": decision.code, "reason": decision.reason}
