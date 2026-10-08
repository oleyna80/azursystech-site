import importlib
import json
import unittest
from pathlib import Path


INVENTORY_PATH = Path(__file__).with_name("legacy_finding_inventory.json")
ALLOWED = {"COVERED", "SUPERSEDED", "NOT_APPLICABLE"}


def resolve_target(target: str):
    parts = target.split(".")
    module = None
    split_at = None
    for index in range(len(parts), 0, -1):
        try:
            module = importlib.import_module(".".join(parts[:index]))
            split_at = index
            break
        except ModuleNotFoundError:
            continue
    if module is None or split_at is None:
        raise AssertionError(f"cannot import inventory target: {target}")
    value = module
    for name in parts[split_at:]:
        if not hasattr(value, name):
            raise AssertionError(f"inventory target does not exist: {target}")
        value = getattr(value, name)
    return value


class LegacyFindingInventoryTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.inventory = json.loads(INVENTORY_PATH.read_text(encoding="utf-8"))

    def test_inventory_schema_and_canonical_source_are_explicit(self):
        self.assertEqual(self.inventory["schema_version"], 1)
        self.assertEqual(
            self.inventory["canonical_source"],
            {
                "branch": "audit/sdlc-revision",
                "path": "docs/architecture/sdlc-revision-audit.md",
            },
        )
        self.assertEqual(set(self.inventory["allowed_statuses"]), ALLOWED)

    def test_every_f001_through_f039_has_exactly_one_mapping(self):
        expected = {f"F-{number:03d}" for number in range(1, 40)}
        self.assertEqual(set(self.inventory["findings"]), expected)

    def test_each_mapping_has_status_rationale_and_resolvable_tests(self):
        for finding_id, item in self.inventory["findings"].items():
            with self.subTest(finding_id=finding_id):
                self.assertIn(item["status"], ALLOWED)
                self.assertIsInstance(item["title"], str)
                self.assertTrue(item["title"])
                self.assertIsInstance(item["rationale"], str)
                self.assertTrue(item["rationale"])
                tests = item["tests"]
                self.assertIsInstance(tests, list)
                if item["status"] == "NOT_APPLICABLE":
                    self.assertEqual(tests, [])
                else:
                    self.assertTrue(tests)
                    for target in tests:
                        resolve_target(target)

    def test_f021_is_preserved_as_unassigned_not_invented(self):
        item = self.inventory["findings"]["F-021"]
        self.assertEqual(item["status"], "NOT_APPLICABLE")
        self.assertIn("no F-021 entry", item["rationale"])

    def test_shell_parser_failure_class_is_explicitly_superseded(self):
        shell_findings = {
            "F-022", "F-023", "F-025", "F-028", "F-029", "F-030",
            "F-032", "F-033", "F-034", "F-035", "F-036", "F-037", "F-038",
        }
        for finding_id in shell_findings:
            with self.subTest(finding_id=finding_id):
                item = self.inventory["findings"][finding_id]
                self.assertEqual(item["status"], "SUPERSEDED")
                self.assertTrue(item["tests"])

    def test_required_transaction_classes_are_directly_covered(self):
        for finding_id in {"F-002", "F-003", "F-004", "F-010", "F-011", "F-020", "F-026"}:
            with self.subTest(finding_id=finding_id):
                self.assertEqual(
                    self.inventory["findings"][finding_id]["status"],
                    "COVERED",
                )


if __name__ == "__main__":
    unittest.main()
