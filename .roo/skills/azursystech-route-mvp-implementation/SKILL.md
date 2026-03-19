---
name: azursystech-route-mvp-implementation
description: Use when implementing a new MVP route in AzurSysTech `web/` with RooCode. This skill turns a route task into a strict execution workflow: read SSOT in the right order, derive required sections and CTA paths, preserve business-first hierarchy, preserve legal/contact/tooling constraints, apply the approved Local Professional visual baseline, update task and memory artifacts, and run the required build validation.
---

# AzurSysTech Route MVP Implementation

Use this skill when RooCode is asked to create or complete a route in `web/src/app/...`.

## Read order

1. `AGENTS.md`
2. `memory_bank/context.md`
3. `memory_bank/progress.md`
4. `memory_bank/decisions.md`
5. `docs/plans/azr-002-implementation-map.md`

Then read only the route-specific docs.

## Route execution workflow

1. Identify the route and target audience.
2. Read route architecture in `02_website/site-architecture.md`.
3. Read route content sources from strategy/brand/SEO docs named in the task.
4. Read `docs/plans/azr-002-visual-direction.md`.
5. Extract:
   - required section order
   - audience priority
   - CTA labels and destinations
   - allowed pricing framing
   - legal/contact/tooling constraints
   - visual direction requirements
6. Implement only the scoped route.
7. Keep shared shell compatibility intact.
8. Update:
   - `docs/tasklist/azr-002-tasklist.md`
   - `memory_bank/progress.md`
9. Run:
   - `cd /home/dmitrii/azursystech/web && npm run build`

## Hard rules

- Public MVP language is Russian unless docs explicitly say otherwise.
- Keep business-first hierarchy where docs require it.
- Do not invent services, packages, or pricing certainty.
- Allowed pricing language is limited to documented framing such as:
  - `от`
  - `по запросу`
  - `зависит от объёма задачи`
- CTA must follow route contract; if the task says `/contact`, do not improvise.
- Do not expose internal/dev wording in public UI.
- Do not add fake backend logic, fake chat behavior, analytics wiring, or autonomous AI behavior.
- Do not rewrite unrelated routes or shell components without a route-level reason from docs.

## Visual baseline

Treat `ADR-015` and `docs/plans/azr-002-visual-direction.md` as required constraints:

- direction: `Local Professional`
- calm, practical, trustworthy, human
- warm light surfaces
- dark slate text
- restrained teal primary accent
- terracotta secondary accent
- restrained, non-corporate composition

Avoid:

- generic startup styling
- cold corporate look
- noisy gradients
- dark-mode-first bias
- decorative visual clutter

## Finish report

Return:

1. What was done
2. Decisions made
3. Files / settings changed
4. Open blockers
5. Next recommended action

