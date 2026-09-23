"""Sole normal lifecycle writer. Invoke as python -m v1.cli from package parent."""

from __future__ import annotations

import argparse
import datetime as dt
import json
import subprocess
import sys
from pathlib import Path

from . import evidence, state, storage
from .errors import ControllerError, StopAndPreserve


def _git(root: Path, *args: str) -> str:
    result = subprocess.run(
        ["git", "-C", str(root), *args], check=True, capture_output=True, text=True,
    )
    return result.stdout.strip()


def _payload(path: str | None) -> dict:
    if path is None:
        return {}
    value = json.loads(Path(path).read_text(encoding="utf-8"))
    if not isinstance(value, dict):
        raise ValueError("payload must be an object")
    return value


def transition(current: dict, operation: str, payload: dict, *, candidate_tree: str | None = None,
               controller_tree: str | None = None, now: str | None = None) -> dict:
    """Dispatch CLI verbs to shared state and evidence functions only."""
    if operation == "open":
        return state.open_work_block(current, work_block_id=payload["work_block_id"],
                                     subject_branch=payload["subject_branch"],
                                     subject_revision=payload["subject_revision"],
                                     write_set=payload["write_set"],
                                     controller_tree=controller_tree or payload["controller_tree"])
    if operation == "approve-define":
        return state.approve_define(current)
    if operation == "freeze":
        return state.freeze_candidate(current, candidate_tree or payload["candidate_id"])
    if operation == "capability":
        return evidence.refresh_capability(current, payload)
    if operation == "dispatch":
        return evidence.dispatch(current, payload)
    if operation == "result":
        return evidence.record_result(current, payload)
    if operation == "revise-define":
        return state.revise_define(current, payload["subject_revision"])
    if operation == "retry-assurance":
        return state.retry_assurance(current)
    if operation in {"success", "reporting-only", "cancelled"}:
        outcome = operation.replace("-", "_")
        return state.closeout(current, outcome=outcome,
                              reason=payload["reason"],
                              closed_at=now or dt.datetime.now(dt.timezone.utc).isoformat())
    raise ValueError("unknown lifecycle operation")


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Inert controller v1 lifecycle writer")
    parser.add_argument("--root", type=Path, required=True)
    parser.add_argument("--state", type=Path, required=True)
    parser.add_argument("--payload")
    parser.add_argument("operation", choices=[
        "open", "approve-define", "freeze", "capability", "dispatch", "result",
        "revise-define", "retry-assurance", "success", "reporting-only", "cancelled",
    ])
    args = parser.parse_args(argv)
    try:
        root = args.root.resolve(strict=True)
        if args.state.resolve() != root / ".agent/active-work-block.json":
            raise StopAndPreserve("state path must be the v1 authority path under root")
        if _git(root, "rev-parse", "--show-toplevel") != str(root):
            raise StopAndPreserve("root is not the bound repository")
        current = storage.read(args.state)
        payload = _payload(args.payload)
        if current["active"] is not None and _git(root, "branch", "--show-current") != current["active"]["subject_branch"]:
            raise StopAndPreserve("current branch differs from subject branch")
        if args.operation == "open" and _git(root, "branch", "--show-current") != payload.get("subject_branch"):
            raise StopAndPreserve("open branch differs from subject branch")
        controller_tree = _git(root, "rev-parse", "HEAD:.agent/controllers/v1") if args.operation == "open" else None
        if current["active"] is not None and _git(root, "rev-parse", "HEAD:.agent/controllers/v1") != current["active"]["controller_tree"]:
            raise StopAndPreserve("controller generation tree changed while active")
        candidate_tree = None
        if args.operation == "freeze":
            if _git(root, "status", "--porcelain"):
                raise StopAndPreserve("freeze requires a committed clean candidate")
            candidate_tree = _git(root, "rev-parse", "HEAD^{tree}")
        next_state = transition(current, args.operation, payload, candidate_tree=candidate_tree,
                                controller_tree=controller_tree)
        storage.write(args.state, next_state, expected=current)
    except (ControllerError, ValueError, KeyError, OSError, subprocess.CalledProcessError) as exc:
        print(f"STOP: {exc}", file=sys.stderr)
        return 2
    print(next_state["lifecycle_state"])
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
