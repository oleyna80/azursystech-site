import copy
import tempfile
import unittest
from pathlib import Path

from v1 import git_adapter, gitfacts, state
from v1.errors import ValidationError
from v1.tests import support as s


class GitAdapterTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.root = Path(self.temp.name) / "repo"
        self.root.mkdir()
        s.init_repo(self.root)
        (self.root / ".agent/controllers/v1").mkdir(parents=True)
        (self.root / ".agent/controllers/v1/state.py").write_text("base\n", encoding="utf-8")
        (self.root / "docs/engineering-memory").mkdir(parents=True)
        self.base = s.commit_all(self.root, "base")

    def tearDown(self):
        self.temp.cleanup()

    def test_pre_commit_event_uses_actual_index_paths(self):
        source = self.root / ".agent/controllers/v1/state.py"
        source.write_text("changed\n", encoding="utf-8")
        outside = self.root / "outside.txt"
        outside.write_text("outside\n", encoding="utf-8")
        import subprocess
        subprocess.run(
            ["git", "-C", str(self.root), "add", ".agent/controllers/v1/state.py", "outside.txt"],
            check=True,
        )
        event = git_adapter.pre_commit_event(self.root)
        self.assertEqual(event.kind, "git_pre_commit")
        self.assertEqual(
            event.paths,
            (".agent/controllers/v1/state.py", "outside.txt"),
        )
        self.assertEqual(event.facts["head_sha"], self.base)

    def test_pre_commit_evaluation_uses_shared_policy(self):
        source = self.root / ".agent/controllers/v1/state.py"
        source.write_text("changed\n", encoding="utf-8")
        import subprocess
        subprocess.run(["git", "-C", str(self.root), "add", str(source)], check=True)
        allowed = git_adapter.evaluate_pre_commit(
            self.root,
            s.execute(),
            default_branch="main",
        )
        self.assertEqual(allowed.code, "COMMIT_ALLOWED")

        outside = self.root / "outside.txt"
        outside.write_text("outside\n", encoding="utf-8")
        subprocess.run(["git", "-C", str(self.root), "add", "outside.txt"], check=True)
        denied = git_adapter.evaluate_pre_commit(
            self.root,
            s.execute(),
            default_branch="main",
        )
        self.assertEqual(denied.code, "COMMIT_SCOPE_DENIED")

    def test_commit_message_uses_git_interpret_trailers(self):
        message = self.root / "COMMIT_EDITMSG.fixture"
        message.write_text(
            "test commit\n\nOther: value\nWork-Block: WB-001\n",
            encoding="utf-8",
        )
        event = git_adapter.commit_message_event(self.root, message)
        self.assertEqual(event.facts["work_block_trailers"], ["WB-001"])
        result = git_adapter.evaluate_commit_message(self.root, s.execute(), message)
        self.assertEqual(result.code, "COMMIT_MESSAGE_ALLOWED")

    def test_commit_message_dot_git_path_resolves_in_linked_worktree(self):
        import subprocess
        linked = Path(self.temp.name) / "linked"
        subprocess.run(
            ["git", "-C", str(self.root), "worktree", "add", "-qb", "feat/linked-msg", str(linked)],
            check=True,
        )
        git_message = Path(
            subprocess.check_output(
                [
                    "git", "-C", str(linked), "rev-parse", "--path-format=absolute",
                    "--git-path", "COMMIT_EDITMSG",
                ],
                text=True,
            ).strip()
        )
        git_message.write_text(
            "linked commit\n\nWork-Block: WB-001\n",
            encoding="utf-8",
        )
        event = git_adapter.commit_message_event(
            linked,
            Path(".git/COMMIT_EDITMSG"),
        )
        self.assertEqual(event.facts["work_block_trailers"], ["WB-001"])

    def test_duplicate_work_block_trailers_are_preserved_for_policy_denial(self):
        message = self.root / "COMMIT_EDITMSG.fixture"
        message.write_text(
            "test\n\nWork-Block: WB-001\nWork-Block: WB-001\n",
            encoding="utf-8",
        )
        event = git_adapter.commit_message_event(self.root, message)
        self.assertEqual(event.facts["work_block_trailers"], ["WB-001", "WB-001"])
        result = git_adapter.evaluate_commit_message(self.root, s.execute(), message)
        self.assertEqual(result.code, "COMMIT_MESSAGE_TRAILER_DUPLICATE")

    def assured_state_at_head(self):
        head = gitfacts.head_sha(self.root)
        item = copy.deepcopy(s.assured())
        item["active"]["base_commit"] = self.base
        item["active"]["planning_subject"]["revision"] = self.base
        item["active"]["critic"]["subject_revision"] = self.base
        item["active"]["source_candidate_sha"] = head
        item["active"]["reviewer"] = {"status": "READY", "candidate_sha": head}
        item["active"]["verifier"] = {"status": "READY", "candidate_sha": head}
        state.validate(item)
        return item, head

    def test_pre_push_single_exact_subject_ref_is_allowed(self):
        item, head = self.assured_state_at_head()
        stdin = f"refs/heads/feat/test {head} refs/heads/feat/test {'0' * 40}\n"
        events = git_adapter.pre_push_events(self.root, "origin", stdin)
        self.assertEqual(len(events), 1)
        result = git_adapter.evaluate_pre_push(
            self.root,
            item,
            remote_name="origin",
            stdin_text=stdin,
            default_branch="main",
            branch_protection_resolver=lambda _remote, _branch: False,
        )
        self.assertEqual(result.code, "PUSH_ALLOWED")

    def test_pre_push_explicit_head_refspec_is_canonicalized_to_attached_subject(self):
        item, head = self.assured_state_at_head()
        stdin = f"HEAD {head} refs/heads/feat/test {'0' * 40}\n"
        events = git_adapter.pre_push_events(self.root, "origin", stdin)
        self.assertEqual(events[0].facts["local_ref"], "refs/heads/feat/test")
        result = git_adapter.evaluate_pre_push(
            self.root,
            item,
            remote_name="origin",
            stdin_text=stdin,
            default_branch="main",
            branch_protection_resolver=lambda _remote, _branch: False,
        )
        self.assertEqual(result.code, "PUSH_ALLOWED")

    def test_pre_push_head_alias_with_non_head_sha_fails_closed(self):
        marker = self.root / "later.txt"
        marker.write_text("later\n", encoding="utf-8")
        import subprocess
        subprocess.run(
            ["git", "-C", str(self.root), "add", "later.txt"],
            check=True,
        )
        subprocess.run(
            ["git", "-C", str(self.root), "commit", "-qm", "later"],
            check=True,
        )

        _item, head = self.assured_state_at_head()
        stale_sha = self.base
        self.assertNotEqual(stale_sha, head)
        stdin = f"HEAD {stale_sha} refs/heads/feat/test {'0' * 40}\n"
        with self.assertRaises(ValidationError):
            git_adapter.pre_push_events(self.root, "origin", stdin)

    def test_pre_push_multiple_refs_denies_whole_push_if_one_ref_is_invalid(self):
        item, head = self.assured_state_at_head()
        zero = "0" * 40
        stdin = (
            f"refs/heads/feat/test {head} refs/heads/feat/test {zero}\n"
            f"refs/heads/other {head} refs/heads/other {zero}\n"
        )
        result = git_adapter.evaluate_pre_push(
            self.root,
            item,
            remote_name="origin",
            stdin_text=stdin,
            default_branch="main",
            branch_protection_resolver=lambda _remote, _branch: False,
        )
        self.assertFalse(result.allowed)
        self.assertEqual(result.code, "PUSH_REF_DENIED")

    def test_pre_push_unknown_protection_status_fails_closed(self):
        item, head = self.assured_state_at_head()
        stdin = f"refs/heads/feat/test {head} refs/heads/feat/test {'0' * 40}\n"
        result = git_adapter.evaluate_pre_push(
            self.root,
            item,
            remote_name="origin",
            stdin_text=stdin,
            default_branch="main",
            branch_protection_resolver=None,
        )
        self.assertEqual(result.code, "PUSH_PROTECTED_STATUS_UNKNOWN")

    def test_pre_push_malformed_native_line_is_rejected(self):
        with self.assertRaises(ValidationError):
            git_adapter.pre_push_events(self.root, "origin", "too few fields\n")

    def test_git_native_exit_mapping(self):
        item, head = self.assured_state_at_head()
        stdin = f"refs/heads/feat/test {head} refs/heads/feat/test {'0' * 40}\n"
        result = git_adapter.evaluate_pre_push(
            self.root,
            item,
            remote_name="origin",
            stdin_text=stdin,
            default_branch="main",
            branch_protection_resolver=lambda _remote, _branch: False,
        )
        self.assertEqual(git_adapter.exit_status(result), (0, ""))


if __name__ == "__main__":
    unittest.main()
