import unittest

from v1 import events
from v1.errors import ValidationError


ROOT = "/tmp/worktree"
SHA = "a" * 40


class EventTests(unittest.TestCase):
    def test_structured_write_contract(self):
        item = events.validate({
            "event_version": 1,
            "source": "claude",
            "kind": "structured_write",
            "worktree_root": ROOT,
            "branch": "feat/test",
            "paths": ["src/app.py"],
            "facts": {"tool_class": "edit"},
        })
        self.assertEqual(item.kind, "structured_write")
        self.assertEqual(item.paths, ("src/app.py",))

    def test_unknown_fields_fail_closed(self):
        raw = {
            "event_version": 1, "source": "claude", "kind": "structured_write",
            "worktree_root": ROOT, "branch": "feat/test", "paths": ["src/app.py"],
            "facts": {"tool_class": "edit"}, "extra": True,
        }
        with self.assertRaises(ValidationError):
            events.validate(raw)

    def test_paths_must_be_exact_sorted_unique(self):
        for paths in (["b.py", "a.py"], ["a.py", "a.py"], ["../x"], ["src/*.py"]):
            with self.subTest(paths=paths), self.assertRaises(ValidationError):
                events.validate({
                    "event_version": 1, "source": "codex", "kind": "structured_write",
                    "worktree_root": ROOT, "branch": "feat/test", "paths": paths,
                    "facts": {"tool_class": "patch"},
                })

    def test_commit_message_contract(self):
        item = events.validate({
            "event_version": 1, "source": "git", "kind": "git_commit_message",
            "worktree_root": ROOT, "branch": "feat/test", "paths": [],
            "facts": {"work_block_trailers": ["WB-001"]},
        })
        self.assertEqual(item.facts["work_block_trailers"], ["WB-001"])
        with self.assertRaises(ValidationError):
            events.validate({
                "event_version": 1, "source": "git", "kind": "git_commit_message",
                "worktree_root": ROOT, "branch": "feat/test", "paths": [],
                "facts": {"work_block_trailers": ["WB-01"]},
            })

    def test_pre_push_contract_accepts_zero_remote_sha(self):
        item = events.validate({
            "event_version": 1, "source": "git", "kind": "git_pre_push",
            "worktree_root": ROOT, "branch": "feat/test", "paths": [],
            "facts": {
                "remote_name": "origin",
                "local_ref": "refs/heads/feat/test",
                "local_sha": SHA,
                "remote_ref": "refs/heads/feat/test",
                "remote_sha": "0" * 40,
            },
        })
        self.assertEqual(item.facts["remote_sha"], "0" * 40)

    def test_decision_contract(self):
        item = events.decision("ALLOW", "WRITE_IMPLEMENTATION_ALLOWED", "inside scope")
        self.assertTrue(item.allowed)
        self.assertEqual(item.as_dict()["decision_version"], 1)


if __name__ == "__main__":
    unittest.main()
