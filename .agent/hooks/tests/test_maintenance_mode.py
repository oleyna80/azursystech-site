import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
sys.path.insert(0, str(ROOT / ".agent" / "hooks"))
import maintenance_mode as maintenance


class MaintenanceModeTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.root = Path(self.tmp.name)
        self.git(["init", "-b", "repair"])
        self.git(["config", "user.email", "test@example.invalid"])
        self.git(["config", "user.name", "Maintenance Test"])
        (self.root / "seed.txt").write_text("seed\n", encoding="utf-8")
        self.git(["add", "seed.txt"])
        self.git(["commit", "-m", "seed"])
        self.base = self.git(["rev-parse", "HEAD"])
        self.scope = ["repair.txt", ".agent/maintenance-mode.json", ".agent/maintenance-mode.audit.jsonl"]

    def tearDown(self):
        self.tmp.cleanup()

    def git(self, args):
        return subprocess.check_output(["git", *args], cwd=self.root, text=True).strip()

    def enable(self):
        value = maintenance.default_state(trusted_base=self.base, scope=self.scope)
        value.update({
            "enabled": True,
            "repository_identity": maintenance.repo_identity(self.root),
            "remediation_branch": "repair",
            "owner_authorization_ref": "Owner authorization WB-039",
            "activation_reason": "bounded test repair",
            "activated_at": "2026-09-27T00:00:00Z",
            "downgraded_guard_classes": sorted(maintenance.COOPERATIVE_CLASSES),
        })
        maintenance.save(self.root, value)
        return value

    def test_disabled_default_denies_and_has_no_audit(self):
        self.assertEqual(
            maintenance.decide(
                self.root,
                guard_class="source_write_gate",
                operation="write",
                paths=["repair.txt"],
            ),
            "DENY",
        )
        self.assertFalse((self.root / maintenance.AUDIT_NAME).exists())

    def test_exact_in_scope_cooperative_decision_is_audited(self):
        self.enable()
        self.assertEqual(
            maintenance.decide(
                self.root,
                guard_class="source_write_gate",
                operation="write",
                paths=["repair.txt"],
            ),
            "AUDIT",
        )
        record = json.loads((self.root / maintenance.AUDIT_NAME).read_text().splitlines()[0])
        self.assertEqual(record["decision"], "AUDIT")
        self.assertFalse(record["normal_lifecycle_approval"])
        self.assertEqual(record["guard_class"], "source_write_gate")

    def test_wrong_repository_branch_base_and_scope_fail_closed(self):
        value = self.enable()
        value["repository_identity"] = "/other/repository/.git"
        maintenance.save(self.root, value)
        with self.assertRaises(maintenance.MaintenanceError):
            maintenance.decide(self.root, guard_class="source_write_gate", operation="write", paths=["repair.txt"])

        value["repository_identity"] = maintenance.repo_identity(self.root)
        value["remediation_branch"] = "other"
        maintenance.save(self.root, value)
        with self.assertRaises(maintenance.MaintenanceError):
            maintenance.decide(self.root, guard_class="source_write_gate", operation="write", paths=["repair.txt"])

        value["remediation_branch"] = "repair"
        value["trusted_base"] = "0" * 40
        maintenance.save(self.root, value)
        with self.assertRaises(maintenance.MaintenanceError):
            maintenance.decide(self.root, guard_class="source_write_gate", operation="write", paths=["repair.txt"])

        value["trusted_base"] = self.base
        maintenance.save(self.root, value)
        with self.assertRaises(maintenance.MaintenanceError):
            maintenance.decide(self.root, guard_class="source_write_gate", operation="write", paths=["outside.txt"])
        with self.assertRaises(maintenance.MaintenanceError):
            maintenance.decide(self.root, guard_class="source_write_gate", operation="write", paths=["../repair.txt"])

    def test_all_cooperative_classes_are_audited(self):
        self.enable()
        for guard_class in sorted(maintenance.COOPERATIVE_CLASSES):
            with self.subTest(guard_class=guard_class):
                self.assertEqual(
                    maintenance.decide(
                        self.root,
                        guard_class=guard_class,
                        operation="repair",
                        paths=["repair.txt"],
                    ),
                    "AUDIT",
                )
        records = (self.root / maintenance.AUDIT_NAME).read_text().splitlines()
        self.assertEqual(len(records), len(maintenance.COOPERATIVE_CLASSES))

    def test_hard_stops_are_denied_even_when_enabled(self):
        self.enable()
        for hard_stop in sorted(maintenance.HARD_STOP_CLASSES):
            with self.subTest(hard_stop=hard_stop):
                self.assertEqual(
                    maintenance.decide(
                        self.root,
                        guard_class="source_write_gate",
                        effect=hard_stop,
                        operation=hard_stop,
                        paths=["repair.txt"],
                    ),
                    "DENY",
                )
        self.assertFalse((self.root / maintenance.AUDIT_NAME).exists())

    def test_unknown_guard_and_malformed_state_fail_closed(self):
        self.enable()
        self.assertEqual(
            maintenance.decide(self.root, guard_class="unknown", operation="write", paths=["repair.txt"]),
            "DENY",
        )
        state = json.loads((self.root / maintenance.STATE_NAME).read_text())
        state["unexpected"] = True
        (self.root / maintenance.STATE_NAME).write_text(json.dumps(state))
        with self.assertRaises(maintenance.MaintenanceError):
            maintenance.load(self.root)

    def test_deactivate_restores_normal_enforcement(self):
        self.enable()
        maintenance.deactivate(self.root)
        self.assertFalse(maintenance.load(self.root)["enabled"])
        self.assertEqual(
            maintenance.decide(self.root, guard_class="source_write_gate", operation="write", paths=["repair.txt"]),
            "DENY",
        )


if __name__ == "__main__":
    unittest.main()
