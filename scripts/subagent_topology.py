#!/usr/bin/env python3
"""Fail-closed validation for native subagent role-context evidence.

This module validates the cooperative lifecycle record.  It deliberately does
not represent an OS, filesystem, credential, or process isolation boundary.
"""
from __future__ import annotations

import datetime as dt
import argparse
import json
import re
from pathlib import Path
from typing import Any

FORMAL_PROFILES = {"Managed", "Assured"}
REQUIRED_ROLES = ("critic", "reviewer", "verifier")
CAPABILITY_STATES = {"available", "unavailable", "conditional", "unknown", "launch_failed"}
FRESHNESS = dt.timedelta(hours=24)
NATIVE_DISPATCH_REF = re.compile(r"native_dispatch:([A-Za-z0-9][A-Za-z0-9._-]*)\Z")
RFC3339_UTC = re.compile(
    r"\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|\+00:00)\Z"
)


class TopologyError(ValueError):
    """Raised when the cooperative role-context contract is not satisfied."""


def applicable(state: dict[str, Any]) -> bool:
    return state.get("governance_profile") in FORMAL_PROFILES and state.get("non_trivial") is True


def _utc(value: object, label: str) -> dt.datetime:
    if not isinstance(value, str) or not value.strip():
        raise TopologyError(f"{label} is required")
    if RFC3339_UTC.fullmatch(value) is None:
        raise TopologyError(f"{label} must be RFC3339 UTC")
    try:
        parsed = dt.datetime.fromisoformat(value[:-1] + "+00:00" if value.endswith("Z") else value)
    except ValueError as exc:
        raise TopologyError(f"{label} must be RFC3339 UTC") from exc
    if parsed.tzinfo is None or parsed.utcoffset() != dt.timedelta(0):
        raise TopologyError(f"{label} must be RFC3339 UTC")
    return parsed.astimezone(dt.timezone.utc)


def _record(state: dict[str, Any]) -> dict[str, Any]:
    record = state.get("subagent_topology")
    if not isinstance(record, dict):
        raise TopologyError("applicable Work Block requires subagent_topology evidence")
    return record


def _capability(state: dict[str, Any], now: dt.datetime) -> tuple[dict[str, Any], str]:
    record = _record(state)
    capability = record.get("capability")
    if not isinstance(capability, dict):
        raise TopologyError("subagent_topology.capability is required")
    status = capability.get("status")
    if status not in CAPABILITY_STATES:
        raise TopologyError("subagent_topology.capability.status is invalid or missing")
    for key in ("runtime", "adapter", "adapter_version", "repository_root", "probe_event_ref"):
        if not isinstance(capability.get(key), str) or not capability[key].strip():
            raise TopologyError(f"subagent_topology.capability.{key} is required")
    verified = _utc(capability.get("verified_at"), "subagent_topology.capability.verified_at")
    if now - verified > FRESHNESS or verified > now + dt.timedelta(minutes=5):
        raise TopologyError("subagent_topology.capability evidence is stale")
    _capability_probe_ids(capability)
    return capability, status


def _expect(value: dict[str, Any], key: str, expected: object, label: str) -> None:
    if value.get(key) != expected:
        raise TopologyError(f"{label}.{key} does not match active Work Block")


def _native_dispatch_id(value: object, label: str) -> str:
    """Return the sole native dispatch ID encoded by an evidence reference."""
    if not isinstance(value, str):
        raise TopologyError(f"{label} must be one native_dispatch:<execution_id> reference")
    match = NATIVE_DISPATCH_REF.fullmatch(value)
    if match is None:
        raise TopologyError(f"{label} must be one native_dispatch:<execution_id> reference")
    return match.group(1)


def _capability_probe_ids(capability: dict[str, Any]) -> set[str]:
    """Validate the aggregate comma-separated native capability probe ledger."""
    ledger = capability.get("probe_event_ref")
    if not isinstance(ledger, str) or not ledger:
        raise TopologyError("subagent_topology.capability.probe_event_ref is required")
    probe_ids = [
        _native_dispatch_id(reference, "subagent_topology.capability.probe_event_ref")
        for reference in ledger.split(",")
    ]
    if len(probe_ids) != len(REQUIRED_ROLES):
        raise TopologyError("subagent_topology.capability.probe_event_ref must contain exactly three native dispatch IDs")
    if len(probe_ids) != len(set(probe_ids)):
        raise TopologyError("subagent_topology.capability.probe_event_ref must contain distinct native dispatch IDs")
    return set(probe_ids)


def _report_path(report: str, root: Path | None, label: str) -> Path | None:
    normalized = report.replace("\\", "/")
    parts = normalized.split("/")
    if (
        normalized.startswith("/")
        or (len(parts[0]) == 2 and parts[0][1] == ":")
        or ".." in parts
        or len(parts) < 3
        or parts[:2] != ["docs", "reports"]
    ):
        raise TopologyError(f"{label}.report must be a safe path under docs/reports")
    if root is None:
        return None
    repository_root = root.resolve()
    reports_root = (repository_root / "docs" / "reports").resolve()
    try:
        reports_root.relative_to(repository_root)
    except ValueError as exc:
        raise TopologyError("docs/reports must remain inside the repository") from exc
    candidate = repository_root.joinpath(*parts)
    resolved = candidate.resolve()
    try:
        resolved.relative_to(reports_root)
    except ValueError as exc:
        raise TopologyError(f"{label}.report resolves outside docs/reports") from exc
    return candidate


def _authoritative_report(state: dict[str, Any], role: str, phase: str) -> str:
    if role == "critic":
        evidence = state.get("critic")
        label = "critic"
    elif phase == "closeout" and role == "reviewer":
        assurance = state.get("assurance")
        evidence = assurance.get("review") if isinstance(assurance, dict) else None
        label = "assurance.review"
    elif phase in {"closeout", "verifier-execution"} and role == "verifier":
        assurance = state.get("assurance")
        evidence = assurance.get("verification") if isinstance(assurance, dict) else None
        label = "assurance.verification"
    else:
        raise TopologyError(f"role binding {role} has no authoritative report for {phase}")
    report = evidence.get("report") if isinstance(evidence, dict) else None
    if not isinstance(report, str) or not report.strip():
        raise TopologyError(f"{label}.report is required")
    return report


def _bindings(
    state: dict[str, Any],
    roles: tuple[str, ...],
    now: dt.datetime,
    root: Path | None,
    phase: str,
    capability: dict[str, Any],
) -> None:
    record = _record(state)
    bindings = record.get("role_bindings")
    if not isinstance(bindings, list):
        raise TopologyError("subagent_topology.role_bindings is required")
    selected = [item for item in bindings if isinstance(item, dict) and item.get("role") in roles]
    if len(selected) != len(roles):
        raise TopologyError("required native role bindings are missing or duplicated")
    if {item.get("role") for item in selected} != set(roles):
        raise TopologyError("required native role bindings are missing or duplicated")
    executions: set[str] = set()
    contexts: set[str] = set()
    probe_ids = _capability_probe_ids(capability)
    for binding in selected:
        role = str(binding["role"])
        if phase == "admission":
            expected_revision = state.get("base_commit")
        elif role in {"reviewer", "verifier"}:
            expected_revision = state.get("frozen_revision")
        else:
            expected_revision = state.get("base_commit")
        for key in (
            "work_block_id", "execution_id", "context_id", "context_id_source", "runtime", "adapter",
            "adapter_version", "source_revision", "repository_root", "branch", "readonly_boundary",
            "launch_mechanism", "topology_tier", "probe_event_ref", "report", "status",
        ):
            if not isinstance(binding.get(key), str) or not binding[key].strip():
                raise TopologyError(f"role binding {role}.{key} is required")
        _expect(binding, "work_block_id", state.get("work_block_id"), f"role binding {role}")
        _expect(binding, "branch", state.get("subject_branch"), f"role binding {role}")
        _expect(binding, "repository_root", str(root.resolve()) if root else binding["repository_root"], f"role binding {role}")
        _expect(binding, "source_revision", expected_revision, f"role binding {role}")
        for key in ("runtime", "adapter", "adapter_version"):
            if binding[key] != capability[key]:
                raise TopologyError(f"role binding {role}.{key} does not match capability evidence")
        expected_status = "PENDING" if phase == "verifier-execution" else "READY"
        if binding["status"] != expected_status or binding["launch_mechanism"] != "native":
            raise TopologyError(
                f"role binding {role} is not a {expected_status} native execution"
            )
        if binding["topology_tier"] != "native-separate-context":
            raise TopologyError(f"role binding {role} has invalid topology tier")
        if binding["context_id_source"] not in {"platform_context_id", "execution_id"}:
            raise TopologyError(f"role binding {role}.context_id_source is invalid")
        if binding["context_id_source"] == "execution_id" and binding["context_id"] != binding["execution_id"]:
            raise TopologyError(f"role binding {role} execution-id context alias is invalid")
        dispatch_id = _native_dispatch_id(binding["probe_event_ref"], f"role binding {role}.probe_event_ref")
        if binding["execution_id"] != dispatch_id:
            raise TopologyError(f"role binding {role}.execution_id does not match its native dispatch reference")
        if dispatch_id in probe_ids:
            raise TopologyError(f"role binding {role} reuses a capability probe execution ID")
        if binding["report"] != _authoritative_report(state, role, phase):
            raise TopologyError(f"role binding {role}.report does not match its authoritative report")
        report_path = _report_path(binding["report"], root, f"role binding {role}")
        if phase != "verifier-execution" and report_path is not None and not report_path.is_file():
            raise TopologyError(f"role binding {role}.report is missing")
        observed = _utc(binding.get("observed_at"), f"role binding {role}.observed_at")
        if now - observed > FRESHNESS or observed > now + dt.timedelta(minutes=5):
            raise TopologyError(f"role binding {role} evidence is stale")
        if binding["execution_id"] in executions or binding["context_id"] in contexts:
            raise TopologyError("native execution or context IDs must be unique per required role")
        executions.add(binding["execution_id"])
        contexts.add(binding["context_id"])

    if phase == "verifier-execution":
        verifier = selected[0]
        for binding in bindings:
            if not isinstance(binding, dict) or binding is verifier:
                continue
            if binding.get("execution_id") == verifier["execution_id"]:
                raise TopologyError("native execution IDs must not be reused by the provisional Verifier")
            if binding.get("context_id") == verifier["context_id"]:
                raise TopologyError("native context IDs must not be reused by the provisional Verifier")


def validate(state: dict[str, Any], *, phase: str, root: Path | None = None, now: dt.datetime | None = None) -> None:
    """Validate admission, provisional Verifier execution, or final closeout evidence."""
    if not applicable(state):
        return
    if phase not in {"admission", "verifier-execution", "closeout"}:
        raise TopologyError("topology validation phase is invalid")
    current = now or dt.datetime.now(dt.timezone.utc)
    capability, status = _capability(state, current)
    record = _record(state)
    if status != "available":
        if record.get("status") != "DEGRADED" or not isinstance(record.get("degraded_reason"), str) or not record["degraded_reason"].strip():
            raise TopologyError("unavailable native capability requires explicit DEGRADED topology evidence")
        raise TopologyError(f"native subagent capability is {status}; promotion is blocked")
    if record.get("policy") != "native-separate-context-required" or record.get("status") != "READY":
        raise TopologyError("available native capability requires READY native-separate-context-required topology")
    if phase in {"verifier-execution", "closeout"} and not isinstance(state.get("frozen_revision"), str):
        raise TopologyError("success-closeout requires frozen_revision")
    if phase in {"verifier-execution", "closeout"} and not state["frozen_revision"].strip():
        raise TopologyError("success-closeout requires frozen_revision")
    if capability.get("repository_root") != (str(root.resolve()) if root else capability.get("repository_root")):
        raise TopologyError("capability repository_root does not match active repository")
    if phase == "admission":
        critic = state.get("critic")
        if not isinstance(critic, dict) or critic.get("status") != "READY" or critic.get("verdict") != "APPROVE":
            raise TopologyError("native topology admission requires Critic READY/APPROVE binding")
        report = critic.get("report")
        if not isinstance(report, str) or not report.startswith("docs/reports/"):
            raise TopologyError("native topology admission requires a linked Critic report")
    if phase == "verifier-execution":
        assurance = state.get("assurance")
        verification = assurance.get("verification") if isinstance(assurance, dict) else None
        if not isinstance(verification, dict):
            raise TopologyError("provisional Verifier execution requires assurance.verification")
        if verification.get("status") != "PENDING" or verification.get("verdict") != "PENDING":
            raise TopologyError("provisional Verifier execution requires assurance.verification PENDING/PENDING")
    _bindings(
        state,
        ("critic",) if phase == "admission" else (("verifier",) if phase == "verifier-execution" else REQUIRED_ROLES),
        current,
        root,
        phase,
        capability,
    )


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--state", type=Path, default=Path(".agent/active-work-block.json"))
    parser.add_argument(
        "--phase", choices=("admission", "verifier-execution", "closeout"), required=True
    )
    args = parser.parse_args()
    try:
        state = json.loads(args.state.read_text(encoding="utf-8"))
        if not isinstance(state, dict):
            raise TopologyError("active Work Block state must be an object")
        validate(state, phase=args.phase, root=Path.cwd())
    except (OSError, json.JSONDecodeError, TopologyError) as exc:
        print(f"TOPOLOGY BLOCKED: {exc}")
        return 2
    print("Native subagent topology: READY")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
