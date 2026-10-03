"""Trusted event dispatcher that creates immutable admissions before planning."""

from __future__ import annotations

import re
import subprocess
from dataclasses import dataclass
from pathlib import Path
from typing import Callable, Mapping, Protocol

from . import admission


_SHA_RE = re.compile(r"^[0-9a-f]{40}$")


@dataclass(frozen=True, slots=True)
class DispatchRequest:
    repository: str
    trigger_class: str
    subject_branch: str
    admission_id: str | None = None


class PolicyRevisionResolver(Protocol):
    def resolve(self, repo_root: Path) -> str:
        """Return exact trusted policy commit SHA for this repository."""


@dataclass(frozen=True, slots=True)
class GitPolicyRevisionResolver:
    """Resolve policy from a configured trusted Git ref, never caller input."""

    trusted_ref: str = "refs/remotes/origin/main"

    def resolve(self, repo_root: Path) -> str:
        root = Path(repo_root).resolve(strict=True)
        try:
            result = subprocess.run(
                [
                    "git",
                    "-C",
                    str(root),
                    "rev-parse",
                    "--verify",
                    f"{self.trusted_ref}^{{commit}}",
                ],
                check=True,
                capture_output=True,
                text=True,
            )
        except subprocess.CalledProcessError as exc:
            detail = exc.stderr.strip() or exc.stdout.strip() or "trusted policy ref unavailable"
            raise admission.AdmissionGitError(detail) from exc
        revision = result.stdout.strip()
        if _SHA_RE.fullmatch(revision) is None:
            raise admission.AdmissionGitError("trusted policy resolver returned invalid SHA")
        return revision


class TrustedDispatcher:
    """Map a trusted external event to the pinned WB-0 admission contract.

    Profile/policy revision selection is not accepted from the request. The
    configured trusted policy resolver pins the exact policy commit, then WB-0
    admission rules select the exact profile for the trusted trigger class.
    """

    _FIELDS = frozenset(
        {"repository", "trigger_class", "subject_branch", "admission_id"}
    )

    def __init__(
        self,
        store: admission.AdmissionStore,
        *,
        allowed_trigger_classes: frozenset[str] | set[str] | None = None,
        policy_revision_resolver: PolicyRevisionResolver | None = None,
    ) -> None:
        self.store = store
        allowed = (
            frozenset({"manual-owner"})
            if allowed_trigger_classes is None
            else frozenset(allowed_trigger_classes)
        )
        if not allowed or any(
            not isinstance(item, str) or not item for item in allowed
        ):
            raise admission.AdmissionValidationError(
                "trusted dispatcher trigger envelope is invalid"
            )
        self.allowed_trigger_classes = allowed
        self.policy_revision_resolver = (
            policy_revision_resolver or GitPolicyRevisionResolver()
        )

    @classmethod
    def parse_request(cls, raw: Mapping[str, object]) -> DispatchRequest:
        if not isinstance(raw, Mapping):
            raise admission.AdmissionValidationError("dispatch request must be object")
        unknown = set(raw) - cls._FIELDS
        if unknown:
            raise admission.AdmissionValidationError(
                "dispatch request contains unsupported authority fields"
            )
        required = {"repository", "trigger_class", "subject_branch"}
        if not required.issubset(raw):
            raise admission.AdmissionValidationError("dispatch request is incomplete")
        for field in required:
            if not isinstance(raw[field], str) or not raw[field]:
                raise admission.AdmissionValidationError(
                    f"dispatch request field {field} must be non-empty string"
                )
        admission_id = raw.get("admission_id")
        if admission_id is not None and (
            not isinstance(admission_id, str) or not admission_id
        ):
            raise admission.AdmissionValidationError("invalid admission_id")
        return DispatchRequest(
            repository=raw["repository"],
            trigger_class=raw["trigger_class"],
            subject_branch=raw["subject_branch"],
            admission_id=admission_id,
        )

    def _admit_with_store(
        self,
        repo_root: Path,
        request: DispatchRequest,
        store,
    ) -> admission.AdmissionRecord:
        if not isinstance(request, DispatchRequest):
            raise admission.AdmissionValidationError("trusted dispatcher requires DispatchRequest")
        if request.trigger_class not in self.allowed_trigger_classes:
            raise admission.AdmissionPolicyError(
                "trigger class is not enabled by this trusted dispatcher"
            )
        external_guard = getattr(self.store, "assert_external_to", None)
        if external_guard is not None:
            external_guard(repo_root)
        policy_revision = self.policy_revision_resolver.resolve(repo_root)
        return admission.create_admission(
            repo_root=repo_root,
            repository=request.repository,
            trigger_class=request.trigger_class,
            subject_branch=request.subject_branch,
            policy_revision=policy_revision,
            store=store,
            admission_id=request.admission_id,
        )

    def admit(self, repo_root: Path, request: DispatchRequest) -> admission.AdmissionRecord:
        return self._admit_with_store(repo_root, request, self.store)

    def admit_with_work_block(
        self,
        repo_root: Path,
        request: DispatchRequest,
        binding_factory: Callable[[str], object],
    ) -> admission.AdmissionRecord:
        atomic_put = getattr(self.store, "put_admission_with_work_block", None)
        if atomic_put is None:
            raise admission.AdmissionValidationError(
                "trusted orchestration store lacks atomic admission binding"
            )
        if not callable(binding_factory):
            raise admission.AdmissionValidationError(
                "Work Block binding factory must be callable"
            )

        base_store = self.store

        class AtomicStore:
            def put(self, record: admission.AdmissionRecord) -> None:
                binding = binding_factory(record.admission_id)
                atomic_put(record, binding)

            def resolve(self, admission_id: str) -> admission.AdmissionRecord:
                return base_store.resolve(admission_id)

        return self._admit_with_store(repo_root, request, AtomicStore())
