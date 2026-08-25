# WB-2026-08-24-creation-site-internet-nice — Implementation plan

## Decision

Add one locale-prefixed App Router page backed by a typed FR/RU/EN content contract. Reuse the existing site shell, portfolio data, AI automation routes, brief flow, typography, palette, and image assets. Keep structured data generated from the same content object that renders visible sections so schema parity is testable.

This is the smallest sufficient change: one service route family, bounded navigation discovery, three sitemap entries, and focused regressions. No new dependency, architecture layer, city-page generator, or design-system change is needed.

## Visual thesis

An editorial, confident local-service page: the existing AzurSysTech dark/light contrast, restrained teal/terra accents, strong type scale, and image-led hero create a clear “site as working intake system” story without a redesign.

## Content plan

1. Hero: exact French search-intent H1, localized promise, primary brief CTA, and service-area context.
2. Offer: site types and concrete functions for small-business use cases.
3. Intake: forms, notifications, briefs, and optional AI/automation extension with human commercial control.
4. Proof by examples: existing portfolio index plus localized links to Plomberie Pro, Beauté & Spa, Le Bistrot, Bijoux Artisanaux, Agent d'Assurance, and Agence Immobilière.
5. Process/pricing/service area/FAQ: existing four-step process, public starting references, service-area wording, and schema-bound FAQs.
6. Final CTA: existing brief/contact path; no promises about delivery time or outcomes.

## Interaction thesis

- Reuse the existing hero entrance/hover language and one restrained section-reveal rhythm if already available in the page primitives.
- Use native details/summary for FAQ disclosure so the visible answer and FAQ schema share one data source.
- Use understated link/CTA hover movement already present in the site shell; no new motion dependency or ornamental interaction.

## Implementation sequence

1. Add `_creation-site-data.ts` with typed localized copy, confirmed prices, portfolio references, process, FAQ, metadata, and JSON-LD-facing fields.
2. Add `page.tsx` under `web/src/app/[locale]/creation-site-internet-nice/` with static params, metadata, localized rendering, internal links, and four required JSON-LD node types.
3. Add focused route tests for metadata, visible/content contract, JSON-LD node/parity/unsupported-claim checks.
4. Add localized homepage discovery, one header nav item, and one footer item with tests.
5. Add three sitemap entries and sitemap regression coverage.
6. Run focused checks, Crash Test Gate, full required checks, diff review, and drift verification.

## One-Coder boundary

Exactly one write-capable Coder owns the application and test write-set. Reviewer, Verifier, and Drift Auditor are read-only; this session records `same-session-degraded` for those advisory functions. No parallel writer is authorized.

## Stop conditions

Return to Define if the implementation needs new claims, new routes beyond the three specified, new dependencies, a data/config/schema change, a global redesign, or a material change to the acceptance criteria/write-set. Stop before commit/push/merge/deploy.

## Verification plan

Focused Vitest covers the new route/data, localized homepage link, header/footer links, and sitemap. Crash Test Gate runs against an active local development server: sitemap and canonical pages must be 200, a genuinely nonexistent route must be 404, all new internal links must resolve, and logs must show no unhandled exception or hydration error. Then run `npm run test:ci`, `npm run check:types`, `npm run lint`, `npm run build`, and `git diff --check` from `web`/repository root as applicable.

## Explicit exclusions

No blog/guides, extra city pages, `llms.txt`, new automation page, dependencies, database/migrations, environment/secrets/config changes, deployment, payment/order changes, or unrelated dirty/untracked artifact changes.
