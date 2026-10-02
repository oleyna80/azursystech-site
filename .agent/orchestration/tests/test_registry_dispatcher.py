import sys
import tempfile
import unittest
from dataclasses import replace
from pathlib import Path

AGENT_ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(AGENT_ROOT))

from orchestration import admission
from controllers.v1 import hook
from orchestration.dispatcher import TrustedDispatcher
from orchestration.registry import PublicationBinding, SQLiteAdmissionRegistry
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

    def test_publication_binding_and_owner_authorization_are_immutable(self):
        with tempfile.TemporaryDirectory() as temp:
            registry = SQLiteAdmissionRegistry(Path(temp) / "registry.sqlite3")
            record = admission.AdmissionRecord(
                admission_id="adm-provenance0001",
                repository="fixture/repo",
                trigger_class="manual-owner",
                authority_profile_id="human-governed",
                authority_profile_revision="a" * 40,
                base_ref="main",
                base_commit="b" * 40,
                subject_branch="feat/test",
            )
            registry.put(record)
            binding = PublicationBinding(
                admission_id=record.admission_id,
                source_candidate_sha="c" * 40,
                published_tip_sha="d" * 40,
            )
            registry.put_publication(binding)
            registry.put_publication(binding)
            self.assertEqual(
                registry.resolve_publication(record.admission_id),
                binding,
            )
            with self.assertRaises(admission.AdmissionConflict):
                registry.put_publication(
                    replace(binding, published_tip_sha="e" * 40)
                )

            registry.put_owner_authorization(
                record.admission_id,
                "merge",
                binding.published_tip_sha,
            )
            self.assertTrue(
                registry.owner_authorized(
                    record.admission_id,
                    "merge",
                    binding.published_tip_sha,
                )
            )
            self.assertFalse(
                registry.owner_authorized(
                    record.admission_id,
                    "merge",
                    "e" * 40,
                )
            )
            with self.assertRaises(admission.AdmissionConflict):
                registry.put_owner_authorization(
                    record.admission_id,
                    "merge",
                    "e" * 40,
                )

    def test_dispatch_request_cannot_select_or_inject_profile(self):
        raw = {
            "repository": "fixture/repo",
            "trigger_class": "manual-owner",
            "subject_branch": "feat/test",
            "authority_profile_id": "autonomous-production",
        }
        with self.assertRaises(admission.AdmissionValidationError):
            TrustedDispatcher.parse_request(raw)

    def test_dispatch_request_cannot_select_historical_policy_revision(self):
        raw = {
            "repository": "fixture/repo",
            "trigger_class": "manual-owner",
            "subject_branch": "feat/test",
            "policy_revision": "a" * 40,
        }
        with self.assertRaises(admission.AdmissionValidationError):
            TrustedDispatcher.parse_request(raw)

    def test_persistent_registry_inside_subject_repo_is_rejected(self):
        fx = OrchestrationRepo()
        try:
            inside = SQLiteAdmissionRegistry(
                fx.root / ".agent" / "admissions.sqlite3"
            )
            dispatcher = TrustedDispatcher(inside)
            with self.assertRaises(admission.AdmissionValidationError):
                dispatcher.admit(
                    fx.root,
                    fx.request("manual-owner", admission_id="adm-inside0001"),
                )
        finally:
            fx.cleanup()

    def test_default_dispatcher_does_not_enable_higher_triggers(self):
        fx = OrchestrationRepo()
        try:
            baseline = TrustedDispatcher(fx.registry)
            with self.assertRaises(admission.AdmissionPolicyError):
                baseline.admit(
                    fx.root,
                    fx.request("trusted-release", admission_id="adm-nohigh0001"),
                )
        finally:
            fx.cleanup()

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

    def test_subject_branch_cannot_modify_protected_profile_policy(self):
        fx = OrchestrationRepo()
        try:
            record = fx.dispatcher.admit(
                fx.root,
                fx.request("manual-owner", admission_id="adm-protected01"),
            )
            fx._git_run("switch", "-q", record.subject_branch)
            result = hook.evaluate_runtime(
                "codex",
                {
                    "cwd": str(fx.root),
                    "tool_name": "Write",
                    "tool_input": {
                        "file_path": ".agent/policies/autonomy-profiles.json"
                    },
                },
                installation_root=fx.root,
                admission=record,
                repository_id=REPOSITORY_ID,
            )
            self.assertFalse(result.allowed)
            self.assertEqual(result.code, "COMMIT_FORBIDDEN_PATH")
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
