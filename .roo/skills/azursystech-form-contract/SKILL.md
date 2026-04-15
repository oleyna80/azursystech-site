---
name: azursystech-form-contract
description: Use when implementing or updating any lead capture form, contact flow, validation rules, submission payload, thank-you flow, or analytics events for AzurSysTech. This skill enforces the form contract from forms-spec, lead intake, lead taxonomy, and analytics docs so RooCode does not invent fields, break source tags, or drift from the CRM/Sheets handoff model.
---

# AzurSysTech Form Contract

Use this skill for:
- homepage lead form
- contact form
- chat handoff form
- thank-you flow
- submission payload mapping
- analytics events for forms

## What to read first

1. `AGENTS.md`
2. `memory_bank/decisions.md`
3. `02_website/forms-spec.md`
4. `03_leads/lead-intake-spec.md`
5. `03_leads/lead-taxonomy.md`
6. `02_website/analytics-spec.md`

## Implementation rules

- Do not invent extra fields unless the source docs explicitly allow them.
- Keep field keys aligned with the canonical specs.
- Keep source taxonomy aligned with `03_leads/lead-taxonomy.md`.
- Preserve segment branching:
  - `particulier`
  - `tpe`
- Keep launch contact methods aligned with accepted decisions:
  - phone
  - WhatsApp
  - form
  - site chat

## Validation rules

- Required fields must match the form spec.
- Submission payload must be CRM/Sheets compatible.
- `facebook_messenger` and other source tags must remain SSOT-aligned.
- Analytics events must not use deprecated source tags.

## Output checklist for RooCode

1. forms/fields implemented
2. branching implemented
3. payload shape
4. analytics events added
5. remaining TODOs or stubs

## References

- `references/field-contract.md`

