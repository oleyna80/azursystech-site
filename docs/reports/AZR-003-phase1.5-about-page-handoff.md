# Handoff: Tech Lead -> RooCode

**Date**: 2026-03-15
**Ticket**: AZR-003 Phase 1.5 - Implement `/about` page
**Priority**: P2 (Does not block go-live, but improves conversion)

## Context
AZR-002 website MVP implementation is fully completed. All Phase 1 routes are live in `web/`.
We are currently in AZR-003 (go-live readiness). While waiting for founder input on legal identity and GBP (AZR-003-001, AZR-003-006), we are executing Phase 1.5 routes in parallel.

The first Phase 1.5 route is `/about` (trust / founder page).

## Scope
- Create `web/src/app/about/page.tsx`.
- Implement a simple, trustworthy "About Us" page.
- Note: We do not have a separate `about-copy.md` yet. Use the existing brand baseline (`01_brand/brand-pack.md`, `00_strategy/positioning.md`) to write placeholder-free, practical, Russian-first copy focusing on local presence (Nice + 30km) and direct founder involvement.
- Do NOT invent fake team members, fake years of experience (if not in docs), or fake certifications. Keep it strictly to the documented positioning (local, fast, transparent, tailored for individuals and TPEs).

## Acceptance Criteria (AC)
- **AC1**: Route `/about` exists and builds in `web/`.
- **AC2**: Visual direction strictly follows ADR-015 `Local Professional` (no generic startup looks, no dark-mode-first bias, use the defined calm palette).
- **AC3**: Uses shared app shell (`SiteHeader`, `SiteFooter`).
- **AC4**: Contains a clear CTA leading to `/contact`.
- **AC5**: Copy is Russian-first, calm, and trustworthy.

## Constraints & Rules
- Do NOT modify the `site -> n8n -> HubSpot` submit logic or any existing Phase 1 routes.
- Adhere strictly to `AGENTS.md` and `.agent/conventions.md`.

## Expected Output
Return a structured report with:
1. What was done
2. Decisions made
3. Files / settings changed
4. Open blockers (if any)
5. Next recommended action
