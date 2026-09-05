# Specification — WB-2026-09-05-automatiser-guide-closeout

## Objective

Close the lifecycle record for the already merged customer-request automation
guide and prepare the historical feature branch for separate Owner-controlled
cleanup. No guide implementation changes are authorized.

## Requirements

- REQ-001: Reconcile the historical branch, PR #19, Work Block tasklist,
  and current `origin/main` using exact SHA evidence.
- REQ-002: Confirm that the guide implementation and its tests are present
  in current `origin/main`; do not reimplement or modify them.
- REQ-003: Record the branch as implementation-complete with lifecycle
  closeout required, including the stale TASK-030 and publication wording.
- REQ-004: Close the Work Block through the canonical lifecycle helper and
  leave the operational state inactive and fail-closed.

## Acceptance criteria

- AC-001 [req=REQ-001]: Reports identify branch head, PR #19 merge evidence, and exact
  current `origin/main` base.
- AC-002 [req=REQ-002]: Review/verification evidence confirms no application change is
  needed and guide source remains in `origin/main`.
- AC-003 [req=REQ-003]: Tasklist is complete and closeout/gate records agree with the
  already merged publication state.
- AC-004 [req=REQ-004]: Canonical close succeeds; release-state validation reports no
  active Work Block.

## Scope

Allowed writes are limited to this WB's lifecycle and documentation paths:
`.agent/**` gate state, `.codex/write-gate.md`, `docs/specs/**`,
`docs/plans/**`, `docs/tasklist/**`, and `docs/reports/**` for this WB.

## Non-goals

No changes to `web/`, `admin/`, or `showcase/`; no dependencies, deployment,
production verification, commit, push, PR mutation, merge, branch deletion, or
worktree removal.
