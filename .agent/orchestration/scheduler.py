"""Transient orchestration scheduling rules; no runtime topology is persisted."""

from __future__ import annotations

from dataclasses import dataclass

from controllers.v1 import state


class WriterConflict(Exception):
    """A write-capable role overlaps another active writer in this run."""


@dataclass(frozen=True, slots=True)
class WriterLease:
    writer_key: str
    scopes: tuple[str, ...]


class WriterScheduler:
    def __init__(self) -> None:
        self._active: dict[str, tuple[str, ...]] = {}

    def acquire(self, writer_key: str, scopes: list[str] | tuple[str, ...]) -> WriterLease:
        if not isinstance(writer_key, str) or not writer_key:
            raise ValueError("writer_key is required")
        normalized = tuple(scopes)
        if not normalized:
            raise ValueError("write-capable role requires non-empty scope")
        if writer_key in self._active:
            raise WriterConflict("writer already holds an active lease")
        for active_key, active_scope in self._active.items():
            if state.scopes_overlap(normalized, active_scope):
                raise WriterConflict(
                    f"writer scope overlaps active writer {active_key}; serialize dispatch"
                )
        self._active[writer_key] = normalized
        return WriterLease(writer_key, normalized)

    def release(self, lease: WriterLease) -> None:
        if self._active.get(lease.writer_key) != lease.scopes:
            raise WriterConflict("writer lease is not active")
        del self._active[lease.writer_key]

    def active(self) -> tuple[WriterLease, ...]:
        return tuple(
            WriterLease(key, scopes)
            for key, scopes in sorted(self._active.items())
        )
