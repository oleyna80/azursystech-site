"""Actual bridge/config invocation regressions with disposable trusted authority."""

from __future__ import annotations

import json
import os
import shutil
import subprocess
import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[4]
sys.path.insert(0, str(ROOT / ".agent"))

from controllers.v1 import cli, storage
from orchestration.dispatcher import DispatchRequest
from orchestration.registry import WorkBlockBinding
from orchestration.tests.support import OrchestrationRepo, REPOSITORY_ID

BASELINE = "be9723c17a27393d01a9769c68ae710529acad94"
INITIATIVE = "docs/changes/native-runtime"
PLANNING = (f"{INITIATIVE}/plan.md", f"{INITIATIVE}/spec.md")
INSTRUCTIONS = (
    "AGENTS.md", ".codex/AGENTS.md", ".codex/instructions.md", ".codex/critic.md",
    ".codex/write-gate.md", "CLAUDE.md", "docs/session-bootstrap.md", "PROJECT_MAP.md",
    "governance/authority.md", ".agent/workflows/sdd-protocol.md", ".agent/ROSTER.md",
    "runtimes/codex/README.md", "runtimes/claude-code/README.md",
)


class BridgeInstallation(OrchestrationRepo):
    def __init__(self) -> None:
        super().__init__()
        # Copy the actual current sources, including an uncommitted candidate under test.
        for relative in (".agent/controllers", ".agent/orchestration", ".githooks", ".claude", ".codex"):
            shutil.copytree(ROOT / relative, self.root / relative,
                            ignore=shutil.ignore_patterns("__pycache__", "*.pyc"))
        (self.root / "scripts").mkdir()
        for name in ("sdlc-v1-bridge.py", "sdlc-v1-bootstrap.py"):
            shutil.copy2(ROOT / "scripts" / name, self.root / "scripts" / name)
        shutil.copy2(ROOT / ".gitignore", self.root / ".gitignore")
        self.base_commit = self.commit_direct("current bridge installation")
        self._git_run("push", "-q", "origin", "main")
        self._git_run("remote", "set-head", "origin", "main")
        self.run_script("sdlc-v1-bootstrap.py", "--root", str(self.root), "install",
                        "--repository", REPOSITORY_ID, "--registry-path", str(self.registry.path), check=True)

    def run_script(self, name: str, *args: str, payload: object = None,
                   raw: str | None = None, check: bool = False) -> subprocess.CompletedProcess[str]:
        return subprocess.run([sys.executable, "-W", "error::ResourceWarning", str(self.root / "scripts" / name), *args],
                              input=raw if raw is not None else json.dumps(payload),
                              capture_output=True, text=True, check=check, cwd=self.root)

    def admit(self, branch: str = "feat/native-runtime"):
        record = self.dispatcher.admit_with_work_block(
            self.root, DispatchRequest(REPOSITORY_ID, "manual-owner", branch),
            lambda admission_id: WorkBlockBinding(
                admission_id, "WB-007", INITIATIVE, PLANNING, ("src/**",),
                (f"{INITIATIVE}/**",), "main", None, False, 2,
            ),
        )
        self._git_run("switch", "-q", record.subject_branch)
        return record

    def open(self, record) -> None:
        for path in PLANNING:
            response = self.runtime("codex", path)
            if "additionalContext" not in response:
                raise AssertionError(response)
            target = self.root / path
            target.parent.mkdir(parents=True, exist_ok=True)
            target.write_text("committed planning\n", encoding="utf-8")
        self.commit_direct("normal planning commit")  # Actual installed pre-commit/commit-msg run.
        payload = dict(admission_id=record.admission_id, work_block_id="WB-007",
                       initiative_ref=INITIATIVE, planning_paths=PLANNING,
                       implementation_write_set=["src/**"], coordination_scope=[f"{INITIATIVE}/**"])
        result = self.run_script("sdlc-v1-bridge.py", "trusted-open", "--payload", json.dumps(payload))
        if result.returncode:
            raise AssertionError(result.stderr)
        if json.loads(result.stdout)["lifecycle_state"] != "DEFINE":
            raise AssertionError(result.stdout)

    def runtime(self, runtime: str, path: str, *, cwd: Path | None = None) -> dict:
        result = self.run_script("sdlc-v1-bridge.py", "runtime", "--runtime", runtime,
                                 payload={"cwd": str(cwd or self.root), "tool_name": "Write",
                                          "tool_input": {"file_path": path}})
        if result.returncode or result.stderr:
            raise AssertionError((result.returncode, result.stderr))
        return json.loads(result.stdout)["hookSpecificOutput"]


class RuntimeBridgeTests(unittest.TestCase):
    def setUp(self) -> None:
        self.repo = BridgeInstallation()
        self.addCleanup(self.repo.cleanup)

    def assert_denied(self, response: dict) -> None:
        self.assertEqual(response["permissionDecision"], "deny")
        self.assertTrue(response["permissionDecisionReason"])
        self.assertNotIn("updatedInput", response)

    def test_no_admission_and_terminal_admission_deny_for_both_runtimes(self) -> None:
        for runtime in ("claude", "codex"):
            self.assert_denied(self.repo.runtime(runtime, PLANNING[0]))
        record = self.repo.admit()
        self.repo.registry.terminalize(record.admission_id, "REVOKED")
        for runtime in ("claude", "codex"):
            self.assert_denied(self.repo.runtime(runtime, PLANNING[0]))
        self.assertIsNone(cli.status(self.repo.root))

    def test_actual_admitted_pre_wb_define_execute_wire_matrix(self) -> None:
        record = self.repo.admit()
        self.assertEqual(record.authority_profile_id, "human-governed")
        self.assertEqual(record.base_commit, self.repo.base_commit)
        claude = self.repo.runtime("claude", PLANNING[0])
        codex = self.repo.runtime("codex", PLANNING[0])
        self.assertEqual(claude["permissionDecision"], "allow")
        self.assertEqual(codex, {"hookEventName": "PreToolUse",
                                "additionalContext": claude["permissionDecisionReason"]})
        self.repo.open(record)
        state_path = storage.resolve_path(self.repo.root)
        before = state_path.read_bytes()
        for runtime in ("claude", "codex"):
            self.assert_denied(self.repo.runtime(runtime, "src/app.txt"))
        self.assertEqual(before, state_path.read_bytes())
        cli.critic(self.repo.root, "ready")
        before = state_path.read_bytes()
        for runtime in ("claude", "codex"):
            allowed = self.repo.runtime(runtime, "src/app.txt")
            self.assertEqual(allowed.get("permissionDecision", "allow"), "allow")
            self.assertNotIn("updatedInput", allowed)
            self.assert_denied(self.repo.runtime(runtime, ".agent/policies/admission-rules.json"))
            self.assert_denied(self.repo.runtime(runtime, "out-of-scope.txt"))
        self.assertEqual(before, state_path.read_bytes())

    def test_runtime_malformed_input_and_missing_config_fail_closed(self) -> None:
        for runtime in ("claude", "codex"):
            for raw in ("{", "[]", "{}"):
                result = self.repo.run_script("sdlc-v1-bridge.py", "runtime", "--runtime", runtime, raw=raw)
                self.assertEqual(result.returncode, 0)
                self.assertEqual(result.stderr, "")
                self.assert_denied(json.loads(result.stdout)["hookSpecificOutput"])
        self.repo.admit()
        config = self.repo.root / ".git/azursystech/installation.json"
        config.unlink()
        self.assert_denied(self.repo.runtime("codex", PLANNING[0]))

    def test_corrupt_controller_state_and_branch_mismatch_are_blocking(self) -> None:
        record = self.repo.admit()
        self.repo.open(record)
        path = storage.resolve_path(self.repo.root)
        saved = path.read_bytes()
        path.write_text("{invalid", encoding="utf-8")  # Explicit isolated fault injection.
        self.assert_denied(self.repo.runtime("codex", "src/app.txt"))
        self.assertEqual(path.read_text(), "{invalid")
        path.write_bytes(saved)
        self.repo.admit("feat/other-active")
        self.assert_denied(self.repo.runtime("codex", PLANNING[0]))
        self.assertEqual(path.read_bytes(), saved)

    def test_linked_worktree_uses_installation_authority_foreign_repository_does_not(self) -> None:
        record = self.repo.admit()
        self.repo._git_run("switch", "-q", "main")
        linked = Path(self.repo.temp.name) / "linked"
        self.repo._git_run("worktree", "add", "-q", str(linked), record.subject_branch)
        nested = linked / "src"
        self.assertIn("additionalContext", self.repo.runtime("codex", "../" + PLANNING[0], cwd=nested))
        foreign = BridgeInstallation()
        self.addCleanup(foreign.cleanup)
        foreign.admit()
        self.assertIn("additionalContext", foreign.runtime("codex", PLANNING[0]))
        denied = self.repo.runtime("codex", PLANNING[0], cwd=foreign.root)
        self.assert_denied(denied)
        self.assertIn("repository", denied["permissionDecisionReason"])
        for operation in ("git-pre-commit", "trusted-publish", "trusted-open"):
            args = [operation, "--root", str(foreign.root)]
            if operation == "trusted-open":
                args += ["--payload", "{}"]
            result = self.repo.run_script("sdlc-v1-bridge.py", *args)
            self.assertEqual(result.returncode, 2)
            self.assertIn("repository", result.stderr)

    def test_config_commands_select_codex_only_and_keep_claude_unchanged(self) -> None:
        for runtime, relative in (("codex", ".codex/hooks.json"), ("claude", ".claude/settings.json")):
            config = json.loads((self.repo.root / relative).read_text())
            for group in config["hooks"]["PreToolUse"]:
                for item in group["hooks"]:
                    command = item["command"]
                    if "consequential" not in command:
                        continue
                    for text, expected in (("git status", "allow"), ("git push --force origin main", "deny")):
                        result = subprocess.run(command, shell=True, cwd=self.repo.root,
                                                input=json.dumps({"tool_name": "Bash", "tool_input": {"command": text}}),
                                                capture_output=True, text=True)
                        self.assertEqual(result.returncode, 0, result.stderr)
                        output = json.loads(result.stdout)["hookSpecificOutput"]
                        if runtime == "codex" and expected == "allow":
                            self.assertEqual(set(output), {"hookEventName", "additionalContext"})
                        else:
                            self.assertEqual(output["permissionDecision"], expected)

    def test_consequential_default_and_failure_protocol(self) -> None:
        payload = {"tool_name": "Bash", "tool_input": {"command": "git status"}}
        default = self.repo.run_script("sdlc-v1-bridge.py", "consequential", payload=payload)
        explicit = self.repo.run_script("sdlc-v1-bridge.py", "consequential", "--runtime", "claude", payload=payload)
        self.assertEqual(default.stdout, explicit.stdout)
        for runtime in ("claude", "codex"):
            malformed = self.repo.run_script("sdlc-v1-bridge.py", "consequential", "--runtime", runtime, raw="{")
            self.assertEqual(malformed.returncode, 2)
            self.assertEqual(malformed.stdout, "")
            self.assertTrue(malformed.stderr.startswith("STOP:"))
            for payload in ({}, [], {"tool_name": "Write"}):
                result = self.repo.run_script("sdlc-v1-bridge.py", "consequential", "--runtime", runtime, payload=payload)
                self.assertEqual(result.returncode, 0)
                self.assert_denied(json.loads(result.stdout)["hookSpecificOutput"])


class CurrentCandidateAssuranceTests(unittest.TestCase):
    def test_current_instruction_entries_choose_controller_v1(self) -> None:
        for relative in INSTRUCTIONS:
            text = (ROOT / relative).read_text(encoding="utf-8")
            with self.subTest(path=relative):
                self.assertIn("Controller v1", text)
        root = (ROOT / "AGENTS.md").read_text()
        self.assertIn("Git-private", root)
        self.assertRegex(root, r"schema[- ]v3")
        self.assertIn("non-authoritative", root)

    def test_ci_has_two_strict_unfiltered_tracks_and_event_provenance(self) -> None:
        workflow = (ROOT / ".github/workflows/control-plane-contracts.yml").read_text()
        self.assertNotIn("paths:", workflow)
        self.assertNotIn("paths-ignore:", workflow)
        self.assertNotIn("continue-on-error", workflow)
        self.assertIn("fetch-depth: 0", workflow)
        self.assertIn("contents: read", workflow)
        self.assertIn(BASELINE, workflow)
        self.assertIn("e167b6ffbe01f3977ca2b738d8c12a17a4004110", workflow)
        for path in (".agent/controllers/v1/tests", ".agent/orchestration/tests", ".agent/assurance/wb5/tests"):
            self.assertIn(path, workflow)
        for token in ("GITHUB_EVENT_PATH", "checkout_sha", "checkout_tree", "checkout_parents", "source_head_sha", "event_base_sha", "synthetic_merge", "returncode", "if: always()"):
            self.assertIn(token, workflow)
        self.assertIn("raise SystemExit", workflow)

    def test_frozen_artifacts_validator_and_five_other_live_paths_unchanged(self) -> None:
        paths = (
            ".agent/assurance/wb5/cutover.patch", ".agent/assurance/wb5/cutover-manifest.json",
            ".agent/assurance/wb5/comparison-corpus.json", ".agent/assurance/wb5/cutover-checklist.md",
            "docs/reports/sdlc-wb005-candidate-binding.json", "scripts/verify-sdlc-replacement.py",
            ".agent/assurance/wb5/validate.py", ".agent/assurance/wb5/comparison.py",
            ".agent/assurance/wb5/rehearsal.py", ".agent/assurance/wb5/environment.py",
            ".claude/settings.json", ".githooks/pre-commit", ".githooks/commit-msg",
            ".githooks/pre-push", "scripts/bootstrap.sh", ".agent/active-work-block.json",
        )
        for relative in paths:
            with self.subTest(path=relative):
                entry = subprocess.check_output(["git", "-C", str(ROOT), "ls-tree", BASELINE, "--", relative], text=True).strip()
                mode, kind, blob = entry.split(None, 3)[:3]
                self.assertEqual(kind, "blob")
                current = ROOT / relative
                self.assertEqual(subprocess.check_output(["git", "hash-object", str(current)], text=True).strip(), blob)
                self.assertEqual("100755" if os.access(current, os.X_OK) else "100644", mode)


if __name__ == "__main__":
    unittest.main()
