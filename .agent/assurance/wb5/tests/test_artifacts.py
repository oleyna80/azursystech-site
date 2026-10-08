import json
import os
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

AGENT_ROOT = Path(__file__).resolve().parents[3]
REPO_ROOT = AGENT_ROOT.parent
sys.path.insert(0, str(AGENT_ROOT))

from assurance.wb5.validate import (
    AssuranceValidationError,
    CANONICAL_PATHS,
    validate_corpus,
    validate_manifest,
    validate_source_artifacts,
    wiring_mode,
)


class Wb5ArtifactValidationTests(unittest.TestCase):
    def setUp(self):
        self.root = REPO_ROOT
        self.manifest = json.loads(
            (self.root / CANONICAL_PATHS["manifest"]).read_text(encoding="utf-8")
        )
        self.corpus = json.loads(
            (self.root / CANONICAL_PATHS["corpus"]).read_text(encoding="utf-8")
        )
        self.patch = (self.root / CANONICAL_PATHS["patch"]).read_bytes()

    def test_canonical_artifacts_validate(self):
        validate_source_artifacts(self.root)

    def test_manifest_rejects_redirected_patch_blob(self):
        forged = dict(self.manifest)
        forged["patch_blob_sha"] = "0" * 40
        with self.assertRaises(AssuranceValidationError):
            validate_manifest(self.root, forged, self.patch)

    def test_manifest_rejects_undeclared_patch_path(self):
        forged = json.loads(json.dumps(self.manifest))
        forged["live_wiring_paths"].pop()
        with self.assertRaises(AssuranceValidationError):
            validate_manifest(self.root, forged, self.patch)

    def test_security_relaxation_cannot_be_equivalent(self):
        forged = json.loads(json.dumps(self.corpus))
        scenario = forged["scenarios"][0]
        scenario["classification"] = "EQUIVALENT"
        with self.assertRaises(AssuranceValidationError):
            validate_corpus(self.root, forged)

    def test_declared_replacement_outcome_must_match_executable_probe(self):
        forged = json.loads(json.dumps(self.corpus))
        scenario = next(
            item for item in forged["scenarios"]
            if item["scenario_id"] == "PROTECTED-POLICY-WRITE"
        )
        scenario["replacement_result"] = "ALLOW"
        scenario["classification"] = "INTENTIONAL_CHANGE"
        with self.assertRaises(AssuranceValidationError):
            validate_corpus(self.root, forged)

    def test_security_relaxation_requires_registered_baseline_authorization(self):
        forged = json.loads(json.dumps(self.corpus))
        scenario = forged["scenarios"][0]
        del scenario["security_relaxation_authorization_ref"]
        with self.assertRaises(AssuranceValidationError):
            validate_corpus(self.root, forged)

    def test_security_sensitive_flag_cannot_disable_relaxation_gate(self):
        forged = json.loads(json.dumps(self.corpus))
        scenario = forged["scenarios"][0]
        scenario["security_sensitive"] = False
        with self.assertRaises(AssuranceValidationError):
            validate_corpus(self.root, forged)

    def test_domain_binding_cannot_be_reclassified(self):
        forged = json.loads(json.dumps(self.corpus))
        scenario = forged["scenarios"][0]
        scenario["domain"] = "documentation"
        with self.assertRaises(AssuranceValidationError):
            validate_corpus(self.root, forged)

    def test_replacement_test_binding_is_executable_and_exact(self):
        forged = json.loads(json.dumps(self.corpus))
        scenario = next(
            item for item in forged["scenarios"]
            if item["scenario_id"] == "PROTECTED-POLICY-WRITE"
        )
        scenario["replacement_test"] = "probe:PREWB-PLANNING-ADMITTED"
        with self.assertRaises(AssuranceValidationError):
            validate_corpus(self.root, forged)

    def test_activated_wiring_rejects_correct_blob_with_wrong_git_mode(self):
        with tempfile.TemporaryDirectory(prefix="wb5-mode-regression-") as temp_raw:
            clone = Path(temp_raw) / "repo"
            env = os.environ.copy()
            env["GIT_CONFIG_GLOBAL"] = os.devnull
            env["GIT_CONFIG_NOSYSTEM"] = "1"
            subprocess.run(
                ["git", "clone", "--quiet", "--no-hardlinks", str(self.root), str(clone)],
                check=True,
                env=env,
            )
            subprocess.run(
                ["git", "-C", str(clone), "switch", "--detach", self.manifest["baseline_sha"]],
                check=True,
                env=env,
            )
            subprocess.run(
                ["git", "-C", str(clone), "config", "user.name", "WB5 Mode Test"],
                check=True,
                env=env,
            )
            subprocess.run(
                ["git", "-C", str(clone), "config", "user.email", "wb5-mode@example.invalid"],
                check=True,
                env=env,
            )
            subprocess.run(
                ["git", "-C", str(clone), "apply", "--index", "-"],
                input=self.patch,
                check=True,
                env=env,
            )
            subprocess.run(
                ["git", "-C", str(clone), "commit", "-qm", "activated wiring"],
                check=True,
                env=env,
            )
            self.assertEqual(wiring_mode(clone, self.manifest), "ACTIVATED")

            hook = clone / ".githooks/pre-commit"
            hook.chmod(0o644)
            subprocess.run(
                ["git", "-C", str(clone), "add", "--chmod=-x", ".githooks/pre-commit"],
                check=True,
                env=env,
            )
            subprocess.run(
                ["git", "-C", str(clone), "commit", "-qm", "wrong hook mode"],
                check=True,
                env=env,
            )
            with self.assertRaises(AssuranceValidationError):
                wiring_mode(clone, self.manifest)

    def test_requirement_reference_must_exist_at_frozen_baseline(self):
        forged = json.loads(json.dumps(self.corpus))
        forged["scenarios"][0]["accepted_requirement_ref"]["contains"] = (
            "WB-005 invented relaxation"
        )
        with self.assertRaises(AssuranceValidationError):
            validate_corpus(self.root, forged)


if __name__ == "__main__":
    unittest.main()
