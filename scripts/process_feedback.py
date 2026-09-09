#!/usr/bin/env python3
"""Shared Process Feedback contract, registry, and closeout validation."""

from __future__ import annotations

import re
from collections import Counter, defaultdict
from pathlib import Path
from typing import Any

import yaml

SCHEMA_VERSION = 1
REGISTRY_RELATIVE_PATH = "docs/engineering-memory/process-feedback-registry.yml"
REQUIRED_DIMENSIONS = (
    "documentation", "contracts_invariants", "tooling_skills", "context_memory",
    "governance_authority", "environment_setup", "validation_tests",
    "process_overhead_repeated_work",
)
DIMENSION_STATES = ("CLEAR", "FRICTION_OBSERVED")
CATEGORIES = (
    "DOCUMENTATION_GAP", "CONTRACT_MISMATCH", "TOOLING_FRICTION",
    "VALIDATOR_OR_TEST_ISSUE", "CONTEXT_OR_MEMORY_GAP", "GOVERNANCE_AMBIGUITY",
    "ENVIRONMENT_ISSUE", "PROCESS_OVERHEAD", "RECURRING_IMPLEMENTATION_ERROR",
)
SEVERITIES = ("LOW", "MEDIUM", "HIGH", "SYSTEMIC")
STATUSES = (
    "NEW", "TRIAGED", "ACCEPTED", "DUPLICATE", "REJECTED", "IMPROVEMENT_WB",
    "VERIFIED", "CLOSED",
)
REQUIRED_OBSERVATION_FIELDS = (
    "id", "work_block_id", "date", "category", "observation", "evidence",
    "likely_systemic_cause", "impact", "suggested_improvement", "severity",
    "status", "authority",
)
OBSERVATION_ID_RE = re.compile(r"^PF-[A-Za-z0-9][A-Za-z0-9._-]*$")
DATE_RE = re.compile(r"^\d{4}-\d{2}-\d{2}$")
PROCESS_BLOCK_RE = re.compile(
    r"^## Process Feedback\s*$\n(?P<body>.*?)(?=^##\s|\Z)", re.MULTILINE | re.DOTALL
)
PROCESS_YAML_RE = re.compile(
    r"```yaml process-feedback\s*\n(?P<yaml>.*?)\n```", re.DOTALL
)
FRONTMATTER_RE = re.compile(r"^---\n(?P<yaml>.*?)\n---\n(?P<body>.*)\Z", re.DOTALL)
REVIEW_FIELDS = (
    "Missed Process Feedback", "Unsupported Feedback", "Classification Concerns",
    "Duplicate/Recurring Candidate",
)


class ProcessFeedbackError(ValueError):
    """Raised when a Process Feedback artifact violates the contract."""


def _nonempty(value: Any, field: str, label: str) -> str:
    if not isinstance(value, str) or not value.strip():
        raise ProcessFeedbackError(f"{label}: {field} must be a non-empty string")
    if "[placeholder]" in value.lower():
        raise ProcessFeedbackError(f"{label}: {field} contains a placeholder")
    return value.strip()


def _validate_dimension(value: Any, dimension: str, label: str) -> str:
    if not isinstance(value, dict) or set(value) != {"state", "evidence"}:
        raise ProcessFeedbackError(
            f"{label}: {dimension} must contain exactly state and evidence"
        )
    state = value.get("state")
    if state not in DIMENSION_STATES:
        raise ProcessFeedbackError(f"{label}: {dimension} has invalid state {state!r}")
    evidence = _nonempty(value.get("evidence"), "evidence", f"{label} {dimension}")
    if len(evidence) < 8:
        raise ProcessFeedbackError(f"{label}: {dimension} evidence is too short")
    return state


def _load_yaml(path: Path, label: str) -> dict[str, Any]:
    try:
        value = yaml.safe_load(path.read_text(encoding="utf-8"))
    except (OSError, yaml.YAMLError) as exc:
        raise ProcessFeedbackError(f"{label}: invalid YAML: {exc}") from exc
    if not isinstance(value, dict):
        raise ProcessFeedbackError(f"{label}: expected a YAML object")
    return value


def _validate_observation(observation: Any, index: int) -> dict[str, Any]:
    label = f"observation[{index}]"
    if not isinstance(observation, dict):
        raise ProcessFeedbackError(f"{label}: expected an object")
    missing = [field for field in REQUIRED_OBSERVATION_FIELDS if field not in observation]
    if missing:
        raise ProcessFeedbackError(f"{label}: missing fields: {', '.join(missing)}")
    observation_id = _nonempty(observation["id"], "id", label)
    if not OBSERVATION_ID_RE.fullmatch(observation_id):
        raise ProcessFeedbackError(f"{label}: id must match PF-* stable identifier format")
    _nonempty(observation["work_block_id"], "work_block_id", label)
    date = _nonempty(observation["date"], "date", label)
    if not DATE_RE.fullmatch(date):
        raise ProcessFeedbackError(f"{label}: date must be YYYY-MM-DD")
    if observation["category"] not in CATEGORIES:
        raise ProcessFeedbackError(f"{label}: invalid category {observation['category']!r}")
    if observation["severity"] not in SEVERITIES:
        raise ProcessFeedbackError(f"{label}: invalid severity {observation['severity']!r}")
    if observation["status"] not in STATUSES:
        raise ProcessFeedbackError(f"{label}: invalid status {observation['status']!r}")
    if observation["authority"] != "advisory_only":
        raise ProcessFeedbackError(f"{label}: authority must be advisory_only")
    for field in ("observation", "evidence", "likely_systemic_cause", "impact", "suggested_improvement"):
        _nonempty(observation[field], field, label)
    if "duplicate_of" in observation and observation["duplicate_of"] is not None:
        duplicate_of = _nonempty(observation["duplicate_of"], "duplicate_of", label)
        if duplicate_of == observation_id:
            raise ProcessFeedbackError(f"{label}: duplicate_of cannot equal id")
    related = observation.get("related_work_blocks", [])
    if not isinstance(related, list) or any(not isinstance(item, str) or not item.strip() for item in related):
        raise ProcessFeedbackError(f"{label}: related_work_blocks must be a list of non-empty strings")
    if not isinstance(observation.get("avoidable_friction", False), bool):
        raise ProcessFeedbackError(f"{label}: avoidable_friction must be boolean")
    for field in ("expected_benefit", "improvement_risk"):
        if field in observation and observation[field] is not None:
            _nonempty(observation[field], field, label)
    return observation


def validate_registry(path: Path) -> dict[str, Any]:
    """Validate and return the canonical registry."""
    value = _load_yaml(path, f"registry {path}")
    if value.get("schema_version") != SCHEMA_VERSION:
        raise ProcessFeedbackError(f"registry {path}: schema_version must be {SCHEMA_VERSION}")
    if value.get("sink") != REGISTRY_RELATIVE_PATH:
        raise ProcessFeedbackError(f"registry {path}: sink must be {REGISTRY_RELATIVE_PATH}")
    boundary = value.get("authority_boundary")
    if not isinstance(boundary, dict) or boundary.get("mode") != "advisory_only":
        raise ProcessFeedbackError("registry: authority_boundary.mode must be advisory_only")
    if boundary.get("systemic_change_requires") != "separate_improvement_work_block":
        raise ProcessFeedbackError("registry: systemic change boundary is invalid")
    if boundary.get("direct_governance_mutation") != "forbidden":
        raise ProcessFeedbackError("registry: direct governance mutation must be forbidden")
    observations = value.get("observations")
    if not isinstance(observations, list):
        raise ProcessFeedbackError("registry: observations must be a list")
    seen: set[str] = set()
    for index, observation in enumerate(observations):
        validated = _validate_observation(observation, index)
        if validated["id"] in seen:
            raise ProcessFeedbackError(f"registry: duplicate observation id {validated['id']}")
        seen.add(validated["id"])
    return value


def _parse_frontmatter(path: Path) -> tuple[dict[str, Any], str]:
    try:
        text = path.read_text(encoding="utf-8")
    except OSError as exc:
        raise ProcessFeedbackError(f"closeout {path}: cannot read: {exc}") from exc
    match = FRONTMATTER_RE.match(text)
    if not match:
        raise ProcessFeedbackError(f"closeout {path}: missing YAML frontmatter")
    try:
        frontmatter = yaml.safe_load(match.group("yaml"))
    except yaml.YAMLError as exc:
        raise ProcessFeedbackError(f"closeout {path}: invalid frontmatter: {exc}") from exc
    if not isinstance(frontmatter, dict):
        raise ProcessFeedbackError(f"closeout {path}: frontmatter must be an object")
    return frontmatter, match.group("body")


def _parse_process_block(body: str, label: str) -> dict[str, Any]:
    section = PROCESS_BLOCK_RE.search(body)
    if not section:
        raise ProcessFeedbackError(f"{label}: missing ## Process Feedback section")
    blocks = PROCESS_YAML_RE.findall(section.group("body"))
    if len(blocks) != 1:
        raise ProcessFeedbackError(f"{label}: requires exactly one yaml process-feedback block")
    try:
        value = yaml.safe_load(blocks[0])
    except yaml.YAMLError as exc:
        raise ProcessFeedbackError(f"{label}: invalid Process Feedback YAML: {exc}") from exc
    if not isinstance(value, dict):
        raise ProcessFeedbackError(f"{label}: Process Feedback block must be an object")
    return value


def validate_closeout_file(closeout_path: Path, registry_path: Path, expected_work_block_id: str | None = None) -> dict[str, Any]:
    """Validate the opted-in closeout contract against the canonical registry."""
    frontmatter, body = _parse_frontmatter(closeout_path)
    label = f"closeout {closeout_path}"
    if frontmatter.get("process_feedback_required") is not True:
        raise ProcessFeedbackError(f"{label}: process_feedback_required must be true")
    if frontmatter.get("process_feedback_contract") != SCHEMA_VERSION:
        raise ProcessFeedbackError(f"{label}: process_feedback_contract must be {SCHEMA_VERSION}")
    block = _parse_process_block(body, label)
    if block.get("contract_version") != SCHEMA_VERSION:
        raise ProcessFeedbackError(f"{label}: contract_version must be {SCHEMA_VERSION}")
    work_block_id = _nonempty(block.get("work_block_id"), "work_block_id", label)
    if expected_work_block_id is not None and work_block_id != expected_work_block_id:
        raise ProcessFeedbackError(f"{label}: work_block_id does not match expected Work Block")
    date = _nonempty(block.get("date"), "date", label)
    if not DATE_RE.fullmatch(date):
        raise ProcessFeedbackError(f"{label}: date must be YYYY-MM-DD")
    if block.get("registry") != REGISTRY_RELATIVE_PATH:
        raise ProcessFeedbackError(f"{label}: registry must be {REGISTRY_RELATIVE_PATH}")
    result = block.get("result")
    if result not in {"NONE — checked", "OBSERVATIONS_RECORDED"}:
        raise ProcessFeedbackError(f"{label}: result must be NONE — checked or OBSERVATIONS_RECORDED")
    dimensions = block.get("dimensions")
    if not isinstance(dimensions, dict) or set(dimensions) != set(REQUIRED_DIMENSIONS):
        raise ProcessFeedbackError(f"{label}: all eight mandatory dimensions are required")
    states = {
        dimension: _validate_dimension(dimensions[dimension], dimension, label)
        for dimension in REQUIRED_DIMENSIONS
    }
    friction_dimensions = [
        dimension for dimension, state in states.items() if state == "FRICTION_OBSERVED"
    ]
    ids = block.get("observation_ids")
    if not isinstance(ids, list) or any(not isinstance(item, str) for item in ids):
        raise ProcessFeedbackError(f"{label}: observation_ids must be a list of strings")
    count = block.get("avoidable_friction_count")
    if not isinstance(count, int) or isinstance(count, bool) or count < 0:
        raise ProcessFeedbackError(f"{label}: avoidable_friction_count must be a non-negative integer")
    registry = validate_registry(registry_path)
    by_id = {item["id"]: item for item in registry["observations"]}
    if len(set(ids)) != len(ids):
        raise ProcessFeedbackError(f"{label}: observation_ids contains duplicates")
    missing = [item for item in ids if item not in by_id]
    if missing:
        raise ProcessFeedbackError(f"{label}: observation_ids not found in canonical registry: {', '.join(missing)}")
    selected = [by_id[item] for item in ids]
    if any(item["work_block_id"] != work_block_id for item in selected):
        raise ProcessFeedbackError(f"{label}: observation belongs to a different Work Block")
    actual_avoidable = sum(1 for item in selected if item.get("avoidable_friction", False))
    if count != actual_avoidable:
        raise ProcessFeedbackError(f"{label}: avoidable_friction_count does not match referenced observations")
    if result == "NONE — checked" and friction_dimensions:
        raise ProcessFeedbackError(
            f"{label}: NONE — checked requires all eight dimensions to be CLEAR; "
            f"friction observed in {', '.join(friction_dimensions)}"
        )
    if result == "NONE — checked" and (ids or count != 0):
        raise ProcessFeedbackError(f"{label}: NONE — checked cannot reference observations or friction")
    if result == "OBSERVATIONS_RECORDED" and not friction_dimensions:
        raise ProcessFeedbackError(
            f"{label}: OBSERVATIONS_RECORDED requires at least one FRICTION_OBSERVED dimension"
        )
    if friction_dimensions and not ids:
        raise ProcessFeedbackError(
            f"{label}: FRICTION_OBSERVED requires at least one linked canonical observation"
        )
    return block


def validate_review_report(path: Path) -> None:
    """Require read-only assurance concern fields in a report."""
    try:
        text = path.read_text(encoding="utf-8")
    except OSError as exc:
        raise ProcessFeedbackError(f"review report {path}: cannot read: {exc}") from exc
    section = re.search(r"^## Process Feedback Review\s*$\n(?P<body>.*?)(?=^##\s|\Z)", text, re.MULTILINE | re.DOTALL)
    if not section:
        raise ProcessFeedbackError(f"review report {path}: missing Process Feedback Review section")
    for field in REVIEW_FIELDS:
        match = re.search(rf"^- \*\*{re.escape(field)}:\*\*\s*(.+?)\s*$", section.group("body"), re.MULTILINE)
        if not match or not match.group(1).strip() or "[none" in match.group(1).lower() or "[" in match.group(1):
            raise ProcessFeedbackError(f"review report {path}: {field} must have a concrete value")


def aggregate(registry_path: Path) -> dict[str, Any]:
    """Build a deterministic, read-only summary of the registry."""
    registry = validate_registry(registry_path)
    observations = registry["observations"]
    causes: defaultdict[str, list[str]] = defaultdict(list)
    for observation in observations:
        cause = " ".join(observation["likely_systemic_cause"].lower().split())
        causes[cause].append(observation["id"])
    recurring = [
        {"cause": cause, "observation_ids": ids, "frequency": len(ids)}
        for cause, ids in sorted(causes.items()) if len(ids) > 1
    ]
    duplicates = [
        {"observation_id": item["id"], "duplicate_of": item["duplicate_of"]}
        for item in observations if item.get("duplicate_of")
    ]
    candidates = [
        {
            "observation_id": item["id"],
            "suggested_improvement": item["suggested_improvement"],
            "expected_benefit": item.get("expected_benefit", "not recorded"),
            "improvement_risk": item.get("improvement_risk", "not recorded"),
        }
        for item in observations if item["status"] == "ACCEPTED"
    ]
    return {
        "schema_version": SCHEMA_VERSION,
        "sink": REGISTRY_RELATIVE_PATH,
        "total": len(observations),
        "by_category": dict(sorted(Counter(item["category"] for item in observations).items())),
        "by_severity": dict(sorted(Counter(item["severity"] for item in observations).items())),
        "by_status": dict(sorted(Counter(item["status"] for item in observations).items())),
        "avoidable_friction_total": sum(1 for item in observations if item.get("avoidable_friction", False)),
        "duplicates": duplicates,
        "recurring_causes": recurring,
        "candidate_improvements": candidates,
    }
