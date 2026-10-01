"""Inert runtime/Git adapter entry points over the shared controller core.

Nothing in this module is wired into live Claude, Codex, or Git hook configs in
WB-002. Callers must supply native events and trusted external facts explicitly.
"""

from __future__ import annotations

import json
import sys
from collections.abc import Mapping
from pathlib import Path

from . import adapters, git_adapter, gitfacts, policy, storage
from .errors import ControllerError, StopAndPreserve, ValidationError
from .events import Decision, decision


def controller_repository_root() -> Path:
    return gitfacts.worktree_root(Path(__file__).resolve())


def resolve_bound_worktree(cwd: Path, *, installation_root: Path | None = None) -> Path:
    target = gitfacts.worktree_root(cwd)
    installed = gitfacts.worktree_root(installation_root or controller_repository_root())
    if gitfacts.common_git_dir(target) != gitfacts.common_git_dir(installed):
        raise StopAndPreserve("target worktree is outside controller common Git repository")
    return target


def load_state(root: Path) -> dict | None:
    _, current = storage.load_for_worktree(root)
    return current


def evaluate_runtime(
    runtime: str,
    raw: Mapping[str, object],
    *,
    installation_root: Path | None = None,
    admission=None,
    repository_id: str | None = None,
) -> Decision:
    cwd = raw.get("cwd") if isinstance(raw, Mapping) else None
    if not isinstance(cwd, str) or not cwd:
        return decision("DENY", "STATE_INVALID", "runtime event is missing cwd")
    try:
        root = resolve_bound_worktree(Path(cwd), installation_root=installation_root)
        event = adapters.normalize_structured_write(runtime, raw)
        if Path(event.worktree_root) != root:
            raise StopAndPreserve("runtime adapter resolved inconsistent worktree")
        return policy.evaluate(
            event,
            load_state(root),
            admission=admission,
            repository_id=repository_id,
        )
    except (ControllerError, OSError, ValueError, TypeError) as exc:
        return decision("DENY", "STATE_INVALID", str(exc))


def runtime_hook_response(
    runtime: str,
    raw: Mapping[str, object],
    *,
    installation_root: Path | None = None,
    admission=None,
    repository_id: str | None = None,
) -> dict:
    return adapters.runtime_response(
        runtime,
        evaluate_runtime(
            runtime,
            raw,
            installation_root=installation_root,
            admission=admission,
            repository_id=repository_id,
        ),
    )


def subagent_context(
    runtime: str,
    raw: Mapping[str, object],
    *,
    installation_root: Path | None = None,
) -> dict:
    cwd = raw.get("cwd") if isinstance(raw, Mapping) else None
    if not isinstance(cwd, str) or not cwd:
        return adapters.context_response(runtime, "No valid Work Block context: runtime event is missing cwd.")
    try:
        root = resolve_bound_worktree(Path(cwd), installation_root=installation_root)
        event = adapters.normalize_subagent_context(runtime, raw)
        if Path(event.worktree_root) != root:
            raise StopAndPreserve("runtime adapter resolved inconsistent worktree")
        current = load_state(root)
        verdict = policy.evaluate(event, current)
        if current is None or current["lifecycle_state"] == "INACTIVE":
            context = f"{verdict.code}: no active Work Block authority in {root}."
        else:
            active = current["active"]
            context = (
                f"Work Block {active['work_block_id']}; lifecycle={current['lifecycle_state']}; "
                f"initiative={active['initiative_ref']}; branch={active['subject_branch']}; "
                f"implementation_scope={', '.join(active['implementation_write_set'])}; "
                f"coordination_scope={', '.join(active['coordination_scope'])}."
            )
        return adapters.context_response(runtime, context)
    except (ControllerError, OSError, ValueError, TypeError) as exc:
        return adapters.context_response(runtime, f"No valid Work Block context: {exc}")


def evaluate_git_pre_commit(
    root: Path,
    *,
    installation_root: Path | None = None,
    default_branch: str | None,
    admission=None,
    repository_id: str | None = None,
) -> Decision:
    try:
        bound = resolve_bound_worktree(root, installation_root=installation_root)
        return git_adapter.evaluate_pre_commit(
            bound,
            load_state(bound),
            default_branch=default_branch,
            admission=admission,
            repository_id=repository_id,
        )
    except (ControllerError, OSError, ValueError, TypeError) as exc:
        return decision("DENY", "STATE_INVALID", str(exc))


def evaluate_git_commit_message(
    root: Path,
    message_file: Path,
    *,
    installation_root: Path | None = None,
) -> Decision:
    try:
        bound = resolve_bound_worktree(root, installation_root=installation_root)
        return git_adapter.evaluate_commit_message(bound, load_state(bound), message_file)
    except (ControllerError, OSError, ValueError, TypeError) as exc:
        return decision("DENY", "STATE_INVALID", str(exc))


def evaluate_git_pre_push(
    root: Path,
    *,
    installation_root: Path | None = None,
    remote_name: str,
    stdin_text: str,
    default_branch: str | None,
    branch_protection_resolver=None,
) -> Decision:
    try:
        bound = resolve_bound_worktree(root, installation_root=installation_root)
        return git_adapter.evaluate_pre_push(
            bound,
            load_state(bound),
            remote_name=remote_name,
            stdin_text=stdin_text,
            default_branch=default_branch,
            branch_protection_resolver=branch_protection_resolver,
        )
    except (ControllerError, OSError, ValueError, TypeError) as exc:
        return decision("DENY", "STATE_INVALID", str(exc))


def main(runtime: str) -> int:
    """Diagnostic inert runtime entry point; live configs are not wired in WB-002."""

    try:
        raw = json.load(sys.stdin)
        if not isinstance(raw, dict):
            raise ValidationError("runtime event must be an object")
        result = runtime_hook_response(runtime, raw)
    except (ControllerError, OSError, ValueError, TypeError) as exc:
        result = adapters.runtime_response(
            runtime if runtime in {"claude", "codex"} else "codex",
            decision("DENY", "STATE_INVALID", str(exc)),
        )
    print(json.dumps(result, sort_keys=True))
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1] if len(sys.argv) == 2 else ""))
