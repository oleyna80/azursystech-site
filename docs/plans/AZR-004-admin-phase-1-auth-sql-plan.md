# PLAN: AZR-004 Admin Phase 1 Auth Gate And SQL Schema

## Status

- Date: 2026-05-11
- Status: Owner decisions confirmed; ready for implementation planning
- Parent spec: `docs/specs/AZR-004-facebook-social-automation.md`
- Parent tasklist: `docs/tasklist/AZR-004-facebook-social-automation.tasklist.md`
- Implementation task package: `docs/plans/AZR-004-admin-phase-1-implementation-task-package.md`
- Scope: planning only; no production code changes in this phase document

## Objective

Prepare the first implementation slice for `admin.azursystech.fr`: a minimal owner-only admin surface and PostgreSQL schema foundation for Facebook Page publishing through Meta Graph API.

Phase 1 must make the future publishing flow possible without adding Meta runtime publishing yet.

## Approved Decisions

- `admin.azursystech.fr` is planned as a separate Next.js admin surface.
- Admin app placement is confirmed as `admin/` inside this repository for MVP.
- The admin app should still deploy as a separate app/container/subdomain.
- MVP auth starts with app-level owner password/session auth.
- PostgreSQL remains the source of truth.
- Meta tokens stay in environment variables for MVP.
- Encrypted token storage is deferred until OAuth/token lifecycle complexity grows.
- Post lifecycle for MVP: `draft -> scheduled -> publishing -> published / failed`.
- Telegram is the MVP notification channel for `published` and `failed` outcomes.
- `n8n` may trigger protected scheduler APIs only; it must not own state, tokens, or direct Meta publishing.
- `moderation_queue` is deferred from Phase 1 until Messenger/public comments need review workflow.

## Current Project Facts

- Current website app lives under `web`.
- Current stack: Next.js `16.2.6`, React `19.2.3`, TypeScript, `pg`.
- Current API routes are Next.js App Router route handlers under `web/src/app/api`.
- Current PostgreSQL helpers use module-local `pg.Pool` instances.
- Current VPS PostgreSQL service is `postgres:16-alpine` with constrained resources.
- Current Telegram notification helper exists in `web/src/lib/telegram-notify.ts`.
- No reusable admin auth middleware was found in inspected files.
- Existing social/admin docs under `docs/specs`, `docs/plans`, `docs/tasklist`, and `.agent` are local/ignored by git.

## Phase 1 Boundary

### In Scope

- Admin project placement fixed as `admin/` inside this repository.
- Owner-only auth gate design.
- SQL migration design for social publishing foundation.
- DB helper/pool design for admin.
- Route contract design for admin auth and future publishing.
- Verification plan for schema and auth.

### Out Of Scope

- Meta Graph API publishing call.
- Meta webhook runtime.
- Messenger bot runtime.
- n8n workflow implementation.
- Telegram notification implementation changes.
- Encrypted DB token storage.
- `moderation_queue` implementation.
- Admin dashboard polish.
- Deploy, env edits, commit, push.

## Placement Decision

Start with `admin/` inside the current repository.

Reasoning:

- The project is operated by one developer.
- Current deployment already builds/pushes Docker images from WSL.
- Shared conventions, SQL, and Telegram helper patterns are easier to inspect in one repo.
- A separate app/container can still be deployed independently from an `admin/` directory.

If repository cleanliness becomes a concern later, split the admin app after the schema and API contracts stabilize.

## Proposed File Layout

```text
admin/
  package.json
  next.config.ts
  tsconfig.json
  src/app/
  src/app/login/page.tsx
  src/app/api/auth/login/route.ts
  src/app/api/auth/logout/route.ts
  src/app/api/admin/social/posts/route.ts
  src/app/api/admin/social/posts/[id]/schedule/route.ts
  src/app/api/admin/social/posts/publish-due/route.ts
  src/lib/auth/
  src/lib/db/
  src/modules/social/
    domain/
    repositories/
    application/
    integrations/meta/
    policies/
  sql/
    001_social_admin_schema.sql
```

## Auth Gate Design

### MVP Auth Model

Use app-level owner-only password/session auth from the start. Reverse-proxy Basic Auth may be added later as defense in depth, but it is not the primary MVP auth model.

Minimal behavior:

- Login route validates a configured admin password or password hash.
- Successful login sets a secure `httpOnly` session cookie.
- Middleware or route-level helper protects all admin pages and admin API routes.
- Logout clears the session cookie.
- Browser-originating mutations require CSRF protection.
- API routes used by `n8n` use separate internal scheduler auth, not the browser session.

### Proposed Env Names

Names only; values must not be committed:

- `ADMIN_AUTH_ENABLED`
- `ADMIN_SESSION_SECRET`
- `ADMIN_PASSWORD_HASH` or `ADMIN_PASSWORD`
- `ADMIN_ALLOWED_ORIGINS`
- `ADMIN_SCHEDULER_SECRET`
- `DATABASE_URL`
- `DATABASE_SSL_MODE`
- `META_PAGE_ID`
- `META_PAGE_ACCESS_TOKEN`
- `AZURSYSTECH_TELEGRAM_NOTIFICATIONS_ENABLED`
- `AZURSYSTECH_TELEGRAM_BOT_TOKEN`
- `AZURSYSTECH_TELEGRAM_CHAT_ID`
- `AZURSYSTECH_TELEGRAM_THREAD_ID`

### Auth Guardrails

- Fail closed in production when auth secrets are missing.
- Do not log passwords, session secrets, tokens, cookies, or auth headers.
- Use `Secure`, `HttpOnly`, `SameSite=Lax` or stricter cookies.
- Keep session TTL short enough for a single-owner admin.
- Do not add RBAC in MVP.

## DB Pool Design

Admin should use one centralized DB helper, not one pool per module.

Recommended pool limits for VPS:

- `max: 2` initially for admin.
- `idleTimeoutMillis: 30_000`.
- `connectionTimeoutMillis: 5_000`.
- Reuse existing `DATABASE_SSL_MODE` semantics from `web`.

Reasoning:

- `web` already uses multiple module-local pools.
- VPS PostgreSQL is resource-constrained.
- Admin traffic is owner-only and low volume.

## SQL Schema Design

### `social_channels`

Purpose: configured social destination such as a Facebook Page.

Fields:

- `id uuid primary key`
- `type text not null` with MVP value `facebook_page`
- `name text not null`
- `external_account_id text not null`
- `status text not null default 'active'`
- `metadata jsonb not null default '{}'::jsonb`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`

Constraints/indexes:

- unique `(type, external_account_id)`
- index on `status`

Token rule:

- Do not store Page Access Token here for MVP.

### `social_posts`

Purpose: draft and scheduled Facebook Page posts.

Fields:

- `id uuid primary key`
- `channel_id uuid not null references social_channels(id)`
- `status text not null default 'draft'`
- `content text not null`
- `media jsonb not null default '[]'::jsonb`
- `source text not null default 'manual'`
- `locale text`
- `scheduled_at timestamptz`
- `scheduled_by text`
- `reviewed_at timestamptz`
- `publishing_started_at timestamptz`
- `published_at timestamptz`
- `external_post_id text`
- `error_message text`
- `llm_metadata jsonb not null default '{}'::jsonb`
- `metadata jsonb not null default '{}'::jsonb`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`

Constraints/indexes:

- status check: `draft`, `scheduled`, `publishing`, `published`, `failed`
- scheduled posts index on `(status, scheduled_at)`
- unique `external_post_id` where not null
- content not empty check

### `social_publish_jobs`

Purpose: idempotency and audit for publish attempts.

Fields:

- `id uuid primary key`
- `post_id uuid not null references social_posts(id)`
- `idempotency_key text not null`
- `status text not null default 'pending'`
- `triggered_by text not null`
- `trigger_source text not null`
- `started_at timestamptz`
- `finished_at timestamptz`
- `error_message text`
- `metadata jsonb not null default '{}'::jsonb`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`

Constraints/indexes:

- unique `idempotency_key`
- index on `(status, created_at)`
- index on `post_id`

### `social_events`

Purpose: append-only audit log for admin actions, scheduler triggers, and Meta API results.

Fields:

- `id uuid primary key`
- `channel_id uuid references social_channels(id)`
- `post_id uuid references social_posts(id)`
- `source text not null`
- `event_type text not null`
- `external_event_id text`
- `request_id text`
- `status text not null default 'received'`
- `payload jsonb not null default '{}'::jsonb`
- `error_message text`
- `created_at timestamptz not null default now()`

Constraints/indexes:

- unique `(source, external_event_id)` where `external_event_id is not null`
- index on `(post_id, created_at)`
- index on `(event_type, created_at)`

PII/token rule:

- `payload` must be redacted. Do not store raw tokens or full sensitive provider responses.

### `moderation_queue`

Purpose: future review queue for risky Messenger replies/public comments.

MVP status:

- Deferred from Phase 1.
- Do not include in the first auth/schema implementation unless a later Messenger/public comments gate explicitly opens it.

## Route Contracts For Phase 1

### Auth Routes

- `POST /api/auth/login`
  - validates owner credentials;
  - sets session cookie;
  - returns `{ ok: true }` or sanitized error.

- `POST /api/auth/logout`
  - clears session cookie;
  - returns `{ ok: true }`.

- `GET /api/auth/session`
  - returns `{ authenticated: boolean }`.

### Social Admin Routes

These can be stubbed behind auth after schema is present:

- `GET /api/admin/social/posts`
  - list posts.

- `POST /api/admin/social/posts`
  - create `draft`.

- `PATCH /api/admin/social/posts/:id/schedule`
  - move `draft` to `scheduled`.

- `POST /api/admin/social/posts/publish-due`
  - protected by admin session or internal scheduler secret;
  - in Phase 1 may return dry-run/due counts only if Meta client is not implemented.

## Status Transition Rules

Allowed MVP transitions:

- `draft -> scheduled`
- `scheduled -> publishing`
- `publishing -> published`
- `publishing -> failed`
- `failed -> scheduled` only by explicit admin retry action

Disallowed:

- `draft -> publishing`
- `scheduled -> published`
- direct n8n status mutation
- direct DB updates by Meta/n8n integrations

## n8n Contract

n8n may call only:

- `POST /api/admin/social/posts/publish-due`

Requirements:

- protected by `ADMIN_SCHEDULER_SECRET` or HMAC;
- no Page Access Token in n8n;
- no post selection logic in n8n;
- no direct Meta Graph API calls from n8n;
- no direct status writes from n8n.

## Telegram Notification Contract

Phase 1 should only design the contract. Wiring can happen after manual publish exists.

Events:

- `social.post.published`
- `social.post.failed`

Message fields:

- `request_id` or job id;
- post id;
- channel name;
- status;
- scheduled/published timestamp;
- sanitized error summary for failures.

Do not include Meta tokens or full provider responses.

## Implementation Sequence

Task 1: Admin scaffold plan

Objective:
Prepare the concrete file-level scaffold plan for an `admin/` app inside this repository.

Files:
Planning docs first; `admin/*` only after implementation approval.

Expected result:
Implementation scope is unambiguous before code starts.

Acceptance criteria:
`admin/` placement, owner auth, and deferred moderation scope are reflected in the implementation task package.

Task 2: Admin scaffold and owner-only auth

Objective:
Create minimal admin app with protected pages and API routes.

Files:
`admin/*` if in-repo placement is approved.

Expected result:
Unauthenticated access is rejected; login/session/logout works locally.

Acceptance criteria:
Auth gate smoke passes and no secrets are committed.

Task 3: DB helper and SQL schema

Objective:
Add social DB schema and centralized low-pool admin DB helper.

Files:
`admin/sql/001_social_admin_schema.sql`, `admin/src/lib/db/*`, social repository files.

Expected result:
Migration applies to local/test PostgreSQL and repositories import cleanly.

Acceptance criteria:
Schema smoke confirms create draft, schedule draft, select due posts, and record event.

Task 4: Protected post draft/schedule routes

Objective:
Add authenticated CRUD subset for draft creation/listing/scheduling.

Files:
Admin route handlers and social application/repository modules.

Expected result:
Admin can create a draft and schedule it without Meta publishing.

Acceptance criteria:
Route contract smoke passes and invalid transitions are rejected.

Task 5: Publish-due dry-run endpoint

Objective:
Prepare scheduler route without calling Meta.

Files:
Admin route handler and social service.

Expected result:
Protected endpoint returns due count and creates no duplicate publish jobs.

Acceptance criteria:
Invalid scheduler auth is rejected; idempotency smoke passes.

## Verification Plan

Minimum checks after implementation:

- `git diff --check`
- admin typecheck/lint scripts, once admin app exists
- migration apply on local/test DB
- auth gate smoke:
  - unauthenticated admin page rejected
  - login succeeds with configured test secret
  - logout clears session
- route smoke:
  - create draft
  - schedule draft
  - reject invalid transition
  - publish-due dry-run requires scheduler auth
- secret scan over diff:
  - no Meta token
  - no app secret
  - no Telegram token
  - no DB password

## Stop Conditions

Stop before implementation if:

- a new dependency is required;
- production env changes are required;
- live DB migration is required;
- deploy is required;
- Meta token values must be handled;
- auth design expands beyond owner-only MVP.

## Open Questions Blocking Implementation

None for Phase 1 implementation planning.

Runtime env values, live DB migration apply, deploy, commit, and push remain separate approval gates.
