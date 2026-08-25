# WB-2026-08-25-automatiser-demandes-clients-guide — Traceable tasklist

## Stage 0 — Define

- [x] TASK-001 [type=documentation] [req=-] [ac=-] [paths=docs/specs/WB-2026-08-25-automatiser-demandes-clients-guide.md,docs/plans/WB-2026-08-25-automatiser-demandes-clients-guide.md,docs/plans/WB-2026-08-25-automatiser-demandes-clients-guide-design-brief.md,docs/tasklist/WB-2026-08-25-automatiser-demandes-clients-guide.tasklist.md,.agent/active-work-block.json] Record the new Work Block, baseline, content and lifecycle transition.
- [x] TASK-002 [type=assurance] [req=-] [ac=-] [paths=docs/reports/requirements-quality-WB-2026-08-25-automatiser-demandes-clients-guide.md,docs/reports/traceability-WB-2026-08-25-automatiser-demandes-clients-guide.md,docs/reports/consistency-WB-2026-08-25-automatiser-demandes-clients-guide.md] Complete requirements-quality, traceability and consistency analysis.
- [x] TASK-003 [type=assurance] [req=-] [ac=-] [paths=docs/reports/critic-WB-2026-08-25-automatiser-demandes-clients-guide.md,.agent/critic-gate.md,.codex/write-gate.md] Complete the Critic challenge and open the source Write Gate after Define evidence is READY.

## Stage 1 — Execute

- [x] TASK-010 [type=requirement] [req=REQ-001,REQ-002,REQ-003,REQ-004,REQ-005,REQ-006,REQ-007] [ac=AC-001,AC-002,AC-003,AC-004,AC-005,AC-006,AC-007] [paths=web/src/app/*/guides/automatiser-demandes-clients/_guide-data.ts,web/src/app/*/guides/automatiser-demandes-clients/page.tsx,web/src/app/*/guides/automatiser-demandes-clients/page.test.ts] Implement the three localized guide routes, visible content, metadata, FAQ and JSON-LD parity.
- [x] TASK-011 [type=requirement] [req=REQ-008] [ac=AC-008] [paths=web/src/app/*/creation-site-internet-nice/_creation-site-data.ts,web/src/app/*/creation-site-internet-nice/page.tsx,web/src/app/*/creation-site-internet-nice/page.test.ts,web/src/app/*/ai-automation/_ai-automation-data.ts,web/src/app/*/ai-automation/page.tsx,web/src/app/*/ai-automation/page.test.ts] Add two localized contextual reverse links and regressions.
- [x] TASK-012 [type=requirement] [req=REQ-009] [ac=AC-009] [paths=web/src/app/sitemap.ts,web/src/app/sitemap.test.ts] Add exactly three canonical guide URLs and inventory tests.
- [x] TASK-013 [type=requirement] [req=REQ-010,REQ-011] [ac=AC-010,AC-011,AC-012] [paths=web/src/app/*/guides/automatiser-demandes-clients/page.test.ts,web/src/app/*/creation-site-internet-nice/page.test.ts,web/src/app/*/ai-automation/page.test.ts,web/src/app/sitemap.test.ts] Maintain focused regression and prohibited-claim checks.

## Stage 2 — Assure

- [x] TASK-020 [type=assurance] [req=-] [ac=-] [paths=docs/reports/review-WB-2026-08-25-automatiser-demandes-clients-guide.md] Perform read-only review of the frozen diff.
- [x] TASK-021 [type=assurance] [req=REQ-010] [ac=AC-010,AC-012] [paths=docs/reports/verification-WB-2026-08-25-automatiser-demandes-clients-guide.md,.agent/verification-gate.md] Run focused tests, Crash Test Gate and required assurance commands.
- [x] TASK-022 [type=assurance] [req=-] [ac=-] [paths=docs/reports/drift-WB-2026-08-25-automatiser-demandes-clients-guide.md] Verify specification, source, tests, sitemap and approved write-set remain synchronized.

## Stage 3 — Close

- [ ] TASK-030 [type=documentation] [req=-] [ac=-] [paths=docs/reports/closeout-WB-2026-08-25-automatiser-demandes-clients-guide.md,.agent/active-work-block.json,.agent/verification-gate.md,.codex/write-gate.md,.agent/workflows/owner-controlled-github-flow.md] Freeze exact local HEAD and prepare Owner publication handoff.

## Dependencies

Stage 1 depends on Define READY. Stage 2 depends on implementation. Stage 3 depends on completed assurance and remains publication-handoff-only.

## Pre-execution validation

```bash
python3 scripts/validate-define-traceability.py --spec docs/specs/WB-2026-08-25-automatiser-demandes-clients-guide.md --tasks docs/tasklist/WB-2026-08-25-automatiser-demandes-clients-guide.tasklist.md --json
```
