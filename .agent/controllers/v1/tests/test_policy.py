from __future__ import annotations

import copy
import datetime as dt
import tempfile
import unittest
from pathlib import Path

from v1.clock import fixed_clock
from v1.recovery import CANONICAL_INACTIVE_TEMPLATE
from v1.runtime import decide

from .support import NOW, ROOT, active_state, capability


class PolicyParityTests(unittest.TestCase):
    def setUp(self) -> None:
        self.state = active_state()

    @staticmethod
    def event(tool: str, payload: dict) -> dict:
        return {"tool_name": tool, "tool_input": payload}

    def assert_parity(self, tool: str, payload: dict, allowed: bool) -> None:
        codex = decide(
            "codex", self.event(tool, payload), self.state, repository_root=ROOT, clock=fixed_clock(NOW)
        )
        claude = decide(
            "claude", self.event(tool, payload), self.state, repository_root=ROOT, clock=fixed_clock(NOW)
        )
        self.assertEqual((codex.allowed, codex.code), (claude.allowed, claude.code))
        self.assertEqual(codex.allowed, allowed)

    def test_edit_write_multiedit_and_bash_share_semantics(self) -> None:
        for tool, payload in (
            ("Edit", {"file_path": "src/a.py"}),
            ("Write", {"file_path": "src/a.py"}),
            ("MultiEdit", {"edits": [{"file_path": "src/a.py"}, {"file_path": "src/b.py"}]}),
            ("Bash", {"command": "touch src/a.py"}),
        ):
            with self.subTest(tool=tool):
                self.assert_parity(tool, payload, True)
        for tool, payload in (
            ("Edit", {"file_path": "outside.py"}),
            ("Write", {"file_path": "outside.py"}),
            ("MultiEdit", {"edits": [{"file_path": "src/a.py"}, {"file_path": "outside.py"}]}),
            ("Bash", {"command": "touch outside.py"}),
        ):
            with self.subTest(tool=tool):
                self.assert_parity(tool, payload, False)

    def test_outer_guard_is_monotonic_deny_only(self) -> None:
        decision = decide(
            "codex",
            self.event("Bash", {"command": "git push --force origin HEAD:main"}),
            self.state,
            repository_root=ROOT,
            clock=fixed_clock(NOW),
        )
        self.assertFalse(decision.allowed)
        self.assertEqual(decision.code, "OUTER_HARD_STOP")

    def test_outer_guard_preserves_static_external_hard_stops(self) -> None:
        for command in (
            "git push origin HEAD:main",
            "rm -rf src/generated",
            "terraform apply",
            "kubectl rollout restart deployment/web",
            "docker push registry.example/image:tag",
            "gh api repos/o/r --method DELETE",
            "psql db -c 'DROP TABLE customers'",
            "sendmail client@example.test",
        ):
            with self.subTest(command=command):
                decision = decide(
                    "codex",
                    self.event("Bash", {"command": command}),
                    self.state,
                    repository_root=ROOT,
                    clock=fixed_clock(NOW),
                )
                self.assertFalse(decision.allowed)
                self.assertEqual(decision.code, "OUTER_HARD_STOP")

    def test_ambiguous_bash_never_falls_through_as_read_only(self) -> None:
        for command in (
            "echo x>outside.py",
            "touch src/a.py; touch outside.py",
            "dd if=/dev/zero of=outside.py count=1",
            "install source.py outside.py",
            "python3 -c 'open(\"outside.py\", \"w\").write(\"x\")'",
            "touch src/$(printf outside).py",
            "cp --target-directory=outside src/a.py",
            "mv -t outside src/a.py",
            "install -t outside src/a.py",
            "git diff --output=outside.patch",
            "git show --ext-diff HEAD",
        ):
            with self.subTest(command=command):
                self.assert_parity("Bash", {"command": command}, False)

    def test_allowed_relative_path_cannot_escape_through_symlink(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            (root / "src").symlink_to(root.parent)
            state = copy.deepcopy(self.state)
            state["repository_root"] = str(root)
            state["capability"]["repository_root"] = str(root)
            for runtime in ("codex", "claude"):
                decision = decide(
                    runtime,
                    self.event("Write", {"file_path": "src/escaped.py"}),
                    state,
                    repository_root=str(root),
                    clock=fixed_clock(NOW),
                )
                self.assertFalse(decision.allowed)
                self.assertEqual(decision.code, "WRITE_PATH_INVALID")

    def test_simple_redirection_is_scoped_to_exact_destination(self) -> None:
        self.assert_parity("Bash", {"command": "printf x>src/a.py"}, True)
        self.assert_parity("Bash", {"command": "printf x>outside.py"}, False)

    def test_proven_read_only_bash_remains_read_only(self) -> None:
        for command in ("git status --short", "sha256sum src/a.py", "rg needle src"):
            with self.subTest(command=command):
                self.assert_parity("Bash", {"command": command}, True)

    def test_opencode_parity_is_not_claimed(self) -> None:
        decision = decide(
            "opencode",
            self.event("Write", {"file_path": "src/a.py"}),
            self.state,
            repository_root=ROOT,
            clock=fixed_clock(NOW),
        )
        self.assertFalse(decision.allowed)
        self.assertEqual(decision.code, "RUNTIME_PARITY_UNVERIFIED")

    def test_new_dispatch_needs_fresh_capability(self) -> None:
        event = {"event_type": "native_dispatch", "tool_name": "SubagentStart", "tool_input": {}}
        allowed = decide(
            "codex", event, self.state, repository_root=ROOT, clock=fixed_clock(NOW)
        )
        self.assertTrue(allowed.allowed)
        stale = copy.deepcopy(self.state)
        stale["capability"] = capability(instant=NOW - dt.timedelta(days=2), suffix="stale")
        denied = decide("codex", event, stale, repository_root=ROOT, clock=fixed_clock(NOW))
        self.assertFalse(denied.allowed)
        self.assertEqual(denied.code, "CAPABILITY_NOT_FRESH")

    def test_only_direct_canonical_lifecycle_invocation_is_special(self) -> None:
        command = "python3 .codex/scripts/lifecycle.py refresh-capability --evidence evidence.json"
        self.assert_parity("Bash", {"command": command}, True)
        compound = f"{command}; touch outside.py"
        self.assert_parity("Bash", {"command": compound}, False)
        arbitrary = "python3 scripts/arbitrary.py"
        self.assert_parity("Bash", {"command": arbitrary}, False)

    def test_open_is_only_allowed_from_canonical_inactive_state(self) -> None:
        inactive = copy.deepcopy(CANONICAL_INACTIVE_TEMPLATE)
        event = self.event(
            "Bash",
            {"command": "python3 .codex/scripts/lifecycle.py open --admission a --controller-binding b --critic-binding c --capability d"},
        )
        for runtime in ("codex", "claude"):
            allowed = decide(runtime, event, inactive, repository_root=ROOT, clock=fixed_clock(NOW))
            self.assertTrue(allowed.allowed)
            incomplete = copy.deepcopy(inactive)
            incomplete.pop("define_history")
            malformed = decide(runtime, event, incomplete, repository_root=ROOT, clock=fixed_clock(NOW))
            self.assertFalse(malformed.allowed)
            denied = decide(runtime, event, self.state, repository_root=ROOT, clock=fixed_clock(NOW))
            self.assertFalse(denied.allowed)


if __name__ == "__main__":
    unittest.main()
