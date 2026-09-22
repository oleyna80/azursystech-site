"""Pure v1 lifecycle transitions.

The functions return new state objects.  The caller persists them atomically;
no transition mutates its input or rewrites historical role provenance.
"""

from __future__ import annotations

import copy
import re
from collections.abc import Mapping

from .errors import TransitionDenied, ValidationError
from .dispatch import require_unique_capability, require_unique_execution
from .evidence import (
    refreshed_capability_state,
    require_fresh_capability,
    validate_role_provenance,
)
from .clock import Clock, utc_now
from .topology import require_native_topology
from .assurance_gate import require_exact_assurance_binding
from .recovery import CANONICAL_INACTIVE_TEMPLATE, validate_canonical_inactive

NEGATIVE_RESULTS = {"CHANGES_REQUIRED", "BLOCKED"}
TERMINAL_STATUSES = {"INACTIVE", "CLOSED", "TERMINAL"}
GIT_SHA1 = re.compile(r"^[0-9a-f]{40}$")
SHA256_IDENTITY = re.compile(r"^sha256:[0-9a-f]{64}$")
SEALED_IDENTITY = re.compile(r"^sealed-surface-sha256-v1:[0-9a-f]{64}$")


def _copy(state: Mapping[str, object]) -> dict:
    return copy.deepcopy(dict(state))


def _require_active(state: Mapping[str, object]) -> None:
    if state.get("lifecycle_status") != "ACTIVE":
        raise TransitionDenied("transition requires an active Work Block")


def _define_identity(state: Mapping[str, object]) -> str:
    definition = state.get("define")
    if not isinstance(definition, dict):
        raise ValidationError("active Define identity is missing")
    identity = definition.get("identity")
    if not isinstance(identity, str) or not identity:
        raise ValidationError("active Define identity is missing")
    return identity


def _historical_attempt_ids(state: Mapping[str, object]) -> set[str]:
    history = state.get("candidate_history", [])
    if not isinstance(history, list):
        raise ValidationError("candidate_history must be an array")
    attempts: set[str] = set()
    for candidate in history:
        if not isinstance(candidate, dict):
            raise ValidationError("candidate_history entries must be objects")
        attempt = candidate.get("attempt_id")
        if not isinstance(attempt, str) or not attempt:
            raise ValidationError("historical candidate attempt identity is missing")
        if attempt in attempts:
            raise ValidationError("candidate history contains a repeated attempt identity")
        attempts.add(attempt)
    return attempts


def _require_exact_dispatch_binding(
    state: Mapping[str, object],
    binding: Mapping[str, object],
    *,
    role: str,
    candidate_attempt_id: str | None,
) -> Mapping[str, object]:
    dispatches = state.get("dispatch_history")
    if not isinstance(dispatches, list):
        raise TransitionDenied(f"completed {role} has no recorded native dispatch")
    matches = [
        dispatch
        for dispatch in dispatches
        if isinstance(dispatch, dict)
        and dispatch.get("role") == role
        and dispatch.get("execution_id") == binding.get("execution_id")
        and dispatch.get("context_id") == binding.get("context_id")
        and dispatch.get("work_block_id") == binding.get("work_block_id")
        and dispatch.get("define_identity") == binding.get("define_identity")
        and dispatch.get("candidate_attempt_id") == candidate_attempt_id
        and dispatch.get("repository_root") == binding.get("repository_root")
        and dispatch.get("branch") == binding.get("branch")
    ]
    if len(matches) != 1:
        raise TransitionDenied(f"completed {role} does not bind one exact native dispatch")
    dispatch = matches[0]
    for key in (
        "context_id_source",
        "runtime",
        "adapter",
        "adapter_version",
        "isolation",
        "launch_mechanism",
    ):
        if binding.get(key) != dispatch.get(key):
            raise TransitionDenied(f"completed {role} {key} differs from its dispatch")
    return dispatch


def open_work_block(
    inactive: Mapping[str, object],
    *,
    admission: Mapping[str, object],
    controller_binding: Mapping[str, object],
    critic_binding: Mapping[str, object],
    capability: Mapping[str, object],
    clock: Clock = utc_now,
) -> dict:
    """Admit a future WB once, pinning its controller tuple for its lifetime."""
    try:
        validate_canonical_inactive(inactive)
    except ValidationError as exc:
        raise TransitionDenied("open requires canonical inactive authority") from exc
    required = (
        "work_block_id",
        "repository_root",
        "subject_branch",
        "original_baseline",
        "define_revision",
        "define_identity",
    )
    if any(not isinstance(admission.get(key), str) or not admission[key] for key in required):
        raise ValidationError("open admission tuple is incomplete")
    if controller_binding.get("generation") != "v1":
        raise TransitionDenied("future admission requires an explicit v1 controller binding")
    for key in (
        "source_commit",
        "package_identity",
        "policy_identity",
        "activation_record",
        "manifest_identity",
    ):
        if not isinstance(controller_binding.get(key), str) or not controller_binding[key]:
            raise ValidationError(f"controller binding {key} is required")
    require_fresh_capability(
        capability,
        expected_work_block_id=str(admission["work_block_id"]),
        expected_root=str(admission["repository_root"]),
        clock=clock,
    )
    validate_role_provenance(
        critic_binding,
        expected_work_block_id=str(admission["work_block_id"]),
        expected_define_identity=str(admission["define_identity"]),
        expected_root=str(admission["repository_root"]),
        expected_branch=str(admission["subject_branch"]),
        clock=clock,
    )
    require_native_topology(critic_binding, role="critic")
    if critic_binding.get("role") != "critic" or critic_binding.get("result") != "APPROVE":
        raise TransitionDenied("open requires an approving independent Critic")
    require_unique_execution({"role_provenance": [], "capability": capability}, critic_binding)
    updated = _copy(inactive)
    updated.update(
        {
            "schema_version": 4,
            "authority_mode": "versioned_controller",
            "work_block_id": admission["work_block_id"],
            "repository_root": admission["repository_root"],
            "subject_branch": admission["subject_branch"],
            "original_baseline": admission["original_baseline"],
            "controller_binding": copy.deepcopy(dict(controller_binding)),
            "define": {
                "revision": admission["define_revision"],
                "identity": admission["define_identity"],
                "status": "ADMITTED",
            },
            "critic": copy.deepcopy(dict(critic_binding)),
            "capability": copy.deepcopy(dict(capability)),
            "capability_history": [],
            "role_provenance": [copy.deepcopy(dict(critic_binding))],
            "dispatch_history": [],
            "candidate": None,
            "candidate_history": [],
            "assurance": None,
            "assurance_history": [],
            "lifecycle_status": "ACTIVE",
            "lifecycle_phase": "Execute",
            "write_set": copy.deepcopy(admission.get("write_set", [])),
            "write_gate": {"status": "READY", "opened_at": critic_binding["observed_at"]},
            "terminal_authority": None,
        }
    )
    if not isinstance(updated["write_set"], list) or not updated["write_set"]:
        raise ValidationError("open requires a non-empty admitted write-set")
    return updated


def refresh_capability(
    state: Mapping[str, object],
    new_capability: Mapping[str, object],
    *,
    clock: Clock = utc_now,
) -> dict:
    _require_active(state)
    require_fresh_capability(
        new_capability,
        expected_work_block_id=str(state.get("work_block_id") or ""),
        expected_root=str(state.get("repository_root") or ""),
        clock=clock,
    )
    require_unique_capability(state, new_capability)
    return refreshed_capability_state(state, new_capability)


def record_role_dispatch(
    state: Mapping[str, object],
    *,
    dispatch: Mapping[str, object],
    clock: Clock = utc_now,
) -> dict:
    """Authorize and append one exact native role dispatch binding."""
    _require_active(state)
    role = dispatch.get("role")
    if role not in {"critic", "reviewer", "verifier"}:
        raise ValidationError("dispatch role must be critic, reviewer, or verifier")
    phase = state.get("lifecycle_phase")
    if role == "critic":
        definition = state.get("define")
        if (
            phase != "Define"
            or not isinstance(definition, dict)
            or definition.get("status") != "REVISION_PENDING"
        ):
            raise TransitionDenied("Critic dispatch requires a pending Define revision")
    elif phase != "Assure":
        raise TransitionDenied("Reviewer and Verifier dispatch require Assure phase")
    require_native_topology(dispatch, role=role)
    require_unique_execution(state, dispatch)
    dispatch_history = state.get("dispatch_history", [])
    if not isinstance(dispatch_history, list):
        raise ValidationError("dispatch_history must be an array")
    execution_id = dispatch.get("execution_id")
    context_id = dispatch.get("context_id")
    for prior in dispatch_history:
        if not isinstance(prior, dict):
            raise ValidationError("dispatch_history entries must be objects")
        if prior.get("execution_id") == execution_id:
            raise TransitionDenied("native execution ID replay is forbidden")
        if prior.get("context_id") == context_id:
            raise TransitionDenied("native context ID replay is forbidden")
    capability = state.get("capability")
    if not isinstance(capability, dict):
        raise TransitionDenied("native dispatch capability is missing")
    require_fresh_capability(
        capability,
        expected_work_block_id=str(state.get("work_block_id") or ""),
        expected_root=str(state.get("repository_root") or ""),
        clock=clock,
    )
    for key in ("runtime", "adapter", "adapter_version", "context_id_source"):
        if not isinstance(dispatch.get(key), str) or not dispatch[key]:
            raise ValidationError(f"dispatch {key} is required")

    candidate_attempt: str | None = None
    if role in {"reviewer", "verifier"}:
        candidate = state.get("candidate")
        if not isinstance(candidate, dict) or candidate.get("status") != "FROZEN":
            raise TransitionDenied("assurance dispatch requires a frozen candidate")
        candidate_attempt = str(candidate.get("attempt_id") or "")
        if not candidate_attempt:
            raise TransitionDenied("assurance dispatch candidate attempt is missing")
        assurance = state.get("assurance")
        slot = assurance.get(role) if isinstance(assurance, dict) else None
        if not isinstance(slot, dict) or slot.get("status") != "PENDING":
            raise TransitionDenied(f"{role} dispatch requires its PENDING assurance slot")
        if slot.get("candidate_attempt_id") != candidate_attempt:
            raise TransitionDenied(f"{role} assurance slot differs from the frozen attempt")
        if role == "verifier":
            require_exact_assurance_binding(
                state,
                role="reviewer",
                expected_results={"READY"},
                clock=clock,
            )

    record = {
        "role": role,
        "execution_id": dispatch["execution_id"],
        "context_id": dispatch["context_id"],
        "context_id_source": dispatch["context_id_source"],
        "isolation": dispatch["isolation"],
        "launch_mechanism": dispatch["launch_mechanism"],
        "runtime": dispatch["runtime"],
        "adapter": dispatch["adapter"],
        "adapter_version": dispatch["adapter_version"],
        "work_block_id": state.get("work_block_id"),
        "define_identity": _define_identity(state),
        "candidate_attempt_id": candidate_attempt,
        "repository_root": state.get("repository_root"),
        "branch": state.get("subject_branch"),
        "capability_execution_id": capability.get("execution_id"),
        "capability_context_id": capability.get("context_id"),
        "status": "DISPATCHED",
    }
    updated = _copy(state)
    history = updated.setdefault("dispatch_history", [])
    if not isinstance(history, list):
        raise ValidationError("dispatch_history must be an array")
    history.append(record)
    return updated


def freeze_candidate(
    state: Mapping[str, object],
    *,
    attempt_id: str,
    frozen_commit: str,
    frozen_tree: str,
    sealed_manifest: str,
    sealed_manifest_identity: str,
    sealed_surface_identity: str,
) -> dict:
    """Freeze one exact attempt and its complete sealed assurance surface."""
    _require_active(state)
    if state.get("lifecycle_phase") != "Execute":
        raise TransitionDenied("freeze requires Execute phase")
    gate = state.get("write_gate")
    if not isinstance(gate, dict) or gate.get("status") != "READY":
        raise TransitionDenied("freeze requires a READY write gate")
    required = {
        "attempt_id": attempt_id,
        "frozen_commit": frozen_commit,
        "frozen_tree": frozen_tree,
        "sealed_manifest": sealed_manifest,
        "sealed_manifest_identity": sealed_manifest_identity,
        "sealed_surface_identity": sealed_surface_identity,
    }
    if any(not isinstance(value, str) or not value for value in required.values()):
        raise ValidationError("freeze requires complete candidate and sealed-surface identity")
    if not GIT_SHA1.fullmatch(frozen_commit) or not GIT_SHA1.fullmatch(frozen_tree):
        raise ValidationError("frozen commit and tree must be exact lower-case Git SHA-1 identities")
    if not SHA256_IDENTITY.fullmatch(sealed_manifest_identity):
        raise ValidationError("sealed manifest identity must be sha256:<64-hex>")
    if not SEALED_IDENTITY.fullmatch(sealed_surface_identity):
        raise ValidationError("sealed surface identity algorithm is unsupported")
    historical_attempts = _historical_attempt_ids(state)
    if attempt_id in historical_attempts:
        raise TransitionDenied("candidate attempt identity cannot be reused from history")
    current = state.get("candidate")
    if current is not None:
        if not isinstance(current, dict):
            raise ValidationError("candidate must be an object")
        if current.get("status") != "EDITING" or current.get("attempt_id") != attempt_id:
            raise TransitionDenied("freeze must bind the exact active editing attempt")
    updated = _copy(state)
    updated["candidate"] = {**required, "status": "FROZEN"}
    updated["assurance"] = {
        "reviewer": {"required": True, "status": "PENDING", "candidate_attempt_id": attempt_id},
        "verifier": {"required": True, "status": "PENDING", "candidate_attempt_id": attempt_id},
        "evaluation": {"required": False, "status": "PENDING", "candidate_attempt_id": attempt_id},
        "drift": {"required": False, "status": "PENDING", "candidate_attempt_id": attempt_id},
    }
    updated["lifecycle_phase"] = "Assure"
    updated["write_gate"] = {"status": "BLOCKED", "opened_at": None}
    return updated


def begin_define_revision(
    state: Mapping[str, object], *, new_revision: str, proposed_identity: str
) -> dict:
    _require_active(state)
    if not new_revision or not proposed_identity:
        raise ValidationError("new Define revision and identity are required")
    updated = _copy(state)
    history = updated.setdefault("define_history", [])
    if not isinstance(history, list):
        raise ValidationError("define_history must be an array")
    history.append(
        {
            "define": copy.deepcopy(updated.get("define")),
            "critic": copy.deepcopy(updated.get("critic")),
        }
    )
    candidate = updated.get("candidate")
    if candidate is not None:
        updated.setdefault("candidate_history", []).append(copy.deepcopy(candidate))
    assurance = updated.get("assurance")
    if assurance is not None:
        updated.setdefault("assurance_history", []).append(copy.deepcopy(assurance))
    updated["define"] = {
        "revision": new_revision,
        "identity": proposed_identity,
        "status": "REVISION_PENDING",
    }
    updated["critic"] = None
    updated["candidate"] = None
    updated["assurance"] = None
    updated["lifecycle_phase"] = "Define"
    updated["write_gate"] = {"status": "BLOCKED", "opened_at": None}
    return updated


def admit_define_revision(
    state: Mapping[str, object],
    *,
    critic_binding: Mapping[str, object],
    write_set: list[str],
    clock: Clock = utc_now,
) -> dict:
    _require_active(state)
    definition = state.get("define")
    if not isinstance(definition, dict) or definition.get("status") != "REVISION_PENDING":
        raise TransitionDenied("no Define revision is awaiting admission")
    validate_role_provenance(
        critic_binding,
        expected_work_block_id=str(state.get("work_block_id") or ""),
        expected_define_identity=_define_identity(state),
        expected_root=str(state.get("repository_root") or ""),
        expected_branch=str(state.get("subject_branch") or ""),
        clock=clock,
    )
    require_native_topology(critic_binding, role="critic")
    if critic_binding.get("role") != "critic" or critic_binding.get("result") != "APPROVE":
        raise TransitionDenied("revised Define requires an approving Critic")
    if not write_set or any(not isinstance(path, str) or not path for path in write_set):
        raise ValidationError("revised Define admission requires a non-empty approved write-set")
    require_unique_execution(state, critic_binding)
    _require_exact_dispatch_binding(
        state,
        critic_binding,
        role="critic",
        candidate_attempt_id=None,
    )
    updated = _copy(state)
    updated["critic"] = copy.deepcopy(dict(critic_binding))
    updated.setdefault("role_provenance", []).append(copy.deepcopy(dict(critic_binding)))
    updated["define"]["status"] = "ADMITTED"
    updated["write_set"] = copy.deepcopy(write_set)
    updated["lifecycle_phase"] = "Execute"
    updated["write_gate"] = {"status": "READY", "opened_at": critic_binding["observed_at"]}
    return updated


def finalize_assurance(
    state: Mapping[str, object],
    *,
    role: str,
    completed_binding: Mapping[str, object],
    clock: Clock = utc_now,
) -> dict:
    """Record an already completed execution; capability freshness is irrelevant."""
    _require_active(state)
    if role not in {"reviewer", "verifier"}:
        raise ValidationError("assurance role must be reviewer or verifier")
    if state.get("lifecycle_phase") != "Assure":
        raise TransitionDenied("assurance finalization requires Assure phase")
    candidate = state.get("candidate")
    if (
        not isinstance(candidate, dict)
        or candidate.get("status") != "FROZEN"
        or not candidate.get("attempt_id")
    ):
        raise TransitionDenied("assurance finalization requires a frozen candidate attempt")
    assurance = state.get("assurance")
    slot = assurance.get(role) if isinstance(assurance, dict) else None
    if not isinstance(slot, dict) or slot.get("status") != "PENDING":
        raise TransitionDenied(f"assurance finalization requires a PENDING {role} slot")
    if slot.get("candidate_attempt_id") != candidate.get("attempt_id"):
        raise TransitionDenied(f"{role} assurance slot differs from the frozen attempt")
    validate_role_provenance(
        completed_binding,
        expected_work_block_id=str(state.get("work_block_id") or ""),
        expected_define_identity=_define_identity(state),
        expected_candidate_attempt=str(candidate["attempt_id"]),
        expected_root=str(state.get("repository_root") or ""),
        expected_branch=str(state.get("subject_branch") or ""),
        clock=clock,
    )
    if completed_binding.get("role") != role:
        raise ValidationError("completed role does not match assurance slot")
    require_native_topology(completed_binding, role=role)
    result = completed_binding.get("result")
    allowed = {"READY", "CHANGES_REQUIRED"} if role == "reviewer" else {"READY", "BLOCKED"}
    if result not in allowed:
        raise ValidationError("completed assurance result is invalid")
    for key in (
        "frozen_commit",
        "frozen_tree",
        "sealed_manifest",
        "sealed_manifest_identity",
        "sealed_surface_identity",
    ):
        if completed_binding.get(key) != candidate.get(key):
            raise ValidationError(f"completed assurance {key} does not match frozen candidate")
    if role == "verifier":
        require_exact_assurance_binding(
            state,
            role="reviewer",
            expected_results={"READY"},
            clock=clock,
        )
    _require_exact_dispatch_binding(
        state,
        completed_binding,
        role=role,
        candidate_attempt_id=str(candidate["attempt_id"]),
    )
    require_unique_execution(state, completed_binding)
    updated = _copy(state)
    assurance = updated.setdefault("assurance", {})
    if not isinstance(assurance, dict):
        raise ValidationError("assurance must be an object")
    recorded = copy.deepcopy(dict(completed_binding))
    recorded["status"] = "READY" if result == "READY" else "BLOCKED"
    assurance[role] = recorded
    updated.setdefault("role_provenance", []).append(copy.deepcopy(dict(completed_binding)))
    return updated


def resume_execute(
    state: Mapping[str, object], *, new_attempt_id: str, clock: Clock = utc_now
) -> dict:
    _require_active(state)
    if state.get("terminal_authority"):
        raise TransitionDenied("terminal authority already exists")
    candidate = state.get("candidate")
    if not isinstance(candidate, dict) or not candidate.get("attempt_id"):
        raise TransitionDenied("rework requires an exact candidate attempt")
    old_attempt = str(candidate["attempt_id"])
    if candidate.get("status") != "FROZEN":
        raise TransitionDenied("rework requires the exact frozen candidate attempt")
    historical_attempts = _historical_attempt_ids(state)
    if not new_attempt_id or new_attempt_id == old_attempt or new_attempt_id in historical_attempts:
        raise TransitionDenied("rework requires a new candidate attempt identity")
    critic = state.get("critic")
    if not isinstance(critic, dict):
        raise TransitionDenied("rework requires the admitted Critic binding")
    validate_role_provenance(
        critic,
        expected_work_block_id=str(state.get("work_block_id") or ""),
        expected_define_identity=_define_identity(state),
        expected_root=str(state.get("repository_root") or ""),
        expected_branch=str(state.get("subject_branch") or ""),
        clock=clock,
    )
    if critic.get("role") != "critic" or critic.get("result") != "APPROVE":
        raise TransitionDenied("rework requires the admitted approving Critic binding")
    definition = state.get("define")
    if not isinstance(definition, dict) or definition.get("status") != "ADMITTED":
        raise TransitionDenied("rework requires an admitted active Define")
    assurance = state.get("assurance")
    if not isinstance(assurance, dict):
        raise TransitionDenied("rework requires exact negative assurance")
    valid_negative = False
    for role, expected_result in (("reviewer", "CHANGES_REQUIRED"), ("verifier", "BLOCKED")):
        binding = assurance.get(role)
        if not isinstance(binding, dict) or binding.get("result") != expected_result:
            continue
        require_exact_assurance_binding(
            state,
            role=role,
            expected_results={expected_result},
            clock=clock,
        )
        valid_negative = True
    if not valid_negative:
        raise TransitionDenied("rework requires exact negative assurance for the active attempt")
    updated = _copy(state)
    updated.setdefault("candidate_history", []).append(copy.deepcopy(candidate))
    updated.setdefault("assurance_history", []).append(copy.deepcopy(assurance))
    updated["candidate"] = {"attempt_id": new_attempt_id, "status": "EDITING"}
    updated["assurance"] = {
        "reviewer": {
            "required": True,
            "status": "PENDING",
            "candidate_attempt_id": new_attempt_id,
        },
        "verifier": {
            "required": True,
            "status": "PENDING",
            "candidate_attempt_id": new_attempt_id,
        },
        "evaluation": {
            "required": False,
            "status": "PENDING",
            "candidate_attempt_id": new_attempt_id,
        },
        "drift": {
            "required": False,
            "status": "PENDING",
            "candidate_attempt_id": new_attempt_id,
        },
    }
    updated["lifecycle_phase"] = "Execute"
    updated["write_gate"] = {"status": "READY", "opened_at": None}
    return updated


def reporting_only_record(
    state: Mapping[str, object], *, blocker_report: str, reason: str
) -> dict:
    """Build the exact durable closeout evidence required before state deactivation.

    The record intentionally omits its own digest to avoid self-reference.  The
    production CLI verifies its canonical bytes and supplied SHA-256 before it
    atomically installs the canonical inactive authority template.
    """
    _require_active(state)
    if (
        not isinstance(blocker_report, str)
        or not blocker_report.strip()
        or not isinstance(reason, str)
        or not reason.strip()
    ):
        raise ValidationError("reporting-only requires a durable blocker report path and reason")
    assurance = copy.deepcopy(state.get("assurance"))
    if assurance is None:
        assurance = {
            "reviewer": {"required": True, "status": "PENDING"},
            "verifier": {"required": True, "status": "PENDING"},
            "evaluation": {"required": False, "status": "PENDING"},
            "drift": {"required": False, "status": "PENDING"},
        }
    if not isinstance(assurance, dict):
        raise ValidationError("reporting-only assurance slots are invalid")
    for name in ("reviewer", "verifier", "evaluation", "drift"):
        slot = assurance.get(name)
        if not isinstance(slot, dict):
            raise ValidationError(f"assurance slot {name} is invalid")
        status = slot.get("status")
        if status == "PENDING":
            required = slot.get("required")
            if required is True:
                slot.update({"status": "UNVERIFIED", "result": "UNVERIFIED", "reason": reason})
            elif required is False:
                slot.update({"status": "SKIPPED", "result": "SKIPPED", "reason": reason})
            else:
                raise ValidationError(f"pending assurance slot {name} lacks required classification")
        elif status not in {"READY", "BLOCKED", "UNVERIFIED", "SKIPPED"}:
            raise ValidationError(f"assurance slot {name} has an invalid terminal status")
    return {
        "schema": "azursystech-reporting-only-closeout-v1",
        "mode": "reporting-only",
        "blocker_report": blocker_report,
        "reason": reason,
        "result": "BLOCKED",
        "authority_snapshot": _copy(state),
        "resolved_assurance": assurance,
        "terminal_authority": {
            "success": False,
            "publication_ready": False,
            "merge_ready": False,
            "release_ready": False,
            "deploy_ready": False,
        },
    }


def reporting_only(
    state: Mapping[str, object], *, blocker_report: str, blocker_identity: str, reason: str
) -> dict:
    if not SHA256_IDENTITY.fullmatch(blocker_identity):
        raise ValidationError("reporting-only requires a durable blocker report identity")
    reporting_only_record(state, blocker_report=blocker_report, reason=reason)
    inactive = _copy(CANONICAL_INACTIVE_TEMPLATE)
    validate_canonical_inactive(inactive)
    return inactive
