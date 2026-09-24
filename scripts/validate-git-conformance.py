#!/usr/bin/env python3
"""Check a published subject candidate using committed Git objects only."""
from __future__ import annotations

import argparse
import json
from pathlib import Path
import re
import subprocess
import sys

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / ".agent/hooks"))
from hard_stop_policy import (  # noqa: E402
    TERMINAL_CLOSEOUT_PATHS, assured_candidate_evidence, candidate_tree_identity,
    canonical_terminal_inactive, critic_disposition_evidence,
    resolved_critic_for_publication, terminal_projection, valid_work_block_id,
)
from git_transition_policy import forbidden, matches  # noqa: E402

STATE = ".agent/active-work-block.json"
SHA = re.compile(r"[0-9a-f]{40,64}\Z")


class Denied(ValueError):
    pass


def git(*args: str, input_text: str | None = None) -> str:
    try:
        result = subprocess.run(
            ["git", *args], cwd=ROOT, input=input_text, text=True,
            capture_output=True, timeout=20,
        )
    except (OSError, subprocess.TimeoutExpired) as exc:
        raise Denied(f"Git inspection failed: {exc}") from exc
    if result.returncode:
        raise Denied(f"git {' '.join(args)}: {result.stderr.strip()}")
    return result.stdout.strip()


def state(revision: str) -> dict:
    try:
        value = json.loads(git("show", f"{revision}:{STATE}"))
    except (ValueError, UnicodeError) as exc:
        raise Denied(f"missing or malformed Work Block state at {revision}: {exc}") from exc
    if not isinstance(value, dict) or value.get("schema_version") != 3 or value.get("authority_mode") != "github_capability":
        raise Denied(f"unsupported Work Block state at {revision}")
    return value


def parents(revision: str) -> list[str]:
    fields = git("rev-list", "--parents", "-n", "1", revision).split()
    if not fields or fields[0] != revision:
        raise Denied("cannot inspect commit parents")
    return fields[1:]


def changed(parent: str, child: str) -> list[str]:
    result = subprocess.run(
        ["git", "diff", "--name-only", "--no-renames", "-z", parent, child],
        cwd=ROOT, capture_output=True, timeout=20,
    )
    if result.returncode:
        raise Denied("cannot inspect committed changed paths")
    return [path.decode("utf-8", errors="surrogateescape") for path in result.stdout.split(b"\0") if path]


def canonical_inactive(gate: dict, revision: str) -> bool:
    try:
        template = json.loads(git("show", f"{revision}:.agent/active-work-block.default.json"))
    except (ValueError, UnicodeError):
        return False
    return isinstance(template, dict) and gate == template


def trailer(revision: str, expected: str) -> None:
    parsed = git("interpret-trailers", "--parse", input_text=git("show", "-s", "--format=%B", revision))
    found = re.findall(r"(?m)^Work-Block:\s*(.*?)\s*$", parsed)
    if found != [expected]:
        raise Denied(f"{revision}: exactly one Work-Block: {expected} trailer required")


def scoped(paths: list[str], patterns: list[str]) -> None:
    if not paths or any(forbidden(path) for path in paths):
        raise Denied("empty or forbidden changed path set")
    if not isinstance(patterns, list) or any(not isinstance(item, str) for item in patterns):
        raise Denied("malformed approved write-set")
    if any(not matches(path, patterns) for path in paths):
        raise Denied("changed path outside committed write-set")


def active_shape(gate: dict, branch: str, base: str) -> None:
    work_block = gate.get("work_block_id")
    if not valid_work_block_id(work_block) or gate.get("subject_branch") != branch or gate.get("base_commit") != base:
        raise Denied("active Work Block, event branch, or trusted base mismatch")
    spec = gate.get("specification")
    if not isinstance(spec, dict) or spec.get("path") != f"docs/specs/{work_block}.md" or not spec.get("revision"):
        raise Denied("active specification binding malformed")
    if not isinstance(gate.get("write_set"), list) or not gate["write_set"]:
        raise Denied("active source write-set missing")
    if not isinstance(gate.get("coordination_write_set"), list):
        raise Denied("active coordination write-set missing")
    if gate.get("write_gate", {}).get("status") not in {"READY", "BLOCKED"}:
        raise Denied("active write gate unresolved")
    if not resolved_critic_for_publication(gate):
        raise Denied("Critic admission unresolved")


def assured_source(gate: dict, revision: str) -> None:
    if gate.get("write_gate", {}).get("status") != "BLOCKED":
        raise Denied("published source is not frozen")
    if not critic_disposition_evidence(gate, ROOT) or not assured_candidate_evidence(gate, ROOT):
        raise Denied("committed candidate-bound Critic/Reviewer/Verifier evidence missing")
    frozen = gate.get("frozen_revision")
    if not isinstance(frozen, str) or candidate_tree_identity(ROOT, revision, gate["write_set"]) != frozen:
        raise Denied("published source tree differs from frozen candidate")


def validate(branch: str, head: str, default: str) -> None:
    if not branch or branch.startswith("-") or branch == default or not SHA.fullmatch(head):
        raise Denied("invalid subject event branch or head SHA")
    if not default or default.startswith("-") or not re.fullmatch(r"[A-Za-z0-9._/-]+", default):
        raise Denied("default branch evidence unavailable or malformed")
    if git("rev-parse", "HEAD") != head:
        raise Denied("checkout is not the exact published event head")
    trusted = git("rev-parse", f"refs/remotes/origin/{default}")
    base = git("merge-base", head, trusted)
    commits = git("rev-list", "--reverse", f"{base}..{head}").splitlines()
    if not commits:
        raise Denied("subject has no commits beyond trusted default ancestor")
    tip = state(head)
    terminal = not tip.get("work_block_id") and tip.get("closeout_mode") == "success-closeout"
    coordination_only = not tip.get("work_block_id") and not terminal and canonical_inactive(tip, head)
    if terminal:
        if len(parents(head)) != 1:
            raise Denied("terminal commit requires one active parent")
        source_revision = parents(head)[0]
        source = state(source_revision)
        active_shape(source, branch, base)
        if not canonical_terminal_inactive(tip, ROOT):
            raise Denied("terminal child is not canonical inactive")
    elif tip.get("work_block_id"):
        source_revision = head
        source = tip
        active_shape(source, branch, base)
    elif coordination_only:
        source_revision = ""
        source = {}
    else:
        raise Denied("published tip lacks assured active or terminal Work Block")

    previous = base
    for commit in commits:
        if parents(commit) != [previous]:
            raise Denied("Work Block range must be linear and anchored to trusted base")
        gate = state(commit)
        paths = changed(previous, commit)
        if gate.get("work_block_id"):
            active_shape(gate, branch, base)
            if gate["work_block_id"] != source["work_block_id"]:
                raise Denied("Work Block identity changed inside publication range")
            trailer(commit, gate["work_block_id"])
            scoped(paths, gate["write_set"] + gate["coordination_write_set"])
        elif coordination_only and canonical_inactive(gate, commit):
            scoped(paths, gate.get("coordination_write_set"))
        elif commit == head and terminal:
            trailer(commit, source["work_block_id"])
            if not canonical_terminal_inactive(gate, ROOT):
                raise Denied("terminal child is not canonical inactive")
            bound = terminal_projection(ROOT, source_revision, source, child_revision=head)
            allowed = TERMINAL_CLOSEOUT_PATHS | set(bound or ())
            if bound is None or not set(bound).issubset(paths) or any(path not in allowed for path in paths):
                raise Denied("terminal projection or changed paths malformed")
            scoped(paths, source["coordination_write_set"])
        else:
            raise Denied("unexpected inactive commit inside Work Block range")
        previous = commit

    cumulative = changed(base, head)
    if coordination_only:
        scoped(cumulative, tip.get("coordination_write_set"))
        return
    scoped(cumulative, source["write_set"] + source["coordination_write_set"])
    if source.get("base_commit") != base or (terminal and len(commits) < 2) or source_revision != commits[-1 if not terminal else -2]:
        raise Denied("source commit/base binding mismatch")
    # Existing report predicates read committed HEAD objects. A terminal child
    # may change only bounded coordination paths, never candidate reports.
    assured_source(source, source_revision)


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--branch", required=True)
    parser.add_argument("--head", required=True)
    parser.add_argument("--default-branch", required=True)
    args = parser.parse_args()
    try:
        validate(args.branch, args.head, args.default_branch)
    except (Denied, ValueError, OSError, UnicodeError) as exc:
        print(f"git-conformance: BLOCKED: {exc}", file=sys.stderr)
        return 1
    print(f"git-conformance: READY: {args.head} on {args.branch}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
