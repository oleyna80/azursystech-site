---
name: azursystech-doc-to-ui-review
description: Use when reviewing RooCode changes against AzurSysTech docs. This skill checks whether pages, forms, CTAs, contact values, business-first hierarchy, legal data, and route scope still match the documented source of truth. Use it for code review after page implementation or form changes.
---

# AzurSysTech Doc-to-UI Review

Use this skill after RooCode implements UI.

## Review priority

1. bugs or broken behavior
2. contract drift from docs
3. wrong CTA/contact/legal values
4. layout/order regressions
5. missing validation/tests

## What to check

- Does the route match the planned route scope?
- Does section order match docs?
- Is business-first priority preserved where required?
- Do CTA labels and destinations match launch docs?
- Do phone, WhatsApp, and email values match accepted decisions?
- Do legal/privacy blocks match `02_website/legal-pages.md`?
- Does the UI avoid pretending AI sends messages automatically?

## Review output format

Return findings first, ordered by severity:

1. `Critical`
2. `High`
3. `Medium`
4. `Low`

Each finding must include:
- file
- issue
- why it matters
- what source doc it conflicts with

If no findings:
- say explicitly that no findings were found
- mention residual risks or untested areas

