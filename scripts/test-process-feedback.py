#!/usr/bin/env python3
"""Focused contract tests for repository-native Process Feedback."""

from __future__ import annotations

import json
import subprocess
import sys
import tempfile
from pathlib import Path

import yaml

from process_feedback import ProcessFeedbackError, aggregate, validate_closeout_file, validate_registry, validate_review_report

ROOT = Path(__file__).resolve().parents[1]
WB = "WB-test-process-feedback"


def registry_document(observations: list[dict[str, object]]) -> dict[str, object]:
    return {
        "schema_version": 1,
        "sink": "docs/engineering-memory/process-feedback-registry.yml",
        "authority_boundary": {
            "mode": "advisory_only",
            "systemic_change_requires": "separate_improvement_work_block",
            "direct_governance_mutation": "forbidden",
        },
        "observations": observations,
    }


def observation(**overrides: object) -> dict[str, object]:
    value: dict[str, object] = {
        "id": "PF-test-001",
        "work_block_id": WB,
        "date": "2026-09-09",
        "category": "TOOLING_FRICTION",
        "observation": "A validator command required an extra inventory step.",
        "evidence": "scripts/test-process-feedback.py: focused test case",
        "likely_systemic_cause": "missing bounded command contract",
        "impact": "verification took longer than planned",
        "suggested_improvement": "document the command and expected completion evidence",
        "severity": "LOW",
        "status": "NEW",
        "authority": "advisory_only",
        "avoidable_friction": True,
        "related_work_blocks": [],
    }
    value.update(overrides)
    return value


def closeout_text(result: str = "NONE — checked", ids: list[str] | None = None, count: int = 0) -> str:
    ids = ids or []
    dimensions = "\n".join(
        f'  {name}: "checked: no material friction observed in this dimension"'
        for name in (
            "documentation", "contracts_invariants", "tooling_skills", "context_memory",
            "governance_authority", "environment_setup", "validation_tests",
            "process_overhead_repeated_work",
        )
    )
    block = f"""contract_version: 1
work_block_id: {WB}
date: "2026-09-09"
result: {result}
dimensions:
{dimensions}
avoidable_friction_count: {count}
observation_ids: {json.dumps(ids)}
registry: docs/engineering-memory/process-feedback-registry.yml"""
    return f"""---
artifact_type: closeout_report
work_block_id: {WB}
status: approved
process_feedback_required: true
process_feedback_contract: 1
---

## Process Feedback

```yaml process-feedback
{block}
```

## Residual Risks and Limitations
none

## Follow-Up Work
none
"""


def assert_rejected(function, expected: str) -> None:
    try:
        function()
    except ProcessFeedbackError as exc:
        assert expected in str(exc), str(exc)
    else:
        raise AssertionError(f"expected rejection containing {expected!r}")


def main() -> int:
    with tempfile.TemporaryDirectory(prefix="process-feedback-test-") as raw:
        root = Path(raw)
        registry_path = root / "registry.yml"
        closeout_path = root / "closeout.md"
        review_path = root / "review.md"

        registry_path.write_text(yaml.safe_dump(registry_document([]), sort_keys=False), encoding="utf-8")
        closeout_path.write_text(closeout_text(), encoding="utf-8")
        validate_registry(registry_path)
        validate_closeout_file(closeout_path, registry_path, WB)

        reviewed = registry_document([observation()])
        registry_path.write_text(yaml.safe_dump(reviewed, sort_keys=False), encoding="utf-8")
        closeout_path.write_text(closeout_text("OBSERVATIONS_RECORDED", ["PF-test-001"], 1), encoding="utf-8")
        validate_closeout_file(closeout_path, registry_path, WB)
        summary = aggregate(registry_path)
        assert summary["total"] == 1
        assert summary["avoidable_friction_total"] == 1
        assert summary["by_category"] == {"TOOLING_FRICTION": 1}

        bad = dict(observation(authority="governance_write"))
        registry_path.write_text(yaml.safe_dump(registry_document([bad]), sort_keys=False), encoding="utf-8")
        assert_rejected(lambda: validate_registry(registry_path), "authority must be advisory_only")

        registry_path.write_text(yaml.safe_dump(reviewed, sort_keys=False), encoding="utf-8")
        closeout_path.write_text(closeout_text("NONE — checked", ["PF-test-001"], 1), encoding="utf-8")
        assert_rejected(lambda: validate_closeout_file(closeout_path, registry_path, WB), "NONE")

        review_path.write_text(
            """## Process Feedback Review
- **Missed Process Feedback:** none observed after checking the eight dimensions
- **Unsupported Feedback:** none; all recorded items cite evidence
- **Classification Concerns:** none
- **Duplicate/Recurring Candidate:** PF-test-001 is a candidate for future clustering
""",
            encoding="utf-8",
        )
        validate_review_report(review_path)
        subprocess.run(
            [sys.executable, str(ROOT / "scripts/aggregate-process-feedback.py"), "--registry", str(registry_path), "--json"],
            check=True, stdout=subprocess.PIPE, text=True,
        )
    print("Process Feedback focused tests: PASS")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
