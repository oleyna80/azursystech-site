import importlib.util
import io
import json
import subprocess
import sys
import tempfile
import unittest
from contextlib import redirect_stdout
from pathlib import Path
from unittest import mock

AGENT_ROOT = Path(__file__).resolve().parents[3]
REPO_ROOT = AGENT_ROOT.parent
sys.path.insert(0, str(AGENT_ROOT))

from controllers.v1.installation import write_bootstrap_config
from orchestration.admission import AdmissionRecord
from orchestration.registry import SQLiteAdmissionRegistry


def _git(root: Path, *args: str) -> str:
    return subprocess.run(
        ["git", "-C", str(root), *args],
        check=True,
        capture_output=True,
        text=True,
    ).stdout.strip()


def _init_repo(root: Path, branch: str = "main") -> str:
    root.mkdir()
    _git(root, "init", "-q", "-b", branch)
    _git(root, "config", "user.name", "WB5 Bridge Test")
    _git(root, "config", "user.email", "wb5-bridge@example.invalid")
    (root / "README.md").write_text("fixture\n", encoding="utf-8")
    _git(root, "add", "README.md")
    _git(root, "commit", "-qm", "fixture base")
    return _git(root, "rev-parse", "HEAD")


def _load_bridge():
    spec = importlib.util.spec_from_file_location(
        "wb5_sdlc_v1_bridge",
        REPO_ROOT / "scripts/sdlc-v1-bridge.py",
    )
    if spec is None or spec.loader is None:
        raise AssertionError("cannot load SDLC bridge")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def _active_admission(
    registry: SQLiteAdmissionRegistry,
    *,
    repository: str,
    branch: str,
    base_commit: str,
    admission_id: str,
) -> None:
    registry.put(
        AdmissionRecord(
            admission_id=admission_id,
            repository=repository,
            trigger_class="manual-owner",
            authority_profile_id="human-governed",
            authority_profile_revision=base_commit,
            base_ref="main",
            base_commit=base_commit,
            subject_branch=branch,
        )
    )


def _invoke_runtime(bridge, payload: dict) -> dict:
    stdout = io.StringIO()
    with mock.patch("sys.stdin", io.StringIO(json.dumps(payload))), redirect_stdout(stdout):
        code = bridge.main(["runtime", "--runtime", "claude"])
    if code != 0:
        raise AssertionError(f"bridge returned unexpected code {code}")
    return json.loads(stdout.getvalue())


def _permission(response: dict) -> str:
    return response["hookSpecificOutput"]["permissionDecision"]


class BridgeRepositoryBindingTests(unittest.TestCase):
    def test_foreign_admitted_repository_is_denied_by_installation_binding(self):
        with tempfile.TemporaryDirectory(prefix="wb5-bridge-binding-") as temp_raw:
            temp = Path(temp_raw)
            installed = temp / "installed"
            foreign = temp / "foreign"
            installed_base = _init_repo(installed)
            foreign_base = _init_repo(foreign, branch="feat/foreign")

            installed_registry_path = temp / "trusted-a" / "registry.sqlite3"
            installed_registry_path.parent.mkdir()
            write_bootstrap_config(
                installed,
                repository="fixture/installed",
                registry_path=installed_registry_path,
            )
            installed_registry = SQLiteAdmissionRegistry(installed_registry_path)
            _active_admission(
                installed_registry,
                repository="fixture/installed",
                branch="main",
                base_commit=installed_base,
                admission_id="adm-installed01",
            )

            # Fully bootstrap the foreign repository too. The historical bridge
            # bug followed payload cwd here and would accept this foreign authority.
            foreign_registry_path = temp / "trusted-b" / "registry.sqlite3"
            foreign_registry_path.parent.mkdir()
            write_bootstrap_config(
                foreign,
                repository="fixture/foreign",
                registry_path=foreign_registry_path,
            )
            foreign_registry = SQLiteAdmissionRegistry(foreign_registry_path)
            _active_admission(
                foreign_registry,
                repository="fixture/foreign",
                branch="feat/foreign",
                base_commit=foreign_base,
                admission_id="adm-foreign0001",
            )

            bridge = _load_bridge()
            bridge.ROOT = installed
            response = _invoke_runtime(
                bridge,
                {
                    "cwd": str(foreign),
                    "tool_name": "Write",
                    "tool_input": {
                        "file_path": "docs/changes/foreign/intent.md",
                    },
                },
            )
            self.assertEqual(_permission(response), "deny")
            self.assertIn(
                "outside controller common Git repository",
                response["hookSpecificOutput"]["permissionDecisionReason"],
            )

    def test_linked_worktree_of_installed_repository_is_allowed(self):
        with tempfile.TemporaryDirectory(prefix="wb5-bridge-worktree-") as temp_raw:
            temp = Path(temp_raw)
            installed = temp / "installed"
            linked = temp / "linked"
            base = _init_repo(installed)
            subprocess.run(
                [
                    "git", "-C", str(installed), "worktree", "add", "-q",
                    "-b", "feat/linked", str(linked), base,
                ],
                check=True,
            )

            registry_path = temp / "trusted" / "registry.sqlite3"
            registry_path.parent.mkdir()
            write_bootstrap_config(
                installed,
                repository="fixture/installed",
                registry_path=registry_path,
            )
            registry = SQLiteAdmissionRegistry(registry_path)
            _active_admission(
                registry,
                repository="fixture/installed",
                branch="feat/linked",
                base_commit=base,
                admission_id="adm-linked00001",
            )

            bridge = _load_bridge()
            bridge.ROOT = installed
            response = _invoke_runtime(
                bridge,
                {
                    "cwd": str(linked),
                    "tool_name": "Write",
                    "tool_input": {
                        "file_path": "docs/changes/linked/intent.md",
                    },
                },
            )
            self.assertEqual(_permission(response), "allow")


if __name__ == "__main__":
    unittest.main()
