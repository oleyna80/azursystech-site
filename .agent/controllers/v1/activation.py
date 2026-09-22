"""Exact create/replace-only activation-map verification and materialization."""

from __future__ import annotations

import json
import os
import re
import tempfile
from dataclasses import dataclass
from pathlib import Path
from typing import Iterable, Mapping

from .errors import DurabilityUncertain, TransitionDenied, ValidationError
from .identity import SurfaceEntry, identity_for_path, safe_relative_path

ALLOWED_DESTINATIONS = frozenset(
    {
        ".agent/controller-manifest.json",
        ".agent/active-work-block.default.json",
        ".agent/hooks/hard_stop_policy.py",
        ".codex/hooks.json",
        ".codex/hooks/hard_stop_policy.py",
        ".codex/hooks/pre_tool_use_policy.py",
        ".codex/hooks/subagent_context.py",
        ".codex/scripts/lifecycle.py",
        "scripts/subagent_topology.py",
        ".claude/settings.json",
        ".claude/hooks/work_block_gate.py",
        ".claude/hooks/typecheck.sh",
        ".claude/hooks/assurance_gate.py",
        "scripts/validate-evaluation.py",
        "governance/lifecycle.md",
        "governance/runtime-capabilities.md",
        "FILE_REGISTRY.yml",
        "PROJECT_MAP.md",
    }
)
STAGED_PREFIX = ".agent/controllers/v1/activation/staged/"
LITERAL_ACTIVATION_PATH = re.compile(r"^[A-Za-z0-9._@+/-]+$")


@dataclass(frozen=True)
class DestinationPreimage:
    state: str
    kind: str | None
    mode: str | None
    identity: str | None


@dataclass(frozen=True)
class ActivationEntry:
    source: str
    source_entry: SurfaceEntry
    destination: str
    operation: str
    preimage: DestinationPreimage


def _entry_from_fields(path: str, value: object, label: str) -> SurfaceEntry:
    if not isinstance(value, dict):
        raise ValidationError(f"{label} must be an object")
    try:
        return SurfaceEntry(os.fsencode(path), value["type"], value["mode"], value["identity"])
    except (KeyError, TypeError) as exc:
        raise ValidationError(f"{label} is incomplete") from exc


def _preimage(value: object) -> DestinationPreimage:
    if not isinstance(value, dict):
        raise ValidationError("destination_preimage must be an object")
    state = value.get("state")
    kind = value.get("type")
    mode = value.get("mode")
    identity = value.get("identity")
    if state == "absent":
        if any(item is not None for item in (kind, mode, identity)):
            raise ValidationError("absent preimage type, mode, and identity must be null")
        return DestinationPreimage("absent", None, None, None)
    if state != "present":
        raise ValidationError("destination preimage state must be present or absent")
    probe = _entry_from_fields("preimage", value, "present destination_preimage")
    return DestinationPreimage("present", probe.kind, probe.mode, probe.identity)


def parse_activation_map(value: Mapping[str, object]) -> tuple[ActivationEntry, ...]:
    if value.get("schema") != "azursystech-controller-activation-map-v1":
        raise ValidationError("unsupported activation-map schema")
    if value.get("parent_generation") != "legacy" or value.get("target_generation") != "v1":
        raise ValidationError("activation-map generation relationship must be legacy -> v1")
    raw_entries = value.get("entries")
    if not isinstance(raw_entries, list) or not raw_entries:
        raise ValidationError("activation-map entries must be a non-empty array")
    entries: list[ActivationEntry] = []
    destinations: set[str] = set()
    for raw in raw_entries:
        if not isinstance(raw, dict):
            raise ValidationError("activation-map entry must be an object")
        source = safe_relative_path(raw.get("source"), "activation source")
        destination = safe_relative_path(raw.get("destination"), "activation destination")
        if not LITERAL_ACTIVATION_PATH.fullmatch(source):
            raise ValidationError("activation source must be one exact literal path")
        if not LITERAL_ACTIVATION_PATH.fullmatch(destination):
            raise ValidationError("activation destination must be one exact literal path")
        if not source.startswith(STAGED_PREFIX):
            raise ValidationError("activation source must be under the inert staged area")
        if destination not in ALLOWED_DESTINATIONS:
            raise ValidationError("activation destination is outside the finite vocabulary")
        if destination in destinations:
            raise ValidationError("activation-map contains a duplicate destination")
        destinations.add(destination)
        operation = raw.get("operation")
        if operation not in {"create", "replace"}:
            raise ValidationError("activation operation must be create or replace")
        preimage = _preimage(raw.get("destination_preimage"))
        if operation == "create" and preimage.state != "absent":
            raise ValidationError("create requires an absent destination preimage")
        if operation == "replace" and preimage.state != "present":
            raise ValidationError("replace requires a present destination preimage")
        source_entry = _entry_from_fields(source, raw.get("source_identity"), "source_identity")
        entries.append(ActivationEntry(source, source_entry, destination, operation, preimage))
    return tuple(entries)


def read_activation_map(path: Path) -> tuple[ActivationEntry, ...]:
    try:
        value = json.loads(path.read_bytes())
    except (OSError, json.JSONDecodeError) as exc:
        raise ValidationError(f"activation-map cannot be read: {exc}") from exc
    if not isinstance(value, dict):
        raise ValidationError("activation-map must be an object")
    return parse_activation_map(value)


def _observed(root: Path, path: str) -> SurfaceEntry | None:
    target = root / path
    if not target.exists() and not target.is_symlink():
        return None
    return identity_for_path(root, path)


def verify_sources(root: Path, entries: Iterable[ActivationEntry]) -> None:
    for entry in entries:
        if _observed(root, entry.source) != entry.source_entry:
            raise ValidationError(f"staged source identity mismatch: {entry.source}")


def verify_preimages(root: Path, entries: Iterable[ActivationEntry]) -> None:
    for entry in entries:
        observed = _observed(root, entry.destination)
        if entry.preimage.state == "absent":
            if observed is not None:
                raise TransitionDenied(f"create destination unexpectedly exists: {entry.destination}")
            continue
        expected = SurfaceEntry(
            os.fsencode(entry.destination),
            entry.preimage.kind or "",
            entry.preimage.mode or "",
            entry.preimage.identity or "",
        )
        if observed != expected:
            raise TransitionDenied(f"replace destination preimage mismatch: {entry.destination}")


def verify_postimage(root: Path, entries: Iterable[ActivationEntry], changed_paths: Iterable[str]) -> None:
    entry_tuple = tuple(entries)
    expected_paths = {entry.destination for entry in entry_tuple}
    observed_paths = tuple(changed_paths)
    if len(observed_paths) != len(set(observed_paths)) or set(observed_paths) != expected_paths:
        raise ValidationError("activation delta is not the exact activation-map destination set")
    for entry in entry_tuple:
        observed = _observed(root, entry.destination)
        expected = SurfaceEntry(
            os.fsencode(entry.destination),
            entry.source_entry.kind,
            entry.source_entry.mode,
            entry.source_entry.identity,
        )
        if observed != expected:
            raise ValidationError(f"activation postimage mismatch: {entry.destination}")


def _copy_exact(source: Path, destination: Path, entry: SurfaceEntry) -> None:
    destination.parent.mkdir(parents=True, exist_ok=True)
    temporary_path: Path | None = None
    try:
        if entry.kind == "regular":
            descriptor, raw_temporary = tempfile.mkstemp(prefix=f".{destination.name}.", dir=destination.parent)
            temporary_path = Path(raw_temporary)
            with os.fdopen(descriptor, "wb") as stream:
                with source.open("rb") as source_stream:
                    while block := source_stream.read(1024 * 1024):
                        stream.write(block)
                stream.flush()
                os.fsync(stream.fileno())
            os.chmod(temporary_path, 0o755 if entry.mode == "100755" else 0o644)
        else:
            target = os.readlink(source)
            descriptor, raw_temporary = tempfile.mkstemp(
                prefix=f".{destination.name}.", dir=destination.parent
            )
            os.close(descriptor)
            os.unlink(raw_temporary)
            temporary_path = Path(raw_temporary)
            os.symlink(target, temporary_path)
        os.replace(temporary_path, destination)
        temporary_path = None
        directory_fd = os.open(destination.parent, os.O_RDONLY | getattr(os, "O_DIRECTORY", 0))
        try:
            os.fsync(directory_fd)
        except OSError as exc:
            raise DurabilityUncertain(f"activation replacement durability is indeterminate: {exc}") from exc
        finally:
            os.close(directory_fd)
    finally:
        if temporary_path is not None:
            try:
                temporary_path.unlink()
            except FileNotFoundError:
                pass


def materialize(
    source_root: Path,
    destination_root: Path,
    entries: Iterable[ActivationEntry],
    *,
    work_block_inactive: bool,
    owner_authorized: bool,
) -> tuple[str, ...]:
    """Project pre-assured bytes into a separate activation tree.

    ``source_root`` is the verified terminal T checkout containing the staged
    bytes. ``destination_root`` is an isolated tree used to construct A.  They
    must never be the same filesystem location.
    """
    if not work_block_inactive:
        raise TransitionDenied("activation is forbidden while the implementing Work Block is active")
    if not owner_authorized:
        raise TransitionDenied("activation requires the external Owner-controlled boundary")
    if source_root.resolve() == destination_root.resolve():
        raise TransitionDenied("activation source and destination trees must be isolated")
    entry_tuple = tuple(entries)
    verify_sources(source_root, entry_tuple)
    verify_preimages(destination_root, entry_tuple)
    for entry in entry_tuple:
        _copy_exact(
            source_root / entry.source,
            destination_root / entry.destination,
            entry.source_entry,
        )
    changed = tuple(entry.destination for entry in entry_tuple)
    verify_postimage(destination_root, entry_tuple, changed)
    return changed
