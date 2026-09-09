---
schema_version: 1
artifact_type: specification
work_block_id: WB-2026-09-09-release-state-fixture-isolation
revision: 1
status: approved
---

# Specification — Release-State Fixture Isolation

## Objective

Restore the deterministic release-state contract regression suite on the
integrated `main` revision by correcting only the fixture projection setup
that masks the intended malformed operational-state assertion.

## Requirements

- REQ-001: The malformed operational-state fixture must isolate the canonical
  inactive `FILE_REGISTRY.yml` and `PROJECT_MAP.md` projections before the
  operational JSON is malformed.
- REQ-002: The fixture correction must preserve the existing release-state
  validator semantics and make the malformed case fail for
  `operational active Work Block is malformed`.
- REQ-003: The valid repository case and independent registry, operational,
  specification, and inactive-state failure cases must continue to pass or
  fail for their existing intended reasons.
- REQ-004: The candidate must not change production routes, sitemap, SEO,
  deployment, dependencies, database, secrets, lifecycle meaning, or the
  separate Crawl / Indexation subject branch.

## Acceptance criteria

- AC-001 [req=REQ-001]: `inactive_fixture()` derives the current active map
  projection from fixture state and does not depend on a stale Work Block path.
- AC-002 [req=REQ-002]: `python3 scripts/test-release-state-contracts.py`
  exits successfully and includes the malformed operational-state regression.
- AC-003 [req=REQ-003]: `python3 scripts/validate-release-state.py`, focused
  control-plane tests, and the independent negative cases retain their
  expected outcomes.
- AC-004 [req=REQ-004]: The exact candidate diff contains no application,
  route, sitemap, deployment, dependency, database, secret, or unrelated
  branch/worktree change.

## Explicit boundaries

- This is a fixture-isolation correction, not a release-state contract or
  authority-model change.
- No production or default-branch mutation, merge, deploy, force-push,
  branch deletion, or worktree deletion is authorized.
- The Owner integration boundary is the next action after candidate
  publication.
