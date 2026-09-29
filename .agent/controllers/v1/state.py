"""Schema v2 lifecycle state and pure transitions for the inert controller core."""

from __future__ import annotations

import copy
import re
from pathlib import PurePosixPath
from typing import Mapping

from .errors import TransitionDenied, ValidationError

STATES = frozenset({"INACTIVE", "DEFINE", "EXECUTE", "ASSURE"})
WB_ID = re.compile(r"^WB-(?:[0-9]{3}|[0-9]{4}-[0-9]{2}-[0-9]{2}-[a-z0-9]+(?:-[a-z0-9]+)*)$")
SHA = re.compile(r"^[0-9a-f]{40}$")
ADMISSION_ID = re.compile(r"^adm-[A-Za-z0-9][A-Za-z0-9._-]{7,123}$")
TOKEN = re.compile(r"^[A-Za-z0-9][A-Za-z0-9._-]{0,127}$")

INACTIVE = {"schema_version": 2, "lifecycle_state": "INACTIVE", "active": None}
ACTIVE_FIELDS = frozenset({
    "work_block_id", "initiative_ref", "admission_id", "subject_branch", "base_commit",
    "authority_profile", "planning_subject", "implementation_write_set", "coordination_scope",
    "critic", "source_candidate_sha", "reviewer", "verifier",
})


def _required(value: object, name: str, *, limit: int = 256) -> str:
    if not isinstance(value, str) or not value or len(value) > limit or "\x00" in value:
        raise ValidationError(f"{name} must be a nonempty bounded string")
    return value


def _sha(value: object, name: str) -> str:
    if not isinstance(value, str) or SHA.fullmatch(value) is None:
        raise ValidationError(f"{name} must be a full lowercase Git SHA")
    return value


def _safe_path(value: object, name: str) -> str:
    raw = _required(value, name, limit=1024)
    if "\\" in raw or raw.startswith("/"):
        raise ValidationError(f"{name} must be a safe repository-relative POSIX path")
    parts = PurePosixPath(raw).parts
    if not parts or any(part in {"", ".", ".."} for part in parts):
        raise ValidationError(f"{name} must be a safe repository-relative POSIX path")
    return "/".join(parts)


def _scope_pattern(value: object, name: str) -> str:
    raw = _safe_path(value, name)
    if raw.endswith("/**"):
        base = raw[:-3]
        if not base or any(ch in base for ch in "*?[]"):
            raise ValidationError(f"{name} has invalid scope grammar")
        return raw
    if any(ch in raw for ch in "*?[]"):
        raise ValidationError(f"{name} has invalid scope grammar")
    return raw


def canonical_scope(values: object, name: str, *, required: bool = False) -> list[str]:
    if not isinstance(values, list):
        raise ValidationError(f"{name} must be a list")
    if required and not values:
        raise ValidationError(f"{name} must not be empty")
    result = [_scope_pattern(value, f"{name} item") for value in values]
    if len(set(result)) != len(result):
        raise ValidationError(f"{name} contains duplicates")
    return sorted(result)


def canonical_exact_paths(values: object, name: str, *, required: bool = False) -> list[str]:
    if not isinstance(values, list):
        raise ValidationError(f"{name} must be a list")
    if required and not values:
        raise ValidationError(f"{name} must not be empty")
    result = [_safe_path(value, f"{name} item") for value in values]
    if any(any(ch in value for ch in "*?[]") for value in result):
        raise ValidationError(f"{name} must contain exact paths only")
    if len(set(result)) != len(result):
        raise ValidationError(f"{name} contains duplicates")
    return sorted(result)


def path_matches(path: str, pattern: str) -> bool:
    if pattern.endswith("/**"):
        prefix = pattern[:-3]
        return path == prefix or path.startswith(prefix + "/")
    return path == pattern


def _patterns_overlap(left: str, right: str) -> bool:
    left_prefix = left[:-3] if left.endswith("/**") else None
    right_prefix = right[:-3] if right.endswith("/**") else None
    if left_prefix is None and right_prefix is None:
        return left == right
    if left_prefix is not None and right_prefix is None:
        return path_matches(right, left)
    if left_prefix is None and right_prefix is not None:
        return path_matches(left, right)
    assert left_prefix is not None and right_prefix is not None
    return (
        left_prefix == right_prefix
        or left_prefix.startswith(right_prefix + "/")
        or right_prefix.startswith(left_prefix + "/")
    )


def _scope_contains_protected_policy(pattern: str) -> bool:
    return _patterns_overlap(pattern, ".agent/policies/**")


def is_define_planning_path(initiative_ref: str, path: str) -> bool:
    exact = {
        f"{initiative_ref}/intent.md",
        f"{initiative_ref}/spec.md",
        f"{initiative_ref}/plan.md",
        f"{initiative_ref}/tasklist.md",
    }
    return path in exact or path.startswith(f"{initiative_ref}/work-blocks/")


def _validate_role_binding(value: object, name: str, candidate: str | None, *, allow_blocked: bool = False) -> None:
    if not isinstance(value, dict):
        raise ValidationError(f"{name} binding must be an object")
    expected_keys = {"status", "subject_revision"} if name == "critic" else {"status", "candidate_sha"}
    if set(value) != expected_keys:
        raise ValidationError(f"{name} binding schema is unknown")
    status = value["status"]
    if name == "critic":
        allowed = {"PENDING", "READY"} | ({"BLOCKED"} if allow_blocked else set())
        if status not in allowed:
            raise ValidationError("critic status is unknown")
        subject_revision = value["subject_revision"]
        if status == "READY":
            _sha(subject_revision, "critic subject_revision")
        elif subject_revision is not None:
            raise ValidationError("non-ready Critic cannot bind a revision")
        return
    if status not in {"PENDING", "READY"}:
        raise ValidationError(f"{name} status is unknown")
    bound = value["candidate_sha"]
    if status == "READY":
        if candidate is None or _sha(bound, f"{name} candidate_sha") != candidate:
            raise ValidationError(f"{name} READY must bind the exact candidate")
    elif bound is not None:
        raise ValidationError(f"{name} PENDING cannot bind a candidate")


def _validate_active(active: object, phase: str) -> None:
    if not isinstance(active, dict) or set(active) != ACTIVE_FIELDS:
        raise ValidationError("active Work Block schema is unknown")
    work_block_id = _required(active["work_block_id"], "work_block_id", limit=128)
    if WB_ID.fullmatch(work_block_id) is None:
        raise ValidationError("work_block_id does not match repository grammar")
    initiative_ref = _safe_path(active["initiative_ref"], "initiative_ref")
    admission_id = _required(active["admission_id"], "admission_id", limit=128)
    if ADMISSION_ID.fullmatch(admission_id) is None:
        raise ValidationError("admission_id is invalid")
    _required(active["subject_branch"], "subject_branch", limit=256)
    _sha(active["base_commit"], "base_commit")

    profile = active["authority_profile"]
    if not isinstance(profile, dict) or set(profile) != {"id", "revision"}:
        raise ValidationError("authority_profile schema is unknown")
    profile_id = _required(profile["id"], "authority_profile.id", limit=128)
    if TOKEN.fullmatch(profile_id) is None:
        raise ValidationError("authority_profile.id is invalid")
    _sha(profile["revision"], "authority_profile.revision")

    planning = active["planning_subject"]
    if not isinstance(planning, dict) or set(planning) != {"revision", "paths"}:
        raise ValidationError("planning_subject schema is unknown")
    planning_revision = _sha(planning["revision"], "planning_subject.revision")
    planning_paths = canonical_exact_paths(planning["paths"], "planning_subject.paths", required=True)
    if planning_paths != planning["paths"]:
        raise ValidationError("planning_subject.paths must be sorted canonically")
    if any(not is_define_planning_path(initiative_ref, path) for path in planning_paths):
        raise ValidationError("planning_subject path is outside derived initiative planning surface")

    implementation = canonical_scope(active["implementation_write_set"], "implementation_write_set", required=True)
    coordination = canonical_scope(active["coordination_scope"], "coordination_scope")
    if implementation != active["implementation_write_set"] or coordination != active["coordination_scope"]:
        raise ValidationError("write scopes must be sorted canonically")
    if any(_scope_contains_protected_policy(pattern) for pattern in implementation + coordination):
        raise ValidationError("ordinary Work Block scopes cannot cover .agent/policies/**")
    if any(_patterns_overlap(left, right) for left in implementation for right in coordination):
        raise ValidationError("implementation and coordination scopes overlap")
    for path in planning_paths:
        if any(path_matches(path, pattern) for pattern in implementation):
            raise ValidationError("planning path cannot be implementation authority")
        if not any(path_matches(path, pattern) for pattern in coordination):
            raise ValidationError("planning path must be covered by coordination_scope")

    critic = active["critic"]
    _validate_role_binding(critic, "critic", None, allow_blocked=True)
    if critic["status"] == "READY" and critic["subject_revision"] != planning_revision:
        raise ValidationError("Critic READY is stale for current planning revision")

    candidate = active["source_candidate_sha"]
    if candidate is not None:
        candidate = _sha(candidate, "source_candidate_sha")
    _validate_role_binding(active["reviewer"], "reviewer", candidate)
    _validate_role_binding(active["verifier"], "verifier", candidate)
    if active["verifier"]["status"] == "READY" and active["reviewer"]["status"] != "READY":
        raise ValidationError("Verifier READY requires Reviewer READY")

    if phase == "DEFINE":
        if candidate is not None or critic["status"] == "READY":
            raise ValidationError("DEFINE cannot hold candidate or Critic READY")
        if active["reviewer"]["status"] != "PENDING" or active["verifier"]["status"] != "PENDING":
            raise ValidationError("DEFINE assurance must be pending")
    elif phase == "EXECUTE":
        if candidate is not None or critic["status"] != "READY":
            raise ValidationError("EXECUTE requires current Critic READY and no candidate")
        if active["reviewer"]["status"] != "PENDING" or active["verifier"]["status"] != "PENDING":
            raise ValidationError("EXECUTE assurance must be pending")
    elif phase == "ASSURE":
        if candidate is None or critic["status"] != "READY":
            raise ValidationError("ASSURE requires current Critic READY and exact candidate")
    else:
        raise ValidationError("active state lifecycle is unknown")


def validate(value: Mapping[str, object]) -> None:
    if not isinstance(value, dict) or set(value) != set(INACTIVE):
        raise ValidationError("state schema is unknown")
    if value["schema_version"] != 2 or value["lifecycle_state"] not in STATES:
        raise ValidationError("state version or lifecycle state is unknown")
    if value["lifecycle_state"] == "INACTIVE":
        if value["active"] is not None:
            raise ValidationError("INACTIVE cannot retain active authority")
        return
    _validate_active(value["active"], value["lifecycle_state"])


def _copy_expected(state: dict, expected: str | tuple[str, ...]) -> dict:
    validate(state)
    allowed = (expected,) if isinstance(expected, str) else expected
    if state["lifecycle_state"] not in allowed:
        raise TransitionDenied(f"transition requires one of {allowed}")
    return copy.deepcopy(state)


def _pending_candidate_binding() -> dict:
    return {"status": "PENDING", "candidate_sha": None}


def open_work_block(
    current: dict | None,
    *,
    work_block_id: str,
    initiative_ref: str,
    admission_id: str,
    subject_branch: str,
    base_commit: str,
    authority_profile_id: str,
    authority_profile_revision: str,
    planning_revision: str,
    planning_paths: list[str],
    implementation_write_set: list[str],
    coordination_scope: list[str],
) -> dict:
    if current is not None:
        validate(current)
        if current["lifecycle_state"] != "INACTIVE":
            raise TransitionDenied("open requires INACTIVE or NO_LOCAL_AUTHORITY")
    next_state = {
        "schema_version": 2,
        "lifecycle_state": "DEFINE",
        "active": {
            "work_block_id": work_block_id,
            "initiative_ref": _safe_path(initiative_ref, "initiative_ref"),
            "admission_id": admission_id,
            "subject_branch": subject_branch,
            "base_commit": base_commit,
            "authority_profile": {"id": authority_profile_id, "revision": authority_profile_revision},
            "planning_subject": {
                "revision": planning_revision,
                "paths": canonical_exact_paths(planning_paths, "planning_paths", required=True),
            },
            "implementation_write_set": canonical_scope(
                implementation_write_set, "implementation_write_set", required=True
            ),
            "coordination_scope": canonical_scope(coordination_scope, "coordination_scope"),
            "critic": {"status": "PENDING", "subject_revision": None},
            "source_candidate_sha": None,
            "reviewer": _pending_candidate_binding(),
            "verifier": _pending_candidate_binding(),
        },
    }
    validate(next_state)
    return next_state


def critic_result(state: dict, outcome: str, *, subject_revision: str | None = None) -> dict:
    next_state = _copy_expected(state, "DEFINE")
    active = next_state["active"]
    if outcome == "blocked":
        active["critic"] = {"status": "BLOCKED", "subject_revision": None}
    elif outcome == "ready":
        revision = _sha(subject_revision, "critic subject_revision")
        if revision != active["planning_subject"]["revision"]:
            raise TransitionDenied("Critic READY must bind current planning revision")
        active["critic"] = {"status": "READY", "subject_revision": revision}
        next_state["lifecycle_state"] = "EXECUTE"
    else:
        raise TransitionDenied("unknown Critic outcome")
    validate(next_state)
    return next_state


def revise_begin(state: dict) -> dict:
    next_state = _copy_expected(state, ("EXECUTE", "ASSURE"))
    active = next_state["active"]
    next_state["lifecycle_state"] = "DEFINE"
    active["critic"] = {"status": "PENDING", "subject_revision": None}
    active["source_candidate_sha"] = None
    active["reviewer"] = _pending_candidate_binding()
    active["verifier"] = _pending_candidate_binding()
    validate(next_state)
    return next_state


def revise_bind(
    state: dict,
    *,
    planning_revision: str,
    planning_paths: list[str],
    implementation_write_set: list[str],
    coordination_scope: list[str],
) -> dict:
    next_state = _copy_expected(state, "DEFINE")
    active = next_state["active"]
    active["planning_subject"] = {
        "revision": planning_revision,
        "paths": canonical_exact_paths(planning_paths, "planning_paths", required=True),
    }
    active["implementation_write_set"] = canonical_scope(
        implementation_write_set, "implementation_write_set", required=True
    )
    active["coordination_scope"] = canonical_scope(coordination_scope, "coordination_scope")
    active["critic"] = {"status": "PENDING", "subject_revision": None}
    active["source_candidate_sha"] = None
    active["reviewer"] = _pending_candidate_binding()
    active["verifier"] = _pending_candidate_binding()
    validate(next_state)
    return next_state


def create_candidate(state: dict, candidate_sha: str) -> dict:
    next_state = _copy_expected(state, "EXECUTE")
    active = next_state["active"]
    candidate = _sha(candidate_sha, "source_candidate_sha")
    active["source_candidate_sha"] = candidate
    active["reviewer"] = _pending_candidate_binding()
    active["verifier"] = _pending_candidate_binding()
    next_state["lifecycle_state"] = "ASSURE"
    validate(next_state)
    return next_state


def reviewer_result(state: dict, outcome: str, *, candidate_sha: str | None = None) -> dict:
    next_state = _copy_expected(state, "ASSURE")
    active = next_state["active"]
    candidate = active["source_candidate_sha"]
    if outcome == "ready":
        if _sha(candidate_sha, "reviewer candidate_sha") != candidate:
            raise TransitionDenied("Reviewer READY must bind exact source candidate")
        active["reviewer"] = {"status": "READY", "candidate_sha": candidate}
        active["verifier"] = _pending_candidate_binding()
    elif outcome == "rework":
        next_state["lifecycle_state"] = "EXECUTE"
        active["source_candidate_sha"] = None
        active["reviewer"] = _pending_candidate_binding()
        active["verifier"] = _pending_candidate_binding()
    elif outcome == "scope-change":
        next_state["lifecycle_state"] = "DEFINE"
        active["critic"] = {"status": "PENDING", "subject_revision": None}
        active["source_candidate_sha"] = None
        active["reviewer"] = _pending_candidate_binding()
        active["verifier"] = _pending_candidate_binding()
    else:
        raise TransitionDenied("unknown Reviewer outcome")
    validate(next_state)
    return next_state


def verifier_result(state: dict, outcome: str, *, candidate_sha: str | None = None) -> dict:
    next_state = _copy_expected(state, "ASSURE")
    active = next_state["active"]
    candidate = active["source_candidate_sha"]
    if active["reviewer"]["status"] != "READY":
        raise TransitionDenied("Verifier requires Reviewer READY")
    if outcome == "ready":
        if _sha(candidate_sha, "verifier candidate_sha") != candidate:
            raise TransitionDenied("Verifier READY must bind exact source candidate")
        active["verifier"] = {"status": "READY", "candidate_sha": candidate}
    elif outcome == "evidence-problem":
        active["verifier"] = _pending_candidate_binding()
    elif outcome == "rework":
        next_state["lifecycle_state"] = "EXECUTE"
        active["source_candidate_sha"] = None
        active["reviewer"] = _pending_candidate_binding()
        active["verifier"] = _pending_candidate_binding()
    elif outcome == "scope-change":
        next_state["lifecycle_state"] = "DEFINE"
        active["critic"] = {"status": "PENDING", "subject_revision": None}
        active["source_candidate_sha"] = None
        active["reviewer"] = _pending_candidate_binding()
        active["verifier"] = _pending_candidate_binding()
    else:
        raise TransitionDenied("unknown Verifier outcome")
    validate(next_state)
    return next_state


def close(state: dict, outcome: str) -> dict:
    _copy_expected(state, ("DEFINE", "EXECUTE", "ASSURE"))
    if outcome not in {"reporting-only", "cancelled"}:
        raise TransitionDenied("close supports reporting-only or cancelled only")
    return copy.deepcopy(INACTIVE)


def publish_success(state: dict) -> dict:
    next_state = _copy_expected(state, "ASSURE")
    active = next_state["active"]
    if active["reviewer"]["status"] != "READY" or active["verifier"]["status"] != "READY":
        raise TransitionDenied("publish success requires Reviewer and Verifier READY")
    return copy.deepcopy(INACTIVE)
