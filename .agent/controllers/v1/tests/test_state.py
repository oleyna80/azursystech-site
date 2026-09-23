import copy
import subprocess
import tempfile
import unittest
from pathlib import Path

from v1 import state
from v1.errors import TransitionDenied, ValidationError
from v1.tests import support as s


class StateTests(unittest.TestCase):
    def test_happy_path_and_success_closeout(self):
        item = s.assured()
        closed = state.closeout(item, outcome="success", closed_at=s.VERIFIER_DONE, reason="assured")
        self.assertEqual(closed["lifecycle_state"], "INACTIVE")
        self.assertEqual(closed["history"][-1]["outcome"], "success")
        self.assertEqual(closed["history"][-1]["work_block"], item["active"])

    def test_reporting_and_cancelled_reachable_without_success_claim(self):
        for outcome in ("reporting_only", "cancelled"):
            with self.subTest(outcome=outcome):
                closed = state.closeout(s.opened(), outcome=outcome,
                                        closed_at=s.NOW, reason="incomplete")
                self.assertEqual(closed["lifecycle_state"], "INACTIVE")
                self.assertEqual(closed["history"][-1]["outcome"], outcome)
                with self.assertRaises(TransitionDenied):
                    state.closeout(s.opened(), outcome=outcome,
                                   closed_at=s.NOW, reason="success achieved")

    def test_critic_reject_stays_define(self):
        item = s.capable()
        item = s.result(item, "critic", "REJECT", "critic-reject")
        self.assertEqual(item["lifecycle_state"], "DEFINE")
        with self.assertRaises(TransitionDenied):
            state.approve_define(item)
        approved_then_rejected = s.result(s.capable(), "critic", "APPROVE", "critic-approve")
        approved_then_rejected = s.result(approved_then_rejected, "critic", "REJECT", "critic-later-reject")
        with self.assertRaises(TransitionDenied):
            state.approve_define(approved_then_rejected)

    def test_reviewer_and_verifier_rework(self):
        reviewer = s.result(s.capable("ASSURE"), "reviewer", "CHANGES_REQUIRED", "reviewer-negative")
        self.assertEqual(reviewer["lifecycle_state"], "EXECUTE")
        self.assertIsNone(reviewer["active"]["candidate_id"])
        verifier = s.result(s.capable("ASSURE"), "reviewer", "READY", "reviewer-ready")
        verifier = s.result(verifier, "verifier", "FAIL", "verifier-negative")
        self.assertEqual(verifier["lifecycle_state"], "EXECUTE")
        self.assertIsNone(verifier["active"]["candidate_id"])

    def test_material_revision_and_bounded_assure_retry(self):
        item = s.result(s.capable("ASSURE"), "reviewer", "SCOPE_CHANGE", "reviewer-scope")
        self.assertEqual(item["lifecycle_state"], "DEFINE")
        revised = state.revise_define(item, "r2")
        self.assertEqual(revised["lifecycle_state"], "DEFINE")
        self.assertIsNone(revised["active"]["candidate_id"])
        retry = s.result(s.capable("ASSURE"), "reviewer", "READY", "reviewer-ready")
        retry = s.result(retry, "verifier", "EVIDENCE_PROBLEM", "verifier-evidence")
        self.assertEqual(retry["lifecycle_state"], "ASSURE")
        same = state.retry_assurance(retry)
        self.assertEqual(same["lifecycle_state"], "ASSURE")
        self.assertEqual(same["active"]["candidate_id"], s.CANDIDATE)
        with self.assertRaises(TransitionDenied):
            state.retry_assurance(s.capable("ASSURE"))

    def test_unknown_and_corrupt_state_fail_closed(self):
        for invalid in ({}, {"schema_version": 1, "lifecycle_state": "REVIEW"}):
            with self.assertRaises(ValidationError):
                state.validate(invalid)
        item = s.opened()
        item["active"]["controller_generation"] = "v2"
        with self.assertRaises(ValidationError):
            state.validate(item)
        closed = state.closeout(s.opened(), outcome="cancelled", closed_at=s.NOW, reason="withdrawn")
        closed["history"][0]["work_block"].pop("controller_tree")
        with self.assertRaises(ValidationError):
            state.validate(closed)

    def test_closed_work_block_id_cannot_be_reused(self):
        closed = state.closeout(s.opened(), outcome="cancelled", closed_at=s.NOW, reason="withdrawn")
        with self.assertRaises(TransitionDenied):
            state.open_work_block(closed, work_block_id="WB-TEST", subject_branch="feat/test",
                                  subject_revision="r2", write_set=[".agent/controllers/v1/**"],
                                  controller_tree=s.TREE)
        item = s.opened()
        item["active"]["candidate_id"] = "bad"
        with self.assertRaises(ValidationError):
            state.validate(item)

    def test_success_needs_exact_latest_assurance(self):
        item = s.assured()
        wrong = copy.deepcopy(item)
        wrong["active"]["evidence"][-1]["candidate_id"] = "c" * 40
        with self.assertRaises((ValidationError, TransitionDenied)):
            state.closeout(wrong, outcome="success", closed_at=s.NOW, reason="assured")
        item = s.result(item, "reviewer", "CHANGES_REQUIRED", "reviewer-latest")
        with self.assertRaises(TransitionDenied):
            state.closeout(item, outcome="success", closed_at=s.NOW, reason="assured")

    def test_negative_result_cannot_be_overwritten_without_new_freeze(self):
        cases = (
            ("reviewer", "CHANGES_REQUIRED", "EXECUTE"),
            ("verifier", "FAIL", "EXECUTE"),
            ("reviewer", "SCOPE_CHANGE", "DEFINE"),
        )
        for role, verdict, phase in cases:
            with self.subTest(verdict=verdict):
                item = s.capable("ASSURE")
                if role == "verifier":
                    item = s.result(item, "reviewer", "READY", "reviewer-first")
                before = copy.deepcopy(item["active"]["evidence"])
                item = s.result(item, role, verdict, "negative")
                self.assertEqual(item["lifecycle_state"], phase)
                self.assertEqual(item["active"]["evidence"][:-1], before)
                self.assertEqual(item["active"]["evidence"][-1]["verdict"], verdict)
                with self.assertRaises(TransitionDenied):
                    s.result(item, role, "READY", "late-ready")
                with self.assertRaises(TransitionDenied):
                    state.closeout(item, outcome="success", closed_at=s.NOW, reason="assured")
                if phase == "DEFINE":
                    with self.assertRaises(TransitionDenied):
                        state.approve_define(item)

    def test_rework_refreeze_requires_new_assurance_even_for_same_tree(self):
        item = s.result(s.capable("ASSURE"), "reviewer", "CHANGES_REQUIRED", "reviewer-negative")
        negative = copy.deepcopy(item["active"]["evidence"][-1])
        item = state.freeze_candidate(item, "c" * 40)
        with self.assertRaises(TransitionDenied):
            state.closeout(item, outcome="success", closed_at=s.NOW, reason="assured")
        item = s.result(item, "reviewer", "READY", "reviewer-corrected")
        item = s.result(item, "verifier", "READY", "verifier-corrected")
        self.assertEqual(item["active"]["evidence"][-3], negative)
        self.assertEqual(state.closeout(item, outcome="success", closed_at=s.NOW,
                                        reason="assured")["lifecycle_state"], "INACTIVE")

        same_tree = s.result(s.capable("ASSURE"), "reviewer", "CHANGES_REQUIRED", "reviewer-negative")
        same_tree = state.freeze_candidate(same_tree, s.CANDIDATE)
        self.assertEqual(same_tree["active"]["assurance_evidence_start"],
                         len(same_tree["active"]["evidence"]))
        same_tree = s.result(same_tree, "reviewer", "READY", "reviewer-after-refreeze")
        same_tree = s.result(same_tree, "verifier", "READY", "verifier-after-refreeze")
        state.closeout(same_tree, outcome="success", closed_at=s.NOW, reason="assured")

    def test_scope_change_requires_new_define_then_freeze(self):
        item = s.result(s.capable("ASSURE"), "reviewer", "SCOPE_CHANGE", "reviewer-scope")
        item = state.revise_define(item, "r2")
        with self.assertRaises(TransitionDenied):
            state.approve_define(item)
        item = s.result(item, "critic", "APPROVE", "critic-r2")
        item = state.approve_define(item)
        item = state.freeze_candidate(item, "c" * 40)
        item = s.result(item, "reviewer", "READY", "reviewer-r2")
        item = s.result(item, "verifier", "READY", "verifier-r2")
        state.closeout(item, outcome="success", closed_at=s.NOW, reason="assured")

    def test_rework_path_uses_new_committed_git_tree(self):
        with tempfile.TemporaryDirectory() as folder:
            root = Path(folder)
            subprocess.run(["git", "-C", folder, "init", "-q"], check=True)
            feature = root / "feature.txt"
            feature.write_text("initial", encoding="utf-8")
            subprocess.run(["git", "-C", folder, "add", "feature.txt"], check=True)
            commit = ["git", "-C", folder, "-c", "user.name=Fixture", "-c",
                      "user.email=fixture@example.invalid", "commit", "-qm"]
            subprocess.run([*commit, "initial"], check=True)
            initial_tree = subprocess.check_output(
                ["git", "-C", folder, "rev-parse", "HEAD^{tree}"], text=True,
            ).strip()
            item = state.freeze_candidate(s.capable("EXECUTE"), initial_tree)
            item = s.result(item, "reviewer", "CHANGES_REQUIRED", "reviewer-negative")
            feature.write_text("corrected", encoding="utf-8")
            subprocess.run(["git", "-C", folder, "add", "feature.txt"], check=True)
            subprocess.run([*commit, "corrected"], check=True)
            corrected_tree = subprocess.check_output(
                ["git", "-C", folder, "rev-parse", "HEAD^{tree}"], text=True,
            ).strip()
            self.assertNotEqual(initial_tree, corrected_tree)
            item = state.freeze_candidate(item, corrected_tree)
            item = s.result(item, "reviewer", "READY", "reviewer-corrected")
            item = s.result(item, "verifier", "READY", "verifier-corrected")
            self.assertEqual(state.closeout(item, outcome="success", closed_at=s.NOW,
                                            reason="assured")["lifecycle_state"], "INACTIVE")

    def test_assure_with_negative_result_is_contradictory_even_if_later_ready(self):
        item = s.result(s.capable("ASSURE"), "reviewer", "CHANGES_REQUIRED", "reviewer-negative")
        item["lifecycle_state"] = "ASSURE"
        item["active"]["candidate_id"] = s.CANDIDATE
        with self.assertRaises(ValidationError):
            state.validate(item)
