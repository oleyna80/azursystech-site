#!/usr/bin/env python3
"""Read-only aggregation of the canonical Process Feedback registry."""

from __future__ import annotations

import argparse
import json
from pathlib import Path

from process_feedback import ProcessFeedbackError, aggregate


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--registry", type=Path, required=True)
    parser.add_argument("--json", action="store_true")
    args = parser.parse_args()
    try:
        result = aggregate(args.registry)
    except ProcessFeedbackError as exc:
        print(f"PROCESS FEEDBACK BLOCKED: {exc}")
        return 1
    if args.json:
        print(json.dumps(result, indent=2, sort_keys=True))
    else:
        print(f"Process Feedback observations: {result['total']}")
        print(f"Avoidable friction: {result['avoidable_friction_total']}")
        print(f"Recurring causes: {len(result['recurring_causes'])}")
        print(f"Candidate improvements: {len(result['candidate_improvements'])}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
