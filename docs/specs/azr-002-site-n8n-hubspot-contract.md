# SPEC: AZR-002 Site -> n8n -> HubSpot Contract Lock

## Problem

`/contact` submit path already has a safe site-side boundary, but until now it had no approved transport contract for the outbound `site -> n8n` hop. This kept the route in a provisional `integration_not_ready` state.

## Goal

Lock an explicit `v1` transport contract for the website submit path so implementation can proceed without guessing endpoint, auth, timeout, retry, idempotency, or response semantics.

## Supersession Note (2026-03-19)

- Sections `1`-`6` remain valid as the approved transport baseline for `site -> n8n`.
- HubSpot mapping in section `7` is no longer the active launch baseline.
- Current launch path is:
  - `site -> n8n -> Google Sheets`
  - AI widget live integration + Telegram notification later
  - CRM in a later phase
- Section `7` is retained only as a historical phase-2 CRM reference.

## Lifecycle State

- Current state: `transport contract approved`
- Ticket result: `AZR-002-023` is approved as a transport-baseline decision
- `ready-for-implementation`: `APPROVED` for site adapter implementation only
- Still not approved:
  - production deploy changes
  - live workflow enablement
  - HubSpot object/property mapping
  - secret provisioning in live environments

## Ticket Binding

- Parent ticket: `AZR-002`
- Stream task: `AZR-002-023`
- Stream type: integration-contract stream

## Scope

1. Endpoint boundary contract for `site -> n8n`
2. Auth contract
3. `site -> n8n` payload contract
4. Response contract back to site
5. Operational constraints for the transport layer

## Out of Scope

- UI/page updates in `web/src/app/*`
- runtime/infra deployment changes
- production adapter coding
- live workflow enablement
- HubSpot object decisions beyond transport necessity
- full HubSpot property mapping
- secret values in repository artifacts

## SSOT Sources Used

- `AGENTS.md`
- `memory_bank/context.md`
- `memory_bank/decisions.md`
- `memory_bank/progress.md`
- `02_website/forms-spec.md`
- `03_leads/lead-intake-spec.md`
- `03_leads/lead-taxonomy.md`
- `03_leads/crm-pipeline.md`
- `07_ops/launch-checklist.md`
- boundary code:
  - `web/src/app/api/contact/submit/route.ts`
  - `web/src/lib/contact-submit.ts`

## Approved v1 Transport Contract

### 1) Endpoint

- Endpoint URL/path: `<n8n-base-url>/webhook/azursystech/contact-submit`
- Canonical path: `/webhook/azursystech/contact-submit`
- HTTP method: `POST`
- `Content-Type`: `application/json`
- Required headers:
  - `Content-Type: application/json`
  - `Authorization: Bearer <token>`
  - `X-Contract-Version: 1`
  - `X-Idempotency-Key: <uuid-v4>`
- Versioning rule:
  - header-based versioning only
  - current approved version: `X-Contract-Version: 1`
  - breaking transport changes require a new integer contract version

### 2) Auth

- Auth scheme: `Authorization: Bearer <token>`
- Exact auth header name: `Authorization`
- Additional required headers:
  - `X-Contract-Version`
  - `X-Idempotency-Key`
- Secret storage rule:
  - token stored only in runtime env / `.env`
  - token must not appear in repository, docs, logs, or client-side payloads
- Minimal secret rotation rule:
  - rotate with a dual-token overlap window of `24h`
  - sequence:
    1. add new token on receiving side
    2. update site runtime secret
    3. verify one successful non-live test call
    4. remove old token within `24h`

### 3) Timeout / Retry / Idempotency

- Request timeout: `10s`
- Retry policy:
  - website performs `0` automatic retries
  - downstream retries, if any, are handled outside the website transport layer
- Idempotency rule:
  - website must send `X-Idempotency-Key` as `uuid-v4`
  - deduplication window: `24h`
  - duplicate request with the same idempotency key must not create a second downstream write
  - duplicate request may return the same accepted status category as the original request

### 4) Payload Contract `site -> n8n`

- Serialization: JSON object
- Transform policy: `1:1` from validated site payload to outbound JSON body
- Transport baseline fields:
  - `source`
  - `status`
  - `name`
  - `phone`
  - `email`
  - `city`
  - `segment`
  - `service_type`
  - `problem_description`
  - `device_count`
  - `onsite_required`
  - `urgency`
  - `company_name`
  - `business_type`
  - `workstation_count`
  - `business_needs`
  - `business_address`
  - `home_device_type`
  - `device_state`
  - `home_need_type`
- Transport invariants:
  - `source = website_form`
  - `status = New`
  - arrays remain arrays
  - field names are not remapped in `v1`

### 5) Response Contract `n8n -> site`

- Success response:
  - HTTP status: `200`
  - schema:
    ```json
    {
      "status": "accepted",
      "request_id": "string"
    }
    ```
- Temporary failure response:
  - HTTP status: `503`
  - schema:
    ```json
    {
      "status": "temporary_failure",
      "message": "string",
      "request_id": "string"
    }
    ```
- Permanent failure response:
  - HTTP status: `400 | 401 | 403 | 422`
  - schema:
    ```json
    {
      "status": "rejected",
      "message": "string",
      "request_id": "string"
    }
    ```
- Deterministic success rule:
  - site boundary may return `success` only if upstream explicitly returns `200` with `status = accepted`
  - any other upstream result must map to non-success handling on site side

### 6) Operational Constraints

- Exposure mode: `proxy-protected`
- Rate-limit expectation: `none` at contract layer for `v1`
- Logging/redaction rule:
  - allowed structured log fields:
    - `request_id`
    - `source`
    - `segment`
    - `service_type`
    - `status`
    - upstream result status
  - must not log:
    - `Authorization` header
    - bearer token value
    - `X-Idempotency-Key`
    - raw request body
    - full `problem_description`
    - `phone`
    - `email`
    - `business_address`
- No-secret exposure rule in error payloads:
  - error payloads may include only safe fields defined in the response schema
  - no secrets, stack traces, internal headers, or internal URLs with credentials

## 7) Historical HubSpot Object / Property Mapping (approved 2026-03-15, deferred on 2026-03-19)

### Object model

- **Contact** = person entity for communication; standard fields only, no custom contact properties.
- **Deal** = specific request/lead with site payload attributes; custom properties below.
- One form submission creates or updates one Contact and creates one Deal.

### Contact mapping

| Site payload field | HubSpot object | Label (UI) | Internal name | Notes |
|---|---|---|---|---|
| `name` | Contact | First name | `firstname` | Full `name` field maps here; `lastname` left empty, not parsed |
| — | Contact | Last name | `lastname` | Always empty at MVP |
| `phone` | Contact | Phone number | `phone` | Primary contact number |
| `email` | Contact | Email | `email` | Optional |
| `city` | Contact | City | `city` | Standard contact field |
| `company_name` | Contact | Company name | `company` | Filled only for TPE segment |

### Deal: standard properties

| Site payload field | HubSpot object | Label (UI) | Internal name | Notes |
|---|---|---|---|---|
| `status` | Deal | Deal stage | `dealstage` | Canonical stages from `crm-pipeline.md`: `new`, `need_info`, `qualified`, `contacted`, `waiting_reply`, `visit_planned`, `quote_sent`, `won`, `lost`, `follow_up_later` |

### Deal: custom properties

| Site payload field | HubSpot object | Label (UI) | Internal name | Field type | Values |
|---|---|---|---|---|---|
| `segment` | Deal | Lead segment | `lead_segment` | Dropdown select | `particulier`, `tpe` |
| `service_type` | Deal | Service type | `service_type` | Dropdown select | `depannage_pc`, `installation_pc`, `wifi`, `imprimante`, `reseau_local`, `partage_fichiers`, `poste_travail`, `petite_infra_tpe`, `autre` |
| `urgency` | Deal | Urgency | `urgency` | Dropdown select | `urgent`, `standard`, `planning` |
| `source` | Deal | Source | `lead_source` | Dropdown select | `website_form`, `website_chat`, `facebook_page`, `facebook_group`, `facebook_messenger`, `direct`, `referral`, `google_business_profile`, `organic_search`, `unknown_source` |
| `problem_description` | Deal | Problem summary | `problem_summary` | Single-line text | Mapped from site `problem_description` |
| `device_count` | Deal | Device count | `device_count` | Dropdown select | `1`, `2-3`, `4-10`, `10+` |
| `onsite_required` | Deal | Onsite required | `onsite_required` | Dropdown select | `yes`, `no`, `not_sure` |

### Deal: Note format for overflow fields

All segment-specific and supplementary fields that are not Deal custom properties are written as a single structured Note on the Deal at creation time:

```text
Intake payload (MVP)

segment: {{lead_segment}}
service_type: {{service_type}}
urgency: {{urgency}}
source: {{lead_source}}

# TPE-only (omit if particulier)
business_type: {{business_type}}
workstation_count: {{workstation_count}}
business_needs: {{business_needs}}
business_address: {{business_address}}

# Particulier-only (omit if tpe)
home_device_type: {{home_device_type}}
device_state: {{device_state}}
home_need_type: {{home_need_type}}

# Common
device_count: {{device_count}}
onsite_required: {{onsite_required}}
problem_description_raw: {{problem_description}}
```

Rules:
- `problem_description` is duplicated in Note as `problem_description_raw` to preserve full context alongside the Deal property `problem_summary`
- Fields absent for a given segment may be omitted or set to `n/a`
- Arrays (e.g. `business_needs`, `home_device_type`, `home_need_type`) are serialized as comma-separated values

### Corrections applied to CRM stream proposal

| Field | CRM stream proposed | Control-layer corrected | Reason |
|---|---|---|---|
| `service_type` values | `support_ponctuel`, `maintenance_recurrente`, `installation_projet`, `conseil` | 9 values from site payload | Must match `contact-submit.ts` enum |
| `urgency` values | `low`, `medium`, `high` | `urgent`, `standard`, `planning` | Must match `contact-submit.ts` enum |
| `lead_source` values | `site_web`, `telephone`, `whatsapp`, `reference`, `autre` | 10 values from `lead-taxonomy.md` | Must match canonical source taxonomy |
| `device_count` type | Number | Dropdown select (`1`, `2-3`, `4-10`, `10+`) | Site sends string enum, not integer |
| `onsite_required` type | Checkbox (true/false) | Dropdown select (`yes`, `no`, `not_sure`) | Site sends 3-option enum, not boolean |

## Remaining Follow-Up Items

The following items remain outside this approval and still require separate follow-up work:

- pipeline ID / stage ID provisioning in HubSpot
- Google Sheets target sheet/tab provisioning
- live n8n workflow enablement
- production secret provisioning

These are downstream follow-up items. For launch, Google Sheets provisioning now matters; HubSpot provisioning is phase-2 only.

## Compatibility With Current Site Boundary

Current boundary behavior remains valid and launch-safe:

1. `web/src/lib/contact-submit.ts`
   - validates allowed fields only
   - preserves `source = website_form`
   - preserves `status = New`
2. `web/src/app/api/contact/submit/route.ts`
   - keeps no-fake-success behavior
   - allows `integration_not_ready` fallback until runtime adapter is actually wired
   - keeps redirect-safe `success` semantics only on true upstream acceptance

## Final Decision Snapshot

- `AZR-002-023`: `APPROVED`
- Decision type: `transport baseline approved; HubSpot mapping retained as deferred phase-2 reference`
- Live enablement: `NOT APPROVED`
- Production deploy changes: `NOT APPROVED`
- HubSpot property mapping: `DEFERRED FOR PHASE 2` (2026-03-19)
- Pipeline ID / stage ID provisioning: `DEFERRED`

## Acceptance Criteria for This Pass

- endpoint, auth, timeout/retry/idempotency, response semantics, and operational constraints are fixed with exact values
- `site -> n8n` payload transform rule is explicit
- transport boundary is fixed and launch-ready for downstream `n8n` work
- deferred HubSpot object model remains documented for a later CRM phase
- no undocumented assumptions are left inside the transport or mapping boundary
- current site boundary remains compatible with the approved contract
