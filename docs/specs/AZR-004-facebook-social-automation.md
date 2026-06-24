# SPEC: AZR-004 Facebook / Social Automation

## Status

- Date: 2026-05-11
- Status: Draft approved for MVP planning; `admin.azursystech.fr` decision update added
- Owner: Tech Lead / Control Tower
- Scope: backend/API architecture documentation only

## Problem

AzurSysTech needs a controlled Facebook automation module for Page posts and Messenger intake. The current project baseline already has Next.js backend/API routes, PostgreSQL as the primary source of truth, Telegram notifications, Google Sheets as an operational mirror, and AI runtime guardrails.

The module must fit into the existing backend/data architecture without turning the project into a SaaS or multi-tenant architecture. Scheduled publishing may use `n8n` only as a protected trigger/orchestration layer; PostgreSQL and the admin backend remain the source of truth.

## Decision Update 2026-05-11

The current MVP direction is `admin.azursystech.fr`: a separate Next.js admin project for Facebook Page publishing through Meta Graph API. The implementation placement is `admin/` inside the current repository, while deployment remains a separate app/container/subdomain.

Approved decisions:

- Admin placement for MVP is `admin/` inside this repository.
- Admin auth starts with app-level owner password/session auth.
- Meta tokens stay in environment variables for MVP. Move tokens to encrypted database storage when OAuth/token lifecycle complexity grows.
- Post lifecycle starts with `draft`: `draft -> scheduled -> publishing -> published / failed`.
- Telegram remains the notification channel for MVP admin alerts.
- Send Telegram alerts on `published` and `failed` post outcomes.
- `n8n` may trigger scheduled publishing through a protected admin API endpoint, but must not store business state, own status transitions, or publish directly to Meta.
- MVP starts with auth gate and SQL schema before Meta publishing UI or scheduled publish execution.
- `moderation_queue` is deferred from Phase 1 until Messenger/public comments need review workflow.

## Goals

- Add a clear backend module boundary for Facebook / Social Automation.
- Support MVP flows for post drafts, admin approval/scheduling, scheduled publishing trigger, Messenger webhook handling, LLM-assisted replies, intake-core lead updates, and Telegram alerts.
- Keep all AI-generated content as draft or policy-gated output unless explicitly approved.
- Keep PostgreSQL as the system of record.
- Keep Google Sheets as a mirror/export surface, not as primary storage.
- Keep future channels such as Instagram and WhatsApp possible through channel adapters.

## Non-Goals

- No n8n-owned business workflow for MVP; optional scheduler trigger is allowed only through protected admin backend API.
- No external microservice split for MVP.
- No Meta Ads Manager automation.
- No autonomous risky public replies.
- No SaaS-style tenant model.
- No implementation in this documentation stage.

## Architecture Placement

The admin surface is planned as a separate Next.js app at `admin.azursystech.fr`. For MVP it lives under `admin/` in the current repository, with an explicit app/module boundary and independent deployment path.

Recommended logical layout inside the admin project or an equivalent bounded module:

```text
admin/src/modules/social/
  domain/
  application/
  integrations/meta/
  repositories/
  policies/
  types/

admin/src/app/api/meta/webhook/
admin/src/app/api/admin/social/
```

Responsibilities:

- `domain`: post statuses, channel model, event model, conversation state, moderation status.
- `application`: use cases such as generate drafts, schedule post, publish due posts, process Messenger event.
- `integrations/meta`: Meta Graph API, Messenger Send API, webhook verification, request signature validation, payload normalization.
- `repositories`: PostgreSQL read/write operations.
- `policies`: LLM prompt safety, auto-reply limits, escalation rules, public-reply restrictions.
- API routes: HTTP/auth/validation only; no business logic.

## Shared Services

The social module should depend on existing services through interfaces, not through direct route-level coupling.

- Database: source of truth for social posts, events, conversations, moderation items.
- LLM service: post drafts, inbound classification, Messenger reply drafts, risk checks.
- Intake service / intake-core: upsert lead, attach social touchpoints, preserve source taxonomy.
- Notification service: Telegram alerts for admin review and failures.
- Sheets mirror: operational export for posts, leads, and moderation queue.
- Admin auth layer: owner-only auth gate for MVP, with a path to stronger auth later.
- Scheduler trigger: optional `n8n` protected call into admin API, not a state owner.

## MVP Flows

### Generate Post Drafts

1. Admin calls the draft generation endpoint with campaign context or a brief.
2. Application service builds a safe prompt using project positioning and brand constraints.
3. LLM returns a fixed number of draft variants.
4. Backend stores variants as `social_posts.status = draft`.
5. Optional Sheets mirror row is created or updated.

Rules:

- Drafts are not published automatically.
- Draft content must avoid unsupported guarantees, hard pricing claims, and scheduling promises.
- Drafts must preserve local positioning: Nice + 30 km, particuliers + TPE.

### Admin Review And Scheduling

1. Admin reviews a draft in the admin surface or operational sheet.
2. Admin schedules the post through backend admin API when content is approved for publication.
3. Backend records `scheduled_by`, `scheduled_at`, and optional review metadata.
4. Status becomes `scheduled`.

Rules:

- Scheduling is the explicit approval action for MVP.
- Editing after scheduling should reset to `draft` or create a new draft, unless a later admin workflow explicitly supports edits to scheduled posts.

### Publish Due Posts

1. Protected cron/admin route calls `publish due posts`; the caller may be admin UI, cron, or `n8n`.
2. Backend selects `scheduled` posts with `scheduled_at <= now()`.
3. Each post is locked or moved to `publishing` before external API call.
4. Meta client publishes to the configured Facebook Page.
5. Backend records `external_post_id`, `published_at`, and status `published`.
6. Failures become `failed` with sanitized error details and Telegram alert.

Rules:

- Publishing must be idempotent.
- A post must not be published twice if a retry happens.
- External API failures must not delete local state.
- `n8n`, if used, only triggers the route and does not choose posts, mutate statuses directly, or hold Meta tokens.

### Receive Messenger Webhook

1. Meta sends webhook event to `POST /api/meta/webhook`.
2. Route validates request signature where available and stores raw event.
3. Application service normalizes event into message/conversation records.
4. Intake service creates or updates a lead using source `facebook_messenger`.
5. LLM classifies intent and drafts a private Messenger reply.
6. Policy layer decides whether the reply can be sent automatically or needs admin review.
7. Telegram alert summarizes sender, intent, lead status, and action taken.

Rules:

- Unknown or risky messages escalate to human review.
- Messenger auto-reply is allowed only for low-risk private intake acknowledgements.
- Public comments are out of MVP for autonomous replies.

## Data Model Draft

### `social_channels`

Purpose: configured social account or page.

| Field | Notes |
| --- | --- |
| `id` | internal primary key |
| `type` | `facebook_page`; future: `instagram`, `whatsapp` |
| `name` | display/admin name |
| `external_account_id` | Meta Page ID or future channel ID |
| `status` | `active`, `disabled`, `needs_reauth` |
| `metadata` | JSON for non-secret account details |
| `created_at`, `updated_at` | timestamps |

Tokens must not be stored here in plaintext.

### `social_posts`

Purpose: draft, scheduled, and published Page posts.

| Field | Notes |
| --- | --- |
| `id` | internal primary key |
| `channel_id` | references `social_channels` |
| `status` | `draft`, `scheduled`, `publishing`, `published`, `failed`; future optional: `cancelled` |
| `content` | post text |
| `media_urls` | optional JSON/text array |
| `llm_prompt` | optional prompt reference or sanitized prompt |
| `llm_metadata` | model, policy result, draft source |
| `scheduled_at` | publish target time |
| `scheduled_by`, `reviewed_at` | admin scheduling/approval metadata |
| `published_at` | successful publish timestamp |
| `external_post_id` | Meta post ID |
| `error_message` | sanitized failure reason |
| `created_at`, `updated_at` | timestamps |

### `social_events`

Purpose: raw and normalized event log for webhook, scheduler, admin, and Meta API actions.

| Field | Notes |
| --- | --- |
| `id` | internal primary key |
| `channel_id` | optional for unknown/unmatched events |
| `source` | `meta_webhook`, `scheduler`, `admin_action`, `meta_api` |
| `event_type` | normalized type |
| `external_event_id` | idempotency key where available |
| `raw_payload` | JSON, redacted where needed |
| `processing_status` | `received`, `processed`, `ignored`, `failed` |
| `error_message` | sanitized failure reason |
| `created_at` | timestamp |

### Messenger Conversations And Messages

Preferred approach: reuse existing conversation/message tables if they already support source, external IDs, lead linkage, and message direction.

Required fields if reusing:

- `source = facebook_messenger`
- `channel_id`
- `external_conversation_id`
- `external_sender_id`
- `lead_id`
- `direction = inbound | outbound`
- `external_message_id`

Fallback tables if reuse is not clean:

`messenger_conversations`

| Field | Notes |
| --- | --- |
| `id` | internal primary key |
| `channel_id` | references `social_channels` |
| `external_user_id` | Meta sender PSID |
| `lead_id` | optional lead link |
| `status` | `open`, `pending_admin`, `closed` |
| `last_message_at` | timestamp |
| `created_at`, `updated_at` | timestamps |

`messenger_messages`

| Field | Notes |
| --- | --- |
| `id` | internal primary key |
| `conversation_id` | references conversation |
| `direction` | `inbound`, `outbound` |
| `text` | message body, PII-aware storage |
| `external_message_id` | Meta message ID |
| `llm_metadata` | optional classification/reply metadata |
| `created_at` | timestamp |

### `moderation_queue`

Purpose: human approval queue for future public comments and risky drafts.

MVP status: deferred from Phase 1 until Messenger/public comments need review workflow.

| Field | Notes |
| --- | --- |
| `id` | internal primary key |
| `channel_id` | references `social_channels` |
| `item_type` | `post`, `messenger_reply`, `comment_reply` |
| `source_event_id` | references `social_events` |
| `draft_text` | proposed content |
| `status` | `pending`, `approved`, `rejected`, `sent` |
| `risk_level` | `low`, `medium`, `high` |
| `reviewed_by`, `reviewed_at` | admin review metadata |
| `created_at`, `updated_at` | timestamps |

## API Routes Draft

### Meta Webhook

`GET /api/meta/webhook`

- Verifies Meta webhook challenge.
- Reads `hub.mode`, `hub.verify_token`, `hub.challenge`.
- Returns challenge only when verify token matches configured secret.

`POST /api/meta/webhook`

- Requires raw request body for signature validation.
- Validates Meta signature where provided.
- Stores raw event in `social_events`.
- Dispatches Messenger events to application service.
- Returns fast success after durable receipt or safe processing.

### Admin Social Routes

`POST /api/admin/social/posts/generate`

- Auth: admin.
- Input: campaign context, number of drafts, optional language/tone.
- Output: created draft IDs and content summaries.

`PATCH /api/admin/social/posts/:id/schedule`

- Auth: admin.
- Sets `scheduled_at` and moves post to `scheduled`.

`POST /api/admin/social/posts/publish-due`

- Auth: admin session or protected internal scheduler secret/HMAC.
- Publishes due scheduled posts.
- Returns counts: published, skipped, failed.

Future:

- `POST /api/admin/social/moderation/:id/approve`
- `POST /api/admin/social/moderation/:id/reject`
- `POST /api/admin/social/moderation/:id/send`

## Integration Interfaces

### `MetaClient`

- `publishPagePost(channel, content, media?)`
- `sendMessengerReply(channel, recipientId, text)`
- `parseWebhook(payload)`
- `verifyWebhookChallenge(query)`
- `validateSignature(rawBody, headers)`

### `LLMService`

- `generatePostDrafts(context)`
- `classifyInboundMessage(message, context)`
- `draftMessengerReply(message, leadContext, policy)`
- `assessReplyRisk(draft, context)`

### `IntakeService`

- `upsertLeadFromSocialMessage(message, channel, metadata)`
- `attachConversationToLead(conversationId, leadId)`
- `recordLeadTouchpoint(leadId, sourceEventId)`

### `NotificationService`

- `alertSocialMessageReceived(summary)`
- `alertPostPublished(summary)`
- `alertPostFailed(summary)`
- `alertModerationRequired(summary)`

MVP notification implementation: Telegram only.

### `SheetsMirror`

- `mirrorSocialPost(post)`
- `mirrorLeadUpdate(lead)`
- `mirrorModerationItem(item)`

## Security And Compliance

- Meta tokens live in environment variables for MVP. Database storage must be encrypted when introduced.
- Do not commit tokens, verify tokens, app secrets, or page access tokens.
- Webhook verification token must be compared server-side.
- Webhook signature validation should use raw body and Meta app secret.
- Logs must redact secrets, access tokens, sender IDs where practical, phone/email, and full message bodies unless needed for admin review.
- Raw payload storage must be PII-aware and access-controlled.
- LLM must not promise prices, availability, discounts, scheduling, legal conclusions, or guaranteed outcomes.
- Public replies require human approval for MVP.
- Private Messenger auto-replies are limited to low-risk acknowledgement/intake.
- Failed or uncertain LLM decisions escalate to Telegram/admin review.
- Admin MVP starts from an owner-only auth gate; full RBAC is out of MVP.
- Scheduler route must be protected with internal secret/HMAC if no admin session is available.
- CSRF protection is required for browser-originating admin mutations.

## Future Scope

Future work must be planned separately from MVP:

- Facebook post comments ingestion.
- Public comment moderation queue.
- Draft reply with human approval.
- Instagram DM/comments as `instagram` channel adapter.
- WhatsApp as `whatsapp` channel adapter.
- Unified inbox view.
- Media publishing.
- Engagement analytics sync.

## Acceptance Criteria

- AC1: Module boundaries are documented: domain, application, Meta integration, repositories, policies, routes.
- AC2: MVP flows are documented for post drafts, approval/scheduling, publishing, Messenger webhook, LLM reply, intake update, Telegram alert.
- AC3: Future scope is explicitly separated from MVP.
- AC4: Minimal data model is documented for channels, posts, events, conversations/messages, with `moderation_queue` documented as deferred future scope.
- AC5: API routes are documented with auth and responsibility notes.
- AC6: Integration interfaces are documented for Meta, LLM, intake, notifications, and Sheets mirror.
- AC7: Security/compliance guardrails are documented.
- AC8: Documentation does not require n8n for MVP.
- AC9: Documentation does not introduce SaaS/multi-tenant complexity.
- AC10: Implementation can start from the linked plan and tasklist without further architecture discovery.
