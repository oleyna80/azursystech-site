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
    ref = f"refs/heads/{record.subject_branch}"
    published = gitfacts.remote_ref_sha(root, remote, ref)
    if published is None or _SHA_RE.fullmatch(published) is None:
        raise AdmissionValidationError("published subject ref is unavailable")
    if not gitfacts.is_ancestor(root, record.base_commit, published):
        raise AdmissionValidationError("published tip does not descend from admitted base")
    _profile(root, record)
    return DeliveryContext(
        admission_id=record.admission_id,
        repository=record.repository,
        profile_id=record.authority_profile_id,
        profile_revision=record.authority_profile_revision,
        subject_branch=record.subject_branch,
        base_commit=record.base_commit,
        published_tip_sha=published,
    )


def authorize(
    root: Path,
    resolver: AdmissionResolver,
    context: DeliveryContext,
    capability: str,
) -> DeliveryDecision:
    if capability not in DELIVERY_CAPABILITIES:
        return DeliveryDecision(
            "DENY",
            capability,
            context.admission_id,
            context.profile_id,
            "unknown delivery capability",
        )
    record = resolver.resolve(context.admission_id)
    expected = (
        record.repository,
        record.authority_profile_id,
        record.authority_profile_revision,
        record.subject_branch,
        record.base_commit,
    )
    observed = (
        context.repository,
        context.profile_id,
        context.profile_revision,
        context.subject_branch,
        context.base_commit,
    )
    if observed != expected:
        return DeliveryDecision(
            "DENY",
            capability,
            context.admission_id,
            context.profile_id,
            "delivery context differs from trusted admission",
        )
    profile = _profile(gitfacts.worktree_root(root), record)
    capabilities = set(profile["capabilities"])
    requires_owner = set(profile["requires_owner"])
    if capability in capabilities:
        return DeliveryDecision(
            "ALLOW",
            capability,
            context.admission_id,
            context.profile_id,
            "capability is present in pinned autonomy profile",
        )
    reason = (
        "pinned autonomy profile requires Owner decision"
        if capability in requires_owner
        else "capability is absent from pinned autonomy profile"
    )
    return DeliveryDecision(
        "OWNER_DECISION_REQUIRED",
        capability,
        context.admission_id,
        context.profile_id,
        reason,
    )
