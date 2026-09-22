"""Success and reporting-only terminal predicates for future v1-bound WBs."""

from __future__ import annotations

from collections.abc import Mapping

from .clock import Clock, utc_now
from .evidence import validate_role_provenance
from .errors import TransitionDenied, ValidationError
from .topology import require_native_topology

CANDIDATE_BINDING_FIELDS = (
    "frozen_commit",
    "frozen_tree",
    "sealed_manifest",
    "sealed_manifest_identity",
    "sealed_surface_identity",
)
DISPATCH_BINDING_FIELDS = (
    "context_id_source",
    "repository_root",
    "branch",
    "runtime",
    "adapter",
    "adapter_version",
    "isolation",
    "launch_mechanism",
)


def _slot(state: Mapping[str, object], name: str) -> Mapping[str, object]:
    assurance = state.get("assurance")
    if not isinstance(assurance, dict) or not isinstance(assurance.get(name), dict):
        raise ValidationError(f"assurance slot is missing: {name}")
    return assurance[name]


def _define_identity(state: Mapping[str, object]) -> str:
    definition = state.get("define")
    if not isinstance(definition, dict):
        raise ValidationError("active Define identity is missing")
    identity = definition.get("identity")
    if not isinstance(identity, str) or not identity:
        raise ValidationError("active Define identity is missing")
    return identity


def require_exact_assurance_binding(
    state: Mapping[str, object],
    *,
    role: str,
    expected_results: set[str] | frozenset[str],
    clock: Clock = utc_now,
) -> Mapping[str, object]:
    """Validate one completed role against candidate, dispatch and provenance.

    Completed role evidence has no age expiry.  The timestamp check remains
    fail-closed for future-dated evidence, while capability freshness applies
    only when a new dispatch is authorized.
    """
    if role not in {"reviewer", "verifier"}:
        raise ValidationError("exact assurance role must be reviewer or verifier")
    candidate = state.get("candidate")
    if not isinstance(candidate, dict) or candidate.get("status") != "FROZEN":
        raise TransitionDenied("exact assurance requires the frozen candidate")
    attempt = candidate.get("attempt_id")
    if not isinstance(attempt, str) or not attempt:
        raise ValidationError("frozen candidate attempt identity is missing")

    slot = _slot(state, role)
    if slot.get("result") not in expected_results:
        raise TransitionDenied(f"exact {role} result is not accepted")
    expected_status = "READY" if slot.get("result") == "READY" else "BLOCKED"
    if slot.get("status") != expected_status:
        raise TransitionDenied(f"exact {role} status/result relationship is invalid")
    validate_role_provenance(
        slot,
        expected_work_block_id=str(state.get("work_block_id") or ""),
        expected_define_identity=_define_identity(state),
        expected_candidate_attempt=attempt,
        expected_root=str(state.get("repository_root") or ""),
        expected_branch=str(state.get("subject_branch") or ""),
        clock=clock,
    )
    require_native_topology(slot, role=role)
    for key in CANDIDATE_BINDING_FIELDS:
        if slot.get(key) != candidate.get(key):
            raise TransitionDenied(f"exact {role} {key} differs from the frozen candidate")

    binding = {key: value for key, value in slot.items() if key != "status"}
    provenance = state.get("role_provenance")
    if not isinstance(provenance, list):
        raise TransitionDenied("immutable role provenance is missing")
    matching_provenance = [entry for entry in provenance if entry == binding]
    if len(matching_provenance) != 1:
        raise TransitionDenied(f"exact {role} must bind one immutable role record")

    dispatches = state.get("dispatch_history")
    if not isinstance(dispatches, list):
        raise TransitionDenied(f"exact {role} has no native dispatch history")
    matching_dispatches = [
        dispatch
        for dispatch in dispatches
        if isinstance(dispatch, dict)
        and dispatch.get("role") == role
        and dispatch.get("execution_id") == slot.get("execution_id")
        and dispatch.get("context_id") == slot.get("context_id")
        and dispatch.get("define_identity") == slot.get("define_identity")
        and dispatch.get("candidate_attempt_id") == slot.get("candidate_attempt_id")
    ]
    if len(matching_dispatches) != 1:
        raise TransitionDenied(f"exact {role} must bind one native dispatch")
    dispatch = matching_dispatches[0]
    for key in DISPATCH_BINDING_FIELDS:
        if slot.get(key) != dispatch.get(key):
            raise TransitionDenied(f"exact {role} {key} differs from its dispatch")
    return slot


def require_success_terminal(
    state: Mapping[str, object], *, clock: Clock = utc_now
) -> None:
    """Require exact READY assurance; reporting-only can never pass."""
    terminal = state.get("terminal_authority")
    if isinstance(terminal, dict) and terminal.get("mode") == "reporting-only":
        raise TransitionDenied("reporting-only authority cannot satisfy success predicates")
    candidate = state.get("candidate")
    if not isinstance(candidate, dict) or candidate.get("status") != "FROZEN":
        raise TransitionDenied("success terminalization requires a frozen candidate")
    for role in ("reviewer", "verifier"):
        require_exact_assurance_binding(
            state,
            role=role,
            expected_results={"READY"},
            clock=clock,
        )


def require_reporting_only_terminal(state: Mapping[str, object]) -> None:
    terminal = state.get("terminal_authority")
    if not isinstance(terminal, dict) or terminal.get("mode") != "reporting-only":
        raise TransitionDenied("reporting-only terminal authority is missing")
    forbidden = ("success", "publication_ready", "merge_ready", "release_ready", "deploy_ready")
    if any(terminal.get(field) is not False for field in forbidden):
        raise TransitionDenied("reporting-only terminal authority contains a success claim")
    assurance = state.get("assurance")
    if not isinstance(assurance, dict):
        raise ValidationError("reporting-only assurance is missing")
    for name, slot in assurance.items():
        if not isinstance(slot, dict):
            raise ValidationError(f"invalid reporting-only assurance slot: {name}")
        if slot.get("status") == "PENDING":
            raise TransitionDenied("reporting-only terminalization left an unresolved slot")
