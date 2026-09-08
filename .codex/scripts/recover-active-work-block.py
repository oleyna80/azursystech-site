#!/usr/bin/env python3
"""Recover a missing or corrupt Work Block record as canonical inactive state.

This is a local, coordination-only recovery helper. It never edits release
projections, changes branches, or bypasses hooks; the normal Work Block
closeout still owns successful terminal evidence and publication.
"""
from __future__ import annotations

import json
import sys
from pathlib import Path

SCRIPT_DIR = Path(__file__).resolve().parent
sys.path.insert(0, str(SCRIPT_DIR))
import lifecycle  # noqa: E402


def repository_root() -> Path:
    result = lifecycle.run_git(Path.cwd(), "rev-parse", "--show-toplevel")
    if result.returncode != 0 or not result.stdout.strip():
        raise ValueError("recovery must run inside the current Git worktree")
    return Path(result.stdout.strip()).resolve()


def is_canonical_inactive(value: dict) -> bool:
    return (
        value.get("work_block_id") == ""
        and value.get("subject_branch") == ""
        and value.get("base_commit") == ""
        and value.get("specification") == {"path": "", "revision": ""}
        and value.get("write_set") == []
        and value.get("write_gate") == {"status": "BLOCKED", "opened_at": None}
    )


def main() -> int:
    try:
        root = repository_root()
        state = root / ".agent/active-work-block.json"
        template = lifecycle.load_default_state(root)
        if not state.exists():
            value = template
        else:
            try:
                value = json.loads(state.read_text(encoding="utf-8"))
            except (OSError, json.JSONDecodeError):
                value = None
            if isinstance(value, dict) and str(value.get("work_block_id") or "").strip():
                raise ValueError("valid active Work Block state cannot be recovered")
            if isinstance(value, dict) and is_canonical_inactive(value):
                print("canonical inactive Work Block state already present")
                return 0
            value = template
        lifecycle.atomic(state, value)
        print(json.dumps(value, sort_keys=True))
        return 0
    except (OSError, ValueError) as exc:
        print(f"BLOCKED: {exc}", file=sys.stderr)
        return 2


if __name__ == "__main__":
    raise SystemExit(main())
