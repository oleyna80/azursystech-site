---
artifact_type: specification
work_block_id: WB-2026-09-03-lifecycle-inactive-publication-commit-reconciliation
status: approved
revision: v1
---

# Specification: Lifecycle Inactive Publication Commit Reconciliation

## Objective

Permit one local commit for the already reviewed lifecycle reconciliation diff;
no implementation content may change in this successor Work Block.

## Requirements

- REQ-001: Bind a Work Block to the current branch and exact base with only the
  frozen control-plane paths and lifecycle records in its write-set.
- REQ-002: Keep the predecessor completed while this successor is active.
- REQ-003: Create one local commit only; do not push, merge, deploy, or alter
  application, dependency, runtime, configuration, or deployment paths.
- REQ-004: Record staged and post-commit verification.

## Acceptance Criteria

- AC-001 [req=REQ-001]: The active record has the exact branch/base binding and
  narrow write-set.
- AC-002 [req=REQ-002]: Release-state validation retains the predecessor as latest
  completed Work Block and identifies this successor as active.
- AC-003 [req=REQ-003]: One local commit contains no forbidden paths or remote action.
- AC-004 [req=REQ-004]: Staged and post-commit checks are recorded.
