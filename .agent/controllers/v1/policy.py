"""One runtime-neutral evaluator for Work Block writes and External Hard Stops."""

from __future__ import annotations

import fnmatch
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any, Mapping

from .errors import ControllerError, ValidationError
from .state import validate

HARD_STOPS = frozenset({
    "controller_activation", "controller_materialization", "live_control_change",
    "protected_branch", "default_branch", "merge", "deploy", "force_push",
    "credentials", "live_data", "infrastructure", "governance_override",
    "destructive", "client_communications", "release", "unknown_effect",
})
LIVE_PATHS = (
    ".agent/hooks/", ".codex/", ".claude/", ".agent/active-work-block.default.json",
    ".agent/controller-manifest.json", "governance/",
)
LIVE_ROOTS = frozenset({".agent/hooks", ".codex", ".claude", "governance"})


@dataclass(frozen=True)
class Event:
    runtime: str
    operation: str
    repository_root: str
    branch: str
    paths: tuple[str, ...] = ()
    effect: str = ""
    metadata: Mapping[str, Any] = field(default_factory=dict)


@dataclass(frozen=True)
class Decision:
    allowed: bool
    reason: str

    @property
    def code(self) -> str:
        return "ALLOW" if self.allowed else "DENY"


def _path(root: str, raw: str) -> str:
    if not isinstance(raw, str) or not raw or raw == "__UNKNOWN_WRITE_PATH__":
        raise ValidationError("write path is unknown")
    base = Path(root).resolve()
    target = (base / raw).resolve(strict=False)
    try:
        relative = target.relative_to(base).as_posix()
    except ValueError as exc:
        raise ValidationError("write path escapes repository") from exc
    if relative in {"", "."}:
        raise ValidationError("write path is repository root")
    return relative


def _matches(path: str, patterns: list[str]) -> bool:
    for pattern in patterns:
        if pattern.endswith("/**"):
            prefix = pattern[:-3]
            if path.startswith(prefix + "/"):
                return True
        elif path == pattern or fnmatch.fnmatchcase(path, pattern):
            return True
    return False


def evaluate(event: Event, state: dict) -> Decision:
    """Single canonical decision. Malformed inputs fail closed."""
    try:
        validate(state)
        if event.runtime not in {"codex", "claude"} or not event.repository_root or not event.branch:
            return Decision(False, "runtime or repository binding is unknown")
        if event.effect in HARD_STOPS:
            return Decision(False, f"External Hard Stop: {event.effect}")
        if event.effect:
            return Decision(False, "unknown side effect")
        if event.operation == "read":
            return Decision(True, "read-only operation")
        active = state["active"]
        if event.operation == "lifecycle":
            command = event.metadata.get("command", "")
            if not isinstance(command, str) or not command.startswith(("python -m v1.cli ", "python3 -m v1.cli ")):
                return Decision(False, "lifecycle command is ambiguous")
            if active is not None and event.branch != active["subject_branch"]:
                return Decision(False, "lifecycle branch mismatch")
            return Decision(True, "CLI validates and persists lifecycle transition")
        if active is None or state["lifecycle_state"] not in {"DEFINE", "EXECUTE", "ASSURE"}:
            return Decision(False, "active Work Block required")
        if event.branch != active["subject_branch"]:
            return Decision(False, "current branch differs from subject branch")
        if event.operation == "write":
            if state["lifecycle_state"] != "EXECUTE" or active["write_gate"] != "READY":
                return Decision(False, "source write requires EXECUTE and READY gate")
            if not event.paths:
                return Decision(False, "write targets are unknown")
            paths = tuple(_path(event.repository_root, value) for value in event.paths)
            if any(path.startswith(LIVE_PATHS) or path in LIVE_ROOTS or path in LIVE_PATHS for path in paths):
                return Decision(False, "live control surface is outside inert source work")
            if any(path.startswith(".agent/controllers/v1/activation/") for path in paths):
                return Decision(False, "activation staging is not inert source work")
            if any(not _matches(path, active["write_set"]) for path in paths):
                return Decision(False, "write target outside admitted write-set")
            return Decision(True, "all writes are within admitted write-set")
        if event.operation == "push":
            from .evidence import require_success
            if state["lifecycle_state"] != "ASSURE" or active["write_gate"] != "READY":
                return Decision(False, "publication requires assured candidate")
            # These facts must come from a trusted future wrapper, not command text.
            default_branch = event.metadata.get("default_branch")
            if (not isinstance(default_branch, str) or not default_branch
                    or event.metadata.get("subject_branch_is_protected") is not False
                    or active["subject_branch"] == default_branch):
                return Decision(False, "default or protected branch status is unsafe or unknown")
            exact = f"git push origin HEAD:refs/heads/{active['subject_branch']}"
            if event.metadata.get("command") != exact:
                return Decision(False, "push must be exact sole subject-branch refspec")
            if event.metadata.get("head_tree") != active["candidate_id"]:
                return Decision(False, "HEAD tree differs from assured candidate")
            require_success(active)
            return Decision(True, "exact assured non-force subject-branch publication")
        return Decision(False, "operation is unknown")
    except (ControllerError, ValueError, TypeError, KeyError) as exc:
        return Decision(False, f"invalid state or event: {exc}")
