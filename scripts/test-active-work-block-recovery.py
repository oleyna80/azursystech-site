#!/usr/bin/env python3
"""Regression tests for canonical inactive Work Block closeout materialization."""
from __future__ import annotations

import json
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
LIFECYCLE = ROOT / ".codex/scripts/lifecycle.py"


def main() -> int:
    with tempfile.TemporaryDirectory(prefix="active-work-block-recovery-") as holder:
        fixture = Path(holder) / "repo"
        shutil.copytree(ROOT, fixture, ignore=shutil.ignore_patterns(".git", "__pycache__"))
        state_path = fixture / ".agent/active-work-block.json"
        state = json.loads(state_path.read_text(encoding="utf-8"))
        state.update(
            {
                "work_block_id": "WB-stale-published-state",
                "subject_branch": "stale/subject-branch",
                "base_commit": "stale-base-commit",
                "specification": {"path": "docs/specs/stale.md", "revision": "old"},
                "write_set": ["web/src/app/page.tsx"],
                "write_gate": {"status": "READY", "opened_at": "2026-09-08T00:00:00Z"},
            }
        )
        for name in ("review", "verification"):
            state["assurance"][name].update(
                status="READY", verdict="READY", report="docs/reports/verification-WB-2026-09-03.md",
                isolation="independent-readonly-root",
            )
        for name in ("evaluation", "drift"):
            state["assurance"][name].update(
                status="SKIPPED", verdict="PENDING", skip_reason="not required by deterministic recovery scope"
            )
        state_path.write_text(json.dumps(state), encoding="utf-8")
        result = subprocess.run(
            [sys.executable, str(LIFECYCLE), "--root", str(fixture), "close", "--mode", "success-closeout", "--reason", "recovery regression"],
            cwd=fixture, text=True, capture_output=True, check=False,
        )
        if result.returncode != 0:
            raise AssertionError(result.stderr or result.stdout)
        inactive = json.loads(state_path.read_text(encoding="utf-8"))
        assert inactive["work_block_id"] == ""
        assert inactive["subject_branch"] == ""
        assert inactive["base_commit"] == ""
        assert inactive["specification"] == {"path": "", "revision": ""}
        assert inactive["write_set"] == []
        assert inactive["write_gate"] == {"status": "BLOCKED", "opened_at": None}
        assert inactive["closeout_mode"] == "success-closeout"
    print("active Work Block recovery regressions: OK")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
