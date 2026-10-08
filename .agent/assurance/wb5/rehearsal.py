"""Disposable real-entrypoint cutover rehearsal for WB-005."""

from __future__ import annotations

import json
import os
import shutil
import stat
import subprocess
import sys
import tempfile
from dataclasses import dataclass
from pathlib import Path

from controllers.v1 import cli, gitfacts
from orchestration.dispatcher import DispatchRequest, TrustedDispatcher
from orchestration.registry import SQLiteAdmissionRegistry

from .validate import BASELINE_SHA, CANONICAL_PATHS, validate_source_artifacts


class RehearsalError(Exception):
    pass


def _run(
    args: list[str],
    *,
    cwd: Path | None = None,
    env: dict[str, str] | None = None,
    input_text: str | None = None,
    check: bool = True,
) -> subprocess.CompletedProcess[str]:
    result = subprocess.run(
        args,
        cwd=cwd,
        env=env,
        input=input_text,
        check=False,
        capture_output=True,
        text=True,
    )
    if check and result.returncode != 0:
        raise RehearsalError(
            f"command failed ({result.returncode}): {' '.join(args)}\n"
            f"stdout={result.stdout}\nstderr={result.stderr}"
        )
    return result


def _git(root: Path, *args: str, env=None, check=True) -> str:
    return _run(
        ["git", "-C", str(root), *args],
        env=env,
        check=check,
    ).stdout.strip()


def _tree_entry(root: Path, revision: str, path: str) -> tuple[str, str] | None:
    out = _git(root, "ls-tree", revision, "--", path)
    if not out:
        return None
    mode, kind, blob, _name = out.split(None, 3)
    if kind != "blob":
        raise RehearsalError(f"non-blob live wiring path: {path}")
    return mode, blob


def _worktree_entry(root: Path, path: str) -> tuple[str, str] | None:
    target = root / path
    if not target.exists():
        return None
    if not target.is_file() or target.is_symlink():
        raise RehearsalError(f"invalid live wiring worktree object: {path}")
    blob = _git(root, "hash-object", "--", path)
    mode = "100755" if target.stat().st_mode & stat.S_IXUSR else "100644"
    return mode, blob


def verify_candidate_live_wiring(
    root: Path,
    candidate_sha: str,
    manifest: dict,
) -> None:
    for item in manifest["live_wiring_paths"]:
        expected = None
        if item["preimage_blob_sha"] is not None:
            expected = (item["preimage_mode"], item["preimage_blob_sha"])
        actual = _tree_entry(root, candidate_sha, item["path"])
        if actual != expected:
            raise RehearsalError(
                f"WB-005 candidate changes live wiring path: {item['path']}"
            )


def verify_postimage(root: Path, manifest: dict) -> None:
    for item in manifest["live_wiring_paths"]:
        expected = (item["postimage_mode"], item["postimage_blob_sha"])
        actual = _worktree_entry(root, item["path"])
        if actual != expected:
            raise RehearsalError(
                f"cutover postimage mismatch for {item['path']}: "
                f"{actual!r} != {expected!r}"
            )


def verify_preimage_worktree(root: Path, candidate_sha: str, manifest: dict) -> None:
    for item in manifest["live_wiring_paths"]:
        expected = _tree_entry(root, candidate_sha, item["path"])
        actual = _worktree_entry(root, item["path"])
        if actual != expected:
            raise RehearsalError(
                f"rollback live wiring mismatch for {item['path']}"
            )


def _hook_command(config: dict, family: str, matcher: str) -> str:
    items = config["hooks"][family]
    for item in items:
        if item.get("matcher") == matcher:
            hooks = item.get("hooks")
            if isinstance(hooks, list) and len(hooks) == 1:
                command = hooks[0].get("command")
                if isinstance(command, str) and command:
                    return command
    raise RehearsalError(f"hook command not found: {family}/{matcher}")


def _invoke_hook(command: str, cwd: Path, payload: dict, env: dict[str, str]) -> dict:
    result = _run(
        ["bash", "-lc", command],
        cwd=cwd,
        env=env,
        input_text=json.dumps(payload),
    )
    try:
        output = json.loads(result.stdout)
    except json.JSONDecodeError as exc:
        raise RehearsalError(
            f"hook returned non-JSON output: {result.stdout!r}"
        ) from exc
    return output


def _permission(output: dict) -> str:
    try:
        return output["hookSpecificOutput"]["permissionDecision"]
    except (KeyError, TypeError) as exc:
        raise RehearsalError("runtime hook output lacks permissionDecision") from exc


def _cli(root: Path, operation: str, payload: dict | None, env: dict[str, str]) -> None:
    args = [
        sys.executable,
        "-m",
        "controllers.v1.cli",
        "--root",
        str(root),
    ]
    payload_path: Path | None = None
    try:
        if payload is not None:
            with tempfile.NamedTemporaryFile(
                mode="w",
                encoding="utf-8",
                suffix=".json",
                prefix="wb5-cli-",
                dir=root.parent,
                delete=False,
            ) as stream:
                json.dump(payload, stream, sort_keys=True)
                stream.write("\n")
                payload_path = Path(stream.name)
            args += ["--payload", str(payload_path)]
        args.append(operation)
        _run(args, cwd=root, env=env)
    finally:
        if payload_path is not None:
            payload_path.unlink(missing_ok=True)


def _fake_gh(bin_dir: Path) -> None:
    path = bin_dir / "gh"
    path.write_text(
        "#!/usr/bin/env python3\n"
        "import json, sys\n"
        "if len(sys.argv) >= 3 and sys.argv[1] == 'api':\n"
        "    if sys.argv[2] == 'graphql':\n"
        "        print(json.dumps({'data': {'repository': {'branchProtectionRules': {'nodes': [], 'pageInfo': {'hasNextPage': False}}}}}))\n"
        "        raise SystemExit(0)\n"
        "    if '/rules/branches/' in sys.argv[2]:\n"
        "        print('[]')\n"
        "        raise SystemExit(0)\n"
        "raise SystemExit(2)\n",
        encoding="utf-8",
    )
    path.chmod(0o755)


@dataclass(frozen=True)
class RehearsalSummary:
    candidate_sha: str
    cutover_commit: str
    planning_commit: str
    source_candidate: str
    published_tip: str
    terminal_reason: str


def run_rehearsal(source_root: Path, candidate_sha: str) -> RehearsalSummary:
    source_root = Path(source_root).resolve()
    validate_source_artifacts(source_root)
    manifest = json.loads(
        (source_root / CANONICAL_PATHS["manifest"]).read_text(encoding="utf-8")
    )
    verify_candidate_live_wiring(source_root, candidate_sha, manifest)

    with tempfile.TemporaryDirectory(prefix="wb5-rehearsal-") as temp_raw:
        temp = Path(temp_raw)
        clone = temp / "repo"
        platform = temp / "platform.git"
        home = temp / "home"
        bin_dir = temp / "bin"
        trusted = temp / "trusted"
        home.mkdir()
        bin_dir.mkdir()
        trusted.mkdir()
        _fake_gh(bin_dir)

        env = os.environ.copy()
        env.update(
            {
                "HOME": str(home),
                "GIT_CONFIG_GLOBAL": os.devnull,
                "PYTHONDONTWRITEBYTECODE": "1",
                "PYTHONPYCACHEPREFIX": str(temp / "pycache"),
                "PATH": str(bin_dir) + os.pathsep + env.get("PATH", ""),
            }
        )

        _run(
            ["git", "clone", "--quiet", "--no-hardlinks", str(source_root), str(clone)],
            env=env,
        )
        _git(clone, "config", "user.name", "WB5 Rehearsal", env=env)
        _git(clone, "config", "user.email", "wb5-rehearsal@example.invalid", env=env)
        _git(clone, "switch", "--detach", candidate_sha, env=env)
        _git(clone, "switch", "-c", "wb5-cutover-rehearsal", env=env)

        previous_hooks = _git(
            clone, "config", "--get", "core.hooksPath", env=env, check=False
        )
        state_path = gitfacts.state_path(clone)
        state_existed = state_path.exists()
        state_bytes = state_path.read_bytes() if state_existed else None
        config_path = gitfacts.common_git_dir(clone) / "azursystech" / "installation.json"
        config_existed = config_path.exists()
        config_bytes = config_path.read_bytes() if config_existed else None

        patch_path = clone / CANONICAL_PATHS["patch"]
        _run(["git", "-C", str(clone), "apply", "--check", str(patch_path)], env=env)
        _run(["git", "-C", str(clone), "apply", str(patch_path)], env=env)
        verify_postimage(clone, manifest)

        claude = json.loads((clone / ".claude/settings.json").read_text(encoding="utf-8"))
        codex = json.loads((clone / ".codex/hooks.json").read_text(encoding="utf-8"))
        if "Stop" in claude.get("hooks", {}):
            raise RehearsalError("legacy Claude Stop authority remains wired")
        workflow = (clone / ".github/workflows/control-plane-contracts.yml").read_text(
            encoding="utf-8"
        )
        if workflow.count("run: python scripts/verify-sdlc-replacement.py") != 1:
            raise RehearsalError("future CI does not use one canonical command")
        if "fetch-depth: 0" not in workflow:
            raise RehearsalError("future CI checkout does not fetch required history")
        for legacy in (
            ".agent/hooks/hard_stop_policy.py",
            ".claude/hooks/work_block_gate.py",
            ".claude/hooks/assurance_gate.py",
            ".codex/hooks/pre_tool_use_policy.py",
            ".codex/hooks/subagent_context.py",
        ):
            if legacy in json.dumps(claude) or legacy in json.dumps(codex):
                raise RehearsalError(f"legacy live entrypoint remains wired: {legacy}")

        _git(clone, "add", *[item["path"] for item in manifest["live_wiring_paths"]], env=env)
        _git(clone, "commit", "-qm", "simulated WB-6 cutover", env=env)
        cutover_commit = _git(clone, "rev-parse", "HEAD", env=env)

        _run(
            ["git", "init", "--bare", "-q", "--initial-branch=main", str(platform)],
            env=env,
        )
        _git(clone, "remote", "remove", "origin", env=env)
        _git(clone, "remote", "add", "origin", str(platform), env=env)
        _git(clone, "push", "-q", "origin", f"{cutover_commit}:refs/heads/main", env=env)
        _git(clone, "fetch", "-q", "origin", "main", env=env)
        _git(clone, "remote", "set-head", "origin", "main", env=env)
        _git(clone, "branch", "-f", "main", cutover_commit, env=env)
        if _git(clone, "rev-parse", "main", env=env) != cutover_commit:
            raise RehearsalError("local main does not match exact cutover baseline")

        registry_path = trusted / "admissions.sqlite3"
        _run(
            [
                "bash",
                "scripts/bootstrap.sh",
                "--install-sdlc-v1",
                "fixture/repo",
                str(registry_path),
            ],
            cwd=clone,
            env=env,
        )
        _run(
            ["bash", "scripts/bootstrap.sh", "--check-sdlc-v1"],
            cwd=clone,
            env=env,
        )

        registry = SQLiteAdmissionRegistry(registry_path)
        dispatcher = TrustedDispatcher(registry)
        admission_id = "adm-wb5-rehearsal"
        subject_branch = "feat/wb5-rehearsal"
        dispatcher.admit(
            clone,
            DispatchRequest(
                repository="fixture/repo",
                trigger_class="manual-owner",
                subject_branch=subject_branch,
                admission_id=admission_id,
            ),
        )
        _git(clone, "switch", subject_branch, env=env)

        initiative = clone / "docs/changes/wb5-rehearsal"
        nested = initiative / "nested"
        nested.mkdir(parents=True)
        relative_planning = "../intent.md"

        claude_structured = _hook_command(
            claude, "PreToolUse", "Edit|MultiEdit|Write"
        )
        codex_structured = _hook_command(
            codex, "PreToolUse", "^(apply_patch|Edit|Write)$"
        )
        event = {
            "cwd": str(nested),
            "tool_name": "Write",
            "tool_input": {"file_path": relative_planning},
        }
        if _permission(_invoke_hook(claude_structured, nested, event, env)) != "allow":
            raise RehearsalError("future Claude structured-write bridge denied planning")
        if _permission(_invoke_hook(codex_structured, nested, event, env)) != "allow":
            raise RehearsalError("future Codex structured-write bridge denied planning")

        bash_guard = _hook_command(codex, "PreToolUse", "^Bash$")
        harmless = {
            "cwd": str(clone),
            "tool_name": "Bash",
            "tool_input": {"command": "git status --short"},
        }
        if _permission(_invoke_hook(bash_guard, clone, harmless, env)) != "allow":
            raise RehearsalError("non-consequential Bash was unexpectedly denied")

        subagent = _hook_command(codex, "SubagentStart", ".*")
        context = _invoke_hook(
            subagent,
            nested,
            {"cwd": str(nested), "agent_type": "coder"},
            env,
        )
        if "additionalContext" not in context.get("hookSpecificOutput", {}):
            raise RehearsalError("replacement SubagentStart context is missing")

        (initiative / "intent.md").write_text("# Rehearsal intent\n", encoding="utf-8")
        _git(clone, "add", "docs/changes/wb5-rehearsal/intent.md", env=env)
        _git(clone, "commit", "-qm", "rehearsal planning", env=env)
        planning_commit = _git(clone, "rev-parse", "HEAD", env=env)

        open_payload = {
            "admission_id": admission_id,
            "work_block_id": "WB-999",
            "initiative_ref": "docs/changes/wb5-rehearsal",
            "planning_paths": ["docs/changes/wb5-rehearsal/intent.md"],
            "implementation_write_set": ["rehearsal-output.txt"],
            "coordination_scope": ["docs/changes/wb5-rehearsal/**"],
        }
        _run(
            [
                sys.executable,
                "scripts/sdlc-v1-bridge.py",
                "trusted-open",
                "--root",
                str(clone),
                "--payload",
                json.dumps(open_payload, sort_keys=True),
            ],
            cwd=clone,
            env=env,
        )
        env_cli = env.copy()
        env_cli["PYTHONPATH"] = str(clone / ".agent")
        _cli(clone, "critic", {"outcome": "ready"}, env_cli)

        source_event = {
            "cwd": str(clone),
            "tool_name": "Write",
            "tool_input": {"file_path": "rehearsal-output.txt"},
        }
        if _permission(_invoke_hook(codex_structured, clone, source_event, env)) != "allow":
            raise RehearsalError("replacement structured-write denied admitted implementation")
        (clone / "rehearsal-output.txt").write_text("candidate\n", encoding="utf-8")
        _git(clone, "add", "rehearsal-output.txt", env=env)
        _git(
            clone,
            "commit",
            "-qm",
            "rehearsal implementation",
            "-m",
            "Work-Block: WB-999",
            env=env,
        )
        _cli(clone, "candidate", None, env_cli)
        source_candidate = _git(clone, "rev-parse", "HEAD", env=env)
        _cli(clone, "reviewer", {"outcome": "ready"}, env_cli)
        _cli(clone, "verifier", {"outcome": "ready"}, env_cli)

        _run(
            [
                sys.executable,
                "scripts/sdlc-v1-bridge.py",
                "trusted-publish",
                "--root",
                str(clone),
            ],
            cwd=clone,
            env=env,
        )
        published = registry.resolve_publication(admission_id)
        if published.source_candidate_sha != source_candidate:
            raise RehearsalError("trusted publish bound wrong source candidate")
        if _git(clone, "rev-parse", f"refs/remotes/origin/{subject_branch}", env=env) != published.published_tip_sha:
            raise RehearsalError("published subject ref differs from provenance")

        activated = _run(
            [
                sys.executable,
                "scripts/verify-sdlc-replacement.py",
                "--replacement-candidate",
                candidate_sha,
                "--skip-rehearsal",
            ],
            cwd=clone,
            env=env,
        )
        activated_lines = [
            line for line in activated.stdout.splitlines() if line.strip()
        ]
        if not activated_lines:
            raise RehearsalError("activated canonical assurance produced no summary")
        try:
            activated_summary = json.loads(activated_lines[-1])
        except json.JSONDecodeError as exc:
            raise RehearsalError(
                "activated canonical assurance summary is invalid"
            ) from exc
        if (
            activated_summary.get("status") != "PASS"
            or activated_summary.get("current_wiring_mode") != "ACTIVATED"
            or activated_summary.get("replacement_candidate_sha") != candidate_sha
            or activated_summary.get("rehearsal") is not None
        ):
            raise RehearsalError(
                "activated canonical assurance did not prove exact cutover state"
            )

        registry.terminalize(admission_id, "REVOKED")
        if registry.is_active(admission_id):
            raise RehearsalError("rollback left active external authority")

        _git(clone, "reset", "--hard", candidate_sha, env=env)
        _git(clone, "clean", "-fd", env=env)
        if previous_hooks:
            _git(clone, "config", "core.hooksPath", previous_hooks, env=env)
        else:
            _git(clone, "config", "--unset-all", "core.hooksPath", env=env, check=False)

        if config_existed:
            config_path.parent.mkdir(parents=True, exist_ok=True)
            config_path.write_bytes(config_bytes or b"")
        else:
            config_path.unlink(missing_ok=True)
        if state_existed:
            state_path.parent.mkdir(parents=True, exist_ok=True)
            state_path.write_bytes(state_bytes or b"")
        else:
            state_path.unlink(missing_ok=True)

        verify_preimage_worktree(clone, candidate_sha, manifest)
        if _git(clone, "status", "--porcelain", "--untracked-files=all", env=env):
            raise RehearsalError("rollback did not restore a clean candidate worktree")
        if registry.is_active(admission_id):
            raise RehearsalError("rollback authority assertion failed")
        if registry.terminal_reason(admission_id) != "REVOKED":
            raise RehearsalError("rollback terminal reason was not preserved")

        return RehearsalSummary(
            candidate_sha=candidate_sha,
            cutover_commit=cutover_commit,
            planning_commit=planning_commit,
            source_candidate=source_candidate,
            published_tip=published.published_tip_sha,
            terminal_reason="REVOKED",
        )
