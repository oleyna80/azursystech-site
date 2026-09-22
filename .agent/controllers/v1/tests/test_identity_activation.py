from __future__ import annotations

import json
import os
import shutil
import tempfile
import unittest
from pathlib import Path

from v1.activation import (
    materialize,
    parse_activation_map,
    read_activation_map,
    verify_postimage,
    verify_preimages,
    verify_sources,
)
from v1.canonical import canonical_json_bytes, sha256_bytes
from v1.errors import TransitionDenied, ValidationError
from v1.identity import identity_for_path, scan_surface, sealed_surface_identity
from v1.package import runtime_package_identity
from v1.recovery import CANONICAL_INACTIVE_TEMPLATE, recover_inactive
from v1.sealed import build_manifest, verify_manifest


ROOT = Path(__file__).resolve().parents[4]
ACTIVATION_MAP = ROOT / ".agent/controllers/v1/activation/activation-map.json"
STAGED_ROOT = ROOT / ".agent/controllers/v1/activation/staged"


class IdentityTests(unittest.TestCase):
    def test_every_surface_mutation_changes_identity(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            first = root / "first"
            first.write_bytes(b"one")
            baseline = sealed_surface_identity(scan_surface(root, ["first"]))
            first.write_bytes(b"two")
            self.assertNotEqual(baseline, sealed_surface_identity(scan_surface(root, ["first"])))
            first.write_bytes(b"one")
            os.chmod(first, 0o755)
            self.assertNotEqual(baseline, sealed_surface_identity(scan_surface(root, ["first"])))
            os.chmod(first, 0o644)
            second = root / "second"
            first.rename(second)
            self.assertNotEqual(baseline, sealed_surface_identity(scan_surface(root, ["second"])))
            link = root / "first"
            link.symlink_to("second")
            self.assertNotEqual(baseline, sealed_surface_identity(scan_surface(root, ["first"])))
            with self.assertRaises(ValidationError):
                scan_surface(root, ["missing"])

    def test_duplicate_and_unsupported_paths_fail_closed(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            (root / "a").write_text("a", encoding="utf-8")
            with self.assertRaises(ValidationError):
                sealed_surface_identity(scan_surface(root, ["a", "a"]))
            (root / "folder").mkdir()
            with self.assertRaises(ValidationError):
                identity_for_path(root, "folder")

    def test_sealed_manifest_requires_complete_discovered_surface(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            package = root / ".agent/controllers/v1"
            package.mkdir(parents=True)
            (package / "first.py").write_text("first\n", encoding="utf-8")
            (package / "second.py").write_text("second\n", encoding="utf-8")
            manifest = build_manifest(
                root,
                candidate_attempt_id="attempt-1",
                frozen_commit="1" * 40,
                frozen_tree="2" * 40,
            )
            verify_manifest(root, manifest)
            incomplete = dict(manifest)
            incomplete["entries"] = manifest["entries"][:-1]
            incomplete_entries = scan_surface(root, [".agent/controllers/v1/first.py"])
            incomplete["aggregate_identity"] = sealed_surface_identity(incomplete_entries)
            with self.assertRaises(ValidationError):
                verify_manifest(root, incomplete)
            with self.assertRaises(ValidationError):
                build_manifest(
                    root,
                    candidate_attempt_id="attempt-1",
                    frozen_commit="1" * 40,
                    frozen_tree="2" * 40,
                    paths=[".agent/controllers/v1/first.py"],
                )


class ActivationTests(unittest.TestCase):
    def _roots(self) -> tuple[tempfile.TemporaryDirectory, Path, Path]:
        temporary = tempfile.TemporaryDirectory()
        base = Path(temporary.name)
        source = base / "source"
        destination = base / "destination"
        source.mkdir()
        destination.mkdir()
        return temporary, source, destination

    @staticmethod
    def _record(source: Path, staged: str, destination: str, operation: str, preimage: dict) -> dict:
        identity = identity_for_path(source, staged)
        return {
            "source": staged,
            "source_identity": {
                "type": identity.kind,
                "mode": identity.mode,
                "identity": identity.identity,
            },
            "destination": destination,
            "operation": operation,
            "destination_preimage": preimage,
        }

    def test_create_and_replace_copy_exact_assured_bytes(self) -> None:
        temporary, source, destination = self._roots()
        with temporary:
            staged_manifest = source / ".agent/controllers/v1/activation/staged/.agent/controller-manifest.json"
            staged_default = source / ".agent/controllers/v1/activation/staged/.agent/active-work-block.default.json"
            staged_manifest.parent.mkdir(parents=True)
            staged_manifest.write_bytes(b"manifest\n")
            staged_default.write_bytes(b"future-default\n")
            existing = destination / ".agent/active-work-block.default.json"
            existing.parent.mkdir(parents=True)
            existing.write_bytes(b"legacy-default\n")
            old = identity_for_path(destination, ".agent/active-work-block.default.json")
            records = [
                self._record(
                    source,
                    ".agent/controllers/v1/activation/staged/.agent/controller-manifest.json",
                    ".agent/controller-manifest.json",
                    "create",
                    {"state": "absent", "type": None, "mode": None, "identity": None},
                ),
                self._record(
                    source,
                    ".agent/controllers/v1/activation/staged/.agent/active-work-block.default.json",
                    ".agent/active-work-block.default.json",
                    "replace",
                    {"state": "present", "type": old.kind, "mode": old.mode, "identity": old.identity},
                ),
            ]
            entries = parse_activation_map(
                {
                    "schema": "azursystech-controller-activation-map-v1",
                    "parent_generation": "legacy",
                    "target_generation": "v1",
                    "entries": records,
                }
            )
            changed = materialize(
                source, destination, entries, work_block_inactive=True, owner_authorized=True
            )
            self.assertEqual(set(changed), {record["destination"] for record in records})
            self.assertEqual((destination / ".agent/controller-manifest.json").read_bytes(), b"manifest\n")
            self.assertEqual(existing.read_bytes(), b"future-default\n")

    def test_create_preserves_preassured_symlink_identity(self) -> None:
        temporary, source, destination = self._roots()
        with temporary:
            staged = source / ".agent/controllers/v1/activation/staged/.agent/controller-manifest.json"
            staged.parent.mkdir(parents=True)
            staged.symlink_to("manifests/controller-v1.json")
            record = self._record(
                source,
                ".agent/controllers/v1/activation/staged/.agent/controller-manifest.json",
                ".agent/controller-manifest.json",
                "create",
                {"state": "absent", "type": None, "mode": None, "identity": None},
            )
            entries = parse_activation_map(
                {
                    "schema": "azursystech-controller-activation-map-v1",
                    "parent_generation": "legacy",
                    "target_generation": "v1",
                    "entries": [record],
                }
            )

            changed = materialize(
                source, destination, entries, work_block_inactive=True, owner_authorized=True
            )

            activated = destination / ".agent/controller-manifest.json"
            self.assertEqual(changed, (".agent/controller-manifest.json",))
            self.assertTrue(activated.is_symlink())
            self.assertEqual(os.readlink(activated), "manifests/controller-v1.json")
            verify_postimage(destination, entries, changed)

    def test_delete_wildcard_dynamic_and_wrong_preimage_fail_closed(self) -> None:
        temporary, source, destination = self._roots()
        with temporary:
            staged = source / ".agent/controllers/v1/activation/staged/.agent/controller-manifest.json"
            staged.parent.mkdir(parents=True)
            staged.write_bytes(b"manifest")
            valid = self._record(
                source,
                ".agent/controllers/v1/activation/staged/.agent/controller-manifest.json",
                ".agent/controller-manifest.json",
                "create",
                {"state": "absent", "type": None, "mode": None, "identity": None},
            )
            for mutation in (
                {**valid, "operation": "delete"},
                {**valid, "destination": ".agent/*.json"},
                {**valid, "source": ".agent/controllers/v1/activation/staged/{generated}"},
            ):
                with self.subTest(mutation=mutation):
                    with self.assertRaises(ValidationError):
                        parse_activation_map(
                            {
                                "schema": "azursystech-controller-activation-map-v1",
                                "parent_generation": "legacy",
                                "target_generation": "v1",
                                "entries": [mutation],
                            }
                        )
            unexpected = destination / ".agent/controller-manifest.json"
            unexpected.parent.mkdir(parents=True)
            unexpected.write_bytes(b"unexpected")
            entries = parse_activation_map(
                {
                    "schema": "azursystech-controller-activation-map-v1",
                    "parent_generation": "legacy",
                    "target_generation": "v1",
                    "entries": [valid],
                }
            )
            with self.assertRaises(TransitionDenied):
                verify_preimages(destination, entries)
            with self.assertRaises(TransitionDenied):
                materialize(source, source, entries, work_block_inactive=True, owner_authorized=True)
            with self.assertRaises(TransitionDenied):
                materialize(source, destination, entries, work_block_inactive=False, owner_authorized=True)

    def test_extra_activation_path_is_rejected(self) -> None:
        temporary, source, destination = self._roots()
        with temporary:
            staged = source / ".agent/controllers/v1/activation/staged/.agent/controller-manifest.json"
            staged.parent.mkdir(parents=True)
            staged.write_bytes(b"manifest")
            record = self._record(
                source,
                ".agent/controllers/v1/activation/staged/.agent/controller-manifest.json",
                ".agent/controller-manifest.json",
                "create",
                {"state": "absent", "type": None, "mode": None, "identity": None},
            )
            entries = parse_activation_map(
                {
                    "schema": "azursystech-controller-activation-map-v1",
                    "parent_generation": "legacy",
                    "target_generation": "v1",
                    "entries": [record],
                }
            )
            (destination / ".agent").mkdir()
            (destination / ".agent/controller-manifest.json").write_bytes(b"manifest")
            with self.assertRaises(ValidationError):
                verify_postimage(destination, entries, [".agent/controller-manifest.json", "extra"])
            with self.assertRaises(ValidationError):
                verify_postimage(
                    destination,
                    entries,
                    [".agent/controller-manifest.json", ".agent/controller-manifest.json"],
                )

    def test_repository_activation_map_binds_every_staged_file_and_legacy_preimage(self) -> None:
        entries = read_activation_map(ACTIVATION_MAP)
        expected_sources = {
            path.relative_to(ROOT).as_posix()
            for path in STAGED_ROOT.rglob("*")
            if path.is_file() or path.is_symlink()
        }
        self.assertEqual({entry.source for entry in entries}, expected_sources)
        self.assertEqual(
            {entry.destination for entry in entries},
            {
                ".agent/controller-manifest.json",
                ".agent/active-work-block.default.json",
                ".agent/hooks/hard_stop_policy.py",
                ".codex/hooks/pre_tool_use_policy.py",
                ".codex/hooks/subagent_context.py",
                ".codex/scripts/lifecycle.py",
                ".claude/hooks/work_block_gate.py",
                ".claude/hooks/assurance_gate.py",
            },
        )
        verify_sources(ROOT, entries)
        verify_preimages(ROOT, entries)

        manifest = json.loads(
            (STAGED_ROOT / ".agent/controller-manifest.json").read_text(encoding="utf-8")
        )
        generation = manifest["generations"]["v1"]
        self.assertEqual(generation["package_identity"], runtime_package_identity(ROOT))
        self.assertEqual(
            generation["policy_identity"],
            sha256_bytes((ROOT / ".agent/controllers/v1/policy-metadata.json").read_bytes()),
        )
        self.assertEqual(
            json.loads(
                (STAGED_ROOT / ".agent/active-work-block.default.json").read_text(
                    encoding="utf-8"
                )
            ),
            CANONICAL_INACTIVE_TEMPLATE,
        )

    def test_repository_activation_materializes_only_preassured_bytes(self) -> None:
        entries = read_activation_map(ACTIVATION_MAP)
        with tempfile.TemporaryDirectory() as directory:
            destination_root = Path(directory)
            for entry in entries:
                if entry.operation != "replace":
                    continue
                source = ROOT / entry.destination
                destination = destination_root / entry.destination
                destination.parent.mkdir(parents=True, exist_ok=True)
                if source.is_symlink():
                    destination.symlink_to(os.readlink(source))
                else:
                    shutil.copy2(source, destination, follow_symlinks=False)

            changed = materialize(
                ROOT,
                destination_root,
                entries,
                work_block_inactive=True,
                owner_authorized=True,
            )
            self.assertEqual(set(changed), {entry.destination for entry in entries})
            verify_postimage(destination_root, entries, changed)


class RecoveryTests(unittest.TestCase):
    def test_recovery_is_inactive_only_and_template_bound(self) -> None:
        template = dict(CANONICAL_INACTIVE_TEMPLATE)
        identity = sha256_bytes(canonical_json_bytes(template))
        with tempfile.TemporaryDirectory() as directory:
            target = Path(directory) / "active.json"
            recover_inactive(
                target, template, active_authority_known=False, expected_template_identity=identity
            )
            self.assertEqual(target.read_bytes(), canonical_json_bytes(template))
            target.write_text(json.dumps({"work_block_id": "WB-X", "lifecycle_status": "ACTIVE"}))
            with self.assertRaises(TransitionDenied):
                recover_inactive(
                    target, template, active_authority_known=False, expected_template_identity=identity
                )
            target.write_bytes(b"corrupt")
            with self.assertRaises(TransitionDenied):
                recover_inactive(
                    target, template, active_authority_known=True, expected_template_identity=identity
                )
            with self.assertRaises(ValidationError):
                recover_inactive(
                    Path(directory) / "other.json",
                    template,
                    active_authority_known=False,
                    expected_template_identity="sha256:" + "0" * 64,
                )

    def test_recovery_rejects_minimal_inactive_shape(self) -> None:
        minimal = {
            "schema_version": 4,
            "work_block_id": "",
            "lifecycle_status": "INACTIVE",
            "write_set": [],
            "write_gate": {"status": "BLOCKED"},
        }
        with tempfile.TemporaryDirectory() as directory, self.assertRaises(ValidationError):
            recover_inactive(
                Path(directory) / "active.json",
                minimal,
                active_authority_known=False,
                expected_template_identity=sha256_bytes(canonical_json_bytes(minimal)),
            )


if __name__ == "__main__":
    unittest.main()
