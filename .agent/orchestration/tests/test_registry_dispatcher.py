import sys
import tempfile
import unittest
from dataclasses import replace
from pathlib import Path

AGENT_ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(AGENT_ROOT))

from orchestration import admission
from orchestration.dispatcher import TrustedDispatcher
from orchestration.registry import SQLiteAdmissionRegistry
from orchestration.tests.support import OrchestrationRepo, REPOSITORY_ID


class RegistryDispatcherTests(unittest.TestCase):
    def test_sqlite_registry_is_persistent_idempotent_and_immutable(self):
        with tempfile.TemporaryDirectory() as temp:
            path = Path(temp) / "registry.sqlite3"
            registry = SQLiteAdmissionRegistry(path)
            record = admission.AdmissionRecord(
                admission_id="adm-0123456789abcdef",
                repository="fixture/repo",
                trigger_class="manual-owner",
                authority_profile_id="human-governed",
                authority_profile_revision="a" * 40,
                base_ref="main",
                base_commit="b" * 40,
                subject_branch="feat/test",
            )
            registry.put(record)
            registry.put(record)
            reopened = SQLiteAdmissionRegistry(path)
            self.assertEqual(reopened.resolve(record.admission_id), record)
            with self.assertRaises(admission.AdmissionConflict):
                reopened.put(replace(record, subject_branch="feat/changed"))

    def test_dispatch_request_cannot_select_or_inject_profile(self):
        raw = {
            "repository": "fixture/repo",
            "trigger_class": "manual-owner",
            "subject_branch": "feat/test",
            "policy_revision": "a" * 40,
            "authority_profile_id": "autonomous-production",
        }
        with self.assertRaises(admission.AdmissionValidationError):
            TrustedDispatcher.parse_request(raw)

    def test_protected_trigger_policy_selects_exact_profile(self):
        fx = OrchestrationRepo()
        try:
            manual = fx.dispatcher.admit(
                fx.root,
                fx.request("manual-owner", admission_id="adm-manual0001"),
            )
            self.assertEqual(manual.authority_profile_id, "human-governed")

            # A second admission needs a separate clean fixture because admission
            # creates/verifies its subject branch from the exact base.
            other = OrchestrationRepo()
            try:
                trusted = other.dispatcher.admit(
                    other.root,
                    other.request("trusted-release", admission_id="adm-release001"),
                )
                self.assertEqual(
                    trusted.authority_profile_id,
                    "autonomous-production",
                )
            finally:
                other.cleanup()
        finally:
            fx.cleanup()

    def test_pinned_policy_revision_not_mutable_worktree_selects_profile(self):
        fx = OrchestrationRepo()
        try:
            path = fx.root / ".agent/policies/admission-rules.json"
            path.write_text('{"schema_version":1,"triggers":{}}\n', encoding="utf-8")
            record = fx.dispatcher.admit(
                fx.root,
                fx.request("trusted-ci", admission_id="adm-pinned0001"),
            )
            self.assertEqual(record.authority_profile_id, "supervised-integrated")
        finally:
            fx.cleanup()


if __name__ == "__main__":
    unittest.main()
