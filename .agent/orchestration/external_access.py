"""Ephemeral Owner/trusted-orchestration grants for bounded local imports.

External source authority is read-only and never becomes repository write
authority. Destination writes must independently satisfy the active Work Block's
normal implementation-write policy.
"""

from __future__ import annotations

import os
import re
import uuid
from dataclasses import dataclass
from pathlib import Path, PurePosixPath

from controllers.v1 import cli, hook, state
from controllers.v1.errors import ControllerError


_GRANT_ID_RE = re.compile(r"^ext-[A-Za-z0-9][A-Za-z0-9._-]{0,127}$")


class ExternalAccessDenied(Exception):
    """External read/import request is outside the explicit bounded grant."""


@dataclass(frozen=True, slots=True)
class ExternalImportGrant:
    grant_id: str
    source_root: Path
    destination_scope: tuple[str, ...]
    mode: str = "read-only"

    def __post_init__(self) -> None:
        if not isinstance(self.grant_id, str) or _GRANT_ID_RE.fullmatch(self.grant_id) is None:
            raise ExternalAccessDenied("external import grant_id is invalid")
        if self.mode != "read-only":
            raise ExternalAccessDenied("external import grant mode must be read-only")
        try:
            root = Path(self.source_root).expanduser().resolve(strict=True)
        except OSError as exc:
            raise ExternalAccessDenied("external source root cannot be resolved") from exc
        scopes = tuple(self.destination_scope)
        if not scopes:
            raise ExternalAccessDenied("external import grant requires destination scope")
        try:
            for pattern in scopes:
                # Validate every pattern independently so one earlier match cannot
                # hide a later malformed scope.
                state.scope_matches("__external_import_scope_probe__", (pattern,))
        except ControllerError as exc:
            raise ExternalAccessDenied("external import destination_scope is invalid") from exc
        object.__setattr__(self, "source_root", root)
        object.__setattr__(self, "destination_scope", scopes)

    @classmethod
    def create(
        cls,
        *,
        source_root: Path,
        destination_scope: tuple[str, ...] | list[str],
        grant_id: str | None = None,
    ) -> "ExternalImportGrant":
        return cls(
            grant_id=grant_id or f"ext-{uuid.uuid4().hex}",
            source_root=Path(source_root),
            destination_scope=tuple(destination_scope),
        )


def _inside_source(path: Path, root: Path) -> None:
    try:
        path.relative_to(root)
    except ValueError as exc:
        raise ExternalAccessDenied(
            "external source resolves outside admitted read root"
        ) from exc


def _resolve_source(
    grant: ExternalImportGrant,
    requested: Path | str,
    *,
    require_file: bool = False,
    require_dir: bool = False,
) -> Path:
    raw = Path(requested).expanduser()
    candidate = raw if raw.is_absolute() else grant.source_root / raw
    try:
        resolved = candidate.resolve(strict=True)
    except OSError as exc:
        raise ExternalAccessDenied("external source cannot be resolved") from exc
    _inside_source(resolved, grant.source_root)
    if require_file and not resolved.is_file():
        raise ExternalAccessDenied("external source is not a regular file")
    if require_dir and not resolved.is_dir():
        raise ExternalAccessDenied("external source is not a directory")
    return resolved


def _list_grant_files(
    grant: ExternalImportGrant,
    source: Path | str = ".",
) -> tuple[str, ...]:
    source_root = _resolve_source(grant, source, require_dir=True)
    files: list[str] = []
    for current, dirnames, filenames in os.walk(source_root, followlinks=False):
        current_path = Path(current)
        for dirname in list(dirnames):
            child = current_path / dirname
            if child.is_symlink():
                try:
                    resolved = child.resolve(strict=True)
                except OSError as exc:
                    raise ExternalAccessDenied(
                        "external source symlink cannot be resolved"
                    ) from exc
                _inside_source(resolved, grant.source_root)
                raise ExternalAccessDenied("symlink directories are not traversed")
        for filename in filenames:
            raw_source = current_path / filename
            _resolve_source(grant, raw_source, require_file=True)
            files.append(raw_source.relative_to(grant.source_root).as_posix())
    return tuple(sorted(files))


class ExternalReadView:
    """Read-only capability view suitable for non-Coder logical roles."""

    def __init__(self, grants: tuple[ExternalImportGrant, ...]) -> None:
        self._grants = {grant.grant_id: grant for grant in grants}

    def grants(self) -> tuple[ExternalImportGrant, ...]:
        return tuple(self._grants[key] for key in sorted(self._grants))

    def _grant(self, grant_id: str) -> ExternalImportGrant:
        try:
            return self._grants[grant_id]
        except KeyError as exc:
            raise ExternalAccessDenied("external import grant is not admitted") from exc

    def list_files(
        self,
        grant_id: str,
        source: Path | str = ".",
    ) -> tuple[str, ...]:
        return _list_grant_files(self._grant(grant_id), source)

    def read_bytes(self, grant_id: str, source: Path | str) -> bytes:
        resolved = _resolve_source(
            self._grant(grant_id),
            source,
            require_file=True,
        )
        return resolved.read_bytes()

    def read_text(
        self,
        grant_id: str,
        source: Path | str,
        *,
        encoding: str = "utf-8",
    ) -> str:
        return self.read_bytes(grant_id, source).decode(encoding)


class ExternalImportBroker:
    """Read/import API supplied only by trusted orchestration.

    No API exists for external write/delete/rename. Opaque shell commands are not
    interpreted as import authority.
    """

    def __init__(
        self,
        repo_root: Path,
        grants: tuple[ExternalImportGrant, ...] | list[ExternalImportGrant],
    ) -> None:
        self.repo_root = Path(repo_root).resolve(strict=True)
        self._grants: dict[str, ExternalImportGrant] = {}
        for grant in grants:
            if not isinstance(grant, ExternalImportGrant):
                raise ExternalAccessDenied("external access broker accepts grants only")
            if grant.mode != "read-only":
                raise ExternalAccessDenied("external grant is not read-only")
            try:
                grant.source_root.relative_to(self.repo_root)
            except ValueError:
                pass
            else:
                raise ExternalAccessDenied(
                    "external grant source_root must be outside target worktree"
                )
            if grant.grant_id in self._grants:
                raise ExternalAccessDenied("duplicate external import grant_id")
            self._grants[grant.grant_id] = grant

    def read_view(self) -> ExternalReadView:
        return ExternalReadView(self.grants())

    def grants(self) -> tuple[ExternalImportGrant, ...]:
        return tuple(self._grants[key] for key in sorted(self._grants))

    def _grant(self, grant_id: str) -> ExternalImportGrant:
        try:
            return self._grants[grant_id]
        except KeyError as exc:
            raise ExternalAccessDenied("external import grant is not admitted") from exc

    @staticmethod
    def _repo_path(path: Path) -> str:
        pure = PurePosixPath(path.as_posix())
        if not pure.parts or any(part in {"", ".", ".."} for part in pure.parts):
            raise ExternalAccessDenied("destination path is unsafe")
        normalized = pure.as_posix()
        if any(ch in normalized for ch in "*?[]"):
            raise ExternalAccessDenied("destination path must be exact")
        return normalized

    def _destination(
        self,
        grant: ExternalImportGrant,
        requested: Path | str,
    ) -> tuple[Path, str]:
        raw_text = os.fspath(requested)
        if not isinstance(raw_text, str) or not raw_text or raw_text != raw_text.strip():
            raise ExternalAccessDenied("destination path is ambiguous")
        raw = Path(raw_text)
        if not raw.is_absolute() and any(part in {".", ".."} for part in raw.parts):
            raise ExternalAccessDenied("relative destination path is ambiguous")
        candidate = raw if raw.is_absolute() else self.repo_root / raw
        if candidate.is_symlink():
            raise ExternalAccessDenied("destination symlink is not importable")
        try:
            resolved = candidate.resolve(strict=False)
            relative = resolved.relative_to(self.repo_root)
        except (OSError, ValueError) as exc:
            raise ExternalAccessDenied(
                "destination resolves outside target worktree"
            ) from exc
        repo_path = self._repo_path(relative)
        if not state.scope_matches(repo_path, grant.destination_scope):
            raise ExternalAccessDenied(
                "destination is outside external import grant destination_scope"
            )

        current = cli.status(self.repo_root)
        if current is None or current["lifecycle_state"] != "EXECUTE":
            raise ExternalAccessDenied(
                "external import destination requires active EXECUTE Work Block"
            )
        implementation = current["active"]["implementation_write_set"]
        if not state.scope_matches(repo_path, implementation):
            raise ExternalAccessDenied(
                "destination is outside active implementation_write_set"
            )

        verdict = hook.evaluate_runtime(
            "codex",
            {
                "cwd": str(self.repo_root),
                "tool_name": "Write",
                "tool_input": {"file_path": repo_path},
            },
            installation_root=self.repo_root,
        )
        if not verdict.allowed or verdict.code != "WRITE_IMPLEMENTATION_ALLOWED":
            raise ExternalAccessDenied(
                f"normal Work Block write policy denied destination: {verdict.code}"
            )
        return resolved, repo_path

    def list_files(
        self,
        grant_id: str,
        source: Path | str = ".",
    ) -> tuple[str, ...]:
        return _list_grant_files(self._grant(grant_id), source)

    def read_bytes(self, grant_id: str, source: Path | str) -> bytes:
        resolved = _resolve_source(
            self._grant(grant_id),
            source,
            require_file=True,
        )
        return resolved.read_bytes()

    def read_text(
        self,
        grant_id: str,
        source: Path | str,
        *,
        encoding: str = "utf-8",
    ) -> str:
        return self.read_bytes(grant_id, source).decode(encoding)

    def import_file(
        self,
        grant_id: str,
        source: Path | str,
        destination: Path | str,
    ) -> str:
        grant = self._grant(grant_id)
        source_path = _resolve_source(grant, source, require_file=True)
        destination_path, repo_path = self._destination(grant, destination)
        payload = source_path.read_bytes()
        destination_path.parent.mkdir(parents=True, exist_ok=True)
        destination_path.write_bytes(payload)
        return repo_path

    def import_tree(
        self,
        grant_id: str,
        source: Path | str,
        destination: Path | str,
    ) -> tuple[str, ...]:
        grant = self._grant(grant_id)
        source_root = _resolve_source(grant, source, require_dir=True)

        files: list[tuple[bytes, Path, str]] = []
        for current, dirnames, filenames in os.walk(source_root, followlinks=False):
            current_path = Path(current)
            for dirname in list(dirnames):
                child = current_path / dirname
                if child.is_symlink():
                    try:
                        resolved = child.resolve(strict=True)
                    except OSError as exc:
                        raise ExternalAccessDenied(
                            "external source symlink cannot be resolved"
                        ) from exc
                    _inside_source(resolved, grant.source_root)
                    raise ExternalAccessDenied(
                        "symlink directories are not imported recursively"
                    )
            for filename in filenames:
                raw_source = current_path / filename
                resolved_source = _resolve_source(
                    grant,
                    raw_source,
                    require_file=True,
                )
                relative = raw_source.relative_to(source_root)
                raw_destination = Path(destination) / relative
                destination_path, repo_path = self._destination(
                    grant,
                    raw_destination,
                )
                files.append(
                    (
                        resolved_source.read_bytes(),
                        destination_path,
                        repo_path,
                    )
                )

        # All source and destination paths are validated before the first write.
        imported: list[str] = []
        for payload, destination_path, repo_path in files:
            destination_path.parent.mkdir(parents=True, exist_ok=True)
            destination_path.write_bytes(payload)
            imported.append(repo_path)
        return tuple(sorted(imported))
