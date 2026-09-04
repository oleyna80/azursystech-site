# Critic report — WB-2026-08-13 repository cleanup

## Stage, objective, role, expected result

- Stage: Stage 0 Define.
- Objective: challenge the cleanup plan before any local deletion.
- Role: independent read-only Critic.
- Expected result: determine whether evidence retention and removal sequencing
  protect the dirty canonical checkout and the retained Showcase candidate.

## Verdict

`SUPPLEMENT`.

The Critic found the retention approach sound: staged legacy evidence is left
untouched, live SHA-256 values match the inventory, and the retained Showcase
candidate is distinct from the clean duplicate at the same baseline.

Before a removal operation, the Critic required an immutable exact-removal
manifest, exact identification of the disposable clone and stale registration,
a stated authorization-discovery boundary, and pre/post invariant checks.
Those supplements are now recorded in the cleanup plan and inventory. The next
operation remains blocked pending Owner confirmation of that exact manifest.

## Scope and exclusions

Read-only review of the cleanup plan, tasklist, inventory, current status,
worktrees, branches, and hashes. No file, Git ref, worktree, runtime, Docker,
VPS, SSH, database, secret, or remote state was changed by the Critic.
