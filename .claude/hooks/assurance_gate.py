#!/usr/bin/env python3
"""Claude Code Stop guard for Review, Verification, Evaluation, Drift, and closeout state."""
from __future__ import annotations

import json
import os
from pathlib import Path, PurePosixPath
import subprocess
import sys

GATE_PATH = Path(".agent/active-work-block.json")
EVALUATION_VALIDATOR = Path("scripts/validate-evaluation.py")


class GateError(Exception):
    pass


def block(reason: str) -> None:
    print(json.dumps({"decision": "block", "reason": reason}, ensure_ascii=False))
    raise SystemExit(0)


def root_from(cwd: object | None = None) -> Path:
    start = Path(str(cwd or os.getcwd())).resolve()
    for root in (start, *start.parents):
        if (root / GATE_PATH).is_file():
            return root
    raise GateError(f"Cannot find {GATE_PATH.as_posix()} from {start}.")


def load_gate(root: Path) -> dict:
    try:
        gate = json.loads((root / GATE_PATH).read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise GateError(f"Invalid {GATE_PATH.as_posix()}: {exc}") from exc
    if not isinstance(gate, dict):
        raise GateError("Active Work Block gate must be a JSON object.")
    if gate.get("schema_version") != 3:
        raise GateError("Closeout requires active-work-block schema_version=3.")
    if gate.get("authority_mode") != "github_capability":
        raise GateError("Closeout requires authority_mode=github_capability.")
    if not str(gate.get("work_block_id") or "").strip():
        raise GateError("Closeout requires a non-empty work_block_id.")
    return gate


def report_path(root: Path, raw: object, label: str) -> Path:
    value = str(raw or "").strip().strip("\"'")
    if not value:
        raise GateError(f"{label} requires a report path.")
    path = Path(value)
    if path.is_absolute():
        try:
            path = path.resolve().relative_to(root)
        except (ValueError, OSError) as exc:
            raise GateError(f"{label} report is outside repository: {value}") from exc
    pure = PurePosixPath(path.as_posix())
    if ".." in pure.parts:
        raise GateError(f"{label} report escapes repository: {value}")
    normalized = pure.as_posix().lstrip("./")
    if not normalized.startswith("docs/reports/"):
        raise GateError(f"{label} report must be under docs/reports/: {normalized}")
    full = root / normalized
    if not full.is_file() or full.stat().st_size == 0:
        raise GateError(f"{label} report does not exist or is empty: {normalized}")
    return full


def validate_function(root: Path, name: str, state: object) -> tuple[bool, str, str]:
    if not isinstance(state, dict):
        raise GateError(f"assurance.{name} state is missing.")

    required = state.get("required") is True
    status = str(state.get("status") or "")
    verdict = str(state.get("verdict") or "")
    skip_reason = str(state.get("skip_reason") or "").strip()
    isolation = str(state.get("isolation") or "").strip()

    allowed_status = {"PENDING", "READY", "SKIPPED", "DEGRADED", "BLOCKED"}
    if status not in allowed_status:
        raise GateError(f"assurance.{name}.status is invalid: {status or 'missing'}")

    if required and status == "SKIPPED":
        raise GateError(f"Required {name} assurance cannot be SKIPPED.")
    if not required and status == "SKIPPED":
        if not skip_reason:
            raise GateError(f"Skipped {name} assurance requires skip_reason.")
        return required, status, verdict

    if status == "PENDING":
        raise GateError(f"assurance.{name} is still PENDING.")

    if status in {"READY", "DEGRADED", "BLOCKED"}:
        report_path(root, state.get("report"), name.capitalize())
        if not isolation or isolation == "unknown":
            raise GateError(f"assurance.{name}.isolation must record the actual boundary.")

    allowed_verdicts = {
        "review": {"READY", "CHANGES_REQUIRED", "BLOCKED", "UNVERIFIED"},
        "verification": {"READY", "BLOCKED", "UNVERIFIED"},
        "evaluation": {"READY", "BLOCKED", "UNVERIFIED"},
        "drift": {"ALIGNED", "ALIGNMENT_REQUIRED", "BLOCKED", "UNVERIFIED"},
    }[name]
    if verdict not in allowed_verdicts:
        raise GateError(f"assurance.{name}.verdict is unresolved or invalid: {verdict or 'missing'}")

    return required, status, verdict


def validate_evaluation_contract(root: Path) -> None:
    validator = root / EVALUATION_VALIDATOR
    if not validator.is_file():
        raise GateError(f"Missing evaluation validator: {EVALUATION_VALIDATOR.as_posix()}")
    result = subprocess.run(
        [sys.executable, str(validator), "closeout", str(root)],
        cwd=root,
        text=True,
        capture_output=True,
        check=False,
    )
    if result.returncode != 0:
        detail = (result.stderr or result.stdout or "evaluation validation failed").strip()
        raise GateError(detail)


def main() -> None:
    try:
        try:
            payload = json.load(sys.stdin)
        except (json.JSONDecodeError, OSError):
            payload = {}
        cwd = payload.get("cwd") if isinstance(payload, dict) else None
        root = root_from(cwd)
        gate = load_gate(root)

        assurance = gate.get("assurance")
        if not isinstance(assurance, dict):
            raise GateError("Active Work Block requires assurance state.")

        review = validate_function(root, "review", assurance.get("review"))
        verification = validate_function(root, "verification", assurance.get("verification"))
        evaluation = validate_function(root, "evaluation", assurance.get("evaluation"))
        drift = validate_function(root, "drift", assurance.get("drift"))

        mode = str(gate.get("closeout_mode") or "")
        if mode not in {"success-closeout", "reporting-only"}:
            raise GateError(
                "closeout_mode must be success-closeout or reporting-only before Stop."
            )

        validate_evaluation_contract(root)

        if mode == "success-closeout":
            required_review, review_status, review_verdict = review
            required_verification, verification_status, verification_verdict = verification
            required_evaluation, evaluation_status, evaluation_verdict = evaluation
            required_drift, drift_status, drift_verdict = drift

            if required_review and (review_status != "READY" or review_verdict != "READY"):
                raise GateError("success-closeout requires Review status/verdict READY.")
            if required_verification and (
                verification_status != "READY" or verification_verdict != "READY"
            ):
                raise GateError("success-closeout requires Verification status/verdict READY.")
            if required_evaluation and (
                evaluation_status != "READY" or evaluation_verdict != "READY"
            ):
                raise GateError("success-closeout requires Evaluation status/verdict READY.")
            if required_drift and (drift_status != "READY" or drift_verdict != "ALIGNED"):
                raise GateError("success-closeout requires Drift status READY and verdict ALIGNED.")
    except GateError as exc:
        block(str(exc))


if __name__ == "__main__":
    main()
