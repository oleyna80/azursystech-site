import copy
import unittest

from v1 import evidence, state
from v1.errors import TransitionDenied, ValidationError
from v1.tests import support as s


class EvidenceTests(unittest.TestCase):
    def test_freshness_only_at_new_dispatch(self):
        item = s.capable()
        record = s.dispatch_record(item, "critic", "critic-1")
        evidence.dispatch(item, record)
        stale = copy.deepcopy(item)
        stale["active"]["capability"]["observed_at"] = "2029-12-01T00:00:00+00:00"
        with self.assertRaises(TransitionDenied):
            evidence.dispatch(stale, record)
        completed = s.result(item, "critic", "APPROVE", "critic-1")
        completed["active"]["capability"]["observed_at"] = "2029-12-01T00:00:00+00:00"
        evidence.validate_records(completed["active"])

    def test_results_are_append_only_and_separate_sessions(self):
        item = s.assured()
        roles = [(r["role"], r["session_id"]) for r in item["active"]["evidence"]]
        self.assertEqual(len(roles), len(set(roles)))
        with self.assertRaises(TransitionDenied):
            evidence.record_result(item, item["active"]["evidence"][-1])
        self.assertEqual(item["active"]["evidence"][-1]["candidate_id"], s.CANDIDATE)

    def test_assurance_snapshot_requires_exact_candidate_tree(self):
        item = s.capable("ASSURE")
        record = s.dispatch_record(item, "reviewer", "reviewer-wrong-tree")
        record["pre_repository"]["tree"] = s.TREE
        with self.assertRaises(ValidationError):
            evidence.dispatch(item, record)

    def test_unexpected_mutation_rejects_result(self):
        item = s.capable()
        dispatch = s.dispatch_record(item, "critic", "critic-mutated")
        item = evidence.dispatch(item, dispatch)
        result = {**dispatch, "verdict": "APPROVE", "completed_at": s.LATER,
                  "report_path": "reports/critic.md", "findings": [],
                  "post_repository": {**s.SNAP, "status": "M file"},
                  "post_control_surface": copy.deepcopy(s.SNAP)}
        with self.assertRaises(ValidationError):
            evidence.record_result(item, result)

    def test_no_self_hash_or_future_commit_fields(self):
        self.assertFalse(any("hash" in field or "commit" in field or "ledger" in field
                             for field in evidence.RESULT_FIELDS))

    def test_old_ready_cannot_authorize_verifier_after_same_tree_refreeze(self):
        item = s.result(s.capable("ASSURE"), "reviewer", "READY", "reviewer-first")
        item = s.result(item, "verifier", "FAIL", "verifier-fail")
        negative = copy.deepcopy(item["active"]["evidence"][-1])
        item = state.freeze_candidate(item, s.CANDIDATE)
        with self.assertRaises(TransitionDenied):
            evidence.can_dispatch(item, role="verifier", now=s.VERIFIER_AT)
        item = s.result(item, "reviewer", "READY", "reviewer-after-freeze")
        item = s.result(item, "verifier", "READY", "verifier-after-freeze")
        self.assertEqual(item["active"]["evidence"][-3], negative)
        evidence.require_success(item["active"])

    def test_evidence_only_retry_preserves_candidate_and_completed_results(self):
        item = s.result(s.capable("ASSURE"), "reviewer", "READY", "reviewer-first")
        item = s.result(item, "verifier", "EVIDENCE_PROBLEM", "verifier-evidence")
        previous = copy.deepcopy(item["active"]["evidence"])
        self.assertEqual(item["lifecycle_state"], "ASSURE")
        self.assertEqual(item["active"]["candidate_id"], s.CANDIDATE)
        item = state.retry_assurance(item)
        self.assertEqual(item["active"]["evidence"], previous)
        item = s.result(item, "verifier", "READY", "verifier-retry")
        self.assertEqual(item["active"]["candidate_id"], s.CANDIDATE)
        evidence.require_success(item["active"])
