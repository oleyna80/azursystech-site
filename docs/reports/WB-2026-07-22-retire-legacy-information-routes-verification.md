# Verification Report — WB-2026-07-22 Retire Legacy Information Routes

## Verdict

`READY` — `review-degraded:inline-fallback`.

The Work Block is non-sensitive and requires `same-session-degraded`
isolation. The native read-only Verifier could not be dispatched because the
runtime rejected it at `thread-limit`; Control Tower completed the narrowest
read-only fallback against the frozen local implementation. This is recorded
as degraded verification, not as independent isolation.

## Acceptance evidence

| Contract | Result | Evidence |
|---|---|---|
| Legacy route files are gone | PASS | `about/page.tsx`, `pricing/page.tsx`, and `faq/page.tsx` are deleted; no redirect source was introduced. |
| Sitemap excludes retired URLs | PASS | Focused `npm run test:ci -- src/app/sitemap.test.ts`: 2/2 tests pass; live `/sitemap.xml` contains none of `/about`, `/pricing`, `/faq`. |
| Six retired routes return 404 | PASS | Local `:3000` returned `404` for `/about`, `/pricing`, `/faq`, `/en/about`, `/en/pricing`, and `/en/faq`. |
| Remaining sitemap routes work | PASS | 21 live sitemap paths: 20 returned `200`; `/ai-automation` returned its expected `308`. |
| Localized links and anchors work | PASS | Browser snapshot of `/fr` showed footer `Tarifs`=`/fr#pricing` and `FAQ`=`/fr#faq`; `/ru` showed `Цены`=`/ru#pricing` and `FAQ`=`/ru#faq`. Browser DOM evaluation confirmed `#pricing` and `#faq` exist. |
| No active stale source link | PASS | Targeted `rg` over `web/src` found no root `/about`, `/pricing`, or `/faq` link/route declaration outside deleted pages. |
| Quality checks | PASS | `git diff --check`, TypeScript, and production build passed. Lint passed with 0 errors and 5 existing `no-img-element` warnings outside this WB. |
| Runtime errors | PASS | Playwright console on `/ru` reported 0 errors and 0 warnings after route/link smoke. |

## Commands run

- `git diff --check`
- `npm run test:ci -- src/app/sitemap.test.ts`
- `npm run lint`
- `npm run check:types`
- `npm run build`
- Local curl status smoke for the six retired URLs and `/sitemap.xml`
- Local sitemap status matrix using `fetch` against `http://localhost:3000`
- Playwright browser snapshot/find/eval/console smoke for `/fr` and `/ru`

## Scope and safety

The implementation stayed within the seven approved source paths. The working
tree contained extensive ambient changes before this WB; none were restored,
staged, committed, or otherwise altered. No form was submitted and no DB,
provider, email, credentials, deployment, or external service was accessed.

## Remaining risk

The only process risk is the unavailable native Verifier caused by the active
thread limit. It does not invalidate the non-sensitive same-session evidence,
but should be cleared before relying on a future independent-verifier
requirement. No commit or release action is authorized by this report.
