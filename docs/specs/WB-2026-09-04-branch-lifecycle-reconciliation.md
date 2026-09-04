---
schema_version: 1
artifact_type: work_block_specification
work_block_id: WB-2026-09-04-branch-lifecycle-reconciliation
status: approved
revision: b244fc51cd83575cf961245a694a47510cd0a1c4
---

# Work Block Specification — Branch / Lifecycle Reconciliation

## Objective

Perform a read-only inventory of local and remote branches, worktrees, merged
and open PR references, and lifecycle SSOT records for `azursystech`. Identify
which branch states are active, awaiting Owner action, reconciled, stale, or
unsafe to remove. Produce evidence-backed recommendations.

## In scope

- exact base and worktree/branch preflight;
- local and remote branch ancestry against `origin/main`;
- worktree locations and dirty-state ownership;
- lifecycle state, plan, tasklist, closeout, and PR correlation;
- bounded reports and coordination documents for this Work Block.

## Requirements

- REQ-001: Inventory every local and remote non-main branch against the exact
  current `origin/main` baseline.
- REQ-002: Correlate branch refs with worktrees, lifecycle SSOT, closeout
  records, and PR history without mutating any of them.
- REQ-003: Produce evidence-backed disposition recommendations that preserve
  dirty or Owner-controlled state and do not authorize deletion.

## Out of scope

- application, infrastructure, configuration, or secret changes;
- merge, rebase, reset, branch/worktree deletion, commit, push, PR mutation;
- deployment, live-data mutation, or client communication;
- declaring a branch deletable without explicit later Owner authorization.

## Acceptance criteria

- AC-001 [req=REQ-001]: every discovered non-main branch is classified with evidence and confidence;
- AC-002 [req=REQ-002]: active/awaiting/blocked lifecycle records are distinguished from stale refs;
- AC-003 [req=REQ-002,REQ-003]: canonical dirty worktrees are preserved and explicitly reported;
- AC-004 [req=REQ-003]: no application files are changed;
- AC-005 [req=REQ-003]: reports pass path-scope, `git diff --check`, Review, Verification, and Drift.
