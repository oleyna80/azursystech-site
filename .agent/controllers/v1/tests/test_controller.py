from __future__ import annotations

import copy
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

from v1.controller import bind_for_admission, reject_generation_switch
from v1.errors import TransitionDenied, ValidationError
from v1.hook_entrypoint import _root
from v1.outer_hook_entrypoint import _require_owner_cwd
from v1.package import controller_root, runtime_package_identity

from .support import active_state


class ControllerBindingTests(unittest.TestCase):
    def test_runtime_entrypoints_are_bound_to_executing_package_repository(self) -> None:
        owner = controller_root()
        self.assertEqual(_root(str(owner / ".agent")), owner)
        self.assertEqual(_require_owner_cwd(str(owner / ".agent/controllers/v1")), owner)

        with tempfile.TemporaryDirectory() as temporary:
            foreign = Path(temporary)
            (foreign / ".agent").mkdir()
            (foreign / ".agent/active-work-block.json").write_text("{}\n", encoding="utf-8")
            with self.assertRaisesRegex(ValueError, "executing controller package root"):
                _root(str(foreign))
            with self.assertRaisesRegex(ValueError, "executing controller package root"):
                _require_owner_cwd(str(foreign))

    def test_future_admission_binds_manifest_generation_explicitly(self) -> None:
        manifest = {
            "schema": "azursystech-controller-manifest-v1",
            "active_generation": "v1",
            "generations": {
                "v1": {
                    "parent_generation": "legacy",
                    "package_identity": "sealed-surface-sha256-v1:" + "1" * 64,
                    "policy_identity": "sha256:" + "2" * 64,
                }
            },
        }
        binding = bind_for_admission(
            manifest,
            source_commit="3" * 40,
            activation_record="sha256:" + "4" * 64,
            manifest_identity="sha256:" + "5" * 64,
        )
        self.assertEqual(binding["generation"], "v1")
        self.assertEqual(binding["source_commit"], "3" * 40)
        self.assertEqual(binding["package_identity"], manifest["generations"]["v1"]["package_identity"])

    def test_future_admission_rejects_malformed_controller_identities(self) -> None:
        manifest = {
            "schema": "azursystech-controller-manifest-v1",
            "active_generation": "v1",
            "generations": {
                "v1": {
                    "parent_generation": "legacy",
                    "package_identity": "sealed-surface-sha256-v1:" + "1" * 64,
                    "policy_identity": "sha256:" + "2" * 64,
                }
            },
        }
        valid = {
            "source_commit": "3" * 40,
            "activation_record": "sha256:" + "4" * 64,
            "manifest_identity": "sha256:" + "5" * 64,
        }
        for field, malformed in (
            ("source_commit", "not-a-commit"),
            ("activation_record", "4" * 64),
            ("manifest_identity", "sha256:" + "G" * 64),
        ):
            arguments = dict(valid)
            arguments[field] = malformed
            with self.subTest(field=field), self.assertRaises(ValidationError):
                bind_for_admission(manifest, **arguments)

        malformed_manifest = copy.deepcopy(manifest)
        malformed_manifest["generations"]["v1"]["package_identity"] = "sha256:" + "1" * 64
        with self.assertRaises(ValidationError):
            bind_for_admission(malformed_manifest, **valid)

    def test_future_admission_requires_exact_manifest_byte_identity(self) -> None:
        manifest = {
            "schema": "azursystech-controller-manifest-v1",
            "active_generation": "v1",
            "generations": {
                "v1": {
                    "parent_generation": "legacy",
                    "package_identity": "sealed-surface-sha256-v1:" + "1" * 64,
                    "policy_identity": "sha256:" + "2" * 64,
                }
            },
        }
        with self.assertRaises(TypeError):
            bind_for_admission(
                manifest,
                source_commit="3" * 40,
                activation_record="sha256:" + "4" * 64,
            )

    def test_runtime_package_rejects_symlink_code_and_directories(self) -> None:
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            package = root / ".agent/controllers/v1"
            package.mkdir(parents=True)
            (package / "module.py").write_text("VALUE = 1\n", encoding="utf-8")
            (package / "linked.py").symlink_to("module.py")
            with self.assertRaisesRegex(ValidationError, "symlink files"):
                runtime_package_identity(root)
            (package / "linked.py").unlink()
            (package / "external").mkdir()
            (package / "linked-directory").symlink_to("external", target_is_directory=True)
            with self.assertRaisesRegex(ValidationError, "symlink directories"):
                runtime_package_identity(root)

    def test_runtime_authority_path_rejects_symlink_state(self) -> None:
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            authority = root / ".agent/active-work-block.json"
            authority.parent.mkdir()
            (root / "state.json").write_text("{}\n", encoding="utf-8")
            authority.symlink_to(root / "state.json")
            with patch("v1.hook_entrypoint.controller_root", return_value=root):
                with self.assertRaisesRegex(ValueError, "must not be a symlink"):
                    _root(str(root))

    def test_active_work_block_cannot_switch_controller_tuple(self) -> None:
        state = active_state()
        unchanged = copy.deepcopy(state["controller_binding"])
        reject_generation_switch(state, unchanged)
        switched = copy.deepcopy(unchanged)
        switched["generation"] = "v2"
        with self.assertRaises(TransitionDenied):
            reject_generation_switch(state, switched)


if __name__ == "__main__":
    unittest.main()
