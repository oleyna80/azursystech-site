import subprocess
import tempfile
import unittest
from pathlib import Path

from v1 import gitfacts
from v1.tests import support as s


class GitFactsTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.root = Path(self.temp.name) / "repo"
        self.root.mkdir()
        s.init_repo(self.root)
        (self.root / "docs/changes/test").mkdir(parents=True)
        (self.root / "docs/changes/test/plan.md").write_text("v1\n", encoding="utf-8")
        (self.root / "src").mkdir()
        (self.root / "src/app.py").write_text("one\n", encoding="utf-8")
        self.base = s.commit_all(self.root, "base")

    def tearDown(self):
        self.temp.cleanup()

    def test_nested_cwd_resolves_worktree(self):
        nested = self.root / "src"
        self.assertEqual(gitfacts.worktree_root(nested), self.root.resolve())

    def test_state_path_is_git_private_and_linked_worktrees_are_distinct(self):
        main_path = gitfacts.state_path(self.root)
        linked = Path(self.temp.name) / "linked"
        subprocess.run(
            ["git", "-C", str(self.root), "worktree", "add", "-qb", "feat/linked", str(linked)],
            check=True,
        )
        linked_path = gitfacts.state_path(linked)
        self.assertNotEqual(main_path, linked_path)
        self.assertIn("azursystech", str(main_path))
        self.assertIn("azursystech", str(linked_path))

    def test_changed_and_staged_paths_are_git_native(self):
        (self.root / "src/app.py").write_text("two\n", encoding="utf-8")
        subprocess.run(["git", "-C", str(self.root), "add", "src/app.py"], check=True)
        self.assertEqual(gitfacts.staged_paths(self.root), ("src/app.py",))
        tip = s.commit_all(self.root, "change")
        self.assertEqual(gitfacts.changed_paths(self.root, self.base, tip), ("src/app.py",))

    def test_planning_change_then_revert_is_still_detected(self):
        plan = self.root / "docs/changes/test/plan.md"
        plan.write_text("v2\n", encoding="utf-8")
        s.commit_all(self.root, "planning change")
        plan.write_text("v1\n", encoding="utf-8")
        tip = s.commit_all(self.root, "planning revert")
        self.assertFalse(
            gitfacts.planning_subject_unchanged(
                self.root, self.base, tip, ["docs/changes/test/plan.md"]
            )
        )

    def test_clean_and_ancestor_facts(self):
        self.assertTrue(gitfacts.is_clean(self.root))
        (self.root / "src/app.py").write_text("dirty\n", encoding="utf-8")
        self.assertFalse(gitfacts.is_clean(self.root))
        subprocess.run(["git", "-C", str(self.root), "checkout", "--", "src/app.py"], check=True)
        tip = gitfacts.head_sha(self.root)
        self.assertTrue(gitfacts.is_ancestor(self.root, self.base, tip))


if __name__ == "__main__":
    unittest.main()
