---
schema_version: 1
artifact_type: work_block_specification
work_block_id: WB-2026-09-04-lifecycle-branch-cleanup
status: approved
revision: b29ff40b53628cc6e4c755ce4a19cb791f8fa688
governance_profile: Managed
---

# Requirements — lifecycle / branch cleanup audit

## Objective

Reconcile stale branch refs, worktrees, and lifecycle artifacts after merged Work Blocks, producing evidence-backed cleanup dispositions without deleting or modifying any target.

## Requirements

- REQ-001: inventory local and remote branches, worktrees, merged PRs, and branch-bound lifecycle records using exact refs and paths.
- REQ-002: preserve the canonical dirty worktree and classify every cleanup candidate as retain, reconcile, or eligible-for-Owner-decision; do not infer deletion authority from merge status alone.
- REQ-003: identify active or inconsistent Work Block state and map it to the owning branch/worktree and durable artifacts.
- REQ-004: produce bounded follow-up recommendations with explicit target, preconditions, and approval gate for any destructive cleanup.

## Acceptance criteria

- AC-001 [req=REQ-001]: exact baseline and current branch/worktree preflight are recorded.
- AC-002 [req=REQ-001]: branch, remote, PR, worktree, and lifecycle evidence is correlated.
- AC-003 [req=REQ-002,REQ-003]: canonical dirty state is preserved and reported without mutation.
- AC-004 [req=REQ-003]: each identified candidate has a safe disposition and confidence.
- AC-005 [req=REQ-004]: no branch, worktree, application, deployment, or secret mutation occurs.
