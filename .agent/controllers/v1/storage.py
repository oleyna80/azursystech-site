"""Per-worktree validated atomic state persistence."""

from __future__ import annotations

import json
import os
import tempfile
from pathlib import Path

from .canonical import canonical_json_bytes
from .errors import DurabilityUncertain, StopAndPreserve, ValidationError
from . import gitfacts
from .state import validate

MISSING = object()
IMMUTABLE_ACTIVE_FIELDS = (
    "work_block_id",
    "initiative_ref",
    "admission_id",
    "subject_branch",
    "base_commit",
    "authority_profile",
)


def resolve_path(root: Path) -> Path:
    return gitfacts.state_path(root)


def read(path: Path) -> dict:
    if path.is_symlink():
        raise StopAndPreserve("authority state path is a symlink")
    try:
        raw = path.read_bytes()
    except FileNotFoundError as exc:
        raise StopAndPreserve("authority state is missing") from exc
    except OSError as exc:
        raise StopAndPreserve("authority state cannot be read") from exc
    try:
        value = json.loads(raw)
    except (ValueError, UnicodeDecodeError) as exc:
        raise StopAndPreserve("authority state is corrupt") from exc
    validate(value)
    return value


def read_optional(path: Path) -> dict | None:
    if path.is_symlink():
        raise StopAndPreserve("authority state path is a symlink")
    if not path.exists():
        return None
    return read(path)


def load_for_worktree(root: Path) -> tuple[Path, dict | None]:
    path = resolve_path(root)
    return path, read_optional(path)


def _preserve_immutable_binding(previous: dict, proposed: dict) -> None:
    old_active = previous["active"]
    new_active = proposed["active"]
    if old_active is None or new_active is None:
        return
    for key in IMMUTABLE_ACTIVE_FIELDS:
        if old_active[key] != new_active[key]:
            raise ValidationError(f"active {key} binding is immutable")


def write(
    path: Path,
    proposed: dict,
    *,
    expected: dict | object = MISSING,
    after_replace=None,
) -> None:
    """Validate, compare, atomic replace, fsync, and read back."""

    validate(proposed)
    payload = canonical_json_bytes(proposed)
    if path.is_symlink():
        raise StopAndPreserve("authority state path is a symlink")

    existing = read_optional(path)
    if expected is MISSING:
        if existing is not None:
            raise StopAndPreserve("authority appeared since read")
    else:
        if existing is None:
            raise StopAndPreserve("authority disappeared since read")
        if existing != expected:
            raise StopAndPreserve("authority changed since read")
        _preserve_immutable_binding(existing, proposed)

    path.parent.mkdir(parents=True, exist_ok=True)
    if path.parent.is_symlink():
        raise StopAndPreserve("authority state directory is a symlink")

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
    except DurabilityUncertain:
        raise
    except Exception as exc:
        if replaced:
            try:
                current = read(path)
            except Exception:
                raise DurabilityUncertain("replacement may have occurred; readback failed") from exc
            if current != proposed:
                raise DurabilityUncertain("replacement may have occurred; readback differs") from exc
            raise DurabilityUncertain("readback matches but durable persistence is uncertain") from exc
        raise
    finally:
        if temporary is not None:
            temporary.unlink(missing_ok=True)
