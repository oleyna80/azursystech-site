# SPEC (Historical Reference): AZR-003-010 Launch Intake Path `site -> n8n -> Google Sheets`

Status note (2026-04-13):
- This spec remains valid as a historical launch activation record.
- Current primary intake architecture is backend-first SQL (`ADR-020`).
- `n8n -> Google Sheets` is optional secondary automation/export, not mandatory intake baseline.

## Problem

Launch sequence requires a live-safe intake path into Google Sheets without CRM scope drift.

Current site boundary is already implemented and enforces:
- validated payload only
- no fake success
- fallback statuses on non-ready/downstream-failure

## Goal

Enable and verify `site -> n8n -> Google Sheets` using the approved transport contract from:
- `docs/specs/azr-002-site-n8n-hubspot-contract.md` sections `1-6`

Without:
- HubSpot/CRM coupling
- undocumented webhook/auth/property assumptions
- silent success behavior

## In Scope

1. Site boundary readiness verification
2. Exact n8n workflow requirements for Google Sheets sink
3. Explicit mapping of validated payload fields to sheet columns
4. Blocker register with owner and next action
5. Verifiable test path and acceptance criteria

## Out of Scope

- HubSpot/CRM object/property setup
- Telegram notifications
- AI widget live integration
- UI/page redesign

## 1) Site Boundary Readiness (Local)

Verified in code:
- `web/src/lib/contact-submit.ts`
  - validates documented fields only
  - preserves `source = website_form`
  - preserves `status = New`
- `web/src/app/api/contact/submit/route.ts`
  - sends contract headers `Authorization`, `X-Contract-Version`, `X-Idempotency-Key`
  - returns `integration_not_ready` when env is not configured
  - returns `submit_failed` when downstream request fails
  - returns `success` only on upstream `200 + {"status":"accepted"}`

Runtime/env contract (already documented):
- `AZURSYSTECH_CONTACT_SUBMIT_ENABLED`
- `AZURSYSTECH_CONTACT_SUBMIT_BASE_URL`
- `AZURSYSTECH_CONTACT_SUBMIT_TOKEN`

## 2) n8n -> Google Sheets Requirements

### Webhook ingress (must match approved transport)

- Path: `/webhook/azursystech/contact-submit`
- Method: `POST`
- Content-Type: `application/json`
- Headers expected from site:
  - `Authorization: Bearer <token>`
  - `X-Contract-Version: 1`
  - `X-Idempotency-Key: <uuid-v4>`

### Required n8n workflow behavior

1. Validate auth token and contract-version header.
2. Parse JSON body as validated payload from site.
3. Perform idempotency dedupe with key from `X-Idempotency-Key` for 24h window.
4. Append one row to Google Sheets using the mapping in section 3.
5. Return one of the approved response schemas:
  - success: `200 {"status":"accepted","request_id":"..."}`
  - temporary failure: `503 {"status":"temporary_failure","message":"...","request_id":"..."}`
  - rejected: `400|401|403|422 {"status":"rejected","message":"...","request_id":"..."}`

## 3) Mapping: validated payload -> Google Sheets columns

Column names MUST stay aligned with validated payload keys.

| Payload field | Sheet column | Type | Rule |
|---|---|---|---|
| `source` | `source` | text | `website_form` (form), `website_chat` (site chat), `whatsapp_chat` (WhatsApp bot) |
| `status` | `status` | text | must stay `New` at intake append |
| `name` | `name` | text | direct |
| `phone` | `phone` | text | direct |
| `email` | `email` | text | optional, blank if absent |
| `city` | `city` | text | direct |
| `segment` | `segment` | text | `particulier` or `tpe` |
| `service_type` | `service_type` | text | direct enum |
| `problem_description` | `problem_description` | text | direct |
| `device_count` | `device_count` | text | optional enum |
| `onsite_required` | `onsite_required` | text | optional enum |
| `urgency` | `urgency` | text | optional enum |
| `company_name` | `company_name` | text | optional, typically `tpe` |
| `business_type` | `business_type` | text | optional, `tpe` only |
| `workstation_count` | `workstation_count` | text | optional, `tpe` only |
| `business_needs` | `business_needs` | text | optional; JSON array in transport — serialize to JSON string or comma-separated in sheet column |
| `business_address` | `business_address` | text | optional, `tpe` only |
| `home_device_type` | `home_device_type` | text | optional; JSON array in transport — serialize to JSON string or comma-separated in sheet column |
| `device_state` | `device_state` | text | optional, `particulier` only |
| `home_need_type` | `home_need_type` | text | optional; JSON array in transport — serialize to JSON string or comma-separated in sheet column |

Launch-safe operational columns (non-payload, optional but recommended):
- `received_at_utc`
- `request_id`
- `idempotency_key`

## 4) Blocker Register (for real live enablement)

| Blocker | Missing item | Owner | Next action |
|---|---|---|---|
| B1 | real `AZURSYSTECH_CONTACT_SUBMIT_BASE_URL` for live n8n | VPS/n8n stream | provide final base URL and confirm reachable webhook path |
| B2 | production `AZURSYSTECH_CONTACT_SUBMIT_TOKEN` + rotation handoff | Security Reviewer + VPS/n8n stream | issue token via secret manager/env channel and confirm rotation rule |
| B3 | Google Sheets target details (sheet ID + tab name + write credential in n8n) | Founder + VPS/n8n stream | provide target sheet coordinates and attach n8n credential with write access |
| B4 | n8n workflow response schema compliance not yet proven in environment | VPS/n8n stream | return test evidence for accepted/temporary_failure/rejected schemas |
| B5 | idempotency dedupe implementation evidence for 24h window | VPS/n8n stream | show duplicate submission test with same idempotency key |

`AZR-003-010` cannot be marked done until B1-B5 are closed.

## 5) Verifiable Test Path

### A. Local boundary dry-run (done in this pass)

1. No integration config -> expect `503 integration_not_ready`.
2. Honeypot filled -> expect `200 spam_detected`.
3. Integration enabled with unreachable base URL -> expect `502 submit_failed`.

### B. Controlled test lead (required for live enable)

1. Configure real runtime env values on target runtime.
2. Submit one valid lead from `/contact`.
3. Verify row appended in target Google Sheet.
4. Verify site response path follows upstream schema (`success` only on accepted).

### C. E2E acceptance criteria

- AC1: webhook call reaches n8n with contract headers.
- AC2: validated payload fields are appended in mapped columns without field drift.
- AC3: fallback remains honest on downstream errors.
- AC4: no HubSpot/CRM dependency in launch intake path.

## Rollback Instruction

If downstream becomes unstable, set:
- `AZURSYSTECH_CONTACT_SUBMIT_ENABLED=false`

Result:
- site returns `integration_not_ready` fallback
- contact channels (phone/WhatsApp/email) remain available for launch-safe intake
