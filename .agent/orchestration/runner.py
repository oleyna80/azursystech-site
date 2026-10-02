"""Autonomous orchestration runner over the WB-0/WB-1/WB-2 contracts."""

from __future__ import annotations

import re
import subprocess
from dataclasses import dataclass
from pathlib import Path
from typing import Protocol

from controllers.v1 import cli, gitfacts

from . import delivery
from .dispatcher import DispatchRequest, TrustedDispatcher
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
    def run(self, role: str, context: RoleContext) -> RoleResult:
        """Execute one logical role. Write-capable roles commit their own changes."""


class DeliveryExecutor(Protocol):
    def execute(
        self,
        capability: str,
        context: delivery.DeliveryContext,
        *,
        input_value: str | None = None,
        target: str | None = None,
    ) -> str:
        """Execute one platform action after authority has already been granted."""


_SHA_RE = re.compile(r"^[0-9a-f]{40}$")
_ROLE_OUTCOMES = {
    "planner": {"DONE", "OWNER_DECISION_REQUIRED"},
    "critic": {"READY", "BLOCKED", "OWNER_DECISION_REQUIRED"},
    "coder": {"DONE", "OWNER_DECISION_REQUIRED"},
    "reviewer": {"READY", "REWORK", "SCOPE_CHANGE", "OWNER_DECISION_REQUIRED"},
    "verifier": {
        "READY",
        "REWORK",
        "SCOPE_CHANGE",
        "EVIDENCE_PROBLEM",
        "OWNER_DECISION_REQUIRED",
    },
    "closeout": {"DONE", "OWNER_DECISION_REQUIRED"},
}


class Orchestrator:
    def __init__(
        self,
        dispatcher: TrustedDispatcher,
        roles: RoleExecutor,
        *,
        delivery_executor: DeliveryExecutor | None = None,
        scheduler: WriterScheduler | None = None,
    ) -> None:
        self.dispatcher = dispatcher
        self.roles = roles
        self.delivery_executor = delivery_executor
        self.scheduler = scheduler or WriterScheduler()

    def _role(
        self,
        role: str,
        root: Path,
        admission_id: str,
        spec: WorkBlockSpec,
        *,
        reason: str | None = None,
    ) -> RoleResult:
        context = RoleContext(
            root=root,
            admission_id=admission_id,
            work_block=spec,
            controller_state=cli.status(root),
            reason=reason,
        )
        try:
            result = self.roles.run(role, context)
        except RoleUnavailable as exc:
            raise OrchestrationBlocked(
                f"required independent {role} role is unavailable"
            ) from exc
        if not isinstance(result, RoleResult) or result.role != role:
            raise OrchestrationBlocked(
                f"{role} gate cannot be satisfied by another logical role"
            )
        if result.outcome not in _ROLE_OUTCOMES[role]:
            raise OrchestrationBlocked(f"{role} returned unsupported outcome")
        if result.outcome == "OWNER_DECISION_REQUIRED":
            raise _OwnerBoundary(
                result.required_capability or "owner_decision",
                result.reason or f"{role} requires an Owner decision",
            )
        return result

    def _plan(
        self,
        root: Path,
        admission_id: str,
        spec: WorkBlockSpec,
        *,
        reason: str | None = None,
    ) -> None:
        result = self._role("planner", root, admission_id, spec, reason=reason)
        if result.outcome != "DONE":
            raise OrchestrationBlocked("planner did not complete")
        gitfacts.require_clean(root)

    def _critic_until_ready(
        self,
        root: Path,
        admission_id: str,
        spec: WorkBlockSpec,
        cycles: list[int],
    ) -> None:
        while True:
            result = self._role("critic", root, admission_id, spec)
            if result.outcome == "READY":
                cli.critic(root, "ready")
                return
            cli.critic(root, "blocked")
            cycles[0] += 1
            self._limit(spec, cycles[0])
            self._plan(root, admission_id, spec, reason="critic-blocked")
            cli.revise_bind(
                root,
                planning_paths=list(spec.planning_paths),
                implementation_write_set=list(spec.implementation_write_set),
                coordination_scope=list(spec.coordination_scope),
            )

    def _code_candidate(
        self,
        root: Path,
        admission_id: str,
        spec: WorkBlockSpec,
    ) -> None:
        lease = self.scheduler.acquire(
            f"{admission_id}:{spec.work_block_id}:coder",
            spec.implementation_write_set,
        )
        try:
            result = self._role("coder", root, admission_id, spec)
            if result.outcome != "DONE":
                raise OrchestrationBlocked("Coder did not complete implementation")
            gitfacts.require_clean(root)
            cli.candidate(root)
        finally:
            self.scheduler.release(lease)

    @staticmethod
    def _limit(spec: WorkBlockSpec, cycles: int) -> None:
        if cycles > spec.max_rework_cycles:
            raise OrchestrationBlocked("maximum autonomous rework cycles exceeded")

    def _assure(
        self,
        root: Path,
        admission_id: str,
        spec: WorkBlockSpec,
        cycles: list[int],
    ) -> None:
        while True:
            reviewer = self._role("reviewer", root, admission_id, spec)
            if reviewer.outcome == "READY":
                cli.reviewer(root, "ready")
            elif reviewer.outcome == "REWORK":
                cli.reviewer(root, "rework")
                cycles[0] += 1
                self._limit(spec, cycles[0])
                self._code_candidate(root, admission_id, spec)
                continue
            else:
                cli.reviewer(root, "scope-change")
                cycles[0] += 1
                self._limit(spec, cycles[0])
                self._plan(root, admission_id, spec, reason="reviewer-scope-change")
                cli.revise_bind(
                    root,
                    planning_paths=list(spec.planning_paths),
                    implementation_write_set=list(spec.implementation_write_set),
                    coordination_scope=list(spec.coordination_scope),
                )
                self._critic_until_ready(root, admission_id, spec, cycles)
                self._code_candidate(root, admission_id, spec)
                continue

            while True:
                verifier = self._role("verifier", root, admission_id, spec)
                if verifier.outcome == "READY":
                    cli.verifier(root, "ready")
                    return
                if verifier.outcome == "EVIDENCE_PROBLEM":
                    cli.verifier(root, "evidence-problem")
                    cycles[0] += 1
                    self._limit(spec, cycles[0])
                    continue
                if verifier.outcome == "REWORK":
                    cli.verifier(root, "rework")
                    cycles[0] += 1
                    self._limit(spec, cycles[0])
                    self._code_candidate(root, admission_id, spec)
                    break

                cli.verifier(root, "scope-change")
                cycles[0] += 1
                self._limit(spec, cycles[0])
                self._plan(root, admission_id, spec, reason="verifier-scope-change")
                cli.revise_bind(
                    root,
                    planning_paths=list(spec.planning_paths),
                    implementation_write_set=list(spec.implementation_write_set),
                    coordination_scope=list(spec.coordination_scope),
                )
                self._critic_until_ready(root, admission_id, spec, cycles)
                self._code_candidate(root, admission_id, spec)
                break

    @staticmethod
    def _require_sha(value: str, label: str) -> str:
        if not isinstance(value, str) or _SHA_RE.fullmatch(value) is None:
            raise OrchestrationBlocked(f"{label} did not return exact commit SHA")
        return value

    @staticmethod
    def _owner_required(
        context: delivery.DeliveryContext,
        decision: delivery.DeliveryDecision,
        *,
        merged_sha: str | None = None,
    ) -> RunResult:
        if decision.status == "DENY":
            raise OrchestrationBlocked(
                f"{decision.capability} denied: {decision.reason}"
            )
        if decision.status != "OWNER_DECISION_REQUIRED":
            raise OrchestrationBlocked("unexpected delivery authority decision")
        return RunResult(
            status="OWNER_DECISION_REQUIRED",
            admission_id=context.admission_id,
            published_tip_sha=context.published_tip_sha,
            merged_sha=merged_sha,
            required_capability=decision.capability,
            reason=decision.reason,
        )

    def _execute_delivery(
        self,
        root: Path,
        context: delivery.DeliveryContext,
        spec: WorkBlockSpec,
    ) -> RunResult:
        if self.delivery_executor is None:
            return RunResult(
                status="OWNER_DECISION_REQUIRED",
                admission_id=context.admission_id,
                published_tip_sha=context.published_tip_sha,
                required_capability="open_or_update_pr",
                reason="no trusted delivery executor is configured",
            )

        pr_auth = delivery.authorize(
            root, self.dispatcher.store, context, "open_or_update_pr"
        )
        if not pr_auth.allowed:
            return self._owner_required(context, pr_auth)
        pr_ref = self.delivery_executor.execute(
            "open_or_update_pr",
            context,
            input_value=context.published_tip_sha,
        )
        if not isinstance(pr_ref, str) or not pr_ref:
            raise OrchestrationBlocked("PR executor returned invalid reference")

        merge_auth = delivery.authorize(root, self.dispatcher.store, context, "merge")
        if not merge_auth.allowed:
            return self._owner_required(context, merge_auth)
        merged_sha = self._require_sha(
            self.delivery_executor.execute("merge", context, input_value=pr_ref),
            "merge executor",
        )

        if spec.deployment_target is None:
            return RunResult(
                status="COMPLETE",
                admission_id=context.admission_id,
                published_tip_sha=context.published_tip_sha,
                merged_sha=merged_sha,
            )

        capability = (
            "deploy_production"
            if spec.deployment_is_production
            else "deploy_nonproduction"
        )
        deploy_auth = delivery.authorize(
            root, self.dispatcher.store, context, capability
        )
        if not deploy_auth.allowed:
            return self._owner_required(
                context,
                deploy_auth,
                merged_sha=merged_sha,
            )
        try:
            deployed_sha = self._require_sha(
                self.delivery_executor.execute(
                    capability,
                    context,
                    input_value=merged_sha,
                    target=spec.deployment_target,
                ),
                "deployment executor",
            )
        except DeliveryExecutionError as exc:
            rollback = delivery.authorize(
                root, self.dispatcher.store, context, "rollback"
            )
            if not rollback.allowed:
                result = self._owner_required(
                    context,
                    rollback,
                    merged_sha=merged_sha,
                )
                return RunResult(
                    status=result.status,
                    admission_id=result.admission_id,
                    published_tip_sha=result.published_tip_sha,
                    merged_sha=result.merged_sha,
                    required_capability=result.required_capability,
                    reason=str(exc),
                )
            self.delivery_executor.execute(
                "rollback",
                context,
                input_value=merged_sha,
                target=spec.deployment_target,
            )
            return RunResult(
                status="BLOCKED",
                admission_id=context.admission_id,
                published_tip_sha=context.published_tip_sha,
                merged_sha=merged_sha,
                reason=f"deployment failed and admitted rollback executed: {exc}",
            )

        verify_auth = delivery.authorize(
            root, self.dispatcher.store, context, "post_deploy_verify"
        )
        if verify_auth.allowed:
            verified_sha = self._require_sha(
                self.delivery_executor.execute(
                    "post_deploy_verify",
                    context,
                    input_value=deployed_sha,
                    target=spec.deployment_target,
                ),
                "post-deploy verifier",
            )
            if verified_sha != deployed_sha:
                raise OrchestrationBlocked(
                    "post-deploy verification returned different deployed SHA"
                )
        return RunResult(
            status="COMPLETE",
            admission_id=context.admission_id,
            published_tip_sha=context.published_tip_sha,
            merged_sha=merged_sha,
            deployed_sha=deployed_sha,
        )

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
        if publish_auth.status == "DENY":
            raise OrchestrationBlocked(
                f"subject_branch_publish denied: {publish_auth.reason}"
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
