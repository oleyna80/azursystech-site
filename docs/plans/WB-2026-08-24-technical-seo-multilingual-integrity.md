# WB-2026-08-24-technical-seo-multilingual-integrity — Implementation plan

## Decision

Use locale-prefixed App Router pages as the sole portfolio renderers. Replace the two legacy portfolio renderers with server-side permanent redirects. Keep the already-configured legacy AI redirect in `web/next.config.ts` as the single redirect authority and add regression coverage for that contract.

This is the smallest sufficient change: it removes query/cookie-dependent indexability without new dependencies, proxy policy, content migration, or duplicate redirect configuration.

## Implementation sequence

1. Add localized index and detail pages under `web/src/app/[locale]/portfolio/`; derive visible portfolio locale from `params`, preserve the existing data/components, and generate `fr`/`ru`/`en` static paths.
2. Generate self canonical and `fr`, `ru`, `en`, `x-default` alternates for each localized index/detail route; use French for `x-default`.
3. Convert `web/src/app/portfolio/page.tsx` and `web/src/app/portfolio/[slug]/page.tsx` into permanent redirect-only aliases. Valid legacy `locale` query values are preserved in the destination; all other values use French.
4. Change only routing props/hrefs in the localized home, portfolio card/section, header, and footer. Extend language switching for canonical portfolio paths.
5. Generate sitemap portfolio entries from locales and the authoritative portfolio slug list; remove redirect aliases and the global synthetic last-modified value.
6. Add focused tests for metadata, legacy redirects, every portfolio-link producer (localized home CTA, card, header, footer), localized switching, sitemap inventory, and localized AI metadata; then freeze the diff for independent review and verification.

## Execution authority and capability snapshot

- One Coder owns every application and test path in this approved write-set. No parallel writer is authorized.
- Critic, Reviewer, and Verifier are read-only. Their available isolation is a separate role within this managed session, recorded as `same-session-degraded`; it is advisory rather than an independent root.
- The application uses the existing Next.js App Router, Vitest, TypeScript, sitemap facility, and redirect APIs. No new runtime, tool, browser-test framework, or SEO dependency is admitted.
- Functional bindings are fixed: localized portfolio pages bind path `params` to portfolio data and metadata; legacy portfolio pages bind legacy `searchParams.locale` to a permanent redirect; `web/next.config.ts` remains the only binding for the legacy AI redirect; sitemap binds locale and existing slug inventory to canonical URLs.

## Stop, rollback, and external hard-stop policy

- Stop and return to Define if the current route contract, test result, metadata topology, scope, or approved write-set must change. Do not add a fallback that weakens redirect, metadata, or assurance evidence.
- Commit, push, merge, deployment/restart, credential/secrets changes, dependency/config changes, database mutation/migration, payment/data changes, destructive Git operations, and production access are outside this authorization.
- Rollback is limited to inspection of the known local candidate diff. It does not authorize `reset`, `clean`, checkout/revert of unknown work, deletion, or remote mutation.

## Approved write-set

### Application and test files

- `web/src/app/[locale]/portfolio/page.tsx` (new)
- `web/src/app/[locale]/portfolio/[slug]/page.tsx` (new)
- `web/src/app/[locale]/portfolio/page.test.ts` (new)
- `web/src/app/[locale]/portfolio/[slug]/page.test.ts` (new)
- `web/src/app/portfolio/page.tsx`
- `web/src/app/portfolio/[slug]/page.tsx`
- `web/src/app/portfolio/page.test.ts` (new)
- `web/src/app/portfolio/[slug]/page.test.ts` (new)
- `web/src/app/ai-automation/legacy-redirect.test.ts` (new)
- `web/src/app/[locale]/page.tsx`
- `web/src/components/portfolio/portfolio-card.tsx`
- `web/src/components/sections/portfolio-section.tsx`
- `web/src/components/shell/site-header.tsx`
- `web/src/components/shell/site-header.test.ts`
- `web/src/components/shell/site-footer.tsx`
- `web/src/components/shell/site-footer.test.ts` (new)
- `web/src/components/portfolio/portfolio-card.test.ts` (new)
- `web/src/components/sections/portfolio-section.test.ts` (new)
- `web/src/app/sitemap.ts`
- `web/src/app/sitemap.test.ts`
- `web/src/app/[locale]/ai-automation/page.test.ts`

### Lifecycle and assurance artifacts

- `.agent/active-work-block.json`
- `.agent/critic-gate.md`
- `.agent/verification-gate.md`
- `.codex/write-gate.md`
- `docs/specs/WB-2026-08-24-technical-seo-multilingual-integrity.md`
- `docs/plans/WB-2026-08-24-technical-seo-multilingual-integrity.md`
- `docs/tasklist/WB-2026-08-24-technical-seo-multilingual-integrity.tasklist.md`
- `docs/reports/requirements-quality-WB-2026-08-24-technical-seo-multilingual-integrity.md`
- `docs/reports/traceability-WB-2026-08-24-technical-seo-multilingual-integrity.md`
- `docs/reports/critic-WB-2026-08-24-technical-seo-multilingual-integrity.md`
- `docs/reports/review-WB-2026-08-24-technical-seo-multilingual-integrity.md`
- `docs/reports/verification-WB-2026-08-24-technical-seo-multilingual-integrity.md`

## Explicit exclusions

`web/next.config.ts`, proxy locale policy, portfolio data/translations, visual components/styles, external dependencies, deployment configuration, and all routes outside this specification are excluded unless a Define-stage return is approved.

## Verification plan

Run focused Vitest files after implementation, including all link producers and the existing localized AI metadata test for `fr`, `ru`, and `en`; then run `npm run test:ci`, `npm run check:types`, and `npm run build` in `web/`.

The mandatory Crash Test Gate uses an active local **development** server. It records the sitemap result; 200 for canonical localized portfolio/AI URLs; 308 for legacy portfolio and AI aliases; 404 for a genuinely nonexistent canonical portfolio slug; header/footer/card/home-anchor targets; affected Vitest files; and clean server logs without unhandled or hydration errors. A separate production-mode smoke check is optional additional evidence, not a substitute for the gate.

The target sitemap inventory is: `/fr`, `/ru`, `/en`; the three localized AI URLs; existing direct/indexable utility URLs `/brief`, `/data-deletion`, `/legal`, `/privacy`, `/terms`; three localized portfolio indexes; and each existing portfolio slug once under each locale. Tests prove the inventory contains no query URL or redirect alias (`/ai-automation`, `/portfolio`, and `/portfolio/*`) and no synthetic global `lastModified` value.
