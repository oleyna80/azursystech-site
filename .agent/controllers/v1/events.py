"""Strict normalized event and decision contracts."""

from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
from types import MappingProxyType
from typing import Any, Mapping

from .errors import ValidationError
from .state import SHA_RE, WORK_BLOCK_RE

EVENT_VERSION = 1
DECISION_VERSION = 1
SOURCES = frozenset({"claude", "codex", "git", "controller"})
KINDS = frozenset({
    "structured_write",
    "git_pre_commit",
    "git_commit_message",
    "git_pre_push",
    "subagent_context",
    "diagnostic",
})
DECISIONS = frozenset({"ALLOW", "DENY", "ADVISORY"})
ZERO_SHA = "0" * 40


@dataclass(frozen=True, slots=True)
class Event:
    event_version: int
    source: str
    kind: str
    worktree_root: str
    branch: str | None
    paths: tuple[str, ...]
    facts: Mapping[str, Any]


@dataclass(frozen=True, slots=True)
class Decision:
    decision_version: int
    decision: str
    code: str
    reason: str

    @property
    def allowed(self) -> bool:
        return self.decision == "ALLOW"

    def as_dict(self) -> dict[str, object]:
        return {
            "decision_version": self.decision_version,
            "decision": self.decision,
            "code": self.code,
            "reason": self.reason,
        }


def decision(kind: str, code: str, reason: str) -> Decision:
    if kind not in DECISIONS:
        raise ValidationError("unknown decision kind")
    if not isinstance(code, str) or not code or not code.replace("_", "").isalnum():
        raise ValidationError("invalid decision code")
    if not isinstance(reason, str) or not reason:
        raise ValidationError("invalid decision reason")
    return Decision(DECISION_VERSION, kind, code, reason)


def _path(value: object) -> str:
    if not isinstance(value, str) or not value or value.startswith("/") or "\\" in value:
        raise ValidationError("event path must be repository-relative POSIX path")
    parts = value.split("/")
    if any(part in {"", ".", ".."} for part in parts):
        raise ValidationError("event path contains unsafe segment")
    if any(ch in value for ch in "*?[]"):
        raise ValidationError("event paths are exact, not patterns")
    return value


def _sha(value: object, name: str, *, zero_allowed: bool = False) -> str:
    if not isinstance(value, str):
        raise ValidationError(f"invalid {name}")
    if zero_allowed and value == ZERO_SHA:
        return value
    if SHA_RE.fullmatch(value) is None:
        raise ValidationError(f"{name} must be full SHA")
    return value


def _facts_exact(facts: object, keys: set[str]) -> dict[str, Any]:
    if not isinstance(facts, dict) or set(facts) != keys:
        raise ValidationError("event facts schema is unknown")
    return facts


def validate(raw: Mapping[str, object]) -> Event:
    if not isinstance(raw, Mapping) or set(raw) != {
        "event_version", "source", "kind", "worktree_root", "branch", "paths", "facts"
    }:
        raise ValidationError("event envelope schema is unknown")
    if raw["event_version"] != EVENT_VERSION:
        raise ValidationError("event version is unknown")
    source = raw["source"]
    kind = raw["kind"]
    if source not in SOURCES or kind not in KINDS:
        raise ValidationError("event source or kind is unknown")
    worktree_root = raw["worktree_root"]
    if not isinstance(worktree_root, str) or not worktree_root or not Path(worktree_root).is_absolute():
        raise ValidationError("worktree_root must be absolute")
    branch = raw["branch"]
    if branch is not None and (not isinstance(branch, str) or not branch):
        raise ValidationError("invalid event branch")
    paths_value = raw["paths"]
    if not isinstance(paths_value, list):
        raise ValidationError("event paths must be list")
    paths = tuple(_path(item) for item in paths_value)
    if paths != tuple(sorted(paths)) or len(paths) != len(set(paths)):
        raise ValidationError("event paths must be sorted and duplicate-free")

    facts = raw["facts"]
    if kind == "structured_write":
        if source not in {"claude", "codex"} or not paths or branch is None:
            raise ValidationError("structured write binding is invalid")
        item = _facts_exact(facts, {"tool_class"})
        if item["tool_class"] not in {"write", "edit", "patch"}:
            raise ValidationError("tool_class is unknown")
    elif kind == "git_pre_commit":
        if source != "git" or branch is None:
            raise ValidationError("pre-commit binding is invalid")
        item = _facts_exact(facts, {"head_sha"})
        _sha(item["head_sha"], "head_sha")
    elif kind == "git_commit_message":
        if source != "git" or paths or branch is None:
            raise ValidationError("commit-message binding is invalid")
        item = _facts_exact(facts, {"work_block_trailers"})
        trailers = item["work_block_trailers"]
        if not isinstance(trailers, list) or any(
            not isinstance(x, str) or WORK_BLOCK_RE.fullmatch(x) is None for x in trailers
        ):
            raise ValidationError("work_block_trailers are invalid")
    elif kind == "git_pre_push":
        if source != "git" or paths or branch is None:
            raise ValidationError("pre-push binding is invalid")
        item = _facts_exact(
            facts, {"remote_name", "local_ref", "local_sha", "remote_ref", "remote_sha"}
        )
        for name in ("remote_name", "local_ref", "remote_ref"):
            if not isinstance(item[name], str) or not item[name]:
                raise ValidationError(f"invalid {name}")
        _sha(item["local_sha"], "local_sha", zero_allowed=True)
        _sha(item["remote_sha"], "remote_sha", zero_allowed=True)
    elif kind == "subagent_context":
        if source not in {"claude", "codex"} or paths:
            raise ValidationError("subagent context binding is invalid")
        _facts_exact(facts, set())
    elif kind == "diagnostic":
        if paths:
            raise ValidationError("diagnostic event carries no paths")
        _facts_exact(facts, set())

    return Event(
        EVENT_VERSION,
        source,
        kind,
        worktree_root,
        branch,
        paths,
        MappingProxyType(dict(facts)),
    )
