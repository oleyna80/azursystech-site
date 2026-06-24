# Agent Backend Architecture Plan

Date: 2026-05-24

Stage: Architecture Analysis Retry
Objective: produce an architecture document for the next AzurSysTech backend agent coding plan.
Role: Reviewer / Architecture Analyst with docs-only write permission.
Expected result: one docs-only architecture plan for the smallest maintainable backend slice that gets the agent to saving a brief in PostgreSQL.

Internet/MCP used: no internet, no MCP, no live DB/API/provider calls.

## Executive Recommendation

- Build the next backend slice around a channel-neutral intake core. Website chat, Telegram, and future WhatsApp should remain window/adapters.
- Do not rewrite live `/api/chat` today. Keep the current guarded DeepSeek route live and use the shared intake runtime only where it already fits or through a small adapter boundary.
- Add a real persisted `intake_briefs` record. Do not treat `intake_channel_conversations.brief_draft` JSONB as the final submitted brief SSOT.
- Add explicit idempotency for every `intake_briefs` write before implementation starts. `/brief` retries and webhook replays must not create duplicate briefs.
- Persist brief records and any admin-notification/outbox decision atomically in one DB transaction. Do not split "brief saved" and "owner notified" into independent writes.
- Keep `intake_channel_conversations.brief_draft` as the mutable conversational draft and state cache.
- Persist submitted `/brief` payloads to DB after existing validation, and optionally link them to a channel conversation when a valid `conversationId` or equivalent is provided later.
- Extend the deterministic intake runtime only enough to map conversation draft data into a `brief.v1`-compatible agent-created draft snapshot. Avoid an LLM-owned DB patch model today.
- Make contact-form-first an explicit backend decision state with `contact_cta_state` and `next_step`: the agent should offer the contact form once there is enough context, and move toward a brief only when the contact form is insufficient or the client continues with deeper questions.
- Keep outbound client messaging disabled by default. Persist assistant replies as outbound drafts; do not send Telegram messages in this slice.
- Preserve the product policy: the agent may clarify, guide form/brief completion, and suggest wording, but must not quote price, deadline, stack commitments, appointments, confidential data requests, or client-facing commitments.
- Local/test DB migration and smoke testing are in scope for the coder plan. Live DB migration apply is a separate Owner-approved gate.

## Current-State Inventory

- `AGENTS.md` defines Agentic SDLC, structural authority, hard stops, side-effect classes, and maintainability gates. Production code, SQL, live DB, deploy, env, and client-facing sends require explicit scoped authority.
- `memory_bank/context.md` records that Telegram inbound is live for draft creation only, `TELEGRAM_LIVE_SENDS_ENABLED=false`, and live DB migration `004` has been applied and verified.
- `memory_bank/progress.md` confirms live Telegram inbound verification created one conversation, inbound message, assistant draft, and decision, with outbound sent/provider/non-draft counters at zero.
- `memory_bank/decisions.md` establishes PostgreSQL as SSOT, LLM output as advisory only, storage through backend layers, and outbound message lifecycle before runtime sending.
- `docs/specs/AZR-INTAKE-agent-contract-v1.md` defines the intended runtime flow, thin adapters, lead/brief patch boundaries, `/brief` persistence sequence, handoff triggers, and guardrails.
- `docs/specs/AZR-TELEGRAM-assistant-architecture-brief.md` recommends Telegram as a thin `web/` adapter over shared intake core, with dry-run first, no real send without a live Work Block, and PostgreSQL as intake state.
- `web/src/lib/intake/types.ts` currently supports `telegram`, `whatsapp`, and `web_chat`, but the draft model is only `problemStatement`, `contactHint`, `city`, and `preferredLanguage`.
- `web/src/lib/intake/runtime.ts` is deterministic. It sanitizes text, detects a few commitment requests, asks for missing problem/contact/city, marks brief ready, and creates dry-run admin/sheets drafts.
- `web/src/lib/intake/persistence.ts`, `storage.ts`, and `sql-persistence.ts` persist conversation snapshots, inbound messages, decisions, and outbound assistant draft messages.
- `web/src/lib/web-chat/dry-run.ts` and `web/src/lib/web-chat/intake-adapter.ts` route only dry-run website chat through the shared runtime.
- `web/src/lib/telegram/dry-run.ts` and `web/src/lib/telegram/intake-adapter.ts` route Telegram dry-run and live receive through the shared runtime.
- `web/src/app/api/chat/route.ts` live path still uses the monolithic DeepSeek request/response flow with strong local guardrails and no shared runtime persistence, while dry-run uses shared intake.
- `web/src/app/api/telegram/webhook/route.ts` receives Telegram updates, verifies live receive gate/secret, normalizes private text messages, persists through shared intake, and never sends messages.
- `web/src/app/api/brief/submit/route.ts` validates `/brief` payloads and returns `payload` plus `handoff`, but does not persist submitted brief data.
- `web/src/lib/brief-submit.ts` owns `brief.v1` field definitions, validation, payload construction, and handoff summary.
- `web/src/lib/brief-assistant.ts` provides field-level guidance for brief completion and already captures the "suggest what to write" behavior for form assistance.
- `web/sql/002_multi_channel_intake_foundation.sql` creates channel conversations, messages, and decisions, including `brief_draft JSONB`.
- `web/sql/003_intake_outbound_message_lifecycle.sql` adds outbound lifecycle columns and constraints to channel messages.
- `web/sql/004_intake_status_constraints.sql` constrains current status values for leads, channel conversations, brief status, admin notification status, and sheets mirror status.
- Current SQL grep did not show an `intake_briefs` table. The only current conversational brief storage is JSONB on `intake_channel_conversations`.
- Legacy intake tables from `web/sql/001_intake_schema.sql` still coexist with the newer channel tables. Any `intake_briefs.lead_id` should reference the existing `intake_leads(id)` unless a future migration introduces a replacement canonical lead table.

## Options Considered

### Option A: Store final briefs only in `intake_channel_conversations.brief_draft`

Pros:
- Smallest schema change because no new table is needed.
- Existing runtime already writes this JSONB.

Cons:
- Blurs draft state and submitted brief SSOT.
- Does not satisfy the existing contract direction that `/brief` submissions should persist to a real brief record.
- Makes future admin review, re-submission, audit, and channel linking harder.

Decision: reject for final/submitted briefs. Keep it only for mutable draft state.

### Option B: Full rewrite of `/api/chat` into the shared intake runtime today

Pros:
- Website chat would become fully channel-neutral immediately.
- One runtime would own all intake behavior.

Cons:
- Higher regression risk because `/api/chat` has substantial live guardrails, locale handling, rate limiting, DeepSeek calls, CTA policy, and post-generation policy.
- Not required to save briefs in DB today.
- Larger test surface than the current backend slice needs.

Decision: reject for today. Keep as a later migration after persisted brief storage is stable.

### Option C: Add `intake_briefs` and wire brief persistence while preserving current route boundaries

Pros:
- Gives the backend a durable brief SSOT now.
- Keeps channel adapters thin and current live `/api/chat` stable.
- Lets Telegram and website dry-run continue to use conversation draft state.
- Aligns with the intake contract and PostgreSQL-first decisions.
- Supports local/test DB smoke without live DB apply.

Cons:
- Requires additive SQL migration and local/test DB verification.
- Requires a small new storage API and route wiring.

Decision: recommended.

## Final Architecture Recommendation

Use a two-layer model:

1. Conversational state layer:
   - Table: `intake_channel_conversations`.
   - Purpose: current channel-neutral conversation, draft answers, completion status, admin/sheets draft state, last message time.
   - Data shape: mutable and partial, including explicit `contact_cta_state` and `next_step`.
   - Decision rule: first route the client to the contact form once enough non-confidential context exists. Move toward brief capture only when the contact form is insufficient or the client continues with deeper questions after the contact CTA.

2. Saved brief layer:
   - New table: `intake_briefs`.
   - Purpose: durable validated `brief.v1` form submission or agent-created draft snapshot for owner review.
   - Data shape: source, status, locale, idempotency key, optional conversation link, optional lead link, payload JSONB, summary/handoff, metadata.
   - Submitted form payloads must use the full validated `BriefSubmissionPayload`.
   - Agent-created draft snapshots must use a smaller `IntakeBriefDraftSnapshot` payload and `metadata.completeness='minimal'`; they must not be padded into a fake 33-field submitted form payload.
   - Every save path must provide a stable `idempotency_key` and use insert-or-return-existing semantics.

3. Notification/outbox layer:
   - Purpose: make "brief persisted" and "owner/admin notification decision persisted" one atomic operation.
   - For this slice, creating a real outbound send remains out of scope. If a notification draft/outbox row is created, it must be committed in the same DB transaction as the brief row and remain unsent until a separate approved live-send gate.

For today, implement DB persistence for brief form submissions plus optional agent-created draft snapshots without replacing the live website chat LLM route and without enabling live outbound sending. The coder should persist:

- Valid `/api/brief/submit` form submissions.
- Agent-created "brief ready" draft snapshots from shared intake runtime when enough minimal draft data exists.

The agent remains channel-neutral because channel adapters normalize inbound events and call the shared runtime/storage boundary. The agent's policy is not Telegram-specific, and future WhatsApp should only add a WhatsApp adapter.

Agent-created snapshots should be stored as `status='draft'` today. Only an explicit, validated `/brief` form submission should create `status='submitted'`. This prevents a three-field conversational draft from being treated as equivalent to a complete client-submitted brief.

## Plain-Text Backend Flow Diagrams

Current Telegram live receive:

```text
Telegram webhook POST
-> /api/telegram/webhook
-> receive gate + secret check
-> telegram intake adapter
-> normalized intake message
-> load intake_channel_conversations state
-> runIntakeDryRun deterministic runtime
-> persist inbound message + conversation brief_draft + decision
-> persist assistant outbound draft
-> return { ok: true }
-> no sendMessage
```

Current website live chat:

```text
Website chat POST
-> /api/chat
-> origin/body/rate/prompt-injection guards
-> DeepSeek chat completion
-> post-generation policy guardrails
-> return { reply }
-> no shared intake persistence on live path
```

Recommended today, `/brief` submission:

```text
/api/brief/submit POST
-> existing origin/rate/body validation
-> validateBriefValues
-> buildBriefSubmissionPayload
-> require or derive stable idempotency key for this submission attempt
-> in one DB transaction:
     insert-or-return-existing intake_briefs row
     optionally persist owner/admin notification draft decision
-> return current success shape { success, message, payload, handoff }
```

Recommended today, shared runtime brief-ready persistence:

```text
channel adapter
-> normalized intake message
-> load conversation draft
-> intake runtime decision
-> persist conversation/message/decision/outbound draft
-> if decision is mark_brief_ready:
     save or upsert intake_briefs draft snapshot by idempotency key
-> return adapter response
-> no live outbound send
```

Recommended today, contact-form-first decision:

```text
normalized intake message
-> update conversation draft
-> if enough context and contact form not yet offered:
     next_step = "contact_form"
     contact_cta_state = "offered"
     reply with contact form CTA and concise help
-> else if contact form is insufficient or client continues deeper:
     next_step = "brief"
     contact_cta_state = "insufficient" when applicable
     continue brief guidance and optional draft snapshot
-> else:
     next_step = "clarify"
     ask one concise non-confidential question
```

Future channel-neutral target:

```text
web_chat adapter
telegram adapter
whatsapp adapter
        -> normalized intake message
        -> shared intake runtime
        -> backend validation and policy
        -> conversations/messages/decisions
        -> intake_briefs
        -> admin review queue
        -> approved outbound send only in separate live gate
```

## Proposed Coder Write-Set

Recommended exact write-set for the next coding block:

- `web/sql/005_intake_briefs.sql`
- `web/src/lib/intake/briefs.ts`
- `web/src/lib/intake/brief-persistence.ts`
- `web/src/lib/intake/sql-persistence.ts`
- `web/src/lib/intake/persistence.ts`
- `web/src/lib/intake/types.ts`
- `web/src/lib/intake/runtime.ts`
- `web/src/lib/intake/storage.ts`
- `web/src/app/api/brief/submit/route.ts`
- Focused tests under the existing nearby test locations, if the project test setup supports them.

Optional only if needed after inspection:

- `web/src/lib/web-chat/dry-run.ts`
- `web/src/lib/telegram/dry-run.ts`

Do not include today:

- Full `/api/chat` live rewrite.
- Real Telegram sender changes.
- WhatsApp implementation.
- Google Sheets live integration.
- Admin UI.
- Env/config/deploy changes.
- Live DB migration apply.

## Data Model / Migration Recommendation

Add an additive migration `web/sql/005_intake_briefs.sql`.

Recommended table sketch:

```sql
CREATE TABLE IF NOT EXISTS intake_briefs (
  id TEXT PRIMARY KEY,
  schema_version TEXT NOT NULL DEFAULT 'brief.v1',
  idempotency_key TEXT NOT NULL,
  source TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'submitted',
  locale TEXT NOT NULL DEFAULT 'fr',
  conversation_id TEXT REFERENCES intake_channel_conversations(id) ON DELETE SET NULL,
  lead_id TEXT REFERENCES intake_leads(id) ON DELETE SET NULL,
  payload JSONB NOT NULL,
  handoff JSONB NOT NULL DEFAULT '{}'::jsonb,
  summary TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  submitted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

Recommended constraints:

```sql
UNIQUE (idempotency_key)
CHECK (schema_version = 'brief.v1')
CHECK (source IN ('brief_form', 'website_chat', 'telegram', 'whatsapp'))
CHECK (status IN ('draft', 'submitted', 'reviewed', 'archived'))
CHECK (locale IN ('fr', 'ru'))
CHECK (jsonb_typeof(payload) = 'object')
CHECK (jsonb_typeof(handoff) = 'object')
CHECK (jsonb_typeof(metadata) = 'object')
```

Status decision:

- Valid explicit `/brief` form submissions are saved with `status='submitted'`.
- Agent-created minimal snapshots are saved with `status='draft'` today, even when the runtime decision says the draft is ready enough for owner review.
- `status='submitted'` must not be used for agent-created snapshots unless a future approved flow adds explicit client submission semantics outside the `/brief` form.

Recommended indexes:

```sql
CREATE INDEX IF NOT EXISTS idx_intake_briefs_status
  ON intake_briefs (status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_intake_briefs_conversation_id
  ON intake_briefs (conversation_id);
CREATE INDEX IF NOT EXISTS idx_intake_briefs_lead_id
  ON intake_briefs (lead_id);
CREATE INDEX IF NOT EXISTS idx_intake_briefs_source
  ON intake_briefs (source);
```

Migration gates:

- Local/test: allowed in the coder block with a temporary DB and throwaway data.
- Live DB: hard stop. Requires separate Owner approval, backup/snapshot confirmation, apply command, post-apply read-only verification, and closeout evidence.

## API / Contracts / Types Sketch

Brief persistence API:

```ts
type IntakeBriefSource = "brief_form" | "website_chat" | "telegram" | "whatsapp";
type IntakeBriefStatus = "draft" | "submitted" | "reviewed" | "archived";

type IntakeBriefDraftSnapshot = {
  problemStatement?: string;
  contactHint?: string;
  city?: string;
  preferredLanguage: "fr" | "ru" | "unknown";
  missingFields: IntakeBriefField[];
};

type SaveIntakeBriefInput = {
  idempotencyKey: string;
  source: IntakeBriefSource;
  status: IntakeBriefStatus;
  locale: "fr" | "ru";
  payload: BriefSubmissionPayload | IntakeBriefDraftSnapshot;
  handoff?: BriefHandoff;
  conversationId?: string;
  leadId?: string;
  metadata?: Record<string, unknown>;
};

type SaveIntakeBriefResult = {
  briefId: string;
  status: IntakeBriefStatus;
};
```

Runtime mapping:

```ts
type IntakeBriefDraft = {
  problemStatement?: string;
  contactHint?: string;
  city?: string;
  preferredLanguage: "fr" | "ru" | "unknown";
  missingFields: IntakeBriefField[];
};

type AgentBriefSaveDecision = {
  shouldSaveBrief: boolean;
  source: "website_chat" | "telegram" | "whatsapp";
  status: "draft";
  reason: "brief_ready";
};

type AgentNextStep =
  | "clarify"
  | "contact_form"
  | "brief"
  | "handoff";

type ContactCtaState =
  | "not_offered"
  | "offered"
  | "accepted"
  | "insufficient"
  | "skipped";

type AgentConversationPolicyDecision = {
  nextStep: AgentNextStep;
  contactCtaState: ContactCtaState;
  shouldOfferBrief: boolean;
  briefOfferReason?: "contact_form_insufficient" | "client_has_deeper_questions";
};
```

For today, avoid pretending the three-field draft fully satisfies the large `/brief` form. Save it as an agent-created draft snapshot with a smaller payload and explicit metadata:

```ts
payload: {
  problemStatement,
  contactHint,
  city,
  preferredLanguage,
  missingFields
},
metadata: {
  created_by: "intake_runtime";
  completeness: "minimal";
  missing_fields: [...]
}
```

The `/brief` form route should save with:

```ts
idempotencyKey: "<client-submission-id or server-derived retry-safe key>"
source: "brief_form"
status: "submitted"
completeness: "form_validated"
```

Idempotency rules for the coder plan:

- `/brief` should accept a stable client submission id when available. If the current client cannot send one in this slice, derive a conservative server-side key from source, normalized payload hash, locale, optional conversation id, and a short submission window; document that a future client-generated UUID is preferred.
- Agent-created snapshots should use the existing channel event idempotency source when available, for example `channel:providerUpdateId`, plus the conversation id and `brief_ready` action.
- Duplicate saves must return the existing brief id and must not enqueue duplicate notification/outbox drafts.

The backend policy should prefer this sequence:

```text
not enough context -> ask one clarifying question
enough context -> offer contact form
client needs deeper structure -> offer brief
client is filling form/brief -> answer field-level questions and suggest wording
handoff trigger -> owner review, no commitment
```

Contact-form-first state should be stored in conversation state, not inferred only from message text:

```ts
conversationState: {
  contact_cta_state: "not_offered" | "offered" | "accepted" | "insufficient" | "skipped";
  next_step: "clarify" | "contact_form" | "brief" | "handoff";
}
```

## Safety / Product Policy

Allowed agent behavior:

- Freely converse within the intake purpose.
- First guide the client to the contact form when enough context exists.
- If the contact form is insufficient and the client still has questions, offer/use the brief.
- During form or brief completion, answer questions about fields and suggest wording.
- Maintain conversation context and ask concise follow-up questions.
- Summarize what the client wrote for owner review.

Forbidden agent behavior:

- No solution proposal as a commitment.
- No exact prices, quotes, discounts, fixed budget promises, or commercial commitments.
- No exact deadlines, start dates, delivery promises, appointments, or visit commitments.
- No confidential information requests such as passwords, private keys, card data, production credentials, or unnecessary sensitive data.
- No claims that a human has accepted work, scheduled a call, sent a proposal, or started implementation.
- No direct DB writes from LLM output. Backend code validates and persists.
- No live Telegram/WhatsApp/email/client outbound send in this slice.

Handoff triggers:

- Explicit human request.
- Pricing/deadline/contract/appointment request.
- Sensitive or confidential data appears.
- Urgent production-impacting support.
- Low confidence or repeated clarification failure.
- Brief is good enough for owner review.

## Implementation Plan For Today

Step 1: Confirm baseline and tests
- Check `git status --short`.
- Confirm existing unrelated dirty files are not touched.
- Confirm current SQL migration list and local test command availability.
- No code changes yet.

Step 2: Add brief persistence schema
- Create `web/sql/005_intake_briefs.sql`.
- Use additive table, constraints, and indexes only.
- Include `idempotency_key TEXT NOT NULL`, a uniqueness guarantee, and JSONB object checks for `payload`, `handoff`, and `metadata`.
- Do not edit prior migrations unless a local/test failure proves a current migration is broken.

Step 3: Add backend brief persistence module
- Add small types and functions for saving validated brief payloads.
- Keep DB access behind existing storage patterns.
- Generate server-owned brief IDs.
- Implement insert-or-return-existing behavior by `idempotency_key`.
- Make the persistence function capable of running inside an existing DB transaction so brief and notification/outbox decisions can commit atomically.
- Sanitize logged errors.

Step 4: Wire `/api/brief/submit`
- Keep request and response compatibility.
- After validation and payload construction, persist the brief.
- Ensure double-submit/retry does not create duplicate rows.
- If an optional `conversationId` is provided, validate that it exists before linking or fail with a sanitized client error.
- On persistence failure, choose fail-closed for SQL-primary mode. If current route has no storage mode contract, document and implement the conservative behavior in tests.

Step 5: Save agent-created brief snapshot
- When shared runtime returns `mark_brief_ready`, save or upsert a minimal `intake_briefs` record linked to the conversation when available.
- Use `status='draft'` for these agent-created minimal snapshots today.
- Use the small `IntakeBriefDraftSnapshot` payload shape, not the full 33-field `BriefSubmissionPayload`.
- Preserve `intake_channel_conversations.brief_draft` as the active draft cache.
- Do not send admin notification or Google Sheets mirror live.

Step 6: Tighten runtime types minimally
- Add only fields needed for saved brief metadata, source/status, `contact_cta_state`, and `next_step`.
- Do not expand into a full LLM patch engine today.

Step 7: Focused tests
- `/brief` valid submission persists once and returns existing response shape.
- Invalid `/brief` does not persist.
- Shared runtime `mark_brief_ready` saves a minimal brief snapshot.
- Duplicate/idempotent inbound event does not create duplicate brief rows.
- Persistence failure is visible and sanitized.

Step 8: Local/test DB smoke
- Use temporary DB only.
- Apply baseline schema plus migrations through `005`.
- Exercise brief submit and runtime brief-ready save.
- Assert expected counts without using live data.

## Acceptance Criteria

- Exactly the approved backend write-set is changed by the coder.
- Existing `/api/brief/submit` success response shape stays compatible.
- Valid `/brief` submissions are persisted to `intake_briefs`.
- Duplicate `/brief` retries return or reuse the existing persisted brief instead of creating duplicates.
- Invalid `/brief` submissions are not persisted.
- Shared intake runtime can save an agent-created `draft` brief snapshot when brief-ready.
- Duplicate webhook/runtime replays do not create duplicate agent-created brief snapshots.
- `intake_channel_conversations.brief_draft` remains a draft/state cache, not final brief SSOT.
- Brief persistence and any owner/admin notification/outbox draft decision commit atomically in one transaction.
- Agent decision state records contact-form-first behavior before moving to a brief offer.
- No full live `/api/chat` rewrite is included.
- Telegram webhook still receives only and does not send.
- No live provider call, deploy, env/config change, commit, push, or live DB action occurs.
- Local/test migration smoke passes through new migration `005`.
- Live DB apply is explicitly documented as skipped and pending separate approval.
- Logs/errors do not expose secrets, connection strings, raw provider payloads, or unnecessary PII.
- Product policy tests or code checks cover no price/deadline/appointment/confidential-info commitments.
- Agent reply/decision cannot ask for confidential data and cannot give a price, deadline, solution, appointment, or commitment.

## Verification Plan

Static/source checks:

- `git diff --check`
- Existing TypeScript/typecheck command for `web`, if available.
- Existing lint command for `web`, if available.
- Focused unit/route tests around brief persistence and intake runtime, if available.

Local/test DB smoke:

```text
pg_isready
createdb <temp_db>
psql -d <temp_db> -v ON_ERROR_STOP=1 -f web/sql/001_intake_schema.sql
psql -d <temp_db> -v ON_ERROR_STOP=1 -f web/sql/002_multi_channel_intake_foundation.sql
psql -d <temp_db> -v ON_ERROR_STOP=1 -f web/sql/003_intake_outbound_message_lifecycle.sql
psql -d <temp_db> -v ON_ERROR_STOP=1 -f web/sql/004_intake_status_constraints.sql
psql -d <temp_db> -v ON_ERROR_STOP=1 -f web/sql/005_intake_briefs.sql
run focused local route/storage smoke
assert conversations/messages/decisions/briefs counts
dropdb <temp_db>
```

Live verification:

- Skipped in this coding block.
- Requires separate Owner approval for live DB migration apply and post-apply read-only verification.

Provider/runtime verification:

- No Telegram `sendMessage`.
- No WhatsApp API call.
- No Google Sheets live call.

## Post-MVP / Follow-Up Gates

These are real architecture concerns but should not expand today's backend slice:

- Outbound lifecycle should eventually grow beyond `sent` to provider-aware states such as `delivered`, `read`, `rate_limited`, `retry_scheduled`, and `dead_letter`.
- Cross-channel identity resolution should start with optional explicit `conversationId` linking in this slice. A later migration can add `channel_contacts` or equivalent mapping from `channel + external_contact_id` to a canonical contact/user id.
- Evaluation should be added before wider production traffic: contact-form acceptance rate, brief completion rate, handoff rate, duplicate/idempotency hit rate, and owner-marked intake usefulness.
- Streaming/shared-runtime response chunks are post-MVP. The current string reply model is acceptable for this slice as long as it does not block a future streaming adapter.
- `contact_cta_state` increases deterministic runtime complexity. Keep the first implementation minimal: record state and next step, but avoid a broad LLM-owned or deeply nested state machine.
- No deploy or VPS action.

## Risks / Hard Stops

- Hard stop: any live DB migration apply.
- Hard stop: any env/secret/config change.
- Hard stop: any Telegram/WhatsApp/email/client-facing outbound send.
- Hard stop: any deploy, Docker push/pull deploy, or VPS service restart.
- Hard stop: adding a new dependency.
- Hard stop: full `/api/chat` live rewrite becomes necessary.
- Hard stop: current migrations fail in local/test in a way that requires editing already-applied SQL.
- Risk: three-field conversation draft is too small to represent full `brief.v1`; mitigate by saving it as minimal agent-created `draft` snapshot with explicit completeness metadata.
- Risk: duplicate provider events or `/brief` retries create duplicate briefs; mitigate with `idempotency_key`, insert-or-return-existing behavior, and duplicate-safe notification/outbox writes.
- Risk: route response compatibility breaks existing frontend; mitigate by preserving current JSON success/failure shapes.
- Risk: persistence failure behavior for `/brief` needs product decision if current storage mode is not explicit; conservative default is fail closed after validation.
- Risk: unrelated untracked repo-root markdown reports exist in this checkout; do not touch them.

## Decisions For Coder And Remaining Open Questions

Decisions for this slice:

- `/api/brief/submit` may accept an optional `conversationId`. If provided, validate it before linking.
- Telegram identity alone should not create a canonical lead in this slice. Keep channel identity on the channel conversation/contact side and link later when richer identity exists.
- Problem statement, contact hint, and city are enough for an agent-created owner-review draft when `metadata.completeness='minimal'` and `missing_fields` are stored.
- Google Sheets mirror should not happen immediately after every brief save in this slice. Keep it for admin review or a later approved mirror gate.
- Website live chat should keep contact-form-first behavior before shared-runtime migration.
- The coder should determine the exact focused test command in Step 1 from the existing `web` scripts, then report it before using it as canonical for this slice.

Remaining open question:

- If the current `/brief` client cannot send a stable submission id, should the frontend be changed in this same backend block or should the backend use the documented server-derived idempotency key temporarily? Default recommendation: backend-derived key for this block, frontend-generated UUID in a later UI block.

## Implementation Closeout / Gate R1 Review

Date: 2026-05-24

Status:

- Docs/process boundary commit pushed: `4201f13` (`docs(sdlc): codify external audit runner boundary`).
- Backend implementation commit pushed: `6ed691f` (`feat(intake): persist backend-derived brief drafts`).
- GitHub Actions CI passed for `6ed691f` on `main` in run `26363378497`.
- Initial read-only Backend/DB reviewer verdict: `FAIL` for closing R1.
- R1 unblock status: committed and pushed as `1979d23` (`fix(intake): harden brief idempotency persistence`); GitHub Actions CI for `1979d23` on `main` passed.

Implemented within the backend slice:

- `/brief` submission persistence into the new `intake_briefs` storage path.
- Backend-derived idempotency for the current `/brief` client contract.
- Transactional brief persistence behavior needed before notification/outbox follow-up.
- Agent-created minimal draft snapshot support for runtime-created brief drafts.
- Local/test migration path through `web/sql/005_intake_briefs.sql`.

Post-merge source-check evidence:

- `git diff --check` passed.
- `cd web && npm run test:ci` passed (`12` files / `40` tests).
- `cd web && npm run check:types` passed.
- `cd web && npm run lint` passed with `0` errors and `3` pre-existing `<img>` warnings in `web/src/app/[locale]/page.tsx`.
- `cd web && npm run build` passed.

Hard Stops preserved:

- Live DB migration `web/sql/005_intake_briefs.sql` was not applied.
- No deploy, VPS/runtime change, env/secret/config change, provider API call, Telegram/WhatsApp/Google Sheets outbound action, or real client/admin message occurred during R1/R2 closeout.

Next required gate:

- Optional read-only R1 closeout review against `1979d23`.
- Request separate Owner approval for live DB apply of `web/sql/005_intake_briefs.sql`, with backup/snapshot confirmation before apply and post-apply read-only verification.
- Deploy/runtime smoke remains a later separate gate.
- C.3 first approved Telegram send remains a later separate Hard Stop.

R1 unblock evidence:

- `saveBriefInTransaction` now handles duplicate submissions with a separate fallback `SELECT` after `ON CONFLICT DO NOTHING RETURNING`, avoiding the same-statement snapshot race in PostgreSQL `READ COMMITTED`.
- `web/sql/005_intake_briefs.sql` now scopes constraint existence checks to `intake_briefs` via `conrelid = 'intake_briefs'::regclass`.
- Added focused unit coverage for inserted and duplicate brief persistence paths.
- Added opt-in SQL integration smoke coverage gated by `INTAKE_SQL_INTEGRATION_DATABASE_URL`.
- Local/temp DB smoke passed on `azursystech_r1_smoke_20260524153138`: migrations `001`-`005` applied, `intake_briefs` had `11` constraints and `6` indexes, brief insert/duplicate/missing-conversation behavior passed, and `mark_brief_ready` persisted exactly one draft brief linked to the conversation.
- Temp DB was dropped after verification.
- Standard verification passed: `cd web && npm run test:ci`, `cd web && npm run check:types`, `cd web && npm run lint`, `cd web && npm run build`, and scoped `git diff --check`.
