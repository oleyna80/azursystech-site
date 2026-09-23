import copy
import json
import subprocess
import tempfile
import unittest
from pathlib import Path

from v1 import cli, state
from v1.errors import TransitionDenied
from v1.tests import support as s


class CliTests(unittest.TestCase):
    def test_transition_success_reachable(self):
        item = s.assured()
        closed = cli.transition(item, "success", {"reason": "assured"}, now=s.VERIFIER_DONE)
        self.assertEqual(closed["lifecycle_state"], "INACTIVE")
        self.assertEqual(closed["history"][-1]["outcome"], "success")

    def test_cli_result_applies_negative_transition_without_bypass(self):
        for role, verdict, phase in (
            ("reviewer", "CHANGES_REQUIRED", "EXECUTE"),
            ("verifier", "FAIL", "EXECUTE"),
            ("reviewer", "SCOPE_CHANGE", "DEFINE"),
        ):
            with self.subTest(verdict=verdict):
                item = s.capable("ASSURE")
                if role == "verifier":
                    item = s.result(item, "reviewer", "READY", "reviewer-first")
                dispatch = s.dispatch_record(item, role, "negative")
                item = cli.transition(item, "dispatch", dispatch)
                result = {**dispatch, "verdict": verdict,
                          "completed_at": s.VERIFIER_DONE if role == "verifier" else s.LATER,
                          "report_path": "reports/negative.md", "findings": ["finding"],
                          "post_repository": copy.deepcopy(dispatch["pre_repository"]),
                          "post_control_surface": copy.deepcopy(dispatch["pre_control_surface"])}
                item = cli.transition(item, "result", result)
                self.assertEqual(item["lifecycle_state"], phase)
                with self.assertRaises(TransitionDenied):
                    cli.transition(item, "dispatch", s.dispatch_record(item, role, "late-ready"))
                with self.assertRaises(TransitionDenied):
                    cli.transition(item, "success", {"reason": "assured"}, now=s.NOW)

    def test_actual_cli_success_with_fixture_repository(self):
        with tempfile.TemporaryDirectory() as folder:
            root = Path(folder)
            package = root / ".agent/controllers/v1"
            package.mkdir(parents=True)
            (package / "marker.txt").write_text("inert", encoding="utf-8")
            subprocess.run(["git", "-C", folder, "init", "-q"], check=True)
            subprocess.run(["git", "-C", folder, "checkout", "-qb", "feat/test"], check=True)
            subprocess.run(["git", "-C", folder, "add", ".agent/controllers/v1/marker.txt"], check=True)
            subprocess.run(["git", "-C", folder, "-c", "user.name=Fixture", "-c",
                            "user.email=fixture@example.invalid", "commit", "-qm", "fixture"], check=True)
            controller_tree = subprocess.check_output(
                ["git", "-C", folder, "rev-parse", "HEAD:.agent/controllers/v1"], text=True,
            ).strip()
            candidate_tree = subprocess.check_output(
                ["git", "-C", folder, "rev-parse", "HEAD^{tree}"], text=True,
            ).strip()
            item = s.assured()
            item["active"]["controller_tree"] = controller_tree
            item["active"]["candidate_id"] = candidate_tree
            for record in item["active"]["dispatches"] + item["active"]["evidence"]:
                if record["role"] != "critic":
                    record["candidate_id"] = candidate_tree
                    record["pre_repository"]["tree"] = candidate_tree
                    if "post_repository" in record:
                        record["post_repository"]["tree"] = candidate_tree
            state.validate(item)
            authority = root / ".agent/active-work-block.json"
            authority.write_text(json.dumps(item), encoding="utf-8")
            payload = root / "reason.json"
            payload.write_text(json.dumps({"reason": "assured"}), encoding="utf-8")
            result = cli.main(["--root", folder, "--state", str(authority),
                               "--payload", str(payload), "success"])
            self.assertEqual(result, 0)
            closed = json.loads(authority.read_text(encoding="utf-8"))
            self.assertEqual(closed["lifecycle_state"], "INACTIVE")
