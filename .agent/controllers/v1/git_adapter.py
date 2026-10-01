"""Thin Git-native normalization for pre-commit, commit-msg, and pre-push."""

from __future__ import annotations

import subprocess
from collections.abc import Callable
from pathlib import Path

from . import gitfacts, policy
from .errors import StopAndPreserve, ValidationError
from .events import Decision, Event, decision, validate as validate_event


def _root(root: Path) -> Path:
    return gitfacts.worktree_root(root)


def _event(
    root: Path,
    *,
    kind: str,
    branch: str,
    paths: tuple[str, ...] = (),
    facts: dict[str, object],
) -> Event:
    return validate_event(
        {
            "event_version": 1,
            "source": "git",
            "kind": kind,
            "worktree_root": str(root),
            "branch": branch,
            "paths": list(paths),
            "facts": facts,
        }
    )


def pre_commit_event(root: Path) -> Event:
    root = _root(root)
    return _event(
        root,
        kind="git_pre_commit",
        branch=gitfacts.branch(root),
        paths=gitfacts.staged_paths(root),
        facts={"head_sha": gitfacts.head_sha(root)},
    )


def _work_block_trailers(root: Path, message_file: Path) -> list[str]:
    root = _root(root)
    if not message_file.is_absolute():
        message_file = (root / message_file).resolve(strict=True)
    else:
        message_file = message_file.resolve(strict=True)
    try:
        result = subprocess.run(
            ["git", "-C", str(root), "interpret-trailers", "--parse", str(message_file)],
            check=True,
            capture_output=True,
            text=True,
        )
    except (OSError, subprocess.CalledProcessError) as exc:
        raise StopAndPreserve("cannot parse commit trailers with Git") from exc

    trailers: list[str] = []
    for line in result.stdout.splitlines():
        if ":" not in line:
            continue
        token, value = line.split(":", 1)
        if token.strip().lower() == "work-block":
            trailers.append(value.strip())
    return trailers


def commit_message_event(root: Path, message_file: Path) -> Event:
    root = _root(root)
    return _event(
        root,
        kind="git_commit_message",
        branch=gitfacts.branch(root),
        facts={"work_block_trailers": _work_block_trailers(root, message_file)},
    )


def pre_push_events(root: Path, remote_name: str, stdin_text: str) -> tuple[Event, ...]:
    root = _root(root)
    if not isinstance(remote_name, str) or not remote_name:
        raise ValidationError("pre-push remote name is missing")
    branch = gitfacts.branch(root)

    events: list[Event] = []
    for raw_line in stdin_text.splitlines():
        line = raw_line.strip()
        if not line:
            continue
        parts = line.split()
        if len(parts) != 4:
            raise ValidationError("pre-push ref update must contain four Git-native fields")
        local_ref, local_sha, remote_ref, remote_sha = parts
        events.append(
            _event(
                root,
                kind="git_pre_push",
                branch=branch,
                facts={
                    "remote_name": remote_name,
                    "local_ref": local_ref,
                    "local_sha": local_sha,
                    "remote_ref": remote_ref,
                    "remote_sha": remote_sha,
                },
            )
        )
    if not events:
        raise ValidationError("pre-push contains no ref updates")
    return tuple(events)


def evaluate_pre_commit(
    root: Path,
    state: dict | None,
    *,
    default_branch: str | None,
    admission=None,
    repository_id: str | None = None,
) -> Decision:
    return policy.evaluate(
        pre_commit_event(root),
        state,
        admission=admission,
        repository_id=repository_id,
        default_branch=default_branch,
    )


def evaluate_commit_message(root: Path, state: dict | None, message_file: Path) -> Decision:
    return policy.evaluate(commit_message_event(root, message_file), state)


def evaluate_pre_push(
    root: Path,
    state: dict | None,
    *,
    remote_name: str,
    stdin_text: str,
    default_branch: str | None,
    branch_protection_resolver: Callable[[str, str], bool | None] | None,
) -> Decision:
    normalized = pre_push_events(root, remote_name, stdin_text)
    subject_branch = None
    if isinstance(state, dict):
        active = state.get("active")
        if isinstance(active, dict):
            value = active.get("subject_branch")
            if isinstance(value, str):
                subject_branch = value

    for event in normalized:
        protected = None
        if branch_protection_resolver is not None and subject_branch is not None:
            protected = branch_protection_resolver(remote_name, subject_branch)
        result = policy.evaluate(
            event,
            state,
            default_branch=default_branch,
            subject_branch_is_protected=protected,
        )
        if not result.allowed:
            return result
    return decision("ALLOW", "PUSH_ALLOWED", "all pre-push ref updates satisfy shared policy")


def exit_status(result: Decision) -> tuple[int, str]:
    if result.allowed or result.decision == "ADVISORY":
        return 0, ""
    return 1, f"{result.code}: {result.reason}"
