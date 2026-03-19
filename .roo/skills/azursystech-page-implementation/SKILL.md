---
name: azursystech-page-implementation
description: Use when implementing or updating website pages for AzurSysTech from existing project documentation. This skill maps route requirements to source-of-truth markdown files, derives required sections and reusable components, preserves business-first hierarchy, CTA logic, contact/legal consistency, and distinguishes between real implementation and temporary placeholders. Use it for homepage, services, business, home, pricing, FAQ, contact, legal, privacy, and thank-you pages in the MVP website.
---

# AzurSysTech Page Implementation

Use this skill when RooCode is asked to build or update a page in `web/`.

## What to read first

1. `AGENTS.md`
2. `memory_bank/context.md`
3. `memory_bank/progress.md`
4. `memory_bank/decisions.md`
5. `docs/plans/azr-002-implementation-map.md`

Then read only the docs relevant to the route being implemented.

## Route workflow

1. Identify the route.
2. Open the route mapping in `references/route-map.md`.
3. Read the listed source docs for that route.
4. Extract:
   - required sections
   - CTA rules
   - audience priority
   - contact/legal constraints
5. Implement the page in `web/src/app/...`.
6. Do not invent new business copy if the docs already define it.
7. If content is missing, use a clearly labeled stub, not invented marketing copy.

## Hard rules

- Business-first hierarchy must stay intact where docs require it.
- Contact data must match project SSOT.
- Legal/privacy data must not diverge from `02_website/legal-pages.md`.
- Do not hide launch-critical CTA behind decorative UI.
- Keep routes and sections aligned with `docs/plans/azr-002-implementation-map.md`.
- Do not implement autonomous AI actions in page UX.

## Allowed page outputs

- Full page implementation
- Layout skeleton with content-ready sections
- Explicit stubs where source docs are incomplete

## Not allowed

- Writing a new strategy
- Reordering the sitemap without docs support
- Changing legal/contact values from memory bank decisions
- Replacing business-first order with generic consumer-first layout

## Output checklist for RooCode

When finishing a page task, report:

1. route implemented
2. source docs used
3. sections implemented
4. components added or changed
5. what is final vs what remains stubbed
6. validation run

## References

- `references/route-map.md`
- `references/component-map.md`

