# Codex Critic Report — WB-2026-07-22-english-core-implementation

**Date:** 2026-07-22
**Mode:** native-subagent, read-only advisory review
**Reviewed:** refreshed Stage 0 preflight, English-core plan, live locale shell,
metadata, sitemap, and current dirty worktree
**Verdict:** SUPPLEMENT — adopted before Stage 1

## Findings and adopted response

| Severity | Dimension | Finding | Evidence | Orchestrator response |
| --- | --- | --- | --- | --- |
| Must | Shell contract | A nested locale layout cannot set the root document language. | `web/src/app/layout.tsx` owns `<html>`; `[locale]/layout.tsx` renders only children. | Add `web/src/proxy.ts` and pass a validated URL locale in a request-only header; the root layout reads it before the FR/RU cookie fallback. |
| Must | Scope | EN would otherwise expose the FR/RU-only contact, chat, brief, and secondary-page surfaces. | Home contact accepts only FR/RU; chat and several CTAs use unlocalized routes. | First EN slice is information-only: suppress chat/contact/showcase/portfolio surfaces for EN and route EN primary CTAs only to the existing WhatsApp channel. No contact, chat, API, or provider source is changed. |
| Must | SEO | Structured data and metadata contain obsolete local IT/support claims and EN needs an explicit contract. | Home JSON-LD has network/local-support services; AI JSON-LD names `/contact`. | Use current web/site/AI-automation services only; EN metadata has canonical, three localized `hreflang` values, and French `x-default`; no EN-only unimplemented conversion endpoint. |
| Should | Regression proof | Existing tests cover only FR/RU home and sitemap assertions. | `_home-data.test.ts`, `sitemap.test.ts`. | Extend content/sitemap tests and add focused home/AI metadata tests; browser verification will check direct SSR, language switching, and both viewports. |
| Must | Dirty baseline | The localized home page already contains an unrelated local-SEO removal. | Current worktree has a dirty `web/src/app/[locale]/page.tsx`. | Coder preserves that delta intact and does not claim ownership of it; verification records it as an ambient baseline. |

## Approved write-set

- .agent/critic-gate.md
- .agent/verification-gate.md
- .codex/write-gate.md
- docs/plans/WB-2026-07-22-english-core-launch-spec.md
- docs/tasklist/WB-2026-07-22-english-core-launch-spec.tasklist.md
- docs/reports/WB-2026-07-22-english-core-implementation-critic.md
- docs/reports/WB-2026-07-22-english-core-implementation-verification.md
- memory_bank/orchestrator-log.md
- memory_bank/review-log.md
- memory_bank/context.md
- memory_bank/progress.md
- memory_bank/decisions.md
- web/src/proxy.ts
- web/src/app/layout.tsx
- web/src/app/[locale]/layout.tsx
- web/src/app/[locale]/_home-data.ts
- web/src/app/[locale]/_home-data.test.ts
- web/src/app/[locale]/page.tsx
- web/src/app/[locale]/page.test.ts
- web/src/app/[locale]/ai-automation/page.tsx
- web/src/app/[locale]/ai-automation/page.test.ts
- web/src/components/shell/site-header.tsx
- web/src/components/shell/site-footer.tsx
- web/src/app/sitemap.ts
- web/src/app/sitemap.test.ts

## Routing and verification

- Work Block type: production English localization core and public product
  positioning.
- Side-effect class: production code write plus local test/docs artifacts.
- DB action mode: none.
- Hard Stops: none. No deploy, provider call, credential, external message,
  staging, commit, or push is allowed.
- Topology: Subagent-Required. One Scoped Coder implements; a read-only native
  Verifier supplies advisory evidence; Control Tower runs the independent
  readonly-root formal verification after the diff is frozen.
- Tier: standard. `proxy.ts` changes only a non-API locale request branch;
  API CORS behavior remains isolated and must be source-reviewed. Sensitive
  Domains is `none`; the stronger `independent-readonly-root` remains required
  for formal closure because this is a broad public-route change.

## Inspection gaps

No English editorial stakeholder supplied fixed wording. The approved plan
authorizes native English editorialization from the current FR/RU core and the
current product-positioning decision; Coder must not use legacy `i18n.js` EN
copy as a source.
