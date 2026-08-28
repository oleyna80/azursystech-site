#!/usr/bin/env python3
"""Deterministic regression checks for the release-state validator."""
from __future__ import annotations
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
VALIDATOR = ROOT / "scripts" / "validate-release-state.py"

def run(root: Path) -> subprocess.CompletedProcess[str]:
    return subprocess.run([sys.executable, str(VALIDATOR), "--root", str(root)], text=True, capture_output=True, check=False)

def require(result: subprocess.CompletedProcess[str], expected: int, label: str) -> None:
    if result.returncode != expected:
        raise AssertionError(f"{label}: expected exit {expected}, got {result.returncode}\nstdout:\n{result.stdout}\nstderr:\n{result.stderr}")

def main() -> int:
    require(run(ROOT), 0, "repository release-state contract")
    with tempfile.TemporaryDirectory(prefix="release-state-contract-") as holder:
        fixture = Path(holder) / "repo"
        shutil.copytree(ROOT, fixture, ignore=shutil.ignore_patterns(".git", ".next", "node_modules"))
        registry = fixture / "FILE_REGISTRY.yml"
        registry.write_text(registry.read_text(encoding="utf-8").replace("migration_state:", "invalid_migration_state:", 1), encoding="utf-8")
        result = run(fixture)
        require(result, 1, "missing migration-state must fail")
        if "FILE_REGISTRY.yml requires migration_state" not in result.stderr:
            raise AssertionError(f"missing migration-state error was not deterministic: {result.stderr}")
    print("release-state contract regressions: OK")
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
