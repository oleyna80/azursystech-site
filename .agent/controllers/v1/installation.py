"""Trusted local installation configuration for replacement runtime bridges."""

from __future__ import annotations

import json
import os
import re
import stat
from dataclasses import dataclass
from pathlib import Path

from . import gitfacts
from .errors import StopAndPreserve, ValidationError

CONFIG_RELATIVE = Path("azursystech") / "installation.json"
_REPOSITORY_RE = re.compile(r"^[A-Za-z0-9_.-]+/[A-Za-z0-9_.-]+$")
_REMOTE_RE = re.compile(r"^[A-Za-z0-9_.-]+$")


@dataclass(frozen=True, slots=True)
class InstallationConfig:
    repository: str
    registry_path: Path
    remote: str
    provider_kind: str

    def __post_init__(self) -> None:
        if _REPOSITORY_RE.fullmatch(self.repository) is None:
            raise ValidationError("installation repository identity is invalid")
        if not self.registry_path.is_absolute():
            raise ValidationError("installation registry path must be absolute")
        if _REMOTE_RE.fullmatch(self.remote) is None:
            raise ValidationError("installation remote is invalid")
        if self.remote != "origin":
            raise ValidationError("replacement publication remote must be origin")
        if self.provider_kind != "github-cli":
            raise ValidationError("unsupported branch-protection provider")


def config_path(root: Path) -> Path:
    common = gitfacts.common_git_dir(root)
    return common / CONFIG_RELATIVE


def _validate_file(path: Path) -> os.stat_result:
    try:
        metadata = path.lstat()
    except OSError as exc:
        raise StopAndPreserve("trusted installation configuration is unavailable") from exc
    if stat.S_ISLNK(metadata.st_mode) or not stat.S_ISREG(metadata.st_mode):
        raise StopAndPreserve("trusted installation configuration must be a regular file")
    if metadata.st_nlink != 1:
        raise StopAndPreserve("trusted installation configuration must not be hardlinked")
    if metadata.st_mode & 0o077:
        raise StopAndPreserve("trusted installation configuration permissions are too broad")
    return metadata


def load(root: Path) -> InstallationConfig:
    root = gitfacts.worktree_root(root)
    path = config_path(root)
    _validate_file(path)
    try:
        raw = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, UnicodeError, json.JSONDecodeError) as exc:
        raise StopAndPreserve("trusted installation configuration is invalid") from exc
    if not isinstance(raw, dict):
        raise ValidationError("installation configuration must be an object")
    expected = {
        "schema_version",
        "repository",
        "registry_path",
        "remote",
        "branch_protection_provider",
    }
    if set(raw) != expected or raw.get("schema_version") != 1:
        raise ValidationError("installation configuration schema is invalid")
    provider = raw.get("branch_protection_provider")
    if not isinstance(provider, dict) or set(provider) != {"kind"}:
        raise ValidationError("branch-protection provider configuration is invalid")
    registry_raw = raw.get("registry_path")
    if not isinstance(registry_raw, str) or not registry_raw:
        raise ValidationError("installation registry path is invalid")
    registry = Path(registry_raw)
    config = InstallationConfig(
        repository=raw.get("repository"),
        registry_path=registry,
        remote=raw.get("remote"),
        provider_kind=provider.get("kind"),
    )
    try:
        config.registry_path.resolve(strict=False).relative_to(root)
    except ValueError:
        return config
    raise StopAndPreserve("trusted admission registry must be outside subject repository")


def write_bootstrap_config(
    root: Path,
    *,
    repository: str,
    registry_path: Path,
    remote: str = "origin",
    provider_kind: str = "github-cli",
) -> Path:
    """Owner/bootstrap helper used by disposable rehearsal and future WB-6 activation."""

    root = gitfacts.worktree_root(root)
    config = InstallationConfig(
        repository=repository,
        registry_path=Path(registry_path),
        remote=remote,
        provider_kind=provider_kind,
    )
    try:
        config.registry_path.resolve(strict=False).relative_to(root)
    except ValueError:
        pass
    else:
        raise StopAndPreserve("trusted admission registry must be outside subject repository")

    path = config_path(root)
    path.parent.mkdir(parents=True, exist_ok=True)
    payload = {
        "schema_version": 1,
        "repository": config.repository,
        "registry_path": str(config.registry_path),
        "remote": config.remote,
        "branch_protection_provider": {"kind": config.provider_kind},
    }
    temporary = path.with_name(path.name + ".tmp")
    try:
        with temporary.open("w", encoding="utf-8") as stream:
            json.dump(payload, stream, sort_keys=True, separators=(",", ":"))
            stream.write("\n")
            stream.flush()
            os.fsync(stream.fileno())
        os.chmod(temporary, 0o600)
        os.replace(temporary, path)
    finally:
        temporary.unlink(missing_ok=True)
    return path
