import subprocess
import tempfile
import unittest
from pathlib import Path

from v1 import adapters, hook, policy, state, storage
from v1.errors import ValidationError
from v1.tests import support as s


class RuntimeAdapterTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.root = Path(self.temp.name) / "repo"
        self.root.mkdir()
        s.init_repo(self.root)
        (self.root / ".agent/controllers/v1").mkdir(parents=True)
        (self.root / ".agent/controllers/v1/state.py").write_text("x\n", encoding="utf-8")
        s.commit_all(self.root, "base")

    def tearDown(self):
        self.temp.cleanup()

    def raw(self, tool_name, tool_input):
        return {"cwd": str(self.root), "tool_name": tool_name, "tool_input": tool_input}

    def test_claude_codex_structured_write_parity(self):
        current = s.execute()
        claude = adapters.normalize_structured_write(
            "claude",
            self.raw("Write", {"file_path": ".agent/controllers/v1/state.py"}),
        )
        codex = adapters.normalize_structured_write(
            "codex",
            self.raw("Write", {"file_path": ".agent/controllers/v1/state.py"}),
        )
        self.assertEqual(claude.paths, codex.paths)
        self.assertEqual(claude.kind, codex.kind)
        a = policy.evaluate(claude, current)
        b = policy.evaluate(codex, current)
        self.assertEqual((a.decision, a.code), (b.decision, b.code))

    def test_codex_patch_extracts_all_exact_paths(self):
        event = adapters.normalize_structured_write(
            "codex",
            self.raw(
                "apply_patch",
                {
                    "command": (
                        "*** Begin Patch\n"
                        "*** Update File: .agent/controllers/v1/state.py\n"
                        "*** Move to: .agent/controllers/v1/state2.py\n"
                        "*** Add File: .agent/controllers/v1/new.py\n"
                        "*** End Patch\n"
                    )
                },
            ),
        )
        self.assertEqual(
            event.paths,
            (
                ".agent/controllers/v1/new.py",
                ".agent/controllers/v1/state.py",
                ".agent/controllers/v1/state2.py",
            ),
        )
        self.assertEqual(event.facts["tool_class"], "patch")

    def test_absolute_path_inside_worktree_normalizes_and_outside_denies(self):
        inside = self.root / ".agent/controllers/v1/state.py"
        event = adapters.normalize_structured_write(
            "claude", self.raw("Edit", {"file_path": str(inside)})
        )
        self.assertEqual(event.paths, (".agent/controllers/v1/state.py",))
        with self.assertRaises(ValidationError):
            adapters.normalize_structured_write(
                "claude", self.raw("Edit", {"file_path": "/tmp/outside.py"})
            )

    def test_opaque_bash_never_becomes_structured_authority(self):
        raw = self.raw("Bash", {"command": "echo x > .agent/controllers/v1/x.py"})
        with self.assertRaises(ValidationError):
            adapters.normalize_structured_write("claude", raw)
        result = hook.evaluate_runtime(
            "claude", raw, installation_root=self.root
        )
        self.assertFalse(result.allowed)
        self.assertEqual(result.code, "STATE_INVALID")

    def test_missing_exact_path_fails_closed(self):
        with self.assertRaises(ValidationError):
            adapters.normalize_structured_write(
                "codex", self.raw("Write", {})
            )
        with self.assertRaises(ValidationError):
            adapters.normalize_structured_write(
                "codex", self.raw("apply_patch", {"command": "*** Begin Patch\n*** End Patch"})
            )

    def test_runtime_native_responses_have_same_permission_semantics(self):
        decision = policy.evaluate(
            adapters.normalize_structured_write(
                "claude",
                self.raw("Write", {"file_path": ".agent/controllers/v1/state.py"}),
            ),
            s.execute(),
        )
        claude = adapters.runtime_response("claude", decision)
        codex = adapters.runtime_response("codex", decision)
        self.assertEqual(
            claude["hookSpecificOutput"]["permissionDecision"],
            codex["hookSpecificOutput"]["permissionDecision"],
        )
        self.assertEqual(
            claude["hookSpecificOutput"]["permissionDecisionReason"],
            codex["hookSpecificOutput"]["permissionDecisionReason"],
        )

    def test_same_common_repo_linked_worktree_allowed_different_repo_denied(self):
        linked = Path(self.temp.name) / "linked"
        subprocess.run(
            ["git", "-C", str(self.root), "worktree", "add", "-qb", "feat/linked", str(linked)],
            check=True,
        )
        nested = linked / ".agent/controllers"
        nested.mkdir(parents=True, exist_ok=True)
        self.assertEqual(
            hook.resolve_bound_worktree(nested, installation_root=self.root),
            linked.resolve(),
        )

        other = Path(self.temp.name) / "other"
        other.mkdir()
        s.init_repo(other, branch="feat/other")
        (other / "x").write_text("x\n", encoding="utf-8")
        s.commit_all(other, "base")
        with self.assertRaises(Exception):
            hook.resolve_bound_worktree(other, installation_root=self.root)

    def test_subagent_context_is_context_only(self):
        current = s.execute()
        storage.write(storage.resolve_path(self.root), current)
        event = adapters.normalize_subagent_context(
            "codex", {"cwd": str(self.root), "agent_type": "reviewer"}
        )
        verdict = policy.evaluate(event, current)
        self.assertEqual(verdict.decision, "ADVISORY")
        response = hook.subagent_context(
            "codex",
            {"cwd": str(self.root), "agent_type": "reviewer"},
            installation_root=self.root,
        )
        text = response["hookSpecificOutput"]["additionalContext"]
        self.assertIn("Work Block WB-001", text)
        self.assertNotIn("session", text.lower())
        self.assertNotIn("execution_id", text.lower())


if __name__ == "__main__":
    unittest.main()
