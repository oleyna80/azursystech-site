---
artifact_type: specification
work_block_id: WB-2026-09-03-lifecycle-inactive-closeout-coordination-reconciliation
status: approved
revision: v1
---

# Specification: Lifecycle Inactive Closeout Coordination Reconciliation

## Objective

Allow the canonical inactive state to stage and locally commit its complete
coordination closeout record, including the repository release-state indexes,
while continuing to deny every application and operational source path.

## Scope and Exclusions

The approved scope is lifecycle defaults, Codex and Claude path gates, the
deterministic control-plane regression, the default operational record, and
coordination documentation/evidence. `FILE_REGISTRY.yml` and `PROJECT_MAP.md`
are admitted only as exact coordination metadata paths. Application roots,
dependencies, runtime configuration, deployment state, SEO behavior, live
infrastructure, credentials, and data are excluded.

## Requirements

- REQ-001: Canonical inactive coordination defaults must include only the two
  additional exact release-state metadata paths, `FILE_REGISTRY.yml` and
  `PROJECT_MAP.md`, consistently across lifecycle state, defaults, both runtime
  gates, and the installation-profile validator.
- REQ-002: In canonical inactive state, Codex and Claude must permit edits,
  staging, and local commits composed only of declared coordination paths,
  including the two metadata paths.
- REQ-003: In canonical inactive state, both gates must continue to deny source
  edits and commits, stale branch binding must remain fail-closed, and no
  wildcard broadening may be introduced.
- REQ-004: The control-plane regression suite must deterministically prove a
  reporting-only closeout to inactive state followed by a complete
  coordination-only local commit, plus source-path denial.
- REQ-005: Lifecycle documentation and closeout evidence must describe the
  exact inactive coordination boundary and preserve release-state agreement.

## Acceptance Criteria

- AC-001 [req=REQ-001]: The default record, lifecycle helper, Codex gate,
  Claude gate, and installation-profile validator contain the same canonical
  list, with only the two stated exact metadata additions.
- AC-002 [req=REQ-002]: A deterministic fixture allows both gate adapters to
  stage and commit a complete inactive closeout coordination set containing
  `FILE_REGISTRY.yml`, `PROJECT_MAP.md`, and a documentation artifact.
- AC-003 [req=REQ-003]: The same fixture rejects a source edit and a staged
  source commit; existing stale-binding regressions continue to pass.
- AC-004 [req=REQ-004]: `scripts/test-github-capability-control-plane.py` and
  `scripts/test-release-state-contracts.py` pass.
- AC-005 [req=REQ-005]: Traceability, Review, Verification, Drift, closeout,
  and `git diff --check` are recorded with no deployment action.
