#!/usr/bin/env python3
"""Claude Code PreToolUse guard for cooperative Work Block write scope."""
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
        raise Denied("Write input is missing a repository path.")
    path = Path(value)
    if path.is_absolute():
        try:
            path = path.resolve().relative_to(root)
        except (ValueError, OSError) as exc:
            raise Denied(f"Write path is outside repository: {value}") from exc
    pure = PurePosixPath(path.as_posix())
    if ".." in pure.parts:
        raise Denied(f"Write path escapes repository: {value}")
    normalized = pure.as_posix().lstrip("./")
    if not normalized or normalized == ".":
        raise Denied(f"Cannot resolve repository path: {value}")
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
        raise Denied(f"Cannot inspect git state: {exc}") from exc
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

    specification = gate.get("specification")
    if not isinstance(specification, dict):
        raise Denied("Active Work Block requires specification state.")
    if not str(specification.get("path") or "").strip():
        raise Denied("Active Work Block requires specification.path.")
    if not str(specification.get("revision") or "").strip():
        raise Denied("Active Work Block requires specification.revision.")

    critic = gate.get("critic")
    if not isinstance(critic, dict):
        raise Denied("Active Work Block requires critic state.")
    required = critic.get("required") is True
    status = str(critic.get("status") or "")
    verdict = str(critic.get("verdict") or "")
    if required:
        if status not in {"READY", "DEGRADED", "FALLBACK", "SKIPPED"}:
            raise Denied("Required Critic state is unresolved.")
        if status != "SKIPPED" and verdict not in {"APPROVE", "SUPPLEMENT"}:
            raise Denied("Required Critic verdict must be APPROVE or SUPPLEMENT.")
        if status == "SKIPPED" and not str(critic.get("skip_reason") or "").strip():
            raise Denied("Skipped Critic requires skip_reason.")

    write_set = gate.get("write_set")
    if not isinstance(write_set, list) or not any(str(value).strip() for value in write_set):
        raise Denied("Active Work Block requires a non-empty write_set.")
    return [str(value) for value in write_set if str(value).strip()]


def require_scope(paths: list[str], patterns: list[str], label: str) -> None:
    outside = [path for path in paths if not matches(path, patterns)]
    if outside:
        raise Denied(
            f"{label} outside approved scope: {', '.join(outside)}. "
            "Update the Work Block write_set before retrying."
        )


def check_paths(paths: list[str], gate: dict) -> None:
    coordination_paths = coordination(gate)
    source = [path for path in paths if not matches(path, coordination_paths)]
    if not source:
        require_scope(paths, coordination_paths, "Coordination write")
        return
    require_scope(source, validate_source_gate(gate), "Source write")


def shell_paths(command: str, root: Path) -> list[str]:
    paths: list[str] = []
    for match in REDIRECTS.finditer(command):
        path = normalize(match.group(1), root)
        if path not in paths:
            paths.append(path)
    if re.search(r";|&&|\|\||(?<!\|)\|(?!\|)", command):
        raise Denied(
            "Complex mutating Bash cannot be scoped safely; split the command or use Edit/Write."
        )
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
        raise Denied(
            "Dependency commands have broad implicit writes; use an explicitly reviewed workflow."
        )
    for raw in targets:
        if raw in {".", "./"} or raw.startswith(("$", "`")) or any(
            char in raw for char in "*?[]{}"
        ):
            raise Denied(f"Write target cannot be scoped safely: {raw}")
        path = normalize(raw, root)
        if path not in paths:
            paths.append(path)
    if not paths:
        raise Denied(
            "Mutating Bash did not expose explicit target paths; use Edit/Write or a simpler command."
        )
    return paths


def check_bash(event: dict, gate: dict, root: Path) -> None:
    tool_input = event.get("tool_input")
    command = tool_input.get("command") if isinstance(tool_input, dict) else None
    if not isinstance(command, str):
        raise Denied("Bash input is missing tool_input.command.")

    # Git push is inspected by the shared provider-neutral Hard Stop guard.
    if re.search(r"\bgit\s+push\b", command, re.I):
        return

    if re.search(r"\bgit\s+commit\b", command, re.I):
        staged = [
            value
            for value in git(
                root, "diff", "--cached", "--name-only", "--diff-filter=ACMRD"
            ).splitlines()
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
    tool = str(event.get("tool_name") or "")
    if tool not in {"Bash", "Edit", "MultiEdit", "Write"}:
        return

    root = root_from(event.get("cwd"))

    if tool == "Bash":
        gate = load_gate(root)
        try:
            check_bash(event, gate, root)
        except Denied as exc:
            deny(str(exc))
        return

    tool_input = event.get("tool_input")
    raw_path = tool_input.get("file_path") if isinstance(tool_input, dict) else None
    if not raw_path and isinstance(tool_input, dict):
        raw_path = tool_input.get("path")
    try:
        path = normalize(raw_path, root)
    except Denied as exc:
        deny(str(exc))

    # The machine gate itself must remain repairable even when its JSON is invalid.
    if path == GATE_PATH.as_posix():
        return

    gate = load_gate(root)
    coordination_paths = coordination(gate)
    if matches(path, coordination_paths):
        return

    try:
        write_set = validate_source_gate(gate)
    except Denied as exc:
        deny(str(exc))
    if not matches(path, write_set):
        deny(
            f"Source write outside approved scope: {path}. "
            "Update the Work Block write_set before retrying."
        )


if __name__ == "__main__":
    main()
