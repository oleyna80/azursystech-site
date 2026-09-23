import copy
import unittest

from v1.policy import Event, HARD_STOPS, evaluate
from v1.tests import support as s

ROOT = "/tmp/controller-v1-policy-fixture"


def event(operation, *, paths=(), effect="", metadata=None, branch="feat/test"):
    return Event("codex", operation, ROOT, branch, paths, effect, metadata or {})


class PolicyTests(unittest.TestCase):
    def test_admitted_inert_write_and_write_set_escape(self):
        item = s.capable("EXECUTE")
        self.assertTrue(evaluate(event("write", paths=(".agent/controllers/v1/state.py",)), item).allowed)
        self.assertFalse(evaluate(event("write", paths=("web/app/page.tsx",)), item).allowed)
        self.assertFalse(evaluate(event("write", paths=("../outside",)), item).allowed)
        self.assertFalse(evaluate(event("write", paths=(".agent/controllers/v1/activation/staged/x",)), item).allowed)
        self.assertFalse(evaluate(event("write", paths=(".agent/controllers/v1/state.py",), branch="wrong"), item).allowed)

    def test_live_surface_denied_even_if_write_set_is_broad(self):
        item = s.capable("EXECUTE")
        item["active"]["write_set"] = ["**"]
        self.assertFalse(evaluate(event("write", paths=(".codex/hooks/live.py",)), item).allowed)
        self.assertFalse(evaluate(event("write", paths=(".codex",)), item).allowed)
        self.assertFalse(evaluate(event("write", paths=("governance/authority.md",)), item).allowed)
        self.assertFalse(evaluate(event("write", paths=("governance",)), item).allowed)

    def test_every_external_hard_stop_denied(self):
        item = s.capable("EXECUTE")
        for effect in HARD_STOPS:
            with self.subTest(effect=effect):
                self.assertFalse(evaluate(event("write", paths=(".agent/controllers/v1/state.py",),
                                                effect=effect), item).allowed)

    def test_unknown_state_denied(self):
        self.assertFalse(evaluate(event("read"), {"lifecycle_state": "UNKNOWN"}).allowed)

    def test_exact_subject_push_is_conditional_not_name_denial(self):
        item = s.assured()
        command = "git push origin HEAD:refs/heads/feat/test"
        safe = {"default_branch": "main", "subject_branch_is_protected": False,
                "head_tree": s.CANDIDATE}
        self.assertTrue(evaluate(event("push", metadata={"command": command, **safe}), item).allowed)
        for unsafe in ("git push", "git push --force origin HEAD:refs/heads/feat/test",
                       "git push origin HEAD:refs/heads/main",
                       "git push origin HEAD:refs/heads/feat/test HEAD:refs/heads/other"):
            with self.subTest(command=unsafe):
                self.assertFalse(evaluate(event("push", metadata={"command": unsafe, **safe}), item).allowed)
        self.assertFalse(evaluate(event("push", metadata={"command": command,
                                                          **{**safe, "head_tree": s.TREE}}), item).allowed)
        self.assertFalse(evaluate(event("push", metadata={"command": command,
                                                          "head_tree": s.CANDIDATE}), item).allowed)
        protected = copy.deepcopy(item)
        protected["active"]["subject_branch"] = "main"
        self.assertFalse(evaluate(event("push", branch="main", metadata={
            "command": "git push origin HEAD:refs/heads/main", **safe,
        }), protected).allowed)
