"""Disposable orchestration fixtures for WB-004 tests."""

from __future__ import annotations

import json
import subprocess
import sys
import tempfile
from pathlib import Path

AGENT_ROOT = Path(__file__).resolve().parents[2]
if str(AGENT_ROOT) not in sys.path:
    sys.path.insert(0, str(AGENT_ROOT))

from controllers.v1 import cli, hook
from orchestration.dispatcher import DispatchRequest, TrustedDispatcher
from orchestration.registry import SQLiteAdmissionRegistry
from orchestration.runner import (
    DeliveryExecutionError,
    RoleContext,
    RoleResult,
    RoleUnavailable,
    WorkBlockSpec,
)

REPOSITORY_ID = "fixture/orchestration"
INITIATIVE = "docs/changes/orchestration"
PLANNING_PATHS = (
    f"{INITIATIVE}/intent.md",
    f"{INITIATIVE}/plan.md",
    f"{INITIATIVE}/spec.md",
    f"{INITIATIVE}/work-blocks/wb-004.md",
)
IMPLEMENTATION_SCOPE = ("src/**",)
COORDINATION_SCOPE = (
    f"{INITIATIVE}/**",
    "docs/engineering-memory/**",
)


class OrchestrationRepo:
    def __init__(self) -> None:
        self.temp = tempfile.TemporaryDirectory()
        base = Path(self.temp.name)
        self.root = base / "repo"
        self.remote = base / "remote.git"
        self.root.mkdir()
        self._git_run("init", "-q", "-b", "main")
        self._git_run("config", "user.name", "Fixture")
        self._git_run("config", "user.email", "fixture@example.invalid")
        self._write_policies()
        (self.root / "src").mkdir()
        (self.root / "src/app.txt").write_text("base\n", encoding="utf-8")
        (self.root / "README.md").write_text("fixture\n", encoding="utf-8")
        self.base_commit = self.commit_direct("trusted base")

        subprocess.run(
            ["git", "init", "--bare", "-q", "--initial-branch=main", str(self.remote)],
            check=True,
        )
        self._git_run("remote", "add", "origin", str(self.remote))
        self._git_run("push", "-q", "origin", "main")

        self.registry = SQLiteAdmissionRegistry(base / "trusted" / "admissions.sqlite3")
        self.dispatcher = TrustedDispatcher(
            self.registry,
            allowed_trigger_classes={
                "manual-owner",
                "trusted-ci",
                "trusted-release",
            },
        )

    def cleanup(self) -> None:
        self.temp.cleanup()

    def _git_run(self, *args: str, check: bool = True) -> subprocess.CompletedProcess[str]:
        return subprocess.run(
            ["git", "-C", str(self.root), *args],
            check=check,
            capture_output=True,
            text=True,
        )

    def git(self, *args: str) -> str:
        return subprocess.check_output(
            ["git", "-C", str(self.root), *args], text=True
        ).strip()

    def _write_policies(self) -> None:
        policies = self.root / ".agent/policies"
        policies.mkdir(parents=True)
        profiles = {
            "schema_version": 1,
            "profiles": {
                "human-governed": {
                    "capabilities": [
                        "planning",
                        "implementation",
                        "assurance",
                        "subject_branch_publish",
                        "open_or_update_pr",
                        "collect_release_evidence",
                    ],
                    "requires_owner": [
                        "merge",
                        "deploy_nonproduction",
                        "deploy_production",
                        "live_data_change",
                        "credential_change",
                    ],
                },
                "supervised-integrated": {
                    "capabilities": [
                        "planning",
                        "implementation",
                        "assurance",
                        "subject_branch_publish",
                        "open_or_update_pr",
                        "collect_release_evidence",
                        "merge",
                        "deploy_nonproduction",
                        "post_deploy_verify",
                    ],
                    "requires_owner": [
                        "deploy_production",
                        "live_data_change",
                        "credential_change",
                    ],
                },
                "autonomous-production": {
                    "capabilities": [
                        "planning",
                        "implementation",
                        "assurance",
                        "subject_branch_publish",
                        "open_or_update_pr",
                        "collect_release_evidence",
                        "merge",
                        "deploy_nonproduction",
                        "deploy_production",
                        "post_deploy_verify",
                        "rollback",
                    ],
                    "requires_owner": ["live_data_change", "credential_change"],
                },
            },
        }
        rules = {
            "schema_version": 1,
            "triggers": {
                "manual-owner": {
                    "max_profile": "human-governed",
                    "base_ref": "main",
                },
                "trusted-ci": {
                    "max_profile": "supervised-integrated",
                    "base_ref": "main",
                },
                "trusted-release": {
                    "max_profile": "autonomous-production",
                    "base_ref": "main",
                },
            },
        }
        (policies / "autonomy-profiles.json").write_text(
            json.dumps(profiles, sort_keys=True) + "\n", encoding="utf-8"
        )
        (policies / "admission-rules.json").write_text(
            json.dumps(rules, sort_keys=True) + "\n", encoding="utf-8"
        )

    def commit_direct(self, message: str) -> str:
        self._git_run("add", "-A")
        self._git_run("commit", "-qm", message)
        return self.git("rev-parse", "HEAD")

    def request(self, trigger_class: str, *, admission_id: str) -> DispatchRequest:
        return DispatchRequest(
            repository=REPOSITORY_ID,
            trigger_class=trigger_class,
            subject_branch=f"feat/{admission_id}",
            policy_revision=self.base_commit,
            admission_id=admission_id,
        )

    def spec(
        self,
        *,
        deployment_target: str | None = None,
        deployment_is_production: bool = False,
    ) -> WorkBlockSpec:
        return WorkBlockSpec(
            work_block_id="WB-004",
            initiative_ref=INITIATIVE,
            planning_paths=PLANNING_PATHS,
            implementation_write_set=IMPLEMENTATION_SCOPE,
            coordination_scope=COORDINATION_SCOPE,
            deployment_target=deployment_target,
            deployment_is_production=deployment_is_production,
        )


class ScriptedRoles:
    def __init__(
        self,
        repo: OrchestrationRepo,
        *,
        critic: list[str] | None = None,
        reviewer: list[str] | None = None,
        verifier: list[str] | None = None,
        unavailable: set[str] | None = None,
    ) -> None:
        self.repo = repo
        self.outcomes = {
            "critic": list(critic or ["READY"]),
            "reviewer": list(reviewer or ["READY"]),
            "verifier": list(verifier or ["READY"]),
        }
        self.unavailable = unavailable or set()
        self.calls: list[str] = []
        self.planner_count = 0
        self.coder_count = 0

    def _record(self, context: RoleContext):
        return self.repo.registry.resolve(context.admission_id)

    def _runtime_write(self, context: RoleContext, path: str) -> None:
        record = self._record(context)
        result = hook.evaluate_runtime(
            "codex",
            {
                "cwd": str(self.repo.root),
                "tool_name": "Write",
                "tool_input": {"file_path": path},
            },
            installation_root=self.repo.root,
            admission=record,
            repository_id=REPOSITORY_ID,
        )
        if not result.allowed:
            raise AssertionError(f"runtime write denied: {result.code}: {result.reason}")

    def _commit(self, context: RoleContext, message: str) -> str:
        record = self._record(context)
        self.repo._git_run("add", "-A")
        pre = hook.evaluate_git_pre_commit(
            self.repo.root,
            installation_root=self.repo.root,
            default_branch="main",
            admission=record,
            repository_id=REPOSITORY_ID,
        )
        if not pre.allowed:
            raise AssertionError(f"pre-commit denied: {pre.code}: {pre.reason}")

        current = cli.status(self.repo.root)
        trailer = ""
        if current is not None and current["lifecycle_state"] != "INACTIVE":
            trailer = f"\n\nWork-Block: {current['active']['work_block_id']}\n"
        message_file = Path(self.repo.temp.name) / "COMMIT_EDITMSG.fixture"
        message_file.write_text(message + trailer, encoding="utf-8")
        commit_message = hook.evaluate_git_commit_message(
            self.repo.root,
            message_file,
            installation_root=self.repo.root,
        )
        if not commit_message.allowed:
            raise AssertionError(
                f"commit-msg denied: {commit_message.code}: {commit_message.reason}"
            )
        self.repo._git_run("commit", "-q", "-F", str(message_file))
        return self.repo.git("rev-parse", "HEAD")

    def _planner(self, context: RoleContext) -> RoleResult:
        self.planner_count += 1
        for path in context.work_block.planning_paths:
            self._runtime_write(context, path)
            target = self.repo.root / path
            target.parent.mkdir(parents=True, exist_ok=True)
            if path.endswith("/plan.md"):
                text = f"plan revision {self.planner_count}: {context.reason or 'initial'}\n"
            else:
                text = f"{path}\n"
            target.write_text(text, encoding="utf-8")
        self._commit(context, f"planning {self.planner_count}")
        return RoleResult("planner", "DONE")

    def _coder(self, context: RoleContext) -> RoleResult:
        self.coder_count += 1
        path = "src/app.txt"
        self._runtime_write(context, path)
        (self.repo.root / path).write_text(
            f"implementation {self.coder_count}\n", encoding="utf-8"
        )
        self._commit(context, f"implementation {self.coder_count}")
        return RoleResult("coder", "DONE")

    def _closeout(self, context: RoleContext) -> RoleResult:
        path = "docs/engineering-memory/orchestration-closeout.md"
        self._runtime_write(context, path)
        target = self.repo.root / path
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_text("closeout\n", encoding="utf-8")
        self._commit(context, "coordination closeout")
        return RoleResult("closeout", "DONE")

    def run(self, role: str, context: RoleContext) -> RoleResult:
        self.calls.append(role)
        if role in self.unavailable:
            raise RoleUnavailable(role)
        if role == "planner":
            return self._planner(context)
        if role == "coder":
            return self._coder(context)
        if role == "closeout":
            return self._closeout(context)
        queue = self.outcomes[role]
        outcome = queue.pop(0) if len(queue) > 1 else queue[0]
        return RoleResult(role, outcome)


class SimulatedDelivery:
    def __init__(self, *, fail_capability: str | None = None) -> None:
        self.fail_capability = fail_capability
        self.calls: list[tuple[str, str | None, str | None]] = []

    def execute(
        self,
        capability: str,
        context,
        *,
        input_value: str | None = None,
        target: str | None = None,
    ) -> str:
        self.calls.append((capability, input_value, target))
        if capability == self.fail_capability:
            raise DeliveryExecutionError(f"simulated {capability} failure")
        if capability == "open_or_update_pr":
            return f"pr:{context.subject_branch}"
        if capability == "merge":
            return context.published_tip_sha
        if capability in {"deploy_nonproduction", "deploy_production"}:
            return input_value or context.published_tip_sha
        if capability == "post_deploy_verify":
            return input_value or context.published_tip_sha
        if capability == "rollback":
            return input_value or context.published_tip_sha
        raise AssertionError(f"unexpected simulated capability: {capability}")
