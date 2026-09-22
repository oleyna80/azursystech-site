"""Complete sealed-controller-surface manifest construction and verification."""

from __future__ import annotations

import os
from pathlib import Path
from typing import Iterable, Mapping

from .errors import ValidationError
from .identity import entries_from_manifest, identity_for_path, sealed_surface_identity


def discover_paths(root: Path, package_path: str = ".agent/controllers/v1") -> tuple[bytes, ...]:
    package = root / package_path
    if not package.is_dir():
        raise ValidationError("sealed controller package is missing")
    paths: list[bytes] = []
    for directory, names, files in os.walk(package, topdown=True, followlinks=False):
        names[:] = sorted(name for name in names if name != "__pycache__")
        for name in sorted(files):
            absolute = Path(directory) / name
            relative = absolute.relative_to(root)
            paths.append(os.fsencode(relative.as_posix()))
        for name in list(names):
            absolute = Path(directory) / name
            if absolute.is_symlink():
                relative = absolute.relative_to(root)
                paths.append(os.fsencode(relative.as_posix()))
                names.remove(name)
    return tuple(sorted(paths))


def build_manifest(
    root: Path,
    *,
    candidate_attempt_id: str,
    frozen_commit: str,
    frozen_tree: str,
    paths: Iterable[str | bytes] | None = None,
) -> dict:
    if not candidate_attempt_id or not frozen_commit or not frozen_tree:
        raise ValidationError("attempt, frozen commit, and frozen tree are required")
    discovered = discover_paths(root)
    selected = discovered if paths is None else tuple(paths)
    selected_bytes = tuple(
        path if isinstance(path, bytes) else os.fsencode(path)
        for path in selected
    )
    if tuple(sorted(selected_bytes)) != discovered:
        raise ValidationError("sealed manifest path set must equal the complete discovered surface")
    entries = tuple(identity_for_path(root, path) for path in selected_bytes)
    identity = sealed_surface_identity(entries)
    return {
        "schema": "wb031-sealed-controller-surface-v1",
        "candidate_attempt_id": candidate_attempt_id,
        "frozen_commit": frozen_commit,
        "frozen_tree": frozen_tree,
        "serialization": "sealed-surface-v1",
        "entries": [entry.as_manifest_record() for entry in sorted(entries, key=lambda item: item.path)],
        "aggregate_identity": identity,
    }


def verify_manifest(root: Path, manifest: Mapping[str, object]) -> None:
    if manifest.get("schema") != "wb031-sealed-controller-surface-v1":
        raise ValidationError("unsupported sealed manifest schema")
    if manifest.get("serialization") != "sealed-surface-v1":
        raise ValidationError("sealed manifest serialization mismatch")
    entries = entries_from_manifest(manifest.get("entries"))
    discovered = discover_paths(root)
    manifested_paths = tuple(entry.path for entry in entries)
    if manifested_paths != discovered:
        raise ValidationError("sealed manifest does not cover the complete controller surface")
    if manifest.get("aggregate_identity") != sealed_surface_identity(entries):
        raise ValidationError("sealed manifest aggregate identity mismatch")
    observed = tuple(identity_for_path(root, entry.path) for entry in entries)
    if observed != entries:
        raise ValidationError("sealed controller surface differs from its manifest")


def require_same_surface(left: Mapping[str, object], right: Mapping[str, object]) -> None:
    for key in ("candidate_attempt_id", "frozen_commit", "frozen_tree", "entries", "aggregate_identity"):
        if left.get(key) != right.get(key):
            raise ValidationError(f"sealed surface binding mismatch: {key}")
