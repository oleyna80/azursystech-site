---
artifact_type: specification
work_block_id: WB-2026-09-03-lifecycle-inactive-publication-reconciliation
revision: v1
status: approved
---

# Lifecycle Inactive Publication Reconciliation

## Objective

Reconcile the lifecycle helper, cooperative write gates, and release-state contract
so a completed Work Block can publish final lifecycle and documentation artifacts
with an inactive operational record, without permitting application/source writes
outside an active Work Block.

## Requirements

- REQ-001: `close` leaves `.agent/active-work-block.json` in canonical inactive
  state after valid `success-closeout` or `reporting-only` assurance.
- REQ-002: Inactive canonical state permits Codex and Claude edits, staging, and
  local commits only for coordination paths.
- REQ-003: Inactive state denies every non-coordination/source write and staged
  source commit.
- REQ-004: Active Work Block branch-binding and stale-gate protections remain unchanged.
- REQ-005: Lifecycle and release-state documentation are consistent with inactive closeout.
- REQ-006: Deterministic regressions cover reporting-only closeout to inactive state
  and a docs-only local commit.

## Acceptance criteria

- AC-001 [req=REQ-001]: Lifecycle close regression asserts empty operational ID, specification path,
  branch, and write set after valid closeout.
- AC-002 [req=REQ-002]: Both runtime gates allow a staged coordination-only commit while inactive.
- AC-003 [req=REQ-003,REQ-004]: Both runtime gates deny an inactive source edit and staged source commit while active binding regressions remain covered.
- AC-004 [req=REQ-006]: `scripts/test-github-capability-control-plane.py` and
  `scripts/test-release-state-contracts.py` pass.
- AC-005 [req=REQ-005]: `git diff --check` passes; `web/`, `admin/`, and `showcase/` do not change.

## Exclusions and hard stops

No SEO remediation, application/runtime/configuration change, dependency change,
deployment, merge, or remote publication is authorized.
