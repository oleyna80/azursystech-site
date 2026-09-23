"""Role dispatch, immutable provenance, and exact candidate assurance."""

from __future__ import annotations

import copy
import datetime as dt
from collections.abc import Mapping

from .errors import TransitionDenied, ValidationError

ROLES = frozenset({"critic", "reviewer", "verifier"})
VERDICTS = {
    "critic": frozenset({"APPROVE", "REJECT"}),
    "reviewer": frozenset({"READY", "CHANGES_REQUIRED", "SCOPE_CHANGE"}),
    "verifier": frozenset({"READY", "FAIL", "SCOPE_CHANGE", "EVIDENCE_PROBLEM"}),
}
RESULT_FIELDS = frozenset({
    "work_block_id", "role", "verdict", "subject_revision", "candidate_id",
    "session_id", "runtime", "isolation_method", "dispatched_at", "completed_at",
    "capability_probe_id", "capability_observed_at", "report_path", "findings",
    "pre_repository", "post_repository", "pre_control_surface", "post_control_surface",
})
DISPATCH_FIELDS = RESULT_FIELDS - {
    "verdict", "completed_at", "report_path", "findings", "post_repository", "post_control_surface",
}
CAPABILITY_TTL = dt.timedelta(hours=24)


def _timestamp(value: object, name: str) -> dt.datetime:
    if not isinstance(value, str):
        raise ValidationError(f"{name} must be ISO timestamp")
    try:
        parsed = dt.datetime.fromisoformat(value.replace("Z", "+00:00"))
    except ValueError as exc:
        raise ValidationError(f"{name} must be ISO timestamp") from exc
    if parsed.utcoffset() is None:
        raise ValidationError(f"{name} must include timezone")
    return parsed


def _text(value: object, name: str) -> str:
    if not isinstance(value, str) or not value.strip():
        raise ValidationError(f"{name} must be nonempty")
    return value


def _snapshot(value: object, name: str) -> dict:
    if not isinstance(value, dict) or set(value) != {"tree", "branch", "status"}:
        raise ValidationError(f"{name} must contain tree, branch, status")
    for field in value:
        if not isinstance(value[field], str):
            raise ValidationError(f"{name}.{field} must be text")
    from .state import _tree
    _tree(value["tree"], f"{name}.tree")
    _text(value["branch"], f"{name}.branch")
    return value


def _validate_dispatch(item: object, active: Mapping[str, object]) -> None:
    if not isinstance(item, dict) or set(item) != DISPATCH_FIELDS:
        raise ValidationError("dispatch record schema is unknown")
    role = item["role"]
    if role not in ROLES or item["work_block_id"] != active["work_block_id"]:
        raise ValidationError("unknown role or Work Block mismatch")
    for field in ("subject_revision", "session_id", "runtime", "isolation_method", "capability_probe_id"):
        _text(item[field], field)
    if item["runtime"] not in {"codex", "claude"} or item["isolation_method"] != "separate_session":
        raise ValidationError("role needs a separate top-level session")
    if role == "critic" and item["candidate_id"] is not None:
        raise ValidationError("Critic has no candidate")
    if role != "critic":
        from .state import _tree
        _tree(item["candidate_id"], "candidate_id")
    _timestamp(item["dispatched_at"], "dispatched_at")
    _timestamp(item["capability_observed_at"], "capability_observed_at")
    _snapshot(item["pre_repository"], "pre_repository")
    _snapshot(item["pre_control_surface"], "pre_control_surface")
    if role != "critic" and item["pre_repository"]["tree"] != item["candidate_id"]:
        raise ValidationError("assurance snapshot must bind the exact candidate tree")


def _validate_result(item: object, active: Mapping[str, object]) -> None:
    if not isinstance(item, dict) or set(item) != RESULT_FIELDS:
        raise ValidationError("result record schema is unknown")
    _validate_dispatch({key: item[key] for key in DISPATCH_FIELDS}, active)
    if item["verdict"] not in VERDICTS[item["role"]]:
        raise ValidationError("role verdict is unknown")
    if _timestamp(item["completed_at"], "completed_at") < _timestamp(item["dispatched_at"], "dispatched_at"):
        raise ValidationError("completion precedes dispatch")
    _text(item["report_path"], "report_path")
    if not isinstance(item["findings"], list) or any(not isinstance(x, str) for x in item["findings"]):
        raise ValidationError("findings must be text list")
    _snapshot(item["post_repository"], "post_repository")
    _snapshot(item["post_control_surface"], "post_control_surface")
    if item["pre_repository"] != item["post_repository"] or item["pre_control_surface"] != item["post_control_surface"]:
        raise ValidationError("unexpected repository or control-surface mutation")


def validate_records(active: Mapping[str, object]) -> None:
    dispatches = active["dispatches"]
    evidence = active["evidence"]
    seen = set()
    for item in dispatches:
        _validate_dispatch(item, active)
        key = (item["role"], item["session_id"], item["dispatched_at"])
        if key in seen:
            raise ValidationError("duplicate role dispatch")
        seen.add(key)
    used = set()
    for item in evidence:
        _validate_result(item, active)
        key = (item["role"], item["session_id"], item["dispatched_at"])
        if key not in seen or key in used:
            raise ValidationError("completed result has no unique dispatch")
        dispatch = next(d for d in dispatches if (d["role"], d["session_id"], d["dispatched_at"]) == key)
        if any(item[field] != dispatch[field] for field in DISPATCH_FIELDS):
            raise ValidationError("completed result changed dispatch provenance")
        used.add(key)


def validate_capability(capability: object) -> None:
    if not isinstance(capability, dict) or set(capability) != {"probe_id", "observed_at", "status"}:
        raise ValidationError("capability schema is unknown")
    _text(capability["probe_id"], "probe_id")
    _timestamp(capability["observed_at"], "observed_at")
    if capability["status"] not in {"available", "unavailable"}:
        raise ValidationError("capability status is unknown")


def refresh_capability(state: dict, capability: dict) -> dict:
    from .state import validate
    validate(state)
    if state["lifecycle_state"] == "INACTIVE":
        raise TransitionDenied("no active Work Block")
    validate_capability(capability)
    updated = copy.deepcopy(state)
    updated["active"]["capability"] = copy.deepcopy(capability)
    validate(updated)
    return updated


def can_dispatch(state: dict, *, role: str, now: str) -> None:
    """The only capability-freshness evaluator, used only before new dispatch."""
    from .state import validate
    validate(state)
    active = state["active"]
    if active is None or role not in ROLES:
        raise TransitionDenied("unknown role or inactive Work Block")
    if (role == "critic" and state["lifecycle_state"] != "DEFINE") or (
        role != "critic" and state["lifecycle_state"] != "ASSURE"
    ):
        raise TransitionDenied("role cannot dispatch in this lifecycle state")
    capability = active["capability"]
    if not isinstance(capability, dict) or capability.get("status") != "available":
        raise TransitionDenied("capability unavailable")
    observed = _timestamp(capability.get("observed_at"), "capability observed_at")
    current = _timestamp(now, "dispatch time")
    if observed > current + dt.timedelta(minutes=5) or current - observed > CAPABILITY_TTL:
        raise TransitionDenied("capability stale or future-dated")
    if role == "verifier":
        reviews = [item for item in active["evidence"][active["assurance_evidence_start"]:]
                   if item["role"] == "reviewer"
                   and item["candidate_id"] == active["candidate_id"]]
        if not reviews or reviews[-1]["verdict"] != "READY":
            raise TransitionDenied("Verifier requires latest READY Reviewer for exact candidate")


def dispatch(state: dict, record: dict) -> dict:
    can_dispatch(state, role=record.get("role"), now=record.get("dispatched_at"))
    active = state["active"]
    _validate_dispatch(record, active)
    if record["subject_revision"] != active["subject_revision"] or record["candidate_id"] != active["candidate_id"]:
        raise TransitionDenied("dispatch subject or candidate mismatch")
    capability = active["capability"]
    if record["capability_probe_id"] != capability["probe_id"] or record["capability_observed_at"] != capability["observed_at"]:
        raise TransitionDenied("dispatch capability mismatch")
    if any(item["session_id"] == record["session_id"] for item in active["dispatches"]):
        raise TransitionDenied("role session must be unique")
    updated = copy.deepcopy(state)
    updated["active"]["dispatches"].append(copy.deepcopy(record))
    from .state import validate
    validate(updated)
    return updated


def record_result(state: dict, result: dict) -> dict:
    """Append only. Never refresh capability or expire a completed result."""
    from .state import after_result, validate
    validate(state)
    active = state["active"]
    if active is None:
        raise TransitionDenied("no active Work Block")
    _validate_result(result, active)
    if result["subject_revision"] != active["subject_revision"]:
        raise TransitionDenied("subject revision mismatch")
    if result["role"] != "critic" and (
        state["lifecycle_state"] != "ASSURE" or result["candidate_id"] != active["candidate_id"]
    ):
        raise TransitionDenied("assurance candidate mismatch")
    if result["role"] == "critic" and state["lifecycle_state"] != "DEFINE":
        raise TransitionDenied("Critic result requires DEFINE")
    if any(item["role"] == result["role"] and item["session_id"] == result["session_id"]
           and item["dispatched_at"] == result["dispatched_at"] for item in active["evidence"]):
        raise TransitionDenied("completed evidence is immutable")
    updated = copy.deepcopy(state)
    updated["active"]["evidence"].append(copy.deepcopy(result))
    return after_result(updated, result["role"], result["verdict"])


def require_success(active: Mapping[str, object]) -> None:
    candidate = active["candidate_id"]
    results = active["evidence"][active["assurance_evidence_start"]:]
    if any(item["role"] in {"reviewer", "verifier"}
           and item["verdict"] in {"CHANGES_REQUIRED", "SCOPE_CHANGE", "FAIL"}
           for item in results):
        raise TransitionDenied("negative assurance result terminates the current attempt")
    reviewer = [item for item in results if item["role"] == "reviewer" and item["candidate_id"] == candidate]
    verifier = [item for item in results if item["role"] == "verifier" and item["candidate_id"] == candidate]
    if not reviewer or not verifier or reviewer[-1]["verdict"] != "READY" or verifier[-1]["verdict"] != "READY":
        raise TransitionDenied("success requires latest READY Reviewer and Verifier for exact candidate")
    if reviewer[-1]["session_id"] == verifier[-1]["session_id"]:
        raise TransitionDenied("Reviewer and Verifier need separate sessions")
    if _timestamp(reviewer[-1]["completed_at"], "review completion") > _timestamp(verifier[-1]["dispatched_at"], "verification dispatch"):
        raise TransitionDenied("Verifier must follow Reviewer")
