---
name: azursystech-contract-verifier
description: Verify AzurSysTech schema-bound changes before closeout, especially routes/forms/assistants where docs, shared schema, UI, API response shape, payload, mobile UX, assistant guardrails, and Memory Bank/tasklist updates must match. Use for hard review after implementation and before accepting work.
---

# AzurSysTech Contract Verifier

Use this skill as a hard review gate. Prefer findings first. Do not edit files while using this skill.

## Inputs

Read the task docs and implementation:

1. Route/form spec in `02_website/`
2. Lead/schema contract in `03_leads/`
3. Assistant spec in `05_ai/` when an assistant/helper is involved
4. Changed files under `web/src/app`, `web/src/components`, `web/src/lib`, and `web/src/app/api`
5. Relevant `memory_bank/*` and `docs/tasklist/*` closeout entries

## Review Order

1. Route existence and scope
   - Route exists in `web/src/app`.
   - Page copy is in the required public language.
   - Scope does not widen into unrelated site redesign.
2. Schema/UI/API contract
   - Field keys match the schema.
   - Required and optional flags match the schema.
   - UI imports the shared schema/validation module.
   - Select and multi-select values are canonical API values, not display labels.
   - API response shape matches frontend submit handling.
   - Negative validation proves required fields cannot be bypassed.
3. Assistant/helper behavior
   - Optional and visible.
   - Field-oriented and concise.
   - Does not auto-fill without user action.
   - Does not give price, timeline, guaranteed fit, ROI, final architecture, or integration promises.
   - Mobile helper does not block the form.
4. Payload and handoff
   - Payload includes schema version, source, route, locale, timestamp, submitted values, metadata, and human-readable handoff.
   - New schemas are not forced into incompatible legacy contact/intake models.
   - Any lack of durable persistence is explicitly documented as a risk or follow-up.
5. Responsive/browser checks
   - Mobile around 390px has no horizontal overflow.
   - Desktop around 1365px has no horizontal overflow.
   - User can complete a valid submit.
   - Invalid submit shows field-specific errors.
6. SSOT closeout
   - `memory_bank/progress.md` records done/checks/risks.
   - Relevant tasklist entry is updated.
   - ADR is added only for real architecture/runtime decisions.
7. Security contract review when the change touches routes, auth, admin,
   webhooks, storage, browser rendering, or external-provider behavior
   - Run or verify the `sdd-protocol.md § Tier Full` security checklist.
   - Confirm CSP/security headers are preserved for browser apps.
   - Confirm admin CSRF changes preserve the readable-cookie-to-CSP dependency.
   - Confirm mutation endpoints have CSRF/origin/webhook/scheduler guard.
   - Confirm errors and logs do not expose secrets, tokens, SQL/provider
     internals, full request bodies, or client-private message bodies.

## Minimum Commands

Run checks per `sdd-protocol.md § Check Suite → Tier Full`, or verify equivalent evidence.

For API checks, use one valid payload and one negative payload for a required field. For browser checks, use Playwright or an equivalent real browser flow on mobile and desktop.

## Verdict Format

Return:

- `verdict: PASS|FAIL`
- `blockers`
- `non-blocking risks`
- `commands/evidence reviewed`
- `files reviewed`

Reject if schema and UI diverge, the assistant becomes a consultant, required fields are bypassable, mobile UX blocks completion, success copy overpromises, or a security-sensitive change fails the Tier Full security checklist.

## Handoff
- **Success condition**: verdict `PASS` выдан, нет blockers.
- **Next**: ssot-sync-closeout (при PASS) / azursystech-scoped-coder (при NEEDS_CHANGES, один цикл)
- **Auto-proceed**: 🟢 YES на PASS; 🔴 вручную на BLOCKED
- **Hard stop**: 🔴 BLOCKED — остановить pipeline, сообщить Owner.
