# AI Intake Phase 1 Foundation Closeout

Date: 2026-05-10
Stage: Phase 1 / Review + DB Smoke Test
Role: Reviewer / Backend Verifier
Verdict: ACCEPT

## Changed Files

- `web/sql/002_multi_channel_intake_foundation.sql`
- `web/src/lib/intake/types.ts`
- `web/src/lib/intake/persistence.ts`
- `web/src/lib/intake/storage.ts`

No route behavior was changed. `/api/chat`, `/api/brief`, contact submit,
environment files, package files, deploy scripts, Telegram webhooks, and
WhatsApp webhooks were not modified in this stage.

## Review Result

- SQL migration is additive and compatible with `web/sql/001_intake_schema.sql`.
- Contracts and status constants align with the approved Phase 1 design.
- Storage layer reuses the existing PostgreSQL connection approach without a
  broad refactor of `web/src/lib/intake-storage.ts`.
- Message idempotency and conversation resume behavior are suitable for the MVP.
- Recent messages load in chronological order for agent context.

## Smoke DB Result

Local/test DB smoke passed on `azursystech_intake_smoke_20260509211026`.

Covered checks:

- applied `001` schema and `002` migration;
- upserted channel contact;
- created and resumed `website_chat` conversation;
- inserted inbound message;
- detected duplicate inbound message;
- inserted outbound message;
- loaded recent conversation messages;
- updated conversation agent state;
- persisted brief;
- linked brief to a safe test lead.

The first parallel migration attempt raced before `001` and partially created
`intake_channel_contacts`; re-running after `001` recovered cleanly.

## Checks Passed

- `git diff --check`
- `cd web && npm run check:types`

## Known Risks

- MEDIUM: `linkBriefToLead()` acquires a DB client before its `try` block; if
  connection acquisition fails, a raw `pg` error can escape. Fix before exposing
  brief persistence or brief-lead linking through a route.
- LOW: Existing live rows in `intake_conversation_messages`, if any, would
  receive default `direction = 'inbound'` when migration `002` is applied.
- LOW: `idempotency_key` is globally unique; adapters must build
  channel-scoped idempotency keys.
- LOW: Status values are validated in TypeScript, not with DB `CHECK`
  constraints. This is accepted for MVP.

## Needs Verification

- Live DB schema state before production migration apply.
- Whether production has existing `intake_conversation_messages` rows and how
  they should be classified before defaulting `direction`.
- Local smoke DB cleanup, if desired, needs explicit approval because `dropdb`
  is destructive.

## Next Gate

Proceed to `/api/chat` persistence only after confirming the route migration
plan still preserves the current request/response contract:

- request compatibility: `{ message, history, locale }`;
- response compatibility: `{ reply }`;
- optional future response field: `conversationId`;
- no Telegram or WhatsApp webhook work in this gate.
