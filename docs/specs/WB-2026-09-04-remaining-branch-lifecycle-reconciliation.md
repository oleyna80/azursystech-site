---
schema_version: 1
artifact_type: work_block_specification
work_block_id: WB-2026-09-04-remaining-branch-lifecycle-reconciliation
status: approved
revision: d4e141ad5e228686ac51b1145bd2f6b47d34a819
governance_profile: Managed
---

# Requirements — remaining branch/lifecycle reconciliation

## Objective

Inventory remaining local and remote branch refs, worktrees, merged PRs, and
branch-tip lifecycle records after PR #29, then produce evidence-backed
dispositions without deleting or modifying any target.

## Requirements

- REQ-001: capture exact current-main, branch, remote-ref, PR, ancestry, and worktree evidence.
- REQ-002: inspect branch-tip lifecycle SSOT and classify each ref as retain, reconcile, or cleanup candidate without inferring deletion authority from merge status alone.
- REQ-003: identify Nice lifecycle publication drift, stale implementation tips, unknown refs, and any active or blocked Work Block records.
- REQ-004: produce bounded follow-up Work Blocks with exact targets, preconditions, confidence, and Owner gates; no destructive action in this WB.

## Acceptance criteria

- AC-001 [req=REQ-001]: exact baseline, remote refs, PRs, ancestry, and worktrees are recorded.
- AC-002 [req=REQ-002]: every discovered non-main ref has an evidence-backed disposition.
- AC-003 [req=REQ-003]: lifecycle state is distinguished from implementation ancestry and merge state.
- AC-004 [req=REQ-004]: cleanup candidates and unresolved refs have bounded next actions and explicit gates.
- AC-005 [req=REQ-004]: no branch, worktree, application, deployment, secret, commit, or remote ref is mutated.
