# AZR-003 Tasklist

Status: IN_PROGRESS

## Remaining Execution Queue

### Launch-critical path

1. `AZR-003-001` legal identity and business data
2. `AZR-003-006` GBP and review readiness
3. `AZR-003-007` go / no-go review

### After intake activation and go / no-go

5. `AZR-003-011` add AI widget live integration + Telegram notification
6. `AZR-003-008` deferred improvements separation

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
  Status: done

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
  Depends on: AZR-003-001, AZR-003-002, AZR-003-003, AZR-003-004, AZR-003-005, AZR-003-006, AZR-003-009, AZR-003-010
  Acceptance Criteria:
  - AC1: every launch blocker has an explicit status
  - AC2: unresolved blockers are not mislabeled as post-launch work
  - AC3: founder can make a go / no-go decision based on the package
  Status: todo

- AZR-003-009: Close remaining website scope before new integrations
  Owner: RooCode
  Priority: P1
  Depends on: none
  Acceptance Criteria:
  - AC1: `/about` trust/founder page is implemented
  - AC2: four Phase 1.5 SEO service pages are implemented
  - AC3: legal/privacy pages are ready for real data injection once founder closes `AZR-003-001`
  - AC4: website-side scope is not blocked by pending CRM work
  Status: done
  Delivery notes (2026-03-19):
  - added `/about` trust/founder route
  - added `/services/new-pc-setup`, `/services/wifi-printer`, `/services/tpe-setup`, `/services/onsite-support`
  - applied legal/privacy readiness pass without changing legal facts
  - preserved launch contact model and shell compatibility

- AZR-003-010: Enable launch intake path `site -> n8n -> Google Sheets`
  Owner: VPS / n8n stream
  Priority: P0
  Depends on: AZR-003-009
  Acceptance Criteria:
  - AC1: `site -> n8n` webhook is configured against the approved transport contract
  - AC2: validated form submissions are written to the launch Google Sheet
  - AC3: test lead proves end-to-end form intake without CRM dependency
  - AC4: live workflow keeps launch-safe fallback behavior on site when downstream fails
  Status: done
  Delivery notes (2026-03-19):
  - integration contract + mapping spec prepared: `docs/specs/azr-003-010-site-n8n-google-sheets.md`
  - local boundary dry-run verified `integration_not_ready`, `spam_detected`, and `submit_failed` branches
  - exact live blockers recorded (n8n base URL, token provisioning, sheet target, response-schema proof, idempotency proof)
  Delivery notes (2026-03-20):
  - live webhook activated on `https://n8n.hardwarelab.org/webhook/azursystech/contact-submit`
  - shared submit token rotated, runtime env updated, and services restarted
  - Google Sheets sink connected to `intake_leads` with successful append path
  - live tests passed for `accepted`, `rejected(auth_failed)`, and duplicate-ignore behavior
  - duplicate path confirmed without `Google Sheets Append Row` execution

- AZR-003-011: Add AI widget live integration and Telegram contact notification
  Owner: AI / integration stream
  Priority: P1
  Depends on: AZR-003-010
  Acceptance Criteria:
  - AC1: AI widget live integration is enabled only after the basic intake path is stable
  - AC2: Telegram notification is sent for new contact/intake events
  - AC3: no autonomous outbound, pricing, or scheduling behavior is introduced
  - AC4: primary launch path (`/contact`, phone, WhatsApp) remains usable if the widget is unavailable
  Status: todo

- AZR-003-008: Separate deferred improvements from blockers
  Owner: Tech Lead
  Priority: P1
  Depends on: AZR-003-007, AZR-003-011
  Acceptance Criteria:
  - AC1: post-launch improvements are listed separately
  - AC2: no launch decision depends on a deferred item
  - AC3: the team has a clean post-launch queue
  Status: todo
