"""Trusted persistent admission and delivery provenance registry."""

from __future__ import annotations

import json
import re
import sqlite3
from contextlib import contextmanager
from dataclasses import astuple, dataclass
from pathlib import Path

from .admission import (
    AdmissionConflict,
    AdmissionNotFound,
    AdmissionRecord,
    AdmissionValidationError,
)


_SHA_RE = re.compile(r"^[0-9a-f]{40}$")
_DELIVERY_STAGES = frozenset({
    "pr_ref",
    "merged_sha",
    "deployment_capability",
    "deployment_target",
    "deployed_sha",
    "verified_sha",
})
_SHA_DELIVERY_STAGES = frozenset({"merged_sha", "deployed_sha", "verified_sha"})
_OWNER_APPROVABLE = frozenset({
    "subject_branch_publish",
    "open_or_update_pr",
    "merge",
    "deploy_nonproduction",
    "deploy_production",
    "post_deploy_verify",
    "rollback",
})

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


def _binding_paths(value, name: str, *, nonempty: bool) -> tuple[str, ...]:
    if not isinstance(value, (tuple, list)):
        raise AdmissionValidationError(f"{name} must be a path sequence")
    items = tuple(value)
    if nonempty and not items:
        raise AdmissionValidationError(f"{name} must be non-empty")
    if any(not isinstance(item, str) or not item for item in items):
        raise AdmissionValidationError(f"{name} contains invalid path")
    if len(set(items)) != len(items):
        raise AdmissionValidationError(f"{name} contains duplicate path")
    return tuple(sorted(items))


@dataclass(frozen=True, slots=True)
class WorkBlockBinding:
    admission_id: str
    work_block_id: str
    initiative_ref: str
    planning_paths: tuple[str, ...]
    implementation_write_set: tuple[str, ...]
    coordination_scope: tuple[str, ...]
    default_branch: str
    deployment_target: str | None
    deployment_is_production: bool
    max_rework_cycles: int

    def __post_init__(self) -> None:
        for name, value in (
            ("admission_id", self.admission_id),
            ("work_block_id", self.work_block_id),
            ("initiative_ref", self.initiative_ref),
            ("default_branch", self.default_branch),
        ):
            if not isinstance(value, str) or not value:
                raise AdmissionValidationError(f"work block {name} is invalid")
        object.__setattr__(
            self,
            "planning_paths",
            _binding_paths(self.planning_paths, "planning_paths", nonempty=True),
        )
        object.__setattr__(
            self,
            "implementation_write_set",
            _binding_paths(
                self.implementation_write_set,
                "implementation_write_set",
                nonempty=True,
            ),
        )
        object.__setattr__(
            self,
            "coordination_scope",
            _binding_paths(self.coordination_scope, "coordination_scope", nonempty=False),
        )
        if self.deployment_target is not None and (
            not isinstance(self.deployment_target, str) or not self.deployment_target
        ):
            raise AdmissionValidationError("deployment_target is invalid")
        if not isinstance(self.deployment_is_production, bool):
            raise AdmissionValidationError("deployment_is_production must be boolean")
        if (
            isinstance(self.max_rework_cycles, bool)
            or not isinstance(self.max_rework_cycles, int)
            or self.max_rework_cycles < 0
        ):
            raise AdmissionValidationError("max_rework_cycles must be non-negative integer")


def _work_block_values(binding: WorkBlockBinding) -> tuple:
    return (
        binding.admission_id,
        binding.work_block_id,
        binding.initiative_ref,
        json.dumps(binding.planning_paths, separators=(",", ":")),
        json.dumps(binding.implementation_write_set, separators=(",", ":")),
        json.dumps(binding.coordination_scope, separators=(",", ":")),
        binding.default_branch,
        binding.deployment_target,
        int(binding.deployment_is_production),
        binding.max_rework_cycles,
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

    @contextmanager
    def _connection(self):
        connection = self._connect()
        try:
            with connection:
                yield connection
        finally:
            connection.close()

    def _initialize(self) -> None:
        with self._connection() as connection:
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
                CREATE TABLE IF NOT EXISTS work_block_bindings (
                    admission_id TEXT PRIMARY KEY,
                    work_block_id TEXT NOT NULL,
                    initiative_ref TEXT NOT NULL,
                    planning_paths_json TEXT NOT NULL,
                    implementation_write_set_json TEXT NOT NULL,
                    coordination_scope_json TEXT NOT NULL,
                    default_branch TEXT NOT NULL,
                    deployment_target TEXT,
                    deployment_is_production INTEGER NOT NULL,
                    max_rework_cycles INTEGER NOT NULL,
                    FOREIGN KEY(admission_id) REFERENCES admissions(admission_id)
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
            connection.execute(
                """
                CREATE TABLE IF NOT EXISTS owner_authorizations (
                    admission_id TEXT NOT NULL,
                    capability TEXT NOT NULL,
                    published_tip_sha TEXT NOT NULL,
                    PRIMARY KEY(admission_id, capability),
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
        with self._connection() as connection:
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
        with self._connection() as connection:
            row = connection.execute(
                "SELECT " + ", ".join(_COLUMNS) + " FROM admissions WHERE admission_id = ?",
                (admission_id,),
            ).fetchone()
        if row is None:
            raise AdmissionNotFound(f"unknown admission_id: {admission_id}")
        return AdmissionRecord(*row)

    def put_admission_with_work_block(
        self,
        record: AdmissionRecord,
        binding: WorkBlockBinding,
    ) -> None:
        if not isinstance(record, AdmissionRecord):
            raise AdmissionValidationError("registry accepts AdmissionRecord only")
        if not isinstance(binding, WorkBlockBinding):
            raise AdmissionValidationError("registry accepts WorkBlockBinding only")
        if binding.admission_id != record.admission_id:
            raise AdmissionValidationError(
                "Work Block binding admission_id differs from admission record"
            )

        admission_values = astuple(record)
        binding_values = _work_block_values(binding)
        with self._connection() as connection:
            current_admission = connection.execute(
                "SELECT " + ", ".join(_COLUMNS) + " FROM admissions WHERE admission_id = ?",
                (record.admission_id,),
            ).fetchone()
            if current_admission is not None and tuple(current_admission) != admission_values:
                raise AdmissionConflict(
                    "admission_id is already bound to different facts"
                )

            current_binding = connection.execute(
                """
                SELECT admission_id, work_block_id, initiative_ref,
                       planning_paths_json, implementation_write_set_json,
                       coordination_scope_json, default_branch, deployment_target,
                       deployment_is_production, max_rework_cycles
                FROM work_block_bindings
                WHERE admission_id = ?
                """,
                (record.admission_id,),
            ).fetchone()
            if current_binding is not None and tuple(current_binding) != binding_values:
                raise AdmissionConflict(
                    "admission_id is already bound to different Work Block facts"
                )

            if current_admission is None:
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
                    admission_values,
                )
            if current_binding is None:
                connection.execute(
                    """
                    INSERT INTO work_block_bindings (
                        admission_id, work_block_id, initiative_ref,
                        planning_paths_json, implementation_write_set_json,
                        coordination_scope_json, default_branch, deployment_target,
                        deployment_is_production, max_rework_cycles
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    """,
                    binding_values,
                )

    def put_work_block(self, binding: WorkBlockBinding) -> None:
        if not isinstance(binding, WorkBlockBinding):
            raise AdmissionValidationError("registry accepts WorkBlockBinding only")
        self.resolve(binding.admission_id)
        values = _work_block_values(binding)
        with self._connection() as connection:
            current = connection.execute(
                """
                SELECT admission_id, work_block_id, initiative_ref,
                       planning_paths_json, implementation_write_set_json,
                       coordination_scope_json, default_branch, deployment_target,
                       deployment_is_production, max_rework_cycles
                FROM work_block_bindings
                WHERE admission_id = ?
                """,
                (binding.admission_id,),
            ).fetchone()
            if current is not None:
                if tuple(current) != values:
                    raise AdmissionConflict(
                        "admission_id is already bound to different Work Block facts"
                    )
                return
            connection.execute(
                """
                INSERT INTO work_block_bindings (
                    admission_id, work_block_id, initiative_ref,
                    planning_paths_json, implementation_write_set_json,
                    coordination_scope_json, default_branch, deployment_target,
                    deployment_is_production, max_rework_cycles
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """,
                values,
            )

    def resolve_work_block(self, admission_id: str) -> WorkBlockBinding:
        with self._connection() as connection:
            row = connection.execute(
                """
                SELECT admission_id, work_block_id, initiative_ref,
                       planning_paths_json, implementation_write_set_json,
                       coordination_scope_json, default_branch, deployment_target,
                       deployment_is_production, max_rework_cycles
                FROM work_block_bindings
                WHERE admission_id = ?
                """,
                (admission_id,),
            ).fetchone()
        if row is None:
            raise AdmissionNotFound(
                f"Work Block binding not found for admission_id: {admission_id}"
            )
        try:
            production = row[8]
            if production not in (0, 1):
                raise AdmissionValidationError(
                    "stored deployment_is_production is invalid"
                )
            return WorkBlockBinding(
                admission_id=row[0],
                work_block_id=row[1],
                initiative_ref=row[2],
                planning_paths=tuple(json.loads(row[3])),
                implementation_write_set=tuple(json.loads(row[4])),
                coordination_scope=tuple(json.loads(row[5])),
                default_branch=row[6],
                deployment_target=row[7],
                deployment_is_production=bool(production),
                max_rework_cycles=row[9],
            )
        except (json.JSONDecodeError, TypeError, ValueError) as exc:
            raise AdmissionValidationError(
                "stored Work Block binding is malformed"
            ) from exc

    def put_publication(self, binding: PublicationBinding) -> None:
        if not isinstance(binding, PublicationBinding):
            raise AdmissionValidationError("registry accepts PublicationBinding only")
        # Require the immutable admission record to exist first.
        self.resolve(binding.admission_id)
        values = astuple(binding)
        with self._connection() as connection:
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
        with self._connection() as connection:
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
        if stage in _SHA_DELIVERY_STAGES and _SHA_RE.fullmatch(value) is None:
            raise AdmissionValidationError(
                f"{stage} delivery provenance must be exact commit SHA"
            )
        if stage == "deployment_capability" and value not in {
            "none", "deploy_nonproduction", "deploy_production"
        }:
            raise AdmissionValidationError("deployment capability provenance is invalid")
        with self._connection() as connection:
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

    def put_owner_authorization(
        self,
        admission_id: str,
        capability: str,
        published_tip_sha: str,
    ) -> None:
        self.resolve(admission_id)
        if capability not in _OWNER_APPROVABLE:
            raise AdmissionValidationError("unsupported Owner-authorized capability")
        if _SHA_RE.fullmatch(published_tip_sha) is None:
            raise AdmissionValidationError(
                "Owner authorization must bind exact published tip SHA"
            )
        with self._connection() as connection:
            current = connection.execute(
                """
                SELECT published_tip_sha FROM owner_authorizations
                WHERE admission_id = ? AND capability = ?
                """,
                (admission_id, capability),
            ).fetchone()
            if current is not None:
                if current[0] != published_tip_sha:
                    raise AdmissionConflict(
                        "Owner authorization is already bound to different published tip"
                    )
                return
            connection.execute(
                """
                INSERT INTO owner_authorizations (
                    admission_id, capability, published_tip_sha
                ) VALUES (?, ?, ?)
                """,
                (admission_id, capability, published_tip_sha),
            )

    def owner_authorized(
        self,
        admission_id: str,
        capability: str,
        published_tip_sha: str,
    ) -> bool:
        if capability not in _OWNER_APPROVABLE:
            return False
        with self._connection() as connection:
            row = connection.execute(
                """
                SELECT published_tip_sha FROM owner_authorizations
                WHERE admission_id = ? AND capability = ?
                """,
                (admission_id, capability),
            ).fetchone()
        return row is not None and row[0] == published_tip_sha

    def delivery_fact(self, admission_id: str, stage: str) -> str | None:
        if stage not in _DELIVERY_STAGES:
            raise AdmissionValidationError("unsupported delivery provenance stage")
        with self._connection() as connection:
            row = connection.execute(
                """
                SELECT value FROM delivery_facts
                WHERE admission_id = ? AND stage = ?
                """,
                (admission_id, stage),
            ).fetchone()
        return None if row is None else row[0]
