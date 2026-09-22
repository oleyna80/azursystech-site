#!/usr/bin/env python3
"""Activated Claude adapter for the controller v1 canonical evaluator."""
from __future__ import annotations

import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / ".agent/controllers"))

from v1.hook_entrypoint import main


if __name__ == "__main__":
    main("claude")
