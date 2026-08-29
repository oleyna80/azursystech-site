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


def active_paths(root: Path) -> tuple[str, str, str]:
    """Resolve current repository-owned active lifecycle identities."""
    registry = yaml.safe_load((root / "FILE_REGISTRY.yml").read_text(encoding="utf-8"))
    plan = registry["migration_state"]["active_work_block"]
    if not isinstance(plan, str):
        raise AssertionError("fixture repository must have a canonical active Work Block")
    operational = json.loads(
        (root / ".agent/active-work-block.json").read_text(encoding="utf-8")
    )
    work_block_id = operational["work_block_id"]
    specification = operational["specification"]["path"]
    if not all(isinstance(value, str) and value for value in (work_block_id, specification)):
        raise AssertionError("fixture repository must have a valid operational active Work Block")
    return plan, work_block_id, specification


def require_workflow_active_gate_path(root: Path) -> None:
    workflow = yaml.load(
        (root / ".github/workflows/release-state-contract.yml").read_text(encoding="utf-8"),
        Loader=yaml.BaseLoader,
    )
    for trigger in ("push", "pull_request"):
        paths = workflow["on"][trigger]["paths"]
        if ".agent/active-work-block.json" not in paths:
            raise AssertionError(f"{trigger} does not trigger on .agent/active-work-block.json")
        if "docs/specs/**" not in paths:
            raise AssertionError(f"{trigger} does not trigger on docs/specs/**")
        require_workflow_path_contract(paths, trigger)


def workflow_path_matches(pattern: str, changed_path: str) -> bool:
    """Model the literal and recursive directory patterns used by this workflow."""
    if pattern.endswith("/**"):
        return changed_path.startswith(pattern[:-2])
    return changed_path == pattern


def workflow_runs_for_paths(patterns: list[str], changed_paths: list[str]) -> bool:
    return any(
        workflow_path_matches(pattern, changed_path)
        for pattern in patterns
        for changed_path in changed_paths
    )


def require_workflow_path_contract(paths: list[str], trigger: str) -> None:
    cases = {
        "specification content change": ["docs/specs/WB-current.md"],
        "specification deletion": ["docs/specs/WB-removed.md"],
        "rename into specifications": ["docs/plans/WB-old.md", "docs/specs/WB-new.md"],
        "rename out of specifications": ["docs/specs/WB-old.md", "docs/plans/WB-new.md"],
    }
    for label, changed_paths in cases.items():
        if not workflow_runs_for_paths(paths, changed_paths):
            raise AssertionError(
                f"{trigger} does not trigger for {label}: {changed_paths!r}"
            )
    if workflow_runs_for_paths(paths, ["docs/specifications/WB-unrelated.md"]):
        raise AssertionError(f"{trigger} docs/specs/** matcher overmatches docs/specifications")

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
        plan, active_id, _ = active_paths(fixture)
        alternate = "docs/plans/alternate-active-work-block.md"
        (fixture / alternate).write_text(
            (fixture / plan).read_text(encoding="utf-8").replace(
                active_id,
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
        active = fixture / ".agent/active-work-block.json"
        data = json.loads(active.read_text(encoding="utf-8"))
        _, active_id, specification_path = active_paths(fixture)
        wrong_specification = "docs/specs/WB-disposable-wrong-identity.md"
        (fixture / wrong_specification).write_text(
            "---\n"
            "artifact_type: specification\n"
            "work_block_id: WB-disposable-wrong-identity\n"
            "revision: v1\n"
            "---\n\n"
            "# Disposable wrong identity specification\n",
            encoding="utf-8",
        )
        data["specification"]["path"] = wrong_specification
        active.write_text(json.dumps(data), encoding="utf-8")
        require_failure(
            fixture,
            "existing specification with wrong Work Block identity must fail",
            "operational active Work Block specification Work Block ID does not match "
            "release-state active Work Block",
        )
    with tempfile.TemporaryDirectory(prefix="release-state-contract-") as holder:
        fixture = fixture_root(holder)
        _, _, specification_path = active_paths(fixture)
        specification = fixture / specification_path
        specification.write_text(
            specification.read_text(encoding="utf-8").replace(
                "artifact_type: specification", "artifact_type: work_block", 1
            ),
            encoding="utf-8",
        )
        require_failure(
            fixture,
            "operational specification with wrong artifact type must fail",
            "operational active Work Block specification requires artifact_type=specification",
        )
    with tempfile.TemporaryDirectory(prefix="release-state-contract-") as holder:
        fixture = fixture_root(holder)
        _, _, specification_path = active_paths(fixture)
        specification = fixture / specification_path
        specification.write_text(
            specification.read_text(encoding="utf-8").replace("---\n", "", 1),
            encoding="utf-8",
        )
        require_failure(
            fixture,
            "operational specification without frontmatter must fail",
            "operational active Work Block specification requires YAML frontmatter",
        )
    with tempfile.TemporaryDirectory(prefix="release-state-contract-") as holder:
        fixture = fixture_root(holder)
        _, _, specification_path = active_paths(fixture)
        specification = fixture / specification_path
        specification.write_text("---\nartifact_type: specification\n", encoding="utf-8")
        require_failure(
            fixture,
            "operational specification with malformed frontmatter must fail",
            "operational active Work Block specification has unterminated YAML frontmatter",
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
        plan, active_id, _ = active_paths(fixture)
        registry = fixture / "FILE_REGISTRY.yml"
        registry.write_text(registry.read_text(encoding="utf-8").replace(f"active_work_block: {plan}", "active_work_block: null", 1), encoding="utf-8")
        project_map = fixture / "PROJECT_MAP.md"
        project_map.write_text(
            project_map.read_text(encoding="utf-8")
            .replace(f"active_work_block: {plan}", "active_work_block: null", 1)
            .replace(
                f"- Active implementation Work Block: `{active_id}`\n"
                f"  at `{plan}`.",
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
