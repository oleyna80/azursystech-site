## Codex Critic Report - WB-2026-07-22-en-home-contact-surface

**Date:** 2026-07-22
**Reviewed:** Stage 0 Routing Preflight and current source/diff
**Mode:** fallback-same-session
**Verdict:** SUPPLEMENT

### Findings

| Severity | Dimension | Finding | Evidence | Recommendation |
|---|---|---|---|---|
| medium | Scope | The existing English home page intentionally suppresses the contact section. | `web/src/app/[locale]/page.tsx` renders `HomeContactSection` only when `!isEnglish`. | Replace that condition; do not add a second form or route. |
| medium | Scope | The shared form accepts only `fr` and `ru`, so rendering it for `/en` would fail type/copy coverage. | `web/src/components/sections/home-contact.tsx` defines `ContactLocale = "fr" \| "ru"` and has no English `CONTACT_COPY` entry. | Add the `en` copy to the existing component and extend the locale union. |
| medium | Navigation | English header and FAQ conversion links currently bypass the suppressed section. | `web/src/components/shell/site-header.tsx` omits an English contact link; the FAQ CTA uses WhatsApp for English. | Add `Contact` → `/en#contact` to the EN header and route the EN FAQ CTA to the local anchor. |
| medium | Verification | A source-only assertion would not prove the English user-visible surface. | The page has no dedicated home-page render test and the form is a client component. | Add a focused component-copy contract test and run a browser smoke at desktop and mobile widths without submitting. |
| low | Boundary | The component and page already contain unrelated, uncommitted contact/SEO changes. | Scoped `git diff` shows the prior repair-service removal and local-SEO removal. | Preserve all existing hunks; change only the EN render condition and EN copy. |

### Required Orchestrator Response

- Adopted: source write-set is limited to `web/src/app/[locale]/page.tsx`, `web/src/components/sections/home-contact.tsx`, `web/src/components/shell/site-header.tsx`, and `web/src/components/sections/home-contact.test.ts`.
- Adopted: API route, submission client, delivery integration, environment, database, provider calls, legacy-route deletion, and `web/src/i18n.js` are excluded.
- Adopted: no form submission is permitted during verification; browser checks inspect rendering and controls only.
- Adopted: preserve ambient dirty hunks in the two source files.

### Critic-Approved Write-Set

- `.agent/critic-gate.md`
- `.agent/verification-gate.md`
- `.codex/write-gate.md`
- `docs/plans/WB-2026-07-22-en-home-contact-surface.md`
- `docs/tasklist/WB-2026-07-22-en-home-contact-surface.tasklist.md`
- `docs/reports/critic-WB-2026-07-22-en-home-contact-surface.md`
- `docs/reports/WB-2026-07-22-en-home-contact-surface-verification.md`
- `memory_bank/orchestrator-log.md`
- `memory_bank/review-log.md`
- `memory_bank/context.md`
- `memory_bank/progress.md`
- `memory_bank/decisions.md`
- `web/src/app/[locale]/page.tsx`
- `web/src/components/sections/home-contact.tsx`
- `web/src/components/sections/home-contact.test.ts`
- `web/src/components/shell/site-header.tsx`

### Inspection Gaps

- Native critic dispatch was unavailable because the current session had reached its agent-thread limit. This is recorded as `review-degraded:inline-fallback`; an Architecture Analyst remains a separate read-only advisory review.
- Delivery readiness is intentionally uninspected here. The previously observed `integration_not_ready` condition belongs to the separately approved diagnostic Work Block.
