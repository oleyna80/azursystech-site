# Work Block Plan — Complete English Translation and Localization

## Metadata

- **Work Block:** `WB-2026-08-24-english-translation-completion`
- **Governance profile:** Managed
- **Side-effect class:** application source write (`web/**`)
- **DB action mode:** none
- **Owner approval:** 2026-08-24 conversation confirmation
- **Specification:** `docs/specs/WB-2026-08-24-english-translation-completion.md` (`v3`)
- **Baseline:** `68b15d51a0dd5c3d5bc3929e9ee9aa36b3999f73`
- **Evaluation:** not required; deterministic UI copy, route, and unit test contracts only

## Scope and Write-Set

```text
web/src/i18n.js
web/src/proxy.ts
web/src/app/layout.tsx
web/src/app/fonts/Geist-Variable.woff2
web/src/app/fonts/GeistMono-Variable.woff2
web/src/app/fonts/OFL.txt
web/src/app/[locale]/_home-data.ts
web/src/app/[locale]/page.tsx
web/src/app/[locale]/ai-automation/_ai-automation-data.ts
web/src/app/[locale]/ai-automation/page.tsx
web/src/app/ai-automation/page.tsx
web/src/components/shell/site-header.tsx
web/src/components/shell/site-header.test.ts
web/src/components/shell/site-footer.tsx
web/src/lib/brief-submit.ts
web/src/lib/brief-assistant.ts
web/src/app/brief/page.tsx
web/src/components/brief/brief-field.tsx
web/src/components/brief/brief-progress.tsx
web/src/components/brief/brief-form.tsx
web/src/app/api/brief/submit/route.ts
web/src/app/legal/page.tsx
web/src/app/privacy/page.tsx
web/src/app/terms/page.tsx
web/src/app/thank-you/page.tsx
web/src/app/data-deletion/page.tsx
web/src/lib/portfolio-data.ts
web/src/lib/portfolio-data.test.ts
web/src/components/portfolio/portfolio-card.tsx
web/src/components/sections/portfolio-section.tsx
web/src/app/portfolio/page.tsx
web/src/app/portfolio/[slug]/page.tsx
web/src/app/[locale]/_home-data.test.ts
web/src/app/[locale]/page.test.ts
web/src/lib/brief-submit.test.ts
web/src/app/api/brief/submit/route.test.ts
web/src/lib/api-security.test.ts
docs/specs/WB-2026-08-24-english-translation-completion.md
docs/plans/WB-2026-08-24-english-translation-completion.md
docs/tasklist/WB-2026-08-24-english-translation-completion.tasklist.md
docs/reports/requirements-quality-WB-2026-08-24-english-translation-completion.md
docs/reports/traceability-WB-2026-08-24-english-translation-completion.md
docs/reports/critic-WB-2026-08-24-english-translation-completion.md
docs/reports/review-WB-2026-08-24-english-translation-completion.md
docs/reports/verification-WB-2026-08-24-english-translation-completion.md
.agent/active-work-block.json
.agent/critic-gate.md
.agent/verification-gate.md
.codex/write-gate.md
```

## Plan Tasks

| ID | Type | Owner | Paths | Acceptance link | Status |
|---|---|---|---|---|---|
| TASK-001 | documentation | Orchestrator | spec, plan, tasklist, active gate | AC-001–AC-008 | done |
| TASK-002 | assurance | Orchestrator | requirements-quality report | REQ-001, AC-001 | done |
| TASK-003 | assurance | Orchestrator | traceability/consistency report | REQ-001–REQ-008, AC-001–AC-008 | done |
| TASK-004 | assurance | Critic | critic report, gate | AC-001–AC-008 | done |
| TASK-005 | requirement | Scoped Coder | web/src/i18n.js | AC-001 | done |
| TASK-006 | requirement | Scoped Coder | web/src/app/[locale]/_home-data.ts, page.tsx | AC-002 | done |
| TASK-007 | requirement | Scoped Coder | web/src/components/shell/** | AC-003 | done |
| TASK-008 | requirement | Scoped Coder | web/src/lib/brief-submit.ts, brief/** | AC-004 | done |
| TASK-009 | requirement | Scoped Coder | web/src/app/legal, privacy, terms, etc. | AC-005 | done |
| TASK-010 | requirement | Scoped Coder | web/src/lib/portfolio-data.ts, portfolio/** | AC-006 | done |
| TASK-011 | requirement | Scoped Coder | web/src/app/[locale]/*.test.ts, web/src/lib/portfolio-data.test.ts, web/src/components/shell/site-header.test.ts | AC-003, AC-007 | done |
| TASK-012 | assurance | Reviewer | review report | AC-008 | done |
| TASK-013 | requirement | Verifier | verification report, active gate | AC-008 | done |
| TASK-014 | requirement | Scoped Coder | web/src/proxy.ts, page.tsx, brief/page.tsx | AC-003, AC-004 | done |
| TASK-015 | requirement | Scoped Coder | brief-field.tsx, brief-progress.tsx | AC-004 | done |
| TASK-016 | requirement | Scoped Coder | web/src/app/layout.tsx | AC-003, AC-005 | done |
| TASK-017 | requirement | Scoped Coder | site-header.tsx | AC-003, AC-005 | done |
| TASK-018 | requirement | Scoped Coder | brief-submit.test.ts, route.test.ts, api-security.test.ts | AC-007 | done |
| TASK-019 | requirement | Scoped Coder | `web/src/app/fonts/**`, `web/src/app/layout.tsx` | AC-008 | done; build verification pending isolated workspace |
