#!/usr/bin/env python3
"""Provider-neutral guardrail for consequential Bash operations.

This hook is deliberately cooperative. It denies obvious dangerous commands in
the normal agent channel, while the real security boundary is external GitHub,
OS, workflow, and credential capability separation.
"""
from __future__ import annotations

import json
import hashlib
import fnmatch
import os
from pathlib import Path
import re
import shlex
import subprocess
import sys

sys.path.insert(0, str(Path(__file__).resolve().parents[2] / "scripts"))
from subagent_topology import TopologyError, applicable as topology_applicable, validate as validate_topology

GATE_PATH = Path(".agent/active-work-block.json")

RUNTIME_COMMANDS = {
    "codex": "codex-cli",
    "opencode": "opencode-cli",
    "claude": "claude-code-cli",
}

TERMINAL_CLOSEOUT_PATHS = {
    ".agent/active-work-block.json",
    ".agent/critic-gate.md",
    ".agent/verification-gate.md",
    ".codex/write-gate.md",
    "FILE_REGISTRY.yml",
    "PROJECT_MAP.md",
}
TERMINAL_WORK_BLOCK = re.compile(r"^Work-Block:\s*(\S+)\s*$", re.MULTILINE)
WORK_BLOCK_ID = re.compile(r"^[A-Za-z0-9][A-Za-z0-9._-]{0,127}$")
FRONTMATTER_KEY = re.compile(r"^[A-Za-z][A-Za-z0-9_-]*$")
TERMINAL_PLAN_MARKERS = (
    ("Stage State", "completed"),
    ("Review Gate", "READY"),
    ("Verification Verdict", "READY"),
    ("Drift Gate", "ALIGNED"),
    ("Closeout Mode", "success-closeout"),
    ("Task Status", "completed"),
)

CONSEQUENTIAL = [
    (
        re.compile(
            r"\b(git\s+reset\s+--hard|git\s+clean|terraform\s+destroy|"
            r"kubectl\s+delete|DROP\s+(DATABASE|TABLE))\b",
            re.I,
        ),
        "destructive operation",
    ),
    (
        re.compile(
            r"\b(kubectl\s+(apply|patch|replace|scale|rollout|set)|"
            r"terraform\s+apply|systemctl\s+(restart|stop|start)|"
            r"service\s+\S+\s+(restart|stop|start)|scp|ssh|rsync[^\n]*:)\b",
            re.I,
        ),
        "live infrastructure operation",
    ),
    (
        re.compile(r"\bdocker\s+push\b", re.I),
        "external image publish",
    ),
    (
        re.compile(
            r"\bgh\s+(?:workflow\s+run|run\s+(?:rerun|cancel|delete)|"
            r"pr\s+merge|release\s+(?:create|delete|upload)|"
            r"secret\s+(?:set|delete)|variable\s+(?:set|delete)|repo\s+edit)\b|"
            r"\bgh\s+api\b[^\n]*(?:--method|-X)\s*(?:POST|PUT|PATCH|DELETE)\b",
            re.I,
        ),
        "consequential GitHub mutation",
    ),
    (
        re.compile(
            r"\bcurl\b(?=[^\n]*api\.github\.com)"
            r"(?=[^\n]*(?:-X\s*(?:POST|PUT|PATCH|DELETE)|"
            r"--request\s*(?:POST|PUT|PATCH|DELETE)|--data))[^\n]*",
            re.I,
        ),
        "consequential GitHub API mutation",
    ),
    (
        re.compile(
            r"\b(psql|mysql|mongosh|redis-cli)\b[^\n]*\b"
            r"(DELETE|UPDATE|INSERT|ALTER|DROP|TRUNCATE|CREATE)\b",
            re.I,
        ),
        "direct live-data mutation",
    ),
    (
        re.compile(
            r"(^|[\s/])"
            r"(\.env(?:\.(?!example(?:[\s/]|$))[\w.-]+)?|credentials|secrets)"
            r"([\s/]|$)|"
            r"\b(rotate|revoke)\b[^\n]*(token|secret|key|credential)",
            re.I,
        ),
        "credential or secret operation",
    ),
    (
        re.compile(
            r"\b(sendmail|mailx|twilio|sendgrid|msmtp|ssmtp)\b|"
            r"\bcurl\b[^\n]*(messages|email|sms|notifications|whatsapp)[^\n]*"
            r"(-X\s*(POST|PUT|PATCH)|--data)",
            re.I,
        ),
        "client-facing communication",
    ),
]


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
            ["git", *args], cwd=root, check=True, capture_output=True,
            text=True, timeout=3
        )
    except (OSError, subprocess.SubprocessError) as exc:
        deny(f"Cannot inspect git state for Hard Stop policy: {exc}")
    return result.stdout.strip()


def git_optional(root: Path, *args: str) -> str | None:
    """Read a Git object without turning an expected missing path into a deny."""
    try:
        result = subprocess.run(
            ["git", *args], cwd=root, check=True, capture_output=True,
            text=True, timeout=3
        )
    except (OSError, subprocess.SubprocessError):
        return None
    return result.stdout


def git_bytes_optional(root: Path, *args: str) -> bytes | None:
    try:
        result = subprocess.run(
            ["git", *args], cwd=root, check=True, capture_output=True, timeout=5
        )
    except (OSError, subprocess.SubprocessError):
        return None
    return result.stdout


def valid_work_block_id(value: object) -> bool:
    candidate = value if isinstance(value, str) else ""
    return bool(
        WORK_BLOCK_ID.fullmatch(candidate)
        and ".." not in candidate
        and not any(character.isspace() or ord(character) < 32 for character in candidate)
    )


def parse_frontmatter(text: str) -> tuple[dict[str, str], str] | None:
    """Parse the repository's deliberately small, single-line frontmatter contract."""
    if not text.startswith("---\n"):
        return None
    remainder = text[4:]
    marker = "\n---\n"
    if marker not in remainder:
        return None
    header, body = remainder.split(marker, 1)
    if marker in body:
        return None
    values: dict[str, str] = {}
    for line in header.splitlines():
        if not line.strip():
            continue
        if ":" not in line:
            return None
        key, value = line.split(":", 1)
        key = key.strip()
        value = value.strip()
        if not FRONTMATTER_KEY.fullmatch(key) or key in values or not value:
            return None
        if len(value) >= 2 and value[0] == value[-1] and value[0] in {"'", '"'}:
            value = value[1:-1]
        values[key] = value
    return values, body


def tree_frontmatter(root: Path, revision: str, path: str) -> tuple[dict[str, str], str] | None:
    content = git_optional(root, "show", f"{revision}:{path}")
    if content is None:
        return None
    return parse_frontmatter(content)


def active_projection_matches(text: str, expected_path: str) -> bool:
    values = re.findall(r"(?m)^\s*active_work_block:\s*([^\s#]+)\s*(?:#.*)?$", text)
    return bool(values) and all(value == expected_path for value in values)


def terminal_plan_complete(body: str) -> bool:
    final_states = list(
        re.finditer(
            r"(?ms)^##\s+Final State\s*$\n(?P<body>.*?)(?=^##\s+|\Z)",
            body,
        )
    )
    if len(final_states) != 1:
        return False
    final_state = final_states[0]
    markers = re.findall(
        r"(?m)^\s*-\s+\*\*([^:]+):\*\*\s+(.+?)\s*$",
        final_state.group("body"),
    )
    normalized = lambda value: re.sub(r"[^a-z0-9]+", "", value.lower())
    for label, value in TERMINAL_PLAN_MARKERS:
        matches = [
            marker_value
            for marker_label, marker_value in markers
            if normalized(marker_label) == normalized(label)
        ]
        if len(matches) != 1 or matches[0] != value:
            return False
    return True


def completed_projection(text: str) -> list[str] | None:
    match = re.search(
        r"(?ms)^[ \t]*completed_work_blocks:\s*\n(?P<body>(?:^[ \t]*-\s+[^\n]+\n?)*)",
        text,
    )
    if match is None:
        return None
    return re.findall(r"(?m)^\s+-\s+(docs/plans/[^\s#]+)$", match.group("body"))


def terminal_child_coordination_matches(
    registry: str, project_map: str, plan_path: str,
) -> bool:
    registry_active = re.findall(
        r"(?m)^\s*active_work_block:\s*([^\s#]+|null)\s*(?:#.*)?$", registry
    )
    map_active = re.findall(
        r"(?m)^\s*active_work_block:\s*([^\s#]+|null)\s*(?:#.*)?$", project_map
    )
    registry_completed = completed_projection(registry)
    map_completed = completed_projection(project_map)
    return (
        registry_active
        and map_active
        and all(value == "null" for value in registry_active)
        and all(value == "null" for value in map_active)
        and registry_completed is not None
        and registry_completed == map_completed
        and registry_completed.count(plan_path) == 1
        and registry_completed[-1] == plan_path
    )


def terminal_projection(
    root: Path, parent_revision: str, parent_state: dict,
) -> tuple[str, str] | None:
    """Return only the exact plan/tasklist paths bound to this active parent."""
    work_block_id = parent_state.get("work_block_id")
    specification = parent_state.get("specification")
    if not valid_work_block_id(work_block_id) or not isinstance(specification, dict):
        return None
    specification_path = specification.get("path")
    specification_revision = specification.get("revision")
    expected_specification = f"docs/specs/{work_block_id}.md"
    if specification_path != expected_specification or not isinstance(specification_revision, str) or not specification_revision:
        return None
    plan_path = f"docs/plans/{work_block_id}.md"
    tasklist_path = f"docs/tasklist/{work_block_id}.tasklist.md"
    spec = tree_frontmatter(root, parent_revision, specification_path)
    plan = tree_frontmatter(root, parent_revision, plan_path)
    tasklist = tree_frontmatter(root, parent_revision, tasklist_path)
    if spec is None or plan is None or tasklist is None:
        return None
    spec_meta, _ = spec
    plan_meta, _ = plan
    task_meta, _ = tasklist
    if (
        spec_meta.get("artifact_type") != "specification"
        or spec_meta.get("work_block_id") != work_block_id
        or spec_meta.get("revision") != specification_revision
        or plan_meta.get("artifact_type") != "work_block"
        or plan_meta.get("work_block_id") != work_block_id
        or plan_meta.get("specification") != specification_path
        or plan_meta.get("revision") != specification_revision
        or plan_meta.get("status") not in {"draft", "planned", "in_progress", "blocked"}
        or task_meta.get("artifact_type") != "tasklist"
        or task_meta.get("work_block_id") != work_block_id
        or task_meta.get("specification") != specification_path
        or task_meta.get("revision") != specification_revision
        or task_meta.get("status") not in {"active", "planned", "in_progress", "blocked"}
    ):
        return None
    registry = git_optional(root, "show", f"{parent_revision}:FILE_REGISTRY.yml")
    project_map = git_optional(root, "show", f"{parent_revision}:PROJECT_MAP.md")
    if registry is None or project_map is None:
        return None
    if not active_projection_matches(registry, plan_path) or not active_projection_matches(project_map, plan_path):
        return None

    child_plan = tree_frontmatter(root, "HEAD", plan_path)
    child_tasklist = tree_frontmatter(root, "HEAD", tasklist_path)
    child_gate_text = git_optional(root, "show", "HEAD:.agent/active-work-block.json")
    child_registry = git_optional(root, "show", "HEAD:FILE_REGISTRY.yml")
    child_project_map = git_optional(root, "show", "HEAD:PROJECT_MAP.md")
    try:
        child_gate = json.loads(child_gate_text) if child_gate_text is not None else None
    except json.JSONDecodeError:
        child_gate = None
    if (
        child_plan is None
        or child_tasklist is None
        or not isinstance(child_gate, dict)
        or not canonical_terminal_inactive(child_gate, root)
        or child_registry is None
        or child_project_map is None
        or not terminal_child_coordination_matches(
            child_registry, child_project_map, plan_path
        )
    ):
        return None
    child_plan_meta, child_plan_body = child_plan
    child_task_meta, child_task_body = child_tasklist
    if (
        child_plan_meta.get("artifact_type") != "work_block"
        or child_plan_meta.get("work_block_id") != work_block_id
        or child_plan_meta.get("specification") != specification_path
        or child_plan_meta.get("revision") != specification_revision
        or child_plan_meta.get("status") != "completed"
        or not terminal_plan_complete(child_plan_body)
        or child_task_meta.get("artifact_type") != "tasklist"
        or child_task_meta.get("work_block_id") != work_block_id
        or child_task_meta.get("specification") != specification_path
        or child_task_meta.get("revision") != specification_revision
        or child_task_meta.get("status") != "completed"
    ):
        return None
    task_items = re.findall(
        r"(?m)^\s*[-*+]\s+\[([ xX])\](?:\s+([^\n]*?))?\s*$",
        child_task_body,
    )
    if not task_items:
        return None
    for mark, item in task_items:
        task_id = item.split(None, 1)[0] if item and item.split(None, 1) else ""
        if not re.fullmatch(r"TASK-[A-Za-z0-9_-]+", task_id):
            return None
        if mark != "x" and mark != "X":
            return None
    return plan_path, tasklist_path


def current_branch(root: Path) -> str:
    return git(root, "branch", "--show-current")


def recursive_rm(command: str) -> bool:
    prefix = r"(?:(?:sudo|command|env)\s+)?"
    for match in re.finditer(
        rf"(?:^|[;&|\n]\s*){prefix}rm\s+([^;&|\n]+)", command, re.I
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


def force_push(command: str) -> bool:
    for segment in push_segments(command):
        tokens, positional = parse_push_segment(segment)
        if any(
            token in {"-f", "--force", "--force-with-lease"}
            or token.startswith("--force-with-lease=")
            for token in tokens
        ):
            return True
        if any(refspec.startswith("+") for refspec in positional[1:]):
            return True
    return False


def shell_command_segments(command: str) -> list[list[str]] | None:
    """Parse shell command segments without treating quoted prose as commands."""
    try:
        lexer = shlex.shlex(command, posix=True, punctuation_chars=";&|")
        lexer.whitespace_split = True
        lexer.commenters = ""
        tokens = list(lexer)
    except ValueError:
        return None

    commands: list[list[str]] = []
    current: list[str] = []
    for token in tokens:
        if token and all(character in ";&|" for character in token):
            if current:
                commands.append(current)
                current = []
        else:
            current.append(token)
    if current:
        commands.append(current)
    return commands


def git_push_subcommand_index(arguments: list[str]) -> int | None:
    """Find a literal `push` Git subcommand after supported global options."""
    options_with_value = {
        "-c", "-C", "--config-env", "--exec-path", "--git-dir", "--namespace",
        "--work-tree", "--super-prefix",
    }
    index = 0
    while index < len(arguments):
        token = arguments[index]
        if token == "push":
            return index
        if not token.startswith("-"):
            return None
        if token in options_with_value:
            index += 2
            continue
        index += 1
    return None


def balanced_substitution(command: str, opening_paren: int) -> tuple[str, int]:
    """Return the contents and end offset of a shell parenthesized substitution."""
    depth = 1
    quote: str | None = None
    index = opening_paren + 1
    start = index
    while index < len(command):
        character = command[index]
        if character == "\\" and quote != "'":
            index += 2
            continue
        if quote:
            if character == quote:
                quote = None
            index += 1
            continue
        if character in {"'", '"'}:
            quote = character
        elif character == "(":
            depth += 1
        elif character == ")":
            depth -= 1
            if depth == 0:
                return command[start:index], index + 1
        index += 1
    return command[start:], len(command)


def unquoted_shell_substitutions(command: str) -> list[str]:
    """Extract executable command/process substitutions, respecting quotes."""
    substitutions: list[str] = []
    quote: str | None = None
    index = 0
    while index < len(command):
        character = command[index]
        if character == "\\" and quote != "'":
            index += 2
            continue
        if quote:
            if quote == '"' and command[index:index + 2] == "$(":
                content, index = balanced_substitution(command, index + 1)
                substitutions.append(content)
                continue
            if quote == '"' and character == "`":
                end = index + 1
                while end < len(command) and command[end] != "`":
                    if command[end] == "\\":
                        end += 2
                    else:
                        end += 1
                substitutions.append(command[index + 1:end])
                index = end + 1
                continue
            if character == quote:
                quote = None
            index += 1
            continue
        if character in {"'", '"'}:
            quote = character
            index += 1
            continue
        if character == "`":
            end = index + 1
            while end < len(command) and command[end] != "`":
                if command[end] == "\\":
                    end += 2
                else:
                    end += 1
            substitutions.append(command[index + 1:end])
            index = end + 1
            continue
        if command[index:index + 2] == "$(" or (
            quote is None and command[index:index + 2] in {"<(", ">("}
        ):
            content, index = balanced_substitution(command, index + 1)
            substitutions.append(content)
            continue
        index += 1
    return substitutions


def push_segments(command: str) -> list[str]:
    """Return every real Git push argument segment, including wrapped Git invocations."""
    # A real shell evaluates command and process substitutions before the outer
    # command. This control plane deliberately denies every executable
    # substitution (while retaining single-quoted literal prose), rather than
    # claiming a lightweight parser can prove every Bash expansion harmless.
    if unquoted_shell_substitutions(command):
        return ["<shell-substitution>"]
    commands = shell_command_segments(command)
    if commands is None:
        # An invalid shell command cannot qualify for the autonomous allowance.
        return ["<unparseable>"]

    pushes: list[str] = []
    for segment in commands:
        for index, token in enumerate(segment):
            # Detection covers absolute-path invocations too.  The allowance
            # remains stricter and accepts only the literal `git` executable.
            if Path(token).name == "git":
                push_index = git_push_subcommand_index(segment[index + 1:])
                if push_index is None:
                    continue
                pushes.append(shlex.join(segment[index + 2 + push_index:]))
                break
    return pushes


def parse_push_segment(segment: str) -> tuple[list[str], list[str]]:
    try:
        tokens = shlex.split(segment, posix=True)
    except ValueError:
        return [], []
    positional = [token for token in tokens if not token.startswith("-")]
    return tokens, positional


def is_single_shell_command(command: str) -> bool:
    """Reject chaining so an allowed push cannot carry a second action."""
    commands = shell_command_segments(command)
    if commands is None:
        return False
    return len(commands) == 1 and bool(commands[0])


def destructive_or_broad_push(command: str) -> bool:
    broad_flags = {"--delete", "--mirror", "--all", "--prune"}
    for segment in push_segments(command):
        tokens, positional = parse_push_segment(segment)
        if not tokens and segment:
            return True
        if any(
            token in broad_flags
            or any(token.startswith(f"{flag}=") for flag in broad_flags)
            for token in tokens
        ):
            return True
        if len(positional) > 1 and any(refspec.startswith(":") for refspec in positional[1:]):
            return True
    return False


def tag_publish(command: str) -> bool:
    for segment in push_segments(command):
        tokens, positional = parse_push_segment(segment)
        if not tokens and segment:
            return True
        if any(token in {"--tags", "--follow-tags"} for token in tokens):
            return True
        if len(positional) > 1:
            refspecs = positional[1:]
            if refspecs and refspecs[0] == "tag":
                return True
            if any("refs/tags/" in refspec.lstrip("+") for refspec in refspecs):
                return True
    return False


def wrapped_push_invocation(command: str) -> bool:
    """Reject wrapper forms whose quoted payload would execute a Git push."""
    return bool(
        re.search(
            r"(?:^|[;&|\n]\s*)(?:env|command|bash|sh|zsh)\b[^;&|\n]*\bgit\s+push\b",
            command,
            re.I,
        )
    )


def canonical_branch_ref(value: str) -> str:
    ref = value.strip()
    if ref.startswith("refs/heads/"):
        ref = ref[len("refs/heads/") :]
    return ref


def default_branch(root: Path) -> str:
    """Resolve the locally known default branch; publication fails closed if unknown."""
    try:
        remote = subprocess.run(
            ["git", "symbolic-ref", "--quiet", "--short", "refs/remotes/origin/HEAD"],
            cwd=root, check=False, capture_output=True, text=True, timeout=3,
        )
    except (OSError, subprocess.SubprocessError):
        deny("Cannot inspect configured default branch for Hard Stop policy.")
    if remote.returncode == 0 and remote.stdout.strip():
        return canonical_branch_ref(remote.stdout.strip())
    for candidate in ("main", "master"):
        if subprocess.run(
            ["git", "show-ref", "--verify", "--quiet", f"refs/heads/{candidate}"],
            cwd=root, check=False, capture_output=True, text=True, timeout=3,
        ).returncode == 0:
            return candidate
    return ""


def refspec_targets_default(refspec: str, current: str) -> bool:
    value = refspec.lstrip("+")
    if ":" in value:
        _source, destination = value.split(":", 1)
        return canonical_branch_ref(destination) in {"main", "master"}
    if value.upper() == "HEAD":
        return current in {"main", "master"}
    return canonical_branch_ref(value) in {"main", "master"}


def pushes_default_branch(command: str, root: Path) -> bool:
    branch = current_branch(root)
    configured_default = default_branch(root)
    protected = {value for value in (configured_default, "main", "master") if value}
    for segment in push_segments(command):
        tokens, positional = parse_push_segment(segment)
        if not tokens and segment:
            return branch in protected
        if len(positional) <= 1:
            if branch in protected:
                return True
            continue
        refspecs = positional[1:]
        if any(
            canonical_branch_ref(
                refspec.lstrip("+").split(":", 1)[-1]
                if ":" in refspec.lstrip("+")
                else (branch if refspec.upper() == "HEAD" else refspec)
            ) in protected
            for refspec in refspecs
        ):
            return True
    return False


def required_assurance_ready(gate: dict) -> bool:
    assurance = gate.get("assurance")
    if not isinstance(assurance, dict):
        return False
    for name in ("review", "verification"):
        record = assurance.get(name)
        if not isinstance(record, dict):
            return False
        if record.get("required") is not True:
            return False
        if record.get("status") != "READY" or record.get("verdict") != "READY":
            return False
    return True


def required_critic_ready(gate: dict) -> bool:
    critic = gate.get("critic")
    return (
        isinstance(critic, dict)
        and critic.get("required") is True
        and critic.get("status") == "READY"
        and critic.get("verdict") in {"APPROVE", "SUPPLEMENT"}
    )


def resolved_critic_for_publication(gate: dict) -> bool:
    critic = gate.get("critic")
    if not isinstance(critic, dict) or critic.get("required") is not True:
        return False
    if critic.get("status") == "READY":
        return critic.get("verdict") in {"APPROVE", "SUPPLEMENT"}
    return (
        critic.get("status") == "SKIPPED"
        and critic.get("verdict") == "SKIPPED"
        and isinstance(critic.get("skip_reason"), str)
        and bool(critic["skip_reason"].strip())
    )


def _committed_report(root: Path, report: str) -> tuple[dict[str, str], list[str]] | None:
    if not isinstance(report, str):
        return None
    parts = report.replace("\\", "/").split("/")
    if len(parts) < 3 or parts[:2] != ["docs", "reports"] or ".." in parts or report.startswith("/"):
        return None
    candidate = (root / report).resolve()
    try:
        candidate.relative_to((root / "docs" / "reports").resolve())
        content = candidate.read_bytes()
        lines = content.decode("utf-8").splitlines()
    except (OSError, ValueError, UnicodeError):
        return None
    if git_bytes_optional(root, "show", f"HEAD:{report}") != content or not lines or lines[0] != "---":
        return None
    metadata: dict[str, str] = {}
    for line in lines[1:]:
        if line == "---":
            return metadata, lines
        if ": " not in line:
            return None
        key, value = line.split(": ", 1)
        if not key or not value.strip() or key in metadata:
            return None
        metadata[key] = value.strip()
    return None


def _report_metadata_matches(metadata: dict[str, str], expected: dict[str, str]) -> bool:
    return all(metadata.get(key) == value for key, value in expected.items())


def critic_disposition_evidence(gate: dict, root: Path) -> bool:
    if not resolved_critic_for_publication(gate):
        return False
    critic = gate["critic"]
    result = _committed_report(root, critic.get("report", ""))
    specification = gate.get("specification")
    if result is None or not isinstance(specification, dict):
        return False
    metadata, _ = result
    expected = {
        "artifact_type": "critic_disposition",
        "work_block_id": gate.get("work_block_id"),
        "specification": specification.get("path"),
        "revision": specification.get("revision"),
        "frozen_candidate": gate.get("frozen_revision"),
        "status": critic["status"],
        "verdict": critic["verdict"],
    }
    if any(not isinstance(value, str) or not value for value in expected.values()):
        return False
    if critic["status"] == "SKIPPED":
        expected["skip_reason"] = critic["skip_reason"].strip()
    return _report_metadata_matches(metadata, expected)


def _candidate_path_matches(relative: str, write_set: list[str]) -> bool:
    for raw in write_set:
        if not isinstance(raw, str):
            return False
        pattern = raw.strip().replace("\\", "/")
        if pattern.startswith("./"):
            pattern = pattern[2:]
        if pattern.endswith("/**"):
            prefix = pattern[:-3].rstrip("/")
            if relative == prefix or relative.startswith(f"{prefix}/"):
                return True
        elif relative == pattern or fnmatch.fnmatchcase(relative, pattern):
            return True
    return False


def _candidate_digest(entries: list[tuple[str, bytes, bytes]]) -> str:
    if not entries:
        return ""
    digest = hashlib.sha256()
    for relative, kind, content in sorted(entries):
        path = relative.encode("utf-8", errors="surrogateescape")
        digest.update(len(path).to_bytes(8, "big"))
        digest.update(path)
        digest.update(len(kind).to_bytes(8, "big"))
        digest.update(kind)
        digest.update(len(content).to_bytes(8, "big"))
        digest.update(content)
    return f"content-sha256:{digest.hexdigest()}"


def frozen_candidate_matches_head(gate: dict, root: Path) -> bool:
    """Bind the frozen worktree bytes and pushed HEAD to the same legacy identity."""
    revision = gate.get("frozen_revision")
    write_set = gate.get("write_set")
    if not isinstance(revision, str) or re.fullmatch(r"content-sha256:[0-9a-f]{64}", revision) is None:
        return False
    if not isinstance(write_set, list) or not write_set or any(not isinstance(p, str) or not p.strip() for p in write_set):
        return False
    worktree: list[tuple[str, bytes, bytes]] = []
    for current, directories, files in os.walk(root, topdown=True, followlinks=False):
        here = Path(current)
        directories[:] = [name for name in directories if name != ".git"]
        symlink_directories = [name for name in directories if (here / name).is_symlink()]
        for name in files + symlink_directories:
            path = here / name
            relative = path.relative_to(root).as_posix()
            if relative == ".agent/active-work-block.json" or not _candidate_path_matches(relative, write_set):
                continue
            try:
                if path.is_symlink():
                    worktree.append((relative, b"symlink", os.readlink(path).encode("utf-8", errors="surrogateescape")))
                elif path.is_file():
                    worktree.append((relative, b"file", path.read_bytes()))
            except OSError:
                return False
    if _candidate_digest(worktree) != revision:
        return False
    tree = git_bytes_optional(root, "ls-tree", "-r", "-z", "HEAD")
    if tree is None:
        return False
    committed: list[tuple[str, bytes, bytes]] = []
    for record in tree.split(b"\0"):
        if not record:
            continue
        try:
            metadata, raw_relative = record.split(b"\t", 1)
            mode, kind, object_id = metadata.split(b" ")
            relative = raw_relative.decode("utf-8", errors="surrogateescape")
        except ValueError:
            return False
        if relative == ".agent/active-work-block.json" or not _candidate_path_matches(relative, write_set):
            continue
        if kind != b"blob":
            return False
        content = git_bytes_optional(root, "cat-file", "blob", object_id.decode("ascii"))
        if content is None:
            return False
        committed.append((relative, b"symlink" if mode == b"120000" else b"file", content))
    return _candidate_digest(committed) == revision


def assured_candidate_evidence(gate: dict, root: Path) -> bool:
    assurance = gate.get("assurance")
    if not required_assurance_ready(gate) or not isinstance(assurance, dict):
        return False
    revision = gate.get("frozen_revision")
    ids: set[str] = set()
    contexts: set[str] = set()
    for name, prefix in (("review", "review_result"), ("verification", "verification_result")):
        record = assurance[name]
        if record.get("work_block_id") != gate.get("work_block_id") or record.get("candidate_revision") != revision:
            return False
        for key in ("execution_id", "context_id", "report"):
            if not isinstance(record.get(key), str) or not record[key].strip():
                return False
        if record.get("isolation") not in {"separate_context", "native-separate-context"}:
            return False
        ids.add(record["execution_id"])
        contexts.add(record["context_id"])
        result = _committed_report(root, record["report"])
        specification = gate.get("specification")
        if result is None or not isinstance(specification, dict):
            return False
        metadata, lines = result
        expected_metadata = {
            "artifact_type": "reviewer_report" if name == "review" else "verifier_report",
            "work_block_id": gate.get("work_block_id"),
            "specification": specification.get("path"),
            "revision": specification.get("revision"),
            "frozen_candidate": revision,
            "status": "READY",
            "verdict": "READY",
            "execution_id": record["execution_id"],
            "context_id": record["context_id"],
        }
        if any(not isinstance(value, str) or not value for value in expected_metadata.values()):
            return False
        if not _report_metadata_matches(metadata, expected_metadata):
            return False
        expected = f"{prefix}: execution_id={record['execution_id']} candidate={revision} verdict=READY"
        if [line.strip() for line in lines if line.strip().startswith(f"{prefix}:")] != [expected]:
            return False
    return len(ids) == 2 and len(contexts) == 2


def define_quality_ready(gate: dict) -> bool:
    profile = str(gate.get("governance_profile") or "").strip()
    quality = gate.get("define_quality")
    if not isinstance(quality, dict):
        return profile not in {"Managed", "Assured", "Distributed"}
    if quality.get("required") is not True:
        return profile not in {"Managed", "Assured", "Distributed"}
    return quality.get("status") == "READY" and all(
        isinstance(quality.get(name), str) and quality[name].strip()
        for name in ("requirements_review", "traceability", "consistency_analysis")
    )


def canonical_terminal_inactive(
    gate: dict, root: Path | None = None, revision: str = "HEAD"
) -> bool:
    """Require the exact repository template plus only the closeout note."""
    if not isinstance(gate, dict):
        return False
    template_root = (root or Path(__file__).resolve().parents[2]).resolve()
    template_text = git_optional(
        template_root, "show", f"{revision}:.agent/active-work-block.default.json"
    )
    if template_text is None:
        return False
    try:
        template = json.loads(template_text)
    except json.JSONDecodeError:
        return False
    if not isinstance(template, dict):
        return False
    if set(gate) != set(template) | {"lifecycle_note"}:
        return False
    for key, expected in template.items():
        if key == "closeout_mode":
            if gate.get(key) != "success-closeout":
                return False
        elif gate.get(key) != expected:
            return False
    note = gate.get("lifecycle_note")
    return isinstance(note, str) and bool(note.strip())


def commit_work_block_id(root: Path, revision: str) -> str:
    message = git(root, "show", "-s", "--format=%B", revision)
    matches = TERMINAL_WORK_BLOCK.findall(message)
    return matches[0] if len(matches) == 1 else ""


def terminal_diff_allowed(
    root: Path, parent_revision: str = "", parent_state: dict | None = None,
) -> bool:
    paths = git_optional(
        root, "diff-tree", "--no-commit-id", "--name-only", "-r", "HEAD"
    )
    if paths is None:
        return False
    changed = [path for path in paths.splitlines() if path]
    if not changed or parent_state is None or not parent_revision:
        return False
    bound = terminal_projection(root, parent_revision, parent_state)
    if bound is None:
        return False
    allowed = TERMINAL_CLOSEOUT_PATHS | set(bound)
    return set(bound).issubset(changed) and all(path in allowed for path in changed)


def terminal_closeout_push_allowed(command: str, gate: dict, root: Path) -> bool:
    """Allow only the one committed active-to-inactive closeout transition."""
    if not canonical_terminal_inactive(gate, root):
        return False
    current = current_branch(root)
    configured_default = default_branch(root)
    if not current or not configured_default or current == configured_default:
        return False
    commands = shell_command_segments(command)
    if commands is None or len(commands) != 1:
        return False
    argv = commands[0]
    refspec = f"HEAD:refs/heads/{current}"
    if argv != ["git", "push", "origin", refspec]:
        return False
    segments = push_segments(command)
    if len(segments) != 1:
        return False
    tokens, positional = parse_push_segment(segments[0])
    if tokens != ["origin", refspec] or positional != ["origin", refspec]:
        return False
    try:
        parents = git(root, "rev-list", "--parents", "-n", "1", "HEAD").split()
        parent = parents[1] if len(parents) == 2 else ""
        child_state = json.loads(git(root, "show", "HEAD:.agent/active-work-block.json"))
        parent_state = json.loads(git(root, "show", f"{parent}:.agent/active-work-block.json"))
    except (json.JSONDecodeError, IndexError, TypeError):
        return False
    if not parent or not isinstance(child_state, dict) or not isinstance(parent_state, dict):
        return False
    work_block_id = str(parent_state.get("work_block_id") or "").strip()
    if not work_block_id or not canonical_terminal_inactive(child_state, root):
        return False
    if parent_state.get("schema_version") != 3 or parent_state.get("authority_mode") != "github_capability":
        return False
    if str(parent_state.get("subject_branch") or "").strip() != current:
        return False
    parent_write_gate = parent_state.get("write_gate")
    if not isinstance(parent_write_gate, dict) or parent_write_gate.get("status") != "READY":
        return False
    if (
        not define_quality_ready(parent_state)
        or not required_critic_ready(parent_state)
        or not required_assurance_ready(parent_state)
    ):
        return False
    return (
        commit_work_block_id(root, parent) == work_block_id
        and commit_work_block_id(root, "HEAD") == work_block_id
        and terminal_diff_allowed(root, parent, parent_state)
    )


def autonomous_subject_push_allowed(command: str, gate: dict, root: Path) -> bool:
    """Allow only a fully explicit, assured push of this Work Block's HEAD."""
    commands = shell_command_segments(command)
    if commands is None or len(commands) != 1:
        return False
    argv = commands[0]
    if len(argv) != 4 or argv[:3] != ["git", "push", "origin"]:
        return False
    if terminal_closeout_push_allowed(command, gate, root):
        return True
    segments = push_segments(command)
    if len(segments) != 1:
        return False
    tokens, positional = parse_push_segment(segments[0])
    if not tokens or any(token.startswith("-") for token in tokens):
        return False
    if len(positional) != 2 or positional[0] != "origin":
        return False
    if gate.get("schema_version") != 3 or gate.get("authority_mode") != "github_capability":
        return False
    write_gate = gate.get("write_gate")
    if not isinstance(write_gate, dict) or write_gate.get("status") != "BLOCKED":
        return False
    if (
        not define_quality_ready(gate)
        or not critic_disposition_evidence(gate, root)
        or not assured_candidate_evidence(gate, root)
        or not frozen_candidate_matches_head(gate, root)
    ):
        return False
    if topology_applicable(gate):
        try:
            validate_topology(gate, phase="closeout", root=root)
        except TopologyError:
            return False
    subject = str(gate.get("subject_branch") or "").strip()
    configured_default = default_branch(root)
    if not subject or not configured_default or subject == configured_default:
        return False
    if current_branch(root) != subject:
        return False
    refspec = f"HEAD:refs/heads/{subject}"
    return (
        positional[1] == refspec
        and argv[3] == refspec
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


def require_integration(gate: dict, integration_id: str) -> None:
    integrations = gate.get("integrations")
    if not isinstance(integrations, dict):
        deny(f"External runtime {integration_id!r} is not admitted.")
    allowed = integrations.get("approved")
    records = integrations.get("admission_records")
    if not isinstance(allowed, list) or integration_id not in allowed:
        deny(f"External runtime invocation requires integrations.approved to contain {integration_id!r}.")
    if not isinstance(records, list) or not any(isinstance(v, str) and v.strip() for v in records):
        deny("External runtime invocation requires a concrete admission evidence path.")


def check_command(command: str, gate: dict, root: Path) -> None:
    for integration_id in runtime_invocations(command):
        require_integration(gate, integration_id)

    if recursive_rm(command):
        deny("Destructive recursive rm is outside the normal agent capability boundary.")
    if force_push(command):
        deny("Force push is outside the normal agent capability boundary.")
    if destructive_or_broad_push(command):
        deny("Broad or destructive remote push is outside the normal agent capability boundary.")
    if tag_publish(command):
        deny("External tag publication is outside the normal agent capability boundary.")
    if wrapped_push_invocation(command):
        deny("Wrapped Git push commands are outside the literal subject-publication allowance.")
    if push_segments(command):
        if pushes_default_branch(command, root):
            deny("Direct default-branch push is outside the normal agent capability boundary.")
        if autonomous_subject_push_allowed(command, gate, root):
            return
        deny(
            "Remote source publication requires literal non-force HEAD to the exact subject branch, "
            "an unchanged frozen candidate committed at HEAD, resolved Critic (READY or reasoned SKIPPED), "
            "and candidate-bound READY Reviewer/Verifier; all other publication remains Owner-controlled."
        )

    for pattern, label in CONSEQUENTIAL:
        if pattern.search(command):
            deny(f"{label} is outside the normal agent capability boundary; use an externally Owner-controlled channel.")


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
