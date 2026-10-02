"""Ephemeral Owner/trusted-orchestration grants for bounded local imports.

External source authority is read-only and never becomes repository write
authority. Destination writes must independently satisfy the active Work Block's
normal implementation-write policy.
"""

from __future__ import annotations

import os
import uuid
from dataclasses import dataclass
from pathlib import Path, PurePosixPath

from controllers.v1 import cli, hook, state


class ExternalAccessDenied(Exception):
    """External read/import request is outside the explicit bounded grant."""


@dataclass(frozen=True, slots=True)
class ExternalImportGrant:
    grant_id: str
    source_root: Path
    destination_scope: tuple[str, ...]
    mode: str = "read-only"

    @classmethod
    def create(
        cls,
        *,
        source_root: Path,
        destination_scope: tuple[str, ...] | list[str],
        grant_id: str | None = None,
    ) -> "ExternalImportGrant":
        root = Path(source_root).expanduser().resolve(strict=True)
        if not root.exists():
            raise ExternalAccessDenied("external source root does not exist")
        scopes = tuple(destination_scope)
        if not scopes:
            raise ExternalAccessDenied("external import grant requires destination scope")
        # Reuse the canonical Work Block scope grammar without widening it.
        state.scope_matches("__external_import_scope_probe__", scopes)
        identifier = grant_id or f"ext-{uuid.uuid4().hex}"
        if not isinstance(identifier, str) or not identifier.startswith("ext-"):
            raise ExternalAccessDenied("external import grant_id is invalid")
        return cls(
            grant_id=identifier,
            source_root=root,
            destination_scope=scopes,
        )


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

    def grants(self) -> tuple[ExternalImportGrant, ...]:
        return tuple(self._grants[key] for key in sorted(self._grants))

    def _grant(self, grant_id: str) -> ExternalImportGrant:
        try:
            return self._grants[grant_id]
        except KeyError as exc:
            raise ExternalAccessDenied("external import grant is not admitted") from exc

    @staticmethod
    def _inside(path: Path, root: Path) -> None:
        try:
            path.relative_to(root)
        except ValueError as exc:
            raise ExternalAccessDenied(
                "external source resolves outside admitted read root"
            ) from exc

    def _source(
        self,
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
        self._inside(resolved, grant.source_root)
        if require_file and not resolved.is_file():
            raise ExternalAccessDenied("external source is not a regular file")
        if require_dir and not resolved.is_dir():
            raise ExternalAccessDenied("external source is not a directory")
        return resolved

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
        raw = Path(requested)
        if raw.is_absolute():
            candidate = raw
        else:
            candidate = self.repo_root / raw
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

    def read_bytes(self, grant_id: str, source: Path | str) -> bytes:
        grant = self._grant(grant_id)
        resolved = self._source(grant, source, require_file=True)
        return resolved.read_bytes()

    def import_file(
        self,
        grant_id: str,
        source: Path | str,
        destination: Path | str,
    ) -> str:
        grant = self._grant(grant_id)
        source_path = self._source(grant, source, require_file=True)
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
        source_root = self._source(grant, source, require_dir=True)

        files: list[tuple[Path, bytes, Path, str]] = []
        for current, dirnames, filenames in os.walk(source_root, followlinks=False):
            current_path = Path(current)
            for dirname in list(dirnames):
                child = current_path / dirname
                if child.is_symlink():
                    resolved = child.resolve(strict=True)
                    self._inside(resolved, grant.source_root)
                    raise ExternalAccessDenied(
                        "symlink directories are not imported recursively"
                    )
            for filename in filenames:
                raw_source = current_path / filename
                resolved_source = self._source(
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
                        resolved_source,
                        resolved_source.read_bytes(),
                        destination_path,
                        repo_path,
                    )
                )

        # All source and destination paths are validated before the first write.
        imported: list[str] = []
        for _source_path, payload, destination_path, repo_path in files:
            destination_path.parent.mkdir(parents=True, exist_ok=True)
            destination_path.write_bytes(payload)
            imported.append(repo_path)
        return tuple(sorted(imported))
