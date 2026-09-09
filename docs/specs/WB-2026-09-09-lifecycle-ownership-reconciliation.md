---
schema_version: 1
artifact_type: specification
work_block_id: WB-2026-09-09-lifecycle-ownership-reconciliation
status: approved
revision: 1
governance_profile: Managed
---

# Specification — Lifecycle and Ownership Reconciliation

## Objective

Reconcile the repository's machine and human lifecycle projections after the
integrated and deployed Crawl / Indexation and release-state fixture Work
Blocks. Establish current Git/GitHub branch and worktree ownership, classify
untracked multilingual Define artifacts, and publish a bounded non-default
candidate that leaves the repository in canonical inactive state.

## Requirements

- REQ-001: Record the exact current `origin/main` baseline, integrated Work
  Block evidence, GitHub branch/PR truth, and worktree inventory.
- REQ-002: Synchronize `.agent/active-work-block.json`, `FILE_REGISTRY.yml`,
  `PROJECT_MAP.md`, and coordination gate records so completed integrated Work
  Blocks are not falsely active and the canonical inactive contract is exact;
  directly related integrated Crawl and fixture plan/closeout projections may
  be corrected from reporting-only handoff to completed success markers when
  current integration/deployment evidence proves completion.
- REQ-003: Classify every registered missing/prunable worktree and relevant
  branch with an evidence-backed disposition and exact SHA, without deleting,
  pruning, or mutating any branch/worktree.
- REQ-004: Classify the three untracked multilingual Define artifacts by
  provenance and ownership; preserve them and do not implement or delete them.
- REQ-005: Validate release-state, lifecycle, control-plane, traceability,
  Git/worktree consistency, and the bounded candidate before publication.

## Acceptance criteria

- AC-001 [req=REQ-001]: The reconciliation report records the live baseline,
  subject branch, integrated Work Block plans/closeouts, remote refs, PR/CI
  observations, and all registered worktrees.
- AC-002 [req=REQ-002]: `validate-release-state.py` reports `READY`, the
  completed index contains the integrated Crawl, fixture-isolation, and
  reconciliation plans, and both map/registry plus operational state agree on
  canonical inactive state.
- AC-003 [req=REQ-003]: Every missing/prunable registration and relevant branch
  has one of the approved dispositions; no delete/prune/reset/force operation
  occurs.
- AC-004 [req=REQ-004]: The multilingual files remain byte-preserved and are
  explicitly classified as pending Owner disposition, not silently promoted,
  abandoned, or removed.
- AC-005 [req=REQ-005]: Focused lifecycle/release/control-plane/traceability
  checks, `git diff --check`, and final exact-scope review pass; only the exact
  subject branch candidate is published.

## Boundaries and exclusions

This Work Block changes lifecycle documentation and coordination projections
only. It does not change lifecycle semantics, validators, authority contracts,
application routes, sitemap/SEO behavior, deployment, dependencies, database,
secrets, production data, multilingual implementation, branch refs, worktree
registrations, or default-branch state. Merge and deploy remain historical
Owner actions and are not performed here.

The existing `feat/scoped-worker-session-recovery-reconciled-024` branch and all
historical/reference branches remain preserved. The exact cleanup manifest is a
classification artifact only; it authorizes no cleanup action.
