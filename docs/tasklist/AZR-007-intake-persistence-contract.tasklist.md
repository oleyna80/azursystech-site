# TASKLIST: AZR-007 Intake Persistence Contract & Draft Schema

## Metadata

- Status: Accepted locally
- Parent: AZR-005 Multi-Channel Intake Dry-Run Foundation
- Depends on: AZR-006 Website Chat Intake Dry-Run Integration
- Goal: define the minimal persistence contract and additive draft schema for multi-channel conversational intake.
- Live status SSOT: this tasklist.
- MVP mode: local implementation + draft SQL only; no live DB apply.

## Work Block

Current work block is summarized by the stage/objective below.

## Stage

Intake Agent Foundation / Persistence Contract Sprint

## Objective

Define and implement the minimal local persistence boundary for multi-channel intake so Telegram, WhatsApp, and website chat can later save conversation and brief state through one backend layer.

## Role

Orchestrator with Coder, Reviewer, and Verifier gates.

## Expected result

- Shared intake persistence contract/types.
- Additive draft SQL migration for conversation intake state.
- Existing AZR-005/AZR-006 dry-run behavior preserved.
- No live DB apply, env/secrets/config changes, deploy, or live external calls.

## Execution mode

- End-to-end autonomous.
- Continue through approved stages without Owner confirmation unless a Stop condition occurs.

## Subagent authorization

- Native subagents authorized when they improve speed, quality, or context hygiene.
- Use one write-capable Coder per approved write-set; keep Reviewer/Verifier subagents read-only unless explicitly approved.

## Execution topology

- Control Tower + one Coder path for implementation.
- Read-only Reviewer/Verifier subagents may inspect schema/storage boundaries.
- Context sharing: scoped prompt preferred.

## Scope

- `web/src/lib/intake/*`
- `web/sql/002_multi_channel_intake_foundation.sql`
- `docs/tasklist/AZR-007-intake-persistence-contract.tasklist.md`
- `memory_bank/context.md`
- `memory_bank/progress.md`

## Out of scope

- Live DB migration apply.
- Production DB access.
- Telegram API calls.
- WhatsApp API calls.
- Google Sheets writes.
- Admin Telegram notification sending.
- Deploy/VPS/env/secrets/config changes.
- Frontend redesign.
- Contact-form lead storage rewrite.

## Approved write-set

- `web/src/lib/intake/*`
- `web/sql/002_multi_channel_intake_foundation.sql`
- `docs/tasklist/AZR-007-intake-persistence-contract.tasklist.md`
- `memory_bank/context.md`
- `memory_bank/progress.md`

Any other write path requires Control Tower approval before implementation.

## Dirty baseline

- `git status --short --untracked-files=all` was clean at sprint start.
- Local workflow docs may be ignored by Git and should not block implementation.

## Acceptance criteria

- One persistence contract exists for channel-neutral conversational intake.
- Contract supports conversation identity, message events, brief draft state, idempotency key, brief-ready status, admin notification status, and sheets mirror status.
- Contact-form persistence in `web/src/lib/intake-storage.ts` remains unchanged.
- Existing AZR-005/AZR-006 dry-run routes still work unchanged.
- SQL migration is additive and safe as a draft file only.
- No live DB apply is run.
- No env/secrets/config changes are introduced.
- No Telegram/WhatsApp/Google Sheets/admin-message live calls are introduced.
- Verification passes with required checks or reports blockers.

## Verification tier

Full, because the sprint adds a draft schema contract.

## Required checks

- `git diff --check`
- `cd web && npm run check:types`
- `cd web && npm run lint`
- `cd web && npm run build`
- Inspect changed sections directly.
- Verify SQL is additive only.
- Verify no secrets/tokens/env values are present in the diff.
- Verify no live Telegram/WhatsApp/Google Sheets/API calls are introduced.
- Explicitly report skipped live checks: live DB migration, production DB smoke, deploy, live external messaging.

## Stop conditions

- Need for live DB credentials or production DB access.
- Need to apply a live migration.
- Need for env/secrets/config changes.
- Need to send real client/admin messages.
- Need to call Telegram/WhatsApp/Google Sheets APIs.
- Need to change package dependencies.
- Unrelated dirty production files block safe implementation.

## Rollback notes

- Revert only files changed by this Work Block.
- No live external state should exist because SQL is draft-only and no live APIs are called.

## SSOT updates

- Update this tasklist as the live status source.
- Update `memory_bank/context.md` with current focus and next gate.
- Update `memory_bank/progress.md` after verification evidence exists.

## Implementation Tasks

- [x] Baseline git status and confirm allowed write-set.
- [x] Review existing `001_intake_schema.sql` and contact-form storage boundaries.
- [x] Add channel-neutral intake persistence contract/types.
- [x] Add additive draft SQL migration for conversation intake state.
- [x] Verify dry-run routes do not change behavior.
- [x] Run required checks.

## Verification Tasks

- [x] Confirm one persistence contract exists for conversational intake.
- [x] Confirm contact-form storage remains unchanged.
- [x] Confirm SQL is additive and draft-only.
- [x] Confirm no live DB apply was run.
- [x] Confirm no env/secrets/config/deploy/live API changes.
- [x] Confirm typecheck/lint/build pass.

## Delivery Notes

- Added `web/src/lib/intake/persistence.ts` as the channel-neutral persistence contract.
- Added `web/sql/002_multi_channel_intake_foundation.sql` as draft-only additive schema for channel conversations, messages, and decisions.
- Kept `web/src/lib/intake-storage.ts`, AZR-005 Telegram dry-run, and AZR-006 web-chat dry-run behavior unchanged.
- No live DB apply, production DB access, deploy, env/secrets/config change, Telegram/WhatsApp/Google Sheets call, or real admin/client message was performed.
- Checks passed: `git diff --check`, `cd web && npm run check:types`, `cd web && npm run lint`, `cd web && npm run build`.
- Lint result includes 3 existing `<img>` warnings in `web/src/app/[locale]/page.tsx`; no lint errors.
