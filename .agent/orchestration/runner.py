"""Autonomous orchestration runner over the WB-0/WB-1/WB-2 contracts."""

from __future__ import annotations

import subprocess
from dataclasses import dataclass
from pathlib import Path
from typing import Protocol

from controllers.v1 import cli, gitfacts

from .dispatcher import DispatchRequest, TrustedDispatcher
from . import delivery
from .scheduler import WriterScheduler


class RoleUnavailable(Exception):
    """A required logical role cannot be dispatched independently."""


class OrchestrationBlocked(Exception):
    """Normal autonomous progression cannot continue inside the admitted envelope."""


class DeliveryExecutionError(Exception):
    """Simulated/external delivery operation failed after authority was granted."""


class _OwnerBoundary(Exception):
    def __init__(self, required_capability: str, reason: str) -> None:
        super().__init__(reason)
        self.required_capability = required_capability
        self.reason = reason


@dataclass(frozen=True, slots=True)
class WorkBlockSpec:
    work_block_id: str
    initiative_ref: str
    planning_paths: tuple[str, ...]
    implementation_write_set: tuple[str, ...]
    coordination_scope: tuple[str, ...]
    default_branch: str = "main"
    deployment_target: str | None = None
    deployment_is_production: bool = False
    max_rework_cycles: int = 8


@dataclass(frozen=True, slots=True)
class RoleContext:
    root: Path
    admission_id: str
    work_block: WorkBlockSpec
    controller_state: dict | None
    reason: str | None = None


@dataclass(frozen=True, slots=True)
class RoleResult:
    role: str
    outcome: str
    reason: str | None = None
    required_capability: str | None = None


@dataclass(frozen=True, slots=True)
class RunResult:
    status: str
    admission_id: str
    published_tip_sha: str | None = None
    merged_sha: str | None = None
    deployed_sha: str | None = None
    required_capability: str | None = None
    reason: str | None = None


class RoleExecutor(Protocol):
    def run(
        self,
        repo_root: Path,
        request: DispatchRequest,
        spec: WorkBlockSpec,
        *,
        branch_protection_resolver,
    ) -> RunResult:
        root = gitfacts.worktree_root(repo_root)
        record = self.dispatcher.admit(root, request)
        subprocess.run(
            ["git", "-C", str(root), "switch", "-q", record.subject_branch],
            check=True,
        )

        try:
            self._plan(root, record.admission_id, spec)
            cli.open_with_resolver(
                root,
                self.dispatcher.store,
                repository_id=record.repository,
                admission_id=record.admission_id,
                work_block_id=spec.work_block_id,
                initiative_ref=spec.initiative_ref,
                planning_paths=list(spec.planning_paths),
                implementation_write_set=list(spec.implementation_write_set),
                coordination_scope=list(spec.coordination_scope),
                default_branch=spec.default_branch,
            )

            cycles = [0]
            self._critic_until_ready(root, record.admission_id, spec, cycles)
            self._code_candidate(root, record.admission_id, spec)
            self._assure(root, record.admission_id, spec, cycles)

            closeout = self._role("closeout", root, record.admission_id, spec)
            if closeout.outcome != "DONE":
                raise OrchestrationBlocked("closeout coordination did not complete")
            gitfacts.require_clean(root)
        except _OwnerBoundary as boundary:
            return RunResult(
                status="OWNER_DECISION_REQUIRED",
                admission_id=record.admission_id,
                required_capability=boundary.required_capability,
                reason=boundary.reason,
            )

        publish_auth = delivery.authorize_record(
            root,
            self.dispatcher.store,
            admission_id=record.admission_id,
            repository_id=record.repository,
            capability="subject_branch_publish",
        )
        if not publish_auth.allowed:
            return RunResult(
                status="OWNER_DECISION_REQUIRED",
                admission_id=record.admission_id,
                required_capability="subject_branch_publish",
                reason=publish_auth.reason,
            )

        cli.publish(
            root,
            branch_protection_resolver=branch_protection_resolver,
        )
        context = delivery.published_context(
            root,
            self.dispatcher.store,
            admission_id=record.admission_id,
            repository_id=record.repository,
        )
        return self._execute_delivery(root, context, spec)
