import copy
import json
import tempfile
import unittest
from pathlib import Path

from v1 import state, storage
from v1.canonical import canonical_json_bytes
from v1.errors import DurabilityUncertain, StopAndPreserve, ValidationError
from v1.tests import support as s


class StorageTests(unittest.TestCase):
    def test_missing_is_not_inactive(self):
        with tempfile.TemporaryDirectory() as folder:
            path = Path(folder) / "authority.json"
            self.assertIsNone(storage.read_optional(path))
            with self.assertRaises(StopAndPreserve):
                storage.read(path)

    def test_initial_active_write_and_compare_and_swap(self):
        with tempfile.TemporaryDirectory() as folder:
            path = Path(folder) / "authority.json"
            opened = s.opened()
            storage.write(path, opened)
            self.assertEqual(path.read_bytes(), canonical_json_bytes(opened))
            execute = state.critic_result(opened, "ready")
            storage.write(path, execute, expected=opened)
            self.assertEqual(storage.read(path), execute)
            with self.assertRaises(StopAndPreserve):
                storage.write(path, opened, expected=opened)

    def test_immutable_binding_cannot_change(self):
        with tempfile.TemporaryDirectory() as folder:
            path = Path(folder) / "authority.json"
            item = s.opened()
            storage.write(path, item)
            for key, value in (
                ("admission_id", "adm-other12345678"),
                ("base_commit", "9" * 40),
                ("subject_branch", "feat/other"),
            ):
                changed = copy.deepcopy(item)
                changed["active"][key] = value
                with self.subTest(key=key), self.assertRaises(ValidationError):
                    storage.write(path, changed, expected=item)

    def test_invalid_state_never_replaces_valid_state(self):
        with tempfile.TemporaryDirectory() as folder:
            path = Path(folder) / "authority.json"
            item = s.opened()
            storage.write(path, item)
            before = path.read_bytes()
            invalid = copy.deepcopy(item)
            invalid["active"]["critic"]["status"] = "UNKNOWN"
            with self.assertRaises(ValidationError):
                storage.write(path, invalid, expected=item)
            self.assertEqual(path.read_bytes(), before)

    def test_corrupt_and_symlink_state_fail_closed(self):
        with tempfile.TemporaryDirectory() as folder:
            root = Path(folder)
            path = root / "authority.json"
            path.write_text("{broken", encoding="utf-8")
            with self.assertRaises(StopAndPreserve):
                storage.read(path)
            path.unlink()
            target = root / "target"
            target.write_text(json.dumps(state.INACTIVE), encoding="utf-8")
            path.symlink_to(target)
            with self.assertRaises(StopAndPreserve):
                storage.read(path)

    def test_post_replace_uncertainty_is_explicit(self):
        with tempfile.TemporaryDirectory() as folder:
            path = Path(folder) / "authority.json"
            item = s.opened()
            storage.write(path, item)
            execute = state.critic_result(item, "ready")
            def fault():
                raise OSError("simulated fsync failure")
            with self.assertRaises(DurabilityUncertain):
                storage.write(path, execute, expected=item, after_replace=fault)
            self.assertEqual(storage.read(path), execute)


if __name__ == "__main__":
    unittest.main()
