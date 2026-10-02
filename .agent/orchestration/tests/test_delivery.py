import dataclasses
import sys
import unittest
from pathlib import Path

AGENT_ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(AGENT_ROOT))

from controllers.v1 import cli
from orchestration import admission, delivery
from orchestration.runner import Orchestrator
from orchestration.tests.support import (
    OrchestrationRepo,
    REPOSITORY_ID,
    ScriptedRoles,
    SimulatedDelivery,
)


class DeliveryAuthorityTests(unittest.TestCase):
    def setUp(self):
        self.fx = OrchestrationRepo()

    def tearDown(self):
        self.fx.cleanup()

    def _published_context(self):
        roles = ScriptedRoles(self.fx)
        platform = SimulatedDelivery()
        runner = Orchestrator(
            self.fx.dispatcher,
            roles,
            delivery_executor=platform,
        )
        result = runner.run(
            self.fx.root,
            self.fx.request(
                "manual-owner",
                admission_id="adm-delivery001",
            ),
            self.fx.spec(),
            branch_protection_resolver=lambda _remote, _branch: False,
        )
        self.assertEqual(result.status, "OWNER_DECISION_REQUIRED")
        self.assertEqual(cli.status(self.fx.root)["lifecycle_state"], "INACTIVE")
        context = delivery.published_context(
            self.fx.root,
            self.fx.registry,
            admission_id=result.admission_id,
            repository_id=REPOSITORY_ID,
        )
        return result, context

    def test_delivery_context_survives_controller_inactive_via_admission_id(self):
        result, context = self._published_context()
        self.assertEqual(context.admission_id, result.admission_id)
        binding = self.fx.registry.resolve_publication(result.admission_id)
        self.assertEqual(context.source_candidate_sha, binding.source_candidate_sha)
        self.assertEqual(context.published_tip_sha, binding.published_tip_sha)
        self.assertEqual(context.published_tip_sha, result.published_tip_sha)
        decision = delivery.authorize(
            self.fx.root,
            self.fx.registry,
            context,
            "merge",
        )
        self.assertEqual(decision.status, "OWNER_DECISION_REQUIRED")

    def test_remote_advance_after_verified_publish_is_rejected(self):
        result, context = self._published_context()
        record = self.fx.registry.resolve(result.admission_id)
        (self.fx.root / "after-publish.txt").write_text(
            "unassured remote advance\n",
            encoding="utf-8",
        )
        advanced = self.fx.commit_direct("unassured remote advance")
        self.assertNotEqual(advanced, context.published_tip_sha)
        self.fx._git_run(
            "push",
            "-q",
            "origin",
            f"HEAD:refs/heads/{record.subject_branch}",
        )

        with self.assertRaises(admission.AdmissionValidationError):
            delivery.published_context(
                self.fx.root,
                self.fx.registry,
                admission_id=result.admission_id,
                repository_id=REPOSITORY_ID,
            )

    def test_forged_published_tip_is_denied(self):
        _result, context = self._published_context()
        forged = dataclasses.replace(context, published_tip_sha="f" * 40)
        decision = delivery.authorize(
            self.fx.root,
            self.fx.registry,
            forged,
            "open_or_update_pr",
        )
        self.assertEqual(decision.status, "DENY")
        self.assertIn("remote subject ref", decision.reason)

    def test_forged_profile_binding_is_denied(self):
        _result, context = self._published_context()
        forged = dataclasses.replace(context, profile_id="autonomous-production")
        decision = delivery.authorize(
            self.fx.root,
            self.fx.registry,
            forged,
            "merge",
        )
        self.assertEqual(decision.status, "DENY")


if __name__ == "__main__":
    unittest.main()
