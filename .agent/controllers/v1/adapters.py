"""Thin Claude/Codex runtime adapters for normalized controller events.

Runtime adapters extract only native structured facts. They never infer write
authority from shell text.
"""

from __future__ import annotations

import re
from collections.abc import Mapping
from pathlib import Path, PurePosixPath

from . import gitfacts
from .errors import StopAndPreserve, ValidationError
from .events import Decision, Event, validate as validate_event
from .policy import evaluate

PATCH_PATH = re.compile(r"^\*\*\*\s+(?:Add|Update|Delete)\s+File:\s+(.+?)\s*$", re.M)
PATCH_MOVE = re.compile(r"^\*\*\*\s+Move to:\s+(.+?)\s*$", re.M)

WRITE_TOOLS = frozenset({"write", "write_file"})
EDIT_TOOLS = frozenset({"edit", "multiedit"})
PATCH_TOOLS = frozenset({"apply_patch", "applypatch"})


class AdapterDenied(ValidationError):
    """Native event cannot be normalized into trusted authority facts."""


def _context(raw: Mapping[str, object]) -> tuple[Path, Path]:
    cwd_raw = raw.get("cwd")
    if not isinstance(cwd_raw, str) or not cwd_raw:
        raise AdapterDenied("runtime event is missing cwd")
    try:
        cwd = Path(cwd_raw).resolve(strict=True)
    except OSError as exc:
        raise AdapterDenied("runtime cwd cannot be resolved") from exc
    root = gitfacts.worktree_root(cwd)
    return root, cwd


def _repo_path(root: Path, cwd: Path, raw: object) -> str:
    if not isinstance(raw, str) or raw == "":
        raise AdapterDenied("structured mutation is missing exact target path")
    if raw != raw.strip():
        raise AdapterDenied("structured mutation path has ambiguous leading/trailing whitespace")

    native = Path(raw)
    candidate = native if native.is_absolute() else cwd / native
    try:
        resolved = candidate.resolve(strict=False)
        relative = resolved.relative_to(root)
    except (OSError, ValueError) as exc:
        raise AdapterDenied("structured mutation path resolves outside target worktree") from exc

    pure = PurePosixPath(relative.as_posix())
    if not pure.parts or any(part in {"", ".", ".."} for part in pure.parts):
        raise AdapterDenied("structured mutation path is unsafe")
    normalized = pure.as_posix()
    if any(ch in normalized for ch in "*?[]"):
        raise AdapterDenied("structured mutation path must be exact")
    return normalized


def _payload(raw: Mapping[str, object]) -> tuple[str, Mapping[str, object]]:
    tool = raw.get("tool_name") or raw.get("tool")
    payload = raw.get("tool_input") or raw.get("input") or raw.get("parameters")
    if not isinstance(tool, str) or not isinstance(payload, Mapping):
        raise AdapterDenied("runtime event lacks structured tool payload")
    return tool.lower(), payload


def _single_path(payload: Mapping[str, object], root: Path, cwd: Path) -> tuple[str, ...]:
    return (_repo_path(root, cwd, payload.get("file_path") or payload.get("path")),)


def _multi_edit_paths(payload: Mapping[str, object], root: Path, cwd: Path) -> tuple[str, ...]:
    direct = payload.get("file_path") or payload.get("path")
    if isinstance(direct, str) and direct.strip():
        return (_repo_path(root, cwd, direct),)
    edits = payload.get("edits")
    if not isinstance(edits, list) or not edits:
        raise AdapterDenied("MultiEdit payload has no exact target paths")
    paths: list[str] = []
    for edit in edits:
        if not isinstance(edit, Mapping):
            raise AdapterDenied("MultiEdit entry is not structured")
        paths.append(_repo_path(root, cwd, edit.get("file_path") or edit.get("path")))
    return tuple(sorted(set(paths)))


def _patch_paths(payload: Mapping[str, object], root: Path, cwd: Path) -> tuple[str, ...]:
    patch = payload.get("command") or payload.get("patch") or payload.get("input")
    if not isinstance(patch, str):
        raise AdapterDenied("structured patch payload is missing patch text")
    raw_paths = PATCH_PATH.findall(patch) + PATCH_MOVE.findall(patch)
    if not raw_paths:
        raise AdapterDenied("structured patch exposes no exact target paths")
    return tuple(sorted({_repo_path(root, cwd, value) for value in raw_paths}))


def normalize_structured_write(runtime: str, raw: Mapping[str, object]) -> Event:
    if runtime not in {"claude", "codex"} or not isinstance(raw, Mapping):
        raise AdapterDenied("unsupported runtime")
    root, cwd = _context(raw)
    branch = gitfacts.branch(root)
    tool, payload = _payload(raw)

    if tool in WRITE_TOOLS:
        paths = _single_path(payload, root, cwd)
        tool_class = "write"
    elif tool in EDIT_TOOLS:
        paths = _multi_edit_paths(payload, root, cwd)
        tool_class = "edit"
    elif tool in PATCH_TOOLS:
        paths = _patch_paths(payload, root, cwd)
        tool_class = "patch"
    else:
        raise AdapterDenied(
            "unsupported or opaque tool is not normalized into structured-write authority"
        )

    return validate_event({
        "event_version": 1,
        "source": runtime,
        "kind": "structured_write",
        "worktree_root": str(root),
        "branch": branch,
        "paths": list(paths),
        "facts": {"tool_class": tool_class},
    })


def normalize_subagent_context(runtime: str, raw: Mapping[str, object]) -> Event:
    if runtime not in {"claude", "codex"} or not isinstance(raw, Mapping):
        raise AdapterDenied("unsupported runtime")
    root, _cwd = _context(raw)
    branch = gitfacts.branch(root)
    return validate_event({
        "event_version": 1,
        "source": runtime,
        "kind": "subagent_context",
        "worktree_root": str(root),
        "branch": branch,
        "paths": [],
        "facts": {},
    })


def decide_structured_write(
    runtime: str,
    raw: Mapping[str, object],
    state: dict | None,
    *,
    admission=None,
    repository_id: str | None = None,
) -> Decision:
    event = normalize_structured_write(runtime, raw)
    return evaluate(event, state, admission=admission, repository_id=repository_id)


def runtime_response(runtime: str, decision: Decision) -> dict:
    if runtime not in {"claude", "codex"}:
        raise AdapterDenied("unsupported runtime response target")
    payload = {
        "hookSpecificOutput": {
            "hookEventName": "PreToolUse",
            "permissionDecision": "allow" if decision.allowed else "deny",
            "permissionDecisionReason": decision.reason,
        }
    }
    return payload


def context_response(runtime: str, context: str) -> dict:
    if runtime not in {"claude", "codex"}:
        raise AdapterDenied("unsupported runtime response target")
    return {
        "hookSpecificOutput": {
            "hookEventName": "SubagentStart",
            "additionalContext": context,
        }
    }
