#!/usr/bin/env python3
"""Codex PreToolUse guard for Work Block write scope.

This is a cooperative project-local guardrail, not a security boundary. External
GitHub/OS/credential controls own consequential authority.
"""
from __future__ import annotations

import fnmatch
import json
import os
from pathlib import Path, PurePosixPath
import re
import shlex
import subprocess
import sys

GATE_PATH = Path(".agent/active-work-block.json")
DEFAULT_COORDINATION = [
    ".agent/active-work-block.json",
    ".agent/critic-gate.md",
    ".agent/verification-gate.md",
    ".codex/write-gate.md",
    "docs/plans/**",
    "docs/specs/**",
    "docs/tasklist/**",
    "docs/reports/**",
    "docs/architecture/drafts/**",
    "memory_bank/**",
]
PATCH_PATHS = re.compile(
    r"^\*\*\*\s+(?:Update|Add|Delete)\s+File:\s+(.+?)\s*$", re.M
)
PATCH_MOVES = re.compile(r"^\*\*\*\s+Move to:\s+(.+?)\s*$", re.M)
DIFF_PATHS = re.compile(r"^\+\+\+\s+(?:b/)?(.+?)\s*$", re.M)
REDIRECTS = re.compile(r"(?<![<])(?:^|[^>])>{1,2}\s*([^\s;&|]+)")
MUTATING = re.compile(
    r"(^|[;&|]\s*)(rm|rmdir|mv|cp|install|touch|mkdir|ln|chmod|chown|"
    r"truncate|sed\s+-[^;\n]*i|perl\s+-[^;\n]*i|tee|"
    r"git\s+(add|commit|push|reset|clean|checkout|restore|mv|rm)|"
    r"npm\s+(install|uninstall|update|ci)|pnpm\s+(install|add|remove|update)|"
    r"yarn\s+(install|add|remove|upgrade)|pip3?\s+install|"
    r"poetry\s+(add|remove|install|update)|cargo\s+(add|remove|install|update)|"
    r"go\s+get|docker\s+(build|push|compose\s+(up|down))|"
    r"kubectl\s+(apply|delete|patch|replace|scale|rollout|set)|"
    r"terraform\s+(apply|destroy|import)|systemctl\s+(restart|stop|start|enable|disable)|"
    r"service\s+\S+\s+(restart|stop|start))(\s|$)",
    re.I,
)


class Denied(Exception):
    pass


def block(reason: str) -> None:
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
        block(f"Cannot parse PreToolUse input: {exc}")
    if not isinstance(event, dict):
        block("PreToolUse input must be a JSON object.")
    return event


def root_from(cwd: object) -> Path:
    start = Path(str(cwd or os.getcwd())).resolve()
    for root in (start, *start.parents):
        if (root / GATE_PATH).is_file():
            return root
    block(f"Cannot find {GATE_PATH.as_posix()} from {start}.")


def load_gate(root: Path) -> dict:
    try:
        gate = json.loads((root / GATE_PATH).read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        block(f"Invalid {GATE_PATH.as_posix()}: {exc}")
    if not isinstance(gate, dict):
        block("Active Work Block gate must be a JSON object.")
    return gate


def git(root: Path, *args: str) -> str:
    try:
        result = subprocess.run(
            ["git", *args], cwd=root, check=True, capture_output=True,
            text=True, timeout=3
        )
    except (OSError, subprocess.SubprocessError) as exc:
        raise Denied(f"Cannot inspect git state: {exc}")
    return result.stdout.strip()


def normalize(raw: str, root: Path) -> str:
    value = raw.strip().strip("\"'")
    if value in {"/dev/null", "dev/null"}:
        return ""
    if value.startswith(("a/", "b/")):
        value = value[2:]
    path = Path(value)
    if path.is_absolute():
        try:
            path = path.resolve().relative_to(root)
        except (ValueError, OSError) as exc:
            raise Denied(f"Path is outside repository: {raw}") from exc
    pure = PurePosixPath(path.as_posix())
    if ".." in pure.parts:
        raise Denied(f"Path escapes repository: {raw}")
    value = pure.as_posix().lstrip("./")
    if not value or value == ".":
        raise Denied(f"Cannot resolve repository path: {raw}")
    return value


def matches(path: str, patterns: list[str]) -> bool:
    path = path.rstrip("/")
    for raw in patterns:
        pattern = str(raw).strip().replace("\\", "/").lstrip("./")
        if not pattern:
            continue
        if pattern.endswith("/**"):
            prefix = pattern[:-3].rstrip("/")
            if path == prefix or path.startswith(prefix + "/"):
                return True
        if path == pattern.rstrip("/") or fnmatch.fnmatchcase(path, pattern):
            return True
    return False


def coordination(gate: dict) -> list[str]:
    values = gate.get("coordination_write_set")
    if isinstance(values, list) and any(str(v).strip() for v in values):
        return [str(v) for v in values if str(v).strip()]
    return DEFAULT_COORDINATION


def validate_source_gate(gate: dict) -> list[str]:
    if gate.get("schema_version") != 3:
        raise Denied("Source writes require active-work-block schema_version=3.")
    if gate.get("authority_mode") != "github_capability":
        raise Denied("Source writes require authority_mode=github_capability.")
    if not str(gate.get("work_block_id") or "").strip():
        raise Denied("Active Work Block requires work_block_id.")
    write_gate = gate.get("write_gate")
    if not isinstance(write_gate, dict) or write_gate.get("status") != "READY":
        raise Denied("Source writes require write_gate.status=READY.")
    spec = gate.get("specification")
    if not isinstance(spec, dict) or not str(spec.get("path") or "").strip():
        raise Denied("Active Work Block requires specification.path.")
    if not str(spec.get("revision") or "").strip():
        raise Denied("Active Work Block requires specification.revision.")
    critic = gate.get("critic")
    if not isinstance(critic, dict):
        raise Denied("Active Work Block requires critic state.")
    if critic.get("required") is True:
        status = critic.get("status")
        verdict = critic.get("verdict")
        if status not in {"READY", "DEGRADED", "FALLBACK", "SKIPPED"}:
            raise Denied("Required Critic state is unresolved.")
        if status != "SKIPPED" and verdict not in {"APPROVE", "SUPPLEMENT"}:
            raise Denied("Required Critic verdict must be APPROVE or SUPPLEMENT.")
        if status == "SKIPPED" and not str(critic.get("skip_reason") or "").strip():
            raise Denied("Skipped Critic requires skip_reason.")
    write_set = gate.get("write_set")
    if not isinstance(write_set, list) or not any(str(v).strip() for v in write_set):
        raise Denied("Active Work Block requires a non-empty write_set.")
    return [str(v) for v in write_set if str(v).strip()]


def require_scope(paths: list[str], patterns: list[str], label: str) -> None:
    outside = [path for path in paths if not matches(path, patterns)]
    if outside:
        raise Denied(
            f"{label} outside approved scope: {', '.join(outside)}. "
            "Update the Work Block write-set before retrying."
        )


def check_paths(paths: list[str], gate: dict) -> None:
    coordination_paths = coordination(gate)
    source = [path for path in paths if not matches(path, coordination_paths)]
    if not source:
        require_scope(paths, coordination_paths, "Coordination write")
        return
    require_scope(source, validate_source_gate(gate), "Source write")


def patch_paths(command: str, root: Path) -> list[str]:
    raw = PATCH_PATHS.findall(command) + PATCH_MOVES.findall(command) + DIFF_PATHS.findall(command)
    paths: list[str] = []
    for value in raw:
        path = normalize(value, root)
        if path and path not in paths:
            paths.append(path)
    if not paths:
        raise Denied(
            "apply_patch did not expose target paths; use standard Update/Add/Delete/Move headers."
        )
    return paths


def explicit_tool_path(event: dict, root: Path) -> list[str]:
    value = event.get("tool_input")
    if not isinstance(value, dict):
        raise Denied("Write tool input must be an object.")
    raw = value.get("file_path") or value.get("path")
    if not isinstance(raw, str) or not raw.strip():
        raise Denied("Write tool input is missing file_path/path.")
    return [normalize(raw, root)]


def shell_paths(command: str, root: Path) -> list[str]:
    paths: list[str] = []
    for match in REDIRECTS.finditer(command):
        path = normalize(match.group(1), root)
        if path not in paths:
            paths.append(path)
    if re.search(r";|&&|\|\||(?<!\|)\|(?!\|)", command):
        raise Denied("Complex mutating Bash cannot be scoped safely; split the command or use apply_patch.")
    try:
        tokens = shlex.split(command, posix=True)
    except ValueError as exc:
        raise Denied(f"Cannot parse mutating Bash: {exc}") from exc
    if not tokens:
        return paths
    name = Path(tokens[0]).name
    args = [value for value in tokens[1:] if not value.startswith("-")]
    targets: list[str] = []
    if name in {"touch", "mkdir", "rm", "rmdir", "chmod", "chown", "truncate"}:
        targets = args
    elif name in {"mv", "install", "ln"}:
        targets = args
    elif name == "cp" and args:
        targets = [args[-1]]
    elif name == "tee":
        targets = args
    elif name in {"sed", "perl"}:
        targets = [value for value in args if not value.startswith(("s/", "s|"))]
    elif name == "git" and args and args[0] in {"add", "mv", "rm", "restore", "checkout"}:
        targets = args[1:]
    elif name in {"npm", "pnpm", "yarn", "pip", "pip3", "poetry", "cargo", "go"}:
        raise Denied("Dependency commands have broad implicit writes; use an explicitly reviewed workflow.")
    for raw in targets:
        if raw in {".", "./"} or raw.startswith(("$", "`")) or any(char in raw for char in "*?[]{}"):
            raise Denied(f"Write target cannot be scoped safely: {raw}")
        path = normalize(raw, root)
        if path not in paths:
            paths.append(path)
    if not paths:
        raise Denied("Mutating Bash did not expose explicit target paths; use apply_patch or a simpler command.")
    return paths


def check_bash(event: dict, gate: dict, root: Path) -> None:
    value = event.get("tool_input")
    command = value.get("command") if isinstance(value, dict) else None
    if not isinstance(command, str):
        raise Denied("Bash input is missing tool_input.command.")

    if re.search(r"\bgit\s+push\b", command, re.I):
        return

    if re.search(r"\bgit\s+commit\b", command, re.I):
        staged = [
            value
            for value in git(root, "diff", "--cached", "--name-only", "--diff-filter=ACMRD").splitlines()
            if value
        ]
        if not staged:
            raise Denied("git commit has no staged paths to validate.")
        coordination_paths = coordination(gate)
        source = [path for path in staged if not matches(path, coordination_paths)]
        if not source:
            require_scope(staged, coordination_paths, "Coordination commit")
            return
        allowed = validate_source_gate(gate) + coordination_paths
        require_scope(staged, allowed, "Staged commit")
        return

    if MUTATING.search(command) or REDIRECTS.search(command):
        check_paths(shell_paths(command, root), gate)


def main() -> None:
    event = read_event()
    root = root_from(event.get("cwd"))
    gate = load_gate(root)
    tool = str(event.get("tool_name") or "")
    try:
        if tool == "Bash":
            check_bash(event, gate, root)
        elif tool == "apply_patch":
            value = event.get("tool_input")
            command = value.get("command") if isinstance(value, dict) else None
            if not isinstance(command, str):
                raise Denied("apply_patch input is missing tool_input.command.")
            check_paths(patch_paths(command, root), gate)
        elif tool in {"Edit", "Write"}:
            check_paths(explicit_tool_path(event, root), gate)
        else:
            raise Denied(f"Unsupported write tool: {tool}")
    except Denied as exc:
        block(str(exc))


if __name__ == "__main__":
    main()
