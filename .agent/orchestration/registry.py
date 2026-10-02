"""Trusted persistent admission and delivery provenance registry."""

from __future__ import annotations

import re
import sqlite3
from dataclasses import astuple, dataclass
from pathlib import Path

from .admission import (
    AdmissionConflict,
    AdmissionNotFound,
    AdmissionRecord,
    AdmissionValidationError,
)


_SHA_RE = re.compile(r"^[0-9a-f]{40}$")
_DELIVERY_STAGES = frozenset({"pr_ref", "merged_sha", "deployed_sha", "verified_sha"})

_COLUMNS = (
    "admission_id",
    "repository",
    "trigger_class",
    "authority_profile_id",
    "authority_profile_revision",
    "base_ref",
    "base_commit",
    "subject_branch",
)


@dataclass(frozen=True, slots=True)
class PublicationBinding:
    admission_id: str
    source_candidate_sha: str
    published_tip_sha: str

    def __post_init__(self) -> None:
        if not isinstance(self.admission_id, str) or not self.admission_id:
            raise AdmissionValidationError("publication admission_id is invalid")
        for name, value in (
            ("source_candidate_sha", self.source_candidate_sha),
            ("published_tip_sha", self.published_tip_sha),
        ):
            if not isinstance(value, str) or _SHA_RE.fullmatch(value) is None:
                raise AdmissionValidationError(f"{name} must be exact commit SHA")


class SQLiteAdmissionRegistry:
    """Immutable external admission/provenance registry backed by SQLite.

    The database is deliberately outside controller state. Admission records,
    publication bindings, and stage facts are append-only/idempotent: the same key
    may be written again only with identical facts.
    """

    def __init__(self, path: Path) -> None:
        self.path = Path(path).resolve()
        self.path.parent.mkdir(parents=True, exist_ok=True)
        self._initialize()

    def _connect(self) -> sqlite3.Connection:
        connection = sqlite3.connect(self.path)
        connection.execute("PRAGMA foreign_keys = ON")
        return connection

    def _initialize(self) -> None:
        with self._connect() as connection:
            connection.execute(
                """
                CREATE TABLE IF NOT EXISTS admissions (
                    admission_id TEXT PRIMARY KEY,
                    repository TEXT NOT NULL,
                    trigger_class TEXT NOT NULL,
                    authority_profile_id TEXT NOT NULL,
                    authority_profile_revision TEXT NOT NULL,
                    base_ref TEXT NOT NULL,
                    base_commit TEXT NOT NULL,
                    subject_branch TEXT NOT NULL
                )
                """
            )
            connection.execute(
                """
                CREATE TABLE IF NOT EXISTS publication_bindings (
                    admission_id TEXT PRIMARY KEY,
                    source_candidate_sha TEXT NOT NULL,
                    published_tip_sha TEXT NOT NULL,
                    FOREIGN KEY(admission_id) REFERENCES admissions(admission_id)
                )
                """
            )
            connection.execute(
                """
                CREATE TABLE IF NOT EXISTS delivery_facts (
                    admission_id TEXT NOT NULL,
                    stage TEXT NOT NULL,
                    value TEXT NOT NULL,
                    PRIMARY KEY(admission_id, stage),
                    FOREIGN KEY(admission_id) REFERENCES admissions(admission_id)
                )
                """
            )

    def assert_external_to(self, repo_root: Path) -> None:
        root = Path(repo_root).resolve(strict=True)
        try:
            self.path.relative_to(root)
        except ValueError:
            return
        raise AdmissionValidationError(
            "trusted admission registry must be outside subject repository"
        )

    def put(self, record: AdmissionRecord) -> None:
        if not isinstance(record, AdmissionRecord):
            raise AdmissionValidationError("registry accepts AdmissionRecord only")
        values = astuple(record)
        with self._connect() as connection:
            current = connection.execute(
                "SELECT " + ", ".join(_COLUMNS) + " FROM admissions WHERE admission_id = ?",
                (record.admission_id,),
            ).fetchone()
            if current is not None:
                if tuple(current) != values:
                    raise AdmissionConflict(
                        "admission_id is already bound to different facts"
                    )
                return
            connection.execute(
                """
                INSERT INTO admissions (
                    admission_id,
                    repository,
                    trigger_class,
                    authority_profile_id,
                    authority_profile_revision,
                    base_ref,
                    base_commit,
                    subject_branch
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                """,
                values,
            )

    def resolve(self, admission_id: str) -> AdmissionRecord:
        with self._connect() as connection:
            row = connection.execute(
                "SELECT " + ", ".join(_COLUMNS) + " FROM admissions WHERE admission_id = ?",
                (admission_id,),
            ).fetchone()
        if row is None:
            raise AdmissionNotFound(f"unknown admission_id: {admission_id}")
        return AdmissionRecord(*row)

    def put_publication(self, binding: PublicationBinding) -> None:
        if not isinstance(binding, PublicationBinding):
            raise AdmissionValidationError("registry accepts PublicationBinding only")
        # Require the immutable admission record to exist first.
        self.resolve(binding.admission_id)
        values = astuple(binding)
        with self._connect() as connection:
            current = connection.execute(
                """
                SELECT admission_id, source_candidate_sha, published_tip_sha
                FROM publication_bindings
                WHERE admission_id = ?
                """,
                (binding.admission_id,),
            ).fetchone()
            if current is not None:
                if tuple(current) != values:
                    raise AdmissionConflict(
                        "admission_id is already bound to different publication provenance"
                    )
                return
            connection.execute(
                """
                INSERT INTO publication_bindings (
                    admission_id, source_candidate_sha, published_tip_sha
                ) VALUES (?, ?, ?)
                """,
                values,
            )

    def resolve_publication(self, admission_id: str) -> PublicationBinding:
        with self._connect() as connection:
            row = connection.execute(
                """
                SELECT admission_id, source_candidate_sha, published_tip_sha
                FROM publication_bindings
                WHERE admission_id = ?
                """,
                (admission_id,),
            ).fetchone()
        if row is None:
            raise AdmissionNotFound(
                f"publication binding not found for admission_id: {admission_id}"
            )
        return PublicationBinding(*row)

    def publication_or_none(self, admission_id: str) -> PublicationBinding | None:
        try:
            return self.resolve_publication(admission_id)
        except AdmissionNotFound:
            return None

    def put_delivery_fact(self, admission_id: str, stage: str, value: str) -> None:
        self.resolve(admission_id)
        if stage not in _DELIVERY_STAGES:
            raise AdmissionValidationError("unsupported delivery provenance stage")
        if not isinstance(value, str) or not value:
            raise AdmissionValidationError("delivery provenance value is invalid")
        if stage != "pr_ref" and _SHA_RE.fullmatch(value) is None:
            raise AdmissionValidationError(
                f"{stage} delivery provenance must be exact commit SHA"
            )
        with self._connect() as connection:
            current = connection.execute(
                """
                SELECT value FROM delivery_facts
                WHERE admission_id = ? AND stage = ?
                """,
                (admission_id, stage),
            ).fetchone()
            if current is not None:
                if current[0] != value:
                    raise AdmissionConflict(
                        f"delivery provenance stage {stage} already has different value"
                    )
                return
            connection.execute(
                """
                INSERT INTO delivery_facts (admission_id, stage, value)
                VALUES (?, ?, ?)
                """,
                (admission_id, stage, value),
            )

    def delivery_fact(self, admission_id: str, stage: str) -> str | None:
        if stage not in _DELIVERY_STAGES:
            raise AdmissionValidationError("unsupported delivery provenance stage")
        with self._connect() as connection:
            row = connection.execute(
                """
                SELECT value FROM delivery_facts
                WHERE admission_id = ? AND stage = ?
                """,
                (admission_id, stage),
            ).fetchone()
        return None if row is None else row[0]
