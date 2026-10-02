import subprocess
import unittest
from pathlib import Path

from v1 import adapters, cli, gitfacts, hook, state, storage
from v1.errors import StopAndPreserve, TransitionDenied
from v1.tests.e2e_support import (
    COORDINATION_SCOPE,
    IMPLEMENTATION_SCOPE,
    INITIATIVE,
    PLANNING_PATHS,
    REPOSITORY_ID,
    SUBJECT_BRANCH,
    WB_ID,
    E2ERepo,
)


class E2ETransactionTests(unittest.TestCase):
    def setUp(self):
        self.fx = E2ERepo()

    def tearDown(self):
        self.fx.cleanup()

    def test_happy_path_has_no_bootstrap_or_bypass(self):
        planning = self.fx.create_planning()
        opened = self.fx.open()
        self.assertEqual(opened["lifecycle_state"], "DEFINE")
        self.assertEqual(opened["active"]["planning_subject"]["revision"], planning)
        self.assertEqual(opened["active"]["admission_id"], self.fx.record.admission_id)

        executing = cli.critic(self.fx.root, "ready")
        self.assertEqual(executing["lifecycle_state"], "EXECUTE")

        assured, candidate = self.fx.assure_candidate()
        self.assertEqual(assured["lifecycle_state"], "ASSURE")
        self.assertEqual(assured["active"]["source_candidate_sha"], candidate)
        self.assertEqual(assured["active"]["reviewer"]["candidate_sha"], candidate)
        self.assertEqual(assured["active"]["verifier"]["candidate_sha"], candidate)

        publish_tip = self.fx.closeout_commit()
        zero = "0" * 40
        stdin = (
            f"refs/heads/{SUBJECT_BRANCH} {publish_tip} "
            f"refs/heads/{SUBJECT_BRANCH} {zero}\n"
        )
        prepush = hook.evaluate_git_pre_push(
            self.fx.root,
            installation_root=self.fx.root,
            remote_name="origin",
            stdin_text=stdin,
            default_branch="main",
            branch_protection_resolver=lambda _remote, _branch: False,
        )
        self.assertEqual(prepush.code, "PUSH_ALLOWED")
        self.assertEqual(cli.status(self.fx.root)["lifecycle_state"], "ASSURE")

        closed = cli.publish(
            self.fx.root,
            branch_protection_resolver=lambda _remote, _branch: False,
        )
        self.assertEqual(closed, state.INACTIVE)
        remote_tip = subprocess.check_output(
            [
                "git", "--git-dir", str(self.fx.remote),
                "rev-parse", f"refs/heads/{SUBJECT_BRANCH}",
            ],
            text=True,
        ).strip()
        self.assertEqual(remote_tip, publish_tip)

    def test_proactive_execute_revision_is_reachable(self):
        executing = self.fx.open_and_execute()
        original_base = executing["active"]["base_commit"]
        cli.revise_begin(self.fx.root)
        plan = self.fx.root / f"{INITIATIVE}/plan.md"
        plan.write_text("revised execute plan\n", encoding="utf-8")
        revision = self.fx.guarded_commit("revise planning")
        rebound = cli.revise_bind(
            self.fx.root,
            planning_paths=PLANNING_PATHS,
            implementation_write_set=IMPLEMENTATION_SCOPE,
            coordination_scope=COORDINATION_SCOPE,
        )
        self.assertEqual(rebound["active"]["planning_subject"]["revision"], revision)
        self.assertEqual(rebound["active"]["base_commit"], original_base)
        self.assertEqual(cli.critic(self.fx.root, "ready")["lifecycle_state"], "EXECUTE")

    def test_proactive_assure_revision_is_reachable(self):
        self.fx.open_and_execute()
        _candidate, old_candidate = self.fx.make_candidate()
        cli.revise_begin(self.fx.root)
        current = cli.status(self.fx.root)
        self.assertEqual(current["lifecycle_state"], "DEFINE")
        self.assertIsNone(current["active"]["source_candidate_sha"])

        plan = self.fx.root / f"{INITIATIVE}/plan.md"
        plan.write_text("revised assure plan\n", encoding="utf-8")
        revision = self.fx.guarded_commit("revise after candidate")
        cli.revise_bind(
            self.fx.root,
            planning_paths=PLANNING_PATHS,
            implementation_write_set=IMPLEMENTATION_SCOPE,
            coordination_scope=COORDINATION_SCOPE,
        )
        ready = cli.critic(self.fx.root, "ready")
        self.assertEqual(ready["lifecycle_state"], "EXECUTE")
        self.assertEqual(ready["active"]["planning_subject"]["revision"], revision)
        self.assertNotEqual(revision, old_candidate)

    def test_critic_blocked_can_revise_bind_and_continue(self):
        self.fx.create_planning()
        self.fx.open()
        blocked = cli.critic(self.fx.root, "blocked")
        self.assertEqual(blocked["lifecycle_state"], "DEFINE")
        plan = self.fx.root / f"{INITIATIVE}/plan.md"
        plan.write_text("critic correction\n", encoding="utf-8")
        self.fx.guarded_commit("critic correction")
        cli.revise_bind(
            self.fx.root,
            planning_paths=PLANNING_PATHS,
            implementation_write_set=IMPLEMENTATION_SCOPE,
            coordination_scope=COORDINATION_SCOPE,
        )
        self.assertEqual(cli.critic(self.fx.root, "ready")["lifecycle_state"], "EXECUTE")

    def test_reviewer_rework_creates_new_candidate(self):
        self.fx.open_and_execute()
        _candidate, first = self.fx.make_candidate("first\n")
        rework = cli.reviewer(self.fx.root, "rework")
        self.assertEqual(rework["lifecycle_state"], "EXECUTE")
        self.assertIsNone(rework["active"]["source_candidate_sha"])

        _candidate, second = self.fx.make_candidate("second\n")
        self.assertNotEqual(first, second)

    def test_verifier_rework_and_evidence_problem_have_distinct_semantics(self):
        self.fx.open_and_execute()
        _candidate, first = self.fx.make_candidate("first\n")
        cli.reviewer(self.fx.root, "ready")
        evidence = cli.verifier(self.fx.root, "evidence-problem")
        self.assertEqual(evidence["lifecycle_state"], "ASSURE")
        self.assertEqual(evidence["active"]["source_candidate_sha"], first)
        self.assertEqual(evidence["active"]["reviewer"]["status"], "READY")
        self.assertEqual(evidence["active"]["verifier"]["status"], "PENDING")

        rework = cli.verifier(self.fx.root, "rework")
        self.assertEqual(rework["lifecycle_state"], "EXECUTE")
        self.assertIsNone(rework["active"]["source_candidate_sha"])
        _candidate, second = self.fx.make_candidate("second\n")
        self.assertNotEqual(first, second)

    def test_reviewer_and_verifier_scope_change_return_to_define(self):
        for actor in ("reviewer", "verifier"):
            with self.subTest(actor=actor):
                fx = self.fx if actor == "reviewer" else E2ERepo()
                try:
                    fx.open_and_execute()
                    fx.make_candidate()
                    if actor == "verifier":
                        cli.reviewer(fx.root, "ready")
                        changed = cli.verifier(fx.root, "scope-change")
                    else:
                        changed = cli.reviewer(fx.root, "scope-change")
                    self.assertEqual(changed["lifecycle_state"], "DEFINE")
                    self.assertEqual(changed["active"]["critic"]["status"], "PENDING")

                    plan = fx.root / f"{INITIATIVE}/plan.md"
                    plan.write_text(f"{actor} scope correction\n", encoding="utf-8")
                    fx.guarded_commit(f"{actor} scope correction")
                    cli.revise_bind(
                        fx.root,
                        planning_paths=PLANNING_PATHS,
                        implementation_write_set=IMPLEMENTATION_SCOPE,
                        coordination_scope=COORDINATION_SCOPE,
                    )
                    self.assertEqual(cli.critic(fx.root, "ready")["lifecycle_state"], "EXECUTE")
                finally:
                    if fx is not self.fx:
                        fx.cleanup()

    def test_linked_worktree_state_is_isolated_and_nested_cwd_is_bound(self):
        self.fx.open_and_execute()
        primary_path = storage.resolve_path(self.fx.root)

        linked = Path(self.fx.temp.name) / "linked"
        subprocess.run(
            [
                "git", "-C", str(self.fx.root), "worktree", "add", "-qb",
                "feat/linked-e2e", str(linked),
            ],
            check=True,
        )
        linked_path = storage.resolve_path(linked)
        self.assertNotEqual(primary_path, linked_path)
        self.assertIsNone(cli.status(linked))

        nested = linked / "src/nested"
        nested.mkdir(parents=True, exist_ok=True)
        event = adapters.normalize_structured_write(
            "codex",
            {
                "cwd": str(nested),
                "tool_name": "Write",
                "tool_input": {"file_path": "child.txt"},
            },
        )
        self.assertEqual(event.worktree_root, str(linked.resolve()))
        self.assertEqual(event.paths, ("src/nested/child.txt",))

    def test_missing_corrupt_and_restart_state_are_fail_closed_or_stable(self):
        raw = {
            "cwd": str(self.fx.root),
            "tool_name": "Write",
            "tool_input": {"file_path": "src/app.txt"},
        }
        missing = hook.evaluate_runtime(
            "codex",
            raw,
            installation_root=self.fx.root,
        )
        self.assertEqual(missing.code, "STATE_MISSING")

        self.fx.create_planning()
        self.fx.open()
        before = self.fx.state_path().read_bytes()
        self.assertEqual(cli.status(self.fx.root)["lifecycle_state"], "DEFINE")
        self.assertEqual(self.fx.state_path().read_bytes(), before)

        self.fx.state_path().write_text("{broken", encoding="utf-8")
        invalid = hook.evaluate_runtime(
            "codex",
            raw,
            installation_root=self.fx.root,
        )
        self.assertEqual(invalid.code, "STATE_INVALID")

    def test_out_of_scope_and_directory_staging_are_denied_from_actual_index(self):
        self.fx.open_and_execute()
        outside = self.fx.root / "outside.txt"
        outside.write_text("outside\n", encoding="utf-8")
        subprocess.run(
            ["git", "-C", str(self.fx.root), "add", "outside.txt"],
            check=True,
        )
        denied = hook.evaluate_git_pre_commit(
            self.fx.root,
            installation_root=self.fx.root,
            default_branch="main",
        )
        self.assertEqual(denied.code, "COMMIT_SCOPE_DENIED")

        narrow = E2ERepo()
        try:
            narrow.open_and_execute(
                implementation_write_set=["src/allowed/**"],
            )
            allowed_dir = narrow.root / "src/allowed"
            forbidden_dir = narrow.root / "src/forbidden"
            allowed_dir.mkdir(parents=True)
            forbidden_dir.mkdir(parents=True)
            (allowed_dir / "good.txt").write_text("good\n", encoding="utf-8")
            (forbidden_dir / "bad.txt").write_text("bad\n", encoding="utf-8")
            subprocess.run(
                ["git", "-C", str(narrow.root), "add", "src"],
                check=True,
            )
            denied_directory = hook.evaluate_git_pre_commit(
                narrow.root,
                installation_root=narrow.root,
                default_branch="main",
            )
            self.assertEqual(denied_directory.code, "COMMIT_SCOPE_DENIED")
        finally:
            narrow.cleanup()

    def test_dirty_candidate_and_planning_change_revert_are_denied(self):
        self.fx.open_and_execute()
        source = self.fx.root / "src/app.txt"
        source.write_text("dirty\n", encoding="utf-8")
        with self.assertRaises(StopAndPreserve):
            cli.candidate(self.fx.root)
        self.fx._run("restore", "src/app.txt")

        plan = self.fx.root / f"{INITIATIVE}/plan.md"
        original = plan.read_text(encoding="utf-8")
        plan.write_text("temporary\n", encoding="utf-8")
        self.fx.commit_direct("invalid planning change")
        plan.write_text(original, encoding="utf-8")
        self.fx.commit_direct("invalid planning revert")
        with self.assertRaises(StopAndPreserve):
            cli.candidate(self.fx.root)

    def test_post_candidate_source_change_revert_is_denied_by_pre_push(self):
        self.fx.open_and_execute()
        self.fx.assure_candidate()
        source = self.fx.root / "src/app.txt"
        original = source.read_text(encoding="utf-8")
        source.write_text("temporary post-candidate\n", encoding="utf-8")
        self.fx.commit_direct("invalid source change")
        source.write_text(original, encoding="utf-8")
        tip = self.fx.commit_direct("invalid source revert")

        zero = "0" * 40
        result = hook.evaluate_git_pre_push(
            self.fx.root,
            installation_root=self.fx.root,
            remote_name="origin",
            stdin_text=(
                f"refs/heads/{SUBJECT_BRANCH} {tip} "
                f"refs/heads/{SUBJECT_BRANCH} {zero}\n"
            ),
            default_branch="main",
            branch_protection_resolver=lambda _remote, _branch: False,
        )
        self.assertEqual(result.code, "PUSH_POST_CANDIDATE_HISTORY_DENIED")
        self.assertEqual(cli.status(self.fx.root)["lifecycle_state"], "ASSURE")

    def test_failed_push_preserves_assure_bytes_and_remote_ref(self):
        self.fx.open_and_execute()
        self.fx.assure_candidate()
        tip = gitfacts.head_sha(self.fx.root)
        before = self.fx.state_path().read_bytes()
        subject_ref = f"refs/heads/{SUBJECT_BRANCH}"

        remote_before = subprocess.run(
            [
                "git", "--git-dir", str(self.fx.remote),
                "show-ref", "--verify", "--quiet", subject_ref,
            ],
            check=False,
        )
        self.assertNotEqual(remote_before.returncode, 0)

        zero = "0" * 40
        preflight = hook.evaluate_git_pre_push(
            self.fx.root,
            installation_root=self.fx.root,
            remote_name="origin",
            stdin_text=(
                f"{subject_ref} {tip} "
                f"{subject_ref} {zero}\n"
            ),
            default_branch="main",
            branch_protection_resolver=lambda _remote, _branch: False,
        )
        self.assertEqual(preflight.code, "PUSH_ALLOWED")

        pre_receive = self.fx.remote / "hooks/pre-receive"
        pre_receive.write_text("#!/bin/sh\nexit 1\n", encoding="utf-8")
        pre_receive.chmod(0o755)

        with self.assertRaises(StopAndPreserve):
            cli.publish(
                self.fx.root,
                branch_protection_resolver=lambda _remote, _branch: False,
            )

        self.assertEqual(self.fx.state_path().read_bytes(), before)
        self.assertEqual(cli.status(self.fx.root)["lifecycle_state"], "ASSURE")
        remote_after = subprocess.run(
            [
                "git", "--git-dir", str(self.fx.remote),
                "show-ref", "--verify", "--quiet", subject_ref,
            ],
            check=False,
        )
        self.assertNotEqual(remote_after.returncode, 0)

    def test_direct_valid_push_then_publish_is_idempotent(self):
        self.fx.open_and_execute()
        self.fx.assure_candidate()
        tip = self.fx.closeout_commit()
        zero = "0" * 40
        stdin = (
            f"refs/heads/{SUBJECT_BRANCH} {tip} "
            f"refs/heads/{SUBJECT_BRANCH} {zero}\n"
        )
        result = hook.evaluate_git_pre_push(
            self.fx.root,
            installation_root=self.fx.root,
            remote_name="origin",
            stdin_text=stdin,
            default_branch="main",
            branch_protection_resolver=lambda _remote, _branch: False,
        )
        self.assertEqual(result.code, "PUSH_ALLOWED")
        self.fx._run(
            "push", "-q", "origin",
            f"HEAD:refs/heads/{SUBJECT_BRANCH}",
        )
        self.assertEqual(cli.status(self.fx.root)["lifecycle_state"], "ASSURE")

        closed = cli.publish(
            self.fx.root,
            branch_protection_resolver=lambda _remote, _branch: False,
        )
        self.assertEqual(closed, state.INACTIVE)

    def test_reporting_only_close_is_git_private_and_reachable(self):
        self.fx.open_and_execute()
        closed = cli.close(self.fx.root, "reporting-only")
        self.assertEqual(closed, state.INACTIVE)
        self.assertEqual(cli.status(self.fx.root), state.INACTIVE)
        self.assertFalse((self.fx.root / ".agent/active-work-block.json").exists())
        self.assertEqual(self.fx.git("status", "--porcelain"), "")

    def test_normal_lifecycle_states_have_reachable_continuations(self):
        self.fx.create_planning()
        define = self.fx.open()
        self.assertEqual(define["lifecycle_state"], "DEFINE")
        execute = cli.critic(self.fx.root, "ready")
        self.assertEqual(execute["lifecycle_state"], "EXECUTE")
        assure, _candidate = self.fx.make_candidate()
        self.assertEqual(assure["lifecycle_state"], "ASSURE")
        cli.reviewer(self.fx.root, "ready")
        cli.verifier(self.fx.root, "ready")
        terminal = cli.close(self.fx.root, "cancelled")
        self.assertEqual(terminal, state.INACTIVE)


if __name__ == "__main__":
    unittest.main()
