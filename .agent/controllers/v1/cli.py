"""Inert lifecycle CLI over schema v2. Production admission backend is injected later."""

from __future__ import annotations

import argparse
import json
import subprocess
import sys
from pathlib import Path

from . import gitfacts, policy, state, storage
from .errors import ControllerError, StopAndPreserve, TransitionDenied
from .events import Event, ZERO_SHA


def _payload(path: str | None) -> dict:
    if path is None:
        return {}
    value = json.loads(Path(path).read_text(encoding="utf-8"))
    if not isinstance(value, dict):
        raise ValueError("payload must be an object")
    return value


def _resolve_record(resolver: object | None, admission_id: str) -> object:
    if resolver is None or not hasattr(resolver, "resolve"):
        raise StopAndPreserve("trusted admission resolver is not configured")
    try:
        return resolver.resolve(admission_id)
    except Exception as exc:
        raise StopAndPreserve("trusted admission cannot be resolved") from exc


def _validate_active_record(root: Path, current: dict, resolver: object | None) -> object:
    active = current["active"]
    if active is None:
        raise StopAndPreserve("active Work Block is required")
    record = _resolve_record(resolver, active["admission_id"])
    repository = gitfacts.repository_identity(root)
    checks = {
        "repository": repository,
        "subject_branch": active["subject_branch"],
        "authority_profile_id": active["authority_profile"]["id"],
        "authority_profile_revision": active["authority_profile"]["revision"],
        "base_commit": active["base_commit"],
    }
    for field, expected in checks.items():
        if getattr(record, field, None) != expected:
            raise StopAndPreserve(f"trusted admission {field} mismatch")
    return record


def _branch_matches(root: Path, expected: str) -> None:
    if gitfacts.branch(root) != expected:
        raise StopAndPreserve("current branch differs from subject branch")


def _planning_paths_exist(root: Path, revision: str, paths: list[str]) -> None:
    for path in paths:
        if not gitfacts.path_exists(root, revision, path):
            raise TransitionDenied(f"planning path does not exist at revision: {path}")


def _scope_allows_candidate(active: dict, path: str) -> bool:
    implementation = any(state.path_matches(path, pattern) for pattern in active["implementation_write_set"])
    coordination = any(state.path_matches(path, pattern) for pattern in active["coordination_scope"])
    return (implementation or coordination) and not (implementation and coordination)


def _open(root: Path, current: dict | None, payload: dict, resolver: object | None) -> dict:
    admission_id = payload["admission_id"]
    record = _resolve_record(resolver, admission_id)
    repository = gitfacts.repository_identity(root)
    branch = gitfacts.branch(root)
    if getattr(record, "repository", None) != repository or getattr(record, "subject_branch", None) != branch:
        raise StopAndPreserve("trusted admission repository/subject mismatch")
    if branch == getattr(record, "base_ref", None):
        raise StopAndPreserve("subject branch must be non-default/admitted-base")
    base_commit = gitfacts.full_sha(root, getattr(record, "base_commit"))
    if base_commit != getattr(record, "base_commit"):
        raise StopAndPreserve("trusted admission base_commit is not exact")
    head = gitfacts.full_sha(root, "HEAD")
    if not gitfacts.is_ancestor(root, base_commit, head):
        raise StopAndPreserve("admitted base_commit is not an ancestor of subject history")
    planning_revision = gitfacts.full_sha(root, payload["planning_revision"])
    if not gitfacts.is_ancestor(root, base_commit, planning_revision) or not gitfacts.is_ancestor(root, planning_revision, head):
        raise StopAndPreserve("planning revision is outside admitted subject history")
    planning_paths = payload["planning_paths"]
    _planning_paths_exist(root, planning_revision, planning_paths)
    if not gitfacts.planning_unchanged(root, planning_revision, head, planning_paths):
        raise StopAndPreserve("planning subject changed after bound revision")
    if not gitfacts.clean(root):
        raise StopAndPreserve("open requires a clean committed planning worktree")
    return state.open_work_block(
        current,
        work_block_id=payload["work_block_id"],
        initiative_ref=payload["initiative_ref"],
        admission_id=admission_id,
        subject_branch=branch,
        base_commit=base_commit,
        authority_profile_id=getattr(record, "authority_profile_id"),
        authority_profile_revision=getattr(record, "authority_profile_revision"),
        planning_revision=planning_revision,
        planning_paths=planning_paths,
        implementation_write_set=payload["implementation_write_set"],
        coordination_scope=payload["coordination_scope"],
    )


def _critic(root: Path, current: dict, payload: dict) -> dict:
    _branch_matches(root, current["active"]["subject_branch"])
    outcome = payload["outcome"]
    if outcome == "ready":
        active = current["active"]
        head = gitfacts.full_sha(root, "HEAD")
        revision = active["planning_subject"]["revision"]
        if gitfacts.planning_surface_changed_after(root, revision, head, active["initiative_ref"]):
            raise StopAndPreserve("unbound planning-surface changes exist after planning revision")
        if not gitfacts.planning_unchanged(root, revision, head, active["planning_subject"]["paths"]):
            raise StopAndPreserve("authoritative planning subject differs from reviewed revision")
        return state.critic_result(current, "ready", subject_revision=payload["subject_revision"])
    return state.critic_result(current, outcome)


def _revise(root: Path, current: dict, payload: dict) -> dict:
    _branch_matches(root, current["active"]["subject_branch"])
    action = payload["action"]
    if action == "begin":
        return state.revise_begin(current)
    if action != "bind":
        raise TransitionDenied("revise action must be begin or bind")
    if not gitfacts.clean(root):
        raise StopAndPreserve("revise bind requires a clean committed planning revision")
    head = gitfacts.full_sha(root, "HEAD")
    revision = gitfacts.full_sha(root, payload["planning_revision"])
    if revision != head:
        raise StopAndPreserve("revise bind must bind the current committed HEAD")
    if not gitfacts.is_ancestor(root, current["active"]["base_commit"], revision):
        raise StopAndPreserve("revised planning revision does not descend from admitted base")
    _planning_paths_exist(root, revision, payload["planning_paths"])
    return state.revise_bind(
        current,
        planning_revision=revision,
        planning_paths=payload["planning_paths"],
        implementation_write_set=payload["implementation_write_set"],
        coordination_scope=payload["coordination_scope"],
    )


def _candidate(root: Path, current: dict) -> dict:
    active = current["active"]
    _branch_matches(root, active["subject_branch"])
    if not gitfacts.clean(root):
        raise StopAndPreserve("candidate requires a clean committed worktree/index")
    head = gitfacts.full_sha(root, "HEAD")
    if not gitfacts.is_ancestor(root, active["base_commit"], head):
        raise StopAndPreserve("candidate does not descend from admitted base")
    planning = active["planning_subject"]
    if not gitfacts.planning_unchanged(root, planning["revision"], head, planning["paths"]):
        raise StopAndPreserve("candidate contains an unreviewed planning-subject change")
    changed = gitfacts.changed_paths(root, active["base_commit"], head)
    bad = [path for path in changed if not _scope_allows_candidate(active, path)]
    if bad:
        raise StopAndPreserve(f"candidate contains path outside admitted scopes: {bad[0]}")
    return state.create_candidate(current, head)


def _reviewer(current: dict, payload: dict) -> dict:
    return state.reviewer_result(current, payload["outcome"], candidate_sha=payload.get("candidate_sha"))


def _verifier(current: dict, payload: dict) -> dict:
    return state.verifier_result(current, payload["outcome"], candidate_sha=payload.get("candidate_sha"))


def _publish(root: Path, current: dict, resolver: object | None) -> dict:
    active = current["active"]
    record = _validate_active_record(root, current, resolver)
    _branch_matches(root, active["subject_branch"])
    local_sha = gitfacts.full_sha(root, "HEAD")
    ref = f"refs/heads/{active['subject_branch']}"
    remote_sha = gitfacts.remote_ref_sha(root, "origin", ref)
    event = Event(
        source="git", kind="git_pre_push", worktree_root=str(root), branch=active["subject_branch"],
        paths=(), facts={
            "remote_name": "origin", "local_ref": ref, "local_sha": local_sha,
            "remote_ref": ref, "remote_sha": remote_sha or ZERO_SHA,
        },
    )
    decision = policy.evaluate(
        event, current, resolver=resolver, repository=getattr(record, "repository"), controller_root=root
    )
    if not decision.allowed:
        raise StopAndPreserve(f"publish denied: {decision.code}: {decision.reason}")
    if remote_sha != local_sha:
        subprocess.run(
            ["git", "-C", str(root), "push", "origin", f"HEAD:{ref}"],
            check=True, capture_output=True, text=True,
        )
    if gitfacts.remote_ref_sha(root, "origin", ref) != local_sha:
        raise StopAndPreserve("remote verification failed after publish")
    return state.publish_success(current)


def execute(root: Path, operation: str, payload: dict, *, resolver: object | None = None) -> dict | None:
    root = gitfacts.worktree_root(root)
    path = storage.state_path(root)
    current = storage.read_optional(path)
    if operation == "status":
        return current
    if operation == "open":
        next_state = _open(root, current, payload, resolver)
    else:
        if current is None:
            raise StopAndPreserve("NO_LOCAL_AUTHORITY")
        state.validate(current)
        _validate_active_record(root, current, resolver)
        if operation == "critic":
            next_state = _critic(root, current, payload)
        elif operation == "revise":
            next_state = _revise(root, current, payload)
        elif operation == "candidate":
            next_state = _candidate(root, current)
        elif operation == "reviewer":
            next_state = _reviewer(current, payload)
        elif operation == "verifier":
            next_state = _verifier(current, payload)
        elif operation == "publish":
            next_state = _publish(root, current, resolver)
        elif operation == "close":
            next_state = state.close(current, payload["outcome"])
        else:
            raise ValueError("unknown lifecycle operation")
    storage.write(path, next_state, expected=storage.MISSING if current is None else current)
    return next_state


def main(argv: list[str] | None = None, *, resolver: object | None = None) -> int:
    parser = argparse.ArgumentParser(description="Inert controller v1 schema-v2 lifecycle writer")
    parser.add_argument("--root", type=Path, required=True)
    parser.add_argument("--payload")
    parser.add_argument("operation", choices=[
        "status", "open", "critic", "revise", "candidate", "reviewer", "verifier", "publish", "close"
    ])
    args = parser.parse_args(argv)
    try:
        result = execute(args.root, args.operation, _payload(args.payload), resolver=resolver)
    except (ControllerError, ValueError, KeyError, OSError, subprocess.CalledProcessError) as exc:
        print(f"STOP: {exc}", file=sys.stderr)
        return 2
    if args.operation == "status":
        if result is None:
            print(json.dumps({"status": "NO_LOCAL_AUTHORITY"}, sort_keys=True))
        else:
            print(json.dumps(result, sort_keys=True))
    else:
        assert result is not None
        print(result["lifecycle_state"])
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
