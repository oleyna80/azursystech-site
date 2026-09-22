"""Atomic JSON persistence with explicit post-replace uncertainty."""

from __future__ import annotations

import os
import tempfile
from collections.abc import Callable
from pathlib import Path

from .canonical import canonical_json_bytes
from .errors import DurabilityUncertain

Hook = Callable[[], None]


def atomic_write_bytes(
    path: Path,
    payload: bytes,
    *,
    before_replace: Hook | None = None,
    after_replace: Hook | None = None,
) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    temporary: Path | None = None
    replaced = False
    try:
        with tempfile.NamedTemporaryFile("wb", dir=path.parent, delete=False) as output:
            output.write(payload)
            output.flush()
            os.fsync(output.fileno())
            temporary = Path(output.name)
        if before_replace is not None:
            before_replace()
        os.replace(temporary, path)
        replaced = True
        temporary = None
        if after_replace is not None:
            after_replace()
        descriptor = os.open(path.parent, os.O_RDONLY | os.O_DIRECTORY)
        try:
            os.fsync(descriptor)
        finally:
            os.close(descriptor)
    except Exception as exc:
        if replaced:
            raise DurabilityUncertain(
                "replacement occurred but parent-directory durability is uncertain"
            ) from exc
        raise
    finally:
        if temporary is not None:
            try:
                temporary.unlink()
            except FileNotFoundError:
                pass


def atomic_write_json(path: Path, value: object, **kwargs: object) -> None:
    atomic_write_bytes(path, canonical_json_bytes(value), **kwargs)
