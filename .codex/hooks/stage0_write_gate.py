#!/usr/bin/env python3
"""Deprecated compatibility entry point for older Codex hook configurations.

New projects should invoke ``pre_tool_use_policy.py`` through ``.codex/hooks.json``.
This shim preserves older generated projects and publication checks without
maintaining a second implementation.
"""
from __future__ import annotations

from pre_tool_use_policy import main


if __name__ == "__main__":
    main()
