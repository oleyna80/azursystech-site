"""Immutable controller-generation binding for future Work Block admission."""

from __future__ import annotations

import json
import hashlib
import re
from dataclasses import dataclass
from pathlib import Path
from typing import Mapping

from .canonical import sha256_bytes
from .errors import TransitionDenied, ValidationError
from .package import runtime_package_identity

COMMIT_IDENTITY = re.compile(r"[0-9a-f]{40}")
SHA256_IDENTITY = re.compile(r"sha256:[0-9a-f]{64}")
PACKAGE_IDENTITY = re.compile(r"sealed-surface-sha256-v1:[0-9a-f]{64}")


def _required_string(value: object, label: str) -> str:
    if not isinstance(value, str) or not value:
        raise ValidationError(f"{label} must be a non-empty string")
    return value


def _required_identity(value: object, label: str, pattern: re.Pattern[str]) -> str:
    identity = _required_string(value, label)
    if not pattern.fullmatch(identity):
        raise ValidationError(f"{label} has an invalid identity format")
    return identity


@dataclass(frozen=True)
class ControllerBinding:
    generation: str
    source_commit: str
    package_identity: str
    policy_identity: str
    activation_record: str
    manifest_identity: str

    def as_dict(self) -> dict[str, str]:
        return {
            "generation": self.generation,
            "source_commit": self.source_commit,
            "package_identity": self.package_identity,
            "policy_identity": self.policy_identity,
            "activation_record": self.activation_record,
            "manifest_identity": self.manifest_identity,
        }


def read_manifest(path: Path) -> dict:
    try:
        payload = path.read_bytes()
        value = json.loads(payload)
    except (OSError, json.JSONDecodeError) as exc:
        raise ValidationError(f"controller manifest cannot be read: {exc}") from exc
    if not isinstance(value, dict):
        raise ValidationError("controller manifest must be an object")
    return value


def manifest_file_identity(path: Path) -> str:
    """Bind the exact live manifest bytes, not only parsed JSON semantics."""
    try:
        payload = path.read_bytes()
    except OSError as exc:
        raise ValidationError(f"controller manifest cannot be read: {exc}") from exc
    return f"sha256:{hashlib.sha256(payload).hexdigest()}"


def binding_from_manifest(
    manifest: Mapping[str, object],
    *,
    source_commit: str,
    activation_record: str,
    manifest_identity: str,
) -> ControllerBinding:
    if manifest.get("schema") != "azursystech-controller-manifest-v1":
        raise ValidationError("unsupported controller manifest schema")
    if manifest.get("active_generation") != "v1":
        raise ValidationError("manifest does not activate controller generation v1")
    generation = manifest.get("generations", {}).get("v1") if isinstance(manifest.get("generations"), dict) else None
    if not isinstance(generation, dict):
        raise ValidationError("v1 generation record is missing")
    if generation.get("parent_generation") != "legacy":
        raise ValidationError("v1 parent generation must be legacy")
    exact_manifest_identity = _required_identity(
        manifest_identity, "controller manifest identity", SHA256_IDENTITY
    )
    return ControllerBinding(
        generation="v1",
        source_commit=_required_identity(
            source_commit, "controller source commit", COMMIT_IDENTITY
        ),
        package_identity=_required_identity(
            generation.get("package_identity"),
            "controller package identity",
            PACKAGE_IDENTITY,
        ),
        policy_identity=_required_identity(
            generation.get("policy_identity"), "controller policy identity", SHA256_IDENTITY
        ),
        activation_record=_required_identity(
            activation_record, "controller activation record", SHA256_IDENTITY
        ),
        manifest_identity=exact_manifest_identity,
    )


def bind_for_admission(
    manifest: Mapping[str, object],
    *,
    source_commit: str,
    activation_record: str,
    manifest_identity: str,
) -> dict[str, str]:
    """Persist the complete tuple, including the exact live manifest bytes."""
    return binding_from_manifest(
        manifest,
        source_commit=source_commit,
        activation_record=activation_record,
        manifest_identity=manifest_identity,
    ).as_dict()


def verify_live_package(root: Path) -> tuple[dict, str, str]:
    """Verify manifest-selected v1 package and policy bytes before admission."""
    manifest_path = root / ".agent/controller-manifest.json"
    manifest = read_manifest(manifest_path)
    if manifest.get("schema") != "azursystech-controller-manifest-v1":
        raise ValidationError("unsupported controller manifest schema")
    if manifest.get("active_generation") != "v1":
        raise TransitionDenied("live manifest does not select controller generation v1")
    generation = manifest.get("generations", {}).get("v1") if isinstance(manifest.get("generations"), dict) else None
    if not isinstance(generation, dict) or generation.get("parent_generation") != "legacy":
        raise ValidationError("live v1 generation record is invalid")
    package_identity = runtime_package_identity(root)
    if package_identity != generation.get("package_identity"):
        raise TransitionDenied("live controller package differs from the manifest identity")
    try:
        policy_bytes = (root / ".agent/controllers/v1/policy-metadata.json").read_bytes()
    except OSError as exc:
        raise ValidationError(f"controller policy metadata cannot be read: {exc}") from exc
    policy_identity = sha256_bytes(policy_bytes)
    if policy_identity != generation.get("policy_identity"):
        raise TransitionDenied("live controller policy differs from the manifest identity")
    return manifest, package_identity, policy_identity


def verify_live_binding(root: Path, state: Mapping[str, object]) -> ControllerBinding:
    """Verify that live v1 bytes still equal the tuple pinned at admission."""
    actual = state.get("controller_binding")
    if not isinstance(actual, dict):
        raise TransitionDenied("active Work Block controller binding is missing")
    manifest_path = root / ".agent/controller-manifest.json"
    manifest, package_identity, policy_identity = verify_live_package(root)
    expected = binding_from_manifest(
        manifest,
        source_commit=_required_string(actual.get("source_commit"), "bound source commit"),
        activation_record=_required_string(actual.get("activation_record"), "bound activation record"),
        manifest_identity=manifest_file_identity(manifest_path),
    )
    require_bound_generation(state, expected)
    if package_identity != expected.package_identity:
        raise TransitionDenied("live controller package differs from the admitted identity")
    if policy_identity != expected.policy_identity:
        raise TransitionDenied("live controller policy differs from the admitted identity")
    return expected


def require_bound_generation(state: Mapping[str, object], expected: ControllerBinding) -> None:
    actual = state.get("controller_binding")
    if not isinstance(actual, dict) or actual != expected.as_dict():
        raise TransitionDenied("active Work Block controller binding is not the admitted immutable tuple")


def reject_generation_switch(state: Mapping[str, object], proposed: Mapping[str, object]) -> None:
    current = state.get("controller_binding")
    if current != proposed:
        raise TransitionDenied("an active Work Block cannot switch controller generation")
