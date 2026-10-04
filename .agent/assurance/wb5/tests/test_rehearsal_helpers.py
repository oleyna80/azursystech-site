import json
import subprocess
import sys
import unittest
from pathlib import Path

AGENT_ROOT = Path(__file__).resolve().parents[3]
REPO_ROOT = AGENT_ROOT.parent
sys.path.insert(0, str(AGENT_ROOT))

from assurance.wb5.rehearsal import verify_candidate_live_wiring
from assurance.wb5.validate import BASELINE_SHA, CANONICAL_PATHS


class Wb5RehearsalHelperTests(unittest.TestCase):
    def test_source_candidate_has_baseline_live_wiring(self):
        manifest = json.loads(
            (REPO_ROOT / CANONICAL_PATHS["manifest"]).read_text(encoding="utf-8")
        )
        binding = REPO_ROOT / "docs/reports/sdlc-wb005-candidate-binding.json"
        if binding.exists():
            candidate = json.loads(binding.read_text(encoding="utf-8"))[
                "replacement_candidate_sha"
            ]
        else:
            candidate = subprocess.check_output(
                ["git", "-C", str(REPO_ROOT), "rev-parse", "HEAD"],
                text=True,
            ).strip()
        verify_candidate_live_wiring(REPO_ROOT, candidate, manifest)

    def test_patch_applies_cleanly_to_current_candidate(self):
        patch = REPO_ROOT / CANONICAL_PATHS["patch"]
        result = subprocess.run(
            ["git", "-C", str(REPO_ROOT), "apply", "--check", str(patch)],
            capture_output=True,
            text=True,
        )
        self.assertEqual(result.returncode, 0, result.stderr)


if __name__ == "__main__":
    unittest.main()
