#!/usr/bin/env python3
"""Deterministic regression checks for the release-state validator."""
from __future__ import annotations
import json
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parents[1]
VALIDATOR = ROOT / "scripts" / "validate-release-state.py"

def run(root: Path) -> subprocess.CompletedProcess[str]:
    return subprocess.run([sys.executable, str(VALIDATOR), "--root", str(root)], text=True, capture_output=True, check=False)

def require(result: subprocess.CompletedProcess[str], expected: int, label: str) -> None:
    if result.returncode != expected:
        raise AssertionError(f"{label}: expected exit {expected}, got {result.returncode}\nstdout:\n{result.stdout}\nstderr:\n{result.stderr}")


def fixture_root(holder: str) -> Path:
    fixture = Path(holder) / "repo"
    shutil.copytree(ROOT, fixture, ignore=shutil.ignore_patterns(".git", ".next", "node_modules"))
    return fixture


def require_failure(root: Path, label: str, expected_error: str) -> None:
    result = run(root)
    require(result, 1, label)
    if expected_error not in result.stderr:
        raise AssertionError(f"{label}: missing deterministic error {expected_error!r}: {result.stderr}")


def require_workflow_active_gate_path(root: Path) -> None:
    workflow = yaml.load(
        (root / ".github/workflows/release-state-contract.yml").read_text(encoding="utf-8"),
        Loader=yaml.BaseLoader,
    )
    for trigger in ("push", "pull_request"):
        paths = workflow["on"][trigger]["paths"]
        if ".agent/active-work-block.json" not in paths:
            raise AssertionError(f"{trigger} does not trigger on .agent/active-work-block.json")

def main() -> int:
    require(run(ROOT), 0, "repository release-state contract")
    require_workflow_active_gate_path(ROOT)
    with tempfile.TemporaryDirectory(prefix="release-state-contract-") as holder:
        require(run(fixture_root(holder)), 0, "matching release and operational active state must pass")
    with tempfile.TemporaryDirectory(prefix="release-state-contract-") as holder:
        fixture = fixture_root(holder)
        registry = fixture / "FILE_REGISTRY.yml"
        registry.write_text(registry.read_text(encoding="utf-8").replace("migration_state:", "invalid_migration_state:", 1), encoding="utf-8")
        require_failure(fixture, "missing migration-state must fail", "FILE_REGISTRY.yml requires migration_state")
    with tempfile.TemporaryDirectory(prefix="release-state-contract-") as holder:
        fixture = fixture_root(holder)
        plan = "docs/plans/WB-2026-08-28-repository-lifecycle-normalization.md"
        alternate = "docs/plans/alternate-active-work-block.md"
        (fixture / alternate).write_text(
            (fixture / plan).read_text(encoding="utf-8").replace(
                "WB-2026-08-28-repository-lifecycle-normalization",
                "WB-alternate-active-work-block",
            ),
            encoding="utf-8",
        )
        for relative in ("FILE_REGISTRY.yml", "PROJECT_MAP.md"):
            path = fixture / relative
            path.write_text(path.read_text(encoding="utf-8").replace(plan, alternate), encoding="utf-8")
        require_failure(
            fixture,
            "registry and map changed without operational active record must fail",
            "operational active Work Block ID does not match release-state active Work Block",
        )
    with tempfile.TemporaryDirectory(prefix="release-state-contract-") as holder:
        fixture = fixture_root(holder)
        active = fixture / ".agent/active-work-block.json"
        data = json.loads(active.read_text(encoding="utf-8"))
        data["work_block_id"] = "WB-operational-mismatch"
        active.write_text(json.dumps(data), encoding="utf-8")
        require_failure(
            fixture,
            "operational active record changed without registry and map must fail",
            "operational active Work Block ID does not match release-state active Work Block",
        )
    with tempfile.TemporaryDirectory(prefix="release-state-contract-") as holder:
        fixture = fixture_root(holder)
        active = fixture / ".agent/active-work-block.json"
        data = json.loads(active.read_text(encoding="utf-8"))
        data["specification"]["path"] = "docs/specs/missing-operational-specification.md"
        active.write_text(json.dumps(data), encoding="utf-8")
        require_failure(
            fixture,
            "operational specification path changed without registry and map must fail",
            "operational active Work Block specification.path is missing",
        )
    with tempfile.TemporaryDirectory(prefix="release-state-contract-") as holder:
        fixture = fixture_root(holder)
        (fixture / ".agent/active-work-block.json").unlink()
        require_failure(fixture, "missing operational active record must fail", "operational active Work Block is missing")
    with tempfile.TemporaryDirectory(prefix="release-state-contract-") as holder:
        fixture = fixture_root(holder)
        active = fixture / ".agent/active-work-block.json"
        active.write_text("{", encoding="utf-8")
        require_failure(fixture, "malformed operational active record must fail", "operational active Work Block is malformed")
    with tempfile.TemporaryDirectory(prefix="release-state-contract-") as holder:
        fixture = fixture_root(holder)
        registry = fixture / "FILE_REGISTRY.yml"
        registry.write_text(registry.read_text(encoding="utf-8").replace("active_work_block: docs/plans/WB-2026-08-28-repository-lifecycle-normalization.md", "active_work_block: null", 1), encoding="utf-8")
        project_map = fixture / "PROJECT_MAP.md"
        project_map.write_text(
            project_map.read_text(encoding="utf-8")
            .replace("active_work_block: docs/plans/WB-2026-08-28-repository-lifecycle-normalization.md", "active_work_block: null", 1)
            .replace(
                "- Active implementation Work Block: `WB-2026-08-28-repository-lifecycle-normalization`\n"
                "  at `docs/plans/WB-2026-08-28-repository-lifecycle-normalization.md`.",
                "No active implementation Work Block.",
                1,
            ),
            encoding="utf-8",
        )
        require_failure(fixture, "stale operational active record with no canonical active Work Block must fail", "operational active Work Block must be inactive")
    print("release-state contract regressions: OK")
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
