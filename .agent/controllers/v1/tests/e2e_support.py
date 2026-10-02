"""Disposable Git transaction fixture for WB-003 E2E tests."""

from __future__ import annotations

import json
import subprocess
import sys
import tempfile
from pathlib import Path

AGENT_ROOT = Path(__file__).resolve().parents[3]
if str(AGENT_ROOT) not in sys.path:
    sys.path.insert(0, str(AGENT_ROOT))

from orchestration import admission
from v1 import cli, hook, storage

REPOSITORY_ID = "fixture/e2e"
WB_ID = "WB-003"
SUBJECT_BRANCH = "feat/e2e"
INITIATIVE = "docs/changes/e2e"
PLANNING_PATHS = [
    f"{INITIATIVE}/intent.md",
    f"{INITIATIVE}/plan.md",
    f"{INITIATIVE}/spec.md",
    f"{INITIATIVE}/work-blocks/wb-003.md",
]
IMPLEMENTATION_SCOPE = ["src/**"]
COORDINATION_SCOPE = [
    f"{INITIATIVE}/**",
    "docs/engineering-memory/**",
]


class E2ERepo:
    def __init__(self) -> None:
        self.temp = tempfile.TemporaryDirectory()
        base = Path(self.temp.name)
        self.root = base / "repo"
        self.remote = base / "remote.git"
        self.root.mkdir()
        self._run("init", "-q", "-b", "main")
        self._run("config", "user.name", "Fixture")
        self._run("config", "user.email", "fixture@example.invalid")
        self._write_policies()
        (self.root / "src").mkdir()
        (self.root / "src/app.txt").write_text("base\n", encoding="utf-8")
        (self.root / "README.md").write_text("fixture\n", encoding="utf-8")
        self.base_commit = self.commit_direct("trusted base")

        subprocess.run(
            ["git", "init", "--bare", "-q", "--initial-branch=main", str(self.remote)],
            check=True,
        )
        self._run("remote", "add", "origin", str(self.remote))
        self._run("push", "-q", "origin", "main")

        self.store = admission.InMemoryAdmissionStore()
        self.record = admission.create_admission(
            repo_root=self.root,
            repository=REPOSITORY_ID,
            trigger_class="manual-owner",
            subject_branch=SUBJECT_BRANCH,
            policy_revision=self.base_commit,
            store=self.store,
            admission_id="adm-0123456789abcdef",
        )
        self._run("switch", "-q", SUBJECT_BRANCH)

    def cleanup(self) -> None:
        self.temp.cleanup()

    def _run(self, *args: str, check: bool = True) -> subprocess.CompletedProcess[str]:
        return subprocess.run(
            ["git", "-C", str(self.root), *args],
            check=check,
            capture_output=True,
            text=True,
        )

    def git(self, *args: str) -> str:
        return subprocess.check_output(
            ["git", "-C", str(self.root), *args],
            text=True,
        ).strip()

    def _write_policies(self) -> None:
        policies = self.root / ".agent/policies"
        policies.mkdir(parents=True)
        (policies / "autonomy-profiles.json").write_text(
            json.dumps(
                {
                    "schema_version": 1,
                    "profiles": {
                        "human-governed": {"capabilities": ["planning"]},
                    },
                },
                sort_keys=True,
            )
            + "\n",
            encoding="utf-8",
        )
        (policies / "admission-rules.json").write_text(
            json.dumps(
                {
                    "schema_version": 1,
                    "triggers": {
                        "manual-owner": {
                            "max_profile": "human-governed",
                            "base_ref": "main",
                        }
                    },
                },
                sort_keys=True,
            )
            + "\n",
            encoding="utf-8",
        )

    def commit_direct(self, message: str) -> str:
        self._run("add", "-A")
        self._run("commit", "-qm", message)
        return self.git("rev-parse", "HEAD")

    def guarded_commit(self, message: str, *, admission_fact: bool = True) -> str:
        self._run("add", "-A")
        pre = hook.evaluate_git_pre_commit(
            self.root,
            installation_root=self.root,
            default_branch="main",
            admission=self.record if admission_fact else None,
            repository_id=REPOSITORY_ID if admission_fact else None,
        )
        if not pre.allowed:
            raise AssertionError(f"pre-commit denied: {pre.code}: {pre.reason}")

        current = cli.status(self.root)
        trailer = ""
        if current is not None and current["lifecycle_state"] != "INACTIVE":
            trailer = f"\n\nWork-Block: {current['active']['work_block_id']}\n"

        message_file = Path(self.temp.name) / "COMMIT_EDITMSG.fixture"
        message_file.write_text(message + trailer, encoding="utf-8")
        commit_message = hook.evaluate_git_commit_message(
            self.root,
            message_file,
            installation_root=self.root,
        )
        if not commit_message.allowed:
            raise AssertionError(
                f"commit-msg denied: {commit_message.code}: {commit_message.reason}"
            )

        self._run("commit", "-q", "-F", str(message_file))
        return self.git("rev-parse", "HEAD")

    def create_planning(self) -> str:
        for path in PLANNING_PATHS:
            runtime = hook.evaluate_runtime(
                "codex",
                {
                    "cwd": str(self.root),
                    "tool_name": "Write",
                    "tool_input": {"file_path": path},
                },
                installation_root=self.root,
                admission=self.record,
                repository_id=REPOSITORY_ID,
            )
            if runtime.code != "WRITE_PLANNING_ALLOWED":
                raise AssertionError(
                    f"pre-WB planning runtime denied: {runtime.code}: {runtime.reason}"
                )
            target = self.root / path
            target.parent.mkdir(parents=True, exist_ok=True)
            target.write_text(path + "\n", encoding="utf-8")
        return self.guarded_commit("planning")

    def open(
        self,
        *,
        implementation_write_set: list[str] | None = None,
        coordination_scope: list[str] | None = None,
    ) -> dict:
        return cli.open_with_resolver(
            self.root,
            self.store,
            repository_id=REPOSITORY_ID,
            admission_id=self.record.admission_id,
            work_block_id=WB_ID,
            initiative_ref=INITIATIVE,
            planning_paths=PLANNING_PATHS,
            implementation_write_set=implementation_write_set or IMPLEMENTATION_SCOPE,
            coordination_scope=coordination_scope or COORDINATION_SCOPE,
            default_branch="main",
        )

    def open_and_execute(
        self,
        *,
        implementation_write_set: list[str] | None = None,
        coordination_scope: list[str] | None = None,
    ) -> dict:
        self.create_planning()
        self.open(
            implementation_write_set=implementation_write_set,
            coordination_scope=coordination_scope,
        )
        return cli.critic(self.root, "ready")

    def make_candidate(self, text: str = "implementation\n") -> tuple[dict, str]:
        source = self.root / "src/app.txt"
        source.write_text(text, encoding="utf-8")
        commit = self.guarded_commit("implementation")
        candidate = cli.candidate(self.root)
        if candidate["active"]["source_candidate_sha"] != commit:
            raise AssertionError("candidate does not bind committed implementation HEAD")
        return candidate, commit

    def assure_candidate(self, text: str = "implementation\n") -> tuple[dict, str]:
        candidate, commit = self.make_candidate(text)
        cli.reviewer(self.root, "ready")
        assured = cli.verifier(self.root, "ready")
        return assured, commit

    def closeout_commit(self, text: str = "done\n") -> str:
        path = self.root / "docs/engineering-memory/closeout.md"
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(text, encoding="utf-8")
        return self.guarded_commit("coordination closeout")

    def state_path(self) -> Path:
        return storage.resolve_path(self.root)
