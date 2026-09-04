---
schema_version: 1
artifact_type: work_block_plan
work_block_id: WB-2026-09-04-nice-seo-handoff-reconciliation
status: completed
specification: docs/specs/WB-2026-09-04-nice-seo-handoff-reconciliation.md
specification_revision: 34757785d223ad9a4a612e02d128ecfce1add2de
---

# Plan — Nice / SEO Handoff Reconciliation

1. Verify exact repository/base/worktree preflight.
2. Compare both branch refs to `origin/main` using ancestry and unique commits.
3. Inspect branch-local lifecycle JSON and relevant plan/tasklist/closeout evidence.
4. Correlate merged PRs and canonical worktree ownership.
5. Produce branch-by-branch disposition and bounded future WB recommendations.
6. Run Review, Verification, Drift, traceability, release-state, and diff checks.
7. Close lifecycle state inactive; stop before any merge, deletion, commit, or push.
