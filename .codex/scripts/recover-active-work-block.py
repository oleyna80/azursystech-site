#!/usr/bin/env python3
"""Materialize a stale active Work Block record as canonical inactive state.

This is a local, coordination-only recovery helper. It never edits release
projections, changes branches, or bypasses hooks; the normal Work Block
closeout still owns successful terminal evidence and publication.
"""
from __future__ import annotations

import argparse
import json
import subprocess
import sys
from pathlib import Path


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--root", type=Path, default=Path.cwd())
    parser.add_argument("--reason", required=True)
    args = parser.parse_args()
    root = args.root.resolve()
    state = root / ".agent/active-work-block.json"
    lifecycle = root / ".codex/scripts/lifecycle.py"
    if not state.is_file():
        print("BLOCKED: operational active Work Block is missing", file=sys.stderr)
        return 2
    try:
        value = json.loads(state.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        print(f"BLOCKED: malformed operational active Work Block: {exc}", file=sys.stderr)
        return 2
    if not isinstance(value, dict) or not str(value.get("work_block_id") or "").strip():
        print("BLOCKED: no stale active Work Block identity found", file=sys.stderr)
        return 2
    result = subprocess.run(
        [sys.executable, str(lifecycle), "--root", str(root), "prepare", "--reason", args.reason],
        cwd=root,
        text=True,
        capture_output=True,
        check=False,
    )
    sys.stdout.write(result.stdout)
    sys.stderr.write(result.stderr)
    return result.returncode


if __name__ == "__main__":
    raise SystemExit(main())
