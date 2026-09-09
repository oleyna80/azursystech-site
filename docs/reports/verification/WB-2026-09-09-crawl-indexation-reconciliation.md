# Verification report — Crawl / Indexation Reconciliation

Verdict: `READY` for the bounded source candidate; production reconciliation is
`UNVERIFIED_PENDING_OWNER_DEPLOY` and is not represented as complete.

## Frozen baseline and deployment evidence

- Subject base: `origin/main` `d5fc9ed2c64f0d2f62ac46cb294637bac5657793`.
- Subject branch: `feat/wb-crawl-indexation-reconciliation-025`.
- Latest successful VPS workflow observed: run `32749942183`, event
  `workflow_dispatch`, `head_sha=d647f6ab1bf6dc40cdcde09d7e4cc554ad31882d`,
  completed successfully on 2026-08-24. Workflow metadata does not expose the
  dispatch input value; the workflow contract requires an immutable
  `sha-<full_commit_sha>` image tag and binds the run to its `github.sha`.
- `d647f6a` is an ancestor of `origin/main`; the source route work is therefore
  present in canonical source but absent from the deployed revision evidence.
- Public `/health` returns only `{"status":"ok"}`; headers identify Cloudflare,
  Next.js, and `x-served-by: azursystech.fr`, but no runtime commit SHA.

## Production P0 re-check (2026-09-09)

| Surface | Current production result | Classification |
|---|---|---|
| `/sitemap.xml` | `200`, 19 URLs, `lastmod=2026-05-31`; old unlocalized portfolio and no localized guide/portfolio set | P0 still present |
| `/fr/portfolio` | `404` | P0 still present |
| `/fr/guides/automatiser-demandes-clients` | `404` | P0 still present |
| `/portfolio` | `200` | stale legacy behavior; source expects permanent localized redirect |
| `/portfolio/plomberie` | `200` | stale legacy behavior; source expects permanent localized redirect |
| `/ai-automation` | `308 Location: /fr/ai-automation` | aligned with source |
| `/demo/health` | `200` | intentional separate showcase route, preserved and excluded from source sitemap |
| `/brief`, `/brief?locale=ru` | `200`, no canonical observed | P1 policy boundary; unchanged |

Production HTML for the stale 404 URLs cannot provide self-canonical tags.
The old 200 content routes are not the canonical localized set.

## Canonical source and local crawl assertions

Against the rebuilt subject at `http://127.0.0.1:3100`:

- The only implementation changes are self-canonical metadata additions in
  `web/src/app/data-deletion/page.tsx`, `legal/page.tsx`, `privacy/page.tsx`,
  and `terms/page.tsx`; no route, sitemap, `/brief`, showcase, dependency, or
  deployment behavior was changed.
- sitemap contains 38 URLs; all 38 returned `200`.
- all sitemap URLs except the explicitly excluded `/brief` policy surface
  returned a matching self-canonical URL.
- `/portfolio` -> `308 /fr/portfolio`;
  `/portfolio?locale=ru` -> `308 /ru/portfolio`;
  `/portfolio/plomberie` -> `308 /fr/portfolio/plomberie`;
  `/ai-automation` -> `308 /fr/ai-automation`.
- `/old-deleted-route` returned `404`.
- `/demo/health` is `404` on the public-web local subject because showcase is a
  separate runtime; public production returned `200`, confirming the route was
  not incorrectly absorbed into the website route set.
- no unhandled error or hydration error appeared in the local server output.

## Deterministic checks

- `python3 scripts/validate-define-traceability.py ...`: `READY`.
- Focused Vitest: 5 files, 14 tests passed.
- `npm run check:types`: passed.
- `npm run lint`: passed with six existing `no-img-element` warnings, zero
  errors.
- `npm run build`: passed; 54 static pages generated.
- Crash Test Gate: `PASSED` for sitemap route status, legacy/retired route
  behavior, canonical assertions, focused tests, and server-log inspection.

## Required Owner action

Deploy the assured canonical source revision through the existing immutable-image
VPS workflow, then repeat the production crawl. This Work Block performed no
deployment, restart, merge, default-branch push, or production mutation.
