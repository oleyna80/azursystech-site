"""Schema-v2 Work Block state and pure lifecycle transitions."""

from __future__ import annotations

import copy
import re
from collections.abc import Mapping, Sequence

from .errors import TransitionDenied, ValidationError

SCHEMA_VERSION = 2
STATES = frozenset({"INACTIVE", "DEFINE", "EXECUTE", "ASSURE"})
SHA_RE = re.compile(r"^[0-9a-f]{40}$", re.ASCII)
WORK_BLOCK_RE = re.compile(
    r"^WB-(?:[0-9]{3}|[0-9]{4}-[0-9]{2}-[0-9]{2}-[a-z0-9]+(?:-[a-z0-9]+)*)$",
    re.ASCII,
)
SAFE_TOKEN_RE = re.compile(r"^[A-Za-z0-9][A-Za-z0-9._-]{0,127}$", re.ASCII)
ADMISSION_ID_RE = re.compile(r"^adm-[A-Za-z0-9][A-Za-z0-9._-]{7,123}$", re.ASCII)

INACTIVE = {"schema_version": SCHEMA_VERSION, "lifecycle_state": "INACTIVE", "active": None}

ACTIVE_FIELDS = frozenset({
    "work_block_id", "initiative_ref", "admission_id", "subject_branch", "base_commit",
    "authority_profile", "planning_subject", "implementation_write_set",
    "coordination_scope", "critic", "source_candidate_sha", "reviewer", "verifier",
})


def _required_text(value: object, name: str, *, limit: int = 256) -> str:
    if not isinstance(value, str) or not value or len(value) > limit or "\x00" in value:
        raise ValidationError(f"invalid {name}")
    return value


def _sha(value: object, name: str) -> str:
    if not isinstance(value, str) or SHA_RE.fullmatch(value) is None:
        raise ValidationError(f"{name} must be a full lowercase Git SHA")
    return value


def _repo_path(value: object, name: str, *, allow_pattern: bool) -> str:
    path = _required_text(value, name, limit=1024)
    if path.startswith("/") or "\\" in path:
        raise ValidationError(f"{name} must be repository-relative POSIX path")
    parts = path.split("/")
    if any(part in {"", ".", ".."} for part in parts):
        raise ValidationError(f"{name} contains unsafe path segment")
    wildcard_chars = set("*?[]")
    if allow_pattern and path.endswith("/**"):
        stem = path[:-3]
        if not stem or any(ch in stem for ch in wildcard_chars):
            raise ValidationError(f"{name} has unsupported scope pattern")
    elif any(ch in path for ch in wildcard_chars):
        raise ValidationError(f"{name} has unsupported wildcard")
    return path


def _exact_paths(value: object, name: str, *, nonempty: bool) -> list[str]:
    if not isinstance(value, list) or (nonempty and not value):
        raise ValidationError(f"{name} must be {'nonempty ' if nonempty else ''}list")
    paths = [_repo_path(item, name, allow_pattern=False) for item in value]
    if paths != sorted(paths) or len(paths) != len(set(paths)):
        raise ValidationError(f"{name} must be sorted and duplicate-free")
    return paths


def _scope(value: object, name: str, *, nonempty: bool) -> list[str]:
    if not isinstance(value, list) or (nonempty and not value):
        raise ValidationError(f"{name} must be {'nonempty ' if nonempty else ''}list")
    paths = [_repo_path(item, name, allow_pattern=True) for item in value]
    if paths != sorted(paths) or len(paths) != len(set(paths)):
        raise ValidationError(f"{name} must be sorted and duplicate-free")
    return paths


def scope_matches(path: str, patterns: Sequence[str]) -> bool:
    exact = _repo_path(path, "actual path", allow_pattern=False)
    for pattern in patterns:
        _repo_path(pattern, "scope path", allow_pattern=True)
        if pattern.endswith("/**"):
            prefix = pattern[:-3]
            if exact.startswith(prefix + "/"):
                return True
        elif exact == pattern:
            return True
    return False


def scopes_overlap(first: Sequence[str], second: Sequence[str]) -> bool:
    for pattern in first:
        probe = pattern[:-3] + "/__scope_probe__" if pattern.endswith("/**") else pattern
        if scope_matches(probe, second):
            return True
    for pattern in second:
        probe = pattern[:-3] + "/__scope_probe__" if pattern.endswith("/**") else pattern
        if scope_matches(probe, first):
            return True
    return False


def derived_planning_path(initiative_ref: str, path: str) -> bool:
    initiative = _repo_path(initiative_ref, "initiative_ref", allow_pattern=False)
    target = _repo_path(path, "planning path", allow_pattern=False)
    fixed = {
        f"{initiative}/intent.md",
        f"{initiative}/spec.md",
        f"{initiative}/plan.md",
        f"{initiative}/tasklist.md",
    }
    return target in fixed or target.startswith(f"{initiative}/work-blocks/")


def _validate_role(role: object, name: str, *, candidate: str | None, critic_revision: str | None = None) -> None:
    if not isinstance(role, dict):
        raise ValidationError(f"{name} state must be object")
    if name == "critic":
        if set(role) != {"status", "subject_revision"}:
            raise ValidationError("critic schema is unknown")
        status = role["status"]
        if status not in {"PENDING", "BLOCKED", "READY"}:
            raise ValidationError("critic status is unknown")
        if status == "READY":
            if role["subject_revision"] != critic_revision:
                raise ValidationError("READY Critic must bind current planning revision")
        elif role["subject_revision"] is not None:
            raise ValidationError("non-READY Critic must not bind a revision")
        return
    if set(role) != {"status", "candidate_sha"}:
        raise ValidationError(f"{name} schema is unknown")
    status = role["status"]
    if status not in {"PENDING", "READY"}:
        raise ValidationError(f"{name} status is unknown")
    if status == "READY":
        if candidate is None or role["candidate_sha"] != candidate:
            raise ValidationError(f"READY {name} must bind exact candidate")
    elif role["candidate_sha"] is not None:
        raise ValidationError(f"PENDING {name} must not bind candidate")


def validate(state: Mapping[str, object]) -> None:
    if not isinstance(state, dict) or set(state) != {"schema_version", "lifecycle_state", "active"}:
        raise ValidationError("state schema is unknown")
    if state["schema_version"] != SCHEMA_VERSION or state["lifecycle_state"] not in STATES:
        raise ValidationError("state version or lifecycle state is unknown")
    lifecycle = state["lifecycle_state"]
    active = state["active"]
    if lifecycle == "INACTIVE":
        if active is not None:
            raise ValidationError("INACTIVE cannot hold active authority")
        return
    if not isinstance(active, dict) or set(active) != ACTIVE_FIELDS:
        raise ValidationError("active Work Block schema is unknown")

    wb = _required_text(active["work_block_id"], "work_block_id", limit=128)
    if WORK_BLOCK_RE.fullmatch(wb) is None:
        raise ValidationError("work_block_id does not match canonical grammar")
    initiative = _repo_path(active["initiative_ref"], "initiative_ref", allow_pattern=False)
    admission_id = _required_text(active["admission_id"], "admission_id", limit=128)
    if ADMISSION_ID_RE.fullmatch(admission_id) is None:
        raise ValidationError("invalid admission_id")
    _required_text(active["subject_branch"], "subject_branch", limit=256)
    _sha(active["base_commit"], "base_commit")

    profile = active["authority_profile"]
    if not isinstance(profile, dict) or set(profile) != {"id", "revision"}:
        raise ValidationError("authority_profile schema is unknown")
    _required_text(profile["id"], "authority_profile.id", limit=128)
    _sha(profile["revision"], "authority_profile.revision")

    planning = active["planning_subject"]
    if not isinstance(planning, dict) or set(planning) != {"revision", "paths"}:
        raise ValidationError("planning_subject schema is unknown")
    planning_revision = _sha(planning["revision"], "planning_subject.revision")
    planning_paths = _exact_paths(planning["paths"], "planning_subject.paths", nonempty=True)
    for path in planning_paths:
        if not derived_planning_path(initiative, path):
            raise ValidationError("planning path is outside derived initiative planning surface")

    impl = _scope(active["implementation_write_set"], "implementation_write_set", nonempty=True)
    coord = _scope(active["coordination_scope"], "coordination_scope", nonempty=False)
    if scopes_overlap(impl, coord):
        raise ValidationError("implementation and coordination scopes overlap")
    for path in planning_paths:
        if not scope_matches(path, coord):
            raise ValidationError("planning path must be covered by coordination_scope")
        if scope_matches(path, impl):
            raise ValidationError("planning path must not be implementation authority")

    candidate = active["source_candidate_sha"]
    if candidate is not None:
        candidate = _sha(candidate, "source_candidate_sha")

    _validate_role(active["critic"], "critic", candidate=candidate, critic_revision=planning_revision)
    _validate_role(active["reviewer"], "reviewer", candidate=candidate)
    _validate_role(active["verifier"], "verifier", candidate=candidate)

    critic_status = active["critic"]["status"]
    reviewer_status = active["reviewer"]["status"]
    verifier_status = active["verifier"]["status"]
    if lifecycle == "DEFINE":
        if critic_status not in {"PENDING", "BLOCKED"} or candidate is not None:
            raise ValidationError("DEFINE has contradictory authority")
        if reviewer_status != "PENDING" or verifier_status != "PENDING":
            raise ValidationError("DEFINE cannot retain candidate assurance")
    elif lifecycle == "EXECUTE":
        if critic_status != "READY" or candidate is not None:
            raise ValidationError("EXECUTE requires READY Critic and no candidate")
        if reviewer_status != "PENDING" or verifier_status != "PENDING":
            raise ValidationError("EXECUTE cannot retain candidate assurance")
    elif lifecycle == "ASSURE":
        if critic_status != "READY" or candidate is None:
            raise ValidationError("ASSURE requires READY Critic and candidate")
        if verifier_status == "READY" and reviewer_status != "READY":
            raise ValidationError("Verifier READY requires Reviewer READY")


def _copy_active(state: dict, expected: set[str]) -> dict:
    validate(state)
    if state["lifecycle_state"] not in expected:
        raise TransitionDenied(f"transition requires one of {sorted(expected)}")
    return copy.deepcopy(state)


def _clear_candidate_assurance(active: dict) -> None:
    active["source_candidate_sha"] = None
    active["reviewer"] = {"status": "PENDING", "candidate_sha": None}
    active["verifier"] = {"status": "PENDING", "candidate_sha": None}


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
            raise TransitionDenied("open requires missing state or INACTIVE")
    next_state = {
        "schema_version": SCHEMA_VERSION,
        "lifecycle_state": "DEFINE",
        "active": {
            "work_block_id": work_block_id,
            "initiative_ref": initiative_ref,
            "admission_id": admission_id,
            "subject_branch": subject_branch,
            "base_commit": base_commit,
            "authority_profile": {"id": authority_profile_id, "revision": authority_profile_revision},
            "planning_subject": {"revision": planning_revision, "paths": sorted(planning_paths)},
            "implementation_write_set": sorted(implementation_write_set),
            "coordination_scope": sorted(coordination_scope),
            "critic": {"status": "PENDING", "subject_revision": None},
            "source_candidate_sha": None,
            "reviewer": {"status": "PENDING", "candidate_sha": None},
            "verifier": {"status": "PENDING", "candidate_sha": None},
        },
    }
    validate(next_state)
    return next_state


def critic_result(state: dict, outcome: str, *, planning_verified: bool = True) -> dict:
    next_state = _copy_active(state, {"DEFINE"})
    if outcome == "blocked":
        next_state["active"]["critic"] = {"status": "BLOCKED", "subject_revision": None}
    elif outcome == "ready":
        if not planning_verified:
            raise TransitionDenied("Critic READY requires exact current planning subject")
        revision = next_state["active"]["planning_subject"]["revision"]
        next_state["active"]["critic"] = {"status": "READY", "subject_revision": revision}
        next_state["lifecycle_state"] = "EXECUTE"
    else:
        raise TransitionDenied("unknown Critic outcome")
    validate(next_state)
    return next_state


def revise_begin(state: dict) -> dict:
    next_state = _copy_active(state, {"EXECUTE", "ASSURE"})
    next_state["lifecycle_state"] = "DEFINE"
    next_state["active"]["critic"] = {"status": "PENDING", "subject_revision": None}
    _clear_candidate_assurance(next_state["active"])
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
    next_state = _copy_active(state, {"DEFINE"})
    next_state["active"]["planning_subject"] = {"revision": planning_revision, "paths": sorted(planning_paths)}
    next_state["active"]["implementation_write_set"] = sorted(implementation_write_set)
    next_state["active"]["coordination_scope"] = sorted(coordination_scope)
    next_state["active"]["critic"] = {"status": "PENDING", "subject_revision": None}
    _clear_candidate_assurance(next_state["active"])
    validate(next_state)
    return next_state


def create_candidate(state: dict, candidate_sha: str, *, git_verified: bool = True) -> dict:
    next_state = _copy_active(state, {"EXECUTE"})
    if not git_verified:
        raise TransitionDenied("candidate Git predicates are not satisfied")
    _sha(candidate_sha, "candidate_sha")
    next_state["lifecycle_state"] = "ASSURE"
    next_state["active"]["source_candidate_sha"] = candidate_sha
    next_state["active"]["reviewer"] = {"status": "PENDING", "candidate_sha": None}
    next_state["active"]["verifier"] = {"status": "PENDING", "candidate_sha": None}
    validate(next_state)
    return next_state


def reviewer_result(state: dict, outcome: str) -> dict:
    next_state = _copy_active(state, {"ASSURE"})
    active = next_state["active"]
    candidate = active["source_candidate_sha"]
    if outcome == "ready":
        active["reviewer"] = {"status": "READY", "candidate_sha": candidate}
    elif outcome == "rework":
        next_state["lifecycle_state"] = "EXECUTE"
        _clear_candidate_assurance(active)
    elif outcome == "scope-change":
        next_state["lifecycle_state"] = "DEFINE"
        active["critic"] = {"status": "PENDING", "subject_revision": None}
        _clear_candidate_assurance(active)
    else:
        raise TransitionDenied("unknown Reviewer outcome")
    validate(next_state)
    return next_state


def verifier_result(state: dict, outcome: str) -> dict:
    next_state = _copy_active(state, {"ASSURE"})
    active = next_state["active"]
    candidate = active["source_candidate_sha"]
    if outcome == "ready":
        if active["reviewer"] != {"status": "READY", "candidate_sha": candidate}:
            raise TransitionDenied("Verifier READY requires Reviewer READY for exact candidate")
        active["verifier"] = {"status": "READY", "candidate_sha": candidate}
    elif outcome == "evidence-problem":
        active["verifier"] = {"status": "PENDING", "candidate_sha": None}
    elif outcome == "rework":
        next_state["lifecycle_state"] = "EXECUTE"
        _clear_candidate_assurance(active)
    elif outcome == "scope-change":
        next_state["lifecycle_state"] = "DEFINE"
        active["critic"] = {"status": "PENDING", "subject_revision": None}
        _clear_candidate_assurance(active)
    else:
        raise TransitionDenied("unknown Verifier outcome")
    validate(next_state)
    return next_state


def close(state: dict, outcome: str) -> dict:
    _copy_active(state, {"DEFINE", "EXECUTE", "ASSURE"})
    if outcome not in {"reporting-only", "cancelled"}:
        raise TransitionDenied("close supports only reporting-only or cancelled")
    return copy.deepcopy(INACTIVE)


def publish_success(state: dict) -> dict:
    next_state = _copy_active(state, {"ASSURE"})
    active = next_state["active"]
    candidate = active["source_candidate_sha"]
    expected = {"status": "READY", "candidate_sha": candidate}
    if active["reviewer"] != expected or active["verifier"] != expected:
        raise TransitionDenied("publish success requires exact Reviewer and Verifier READY")
    return copy.deepcopy(INACTIVE)
