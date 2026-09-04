---
schema_version: 1
artifact_type: work_block_specification
work_block_id: WB-2026-09-04-nice-seo-handoff-reconciliation
status: approved
revision: 34757785d223ad9a4a612e02d128ecfce1add2de
---

# Work Block Specification — Nice / SEO Handoff Reconciliation

## Objective

Perform a read-only reconciliation of `feat/creation-site-internet-nice` and
`feat/technical-seo-multilingual-integrity` against current `origin/main`.
Determine whether their unique commits and lifecycle records are already
superseded, still require Owner publication/action, or need a bounded follow-up.

## Requirements

- REQ-001: Compare both branch tips and unique commits with exact current `origin/main`.
- REQ-002: Correlate both branches with lifecycle SSOT, PR history, worktrees, and dirty-path ownership.
- REQ-003: Produce safe evidence-backed dispositions without modifying application code or Owner-controlled state.

## Acceptance criteria

- AC-001 [req=REQ-001]: both branches have exact ancestry and unique-commit evidence;
- AC-002 [req=REQ-002]: lifecycle, PR, and worktree status is recorded for each branch;
- AC-003 [req=REQ-003]: canonical dirty worktree is preserved and any cleanup action remains Owner-gated;
- AC-004 [req=REQ-003]: report proposes bounded next WB(s), not an oversized merge or cleanup;
- AC-005 [req=REQ-003]: no application files, branch refs, or worktrees are mutated.

## Out of scope

- merge, rebase, reset, branch/worktree deletion, commit, push, or deployment;
- changes under `web/`, runtime/configuration, secrets, or infrastructure;
- cleanup of `/home/azur/Projects/WSL/azursystech`.
