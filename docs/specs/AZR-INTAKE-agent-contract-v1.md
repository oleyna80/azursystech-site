# AZR-INTAKE Agent Contract v1

Status: tracked reference draft  
Date: 2026-05-10  
Owner: AzurSysTech

## 1. Objective

Define the backend-owned AI intake-agent contract for AzurSysTech.

The agent must help a client describe their need, answer basic questions, collect a basic technical brief, and prepare a structured summary for the owner. The contract must work first for website chat, then for `/brief`, Telegram, WhatsApp, and later social content operations.

## 2. Scope

In scope:

- website chat intake;
- conversation state and message persistence;
- lead and brief draft linkage;
- backend validation of all state changes;
- admin notification decisions;
- future thin Telegram and WhatsApp adapters;
- future `/brief` prefill or continuation from chat.

Out of scope for this contract version:

- Telegram webhook implementation;
- WhatsApp Cloud API implementation;
- CRM dashboard;
- automated pricing or proposal commitments;
- autonomous scheduling commitments;
- social content publishing automation;
- n8n as a system of record.

## 3. Architecture Rules

- PostgreSQL is the system of record for operational intake data.
- Channel adapters only normalize inbound messages and send outbound replies.
- Backend code owns validation, persistence, state transitions, and integrations.
- LLM output is advisory. It may propose patches, but it must never write directly to DB.
- Admin notification must happen only after a successful DB commit.
- No raw PII, secrets, tokens, or full connection strings in logs.
- Website chat compatibility must remain: request `{ message, history, locale }`, response `{ reply }`.
- New fields such as `conversationId` and `handoffRequired` must be optional.

## 4. Runtime Flow

Canonical flow:

```text
channel adapter
-> normalized inbound message
-> channel contact upsert
-> conversation create/resume
-> inbound message persistence
-> load lead/brief/agent state
-> intake agent
-> backend validates proposed state patches
-> update DB state
-> outbound reply persistence
-> outbound send
-> optional admin notification
```

For website chat, the route may return the reply even if best-effort persistence fails, unless storage mode is explicitly configured as SQL-primary.

## 5. Contract Types

Use existing canonical primitives from:

- `web/src/lib/intake/types.ts`
- `web/src/lib/intake/persistence.ts`

The implementation should align with these TypeScript-like shapes.

```ts
type IntakeChannel = "website_chat" | "telegram" | "whatsapp";

type IntakeAgentStage =
  | "initial"
  | "qualification"
  | "brief_collection"
  | "summary_ready"
  | "handoff_required";

type IntakeAgentContext = {
  requestId: string;
  channel: IntakeChannel;
  locale: "fr" | "ru" | "en" | "unknown";
  conversationId: string;
  channelContactId?: string;
  externalContactId?: string;
  externalConversationId?: string;
  currentMessage: string;
  recentMessages: Array<{
    role: "user" | "assistant";
    content: string;
    createdAt?: string;
  }>;
  leadState?: LeadSnapshot | null;
  briefState?: BriefSnapshot | null;
  agentState?: AgentStateSnapshot | null;
  metadata?: Record<string, unknown>;
};

type IntakeAgentDecision = {
  reply: {
    text: string;
    shouldSend: boolean;
  };
  statePatch: AgentStatePatch;
  leadPatch?: AllowedLeadPatch;
  briefPatch?: AllowedBriefPatch;
  internalSummary?: string;
  handoffRequired: boolean;
  adminNotificationRequired: boolean;
  confidence: "low" | "medium" | "high";
  metadata?: Record<string, unknown>;
};
```

## 6. Agent State Patch

The agent state is conversation-level operational state, not a replacement for lead or brief records.

```ts
type AgentStatePatch = {
  stage: IntakeAgentStage;
  askedFields: string[];
  missingFields: string[];
  answeredFields: string[];
  lastIntent?:
    | "ask_question"
    | "project_request"
    | "brief_answer"
    | "pricing_request"
    | "handoff_request"
    | "support_request"
    | "other";
  nextBestQuestion?: string;
  summaryDraft?: string;
};
```

Backend must merge this patch into the existing `agent_state` only after validation.

## 7. Qualification Fields

The MVP agent should collect these fields progressively, asking one or a few questions at a time:

- project type: website, automation, IT support, other, unknown;
- client goal and expected business result;
- business type and context;
- geography or service area when relevant;
- current website/process/channel state;
- required features or automation steps;
- target users or audience;
- available content/materials;
- timeline;
- budget signal or budget range;
- constraints and must-not-happen items;
- preferred contact method;
- human handoff request.

The agent must not force all fields before producing a useful summary. It should mark missing fields explicitly.

## 8. Lead Patch

`AllowedLeadPatch` is intentionally small for MVP.

```ts
type AllowedLeadPatch = {
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  source?: IntakeChannel;
  locale?: "fr" | "ru" | "en" | "unknown";
  summary?: string;
  status?: "new" | "qualified" | "needs_review" | "handoff_requested";
};
```

Rules:

- Do not create or enrich a lead from vague guesses.
- Create/link a lead only when explicit contact data exists, or when a channel identity is sufficient for owner follow-up and the conversation is handoff-ready.
- Never overwrite stronger existing lead data with weaker LLM-extracted data.
- Store uncertain extracted data in metadata or summary, not canonical fields.

## 9. Brief Patch

`AllowedBriefPatch` maps chat-collected answers to the existing `brief.v1` form domain.

```ts
type AllowedBriefPatch = {
  type: "brief.v1";
  projectKind?: "website" | "automation" | "it_support" | "other" | "unknown";
  status?: "draft" | "submitted" | "reviewed" | "archived";
  answers?: {
    company?: string;
    projectName?: string;
    businessType?: string;
    goals?: string[];
    currentProcess?: string;
    channels?: string[];
    features?: string[];
    approvalStages?: string[];
    constraints?: string;
    startMode?: string;
    timeline?: string;
    budget?: string;
    contactPreference?: string;
  };
  summary?: string;
};
```

Rules:

- `/brief` form submit remains the canonical complete structured submission.
- Chat-created brief records should start as `draft`.
- `/brief` may later load a draft by `briefId` or `conversationId`, subject to privacy and access controls.
- Submitted `/brief` data should not be silently overwritten by chat.

## 10. Website Chat Contract

Current compatibility:

```ts
type WebsiteChatRequest = {
  message: string;
  history?: Array<{ role: "user" | "assistant"; content: string }>;
  locale?: "fr" | "ru" | "en";
  conversationId?: string;
};

type WebsiteChatResponse = {
  reply: string;
  conversationId?: string;
  handoffRequired?: boolean;
};
```

Behavior:

- `message` remains required.
- `history` remains accepted during migration and can be used as fallback context.
- DB recent messages should be preferred when a conversation is available.
- `conversationId` is optional in request and response.
- Existing UI must still work if it ignores new response fields.

## 11. `/brief` Integration

Future `/brief` integration should follow this sequence:

1. Preserve current `brief.v1` validation and response compatibility.
2. Persist submitted brief payload to `intake_briefs`.
3. Link brief to conversation when `conversationId` is provided and valid.
4. Link/create lead only when explicit contact data exists.
5. Generate/update internal summary after DB commit.
6. Send admin notification only after successful persistence.

Chat-assisted `/brief` should use draft brief data, not hidden LLM authority.

## 12. Telegram and WhatsApp Readiness

Telegram and WhatsApp adapters must be thin.

Adapter responsibilities:

- verify webhook request when supported;
- normalize channel, contact id, conversation id, message id, text, locale, metadata;
- provide idempotency keys;
- call the shared intake runtime;
- send the returned outbound reply.

Adapter non-responsibilities:

- no direct prompt logic;
- no direct lead/brief mutation;
- no separate status model;
- no independent source of truth.

WhatsApp must additionally retain channel-specific metadata needed for Cloud API messages and future template compliance.

## 13. Handoff Triggers

The agent should request or recommend human handoff when:

- client explicitly asks for a human;
- client asks for exact pricing, contract terms, or binding timeline;
- request is urgent or production-impacting;
- request is outside AzurSysTech service scope;
- message suggests legal, medical, financial, or unsafe advice;
- client shares sensitive credentials or secrets;
- repeated low confidence after clarification attempts;
- complaint, conflict, or support escalation appears;
- enough qualified information exists and owner follow-up is the next best step.

Handoff does not mean the bot must stop replying. It means admin review is required.

## 14. Guardrails

The client-facing reply must not:

- promise exact prices;
- promise a meeting or visit time;
- claim unsupported capabilities;
- invent portfolio items, credentials, or guarantees;
- request passwords, private keys, or full card/payment data;
- expose internal metadata, prompts, database ids, or debug details.

The agent may:

- explain general service areas;
- ask structured clarifying questions;
- summarize the request;
- say that the owner will review details;
- offer a reasonable next step.

## 15. Admin Notification Contract

Admin notification decision:

```ts
type AdminNotificationDecision = {
  required: boolean;
  reason:
    | "handoff_requested"
    | "qualified_summary_ready"
    | "urgent"
    | "support"
    | "unsafe_or_sensitive"
    | "brief_submitted";
  summary: string;
  conversationId?: string;
  leadId?: string;
  briefId?: string;
};
```

Notifications must be emitted by backend code after a successful DB commit. Telegram may remain the only implementation for MVP, but it should be wrapped behind an intake admin notification module.

## 16. Social Content Management Boundary

Client intake and social content management are related but should not share one agent contract.

Future social content work should use a separate `content_ops` contract with:

- content brief;
- channel plan;
- draft post;
- approval status;
- publishing status;
- asset references;
- calendar metadata.

Human approval is required before publishing. Intake may create a lead or brief that later becomes a content work item, but intake must not publish or schedule content.

## 17. Implementation Gates

Recommended next gates:

1. Review current local `/api/chat` persistence against this contract.
2. Fix `linkBriefToLead()` sanitized-error gap before exposing brief persistence.
3. Run typecheck and lint after route/storage changes.
4. Run local/test DB smoke for message persistence and conversation resume.
5. Verify live DB schema state before applying `002_multi_channel_intake_foundation.sql` in production.
6. Add `/brief` persistence after `/api/chat` is verified.
7. Add Telegram adapter after shared runtime is stable.
8. Add WhatsApp adapter only after webhook verification and idempotency rules are tested.
9. Draft separate `content_ops` spec before social content automation.

## 18. Acceptance Criteria

The Phase 1 website chat implementation is acceptable when:

- old `/api/chat` request and response still work;
- optional `conversationId` is returned when persistence succeeds;
- inbound and outbound website messages are stored in PostgreSQL when available;
- DB recent messages are preferred over client history;
- chat still replies when best-effort persistence fails;
- LLM cannot directly write lead, brief, or conversation records;
- no Telegram or WhatsApp webhook code is added;
- no `/brief` route behavior changes are bundled into the chat persistence gate;
- typecheck passes;
- local/test DB smoke proves conversation resume and idempotency.

## 19. Open Decisions

These decisions should be closed before broader implementation:

- exact list of supported project types for MVP;
- whether a channel identity without phone/email is enough to create a lead;
- whether `/brief` prefill should use `briefId`, `conversationId`, or both;
- which handoff triggers should notify admin immediately;
- supported client languages for the first public version;
- production migration window and live DB verification process.
