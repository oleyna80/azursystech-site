"""Future v1 role topology and dispatch binding validation."""

from __future__ import annotations

from collections.abc import Mapping

from .dispatch import authorize_new_dispatch, require_unique_execution
from .errors import TransitionDenied, ValidationError

ROLE_RESULTS = {
    "critic": {"APPROVE", "CHANGES_REQUIRED"},
    "reviewer": {"READY", "CHANGES_REQUIRED", "BLOCKED"},
    "verifier": {"READY", "BLOCKED"},
}


def require_native_topology(value: Mapping[str, object], *, role: str) -> None:
    if role not in ROLE_RESULTS:
        raise ValidationError("unsupported assurance role")
    if value.get("role") != role:
        raise ValidationError("topology role mismatch")
    if value.get("isolation") != "native-separate-context":
        raise TransitionDenied("role requires native separate-context isolation")
    if value.get("launch_mechanism") != "native-runtime-subagent":
        raise TransitionDenied("role requires the native runtime subagent mechanism")
    execution = value.get("execution_id")
    context = value.get("context_id")
    if not isinstance(execution, str) or not execution:
        raise ValidationError("topology execution_id is required")
    if not isinstance(context, str) or not context:
        raise ValidationError("topology context_id is required")


def authorize_role_dispatch(state: Mapping[str, object], dispatch: Mapping[str, object]) -> None:
    role = dispatch.get("role")
    if not isinstance(role, str):
        raise ValidationError("dispatch role is required")
    require_native_topology(dispatch, role=role)
    authorize_new_dispatch(state, role=role)
    require_unique_execution(state, dispatch)
