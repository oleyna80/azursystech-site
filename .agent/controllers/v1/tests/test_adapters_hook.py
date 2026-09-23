import copy
import unittest
from pathlib import Path

from v1 import hook
from v1.adapters import decide, normalize
from v1.tests import support as s

ROOT = "/tmp/controller-v1-adapter-fixture"


class AdapterHookTests(unittest.TestCase):
    def test_codex_claude_equivalent_events(self):
        item = s.capable("EXECUTE")
        for tool, payload in (
            ("apply_patch", {"patch": "*** Begin Patch\n*** Update File: .agent/controllers/v1/state.py\n*** End Patch"}),
            ("Write", {"file_path": ".agent/controllers/v1/state.py"}),
            ("Bash", {"command": "git push --force origin HEAD:refs/heads/feat/test"}),
        ):
            with self.subTest(tool=tool):
                raw = {"tool_name": tool, "tool_input": payload}
                decisions = [decide(runtime, raw, item, repository_root=ROOT, branch="feat/test")
                             for runtime in ("codex", "claude")]
                self.assertEqual(decisions[0].allowed, decisions[1].allowed)
                self.assertEqual(decisions[0].reason, decisions[1].reason)

    def test_malformed_and_ambiguous_fail_closed(self):
        item = s.capable("EXECUTE")
        for raw in ({"tool_name": "Bash", "tool_input": {"command": "echo hi; touch x"}},
                    {"tool_name": "Write", "tool_input": {}},
                    {"tool_name": "Bash", "tool_input": {"command": "unknown x"}},
                    {"tool_name": "apply_patch", "tool_input": {"patch": "invalid"}}):
            self.assertFalse(decide("codex", raw, item, repository_root=ROOT, branch="feat/test").allowed)

    def test_raw_push_cannot_supply_trusted_publication_facts(self):
        raw = {"tool_name": "Bash", "tool_input": {
            "command": "git push origin HEAD:refs/heads/feat/test"},
            "head_tree": s.CANDIDATE, "default_branch": "main",
            "subject_branch_is_protected": False}
        for runtime in ("codex", "claude"):
            self.assertFalse(decide(runtime, raw, s.assured(), repository_root=ROOT,
                                    branch="feat/test").allowed)

    def test_hook_evaluation_does_not_mutate_state(self):
        item = s.capable("EXECUTE")
        before = copy.deepcopy(item)
        output = hook.evaluate_event("codex", {
            "tool_name": "Write", "tool_input": {"file_path": ".agent/controllers/v1/state.py"},
        }, item, root=Path(ROOT), branch="feat/test")
        self.assertEqual(output["decision"], "ALLOW")
        self.assertEqual(item, before)

    def test_no_activation_payload_or_live_manifest(self):
        package = Path(__file__).resolve().parents[1]
        self.assertFalse((package / "activation").exists())
        self.assertFalse((package / "activation.py").exists())
        self.assertFalse((package / "policy-metadata.json").exists())
