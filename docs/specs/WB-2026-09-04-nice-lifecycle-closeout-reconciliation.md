---
schema_version: 1
artifact_type: work_block_specification
work_block_id: WB-2026-09-04-nice-lifecycle-closeout-reconciliation
status: approved
revision: b29ff40b53628cc6e4c755ce4a19cb791f8fa688
governance_profile: Managed
---

# Requirements — Nice lifecycle closeout reconciliation

## Objective

Determine whether `WB-2026-08-24-creation-site-internet-nice` can be safely closed operationally after PR #17 merged, while preserving the canonical dirty worktree and all untracked historical artifacts.

## Requirements

- REQ-001: verify the Nice implementation, PR #17 merge, branch tip, local-only closeout commit, and current-main ancestry using exact SHAs.
- REQ-002: inspect the canonical worktree's lifecycle SSOT, status, local commits, and untracked artifacts read-only; do not modify, stage, reset, rebase, switch, clean, or delete it.
- REQ-003: reconcile tasklist, review, verification, drift, closeout, and lifecycle state, identifying what is complete and what remains an Owner decision.
- REQ-004: produce a minimal closeout recommendation and explicit bounded next action; no application changes, merge, push, deploy, or destructive cleanup.

## Acceptance criteria

- AC-001 [req=REQ-001]: exact branch, PR, merge commit, baseline, and current-main evidence is recorded.
- AC-002 [req=REQ-002]: canonical dirty state, active lifecycle record, local commits, and untracked artifacts are recorded and preserved.
- AC-003 [req=REQ-003]: implementation and assurance completion are distinguished from operational lifecycle completion.
- AC-004 [req=REQ-004]: recommendation states whether a docs/lifecycle-only closeout is safe and names explicit Owner gates.
- AC-005 [req=REQ-004]: no application, branch, worktree, remote, deployment, or secret mutation occurs.
