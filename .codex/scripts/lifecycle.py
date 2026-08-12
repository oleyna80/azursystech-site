#!/usr/bin/env python3
"""Schema v3 local Work Block lifecycle helper.

This helper manages cooperative project-local coordination state. It does not
create security authority. Consequential authority belongs to external GitHub,
OS, workflow, and credential boundaries.
"""
from __future__ import annotations

import argparse
import copy
import datetime as dt
import json
import subprocess
import tempfile
from pathlib import Path

SCHEMA_VERSION = 3
AUTHORITY_MODE = "github_capability"
DEFAULT_COORDINATION = [
    ".agent/active-work-block.json",
    ".agent/critic-gate.md",
    ".agent/verification-gate.md",
    ".codex/write-gate.md",
    "docs/plans/**",
    "docs/specs/**",
    "docs/tasklist/**",
    "docs/reports/**",
    "docs/architecture/drafts/**",
    "memory_bank/**",
]
EXTERNAL_HARD_STOPS = [
    "protected_default_branch_mutation",
    "destructive",
    "live_infra",
    "live_data",
    "credentials",
    "client_communications",
    "irreversible_publish",
]
ASSURANCE_STATUSES = {"PENDING", "READY", "SKIPPED", "DEGRADED", "BLOCKED"}
ASSURANCE_VERDICTS = {
    "review": {"READY", "CHANGES_REQUIRED", "BLOCKED", "UNVERIFIED"},
    "verification": {"READY", "BLOCKED", "UNVERIFIED"},
    "evaluation": {"READY", "BLOCKED", "UNVERIFIED"},
    "drift": {"ALIGNED", "ALIGNMENT_REQUIRED", "BLOCKED", "UNVERIFIED"},
}


def now() -> str:
    return dt.datetime.now(dt.timezone.utc).isoformat()


def git_head(root: Path) -> str:
    result = subprocess.run(
        ["git", "rev-parse", "HEAD"],
        cwd=root,
        text=True,
        capture_output=True,
        check=False,
        timeout=5,
    )
    if result.returncode != 0:
        raise ValueError("cannot resolve git HEAD")
    return result.stdout.strip()


def read(path: Path) -> dict:
    try:
        value = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise ValueError(f"malformed state: {exc}") from exc
    if not isinstance(value, dict):
        raise ValueError("state must be object")
    return value


def atomic(path: Path, value: dict) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.NamedTemporaryFile(
        "w", encoding="utf-8", dir=path.parent, delete=False
    ) as out:
        json.dump(value, out, indent=2, sort_keys=False)
        out.write("\n")
        temporary = Path(out.name)
    temporary.replace(path)


def default_state(reason: str = "coordination") -> dict:
    return {
        "schema_version": SCHEMA_VERSION,
        "authority_mode": AUTHORITY_MODE,
        "work_block_id": "",
        "governance_profile": "Controlled",
        "specification": {"path": "", "revision": ""},
        "base_commit": "",
        "write_gate": {"status": "BLOCKED", "opened_at": None},
        "critic": {
            "required": True,
            "status": "PENDING",
            "verdict": "PENDING",
            "report": "",
            "isolation": "unknown",
            "skip_reason": "",
        },
        "assurance": {
            "review": {
                "required": True,
                "status": "PENDING",
                "verdict": "PENDING",
                "report": "",
                "isolation": "unknown",
                "skip_reason": "",
            },
            "verification": {
                "required": True,
                "status": "PENDING",
                "verdict": "PENDING",
                "report": "",
                "isolation": "unknown",
                "skip_reason": "",
            },
            "evaluation": {
                "required": False,
                "status": "PENDING",
                "verdict": "PENDING",
                "plan": "",
                "report": "",
                "rubric_revision": "",
                "benchmark_revision": "",
                "isolation": "unknown",
                "skip_reason": "",
            },
            "drift": {
                "required": False,
                "status": "PENDING",
                "verdict": "PENDING",
                "report": "",
                "isolation": "unknown",
                "skip_reason": "",
            },
        },
        "closeout_mode": "pending",
        "integrations": {"approved": [], "admission_records": []},
        "write_set": [],
        "coordination_write_set": DEFAULT_COORDINATION.copy(),
        "external_hard_stops": EXTERNAL_HARD_STOPS.copy(),
        "lifecycle_note": reason,
    }


def validate_state(value: dict) -> None:
    if value.get("schema_version") != SCHEMA_VERSION:
        raise ValueError(f"state requires schema_version={SCHEMA_VERSION}")
    if value.get("authority_mode") != AUTHORITY_MODE:
        raise ValueError(f"state requires authority_mode={AUTHORITY_MODE}")


def validate_open(args: argparse.Namespace) -> None:
    if not args.work_block_id.strip():
        raise ValueError("open requires a non-empty --work-block-id")
    if not args.specification_path.strip():
        raise ValueError("open requires --specification-path")
    if not args.specification_revision.strip():
        raise ValueError("open requires --specification-revision")
    writes = [value.strip() for value in args.write if value.strip()]
    if not writes:
        raise ValueError("open requires at least one --write path")
    if args.critic_status not in {"READY", "DEGRADED", "FALLBACK", "SKIPPED"}:
        raise ValueError("open requires a resolved Critic status")
    if args.critic_status == "SKIPPED":
        if not args.critic_skip_reason.strip():
            raise ValueError("SKIPPED Critic requires --critic-skip-reason")
    elif args.critic_verdict not in {"APPROVE", "SUPPLEMENT"}:
        raise ValueError("resolved Critic requires APPROVE or SUPPLEMENT verdict")


def open_state(root: Path, args: argparse.Namespace, current: dict) -> dict:
    validate_open(args)
    value = default_state("source work opened by Work Block coordination")
    value["work_block_id"] = args.work_block_id.strip()
    value["governance_profile"] = args.governance_profile
    value["specification"] = {
        "path": args.specification_path.strip(),
        "revision": args.specification_revision.strip(),
    }
    value["base_commit"] = git_head(root)
    value["write_gate"] = {"status": "READY", "opened_at": now()}
    value["write_set"] = list(dict.fromkeys(v.strip() for v in args.write if v.strip()))
    value["critic"] = {
        "required": True,
        "status": args.critic_status,
        "verdict": args.critic_verdict if args.critic_status != "SKIPPED" else "SKIPPED",
        "report": args.critic_report.strip(),
        "isolation": args.critic_isolation,
        "skip_reason": args.critic_skip_reason.strip(),
    }
    if isinstance(current.get("integrations"), dict):
        value["integrations"] = copy.deepcopy(current["integrations"])
    if isinstance(current.get("coordination_write_set"), list):
        value["coordination_write_set"] = list(current["coordination_write_set"])
    return value


def blocked_copy(current: dict, reason: str) -> dict:
    validate_state(current)
    value = copy.deepcopy(current)
    value["write_gate"] = {"status": "BLOCKED", "opened_at": None}
    value["lifecycle_note"] = reason
    return value


def validate_closeout_state(current: dict, mode: str) -> None:
    validate_state(current)
    assurance = current.get("assurance")
    if not isinstance(assurance, dict):
        raise ValueError("close requires assurance state")

    normalized: dict[str, tuple[bool, str, str]] = {}
    for name in ("review", "verification", "evaluation", "drift"):
        state = assurance.get(name)
        if not isinstance(state, dict):
            raise ValueError(f"close requires assurance.{name} state")
        required = state.get("required") is True
        status = str(state.get("status") or "")
        verdict = str(state.get("verdict") or "")
        skip_reason = str(state.get("skip_reason") or "").strip()
        if status not in ASSURANCE_STATUSES:
            raise ValueError(f"assurance.{name}.status is invalid or missing")
        if status == "PENDING":
            raise ValueError(f"assurance.{name} is still PENDING")
        if status == "SKIPPED":
            if required:
                raise ValueError(f"required assurance.{name} cannot be SKIPPED")
            if not skip_reason:
                raise ValueError(f"skipped assurance.{name} requires skip_reason")
        elif verdict not in ASSURANCE_VERDICTS[name]:
            raise ValueError(f"assurance.{name}.verdict is unresolved or invalid")
        normalized[name] = (required, status, verdict)

    if mode != "success-closeout":
        return

    required_review, review_status, review_verdict = normalized["review"]
    required_verification, verification_status, verification_verdict = normalized[
        "verification"
    ]
    required_evaluation, evaluation_status, evaluation_verdict = normalized["evaluation"]
    required_drift, drift_status, drift_verdict = normalized["drift"]

    if required_review and (review_status != "READY" or review_verdict != "READY"):
        raise ValueError("success-closeout requires assurance.review READY/READY")
    if required_verification and (
        verification_status != "READY" or verification_verdict != "READY"
    ):
        raise ValueError("success-closeout requires assurance.verification READY/READY")
    if required_evaluation and (
        evaluation_status != "READY" or evaluation_verdict != "READY"
    ):
        raise ValueError("success-closeout requires assurance.evaluation READY/READY")
    if required_drift and (drift_status != "READY" or drift_verdict != "ALIGNED"):
        raise ValueError("success-closeout requires assurance.drift READY/ALIGNED")


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--state", type=Path, default=Path(".agent/active-work-block.json")
    )
    parser.add_argument("--root", type=Path, default=Path.cwd())
    subparsers = parser.add_subparsers(dest="command", required=True)
    subparsers.add_parser("status")
    prepare = subparsers.add_parser("prepare")
    prepare.add_argument("--reason", default="coordination")

    opening = subparsers.add_parser("open")
    opening.add_argument("--work-block-id", required=True)
    opening.add_argument("--specification-path", required=True)
    opening.add_argument("--specification-revision", required=True)
    opening.add_argument("--write", action="append", default=[])
    opening.add_argument("--governance-profile", default="Controlled")
    opening.add_argument("--critic-status", default="READY")
    opening.add_argument("--critic-verdict", default="APPROVE")
    opening.add_argument("--critic-report", default="")
    opening.add_argument("--critic-isolation", default="same_context")
    opening.add_argument("--critic-skip-reason", default="")

    freeze = subparsers.add_parser("freeze")
    freeze.add_argument("--reason", required=True)
    close = subparsers.add_parser("close")
    close.add_argument("--reason", required=True)
    close.add_argument(
        "--mode", choices=("success-closeout", "reporting-only"), required=True
    )

    args = parser.parse_args()
    root = args.root.resolve()
    state = args.state if args.state.is_absolute() else root / args.state

    if args.command == "status":
        value = read(state)
        validate_state(value)
        print(json.dumps(value, sort_keys=True))
        return 0

    current = read(state) if state.exists() else default_state()
    if args.command == "prepare":
        value = default_state(args.reason)
    elif args.command == "open":
        validate_state(current)
        value = open_state(root, args, current)
    elif args.command == "freeze":
        value = blocked_copy(current, args.reason)
    else:
        validate_closeout_state(current, args.mode)
        value = blocked_copy(current, args.reason)
        value["closeout_mode"] = args.mode

    atomic(state, value)
    print(json.dumps(value, sort_keys=True))
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except ValueError as exc:
        print(f"BLOCKED: {exc}")
        raise SystemExit(2)
