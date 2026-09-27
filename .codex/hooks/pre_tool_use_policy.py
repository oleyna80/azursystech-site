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
FORMAL_DEFINE_PROFILES = {"Managed", "Assured", "Distributed"}
DEFAULT_COORDINATION = [
    ".agent/active-work-block.json",
    ".agent/critic-gate.md",
    ".agent/verification-gate.md",
    ".codex/write-gate.md",
    "FILE_REGISTRY.yml",
    "PROJECT_MAP.md",
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
def unquoted_view(command: str) -> str:
    """Return the command with quoted spans blanked, preserving offsets.

    Quoted or search text (for example a pattern containing `2>/dev/null`) is
    inert, so detection never mistakes it for an operator or a write target.
    """
    view = list(command)
    quote: str | None = None
    index = 0
    while index < len(command):
        character = command[index]
        if quote is None:
            if character in {"'", '"'}:
                quote = character
                view[index] = " "
            index += 1
            continue
        if character == "\\" and quote == '"':
            view[index] = " "
            if index + 1 < len(command):
                view[index + 1] = " "
            index += 2
            continue
        if character == quote:
            quote = None
        view[index] = " "
        index += 1
    return "".join(view)


def unquoted_redirects(command: str) -> list[str]:
    """Return targets of unquoted redirections, keeping quoted targets intact.

    A genuine redirect is still scoped even when its target is quoted; only a
    redirect operator inside quoted text is treated as inert.
    """
    targets: list[str] = []
    quote: str | None = None
    index = 0
    while index < len(command):
        character = command[index]
        if quote is not None:
            if character == "\\" and quote == '"':
                index += 2
                continue
            if character == quote:
                quote = None
            index += 1
            continue
        if character in {"'", '"'}:
            quote = character
            index += 1
            continue
        if character != ">":
            index += 1
            continue
        index += 2 if command[index:index + 2] == ">>" else 1
        if command[index:index + 1] == "&":
            while index < len(command) and command[index] not in " \t;&|":
                index += 1
            continue
        while index < len(command) and command[index] in " \t":
            index += 1
        if index < len(command) and command[index] in {"'", '"'}:
            closer = command[index]
            end = command.find(closer, index + 1)
            if end == -1:
                targets.append(command[index + 1:])
                break
            targets.append(command[index + 1:end])
            index = end + 1
            continue
        start = index
        while index < len(command) and command[index] not in " \t;&|":
            index += 1
        if index > start:
            targets.append(command[start:index])
    return targets
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


def validate_topology_admission(root: Path, gate: dict) -> None:
    """Apply the role-context admission dimension without claiming OS isolation."""
    sys.path.insert(0, str(root / "scripts"))
    try:
        from subagent_topology import TopologyError, validate
        validate(gate, phase="admission", root=root)
    except (ImportError, TopologyError) as exc:
        raise Denied(f"Native subagent topology admission failed: {exc}") from exc


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
        raise Denied(f"Invalid {GATE_PATH.as_posix()}: {exc}") from exc
    if not isinstance(gate, dict):
        raise Denied("Active Work Block gate must be a JSON object.")
    return gate


def git(root: Path, *args: str) -> str:
    try:
        result = subprocess.run(
            ["git", *args], cwd=root, check=True, capture_output=True,
            text=True, timeout=3
        )
    except (OSError, subprocess.SubprocessError) as exc:
        raise Denied(f"Cannot inspect git state: {exc}") from exc
    return result.stdout.strip()


def git_probe(root: Path, *args: str) -> str:
    try:
        result = subprocess.run(
            ["git", *args], cwd=root, check=False, capture_output=True,
            text=True, timeout=3
        )
    except (OSError, subprocess.SubprocessError):
        return ""
    return result.stdout.strip() if result.returncode == 0 else ""


def diagnostic(reason: str, root: Path, gate: dict | None) -> str:
    branch = git_probe(root, "symbolic-ref", "--quiet", "--short", "HEAD") or "<detached>"
    head = git_probe(root, "rev-parse", "HEAD") or "<unresolved>"
    value = gate if isinstance(gate, dict) else {}
    work_block_id = str(value.get("work_block_id") or "<missing>")
    subject_branch = str(value.get("subject_branch") or "<missing>")
    return (
        f"{reason} Context: root={root}; branch={branch}; HEAD={head}; "
        f"work_block_id={work_block_id}; subject_branch={subject_branch}. "
        "The agent session is bound from event.cwd before command execution; "
        "command-local cd does not rebind it. Start a new agent session from the intended worktree."
    )


def validate_binding(root: Path, gate: dict) -> None:
    subject_branch = str(gate.get("subject_branch") or "").strip()
    if not subject_branch:
        raise Denied("Worktree/SSOT binding failed: active gate has no subject_branch.")
    branch = git_probe(root, "symbolic-ref", "--quiet", "--short", "HEAD")
    if not branch:
        raise Denied("Worktree/SSOT binding failed: Git HEAD is detached.")
    if branch != subject_branch:
        raise Denied(
            f"Worktree/SSOT binding mismatch: current branch {branch!r} does not match "
            f"active gate subject_branch {subject_branch!r}."
        )


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
    value = pure.as_posix()
    if value.startswith("./"):
        value = value[2:]
    if not value or value == ".":
        raise Denied(f"Cannot resolve repository path: {raw}")
    return value


def matches(path: str, patterns: list[str]) -> bool:
    path = path.rstrip("/")
    for raw in patterns:
        pattern = str(raw).strip().replace("\\", "/")
        if pattern.startswith("./"):
            pattern = pattern[2:]
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


def canonical_inactive(gate: dict) -> bool:
    """Return whether the operational record is the coordination-only terminal state."""
    specification = gate.get("specification")
    return (
        gate.get("schema_version") == 3
        and gate.get("authority_mode") == "github_capability"
        and gate.get("work_block_id") == ""
        and gate.get("subject_branch") == ""
        and gate.get("base_commit") == ""
        and specification == {"path": "", "revision": ""}
        and gate.get("write_gate") == {"status": "BLOCKED", "opened_at": None}
        and gate.get("write_set") == []
        and gate.get("coordination_write_set") == DEFAULT_COORDINATION
    )


def validate_source_gate(gate: dict, root: Path) -> list[str]:
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
    if str(gate.get("governance_profile") or "") in FORMAL_DEFINE_PROFILES:
        quality = gate.get("define_quality")
        if not isinstance(quality, dict) or quality.get("required") is not True:
            raise Denied("Formal source writes require define_quality evidence.")
        if quality.get("status") != "READY" or not all(
            isinstance(quality.get(name), str) and quality[name].strip()
            for name in ("requirements_review", "traceability", "consistency_analysis")
        ):
            raise Denied("Formal source writes require READY define_quality evidence.")
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
    validate_topology_admission(root, gate)
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


def maintenance_override(root: Path, guard_class: str, operation: str, paths: list[str], reason: str) -> bool:
    """Downgrade only a named cooperative guard under the exact Owner state."""
    sys.path.insert(0, str(root / ".agent/hooks"))
    try:
        from maintenance_mode import decide
    except ImportError:
        return False
    try:
        return decide(
            root,
            guard_class=guard_class,
            operation=operation,
            paths=paths,
            reason=reason,
        ) == "AUDIT"
    except (OSError, subprocess.SubprocessError, ValueError):
        return False


def maintenance_command_paths(command: str, root: Path) -> list[str]:
    """Extract only explicit repository paths; ambiguity fails closed."""
    paths: list[str] = []
    for target in unquoted_redirects(command):
        try:
            path = normalize(target, root)
        except Denied:
            continue
        if path and path not in paths:
            paths.append(path)
    try:
        tokens = shlex.split(command, posix=True)
    except ValueError:
        return paths
    for token in tokens:
        if token.startswith(("-", "$")) or token.startswith(chr(96)) or token in {";", "&&", "||", "|"}:
            continue
        candidate = token.strip().strip(chr(34) + chr(39))
        if not candidate or candidate in {".", "./"}:
            continue
        if "/" not in candidate and not candidate.startswith("."):
            continue
        try:
            path = normalize(candidate, root)
        except Denied:
            continue
        if path not in paths:
            paths.append(path)
    return paths


def maintenance_immutable_command(command: str) -> bool:
    return bool(re.search(
        r"\b(git\s+(push|merge|tag|branch\s+(-[dD]|--delete))|"
        r"(deploy|release|publish|terraform\s+(apply|destroy)|"
        r"kubectl\s+(apply|delete|patch|replace)|docker\s+(push|compose\s+(up|down)))\b",
        command,
        re.I,
    ))


def _normal_check_paths(paths: list[str], gate: dict, root: Path) -> None:
    scoped = [path for path in paths if path != GATE_PATH.as_posix()]
    if not scoped:
        return
    coordination_paths = coordination(gate)
    source = [path for path in scoped if not matches(path, coordination_paths)]
    if canonical_inactive(gate):
        if source:
            raise Denied("Inactive Work Block permits coordination writes only.")
        require_scope(scoped, DEFAULT_COORDINATION, "Inactive coordination write")
        return
    validate_binding(root, gate)
    if not source:
        require_scope(scoped, coordination_paths, "Coordination write")
        return
    require_scope(source, validate_source_gate(gate, root), "Source write")


def check_paths(paths: list[str], gate: dict, root: Path) -> None:
    try:
        _normal_check_paths(paths, gate, root)
        return
    except Denied as exc:
        scoped = [path for path in paths if path != GATE_PATH.as_posix()]
        if not scoped:
            raise
        if "Worktree/SSO" in str(exc) or "binding" in str(exc).lower():
            guard_class = "verified_same_repository_handoff"
        elif canonical_inactive(gate):
            guard_class = "inactive_coordination"
        elif gate.get("write_gate", {}).get("status") == "BLOCKED":
            guard_class = "post_freeze_staging"
        else:
            guard_class = "source_write_gate"
        if maintenance_override(root, guard_class, "write", scoped, str(exc)):
            return
        raise


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
    for target in unquoted_redirects(command):
        path = normalize(target, root)
        if path not in paths:
            paths.append(path)
    if re.search(r";|&&|\|\||(?<!\|)\|(?!\|)", unquoted_view(command)):
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
    if name in {"touch", "mkdir", "rm", "rmdir", "chown", "truncate"}:
        targets = args
    elif name == "chmod":
        # The first non-option token is a symbolic or numeric mode, not a path.
        targets = args[1:]
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


def bash_command(event: dict) -> str:
    value = event.get("tool_input")
    command = value.get("command") if isinstance(value, dict) else None
    if not isinstance(command, str):
        raise Denied("Bash input is missing tool_input.command.")
    return command


GIT_GLOBAL_OPTIONS_WITH_VALUE = {
    "-C", "-c", "--git-dir", "--work-tree", "--namespace", "--super-prefix", "--config-env",
}
GIT_GLOBAL_OPTIONS = {
    "--bare", "--no-replace-objects", "--no-lazy-fetch", "--no-optional-locks",
    "--literal-pathspecs", "--glob-pathspecs", "--noglob-pathspecs", "--icase-pathspecs",
    "--paginate", "--no-pager",
}
COMMIT_OPTIONS_WITH_VALUE = {
    "-m", "-F", "--message", "--file", "--author", "--date", "--cleanup", "--status",
    "--untracked-files", "--trailer", "--template", "--fixup", "--squash", "--reuse-message",
    "--reedit-message",
}
CONTENT_SELECTING_COMMIT_OPTIONS = {"--all", "--include", "--only", "--pathspec-from-file"}
ENV_OPTIONS_WITH_VALUE = {
    "-C", "-f", "-u", "-S", "-a", "--chdir", "--file", "--unset", "--split-string",
    "--argv0",
}
ENV_SIGNAL_OPTIONS = {"--ignore-signal", "--default-signal", "--block-signal"}


def direct_git_tokens(command: str) -> list[str] | None:
    """Return a direct Git invocation after safe shell execution prefixes."""
    if re.search(r";|&&|\|\||(?<!\|)\|(?!\|)", command):
        return None
    try:
        tokens = shlex.split(command, posix=True)
    except ValueError as exc:
        raise Denied(f"Cannot parse Git invocation: {exc}") from exc
    index = 0
    while index < len(tokens) and re.match(r"^[A-Za-z_][A-Za-z0-9_]*=", tokens[index]):
        index += 1
    if index < len(tokens) and Path(tokens[index]).name == "command":
        index += 1
        if index < len(tokens) and tokens[index] == "-p":
            index += 1
        if index < len(tokens) and tokens[index] == "--":
            index += 1
    if index < len(tokens) and Path(tokens[index]).name == "env":
        index += 1
        while index < len(tokens):
            token = tokens[index]
            if token == "--":
                index += 1
                break
            if token == "-S":
                if index + 1 >= len(tokens):
                    raise Denied("Cannot parse env -S without a split string")
                try:
                    tokens[index:index + 2] = shlex.split(tokens[index + 1], posix=True)
                except ValueError as exc:
                    raise Denied(f"Cannot parse env -S split string: {exc}") from exc
                continue
            if token.startswith("-S"):
                try:
                    tokens[index:index + 1] = shlex.split(token[2:], posix=True)
                except ValueError as exc:
                    raise Denied(f"Cannot parse attached env -S split string: {exc}") from exc
                continue
            if token.startswith("--split-string="):
                try:
                    tokens[index:index + 1] = shlex.split(token.split("=", 1)[1], posix=True)
                except ValueError as exc:
                    raise Denied(f"Cannot parse env --split-string: {exc}") from exc
                continue
            if token == "--split-string":
                if index + 1 >= len(tokens):
                    raise Denied("Cannot parse env --split-string without a value")
                try:
                    tokens[index:index + 2] = shlex.split(tokens[index + 1], posix=True)
                except ValueError as exc:
                    raise Denied(f"Cannot parse env --split-string: {exc}") from exc
                continue
            if token in ENV_SIGNAL_OPTIONS:
                if index + 1 < len(tokens) and re.fullmatch(r"(?:SIG)?[A-Z][A-Z0-9_]*|[0-9]+", tokens[index + 1]):
                    index += 2
                else:
                    index += 1
                continue
            if token in ENV_OPTIONS_WITH_VALUE:
                index += 2
                continue
            if any(token.startswith(option + "=") for option in ENV_OPTIONS_WITH_VALUE if option.startswith("--")):
                index += 1
                continue
            if token.startswith("-") or re.match(r"^[A-Za-z_][A-Za-z0-9_]*=", token):
                index += 1
                continue
            break
    if index < len(tokens) and Path(tokens[index]).name == "env":
        return direct_git_tokens(" ".join(shlex.quote(token) for token in tokens[index:]))
    if index >= len(tokens) or Path(tokens[index]).name != "git":
        return None
    return tokens[index:]


def git_commit_arguments(command: str) -> list[str] | None:
    """Return commit arguments after Git global options, fail-closed for unknown prefixes."""
    tokens = direct_git_tokens(command)
    if tokens is None:
        return None
    index = 1
    while index < len(tokens):
        token = tokens[index]
        if token in GIT_GLOBAL_OPTIONS_WITH_VALUE:
            index += 2
        elif any(token.startswith(option + "=") for option in GIT_GLOBAL_OPTIONS_WITH_VALUE if option.startswith("--")):
            index += 1
        elif token in GIT_GLOBAL_OPTIONS:
            index += 1
        elif token.startswith("-"):
            try:
                commit_index = tokens.index("commit", index + 1)
            except ValueError:
                return None
            return tokens[commit_index + 1:]
        else:
            return tokens[index + 1:] if token == "commit" else None
    return None


def inactive_commit_selector(arguments: list[str]) -> str | None:
    """Identify commit arguments that can bypass staged-set validation."""
    index = 0
    while index < len(arguments):
        argument = arguments[index]
        if argument == "--":
            return "an explicit pathspec"
        if argument in CONTENT_SELECTING_COMMIT_OPTIONS or any(
            argument.startswith(option + "=") for option in CONTENT_SELECTING_COMMIT_OPTIONS
        ):
            return argument
        if argument == "-a" or (argument.startswith("-") and not argument.startswith("--") and any(
            flag in argument[1:] for flag in ("a", "i", "o")
        )):
            return argument
        if argument in COMMIT_OPTIONS_WITH_VALUE:
            index += 2
            continue
        if any(argument.startswith(option + "=") for option in COMMIT_OPTIONS_WITH_VALUE if option.startswith("--")):
            index += 1
            continue
        if not argument.startswith("-"):
            return "an explicit pathspec"
        index += 1
    return None


def direct_gate_repair_bash(command: str, root: Path) -> bool:
    if re.search(r"\bgit\s+(commit|push)\b", command, re.I):
        return False
    if not (MUTATING.search(unquoted_view(command)) or unquoted_redirects(command)):
        return False
    paths = shell_paths(command, root)
    return bool(paths) and all(path == GATE_PATH.as_posix() for path in paths)


def check_bash(event: dict, gate: dict, root: Path) -> None:
    command = bash_command(event)
    sys.path.insert(0, str(root / ".agent/hooks"))
    try:
        from git_transition_policy import Denied as DispatchDenied, runtime_git_dispatch
        runtime_git_dispatch(command, root)
    except ImportError as exc:
        raise Denied(f"Shared Git dispatch policy denied: {exc}") from exc
    except DispatchDenied as exc:
        paths = maintenance_command_paths(command, root)
        if (
            "direct, single invocation" in str(exc)
            and paths
            and not maintenance_immutable_command(command)
            and maintenance_override(root, "direct_single_git", "git", paths, str(exc))
        ):
            pass
        else:
            raise Denied(f"Shared Git dispatch policy denied: {exc}") from exc

    if re.search(r"\bgit\s+push\b", command, re.I):
        return

    commit_arguments = git_commit_arguments(command)
    if commit_arguments is not None:
        sys.path.insert(0, str(root / ".agent/hooks"))
        try:
            from git_transition_policy import Denied as TransitionDenied, runtime_commit_command, runtime_frozen_commit
            runtime_commit_command(command)
        except (ImportError, TransitionDenied) as exc:
            raise Denied(f"Shared commit command policy denied: {exc}") from exc
        if canonical_inactive(gate):
            selector = inactive_commit_selector(commit_arguments)
            if selector:
                raise Denied(
                    "Inactive Work Block denies git commit arguments that can select "
                    f"working-tree content: {selector}."
                )
        staged = [
            value
            for value in git(root, "diff", "--cached", "--name-only", "--diff-filter=ACMRD").splitlines()
            if value
        ]
        if not staged:
            raise Denied("git commit has no staged paths to validate.")
        coordination_paths = coordination(gate)
        source = [path for path in staged if not matches(path, coordination_paths)]
        if canonical_inactive(gate):
            if source:
                raise Denied("Inactive Work Block permits coordination commits only.")
            require_scope(staged, DEFAULT_COORDINATION, "Inactive coordination commit")
            return
        validate_binding(root, gate)
        if not source:
            require_scope(staged, coordination_paths, "Coordination commit")
            return
        if gate.get("write_gate", {}).get("status") == "BLOCKED":
            try:
                runtime_frozen_commit(root)
            except TransitionDenied as exc:
                raise Denied(f"Shared frozen commit policy denied: {exc}") from exc
            return
        allowed = validate_source_gate(gate, root) + coordination_paths
        require_scope(staged, allowed, "Staged commit")
        return

    if MUTATING.search(unquoted_view(command)) or unquoted_redirects(command):
        try:
            paths = shell_paths(command, root)
        except Denied as exc:
            paths = maintenance_command_paths(command, root)
            if (
                paths
                and not maintenance_immutable_command(command)
                and maintenance_override(root, "complex_mutating_bash", "bash", paths, str(exc))
            ):
                return
            raise
        check_paths(paths, gate, root)


def main() -> None:
    event = read_event()
    root = root_from(event.get("cwd"))
    tool = str(event.get("tool_name") or "")
    gate: dict | None = None
    try:
        if tool == "Bash":
            command = bash_command(event)
            if direct_gate_repair_bash(command, root):
                return
            gate = load_gate(root)
            check_bash(event, gate, root)
        elif tool == "apply_patch":
            value = event.get("tool_input")
            command = value.get("command") if isinstance(value, dict) else None
            if not isinstance(command, str):
                raise Denied("apply_patch input is missing tool_input.command.")
            paths = patch_paths(command, root)
            if paths and all(path == GATE_PATH.as_posix() for path in paths):
                return
            gate = load_gate(root)
            check_paths(paths, gate, root)
        elif tool in {"Edit", "Write"}:
            paths = explicit_tool_path(event, root)
            if paths == [GATE_PATH.as_posix()]:
                return
            gate = load_gate(root)
            check_paths(paths, gate, root)
        else:
            raise Denied(f"Unsupported write tool: {tool}")
    except Denied as exc:
        block(diagnostic(str(exc), root, gate))


if __name__ == "__main__":
    main()
