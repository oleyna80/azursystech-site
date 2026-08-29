---
artifact_type: work_block
work_block_id: WB-2026-08-29-repository-closeout-cleanup
status: in_progress
revision: v1
---

# Work Block Plan: Repository Closeout Cleanup

## Objective

Close the previous repository-owned lifecycle record, establish this sole active
Work Block, refresh branch/worktree inventory at the immutable base, and publish
an advisory cleanup manifest. Stop at OWNER_CLEANUP_GATE.

## Scope and write-set

Only the explicit lifecycle, SSOT, Define, assurance, audit, and manifest paths
in `.agent/active-work-block.json`. Product/runtime source, release-state
contracts/validators, dependencies, configuration, credentials, and deployment
are excluded.

## Steps

1. Canonically close the predecessor and reconcile SSOT.
2. Refresh every remote head and relevant local location without mutation.
3. Produce the four-batch manifest and fresh Define/assurance evidence.
4. Create a local checkpoint only; stop at OWNER_CLEANUP_GATE.

## Stop condition

No push, provider mutation, remote deletion, worktree removal/prune, local
directory deletion, reset, clean, stash, merge, or deployment is permitted.
