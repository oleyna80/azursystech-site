"""Strict normalized enforcement event and decision schemas."""

from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
from typing import Mapping

from .errors import ValidationError
from .state import SHA, canonical_exact_paths

SOURCES = frozenset({"claude", "codex", "git", "controller"})
KINDS = frozenset({
    "structured_write", "git_pre_commit", "git_commit_message", "git_pre_push",
    "subagent_context", "diagnostic",
})
DECISIONS = frozenset({"ALLOW", "DENY", "ADVISORY"})
ZERO_SHA = "0" * 40

FACT_KEYS = {
    "structured_write": frozenset({"tool_class"}),
    "git_pre_commit": frozenset({"head_sha"}),
    "git_commit_message": frozenset({"work_block_trailers"}),
    "git_pre_push": frozenset({"remote_name", "local_ref", "local_sha", "remote_ref", "remote_sha"}),
    "subagent_context": frozenset(),
    "diagnostic": frozenset(),
}


def _sha(value: object, name: str, *, allow_zero: bool = False) -> str:
    if not isinstance(value, str) or (SHA.fullmatch(value) is None and not (allow_zero and value == ZERO_SHA)):
        raise ValidationError(f"{name} must be a full lowercase Git SHA")
    return value


@dataclass(frozen=True, slots=True)
class Event:
    source: str
    kind: str
    worktree_root: str
    branch: str | None
    paths: tuple[str, ...] = ()
    facts: Mapping[str, object] | None = None
    event_version: int = 1

    def __post_init__(self) -> None:
        if self.event_version != 1:
            raise ValidationError("event_version must be 1")
        if self.source not in SOURCES or self.kind not in KINDS:
            raise ValidationError("event source/kind is unknown")
        if not isinstance(self.worktree_root, str) or not Path(self.worktree_root).is_absolute():
            raise ValidationError("worktree_root must be an absolute path")
        if self.branch is not None and (not isinstance(self.branch, str) or not self.branch):
            raise ValidationError("branch must be null or nonempty")
        canonical = canonical_exact_paths(list(self.paths), "event.paths")
        if tuple(canonical) != self.paths:
            raise ValidationError("event.paths must be sorted and duplicate-free")
        facts = {} if self.facts is None else self.facts
        if not isinstance(facts, Mapping) or set(facts) != FACT_KEYS[self.kind]:
            raise ValidationError("event facts schema is unknown")
        self._validate_kind(facts)

    def _validate_kind(self, facts: Mapping[str, object]) -> None:
        if self.kind == "structured_write":
            if self.source not in {"claude", "codex"} or not self.paths:
                raise ValidationError("structured_write requires runtime source and target paths")
            if facts["tool_class"] not in {"write", "edit", "patch"}:
                raise ValidationError("structured_write tool_class is unknown")
        elif self.kind == "git_pre_commit":
            if self.source != "git":
                raise ValidationError("git_pre_commit requires git source")
            _sha(facts["head_sha"], "head_sha")
        elif self.kind == "git_commit_message":
            if self.source != "git" or self.paths:
                raise ValidationError("git_commit_message requires git source and no paths")
            trailers = facts["work_block_trailers"]
            if not isinstance(trailers, list) or any(not isinstance(item, str) for item in trailers):
                raise ValidationError("work_block_trailers must be a list of strings")
        elif self.kind == "git_pre_push":
            if self.source != "git" or self.paths:
                raise ValidationError("git_pre_push requires git source and no paths")
            for key in ("remote_name", "local_ref", "remote_ref"):
                if not isinstance(facts[key], str) or not facts[key]:
                    raise ValidationError(f"{key} must be nonempty")
            _sha(facts["local_sha"], "local_sha", allow_zero=True)
            _sha(facts["remote_sha"], "remote_sha", allow_zero=True)
        elif self.kind == "subagent_context":
            if self.source not in {"claude", "codex"} or self.paths:
                raise ValidationError("subagent_context shape is invalid")
        elif self.kind == "diagnostic" and self.paths:
            raise ValidationError("diagnostic event cannot carry mutation paths")

    def as_dict(self) -> dict:
        return {
            "event_version": self.event_version,
            "source": self.source,
            "kind": self.kind,
            "worktree_root": self.worktree_root,
            "branch": self.branch,
            "paths": list(self.paths),
            "facts": dict(self.facts or {}),
        }

    @classmethod
    def from_dict(cls, value: object) -> "Event":
        if not isinstance(value, dict) or set(value) != {
            "event_version", "source", "kind", "worktree_root", "branch", "paths", "facts"
        }:
            raise ValidationError("event envelope schema is unknown")
        paths = value["paths"]
        if not isinstance(paths, list):
            raise ValidationError("event paths must be a list")
        return cls(
            event_version=value["event_version"], source=value["source"], kind=value["kind"],
            worktree_root=value["worktree_root"], branch=value["branch"], paths=tuple(paths),
            facts=value["facts"],
        )


@dataclass(frozen=True, slots=True)
class Decision:
    decision: str
    code: str
    reason: str
    decision_version: int = 1

    def __post_init__(self) -> None:
        if self.decision_version != 1 or self.decision not in DECISIONS:
            raise ValidationError("decision schema is invalid")
        if not isinstance(self.code, str) or not self.code or not isinstance(self.reason, str):
            raise ValidationError("decision code/reason is invalid")

    @property
    def allowed(self) -> bool:
        return self.decision == "ALLOW"

    def as_dict(self) -> dict:
        return {
            "decision_version": self.decision_version,
            "decision": self.decision,
            "code": self.code,
            "reason": self.reason,
        }
