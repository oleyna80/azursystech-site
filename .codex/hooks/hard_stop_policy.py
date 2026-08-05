#!/usr/bin/env python3
"""Codex compatibility entry point for the shared Hard Stop policy."""
from __future__ import annotations

from pathlib import Path
import runpy

POLICY = Path(__file__).resolve().parents[2] / ".agent/hooks/hard_stop_policy.py"

if __name__ == "__main__":
    runpy.run_path(str(POLICY), run_name="__main__")
