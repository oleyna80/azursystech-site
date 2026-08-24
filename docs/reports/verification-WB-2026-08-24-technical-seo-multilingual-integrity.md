# Verification — WB-2026-08-24-technical-seo-multilingual-integrity

- **Stage:** 2 — Assure
- **Role:** Verifier (read-only, `same-session-degraded`)
- **Subject:** local worktree on `feat/technical-seo-multilingual-integrity`, base `d647f6ab1bf6dc40cdcde09d7e4cc554ad31882d`
- **Verdict:** `READY` / all acceptance criteria `PASS`
- **Verified at:** 2026-08-24T20:49:35+02:00

## Acceptance evidence

| Criteria | Result | Reproducible evidence |
| --- | --- | --- |
| AC-001–AC-003 | PASS | Localized index/detail source uses only path locale, generates 3 index and 18 detail static params, retains existing portfolio data and UI. |
| AC-004–AC-006 | PASS | Focused metadata tests and live `/fr/portfolio` response prove self-canonical and `fr`, `ru`, `en`, French `x-default` locale-path alternates. |
| AC-007–AC-009 | PASS | Local HTTP: `/portfolio` -> `308 Location: /fr/portfolio`; `?locale=ru` -> `/ru/portfolio`; `/portfolio/plomberie?locale=en` -> `/en/portfolio/plomberie`; invalid locale -> French. Redirect-only unit tests pass. |
| AC-010–AC-011 | PASS | `/ai-automation` -> `308 Location: /fr/ai-automation`; localized AI route returns 200; redirect and localized metadata regression coverage pass. |
| AC-012–AC-013 | PASS | Header/footer/card/home producers and locale switching tests pass. Rendered `/fr/portfolio` anchors use `/fr/portfolio` and `/fr/portfolio/<slug>`. |
| AC-014–AC-016 | PASS | Live `/sitemap.xml` returns 200 and has 3 localized AI plus 21 localized portfolio URLs, without legacy/query aliases or `lastmod`; sitemap tests pass. |
| AC-017 | PASS | Focused Vitest selection: 10 files / 21 tests passed. |
| AC-018 | PASS | Mandatory Crash Test Gate evidence below. |
| AC-019 | PASS | Full tests, typecheck, and fresh production build passed from `web/`. |

## Crash Test Gate — active local development server

The existing local dev server was read only; it was not stopped, restarted, or modified.

- `GET /sitemap.xml` -> `200` (`application/xml`).
- Canonical `GET /fr/portfolio`, `GET /ru/portfolio/plomberie`, and
  `GET /en/ai-automation` -> `200`.
- Legacy aliases -> permanent redirects exactly as recorded above; `/ai-automation` ->
  `308 /fr/ai-automation`.
- `GET /en/portfolio/not-a-real-slug` -> `404`.
- Browser accessibility snapshot of `/fr/portfolio` verified header Portfolio
  `/fr/portfolio`, footer Portfolio `/fr/portfolio`, and six card links under
  `/fr/portfolio/<slug>`; browser console had only React DevTools/HMR informational
  messages.
- `tail -n 100 web/.next/dev/logs/next-development.log` contained browser DevTools
  information only, with no unhandled exception or hydration error.

## Deterministic checks

Executed from `web/` unless stated otherwise:

```text
npm run test:ci       PASS — 33 files passed, 1 skipped; 143 tests passed, 3 skipped
npm run check:types   PASS
npm run lint          PASS — 0 errors; 5 `@next/next/no-img-element` advisory warnings
npm run build         PASS — Next.js 16.2.6; 48 static pages generated
git diff --check      PASS
```

An initial independent build retry saw an existing transient `.next/lock`; no process
or file was altered. The lock disappeared normally, and a fresh `npm run build` then
passed. The Verifier accepted that fresh recorded evidence for AC-019.

## Drift and residual risk

Write-set audit found only approved application/test and Work Block artifacts. No
dependency, proxy/config, portfolio content/data/design, deployment, secret, or external
system change occurred. Pre-existing untracked artifacts remain untouched.

Assurance is `same-session-degraded`, and runtime evidence is local development-server
evidence only. No push, merge, deployment, or production claim is made.
