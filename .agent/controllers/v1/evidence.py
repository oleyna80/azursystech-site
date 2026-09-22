"""Separation of immutable provenance, capability freshness, and identity freshness."""

from __future__ import annotations

import copy
import datetime as dt
from collections.abc import Mapping

from .clock import Clock, parse_utc, utc_now
from .errors import TransitionDenied, ValidationError

CAPABILITY_TTL = dt.timedelta(hours=24)
FUTURE_SKEW = dt.timedelta(minutes=5)
ROLES = {"critic", "reviewer", "verifier"}


def _nonempty(value: object, label: str) -> str:
    if not isinstance(value, str) or not value.strip():
        raise ValidationError(f"{label} must be a non-empty string")
    return value


def validate_role_provenance(
    binding: Mapping[str, object],
    *,
    expected_work_block_id: str,
    expected_define_identity: str,
    expected_candidate_attempt: str | None = None,
    expected_root: str | None = None,
    expected_branch: str | None = None,
    clock: Clock = utc_now,
) -> None:
    """Validate completed evidence without applying a wall-clock expiry."""
    role = _nonempty(binding.get("role"), "role binding role")
    if role not in ROLES:
        raise ValidationError("role binding role is invalid")
    if binding.get("work_block_id") != expected_work_block_id:
        raise ValidationError("role binding Work Block mismatch")
    if binding.get("define_identity") != expected_define_identity:
        raise ValidationError("role binding Define identity mismatch")
    if role in {"reviewer", "verifier"}:
        if not expected_candidate_attempt or binding.get("candidate_attempt_id") != expected_candidate_attempt:
            raise ValidationError("role binding candidate attempt mismatch")
    for key in (
        "execution_id",
        "context_id",
        "context_id_source",
        "repository_root",
        "branch",
        "runtime",
        "adapter",
        "adapter_version",
        "report",
        "report_identity",
        "result",
        "observed_at",
    ):
        _nonempty(binding.get(key), f"role binding {key}")
    report_identity = str(binding["report_identity"])
    digest = report_identity.removeprefix("sha256:")
    if (
        not report_identity.startswith("sha256:")
        or len(digest) != 64
        or any(character not in "0123456789abcdef" for character in digest)
    ):
        raise ValidationError("role binding report identity must be sha256:<64-hex>")
    if expected_root is not None and binding.get("repository_root") != expected_root:
        raise ValidationError("role binding repository root mismatch")
    if expected_branch is not None and binding.get("branch") != expected_branch:
        raise ValidationError("role binding branch mismatch")
    observed = parse_utc(binding["observed_at"], "role binding observed_at")
    if observed > clock() + FUTURE_SKEW:
        raise ValidationError("role binding timestamp is in the future")


def require_fresh_capability(
    capability: Mapping[str, object],
    *,
    expected_work_block_id: str,
    expected_root: str,
    clock: Clock = utc_now,
) -> None:
    if capability.get("status") != "available":
        raise TransitionDenied("native capability is unavailable")
    if capability.get("work_block_id") != expected_work_block_id:
        raise TransitionDenied("capability Work Block mismatch")
    if capability.get("repository_root") != expected_root:
        raise TransitionDenied("capability repository root mismatch")
    for key in (
        "execution_id",
        "context_id",
        "context_id_source",
        "runtime",
        "adapter",
        "adapter_version",
        "evidence_identity",
        "verified_at",
    ):
        _nonempty(capability.get(key), f"capability {key}")
    evidence_identity = str(capability["evidence_identity"])
    digest = evidence_identity.removeprefix("sha256:")
    if (
        not evidence_identity.startswith("sha256:")
        or len(digest) != 64
        or any(character not in "0123456789abcdef" for character in digest)
    ):
        raise ValidationError("capability evidence identity must be sha256:<64-hex>")
    verified = parse_utc(capability["verified_at"], "capability verified_at")
    current = clock()
    if verified > current + FUTURE_SKEW:
        raise TransitionDenied("capability timestamp is in the future")
    if current - verified > CAPABILITY_TTL:
        raise TransitionDenied("capability evidence is stale")


def refreshed_capability_state(state: Mapping[str, object], new_capability: Mapping[str, object]) -> dict:
    """Return a replacement preserving all authority except capability evidence."""
    updated = copy.deepcopy(dict(state))
    history = updated.setdefault("capability_history", [])
    if not isinstance(history, list):
        raise ValidationError("capability_history must be an array")
    prior = updated.get("capability")
    if prior is not None:
        history.append(copy.deepcopy(prior))
    updated["capability"] = copy.deepcopy(dict(new_capability))
    return updated
