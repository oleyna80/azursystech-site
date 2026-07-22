# WB-2026-07-22 — English core launch specification

## Status

Closed / READY for the Owner-authorized local closeout commit. This is the
specification and SSOT tasklist; the implementation, Critic, verification, and
commit trailer use `WB-2026-07-22-english-core-implementation`.

## Objective

Define the first safe English public core and the product-positioning boundary
before changing the web application.

## Completed

- [x] Inspected current locale routing, typed home data, shell, metadata,
  sitemap, contact, chat, brief, and legacy-page boundaries.
- [x] Established EN core route policy: `/en` and `/en/ai-automation` only.
- [x] Recorded service-positioning rule: web applications, websites, and AI
  automation; no obsolete onsite hardware offers in the EN core.
- [x] Obtained and adopted the Stage 0 Critic supplement.
- [x] Split future EN core implementation from conversion/provider surfaces.

## Current implementation scope

- [x] Approve the refreshed, exact production write-set for the EN core.
- [x] Approve native English editorialization for the two initial pages from
  the approved current product positioning, not legacy `i18n.js` copy.
- [x] Implement URL-authoritative EN shell, EN home and AI-automation content,
  current service wording, EN SEO, and the two localized sitemap entries.
- [x] Verify the frozen diff with targeted tests, lint, typecheck, build,
  source review, and an independent readonly root.

## Out of scope

Contact form, chat source, API/provider contracts, configuration, deployment,
staging, and push remain unauthorized. EN is information-only until a separate
conversion-surface Work Block is approved.

## Residual follow-up

- [x] Owner-authorized localhost/browser smoke passed for `/en` and
  `/en/ai-automation`: both returned 200 at 1440x900 and 375x812, rendered
  `lang="en"`, showed no form or chat, preserved WhatsApp-only EN CTAs, had no
  horizontal overflow, switched to `/fr` and `/ru`, and recorded zero console
  errors or warnings (aside from informational React DevTools/HMR messages).
- [x] Owner authorized one separate scoped local closeout commit. Push remains
  unauthorized.

## Evidence

- Plan: `docs/plans/WB-2026-07-22-english-core-launch-spec.md`
- Critic: `docs/reports/WB-2026-07-22-english-core-launch-spec-critic.md`
- Verification: `docs/reports/WB-2026-07-22-english-core-implementation-verification.md`
- Active contact WB remains separately recorded as `verification: BLOCKED`.
