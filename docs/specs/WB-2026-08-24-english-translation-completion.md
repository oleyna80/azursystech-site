# Specification — Complete English Translation and Localization

## Status

- **Work Block:** `WB-2026-08-24-english-translation-completion`
- **Status:** approved by Owner on 2026-08-24
- **Revision:** `v3`
- **Baseline:** `68b15d51a0dd5c3d5bc3929e9ee9aa36b3999f73`

## Objective

Complete the English localization of the AzurSysTech web platform (`web/`), bringing the English experience to full parity with French and Russian versions. This includes modernizing the i18n dictionary to reflect the current AI automation and web development positioning, enabling showcase demos and portfolio sections on `/en`, providing English translations for the interactive project brief, translating legal and compliance pages (`/legal`, `/privacy`, `/terms`, `/thank-you`, `/data-deletion`), expanding header/footer language switching site-wide, implementing full multi-language (FR, RU, EN) localization for portfolio index and project detail pages with in-place language switching, and making the production build independent of Google Fonts connectivity.

## Requirements

- REQ-001: Synchronize `web/src/i18n.js` English dictionary with modern AI automation and website service positioning, aligning all section keys, navbar, hero, businessValue, services (`automationCards`), whyUs, howItWorks, pricing, faq, contact, and footer.
- REQ-002: Expand `web/src/app/[locale]/_home-data.ts` to include complete English showcase demo cards (`showcaseDemos` with 6 demos matching French/Russian cards) and localized showcase/portfolio copy; update `web/src/app/[locale]/page.tsx` to display showcase and portfolio sections on `/en`.
- REQ-003: Update `web/src/components/shell/site-header.tsx` and `web/src/components/shell/site-footer.tsx` to enable the English language switcher globally, include portfolio in English nav, synchronize header CTA to `/brief`, and provide complete legal links, contact details, and navigation in the English footer.
- REQ-004: Extend `web/src/lib/brief-submit.ts`, `web/src/app/brief/page.tsx`, and `web/src/components/brief/brief-form.tsx` to support `BriefLocale` `"en"` with complete English form fields, placeholders, helpers, step titles, options, assistant triggers, and validation messages.
- REQ-005: Localize legal, policy, and utility pages (`web/src/app/legal/page.tsx`, `web/src/app/privacy/page.tsx`, `web/src/app/terms/page.tsx`, `web/src/app/thank-you/page.tsx`, `web/src/app/data-deletion/page.tsx`) with complete English translations and cookie/locale resolution.
- REQ-006: Localize portfolio data and pages into FR, RU, and EN (`web/src/lib/portfolio-data.ts`, `web/src/app/portfolio/page.tsx`, `web/src/app/portfolio/[slug]/page.tsx`, `web/src/components/portfolio/portfolio-card.tsx`, `web/src/components/sections/portfolio-section.tsx`) with complete localized titles, descriptions, tags, capabilities, automation points, and in-place language toggle via cookie/searchParams.
- REQ-007: Update Vitest test suites (including `_home-data.test.ts`, `page.test.ts`, brief submit tests, and `portfolio-data.test.ts`) to validate English translations, showcase demo integrity, portfolio multi-language content, schema validation, and route stability.
- REQ-008: Bundle the official Geist Sans and Geist Mono variable fonts as licensed local assets, load them through `next/font/local` in the root layout, and execute comprehensive assurance (requirements quality, consistency analysis, Critic gate, TypeScript typecheck, build validation, and verification reporting) without a build-time request to Google Fonts.

## Acceptance Criteria

- AC-001 [req=REQ-001]: `web/src/i18n.js` contains a complete English dictionary with `automationCards`, updated hero, services, pricing, faq, and contact matching French and Russian structures without missing keys.
- AC-002 [req=REQ-002]: `web/src/app/[locale]/_home-data.ts` defines 6 English `showcaseDemos` with valid slugs, titles, categories, site types, business functions, and automation badges; `web/src/app/[locale]/page.tsx` renders showcase and portfolio sections on `/en`.
- AC-003 [req=REQ-003]: `site-header.tsx` enables `en` across all site routes and includes portfolio in nav; `site-footer.tsx` renders legal links, contact channels, and full navigation for English visitors.
- AC-004 [req=REQ-004]: `BriefLocale` accepts `"en"`, `createBriefFields("en")` returns localized definitions for all fields, and the brief form submits and validates successfully in English.
- AC-005 [req=REQ-005]: `/legal`, `/privacy`, `/terms`, `/thank-you`, and `/data-deletion` resolve English locale from cookie/param and display complete English legal text and metadata.
- AC-006 [req=REQ-006]: `getPortfolioProjects(locale)` and `getProject(slug, locale)` return complete localized content for FR, RU, and EN for all 6 projects; `/portfolio` and `/portfolio/[slug]` render localized metadata, content, and CTA links with in-place language switching without page displacement.
- AC-007 [req=REQ-007]: `npm run test` executes with all tests passing, including assertions for 6 English showcase demos, Cyrillic-free English brief and portfolio fields, and English structured data.
- AC-008 [req=REQ-008]: The root layout loads the licensed local Geist Sans and Geist Mono variable assets through `next/font/local` while retaining `--font-geist-sans` and `--font-geist-mono`; `npm run check:types` and `npm run build` pass with zero errors without accessing `fonts.googleapis.com`; Critic report and verification report confirm full acceptance.

## Explicit Non-Goals

- Modifying database schema or live database data in production.
- Modifying VPS infrastructure, deploy scripts, or secrets.
- Changing showcase demo source codes inside `showcase/app/demo/*` (showcases remain standalone reference mockups).
- Executing autonomous `git push` or merging directly into `main`.

## Provenance

- **Classification:** `original`
- **Owner Request:** 2026-08-24 instruction to create branch and complete English translation; 2026-08-24 approval to bundle local Geist fonts and remove the Google Fonts build dependency.
- **Local delta:** Upgrades English translation across all site layers (`web/`) to complete parity with French and Russian.
