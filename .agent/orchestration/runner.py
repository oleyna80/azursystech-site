"""Autonomous orchestration runner over the WB-0/WB-1/WB-2 contracts."""

from __future__ import annotations

import re
import subprocess
from dataclasses import dataclass
from pathlib import Path
from typing import Protocol

from controllers.v1 import cli, gitfacts, policy

from . import delivery
from .dispatcher import DispatchRequest, TrustedDispatcher
from .external_access import ExternalImportBroker, ExternalReadView
from .registry import PublicationBinding, WorkBlockBinding
from .scheduler import WriterScheduler


class RoleUnavailable(Exception):
    """A required logical role cannot be dispatched independently."""


class OrchestrationBlocked(Exception):
    """Normal autonomous progression cannot continue inside the admitted envelope."""


class DeliveryExecutionError(Exception):
    """External delivery operation failed after authority was granted."""


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
    external_access: ExternalImportBroker | ExternalReadView | None = None
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
        """Execute one logical role.

        Write-capable roles commit their own changes. A role may be rerun after a
        crash when no durable controller/provenance transition recorded its result,
        so role implementations must be restart-safe/idempotent.
        """


class OwnerAuthorizationResolver(Protocol):
    def approved(
        self,
        admission_id: str,
        capability: str,
        published_tip_sha: str,
    ) -> bool:
        """Return explicit trusted Owner approval for one exact-tip capability."""


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
        external_access: ExternalImportBroker | None = None,
        owner_authorization_resolver: OwnerAuthorizationResolver | None = None,
    ) -> None:
        self.dispatcher = dispatcher
        self.roles = roles
        self.delivery_executor = delivery_executor
        self.scheduler = scheduler or WriterScheduler()
        self.external_access = external_access
        self.owner_authorization_resolver = owner_authorization_resolver

    def _bound_root(self, repo_root: Path) -> Path:
        root = gitfacts.worktree_root(repo_root)
        if (
            self.external_access is not None
            and self.external_access.repo_root != root
        ):
            raise OrchestrationBlocked(
                "external access broker is bound to a different worktree"
            )
        return root

    def _role(
        self,
        role: str,
        root: Path,
        admission_id: str,
        spec: WorkBlockSpec,
        *,
        reason: str | None = None,
    ) -> RoleResult:
        role_external_access = None
        if self.external_access is not None:
            role_external_access = (
                self.external_access
                if role == "coder"
                else self.external_access.read_view()
            )
        context = RoleContext(
            root=root,
            admission_id=admission_id,
            work_block=spec,
            controller_state=cli.status(root),
            external_access=role_external_access,
            reason=reason,
        )
        assurance_role = role in {"critic", "reviewer", "verifier"}
        before_head = None
        if assurance_role:
            gitfacts.require_clean(root)
            before_head = gitfacts.head_sha(root)
        try:
            result = self.roles.run(role, context)
        except RoleUnavailable as exc:
            if assurance_role:
                gitfacts.require_clean(root)
                if gitfacts.head_sha(root) != before_head:
                    raise OrchestrationBlocked(
                        f"{role} mutated Git history before becoming unavailable"
                    ) from exc
            raise OrchestrationBlocked(
                f"required independent {role} role is unavailable"
            ) from exc
        if assurance_role:
            gitfacts.require_clean(root)
            if gitfacts.head_sha(root) != before_head:
                raise OrchestrationBlocked(
                    f"{role} must not mutate Git history or worktree"
                )
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

    def _assure_from_state(
        self,
        root: Path,
        admission_id: str,
        spec: WorkBlockSpec,
        cycles: list[int],
    ) -> None:
        """Reach Reviewer+Verifier READY without fabricating lost role outcomes."""

        while True:
            current = cli.status(root)
            if current is None:
                raise OrchestrationBlocked("assurance continuation lost controller state")
            lifecycle = current["lifecycle_state"]

            if lifecycle == "DEFINE":
                self._critic_until_ready(root, admission_id, spec, cycles)
                continue
            if lifecycle == "EXECUTE":
                self._code_candidate(root, admission_id, spec)
                continue
            if lifecycle != "ASSURE":
                raise OrchestrationBlocked(
                    f"assurance continuation cannot run from {lifecycle}"
                )

            active = current["active"]
            reviewer_status = active["reviewer"]["status"]
            verifier_status = active["verifier"]["status"]

            if reviewer_status == "PENDING":
                reviewer = self._role("reviewer", root, admission_id, spec)
                if reviewer.outcome == "READY":
                    cli.reviewer(root, "ready")
                    continue
                if reviewer.outcome == "REWORK":
                    cli.reviewer(root, "rework")
                    cycles[0] += 1
                    self._limit(spec, cycles[0])
                    continue
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
                continue

            if reviewer_status != "READY":
                raise OrchestrationBlocked("unexpected Reviewer durable status")

            if verifier_status == "READY":
                return
            if verifier_status != "PENDING":
                raise OrchestrationBlocked("unexpected Verifier durable status")

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
                continue

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

    @staticmethod
    def _require_sha(value: str, label: str) -> str:
        if not isinstance(value, str) or _SHA_RE.fullmatch(value) is None:
            raise OrchestrationBlocked(f"{label} did not return exact commit SHA")
        return value

    @staticmethod
    def _work_block_binding(admission_id: str, spec: WorkBlockSpec) -> WorkBlockBinding:
        return WorkBlockBinding(
            admission_id=admission_id,
            work_block_id=spec.work_block_id,
            initiative_ref=spec.initiative_ref,
            planning_paths=spec.planning_paths,
            implementation_write_set=spec.implementation_write_set,
            coordination_scope=spec.coordination_scope,
            default_branch=spec.default_branch,
            deployment_target=spec.deployment_target,
            deployment_is_production=spec.deployment_is_production,
            max_rework_cycles=spec.max_rework_cycles,
        )

    def _ensure_work_block_binding(
        self,
        admission_id: str,
        spec: WorkBlockSpec,
        *,
        create: bool,
    ) -> WorkBlockBinding:
        expected = self._work_block_binding(admission_id, spec)
        put_method = getattr(self.dispatcher.store, "put_work_block", None)
        resolve_method = getattr(self.dispatcher.store, "resolve_work_block", None)
        if resolve_method is None or (create and put_method is None):
            raise OrchestrationBlocked(
                "orchestration store lacks immutable Work Block binding"
            )
        try:
            if create:
                put_method(expected)
            actual = resolve_method(admission_id)
        except Exception as exc:
            raise OrchestrationBlocked(
                f"cannot validate immutable Work Block binding: {exc}"
            ) from exc
        if actual != expected:
            raise OrchestrationBlocked(
                "resume Work Block specification differs from immutable binding"
            )
        return actual

    def _publication_or_none(self, admission_id: str) -> PublicationBinding | None:
        method = getattr(self.dispatcher.store, "publication_or_none", None)
        if method is None:
            raise OrchestrationBlocked(
                "orchestration store lacks immutable publication provenance"
            )
        return method(admission_id)

    def _put_publication(self, binding: PublicationBinding) -> None:
        method = getattr(self.dispatcher.store, "put_publication", None)
        if method is None:
            raise OrchestrationBlocked(
                "orchestration store lacks immutable publication provenance"
            )
        try:
            method(binding)
        except Exception as exc:
            raise OrchestrationBlocked(
                f"cannot persist immutable publication provenance: {exc}"
            ) from exc

    def _owner_authorized(
        self,
        admission_id: str,
        capability: str,
        published_tip_sha: str,
    ) -> bool:
        method = getattr(self.dispatcher.store, "owner_authorized", None)
        if method is None:
            raise OrchestrationBlocked(
                "orchestration store lacks Owner authorization provenance"
            )
        if bool(method(admission_id, capability, published_tip_sha)):
            return True
        if self.owner_authorization_resolver is None:
            return False
        approved = self.owner_authorization_resolver.approved(
            admission_id,
            capability,
            published_tip_sha,
        )
        if not isinstance(approved, bool):
            raise OrchestrationBlocked(
                "Owner authorization resolver returned unknown status"
            )
        if not approved:
            return False
        self._put_owner_authorization(
            admission_id,
            capability,
            published_tip_sha,
        )
        return True

    def _put_owner_authorization(
        self,
        admission_id: str,
        capability: str,
        published_tip_sha: str,
    ) -> None:
        method = getattr(self.dispatcher.store, "put_owner_authorization", None)
        if method is None:
            raise OrchestrationBlocked(
                "orchestration store lacks Owner authorization provenance"
            )
        try:
            method(admission_id, capability, published_tip_sha)
        except Exception as exc:
            raise OrchestrationBlocked(
                f"cannot persist Owner authorization for {capability}: {exc}"
            ) from exc

    def _decision_allowed_by_owner(
        self,
        context: delivery.DeliveryContext,
        decision: delivery.DeliveryDecision,
    ) -> bool:
        if decision.allowed:
            return True
        if decision.status != "OWNER_DECISION_REQUIRED":
            return False
        return self._owner_authorized(
            context.admission_id,
            decision.capability,
            context.published_tip_sha,
        )

    def _delivery_fact(self, admission_id: str, stage: str) -> str | None:
        method = getattr(self.dispatcher.store, "delivery_fact", None)
        if method is None:
            raise OrchestrationBlocked(
                "orchestration store lacks delivery continuation provenance"
            )
        return method(admission_id, stage)

    def _put_delivery_fact(self, admission_id: str, stage: str, value: str) -> None:
        method = getattr(self.dispatcher.store, "put_delivery_fact", None)
        if method is None:
            raise OrchestrationBlocked(
                "orchestration store lacks delivery continuation provenance"
            )
        try:
            method(admission_id, stage, value)
        except Exception as exc:
            raise OrchestrationBlocked(
                f"cannot persist delivery provenance stage {stage}: {exc}"
            ) from exc

    def _validate_active_binding(self, current: dict, record, spec: WorkBlockSpec) -> None:
        if current["lifecycle_state"] == "INACTIVE":
            return
        active = current["active"]
        expected = {
            "work_block_id": spec.work_block_id,
            "initiative_ref": spec.initiative_ref,
            "admission_id": record.admission_id,
            "subject_branch": record.subject_branch,
            "base_commit": record.base_commit,
        }
        for field, value in expected.items():
            if active[field] != value:
                raise OrchestrationBlocked(
                    f"resume {field} differs from durable controller state"
                )
        profile = active["authority_profile"]
        if (
            profile["id"] != record.authority_profile_id
            or profile["revision"] != record.authority_profile_revision
        ):
            raise OrchestrationBlocked(
                "resume authority profile differs from trusted admission"
            )
        if tuple(sorted(active["planning_subject"]["paths"])) != tuple(
            sorted(spec.planning_paths)
        ):
            raise OrchestrationBlocked("resume planning paths differ from durable state")
        if tuple(sorted(active["implementation_write_set"])) != tuple(
            sorted(spec.implementation_write_set)
        ):
            raise OrchestrationBlocked(
                "resume implementation scope differs from durable state"
            )
        if tuple(sorted(active["coordination_scope"])) != tuple(
            sorted(spec.coordination_scope)
        ):
            raise OrchestrationBlocked(
                "resume coordination scope differs from durable state"
            )

    def _prepare_publication(
        self,
        root: Path,
        record,
        spec: WorkBlockSpec,
    ) -> PublicationBinding:
        existing = self._publication_or_none(record.admission_id)
        if existing is not None:
            return existing

        current = cli.status(root)
        if current is None or current["lifecycle_state"] != "ASSURE":
            raise OrchestrationBlocked("publication preparation requires ASSURE")
        active = current["active"]
        candidate = active["source_candidate_sha"]
        expected_ready = {"status": "READY", "candidate_sha": candidate}
        if (
            candidate is None
            or active["reviewer"] != expected_ready
            or active["verifier"] != expected_ready
        ):
            raise OrchestrationBlocked(
                "publication preparation requires exact candidate assurance"
            )

        head = gitfacts.head_sha(root)
        if head == candidate:
            closeout = self._role("closeout", root, record.admission_id, spec)
            if closeout.outcome != "DONE":
                raise OrchestrationBlocked("closeout coordination did not complete")
            gitfacts.require_clean(root)
            head = gitfacts.head_sha(root)

        # Bind provenance only after the exact candidate-to-tip history is already
        # valid for publication. This avoids permanently pinning a failed closeout.
        if not policy.post_candidate_history_allowed(root, current, head):
            raise OrchestrationBlocked(
                "post-candidate history is not valid closeout coordination"
            )

        binding = PublicationBinding(
            admission_id=record.admission_id,
            source_candidate_sha=candidate,
            published_tip_sha=head,
        )
        self._put_publication(binding)
        return binding

    def _bind_delivery_spec(
        self,
        context: delivery.DeliveryContext,
        spec: WorkBlockSpec,
    ) -> str:
        capability = (
            "none"
            if spec.deployment_target is None
            else (
                "deploy_production"
                if spec.deployment_is_production
                else "deploy_nonproduction"
            )
        )
        target = spec.deployment_target or "<none>"
        self._put_delivery_fact(
            context.admission_id,
            "deployment_capability",
            capability,
        )
        self._put_delivery_fact(
            context.admission_id,
            "deployment_target",
            target,
        )
        return capability

    @staticmethod
    def _owner_required(
        context: delivery.DeliveryContext,
        decision: delivery.DeliveryDecision,
        *,
        merged_sha: str | None = None,
        deployed_sha: str | None = None,
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
            deployed_sha=deployed_sha,
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
                status="BLOCKED",
                admission_id=context.admission_id,
                published_tip_sha=context.published_tip_sha,
                reason="no trusted delivery executor is configured",
            )

        deployment_capability = self._bind_delivery_spec(context, spec)

        pr_ref = self._delivery_fact(context.admission_id, "pr_ref")
        if pr_ref is None:
            pr_auth = delivery.authorize(
                root, self.dispatcher.store, context, "open_or_update_pr"
            )
            if not self._decision_allowed_by_owner(context, pr_auth):
                return self._owner_required(context, pr_auth)
            pr_ref = self.delivery_executor.execute(
                "open_or_update_pr",
                context,
                input_value=context.published_tip_sha,
            )
            if not isinstance(pr_ref, str) or not pr_ref:
                raise OrchestrationBlocked("PR executor returned invalid reference")
            self._put_delivery_fact(context.admission_id, "pr_ref", pr_ref)

        merged_sha = self._delivery_fact(context.admission_id, "merged_sha")
        if merged_sha is None:
            merge_auth = delivery.authorize(
                root, self.dispatcher.store, context, "merge"
            )
            if not self._decision_allowed_by_owner(context, merge_auth):
                return self._owner_required(context, merge_auth)
            merged_sha = self._require_sha(
                self.delivery_executor.execute(
                    "merge",
                    context,
                    input_value=pr_ref,
                ),
                "merge executor",
            )
            self._put_delivery_fact(
                context.admission_id,
                "merged_sha",
                merged_sha,
            )

        if deployment_capability == "none":
            return RunResult(
                status="COMPLETE",
                admission_id=context.admission_id,
                published_tip_sha=context.published_tip_sha,
                merged_sha=merged_sha,
            )

        deployed_sha = self._delivery_fact(context.admission_id, "deployed_sha")
        if deployed_sha is None:
            deploy_auth = delivery.authorize(
                root,
                self.dispatcher.store,
                context,
                deployment_capability,
            )
            if not self._decision_allowed_by_owner(context, deploy_auth):
                return self._owner_required(
                    context,
                    deploy_auth,
                    merged_sha=merged_sha,
                )
            try:
                deployed_sha = self._require_sha(
                    self.delivery_executor.execute(
                        deployment_capability,
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
                if not self._decision_allowed_by_owner(context, rollback):
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
                    reason=(
                        "deployment failed and admitted rollback executed: "
                        f"{exc}"
                    ),
                )
            self._put_delivery_fact(
                context.admission_id,
                "deployed_sha",
                deployed_sha,
            )

        verified_sha = self._delivery_fact(context.admission_id, "verified_sha")
        if verified_sha is None:
            verify_auth = delivery.authorize(
                root,
                self.dispatcher.store,
                context,
                "post_deploy_verify",
            )
            if not self._decision_allowed_by_owner(context, verify_auth):
                return self._owner_required(
                    context,
                    verify_auth,
                    merged_sha=merged_sha,
                    deployed_sha=deployed_sha,
                )
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
            self._put_delivery_fact(
                context.admission_id,
                "verified_sha",
                verified_sha,
            )
        elif verified_sha != deployed_sha:
            raise OrchestrationBlocked(
                "durable verification provenance differs from deployed SHA"
            )

        return RunResult(
            status="COMPLETE",
            admission_id=context.admission_id,
            published_tip_sha=context.published_tip_sha,
            merged_sha=merged_sha,
            deployed_sha=deployed_sha,
        )

    def _publish_and_deliver(
        self,
        root: Path,
        record,
        spec: WorkBlockSpec,
        binding: PublicationBinding,
        *,
        branch_protection_resolver,
    ) -> RunResult:
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
        if (
            not publish_auth.allowed
            and not self._owner_authorized(
                record.admission_id,
                "subject_branch_publish",
                binding.published_tip_sha,
            )
        ):
            return RunResult(
                status="OWNER_DECISION_REQUIRED",
                admission_id=record.admission_id,
                required_capability="subject_branch_publish",
                reason=publish_auth.reason,
            )

        current = cli.status(root)
        if current is None:
            raise OrchestrationBlocked("publication continuation lost controller state")
        if current["lifecycle_state"] == "ASSURE":
            active = current["active"]
            if active["source_candidate_sha"] != binding.source_candidate_sha:
                raise OrchestrationBlocked(
                    "durable source candidate differs from publication provenance"
                )
            if gitfacts.head_sha(root) != binding.published_tip_sha:
                raise OrchestrationBlocked(
                    "local publish tip differs from immutable publication provenance"
                )
            cli.publish(
                root,
                branch_protection_resolver=branch_protection_resolver,
            )
        elif current["lifecycle_state"] != "INACTIVE":
            raise OrchestrationBlocked(
                "publication continuation requires ASSURE or INACTIVE"
            )

        context = delivery.published_context(
            root,
            self.dispatcher.store,
            admission_id=record.admission_id,
            repository_id=record.repository,
        )
        return self._execute_delivery(root, context, spec)

    def _progress(
        self,
        root: Path,
        record,
        spec: WorkBlockSpec,
        *,
        branch_protection_resolver,
    ) -> RunResult:
        current = cli.status(root)
        if current is None:
            self._plan(root, record.admission_id, spec, reason="initial")
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
            current = cli.status(root)

        if current is None:
            raise OrchestrationBlocked("controller state was not created")

        if current["lifecycle_state"] == "INACTIVE":
            binding = self._publication_or_none(record.admission_id)
            if binding is None:
                raise OrchestrationBlocked(
                    "INACTIVE admission has no resumable publication provenance"
                )
            return self._publish_and_deliver(
                root,
                record,
                spec,
                binding,
                branch_protection_resolver=branch_protection_resolver,
            )

        self._validate_active_binding(current, record, spec)
        cycles = [0]

        while True:
            current = cli.status(root)
            if current is None:
                raise OrchestrationBlocked("active orchestration lost controller state")
            self._validate_active_binding(current, record, spec)
            lifecycle = current["lifecycle_state"]

            if lifecycle == "DEFINE":
                self._critic_until_ready(
                    root,
                    record.admission_id,
                    spec,
                    cycles,
                )
                continue

            if lifecycle == "EXECUTE":
                self._code_candidate(root, record.admission_id, spec)
                continue

            if lifecycle == "ASSURE":
                binding = self._publication_or_none(record.admission_id)
                if binding is None:
                    self._assure_from_state(
                        root,
                        record.admission_id,
                        spec,
                        cycles,
                    )
                    binding = self._prepare_publication(root, record, spec)
                return self._publish_and_deliver(
                    root,
                    record,
                    spec,
                    binding,
                    branch_protection_resolver=branch_protection_resolver,
                )

            if lifecycle == "INACTIVE":
                binding = self._publication_or_none(record.admission_id)
                if binding is None:
                    raise OrchestrationBlocked(
                        "INACTIVE transition has no publication provenance"
                    )
                return self._publish_and_deliver(
                    root,
                    record,
                    spec,
                    binding,
                    branch_protection_resolver=branch_protection_resolver,
                )

            raise OrchestrationBlocked(f"unknown lifecycle state: {lifecycle}")

    def run(
        self,
        repo_root: Path,
        request: DispatchRequest,
        spec: WorkBlockSpec,
        *,
        branch_protection_resolver,
    ) -> RunResult:
        root = self._bound_root(repo_root)
        record = self.dispatcher.admit(root, request)
        self._ensure_work_block_binding(record.admission_id, spec, create=True)
        gitfacts.require_clean(root)
        subprocess.run(
            ["git", "-C", str(root), "switch", "-q", record.subject_branch],
            check=True,
        )
        try:
            return self._progress(
                root,
                record,
                spec,
                branch_protection_resolver=branch_protection_resolver,
            )
        except _OwnerBoundary as boundary:
            return RunResult(
                status="OWNER_DECISION_REQUIRED",
                admission_id=record.admission_id,
                required_capability=boundary.required_capability,
                reason=boundary.reason,
            )

    def resume(
        self,
        repo_root: Path,
        *,
        admission_id: str,
        spec: WorkBlockSpec,
        branch_protection_resolver,
    ) -> RunResult:
        """Resume an existing admission without recreating or widening it.

        Delivery Owner approvals, when needed, come only from the separately
        injected trusted OwnerAuthorizationResolver and are then persisted against
        the immutable published tip.
        """

        root = self._bound_root(repo_root)
        record = self.dispatcher.store.resolve(admission_id)
        self._ensure_work_block_binding(record.admission_id, spec, create=False)
        gitfacts.require_clean(root)
        subprocess.run(
            ["git", "-C", str(root), "switch", "-q", record.subject_branch],
            check=True,
        )
        current = cli.status(root)
        if current is not None and current["lifecycle_state"] != "INACTIVE":
            self._validate_active_binding(current, record, spec)
        try:
            return self._progress(
                root,
                record,
                spec,
                branch_protection_resolver=branch_protection_resolver,
            )
        except _OwnerBoundary as boundary:
            return RunResult(
                status="OWNER_DECISION_REQUIRED",
                admission_id=record.admission_id,
                required_capability=boundary.required_capability,
                reason=boundary.reason,
            )
