#!/usr/bin/env python3
"""Shared, runtime-neutral Maintenance Mode decision layer.

This module only downgrades named cooperative local guards. It never grants
normal lifecycle approval and it always denies immutable hard-stop classes.
"""
from __future__ import annotations

import datetime as _dt
import fnmatch
import json
from pathlib import Path, PurePosixPath
import subprocess
from typing import Any

STATE_NAME = ".agent/maintenance-mode.json"
AUDIT_NAME = ".agent/maintenance-mode.audit.jsonl"
SCHEMA_VERSION = 1

HARD_STOP_CLASSES = frozenset({
    "force_push", "non_fast_forward_push", "merge", "deploy", "release",
    "protected_branch", "default_branch", "tag", "credentials", "secrets",
    "live_data", "live_infrastructure", "destructive_cleanup",
    "irreversible_external_effect", "cross_repository_write",
})
COOPERATIVE_CLASSES = frozenset({
    "inactive_coordination", "source_write_gate", "post_freeze_staging",
    "lifecycle_sequencing", "direct_single_git", "complex_mutating_bash",
    "verified_same_repository_handoff", "candidate_terminal_sequencing",
})
REQUIRED_FIELDS = {
    "schema_version", "enabled", "repository_identity", "remediation_branch",
    "trusted_base", "allowed_path_scope", "owner_authorization_ref",
    "activation_reason", "activated_at", "downgraded_guard_classes",
    "hard_stop_classes",
}


class MaintenanceError(ValueError):
    """Invalid state or unverifiable repository binding."""


def _git(root: Path, *args: str) -> str:
    result = subprocess.run(
        ["git", *args], cwd=root, check=True, capture_output=True,
        text=True, timeout=3,
    )
    return result.stdout.strip()


def repo_identity(root: Path) -> str:
    common = Path(_git(root, "rev-parse", "--path-format=absolute", "--git-common-dir"))
    return str(common.resolve())


def _matches(path: str, patterns: list[str]) -> bool:
    normalized = path.replace("\\", "/")
    while normalized.startswith("./"):
        normalized = normalized[2:]
    if not normalized or normalized.startswith("/") or ".." in PurePosixPath(normalized).parts:
        return False
    for raw in patterns:
        pattern = str(raw).replace("\\", "/")
        while pattern.startswith("./"):
            pattern = pattern[2:]
        if pattern.endswith("/**"):
            prefix = pattern[:-3].rstrip("/")
            if normalized == prefix or normalized.startswith(prefix + "/"):
                return True
        if fnmatch.fnmatchcase(normalized, pattern):
            return True
    return False


def default_state(*, trusted_base: str = "", scope: list[str] | None = None) -> dict[str, Any]:
    return {
        "schema_version": SCHEMA_VERSION,
        "enabled": False,
        "repository_identity": "",
        "remediation_branch": "",
        "trusted_base": trusted_base,
        "allowed_path_scope": list(scope or [".agent/maintenance-mode.json", AUDIT_NAME]),
        "owner_authorization_ref": "",
        "activation_reason": "",
        "activated_at": None,
        "downgraded_guard_classes": [],
        "hard_stop_classes": sorted(HARD_STOP_CLASSES),
    }


def validate_state(value: Any) -> dict[str, Any]:
    if not isinstance(value, dict) or set(value) != REQUIRED_FIELDS:
        raise MaintenanceError("maintenance state fields are incomplete or unknown")
    if value["schema_version"] != SCHEMA_VERSION or not isinstance(value["enabled"], bool):
        raise MaintenanceError("unsupported maintenance state schema")
    if not isinstance(value["repository_identity"], str) or not isinstance(value["remediation_branch"], str):
        raise MaintenanceError("repository identity and branch must be strings")
    if not isinstance(value["trusted_base"], str) or not value["trusted_base"]:
        raise MaintenanceError("trusted_base is required")
    scopes = value["allowed_path_scope"]
    classes = value["downgraded_guard_classes"]
    hard_stops = value["hard_stop_classes"]
    if not isinstance(scopes, list) or not scopes or any(not isinstance(v, str) or not v for v in scopes):
        raise MaintenanceError("allowed_path_scope must be a non-empty string list")
    if not isinstance(classes, list) or any(v not in COOPERATIVE_CLASSES for v in classes):
        raise MaintenanceError("downgraded_guard_classes contains an unknown class")
    if not isinstance(hard_stops, list) or sorted(set(hard_stops)) != sorted(HARD_STOP_CLASSES):
        raise MaintenanceError("hard_stop_classes must match immutable canonical set")
    for name in ("owner_authorization_ref", "activation_reason"):
        if not isinstance(value[name], str):
            raise MaintenanceError(f"{name} must be a string")
    if value["enabled"] and (
        not value["repository_identity"] or not value["remediation_branch"]
        or not value["owner_authorization_ref"] or not value["activation_reason"]
    ):
        raise MaintenanceError("enabled maintenance state lacks authorization binding")
    return value


def load(root: Path) -> dict[str, Any]:
    path = root / STATE_NAME
    if not path.is_file():
        return default_state(trusted_base=_git(root, "rev-parse", "HEAD"))
    try:
        value = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise MaintenanceError(f"invalid {STATE_NAME}: {exc}") from exc
    return validate_state(value)


def binding(root: Path, value: dict[str, Any], paths: list[str]) -> None:
    if repo_identity(root) != value["repository_identity"]:
        raise MaintenanceError("maintenance repository identity mismatch")
    branch = _git(root, "symbolic-ref", "--quiet", "--short", "HEAD")
    if branch != value["remediation_branch"]:
        raise MaintenanceError("maintenance remediation branch mismatch")
    if _git(root, "rev-parse", "HEAD") != value["trusted_base"]:
        raise MaintenanceError("maintenance trusted base mismatch")
    if any(not _matches(path, value["allowed_path_scope"]) for path in paths):
        raise MaintenanceError("maintenance path is outside exact allowed scope")


def _audit(root: Path, record: dict[str, Any]) -> None:
    path = root / AUDIT_NAME
    with path.open("a", encoding="utf-8") as stream:
        stream.write(json.dumps(record, sort_keys=True, separators=(",", ":")) + "\n")


def decide(
    root: Path, *, guard_class: str, operation: str,
    paths: list[str] | tuple[str, ...] = (), effect: str | None = None,
    reason: str = "",
) -> str:
    """Return ALLOW, AUDIT, or DENY for a cooperative decision."""
    if effect in HARD_STOP_CLASSES or guard_class in HARD_STOP_CLASSES:
        return "DENY"
    if guard_class not in COOPERATIVE_CLASSES:
        return "DENY"
    value = load(root)
    if not value["enabled"] or guard_class not in value["downgraded_guard_classes"]:
        return "DENY"
    clean_paths = [str(path).replace("\\", "/") for path in paths]
    if not clean_paths:
        return "DENY"
    binding(root, value, clean_paths)
    record = {
        "schema_version": SCHEMA_VERSION,
        "timestamp": _dt.datetime.now(_dt.timezone.utc).isoformat(),
        "repository_identity": value["repository_identity"],
        "work_block_id": "WB-039",
        "remediation_branch": value["remediation_branch"],
        "trusted_base": value["trusted_base"],
        "guard_class": guard_class,
        "operation": operation,
        "paths": clean_paths,
        "reason": reason or "Owner-authorized Maintenance Bootstrap",
        "decision": "AUDIT",
        "normal_lifecycle_approval": False,
    }
    _audit(root, record)
    return "AUDIT"


def save(root: Path, value: dict[str, Any]) -> None:
    validated = validate_state(value)
    path = root / STATE_NAME
    path.parent.mkdir(parents=True, exist_ok=True)
    temp = path.with_name(path.name + ".tmp")
    temp.write_text(json.dumps(validated, indent=2, sort_keys=True) + "\n", encoding="utf-8")
    temp.replace(path)


def activate(
    root: Path, *, repository_identity: str, remediation_branch: str,
    trusted_base: str, allowed_path_scope: list[str],
    owner_authorization_ref: str, activation_reason: str,
    downgraded_guard_classes: list[str], activated_at: str,
) -> dict[str, Any]:
    value = validate_state({
        "schema_version": SCHEMA_VERSION, "enabled": True,
        "repository_identity": repository_identity,
        "remediation_branch": remediation_branch, "trusted_base": trusted_base,
        "allowed_path_scope": allowed_path_scope,
        "owner_authorization_ref": owner_authorization_ref,
        "activation_reason": activation_reason, "activated_at": activated_at,
        "downgraded_guard_classes": downgraded_guard_classes,
        "hard_stop_classes": sorted(HARD_STOP_CLASSES),
    })
    binding(root, value, [])
    save(root, value)
    return value


def deactivate(root: Path) -> dict[str, Any]:
    try:
        value = load(root)
    except MaintenanceError:
        raise
    value = dict(value)
    value["enabled"] = False
    value["activated_at"] = None
    save(root, value)
    return value
