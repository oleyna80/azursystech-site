"""Inert lifecycle controller API and CLI.

`open` deliberately requires an injected trusted AdmissionResolver. The standalone
CLI cannot manufacture or select admission/profile policy; WB-4 will supply the
production trusted backend.
"""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

from . import gitfacts, policy, state, storage
from .errors import ControllerError, StopAndPreserve, TransitionDenied, ValidationError


def _payload(path: str | None) -> dict:
    if path is None:
        return {}
    value = json.loads(Path(path).read_text(encoding="utf-8"))
    if not isinstance(value, dict):
        raise ValidationError("payload must be an object")
    return value


def _active_branch(root: Path, current: dict) -> None:
    if current["lifecycle_state"] == "INACTIVE":
        return
    if gitfacts.branch(root) != current["active"]["subject_branch"]:
        raise StopAndPreserve("current branch differs from active subject branch")


def _verify_planning_paths(root: Path, revision: str, paths: list[str]) -> None:
    revision_sha = gitfacts.resolve_commit(root, revision)
    for path in paths:
        gitfacts.path_object(root, revision_sha, path)


def open_with_resolver(
    root: Path,
    resolver,
    *,
    repository_id: str,
    admission_id: str,
    work_block_id: str,
    initiative_ref: str,
    planning_paths: list[str],
    implementation_write_set: list[str],
    coordination_scope: list[str],
    default_branch: str,
) -> dict:
    """Open from missing/INACTIVE using only facts from the trusted admission record."""

    root = gitfacts.worktree_root(root)
    path, current = storage.load_for_worktree(root)
    if current is not None and current["lifecycle_state"] != "INACTIVE":
        raise TransitionDenied("another Work Block is active")

    record = resolver.resolve(admission_id)
    branch = gitfacts.branch(root)
    if record.repository != repository_id:
        raise StopAndPreserve("admission repository identity mismatch")
    if branch != record.subject_branch or branch == default_branch:
        raise StopAndPreserve("current branch does not match admitted non-default subject branch")
    head = gitfacts.head_sha(root)
    if not gitfacts.is_ancestor(root, record.base_commit, head):
        raise StopAndPreserve("admitted base_commit is not ancestor of subject history")

    # Planning is already committed before open; bind the exact current HEAD.
    planning_revision = head
    _verify_planning_paths(root, planning_revision, planning_paths)

    proposed = state.open_work_block(
        current,
        work_block_id=work_block_id,
        initiative_ref=initiative_ref,
        admission_id=record.admission_id,
        subject_branch=record.subject_branch,
        base_commit=record.base_commit,
        authority_profile_id=record.authority_profile_id,
        authority_profile_revision=record.authority_profile_revision,
        planning_revision=planning_revision,
        planning_paths=planning_paths,
        implementation_write_set=implementation_write_set,
        coordination_scope=coordination_scope,
    )
    storage.write(path, proposed, expected=storage.MISSING if current is None else current)
    return proposed


def critic(root: Path, outcome: str) -> dict:
    root = gitfacts.worktree_root(root)
    path, current = storage.load_for_worktree(root)
    if current is None:
        raise TransitionDenied("Critic result requires active Work Block")
    _active_branch(root, current)
    verified = True
    if outcome == "ready":
        active = current["active"]
        planning_revision = active["planning_subject"]["revision"]
        head = gitfacts.head_sha(root)
        if not gitfacts.is_ancestor(root, planning_revision, head):
            verified = False
        # A later unbound commit to the derived planning surface invalidates READY.
        for commit in gitfacts.commits_between(root, planning_revision, head):
            if any(
                state.derived_planning_path(active["initiative_ref"], changed)
                for changed in gitfacts.commit_paths(root, commit)
            ):
                verified = False
                break
        _verify_planning_paths(root, planning_revision, active["planning_subject"]["paths"])
    proposed = state.critic_result(current, outcome, planning_verified=verified)
    storage.write(path, proposed, expected=current)
    return proposed


def revise_begin(root: Path) -> dict:
    root = gitfacts.worktree_root(root)
    path, current = storage.load_for_worktree(root)
    if current is None:
        raise TransitionDenied("revise begin requires active Work Block")
    _active_branch(root, current)
    proposed = state.revise_begin(current)
    storage.write(path, proposed, expected=current)
    return proposed


def revise_bind(
    root: Path,
    *,
    planning_paths: list[str],
    implementation_write_set: list[str],
    coordination_scope: list[str],
) -> dict:
    root = gitfacts.worktree_root(root)
    path, current = storage.load_for_worktree(root)
    if current is None:
        raise TransitionDenied("revise bind requires active Work Block")
    _active_branch(root, current)
    if current["lifecycle_state"] != "DEFINE":
        raise TransitionDenied("revise bind requires DEFINE")
    gitfacts.require_clean(root)
    revision = gitfacts.head_sha(root)
    if not gitfacts.is_ancestor(root, current["active"]["base_commit"], revision):
        raise StopAndPreserve("planning revision does not descend from admitted base")
    _verify_planning_paths(root, revision, planning_paths)
    proposed = state.revise_bind(
        current,
        planning_revision=revision,
        planning_paths=planning_paths,
        implementation_write_set=implementation_write_set,
        coordination_scope=coordination_scope,
    )
    storage.write(path, proposed, expected=current)
    return proposed


def _candidate_git_verified(root: Path, current: dict, candidate: str) -> None:
    active = current["active"]
    gitfacts.require_clean(root)
    if not gitfacts.is_ancestor(root, active["base_commit"], candidate):
        raise StopAndPreserve("candidate does not descend from admitted base")
    if not gitfacts.planning_subject_unchanged(
        root,
        active["planning_subject"]["revision"],
        candidate,
        active["planning_subject"]["paths"],
    ):
        raise StopAndPreserve("planning subject changed after Critic binding")
    for path in gitfacts.changed_paths(root, active["base_commit"], candidate):
        planning = path in set(active["planning_subject"]["paths"])
        implementation = state.scope_matches(path, active["implementation_write_set"])
        coordination = state.scope_matches(path, active["coordination_scope"])
        if implementation and coordination:
            raise StopAndPreserve("candidate path has ambiguous scope")
        if planning:
            if not coordination:
                raise StopAndPreserve("planning path is not admitted coordination")
            continue
        if not (implementation or coordination):
            raise StopAndPreserve(f"candidate path outside admitted scopes: {path}")


def candidate(root: Path) -> dict:
    root = gitfacts.worktree_root(root)
    path, current = storage.load_for_worktree(root)
    if current is None:
        raise TransitionDenied("candidate requires active Work Block")
    _active_branch(root, current)
    if current["lifecycle_state"] != "EXECUTE":
        raise TransitionDenied("candidate requires EXECUTE")
    candidate_sha = gitfacts.head_sha(root)
    _candidate_git_verified(root, current, candidate_sha)
    proposed = state.create_candidate(current, candidate_sha, git_verified=True)
    storage.write(path, proposed, expected=current)
    return proposed


def reviewer(root: Path, outcome: str) -> dict:
    root = gitfacts.worktree_root(root)
    path, current = storage.load_for_worktree(root)
    if current is None:
        raise TransitionDenied("Reviewer result requires active Work Block")
    _active_branch(root, current)
    proposed = state.reviewer_result(current, outcome)
    storage.write(path, proposed, expected=current)
    return proposed


def verifier(root: Path, outcome: str) -> dict:
    root = gitfacts.worktree_root(root)
    path, current = storage.load_for_worktree(root)
    if current is None:
        raise TransitionDenied("Verifier result requires active Work Block")
    _active_branch(root, current)
    proposed = state.verifier_result(current, outcome)
    storage.write(path, proposed, expected=current)
    return proposed


def close(root: Path, outcome: str) -> dict:
    root = gitfacts.worktree_root(root)
    path, current = storage.load_for_worktree(root)
    if current is None:
        raise TransitionDenied("close requires active Work Block")
    _active_branch(root, current)
    proposed = state.close(current, outcome)
    storage.write(path, proposed, expected=current)
    return proposed


def _prepush_event(root: Path, current: dict, remote: str, remote_sha: str | None):
    active = current["active"]
    local_sha = gitfacts.head_sha(root)
    ref = f"refs/heads/{active['subject_branch']}"
    from .events import Event
    return Event(
        1,
        "git",
        "git_pre_push",
        str(root),
        active["subject_branch"],
        (),
        {
            "remote_name": remote,
            "local_ref": ref,
            "local_sha": local_sha,
            "remote_ref": ref,
            "remote_sha": remote_sha or gitfacts.ZERO_SHA,
        },
    )


def publish(root: Path, *, branch_protection_resolver=None) -> dict:
    """Publish only with trusted remote/default/protection facts."""

    root = gitfacts.worktree_root(root)
    remote = policy.PUBLISH_REMOTE
    default_branch = gitfacts.remote_default_branch(root, remote)
    if branch_protection_resolver is None:
        raise StopAndPreserve("publish requires trusted branch-protection resolver")
    path, current = storage.load_for_worktree(root)
    if current is None:
        raise TransitionDenied("publish requires active Work Block")
    _active_branch(root, current)
    if current["lifecycle_state"] != "ASSURE":
        raise TransitionDenied("publish requires ASSURE")
    active = current["active"]
    remote_ref = f"refs/heads/{active['subject_branch']}"
    before = gitfacts.remote_ref_sha(root, remote, remote_ref)
    event = _prepush_event(root, current, remote, before)
    protected = branch_protection_resolver(remote, active["subject_branch"])
    if not isinstance(protected, bool):
        raise StopAndPreserve("branch-protection resolver returned unknown status")
    verdict = policy.evaluate(
        event,
        current,
        default_branch=default_branch,
        subject_branch_is_protected=protected,
    )
    if not verdict.allowed:
        raise TransitionDenied(f"{verdict.code}: {verdict.reason}")

    local_sha = event.facts["local_sha"]
    if before != local_sha:
        gitfacts.push_subject(root, remote, active["subject_branch"])
    after = gitfacts.remote_ref_sha(root, remote, remote_ref)
    if after != local_sha:
        raise StopAndPreserve("remote verification failed; ASSURE state preserved")
    proposed = state.publish_success(current)
    storage.write(path, proposed, expected=current)
    return proposed


def status(root: Path) -> dict | None:
    _, current = storage.load_for_worktree(gitfacts.worktree_root(root))
    return current


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Inert SDLC controller lifecycle CLI")
    parser.add_argument("--root", type=Path, required=True)
    parser.add_argument("--payload")
    parser.add_argument(
        "operation",
        choices=["status", "open", "critic", "revise-begin", "revise-bind", "candidate",
                 "reviewer", "verifier", "publish", "close"],
    )
    args = parser.parse_args(argv)
    try:
        root = gitfacts.worktree_root(args.root)
        payload = _payload(args.payload)
        if args.operation == "status":
            result = status(root)
            print(json.dumps(result, sort_keys=True))
            return 0
        if args.operation == "open":
            raise StopAndPreserve(
                "standalone open has no trusted AdmissionResolver; use open_with_resolver from trusted admission/orchestration layer"
            )
        if args.operation == "critic":
            result = critic(root, payload["outcome"])
        elif args.operation == "revise-begin":
            result = revise_begin(root)
        elif args.operation == "revise-bind":
            result = revise_bind(
                root,
                planning_paths=payload["planning_paths"],
                implementation_write_set=payload["implementation_write_set"],
                coordination_scope=payload["coordination_scope"],
            )
        elif args.operation == "candidate":
            result = candidate(root)
        elif args.operation == "reviewer":
            result = reviewer(root, payload["outcome"])
        elif args.operation == "verifier":
            result = verifier(root, payload["outcome"])
        elif args.operation == "publish":
            raise StopAndPreserve(
                "standalone publish has no trusted branch-protection provider; use trusted integration layer"
            )
        elif args.operation == "close":
            result = close(root, payload["outcome"])
        else:
            raise ValidationError("unknown lifecycle operation")
        print(result["lifecycle_state"])
        return 0
    except (ControllerError, KeyError, OSError, ValueError) as exc:
        print(f"STOP: {exc}", file=sys.stderr)
        return 2


if __name__ == "__main__":
    raise SystemExit(main())
