# Handoff: Tech Lead -> RooCode

**Date**: 2026-03-15
**Ticket**: AZR-003 Phase 1.5 - Implement SEO Landing Pages
**Priority**: P2 (Does not block go-live, but improves conversion)

## Context
AZR-002 website MVP implementation is fully completed. We are executing Phase 1.5 routes in parallel with AZR-003 go-live preparation.

This task is to implement the localized service landing pages described in `06_seo/service-pages-plan.md` (which maps back to the offer stack).

## Scope
Create the following dynamic routes (or static pages) under `web/src/app/services/`:
1. `/services/new-pc-setup` (Particulier/TPE focus)
2. `/services/wifi-printer` (Particulier/TPE focus)
3. `/services/tpe-setup` (Business focus)
4. `/services/onsite-support` (Core local offer)

## Acceptance Criteria (AC)
- **AC1**: The 4 service routes exist and build successfully in `web/`.
- **AC2**: Pages use a consistent template (e.g. `ServiceLandingLayout`) to ensure they all get the `SiteHeader`, `SiteFooter`, a shared `Hero`, the service benefits, a localized trust block ("Nice + 30km"), and a strong CTA to `/contact`.
- **AC3**: Copy is Russian-first, derived directly from `06_seo/service-pages-plan.md` and `00_strategy/offer-stack.md`.
- **AC4**: Visual direction strictly follows ADR-015 `Local Professional`.
- **AC5**: Pricing on these pages strictly uses "от X€" / "по запросу" / "зависит от объёма задачи". No hard guarantees.

## Constraints & Rules
- Do NOT modify the `site -> n8n -> HubSpot` submit logic.
- Do NOT generate verbose, keyword-stuffed SEO text. Keep it practical, conversion-oriented, and human-readable, just with the correct H1/H2 structure.
- Adhere strictly to `AGENTS.md` and `.agent/conventions.md`.

## Expected Output
Return a structured report with:
1. What was done
2. Decisions made
3. Files / settings changed
4. Open blockers (if any)
5. Next recommended action
