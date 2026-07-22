# WB-2026-07-22 — Retarget Thank-You Services Link

## Objective

Replace the obsolete Services destination on thank-you with the existing French
services section at /fr#services.

## Owner decision

The Owner explicitly requested cleanup and supplied http://localhost:3000/fr#services
as the destination. The fixed French locale is intentional.

## Scope

One production source change only:

- web/src/app/thank-you/page.tsx — change href=/services to href=/fr#services.

## Boundaries

No route/sitemap change, localized-home change, copy change, form/provider/DB
behavior, configuration, deploy, staging, commit, or push. Preserve the page's
existing unrelated dirty hunks.

## Acceptance criteria

1. The page has no href=/services and its Services CTA targets /fr#services.
2. The target page contains the services anchor.
3. The one-hunk diff is clean; typecheck and local browser navigation smoke
   pass.

## Closeout

CLOSED / READY. The Services CTA now targets /fr#services. The localized French
page supplies the services anchor, and the rendered browser click reached that
section without new console errors. Existing unrelated page hunks were
preserved. No staging, commit, push, deployment, provider, DB, or client action
occurred.
