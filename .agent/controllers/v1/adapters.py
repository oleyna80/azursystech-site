"""Thin Claude/Codex runtime normalization over the shared controller policy."""

from __future__ import annotations

import re
from collections.abc import Mapping
from pathlib import Path, PurePosixPath

from . import gitfacts
from .errors import ValidationError
from .events import Decision, Event, decision, validate as validate_event

PATCH_PATH = re.compile(
    r"^\*\*\*\s+(?:Add|Update|Delete)\s+File:\s+(.+?)\s*$",
    re.MULTILINE,
)
PATCH_MOVE = re.compile(r"^\*\*\*\s+Move to:\s+(.+?)\s*$", re.MULTILINE)

STRUCTURED_PATH_TOOLS = {
    "write": "write",
    "write_file": "write",
    "edit": "edit",
    "multiedit": "edit",
}
PATCH_TOOLS = {"apply_patch", "applypatch"}


def _runtime(value: str) -> str:
    runtime = value.lower()
    if runtime not in {"claude", "codex"}:
        raise ValidationError("unsupported runtime adapter")
    return runtime


def resolve_worktree(raw: Mapping[str, object], *, controller_root: Path) -> tuple[Path, str]:
    """Resolve target worktree only from native event cwd and verify common repository."""

    cwd = raw.get("cwd")
    if not isinstance(cwd, str) or not cwd:
        raise ValidationError("runtime event is missing absolute cwd")
    start = Path(cwd)
    if not start.is_absolute():
        raise ValidationError("runtime event cwd must be absolute")

    target = gitfacts.worktree_root(start)
    installed = gitfacts.worktree_root(controller_root)
    if gitfacts.common_git_dir(target) != gitfacts.common_git_dir(installed):
        raise ValidationError("runtime target belongs to a different Git common repository")
    return target, gitfacts.branch(target)


def _repo_path(value: object, root: Path) -> str:
    if not isinstance(value, str) or not value.strip():
        raise ValidationError("structured mutation is missing exact repository path")
    raw = value.strip()
    if "\\" in raw:
        raise ValidationError("structured mutation path must use POSIX separators")

    candidate = Path(raw)
    if candidate.is_absolute():
        try:
            relative = candidate.resolve(strict=False).relative_to(root)
        except (OSError, ValueError) as exc:
            raise ValidationError("structured mutation path is outside target worktree") from exc
        raw = relative.as_posix()

    pure = PurePosixPath(raw)
    if pure.is_absolute() or any(part in {"", ".", ".."} for part in pure.parts):
        raise ValidationError("structured mutation path is unsafe")
    normalized = pure.as_posix()
    if normalized.startswith("./"):
        normalized = normalized[2:]
    if not normalized or normalized == "." or any(ch in normalized for ch in "*?[]"):
        raise ValidationError("structured mutation path is not exact")
    return normalized


def _event(
    runtime: str,
    kind: str,
    root: Path,
    branch: str | None,
    paths: list[str],
    facts: dict[str, object],
) -> Event:
    return validate_event(
        {
            "event_version": 1,
            "source": runtime,
            "kind": kind,
            "worktree_root": str(root),
            "branch": branch,
            "paths": sorted(set(paths)),
            "facts": facts,
        }
    )


def _structured_paths(tool: str, payload: Mapping[str, object], root: Path) -> tuple[list[str], str]:
    name = tool.lower()
    if name in STRUCTURED_PATH_TOOLS:
        raw_path = payload.get("file_path")
        if raw_path is None:
            raw_path = payload.get("path")
        return [_repo_path(raw_path, root)], STRUCTURED_PATH_TOOLS[name]

    if name in PATCH_TOOLS:
        patch = payload.get("command")
        if patch is None:
            patch = payload.get("patch")
        if patch is None:
            patch = payload.get("input")
        if not isinstance(patch, str) or not patch:
            raise ValidationError("structured patch is missing native patch payload")
        raw_paths = PATCH_PATH.findall(patch) + PATCH_MOVE.findall(patch)
        if not raw_paths:
            raise ValidationError("structured patch exposes no exact target path")
        return [_repo_path(path, root) for path in raw_paths], "patch"

    raise KeyError(name)


def normalize_pre_tool(
    runtime: str,
    raw: Mapping[str, object],
    *,
    controller_root: Path,
) -> Event:
    """Normalize only supported structured mutation tools; never parse shell effects."""

    runtime = _runtime(runtime)
    if not isinstance(raw, Mapping):
        raise ValidationError("runtime event must be an object")
    root, branch = resolve_worktree(raw, controller_root=controller_root)

    tool = raw.get("tool_name")
    payload = raw.get("tool_input")
    if not isinstance(tool, str) or not tool:
        raise ValidationError("PreToolUse event is missing tool_name")
    if not isinstance(payload, Mapping):
        raise ValidationError("PreToolUse event tool_input must be an object")

    try:
        paths, tool_class = _structured_paths(tool, payload, root)
    except KeyError:
        # Opaque/non-structured tools (including Bash) carry no inferred authority facts.
        return _event(runtime, "diagnostic", root, None, [], {})

    return _event(
        runtime,
        "structured_write",
        root,
        branch,
        paths,
        {"tool_class": tool_class},
    )


def normalize_subagent(
    runtime: str,
    raw: Mapping[str, object],
    *,
    controller_root: Path,
) -> Event:
    runtime = _runtime(runtime)
    if not isinstance(raw, Mapping):
        raise ValidationError("SubagentStart event must be an object")
    root, branch = resolve_worktree(raw, controller_root=controller_root)
    return _event(runtime, "subagent_context", root, branch, [], {})


def normalize(
    runtime: str,
    raw: Mapping[str, object],
    *,
    controller_root: Path,
    event_name: str = "PreToolUse",
) -> Event:
    if event_name == "SubagentStart":
        return normalize_subagent(runtime, raw, controller_root=controller_root)
    if event_name != "PreToolUse":
        raise ValidationError("unsupported runtime hook event")
    return normalize_pre_tool(runtime, raw, controller_root=controller_root)


def pre_tool_response(runtime: str, result: Decision) -> dict:
    _runtime(runtime)
    return {
        "hookSpecificOutput": {
            "hookEventName": "PreToolUse",
            "permissionDecision": "allow" if result.allowed else "deny",
            "permissionDecisionReason": f"{result.code}: {result.reason}",
        }
    }


def _context_text(state: dict | None, result: Decision) -> str:
    if state is None:
        return (
            "Controller context only; no local Work Block authority state is present. "
            f"Policy context: {result.code}."
        )
    lifecycle = state.get("lifecycle_state")
    active = state.get("active") if isinstance(state, dict) else None
    if lifecycle == "INACTIVE" or not isinstance(active, dict):
        return (
            "Controller context only; lifecycle is INACTIVE and no active Work Block "
            f"authority is granted. Policy context: {result.code}."
        )
    return (
        "Controller context only; this does not grant or expand authority. "
        f"Work Block={active.get('work_block_id')}; lifecycle={lifecycle}; "
        f"initiative={active.get('initiative_ref')}; subject_branch={active.get('subject_branch')}; "
        f"implementation_write_set={active.get('implementation_write_set')}; "
        f"coordination_scope={active.get('coordination_scope')}."
    )


def subagent_response(runtime: str, state: dict | None, result: Decision) -> dict:
    _runtime(runtime)
    return {
        "hookSpecificOutput": {
            "hookEventName": "SubagentStart",
            "additionalContext": _context_text(state, result),
        }
    }


def response(
    runtime: str,
    event_name: str,
    result: Decision,
    *,
    state: dict | None = None,
) -> dict:
    if event_name == "SubagentStart":
        return subagent_response(runtime, state, result)
    if event_name == "PreToolUse":
        return pre_tool_response(runtime, result)
    raise ValidationError("unsupported runtime response event")
