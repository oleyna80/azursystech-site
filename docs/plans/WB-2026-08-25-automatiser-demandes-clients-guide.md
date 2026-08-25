# WB-2026-08-25-automatiser-demandes-clients-guide — Implementation plan

## Decision

Add one locale-prefixed App Router guide backed by a typed FR/RU/EN content object. Render visible sections and the four JSON-LD node types from the same localized source. Reuse the existing shell, route conventions, portfolio data, AI automation page, brief flow, typography, palette, and link primitives.

This is the smallest sufficient change: one informational route family, two contextual reverse links, three sitemap entries, and focused regressions. No new dependency, CMS, guide index, route generator, or site-wide redesign is needed.

## Content and information architecture

1. Hero and concise “En bref” answer with the exact French H1 and localized equivalents.
2. Fragmentation and current-flow mapping, followed by the six-stage minimal workflow.
3. Deterministic automation boundary: what needs no AI; AI-assistance boundary for classification, extraction, summarization, and clarification.
4. Generic artisan/local-service example, human-control boundaries, privacy principles, readiness checklist, and one-process recommendation.
5. Localized FAQ and final brief CTA; links to Nice, AI automation, portfolio/examples, and brief.
6. Contextual link from the Nice page and AI automation page back to the guide. Header and footer stay unchanged.

## Architecture

- `web/src/app/[locale]/guides/automatiser-demandes-clients/_guide-data.ts` owns typed localized metadata, visible source arrays, FAQ data, link labels, and JSON-LD-facing values.
- `page.tsx` resolves the path locale, calls `notFound()` for unsupported locales, generates reciprocal metadata, renders semantic sections, and builds `WebPage`, `Article`, `BreadcrumbList`, and `FAQPage` from the data object.
- Existing Nice and AI data/page modules receive only localized guide CTA/link fields and render one contextual link each.
- `sitemap.ts` receives exactly three route entries with no date fields.
- Tests assert route/data/schema/link/sitemap/prohibited-claim contracts without introducing a new testing dependency.

## Implementation brief

- Visual direction: editorial service guide using the existing dark/light contrast and restrained accent system; content hierarchy is primary.
- Interaction: native sections/details where already supported; existing link and CTA hover language; no new motion or component system.
- Accessibility: semantic headings in order, descriptive localized link text, native FAQ disclosure, and no information conveyed by color alone.
- Content safety: only repository-confirmed route/link patterns and general process guidance; no performance or client-result claims.

## Sequence and boundaries

1. Complete Define evidence and open the source Write Gate.
2. Implement the guide data/page/tests, then add reverse links and sitemap tests.
3. Run focused tests and read-only review.
4. Run Crash Test Gate against an active local server, then full required checks and diff review.
5. Freeze exact local HEAD and hand off to Owner; do not push, merge, deploy, or publish.

Exactly one write-capable Coder owns the approved application/test write-set. Reviewer, Verifier, and Drift Auditor are read-only; their same-session advisory limitation is recorded in evidence.

## Stop conditions

Return to Define if the implementation needs a new route family, unsupported claim, footer/header IA expansion, dependency, config/database change, or material acceptance-criteria/write-set change. Stop before commit/push/merge/deploy.
