#!/usr/bin/env python3
"""Validate Process Feedback registry, closeout, and assurance report contracts."""

from __future__ import annotations

import argparse
from pathlib import Path

from process_feedback import (
    ProcessFeedbackError,
    validate_closeout_file,
    validate_registry,
    validate_review_report,
)


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--registry", type=Path, required=True)
    parser.add_argument("--closeout", type=Path)
    parser.add_argument("--expected-work-block-id")
    parser.add_argument("--review-report", type=Path)
    args = parser.parse_args()
    try:
        validate_registry(args.registry)
        if args.closeout:
            validate_closeout_file(args.closeout, args.registry, args.expected_work_block_id)
        if args.review_report:
            validate_review_report(args.review_report)
    except ProcessFeedbackError as exc:
        print(f"PROCESS FEEDBACK BLOCKED: {exc}")
        return 1
    print("Process Feedback contract: READY")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
