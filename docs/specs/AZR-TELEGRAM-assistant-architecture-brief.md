# Architecture Brief: Telegram Assistant Planning

## Stage

Architecture Discovery - Telegram Assistant Planning

## Objective

Define a safe, minimal architecture for an AzurSysTech client-facing AI assistant in Telegram before implementation.

The product objective is conversational brief collection: the website links users to a Telegram chat where the assistant asks short clarifying questions, helps the client formulate the project idea, fills the same business brief structure that a web form would collect, and hands the result to the admin workflow.

Telegram is the first implementation channel. The same backend intake runtime and brief model should later power WhatsApp after API approval and the website chat, with only channel adapters differing.

## Role / Skill

Orchestrator using `architecture-discovery`.

## Expected result

Local architecture brief/spec only. No production code, env/secrets, Telegram API calls, migrations, deploy, staging, or commit.

## Context

Meta/WhatsApp approval is slow, so Telegram is the preferred first client chat channel. The website can expose a link to the Telegram AI assistant as a lower-friction alternative to a static form. The existing website already has a guarded `/api/chat` route and contact-form intake persistence. The approved intake-agent direction says channel adapters should be thin and the backend should own validation, persistence, state, and outbound policy across Telegram, future WhatsApp, and website chat.

## Problem statement

Add Telegram as a client intake channel that can collect a useful brief through free-form conversation without creating a second assistant architecture, leaking credentials/PII, or sending live client messages before an explicit live Work Block.

The assistant must not act as a general support bot. It should only help collect and clarify brief data. It must not promise prices, deadlines, appointments, delivery, technical stack choices, or implementation commitments.

## Assumptions

- Telegram MVP is for one AzurSysTech-owned bot, not a marketplace/multi-tenant bot.
- First implementation should be dry-run/test-only.
- Client-facing Telegram assistant belongs in `web/`, not `admin/`, unless the bot is explicitly an owner/admin bot.
- Telegram, future WhatsApp, and website chat should share the same intake runtime, brief schema, safety policy, and persistence model.
- PostgreSQL remains the system of record for intake state.
- LLM output is advisory; backend validation and storage own all state changes.

## Scope

- Telegram inbound/outbound architecture.
- Integration with the intake-agent contract.
- Multi-channel intake boundary for Telegram, future WhatsApp, and website chat.
- Conversational brief collection flow and handoff boundaries.
- Storage boundaries and idempotency needs.
- Admin notification and Google Sheets mirror expectations.
- Security, privacy, and operations guardrails.
- Next dry-run/test Work Block proposal.

## Out of scope

- Production code.
- Bot token creation, token rotation, env changes, or secrets.
- `setWebhook`, `getUpdates`, `sendMessage`, or any real Telegram API call.
- Live DB migration apply.
- Deploy, Docker push, or VPS changes.
- Real client communications.

## Existing system/repo findings

- `memory_bank/decisions.md` establishes PostgreSQL-first persistence and the rule that the LLM never writes directly to the DB.
- `docs/specs/AZR-INTAKE-agent-contract-v1.md` already names Telegram as a future channel and defines channel adapters as thin normalization/outbound layers.
- `web/src/app/api/chat/route.ts` contains useful website chat guardrails, prompt-injection checks, rate limiting, DeepSeek request handling, and reply post-processing, but it is currently request/response-only and does not persist a `conversationId`.
- `web/src/lib/intake-storage.ts` persists contact-form leads and lead events.
- `web/sql/001_intake_schema.sql` has basic `intake_leads`, `intake_lead_events`, `intake_conversations`, and `intake_conversation_messages` tables, but these tables do not yet carry enough Telegram-specific external IDs, update idempotency, direction, send status, or agent state.
- `web/src/lib/telegram-notify.ts` is notification-only. It is useful as a fetch/config/error-handling pattern, but should not become the client assistant runtime.
- Current checkout contains the richer `web/src/lib/intake/*` runtime and the current additive migration at `web/sql/002_multi_channel_intake_foundation.sql`; older reports may still mention the former foundation migration name.
- `admin/` has useful dry-run and idempotency patterns for social publishing, but client Telegram intake should not be placed in admin by default.

## Research sources used

- Local repo docs/code listed above.
- Telegram Bot API official docs: https://core.telegram.org/bots/api

Key Telegram facts used:

- The Bot API is HTTPS-based and token-authenticated.
- Bots receive updates either through `getUpdates` long polling or webhook; these modes are mutually exclusive.
- Webhooks deliver HTTPS POST updates and can include `X-Telegram-Bot-Api-Secret-Token` when `secret_token` is configured.
- `sendMessage` is the basic text outbound method and requires `chat_id` and `text`.
- Production webhook should use HTTPS and explicit allowed update types.

## Options considered

1. Reuse `web/src/app/api/chat/route.ts` directly for Telegram.
   - Reject. The current route is website-specific, request/response-only, and does not model provider update IDs, outbound send status, or Telegram contact identity.

2. Extend `web/src/lib/telegram-notify.ts` into the assistant.
   - Reject. It is admin notification-only and currently sends lead PII to an internal chat. Client chat needs a separate adapter/transport.

3. Build Telegram as a thin `web/` channel adapter over shared intake core.
   - Recommended. This matches the intake-agent contract, keeps transport concerns isolated, and allows website chat, Telegram, and later WhatsApp to converge.

4. Put Telegram client intake into `admin/`.
   - Reject for MVP. `admin/` is owner workflow and social publishing. Client-facing intake belongs in `web/` unless future requirements define an admin-only bot.

## Recommended approach

Build Telegram in two steps:

1. Dry-run/test foundation:
   - Define normalized Telegram inbound event types.
   - Add a mock/dry-run Telegram transport.
   - Route inbound test payloads through the same intake-core interface that future website chat should use.
   - Produce a response decision without sending to Telegram.
   - Verify auth, idempotency, rate limiting, handoff policy, and sanitized logging.

2. Later live Work Block after Owner approval:
   - Add real Telegram bot env variables.
   - Register webhook or configure approved runtime.
   - Enable real `sendMessage` behind explicit live gates.
   - Run live smoke only with Owner-approved test bot/chat.

Target live flow:

1. Website shows a Telegram assistant link.
2. Client starts a Telegram chat.
3. Telegram adapter normalizes inbound messages and sends them to the intake runtime.
4. Intake runtime asks concise clarifying questions until the brief is sufficiently complete or handoff is needed.
5. Backend persists conversation, extracted brief fields, assistant decisions, and handoff state in PostgreSQL.
6. Backend mirrors the accepted brief to Google Sheets.
7. Backend sends an internal admin Telegram notification with summary and a Google Sheets/admin link.

Target multi-channel flow:

```text
Telegram adapter
WhatsApp adapter
Website chat adapter
        -> normalized intake message
        -> shared intake runtime
        -> PostgreSQL brief/conversation state
        -> Google Sheets mirror
        -> admin notification
```

## Recommended stack

- Next.js route handler in `web/`.
- Existing `pg` dependency and PostgreSQL SSOT.
- Existing DeepSeek chat provider pattern unless a separate approved LLM decision changes this.
- No new dependency for the first dry-run foundation.
- Mock transport for tests.
- Webhook-first for production; polling only for local experiments if explicitly approved.

## Architecture boundaries

Proposed future modules:

- `web/src/app/api/telegram/webhook/route.ts`
  - HTTP boundary only: size limit, method, secret header check, payload shape validation, rate limit, idempotency key creation, response status.

- `web/src/lib/telegram/adapter.ts`
  - Convert Telegram `Update` into a normalized intake inbound message.
  - Extract only required fields: update id, chat id, message id, user id, username/display name, language, text, timestamp.

- `web/src/lib/telegram/transport.ts`
  - `sendMessage` wrapper and dry-run/mock transport.
  - No prompt logic and no DB writes.

- `web/src/lib/intake/*`
  - Canonical intake runtime, storage, policy, lead/brief state patch validation, event recording, and LLM interaction shared by Telegram, future WhatsApp, and website chat.

- `web/src/lib/telegram-notify.ts`
  - Keep as admin lead notification helper. Do not reuse as client assistant runtime.

## Data model / storage model

The current `001` schema is not enough for Telegram. Future additive storage should support:

- Channel contact identity: channel, external contact id, display/user fields, language, first/last seen.
- Conversation identity: internal conversation id, channel, external conversation id/chat id, optional lead id, status, last message time.
- Message/event idempotency: provider update id, provider message id, direction, role, text, redacted payload metadata, send status, error code.
- Agent state: stage, brief completion state, qualification fields, handoff flags, confidence, last decision metadata.
- Brief snapshot: normalized project idea, business context, goals, desired automation/features, current assets, constraints, preferred contact, and open questions.
- External mirror status: Google Sheets row/link, sync status, last sync time, and sanitized sync error code.

Do not overload existing `intake_conversations` and `intake_conversation_messages` without adding external IDs and idempotency. Prefer additive migration when implementation is approved.

The normalized storage model must be channel-neutral. Telegram-specific fields should stay in channel metadata; the brief itself should not depend on Telegram.

## API / integration contracts

Inbound normalized message:

```ts
type NormalizedTelegramInbound = {
  channel: "telegram";
  providerUpdateId: string;
  externalConversationId: string;
  externalMessageId: string;
  externalContactId: string;
  text: string;
  locale?: "fr" | "ru";
  receivedAtUtc: string;
  contactProfile?: {
    username?: string;
    displayName?: string;
    languageCode?: string;
  };
};
```

Runtime decision:

```ts
type TelegramAssistantDecision = {
  replyText: string;
  shouldSend: boolean;
  handoffRequired: boolean;
  adminNotificationRequired: boolean;
  briefReady: boolean;
  confidence: number;
  reason?: string;
};
```

Dry-run response should include the decision and `dryRun: true`, but must not send any Telegram message.

## Security / privacy constraints

- Do not use real bot tokens in tests or docs.
- Do not log bot tokens, full Telegram API URLs, raw provider payloads, full PII, prompt internals, or LLM provider payloads.
- Verify Telegram webhook secret header before processing any live webhook.
- Use max request body limits, method checks, JSON shape validation, and rate limits.
- Deduplicate by `update_id` and message id before calling the LLM.
- Restrict assistant behavior to brief collection and clarification.
- Do not allow the assistant to promise prices, deadlines, appointments, technical stack, delivery, or contract terms.
- Fail closed to human/admin review for pricing, scheduling, legal/privacy, credential, complaint, urgent outage, low-confidence, or explicit human-request cases.
- Keep outbound live send disabled unless a later live Work Block approves env, deploy, webhook registration, and test chat.

## Operational constraints

- Webhook is the recommended production mode because it fits Next.js routes and avoids singleton polling workers.
- `getUpdates` polling is acceptable only for local/manual experiments after explicit approval because it can consume live bot updates and needs offset persistence.
- `setWebhook` is a live Telegram API call and requires explicit approval.
- Dry-run/test foundation must work without Telegram credentials.
- Live smoke must use a test bot/chat first, not a real client conversation.

## Risks

- Current checkout has drift from older reports: richer intake foundation files are missing.
- A quick Telegram implementation could duplicate website chat logic instead of creating a shared intake runtime.
- Existing notification helper could accidentally be reused for client messaging and mix admin PII notification concerns with client chat.
- Without idempotency, Telegram retries could create duplicate messages, duplicate LLM calls, or duplicate outbound replies.
- Without explicit live gates, tests could send real Telegram messages.

## Implementation plan

MVP/dry-run:

1. Reconcile intake foundation baseline: decide whether to create `web/src/lib/intake/*` now or first normalize existing `intake-storage.ts`.
2. Define normalized Telegram inbound and assistant decision types.
3. Define the conversational brief fields and completion policy.
4. Create a dry-run webhook route or test harness with mock transport only.
5. Add idempotency and rate-limit checks.
6. Wire to shared intake runtime interface with a stub or existing chat policy, depending on approved scope.
7. Add focused tests for auth failure, duplicate update, dry-run reply, handoff-required, brief-ready state, rate limit, and sanitized errors.

Future/live:

1. Add additive migration for channel contacts, conversation external IDs, message idempotency, and agent state.
2. Add real Telegram transport behind explicit env gates.
3. Add Google Sheets mirror for accepted briefs if not already available through intake.
4. Add admin review/handoff notification flow.
5. Register webhook only after Owner approval.
6. Run live smoke with a test bot/chat.

## Acceptance criteria

For the next dry-run/test Work Block:

- No real Telegram token, chat ID, webhook registration, polling, or outbound send.
- No env/secrets changes.
- No live DB migration apply.
- Telegram adapter remains thin and does not own prompt logic or direct lead mutation.
- Shared intake runtime boundary is explicit.
- Shared intake runtime is channel-neutral and can later be reused by WhatsApp and website chat.
- Invalid/missing secret is rejected.
- Duplicate provider updates are handled or explicitly tested through a mock idempotency layer.
- Dry-run output includes `dryRun: true`.
- Assistant behavior is limited to brief collection and clarification.
- Assistant asks concise follow-up questions when brief data is missing or ambiguous.
- Assistant refuses or deflects pricing, deadline, stack, appointment, and delivery commitments.
- Brief-ready state can create/update a local brief record or dry-run equivalent.
- Admin notification payload is defined but not sent live.
- Google Sheets mirror link/status is modeled or explicitly stubbed for dry-run.
- Handoff-required cases do not send client replies.
- Logs/errors are sanitized.
- Checks include `git diff --check`, relevant lint/typecheck/test commands, and explicit skipped-live-check notes.

## Open questions

- Should the next foundation create a new `web/src/lib/intake/*` module now, or first restore the missing intake-agent foundation from the previous slice if it exists elsewhere?
- Which local test runner should be used for route-level tests in `web/` if no test framework is currently configured?
- Should the first MVP support private chats only, or also Telegram groups/topics?
- Which languages should be active at launch: French only, or French plus Russian matching the website chat?
- Should Google Sheets mirror happen immediately after brief-ready state, or only after admin review?
- What minimum brief completeness should trigger admin notification?

## Recommended next SDD Work Block

Stage: Telegram Intake Dry-Run Foundation

Objective: create a minimal mock/dry-run Telegram adapter foundation with no live Telegram calls.

Role: Coder with Reviewer/Verifier gates.

Expected result: testable local foundation only.

Scope:

- `web/src/lib/intake/*` or explicitly approved intake-core files.
- `web/src/lib/telegram/*`.
- Optional `web/src/app/api/telegram/webhook/route.ts` dry-run route.
- Tests or verification harness if the project has an approved test path.
- Dry-run brief-ready/admin-notification/Google-Sheets-mirror contract.

Out of scope:

- Real Telegram token/chat ID.
- `setWebhook`, `getUpdates`, or real `sendMessage`.
- Live DB migration apply.
- Deploy, commit, or push.
- Real client communications.
