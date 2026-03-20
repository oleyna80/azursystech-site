# AZR-003 Tasklist

Status: TODO

## First Execution Queue

1. `AZR-003-001` legal identity and business data
2. `AZR-003-003` launch contact flow
3. `AZR-003-004` deploy secrets and VPS runtime config
4. `AZR-003-005` launch AI mode

## Tasks

- AZR-003-001: Finalize legal identity and business data
  Owner: Founder
  Priority: P0
  Depends on: none
  Acceptance Criteria:
  - AC1: legal identity fields are no longer placeholders
  - AC2: business identity required for public launch is confirmed
  - AC3: legal pages can be published without visible draft values
  Status: in_progress

- AZR-003-002: Finalize hosting data
  Owner: Founder
  Priority: P0
  Depends on: AZR-003-001
  Acceptance Criteria:
  - AC1: hosting provider name is known
  - AC2: hosting provider address/contact data is filled where required
  - AC3: legal/hosting references are publishable
  Status: done

- AZR-003-003: Finalize launch contact flow
  Owner: Founder
  Priority: P0
  Depends on: none
  Acceptance Criteria:
  - AC1: phone yes/no is decided
  - AC2: WhatsApp yes/no is decided
  - AC3: public contact flow is consistent across site, Facebook, and GBP
  Status: done

- AZR-003-004: Populate deploy secrets and VPS runtime config
  Owner: Tech Lead
  Priority: P0
  Depends on: AZR-003-003
  Acceptance Criteria:
  - AC1: required GitHub secrets are populated
  - AC2: VPS `.env` contains production-ready values
  - AC3: deployment path is no longer blocked by missing runtime config
  Status: in_progress

- AZR-003-005: Decide launch AI mode
  Owner: Founder
  Priority: P0
  Depends on: AZR-003-003
  Acceptance Criteria:
  - AC1: launch mode is explicitly one of `manual-assisted only`, `dry-run only`, or `live`
  - AC2: if `live`, operator and approval boundaries are confirmed and limited to intake + summary + handoff
  - AC3: if not `live`, team launch docs do not assume live runtime
  Status: done

- AZR-003-006: Confirm GBP and review readiness
  Owner: Founder
  Priority: P1
  Depends on: AZR-003-003
  Acceptance Criteria:
  - AC1: GBP setup baseline is actionable
  - AC2: review request process is operationally usable
  - AC3: local presence flow is aligned with launch contact logic
  Status: todo

- AZR-003-007: Prepare go / no-go review
  Owner: Tech Lead
  Priority: P0
  Depends on: AZR-003-001, AZR-003-002, AZR-003-003, AZR-003-004, AZR-003-005, AZR-003-006
  Acceptance Criteria:
  - AC1: every launch blocker has an explicit status
  - AC2: unresolved blockers are not mislabeled as post-launch work
  - AC3: founder can make a go / no-go decision based on the package
  Status: todo

- AZR-003-008: Separate deferred improvements from blockers
  Owner: Tech Lead
  Priority: P1
  Depends on: AZR-003-007
  Acceptance Criteria:
  - AC1: post-launch improvements are listed separately
  - AC2: no launch decision depends on a deferred item
  - AC3: the team has a clean post-launch queue
  Status: todo

- AZR-003-010: Lock integration contract site → n8n → Google Sheets
  Owner: Tech Lead + Founder
  Priority: P0
  Depends on: AZR-003-004
  Spec: docs/specs/azr-003-010-site-n8n-google-sheets.md
  Blockers:
  - B1 (BLOCKED): live AZURSYSTECH_CONTACT_SUBMIT_BASE_URL not set in VPS .env
  - B2 (BLOCKED): production AZURSYSTECH_CONTACT_SUBMIT_TOKEN not generated/set; rotation SOP missing
  - B3 (BLOCKED): Google Sheets target (sheet ID, tab name, write credential) not fixed in SSOT
  - B4 (PARTIAL): site-side response schema verified in code; n8n workflow response nodes not verified
  - B5 (BLOCKED): idempotency key generation and 24h dedupe not implemented
  Acceptance Criteria:
  - AC1: B1 closed — live n8n webhook URL set in VPS .env and read by route.ts
  - AC2: B2 closed — production token set in VPS .env, n8n Header Auth configured, rotation SOP documented
  - AC3: B3 closed — sheet ID, tab name, write credential confirmed and set in n8n
  - AC4: B4 closed — n8n workflow verified, controlled test passed, all response codes confirmed
  - AC5: B5 closed — idempotency key generated site-side, dedupe checked in n8n, 24h proof done
  - AC6: rollback-safe default preserved until full test pass complete
  Status: blocked
