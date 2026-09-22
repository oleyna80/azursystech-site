#!/usr/bin/env python3
"""Activated Claude Stop assurance gate for controller v1."""
from __future__ import annotations

import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / ".agent/controllers"))

from v1.assurance_entrypoint import main


if __name__ == "__main__":
    main()
