"""Inactive-only recovery; active authority is never reconstructed."""

from __future__ import annotations

import json
from pathlib import Path
from typing import Mapping

from .atomic import atomic_write_bytes
from .canonical import canonical_json_bytes, sha256_bytes
from .errors import TransitionDenied, ValidationError

CANONICAL_INACTIVE_TEMPLATE = {
    "schema_version": 4,
    "authority_mode": "versioned_controller",
    "work_block_id": "",
    "repository_root": "",
    "subject_branch": "",
    "original_baseline": "",
    "controller_binding": None,
    "define": None,
    "define_history": [],
    "critic": None,
    "capability": None,
    "capability_history": [],
    "role_provenance": [],
    "dispatch_history": [],
    "candidate": None,
    "candidate_history": [],
    "assurance": None,
    "assurance_history": [],
    "lifecycle_status": "INACTIVE",
    "lifecycle_phase": "Inactive",
    "write_set": [],
    "write_gate": {"status": "BLOCKED", "opened_at": None},
    "terminal_authority": None,
}


def validate_canonical_inactive(template: Mapping[str, object]) -> None:
    if dict(template) != CANONICAL_INACTIVE_TEMPLATE:
        raise ValidationError("recovery requires the complete canonical inactive v1 template")


def recover_inactive(
    target: Path,
    canonical_template: Mapping[str, object],
    *,
    active_authority_known: bool,
    expected_template_identity: str,
) -> None:
    """Replace missing/corrupt state only with the supplied canonical inactive template."""
    if active_authority_known:
        raise TransitionDenied("active authority cannot be recovered or reconstructed")
    validate_canonical_inactive(canonical_template)
    payload = canonical_json_bytes(dict(canonical_template))
    if sha256_bytes(payload) != expected_template_identity:
        raise ValidationError("canonical inactive template identity mismatch")

    try:
        existing_payload = target.read_bytes()
    except FileNotFoundError:
        existing_payload = None
    except OSError as exc:
        raise ValidationError(f"authority state cannot be inspected: {exc}") from exc

    if existing_payload is not None:
        existing = parse_or_recoverable(existing_payload)
        if existing is not None:
            if existing.get("work_block_id") not in {"", None}:
                raise TransitionDenied("existing authority names a Work Block; recovery is forbidden")
            if existing.get("lifecycle_status") == "ACTIVE":
                raise TransitionDenied("existing authority is active; recovery is forbidden")
            try:
                validate_canonical_inactive(existing)
            except ValidationError:
                pass
            else:
                if existing_payload == payload:
                    return
                raise TransitionDenied(
                    "valid inactive authority differs from the admitted template; recovery cannot rebind it"
                )
    atomic_write_bytes(target, payload)


def parse_or_recoverable(payload: bytes) -> dict | None:
    try:
        state = json.loads(payload)
    except (UnicodeDecodeError, json.JSONDecodeError):
        return None
    if not isinstance(state, dict):
        return None
    return state
