---
schema_version: 1
artifact_type: tasklist
work_block_id: WB-2026-09-09-crawl-indexation-reconciliation
specification: docs/specs/WB-2026-09-09-crawl-indexation-reconciliation.md
status: completed
---

# Tasklist — Crawl / Indexation Reconciliation

- [x] TASK-001 [type=requirement] [req=REQ-001] [ac=AC-001] [paths=docs/reports/verification/WB-2026-09-09-crawl-indexation-reconciliation.md] Establish exact source baseline, deployment workflow provenance, and observable production revision evidence.
- [x] TASK-002 [type=requirement] [req=REQ-002] [ac=AC-002] [paths=docs/reports/verification/WB-2026-09-09-crawl-indexation-reconciliation.md] Re-check P0 sitemap, localized, legacy, internal-link, demo, and brief boundary findings.
- [x] TASK-003 [type=requirement] [req=REQ-003] [ac=AC-003] [paths=web/src/app/data-deletion/page.tsx,web/src/app/legal/page.tsx,web/src/app/privacy/page.tsx,web/src/app/terms/page.tsx,docs/reports/verification/WB-2026-09-09-crawl-indexation-reconciliation.md] Add only the four proven self-canonical metadata corrections and record the exact Owner deployment boundary.
- [x] TASK-004 [type=requirement] [req=REQ-004] [ac=AC-004] [paths=docs/reports/verification/WB-2026-09-09-crawl-indexation-reconciliation.md] Execute source and production crawl/route/sitemap/redirect/canonical assertions.
- [x] TASK-005 [type=requirement] [req=REQ-005] [ac=AC-005] [paths=docs/reports/closeout/WB-2026-09-09-crawl-indexation-reconciliation.md] Preserve all exclusions and complete lifecycle closeout without merge, deploy, or default-branch mutation.
- [x] TASK-006 [type=assurance] [req=-] [ac=-] [paths=docs/reports/critic/WB-2026-09-09-crawl-indexation-reconciliation.md,docs/reports/reviews/WB-2026-09-09-crawl-indexation-reconciliation.md,docs/reports/drift/WB-2026-09-09-crawl-indexation-reconciliation.md] Complete independent assurance records.

## Expected final result

An evidence-backed candidate distinguishes correct canonical source from stale
production runtime, contains no speculative application fix, and leaves the
Owner with the exact immutable source revision and deployment action required
before a post-deploy crawl can pass.

## Dependencies

Dependency order follows the numbered evidence sequence; the assurance task
reviews the frozen evidence and candidate before closeout.
