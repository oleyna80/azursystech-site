---
name: intake-agent-foundation
description: Use for AzurSysTech AI intake persistence work, including shared intake storage, website chat persistence, brief persistence, local/test DB smoke, and future thin channel adapters.
---

# Skill: Intake Agent Foundation

Use this skill for AzurSysTech AI intake foundation work after the backend-first
SQL decision.

## Read First

1. `07_ops/task-board.md`
2. `00_strategy/roadmap.md`
3. `web/sql/001_intake_schema.sql`
4. `web/sql/002_multi_channel_intake_foundation.sql`
5. `web/src/lib/intake/storage.ts`
6. `web/src/app/api/chat/route.ts`
7. `web/src/app/api/brief/submit/route.ts`

## Triggers

- intake persistence
- `/api/chat` persistence
- brief persistence
- AI intake agent foundation
- local/test DB smoke
- conversation/message storage

## Workflow

1. State stage, objective, role, expected result, scope, and out of scope.
2. Start read-only:
   - inspect current route behavior;
   - inspect storage contracts;
   - inspect current schema and migrations;
   - check git status before any Coder stage.
3. Keep route compatibility explicit:
   - website chat request remains `{ message, history, locale }`;
   - website chat response remains `{ reply }`;
   - new fields such as `conversationId` must be optional.
4. Keep persistence backend-owned:
   - normalize inbound messages before storage;
   - persist inbound and outbound messages;
   - load recent DB messages for agent context;
   - validate state changes in backend code.
5. Run local/test DB smoke before any production DB step.
6. Update SSOT only after the implementation has review and verification
   evidence.

## Guardrails

- No env changes unless explicitly approved.
- No deploy unless explicitly approved.
- No Telegram or WhatsApp webhook work unless explicitly approved.
- No raw PII, tokens, connection strings, or secrets in logs or reports.
- DB migrations require explicit Owner approval before live apply.
- Live DB verification is separate from local/test DB smoke.
- Channel adapters stay thin; backend owns validation and persistence.
- The LLM must never write directly to the database.
- Do not send admin notifications before a successful DB commit.

## Validation

Run checks per `sdd-protocol.md § Check Suite → Tier Standard`, plus skill-specific:

- targeted route contract smoke if a route changed
- local/test DB migration apply and storage smoke if schema/storage changed
- secret/PII diff review

If a check is skipped, report why.

## Closeout

Report:

- files changed;
- route behavior changed or unchanged;
- DB checks run and result;
- risks and `needs verification` items;
- next gate.

## Handoff
- **Success condition**: все проверки из ## Validation пройдены или пропущены с документацией; closeout report создан.
- **Next**: azursystech-verifier (по завершении implementation)
- **Auto-proceed**: 🟢 YES
- **Hard stop**: 🔴 YES — live DB migration apply или production deploy требуют Owner approval.
