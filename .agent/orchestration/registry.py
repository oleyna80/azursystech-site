"""Trusted persistent admission registry for orchestration and delivery continuation."""

from __future__ import annotations

import sqlite3
from dataclasses import astuple
from pathlib import Path

from .admission import (
    AdmissionConflict,
    AdmissionNotFound,
    AdmissionRecord,
    AdmissionValidationError,
)


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


class SQLiteAdmissionRegistry:
    """Immutable external admission registry backed by SQLite.

    The database is deliberately outside controller state. It can live on a trusted
    orchestration host and remains available after the local Work Block returns to
    INACTIVE.
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
