"""Post-publication authority continuation keyed by immutable admission_id."""

from __future__ import annotations

import json
import re
import subprocess
from dataclasses import dataclass
from pathlib import Path

from controllers.v1 import gitfacts

from .admission import (
    AUTONOMY_PROFILES_PATH,
    AdmissionPolicyError,
    AdmissionResolver,
    AdmissionValidationError,
)

_SHA_RE = re.compile(r"^[0-9a-f]{40}$")
DELIVERY_CAPABILITIES = frozenset({
    "subject_branch_publish",
    "open_or_update_pr",
    "merge",
    "deploy_nonproduction",
    "deploy_production",
    "post_deploy_verify",
    "rollback",
})


@dataclass(frozen=True, slots=True)
class DeliveryContext:
    admission_id: str
    repository: str
    profile_id: str
    profile_revision: str
    subject_branch: str
    base_commit: str
    source_candidate_sha: str
    published_tip_sha: str


@dataclass(frozen=True, slots=True)
class DeliveryDecision:
    status: str
    capability: str
    admission_id: str
    profile_id: str
    reason: str

    @property
    def allowed(self) -> bool:
        return self.status == "ALLOW"


def _git_show(root: Path, revision: str, path: str) -> str:
    try:
        result = subprocess.run(
            ["git", "-C", str(root), "show", f"{revision}:{path}"],
            check=True,
            capture_output=True,
            text=True,
        )
    except subprocess.CalledProcessError as exc:
        detail = exc.stderr.strip() or exc.stdout.strip() or "cannot read pinned policy"
        raise AdmissionPolicyError(detail) from exc
    return result.stdout


def _profile(root: Path, record) -> dict:
    try:
        raw = json.loads(
            _git_show(root, record.authority_profile_revision, AUTONOMY_PROFILES_PATH)
        )
    except json.JSONDecodeError as exc:
        raise AdmissionPolicyError("invalid pinned autonomy profile policy") from exc
    if not isinstance(raw, dict) or raw.get("schema_version") != 1:
        raise AdmissionPolicyError("autonomy profile policy must use schema_version 1")
    profiles = raw.get("profiles")
    if not isinstance(profiles, dict):
        raise AdmissionPolicyError("autonomy profile policy has no profiles")
    profile = profiles.get(record.authority_profile_id)
    if not isinstance(profile, dict):
        raise AdmissionPolicyError("admitted profile missing at pinned policy revision")
    capabilities = profile.get("capabilities")
    requires_owner = profile.get("requires_owner")
    if (
        not isinstance(capabilities, list)
        or any(not isinstance(item, str) for item in capabilities)
        or not isinstance(requires_owner, list)
        or any(not isinstance(item, str) for item in requires_owner)
    ):
        raise AdmissionPolicyError("admitted autonomy profile is malformed")
    return profile


def published_context(
    root: Path,
    resolver: AdmissionResolver,
    *,
    admission_id: str,
    repository_id: str,
    remote: str = "origin",
) -> DeliveryContext:
    root = gitfacts.worktree_root(root)
    record = resolver.resolve(admission_id)
    if record.repository != repository_id:
        raise AdmissionValidationError("delivery repository identity mismatch")

    resolve_publication = getattr(resolver, "resolve_publication", None)
    if resolve_publication is None:
        raise AdmissionValidationError(
            "delivery continuation requires immutable publication provenance"
        )
    binding = resolve_publication(admission_id)
    if binding.admission_id != record.admission_id:
        raise AdmissionValidationError("publication provenance admission mismatch")

    ref = f"refs/heads/{record.subject_branch}"
    published = gitfacts.remote_ref_sha(root, remote, ref)
    if published != binding.published_tip_sha:
        raise AdmissionValidationError(
            "remote subject ref differs from immutable published_tip_sha"
        )
    if _SHA_RE.fullmatch(binding.source_candidate_sha) is None:
        raise AdmissionValidationError("source candidate provenance is invalid")
    if not gitfacts.is_ancestor(root, record.base_commit, binding.source_candidate_sha):
        raise AdmissionValidationError(
            "source candidate does not descend from admitted base"
        )
    if not gitfacts.is_ancestor(
        root,
        binding.source_candidate_sha,
        binding.published_tip_sha,
    ):
        raise AdmissionValidationError(
            "published tip does not contain immutable source candidate"
        )
    _profile(root, record)
    return DeliveryContext(
        admission_id=record.admission_id,
        repository=record.repository,
        profile_id=record.authority_profile_id,
        profile_revision=record.authority_profile_revision,
        subject_branch=record.subject_branch,
        base_commit=record.base_commit,
        source_candidate_sha=binding.source_candidate_sha,
        published_tip_sha=binding.published_tip_sha,
    )

def _capability_decision(record, profile: dict, capability: str) -> DeliveryDecision:
    if capability not in DELIVERY_CAPABILITIES:
        return DeliveryDecision(
            "DENY",
            capability,
            record.admission_id,
            record.authority_profile_id,
            "unknown delivery capability",
        )
    capabilities = set(profile["capabilities"])
    requires_owner = set(profile["requires_owner"])
    if capability in capabilities:
        return DeliveryDecision(
            "ALLOW",
            capability,
            record.admission_id,
            record.authority_profile_id,
            "capability is present in pinned autonomy profile",
        )
    if capability in requires_owner:
        return DeliveryDecision(
            "OWNER_DECISION_REQUIRED",
            capability,
            record.admission_id,
            record.authority_profile_id,
            "pinned autonomy profile requires Owner decision",
        )
    return DeliveryDecision(
        "DENY",
        capability,
        record.admission_id,
        record.authority_profile_id,
        "capability is absent from pinned autonomy profile",
    )


def authorize_record(
    root: Path,
    resolver: AdmissionResolver,
    *,
    admission_id: str,
    repository_id: str,
    capability: str,
) -> DeliveryDecision:
    root = gitfacts.worktree_root(root)
    record = resolver.resolve(admission_id)
    if record.repository != repository_id:
        return DeliveryDecision(
            "DENY",
            capability,
            record.admission_id,
            record.authority_profile_id,
            "repository differs from trusted admission",
        )
    return _capability_decision(record, _profile(root, record), capability)


def authorize(
    root: Path,
    resolver: AdmissionResolver,
    context: DeliveryContext,
    capability: str,
) -> DeliveryDecision:
    root = gitfacts.worktree_root(root)
    record = resolver.resolve(context.admission_id)
    resolve_publication = getattr(resolver, "resolve_publication", None)
    if resolve_publication is None:
        return DeliveryDecision(
            "DENY",
            capability,
            context.admission_id,
            context.profile_id,
            "immutable publication provenance is unavailable",
        )
    try:
        binding = resolve_publication(context.admission_id)
    except Exception:
        return DeliveryDecision(
            "DENY",
            capability,
            context.admission_id,
            context.profile_id,
            "immutable publication provenance cannot be resolved",
        )
    expected = (
        record.repository,
        record.authority_profile_id,
        record.authority_profile_revision,
        record.subject_branch,
        record.base_commit,
        binding.source_candidate_sha,
        binding.published_tip_sha,
    )
    observed = (
        context.repository,
        context.profile_id,
        context.profile_revision,
        context.subject_branch,
        context.base_commit,
        context.source_candidate_sha,
        context.published_tip_sha,
    )
    if observed != expected:
        return DeliveryDecision(
            "DENY",
            capability,
            context.admission_id,
            context.profile_id,
            "delivery context differs from trusted admission",
        )
    if _SHA_RE.fullmatch(context.published_tip_sha) is None:
        return DeliveryDecision(
            "DENY",
            capability,
            context.admission_id,
            context.profile_id,
            "published tip is not an exact commit SHA",
        )
    ref = f"refs/heads/{record.subject_branch}"
    try:
        remote_tip = gitfacts.remote_ref_sha(root, "origin", ref)
    except Exception:
        remote_tip = None
    if remote_tip != context.published_tip_sha:
        return DeliveryDecision(
            "DENY",
            capability,
            context.admission_id,
            context.profile_id,
            "published tip differs from trusted remote subject ref",
        )
    if not gitfacts.is_ancestor(root, record.base_commit, context.source_candidate_sha):
        return DeliveryDecision(
            "DENY",
            capability,
            context.admission_id,
            context.profile_id,
            "source candidate does not descend from admitted base",
        )
    if not gitfacts.is_ancestor(
        root,
        context.source_candidate_sha,
        context.published_tip_sha,
    ):
        return DeliveryDecision(
            "DENY",
            capability,
            context.admission_id,
            context.profile_id,
            "published tip does not contain source candidate",
        )
    return _capability_decision(record, _profile(root, record), capability)
