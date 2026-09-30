import subprocess
import tempfile
import unittest
from pathlib import Path
from types import SimpleNamespace

from v1 import events, gitfacts, policy, state
from v1.tests import support as s


def ev(kind, *, paths=None, branch="feat/test", facts=None, source=None, root="/tmp/worktree"):
    source = source or ("git" if kind.startswith("git_") else "codex")
    return events.Event(
        1, source, kind, root, branch,
        tuple(paths or ()),
        facts or {},
    )


class PolicyTests(unittest.TestCase):
    def test_pre_wb_requires_admission_and_docs_changes_only(self):
        admission = SimpleNamespace(
            admission_id="adm-1",
            repository="fixture/repo",
            subject_branch="feat/test",
            base_commit="a" * 40,
        )
        ok = policy.evaluate(
            ev("structured_write", paths=("docs/changes/x/intent.md",), facts={"tool_class": "write"}),
            None,
            admission=admission,
            repository_id="fixture/repo",
        )
        self.assertEqual(ok.code, "WRITE_PLANNING_ALLOWED")
        self.assertFalse(
            policy.evaluate(
                ev("structured_write", paths=("src/app.py",), facts={"tool_class": "write"}),
                None,
                admission=admission,
                repository_id="fixture/repo",
            ).allowed
        )
        self.assertEqual(
            policy.evaluate(
                ev("structured_write", paths=("docs/changes/x/intent.md",), facts={"tool_class": "write"}),
                None,
            ).code,
            "STATE_MISSING",
        )

    def test_protected_policy_surface_is_denied(self):
        result = policy.evaluate(
            ev("structured_write", paths=(".agent/policies/admission-rules.json",), facts={"tool_class": "edit"}),
            s.execute(),
        )
        self.assertFalse(result.allowed)
        self.assertEqual(result.code, "COMMIT_FORBIDDEN_PATH")

    def test_define_execute_assure_write_rules(self):
        define = s.opened()
        self.assertTrue(policy.evaluate(
            ev("structured_write", paths=(f"{s.INITIATIVE}/plan.md",), facts={"tool_class": "edit"}),
            define,
        ).allowed)
        self.assertFalse(policy.evaluate(
            ev("structured_write", paths=(".agent/controllers/v1/state.py",), facts={"tool_class": "edit"}),
            define,
        ).allowed)

        execute = s.execute()
        self.assertEqual(policy.evaluate(
            ev("structured_write", paths=(".agent/controllers/v1/state.py",), facts={"tool_class": "edit"}),
            execute,
        ).code, "WRITE_IMPLEMENTATION_ALLOWED")
        self.assertEqual(policy.evaluate(
            ev("structured_write", paths=(f"{s.INITIATIVE}/plan.md",), facts={"tool_class": "edit"}),
            execute,
        ).code, "WRITE_PLANNING_STAGE_DENIED")

        assure = s.assure()
        self.assertFalse(policy.evaluate(
            ev("structured_write", paths=(".agent/controllers/v1/state.py",), facts={"tool_class": "edit"}),
            assure,
        ).allowed)
        self.assertTrue(policy.evaluate(
            ev("structured_write", paths=("docs/engineering-memory/note.md",), facts={"tool_class": "write"}),
            assure,
        ).allowed)


    def test_execute_allows_mixed_implementation_and_coordination_targets(self):
        result = policy.evaluate(
            ev(
                "structured_write",
                paths=(
                    ".agent/controllers/v1/state.py",
                    "docs/engineering-memory/note.md",
                ),
                facts={"tool_class": "patch"},
            ),
            s.execute(),
        )
        self.assertTrue(result.allowed)
        self.assertEqual(result.code, "WRITE_IMPLEMENTATION_ALLOWED")

    def test_branch_mismatch_denied(self):
        result = policy.evaluate(
            ev("structured_write", branch="feat/wrong", paths=(".agent/controllers/v1/state.py",), facts={"tool_class": "write"}),
            s.execute(),
        )
        self.assertEqual(result.code, "BRANCH_MISMATCH")

    def test_commit_message_traceability_only(self):
        active = s.execute()
        good = policy.evaluate(
            ev("git_commit_message", paths=(), source="git",
               facts={"work_block_trailers": ["WB-001"]}),
            active,
        )
        self.assertEqual(good.code, "COMMIT_MESSAGE_ALLOWED")
        missing = policy.evaluate(
            ev("git_commit_message", paths=(), source="git",
               facts={"work_block_trailers": []}),
            active,
        )
        self.assertEqual(missing.code, "COMMIT_MESSAGE_TRAILER_MISSING")
        self.assertTrue(policy.evaluate(
            ev("git_commit_message", paths=(), source="git",
               facts={"work_block_trailers": []}),
            state.INACTIVE,
        ).allowed)

    def test_precommit_default_branch_and_scope(self):
        event = ev("git_pre_commit", paths=(".agent/controllers/v1/state.py",), source="git",
                   facts={"head_sha": "a" * 40})
        self.assertTrue(policy.evaluate(event, s.execute(), default_branch="main").allowed)
        main = ev("git_pre_commit", paths=(".agent/controllers/v1/state.py",), branch="main", source="git",
                  facts={"head_sha": "a" * 40})
        self.assertEqual(policy.evaluate(main, s.execute(), default_branch="main").code,
                         "COMMIT_DEFAULT_BRANCH_DENIED")

    def test_precommit_protected_deletion_is_denied_from_git_paths(self):
        with tempfile.TemporaryDirectory() as folder:
            root = Path(folder)
            s.init_repo(root)
            protected = root / ".agent/policies/admission-rules.json"
            protected.parent.mkdir(parents=True)
            protected.write_text("{}\n", encoding="utf-8")
            s.commit_all(root, "protected base")
            protected.unlink()
            subprocess.run(["git", "-C", str(root), "add", "-u"], check=True)
            paths = gitfacts.staged_paths(root)
            self.assertEqual(paths, (".agent/policies/admission-rules.json",))
            event = ev(
                "git_pre_commit",
                paths=paths,
                source="git",
                facts={"head_sha": gitfacts.head_sha(root)},
                root=str(root),
            )
            result = policy.evaluate(event, s.execute(), default_branch="main")
            self.assertEqual(result.code, "COMMIT_FORBIDDEN_PATH")

    def test_post_candidate_implementation_deletion_is_denied(self):
        with tempfile.TemporaryDirectory() as folder:
            root = Path(folder)
            s.init_repo(root)
            source = root / ".agent/controllers/v1/state.py"
            source.parent.mkdir(parents=True)
            source.write_text("v1\n", encoding="utf-8")
            for path in s.PLANNING_PATHS:
                full = root / path
                full.parent.mkdir(parents=True, exist_ok=True)
                full.write_text(path + "\n", encoding="utf-8")
            base = s.commit_all(root, "candidate")
            item = s.assured()
            item["active"]["base_commit"] = base
            item["active"]["planning_subject"]["revision"] = base
            item["active"]["critic"]["subject_revision"] = base
            item["active"]["source_candidate_sha"] = base
            item["active"]["reviewer"]["candidate_sha"] = base
            item["active"]["verifier"]["candidate_sha"] = base
            source.unlink()
            deleted_tip = s.commit_all(root, "delete implementation")
            self.assertFalse(policy.post_candidate_history_allowed(root, item, deleted_tip))

    def test_post_candidate_history_allows_coordination_only_and_rejects_source_revert(self):
        with tempfile.TemporaryDirectory() as folder:
            root = Path(folder)
            s.init_repo(root)
            (root / ".agent/controllers/v1").mkdir(parents=True)
            (root / ".agent/controllers/v1/state.py").write_text("v1\n", encoding="utf-8")
            (root / "docs/changes/sdlc-test/work-blocks").mkdir(parents=True)
            for path in s.PLANNING_PATHS:
                full = root / path
                full.parent.mkdir(parents=True, exist_ok=True)
                full.write_text(path + "\n", encoding="utf-8")
            (root / "docs/engineering-memory").mkdir(parents=True)
            base = s.commit_all(root, "candidate")
            item = s.assured()
            item["active"]["base_commit"] = base
            item["active"]["planning_subject"]["revision"] = base
            item["active"]["critic"]["subject_revision"] = base
            item["active"]["source_candidate_sha"] = base
            item["active"]["reviewer"]["candidate_sha"] = base
            item["active"]["verifier"]["candidate_sha"] = base

            (root / "docs/engineering-memory/note.md").write_text("note\n", encoding="utf-8")
            coord_tip = s.commit_all(root, "coord")
            self.assertTrue(policy.post_candidate_history_allowed(root, item, coord_tip))

            source = root / ".agent/controllers/v1/state.py"
            source.write_text("v2\n", encoding="utf-8")
            s.commit_all(root, "source change")
            source.write_text("v1\n", encoding="utf-8")
            reverted_tip = s.commit_all(root, "source revert")
            self.assertFalse(policy.post_candidate_history_allowed(root, item, reverted_tip))


if __name__ == "__main__":
    unittest.main()
