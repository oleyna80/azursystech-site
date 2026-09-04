# Prioritized findings — WB-2026-09-03-technical-seo-cwv-entity-audit

Source: `docs/reports/technical-audit-WB-2026-09-03.md`.

## Blocker

No audit blocker was raised. The audit is complete for reporting-only scope;
implementation requires successor Work Blocks.

## P0

- Reconcile production/source route and sitemap drift before SEO changes. This is
  one root cause with multiple manifestations, not five independent fixes.

## P1

- Run a complete production crawl with 200/self-canonical assertions after deployment reconciliation.
- Define the indexation policy for `/brief` and its query-locale variants.
- Reassess internal links after reconciliation; `/portfolio` is production evidence,
  while `/demo/*` remains an intentional showcase route contract.
- Obtain CrUX/GSC and mobile lab measurements for LCP, INP, and CLS.
- Establish consistent breadcrumb, Organization, and structured-data contracts.
- Verify mobile interaction, tap targets, chat overlap, and final route parity.

## P2

- Validate unique snippets and cache/compression policies.
- Inventory verified organization identity fields, logo, and `sameAs` opportunities.
- Retain current local-font, lazy-loading, click-to-load video, and H1 foundations.

## P3

No P3 finding was required. Cosmetic or speculative SEO changes wait until P0/P1
route and measurement evidence exists.
