---
artifact_type: specification
work_block_id: WB-2026-08-29-repository-closeout-cleanup
revision: v1
---

# WB-2026-08-29 Repository Closeout Cleanup

## Requirements

- REQ-001: The previous normalization Work Block shall be canonically completed and the new Work Block shall be the sole active repository SSOT.
- REQ-002: Every current origin head shall be refreshed against exact main and assigned one permitted, evidence-based classification.
- REQ-003: Every relevant registered worktree and local checkout shall be refreshed and assigned a non-destructive disposition.
- REQ-004: An executable, SHA-bound advisory manifest shall separate remote deletion, worktree removal, pruning/directory action, and preservation/recovery.
- REQ-005: The package shall remain governance/evidence-only and stop at OWNER_CLEANUP_GATE without external or destructive mutation.

## Acceptance Criteria

- AC-001 [req=REQ-001]: Registry, Project Map, active JSON, gates, completed predecessor plan, and canonical predecessor closeout agree.
- AC-002 [req=REQ-002]: All 17 current heads have SHA, exact-main relation, dependencies, and final class; no former investigation remains unresolved.
- AC-003 [req=REQ-003]: Every relevant worktree/checkout records path, state, evidence location, and advisory action; no dirty location is deletable.
- AC-004 [req=REQ-004]: The manifest has all four prescribed sections and each deletion candidate has its expected SHA/path and dependency check.
- AC-005 [req=REQ-005]: Deterministic governance checks pass and evidence confirms no product scope, publication, deletion, prune, removal, reset, clean, stash, merge, or deployment.
