---
name: azursystech-visual-review
description: Use when reviewing AzurSysTech frontend work for visual-system drift after implementation. This skill checks a route or shell against the approved Local Professional baseline, focusing on visual hierarchy, palette direction, typography intent, CTA visibility, section density, mobile readability, and avoidance of cold corporate or generic startup styling.
---

# AzurSysTech Visual Review

Use this skill after RooCode implements or updates UI in `web/`.

## Read order

1. `AGENTS.md`
2. `memory_bank/context.md`
3. `memory_bank/decisions.md`
4. `docs/plans/azr-002-visual-direction.md`
5. route-specific docs if the review is for a page

## Review priority

1. visual drift from `Local Professional`
2. broken hierarchy or hidden CTA
3. mobile readability and spacing regressions
4. tone mismatch with audience
5. residual unvalidated areas

## What to check

- Does the page feel calm, practical, local, and trustworthy?
- Is the visual hierarchy business-first where required by docs?
- Are CTA blocks clearly visible without becoming visually aggressive?
- Do colors align with the approved warm-light / teal / terracotta / dark-slate system?
- Do headings feel restrained and distinct from body copy?
- Does the page avoid cold corporate styling and generic startup patterns?
- Is section density reasonable on desktop and mobile?
- Does the header stay simple and conversion-oriented?
- Does the footer stay practical and trust-oriented?
- Do legal/privacy pages stay clean and readable rather than decorative?

## Always flag

- dark or neon visual bias
- purple startup gradients
- visually noisy backgrounds
- stock-photo clutter
- overdecorated cards or shells
- cramped mobile layouts
- CTA hidden behind weak contrast or low-priority placement

## Review output

Return findings first, ordered by severity:

1. `High`
2. `Medium`
3. `Low`

Each finding should include:

- file
- issue
- why it breaks the visual contract
- what source it conflicts with

If no findings:

- say explicitly `No findings`
- mention any residual runtime or browser-level risks not checked
