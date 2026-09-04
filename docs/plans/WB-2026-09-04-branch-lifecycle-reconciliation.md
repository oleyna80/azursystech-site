---
schema_version: 1
artifact_type: work_block_plan
work_block_id: WB-2026-09-04-branch-lifecycle-reconciliation
status: completed
specification: docs/specs/WB-2026-09-04-branch-lifecycle-reconciliation.md
specification_revision: b244fc51cd83575cf961245a694a47510cd0a1c4
---

# Plan — Branch / Lifecycle Reconciliation

## Stage 0 — Define

- confirm repository, branch, exact base, clean status, and `origin/main`;
- open lifecycle state through `.codex/scripts/lifecycle.py`.

## Stage 1 — Read-only inventory

- enumerate local/remote branches and ancestry relative to `origin/main`;
- enumerate worktrees, checked-out branches, and dirty paths;
- correlate unique commits with PR history and lifecycle records;
- inspect plans/tasklists/closeouts only on branch refs as needed.

## Stage 2 — Assurance

- Review: evidence and classifications are internally consistent;
- Verification: rerun repository validators and path-scope checks;
- Drift: compare branch/lifecycle conclusions with current `main` release state.

## Stage 3 — Closeout

- publish reports only within the approved docs/report write-set;
- leave branch refs and worktrees unchanged;
- stop before commit or push unless separately authorized.

## Future action policy

Any merge, archive, branch deletion, or worktree deletion requires a separate
Owner decision after this audit and is not implied by this plan.
