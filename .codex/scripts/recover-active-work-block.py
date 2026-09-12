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

REQUIRED_REPOSITORY_MARKERS = (
    "AGENTS.md",
    "PROJECT_MAP.md",
    ".agent/bootstrap-profile.json",
    ".agent/active-work-block.default.json",
    ".codex/scripts/lifecycle.py",
)


def git_worktree_root(start: Path, context: str) -> Path:
    result = lifecycle.run_git(start, "rev-parse", "--show-toplevel")
    if result.returncode != 0 or not result.stdout.strip():
        raise ValueError(f"{context} must be inside a Git worktree")
    return Path(result.stdout.strip()).resolve()


def repository_root() -> Path:
    script_root = SCRIPT_DIR.parents[1]
    owned_root = git_worktree_root(script_root, "recovery script")
    if owned_root != script_root:
        raise ValueError("recovery script must be located in its Git worktree root")

    current_root = git_worktree_root(Path.cwd(), "recovery")
    if current_root != owned_root:
        raise ValueError("recovery must run from the script-owned Git worktree")

    missing = [marker for marker in REQUIRED_REPOSITORY_MARKERS if not (current_root / marker).is_file()]
    if missing:
        raise ValueError(f"recovery repository lacks required markers: {', '.join(missing)}")
    return current_root


def is_canonical_inactive(value: dict, template: dict) -> bool:
    ignored_closure_fields = {"closeout_mode", "lifecycle_note"}
    value_without_closure = {
        key: item for key, item in value.items() if key not in ignored_closure_fields
    }
    template_without_closure = {
        key: item for key, item in template.items() if key not in ignored_closure_fields
    }
    return value_without_closure == template_without_closure


def main() -> int:
    try:
        if len(sys.argv) != 1:
            raise ValueError("recovery accepts no arguments")
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
            if isinstance(value, dict) and is_canonical_inactive(value, template):
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
