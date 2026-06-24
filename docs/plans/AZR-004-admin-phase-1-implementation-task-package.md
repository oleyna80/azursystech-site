# TASK PACKAGE: AZR-004 Admin Phase 1 Implementation

## Status

- Date: 2026-05-11
- Status: Ready for Owner review before Coder stage
- Parent plan: `docs/plans/AZR-004-admin-phase-1-auth-sql-plan.md`
- Parent tasklist: `docs/tasklist/AZR-004-facebook-social-automation.tasklist.md`
- Scope: implementation package only; no runtime code was changed by this document

## Objective

Prepare a small, reviewable implementation slice for `admin.azursystech.fr`.

The implementation must create the admin foundation without Meta runtime publishing, Telegram wiring changes, n8n workflow changes, or deployment changes.

## Confirmed Decisions

- Admin app placement: `admin/` inside this repository.
- Runtime shape: separate Next.js app/container/subdomain for `admin.azursystech.fr`.
- Auth: app-level owner password/session auth from the start.
- PostgreSQL is the source of truth.
- Meta Page token stays in env for MVP.
- Post status chain: `draft -> scheduled -> publishing -> published / failed`.
- Telegram alerts for `published` and `failed` are planned after DB/status foundation exists.
- `n8n` may only call a protected scheduler endpoint later.
- `moderation_queue` is deferred from Phase 1.

## Current Stack Facts

- There is no root `package.json`.
- Current public site app lives in `web/`.
- `web` stack: Next.js `16.2.6`, React `19.2.3`, TypeScript, `pg`, ESLint 9.
- Current Dockerfile builds only `web/`.
- VPS compose currently has `postgres`, `app`, and nginx `web` services.
- Current nginx host allowlist does not include `admin.azursystech.fr`.
- Existing PostgreSQL helpers in `web` use `pg.Pool`; admin should use one centralized low-limit pool.
- Existing Telegram helper is in `web/src/lib/telegram-notify.ts`; do not import it directly into `admin` in Phase 1 unless shared packaging is explicitly approved.

## Scope

### In Scope

- Create minimal `admin/` Next.js app scaffold.
- Add owner-only auth gate.
- Add admin DB helper with constrained pool.
- Add additive social admin SQL schema.
- Add social domain/status contracts.
- Add repository/storage functions for channel/post/event/job basics.
- Add protected draft/list/schedule route contracts.
- Add protected `publish-due` dry-run route only if schema/repository foundation is ready.
- Add local smoke/check instructions.

### Out Of Scope

- Meta Graph API publishing call.
- Meta webhook runtime.
- Messenger bot/runtime.
- WhatsApp.
- Telegram notification wiring changes.
- n8n workflow implementation.
- Admin dashboard polish.
- `moderation_queue`.
- Env file edits.
- Docker/compose/nginx deploy changes.
- Live DB migration apply.
- Commit/push.

## Dependency Strategy

- Use the same baseline dependency family as `web`: Next.js `16.2.6`, React `19.2.3`, TypeScript, ESLint 9, `pg`.
- Do not introduce auth/session dependencies in Phase 1. Use Node `crypto`, signed cookies, and server-side validation helpers.
- Creating `admin/package-lock.json` requires an explicit dependency/package-lock approval gate. Prefer `npm install --package-lock-only` from inside `admin/` after `package.json` is reviewed.
- Do not create a root workspace unless separately approved.

## Proposed Files

### New `admin/` app files

- `admin/package.json`
  - scripts: `dev`, `build`, `start`, `lint`, `check:types`, `check:ci`;
  - dependencies aligned with `web`;
  - no new package family without approval.
- `admin/package-lock.json`
  - generated only after approval for package-lock generation.
- `admin/next.config.ts`
  - `output: "standalone"`;
  - admin-safe security headers;
  - no public marketing headers copied blindly if they conflict with admin auth.
- `admin/tsconfig.json`
  - strict TypeScript;
  - `@/*` alias to `admin/src/*`.
- `admin/eslint.config.mjs`
  - same ESLint pattern as `web`.
- `admin/postcss.config.mjs`
  - only if Tailwind/global CSS is actually used.
- `admin/src/app/layout.tsx`
  - minimal admin shell; no public site header/footer/chat widget.
- `admin/src/app/page.tsx`
  - protected dashboard placeholder with operational status.
- `admin/src/app/login/page.tsx`
  - login form only.
- `admin/src/app/globals.css`
  - minimal admin styles; no large UI system.
- `admin/middleware.ts`
  - protect admin pages/API routes except login and auth endpoints.

### Auth files

- `admin/src/lib/auth/config.ts`
  - read auth env names;
  - fail closed in production if secrets are missing.
- `admin/src/lib/auth/password.ts`
  - validate configured password hash or password;
  - constant-time comparison where practical;
  - no password logging.
- `admin/src/lib/auth/session.ts`
  - sign/verify session cookie;
  - cookie flags: `HttpOnly`, `Secure` in production, `SameSite=Lax` or stricter.
- `admin/src/lib/auth/csrf.ts`
  - minimal CSRF token helper for browser-originating mutations.
- `admin/src/lib/auth/require-admin.ts`
  - shared guard for route handlers and server components.

### DB and social files

- `admin/src/lib/db/pool.ts`
  - centralized `pg.Pool`;
  - `max: 2`;
  - reuse `DATABASE_URL` and `DATABASE_SSL_MODE` semantics.
- `admin/src/modules/social/domain/status.ts`
  - canonical social post/job/channel statuses.
- `admin/src/modules/social/domain/types.ts`
  - TypeScript contracts for channel, post, event, publish job.
- `admin/src/modules/social/repositories/social-repository.ts`
  - create/list draft posts;
  - schedule posts;
  - select due posts;
  - record events;
  - create publish jobs idempotently.
- `admin/src/modules/social/application/posts.ts`
  - status transition validation;
  - business rules only; no HTTP concerns.
- `admin/src/modules/social/policies/content.ts`
  - first guardrails for post content: non-empty, max length, no token echoing.
- `admin/sql/001_social_admin_schema.sql`
  - additive social schema.

### Admin API routes

- `admin/src/app/api/auth/login/route.ts`
- `admin/src/app/api/auth/logout/route.ts`
- `admin/src/app/api/auth/session/route.ts`
- `admin/src/app/api/admin/social/posts/route.ts`
- `admin/src/app/api/admin/social/posts/[id]/schedule/route.ts`
- `admin/src/app/api/admin/social/posts/publish-due/route.ts`

## SQL Schema Package

Create `admin/sql/001_social_admin_schema.sql` with:

- `social_channels`
  - unique `(type, external_account_id)`;
  - status check with `active`, `disabled`.
- `social_posts`
  - status check: `draft`, `scheduled`, `publishing`, `published`, `failed`;
  - `scheduled_at`, `published_at`, `external_post_id`, `error_message`;
  - indexes on `(status, scheduled_at)`, `channel_id`, `created_at`;
  - unique `external_post_id` where not null.
- `social_publish_jobs`
  - `idempotency_key` unique;
  - indexes on `(status, created_at)` and `post_id`.
- `social_events`
  - append-only audit;
  - unique `(source, external_event_id)` where `external_event_id is not null`;
  - payload must be redacted by application code.

Do not include `moderation_queue` in Phase 1.

## Implementation Sequence

### Task 1: Admin scaffold

Objective:
Create the minimal `admin/` Next.js app shell and config files.

Files:
`admin/package.json`, `admin/next.config.ts`, `admin/tsconfig.json`, `admin/eslint.config.mjs`, `admin/src/app/*`.

Expected result:
Admin app can be typechecked after dependency lock generation.

Acceptance criteria:
No public site shell/chat widget is imported; no env values are committed.

### Task 2: Auth gate

Objective:
Add owner-only password/session auth and protect admin pages/routes.

Files:
`admin/middleware.ts`, `admin/src/lib/auth/*`, `admin/src/app/login/page.tsx`, `admin/src/app/api/auth/*`.

Expected result:
Unauthenticated admin page/API access is rejected; login/session/logout contracts exist.

Acceptance criteria:
Missing production secrets fail closed; cookies are secure; raw passwords/secrets are never logged.

### Task 3: SQL schema

Objective:
Add additive social admin schema without touching existing intake tables.

Files:
`admin/sql/001_social_admin_schema.sql`.

Expected result:
Local/test DB can apply the schema after explicit DB smoke approval.

Acceptance criteria:
Schema creates social channel/post/event/job tables; `moderation_queue` is absent; constraints enforce allowed statuses.

### Task 4: DB helper and repository foundation

Objective:
Add centralized DB pool and social repository functions.

Files:
`admin/src/lib/db/pool.ts`, `admin/src/modules/social/domain/*`, `admin/src/modules/social/repositories/*`, `admin/src/modules/social/application/*`.

Expected result:
Draft creation, scheduling, due-post selection, event recording, and publish-job idempotency are available behind typed functions.

Acceptance criteria:
Repository errors are sanitized; no raw tokens/PII are logged; invalid status transitions are rejected.

### Task 5: Protected route contracts

Objective:
Expose minimal protected admin API route handlers.

Files:
`admin/src/app/api/admin/social/posts/route.ts`, `admin/src/app/api/admin/social/posts/[id]/schedule/route.ts`, `admin/src/app/api/admin/social/posts/publish-due/route.ts`.

Expected result:
Admin can list/create drafts and schedule posts; `publish-due` can dry-run due counts but must not call Meta.

Acceptance criteria:
Routes are auth-protected, validate request bodies, return sanitized errors, and do not publish externally.

### Task 6: Verification handoff

Objective:
Run local checks and prepare Reviewer/Verifier notes.

Files:
No new runtime files unless a small smoke script is approved.

Expected result:
Implementation is ready for review before any env/deploy/live DB action.

Acceptance criteria:
Checks and skipped checks are reported precisely.

## Verification Plan

Required checks after implementation:

- `git diff --check`
- `cd admin && npm run check:types`
- `cd admin && npm run lint`
- `cd admin && npm run build` if dependency lock/install is available
- local/test DB migration apply for `admin/sql/001_social_admin_schema.sql`
- auth smoke:
  - unauthenticated `/` rejected or redirected;
  - login succeeds with test secret;
  - logout clears session;
  - protected API rejects missing session.
- social repository smoke:
  - create channel;
  - create draft;
  - schedule draft;
  - reject invalid transition;
  - select due scheduled post;
  - create publish job once by idempotency key;
  - record event.
- secret scan over diff.

Skipped checks must be reported with reason.

## Stop Conditions

Stop and ask for approval before:

- generating or installing dependencies/package lock;
- live DB migration apply;
- editing `.env` or production secrets;
- changing Docker/compose/nginx/deploy config;
- implementing Meta publishing;
- implementing Telegram/n8n runtime wiring;
- adding `moderation_queue`;
- committing or pushing.

## Recommended Coder Prompt

```text
Stage: AZR-004 Phase 1 / Admin Foundation Implementation
Objective: implement admin/ scaffold, owner-only auth gate, and social SQL foundation without Meta runtime publishing
Role: Coder
Expected result: small admin foundation ready for review and local verification

Read first:
- AGENTS.md
- docs/specs/AZR-004-facebook-social-automation.md
- docs/plans/AZR-004-admin-phase-1-auth-sql-plan.md
- docs/plans/AZR-004-admin-phase-1-implementation-task-package.md
- docs/tasklist/AZR-004-facebook-social-automation.tasklist.md
- web/package.json
- web/next.config.ts
- web/tsconfig.json
- web/eslint.config.mjs
- web/src/lib/intake-storage.ts
- web/src/lib/request-rate-limit.ts

Implement only:
- admin/ Next.js scaffold
- owner-only auth/session gate
- admin DB pool helper
- social domain/status/repository foundation
- admin/sql/001_social_admin_schema.sql
- protected draft/list/schedule route contracts
- publish-due dry-run route only

Do not implement:
- Meta Graph API publishing
- Meta webhook runtime
- Messenger/WhatsApp
- Telegram/n8n runtime wiring
- moderation_queue
- env/deploy changes
- live DB apply
- commit/push

Stop before dependency install/package-lock generation unless explicitly approved.
```

## Next Gate

Owner should review this task package and approve either:

1. scaffold/auth/schema implementation without package-lock generation; or
2. scaffold/auth/schema implementation plus `admin/package-lock.json` generation.
