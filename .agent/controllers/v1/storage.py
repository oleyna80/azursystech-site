"""Validated atomic state persistence and bounded inactive-only recovery."""

from __future__ import annotations

import json
import os
import tempfile
from pathlib import Path

from .canonical import canonical_json_bytes
from .errors import DurabilityUncertain, StopAndPreserve, ValidationError
from .state import INACTIVE, validate


def read(path: Path) -> dict:
    if path.is_symlink():
        raise StopAndPreserve("authority file is a symlink")
    try:
        value = json.loads(path.read_bytes())
    except (OSError, ValueError) as exc:
        raise StopAndPreserve("authority state is missing or corrupt") from exc
    validate(value)
    return value


def _preserves_history(previous: dict, proposed: dict) -> None:
    old_history = previous["history"]
    new_history = proposed["history"]
    if new_history[:len(old_history)] != old_history:
        raise ValidationError("completed closeout history is immutable")
    old_active = previous["active"]
    new_active = proposed["active"]
    if old_active is None:
        if previous["lifecycle_state"] == "INACTIVE" and proposed["lifecycle_state"] == "INACTIVE":
            if proposed != previous:
                raise ValidationError("inactive state cannot be silently revised")
        return
    if new_active is not None:
        if old_active["work_block_id"] != new_active["work_block_id"]:
            raise ValidationError("active Work Block identity cannot change")
        if old_active["subject_branch"] != new_active["subject_branch"] or old_active["write_set"] != new_active["write_set"]:
            raise ValidationError("subject branch and admitted write-set cannot change while active")
        if old_active["controller_generation"] != new_active["controller_generation"] or old_active["controller_tree"] != new_active["controller_tree"]:
            raise ValidationError("controller binding cannot change while active")
        for key in ("dispatches", "evidence"):
            if new_active[key][:len(old_active[key])] != old_active[key]:
                raise ValidationError(f"completed {key} are immutable")
        old_start = old_active["assurance_evidence_start"]
        new_start = new_active["assurance_evidence_start"]
        if previous["lifecycle_state"] == "EXECUTE" and proposed["lifecycle_state"] == "ASSURE":
            if new_start != len(old_active["evidence"]):
                raise ValidationError("new assurance boundary must follow the previous evidence")
        elif new_start != old_start:
            raise ValidationError("assurance boundary changes only on candidate freeze")
    elif proposed["lifecycle_state"] == "INACTIVE":
        if len(new_history) != len(old_history) + 1 or new_history[-1]["work_block"] != old_active:
            raise ValidationError("closeout must preserve exact active evidence")
    else:
        raise ValidationError("active authority cannot disappear")


def write(path: Path, proposed: dict, *, expected: dict | None = None, after_replace=None) -> None:
    """Validate first, then same-directory fsync and replace; re-read on uncertainty."""
    validate(proposed)
    payload = canonical_json_bytes(proposed)
    if path.is_symlink():
        raise StopAndPreserve("authority file is a symlink")
    if path.exists():
        previous = read(path)
        if expected is not None and previous != expected:
            raise StopAndPreserve("authority changed since read")
        _preserves_history(previous, proposed)
    elif expected is not None:
        raise StopAndPreserve("authority disappeared since read")
    elif proposed != INACTIVE:
        raise StopAndPreserve("initial authority must be canonical inactive")

    path.parent.mkdir(parents=True, exist_ok=True)
    temporary = None
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
    except Exception as exc:
        if replaced:
            try:
                current = read(path)
            except Exception:
                raise DurabilityUncertain("replacement may have occurred; read-back failed") from exc
            if current != proposed:
                raise DurabilityUncertain("replacement may have occurred; read-back differs") from exc
            raise DurabilityUncertain("read-back matches, but persistence durability is uncertain") from exc
        raise
    finally:
        if temporary is not None:
            temporary.unlink(missing_ok=True)


def recover_inactive(path: Path, *, inactive_proven: bool) -> dict:
    """Only a missing state with independently proven inactive authority is recoverable."""
    if not inactive_proven:
        raise StopAndPreserve("inactive authority was not proven")
    if path.exists() or path.is_symlink():
        existing = read(path)
        if existing == INACTIVE:
            return existing
        raise StopAndPreserve("existing authority cannot be reconstructed or overwritten")
    write(path, dict(INACTIVE))
    return read(path)
