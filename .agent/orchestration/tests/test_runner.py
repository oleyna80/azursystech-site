import sys
import unittest
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

    def test_owner_boundary_does_not_self_select_followup_action(self):
        result, _roles, delivery = self._run(
            admission_id="adm-ownerhold01",
        )
        self.assertEqual(result.status, "OWNER_DECISION_REQUIRED")
        self.assertEqual(result.required_capability, "merge")
        self.assertEqual(len(delivery.calls), 1)
        self.assertEqual(delivery.calls[0][0], "open_or_update_pr")

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
