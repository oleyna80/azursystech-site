"""Per-worktree Git-private controller-state discovery and atomic persistence."""

from __future__ import annotations

import json
import os
import subprocess
import tempfile
from pathlib import Path

from .canonical import canonical_json_bytes
from .errors import DurabilityUncertain, StopAndPreserve, ValidationError
from .state import INACTIVE, validate

MISSING = object()
IMMUTABLE_ACTIVE_FIELDS = (
    "work_block_id", "initiative_ref", "admission_id", "subject_branch", "base_commit", "authority_profile"
)


def _git(root: Path, *args: str) -> str:
    try:
        result = subprocess.run(
            ["git", "-C", str(root), *args], check=True, capture_output=True, text=True
        )
    except subprocess.CalledProcessError as exc:
        detail = exc.stderr.strip() or exc.stdout.strip() or "git command failed"
        raise StopAndPreserve(detail) from exc
    return result.stdout.strip()


def state_path(worktree_root: Path) -> Path:
    root = worktree_root.resolve(strict=True)
    if _git(root, "rev-parse", "--is-bare-repository") != "false":
        raise StopAndPreserve("controller state requires a non-bare worktree")
    top = Path(_git(root, "rev-parse", "--show-toplevel")).resolve(strict=True)
    if top != root:
        raise StopAndPreserve("worktree_root must be the exact Git toplevel")
    return Path(
        _git(
            root,
            "rev-parse",
            "--path-format=absolute",
            "--git-path",
            "azursystech/active-work-block.json",
        )
    )


def read(path: Path) -> dict:
    if path.is_symlink():
        raise StopAndPreserve("authority state file is a symlink")
    try:
        raw = path.read_bytes()
    except OSError as exc:
        raise StopAndPreserve("authority state is missing") from exc
    try:
        value = json.loads(raw)
    except ValueError as exc:
        raise StopAndPreserve("authority state is corrupt") from exc
    validate(value)
    return value


def read_optional(path: Path) -> dict | None:
    if not path.exists() and not path.is_symlink():
        return None
    return read(path)


def _validate_persistence_transition(previous: dict, proposed: dict) -> None:
    validate(previous)
    validate(proposed)
    old_active = previous["active"]
    new_active = proposed["active"]
    if old_active is None:
        if previous["lifecycle_state"] == "INACTIVE" and proposed["lifecycle_state"] == "INACTIVE":
            if proposed != INACTIVE:
                raise ValidationError("INACTIVE must remain canonical")
        return
    if new_active is None:
        if proposed["lifecycle_state"] != "INACTIVE":
            raise ValidationError("active authority can disappear only into INACTIVE")
        return
    for field in IMMUTABLE_ACTIVE_FIELDS:
        if old_active[field] != new_active[field]:
            raise ValidationError(f"active {field} is immutable")


def write(path: Path, proposed: dict, *, expected=MISSING, after_replace=None) -> None:
    validate(proposed)
    if path.is_symlink():
        raise StopAndPreserve("authority state file is a symlink")

    exists = path.exists()
    if expected is MISSING:
        if exists:
            raise StopAndPreserve("authority state appeared since read")
    else:
        if not exists:
            raise StopAndPreserve("authority state disappeared since read")
        previous = read(path)
        if previous != expected:
            raise StopAndPreserve("authority state changed since read")
        _validate_persistence_transition(previous, proposed)

    path.parent.mkdir(parents=True, exist_ok=True)
    payload = canonical_json_bytes(proposed)
    temporary: Path | None = None
    replaced = False
    try:
        with tempfile.NamedTemporaryFile("wb", dir=path.parent, delete=False) as output:
            temporary = Path(output.name)
            output.write(payload)
            output.flush()
            os.fsync(output.fileno())
        os.replace(temporary, path)
        temporary = None
        replaced = True
        if after_replace is not None:
            after_replace()
        descriptor = os.open(path.parent, os.O_RDONLY | getattr(os, "O_DIRECTORY", 0))
        try:
            os.fsync(descriptor)
        finally:
            os.close(descriptor)
        if read(path) != proposed:
            raise DurabilityUncertain("post-replace readback differs")
    except Exception as exc:
        if replaced and not isinstance(exc, DurabilityUncertain):
            try:
                current = read(path)
            except Exception:
                raise DurabilityUncertain("replacement may have occurred; readback failed") from exc
            if current != proposed:
                raise DurabilityUncertain("replacement may have occurred; readback differs") from exc
            raise DurabilityUncertain("state matches but durability is uncertain") from exc
        raise
    finally:
        if temporary is not None:
            temporary.unlink(missing_ok=True)
