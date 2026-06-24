#!/usr/bin/env python3
"""Validate the frozen dirty-tree inventory against B0 and the live tree."""

from __future__ import annotations

import argparse
import base64
import hashlib
import json
import stat
import subprocess
import sys
from collections import Counter, defaultdict
from pathlib import Path
from typing import Any


DEFAULT_BASELINE = Path("/tmp/WB-2026-06-20-dirty-tree-disposition-B0.json")
DEFAULT_INVENTORY = Path(
    "docs/reports/inventory-WB-2026-06-20-dirty-tree-disposition.yml"
)
WORK_BLOCK = "WB-2026-06-20-dirty-tree-disposition"

# C is the exact final control set through Verification L. C may intersect B0: the gate is
# lifecycle control, while the three logs preserve frozen history as A9 subjects
# and authorize only new append entries as control writes.
CONTROL_PATHS = {
    ".codex/write-gate.md",
    "docs/plans/WB-2026-06-20-dirty-tree-disposition.md",
    "docs/plans/WB-2026-06-20-dirty-tree-disposition-claude-audit-task.md",
    "docs/reports/critic-WB-2026-06-20-dirty-tree-disposition.md",
    "docs/reports/inventory-WB-2026-06-20-dirty-tree-disposition.yml",
    "docs/reports/disposition-WB-2026-06-20-dirty-tree-disposition.md",
    "docs/reports/external-audit-WB-2026-06-20-dirty-tree-disposition.md",
    "docs/reports/review-WB-2026-06-20-dirty-tree-disposition.md",
    "docs/reports/verification-WB-2026-06-20-dirty-tree-disposition.md",
    "memory_bank/external-team-log.md",
    "memory_bank/orchestrator-log.md",
    "memory_bank/review-log.md",
    "scripts/validate-dirty-tree-inventory.py",
}
EXPECTED_B0_CONTROL_INTERSECTION = {
    ".codex/write-gate.md",
    "memory_bank/external-team-log.md",
    "memory_bank/orchestrator-log.md",
    "memory_bank/review-log.md",
}
DUAL_ROLE_APPEND_ONLY_LOGS = {
    "memory_bank/external-team-log.md",
    "memory_bank/orchestrator-log.md",
    "memory_bank/review-log.md",
}
VALIDATOR_MODE = 0o664
EXTERNAL_DEPENDENCY_STATUSES = {"unresolved", "resolved"}
MERGED_SHOWCASE_GROUP = "C2D2-showcase-integration-atomic-hold"
OBSOLETE_SHOWCASE_GROUPS = {
    "C2-showcase-atomic-hold",
    "C3-showcase-generated",
    "D2-web-showcase-integration",
}
MERGED_SHOWCASE_DEPENDENCIES = [
    "owner-showcase-integration-decision",
    "showcase-fixes",
    "asset-provenance",
    "retain-or-regenerate-compare-decision",
    "T1-T3-showcase-verification",
]

REQUIRED_ENTRY_FIELDS = {
    "path",
    "path_b64",
    "git_status",
    "sha256",
    "size",
    "domain_owner",
    "tracked_state",
    "disposition",
    "proposed_group",
    "dependencies",
    "verification_tier",
    "risk",
    "decision_markers",
    "evidence_basis",
}
DISPOSITIONS = {
    "proposed-portable-group",
    "local-private",
    "generated-derived",
    "deferred-separate-wb",
    "owner-decision-required",
}
DOMAIN_OWNERS = {
    "A-agent-sdlc",
    "B-strategy-content",
    "C-showcase",
    "D-web-analytics",
    "E-ci-ops-config",
}
TRACKED_STATES = {"tracked-modified", "untracked"}
VERIFICATION_TIERS = {"T1", "T2", "T3"}
RISKS = {"low", "medium", "high"}
EXECUTABLE_UNTRACKED_PYTHON = [
    ".claude/skills/skill-creator/scripts/aggregate_benchmark.py",
    ".claude/skills/skill-creator/scripts/generate_report.py",
    ".claude/skills/skill-creator/scripts/improve_description.py",
    ".claude/skills/skill-creator/scripts/package_skill.py",
    ".claude/skills/skill-creator/scripts/quick_validate.py",
    ".claude/skills/skill-creator/scripts/run_eval.py",
    ".claude/skills/skill-creator/scripts/run_loop.py",
    ".claude/skills/webapp-testing/scripts/with_server.py",
]


def fail(errors: list[str], message: str) -> None:
    errors.append(message)


def run_git(*args: str) -> bytes:
    result = subprocess.run(
        ["git", *args], check=False, stdout=subprocess.PIPE, stderr=subprocess.PIPE
    )
    if result.returncode:
        raise RuntimeError(
            f"git {' '.join(args)} failed ({result.returncode}): "
            f"{result.stderr.decode('utf-8', 'replace').strip()}"
        )
    return result.stdout


def parse_live_status(raw: bytes) -> dict[str, str]:
    """Parse porcelain v1 -z output without line or shell path splitting."""
    records = raw.split(b"\0")
    live: dict[str, str] = {}
    index = 0
    while index < len(records):
        record = records[index]
        index += 1
        if not record:
            continue
        if len(record) < 4 or record[2:3] != b" ":
            raise ValueError(f"malformed porcelain record: {record[:40]!r}")
        status = record[:2].decode("ascii")
        path_bytes = record[3:]
        if "R" in status or "C" in status:
            if index >= len(records) or not records[index]:
                raise ValueError("rename/copy record has no source path")
            source_bytes = records[index]
            index += 1
            source = source_bytes.decode("utf-8", "surrogateescape")
            if source in live:
                raise ValueError(f"duplicate live path: {source!r}")
            live[source] = status
        path = path_bytes.decode("utf-8", "surrogateescape")
        if path in live:
            raise ValueError(f"duplicate live path: {path!r}")
        live[path] = status
    return live


def content_metadata(path: Path) -> tuple[int, str]:
    data = path.read_bytes()
    return len(data), hashlib.sha256(data).hexdigest()


def find_internal_group_cycle(graph: dict[str, list[str]]) -> list[str] | None:
    """Return one concrete internal dependency cycle, including its closing node."""
    state: dict[str, int] = {}
    stack: list[str] = []
    positions: dict[str, int] = {}

    def visit(node: str) -> list[str] | None:
        state[node] = 1
        positions[node] = len(stack)
        stack.append(node)
        for dependency in graph[node]:
            dependency_state = state.get(dependency, 0)
            if dependency_state == 0:
                cycle = visit(dependency)
                if cycle:
                    return cycle
            elif dependency_state == 1:
                return stack[positions[dependency] :] + [dependency]
        stack.pop()
        positions.pop(node)
        state[node] = 2
        return None

    for group_name in graph:
        if state.get(group_name, 0) == 0:
            cycle = visit(group_name)
            if cycle:
                return cycle
    return None


def validate(baseline_path: Path, inventory_path: Path) -> list[str]:
    errors: list[str] = []
    try:
        baseline = json.loads(baseline_path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        return [f"cannot read baseline {baseline_path}: {exc}"]
    try:
        # The .yml artifact is deliberately JSON-compatible YAML.
        inventory = json.loads(inventory_path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        return [f"cannot read inventory {inventory_path}: {exc}"]

    expected_baseline_meta = {key: value for key, value in baseline.items() if key != "entries"}
    if inventory.get("baseline") != expected_baseline_meta:
        fail(errors, "inventory baseline metadata is not an exact copy of B0 metadata")
    if inventory.get("schema_version") != 1:
        fail(errors, "inventory schema_version must be 1")
    if inventory.get("work_block") != WORK_BLOCK:
        fail(errors, f"inventory work_block must be {WORK_BLOCK}")
    portability = inventory.get("portability_findings", {})
    if portability.get("untracked_executable_python_paths") != EXECUTABLE_UNTRACKED_PYTHON:
        fail(errors, "inventory must preserve F's exact eight executable Python paths")
    coverage_probe = portability.get("coverage_ignore_probe")
    expected_probe = {
        "candidate_path": "coverage/",
        "command": "git check-ignore -v -- coverage/",
        "result": "not-ignored",
        "exit_code": 1,
        "path_in_b0": False,
        "existing_artifact_claimed": False,
        "evidence_basis": (
            "Literal candidate path probe returned no matching ignore rule; this is "
            "policy metadata, not evidence that a coverage artifact exists"
        ),
        "resolution_route": "E2-ignore-policy-hold",
    }
    if coverage_probe != expected_probe:
        fail(errors, "inventory coverage/ ignore probe evidence is incomplete or changed")

    baseline_entries = baseline.get("entries")
    entries = inventory.get("entries")
    if not isinstance(baseline_entries, list) or not isinstance(entries, list):
        return errors + ["baseline entries and inventory entries must be arrays"]
    if len(entries) != baseline.get("count") or len(entries) != 237:
        fail(errors, f"inventory must contain exactly 237 entries; found {len(entries)}")

    baseline_by_path: dict[str, dict[str, Any]] = {}
    for item in baseline_entries:
        path = item.get("path")
        if path in baseline_by_path:
            fail(errors, f"duplicate path in B0: {path!r}")
        baseline_by_path[path] = item

    actual_intersection = set(baseline_by_path) & CONTROL_PATHS
    if actual_intersection != EXPECTED_B0_CONTROL_INTERSECTION:
        fail(
            errors,
            "B0/C intersection differs from the gate plus three approved dual-role logs: "
            f"{sorted(actual_intersection)}",
        )
    controls = inventory.get("control_artifacts", {})
    if set(controls.get("baseline_control_intersection", [])) != EXPECTED_B0_CONTROL_INTERSECTION:
        fail(errors, "inventory control-artifact B0 intersection is incomplete")
    validator_control = controls.get("validator", {})
    expected_validator_control = {
        "path": "scripts/validate-dirty-tree-inventory.py",
        "relationship_to_b0": "C-B0 control artifact; not a subject inventory entry",
        "git_index_mode": None,
        "filesystem_mode": "0664",
        "executable": False,
        "mode_policy": (
            "must remain non-executable unless an Owner-approved policy change "
            "explicitly requires execution mode"
        ),
    }
    if validator_control != expected_validator_control:
        fail(errors, "validator control-artifact portability metadata is incomplete or changed")
    if set(controls.get("baseline_control_intersection", [])) & DUAL_ROLE_APPEND_ONLY_LOGS != DUAL_ROLE_APPEND_ONLY_LOGS:
        fail(errors, "all three append-only logs must retain explicit B0/control dual-role status")

    counts = Counter(item.get("path") for item in entries)
    duplicates = sorted(path for path, count in counts.items() if count > 1)
    if duplicates:
        fail(errors, f"duplicate inventory paths: {duplicates}")
    inventory_by_path = {item.get("path"): item for item in entries}
    missing = sorted(set(baseline_by_path) - set(inventory_by_path))
    extra = sorted(set(inventory_by_path) - set(baseline_by_path))
    if missing:
        fail(errors, f"inventory paths missing from B0: {missing}")
    if extra:
        fail(errors, f"inventory paths outside B0: {extra}")

    entries_by_group: dict[str, list[str]] = defaultdict(list)
    for index, item in enumerate(entries):
        label = f"entry[{index}] {item.get('path')!r}"
        absent = sorted(REQUIRED_ENTRY_FIELDS - set(item))
        if absent:
            fail(errors, f"{label} missing required fields: {absent}")
            continue
        for field in ("dependencies", "decision_markers", "evidence_basis"):
            value = item[field]
            if not isinstance(value, list) or not all(isinstance(v, str) for v in value):
                fail(errors, f"{label} field {field} must be a string array")
        if not item["decision_markers"] or not item["evidence_basis"]:
            fail(errors, f"{label} decision_markers and evidence_basis must be non-empty")
        if "wrong-root-language" in item["decision_markers"]:
            fail(errors, f"{label} uses the retired misleading locale marker")
        enum_checks = (
            ("domain_owner", DOMAIN_OWNERS),
            ("tracked_state", TRACKED_STATES),
            ("disposition", DISPOSITIONS),
            ("verification_tier", VERIFICATION_TIERS),
            ("risk", RISKS),
        )
        for field, allowed in enum_checks:
            if item[field] not in allowed:
                fail(errors, f"{label} invalid {field}: {item[field]!r}")
        if not isinstance(item["proposed_group"], str) or not item["proposed_group"]:
            fail(errors, f"{label} proposed_group must be a non-empty string")
        entries_by_group[item["proposed_group"]].append(item["path"])

        b0 = baseline_by_path.get(item["path"])
        if b0 is None:
            continue
        raw_pairs = {
            "path_b64": "path_b64",
            "git_status": "status",
            "sha256": "sha256",
            "size": "size",
        }
        for inventory_field, baseline_field in raw_pairs.items():
            if item[inventory_field] != b0[baseline_field]:
                fail(errors, f"{label} does not preserve B0 field {baseline_field}")
        try:
            decoded = base64.b64decode(item["path_b64"], validate=True)
            if decoded.decode("utf-8") != item["path"]:
                fail(errors, f"{label} path_b64 does not decode to path")
        except (ValueError, UnicodeDecodeError) as exc:
            fail(errors, f"{label} invalid path_b64: {exc}")
        expected_tracked = "tracked-modified" if item["git_status"] != "??" else "untracked"
        if item["tracked_state"] != expected_tracked:
            fail(errors, f"{label} tracked_state conflicts with git_status")

    groups = inventory.get("groups")
    if not isinstance(groups, list):
        fail(errors, "inventory groups must be an array")
    else:
        if len(groups) != 27:
            fail(errors, f"expected 27 group declarations; found {len(groups)}")
        group_names = [group.get("name") for group in groups]
        duplicate_groups = sorted(name for name, count in Counter(group_names).items() if count > 1)
        if duplicate_groups:
            fail(errors, f"duplicate group declarations: {duplicate_groups}")
        declared = {group.get("name"): group for group in groups}
        obsolete_declared = sorted(set(declared) & OBSOLETE_SHOWCASE_GROUPS)
        if obsolete_declared:
            fail(errors, f"obsolete cyclic showcase groups remain declared: {obsolete_declared}")
        if set(declared) != set(entries_by_group):
            fail(errors, "declared group names do not equal entry proposed_group values")
        for name, paths in entries_by_group.items():
            group = declared.get(name, {})
            declared_paths = group.get("paths")
            if not isinstance(declared_paths, list):
                fail(errors, f"group {name!r} paths must be an array")
            elif declared_paths != paths:
                fail(errors, f"group {name!r} path manifest differs from entry order/membership")
            if group.get("count") != len(paths):
                fail(errors, f"group {name!r} count must be {len(paths)}")
            if group.get("approval") != "not-approved-to-commit":
                fail(errors, f"group {name!r} must remain not-approved-to-commit")
        merged_entries = [
            item for item in entries if item.get("proposed_group") == MERGED_SHOWCASE_GROUP
        ]
        if len(merged_entries) != 34:
            fail(errors, f"merged showcase integration group must contain 34 entries; found {len(merged_entries)}")
        if Counter(item.get("domain_owner") for item in merged_entries) != Counter(
            {"C-showcase": 31, "D-web-analytics": 3}
        ):
            fail(errors, "merged showcase integration group must preserve 31 C and 3 D domain owners")
        if Counter(item.get("disposition") for item in merged_entries) != Counter(
            {
                "deferred-separate-wb": 29,
                "generated-derived": 2,
                "proposed-portable-group": 3,
            }
        ):
            fail(errors, "merged showcase integration group changed conservative entry dispositions")
        generated_candidates = {
            item.get("path")
            for item in merged_entries
            if item.get("disposition") == "generated-derived"
        }
        if generated_candidates != {"showcase/next-env.d.ts", "showcase/package-lock.json"}:
            fail(errors, "merged showcase generated candidates are not the exact two expected paths")
        merged_group = declared.get(MERGED_SHOWCASE_GROUP, {})
        if merged_group.get("dependencies") != MERGED_SHOWCASE_DEPENDENCIES:
            fail(errors, "merged showcase group dependencies are incomplete or out of order")
        for item in merged_entries:
            if item.get("dependencies") != MERGED_SHOWCASE_DEPENDENCIES:
                fail(errors, f"merged showcase entry {item.get('path')!r} dependencies differ from group")
        locale_marked = [
            item
            for item in entries
            if "root-html-lang-content-mismatch" in item.get("decision_markers", [])
        ]
        if len(locale_marked) != 29 or any(
            item.get("proposed_group") != MERGED_SHOWCASE_GROUP for item in locale_marked
        ):
            fail(errors, "exactly 29 merged showcase app entries must retain the locale marker")

        internal_graph: dict[str, list[str]] = {}
        for group in groups:
            dependencies = group.get("dependencies")
            if isinstance(dependencies, list):
                internal_graph[group["name"]] = [
                    dependency for dependency in dependencies if dependency in declared
                ]
            else:
                internal_graph[group["name"]] = []
        cycle = find_internal_group_cycle(internal_graph)
        if cycle:
            fail(
                errors,
                "internal group dependency cycle: "
                + " -> ".join(cycle)
                + "; merge the atomic boundary or remove an internal dependency",
            )

        external_dependencies = inventory.get("external_dependencies")
        if not isinstance(external_dependencies, dict):
            fail(errors, "inventory external_dependencies must be an object registry")
        else:
            if len(external_dependencies) != 42:
                fail(
                    errors,
                    "expected 42 external dependency declarations; "
                    f"found {len(external_dependencies)}",
                )
            referenced_dependencies: set[str] = set()
            for group in groups:
                dependencies = group.get("dependencies")
                if not isinstance(dependencies, list) or not all(
                    isinstance(value, str) for value in dependencies
                ):
                    fail(errors, f"group {group.get('name')!r} dependencies must be a string array")
                    continue
                referenced_dependencies.update(dependencies)
            for item in entries:
                dependencies = item.get("dependencies")
                if isinstance(dependencies, list):
                    referenced_dependencies.update(
                        value for value in dependencies if isinstance(value, str)
                    )
            external_references = referenced_dependencies - set(declared)
            if set(external_dependencies) != external_references:
                fail(
                    errors,
                    "external dependency registry keys must exactly equal non-group references",
                )
            required_external_fields = {
                "category",
                "resolution_owner",
                "expected_follow_up",
                "status",
            }
            for key, dependency in external_dependencies.items():
                if not isinstance(dependency, dict):
                    fail(errors, f"external dependency {key!r} must be an object")
                    continue
                if set(dependency) != required_external_fields:
                    fail(errors, f"external dependency {key!r} has incomplete fields")
                    continue
                for field in required_external_fields - {"status"}:
                    if not isinstance(dependency[field], str) or not dependency[field].strip():
                        fail(errors, f"external dependency {key!r} field {field} must be non-empty")
                if dependency["status"] not in EXTERNAL_DEPENDENCY_STATUSES:
                    fail(errors, f"external dependency {key!r} has invalid status")

    try:
        branch = run_git("rev-parse", "--abbrev-ref", "HEAD").decode().strip()
        head = run_git("rev-parse", "HEAD").decode().strip()
        if branch != baseline.get("branch"):
            fail(errors, f"live branch {branch!r} differs from B0 {baseline.get('branch')!r}")
        if head != baseline.get("head"):
            fail(errors, f"live HEAD {head!r} differs from B0 {baseline.get('head')!r}")
        live = parse_live_status(run_git("status", "--porcelain=v1", "-z", "-uall"))
        expected_live = set(baseline_by_path) | CONTROL_PATHS
        live_missing = sorted(expected_live - set(live))
        live_extra = sorted(set(live) - expected_live)
        if live_missing:
            fail(errors, f"live dirty set is missing B0/C paths: {live_missing}")
        if live_extra:
            fail(errors, f"live dirty set contains paths outside B0/C: {live_extra}")
        staged = run_git("diff", "--cached", "--name-only", "-z")
        if staged:
            staged_paths = staged.rstrip(b"\0").split(b"\0")
            fail(errors, f"staging is not empty: {staged_paths!r}")
        validator_path = Path("scripts/validate-dirty-tree-inventory.py")
        validator_mode = stat.S_IMODE(validator_path.stat().st_mode)
        if validator_mode != VALIDATOR_MODE or validator_mode & 0o111:
            fail(
                errors,
                f"validator mode must remain non-executable 0664; found {validator_mode:04o}",
            )
        if run_git("ls-files", "--", str(validator_path)):
            fail(errors, "validator unexpectedly became a tracked B0-adjacent artifact")
    except FileNotFoundError as exc:
        fail(errors, f"control artifact mode validation failed: {exc}")
        live = {}
    except (RuntimeError, ValueError) as exc:
        fail(errors, f"live Git validation failed: {exc}")
        live = {}

    root = Path.cwd()
    for path, b0 in baseline_by_path.items():
        if path in CONTROL_PATHS:
            continue
        if live.get(path) != b0["status"]:
            fail(errors, f"B0-C status drift for {path!r}: {live.get(path)!r} != {b0['status']!r}")
            continue
        file_path = root / path
        try:
            size, digest = content_metadata(file_path)
        except OSError as exc:
            fail(errors, f"cannot read B0-C subject metadata for {path!r}: {exc}")
            continue
        if size != b0["size"] or digest != b0["sha256"]:
            fail(
                errors,
                f"B0-C content drift for {path!r}: "
                f"size/sha256 {size}/{digest} != {b0['size']}/{b0['sha256']}",
            )
    return errors


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--baseline", type=Path, default=DEFAULT_BASELINE)
    parser.add_argument("--inventory", type=Path, default=DEFAULT_INVENTORY)
    args = parser.parse_args()
    errors = validate(args.baseline, args.inventory)
    if errors:
        print(f"FAIL: {len(errors)} validation error(s)", file=sys.stderr)
        for error in errors:
            print(f"- {error}", file=sys.stderr)
        return 1
    print("PASS: 237 unique B0 paths; 27 acyclic groups, dependency registry, controls, live B0|C, B0-C drift, and empty staging validated")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
