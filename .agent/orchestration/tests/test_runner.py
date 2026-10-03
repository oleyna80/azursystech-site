import sys
import unittest
from dataclasses import replace
from pathlib import Path

AGENT_ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(AGENT_ROOT))

from controllers.v1 import cli
from orchestration.runner import (
    OrchestrationBlocked,
    Orchestrator,
    RoleResult,
)
from orchestration.tests.support import (
    OrchestrationRepo,
    ScriptedRoles,
    SimulatedDelivery,
    SimulatedOwnerAuthorization,
)


class RunnerTests(unittest.TestCase):
    def setUp(self):
        self.fx = OrchestrationRepo()

    def tearDown(self):
        self.fx.cleanup()

    def _run(
        self,
        *,
        trigger="manual-owner",
        roles=None,
        delivery=None,
        deployment_target=None,
        production=False,
        admission_id="adm-run00000001",
    ):
        roles = roles or ScriptedRoles(self.fx)
        delivery = delivery or SimulatedDelivery()
        orchestrator = Orchestrator(
            self.fx.dispatcher,
            roles,
            delivery_executor=delivery,
        )
        result = orchestrator.run(
            self.fx.root,
            self.fx.request(trigger, admission_id=admission_id),
            self.fx.spec(
                deployment_target=deployment_target,
                deployment_is_production=production,
            ),
            branch_protection_resolver=lambda _remote, _branch: False,
        )
        return result, roles, delivery

    def test_run_requires_explicit_admission_id_for_durable_resume(self):
        request = replace(
            self.fx.request("manual-owner", admission_id="adm-placeholder01"),
            admission_id=None,
        )
        orchestrator = Orchestrator(
            self.fx.dispatcher,
            ScriptedRoles(self.fx),
            delivery_executor=SimulatedDelivery(),
        )
        with self.assertRaises(OrchestrationBlocked):
            orchestrator.run(
                self.fx.root,
                request,
                self.fx.spec(),
                branch_protection_resolver=lambda _remote, _branch: False,
            )
        self.assertIsNone(cli.status(self.fx.root))

    def test_human_governed_stops_exactly_at_merge_owner_boundary(self):
        result, roles, delivery = self._run()
        self.assertEqual(result.status, "OWNER_DECISION_REQUIRED")
        self.assertEqual(result.required_capability, "merge")
        self.assertEqual(
            [call[0] for call in delivery.calls],
            ["open_or_update_pr"],
        )
        self.assertEqual(cli.status(self.fx.root)["lifecycle_state"], "INACTIVE")
        record = self.fx.registry.resolve(result.admission_id)
        self.assertEqual(record.authority_profile_id, "human-governed")
        self.assertIsNotNone(result.published_tip_sha)

    def test_trusted_ci_completes_merge_and_nonproduction_delivery(self):
        result, _roles, delivery = self._run(
            trigger="trusted-ci",
            deployment_target="staging",
            production=False,
            admission_id="adm-ci000000001",
        )
        self.assertEqual(result.status, "COMPLETE")
        self.assertEqual(result.merged_sha, result.published_tip_sha)
        self.assertEqual(result.deployed_sha, result.published_tip_sha)
        self.assertEqual(
            [call[0] for call in delivery.calls],
            [
                "open_or_update_pr",
                "merge",
                "deploy_nonproduction",
                "post_deploy_verify",
            ],
        )

    def test_supervised_profile_cannot_self_escalate_to_production(self):
        result, _roles, delivery = self._run(
            trigger="trusted-ci",
            deployment_target="production",
            production=True,
            admission_id="adm-ci000000002",
        )
        self.assertEqual(result.status, "OWNER_DECISION_REQUIRED")
        self.assertEqual(result.required_capability, "deploy_production")
        self.assertEqual(
            [call[0] for call in delivery.calls],
            ["open_or_update_pr", "merge"],
        )

    def test_trusted_release_can_complete_simulated_production_delivery(self):
        result, _roles, delivery = self._run(
            trigger="trusted-release",
            deployment_target="production",
            production=True,
            admission_id="adm-release0002",
        )
        self.assertEqual(result.status, "COMPLETE")
        self.assertEqual(result.deployed_sha, result.published_tip_sha)
        self.assertEqual(
            [call[0] for call in delivery.calls],
            [
                "open_or_update_pr",
                "merge",
                "deploy_production",
                "post_deploy_verify",
            ],
        )

    def test_critic_blocked_replans_autonomously(self):
        roles = ScriptedRoles(self.fx, critic=["BLOCKED", "READY"])
        result, roles, _delivery = self._run(
            roles=roles,
            admission_id="adm-replan00001",
        )
        self.assertEqual(result.status, "OWNER_DECISION_REQUIRED")
        self.assertEqual(roles.planner_count, 2)
        self.assertEqual(roles.coder_count, 1)
        self.assertGreaterEqual(roles.calls.count("critic"), 2)

    def test_reviewer_rework_creates_new_candidate_without_owner(self):
        roles = ScriptedRoles(self.fx, reviewer=["REWORK", "READY"])
        result, roles, _delivery = self._run(
            roles=roles,
            admission_id="adm-review00001",
        )
        self.assertEqual(result.status, "OWNER_DECISION_REQUIRED")
        self.assertEqual(roles.coder_count, 2)
        self.assertEqual(roles.calls.count("reviewer"), 2)

    def test_verifier_evidence_problem_reruns_verifier_without_recoding(self):
        roles = ScriptedRoles(
            self.fx,
            verifier=["EVIDENCE_PROBLEM", "READY"],
        )
        result, roles, _delivery = self._run(
            roles=roles,
            admission_id="adm-evidence001",
        )
        self.assertEqual(result.status, "OWNER_DECISION_REQUIRED")
        self.assertEqual(roles.coder_count, 1)
        self.assertEqual(roles.calls.count("reviewer"), 1)
        self.assertEqual(roles.calls.count("verifier"), 2)

    def test_scope_change_returns_to_define_and_recritic(self):
        roles = ScriptedRoles(
            self.fx,
            reviewer=["SCOPE_CHANGE", "READY"],
            critic=["READY", "READY"],
        )
        result, roles, _delivery = self._run(
            roles=roles,
            admission_id="adm-scope000001",
        )
        self.assertEqual(result.status, "OWNER_DECISION_REQUIRED")
        self.assertEqual(roles.planner_count, 2)
        self.assertEqual(roles.coder_count, 2)
        self.assertGreaterEqual(roles.calls.count("critic"), 2)

    def test_unavailable_assurance_blocks_without_fallback(self):
        roles = ScriptedRoles(self.fx, unavailable={"reviewer"})
        orchestrator = Orchestrator(
            self.fx.dispatcher,
            roles,
            delivery_executor=SimulatedDelivery(),
        )
        with self.assertRaises(OrchestrationBlocked):
            orchestrator.run(
                self.fx.root,
                self.fx.request(
                    "manual-owner",
                    admission_id="adm-unavailable1",
                ),
                self.fx.spec(),
                branch_protection_resolver=lambda _remote, _branch: False,
            )
        current = cli.status(self.fx.root)
        self.assertEqual(current["lifecycle_state"], "ASSURE")
        self.assertEqual(current["active"]["reviewer"]["status"], "PENDING")

    def test_reviewer_cannot_mutate_source_and_still_satisfy_gate(self):
        base = ScriptedRoles(self.fx)

        class MutatingReviewer:
            def run(inner_self, role, context):
                if role == "reviewer":
                    source = self.fx.root / "src/app.txt"
                    source.write_text("reviewer mutation\n", encoding="utf-8")
                    self.fx.commit_direct("reviewer mutation")
                    return RoleResult("reviewer", "READY")
                return base.run(role, context)

        orchestrator = Orchestrator(
            self.fx.dispatcher,
            MutatingReviewer(),
            delivery_executor=SimulatedDelivery(),
        )
        with self.assertRaises(OrchestrationBlocked):
            orchestrator.run(
                self.fx.root,
                self.fx.request(
                    "manual-owner",
                    admission_id="adm-mutreview01",
                ),
                self.fx.spec(),
                branch_protection_resolver=lambda _remote, _branch: False,
            )
        current = cli.status(self.fx.root)
        self.assertEqual(current["lifecycle_state"], "ASSURE")
        self.assertEqual(current["active"]["reviewer"]["status"], "PENDING")

    def test_coder_result_cannot_satisfy_critic_gate(self):
        base = ScriptedRoles(self.fx)

        class WrongRole:
            def run(inner_self, role, context):
                if role == "critic":
                    return RoleResult("coder", "DONE")
                return base.run(role, context)

        orchestrator = Orchestrator(
            self.fx.dispatcher,
            WrongRole(),
            delivery_executor=SimulatedDelivery(),
        )
        with self.assertRaises(OrchestrationBlocked):
            orchestrator.run(
                self.fx.root,
                self.fx.request(
                    "manual-owner",
                    admission_id="adm-wrongrole01",
                ),
                self.fx.spec(),
                branch_protection_resolver=lambda _remote, _branch: False,
            )
        self.assertEqual(cli.status(self.fx.root)["lifecycle_state"], "DEFINE")

    def test_role_owner_boundary_stops_without_followup_or_self_selection(self):
        base = ScriptedRoles(self.fx)
        delivery = SimulatedDelivery()

        class NeedsOwner:
            def run(inner_self, role, context):
                if role == "critic":
                    return RoleResult(
                        "critic",
                        "OWNER_DECISION_REQUIRED",
                        reason="architecture choice requires Owner",
                        required_capability="architecture_change",
                    )
                return base.run(role, context)

        orchestrator = Orchestrator(
            self.fx.dispatcher,
            NeedsOwner(),
            delivery_executor=delivery,
        )
        result = orchestrator.run(
            self.fx.root,
            self.fx.request(
                "manual-owner",
                admission_id="adm-ownerrole01",
            ),
            self.fx.spec(),
            branch_protection_resolver=lambda _remote, _branch: False,
        )
        self.assertEqual(result.status, "OWNER_DECISION_REQUIRED")
        self.assertEqual(result.required_capability, "architecture_change")
        self.assertEqual(result.reason, "architecture choice requires Owner")
        self.assertEqual(cli.status(self.fx.root)["lifecycle_state"], "DEFINE")
        self.assertEqual(delivery.calls, [])
        self.assertEqual(base.calls, ["planner"])

    def test_resume_from_define_after_owner_boundary_reuses_existing_admission(self):
        base = ScriptedRoles(self.fx)

        class NeedsOwnerCritic:
            def run(inner_self, role, context):
                if role == "critic":
                    return RoleResult(
                        "critic",
                        "OWNER_DECISION_REQUIRED",
                        reason="Owner must choose architecture",
                        required_capability="architecture_change",
                    )
                return base.run(role, context)

        first = Orchestrator(
            self.fx.dispatcher,
            NeedsOwnerCritic(),
            delivery_executor=SimulatedDelivery(),
        )
        admission_id = "adm-resumecrit01"
        spec = self.fx.spec()
        result = first.run(
            self.fx.root,
            self.fx.request("manual-owner", admission_id=admission_id),
            spec,
            branch_protection_resolver=lambda _remote, _branch: False,
        )
        self.assertEqual(result.status, "OWNER_DECISION_REQUIRED")
        self.assertEqual(cli.status(self.fx.root)["lifecycle_state"], "DEFINE")

        resumed_roles = ScriptedRoles(self.fx)
        resumed_delivery = SimulatedDelivery()
        resumed = Orchestrator(
            self.fx.dispatcher,
            resumed_roles,
            delivery_executor=resumed_delivery,
        )
        result = resumed.resume(
            self.fx.root,
            admission_id=admission_id,
            spec=spec,
            branch_protection_resolver=lambda _remote, _branch: False,
        )
        self.assertEqual(result.status, "OWNER_DECISION_REQUIRED")
        self.assertEqual(result.required_capability, "merge")
        self.assertNotIn("planner", resumed_roles.calls)
        self.assertEqual(cli.status(self.fx.root)["lifecycle_state"], "INACTIVE")

    def test_resume_before_controller_open_rejects_mutated_work_block_spec(self):
        base = ScriptedRoles(self.fx)

        class CrashingPlanner:
            def run(inner_self, role, context):
                if role == "planner":
                    raise RuntimeError("simulated planner process loss")
                return base.run(role, context)

        admission_id = "adm-resumepreopen"
        spec = self.fx.spec()
        first = Orchestrator(
            self.fx.dispatcher,
            CrashingPlanner(),
            delivery_executor=SimulatedDelivery(),
        )
        with self.assertRaises(RuntimeError):
            first.run(
                self.fx.root,
                self.fx.request("manual-owner", admission_id=admission_id),
                spec,
                branch_protection_resolver=lambda _remote, _branch: False,
            )
        self.assertIsNone(cli.status(self.fx.root))

        resumed_roles = ScriptedRoles(self.fx)
        resumed = Orchestrator(
            self.fx.dispatcher,
            resumed_roles,
            delivery_executor=SimulatedDelivery(),
        )
        mutated = replace(
            spec,
            implementation_write_set=("src/**", "other/**"),
        )
        with self.assertRaises(OrchestrationBlocked):
            resumed.resume(
                self.fx.root,
                admission_id=admission_id,
                spec=mutated,
                branch_protection_resolver=lambda _remote, _branch: False,
            )
        self.assertEqual(resumed_roles.calls, [])

    def test_resume_from_execute_after_process_failure_reruns_coder(self):
        base = ScriptedRoles(self.fx)

        class CrashingCoder:
            def run(inner_self, role, context):
                if role == "coder":
                    raise RuntimeError("simulated process loss")
                return base.run(role, context)

        admission_id = "adm-resumecode01"
        spec = self.fx.spec()
        first = Orchestrator(
            self.fx.dispatcher,
            CrashingCoder(),
            delivery_executor=SimulatedDelivery(),
        )
        with self.assertRaises(RuntimeError):
            first.run(
                self.fx.root,
                self.fx.request("manual-owner", admission_id=admission_id),
                spec,
                branch_protection_resolver=lambda _remote, _branch: False,
            )
        self.assertEqual(cli.status(self.fx.root)["lifecycle_state"], "EXECUTE")

        resumed_roles = ScriptedRoles(self.fx)
        resumed = Orchestrator(
            self.fx.dispatcher,
            resumed_roles,
            delivery_executor=SimulatedDelivery(),
        )
        result = resumed.resume(
            self.fx.root,
            admission_id=admission_id,
            spec=spec,
            branch_protection_resolver=lambda _remote, _branch: False,
        )
        self.assertEqual(result.status, "OWNER_DECISION_REQUIRED")
        self.assertEqual(resumed_roles.coder_count, 1)

    def test_resume_from_assure_keeps_reviewer_ready_and_reruns_only_verifier(self):
        base = ScriptedRoles(self.fx)

        class CrashingVerifier:
            def run(inner_self, role, context):
                if role == "verifier":
                    raise RuntimeError("simulated verifier process loss")
                return base.run(role, context)

        admission_id = "adm-resumever001"
        spec = self.fx.spec()
        first = Orchestrator(
            self.fx.dispatcher,
            CrashingVerifier(),
            delivery_executor=SimulatedDelivery(),
        )
        with self.assertRaises(RuntimeError):
            first.run(
                self.fx.root,
                self.fx.request("manual-owner", admission_id=admission_id),
                spec,
                branch_protection_resolver=lambda _remote, _branch: False,
            )
        current = cli.status(self.fx.root)
        self.assertEqual(current["lifecycle_state"], "ASSURE")
        self.assertEqual(current["active"]["reviewer"]["status"], "READY")
        self.assertEqual(current["active"]["verifier"]["status"], "PENDING")

        resumed_roles = ScriptedRoles(self.fx)
        resumed = Orchestrator(
            self.fx.dispatcher,
            resumed_roles,
            delivery_executor=SimulatedDelivery(),
        )
        result = resumed.resume(
            self.fx.root,
            admission_id=admission_id,
            spec=spec,
            branch_protection_resolver=lambda _remote, _branch: False,
        )
        self.assertEqual(result.status, "OWNER_DECISION_REQUIRED")
        self.assertEqual(resumed_roles.calls.count("reviewer"), 0)
        self.assertEqual(resumed_roles.calls.count("verifier"), 1)

    def test_resume_after_publication_binding_before_push_uses_same_tip(self):
        admission_id = "adm-resumepub001"
        spec = self.fx.spec()
        first = Orchestrator(
            self.fx.dispatcher,
            ScriptedRoles(self.fx),
            delivery_executor=SimulatedDelivery(),
        )

        def crash_protection(_remote, _branch):
            raise RuntimeError("simulated crash before push")

        with self.assertRaises(RuntimeError):
            first.run(
                self.fx.root,
                self.fx.request("manual-owner", admission_id=admission_id),
                spec,
                branch_protection_resolver=crash_protection,
            )
        binding_before = self.fx.registry.resolve_publication(admission_id)
        self.assertEqual(cli.status(self.fx.root)["lifecycle_state"], "ASSURE")

        resumed_roles = ScriptedRoles(self.fx)
        resumed = Orchestrator(
            self.fx.dispatcher,
            resumed_roles,
            delivery_executor=SimulatedDelivery(),
        )
        result = resumed.resume(
            self.fx.root,
            admission_id=admission_id,
            spec=spec,
            branch_protection_resolver=lambda _remote, _branch: False,
        )
        self.assertEqual(result.status, "OWNER_DECISION_REQUIRED")
        self.assertEqual(
            self.fx.registry.resolve_publication(admission_id),
            binding_before,
        )
        self.assertNotIn("closeout", resumed_roles.calls)
        self.assertEqual(result.published_tip_sha, binding_before.published_tip_sha)

    def test_resume_inactive_delivery_with_owner_merge_approval_skips_existing_pr(self):
        admission_id = "adm-resumemerge1"
        spec = self.fx.spec()
        first_delivery = SimulatedDelivery()
        first = Orchestrator(
            self.fx.dispatcher,
            ScriptedRoles(self.fx),
            delivery_executor=first_delivery,
        )
        result = first.run(
            self.fx.root,
            self.fx.request("manual-owner", admission_id=admission_id),
            spec,
            branch_protection_resolver=lambda _remote, _branch: False,
        )
        self.assertEqual(result.status, "OWNER_DECISION_REQUIRED")
        self.assertEqual(result.required_capability, "merge")
        self.assertEqual([call[0] for call in first_delivery.calls], ["open_or_update_pr"])
        self.assertEqual(cli.status(self.fx.root)["lifecycle_state"], "INACTIVE")

        resumed_roles = ScriptedRoles(self.fx)
        resumed_delivery = SimulatedDelivery()
        owner = SimulatedOwnerAuthorization({"merge"})
        resumed = Orchestrator(
            self.fx.dispatcher,
            resumed_roles,
            delivery_executor=resumed_delivery,
            owner_authorization_resolver=owner,
        )
        completed = resumed.resume(
            self.fx.root,
            admission_id=admission_id,
            spec=spec,
            branch_protection_resolver=lambda _remote, _branch: False,
        )
        self.assertEqual(completed.status, "COMPLETE")
        self.assertEqual([call[0] for call in resumed_delivery.calls], ["merge"])
        self.assertEqual(resumed_roles.calls, [])
        binding = self.fx.registry.resolve_publication(admission_id)
        self.assertEqual(
            owner.calls,
            [(admission_id, "merge", binding.published_tip_sha)],
        )

        replay_delivery = SimulatedDelivery()
        replay = Orchestrator(
            self.fx.dispatcher,
            ScriptedRoles(self.fx),
            delivery_executor=replay_delivery,
        )
        replayed = replay.resume(
            self.fx.root,
            admission_id=admission_id,
            spec=spec,
            branch_protection_resolver=lambda _remote, _branch: False,
        )
        self.assertEqual(replayed.status, "COMPLETE")
        self.assertEqual(replay_delivery.calls, [])

    def test_resume_inactive_rejects_changed_delivery_spec(self):
        admission_id = "adm-resumespec01"
        spec = self.fx.spec()
        first = Orchestrator(
            self.fx.dispatcher,
            ScriptedRoles(self.fx),
            delivery_executor=SimulatedDelivery(),
        )
        result = first.run(
            self.fx.root,
            self.fx.request("manual-owner", admission_id=admission_id),
            spec,
            branch_protection_resolver=lambda _remote, _branch: False,
        )
        self.assertEqual(result.status, "OWNER_DECISION_REQUIRED")
        self.assertEqual(cli.status(self.fx.root)["lifecycle_state"], "INACTIVE")

        resumed_roles = ScriptedRoles(self.fx)
        resumed_delivery = SimulatedDelivery()
        resumed = Orchestrator(
            self.fx.dispatcher,
            resumed_roles,
            delivery_executor=resumed_delivery,
        )
        mutated = replace(
            spec,
            deployment_target="production",
            deployment_is_production=True,
        )
        with self.assertRaises(OrchestrationBlocked):
            resumed.resume(
                self.fx.root,
                admission_id=admission_id,
                spec=mutated,
                branch_protection_resolver=lambda _remote, _branch: False,
            )
        self.assertEqual(resumed_roles.calls, [])
        self.assertEqual(resumed_delivery.calls, [])

    def test_owner_cannot_override_delivery_capability_absent_from_profile(self):
        admission_id = "adm-ownerdeny001"
        spec = self.fx.spec(
            deployment_target="staging",
            deployment_is_production=False,
        )
        first = Orchestrator(
            self.fx.dispatcher,
            ScriptedRoles(self.fx),
            delivery_executor=SimulatedDelivery(),
        )
        result = first.run(
            self.fx.root,
            self.fx.request("manual-owner", admission_id=admission_id),
            spec,
            branch_protection_resolver=lambda _remote, _branch: False,
        )
        self.assertEqual(result.required_capability, "merge")

        owner = SimulatedOwnerAuthorization(
            {"merge", "deploy_nonproduction", "post_deploy_verify"}
        )
        resumed_delivery = SimulatedDelivery()
        resumed = Orchestrator(
            self.fx.dispatcher,
            ScriptedRoles(self.fx),
            delivery_executor=resumed_delivery,
            owner_authorization_resolver=owner,
        )
        with self.assertRaises(OrchestrationBlocked):
            resumed.resume(
                self.fx.root,
                admission_id=admission_id,
                spec=spec,
                branch_protection_resolver=lambda _remote, _branch: False,
            )
        self.assertEqual(
            [call[1] for call in owner.calls],
            ["merge", "deploy_nonproduction"],
        )
        self.assertNotIn("post_deploy_verify", [call[1] for call in owner.calls])

    def test_resume_owner_approved_production_deploy_skips_pr_and_merge(self):
        admission_id = "adm-resumedeploy"
        spec = self.fx.spec(
            deployment_target="production",
            deployment_is_production=True,
        )
        first_delivery = SimulatedDelivery()
        first = Orchestrator(
            self.fx.dispatcher,
            ScriptedRoles(self.fx),
            delivery_executor=first_delivery,
        )
        result = first.run(
            self.fx.root,
            self.fx.request("trusted-ci", admission_id=admission_id),
            spec,
            branch_protection_resolver=lambda _remote, _branch: False,
        )
        self.assertEqual(result.status, "OWNER_DECISION_REQUIRED")
        self.assertEqual(result.required_capability, "deploy_production")
        self.assertEqual(
            [call[0] for call in first_delivery.calls],
            ["open_or_update_pr", "merge"],
        )

        resumed_delivery = SimulatedDelivery()
        owner = SimulatedOwnerAuthorization({"deploy_production"})
        resumed = Orchestrator(
            self.fx.dispatcher,
            ScriptedRoles(self.fx),
            delivery_executor=resumed_delivery,
            owner_authorization_resolver=owner,
        )
        completed = resumed.resume(
            self.fx.root,
            admission_id=admission_id,
            spec=spec,
            branch_protection_resolver=lambda _remote, _branch: False,
        )
        self.assertEqual(completed.status, "COMPLETE")
        self.assertEqual(
            [call[0] for call in resumed_delivery.calls],
            ["deploy_production", "post_deploy_verify"],
        )
        binding = self.fx.registry.resolve_publication(admission_id)
        self.assertEqual(
            owner.calls[0],
            (admission_id, "deploy_production", binding.published_tip_sha),
        )

    def test_owner_boundary_does_not_self_select_followup_action(self):
        result, _roles, delivery = self._run(
            admission_id="adm-ownerhold01",
        )
        self.assertEqual(result.status, "OWNER_DECISION_REQUIRED")
        self.assertEqual(result.required_capability, "merge")
        self.assertEqual(len(delivery.calls), 1)
        self.assertEqual(delivery.calls[0][0], "open_or_update_pr")

    def test_invalid_merge_output_fails_closed(self):
        class BadMerge(SimulatedDelivery):
            def execute(inner_self, capability, context, *, input_value=None, target=None):
                if capability == "merge":
                    inner_self.calls.append((capability, input_value, target))
                    return "not-a-sha"
                return super(BadMerge, inner_self).execute(
                    capability,
                    context,
                    input_value=input_value,
                    target=target,
                )

        with self.assertRaises(OrchestrationBlocked):
            self._run(
                trigger="trusted-ci",
                delivery=BadMerge(),
                admission_id="adm-badmerge001",
            )
        self.assertEqual(cli.status(self.fx.root)["lifecycle_state"], "INACTIVE")

    def test_failed_production_deploy_uses_only_admitted_rollback(self):
        delivery = SimulatedDelivery(fail_capability="deploy_production")
        result, _roles, delivery = self._run(
            trigger="trusted-release",
            delivery=delivery,
            deployment_target="production",
            production=True,
            admission_id="adm-rollback001",
        )
        self.assertEqual(result.status, "BLOCKED")
        self.assertIn("rollback", [call[0] for call in delivery.calls])
        self.assertEqual(
            [call[0] for call in delivery.calls][-1],
            "rollback",
        )


if __name__ == "__main__":
    unittest.main()
