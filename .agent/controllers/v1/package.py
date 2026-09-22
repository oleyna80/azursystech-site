"""Deterministic identity for the authority-bearing v1 runtime package."""

from __future__ import annotations

import os
from pathlib import Path

from .errors import ValidationError
from .identity import identity_for_path, sealed_surface_identity

RUNTIME_EXCLUDED_PREFIXES = (
    ".agent/controllers/v1/activation/",
    ".agent/controllers/v1/tests/",
    ".agent/controllers/v1/fixtures/",
)


def controller_root() -> Path:
    """Return the repository that owns the currently executing v1 package."""

    root = Path(__file__).resolve().parents[3]
    package = root / ".agent/controllers/v1"
    if not package.is_dir() or package.resolve() != Path(__file__).resolve().parent:
        raise ValidationError("executing v1 controller package is not repository-root-bound")
    return root


def runtime_package_paths(root: Path) -> tuple[bytes, ...]:
    package = root / ".agent/controllers/v1"
    if not package.is_dir():
        raise ValidationError("v1 runtime package is missing")
    result: list[bytes] = []
    for directory, names, files in os.walk(package, topdown=True, followlinks=False):
        names[:] = sorted(name for name in names if name != "__pycache__")
        for name in names:
            if (Path(directory) / name).is_symlink():
                raise ValidationError("v1 runtime package cannot contain symlink directories")
        for name in sorted(files):
            absolute = Path(directory) / name
            path = absolute.relative_to(root).as_posix()
            if path.endswith((".pyc", ".pyo")) or path.startswith(RUNTIME_EXCLUDED_PREFIXES):
                continue
            if absolute.is_symlink():
                raise ValidationError("v1 runtime package cannot contain symlink files")
            result.append(os.fsencode(path))
    return tuple(sorted(result))


def runtime_package_identity(root: Path) -> str:
    entries = tuple(identity_for_path(root, path) for path in runtime_package_paths(root))
    if not entries:
        raise ValidationError("v1 runtime package contains no authority-bearing files")
    return sealed_surface_identity(entries)
