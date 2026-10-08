import json
import sys
import subprocess
import tempfile
import unittest
from dataclasses import replace
from pathlib import Path

AGENT_ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(AGENT_ROOT))
from orchestration import admission


class AdmissionTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.root = Path(self.temp.name)
        subprocess.run(["git", "-C", str(self.root), "init", "-q", "-b", "main"], check=True)
        self._write_policies()
        (self.root / "README.md").write_text("fixture\n", encoding="utf-8")
        self._commit("initial policy and fixture")
        self.policy_revision = self._git("rev-parse", "HEAD")
        self.store = admission.InMemoryAdmissionStore()

    def tearDown(self):
        self.temp.cleanup()

    def _git(self, *args):
        return subprocess.check_output(
            ["git", "-C", str(self.root), *args], text=True
        ).strip()

    def _commit(self, message):
        subprocess.run(["git", "-C", str(self.root), "add", "."], check=True)
        subprocess.run(
            [
                "git", "-C", str(self.root),
                "-c", "user.name=Fixture",
                "-c", "user.email=fixture@example.invalid",
                "commit", "-qm", message,
            ],
            check=True,
        )

    def _write_policies(self):
        policies = self.root / ".agent" / "policies"
        policies.mkdir(parents=True, exist_ok=True)
        (policies / "autonomy-profiles.json").write_text(
            json.dumps({
                "schema_version": 1,
                "profiles": {
                    "human-governed": {"capabilities": ["planning"]},
                    "autonomous-production": {"capabilities": ["merge", "deploy"]},
                },
            }),
            encoding="utf-8",
        )
        (policies / "admission-rules.json").write_text(
            json.dumps({
                "schema_version": 1,
                "triggers": {
                    "manual-owner": {
                        "max_profile": "human-governed",
                        "base_ref": "main",
                    }
                },
            }),
            encoding="utf-8",
        )

    def _admit(self, **overrides):
        args = {
            "repo_root": self.root,
            "repository": "fixture/repo",
            "trigger_class": "manual-owner",
            "subject_branch": "feat/test",
            "policy_revision": self.policy_revision,
            "store": self.store,
            "admission_id": "adm-0123456789abcdef",
        }
        args.update(overrides)
        return admission.create_admission(**args)

    def test_manual_owner_admission_pins_base_and_creates_branch(self):
        record = self._admit()
        self.assertEqual(record.authority_profile_id, "human-governed")
        self.assertEqual(record.authority_profile_revision, self.policy_revision)
        self.assertEqual(record.base_commit, self.policy_revision)
        self.assertEqual(self._git("rev-parse", "refs/heads/feat/test"), self.policy_revision)
        self.assertEqual(self.store.resolve(record.admission_id), record)

    def test_binding_requires_exact_repository_profile_base_and_subject(self):
        record = self._admit()
        exact = admission.validate_binding(
            self.store,
            admission_id=record.admission_id,
            repository=record.repository,
            subject_branch=record.subject_branch,
            authority_profile_id=record.authority_profile_id,
            authority_profile_revision=record.authority_profile_revision,
            base_commit=record.base_commit,
        )
        self.assertEqual(exact, record)
        cases = {
            "repository": "other/repo",
            "subject_branch": "feat/other",
            "authority_profile_id": "other-profile",
            "authority_profile_revision": "a" * 40,
            "base_commit": "b" * 40,
        }
        base = {
            "admission_id": record.admission_id,
            "repository": record.repository,
            "subject_branch": record.subject_branch,
            "authority_profile_id": record.authority_profile_id,
            "authority_profile_revision": record.authority_profile_revision,
            "base_commit": record.base_commit,
        }
        for field, value in cases.items():
            with self.subTest(field=field), self.assertRaises(admission.AdmissionMismatch):
                admission.validate_binding(self.store, **{**base, field: value})

    def test_subject_cannot_request_stronger_profile(self):
        with self.assertRaises(admission.AdmissionPolicyError):
            self._admit(requested_profile="autonomous-production")

    def test_policy_is_loaded_from_pinned_revision_not_worktree(self):
        path = self.root / ".agent" / "policies" / "admission-rules.json"
        data = json.loads(path.read_text(encoding="utf-8"))
        data["triggers"]["manual-owner"]["max_profile"] = "autonomous-production"
        path.write_text(json.dumps(data), encoding="utf-8")
        with self.assertRaises(admission.AdmissionPolicyError):
            self._admit(requested_profile="autonomous-production")

    def test_existing_subject_branch_must_still_equal_admitted_base(self):
        subprocess.run(["git", "-C", str(self.root), "branch", "feat/test", self.policy_revision], check=True)
        subprocess.run(["git", "-C", str(self.root), "switch", "-q", "feat/test"], check=True)
        (self.root / "later.txt").write_text("later\n", encoding="utf-8")
        self._commit("advance subject")
        subprocess.run(["git", "-C", str(self.root), "switch", "-q", "main"], check=True)
        with self.assertRaises(admission.AdmissionMismatch):
            self._admit()

    def test_admission_store_is_immutable(self):
        record = self._admit()
        self.store.put(record)
        changed = replace(record, subject_branch="feat/changed")
        with self.assertRaises(admission.AdmissionConflict):
            self.store.put(changed)

    def test_protected_policy_surface(self):
        self.assertTrue(admission.is_protected_policy_path(".agent/policies/autonomy-profiles.json"))
        self.assertTrue(admission.is_protected_policy_path(".agent/policies"))
        self.assertFalse(admission.is_protected_policy_path(".agent/orchestration/admission.py"))

    def test_invalid_record_fails_closed(self):
        with self.assertRaises(admission.AdmissionValidationError):
            admission.AdmissionRecord(
                admission_id="bad",
                repository="fixture/repo",
                trigger_class="manual-owner",
                authority_profile_id="human-governed",
                authority_profile_revision="a" * 40,
                base_ref="main",
                base_commit="b" * 39,
                subject_branch="feat/test",
            )


if __name__ == "__main__":
    unittest.main()
