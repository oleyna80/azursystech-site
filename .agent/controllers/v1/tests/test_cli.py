import subprocess
import tempfile
import unittest
from pathlib import Path

from v1 import cli, gitfacts, state, storage
from v1.errors import StopAndPreserve, TransitionDenied
from v1.tests import support as s


class MutableRecord:
    admission_id = "adm-0123456789abcdef"
    repository = "fixture/repo"
    trigger_class = "manual-owner"
    authority_profile_id = "human-governed"
    authority_profile_revision = "4" * 40
    base_ref = "main"
    base_commit = ""
    subject_branch = "feat/test"


class Resolver:
    def __init__(self, record):
        self.record = record

    def resolve(self, admission_id):
        if admission_id != self.record.admission_id:
            raise KeyError(admission_id)
        return self.record


class CliTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.root = Path(self.temp.name) / "repo"
        self.root.mkdir()
        s.init_repo(self.root)
        initiative = self.root / s.INITIATIVE
        (initiative / "work-blocks").mkdir(parents=True)
        for path in s.PLANNING_PATHS:
            full = self.root / path
            full.parent.mkdir(parents=True, exist_ok=True)
            full.write_text(path + "\n", encoding="utf-8")
        (self.root / ".agent/controllers/v1").mkdir(parents=True)
        (self.root / ".agent/controllers/v1/state.py").write_text("initial\n", encoding="utf-8")
        (self.root / "outside.txt").write_text("outside base\n", encoding="utf-8")
        self.base = s.commit_all(self.root, "planning base")
        self.record = MutableRecord()
        self.record.base_commit = self.base
        self.resolver = Resolver(self.record)

    def tearDown(self):
        self.temp.cleanup()

    def open(self):
        return cli.open_with_resolver(
            self.root,
            self.resolver,
            repository_id="fixture/repo",
            admission_id=self.record.admission_id,
            work_block_id="WB-001",
            initiative_ref=s.INITIATIVE,
            planning_paths=s.PLANNING_PATHS,
            implementation_write_set=s.IMPLEMENTATION,
            coordination_scope=s.COORDINATION,
            default_branch="main",
        )

    def test_open_consumes_trusted_record_and_persists_git_private_state(self):
        item = self.open()
        self.assertEqual(item["active"]["base_commit"], self.base)
        self.assertEqual(item["active"]["authority_profile"]["revision"], self.record.authority_profile_revision)
        path = gitfacts.state_path(self.root)
        self.assertTrue(path.exists())
        self.assertEqual(storage.read(path), item)

    def test_open_rejects_repository_and_branch_mismatch(self):
        with self.assertRaises(StopAndPreserve):
            cli.open_with_resolver(
                self.root, self.resolver,
                repository_id="wrong/repo",
                admission_id=self.record.admission_id,
                work_block_id="WB-001",
                initiative_ref=s.INITIATIVE,
                planning_paths=s.PLANNING_PATHS,
                implementation_write_set=s.IMPLEMENTATION,
                coordination_scope=s.COORDINATION,
                default_branch="main",
            )

    def test_standalone_cli_open_has_no_subject_selectable_policy_revision(self):
        result = cli.main(["--root", str(self.root), "open"])
        self.assertEqual(result, 2)

    def test_critic_ready_rejects_unbound_planning_commit(self):
        self.open()
        plan = self.root / f"{s.INITIATIVE}/plan.md"
        plan.write_text("changed\n", encoding="utf-8")
        s.commit_all(self.root, "unbound planning change")
        with self.assertRaises(TransitionDenied):
            cli.critic(self.root, "ready")

    def test_revise_begin_then_bind_is_reachable(self):
        self.open()
        cli.critic(self.root, "ready")
        item = cli.revise_begin(self.root)
        self.assertEqual(item["lifecycle_state"], "DEFINE")
        plan = self.root / f"{s.INITIATIVE}/plan.md"
        plan.write_text("revised\n", encoding="utf-8")
        new_revision = s.commit_all(self.root, "revised plan")
        rebound = cli.revise_bind(
            self.root,
            planning_paths=s.PLANNING_PATHS,
            implementation_write_set=s.IMPLEMENTATION,
            coordination_scope=s.COORDINATION,
        )
        self.assertEqual(rebound["active"]["planning_subject"]["revision"], new_revision)
        self.assertEqual(cli.critic(self.root, "ready")["lifecycle_state"], "EXECUTE")

    def test_candidate_is_committed_head_and_rejects_dirty_state(self):
        self.open()
        cli.critic(self.root, "ready")
        source = self.root / ".agent/controllers/v1/state.py"
        source.write_text("implementation\n", encoding="utf-8")
        expected = s.commit_all(self.root, "implementation")
        candidate = cli.candidate(self.root)
        self.assertEqual(candidate["active"]["source_candidate_sha"], expected)

        # New attempt: reviewer rework then dirty tree cannot freeze.
        cli.reviewer(self.root, "rework")
        source.write_text("dirty\n", encoding="utf-8")
        with self.assertRaises(StopAndPreserve):
            cli.candidate(self.root)

    def test_candidate_rejects_out_of_scope_change(self):
        self.open()
        cli.critic(self.root, "ready")
        (self.root / "outside.txt").write_text("no\n", encoding="utf-8")
        s.commit_all(self.root, "outside")
        with self.assertRaises(StopAndPreserve):
            cli.candidate(self.root)

    def test_candidate_rejects_out_of_scope_deletion(self):
        self.open()
        cli.critic(self.root, "ready")
        (self.root / "outside.txt").unlink()
        s.commit_all(self.root, "delete outside")
        with self.assertRaises(StopAndPreserve):
            cli.candidate(self.root)

    def test_candidate_rejects_out_of_scope_rename_into_implementation(self):
        self.open()
        cli.critic(self.root, "ready")
        subprocess.run(
            [
                "git", "-C", str(self.root), "mv",
                "outside.txt",
                ".agent/controllers/v1/from-outside.txt",
            ],
            check=True,
        )
        s.commit_all(self.root, "rename outside into implementation")
        with self.assertRaises(StopAndPreserve):
            cli.candidate(self.root)

    def test_candidate_rejects_planning_change_then_revert(self):
        self.open()
        cli.critic(self.root, "ready")
        plan = self.root / f"{s.INITIATIVE}/plan.md"
        original = plan.read_text(encoding="utf-8")
        plan.write_text("temporary\n", encoding="utf-8")
        s.commit_all(self.root, "planning changed")
        plan.write_text(original, encoding="utf-8")
        s.commit_all(self.root, "planning reverted")
        with self.assertRaises(StopAndPreserve):
            cli.candidate(self.root)

    def test_reviewer_verifier_and_close_transitions(self):
        self.open()
        cli.critic(self.root, "ready")
        source = self.root / ".agent/controllers/v1/state.py"
        source.write_text("implementation\n", encoding="utf-8")
        s.commit_all(self.root, "implementation")
        cli.candidate(self.root)
        cli.reviewer(self.root, "ready")
        assured = cli.verifier(self.root, "ready")
        self.assertEqual(assured["active"]["verifier"]["status"], "READY")
        self.assertEqual(cli.close(self.root, "cancelled"), state.INACTIVE)


    def test_publish_to_local_bare_remote_verifies_then_clears_state(self):
        remote = Path(self.temp.name) / "remote.git"
        subprocess.run(["git", "init", "--bare", "-q", "--initial-branch=main", str(remote)], check=True)
        subprocess.run(["git", "-C", str(self.root), "remote", "add", "origin", str(remote)], check=True)
        subprocess.run(["git", "-C", str(self.root), "push", "-q", "origin", "HEAD:refs/heads/main"], check=True)

        self.open()
        cli.critic(self.root, "ready")
        source = self.root / ".agent/controllers/v1/state.py"
        source.write_text("implementation\n", encoding="utf-8")
        candidate_sha = s.commit_all(self.root, "implementation")
        cli.candidate(self.root)
        cli.reviewer(self.root, "ready")
        cli.verifier(self.root, "ready")

        # Safe coordination-only commit after the assured source candidate.
        memory = self.root / "docs/engineering-memory"
        memory.mkdir(parents=True, exist_ok=True)
        (memory / "closeout.md").write_text("done\n", encoding="utf-8")
        publish_tip = s.commit_all(self.root, "closeout")

        result = cli.publish(self.root, branch_protection_resolver=lambda _remote, _branch: False)
        self.assertEqual(result, state.INACTIVE)
        self.assertEqual(
            subprocess.check_output(
                ["git", "--git-dir", str(remote), "rev-parse", "refs/heads/feat/test"],
                text=True,
            ).strip(),
            publish_tip,
        )
        self.assertNotEqual(candidate_sha, publish_tip)

    def test_publish_rejects_post_candidate_implementation_rename_into_coordination(self):
        remote = Path(self.temp.name) / "remote-rename.git"
        subprocess.run(
            ["git", "init", "--bare", "-q", "--initial-branch=main", str(remote)],
            check=True,
        )
        subprocess.run(
            ["git", "-C", str(self.root), "remote", "add", "origin", str(remote)],
            check=True,
        )
        subprocess.run(
            ["git", "-C", str(self.root), "push", "-q", "origin", "HEAD:refs/heads/main"],
            check=True,
        )

        self.open()
        cli.critic(self.root, "ready")
        source = self.root / ".agent/controllers/v1/state.py"
        source.write_text("candidate\n", encoding="utf-8")
        s.commit_all(self.root, "candidate")
        cli.candidate(self.root)
        cli.reviewer(self.root, "ready")
        cli.verifier(self.root, "ready")

        memory = self.root / "docs/engineering-memory"
        memory.mkdir(parents=True, exist_ok=True)
        subprocess.run(
            [
                "git", "-C", str(self.root), "mv",
                ".agent/controllers/v1/state.py",
                "docs/engineering-memory/state.py",
            ],
            check=True,
        )
        s.commit_all(self.root, "rename implementation into coordination")

        with self.assertRaises(TransitionDenied):
            cli.publish(
                self.root,
                branch_protection_resolver=lambda _remote, _branch: False,
            )
        self.assertEqual(cli.status(self.root)["lifecycle_state"], "ASSURE")

    def test_publish_rejects_post_candidate_merge_even_when_parent_commits_are_coordination_only(self):
        remote = Path(self.temp.name) / "remote-merge.git"
        subprocess.run(["git", "init", "--bare", "-q", "--initial-branch=main", str(remote)], check=True)
        subprocess.run(["git", "-C", str(self.root), "remote", "add", "origin", str(remote)], check=True)
        subprocess.run(["git", "-C", str(self.root), "push", "-q", "origin", "HEAD:refs/heads/main"], check=True)

        self.open()
        cli.critic(self.root, "ready")
        source = self.root / ".agent/controllers/v1/state.py"
        source.write_text("candidate\n", encoding="utf-8")
        candidate_sha = s.commit_all(self.root, "candidate")
        cli.candidate(self.root)
        cli.reviewer(self.root, "ready")
        cli.verifier(self.root, "ready")

        memory = self.root / "docs/engineering-memory"
        memory.mkdir(parents=True, exist_ok=True)
        subprocess.run(["git", "-C", str(self.root), "branch", "coord-side", candidate_sha], check=True)

        (memory / "merge-note.md").write_text("main\n", encoding="utf-8")
        s.commit_all(self.root, "main coordination")

        subprocess.run(["git", "-C", str(self.root), "switch", "-q", "coord-side"], check=True)
        memory.mkdir(parents=True, exist_ok=True)
        (memory / "merge-note.md").write_text("side\n", encoding="utf-8")
        s.commit_all(self.root, "side coordination")

        subprocess.run(["git", "-C", str(self.root), "switch", "-q", "feat/test"], check=True)
        result = subprocess.run(
            ["git", "-C", str(self.root), "merge", "--no-ff", "coord-side", "-m", "merge coordination"],
            capture_output=True,
            text=True,
        )
        self.assertNotEqual(result.returncode, 0)
        (memory / "merge-note.md").write_text("resolved\n", encoding="utf-8")
        source.write_text("merge-resolution-source-change\n", encoding="utf-8")
        subprocess.run(
            ["git", "-C", str(self.root), "add", "docs/engineering-memory/merge-note.md", ".agent/controllers/v1/state.py"],
            check=True,
        )
        subprocess.run(["git", "-C", str(self.root), "commit", "-qm", "merge coordination resolved"], check=True)

        with self.assertRaises(TransitionDenied):
            cli.publish(self.root, branch_protection_resolver=lambda _remote, _branch: False)
        self.assertEqual(cli.status(self.root)["lifecycle_state"], "ASSURE")

    def test_publish_requires_trusted_unprotected_branch_fact(self):
        remote = Path(self.temp.name) / "remote-protection.git"
        subprocess.run(["git", "init", "--bare", "-q", "--initial-branch=main", str(remote)], check=True)
        subprocess.run(["git", "-C", str(self.root), "remote", "add", "origin", str(remote)], check=True)
        subprocess.run(["git", "-C", str(self.root), "push", "-q", "origin", "HEAD:refs/heads/main"], check=True)

        self.open()
        cli.critic(self.root, "ready")
        source = self.root / ".agent/controllers/v1/state.py"
        source.write_text("implementation\n", encoding="utf-8")
        s.commit_all(self.root, "implementation")
        cli.candidate(self.root)
        cli.reviewer(self.root, "ready")
        cli.verifier(self.root, "ready")

        with self.assertRaises(StopAndPreserve):
            cli.publish(self.root)
        with self.assertRaises(TransitionDenied):
            cli.publish(self.root, branch_protection_resolver=lambda _remote, _branch: True)
        self.assertEqual(cli.status(self.root)["lifecycle_state"], "ASSURE")

    def test_publish_does_not_accept_payload_selected_remote_or_default_branch(self):
        with self.assertRaises(TypeError):
            cli.publish(self.root, remote="evil")
        with self.assertRaises(TypeError):
            cli.publish(self.root, default_branch="fake")

    def test_failed_publish_preserves_assure_state(self):
        remote = Path(self.temp.name) / "remote-failure.git"
        subprocess.run(
            ["git", "init", "--bare", "-q", "--initial-branch=main", str(remote)],
            check=True,
        )
        subprocess.run(
            ["git", "-C", str(self.root), "remote", "add", "origin", str(remote)],
            check=True,
        )
        subprocess.run(
            ["git", "-C", str(self.root), "push", "-q", "origin", "HEAD:refs/heads/main"],
            check=True,
        )

        self.open()
        cli.critic(self.root, "ready")
        source = self.root / ".agent/controllers/v1/state.py"
        source.write_text("implementation\n", encoding="utf-8")
        s.commit_all(self.root, "implementation")
        cli.candidate(self.root)
        cli.reviewer(self.root, "ready")
        cli.verifier(self.root, "ready")
        before = cli.status(self.root)
        subprocess.run(["git", "-C", str(self.root), "remote", "rename", "origin", "missing-origin"], check=True)
        with self.assertRaises(StopAndPreserve):
            cli.publish(self.root, branch_protection_resolver=lambda _remote, _branch: False)
        self.assertEqual(cli.status(self.root), before)
        self.assertEqual(before["lifecycle_state"], "ASSURE")


if __name__ == "__main__":
    unittest.main()
