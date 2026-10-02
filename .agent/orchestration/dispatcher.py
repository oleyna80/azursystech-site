"""Trusted event dispatcher that creates immutable admissions before planning."""

from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
from typing import Mapping

from . import admission


@dataclass(frozen=True, slots=True)
class DispatchRequest:
    repository: str
    trigger_class: str
    subject_branch: str
    policy_revision: str
    admission_id: str | None = None


class TrustedDispatcher:
    """Map a trusted external event to the pinned WB-0 admission contract.

    Profile selection is not accepted from the request. The protected
    admission-rules policy selects the exact profile for the trusted trigger class.
    """

    _FIELDS = frozenset(
        {"repository", "trigger_class", "subject_branch", "policy_revision", "admission_id"}
    )

    def __init__(self, store: admission.AdmissionStore) -> None:
        self.store = store

    @classmethod
    def parse_request(cls, raw: Mapping[str, object]) -> DispatchRequest:
        if not isinstance(raw, Mapping):
            raise admission.AdmissionValidationError("dispatch request must be object")
        unknown = set(raw) - cls._FIELDS
        if unknown:
            raise admission.AdmissionValidationError(
                "dispatch request contains unsupported authority fields"
            )
        required = {"repository", "trigger_class", "subject_branch", "policy_revision"}
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
            policy_revision=raw["policy_revision"],
            admission_id=admission_id,
        )

    def admit(self, repo_root: Path, request: DispatchRequest) -> admission.AdmissionRecord:
        if not isinstance(request, DispatchRequest):
            raise admission.AdmissionValidationError("trusted dispatcher requires DispatchRequest")
        return admission.create_admission(
            repo_root=repo_root,
            repository=request.repository,
            trigger_class=request.trigger_class,
            subject_branch=request.subject_branch,
            policy_revision=request.policy_revision,
            store=self.store,
            admission_id=request.admission_id,
        )
