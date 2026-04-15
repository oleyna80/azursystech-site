# AZR-003 Tasklist

Status: IN_PROGRESS

## Remaining Execution Queue

### Completed launch-critical path

1. `AZR-003-001` legal identity and business data
2. `AZR-003-006` GBP and review readiness
3. `AZR-003-007` go / no-go review

### After intake activation and go / no-go

4. `AZR-003-012` frontend baseline parity / migration closure
5. `AZR-003-013` sync public phone / WhatsApp across current `web` baseline and docs
6. `AZR-003-011` add AI widget live integration + Telegram notification on `web` (backend events path)
7. `AZR-003-008` deferred improvements separation

## Tasks

- AZR-003-001: Finalize legal identity and business data
  Owner: Founder
  Priority: P0
  Depends on: none
  Acceptance Criteria:
  - AC1: legal identity fields are no longer placeholders
  - AC2: business identity required for public launch is confirmed
  - AC3: legal pages can be published without visible draft values
  Status: done
  Delivery notes (2026-04-13):
  - legal identity baseline is treated as closed in current control-layer context
  - publishable legal/privacy/terms pages exist in `web`
  - public contact consistency must be maintained through separate phone/contact sync checks when contact data changes

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
  Status: done
  Delivery notes (2026-03-28):
  - founder confirmed all required evidence points from `docs/reports/azr-003-006-gbp-review-readiness-pack.md`:
    - GBP baseline complete
    - site/GBP contact consistency confirmed
    - review request flow usable
    - review evidence capture method defined
  - closure reflected in control-layer tracking artifacts (`docs/tasklist`, `07_ops/task-board.md`, `07_ops/launch-checklist.md`, `memory_bank/progress.md`)

- AZR-003-007: Prepare go / no-go review
  Owner: Tech Lead
  Priority: P0
  Depends on: AZR-003-002, AZR-003-003, AZR-003-004, AZR-003-005, AZR-003-006, AZR-003-009, AZR-003-010
  Acceptance Criteria:
  - AC1: every launch blocker has an explicit status
  - AC2: unresolved blockers are not mislabeled as post-launch work
  - AC3: founder can make a go / no-go decision based on the package
  Status: done
  Delivery notes (2026-03-30):
  - decision package refreshed to current SSOT-only inputs (`docs/reports/azr-003-007-go-no-go-package.md`)
  - launch-ready baseline, non-blocking conditions, and post-launch queue remain explicitly separated
  - founder decision formally confirmed by control layer: `GO`
  - formal closure reflected in control-layer tracking artifacts

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
  Delivery notes (2026-04-13):
  - this path remains valid as historical launch activation evidence
  - current primary intake architecture is backend-first SQL (ADR-020)
  - n8n/Sheets are optional secondary automation/export layers, not mandatory intake baseline

- AZR-003-014: Backend-first SQL intake core hardening on `web`
  Owner: Tech Lead
  Priority: P0
  Depends on: AZR-003-012
  Acceptance Criteria:
  - AC1: `/api/contact/submit` supports backend-first write into SQL intake storage
  - AC2: runtime storage modes are explicit and controllable (`legacy`, `dual`, `sql_primary`)
  - AC3: launch-critical intake behavior is not blocked by n8n availability
  - AC4: SSOT/docs no longer represent n8n as mandatory primary intake path
  Status: done
  Delivery notes (2026-04-13):
  - SQL schema and storage adapter added in `web`
  - `contact-submit` route supports SQL write and `sql_primary` behavior
  - runtime wiring on target environment (`DATABASE_URL`, schema apply, controlled smoke) was the pending step at that date and is now closed
  Delivery notes (2026-04-14):
  - VPS compose runtime env contract expanded for SQL intake: `INTAKE_STORAGE_MODE`, `DATABASE_URL`
  - deploy runbook updated with SQL runtime requirements and verification commands
  - `.env.vps.example` restored/added as canonical VPS env template without secrets
  Delivery notes (2026-04-14 runtime proof):
  - self-hosted PostgreSQL runtime verified on VPS in compose stack (`healthy`)
  - schema apply confirmed with all 4 intake tables present
  - controlled submit to `/api/contact/submit` succeeded with SQL persistence evidence
  - `intake_leads` and `intake_lead_events` writes confirmed for proof marker/test lead
  - backup and restore scripts executed successfully (restore-check passed)
  - launch intake runtime baseline accepted as `SQL-first confirmed`
  Delivery notes (2026-04-14 repo sync):
  - repository deployment/runtime artifacts aligned with SQL-first VPS baseline
  - `docker-compose.vps.yml` includes internal `postgres` service + persistent volume
  - PostgreSQL backup/restore scripts added to `scripts/`
  - deployment runbooks updated for SQL backup/restore and env/runtime checks

- AZR-003-012: Close `frontend_mvp -> web` baseline parity / migration
  Owner: Tech Lead
  Priority: P0
  Depends on: AZR-003-010, AZR-003-007
  Acceptance Criteria:
  - AC1: active website/design/runtime baseline is unambiguous
  - AC2: launch-critical work targets `web`, not `frontend_mvp`
  - AC3: transferred design/contact/legal/runtime parity work is reflected in SSOT
  - AC4: `frontend_mvp` is retained only as historical/reference unless a separate sandbox task is explicitly opened
  Status: done
  Delivery notes (2026-04-13):
  - founder clarified that `frontend_mvp` is no longer current; design and relevant work have been transferred to `web`
  - `web` is the current website/design/runtime/deploy baseline
  - `frontend_mvp` is historical/reference only
  - next launch-critical implementation target is `AZR-003-011` on `web`

- AZR-003-011: Add AI widget live integration and Telegram contact notification
  Owner: AI / integration stream
  Priority: P1
  Depends on: AZR-003-012, AZR-003-013, AZR-003-014
  Acceptance Criteria:
  - AC1: AI widget live integration is enabled only after backend-first SQL intake path is stable
  - AC2: Telegram notification is sent for new contact/intake events
  - AC3: no autonomous outbound, pricing, or scheduling behavior is introduced
  - AC4: primary launch path (`/contact`, phone, WhatsApp) remains usable if the widget is unavailable
  Status: todo
  Delivery notes (2026-04-15 security baseline):
  - chat/contact runtime hardening landed in `web` as readiness prerequisite:
    - request size guards, chat length limits, response sanitization
    - contact submit per-IP rate limit and webhook base URL validation
    - production `/health` metadata reduced
    - `next`/`eslint-config-next` bumped to `16.2.3`
  Delivery notes (2026-04-15 p1 hardening continuation):
  - app-level defense-in-depth baseline added in `web`:
    - Next-level security headers via `next.config.ts`
    - API origin policy via `web/src/proxy.ts` (`Origin`-aware allowlist, safe no-Origin pass-through)
    - configurable DB TLS mode via `DATABASE_SSL_MODE` in `intake-storage.ts` with backward-compatible default `disable`
  Delivery notes (2026-04-15 p1 continuation delivery):
  - migrated deprecated Next middleware convention to `web/src/proxy.ts` with same `/api/:path*` behavior.
  - added CI security gate in `web/package.json`: `check:security` included at end of `check:ci`.
  - this pass does not close `AZR-003-011`; Telegram notification and full live AI integration remain pending scope.
  Delivery notes (2026-04-15 lint unblock):
  - cleared pre-existing CI lint blockers in `web/src/components/chat-widget.tsx` and `web/src/components/shell/site-header.tsx`.
  - `npm run lint` and `npm run check:ci` now pass on current branch.
  Delivery notes (2026-04-15 DB SSL rollout pack):
  - prepared `scripts/postgres-ssl-rollout.sh` for `DATABASE_SSL_MODE` safe rollout with:
    - dry-run precheck,
    - `.env` timestamped backup,
    - PostgreSQL `SHOW ssl;` gate for `require|verify-full`,
    - app restart + in-container Node/pg DB probe (`select 1`),
    - automatic rollback on probe failure.
  - updated deployment/runbook docs with exact commands and fallback note.
  - this delivery prepared operations artifacts; execution status is documented in the next delivery note block.
  Delivery notes (2026-04-15 DB SSL rollout execution):
  - VPS rollout executed successfully with PostgreSQL SSL enabled (`SHOW ssl;` -> `on`).
  - runtime switched to `DATABASE_SSL_MODE=require` and propagated into `app` container env.
  - DB probe from `app` container passed (`DB_PROBE_OK`), public health remained `HTTP/2 200`.
  Delivery notes (2026-04-15 rate-limit + webhook policy hardening):
  - chat/contact endpoints moved from per-process in-memory rate limiting to PostgreSQL-backed persistent counters with bounded in-memory fallback on DB unavailability.
  - runtime behavior/limits preserved (`chat: 5/min`, `contact: 10/min`) with no API contract changes.
  - contact integration policy tightened: in production, `AZURSYSTECH_CONTACT_SUBMIT_ALLOWED_HOSTS` is mandatory/non-empty when integration is enabled; otherwise outbound dispatch is treated as misconfigured.

- AZR-003-013: Sync public phone / WhatsApp across current `web` baseline and docs
  Owner: Tech Lead
  Priority: P0
  Depends on: AZR-003-012
  Acceptance Criteria:
  - AC1: one canonical public phone / WhatsApp value is confirmed
  - AC2: current `web` runtime/UI surfaces use that value consistently
  - AC3: current public docs use that value consistently
  - AC4: historical progress/ADR records are not rewritten as if they were current facts
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
