# WB-2026-08-25-automatiser-demandes-clients-guide — Evergreen guide for automating client requests

## Status and authority

- Work Block: `WB-2026-08-25-automatiser-demandes-clients-guide`
- Governance profile: `Managed`
- Base subject: `origin/main` at `5d3f3115d14fa715c7e06839aac092da5e4a8819`
- Branch: `feat/automatiser-demandes-clients-guide`
- Lifecycle: Stage 0 Define must reach `READY` before application-source writes.
- Publication: local candidate only; commit, push, merge, deploy, and production actions remain Owner-controlled.

## Objective

Create the first evergreen informational/AEO guide for the search intent of automating small-business client requests at:

- `/fr/guides/automatiser-demandes-clients`
- `/ru/guides/automatiser-demandes-clients`
- `/en/guides/automatiser-demandes-clients`

The guide must help a small-business owner choose one narrow repetitive process and distinguish deterministic automation, AI assistance, and human decision-making. It must not duplicate the commercial `/{locale}/ai-automation` page.

## Requirements

- REQ-001: Render the guide at the three specified locale-prefixed paths, use the path locale as the authoritative content locale, and return `notFound()` for unsupported locales.
- REQ-002: Provide fully localized visible FR/RU/EN content. The French H1 must be exactly `Comment automatiser les demandes clients d'une petite entreprise ?` and the French title must be exactly `Automatiser les demandes clients d'une TPE : guide pratique | AzurSysTech`.
- REQ-003: Give every locale a self-canonical URL, reciprocal `fr`, `ru`, and `en` alternates, and French `x-default`. The guide must be distinct from the commercial AI automation page and must retain an informational guide intent.
- REQ-004: Near the top, provide a concise localized “En bref” answer and explain fragmentation/loss of inbound requests, current-flow mapping, and the minimal workflow receive → structure → qualify → notify → record → human handoff.
- REQ-005: Include localized sections explicitly covering what does not need AI, useful AI assistance for free-text classification/extraction/summarization/clarification, one generic artisan or local-service example, human-control boundaries for pricing/timelines/complaints/ambiguity/sensitive decisions, and a narrow-process recommendation.
- REQ-006: Include a concise localized privacy section covering data minimization, defined purpose, access/security, and no unnecessary sensitive-data collection; include a readiness checklist and localized FAQ.
- REQ-007: Emit JSON-LD nodes of type `WebPage`, `Article`, `BreadcrumbList`, and `FAQPage` for the current locale. Structured data must be derived from the same localized source as visible content and must not add unsupported claims; visible FAQ pairs and FAQ schema must remain in parity.
- REQ-008: Link from the guide to the localized Nice commercial page, AI automation page, portfolio index, relevant portfolio examples, and existing brief flow. Add one contextual localized link from the Nice commercial page and one from the AI automation page to the guide. Do not add the guide to the primary header; do not add a footer link unless the existing information architecture can support it without creating a broader resources surface.
- REQ-009: Add exactly the three canonical guide URLs to the sitemap without synthetic `lastModified` values and without adding any other guide, blog, city page, CMS, dependency, or route family.
- REQ-010: Add focused regression coverage for locale/404 behavior, metadata canonical/hreflang, localized content, WebPage/Article/BreadcrumbList/FAQPage parity, guide and reverse commercial links, exact sitemap inventory, and prohibited unsupported commercial claims.
- REQ-011: Do not introduce unsupported statistics, ROI, hours saved, conversion improvements, client outcomes, testimonials, guarantees, delivery times, invented clients, addresses, or new commercial offers; do not change database, environment, operational configuration, or unrelated pre-existing artifacts.

## Acceptance criteria

- AC-001 [req=REQ-001]: The three exact guide paths select matching localized content, and a locale outside `fr`, `ru`, or `en` is rejected with `notFound()`/404 behavior.
- AC-002 [req=REQ-002]: French metadata title and H1 exactly match the specified strings; Russian and English visible content and metadata are localized rather than copied French text.
- AC-003 [req=REQ-003]: Each locale exposes a self-canonical URL, reciprocal `fr`/`ru`/`en` alternates, and `x-default` pointing to the French guide; the guide metadata/content does not present itself as the commercial AI automation offer.
- AC-004 [req=REQ-004]: Each locale visibly contains the localized concise answer near the top, request-fragmentation explanation, flow-mapping instruction, and all six ordered workflow stages including human handoff.
- AC-005 [req=REQ-005]: Each locale visibly contains a no-AI section, all four AI-assistance uses, the generic artisan/local-service example, all five human-control boundaries, and a recommendation to start with one narrow repetitive process.
- AC-006 [req=REQ-006]: Each locale visibly contains all four privacy principles, a readiness checklist, and at least one localized FAQ pair.
- AC-007 [req=REQ-007]: JSON-LD contains exactly one node of each required type for the current locale; `Article`/`WebPage`/breadcrumb strings are localized and every FAQ schema question/answer is an exact source parity match to visible FAQ data.
- AC-008 [req=REQ-008]: Guide links resolve to localized Nice, AI automation, portfolio, relevant existing portfolio examples, and brief routes; both existing commercial pages contain a contextual localized guide link; header/footer remain unchanged unless a separately recorded IA decision authorizes a link.
- AC-009 [req=REQ-009]: Sitemap contains each canonical guide URL exactly once, contains no guide URL with a synthetic `lastModified`, and adds no additional guide route.
- AC-010 [req=REQ-010]: Focused tests cover AC-001 through AC-009, including an explicit forbidden-claim assertion.
- AC-011 [req=REQ-011]: Source diff contains no unsupported numeric/statistical or commercial outcome claims, no new dependency/config/database/operational change, and no pre-existing unrelated untracked artifact is staged or included.
- AC-012 [req=REQ-010]: Crash Test Gate records sitemap/public-route status, an explicit 404, internal-anchor/link integrity, affected tests, and clean runtime logs; `npm run test:ci`, `npm run check:types`, `npm run lint`, `npm run build`, and `git diff --check` pass from the approved subject.

## Clarifications and assumptions

- Evidence-resolved: `https://azursystech.fr` is the canonical host and the existing locale metadata pattern uses French as `x-default`.
- Evidence-resolved: the existing brief flow is `/brief` for French and `/brief?locale=ru|en` for Russian/English.
- Evidence-resolved: existing portfolio slugs and localized AI/Nice routes are reusable internal destinations.
- Explicit assumption: no footer link is added. The current footer is a service/navigation surface, and adding a guide would begin a broader resources navigation surface prohibited by this scope.
- Explicit assumption: the guide uses native page sections and existing typography/link primitives; no visual redesign, CMS, publication date, or new content framework is needed.
- Explicit assumption: the generic example is explicitly presented as a hypothetical pattern for an artisan/local-service business, not a named client or outcome.
- No blocking Owner decision remains for this bounded implementation.

## Non-goals and exclusions

- No `/blog`, guides index, additional articles, additional city pages, `llms.txt`, new automation page, CMS, database/schema/migration, dependencies, new commercial offer, redesign, Search Console change, deployment, or production action.
- No invented statistics, ROI, hours saved, conversion improvements, clients, outcomes, testimonials, reviews, rankings, guarantees, delivery times, physical address, or sensitive-data collection flow.
- No primary-header or footer information-architecture expansion; no modification of unrelated files or pre-existing untracked artifacts.

## Required assurance and completion boundary

Stage 2 requires a read-only Reviewer, Verifier, Crash Test Gate evidence, full required checks, and a drift check against the frozen diff and this specification. Successful closeout is a local exact-HEAD Owner publication handoff. The agent must stop before commit/push/merge/deploy; no publication authority is granted by this specification.
