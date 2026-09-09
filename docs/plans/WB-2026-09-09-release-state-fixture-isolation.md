---
schema_version: 1
artifact_type: work_block
work_block_id: WB-2026-09-09-release-state-fixture-isolation
status: in_progress
specification: docs/specs/WB-2026-09-09-release-state-fixture-isolation.md
---

# Plan — Release-State Fixture Isolation

1. Reproduce the integrated-main release-state contract failure and freeze the
   exact baseline.
2. Inspect the fixture helper and current release-state projection format.
3. Update only fixture setup so the current `PROJECT_MAP.md` projection is
   isolated dynamically; keep validator semantics unchanged.
4. Run focused, control-plane, lifecycle, and diff-integrity checks.
5. Perform read-only Critic, Review, Verification, and Drift assurance on the
   frozen candidate.
6. Commit and publish the exact non-default subject candidate; stop for Owner
   integration. Do not merge, deploy, or mutate default/protected branches.

## Exact write-set

```text
scripts/test-release-state-contracts.py
docs/specs/WB-2026-09-09-release-state-fixture-isolation.md
docs/plans/WB-2026-09-09-release-state-fixture-isolation.md
docs/tasklist/WB-2026-09-09-release-state-fixture-isolation.tasklist.md
docs/reports/requirements/WB-2026-09-09-release-state-fixture-isolation.md
docs/reports/critic/WB-2026-09-09-release-state-fixture-isolation.md
docs/reports/reviews/WB-2026-09-09-release-state-fixture-isolation.md
docs/reports/verification/WB-2026-09-09-release-state-fixture-isolation.md
docs/reports/drift/WB-2026-09-09-release-state-fixture-isolation.md
docs/reports/closeout/WB-2026-09-09-release-state-fixture-isolation.md
.agent/active-work-block.json
FILE_REGISTRY.yml
PROJECT_MAP.md
```

## Out of scope

Production application behavior, route or sitemap reconciliation, deployment
configuration, dependencies, database/schema, secrets, unrelated lifecycle
semantics, `feat/wb-crawl-indexation-reconciliation-025`,
`feat/scoped-worker-session-recovery-reconciled-024`, and unrelated dirty
multilingual artifacts remain untouched.
