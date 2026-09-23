import copy
import tempfile
import unittest
from pathlib import Path

from v1 import state, storage
from v1.canonical import canonical_json_bytes
from v1.errors import DurabilityUncertain, StopAndPreserve, ValidationError
from v1.tests import support as s


class StorageTests(unittest.TestCase):
    def test_atomic_deterministic_and_invalid_never_persisted(self):
        with tempfile.TemporaryDirectory() as folder:
            path = Path(folder) / "authority.json"
            storage.write(path, copy.deepcopy(state.INACTIVE))
            self.assertEqual(path.read_bytes(), canonical_json_bytes(state.INACTIVE))
            opened = s.opened()
            storage.write(path, opened, expected=state.INACTIVE)
            self.assertEqual(storage.read(path), opened)
            before = path.read_bytes()
            invalid = copy.deepcopy(opened)
            invalid["lifecycle_state"] = "BOGUS"
            with self.assertRaises(ValidationError):
                storage.write(path, invalid, expected=opened)
            self.assertEqual(path.read_bytes(), before)

    def test_pins_generation_write_set_and_completed_evidence(self):
        with tempfile.TemporaryDirectory() as folder:
            path = Path(folder) / "authority.json"
            storage.write(path, copy.deepcopy(state.INACTIVE))
            item = s.opened()
            storage.write(path, item, expected=state.INACTIVE)
            for key, value in (("controller_tree", "f" * 40), ("write_set", ["web/**"])):
                changed = copy.deepcopy(item)
                changed["active"][key] = value
                with self.subTest(key=key), self.assertRaises(ValidationError):
                    storage.write(path, changed, expected=item)
            self.assertEqual(storage.read(path), item)

    def test_inactive_recovery_is_bounded(self):
        with tempfile.TemporaryDirectory() as folder:
            path = Path(folder) / "authority.json"
            with self.assertRaises(StopAndPreserve):
                storage.recover_inactive(path, inactive_proven=False)
            self.assertEqual(storage.recover_inactive(path, inactive_proven=True), state.INACTIVE)
            opened = s.opened()
            storage.write(path, opened, expected=state.INACTIVE)
            with self.assertRaises(StopAndPreserve):
                storage.recover_inactive(path, inactive_proven=True)
            path.write_text("{corrupt", encoding="utf-8")
            with self.assertRaises(StopAndPreserve):
                storage.recover_inactive(path, inactive_proven=True)

    def test_post_replace_uncertainty_fails_closed(self):
        with tempfile.TemporaryDirectory() as folder:
            path = Path(folder) / "authority.json"
            storage.write(path, copy.deepcopy(state.INACTIVE))
            def fault():
                raise OSError("simulated directory sync failure")
            with self.assertRaises(DurabilityUncertain):
                storage.write(path, s.opened(), expected=state.INACTIVE, after_replace=fault)
            self.assertEqual(storage.read(path)["lifecycle_state"], "DEFINE")

    def test_negative_evidence_persists_and_assurance_boundary_cannot_be_rebased(self):
        with tempfile.TemporaryDirectory() as folder:
            path = Path(folder) / "authority.json"
            item = s.capable("ASSURE")
            path.write_bytes(canonical_json_bytes(item))
            negative = s.result(item, "reviewer", "CHANGES_REQUIRED", "reviewer-negative")
            storage.write(path, negative, expected=item)
            self.assertEqual(storage.read(path)["active"]["evidence"][-1]["verdict"],
                             "CHANGES_REQUIRED")
            refrozen = state.freeze_candidate(negative, s.CANDIDATE)
            storage.write(path, refrozen, expected=negative)
            ready = s.result(refrozen, "reviewer", "READY", "reviewer-new-cycle")
            storage.write(path, ready, expected=refrozen)
            tampered = copy.deepcopy(ready)
            tampered["active"]["assurance_evidence_start"] = len(tampered["active"]["evidence"])
            with self.assertRaises(ValidationError):
                storage.write(path, tampered, expected=ready)
            self.assertEqual(storage.read(path), ready)
