#!/usr/bin/env python3
"""Inert production invocation bridge for SDLC controller v1.

WB-005 delivers this executable surface but does not wire it into live runtime
configuration. WB-006 may activate only the exact assured cutover payload.
"""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / ".agent"))

from controllers.v1 import cli, gitfacts, hook
from controllers.v1.consequential import evaluate_command
from controllers.v1.errors import ControllerError, StopAndPreserve, ValidationError
from controllers.v1.installation import load as load_installation
from controllers.v1.providers import GitHubCliBranchProtectionResolver
from orchestration.admission import AdmissionNotFound
from orchestration.registry import SQLiteAdmissionRegistry


def _registry(root: Path):
    config = load_installation(root)
    registry = SQLiteAdmissionRegistry(config.registry_path)
    registry.assert_external_to(root)
    return config, registry


def _active_or_none(registry, repository: str, branch: str):
    try:
        return registry.resolve_active(repository, branch)
    except AdmissionNotFound:
        return None


def _runtime(runtime: str) -> int:
    raw = json.load(sys.stdin)
    if not isinstance(raw, dict):
        raise ValidationError("runtime bridge input must be an object")
    cwd = raw.get("cwd")
    if not isinstance(cwd, str) or not cwd:
        raise ValidationError("runtime bridge input is missing cwd")
    root = gitfacts.worktree_root(Path(cwd))
    config, registry = _registry(root)
    branch = gitfacts.branch(root)
    admission = _active_or_none(registry, config.repository, branch)
    if admission is None:
        response = {
            "hookSpecificOutput": {
                "hookEventName": "PreToolUse",
                "permissionDecision": "deny",
                "permissionDecisionReason": (
                    "no active trusted admission for repository/subject branch"
                ),
            }
        }
        print(json.dumps(response, sort_keys=True))
        return 0
    response = hook.runtime_hook_response(
        runtime,
        raw,
        installation_root=root,
        admission=admission,
        repository_id=config.repository,
    )
    print(json.dumps(response, sort_keys=True))
    return 0


def _subagent_context(runtime: str) -> int:
    raw = json.load(sys.stdin)
    if not isinstance(raw, dict):
        raise ValidationError("subagent context input must be an object")
    cwd = raw.get("cwd")
    if not isinstance(cwd, str) or not cwd:
        raise ValidationError("subagent context input is missing cwd")
    root = gitfacts.worktree_root(Path(cwd))
    config, registry = _registry(root)
    branch = gitfacts.branch(root)
    admission = _active_or_none(registry, config.repository, branch)
    if admission is None:
        response = {
            "hookSpecificOutput": {
                "hookEventName": "SubagentStart",
                "additionalContext": (
                    "No active trusted admission for repository/subject branch; "
                    "this context grants no mutation authority."
                ),
            }
        }
        print(json.dumps(response, sort_keys=True))
        return 0
    print(json.dumps(hook.subagent_context(
        runtime,
        raw,
        installation_root=root,
    ), sort_keys=True))
    return 0


def _consequential() -> int:
    raw = json.load(sys.stdin)
    command = None
    if isinstance(raw, dict) and str(raw.get("tool_name") or "") == "Bash":
        payload = raw.get("tool_input")
        if isinstance(payload, dict):
            command = payload.get("command")
    verdict = evaluate_command(command)
    response = {
        "hookSpecificOutput": {
            "hookEventName": "PreToolUse",
            "permissionDecision": "allow" if verdict.allowed else "deny",
            "permissionDecisionReason": verdict.reason,
        }
    }
    print(json.dumps(response, sort_keys=True))
    return 0


def _git_pre_commit(root: Path) -> int:
    config, registry = _registry(root)
    branch = gitfacts.branch(root)
    admission = _active_or_none(registry, config.repository, branch)
    if admission is None:
        raise StopAndPreserve(
            "pre-commit requires active trusted admission for repository/subject branch"
        )
    result = hook.evaluate_git_pre_commit(
        root,
        installation_root=root,
        default_branch=gitfacts.remote_default_branch(root, config.remote),
        admission=admission,
        repository_id=config.repository,
    )
    code, message = __import__(
        "controllers.v1.git_adapter", fromlist=["exit_status"]
    ).exit_status(result)
    if message:
        print(message, file=sys.stderr)
    return code


def _git_commit_msg(root: Path, message_file: Path) -> int:
    result = hook.evaluate_git_commit_message(
        root,
        message_file,
        installation_root=root,
    )
    code, message = __import__(
        "controllers.v1.git_adapter", fromlist=["exit_status"]
    ).exit_status(result)
    if message:
        print(message, file=sys.stderr)
    return code


def _git_pre_push(root: Path, remote: str) -> int:
    config, registry = _registry(root)
    current = cli.status(root)
    if current is None or current["lifecycle_state"] != "ASSURE":
        raise StopAndPreserve("pre-push requires active ASSURE state")
    admission_id = current["active"]["admission_id"]
    registry.assert_active(admission_id)
    active = registry.resolve_active(config.repository, gitfacts.branch(root))
    if active.admission_id != admission_id:
        raise StopAndPreserve("active admission differs from controller binding")
    stdin_text = sys.stdin.read()
    provider = GitHubCliBranchProtectionResolver(config)
    result = hook.evaluate_git_pre_push(
        root,
        installation_root=root,
        remote_name=remote,
        stdin_text=stdin_text,
        default_branch=gitfacts.remote_default_branch(root, config.remote),
        branch_protection_resolver=provider,
    )
    code, message = __import__(
        "controllers.v1.git_adapter", fromlist=["exit_status"]
    ).exit_status(result)
    if message:
        print(message, file=sys.stderr)
    return code


def _trusted_open(root: Path, payload: dict) -> int:
    config, registry = _registry(root)
    admission_id = payload["admission_id"]
    registry.assert_active(admission_id)
    record = registry.resolve(admission_id)
    if record.repository != config.repository:
        raise StopAndPreserve("admission repository differs from installation identity")
    result = cli.open_with_resolver(
        root,
        registry,
        repository_id=config.repository,
        admission_id=admission_id,
        work_block_id=payload["work_block_id"],
        initiative_ref=payload["initiative_ref"],
        planning_paths=payload["planning_paths"],
        implementation_write_set=payload["implementation_write_set"],
        coordination_scope=payload["coordination_scope"],
        default_branch=gitfacts.remote_default_branch(root, config.remote),
    )
    print(json.dumps(result, sort_keys=True))
    return 0


def _trusted_publish(root: Path) -> int:
    config, registry = _registry(root)
    current = cli.status(root)
    if current is None or current["lifecycle_state"] != "ASSURE":
        raise StopAndPreserve("trusted publish requires active ASSURE state")
    admission_id = current["active"]["admission_id"]
    registry.assert_active(admission_id)
    record = registry.resolve_active(config.repository, gitfacts.branch(root))
    if record.admission_id != admission_id:
        raise StopAndPreserve("active admission differs from controller binding")
    result = cli.publish(
        root,
        branch_protection_resolver=GitHubCliBranchProtectionResolver(config),
    )
    print(json.dumps(result, sort_keys=True))
    return 0


def main(argv=None) -> int:
    parser = argparse.ArgumentParser()
    sub = parser.add_subparsers(dest="operation", required=True)

    runtime = sub.add_parser("runtime")
    runtime.add_argument("--runtime", choices=["claude", "codex"], required=True)

    context = sub.add_parser("subagent-context")
    context.add_argument("--runtime", choices=["claude", "codex"], required=True)

    sub.add_parser("consequential")

    for name in ("git-pre-commit", "trusted-publish"):
        item = sub.add_parser(name)
        item.add_argument("--root", type=Path, default=Path.cwd())

    commit = sub.add_parser("git-commit-msg")
    commit.add_argument("message_file", type=Path)
    commit.add_argument("--root", type=Path, default=Path.cwd())

    push = sub.add_parser("git-pre-push")
    push.add_argument("remote")
    push.add_argument("--root", type=Path, default=Path.cwd())

    opened = sub.add_parser("trusted-open")
    opened.add_argument("--root", type=Path, default=Path.cwd())
    opened.add_argument("--payload", required=True)

    args = parser.parse_args(argv)
    try:
        if args.operation == "runtime":
            return _runtime(args.runtime)
        if args.operation == "subagent-context":
            return _subagent_context(args.runtime)
        if args.operation == "consequential":
            return _consequential()
        if args.operation == "git-pre-commit":
            return _git_pre_commit(args.root)
        if args.operation == "git-commit-msg":
            return _git_commit_msg(args.root, args.message_file)
        if args.operation == "git-pre-push":
            return _git_pre_push(args.root, args.remote)
        if args.operation == "trusted-open":
            payload = json.loads(args.payload)
            if not isinstance(payload, dict):
                raise ValidationError("trusted-open payload must be an object")
            return _trusted_open(args.root, payload)
        if args.operation == "trusted-publish":
            return _trusted_publish(args.root)
        raise ValidationError("unknown bridge operation")
    except (ControllerError, KeyError, OSError, ValueError, TypeError) as exc:
        if getattr(args, "operation", None) == "runtime":
            response = {
                "hookSpecificOutput": {
                    "hookEventName": "PreToolUse",
                    "permissionDecision": "deny",
                    "permissionDecisionReason": f"replacement bridge fail-closed: {exc}",
                }
            }
            print(json.dumps(response, sort_keys=True))
            return 0
        print(f"STOP: {exc}", file=sys.stderr)
        return 2


if __name__ == "__main__":
    raise SystemExit(main())
