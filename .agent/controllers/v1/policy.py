"""One runtime-neutral evaluator for normalized local enforcement events."""

from __future__ import annotations

from pathlib import Path

from . import gitfacts
from .errors import ControllerError, ValidationError
from .events import Decision, Event, ZERO_SHA
from .state import is_define_planning_path, path_matches, validate

__all__ = ["Decision", "Event", "evaluate"]


def _allow(code: str, reason: str) -> Decision:
    return Decision("ALLOW", code, reason)


def _deny(code: str, reason: str) -> Decision:
    return Decision("DENY", code, reason)


def _advisory(code: str, reason: str) -> Decision:
    return Decision("ADVISORY", code, reason)


def _record_binding(record: object, *, repository: str, branch: str, active: dict | None = None) -> bool:
    required = ("admission_id", "repository", "authority_profile_id", "authority_profile_revision", "base_commit", "subject_branch")
    if any(not hasattr(record, key) for key in required):
        return False
    if record.repository != repository or record.subject_branch != branch:
        return False
    if active is None:
        return True
    return (
        record.admission_id == active["admission_id"]
        and record.authority_profile_id == active["authority_profile"]["id"]
        and record.authority_profile_revision == active["authority_profile"]["revision"]
        and record.base_commit == active["base_commit"]
    )


def _resolved_target(root: Path, path: str) -> str:
    target = (root / path).resolve(strict=False)
    try:
        return target.relative_to(root).as_posix()
    except ValueError as exc:
        raise ValidationError("target path escapes target worktree") from exc


def _protected_policy(path: str) -> bool:
    return path == ".agent/policies" or path.startswith(".agent/policies/")


def _forbidden_commit_path(path: str) -> bool:
    name = Path(path).name
    if path == ".env" or (name.startswith(".env.") and not name.endswith(".example")):
        return True
    if path.startswith(".ssh/") or name in {"id_rsa", "id_ed25519"}:
        return True
    return Path(path).suffix.lower() in {".key", ".p12", ".pfx"}


def _classify(active: dict, path: str) -> str:
    planning = is_define_planning_path(active["initiative_ref"], path)
    implementation = any(path_matches(path, pattern) for pattern in active["implementation_write_set"])
    coordination = any(path_matches(path, pattern) for pattern in active["coordination_scope"])
    if implementation and coordination:
        return "ambiguous"
    if planning:
        return "planning"
    if implementation:
        return "implementation"
    if coordination:
        return "coordination"
    return "outside"


def _path_decision(active: dict, lifecycle: str, path: str, *, commit: bool) -> Decision:
    if _protected_policy(path):
        return _deny("COMMIT_FORBIDDEN_PATH" if commit else "WRITE_OUTSIDE_SCOPE", "protected policy surface")
    category = _classify(active, path)
    if category == "ambiguous":
        return _deny("COMMIT_SCOPE_DENIED" if commit else "WRITE_SCOPE_AMBIGUOUS", "path matches implementation and coordination scopes")
    if category == "planning":
        if lifecycle == "DEFINE":
            return _allow("COMMIT_ALLOWED" if commit else "WRITE_PLANNING_ALLOWED", "DEFINE planning path allowed")
        return _deny("COMMIT_SCOPE_DENIED" if commit else "WRITE_PLANNING_STAGE_DENIED", "planning mutation requires DEFINE")
    if category == "implementation":
        if lifecycle == "EXECUTE":
            return _allow("COMMIT_ALLOWED" if commit else "WRITE_IMPLEMENTATION_ALLOWED", "EXECUTE implementation path allowed")
        return _deny("COMMIT_POST_CANDIDATE_DENIED" if commit and lifecycle == "ASSURE" else "COMMIT_SCOPE_DENIED" if commit else "LIFECYCLE_STAGE_DENIED", "implementation mutation requires EXECUTE")
    if category == "coordination":
        return _allow("COMMIT_ALLOWED" if commit else "WRITE_COORDINATION_ALLOWED", "coordination path allowed")
    return _deny("COMMIT_SCOPE_DENIED" if commit else "WRITE_OUTSIDE_SCOPE", "path is outside admitted authority")


def _resolve_context(event: Event, *, controller_root: Path | None, repository: str | None) -> tuple[Path, str]:
    root = gitfacts.worktree_root(Path(event.worktree_root))
    if root != Path(event.worktree_root).resolve():
        raise ValidationError("event worktree_root is not canonical")
    if controller_root is not None and gitfacts.common_dir(root) != gitfacts.common_dir(controller_root.resolve(strict=True)):
        raise ValidationError("event worktree belongs to a different Git repository")
    identity = repository or gitfacts.repository_identity(root)
    return root, identity


def _active_record(state: dict, resolver: object | None, repository: str, branch: str) -> object | None:
    active = state["active"]
    if active is None:
        return None
    if resolver is None or not hasattr(resolver, "resolve"):
        return None
    try:
        record = resolver.resolve(active["admission_id"])
    except Exception:
        return None
    return record if _record_binding(record, repository=repository, branch=branch, active=active) else None


def evaluate(
    event: Event,
    state: dict | None,
    *,
    resolver: object | None = None,
    pre_admission: object | None = None,
    repository: str | None = None,
    default_branch: str | None = None,
    controller_root: Path | None = None,
) -> Decision:
    """Evaluate one validated normalized event. Any malformed authority fails closed."""
    try:
        root, repository_id = _resolve_context(event, controller_root=controller_root, repository=repository)
        current_branch = gitfacts.branch(root) if event.kind not in {"diagnostic"} else event.branch
        if event.kind not in {"diagnostic"} and (event.branch is None or current_branch != event.branch):
            return _deny("BRANCH_UNKNOWN" if event.branch is None else "BRANCH_MISMATCH", "event branch differs from target worktree")

        if state is not None:
            validate(state)
        active = None if state is None else state["active"]
        active_record = None
        if active is not None:
            if event.branch != active["subject_branch"]:
                return _deny("BRANCH_MISMATCH", "current branch differs from active subject branch")
            active_record = _active_record(state, resolver, repository_id, event.branch)
            if active_record is None:
                return _deny("STATE_INVALID", "active admission binding is unavailable or mismatched")

        if event.kind == "subagent_context":
            return _advisory("CONTEXT_AVAILABLE" if active else "CONTEXT_UNAVAILABLE", "read-only controller context")
        if event.kind == "diagnostic":
            return _advisory("CONTEXT_AVAILABLE" if state is not None else "CONTEXT_UNAVAILABLE", "diagnostic event has no authority")

        if event.kind == "structured_write":
            return _structured_write(event, state, root, repository_id, pre_admission)
        if event.kind == "git_pre_commit":
            return _pre_commit(event, state, root, repository_id, pre_admission, default_branch, active_record)
        if event.kind == "git_commit_message":
            return _commit_message(event, state)
        if event.kind == "git_pre_push":
            return _pre_push(event, state, root)
        return _deny("STATE_INVALID", "unsupported authority-bearing event")
    except (ControllerError, OSError, ValueError, TypeError, KeyError) as exc:
        return _deny("STATE_INVALID", f"invalid state/event/Git facts: {exc}")


def _pre_wb_admitted(record: object | None, *, repository: str, branch: str) -> bool:
    return record is not None and _record_binding(record, repository=repository, branch=branch)


def _structured_write(event: Event, state: dict | None, root: Path, repository: str, pre_admission: object | None) -> Decision:
    paths = [_resolved_target(root, path) for path in event.paths]
    if state is None or state["lifecycle_state"] == "INACTIVE":
        if not _pre_wb_admitted(pre_admission, repository=repository, branch=event.branch or ""):
            return _deny("STATE_MISSING" if state is None else "STATE_INACTIVE", "pre-WB mutation requires trusted admission")
        if all(path.startswith("docs/changes/") for path in paths):
            return _allow("WRITE_PLANNING_ALLOWED", "admitted pre-WB planning write")
        return _deny("WRITE_OUTSIDE_SCOPE", "pre-WB writes are limited to docs/changes/**")

    active = state["active"]
    decisions = [_path_decision(active, state["lifecycle_state"], path, commit=False) for path in paths]
    denied = next((item for item in decisions if item.decision == "DENY"), None)
    if denied:
        return denied
    codes = {item.code for item in decisions}
    if codes == {"WRITE_IMPLEMENTATION_ALLOWED"}:
        return _allow("WRITE_IMPLEMENTATION_ALLOWED", "all targets are admitted implementation paths")
    if codes <= {"WRITE_COORDINATION_ALLOWED"}:
        return _allow("WRITE_COORDINATION_ALLOWED", "all targets are admitted coordination paths")
    if codes <= {"WRITE_PLANNING_ALLOWED", "WRITE_COORDINATION_ALLOWED"}:
        return _allow("WRITE_PLANNING_ALLOWED", "DEFINE planning/coordination targets allowed")
    return _allow("WRITE_IMPLEMENTATION_ALLOWED", "all structured targets are admitted for current stage")


def _pre_commit(
    event: Event,
    state: dict | None,
    root: Path,
    repository: str,
    pre_admission: object | None,
    default_branch: str | None,
    active_record: object | None,
) -> Decision:
    head = gitfacts.full_sha(root, "HEAD")
    if event.facts["head_sha"] != head or tuple(gitfacts.staged_paths(root)) != event.paths:
        return _deny("STATE_INVALID", "pre-commit event does not match actual Git index/HEAD")
    branch = event.branch or ""
    inferred_default = default_branch
    if inferred_default is None:
        record = active_record or pre_admission
        base_ref = getattr(record, "base_ref", None)
        if isinstance(base_ref, str) and not base_ref.startswith("refs/"):
            inferred_default = base_ref
    if inferred_default and branch == inferred_default:
        return _deny("COMMIT_DEFAULT_BRANCH_DENIED", "commit on default/admitted base branch is denied")
    if any(_forbidden_commit_path(path) or _protected_policy(path) for path in event.paths):
        return _deny("COMMIT_FORBIDDEN_PATH", "staged local/secret/protected path is forbidden")

    if state is None or state["lifecycle_state"] == "INACTIVE":
        if not _pre_wb_admitted(pre_admission, repository=repository, branch=branch):
            return _deny("STATE_MISSING" if state is None else "STATE_INACTIVE", "pre-WB commit requires trusted admission")
        if all(path.startswith("docs/changes/") for path in event.paths):
            return _allow("COMMIT_ALLOWED", "admitted pre-WB planning commit")
        return _deny("COMMIT_SCOPE_DENIED", "pre-WB commit contains non-planning path")

    active = state["active"]
    for path in event.paths:
        decision = _path_decision(active, state["lifecycle_state"], path, commit=True)
        if not decision.allowed:
            return decision
    return _allow("COMMIT_ALLOWED", "actual staged paths satisfy current Work Block authority")


def _commit_message(event: Event, state: dict | None) -> Decision:
    if state is None or state["lifecycle_state"] == "INACTIVE":
        return _allow("COMMIT_MESSAGE_ALLOWED", "pre-WB/INACTIVE commit needs no Work-Block trailer")
    trailers = event.facts["work_block_trailers"]
    if len(trailers) == 0:
        return _deny("COMMIT_MESSAGE_TRAILER_MISSING", "active Work Block requires one trailer")
    if len(trailers) > 1:
        return _deny("COMMIT_MESSAGE_TRAILER_DUPLICATE", "multiple Work-Block trailers are forbidden")
    if trailers[0] != state["active"]["work_block_id"]:
        return _deny("COMMIT_MESSAGE_TRAILER_MISMATCH", "Work-Block trailer differs from active identity")
    return _allow("COMMIT_MESSAGE_ALLOWED", "Work-Block trailer matches active identity")


def _pre_push(event: Event, state: dict | None, root: Path) -> Decision:
    if state is None or state["lifecycle_state"] != "ASSURE":
        return _deny("PUSH_STAGE_DENIED", "publication requires ASSURE")
    active = state["active"]
    facts = event.facts
    expected_ref = f"refs/heads/{active['subject_branch']}"
    if event.branch != active["subject_branch"] or facts["remote_name"] != "origin" or facts["local_ref"] != expected_ref or facts["remote_ref"] != expected_ref:
        return _deny("PUSH_REF_DENIED", "push must target the exact subject branch on origin")
    if facts["local_sha"] == ZERO_SHA:
        return _deny("PUSH_DELETE_DENIED", "subject branch deletion is denied")
    local_sha = gitfacts.full_sha(root, facts["local_sha"])
    remote_sha = facts["remote_sha"]
    if remote_sha != ZERO_SHA:
        try:
            if not gitfacts.is_ancestor(root, remote_sha, local_sha):
                return _deny("PUSH_NON_FAST_FORWARD_DENIED", "remote update is not fast-forward")
        except ControllerError:
            return _deny("PUSH_NON_FAST_FORWARD_DENIED", "remote ancestry cannot be proven locally")
    candidate = active["source_candidate_sha"]
    if not gitfacts.is_ancestor(root, candidate, local_sha):
        return _deny("PUSH_CANDIDATE_MISMATCH", "push tip does not contain exact assured candidate")
    if active["reviewer"]["status"] != "READY" or active["verifier"]["status"] != "READY":
        return _deny("PUSH_ASSURANCE_NOT_READY", "Reviewer and Verifier must be READY")
    for commit in gitfacts.commits_after(root, candidate, local_sha):
        for path in gitfacts.commit_paths(root, commit):
            if _protected_policy(path) or _classify(active, path) != "coordination":
                return _deny("PUSH_POST_CANDIDATE_HISTORY_DENIED", "post-candidate history is not coordination-only")
    return _allow("PUSH_ALLOWED", "exact assured non-force subject publication is allowed")
