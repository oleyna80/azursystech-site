# AZR-003 Page QA Core Path

Status: REVIEWED
Date: 2026-05-07
Scope: `/`, `/ai-automation`, `/brief`, `/contact`

## Objective

Verify the current public `web` baseline stage for the core conversion path and separate launch-blocking issues from post-launch cleanup.

## Out of Scope

- Production code changes
- Deploy or production smoke
- Secrets and environment changes
- CRM / HubSpot work
- `AZR-004` social automation runtime stream

## Summary

The project is in `AZR-003 post-launch / go-live hardening + page-by-page QA`.
The launch-critical path is no longer blocked by missing routes: `/`, `/ai-automation`, `/brief`, `/contact`, and the submit APIs are present in `web`.

The next execution stage is a small code-fix work block for lint findings in the core path, followed by browser smoke for desktop/mobile.

## Route Verdicts

| Route | Verdict | Notes | Follow-up |
| --- | --- | --- | --- |
| `/` | PASS_WITH_MINOR_FIXES | Homepage has hero, business, automation, pricing, FAQ, and contact conversion sections. Canonical WhatsApp number is used. | Replace internal anchor `<a>` patterns flagged by lint; review image optimization warnings later. |
| `/ai-automation` | PASS | AI automation route is present, points to `/brief`, keeps manual-review constraints, and offers WhatsApp fallback. | Keep as current AI automation conversion page. |
| `/brief` | PASS_WITH_MINOR_FIXES | Brief form posts to `/api/brief/submit`, validates against `brief.v1`, and returns manual-review payload/handoff. No persistence claim was found. | Replace internal `/` navigation `<a>` flagged by lint. |
| `/contact` | PASS_WITH_MINOR_FIXES | Contact page and homepage contact section post to `/api/contact/submit`; canonical phone/WhatsApp/email are aligned. SQL-primary behavior is present in the submit route. | Review visual/navigation consistency because header prefers `/#contact`, while `/contact` is still a standalone route. |

## Findings

- P1: `npm run lint` fails on current `web` baseline. Errors are in core public components and should be fixed before treating QA as closed.
- P2: Next build warns that Turbopack inferred workspace root from `/home/dmitrii/package-lock.json` while `web/package-lock.json` also exists. This is not a route blocker, but it should be cleaned up or pinned via `turbopack.root`.
- P2: Navigation baseline is mixed: header uses homepage anchors for pricing/FAQ/contact; footer also exposes standalone `/pricing`, `/faq`, and `/brief`. This is acceptable for current launch state but should be normalized during page-by-page QA.
- P3: Homepage image usage triggers `@next/next/no-img-element` warnings. Treat as performance cleanup, not a launch blocker.

## Checks Run

```bash
git diff --check
npm run check:types
npm run lint
npm run build
```

## Check Results

- `git diff --check`: pass
- `npm run check:types`: pass
- `npm run build`: pass; 25 app routes generated/detected
- `npm run lint`: fail on existing `web` lint issues:
  - `web/src/app/page.tsx`: internal `/` navigation via `<a>` and `<img>` warnings
  - `web/src/components/brief/brief-form.tsx`: internal `/` navigation via `<a>`
  - `web/src/components/shell/site-header.tsx`: unused `pathname` and `react-hooks/immutability` warning around `document.cookie`

## Next Recommended Action

Open a scoped Coder work block to fix the lint findings in:

- `web/src/app/page.tsx`
- `web/src/components/brief/brief-form.tsx`
- `web/src/components/shell/site-header.tsx`

Then rerun:

```bash
npm run lint
npm run check:types
npm run build
```
