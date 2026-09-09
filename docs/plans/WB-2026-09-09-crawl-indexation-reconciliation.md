---
schema_version: 1
artifact_type: work_block
work_block_id: WB-2026-09-09-crawl-indexation-reconciliation
status: completed
specification: docs/specs/WB-2026-09-09-crawl-indexation-reconciliation.md
---

# Plan — Crawl / Indexation Reconciliation

1. Freeze exact `origin/main` and inspect current production/deployment evidence.
2. Compare canonical route, sitemap, redirect, internal-link, and metadata
   behavior with the September 3 P0 findings.
3. Run source tests and the route/sitemap crash-test gate in an isolated
   subject worktree; modify source only if a current source defect is proven.
4. Run read-only production crawl assertions and record the release/deployment
   boundary if the live runtime is stale.
5. Complete Critic, Review, Verification, Drift, and Close documentation with
   an honest reporting-only result when production cannot be reconciled here.
6. Commit and publish only the exact non-default subject candidate if all
   assurance and write-gate conditions permit it; never deploy or merge.

## Write-set

```text
docs/specs/WB-2026-09-09-crawl-indexation-reconciliation.md
docs/plans/WB-2026-09-09-crawl-indexation-reconciliation.md
docs/tasklist/WB-2026-09-09-crawl-indexation-reconciliation.tasklist.md
docs/reports/requirements/WB-2026-09-09-crawl-indexation-reconciliation.md
docs/reports/critic/WB-2026-09-09-crawl-indexation-reconciliation.md
docs/reports/reviews/WB-2026-09-09-crawl-indexation-reconciliation.md
docs/reports/verification/WB-2026-09-09-crawl-indexation-reconciliation.md
docs/reports/drift/WB-2026-09-09-crawl-indexation-reconciliation.md
docs/reports/closeout/WB-2026-09-09-crawl-indexation-reconciliation.md
.agent/active-work-block.json
FILE_REGISTRY.yml
PROJECT_MAP.md
web/src/app/data-deletion/page.tsx
web/src/app/legal/page.tsx
web/src/app/privacy/page.tsx
web/src/app/terms/page.tsx
```

Application source is limited to the four sitemap-listed pages proven to lack
self-canonical metadata. Deployment files, lessons, database, secrets, and the
separate control-plane branch are outside the write-set. Registry/map edits are
limited to active/completed lifecycle projection fields.

## Final State

- **Stage state:** completed
- **Review gate:** READY
- **Verification verdict:** READY
- **Evaluation verdict:** SKIPPED — deterministic route and sitemap evidence has no generative or rubric-based deliverable
- **Drift gate:** ALIGNED
- **Task status:** completed
- **Closeout mode:** success-closeout
