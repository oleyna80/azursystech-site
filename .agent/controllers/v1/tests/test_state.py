import copy
import unittest

from v1 import state
from v1.errors import TransitionDenied, ValidationError
from v1.tests import support as s


class StateTests(unittest.TestCase):
    def test_inactive_schema_is_exact(self):
        state.validate(copy.deepcopy(state.INACTIVE))
        for invalid in (
            {},
            {"schema_version": 1, "lifecycle_state": "INACTIVE", "active": None},
            {**state.INACTIVE, "extra": True},
        ):
            with self.assertRaises(ValidationError):
                state.validate(invalid)

    def test_open_creates_exact_define_contract(self):
        item = s.opened()
        self.assertEqual(item["schema_version"], 2)
        self.assertEqual(item["lifecycle_state"], "DEFINE")
        self.assertEqual(item["active"]["admission_id"], s.Record.admission_id)
        self.assertEqual(item["active"]["authority_profile"]["revision"], s.PROFILE)
        self.assertEqual(item["active"]["critic"], {"status": "PENDING", "subject_revision": None})

    def test_open_rejects_active_state(self):
        with self.assertRaises(TransitionDenied):
            state.open_work_block(
                s.opened(),
                work_block_id="WB-002",
                initiative_ref=s.INITIATIVE,
                admission_id=s.Record.admission_id,
                subject_branch=s.Record.subject_branch,
                base_commit=s.BASE,
                authority_profile_id=s.Record.authority_profile_id,
                authority_profile_revision=s.PROFILE,
                planning_revision=s.PLAN,
                planning_paths=s.PLANNING_PATHS,
                implementation_write_set=s.IMPLEMENTATION,
                coordination_scope=s.COORDINATION,
            )

    def test_work_block_and_scope_grammar_fail_closed(self):
        item = s.opened()
        item["active"]["work_block_id"] = "WB-01"
        with self.assertRaises(ValidationError):
            state.validate(item)
        item = s.opened()
        item["active"]["implementation_write_set"] = ["web/**/x"]
        with self.assertRaises(ValidationError):
            state.validate(item)
        item = s.opened()
        item["active"]["coordination_scope"] = [".agent/controllers/v1/**", *s.COORDINATION]
        item["active"]["coordination_scope"].sort()
        with self.assertRaises(ValidationError):
            state.validate(item)

    def test_critic_ready_is_atomic_define_to_execute(self):
        item = state.critic_result(s.opened(), "ready")
        self.assertEqual(item["lifecycle_state"], "EXECUTE")
        self.assertEqual(item["active"]["critic"], {"status": "READY", "subject_revision": s.PLAN})
        with self.assertRaises(TransitionDenied):
            state.critic_result(s.opened(), "ready", planning_verified=False)

    def test_critic_blocked_stays_define(self):
        item = state.critic_result(s.opened(), "blocked")
        self.assertEqual(item["lifecycle_state"], "DEFINE")
        self.assertEqual(item["active"]["critic"]["status"], "BLOCKED")

    def test_revise_begin_and_bind_preserve_identity(self):
        item = s.assure()
        identity = {k: copy.deepcopy(item["active"][k]) for k in (
            "work_block_id", "initiative_ref", "admission_id", "subject_branch",
            "base_commit", "authority_profile",
        )}
        item = state.revise_begin(item)
        self.assertEqual(item["lifecycle_state"], "DEFINE")
        self.assertIsNone(item["active"]["source_candidate_sha"])
        rebound = state.revise_bind(
            item,
            planning_revision="5" * 40,
            planning_paths=s.PLANNING_PATHS,
            implementation_write_set=s.IMPLEMENTATION,
            coordination_scope=s.COORDINATION,
        )
        for key, value in identity.items():
            self.assertEqual(rebound["active"][key], value)
        self.assertEqual(rebound["active"]["planning_subject"]["revision"], "5" * 40)

    def test_candidate_and_assurance_bind_exact_sha(self):
        item = s.assure()
        self.assertEqual(item["source_candidate_sha"] if "source_candidate_sha" in item else item["active"]["source_candidate_sha"], s.CANDIDATE)
        item = state.reviewer_result(item, "ready")
        self.assertEqual(item["active"]["reviewer"]["candidate_sha"], s.CANDIDATE)
        item = state.verifier_result(item, "ready")
        self.assertEqual(item["active"]["verifier"]["candidate_sha"], s.CANDIDATE)

    def test_verifier_ready_requires_reviewer(self):
        with self.assertRaises(TransitionDenied):
            state.verifier_result(s.assure(), "ready")

    def test_rework_and_scope_change_are_transitions_not_statuses(self):
        review = state.reviewer_result(s.assure(), "rework")
        self.assertEqual(review["lifecycle_state"], "EXECUTE")
        self.assertIsNone(review["active"]["source_candidate_sha"])
        scope = state.reviewer_result(s.assure(), "scope-change")
        self.assertEqual(scope["lifecycle_state"], "DEFINE")
        self.assertEqual(scope["active"]["critic"]["status"], "PENDING")

    def test_verifier_evidence_problem_preserves_candidate_and_reviewer(self):
        item = state.reviewer_result(s.assure(), "ready")
        item = state.verifier_result(item, "evidence-problem")
        self.assertEqual(item["lifecycle_state"], "ASSURE")
        self.assertEqual(item["active"]["source_candidate_sha"], s.CANDIDATE)
        self.assertEqual(item["active"]["reviewer"]["status"], "READY")
        self.assertEqual(item["active"]["verifier"]["status"], "PENDING")

    def test_success_close_is_not_a_transition(self):
        with self.assertRaises(TransitionDenied):
            state.close(s.assured(), "success")
        self.assertEqual(state.close(s.opened(), "cancelled"), state.INACTIVE)

    def test_publish_success_requires_exact_assurance(self):
        with self.assertRaises(TransitionDenied):
            state.publish_success(s.assure())
        self.assertEqual(state.publish_success(s.assured()), state.INACTIVE)


if __name__ == "__main__":
    unittest.main()
