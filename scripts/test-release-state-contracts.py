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
    active_path = fixture / ".agent" / "active-work-block.json"
    active = json.loads(active_path.read_text(encoding="utf-8"))
    topology = active.get("subagent_topology")
    if isinstance(topology, dict):
        capability = topology.get("capability")
        if isinstance(capability, dict):
            capability["repository_root"] = str(fixture.resolve())
        bindings = topology.get("role_bindings")
        if isinstance(bindings, list):
            for binding in bindings:
                if isinstance(binding, dict):
                    binding["repository_root"] = str(fixture.resolve())
        active_path.write_text(json.dumps(active), encoding="utf-8")
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


def active_fixture(holder: str) -> Path:
    """Create a valid disposable active state when the repository is inactive."""
    fixture = fixture_root(holder)
    registry_path = fixture / "FILE_REGISTRY.yml"
    registry = yaml.safe_load(registry_path.read_text(encoding="utf-8"))
    if registry["migration_state"]["active_work_block"]:
        return fixture

    plan = "docs/plans/WB-release-state-regression-active.md"
    specification = "docs/specs/WB-release-state-regression-active.md"
    work_block_id = "WB-release-state-regression-active"
    (fixture / plan).write_text(
        "---\n"
        "artifact_type: work_block\n"
        f"work_block_id: {work_block_id}\n"
        "status: in_progress\n"
        "process_feedback_required: true\n"
        "revision: v1\n"
        "---\n\n"
        "# Disposable active Work Block\n",
        encoding="utf-8",
    )
    (fixture / specification).write_text(
        "---\n"
        "artifact_type: specification\n"
        f"work_block_id: {work_block_id}\n"
        "revision: v1\n"
        "---\n\n"
        "# Disposable active specification\n",
        encoding="utf-8",
    )
    registry["migration_state"]["active_work_block"] = plan
    registry_path.write_text(yaml.safe_dump(registry, sort_keys=False), encoding="utf-8")

    project_map = fixture / "PROJECT_MAP.md"
    map_text = project_map.read_text(encoding="utf-8")
    map_text = map_text.replace("active_work_block: null", f"active_work_block: {plan}")
    map_text = map_text.replace(
        "- No active implementation Work Block.",
        f"- Active implementation Work Block: `{work_block_id}`\n  at `{plan}`.",
        1,
    )
    project_map.write_text(map_text, encoding="utf-8")

    active_path = fixture / ".agent/active-work-block.json"
    active = json.loads(active_path.read_text(encoding="utf-8"))
    active["work_block_id"] = work_block_id
    active["specification"] = {"path": specification, "revision": "v1"}
    active["subject_branch"] = "fixture/operational-work"
    active["base_commit"] = "0" * 40
    active["write_gate"] = {"status": "READY", "opened_at": "2026-09-23T00:00:00Z"}
    active["write_set"] = ["scripts/validate-release-state.py"]
    active_path.write_text(json.dumps(active), encoding="utf-8")
    require(run(fixture), 0, "disposable active fixture must pass")
    return fixture


def inactive_fixture(holder: str) -> Path:
    fixture = fixture_root(holder)
    registry_path = fixture / "FILE_REGISTRY.yml"
    registry = yaml.safe_load(registry_path.read_text(encoding="utf-8"))
    active_plan = registry["migration_state"]["active_work_block"]
    if active_plan is None:
        return fixture
    operational = json.loads(
        (fixture / ".agent/active-work-block.json").read_text(encoding="utf-8")
    )
    work_block_id = operational["work_block_id"]
    registry["migration_state"]["active_work_block"] = None
    registry_path.write_text(yaml.safe_dump(registry, sort_keys=False), encoding="utf-8")
    project_map = fixture / "PROJECT_MAP.md"
    map_text = project_map.read_text(encoding="utf-8").replace(
        f"active_work_block: {active_plan}", "active_work_block: null"
    )
    migration_marker = (
        f"- Active implementation Work Block: `{work_block_id}`\n"
        f"  at `{active_plan}`.\n"
    )
    parenthesized_migration_marker = (
        f"- Active implementation Work Block: `{work_block_id}`\n"
        f"  (`{active_plan}`).\n"
    )
    if migration_marker not in map_text and parenthesized_migration_marker in map_text:
        migration_marker = parenthesized_migration_marker
    if migration_marker not in map_text:
        raise AssertionError(
            "inactive fixture could not isolate the current PROJECT_MAP Migration Work projection"
        )
    map_text = map_text.replace(
        migration_marker,
        "- No active implementation Work Block.\n",
        1,
    )
    project_map.write_text(map_text, encoding="utf-8")
    return fixture


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


def require_project_map_governance_profile(root: Path) -> None:
    """Keep the human-readable release projection aligned with the active gate."""
    active = json.loads(
        (root / ".agent" / "active-work-block.json").read_text(encoding="utf-8")
    )
    expected = active.get("governance_profile")
    if not isinstance(expected, str) or not expected:
        raise AssertionError("active Work Block must declare governance_profile")
    text = (root / "PROJECT_MAP.md").read_text(encoding="utf-8")
    try:
        block = text.split("```yaml", 1)[1].split("```", 1)[0]
        projected = yaml.safe_load(block)
    except (IndexError, yaml.YAMLError) as exc:
        raise AssertionError(f"PROJECT_MAP release-state projection is malformed: {exc}") from exc
    actual = projected.get("release_state", {}).get("governance_profile")
    if actual != expected:
        raise AssertionError(
            "PROJECT_MAP governance_profile does not match active Work Block: "
            f"projected={actual!r}, active={expected!r}"
        )


def require_verification_gate_dimension_contract(root: Path) -> None:
    """Topology role separation must not be conflated with isolation tier."""
    text = (root / ".codex" / "hooks" / "verification-gate.sh").read_text(encoding="utf-8")
    if "same-session native subagent verification is advisory" in text:
        raise AssertionError(
            "verification gate must not categorically reject same-session-degraded native subagents"
        )
    if "python3 scripts/subagent_topology.py --phase closeout" not in text:
        raise AssertionError("verification gate must delegate native topology to the topology validator")
    if "Sensitive Domains" not in text or "independent-readonly-root" not in text:
        raise AssertionError("verification gate must retain sensitive-domain isolation checks")

def main() -> int:
    require(run(ROOT), 0, "repository release-state contract")
    require_workflow_active_gate_path(ROOT)
    require_project_map_governance_profile(ROOT)
    require_verification_gate_dimension_contract(ROOT)
    with tempfile.TemporaryDirectory(prefix="release-state-contract-") as holder:
        require(run(fixture_root(holder)), 0, "matching release and operational active state must pass")
    with tempfile.TemporaryDirectory(prefix="release-state-contract-") as holder:
        fixture = fixture_root(holder)
        active_path = fixture / ".agent" / "active-work-block.json"
        active = json.loads(active_path.read_text(encoding="utf-8"))
        topology = active.get("subagent_topology")
        if isinstance(topology, dict):
            capability = topology.get("capability")
            if isinstance(capability, dict):
                capability["repository_root"] = str(fixture.parent / "different-root")
            active_path.write_text(json.dumps(active), encoding="utf-8")
            require_failure(
                fixture,
                "native topology capability root mismatch must fail",
                "operational native topology is invalid",
            )
    with tempfile.TemporaryDirectory(prefix="release-state-contract-") as holder:
        fixture = active_fixture(holder)
        registry = fixture / "FILE_REGISTRY.yml"
        registry.write_text(registry.read_text(encoding="utf-8").replace("migration_state:", "invalid_migration_state:", 1), encoding="utf-8")
        require_failure(fixture, "missing migration-state must fail", "FILE_REGISTRY.yml requires migration_state")
    with tempfile.TemporaryDirectory(prefix="release-state-contract-") as holder:
        fixture = active_fixture(holder)
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
        require(run(fixture), 0, "migration active record may differ from operational Work Block")
    with tempfile.TemporaryDirectory(prefix="release-state-contract-") as holder:
        fixture = active_fixture(holder)
        active = fixture / ".agent/active-work-block.json"
        data = json.loads(active.read_text(encoding="utf-8"))
        data["work_block_id"] = "WB-operational-mismatch"
        active.write_text(json.dumps(data), encoding="utf-8")
        require_failure(
            fixture,
            "operational Work Block ID must match its specification",
            "operational active Work Block specification Work Block ID does not match operational state",
        )
    with tempfile.TemporaryDirectory(prefix="release-state-contract-") as holder:
        fixture = active_fixture(holder)
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
        fixture = active_fixture(holder)
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
            "operational state",
        )
    with tempfile.TemporaryDirectory(prefix="release-state-contract-") as holder:
        fixture = active_fixture(holder)
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
        fixture = active_fixture(holder)
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
        fixture = active_fixture(holder)
        _, _, specification_path = active_paths(fixture)
        specification = fixture / specification_path
        specification.write_text("---\nartifact_type: specification\n", encoding="utf-8")
        require_failure(
            fixture,
            "operational specification with malformed frontmatter must fail",
            "operational active Work Block specification has unterminated YAML frontmatter",
        )
    with tempfile.TemporaryDirectory(prefix="release-state-contract-") as holder:
        fixture = active_fixture(holder)
        (fixture / ".agent/active-work-block.json").unlink()
        require_failure(fixture, "missing operational active record must fail", "operational active Work Block is missing")
    with tempfile.TemporaryDirectory(prefix="release-state-contract-") as holder:
        fixture = inactive_fixture(holder)
        active = fixture / ".agent/active-work-block.json"
        active.write_text("{", encoding="utf-8")
        require_failure(fixture, "malformed operational active record must fail", "operational active Work Block is malformed")
    with tempfile.TemporaryDirectory(prefix="release-state-contract-") as holder:
        fixture = active_fixture(holder)
        plan, active_id, _ = active_paths(fixture)
        registry = fixture / "FILE_REGISTRY.yml"
        registry.write_text(registry.read_text(encoding="utf-8").replace(f"active_work_block: {plan}", "active_work_block: null", 1), encoding="utf-8")
        project_map = fixture / "PROJECT_MAP.md"
        map_text = project_map.read_text(encoding="utf-8").replace(
            f"active_work_block: {plan}", "active_work_block: null"
        )
        map_text = map_text.replace(
            f"- Active implementation Work Block: `{active_id}`\n"
            f"  at `{plan}`.",
            "- No active implementation Work Block.",
            1,
        )
        map_text = map_text.replace(
            f"- Active implementation Work Block: `{active_id}`\n"
            f"  (`{plan}`).",
            "- No active implementation Work Block.",
            1,
        )
        map_text = map_text.replace(
            f"- Active implementation Work Block:\n"
            f"  `{active_id}` at\n"
            f"  `{plan}`.",
            "- No active implementation Work Block.",
            1,
        )
        map_text = map_text.replace(
            f"- Active implementation Work Block: `{plan}`.",
            "- No active implementation Work Block.",
            1,
        )
        map_text = map_text.replace(
            f"- Active Work Block: `{plan}` (`{active_id}`).",
            "- No active implementation Work Block.",
            1,
        )
        project_map.write_text(
            map_text,
            encoding="utf-8",
        )
        require(run(fixture), 0, "operational active Work Block may coexist with inactive migration state")
    with tempfile.TemporaryDirectory(prefix="release-state-contract-") as holder:
        fixture = inactive_fixture(holder)
        active = json.loads((fixture / ".agent/active-work-block.json").read_text(encoding="utf-8"))
        active["work_block_id"] = ""
        active["specification"] = {"path": "", "revision": ""}
        active["subject_branch"] = "stale/branch"
        active["base_commit"] = "stale-sha"
        active["write_set"] = []
        active["write_gate"] = {"status": "BLOCKED", "opened_at": None}
        (fixture / ".agent/active-work-block.json").write_text(json.dumps(active), encoding="utf-8")
        require_failure(
            fixture,
            "stale subject binding in inactive candidate must fail",
            "operational inactive Work Block must have empty subject_branch",
        )
    with tempfile.TemporaryDirectory(prefix="release-state-contract-") as holder:
        fixture = inactive_fixture(holder)
        active = json.loads((fixture / ".agent/active-work-block.json").read_text(encoding="utf-8"))
        active["work_block_id"] = ""
        active["specification"] = {"path": "", "revision": ""}
        active["subject_branch"] = ""
        active["base_commit"] = ""
        active["write_set"] = ["web/src/app/page.tsx"]
        active["write_gate"] = {"status": "BLOCKED", "opened_at": None}
        (fixture / ".agent/active-work-block.json").write_text(json.dumps(active), encoding="utf-8")
        require_failure(
            fixture,
            "source authority in inactive candidate must fail",
            "operational inactive Work Block must have empty write_set",
        )
    with tempfile.TemporaryDirectory(prefix="release-state-contract-") as holder:
        fixture = active_fixture(holder)
        active_path = fixture / ".agent/active-work-block.json"
        active = json.loads(active_path.read_text(encoding="utf-8"))
        active["write_gate"] = "READY"
        active_path.write_text(json.dumps(active), encoding="utf-8")
        require_failure(fixture, "malformed operational active gate must fail", "requires valid write_gate")
    with tempfile.TemporaryDirectory(prefix="release-state-contract-") as holder:
        fixture = active_fixture(holder)
        active_path = fixture / ".agent/active-work-block.json"
        active = json.loads(active_path.read_text(encoding="utf-8"))
        active["work_block_id"] = []
        active_path.write_text(json.dumps(active), encoding="utf-8")
        require_failure(fixture, "malformed operational identity must fail", "requires work_block_id")
    with tempfile.TemporaryDirectory(prefix="release-state-contract-") as holder:
        fixture = active_fixture(holder)
        active_path = fixture / ".agent/active-work-block.json"
        active = json.loads(active_path.read_text(encoding="utf-8"))
        active.pop("assurance")
        active_path.write_text(json.dumps(active), encoding="utf-8")
        require_failure(fixture, "missing operational assurance state must fail", "requires structured assurance state")
    with tempfile.TemporaryDirectory(prefix="release-state-contract-") as holder:
        fixture = active_fixture(holder)
        project_map = fixture / "PROJECT_MAP.md"
        map_text = project_map.read_text(encoding="utf-8")
        plan, _, _ = active_paths(fixture)
        project_map.write_text(
            map_text.replace(f"active_work_block: {plan}", "active_work_block: null", 1),
            encoding="utf-8",
        )
        require_failure(
            fixture,
            "migration registry and map mismatch must fail independently",
            "PROJECT_MAP active Work Block does not match FILE_REGISTRY.yml",
        )
    with tempfile.TemporaryDirectory(prefix="release-state-contract-") as holder:
        fixture = fixture_root(holder)
        active_path = fixture / ".agent/active-work-block.json"
        inactive = json.loads((fixture / ".agent/active-work-block.default.json").read_text(encoding="utf-8"))
        inactive["unexpected"] = True
        active_path.write_text(json.dumps(inactive), encoding="utf-8")
        require_failure(fixture, "incomplete inactive shape must fail", "operational inactive Work Block is not canonical")
    print("release-state contract regressions: OK")
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
