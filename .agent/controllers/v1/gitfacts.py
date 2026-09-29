"""Runtime-neutral Git fact collection for controller lifecycle and policy."""

from __future__ import annotations

import re
import subprocess
from pathlib import Path

from .errors import GitFactError

SHA = re.compile(r"^[0-9a-f]{40}$")
ZERO_SHA = "0" * 40


def _run(root: Path, *args: str, check: bool = True) -> subprocess.CompletedProcess[str]:
    try:
        return subprocess.run(
            ["git", "-C", str(root), *args], check=check, capture_output=True, text=True
        )
    except subprocess.CalledProcessError as exc:
        detail = exc.stderr.strip() or exc.stdout.strip() or "git command failed"
        raise GitFactError(detail) from exc


def git(root: Path, *args: str) -> str:
    return _run(root, *args).stdout.strip()


def worktree_root(cwd: Path) -> Path:
    location = cwd.resolve(strict=True)
    root = Path(git(location, "rev-parse", "--show-toplevel")).resolve(strict=True)
    if git(root, "rev-parse", "--is-bare-repository") != "false":
        raise GitFactError("authority requires a non-bare worktree")
    return root


def common_dir(root: Path) -> Path:
    return Path(git(root, "rev-parse", "--path-format=absolute", "--git-common-dir")).resolve()


def branch(root: Path) -> str:
    value = git(root, "branch", "--show-current")
    if not value:
        raise GitFactError("detached or unknown branch")
    return value


def full_sha(root: Path, revision: str) -> str:
    value = git(root, "rev-parse", "--verify", f"{revision}^{{commit}}")
    if SHA.fullmatch(value) is None:
        raise GitFactError("Git did not return a full commit SHA")
    return value


def is_ancestor(root: Path, ancestor: str, descendant: str) -> bool:
    result = _run(root, "merge-base", "--is-ancestor", ancestor, descendant, check=False)
    if result.returncode not in {0, 1}:
        raise GitFactError(result.stderr.strip() or "merge-base failed")
    return result.returncode == 0


def clean(root: Path) -> bool:
    return git(root, "status", "--porcelain=v1", "--untracked-files=all") == ""


def staged_paths(root: Path) -> list[str]:
    raw = _run(root, "diff", "--cached", "--name-only", "-z").stdout
    return sorted({item for item in raw.split("\0") if item})


def changed_paths(root: Path, base: str, tip: str) -> list[str]:
    raw = _run(root, "diff", "--name-only", "-z", f"{base}..{tip}").stdout
    return sorted({item for item in raw.split("\0") if item})


def commits_after(root: Path, start_exclusive: str, tip: str) -> list[str]:
    raw = git(root, "rev-list", "--reverse", f"{start_exclusive}..{tip}")
    return [line for line in raw.splitlines() if line]


def commit_paths(root: Path, commit: str) -> list[str]:
    raw = _run(root, "diff-tree", "--root", "--no-commit-id", "--name-only", "-r", "-z", commit).stdout
    return sorted({item for item in raw.split("\0") if item})


def path_object(root: Path, revision: str, path: str) -> str:
    value = git(root, "rev-parse", f"{revision}:{path}")
    if not value:
        raise GitFactError(f"path does not exist at revision: {path}")
    return value


def path_exists(root: Path, revision: str, path: str) -> bool:
    result = _run(root, "cat-file", "-e", f"{revision}:{path}", check=False)
    return result.returncode == 0


def planning_unchanged(root: Path, planning_revision: str, tip: str, paths: list[str]) -> bool:
    if not is_ancestor(root, planning_revision, tip):
        return False
    for path in paths:
        if path_object(root, planning_revision, path) != path_object(root, tip, path):
            return False
        log = git(root, "log", "--format=%H", f"{planning_revision}..{tip}", "--", path)
        if log:
            return False
    return True


def planning_surface_changed_after(root: Path, planning_revision: str, tip: str, initiative_ref: str) -> bool:
    if not is_ancestor(root, planning_revision, tip):
        return True
    pathspecs = [
        f"{initiative_ref}/intent.md", f"{initiative_ref}/spec.md", f"{initiative_ref}/plan.md",
        f"{initiative_ref}/tasklist.md", f"{initiative_ref}/work-blocks",
    ]
    return bool(git(root, "log", "--format=%H", f"{planning_revision}..{tip}", "--", *pathspecs))


def repository_identity(root: Path) -> str:
    result = _run(root, "config", "--get", "remote.origin.url", check=False)
    value = result.stdout.strip()
    if not value:
        raise GitFactError("remote.origin.url is required for repository identity")
    match = re.match(r"(?:https://github\.com/|git@github\.com:)([^/]+/[^/]+?)(?:\.git)?$", value)
    return match.group(1) if match else value.removesuffix(".git")


def remote_ref_sha(root: Path, remote: str, ref: str) -> str | None:
    raw = git(root, "ls-remote", "--heads", remote, ref)
    if not raw:
        return None
    first = raw.splitlines()[0].split()[0]
    if SHA.fullmatch(first) is None:
        raise GitFactError("remote returned malformed SHA")
    return first
