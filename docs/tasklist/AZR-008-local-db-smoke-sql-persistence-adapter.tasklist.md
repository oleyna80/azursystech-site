# TASKLIST: AZR-008 Local DB Smoke + SQL Persistence Adapter

## Metadata

- Status: Accepted locally
- Parent: AZR-007 Intake Persistence Contract & Draft Schema
- Depends on: AZR-005 Multi-Channel Intake Dry-Run Foundation, AZR-006 Website Chat Intake Dry-Run Integration
- Goal: verify draft intake schema locally and add a minimal SQL-backed persistence adapter without live side effects.
- Live status SSOT: this tasklist.
- MVP mode: local implementation + temporary DB smoke only; no production DB apply.

## Work Block

Current work block is summarized by the stage/objective below.

## Stage

Intake Agent Foundation / SQL Persistence Adapter Sprint

## Objective

Validate the draft channel-intake schema against a temporary local PostgreSQL database and implement the minimal SQL-backed persistence adapter for dry-run/test-only intake persistence.

## Role

Orchestrator with Coder and Verifier gates.

## Expected result

- Local temp DB smoke proves `001` + `002` apply cleanly.
- SQL-backed adapter implements the `IntakePersistenceStore` contract.
- Existing dry-run routes and live chat behavior remain unchanged.
- No live DB apply, env/secrets/config changes, deploy, or live external API calls.

## Scope

- `web/src/lib/intake/*`
- `web/sql/002_multi_channel_intake_foundation.sql`
- `docs/tasklist/AZR-008-local-db-smoke-sql-persistence-adapter.tasklist.md`
- `memory_bank/context.md`
- `memory_bank/progress.md`

## Out of scope

- Production DB access.
- Live migration apply.
- Route behavior expansion.
- Telegram/WhatsApp/Google Sheets API calls.
- Admin Telegram notification sending.
- Deploy/VPS/env/secrets/config changes.
- Package/dependency changes.
- Contact-form lead storage rewrite.

## Approved write-set

- `web/src/lib/intake/*`
- `web/sql/002_multi_channel_intake_foundation.sql`
- `docs/tasklist/AZR-008-local-db-smoke-sql-persistence-adapter.tasklist.md`
- `memory_bank/context.md`
- `memory_bank/progress.md`

## Dirty baseline

- `web/src/lib/intake/persistence.ts` and `web/sql/002_multi_channel_intake_foundation.sql` are untracked production files from accepted AZR-007.
- Local workflow/tasklist/memory docs are ignored by Git and should stay local.

## Acceptance criteria

- Temporary local DB smoke applies `web/sql/001_intake_schema.sql` and `web/sql/002_multi_channel_intake_foundation.sql` cleanly, or reports local DB unavailable.
- SQL-backed adapter implements `loadConversationState` and `persistDecision`.
- Adapter uses an injected `pg` Pool; it does not read env/secrets or create live connections by itself.
- Adapter preserves idempotency semantics for message inserts.
- Existing dry-run routes remain unchanged unless explicitly wired in a test-only way.
- No production DB, live external APIs, deploy, env/secrets/config, or package changes.
- Verification passes with required checks or reports blockers.

## Verification tier

Full, because this block introduces database persistence code.

## Required checks

- `git diff --check`
- `cd web && npm run check:types`
- `cd web && npm run lint`
- `cd web && npm run build`
- Temporary/local DB smoke: apply `001` then `002`, inspect core tables/indexes/FKs, drop temp DB afterward.
- Inspect changed sections directly.
- Verify no secrets/tokens/env values are present in the diff.
- Verify no live Telegram/WhatsApp/Google Sheets/API calls are introduced.

## Stop conditions

- Need for production DB credentials or remote DB access.
- Need to apply a live migration.
- Need for env/secrets/config changes.
- Need to send real client/admin messages.
- Need to call Telegram/WhatsApp/Google Sheets APIs.
- Need to change package dependencies.
- Local DB smoke requires destructive action outside the temporary DB.

## Implementation Tasks

- [x] Baseline git status and confirm approved write-set.
- [x] Inspect intake runtime/routes and schema boundary.
- [x] Add minimal SQL-backed persistence adapter.
- [x] Run temporary local DB smoke.
- [x] Run required web checks.

## Verification Tasks

- [x] Confirm adapter uses injected Pool only.
- [x] Confirm adapter implements the persistence contract.
- [x] Confirm schema applies cleanly to local temp DB.
- [x] Confirm dry-run/live route behavior remains unchanged.
- [x] Confirm no env/secrets/config/deploy/live API changes.
- [x] Confirm typecheck/lint/build pass.

## Delivery Notes

- Added `web/src/lib/intake/sql-persistence.ts`.
- Adapter implements `IntakePersistenceStore` with `loadConversationState` and `persistDecision`.
- Adapter receives an injected `pg` Pool and does not read `DATABASE_URL`, env values, secrets, or create a live connection by itself.
- Message persistence checks existing idempotency before mutating conversation state, then uses `ON CONFLICT (idempotency_key) DO NOTHING`; duplicate provider events fail closed at the adapter result level without inserting duplicate decision rows or regressing ready/dry-run statuses.
- Post-review fix accepted: duplicate/no-op paths return from current persisted status where available and do not update `intake_channel_conversations`.
- Subagent review and verification passed with no blockers; outbound assistant-message row persistence remains deferred because it is not required for this adapter acceptance slice.
- Route behavior remains unchanged: no dry-run or live route was wired to SQL in this block.
- Temporary local DB `azursystech_azr008_smoke_20260516_01` was created, `001` and `002` applied cleanly, core tables/indexes/FKs inspected, and the temp DB was dropped.
- Checks passed: `git diff --check`, `cd web && npm run check:types`, `cd web && npm run lint`, `cd web && npm run build`.
- Lint result includes 3 existing `<img>` warnings in `web/src/app/[locale]/page.tsx`; no lint errors.
- No production DB access, live migration apply, env/secrets/config/deploy change, Telegram/WhatsApp/Google Sheets API call, or real admin/client message was performed.
