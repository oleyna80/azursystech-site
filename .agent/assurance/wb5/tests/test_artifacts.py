import json
import sys
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

    def test_requirement_reference_must_exist_at_frozen_baseline(self):
        forged = json.loads(json.dumps(self.corpus))
        forged["scenarios"][0]["accepted_requirement_ref"]["contains"] = (
            "WB-005 invented relaxation"
        )
        with self.assertRaises(AssuranceValidationError):
            validate_corpus(self.root, forged)


if __name__ == "__main__":
    unittest.main()
