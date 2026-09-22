"""Exact path identity and the normative ``sealed-surface-v1`` algorithm."""

from __future__ import annotations

import base64
import hashlib
import os
import stat
from dataclasses import dataclass
from pathlib import Path, PurePosixPath
from typing import Iterable, Sequence

from .errors import ValidationError

HEADER = b"WB031-SEALED-SURFACE-v1\x00"
REGULAR_TYPE = 0x01
SYMLINK_TYPE = 0x02
SHA256_ALGORITHM = 0x01
ALLOWED_REGULAR_MODES = {"100644", "100755"}


def _valid_path_bytes(raw: bytes) -> None:
    if not raw or raw.startswith(b"/") or b"\x00" in raw:
        raise ValidationError("sealed path must be a non-empty repository-relative Git path")
    parts = raw.split(b"/")
    if any(part in {b"", b".", b".."} for part in parts):
        raise ValidationError("sealed path contains an invalid segment")


def _path_bytes(value: str | bytes) -> bytes:
    raw = value if isinstance(value, bytes) else os.fsencode(value)
    _valid_path_bytes(raw)
    return raw


@dataclass(frozen=True)
class SurfaceEntry:
    path: bytes
    kind: str
    mode: str
    identity: str

    def __post_init__(self) -> None:
        _valid_path_bytes(self.path)
        if self.kind == "regular":
            if self.mode not in ALLOWED_REGULAR_MODES:
                raise ValidationError("regular sealed entry mode must be 100644 or 100755")
        elif self.kind == "symlink":
            if self.mode != "120000":
                raise ValidationError("symlink sealed entry mode must be 120000")
        else:
            raise ValidationError("sealed entry type must be regular or symlink")
        prefix, separator, digest = self.identity.partition(":")
        if prefix != "sha256" or separator != ":" or len(digest) != 64:
            raise ValidationError("sealed entry identity must be sha256:<64-hex>")
        if any(character not in "0123456789abcdef" for character in digest):
            raise ValidationError("sealed entry identity must use lower-case hexadecimal")

    @property
    def path_b64(self) -> str:
        return base64.b64encode(self.path).decode("ascii")

    @property
    def type_code(self) -> int:
        return REGULAR_TYPE if self.kind == "regular" else SYMLINK_TYPE

    @property
    def digest_bytes(self) -> bytes:
        return bytes.fromhex(self.identity.removeprefix("sha256:"))

    def as_manifest_record(self) -> dict[str, str]:
        return {
            "path_b64": self.path_b64,
            "type": self.kind,
            "mode": self.mode,
            "identity": self.identity,
        }


def identity_for_path(root: Path, relative: str | bytes) -> SurfaceEntry:
    raw = _path_bytes(relative)
    path = root / os.fsdecode(raw)
    try:
        metadata = path.lstat()
    except OSError as exc:
        raise ValidationError(f"cannot inspect sealed path {os.fsdecode(raw)!r}: {exc}") from exc
    if stat.S_ISLNK(metadata.st_mode):
        target = os.fsencode(os.readlink(path))
        return SurfaceEntry(raw, "symlink", "120000", f"sha256:{hashlib.sha256(target).hexdigest()}")
    if stat.S_ISREG(metadata.st_mode):
        mode = "100755" if metadata.st_mode & 0o111 else "100644"
        try:
            payload = path.read_bytes()
        except OSError as exc:
            raise ValidationError(f"cannot read sealed path {os.fsdecode(raw)!r}: {exc}") from exc
        return SurfaceEntry(raw, "regular", mode, f"sha256:{hashlib.sha256(payload).hexdigest()}")
    raise ValidationError(f"unsupported sealed path type: {os.fsdecode(raw)!r}")


def scan_surface(root: Path, paths: Iterable[str | bytes]) -> tuple[SurfaceEntry, ...]:
    entries = tuple(identity_for_path(root, path) for path in paths)
    return normalize_entries(entries)


def normalize_entries(entries: Sequence[SurfaceEntry]) -> tuple[SurfaceEntry, ...]:
    ordered = tuple(sorted(entries, key=lambda entry: entry.path))
    if len({entry.path for entry in ordered}) != len(ordered):
        raise ValidationError("sealed surface contains duplicate paths")
    return ordered


def sealed_surface_bytes(entries: Sequence[SurfaceEntry]) -> bytes:
    ordered = normalize_entries(entries)
    output = bytearray(HEADER)
    output.extend(len(ordered).to_bytes(8, "big"))
    for entry in ordered:
        output.append(0x01)
        output.extend(len(entry.path).to_bytes(4, "big"))
        output.extend(entry.path)
        output.append(entry.type_code)
        output.extend(entry.mode.encode("ascii"))
        output.append(SHA256_ALGORITHM)
        output.extend(entry.digest_bytes)
    return bytes(output)


def sealed_surface_identity(entries: Sequence[SurfaceEntry]) -> str:
    digest = hashlib.sha256(sealed_surface_bytes(entries)).hexdigest()
    return f"sealed-surface-sha256-v1:{digest}"


def entries_from_manifest(records: object) -> tuple[SurfaceEntry, ...]:
    if not isinstance(records, list):
        raise ValidationError("sealed manifest entries must be an array")
    entries: list[SurfaceEntry] = []
    for record in records:
        if not isinstance(record, dict):
            raise ValidationError("sealed manifest entry must be an object")
        try:
            raw = base64.b64decode(record["path_b64"], validate=True)
            entry = SurfaceEntry(raw, record["type"], record["mode"], record["identity"])
        except (KeyError, TypeError, ValueError) as exc:
            raise ValidationError("invalid sealed manifest entry") from exc
        entries.append(entry)
    return normalize_entries(entries)


def safe_relative_path(value: object, label: str = "path") -> str:
    if not isinstance(value, str) or not value:
        raise ValidationError(f"{label} must be a non-empty path")
    pure = PurePosixPath(value)
    if pure.is_absolute() or any(part in {"", ".", ".."} for part in pure.parts):
        raise ValidationError(f"{label} must be a normalized repository-relative path")
    _valid_path_bytes(os.fsencode(value))
    return pure.as_posix()
