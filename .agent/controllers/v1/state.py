"""The complete v1 lifecycle and its single authoritative state schema."""

from __future__ import annotations

import copy
import re
from collections.abc import Mapping

from .errors import TransitionDenied, ValidationError

STATES = frozenset({"INACTIVE", "DEFINE", "EXECUTE", "ASSURE"})
TREE = re.compile(r"[0-9a-f]{40}|[0-9a-f]{64}", re.ASCII)
INACTIVE = {"schema_version": 1, "lifecycle_state": "INACTIVE", "active": None, "history": []}
ACTIVE_FIELDS = frozenset({
    "work_block_id", "subject_branch", "subject_revision", "write_set", "write_gate",
    "controller_generation", "controller_tree", "candidate_id", "capability",
    "dispatches", "evidence", "assurance_retry", "assurance_evidence_start",
})
RESULT_ROLES = frozenset({"critic", "reviewer", "verifier"})


def _required(value: object, name: str) -> str:
    if not isinstance(value, str) or not value.strip():
        raise ValidationError(f"{name} must be a nonempty string")
    return value


def _tree(value: object, name: str) -> str:
    if not isinstance(value, str) or not TREE.fullmatch(value):
        raise ValidationError(f"{name} must be a Git tree SHA")
    return value


def _validate_work_block(active: object, phase: str | None) -> None:
    if not isinstance(active, dict) or set(active) != ACTIVE_FIELDS:
        raise ValidationError("Work Block schema is unknown")
    for key in ("work_block_id", "subject_branch", "subject_revision", "controller_generation"):
        _required(active[key], key)
    if active["controller_generation"] != "v1":
        raise ValidationError("unsupported controller generation")
    _tree(active["controller_tree"], "controller_tree")
    if not isinstance(active["write_set"], list) or not active["write_set"] or any(
        not isinstance(path, str) or not path or path.startswith("/") or ".." in path.split("/")
        for path in active["write_set"]
    ):
        raise ValidationError("write_set must contain safe repository paths")
    if active["write_gate"] not in {"READY", "BLOCKED"}:
        raise ValidationError("write gate is unknown")
    if active["candidate_id"] is not None:
        _tree(active["candidate_id"], "candidate_id")
    if phase == "ASSURE" and active["candidate_id"] is None:
        raise ValidationError("ASSURE requires a frozen candidate")
    if phase is not None and phase != "ASSURE" and active["candidate_id"] is not None:
        raise ValidationError("candidate belongs only to ASSURE")
    if active["capability"] is not None:
        from .evidence import validate_capability
        validate_capability(active["capability"])
    if not isinstance(active["dispatches"], list) or not isinstance(active["evidence"], list):
        raise ValidationError("dispatches and evidence must be lists")
    start = active["assurance_evidence_start"]
    if isinstance(start, bool) or not isinstance(start, int) or not 0 <= start <= len(active["evidence"]):
        raise ValidationError("assurance evidence boundary is invalid")
    from .evidence import validate_records
    validate_records(active)
    if phase == "ASSURE" and any(
        item["role"] in {"reviewer", "verifier"}
        and item["verdict"] in {"CHANGES_REQUIRED", "SCOPE_CHANGE", "FAIL"}
        for item in active["evidence"][start:]
    ):
        raise ValidationError("negative assurance result cannot remain in ASSURE")
    if not isinstance(active["assurance_retry"], bool):
        raise ValidationError("assurance_retry must be boolean")


def validate(state: Mapping[str, object]) -> None:
    """Fail closed on unknown, partial, or contradictory authoritative state."""
    if not isinstance(state, dict) or set(state) != set(INACTIVE):
        raise ValidationError("state schema is unknown")
    if state["schema_version"] != 1 or state["lifecycle_state"] not in STATES:
        raise ValidationError("state version or lifecycle state is unknown")
    history = state["history"]
    if not isinstance(history, list):
        raise ValidationError("history must be a list")
    seen_work_blocks = set()
    for closed in history:
        if not isinstance(closed, dict) or set(closed) != {"outcome", "work_block", "closed_at", "reason"}:
            raise ValidationError("closeout history is malformed")
        if closed["outcome"] not in {"success", "reporting_only", "cancelled"}:
            raise ValidationError("closeout outcome is unknown")
        from .evidence import _timestamp, require_success
        _timestamp(closed["closed_at"], "closed_at")
        _required(closed["reason"], "closeout reason")
        _validate_work_block(closed["work_block"], None)
        work_block_id = closed["work_block"]["work_block_id"]
        if work_block_id in seen_work_blocks:
            raise ValidationError("closed Work Block id is duplicated")
        seen_work_blocks.add(work_block_id)
        if closed["outcome"] == "success":
            if closed["work_block"]["candidate_id"] is None:
                raise ValidationError("success history needs a candidate")
            require_success(closed["work_block"])
        elif "success" in closed["reason"].lower() or "ready for merge" in closed["reason"].lower():
            raise ValidationError("non-success closeout cannot claim success")
    active = state["active"]
    if state["lifecycle_state"] == "INACTIVE":
        if active is not None:
            raise ValidationError("inactive state cannot hold active authority")
        return
    _validate_work_block(active, state["lifecycle_state"])
    if active["work_block_id"] in seen_work_blocks:
        raise ValidationError("closed Work Block cannot also be active")


def _active(state: dict, expected: str) -> dict:
    validate(state)
    if state["lifecycle_state"] != expected:
        raise TransitionDenied(f"transition requires {expected}")
    return copy.deepcopy(state)


def open_work_block(state: dict, *, work_block_id: str, subject_branch: str,
                    subject_revision: str, write_set: list[str], controller_tree: str) -> dict:
    next_state = _active(state, "INACTIVE")
    if any(item["work_block"]["work_block_id"] == work_block_id for item in next_state["history"]):
        raise TransitionDenied("a closed Work Block cannot be reopened under the same id")
    next_state["lifecycle_state"] = "DEFINE"
    next_state["active"] = {
        "work_block_id": work_block_id, "subject_branch": subject_branch,
        "subject_revision": subject_revision, "write_set": write_set,
        "write_gate": "BLOCKED", "controller_generation": "v1",
        "controller_tree": controller_tree, "candidate_id": None, "capability": None,
        "dispatches": [], "evidence": [], "assurance_retry": False,
        "assurance_evidence_start": 0,
    }
    validate(next_state)
    return next_state


def approve_define(state: dict) -> dict:
    next_state = _active(state, "DEFINE")
    active = next_state["active"]
    scope_change = next((item for item in reversed(active["evidence"])
                         if item["verdict"] == "SCOPE_CHANGE"), None)
    if scope_change is not None and scope_change["subject_revision"] == active["subject_revision"]:
        raise TransitionDenied("material finding requires a new Define revision")
    critic = [item for item in active["evidence"] if item["role"] == "critic"
              and item["subject_revision"] == active["subject_revision"]]
    if not critic or critic[-1]["verdict"] != "APPROVE":
        raise TransitionDenied("current Define revision needs Critic approval")
    active["write_gate"] = "READY"
    next_state["lifecycle_state"] = "EXECUTE"
    validate(next_state)
    return next_state


def freeze_candidate(state: dict, candidate_id: str) -> dict:
    next_state = _active(state, "EXECUTE")
    if next_state["active"]["write_gate"] != "READY":
        raise TransitionDenied("write gate is not READY")
    next_state["active"]["candidate_id"] = _tree(candidate_id, "candidate_id")
    next_state["active"]["assurance_retry"] = False
    next_state["active"]["assurance_evidence_start"] = len(next_state["active"]["evidence"])
    next_state["lifecycle_state"] = "ASSURE"
    validate(next_state)
    return next_state


def after_result(state: dict, role: str, verdict: str) -> dict:
    """Apply the sole lifecycle semantics for a newly appended role result."""
    if role in {"reviewer", "verifier"}:
        if verdict in {"CHANGES_REQUIRED", "FAIL"}:
            state["active"]["candidate_id"] = None
            state["lifecycle_state"] = "EXECUTE"
        elif verdict == "SCOPE_CHANGE":
            state["active"]["candidate_id"] = None
            state["active"]["write_gate"] = "BLOCKED"
            state["lifecycle_state"] = "DEFINE"
    validate(state)
    return state


def revise_define(state: dict, subject_revision: str) -> dict:
    validate(state)
    if state["lifecycle_state"] not in {"EXECUTE", "DEFINE"}:
        raise TransitionDenied("material revision requires EXECUTE or DEFINE")
    next_state = copy.deepcopy(state)
    if next_state["lifecycle_state"] == "DEFINE" and not any(
        item["verdict"] == "SCOPE_CHANGE" and item["subject_revision"] == next_state["active"]["subject_revision"]
        for item in next_state["active"]["evidence"]
    ):
        raise TransitionDenied("DEFINE revision needs a material finding")
    revision = _required(subject_revision, "subject_revision")
    if revision == next_state["active"]["subject_revision"]:
        raise TransitionDenied("material revision must change subject revision")
    next_state["active"]["subject_revision"] = revision
    next_state["active"]["candidate_id"] = None
    next_state["active"]["write_gate"] = "BLOCKED"
    next_state["lifecycle_state"] = "DEFINE"
    validate(next_state)
    return next_state


def retry_assurance(state: dict) -> dict:
    next_state = _active(state, "ASSURE")
    active = next_state["active"]
    if not any(item["role"] == "verifier" and item["verdict"] == "EVIDENCE_PROBLEM"
               and item["candidate_id"] == active["candidate_id"]
               for item in active["evidence"][active["assurance_evidence_start"]:]):
        raise TransitionDenied("unchanged candidate retry requires evidence-only Verifier problem")
    active["assurance_retry"] = True
    validate(next_state)
    return next_state


def closeout(state: dict, *, outcome: str, closed_at: str, reason: str) -> dict:
    validate(state)
    if state["lifecycle_state"] not in {"DEFINE", "EXECUTE", "ASSURE"}:
        raise TransitionDenied("closeout requires an active Work Block")
    if outcome not in {"success", "reporting_only", "cancelled"}:
        raise TransitionDenied("unknown closeout outcome")
    active = state["active"]
    if outcome == "success":
        if state["lifecycle_state"] != "ASSURE":
            raise TransitionDenied("success requires ASSURE")
        from .evidence import require_success
        require_success(active)
    elif "success" in reason.lower() or "ready for merge" in reason.lower():
        raise TransitionDenied("non-success closeout cannot claim success")
    next_state = copy.deepcopy(state)
    next_state["history"].append({"outcome": outcome, "work_block": active,
                                  "closed_at": _required(closed_at, "closed_at"),
                                  "reason": _required(reason, "reason")})
    next_state["active"] = None
    next_state["lifecycle_state"] = "INACTIVE"
    validate(next_state)
    return next_state
