# WB-2026-08-24-creation-site-internet-nice — Traceable tasklist

> SSOT for the approved Define package and implementation write-set.

## Stage 0 — Define

- [x] TASK-001 [type=documentation] [req=-] [ac=-] [paths=docs/specs/WB-2026-08-24-creation-site-internet-nice.md,docs/plans/WB-2026-08-24-creation-site-internet-nice.md,docs/plans/WB-2026-08-24-creation-site-internet-nice-design-brief.md,docs/tasklist/WB-2026-08-24-creation-site-internet-nice.tasklist.md,.agent/active-work-block.json] Record the new Managed Work Block scope, confirmed baseline, design direction, and lifecycle transition.
- [x] TASK-002 [type=assurance] [req=-] [ac=-] [paths=docs/reports/requirements-quality-WB-2026-08-24-creation-site-internet-nice.md,docs/reports/traceability-WB-2026-08-24-creation-site-internet-nice.md,docs/reports/consistency-WB-2026-08-24-creation-site-internet-nice.md] Complete requirements-quality, structural traceability, and read-only consistency analysis.
- [x] TASK-003 [type=assurance] [req=-] [ac=-] [paths=docs/reports/critic-WB-2026-08-24-creation-site-internet-nice.md,.agent/critic-gate.md,.codex/write-gate.md] Complete the Managed Critic challenge and open the source Write Gate only after Define evidence is READY.

## Stage 1 — Execute

- [x] TASK-010 [type=requirement] [req=REQ-001,REQ-002,REQ-003,REQ-004] [ac=AC-001,AC-002,AC-003,AC-004,AC-005,AC-006,AC-007,AC-008] [paths=web/src/app/*/creation-site-internet-nice/_creation-site-data.ts,web/src/app/*/creation-site-internet-nice/page.tsx,web/src/app/*/creation-site-internet-nice/page.test.ts] Implement the three localized service pages, metadata, visible content, internal page links, and parity-bound JSON-LD.
- [x] TASK-011 [type=requirement] [req=REQ-005] [ac=AC-009,AC-010] [paths=web/src/app/*/_home-data.ts,web/src/app/*/page.tsx,web/src/components/shell/site-header.tsx,web/src/components/shell/site-header.test.ts,web/src/components/shell/site-footer.tsx,web/src/components/shell/site-footer.test.ts] Add localized discovery links from homepage/header/footer and test link localization.
- [x] TASK-012 [type=requirement] [req=REQ-006] [ac=AC-011] [paths=web/src/app/sitemap.ts,web/src/app/sitemap.test.ts] Add exactly the three canonical Nice URLs to the sitemap and regression-test the inventory.
- [x] TASK-013 [type=requirement] [req=REQ-007] [ac=AC-012,AC-013,AC-014] [paths=web/src/app/*/creation-site-internet-nice/page.test.ts,web/src/components/shell/site-header.test.ts,web/src/components/shell/site-footer.test.ts,web/src/app/sitemap.test.ts] Maintain focused regression coverage for the approved route/link/schema contract and required assurance commands.

## Stage 2 — Assure

- [x] TASK-020 [type=assurance] [req=-] [ac=-] [paths=docs/reports/review-WB-2026-08-24-creation-site-internet-nice.md] Read-only review of the frozen implementation diff.
- [x] TASK-021 [type=assurance] [req=REQ-007] [ac=AC-012,AC-013,AC-014] [paths=docs/reports/verification-WB-2026-08-24-creation-site-internet-nice.md,.agent/verification-gate.md] Run focused tests, Crash Test Gate, full required checks, and record reproducible evidence.
- [x] TASK-022 [type=assurance] [req=-] [ac=-] [paths=docs/reports/drift-WB-2026-08-24-creation-site-internet-nice.md] Verify specification, content source, code, tests, and sitemap remain synchronized.

## Stage 3 — Close

- [ ] TASK-030 [type=documentation] [req=-] [ac=-] [paths=docs/reports/closeout-WB-2026-08-24-creation-site-internet-nice.md,.agent/active-work-block.json,.agent/verification-gate.md,.codex/write-gate.md,.agent/workflows/owner-controlled-github-flow.md] Freeze the exact local HEAD, prepare Owner publication handoff, and stop before commit/push unless separately authorized.

## Dependencies

Stage 1 implementation depends on the completed Stage 0 Define gate.
Stage 2 review depends on all Stage 1 implementation and regression tasks.
Stage 2 verification depends on the completed read-only review.
Stage 2 drift check depends on review and verification evidence.
Stage 3 closeout depends on the completed Stage 2 assurance package.

## Pre-execution validation

```bash
python3 scripts/validate-define-traceability.py \
  --spec docs/specs/WB-2026-08-24-creation-site-internet-nice.md \
  --tasks docs/tasklist/WB-2026-08-24-creation-site-internet-nice.tasklist.md \
  --json
```
