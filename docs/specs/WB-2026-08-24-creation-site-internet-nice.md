# WB-2026-08-24-creation-site-internet-nice — Localized Nice website-creation service page

## Status and authority

- Work Block: `WB-2026-08-24-creation-site-internet-nice`
- Governance profile: `Managed`
- Base subject: `origin/main` at `1406b8e77225ad4b6c92d539120c98978071c1a3`
- Branch: `feat/creation-site-internet-nice`
- Lifecycle: Stage 0 Define must reach `READY` before application-source writes.
- Publication: local candidate only; commit, push, merge, deploy, and production actions remain Owner-controlled.

## Objective

Create one localized commercial/service page for the search intent “création site internet Nice” at:

- `/fr/creation-site-internet-nice`
- `/en/creation-site-internet-nice`
- `/ru/creation-site-internet-nice`

The page must present a credible, localized website-creation offer for small businesses while using only existing, repository-confirmed AzurSysTech commercial data.

## Requirements

- REQ-001: Render the page at all three locale-prefixed paths, selecting visible content from the locale path and returning `notFound()` for unsupported locales.
- REQ-002: Give every localized page a self-canonical URL and reciprocal `fr`, `ru`, `en`, and French `x-default` alternates. The French metadata title must be exactly `Création de site internet à Nice pour TPE & artisans | AzurSysTech`; the French H1 must be exactly `Création de site internet à Nice pour petites entreprises`.
- REQ-003: Provide fully localized visible FR/RU/EN content covering website types, website functions, forms/notifications/intake, target small-business profiles, existing portfolio examples, implementation process, existing public price references, possible AI/automation extension, service area, and FAQ. The page must contain the localized primary CTA to the existing brief/contact flow.
- REQ-004: Emit JSON-LD derived from the same visible localized content for `WebPage`, `Service`, `BreadcrumbList`, and `FAQPage`. FAQ questions and answers in JSON-LD must exactly correspond to the visible FAQ entries; schema must not introduce unsupported claims.
- REQ-005: Add internal discovery paths from the localized homepage, header, and footer to this page. The page itself must link to the localized portfolio index, relevant localized portfolio examples, the localized AI automation page, and the existing brief flow.
- REQ-006: Add exactly the three canonical localized Nice service URLs to the sitemap and do not add blog/guides, other city pages, `llms.txt`, a new automation page, or redirect-only aliases.
- REQ-007: Add focused regression tests for page metadata, localized visible/schema content, JSON-LD parity, homepage/header/footer/page links, and sitemap inventory. Before closeout, pass the Crash Test Gate, `npm run test:ci`, `npm run check:types`, `npm run lint`, `npm run build`, and `git diff --check`.

## Confirmed commercial/content source contract

The implementation may reuse only these repository-confirmed facts:

- Existing public price references: landing page + form + notifications from `400 €`; multi-page showcase website from `600 €`; website + automated intake from `600 €`; AI agent for incoming requests from `800 €`.
- Existing service-area wording: Nice and up to 30 km around, with remote support; existing localized home data also names Cagnes-sur-Mer, Antibes, Vence, and Alpes-Maritimes.
- Existing portfolio examples and capabilities: Plomberie Pro (local service landing, quote/emergency intake), Beauté & Spa (services and booking), Le Bistrot (menu and table booking), Bijoux Artisanaux (catalogue and custom requests), Agent d'Assurance (lead qualification and consultation), Agence Immobilière (property catalogue, valuation and viewing request).
- Existing process wording: describe the project, frame the first flow, put the system in place, keep commercial decisions under human control.
- Existing intake/automation wording: contact forms, structured briefs, owner notifications, table/CRM handoff, and AI assistance that does not request sensitive data in chat or make pricing/deadline commitments.
- Existing public contact/brief routes, locale patterns, and design system may be reused.

## Clarifications and assumptions

- Evidence-resolved: French is the x-default and the existing canonical host is `https://azursystech.fr`.
- Evidence-resolved: non-French brief links use the existing `/brief?locale=ru|en` pattern; French uses `/brief`.
- Explicit assumption: the page is a new route and localized content data module, but it reuses existing header/footer, typography, palette, imagery, and interaction conventions. No design-system or site-wide redesign is needed.
- Explicit assumption: portfolio examples are presented as existing demonstration examples, not as named clients or outcome claims.
- No blocking Owner decision remains for this bounded implementation.

## Non-goals and exclusions

- No blog, guides, editorial content, additional city/service pages, `llms.txt`, new automation page, new dependencies, database/schema/migration, environment/secrets/config changes, payment/order changes, or deployment.
- No invented clients, testimonials, reviews, results, rankings, ROI, conversion claims, delivery deadlines, physical address, guarantees, or legal/compliance claims.
- No changes to existing portfolio data, existing AI automation content, global visual system, or unrelated untracked artifacts.

## Acceptance criteria

- AC-001 [req=REQ-001]: All three localized URLs render a non-empty page using the matching locale; an unsupported locale is not accepted by the route.
- AC-002 [req=REQ-002]: French metadata title and H1 exactly match the specified targets.
- AC-003 [req=REQ-002]: Every locale has a self-canonical URL plus `fr`, `ru`, `en`, and `x-default` alternates, with `x-default` pointing to `/fr/creation-site-internet-nice`.
- AC-004 [req=REQ-003]: Each locale visibly contains localized sections for site types, functions/intake, target businesses, portfolio examples, process, public price references, AI/automation extension, service area, FAQ, and a brief/contact CTA.
- AC-005 [req=REQ-003]: The visible public price references match the four confirmed starting-price values and include a qualification that the exact amount depends on the need; no exact deadline or guarantee is shown.
- AC-006 [req=REQ-004]: JSON-LD contains `WebPage`, `Service`, `BreadcrumbList`, and `FAQPage` nodes for the current locale and canonical URL.
- AC-007 [req=REQ-004]: Every visible FAQ pair is represented exactly once in `FAQPage.mainEntity`, and no FAQ schema answer is absent from visible content.
- AC-008 [req=REQ-004]: JSON-LD contains no unsupported client, result, review, ROI, deadline, address, guarantee, or unlocalized-content claim.
- AC-009 [req=REQ-005]: Localized homepage, header, and footer expose a link to the matching locale Nice page.
- AC-010 [req=REQ-005]: The Nice page links to `/{locale}/portfolio`, relevant localized portfolio slugs, `/{locale}/ai-automation`, and the existing brief flow.
- AC-011 [req=REQ-006]: Sitemap contains each of the three Nice URLs exactly once and no additional Nice city-page path.
- AC-012 [req=REQ-007]: Focused tests cover AC-002 through AC-011 and pass.
- AC-013 [req=REQ-007]: Crash Test Gate records sitemap/public-route status, anchor/link audit, one real 404, affected tests, and clean runtime logs.
- AC-014 [req=REQ-007]: `npm run test:ci`, `npm run check:types`, `npm run lint`, `npm run build`, and `git diff --check` pass from the approved subject.

## Required assurance and completion boundary

Stage 2 requires a read-only Reviewer, Verifier, and drift check against the frozen diff and this specification. Successful closeout is a local, exact-HEAD Owner publication handoff. The agent must stop before commit/push as required by Owner-controlled GitHub flow; no merge, deployment, or production action is authorized.
