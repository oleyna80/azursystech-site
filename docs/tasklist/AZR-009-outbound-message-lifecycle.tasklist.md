# TASKLIST: AZR-009 Outbound Message Lifecycle Before Runtime Wiring

## Metadata

- Status: Implemented locally / verification passed
- Parent: AZR-007/AZR-008 Intake Persistence Foundation
- Depends on: AZR-005 Multi-Channel Intake Dry-Run Foundation, AZR-006 Website Chat Intake Dry-Run Integration, AZR-008 SQL Persistence Adapter
- Goal: define outbound message lifecycle before wiring SQL persistence into any runtime channel.
- Live status SSOT: this tasklist.
- MVP mode: architecture/spec task only; no production code, migration apply, env/secrets, deploy, or live API calls.

## Work Block

Current work block is summarized by the stage/objective below.

## Stage

Intake Agent Foundation / Outbound Message Lifecycle Planning

## Objective

Define the MVP outbound-message model and lifecycle so assistant replies do not rely on `intake_channel_decisions` as the chat-history source of truth.

## Role

Orchestrator / Architecture Analyst

## Expected result

- Clear decision boundary between decision/audit rows and chat-history message rows.
- Implementation-ready acceptance criteria for the next Coder block.
- Runtime wiring remains blocked until outbound draft lifecycle is represented explicitly.

## Execution mode

- End-to-end autonomous docs-only Work Block.
- Continue through planning and SSOT sync without Owner confirmation unless a Stop condition occurs.

## Execution topology

- Control Tower only.
- Use read-only subagents later if implementation/review scope becomes broad.

## Scope

- `docs/tasklist/AZR-009-outbound-message-lifecycle.tasklist.md`
- `memory_bank/context.md`
- `memory_bank/progress.md`
- `memory_bank/decisions.md`
- Local workflow memory-window rule if needed.

## Out of scope

- Production code changes.
- SQL migration implementation or live DB apply.
- Route/runtime wiring.
- Telegram/WhatsApp/Google Sheets API calls.
- Admin approval UI.
- Manager console.
- Env/secrets/config/deploy/package changes.
- Real client/admin messages.

## Approved write-set

- `docs/tasklist/AZR-009-outbound-message-lifecycle.tasklist.md`
- `memory_bank/context.md`
- `memory_bank/progress.md`
- `memory_bank/decisions.md`
- `memory_bank/archive/progress-2026-05.md`
- `AGENTS.md`
- `.agent/skills/memory-bank-manager/SKILL.md`

## Dirty baseline

- Public repo worktree is clean after commit `63dea21`.
- Local workflow docs are ignored and must stay local.

## Acceptance criteria

- `intake_channel_decisions` is documented as audit/decision/draft evidence, not chat-history SSOT.
- `intake_channel_messages` is documented as the preferred unified chat-history table for inbound and outbound records.
- Outbound message lifecycle is defined for MVP:
  - `draft`
  - `approved`
  - `queued`
  - `sent`
  - `failed`
- Proposed outbound message fields are captured for the next implementation block:
  - `conversation_id`
  - `direction`: `inbound | outbound`
  - `channel`
  - `body`
  - `author_type`: `client | assistant | manager | system`
  - `status`: `draft | approved | queued | sent | failed`
  - `provider_message_id`
  - `created_at`
  - `approved_at`
  - `sent_at`
- Runtime wiring is explicitly blocked until assistant replies can be represented as outbound draft messages.
- No live external sending flow is introduced.
- No production code, migration apply, env/secrets/config/deploy/package changes are made.

## Verification tier

Lite, because this block is local documentation and planning only.

## Required checks

- `git status --short --untracked-files=all`
- `git diff --check`
- `git check-ignore -v` for changed local workflow docs.
- Inspect changed sections directly.
- Verify no production files changed.

## Stop conditions

- Need to alter production schema or code.
- Need to apply a migration.
- Need for env/secrets/config/deploy/package changes.
- Need to call Telegram/WhatsApp/Google Sheets APIs.
- Need to send real client/admin messages.
- Owner asks to publish local workflow docs.

## Architecture Decision

- Keep current AZR-008 behavior for MVP: assistant response can remain on the decision row as draft/suggestion evidence.
- Before runtime wiring, add explicit outbound-message representation.
- Prefer evolving `intake_channel_messages` into one unified timeline table instead of adding a separate `outbound_messages` table.
- `intake_channel_decisions` remains audit/decision evidence.
- `intake_channel_messages` becomes the chat-history SSOT.

## Future Implementation Notes

- The next Coder block should add outbound draft persistence before any real send flow.
- Real sends must require lifecycle state transition and must not bypass approval/safety gates.
- Telegram is the first target channel, but the model must remain channel-neutral for WhatsApp and website chat.

## Implementation Tasks

- [x] Capture outbound lifecycle decision.
- [x] Define MVP fields and statuses.
- [x] Block runtime wiring until outbound draft messages exist.
- [x] Evaluate memory-bank rolling window.

## Verification Tasks

- [x] Verify local docs only.
- [x] Verify public repo worktree remains clean.
- [x] Verify memory bank and tasklist are consistent.

## Delivery Notes

- Created AZR-009 planning tasklist.
- Recorded ADR-007 for outbound message lifecycle before runtime wiring.
- Confirmed MVP direction: `intake_channel_decisions` remains audit/decision/draft evidence; `intake_channel_messages` is the preferred unified inbound/outbound timeline.
- Increased memory-bank rolling window from 10 to 15 entries and archived the oldest May entry to keep the rule true.
- No production code, migration, env/secrets/config, deploy, package, or live API changes.

## Implementation Addendum — 2026-05-17

### Approved implementation scope

- `web/sql/003_intake_outbound_message_lifecycle.sql`
- `web/src/lib/intake/persistence.ts`
- `web/src/lib/intake/sql-persistence.ts`
- Local SSOT sync in this tasklist and `memory_bank/*`

### Implemented behavior

- Added additive SQL migration `003` for unified message lifecycle fields on `intake_channel_messages`:
  - `channel`
  - `body`
  - `author_type`
  - `status`
  - `approved_at`
  - `sent_at`
- Added DB checks for:
  - `direction`: `inbound | outbound`
  - `author_type`: `client | assistant | manager | system`
  - `status`: `draft | approved | queued | sent | failed`
- Inbound persisted messages now carry canonical `channel`, `body`, `author_type=client`, `status=sent`, and `sent_at`.
- Assistant replies are now persisted as outbound draft rows with `direction=outbound`, `author_type=assistant`, and `status=draft`.
- `loadConversationState` reads inbound idempotency keys only, so outbound draft ids do not pollute duplicate-provider detection.

### Verification result

- `git diff --check`: passed.
- `npm run check:types`: passed.
- `npm run lint`: passed with only existing `<img>` warnings in `web/src/app/[locale]/page.tsx`.
- `npm run build`: passed; Next.js root lockfile warning remains existing environment noise.
- Local temporary DB smoke applied `001` + `002` + `003`, confirmed new columns, constraints, indexes, and inserted one inbound `sent` row plus one outbound `draft` row.
- Temporary DB `azursystech_azr009_smoke_20260517` was dropped.

### Remaining gates

- No production DB migration apply was performed.
- No env/secrets/config/deploy/package changes were made.
- No Telegram/WhatsApp/Google Sheets API calls or real client/admin messages were sent.
- Runtime channel wiring remains a separate future Work Block.
