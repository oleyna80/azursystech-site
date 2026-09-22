"""Claude Code event normalization only."""

from __future__ import annotations

from collections.abc import Mapping

from ..policy import NormalizedEvent
from .common import lifecycle_operation, payload_object, write_paths


def normalize_claude(event: Mapping[str, object], *, repository_root: str) -> NormalizedEvent:
    tool = str(event.get("tool_name") or event.get("tool") or "")
    payload = payload_object(event)
    transition = lifecycle_operation(tool, payload)
    paths = write_paths(tool, payload) if transition is None else ()
    operation = "lifecycle_transition" if transition is not None else ("write" if paths is not None else "read")
    if str(event.get("event_type") or "") == "native_dispatch":
        operation = "native_dispatch"
        paths = ()
    metadata = dict(payload)
    if transition is not None:
        metadata["lifecycle_operation"] = transition
    return NormalizedEvent("claude", operation, tool, repository_root, paths or (), metadata)
