"""Runtime-neutral Work Block policy evaluator."""

from __future__ import annotations

import fnmatch
from dataclasses import dataclass, field
from pathlib import Path, PurePosixPath
from typing import Any, Mapping

from .clock import Clock, utc_now
from .errors import ControllerError, ValidationError
from .evidence import require_fresh_capability
from .recovery import validate_canonical_inactive

SUPPORTED_AUTHORITY_RUNTIMES = {"codex", "claude"}


@dataclass(frozen=True)
class NormalizedEvent:
    runtime: str
    operation: str
    tool: str
    repository_root: str
    paths: tuple[str, ...] = ()
    metadata: Mapping[str, Any] = field(default_factory=dict)


@dataclass(frozen=True)
class PolicyDecision:
    allowed: bool
    reason: str
    code: str

    @classmethod
    def allow(cls, reason: str = "canonical evaluator allowed operation") -> "PolicyDecision":
        return cls(True, reason, "ALLOW")

    @classmethod
    def deny(cls, code: str, reason: str) -> "PolicyDecision":
        return cls(False, reason, code)


def _normalize_path(root: Path, raw: str) -> str:
    if raw == "__UNKNOWN_WRITE_PATH__":
        raise ValidationError("write path cannot be determined")
    path = Path(raw)
    root = root.resolve()
    candidate = path if path.is_absolute() else root / Path(PurePosixPath(raw))
    try:
        relative = candidate.resolve(strict=False).relative_to(root)
    except (OSError, RuntimeError, ValueError) as exc:
        raise ValidationError("write path is outside repository or cannot be resolved safely") from exc
    value = relative.as_posix()
    parts = PurePosixPath(value).parts
    if not value or value == "." or ".." in parts:
        raise ValidationError("write path is not a normalized repository-relative path")
    return value[2:] if value.startswith("./") else value


def _matches(path: str, patterns: object) -> bool:
    if not isinstance(patterns, list):
        return False
    for raw in patterns:
        if not isinstance(raw, str) or not raw:
            continue
        pattern = raw.replace("\\", "/").removeprefix("./")
        if pattern.endswith("/**"):
            prefix = pattern[:-3].rstrip("/")
            if path == prefix or path.startswith(f"{prefix}/"):
                return True
        elif path == pattern or fnmatch.fnmatchcase(path, pattern):
            return True
    return False


def evaluate(
    event: NormalizedEvent,
    state: Mapping[str, object],
    *,
    clock: Clock = utc_now,
) -> PolicyDecision:
    """Return the sole authority-bearing Work Block policy decision."""
    if event.runtime not in SUPPORTED_AUTHORITY_RUNTIMES:
        return PolicyDecision.deny(
            "RUNTIME_PARITY_UNVERIFIED",
            "runtime has no verified authority-bearing write interception",
        )
    if event.operation == "read":
        return PolicyDecision.allow("read-only operation")
    if event.operation == "lifecycle_transition":
        operation = event.metadata.get("lifecycle_operation")
        if operation == "open":
            try:
                validate_canonical_inactive(state)
            except ValidationError:
                return PolicyDecision.deny("OPEN_STATE_INVALID", "open requires canonical inactive authority")
            return PolicyDecision.allow("canonical lifecycle CLI owns v1 admission semantics")
        if state.get("lifecycle_status") != "ACTIVE":
            return PolicyDecision.deny("LIFECYCLE_STATE_INVALID", "transition requires active authority")
        binding = state.get("controller_binding")
        if not isinstance(binding, dict) or binding.get("generation") != "v1":
            return PolicyDecision.deny("CONTROLLER_BINDING_MISMATCH", "active Work Block is not bound to v1")
        if state.get("repository_root") != event.repository_root:
            return PolicyDecision.deny("ROOT_MISMATCH", "event repository root does not match authority")
        return PolicyDecision.allow("canonical lifecycle CLI owns transition validation and atomic persistence")
    binding = state.get("controller_binding")
    if not isinstance(binding, dict) or binding.get("generation") != "v1":
        return PolicyDecision.deny("CONTROLLER_BINDING_MISMATCH", "active Work Block is not bound to v1")
    if state.get("repository_root") != event.repository_root:
        return PolicyDecision.deny("ROOT_MISMATCH", "event repository root does not match authority")

    if event.operation == "native_dispatch":
        try:
            capability = state.get("capability")
            if not isinstance(capability, dict):
                raise ValidationError("native capability evidence is missing")
            require_fresh_capability(
                capability,
                expected_work_block_id=str(state.get("work_block_id") or ""),
                expected_root=event.repository_root,
                clock=clock,
            )
        except ControllerError as exc:
            return PolicyDecision.deny("CAPABILITY_NOT_FRESH", str(exc))
        return PolicyDecision.allow("fresh native capability permits new dispatch")

    if event.operation != "write":
        return PolicyDecision.deny("UNKNOWN_OPERATION", "operation is not recognized")
    if state.get("lifecycle_status") != "ACTIVE" or state.get("lifecycle_phase") != "Execute":
        return PolicyDecision.deny("WRITE_PHASE_BLOCKED", "source writes require active Execute phase")
    write_gate = state.get("write_gate")
    if not isinstance(write_gate, dict) or write_gate.get("status") != "READY":
        return PolicyDecision.deny("WRITE_GATE_BLOCKED", "source write gate is not READY")
    if not event.paths:
        return PolicyDecision.deny("WRITE_PATH_MISSING", "write operation has no resolved target")
    try:
        normalized = tuple(_normalize_path(Path(event.repository_root), path) for path in event.paths)
    except ValidationError as exc:
        return PolicyDecision.deny("WRITE_PATH_INVALID", str(exc))
    denied = [path for path in normalized if not _matches(path, state.get("write_set"))]
    if denied:
        return PolicyDecision.deny(
            "WRITE_SET_DENIED",
            f"path is outside admitted write-set: {denied[0]}",
        )
    return PolicyDecision.allow("all write targets are within the admitted write-set")


def compose(outer: PolicyDecision, canonical: PolicyDecision) -> PolicyDecision:
    """Monotonic deny-only composition; neither layer can weaken the other."""
    if not outer.allowed:
        return outer
    if not canonical.allowed:
        return canonical
    return PolicyDecision.allow("outer hard-stop and canonical evaluator both allow")
