# AZR-INTAKE Phase 1 Next Gates

Status: local follow-up
Created: 2026-05-10
Last updated: 2026-05-10
Owner: Tech Lead / Control Tower

## Objective

Continue the shared AI intake foundation safely after local acceptance of the
storage foundation and website chat persistence. The next production-impacting
work must verify live DB state before schema apply or deploy.

## Gate 1: Fix Brief-Link Error Sanitization

Status: accepted locally.

Objective: prevent raw PostgreSQL connection errors from escaping
`linkBriefToLead()` before brief persistence is exposed through runtime routes.

Scope:

- `web/src/lib/intake/storage.ts`
- targeted test or smoke for failed connection behavior if practical

Acceptance:

- connection acquisition errors are sanitized like other storage errors;
- no raw DB error details are exposed to callers;
- `cd web && npm run check:types` passes.

## Gate 2: Website Chat Persistence

Status: accepted locally.

Objective: persist website chat conversations/messages while keeping the
existing widget contract working.

Must preserve:

- current request compatibility: `{ message, history, locale }`;
- current response compatibility: `{ reply }`;
- current validation, rate limiting, DeepSeek behavior, and guardrails.

Must add:

- backend request id;
- backend conversation create/resume;
- inbound message persistence;
- recent DB message loading for agent context;
- outbound message persistence;
- optional `conversationId` in the response without breaking current UI.

Out of scope:

- Telegram webhook;
- WhatsApp Cloud API webhook;
- admin dashboard;
- deploy;
- env changes.

Acceptance:

- existing website chat UI still works without client changes;
- storage records inbound and outbound messages;
- duplicate inbound idempotency behavior is deterministic;
- `git diff --check` passes;
- `cd web && npm run check:types` passes;
- local/test DB smoke is repeated after route wiring.

Local verification result:

- runtime smoke passed with mock DeepSeek and isolated PostgreSQL smoke DB;
- old request/response compatibility was preserved;
- optional `conversationId` was returned;
- second request resumed the same conversation;
- local DB stored 2 inbound and 2 outbound messages.

## Gate 3: Brief Persistence

Objective: persist `/brief` submissions after the storage error-sanitization
gap is fixed.

Must preserve:

- current validation;
- current response shape;
- current `brief.v1` contract.

Must add:

- brief DB persistence;
- optional lead creation/linking only when explicit contact data exists;
- admin notification after successful DB commit;
- optional returned `briefId`/`leadId` without breaking current UI.

Acceptance:

- no admin notification is sent before DB commit;
- no lead is created from insufficient contact data;
- route compatibility is preserved;
- local/test DB smoke covers brief persistence.

## Gate 4: Live DB Verification

Objective: verify production/live DB readiness before applying migration `002`
outside local/test DB.

Required checks:

- inspect current live schema without printing secrets;
- confirm whether `intake_conversation_messages` has existing rows;
- decide how to classify existing message directions if rows exist;
- apply migration only after explicit approval.

Stop conditions:

- live schema differs from repository assumptions;
- migration would rewrite or drop data;
- credentials or env values would be exposed;
- production deploy or route behavior changes are requested without approval.

## Gate 5: Production Chat Rollout

Objective: deploy accepted `/api/chat` persistence only after live DB readiness
is verified.

Required checks:

- confirm production env points to the intended PostgreSQL database without
  printing secret values;
- apply migration `002` only after explicit Owner approval;
- deploy only through the approved GHCR/VPS `docker compose pull` path;
- run a production-like chat smoke and confirm a reply plus persisted
  conversation/messages.

Stop conditions:

- production DB schema does not match repository assumptions;
- chat persistence fails in SQL-primary mode;
- deploy would mix unrelated dirty scopes;
- Telegram/WhatsApp work is requested without a new approved scope.
