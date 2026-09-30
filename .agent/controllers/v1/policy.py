"""Shared runtime-neutral policy evaluator for normalized events."""

from __future__ import annotations

from pathlib import Path

from . import gitfacts
from .errors import ControllerError, StopAndPreserve, ValidationError
from .events import Decision, Event, decision
from .state import (
    derived_planning_path,
    scope_matches,
    scopes_overlap,
    validate as validate_state,
)

PRE_WB_PREFIX = "docs/changes/"
PROTECTED_PREFIX = ".agent/policies/"
FORBIDDEN_EXACT = frozenset({".env", ".env.local", ".npmrc"})
FORBIDDEN_SUFFIXES = (".pem", ".key", ".p12", ".pfx")


def _protected(path: str) -> bool:
    return path == ".agent/policies" or path.startswith(PROTECTED_PREFIX)


def _forbidden(path: str) -> bool:
    name = path.rsplit("/", 1)[-1]
    return path in FORBIDDEN_EXACT or name in FORBIDDEN_EXACT or path.endswith(FORBIDDEN_SUFFIXES)


def _pre_wb_planning(path: str) -> bool:
    return path.startswith(PRE_WB_PREFIX) and not _protected(path)


def _admission_matches(event: Event, admission, repository_id: str | None) -> bool:
    return (
        admission is not None
        and repository_id is not None
        and getattr(admission, "repository", None) == repository_id
        and event.branch == getattr(admission, "subject_branch", None)
        and getattr(admission, "admission_id", None)
        and getattr(admission, "base_commit", None)
    )


def _classify_active(path: str, active: dict) -> str:
    planning = path in set(active["planning_subject"]["paths"])
    implementation = scope_matches(path, active["implementation_write_set"])
    coordination = scope_matches(path, active["coordination_scope"])
    if implementation and coordination:
        return "ambiguous"
    if planning:
        return "planning"
    if implementation:
        return "implementation"
    if coordination:
        return "coordination"
    if derived_planning_path(active["initiative_ref"], path):
        return "planning-surface"
    return "outside"


def _write_decision(event: Event, state: dict | None, admission=None, repository_id: str | None = None) -> Decision:
    if any(_protected(path) for path in event.paths):
        return decision("DENY", "COMMIT_FORBIDDEN_PATH", "protected policy surface is not ordinary Work Block authority")
    if state is None or state["lifecycle_state"] == "INACTIVE":
        if not _admission_matches(event, admission, repository_id):
            code = "STATE_MISSING" if state is None else "STATE_INACTIVE"
            return decision("DENY", code, "pre-WB planning requires trusted admission")
        if all(_pre_wb_planning(path) for path in event.paths):
            return decision("ALLOW", "WRITE_PLANNING_ALLOWED", "admitted pre-WB planning write")
        return decision("DENY", "WRITE_OUTSIDE_SCOPE", "pre-WB writes are limited to docs/changes/**")

    active = state["active"]
    if event.branch != active["subject_branch"]:
        return decision("DENY", "BRANCH_MISMATCH", "event branch differs from active subject branch")

    kinds = [_classify_active(path, active) for path in event.paths]
    if "ambiguous" in kinds:
        return decision("DENY", "WRITE_SCOPE_AMBIGUOUS", "path matches implementation and coordination scopes")
    lifecycle = state["lifecycle_state"]
    if lifecycle == "DEFINE":
        if all(kind in {"planning", "planning-surface", "coordination"} for kind in kinds):
            code = "WRITE_PLANNING_ALLOWED" if any(
                kind in {"planning", "planning-surface"} for kind in kinds
            ) else "WRITE_COORDINATION_ALLOWED"
            return decision("ALLOW", code, "DEFINE targets are inside planning/coordination authority")
        return decision("DENY", "WRITE_OUTSIDE_SCOPE", "DEFINE write is outside planning/coordination authority")
    if lifecycle == "EXECUTE":
        if any(kind in {"planning", "planning-surface"} for kind in kinds):
            return decision("DENY", "WRITE_PLANNING_STAGE_DENIED", "planning mutation requires DEFINE")
        if all(kind in {"implementation", "coordination"} for kind in kinds):
            code = "WRITE_IMPLEMENTATION_ALLOWED" if "implementation" in kinds else "WRITE_COORDINATION_ALLOWED"
            return decision("ALLOW", code, "EXECUTE targets are inside admitted implementation/coordination scopes")
        return decision("DENY", "WRITE_OUTSIDE_SCOPE", "EXECUTE write is outside admitted scopes")
    if lifecycle == "ASSURE":
        if any(kind in {"implementation", "planning", "planning-surface"} for kind in kinds):
            return decision("DENY", "LIFECYCLE_STAGE_DENIED", "ASSURE permits coordination-only mutation")
        if all(kind == "coordination" for kind in kinds):
            return decision("ALLOW", "WRITE_COORDINATION_ALLOWED", "ASSURE coordination-only write is admitted")
        return decision("DENY", "WRITE_OUTSIDE_SCOPE", "ASSURE write is outside coordination_scope")
    return decision("DENY", "LIFECYCLE_STAGE_DENIED", "lifecycle stage denies write")


def _precommit(event: Event, state: dict | None, *, admission=None, repository_id: str | None, default_branch: str | None) -> Decision:
    if default_branch is None or event.branch == default_branch:
        return decision("DENY", "COMMIT_DEFAULT_BRANCH_DENIED", "default branch commit is denied")
    if any(_protected(path) or _forbidden(path) for path in event.paths):
        return decision("DENY", "COMMIT_FORBIDDEN_PATH", "forbidden/protected path is staged")
    write_like = Event(
        event.event_version, event.source, "structured_write",
        event.worktree_root, event.branch, event.paths, event.facts,
    )
    result = _write_decision(write_like, state, admission, repository_id)
    if result.allowed:
        return decision("ALLOW", "COMMIT_ALLOWED", "staged paths satisfy lifecycle containment")
    if state is not None and state["lifecycle_state"] == "ASSURE":
        return decision("DENY", "COMMIT_POST_CANDIDATE_DENIED", result.reason)
    return decision("DENY", "COMMIT_SCOPE_DENIED", result.reason)


def _commit_message(event: Event, state: dict | None) -> Decision:
    if state is None or state["lifecycle_state"] == "INACTIVE":
        return decision("ALLOW", "COMMIT_MESSAGE_ALLOWED", "no active Work Block trailer required")
    active = state["active"]
    if event.branch != active["subject_branch"]:
        return decision("DENY", "BRANCH_MISMATCH", "commit branch differs from active subject branch")
    trailers = list(event.facts["work_block_trailers"])
    if not trailers:
        return decision("DENY", "COMMIT_MESSAGE_TRAILER_MISSING", "active commit requires Work-Block trailer")
    if len(trailers) != 1:
        return decision("DENY", "COMMIT_MESSAGE_TRAILER_DUPLICATE", "active commit requires exactly one Work-Block trailer")
    if trailers[0] != active["work_block_id"]:
        return decision("DENY", "COMMIT_MESSAGE_TRAILER_MISMATCH", "Work-Block trailer does not match active Work Block")
    return decision("ALLOW", "COMMIT_MESSAGE_ALLOWED", "Work-Block trailer matches active Work Block")


def post_candidate_history_allowed(root: Path, state: dict, tip: str) -> bool:
    active = state["active"]
    candidate = active["source_candidate_sha"]
    if candidate is None or not gitfacts.is_ancestor(root, candidate, tip):
        return False
    planning = set(active["planning_subject"]["paths"])
    for commit in gitfacts.commits_between(root, candidate, tip):
        for path in gitfacts.commit_paths(root, commit):
            if path in planning:
                return False
            if scope_matches(path, active["implementation_write_set"]):
                return False
            if not scope_matches(path, active["coordination_scope"]):
                return False
    return True


def _prepush(event: Event, state: dict | None, *, default_branch: str | None) -> Decision:
    if state is None or state["lifecycle_state"] != "ASSURE":
        return decision("DENY", "PUSH_STAGE_DENIED", "push requires active ASSURE state")
    active = state["active"]
    if event.branch != active["subject_branch"]:
        return decision("DENY", "BRANCH_MISMATCH", "push branch differs from active subject branch")
    if default_branch is None or active["subject_branch"] == default_branch:
        return decision("DENY", "PUSH_REF_DENIED", "default/unknown branch publication is denied")

    facts = event.facts
    expected_ref = f"refs/heads/{active['subject_branch']}"
    if facts["local_sha"] == gitfacts.ZERO_SHA:
        return decision("DENY", "PUSH_DELETE_DENIED", "ref deletion is denied")
    if facts["local_ref"] != expected_ref or facts["remote_ref"] != expected_ref:
        return decision("DENY", "PUSH_REF_DENIED", "publication must target exact subject branch")
    candidate = active["source_candidate_sha"]
    local_sha = facts["local_sha"]
    try:
        if not gitfacts.is_ancestor(Path(event.worktree_root), candidate, local_sha):
            return decision("DENY", "PUSH_CANDIDATE_MISMATCH", "pushed tip does not contain assured candidate")
        remote_sha = facts["remote_sha"]
        if remote_sha != gitfacts.ZERO_SHA and not gitfacts.is_ancestor(Path(event.worktree_root), remote_sha, local_sha):
            return decision("DENY", "PUSH_NON_FAST_FORWARD_DENIED", "publication is not fast-forward")
        expected_ready = {"status": "READY", "candidate_sha": candidate}
        if active["reviewer"] != expected_ready or active["verifier"] != expected_ready:
            return decision("DENY", "PUSH_ASSURANCE_NOT_READY", "exact candidate assurance is incomplete")
        if not post_candidate_history_allowed(Path(event.worktree_root), state, local_sha):
            return decision("DENY", "PUSH_POST_CANDIDATE_HISTORY_DENIED", "post-candidate history is not coordination-only")
    except ControllerError as exc:
        return decision("DENY", "PUSH_POST_CANDIDATE_HISTORY_DENIED", str(exc))
    return decision("ALLOW", "PUSH_ALLOWED", "exact assured subject publication is allowed")


def evaluate(
    event: Event,
    state: dict | None,
    *,
    admission=None,
    repository_id: str | None = None,
    default_branch: str | None = None,
) -> Decision:
    """Return one deterministic normalized decision; malformed authority fails closed."""

    try:
        if state is not None:
            validate_state(state)
        if event.kind == "structured_write":
            return _write_decision(event, state, admission, repository_id)
        if event.kind == "git_pre_commit":
            return _precommit(event, state, admission=admission, repository_id=repository_id, default_branch=default_branch)
        if event.kind == "git_commit_message":
            return _commit_message(event, state)
        if event.kind == "git_pre_push":
            return _prepush(event, state, default_branch=default_branch)
        if event.kind == "subagent_context":
            if state is None or state["lifecycle_state"] == "INACTIVE":
                return decision("ADVISORY", "CONTEXT_UNAVAILABLE", "no active Work Block context")
            return decision("ADVISORY", "CONTEXT_AVAILABLE", "active Work Block context is available")
        if event.kind == "diagnostic":
            return decision("ALLOW", "CONTEXT_AVAILABLE", "diagnostic event has no authority")
        return decision("DENY", "STATE_INVALID", "unsupported event kind")
    except (ControllerError, ValidationError, ValueError, TypeError, KeyError) as exc:
        return decision("DENY", "STATE_INVALID", f"invalid state or event: {exc}")
