import subprocess
import tempfile
import unittest
from pathlib import Path

from v1 import adapters, gitfacts, hook, policy, storage
from v1.errors import ValidationError
from v1.tests import support as s


class RuntimeAdapterTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.root = Path(self.temp.name) / "repo"
        self.root.mkdir()
        s.init_repo(self.root)
        (self.root / ".agent/controllers/v1").mkdir(parents=True)
        (self.root / ".agent/controllers/v1/state.py").write_text("base\n", encoding="utf-8")
        s.commit_all(self.root, "base")

    def tearDown(self):
        self.temp.cleanup()

    def raw(self, tool_name, tool_input, *, cwd=None):
        return {
            "cwd": str(cwd or self.root),
            "tool_name": tool_name,
            "tool_input": tool_input,
        }

    def test_claude_codex_structured_write_parity(self):
        claude = adapters.normalize_pre_tool(
            "claude",
            self.raw("Write", {"file_path": ".agent/controllers/v1/state.py"}),
            controller_root=self.root,
        )
        codex = adapters.normalize_pre_tool(
            "codex",
            self.raw("Write", {"file_path": ".agent/controllers/v1/state.py"}),
            controller_root=self.root,
        )
        self.assertEqual(claude.kind, codex.kind)
        self.assertEqual(claude.paths, codex.paths)
        self.assertEqual(dict(claude.facts), dict(codex.facts))
        self.assertEqual(claude.branch, codex.branch)
        self.assertNotEqual(claude.source, codex.source)

        state = s.execute()
        self.assertEqual(policy.evaluate(claude, state).code, policy.evaluate(codex, state).code)

    def test_codex_apply_patch_extracts_only_structured_patch_paths(self):
        event = adapters.normalize_pre_tool(
            "codex",
            self.raw(
                "apply_patch",
                {
                    "command": (
                        "*** Begin Patch\n"
                        "*** Update File: .agent/controllers/v1/state.py\n"
                        "*** Move to: .agent/controllers/v1/state2.py\n"
                        "*** End Patch\n"
                    )
                },
            ),
            controller_root=self.root,
        )
        self.assertEqual(event.kind, "structured_write")
        self.assertEqual(event.facts["tool_class"], "patch")
        self.assertEqual(
            event.paths,
            (
                ".agent/controllers/v1/state.py",
                ".agent/controllers/v1/state2.py",
            ),
        )

    def test_recognized_structured_tool_without_exact_path_fails_closed(self):
        with self.assertRaises(ValidationError):
            adapters.normalize_pre_tool(
                "claude",
                self.raw("Write", {}),
                controller_root=self.root,
            )
        with self.assertRaises(ValidationError):
            adapters.normalize_pre_tool(
                "codex",
                self.raw("apply_patch", {"command": "not a structured patch"}),
                controller_root=self.root,
            )

    def test_bash_is_not_interpreted_as_structured_authority(self):
        event = adapters.normalize_pre_tool(
            "codex",
            self.raw(
                "Bash",
                {"command": "rm -rf .agent/controllers/v1 && touch outside.txt"},
            ),
            controller_root=self.root,
        )
        self.assertEqual(event.kind, "diagnostic")
        self.assertEqual(event.paths, ())
        self.assertEqual(dict(event.facts), {})
        self.assertTrue(policy.evaluate(event, s.execute()).allowed)

    def test_nested_cwd_binds_to_worktree_root(self):
        nested = self.root / ".agent/controllers/v1"
        event = adapters.normalize_pre_tool(
            "claude",
            self.raw("Edit", {"file_path": ".agent/controllers/v1/state.py"}, cwd=nested),
            controller_root=self.root,
        )
        self.assertEqual(Path(event.worktree_root), self.root.resolve())

    def test_linked_worktree_is_allowed_when_common_repository_matches(self):
        linked = Path(self.temp.name) / "linked"
        subprocess.run(
            ["git", "-C", str(self.root), "worktree", "add", "-qb", "feat/linked", str(linked)],
            check=True,
        )
        event = adapters.normalize_pre_tool(
            "codex",
            self.raw("Write", {"file_path": ".agent/controllers/v1/state.py"}, cwd=linked),
            controller_root=self.root,
        )
        self.assertEqual(Path(event.worktree_root), linked.resolve())
        self.assertEqual(event.branch, "feat/linked")

    def test_foreign_repository_cwd_is_rejected(self):
        other = Path(self.temp.name) / "other"
        other.mkdir()
        s.init_repo(other, branch="feat/other")
        (other / "x").write_text("x\n", encoding="utf-8")
        s.commit_all(other, "base")
        with self.assertRaises(ValidationError):
            adapters.normalize_pre_tool(
                "claude",
                self.raw("Write", {"file_path": "x"}, cwd=other),
                controller_root=self.root,
            )

    def test_hook_reads_target_worktree_private_state(self):
        current = s.execute()
        storage.write(gitfacts.state_path(self.root), current)
        response, loaded = hook.evaluate_event(
            "claude",
            self.raw("Write", {"file_path": ".agent/controllers/v1/state.py"}),
            installed_root=self.root,
        )
        self.assertEqual(loaded, current)
        output = response["hookSpecificOutput"]
        self.assertEqual(output["permissionDecision"], "allow")
        self.assertIn("WRITE_IMPLEMENTATION_ALLOWED", output["permissionDecisionReason"])

    def test_subagent_start_is_context_only(self):
        current = s.execute()
        storage.write(gitfacts.state_path(self.root), current)
        response, loaded = hook.evaluate_event(
            "codex",
            {"cwd": str(self.root), "agent_type": "coder", "execution_id": "opaque"},
            event_name="SubagentStart",
            installed_root=self.root,
        )
        self.assertEqual(loaded, current)
        output = response["hookSpecificOutput"]
        self.assertEqual(output["hookEventName"], "SubagentStart")
        context = output["additionalContext"]
        self.assertIn("does not grant or expand authority", context)
        self.assertIn("Work Block=WB-001", context)
        self.assertNotIn("opaque", context)
        self.assertNotIn("execution_id", context.lower())

    def test_native_pretool_response_shape_is_runtime_parity(self):
        result = policy.evaluate(
            adapters.normalize_pre_tool(
                "claude",
                self.raw("Write", {"file_path": ".agent/controllers/v1/state.py"}),
                controller_root=self.root,
            ),
            s.execute(),
        )
        self.assertEqual(
            adapters.pre_tool_response("claude", result),
            adapters.pre_tool_response("codex", result),
        )


if __name__ == "__main__":
    unittest.main()
