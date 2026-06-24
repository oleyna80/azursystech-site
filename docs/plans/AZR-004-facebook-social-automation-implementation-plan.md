# PLAN: AZR-004 Facebook / Social Automation

## Status

- Date: 2026-05-11
- Status: Draft updated with `admin.azursystech.fr` MVP decisions
- Source spec: `docs/specs/AZR-004-facebook-social-automation.md`
- Scope: MVP implementation plan only

## Implementation Principles

- MVP first; future channels and comments stay out of the first implementation block.
- PostgreSQL remains the source of truth.
- Google Sheets is a mirror/export surface only.
- `n8n` is not a source of truth and does not own business logic. It may trigger scheduled publishing through a protected admin API after manual publishing is stable.
- AI output is policy-gated and treated as draft unless explicitly approved.
- Public replies are not autonomous in MVP.
- No real Meta token or secret is added to repository files.
- Meta tokens stay in environment variables for MVP; encrypted DB storage is a later hardening step.
- MVP post status chain is `draft -> scheduled -> publishing -> published / failed`.
- Telegram is the MVP notification channel for `published` and `failed` outcomes.

## MVP Admin Project Direction

Target surface: `admin.azursystech.fr`, implemented as a separate Next.js admin project/container unless a later architecture decision changes that.

Implementation starts with:

1. Owner-only auth gate.
2. SQL schema and repositories for social channels/posts/events/jobs.
3. Manual publish path.
4. Protected scheduled publish trigger.
5. `n8n` scheduler trigger only after backend status/idempotency is verified.

## Phase 1: Discovery And Contract Alignment

1. Locate existing backend structure in `web`.
2. Locate current database access pattern and migration convention.
3. Locate existing intake-core/contact submit logic.
4. Locate Telegram notification helper.
5. Locate Google Sheets mirror/export helper if present.
6. Decide whether Messenger can reuse existing conversation/message tables.
7. Decide whether admin starts as `admin/` inside this repo or a separate repository before writing code.

Deliverable:

- Short implementation handoff confirming actual file paths and reuse decisions.

## Phase 2: Auth Gate And Data Layer

1. Add owner-only auth gate for the admin surface.
2. Add migrations for:
   - `social_channels`
   - `social_posts`
   - `social_events`
   - `social_publish_jobs` if scheduled publishing needs a separate job table
   - no `moderation_queue` table until Messenger/public comments need review workflow
3. Add Messenger tables only if existing conversation/message storage cannot be reused cleanly.
4. Add repository methods for:
   - creating draft posts;
   - scheduling posts;
   - selecting due posts;
   - recording social events;
   - idempotency lookup by external event ID;
   - moderation queue item creation.

Validation:

- Migration applies locally.
- Repository unit or smoke checks cover core status transitions.

## Phase 3: Module Skeleton

1. Create `admin/src/modules/social/` or equivalent bounded module path chosen in Phase 1.
2. Add domain types and status constants.
3. Add application services:
   - `generatePostDrafts`
   - `schedulePost`
   - `publishDuePosts`
   - `handleMetaWebhookEvent`
   - `handleMessengerMessage`
4. Add policy helpers:
   - post draft guardrails;
   - Messenger reply risk classification;
   - escalation decision.

Validation:

- Type checks pass.
- Application services can be tested with mocked integrations.

## Phase 4: Meta Integration

1. Add `MetaClient` wrapper.
2. Implement webhook challenge verification.
3. Implement webhook signature validation using raw body.
4. Implement Page post publishing.
5. Implement Messenger private reply send.
6. Ensure all Meta errors are sanitized before logging or storing.

Validation:

- Webhook verification can be tested locally with sample query params.
- Signature validation has a deterministic test with fixture body/signature.
- Meta client can run in dry/mock mode without real token exposure.

## Phase 5: Admin And Webhook Routes

1. Add `GET /api/meta/webhook`.
2. Add `POST /api/meta/webhook`.
3. Add `POST /api/admin/social/posts/generate`.
4. Add `PATCH /api/admin/social/posts/:id/schedule`.
5. Add `POST /api/admin/social/posts/publish-due`.
6. Protect admin routes with owner-only auth.
7. Protect scheduler route with internal secret/HMAC.

Validation:

- Routes return expected status codes for unauthorized requests.
- Webhook route records event and does not leak payload in logs.
- Publish-due route is idempotent.

## Phase 6: Shared Service Wiring

1. Connect LLM service for draft generation and Messenger classification/reply draft.
2. Connect intake service using source `facebook_messenger`.
3. Connect Telegram notification service for:
   - inbound Messenger lead;
   - post published;
   - post failed;
   - moderation required.
4. Connect `n8n` only as an optional scheduler caller after manual publish is stable.
5. Connect Sheets mirror where existing helper exists; otherwise leave explicit stub/TODO behind an interface.

Validation:

- LLM policy rejects or escalates risky outputs.
- Intake receives normalized social lead data.
- Telegram alert payload contains useful summary without secrets.

## Phase 7: MVP Verification

Run checks appropriate to the actual implementation:

- `git diff --check`
- Type check for `web`
- Migration apply check
- Auth gate smoke
- Route smoke tests
- Webhook verification smoke
- Webhook signature fixture test
- Post status transition test
- Publish-due idempotency test
- n8n/internal trigger auth rejection/acceptance smoke if scheduler trigger is enabled
- Messenger low-risk reply policy test
- Messenger risky reply escalation test

## Rollback / Safety

- New routes should be inert until env flags and Meta secrets are configured.
- Publishing requires explicit configured channel and token.
- Scheduled publishing should fail closed if token/channel is missing.
- Scheduler trigger should fail closed if internal secret/HMAC is missing or invalid.
- Messenger auto-reply should fail closed to Telegram/admin review when policy or LLM is unavailable.
- Do not remove or alter existing intake/contact routes during MVP implementation.

## Execution Checklist

- [ ] Phase 1: Discovery and contract alignment complete.
- [ ] Phase 2: Auth gate and data layer complete.
- [ ] Phase 3: Module skeleton complete.
- [ ] Phase 4: Meta integration complete.
- [ ] Phase 5: Admin and webhook routes complete.
- [ ] Phase 6: Shared service wiring complete.
- [ ] Phase 7: MVP verification complete.
- [ ] Memory Bank updated after implementation.
- [ ] Coder -> Verifier handoff prepared.
