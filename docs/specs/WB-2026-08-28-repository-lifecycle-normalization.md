# WB-2026-08-28 Repository Lifecycle Normalization

## Status

- Work Block: WB-2026-08-28-repository-lifecycle-normalization
- Lifecycle stage: Define
- Governance profile: Managed
- Subject branch: wb/2026-08-28-repository-lifecycle-normalization
- Frozen base: 96dbd44102785005bfd23b0f99192f5bfeb17e68
- Authority: local reversible normalization and local commits are approved; push,
  GitHub mutation, remote deletion, worktree pruning/removal, merge, and deploy are excluded.

## Objective

Restore one truthful repository lifecycle SSOT after the completed shared-context
work, and produce a conservative recommendation-only inventory for later
Owner-controlled remote-branch and worktree cleanup.

## Requirements

- REQ-001: The active Work Block SSOT, registry, Project Map, gates, and shared
  operational memory shall identify this Work Block as the sole active local work.
- REQ-002: The completed shared-context Work Block shall have truthful terminal
  lifecycle markers and one canonical repository-side closeout without mutable
  hosting-provider claims.
- REQ-003: `FILE_REGISTRY.yml:migration_state`, its Project Map projection, and
  release-state assets shall satisfy the existing release contract; enforcement
  shall have deterministic local fixtures and a path-triggered workflow.
- REQ-004: Every currently observed remote branch shall have a timestamped,
  evidence-based class: KEEP, SAFE_REMOTE_DELETE, RECOVER_INTENT, INVESTIGATE,
  or ACTIVE. SAFE_REMOTE_DELETE is recommendation-only and requires recorded
  merge association or demonstrated equivalence plus no preservation exception.
- REQ-005: Local Git worktree registrations and discovered checkout roots shall
  be classified as valid, stale, missing, or dirty without prune, delete, reset,
  checkout, or modification of the dirty canonical checkout.
- REQ-006: The implementation shall remain lifecycle/evidence-only and exclude
  application behavior, runtime profiles, credentials, deployment, remote refs,
  GitHub mutation, destructive cleanup, and self-referential final-SHA claims.

## Acceptance Criteria

- AC-001 [req=REQ-001]: Exactly one current active Work Block is represented by
  the active JSON, registry, and Project Map.
- AC-002 [req=REQ-002]: The completed PR20-era Work Block meets terminal
  lifecycle parsing and has a canonical approved closeout.
- AC-003 [req=REQ-003]: `python3 scripts/validate-release-state.py` and its
  fixtures pass, and the release workflow covers its own contract surfaces.
- AC-004 [req=REQ-004]: The branch audit records a class, evidence, and later
  owner action for every observed remote head; protected/recovery branches are excluded from deletion recommendations.
- AC-005 [req=REQ-005]: The worktree audit records every registration and
  discovered local checkout with no mutation.
- AC-006 [req=REQ-006]: Frozen-diff inspection shows only the approved lifecycle,
  evidence, and deterministic enforcement paths; no external action occurs.

## Non-goals

No deletion, pruning, remote mutation, pull-request mutation, merge, deployment,
runtime/product behavior change, dependency change, credential access, or repair
of unrelated dirty local checkouts.
