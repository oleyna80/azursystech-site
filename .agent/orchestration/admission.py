"""Minimal trusted admission contract used before Work Block planning/open.

This module is intentionally inert: it does not schedule agents, mutate controller
state, publish refs, merge, deploy, or grant authority beyond creating/resolving a
validated admission record.
"""

from __future__ import annotations

import json
import re
import subprocess
import uuid
from dataclasses import dataclass
from pathlib import Path, PurePosixPath
from typing import Protocol, runtime_checkable

AUTONOMY_PROFILES_PATH = ".agent/policies/autonomy-profiles.json"
ADMISSION_RULES_PATH = ".agent/policies/admission-rules.json"
PROTECTED_POLICY_PREFIX = ".agent/policies/"

_SHA_RE = re.compile(r"^[0-9a-f]{40}$")
_TOKEN_RE = re.compile(r"^[A-Za-z0-9][A-Za-z0-9._-]{0,127}$")
_ADMISSION_ID_RE = re.compile(r"^adm-[A-Za-z0-9][A-Za-z0-9._-]{7,123}$")


class AdmissionError(Exception):
    """Base error for admission contract failures."""


class AdmissionValidationError(AdmissionError):
    """Admission data is malformed or violates the contract."""


class AdmissionPolicyError(AdmissionError):
    """Pinned policy cannot authorize the requested admission."""


class AdmissionGitError(AdmissionError):
    """Required Git facts cannot be resolved deterministically."""


class AdmissionNotFound(AdmissionError):
    """Admission record is not present in the selected store."""


class AdmissionConflict(AdmissionError):
    """An immutable admission identifier was reused for different facts."""


class AdmissionMismatch(AdmissionError):
    """Controller-facing facts do not match the trusted admission record."""


@dataclass(frozen=True, slots=True)
class AdmissionRecord:
    """Opaque correlation record pinned before subject-branch planning begins."""

    admission_id: str
    repository: str
    trigger_class: str
    authority_profile_id: str
    authority_profile_revision: str
    base_ref: str
    base_commit: str
    subject_branch: str

    def __post_init__(self) -> None:
        _validate_token("admission_id", self.admission_id, admission=True)
        _validate_text("repository", self.repository, 256)
        _validate_token("trigger_class", self.trigger_class)
        _validate_token("authority_profile_id", self.authority_profile_id)
        _validate_sha("authority_profile_revision", self.authority_profile_revision)
        _validate_text("base_ref", self.base_ref, 256)
        _validate_sha("base_commit", self.base_commit)
        _validate_text("subject_branch", self.subject_branch, 256)


@runtime_checkable
class AdmissionResolver(Protocol):
    def resolve(self, admission_id: str) -> AdmissionRecord:
        """Return the immutable record for admission_id or raise AdmissionNotFound."""


@runtime_checkable
class AdmissionStore(AdmissionResolver, Protocol):
    def put(self, record: AdmissionRecord) -> None:
        """Persist record immutably; same-id different facts must fail."""


class InMemoryAdmissionStore:
    """Inert/local store for WB-0 tests and disposable-repository E2E."""

    def __init__(self) -> None:
        self._records: dict[str, AdmissionRecord] = {}

    def put(self, record: AdmissionRecord) -> None:
        existing = self._records.get(record.admission_id)
        if existing is not None and existing != record:
            raise AdmissionConflict("admission_id is already bound to different facts")
        self._records[record.admission_id] = record

    def resolve(self, admission_id: str) -> AdmissionRecord:
        _validate_token("admission_id", admission_id, admission=True)
        try:
            return self._records[admission_id]
        except KeyError as exc:
            raise AdmissionNotFound(f"unknown admission_id: {admission_id}") from exc


def is_protected_policy_path(path: str) -> bool:
    """Return True for the governance surface ordinary Work Blocks cannot own."""

    normalized = _normalize_repo_path(path)
    return normalized == PROTECTED_POLICY_PREFIX.rstrip("/") or normalized.startswith(
        PROTECTED_POLICY_PREFIX
    )


def create_admission(
    *,
    repo_root: Path,
    repository: str,
    trigger_class: str,
    subject_branch: str,
    policy_revision: str,
    store: AdmissionStore,
    requested_profile: str | None = None,
    admission_id: str | None = None,
) -> AdmissionRecord:
    """Create and store one inert trusted admission record.

    Policy is read from the exact policy_revision. The configured base ref is
    resolved to an exact commit before the subject branch is created/verified.
    Existing subject branches must still point exactly at that base commit because
    admission occurs before planning begins.
    """

    root = repo_root.resolve(strict=True)
    _verify_repo_root(root)
    policy_sha = _resolve_commit(root, policy_revision)
    profiles = _load_json_at_revision(root, policy_sha, AUTONOMY_PROFILES_PATH)
    rules = _load_json_at_revision(root, policy_sha, ADMISSION_RULES_PATH)

    profile_id, base_ref = _resolve_rule(
        profiles=profiles,
        rules=rules,
        trigger_class=trigger_class,
        requested_profile=requested_profile,
    )
    base_commit = _resolve_commit(root, base_ref)
    _ensure_subject_branch_at_base(root, subject_branch, base_commit)

    record = AdmissionRecord(
        admission_id=admission_id or f"adm-{uuid.uuid4().hex}",
        repository=repository,
        trigger_class=trigger_class,
        authority_profile_id=profile_id,
        authority_profile_revision=policy_sha,
        base_ref=base_ref,
        base_commit=base_commit,
        subject_branch=subject_branch,
    )
    store.put(record)
    return record


def validate_binding(
    resolver: AdmissionResolver,
    *,
    admission_id: str,
    repository: str,
    subject_branch: str,
    authority_profile_id: str,
    authority_profile_revision: str,
    base_commit: str,
) -> AdmissionRecord:
    """Resolve admission_id and require exact controller-facing binding facts."""

    record = resolver.resolve(admission_id)
    expected = {
        "repository": repository,
        "subject_branch": subject_branch,
        "authority_profile_id": authority_profile_id,
        "authority_profile_revision": authority_profile_revision,
        "base_commit": base_commit,
    }
    for field, value in expected.items():
        if getattr(record, field) != value:
            raise AdmissionMismatch(f"{field} differs from trusted admission record")
    return record


def _resolve_rule(
    *, profiles: object, rules: object, trigger_class: str, requested_profile: str | None
) -> tuple[str, str]:
    if not isinstance(profiles, dict) or profiles.get("schema_version") != 1:
        raise AdmissionPolicyError("autonomy profile policy must use schema_version 1")
    profile_map = profiles.get("profiles")
    if not isinstance(profile_map, dict) or not profile_map:
        raise AdmissionPolicyError("autonomy profile policy has no profiles")

    if not isinstance(rules, dict) or rules.get("schema_version") != 1:
        raise AdmissionPolicyError("admission rule policy must use schema_version 1")
    trigger_map = rules.get("triggers")
    if not isinstance(trigger_map, dict):
        raise AdmissionPolicyError("admission rule policy has no triggers")
    rule = trigger_map.get(trigger_class)
    if not isinstance(rule, dict):
        raise AdmissionPolicyError(f"trigger class is not admitted: {trigger_class}")

    max_profile = rule.get("max_profile")
    base_ref = rule.get("base_ref")
    if not isinstance(max_profile, str) or max_profile not in profile_map:
        raise AdmissionPolicyError("trigger rule references unknown max_profile")
    if not isinstance(base_ref, str) or not base_ref:
        raise AdmissionPolicyError("trigger rule has invalid base_ref")

    selected = requested_profile or max_profile
    if selected != max_profile:
        raise AdmissionPolicyError("requested profile exceeds trigger admission rule")
    if selected not in profile_map:
        raise AdmissionPolicyError("requested profile does not exist")
    return selected, base_ref


def _load_json_at_revision(root: Path, revision: str, path: str) -> object:
    raw = _git(root, "show", f"{revision}:{path}")
    try:
        return json.loads(raw)
    except json.JSONDecodeError as exc:
        raise AdmissionPolicyError(f"invalid JSON at {path}@{revision}") from exc


def _ensure_subject_branch_at_base(root: Path, branch: str, base_commit: str) -> None:
    try:
        _git(root, "check-ref-format", "--branch", branch)
    except AdmissionGitError as exc:
        raise AdmissionValidationError("invalid subject branch") from exc

    ref = f"refs/heads/{branch}"
    if _git_ok(root, "show-ref", "--verify", "--quiet", ref):
        current = _resolve_commit(root, ref)
        if current != base_commit:
            raise AdmissionMismatch(
                "existing subject branch does not point at admitted base_commit"
            )
        return
    _git(root, "branch", branch, base_commit)


def _verify_repo_root(root: Path) -> None:
    try:
        top = Path(_git(root, "rev-parse", "--show-toplevel")).resolve(strict=True)
        bare = _git(root, "rev-parse", "--is-bare-repository")
    except (OSError, AdmissionGitError) as exc:
        raise AdmissionGitError("repo_root is not a usable Git worktree") from exc
    if top != root or bare != "false":
        raise AdmissionGitError("repo_root must be the exact non-bare worktree root")


def _resolve_commit(root: Path, revision: str) -> str:
    result = _git(root, "rev-parse", "--verify", f"{revision}^{{commit}}")
    _validate_sha("git commit", result)
    return result


def _git(root: Path, *args: str) -> str:
    try:
        result = subprocess.run(
            ["git", "-C", str(root), *args],
            check=True,
            capture_output=True,
            text=True,
        )
    except subprocess.CalledProcessError as exc:
        detail = exc.stderr.strip() or exc.stdout.strip() or "git command failed"
        raise AdmissionGitError(detail) from exc
    return result.stdout.strip()


def _git_ok(root: Path, *args: str) -> bool:
    result = subprocess.run(
        ["git", "-C", str(root), *args],
        check=False,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
        text=True,
    )
    return result.returncode == 0


def _validate_sha(name: str, value: str) -> None:
    if not isinstance(value, str) or _SHA_RE.fullmatch(value) is None:
        raise AdmissionValidationError(f"{name} must be a full lowercase Git SHA")


def _validate_token(name: str, value: str, *, admission: bool = False) -> None:
    regex = _ADMISSION_ID_RE if admission else _TOKEN_RE
    if not isinstance(value, str) or regex.fullmatch(value) is None:
        raise AdmissionValidationError(f"invalid {name}")


def _validate_text(name: str, value: str, limit: int) -> None:
    if not isinstance(value, str) or not value or len(value) > limit or "\x00" in value:
        raise AdmissionValidationError(f"invalid {name}")


def _normalize_repo_path(path: str) -> str:
    if not isinstance(path, str) or not path or "\\" in path or path.startswith("/"):
        raise AdmissionValidationError("invalid repository-relative path")
    parts = PurePosixPath(path).parts
    if not parts or any(part in {".", "..", ""} for part in parts):
        raise AdmissionValidationError("invalid repository-relative path")
    return "/".join(parts)
