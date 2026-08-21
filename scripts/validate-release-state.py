#!/usr/bin/env python3
"""Validate repository Work Block, navigation, and closeout SSOT consistency."""
from __future__ import annotations

import argparse
from pathlib import Path, PurePosixPath
import re
import sys
from typing import Any

import yaml

ACTIVE_STATUSES = {"draft", "planned", "in_progress", "blocked"}
MAP_BLOCK_RE = re.compile(r"<!--\s*release-state\s*\n(?P<body>.*?)\n-->\s*", re.DOTALL)
MIGRATION_SECTION_RE = re.compile(
    r"^## Migration Work\s*\n(?P<body>.*?)(?=^##\s|\Z)", re.MULTILINE | re.DOTALL
)
WORK_BLOCK_FINAL_SECTION_RE = re.compile(
    r"^## (?:Final State|Closeout State)\s*\n(?P<body>.*?)(?=^##\s|\Z)",
    re.MULTILINE | re.DOTALL,
)
MARKER_RE = re.compile(
    r"^\s*[-*]\s+\*\*(?P<key>[^*]+):\*\*\s*(?P<value>.+?)\s*$", re.MULTILINE
)
MUTABLE_VCS_STATES = r"(?:draft|ready(?:\s+for\s+review)?|open|closed|merged|unmerged)"
MUTABLE_VCS_STATE_RE = re.compile(rf"^{MUTABLE_VCS_STATES}$", re.IGNORECASE)
MUTABLE_VCS_STATE_TOKEN_RE = re.compile(rf"\b{MUTABLE_VCS_STATES}\b", re.IGNORECASE)
MARKDOWN_DECORATION_RE = re.compile(r"[*_]+")
NORMALIZED_MUTABLE_VCS_STATE = rf"{MUTABLE_VCS_STATES}\b"
STRUCTURED_VCS_KEY_RE = re.compile(
    r"^(?:pr|pull_request|pullrequest|merge)_(?:status|state)$", re.IGNORECASE
)
STRUCTURED_VCS_PARENT_RE = re.compile(
    r"^(?:pr|pull_request|pullrequest|merge)$", re.IGNORECASE
)
STRUCTURED_STATE_KEY_RE = re.compile(r"^(?:status|state)$", re.IGNORECASE)
RAW_MUTABLE_CLOSEOUT_PATTERNS = (
    re.compile(r"^\s*[-*]?\s*(?:\*\*)?Merge status:(?:\*\*)?", re.IGNORECASE | re.MULTILINE),
    re.compile(r"\bnot merged\b", re.IGNORECASE),
    re.compile(r"\bmerge commit\b", re.IGNORECASE),
    re.compile(r"\bmerged_at\b", re.IGNORECASE),
)
NORMALIZED_MUTABLE_CLOSEOUT_PATTERNS = (
    re.compile(
        rf"\b(?:PR|pull[ -]?request)\s*(?:#\s*\d+)?\s*"
        rf"(?:(?::|=)\s*|(?:is|was|remains?|became|has\s+been)\s*|"
        rf"(?:status|state)\s*(?:is|=|:)\s*){NORMALIZED_MUTABLE_VCS_STATE}",
        re.IGNORECASE,
    ),
    re.compile(
        rf"\b(?:PR|pull[ -]?request)\s*(?:#\s*\d+)?\s+"
        rf"{NORMALIZED_MUTABLE_VCS_STATE}",
        re.IGNORECASE,
    ),
    re.compile(
        rf"\*\*(?:PR|pull[ -]?request)\s*(?:#\s*\d+)?\s*:\*\*\s*"
        rf"{NORMALIZED_MUTABLE_VCS_STATE}",
        re.IGNORECASE,
    ),
    re.compile(
        rf"\*\*(?:PR|pull[ -]?request)\s+(?:status|state):\*\*\s*"
        rf"{NORMALIZED_MUTABLE_VCS_STATE}",
        re.IGNORECASE,
    ),
    re.compile(
        rf"^\s*\|\s*(?:\*\*)?(?:PR|pull[ -]?request)\s*(?:#\s*\d+)?"
        rf"(?:\*\*)?\s*\|\s*{NORMALIZED_MUTABLE_VCS_STATE}\s*\|",
        re.IGNORECASE | re.MULTILINE,
    ),
)
STALE_MAP_PATTERNS = (
    re.compile(r"PR\s*#\d+\s+remains?\s+Draft", re.IGNORECASE),
    re.compile(r"PR\s*#\d+.*\bnot merged\b", re.IGNORECASE),
    re.compile(r"\*\*Merge status:\*\*\s*not merged", re.IGNORECASE),
)
CANONICAL_RELEASE_ASSETS = {
    "contract": "governance/release-state.md",
    "validator": "scripts/validate-release-state.py",
    "fixtures": "scripts/test-release-state-contracts.py",
    "workflow": ".github/workflows/release-state-contract.yml",
}


class ReleaseStateError(RuntimeError):
    """Raised when release-state evidence is missing or contradictory."""


def load_yaml_object(path: Path, label: str) -> dict[str, Any]:
    try:
        value = yaml.safe_load(path.read_text(encoding="utf-8"))
    except (OSError, yaml.YAMLError) as exc:
        raise ReleaseStateError(f"invalid {label}: {exc}") from exc
    if not isinstance(value, dict):
        raise ReleaseStateError(f"{label} must contain a YAML object")
    return value


def parse_frontmatter(path: Path, label: str) -> tuple[dict[str, Any], str, str]:
    try:
        text = path.read_text(encoding="utf-8")
    except OSError as exc:
        raise ReleaseStateError(f"cannot read {label}: {exc}") from exc
    if not text.startswith("---\n"):
        raise ReleaseStateError(f"{label} requires YAML frontmatter")
    try:
        raw_frontmatter, body = text[4:].split("\n---\n", 1)
    except ValueError as exc:
        raise ReleaseStateError(f"{label} has unterminated YAML frontmatter") from exc
    try:
        frontmatter = yaml.safe_load(raw_frontmatter)
    except yaml.YAMLError as exc:
        raise ReleaseStateError(f"invalid {label} frontmatter: {exc}") from exc
    if not isinstance(frontmatter, dict):
        raise ReleaseStateError(f"{label} frontmatter must be an object")
    return frontmatter, body, text


def safe_repo_path(root: Path, value: object, label: str) -> tuple[str, Path]:
    if not isinstance(value, str) or not value.strip():
        raise ReleaseStateError(f"{label} must be a non-empty repository-relative path")
    normalized = value.strip().replace("\\", "/")
    pure = PurePosixPath(normalized)
    if pure.is_absolute() or normalized in {".", ".."} or ".." in pure.parts:
        raise ReleaseStateError(f"{label} escapes repository: {value}")
    resolved = (root / Path(*pure.parts)).resolve()
    try:
        resolved.relative_to(root.resolve())
    except ValueError as exc:
        raise ReleaseStateError(f"{label} escapes repository: {value}") from exc
    return normalized, resolved


def string_list(value: object, label: str, *, allow_empty: bool = False) -> list[str]:
    if not isinstance(value, list) or any(
        not isinstance(item, str) or not item.strip() for item in value
    ):
        raise ReleaseStateError(f"{label} must be an array of non-empty strings")
    if not allow_empty and not value:
        raise ReleaseStateError(f"{label} must not be empty")
    normalized = [item.strip().replace("\\", "/") for item in value]
    if len(normalized) != len(set(normalized)):
        raise ReleaseStateError(f"{label} contains duplicate paths")
    return normalized


def parse_markers(body: str, label: str) -> dict[str, str]:
    result: dict[str, str] = {}
    for match in MARKER_RE.finditer(body):
        key = match.group("key").strip().lower()
        if key in result:
            raise ReleaseStateError(f"{label} contains duplicate marker: {key}")
        result[key] = match.group("value").strip()
    return result


def evaluation_verdict(value: str, label: str) -> str:
    normalized = value.strip()
    if normalized == "READY":
        return "READY"
    skipped = re.fullmatch(r"SKIPPED\s+[—–-]\s+(?P<reason>\S.*)", normalized)
    if skipped:
        return "SKIPPED"
    raise ReleaseStateError(
        f"{label} must be READY or SKIPPED with a non-empty rationale, found {normalized!r}"
    )


def extract_single_section(body: str, heading: str, label: str) -> str:
    pattern = re.compile(
        rf"^## {re.escape(heading)}\s*\n(?P<body>.*?)(?=^##\s|\Z)",
        re.MULTILINE | re.DOTALL | re.IGNORECASE,
    )
    matches = list(pattern.finditer(body))
    if not matches:
        raise ReleaseStateError(f"{label} requires section: {heading}")
    if len(matches) != 1:
        raise ReleaseStateError(f"{label} must contain exactly one section: {heading}")
    content = matches[0].group("body").strip()
    if not content:
        raise ReleaseStateError(f"{label} section is empty: {heading}")
    return content


def parse_map_state(path: Path) -> tuple[dict[str, Any], str]:
    try:
        text = path.read_text(encoding="utf-8")
    except OSError as exc:
        raise ReleaseStateError(f"cannot read PROJECT_MAP.md: {exc}") from exc
    matches = list(MAP_BLOCK_RE.finditer(text))
    if not matches:
        raise ReleaseStateError("PROJECT_MAP.md requires one release-state comment block")
    if len(matches) != 1:
        raise ReleaseStateError("PROJECT_MAP.md must contain exactly one release-state block")
    try:
        value = yaml.safe_load(matches[0].group("body"))
    except yaml.YAMLError as exc:
        raise ReleaseStateError(f"invalid PROJECT_MAP.md release-state block: {exc}") from exc
    if not isinstance(value, dict):
        raise ReleaseStateError("PROJECT_MAP.md release-state block must be an object")
    return value, text


def completed_work_block_markers(body: str, normalized: str) -> dict[str, str]:
    matches = list(WORK_BLOCK_FINAL_SECTION_RE.finditer(body))
    if not matches:
        raise ReleaseStateError(
            f"completed Work Block requires Final State or Closeout State section: {normalized}"
        )
    if len(matches) != 1:
        raise ReleaseStateError(
            f"completed Work Block must contain exactly one terminal state section: {normalized}"
        )
    markers = parse_markers(matches[0].group("body"), f"completed Work Block {normalized}")
    stage_keys = [key for key in ("stage state", "state") if key in markers]
    if not stage_keys:
        raise ReleaseStateError(
            f"completed Work Block requires stage state=completed: {normalized}"
        )
    for key in stage_keys:
        if markers[key] != "completed":
            raise ReleaseStateError(
                f"completed Work Block requires {key}=completed, found {markers[key]!r}: {normalized}"
            )
    required_exact = {
        "review gate": "READY",
        "verification verdict": "READY",
        "closeout mode": "success-closeout",
    }
    for key, expected in required_exact.items():
        actual = markers.get(key)
        if actual != expected:
            raise ReleaseStateError(
                f"completed Work Block requires {key}={expected}, found {actual!r}: {normalized}"
            )
    drift = markers.get("drift gate")
    if drift not in {"ALIGNED", "READY"}:
        raise ReleaseStateError(
            f"completed Work Block requires drift gate in ['ALIGNED', 'READY'], "
            f"found {drift!r}: {normalized}"
        )
    task_status = markers.get("task status")
    if task_status is not None and task_status != "completed":
        raise ReleaseStateError(
            f"completed Work Block requires task status=completed, found {task_status!r}: {normalized}"
        )
    evaluation = markers.get("evaluation verdict")
    if evaluation is not None:
        evaluation_verdict(evaluation, "completed Work Block evaluation verdict")
    return markers


def validate_completed_work_block(
    root: Path, relative: str
) -> tuple[dict[str, Any], dict[str, str]]:
    normalized, path = safe_repo_path(root, relative, "completed_work_block")
    if not normalized.startswith("docs/plans/") or not normalized.endswith(".md"):
        raise ReleaseStateError(f"completed Work Block must be under docs/plans: {normalized}")
    if not path.is_file():
        raise ReleaseStateError(f"completed Work Block is missing: {normalized}")
    frontmatter, body, _ = parse_frontmatter(path, f"completed Work Block {normalized}")
    if frontmatter.get("artifact_type") != "work_block":
        raise ReleaseStateError(f"completed path is not a Work Block: {normalized}")
    if frontmatter.get("status") != "completed":
        raise ReleaseStateError(f"completed Work Block is not status completed: {normalized}")
    work_block_id = frontmatter.get("work_block_id")
    if not isinstance(work_block_id, str) or not work_block_id.strip():
        raise ReleaseStateError(f"completed Work Block lacks work_block_id: {normalized}")
    return frontmatter, completed_work_block_markers(body, normalized)


def validate_active_work_block(root: Path, relative: str) -> dict[str, Any]:
    normalized, path = safe_repo_path(root, relative, "active_work_block")
    if not normalized.startswith("docs/plans/") or not normalized.endswith(".md"):
        raise ReleaseStateError(f"active Work Block must be under docs/plans: {normalized}")
    if not path.is_file():
        raise ReleaseStateError(f"active Work Block is missing: {normalized}")
    frontmatter, _, _ = parse_frontmatter(path, f"active Work Block {normalized}")
    if frontmatter.get("artifact_type") != "work_block":
        raise ReleaseStateError(f"active path is not a Work Block: {normalized}")
    status = frontmatter.get("status")
    if status not in ACTIVE_STATUSES:
        raise ReleaseStateError(
            f"active Work Block requires one of {sorted(ACTIVE_STATUSES)}, found {status!r}"
        )
    return frontmatter


def validate_release_assets(root: Path, release_state: dict[str, Any]) -> None:
    for field, expected in CANONICAL_RELEASE_ASSETS.items():
        if release_state.get(field) != expected:
            raise ReleaseStateError(f"release_state.{field} must be {expected}")
        _, path = safe_repo_path(root, expected, f"release_state.{field}")
        if not path.is_file():
            raise ReleaseStateError(f"release-state asset is missing: {expected}")
    if release_state.get("authority") != "assurance_only":
        raise ReleaseStateError("release_state.authority must be assurance_only")


def normalized_structured_key(value: object) -> str:
    return re.sub(r"[^a-z0-9]+", "_", str(value).strip().lower()).strip("_")


def reject_structured_vcs_claims(
    value: object,
    label: str,
    path: str = "frontmatter",
    vcs_context: bool = False,
) -> None:
    if isinstance(value, dict):
        for key, child in value.items():
            normalized_key = normalized_structured_key(key)
            current_path = f"{path}.{key}"
            child_vcs_context = vcs_context or bool(
                STRUCTURED_VCS_PARENT_RE.fullmatch(normalized_key)
            )
            is_direct_vcs_key = bool(STRUCTURED_VCS_KEY_RE.fullmatch(normalized_key))
            is_context_state_key = child_vcs_context and bool(
                STRUCTURED_STATE_KEY_RE.fullmatch(normalized_key)
            )
            if is_direct_vcs_key or is_context_state_key:
                if isinstance(child, str) and MUTABLE_VCS_STATE_RE.fullmatch(child.strip()):
                    raise ReleaseStateError(
                        f"{label} contains mutable GitHub/VCS state at {current_path}"
                    )
            reject_structured_vcs_claims(
                child,
                label,
                current_path,
                child_vcs_context,
            )
    elif isinstance(value, list):
        for index, child in enumerate(value):
            reject_structured_vcs_claims(
                child,
                label,
                f"{path}[{index}]",
                vcs_context,
            )


def normalize_markdown_decoration(text: str) -> str:
    """Remove Markdown emphasis markers before semantic VCS-state matching."""
    return MARKDOWN_DECORATION_RE.sub("", text)


def reject_mutable_vcs_claims(
    text: str, label: str, structured: object | None = None
) -> None:
    if structured is not None:
        reject_structured_vcs_claims(structured, label)
    for pattern in RAW_MUTABLE_CLOSEOUT_PATTERNS:
        if pattern.search(text):
            raise ReleaseStateError(f"{label} contains mutable GitHub/VCS state: {pattern.pattern}")
    normalized_text = normalize_markdown_decoration(text)
    for pattern in NORMALIZED_MUTABLE_CLOSEOUT_PATTERNS:
        if pattern.search(normalized_text):
            raise ReleaseStateError(f"{label} contains mutable GitHub/VCS state: {pattern.pattern}")


def validate_external_vcs_boundary(value: str) -> None:
    normalized = value.strip()
    prefix = "non-normative"
    if not normalized.lower().startswith(prefix):
        raise ReleaseStateError("successful closeout must mark external VCS state non-normative")
    remainder = normalized[len(prefix) :]
    if MUTABLE_VCS_STATE_TOKEN_RE.search(remainder):
        raise ReleaseStateError(
            "external VCS state marker contains concrete mutable GitHub/VCS state"
        )


def validate_completed_closeout_reports(
    root: Path,
    completed_records: dict[str, dict[str, Any]],
    canonical_closeout: str,
) -> None:
    reports_root = root / "docs/reports/closeout"
    if not reports_root.is_dir():
        return

    completed_by_id = {
        str(record["frontmatter"]["work_block_id"]): record
        for record in completed_records.values()
    }
    seen: dict[str, str] = {}

    for path in sorted(reports_root.rglob("*.md")):
        try:
            raw = path.read_text(encoding="utf-8")
        except OSError as exc:
            raise ReleaseStateError(
                f"cannot read closeout report {path}: {exc}"
            ) from exc
        if not raw.startswith("---\n"):
            continue

        relative = path.relative_to(root).as_posix()
        label = f"completed Work Block closeout {relative}"
        frontmatter, body, _ = parse_frontmatter(path, label)
        if frontmatter.get("artifact_type") != "closeout_report":
            continue

        work_block_id = frontmatter.get("work_block_id")
        if work_block_id not in completed_by_id:
            continue
        if work_block_id in seen:
            raise ReleaseStateError(
                f"completed Work Block {work_block_id} has multiple closeout reports: "
                f"{seen[work_block_id]} and {relative}"
            )
        seen[str(work_block_id)] = relative
        if relative == canonical_closeout:
            continue

        if frontmatter.get("status") != "approved":
            raise ReleaseStateError(f"{label} must be approved")

        markers = parse_markers(body, label)
        required_exact = {
            "stage execution state": "completed",
            "review verdict": "READY",
            "verification verdict": "READY",
            "drift verdict": "ALIGNED",
            "closeout classification": "SUCCESS",
            "task status": "completed",
        }
        for key, expected in required_exact.items():
            actual = markers.get(key)
            if actual != expected:
                raise ReleaseStateError(
                    f"{label} requires {key}={expected}, found {actual!r}"
                )

        work_block_evaluation = completed_by_id[str(work_block_id)][
            "markers"
        ].get("evaluation verdict")
        closeout_evaluation = markers.get("evaluation verdict")
        if work_block_evaluation is not None:
            expected_evaluation = evaluation_verdict(
                work_block_evaluation,
                f"completed Work Block {work_block_id} evaluation verdict",
            )
            if closeout_evaluation is None:
                raise ReleaseStateError(
                    f"{label} requires evaluation verdict={expected_evaluation}"
                )
            actual_evaluation = evaluation_verdict(
                closeout_evaluation, f"{label} evaluation verdict"
            )
            if actual_evaluation != expected_evaluation:
                raise ReleaseStateError(
                    f"{label} requires evaluation verdict={expected_evaluation}, "
                    f"found {actual_evaluation!r}"
                )
        elif closeout_evaluation is not None:
            evaluation_verdict(
                closeout_evaluation, f"{label} evaluation verdict"
            )

        validate_external_vcs_boundary(markers.get("external vcs state", ""))
        extract_single_section(
            body, "Residual Risks and Limitations", label
        )
        extract_single_section(body, "Follow-Up Work", label)


def validate_closeout(
    root: Path,
    release_state: dict[str, Any],
    completed: list[str],
    completed_records: dict[str, dict[str, Any]],
) -> None:
    latest = release_state.get("latest_completed_work_block")
    closeout_value = release_state.get("closeout_report")
    if latest not in completed:
        raise ReleaseStateError(
            "release_state.latest_completed_work_block must be listed in completed_work_blocks"
        )
    if latest != completed[-1]:
        raise ReleaseStateError(
            "release_state.latest_completed_work_block must be the final completed_work_blocks entry"
        )
    latest_normalized, _ = safe_repo_path(root, latest, "latest_completed_work_block")
    closeout_normalized, closeout_path = safe_repo_path(root, closeout_value, "closeout_report")
    if not closeout_normalized.startswith("docs/reports/closeout/"):
        raise ReleaseStateError("closeout_report must be under docs/reports/closeout/")
    if not closeout_path.is_file():
        raise ReleaseStateError(f"closeout report is missing: {closeout_normalized}")
    frontmatter, body, full_text = parse_frontmatter(
        closeout_path, f"closeout report {closeout_normalized}"
    )
    if frontmatter.get("artifact_type") != "closeout_report":
        raise ReleaseStateError("release_state.closeout_report is not a closeout report")
    if frontmatter.get("status") != "approved":
        raise ReleaseStateError("release-state closeout report must be approved")

    latest_record = completed_records[latest_normalized]
    expected_work_block_id = latest_record["frontmatter"].get("work_block_id")
    if frontmatter.get("work_block_id") != expected_work_block_id:
        raise ReleaseStateError("closeout work_block_id does not exactly match latest Work Block")

    markers = parse_markers(body, "closeout")
    required_exact = {
        "stage execution state": "completed",
        "review verdict": "READY",
        "verification verdict": "READY",
        "drift verdict": "ALIGNED",
        "closeout classification": "SUCCESS",
        "task status": "completed",
    }
    for key, expected in required_exact.items():
        actual = markers.get(key)
        if actual != expected:
            raise ReleaseStateError(
                f"successful closeout requires {key}={expected}, found {actual!r}"
            )

    work_block_evaluation = latest_record["markers"].get("evaluation verdict")
    closeout_evaluation = markers.get("evaluation verdict")
    if work_block_evaluation is not None:
        expected_evaluation = evaluation_verdict(
            work_block_evaluation, "latest Work Block evaluation verdict"
        )
        if closeout_evaluation is None:
            raise ReleaseStateError(
                f"successful closeout requires evaluation verdict={expected_evaluation} "
                "because the latest Work Block declares evaluation"
            )
        actual_evaluation = evaluation_verdict(closeout_evaluation, "closeout evaluation verdict")
        if actual_evaluation != expected_evaluation:
            raise ReleaseStateError(
                f"successful closeout requires evaluation verdict={expected_evaluation}, "
                f"found {actual_evaluation!r}"
            )
    elif closeout_evaluation is not None:
        evaluation_verdict(closeout_evaluation, "closeout evaluation verdict")

    external = markers.get("external vcs state", "")
    validate_external_vcs_boundary(external)
    if release_state.get("external_vcs_state") != "non_normative":
        raise ReleaseStateError("release_state.external_vcs_state must be non_normative")

    extract_single_section(body, "Residual Risks and Limitations", "closeout")
    extract_single_section(body, "Follow-Up Work", "closeout")
    reject_mutable_vcs_claims(full_text, "closeout", frontmatter)


def migration_section(text: str) -> str:
    matches = list(MIGRATION_SECTION_RE.finditer(text))
    if not matches:
        raise ReleaseStateError("PROJECT_MAP.md requires one visible Migration Work section")
    if len(matches) != 1:
        raise ReleaseStateError("PROJECT_MAP.md must contain exactly one Migration Work section")
    return matches[0].group("body")


def validate_map_projection(text: str, active: str | None) -> None:
    for pattern in STALE_MAP_PATTERNS:
        if pattern.search(text):
            raise ReleaseStateError(f"PROJECT_MAP.md contains stale GitHub state: {pattern.pattern}")
    section = migration_section(text)
    no_active = "No active implementation Work Block." in section
    if active is None:
        if not no_active:
            raise ReleaseStateError(
                "PROJECT_MAP.md Migration Work section must state that no active implementation Work Block exists"
            )
    else:
        if no_active:
            raise ReleaseStateError(
                "PROJECT_MAP.md Migration Work section contradicts active Work Block state"
            )
        if f"`{active}`" not in section:
            raise ReleaseStateError(
                "PROJECT_MAP.md Migration Work section omits active Work Block"
            )


def validate_repository(root: Path) -> dict[str, Any]:
    root = root.resolve()
    registry = load_yaml_object(root / "FILE_REGISTRY.yml", "FILE_REGISTRY.yml")
    migration = registry.get("migration_state")
    if not isinstance(migration, dict):
        raise ReleaseStateError("FILE_REGISTRY.yml requires migration_state")
    completed = string_list(migration.get("completed_work_blocks"), "completed_work_blocks")
    completed_set = set(completed)
    completed_records: dict[str, dict[str, Any]] = {}
    work_block_ids: set[str] = set()
    for relative in completed:
        frontmatter, markers = validate_completed_work_block(root, relative)
        normalized = relative.strip().replace("\\", "/")
        work_block_id = str(frontmatter["work_block_id"])
        if work_block_id in work_block_ids:
            raise ReleaseStateError(f"duplicate completed work_block_id: {work_block_id}")
        work_block_ids.add(work_block_id)
        completed_records[normalized] = {"frontmatter": frontmatter, "markers": markers}

    active_value = migration.get("active_work_block")
    active: str | None
    if active_value is None:
        active = None
    else:
        active, _ = safe_repo_path(root, active_value, "active_work_block")
        if active in completed_set:
            raise ReleaseStateError("active Work Block cannot also be completed")
        active_frontmatter = validate_active_work_block(root, active)
        if active_frontmatter.get("work_block_id") in work_block_ids:
            raise ReleaseStateError("active Work Block ID duplicates a completed Work Block ID")

    map_state, map_text = parse_map_state(root / "PROJECT_MAP.md")
    map_completed = string_list(
        map_state.get("completed_work_blocks"), "PROJECT_MAP completed_work_blocks"
    )
    map_active = map_state.get("active_work_block")
    if map_completed != completed:
        raise ReleaseStateError("PROJECT_MAP completed Work Blocks do not match FILE_REGISTRY.yml")
    if map_active != active:
        raise ReleaseStateError("PROJECT_MAP active Work Block does not match FILE_REGISTRY.yml")
    validate_map_projection(map_text, active)

    release_state = registry.get("release_state")
    if not isinstance(release_state, dict):
        raise ReleaseStateError("FILE_REGISTRY.yml requires release_state")
    validate_release_assets(root, release_state)
    validate_completed_closeout_reports(
        root, completed_records, str(release_state.get("closeout_report", ""))
    )
    validate_closeout(root, release_state, completed, completed_records)

    return {
        "completed_work_blocks": completed,
        "active_work_block": active,
        "latest_completed_work_block": release_state["latest_completed_work_block"],
        "closeout_report": release_state["closeout_report"],
        "verdict": "READY",
    }


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--root", type=Path, default=Path(__file__).resolve().parents[1])
    args = parser.parse_args()
    try:
        result = validate_repository(args.root)
    except ReleaseStateError as exc:
        print(f"RELEASE STATE BLOCKED: {exc}", file=sys.stderr)
        return 1
    print("Release-state contract: READY")
    print(f"Completed Work Blocks: {len(result['completed_work_blocks'])}")
    print(f"Active Work Block: {result['active_work_block'] or 'none'}")
    print(f"Latest completed: {result['latest_completed_work_block']}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
