"""Native-role dispatch authorization distinct from immutable role provenance."""

from __future__ import annotations

from collections.abc import Mapping

from .clock import Clock, utc_now
from .errors import TransitionDenied, ValidationError
from .evidence import require_fresh_capability


def authorize_new_dispatch(
    state: Mapping[str, object],
    *,
    role: str,
    clock: Clock = utc_now,
) -> None:
    if role not in {"critic", "reviewer", "verifier"}:
        raise ValidationError("native dispatch role is invalid")
    if state.get("lifecycle_status") != "ACTIVE":
        raise TransitionDenied("native dispatch requires an active Work Block")
    capability = state.get("capability")
    if not isinstance(capability, dict):
        raise TransitionDenied("native dispatch capability is missing")
    require_fresh_capability(
        capability,
        expected_work_block_id=str(state.get("work_block_id") or ""),
        expected_root=str(state.get("repository_root") or ""),
        clock=clock,
    )


def require_unique_execution(state: Mapping[str, object], binding: Mapping[str, object]) -> None:
    execution = binding.get("execution_id")
    context = binding.get("context_id")
    if not isinstance(execution, str) or not isinstance(context, str):
        raise ValidationError("completed role binding lacks execution/context identity")
    seen_execution: set[str] = set()
    seen_context: set[str] = set()
    for value in state.get("role_provenance", []):
        if isinstance(value, dict):
            if isinstance(value.get("execution_id"), str):
                seen_execution.add(value["execution_id"])
            if isinstance(value.get("context_id"), str):
                seen_context.add(value["context_id"])
    for capability in (
        state.get("capability"),
        *(
            state.get("capability_history", [])
            if isinstance(state.get("capability_history"), list)
            else []
        ),
    ):
        if isinstance(capability, dict):
            if isinstance(capability.get("execution_id"), str):
                seen_execution.add(capability["execution_id"])
            if isinstance(capability.get("context_id"), str):
                seen_context.add(capability["context_id"])
    if execution in seen_execution or context in seen_context:
        raise TransitionDenied("role execution/context identity is replayed")


def require_unique_capability(state: Mapping[str, object], capability: Mapping[str, object]) -> None:
    """Reject reuse of any capability or completed-role execution context."""
    execution = capability.get("execution_id")
    context = capability.get("context_id")
    if not isinstance(execution, str) or not execution or not isinstance(context, str) or not context:
        raise ValidationError("capability lacks execution/context identity")
    seen_execution: set[str] = set()
    seen_context: set[str] = set()
    for value in (
        state.get("capability"),
        *(
            state.get("capability_history", [])
            if isinstance(state.get("capability_history"), list)
            else []
        ),
        *(
            state.get("role_provenance", [])
            if isinstance(state.get("role_provenance"), list)
            else []
        ),
    ):
        if not isinstance(value, dict):
            continue
        if isinstance(value.get("execution_id"), str):
            seen_execution.add(value["execution_id"])
        if isinstance(value.get("context_id"), str):
            seen_context.add(value["context_id"])
    if execution in seen_execution or context in seen_context:
        raise TransitionDenied("capability execution/context identity is replayed")
