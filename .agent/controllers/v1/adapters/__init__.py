"""Runtime-specific schema adapters with no policy semantics."""

from .claude import normalize_claude
from .codex import normalize_codex

__all__ = ["normalize_claude", "normalize_codex"]
