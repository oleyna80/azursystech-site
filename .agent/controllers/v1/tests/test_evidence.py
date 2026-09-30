import ast
import unittest
from pathlib import Path


class LegacyEvidenceRemovalTests(unittest.TestCase):
    def test_new_core_does_not_import_legacy_evidence_module(self):
        package = Path(__file__).resolve().parents[1]
        for name in ("state.py", "storage.py", "gitfacts.py", "events.py", "policy.py", "cli.py"):
            tree = ast.parse((package / name).read_text(encoding="utf-8"))
            imported = {
                alias.name for node in ast.walk(tree) if isinstance(node, ast.Import)
                for alias in node.names
            }
            from_modules = {
                node.module for node in ast.walk(tree) if isinstance(node, ast.ImportFrom)
            }
            self.assertNotIn("v1.evidence", imported)
            self.assertNotIn("evidence", from_modules)
            self.assertNotIn("v1.evidence", from_modules)


if __name__ == "__main__":
    unittest.main()
