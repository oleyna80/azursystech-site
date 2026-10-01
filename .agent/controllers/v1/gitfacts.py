"""Deterministic Git facts for controller decisions."""

from __future__ import annotations

import subprocess
from pathlib import Path
from collections.abc import Iterable

from .errors import StopAndPreserve, ValidationError
from .state import SHA_RE


ZERO_SHA = "0" * 40


def _git(root: Path, *args: str, check: bool = True) -> str:
    try:
        result = subprocess.run(
            ["git", "-C", str(root), *args],
            check=check,
            capture_output=True,
            text=True,
        )
    except subprocess.CalledProcessError as exc:
        detail = exc.stderr.strip() or exc.stdout.strip() or "git command failed"
        raise StopAndPreserve(detail) from exc
    return result.stdout.strip()


def worktree_root(cwd: Path) -> Path:
    cwd = cwd.resolve(strict=True)
    top = Path(_git(cwd, "rev-parse", "--show-toplevel")).resolve(strict=True)
    if _git(top, "rev-parse", "--is-bare-repository") != "false":
        raise StopAndPreserve("authority event requires non-bare worktree")
    return top


def state_path(root: Path) -> Path:
    root = worktree_root(root)
    raw = _git(root, "rev-parse", "--path-format=absolute", "--git-path", "azursystech/active-work-block.json")
    path = Path(raw)
    if not path.is_absolute():
        raise StopAndPreserve("Git returned non-absolute controller state path")
    return path


def common_git_dir(root: Path) -> Path:
    root = worktree_root(root)
    return Path(_git(root, "rev-parse", "--path-format=absolute", "--git-common-dir")).resolve(strict=True)


def branch(root: Path) -> str:
    value = _git(worktree_root(root), "branch", "--show-current")
    if not value:
        raise StopAndPreserve("detached or unknown branch")
    return value


def resolve_commit(root: Path, revision: str) -> str:
    value = _git(worktree_root(root), "rev-parse", "--verify", f"{revision}^{{commit}}")
    if SHA_RE.fullmatch(value) is None:
        raise StopAndPreserve("Git did not resolve a full commit SHA")
    return value


def head_sha(root: Path) -> str:
    return resolve_commit(root, "HEAD")


def is_clean(root: Path) -> bool:
    return _git(worktree_root(root), "status", "--porcelain", "--untracked-files=all") == ""


def require_clean(root: Path) -> None:
    if not is_clean(root):
        raise StopAndPreserve("operation requires clean committed worktree and index")


def is_ancestor(root: Path, ancestor: str, descendant: str) -> bool:
    root = worktree_root(root)
    a = resolve_commit(root, ancestor)
    d = resolve_commit(root, descendant)
    result = subprocess.run(
        ["git", "-C", str(root), "merge-base", "--is-ancestor", a, d],
        check=False,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )
    return result.returncode == 0


def _nul_paths(raw: bytes) -> tuple[str, ...]:
    paths = [item.decode("utf-8", errors="strict") for item in raw.split(b"\0") if item]
    if len(paths) != len(set(paths)):
        paths = list(dict.fromkeys(paths))
    return tuple(sorted(paths))


def staged_paths(root: Path) -> tuple[str, ...]:
    root = worktree_root(root)
    result = subprocess.run(
        ["git", "-C", str(root), "diff", "--cached", "--no-renames", "--name-only", "-z", "--diff-filter=ACMDRTUXB"],
        check=True,
        capture_output=True,
    )
    return _nul_paths(result.stdout)


def changed_paths(root: Path, base: str, tip: str) -> tuple[str, ...]:
    root = worktree_root(root)
    base_sha = resolve_commit(root, base)
    tip_sha = resolve_commit(root, tip)
    result = subprocess.run(
        ["git", "-C", str(root), "diff", "--no-renames", "--name-only", "-z", "--diff-filter=ACMDRTUXB", f"{base_sha}..{tip_sha}"],
        check=True,
        capture_output=True,
    )
    return _nul_paths(result.stdout)


def commits_between(root: Path, start_exclusive: str, tip_inclusive: str) -> tuple[str, ...]:
    root = worktree_root(root)
    start = resolve_commit(root, start_exclusive)
    tip = resolve_commit(root, tip_inclusive)
    raw = _git(root, "rev-list", "--reverse", f"{start}..{tip}")
    return tuple(line for line in raw.splitlines() if line)


def is_merge_commit(root: Path, commit: str) -> bool:
    root = worktree_root(root)
    sha = resolve_commit(root, commit)
    line = _git(root, "rev-list", "--parents", "-n", "1", sha)
    parts = line.split()
    if not parts or parts[0] != sha:
        raise StopAndPreserve("cannot determine commit parents")
    return len(parts) > 2


def commit_paths(root: Path, commit: str) -> tuple[str, ...]:
    root = worktree_root(root)
    sha = resolve_commit(root, commit)
    result = subprocess.run(
        ["git", "-C", str(root), "diff-tree", "--no-commit-id", "--no-renames", "--name-only", "-r", "-z",
         "--diff-filter=ACMDRTUXB", sha],
        check=True,
        capture_output=True,
    )
    return _nul_paths(result.stdout)


def any_commit_touches(root: Path, start_exclusive: str, tip_inclusive: str, paths: Iterable[str]) -> bool:
    wanted = set(paths)
    if not wanted:
        return False
    for commit in commits_between(root, start_exclusive, tip_inclusive):
        if wanted.intersection(commit_paths(root, commit)):
            return True
    return False


def any_commit_under_prefix(root: Path, start_exclusive: str, tip_inclusive: str, prefix: str) -> bool:
    normalized = prefix.rstrip("/") + "/"
    for commit in commits_between(root, start_exclusive, tip_inclusive):
        if any(path == prefix.rstrip("/") or path.startswith(normalized) for path in commit_paths(root, commit)):
            return True
    return False


def path_object(root: Path, revision: str, path: str) -> str:
    root = worktree_root(root)
    sha = resolve_commit(root, revision)
    try:
        obj = _git(root, "rev-parse", "--verify", f"{sha}:{path}")
    except StopAndPreserve as exc:
        raise ValidationError(f"path does not exist at revision: {path}") from exc
    if not obj:
        raise ValidationError(f"path does not exist at revision: {path}")
    return obj


def planning_subject_unchanged(root: Path, planning_revision: str, tip: str, paths: Iterable[str]) -> bool:
    tip_sha = resolve_commit(root, tip)
    planning_sha = resolve_commit(root, planning_revision)
    if not is_ancestor(root, planning_sha, tip_sha):
        return False
    path_list = tuple(paths)
    for path in path_list:
        try:
            if path_object(root, planning_sha, path) != path_object(root, tip_sha, path):
                return False
        except ValidationError:
            return False
    return not any_commit_touches(root, planning_sha, tip_sha, path_list)


def remote_default_branch(root: Path, remote: str) -> str:
    root = worktree_root(root)
    output = _git(root, "ls-remote", "--symref", remote, "HEAD")
    for line in output.splitlines():
        if not line.startswith("ref: refs/heads/") or not line.endswith("\tHEAD"):
            continue
        ref = line[len("ref: "):].split("\t", 1)[0]
        branch_name = ref.removeprefix("refs/heads/")
        if branch_name and ref == f"refs/heads/{branch_name}":
            return branch_name
    raise StopAndPreserve("remote default branch cannot be determined")


def remote_ref_sha(root: Path, remote: str, ref: str) -> str | None:
    root = worktree_root(root)
    try:
        output = _git(root, "ls-remote", "--heads", remote, ref)
    except StopAndPreserve:
        raise
    if not output:
        return None
    first = output.splitlines()[0].split()
    if len(first) < 2 or SHA_RE.fullmatch(first[0]) is None:
        raise StopAndPreserve("remote ref result is malformed")
    return first[0]


def push_subject(root: Path, remote: str, branch_name: str) -> None:
    root = worktree_root(root)
    try:
        subprocess.run(
            ["git", "-C", str(root), "push", remote, f"HEAD:refs/heads/{branch_name}"],
            check=True,
            capture_output=True,
            text=True,
        )
    except subprocess.CalledProcessError as exc:
        detail = exc.stderr.strip() or exc.stdout.strip() or "subject publication failed"
        raise StopAndPreserve(detail) from exc
