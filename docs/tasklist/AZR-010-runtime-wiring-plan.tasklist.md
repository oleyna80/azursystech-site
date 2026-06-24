# TASKLIST: AZR-010 Runtime Wiring Plan

## Metadata

- Status: Gate A committed (`fa29581`) / Gate B committed (`dc80775`) / Gate B.2 committed (`214e024`) / Gate C.0 committed (`ada777c`) / Gate C.2a committed (`f2b4cf8`) / Gate C.2b-3 deployed and verified / Gate C.2b-4 webhook readiness plan ready / Gate C.2b-4a live webhook route plan ready / Gate C.2b-4b live webhook route committed and published through `bd48bbc` / Gate C.2b-4c deployed and verified (`b1a8870`, `51eafc6`) / Gate C.2b-4/C.2b-5 webhook registration and inbound smoke verified / Code-audit Phase 1 commits pushed (`0cce161`, `17b63e0`) / live DB migration `004` applied and verified / agent backend brief persistence pushed (`6ed691f`) / R1 unblock committed and pushed (`1979d23`) with CI passed / live DB `005` applied and verified / Skill Routing Gate SDLC patch committed and pushed (`b793ce9`) / Gate C.3-0 first-send readiness preflight verified locally / Gate C.3-0b atomic outbox claim guard verified locally
- Parent: AZR-005/AZR-006/AZR-008/AZR-009 Intake Foundation
- Goal: wire channel intake dry-run/runtime paths to SQL persistence, then add a safe admin approval / outbox workflow without live sends.
- Live status SSOT: this tasklist.
- MVP mode: Gate B is service-first only; Gate B.2 may add a local/test manager API contract, still with no live sends or external API calls.

## Work Block

Current work block is summarized by the stage/objective below.

## Stage

AZR-010 Gate C.3-0b Atomic Outbox Claim Guard

## Objective

Remove duplicate-send risk in queued outbound dispatch before any first approved live Telegram send.

## Role

Orchestrator / Scoped Coder / Reviewer / Verifier

## Expected result

- Local tests cover disabled dispatch, fake send success, fake send failure, duplicate provider-message skip, Telegram sender failure/readiness edges, and concurrent dispatch claim behavior.
- Gate C.3 first live send remains a separate Hard Stop requiring explicit Owner approval.
- No runtime endpoint, CLI, env/secrets/config, deploy, live DB, Telegram API call, WhatsApp, Google Sheets, or real client/admin message is introduced.

## Scope

- Add focused local tests for `dispatchQueuedOutboundMessages`.
- Add a contract-preserving atomic claim around queued outbox dispatch.
- Update local-only AZR-010 tasklist and memory-bank closeout evidence.

## Out of scope

- Runtime behavior expansion beyond contract-preserving fixes.
- Telegram `sendMessage`, `setWebhook`, `deleteWebhook`, `getWebhookInfo`, polling, or live rollback.
- Runtime/VPS/env/secrets/config changes.
- Live DB connection, migration, schema change, or row write.
- New route/UI/CLI for live sending.
- WhatsApp API integration, Google Sheets write, or real client/admin message.

## Gate C.1 live DB 005 closeout

- 2026-05-25: **LIVE DB 005 APPLIED + VERIFIED** after explicit Owner approval for Gate C.1, target previous VPS, and backup/snapshot/rollback readiness.
  - Project-local skill gap: `vps-db-tunnel-ops` matched the DB tunnel task and should have been used before tunnel operations. Control Tower missed the skill and later corrected the SDLC with Skill Routing Gate rules.
  - Preflight sanitized evidence:
    - required base tables existed: `intake_channel_conversations`, `intake_leads`,
    - `intake_briefs` did not exist before apply,
    - existing target constraints: `0`,
    - existing target indexes: `0`,
    - duplicate idempotency keys: `0`,
    - invalid rows for planned constraints: `0`.
  - Apply result: `web/sql/005_intake_briefs.sql` completed with `CREATE TABLE`, `DO`, and `CREATE INDEX` x4.
  - Post-verify sanitized evidence:
    - `intake_briefs` exists,
    - expected columns present: `15/15`,
    - expected constraints present and validated: `8/8`,
    - expected indexes present: `4/4`,
    - expected foreign keys present: `2/2`,
    - row count: `0`.
  - SSH DB tunnel was stopped after verification.
  - No deploy, env change, Telegram/webhook action, manual remediation, destructive SQL, payload output, `DATABASE_URL` output, or secret output occurred.
  - Next gate: Gate C.3 first approved Telegram send remains blocked until separately approved.
- 2026-05-25: **SKILL ROUTING GATE PATCH COMMITTED + PUSHED** as `b793ce9` (`docs(sdlc): require project skill routing gate`).
  - Tracked files: `AGENTS.md`, `docs/templates/work-block-template.md`, `docs/templates/subagent-mission-brief-template.md`.
  - Cached stat before commit: `3 files changed, 46 insertions(+)`.
  - Push result: `main -> main`; final tracked status clean against origin.
  - Local ignored SSOT remains outside public Git history.
- Deploy, staging, commit, push, or real client/admin messages.

## Gate C.3-0 first-send readiness preflight

- 2026-05-25: **LOCAL PREFLIGHT VERIFIED** for the first approved Telegram send boundary.
  - Added focused tests for `dispatchQueuedOutboundMessages`:
    - disabled mode returns without reading queued messages or calling sender,
    - enabled fake sender success marks queued Telegram outbox message as `sent`,
    - fake sender failure marks queued Telegram outbox message as `failed`,
    - queued message with existing `providerMessageId` is not resent.
  - Extended Telegram sender tests:
    - empty body returns `telegram_sender_missing_body` without fetch,
    - Telegram HTTP/API failure returns retryable `telegram_send_failed`,
    - missing Telegram `message_id` returns retryable `telegram_send_failed`.
  - Contract-preserving runtime fix:
    - `dispatchQueuedOutboundMessages` now passes only list filters (`channel`, `limit`) into `listQueuedOutboundMessages`; injected sender and live-send flag stay dispatcher-local.
  - Verification passed:
    - `git diff --check`,
    - `cd web && npm run test:ci -- src/lib/intake/outbox.test.ts src/lib/telegram/sender.test.ts` (`2` files, `13` tests),
    - `cd web && npm run lint` (`0` errors, `3` pre-existing `<img>` warnings),
    - `cd web && npm run check:types`,
    - `cd web && npm run build`.
  - No production behavior expansion, runtime endpoint, CLI, env/secrets/config change, deploy, live DB access, Telegram API call, WhatsApp/Google Sheets call, or real client/admin message occurred.
  - Gate C.3 first approved live Telegram send remains blocked behind separate explicit Owner approval.
  - Commit-readiness closeout 2026-05-25:
    - Commit: `1203fee` (`fix(intake): harden outbound dispatch safety`), 1 ahead of `origin/main`.
    - Full test suite: `npm run test:ci` — `14/15` files, `51/53` tests (`1` skipped file, `2` skipped tests).
    - Secret scan tracked: passed.
    - Commit diff scan: `git show 1203fee | rg -i "token|secret|password"` — only test fixture `botToken: "token"` literals (false positive).
    - Live API call scan on changed files — only `telegram.example` test URLs (false positive).
    - Unrelated dirty file: `AGENTS.md` (local SDLC edits, not staged, excluded from C.3-0 scope).
    - Production build: compiled successfully (Next.js 16.2.6).
    - Verdict: PASS — commit is push-ready; C.3-0 closeout complete.

## Gate C.3-0b atomic outbox claim guard

### Stage 0 Routing Preflight

- Work Block type: implementation + review + verification.
- Side-effect class: production code write plus local test/build side effects only.
- DB action mode: `none` by default; `local_temp` only if an optional local PostgreSQL smoke is needed.
- Hard Stops in scope: Gate C.3 first live Telegram send remains blocked; no Telegram API calls, live DB access, env/secrets, deploy, VPS/Docker action, or real client/admin message.
- Skill Routing Gate:
  - Skills checked: `.agent/ROSTER.md`, `.agent/skills/*/SKILL.md`.
  - Skills matched: `intake-agent-foundation`, `telegram-webhook-gate`, `subagent-mission-brief`, `security-verification-gate`.
  - Skills used: `intake-agent-foundation`, `telegram-webhook-gate`, `subagent-mission-brief`, `security-verification-gate`.
  - Skills skipped: `graphify-code-map` (not needed after previous code-map review; current files are scoped), `scoped-commit-guard` (no commit approved).
- Subagent Topology:
  - Classification: `Subagent-Required`.
  - Subagents planned: read-only Backend/Security Reviewer for claim design risk; read-only Verifier after implementation if available.
  - Write-capable Coder: one Scoped Coder only for the approved write-set.
  - Skip reason: none.
- Write gate: READY.

### Objective

Remove the duplicate-send risk before Gate C.3 by ensuring queued outbound messages
are claimed atomically before any provider send attempt.

### Approved write-set

- `web/src/lib/intake/outbox.ts`
- `web/src/lib/intake/outbox.test.ts`
- `web/src/lib/intake/persistence.ts`
- `web/src/lib/intake/sql-persistence.ts`
- `docs/tasklist/AZR-010-runtime-wiring-plan.tasklist.md`
- `memory_bank/context.md`
- `memory_bank/progress.md`

### Acceptance criteria

- Concurrent dispatcher attempts cannot call the sender twice for the same queued message.
- Disabled dispatch still performs zero reads and zero sends.
- Existing fake success, fake failure, and provider-message skip behavior stays compatible.
- No schema migration, route, CLI, env/secrets/config, deploy, live DB action, Telegram API call, or real client/admin message is introduced.

### Closeout evidence

- 2026-05-28: **LOCAL ATOMIC CLAIM GUARD VERIFIED** for queued outbound dispatch.
  - Implementation: `dispatchQueuedOutboundMessages` now calls the sender only inside `withQueuedOutboundMessageDispatchClaim`.
  - SQL store: the claim uses `pg_try_advisory_xact_lock` plus a fresh queued/provider-null recheck before dispatch; no new status or migration was introduced.
  - Test coverage added: concurrent dispatcher attempts for the same queued message result in one sender call; locked second attempt returns zero dispatch results.
  - Existing behavior preserved: disabled dispatch still performs zero reads/sends; fake success/failure and provider-message skip tests pass.
  - Verification passed:
    - `git diff --check`,
    - `cd web && npm run test:ci -- src/lib/intake/outbox.test.ts src/lib/telegram/sender.test.ts` (`2` files, `14` tests),
    - `cd web && npm run test:ci` (`17` files passed, `1` skipped; `72` tests passed, `3` skipped),
    - `cd web && npm run check:types`,
    - `cd web && npm run lint` (`0` errors, `3` pre-existing <img> warnings),
    - `cd web && npm run build`,
    - `scripts/secret-scan.sh tracked`,
    - `cd web && npm audit --omit=dev --audit-level=high` (no high/critical findings; existing moderate Next/PostCSS advisory remains classified as non-blocking for this gate).
  - Read-only Backend/Security Verifier subagent verdict: PASS / APPROVED; no blockers.
  - No schema migration, route, CLI, env/secrets/config change, deploy, live DB access, Telegram API call, WhatsApp/Google Sheets call, or real client/admin message occurred.
  - Residual risk: advisory locking prevents concurrent dispatcher sends while the process is alive, but it is not durable idempotency if the process crashes after provider success and before `providerMessageId` is persisted. Review provider timeout/idempotency behavior before Gate C.3 first live send.

## Approved write-set

- `docs/tasklist/AZR-010-runtime-wiring-plan.tasklist.md`
- `memory_bank/context.md`
- `memory_bank/progress.md`

## Dirty baseline

- Public repo worktree was clean at commit `6998e01` before AZR-010 Gate A implementation.
- Local workflow/tasklist/memory docs are ignored and must stay local.

## Current architecture findings

- `web/src/lib/intake/runtime.ts` is channel-neutral and returns an `IntakeDecision`.
- `web/src/lib/telegram/dry-run.ts` and `web/src/lib/web-chat/dry-run.ts` now load persisted SQL state when storage is enabled and persist decisions after dry-run normalization.
- `web/src/app/api/telegram/webhook/route.ts` now supports live inbound receive when `TELEGRAM_WEBHOOK_RECEIVE_ENABLED=true` and `TELEGRAM_WEBHOOK_SECRET` matches the Telegram secret-token header; it never sends Telegram messages.
- `web/src/app/api/chat/route.ts` has a non-production dry-run branch plus an existing live DeepSeek chat path; normal live website chat behavior remains unchanged.
- `web/src/lib/intake/sql-persistence.ts` implements `IntakePersistenceStore` but requires an injected `pg` Pool.
- `web/src/lib/intake/config.ts` is now the canonical helper for `DATABASE_URL`, SSL mode, shared Pool, and `INTAKE_STORAGE_MODE`.
- `web/src/lib/intake/storage.ts` resolves channel-intake persistence behavior for `legacy`, `dual`, and `sql_primary`.
- `web/src/lib/intake-storage.ts` now reuses the canonical helper while keeping contact-form lead persistence responsibility separate.

## Implementation result

Gate A is implemented and committed as `fa29581`. The implementation adds test-only SQL persistence wiring for Telegram and website-chat dry-run paths, with no live sends and no schema/env/config/deploy/package changes.

Gate B is implemented and committed as `dc80775`. It adds SQL-backed operations to list pending assistant outbound drafts, approve drafts, and queue approved messages without introducing a route, UI, live sender, schema change, env/config change, deploy, or external API call.

Gate B.2 is implemented and committed as `214e024`. It adds one local/test-only route contract at `web/src/app/api/intake/outbox/route.ts`, guarded by non-production runtime plus `x-azursystech-dry-run: true`, and delegates list/approve/queue behavior to the committed outbox service.

Gate C.0 is implemented and committed as `ada777c`. It adds an injected outbound sender interface plus a fake sender and dispatcher foundation over queued outbox messages only. The dispatcher is disabled unless explicitly enabled by the caller, records provider message ids on success, marks failed sends as `failed`, and does not add a live provider adapter, route, env/config change, schema change, package change, deploy, or external API call.

Gate C.2a is implemented and committed as `f2b4cf8`. It adds `web/src/lib/telegram/sender.ts` with Telegram sender config/readiness helpers, webhook registration readiness helpers, and a dormant outbound sender factory. Live sending remains disabled unless explicitly enabled by caller-provided config and env readiness; no route imports the sender yet, and no Telegram endpoint is called by default.

Gate C.2b readiness was planned locally first. It defined credential, webhook registration, live DB, deploy, inbound-only smoke, and rollback boundaries before any real Telegram or production action.

Gate C.2b execution checklist has now been executed through C.2b-5 under Owner-approved controlled Work Blocks. Webhook registration and one inbound-only smoke are complete; Gate C.3 first approved Telegram send remains blocked until separately approved.

Gate C.3-0 first-send readiness preflight is locally implemented and verified. It adds focused dispatcher/sender tests plus one contract-preserving dispatcher input cleanup so the first live send gate can be evaluated without crossing the C.3 Hard Stop.

Code-audit Phase 1 remediation has been implemented, committed, pushed, and verified. Commit `0cce161` fixed intake persistence visibility and added migration `web/sql/004_intake_status_constraints.sql`. Commit `17b63e0` fixed the sitemap gap and selected ops/admin hardening items. CI passed after push. The approved local scratch file `code_audit.md` was deleted after the durable report was retained at `docs/reports/code-audit-2026-05-22.md`.

Gate C.2b-1 config readiness map is ready locally only. It records the target host, runtime environment, bot identity, required env var names, webhook URL format, secret ownership/storage, allowed later command categories, remaining Hard Stops, and rollback plan. No secret value was written to docs, chat, git, or env.

Gate C.2b-2 live DB readiness plan is ready locally only. It identifies required migrations `001`, `002`, and `003`; defines read-only schema inspection, later migration apply sequence, backup/rollback expectations, approval gates, and active Hard Stops. No production DB connection was made, no migration was applied, and no env/secrets/deploy/Telegram action was performed.

Files intentionally not touched by the original Gate A implementation:

- `web/src/lib/telegram-notify.ts`
- contact submit route behavior
- Telegram webhook route behavior
- live deploy/config/secrets
- SQL schema

## Runtime gates

### Gate A: local/test persistence wiring

- Implemented and committed as `fa29581`.
- No live sends.
- Dry-run routes may persist inbound messages, decisions, and outbound assistant drafts.
- Uses temporary/local DB for verification only.

### Gate B: admin approval / outbox workflow

- Service-first implementation committed as `dc80775`.
- Defines safe admin approval and outbox lifecycle over existing outbound draft messages.
- Still no live sends unless Gate C is approved.
- No route/UI surface is included in Gate B. A local/test admin route or manager API contract is deferred to Gate B.2.

### Gate B.2: local/test manager API contract

- Implemented and committed as `214e024`.
- May expose a non-production, dry-run-guarded route for local/test manager approval flows.
- Must call the existing `web/src/lib/intake/outbox.ts` service instead of duplicating SQL logic in the route.
- Still no live sends, public admin UI, env/secrets/config change, deploy, live DB apply, or external API call.

### Gate C: live Telegram / WhatsApp / admin notifications

- Hard Stop.
- Requires Owner approval before any credential, webhook, send, deploy, or live DB apply.

### Gate C.1: live DB apply decision spec

- Status: spec ready only; not approved for execution.
- Purpose: bring the production database schema to the committed intake runtime baseline.
- Hard Stop actions:
  - reading or using production DB credentials,
  - connecting to the live DB,
  - applying migrations to live DB,
  - making any destructive DB change.
- Preconditions:
  - production code commit is selected and reviewed,
  - local temporary DB smoke has applied migrations `001`, `002`, and `003`,
  - Owner confirms target environment and maintenance window,
  - backup/snapshot or rollback path is confirmed outside the LLM.
- Execution outline after explicit Owner approval:
  - inspect live schema version/state with read-only queries,
  - apply only missing migrations sequentially,
  - verify required intake tables, columns, indexes, checks, and FKs,
  - do not send client/admin messages,
  - do not deploy or change env in the same gate.
- Acceptance criteria:
  - [ ] Live DB schema matches required intake migration baseline.
  - [ ] No data-destructive SQL is used.
  - [ ] Verification evidence is captured without exposing credentials.
  - [ ] Next gate remains blocked until explicitly approved.

### Gate C.2: Telegram credentials and webhook decision spec

- Status: spec ready only; not approved for execution.
- Purpose: prepare the first Telegram live connection after DB readiness.
- Recommended split:
  - **Gate C.2a: Telegram adapter code** — add config validation and sender/webhook readiness code, disabled without env; no real credentials or API calls.
  - **Gate C.2b: credentials + webhook registration** — add runtime secrets/config and call Telegram `setWebhook`; Hard Stop.
- Hard Stop actions:
  - adding, reading, or changing real bot token/webhook secret,
  - calling Telegram `setWebhook`, `deleteWebhook`, or `sendMessage`,
  - deploying runtime config,
  - sending real client/admin messages.
- Preconditions:
  - Gate C.1 live DB apply is accepted or explicitly deferred,
  - bot identity is confirmed,
  - webhook URL and secret policy are confirmed,
  - manual approval remains required before outbound sends.
- Acceptance criteria for C.2a:
  - [x] Telegram adapter can be tested with fake/local inputs only.
  - [x] Missing config fails closed with clear errors.
  - [x] No live Telegram endpoint is called by default.
  - [x] Existing dry-run routes remain compatible.
- Acceptance criteria for C.2b:
  - [ ] Credentials are handled outside repo and not logged.
  - [ ] Webhook registration is explicitly approved and verified.
  - [ ] First real send remains blocked until Gate C.3 approval.

#### Gate C.2b readiness plan/spec

- Status: plan/spec ready only; not approved for execution.
- Purpose: prepare a controlled first Telegram live connection without combining secrets, live DB apply, deploy, webhook registration, and first test traffic into one uncontrolled step.
- Approved in this plan:
  - document required decisions, Owner-owned secrets, exact stop points, verification evidence, and rollback path.
- Not approved:
  - reading, adding, or changing real `TELEGRAM_BOT_TOKEN`,
  - reading, adding, or changing real `TELEGRAM_WEBHOOK_SECRET`,
  - reading or changing production `DATABASE_URL`,
  - calling Telegram `setWebhook`, `deleteWebhook`, or `sendMessage`,
  - connecting to live DB,
  - applying migrations,
  - deploy, Docker push, or VPS changes,
  - real client/admin messages.

Required Owner decisions before execution:

1. Bot identity: client-only bot, separate admin bot, or one bot with separated client/admin chat handling.
2. Target environment: staging/test VPS or production VPS.
3. Public webhook URL, for example `https://azursystech.fr/api/telegram/webhook`.
4. Webhook secret policy: Owner/operator-generated secret, never committed, pasted into chat, or logged.
5. Live DB state: apply Gate C.1 first, or explicitly defer if webhook remains persistence-disabled.
6. First test chat: controlled Owner/admin Telegram chat only.
7. Rollback owner: who can unset webhook, remove env values, and redeploy the previous image if needed.

Recommended execution split:

1. **C.2b-1: config readiness checklist**
   - Owner confirms env var names, target host, and operator.
   - No secret values are pasted into chat or repo.
2. **C.2b-2: live DB readiness gate**
   - Use production DB only after explicit approval.
   - Inspect live schema read-only first.
   - Apply missing migrations only if Gate C.1 is approved.
3. **C.2b-3: deploy readiness gate**
   - Build/deploy an immutable reviewed commit with runtime env set by Owner/operator.
   - Verify health and dry-run behavior before webhook registration.
4. **C.2b-4: webhook registration gate**
   - Owner explicitly approves one Telegram `setWebhook` action.
   - Register webhook with the agreed secret header.
   - Verify webhook info shows the expected URL without exposing token or secret.
5. **C.2b-5: inbound-only smoke**
   - Send one controlled Owner/admin message to the bot.
   - Confirm backend receives the update and persists inbound/client message plus assistant draft/outbox only.
   - Do not send outbound Telegram `sendMessage`.
6. **C.3: first approved live send**
   - Separate Hard Stop after C.2b acceptance.

Required runtime/env keys:

- `TELEGRAM_BOT_TOKEN` — Owner/operator-only secret.
- `TELEGRAM_WEBHOOK_SECRET` — Owner/operator-only secret.
- `TELEGRAM_WEBHOOK_URL` — public URL; not a secret.
- `TELEGRAM_LIVE_SENDS_ENABLED=false` during C.2b; enable only in Gate C.3 after approval.
- `DATABASE_URL` — live value only after Gate C.1 approval.
- `INTAKE_STORAGE_MODE=sql_primary` only after DB readiness is accepted, or another explicitly approved mode.

Verification evidence for C.2b:

- reviewed commit hash recorded,
- local checks/build passed for selected commit,
- live DB schema verified only if Gate C.1 is approved,
- deployed health check passes,
- webhook info shows expected URL without exposing token/secret,
- inbound-only smoke creates inbound/client message and assistant draft/outbox,
- no outbound live message is sent,
- logs checked for absence of token/secret leakage.

Rollback plan:

- unset/delete Telegram webhook only after Owner approval or through Owner/operator action,
- keep `TELEGRAM_LIVE_SENDS_ENABLED=false`,
- remove/revert Telegram env values from runtime host through Owner/operator action,
- redeploy previous immutable image tag if needed,
- do not delete intake DB rows during rollback; mark controlled test data if needed.

Acceptance criteria for C.2b execution:

- [x] Owner decisions are complete through C.2b-5.
- [x] No secrets are written to repo, chat, or logs.
- [x] Live DB gate was completed before inbound smoke.
- [x] Deployment target and rollback path are confirmed.
- [x] Webhook registration was an explicitly approved action.
- [x] Inbound-only smoke succeeded.
- [x] No outbound live message was sent.
- [x] Gate C.3 remains blocked until separately approved.

#### Gate C.2b execution checklist

- Status: executed through C.2b-5 under approved controlled Work Blocks; C.3 is not approved.
- Rule: each item below is a separate gated action. Do not batch live DB access, deploy, webhook registration, or first traffic unless the Owner explicitly approves that Work Block and the stage boundaries stay visible.

| Step | Action | Approval needed | Evidence to capture | Stop if |
|---|---|---|---|---|
| C.2b-0 | Confirm selected commit and local checks | Owner accepts commit for live-readiness candidate | commit hash, clean worktree, typecheck/lint/build result | worktree dirty, checks fail, or selected commit changes |
| C.2b-1 | Config readiness only | Owner confirms target host, bot identity, env names, and operator | non-secret checklist of required env names and target URL | secret value is needed in chat/repo, target host unclear, operator unclear |
| C.2b-2 | Live DB readiness | Explicit live DB approval | read-only schema inspection, migration baseline, backup/rollback confirmation | DB credentials absent, schema drift unclear, backup path missing, destructive SQL needed |
| C.2b-3 | Deploy readiness | Explicit deploy approval | immutable image/tag, health check, dry-run route proof | build/deploy fails, env missing, health fails, unexpected live sender path appears |
| C.2b-4 | Webhook registration | Explicit one-time `setWebhook` approval | webhook info shows expected URL, secret not exposed | token/secret leakage risk, wrong URL, Telegram registration fails |
| C.2b-5 | Inbound-only smoke | Explicit controlled test approval | one Owner/admin inbound update persisted, assistant draft/outbox created, no outbound sent | live outbound send occurs, inbound not persisted, logs expose secret/data |
| C.3 | First approved live send | Separate Gate C.3 approval | one approved queued test message sent and provider id recorded | any C.2b evidence missing or admin approval lifecycle unclear |

Checklist details:

- C.2b-0 selected commit:
  - record the exact commit hash used for live-readiness,
  - rerun project checks before deploy candidate creation,
  - confirm local-only workflow docs are not part of the public repo commit.
- C.2b-1 config readiness:
  - confirm env names only, not values,
  - confirm `TELEGRAM_LIVE_SENDS_ENABLED=false` for C.2b,
  - confirm `TELEGRAM_WEBHOOK_URL` matches the selected runtime host.
- C.2b-2 live DB:
  - perform read-only schema inspection first,
  - apply migrations only under Gate C.1 approval,
  - do not combine live DB apply with webhook registration.
- C.2b-3 deploy:
  - deploy only the reviewed immutable commit/image,
  - verify health before webhook registration,
  - keep admin/outbound live send disabled.
- C.2b-4 webhook:
  - registration is an operator action, not normal app runtime,
  - verify webhook info without printing token or secret,
  - rollback option is `deleteWebhook` only after Owner/operator approval.
- C.2b-5 inbound-only smoke:
  - use one controlled Owner/admin Telegram chat,
  - verify inbound client message and assistant draft/outbox,
  - do not approve, queue, or send a live assistant reply in this gate.

Closeout requirements for C.2b execution:

- record approvals granted and actions performed,
- record evidence without secrets,
- confirm no outbound live message was sent,
- document rollback state,
- leave Gate C.3 blocked until separately approved.

#### Gate C.2b-1 config readiness map

- Status: map ready only; not approved for env changes or live execution.
- Rule: secret values must never be written to docs, chat, git, shell history, logs, or screenshots.

Configuration map:

| Item | Planned value / rule | Owner |
|---|---|---|
| Target host | Production website runtime host for `azursystech.fr`, unless Owner chooses a staging/test VPS before execution | Owner |
| Runtime environment | Deployed Next.js runtime on the selected VPS/container target | Owner/operator |
| Bot identity | Client-facing Telegram intake bot for brief collection; admin bot or shared admin chat remains a separate decision | Owner |
| Webhook URL format | `https://<public-host>/api/telegram/webhook`; expected production shape is `https://azursystech.fr/api/telegram/webhook` | Owner/operator |
| First test chat | Controlled Owner/admin Telegram chat only | Owner |
| Live sends mode | `TELEGRAM_LIVE_SENDS_ENABLED=false` throughout C.2b | Owner/operator |

Required env var names:

| Env var | Secret? | Purpose | Owner | Storage |
|---|---:|---|---|---|
| `TELEGRAM_BOT_TOKEN` | yes | Telegram bot authentication for webhook registration and later sends | Owner | Runtime host secret/env store only |
| `TELEGRAM_WEBHOOK_SECRET` | yes | Secret token/header used to validate Telegram webhook requests | Owner | Runtime host secret/env store only |
| `TELEGRAM_WEBHOOK_URL` | no | Public HTTPS webhook URL | Owner/operator | Runtime host env/config |
| `TELEGRAM_LIVE_SENDS_ENABLED` | no | Explicit live-send kill switch; must be `false` in C.2b | Owner/operator | Runtime host env/config |
| `DATABASE_URL` | yes | Production PostgreSQL connection string after Gate C.1 approval | Owner | Runtime host secret/env store only |
| `INTAKE_STORAGE_MODE` | no | Storage mode; recommended `sql_primary` only after DB readiness is accepted | Owner/operator | Runtime host env/config |

Secret ownership and storage:

- Owner owns all real Telegram and database secrets.
- Operator may enter secrets only into the selected runtime host secret/env mechanism.
- Secrets are not stored in repository files, local workflow docs, Obsidian notes, tasklists, chat, screenshots, or logs.
- If a command would echo a secret, print an env dump, or expose a token in URL/output, stop.

Allowed later command categories after explicit approval:

- Read-only release verification: `git status`, `git rev-parse`, local `npm run check:types`, `npm run lint`, `npm run build`.
- Live DB readiness after Gate C.1 approval: read-only schema inspection first, migration apply only if separately approved.
- Deploy after deploy approval: build/tag/deploy the selected immutable candidate.
- Webhook registration after webhook approval: one Telegram `setWebhook` operation, followed by sanitized webhook-info verification.
- Rollback after rollback approval: disable live-send flag, unset/delete webhook, remove runtime env values, or redeploy previous immutable image.

Actions still Hard Stop:

- entering or changing real secrets,
- connecting to production DB,
- applying live migrations,
- deploy/VPS/Docker push,
- Telegram `setWebhook`,
- Telegram `deleteWebhook`,
- Telegram `sendMessage`,
- real client/admin communication,
- destructive git or DB operations.

C.2b-1 rollback plan:

- No runtime rollback is needed for C.2b-1 because no env/secrets/live state is changed.
- If config planning reveals wrong target host, wrong bot, or unclear owner/operator responsibility, stop and revise the map before C.2b-2.
- If a secret is accidentally exposed in chat/docs/logs, stop immediately for Owner-led credential rotation; do not continue to webhook or deploy gates.

Acceptance criteria for C.2b-1:

- [x] Target host rule is documented.
- [x] Runtime environment rule is documented.
- [x] Bot identity boundary is documented.
- [x] Required env var names are documented without values.
- [x] Webhook URL format is documented.
- [x] Secret owners and storage locations are documented.
- [x] Allowed later command categories are documented.
- [x] Remaining Hard Stops are documented.
- [x] Rollback/stop plan is documented.
- [x] No secret values are written to docs, chat, git, or env.

#### Gate C.2b-2 live DB readiness plan

- Status: plan ready only; not approved for production DB connection or migration.
- Purpose: confirm what the live PostgreSQL database must contain before webhook/live runtime work.
- Rule: this gate plans DB readiness only. Any live DB connection, credential use, schema inspection, or migration apply requires a separate explicit Owner approval.

DB readiness summary:

- Live runtime readiness requires the contact intake baseline plus channel-intake runtime schema.
- Current production candidate `f2b4cf8` depends on migrations `001`, `002`, and `003`.
- Gate C.2b should not register the Telegram webhook until DB readiness is accepted or explicitly deferred with a safer storage mode.
- `003` is required before any admin approval/outbox or queued outbound dispatcher path is used because current services expect `intake_channel_messages.channel`, `body`, `author_type`, `status`, `approved_at`, `sent_at`, status constraints, and direction/status indexes.

Required migrations:

| Order | File | Purpose | Required for C.2b? |
|---|---|---|---|
| 001 | `web/sql/001_intake_schema.sql` | contact intake baseline, lead events, legacy conversation tables; provides `intake_leads` FK target | yes |
| 002 | `web/sql/002_multi_channel_intake_foundation.sql` | channel conversations/messages/decisions, idempotency, provider ids, brief/admin/sheets draft fields | yes |
| 003 | `web/sql/003_intake_outbound_message_lifecycle.sql` | unified message lifecycle fields and constraints for inbound/outbound history and outbox workflow | yes |

Read-only inspection plan after explicit approval:

1. Confirm target database/host with Owner/operator without exposing `DATABASE_URL`.
2. Confirm current selected commit remains `f2b4cf8` or re-run C.2b-0 if changed.
3. Connect with read-only intent first.
4. Inspect table existence:
   - `intake_leads`
   - `intake_lead_events`
   - `intake_channel_conversations`
   - `intake_channel_messages`
   - `intake_channel_decisions`
5. Inspect required columns:
   - `intake_channel_conversations`: `schema_version`, `channel`, `conversation_key`, `sender_key`, `brief_draft`, `lead_id`
   - `intake_channel_messages`: `idempotency_key`, `provider_update_id`, `provider_message_id`, `direction`, `role`, `message_text`, `raw_payload`, `normalized_payload`, `received_at_utc`, `channel`, `author_type`, `status`, `body`, `approved_at`, `sent_at`
   - `intake_channel_decisions`: `idempotency_key`, `action`, `brief_status`, `brief_draft`, `safety_flags`, `assistant_reply`
6. Inspect required constraints/indexes:
   - `intake_channel_messages.idempotency_key` unique
   - `intake_channel_conversations(channel, conversation_key)` unique
   - `chk_intake_channel_messages_direction`
   - `chk_intake_channel_messages_author_type`
   - `chk_intake_channel_messages_status`
   - `idx_intake_channel_messages_direction_status`
7. Capture sanitized evidence only: table/column/index/constraint presence, migration gap, no secret output.

Migration apply plan for later approval:

1. Stop if read-only inspection shows unknown/manual schema drift.
2. Confirm backup/snapshot exists and restore path is known outside the LLM.
3. Apply only missing migrations in order: `001` -> `002` -> `003`.
4. Do not combine migration apply with deploy, env changes, webhook registration, or Telegram tests.
5. After apply, repeat read-only inspection and record sanitized evidence.
6. If any migration fails, stop; do not retry with ad hoc SQL unless Owner approves a separate fix plan.

Backup/rollback plan:

- Required before apply:
  - database backup/snapshot completed by Owner/operator,
  - restore procedure and responsible person confirmed,
  - maintenance window or low-traffic timing confirmed if production.
- Rollback expectation:
  - Prefer restore from backup/snapshot if live migration causes unrecoverable issue.
  - Do not use destructive manual rollback SQL without a separate approved plan.
  - Because migrations are additive/idempotent-oriented, simple rollback may not be equivalent to restore.
  - Test data created later should be marked or cleaned only under a separate approved plan.

Owner approvals needed:

- approval to use/read production DB credentials,
- approval to connect to production DB,
- approval to run read-only schema inspection,
- approval to apply each missing migration batch,
- approval of backup/restore readiness before migration apply,
- approval of any manual remediation if schema drift is found.

Hard Stops still active:

- exposing `DATABASE_URL` or DB credentials,
- connecting to live DB without approval,
- applying live migrations without approval,
- destructive SQL,
- schema edits outside committed migrations,
- env/secrets changes,
- deploy/VPS/Docker push,
- Telegram webhook registration or live sends,
- real client/admin communication.

Acceptance criteria for C.2b-2 plan:

- [x] Required migrations are identified.
- [x] Read-only inspection plan is documented.
- [x] Later migration apply sequence is documented.
- [x] Backup/rollback expectations are documented.
- [x] Owner approvals are documented.
- [x] Hard Stops remain explicit.
- [x] No live DB connection, migration, env/secrets change, deploy, or Telegram call was performed.

#### Gate C.2b-2a sanitized read-only live DB inspection result

- Status: done under separate Owner approval; evidence sanitized.
- Read-only mode was confirmed before inspection.
- Live Postgres container was healthy.
- Present baseline tables:
  - `intake_leads`
  - `intake_lead_events`
- Missing channel-intake runtime tables:
  - `intake_channel_conversations`
  - `intake_channel_messages`
  - `intake_channel_decisions`
- Conclusion: live DB is not ready for Telegram webhook/runtime readiness until missing migrations `002` and `003` are applied.
- No migration, write, schema change, env/secret output, deploy, webhook, Telegram call, or real message was performed.

#### Gate C.2b-2b migration apply approval plan

- Status: plan ready only; migration apply is still a Hard Stop.
- Selected production candidate: `f2b4cf8` (`Add Telegram sender readiness contour`).
- Known migration gap from C.2b-2a: live DB has the `001` baseline tables but is missing the channel-intake schema from `002` and lifecycle additions from `003`.

Required approval before any apply:

1. Owner confirms the target host/database out of band without exposing `DATABASE_URL`.
2. Owner/operator confirms backup or provider snapshot exists.
3. Owner/operator confirms restore path and responsible person.
4. Owner explicitly approves applying `002` and `003` to the live DB.

Backup/snapshot requirement:

- Preferred: provider-level snapshot or equivalent full database backup completed before apply.
- Acceptable alternative: Owner/operator-created `pg_dump` backup stored outside repo/chat/logs.
- The LLM must not receive, print, or store credentials, dump contents, or secret-bearing commands.
- If backup or restore path is unclear, stop before migration apply.

Apply sequence for later approval:

1. Reconfirm git candidate is `f2b4cf8`.
2. Reconfirm no deploy, env change, webhook registration, or Telegram call is bundled into this gate.
3. Open a live DB session only after Owner approval and without printing secret values.
4. Apply only:
   - `web/sql/002_multi_channel_intake_foundation.sql`
   - `web/sql/003_intake_outbound_message_lifecycle.sql`
5. Use stop-on-error execution.
6. If `002` fails, do not run `003`.
7. If `003` fails, stop and produce a separate remediation plan; do not patch live schema manually.

Post-apply read-only verification:

- Confirm these tables exist:
  - `intake_channel_conversations`
  - `intake_channel_messages`
  - `intake_channel_decisions`
- Confirm required `003` message lifecycle columns exist:
  - `channel`
  - `author_type`
  - `status`
  - `body`
  - `approved_at`
  - `sent_at`
- Confirm required constraints/indexes exist:
  - `chk_intake_channel_messages_direction`
  - `chk_intake_channel_messages_author_type`
  - `chk_intake_channel_messages_status`
  - `idx_intake_channel_messages_direction_status`
- Capture only sanitized evidence: object names, counts, and pass/fail status.
- Do not print credentials, connection strings, row payloads, client messages, or secret-bearing environment values.

Rollback/restore expectation:

- Primary rollback is restore from the confirmed backup/snapshot.
- Do not run destructive rollback SQL without a separate Owner-approved plan.
- Because `002` and `003` are additive schema migrations, restore is safer than ad hoc reversal.
- If apply succeeds but verification fails, stop before deploy/webhook and prepare a remediation plan.

Hard Stops that remain active:

- live DB migration apply,
- production deploy/VPS/Docker push,
- env/secret/config changes,
- Telegram `setWebhook`, `deleteWebhook`, or `sendMessage`,
- real client/admin communications,
- destructive git or DB operations.

Acceptance criteria for C.2b-2b:

- [x] Previous read-only inspection result is recorded in the live tasklist.
- [x] Required missing migrations are limited to `002` and `003`.
- [x] Backup/snapshot requirement is explicit.
- [x] Apply sequence and failure stops are explicit.
- [x] Post-apply read-only verification scope is explicit.
- [x] Rollback/restore expectation is explicit.
- [x] No live DB connection, migration apply, env/secrets change, deploy, webhook, Telegram call, or real message was performed.

#### Gate C.2b-2c live DB migration apply result

- Status: PASS; live DB channel-intake schema is now ready for the next runtime-readiness gate.
- Owner approval: explicit approval was given for applying only missing live DB migrations `002` and `003`.
- Backup/snapshot: treated as confirmed by Owner precondition before apply.
- Applied in order with stop-on-error enabled:
  - `web/sql/002_multi_channel_intake_foundation.sql`
  - `web/sql/003_intake_outbound_message_lifecycle.sql`
- Post-apply read-only schema verification passed with sanitized evidence:
  - required channel tables present: `3/3`
  - required message lifecycle columns present: `6/6`
  - required message lifecycle constraints present: `3/3`
  - required direction/status index present: `1/1`
- No credentials, connection strings, row payloads, client messages, or secret-bearing environment values were recorded.
- No deploy, env/secrets/config change, webhook registration, Telegram call, WhatsApp/Google Sheets call, real client/admin message, destructive SQL, or manual remediation was performed.

Acceptance criteria for C.2b-2c:

- [x] Migration `002` applied successfully.
- [x] Migration `003` applied successfully after `002`.
- [x] Stop-on-error path was respected; no manual remediation was needed.
- [x] Post-apply read-only schema verification passed.
- [x] Sanitized evidence only was recorded.
- [x] Out-of-scope actions were not performed.

#### Code-audit H1 live DB status constraints apply result

- Status: PASS; live DB now enforces the status constraints from `web/sql/004_intake_status_constraints.sql`.
- Owner approval: explicit approval was given for a separate live DB apply gate after local/temp DB verification and commit/push.
- Backup/snapshot: treated as confirmed by Owner precondition before DDL.
- Preflight read-only validation passed with sanitized evidence:
  - `intake_leads.status`: invalid rows `0`
  - `intake_channel_conversations.status`: invalid rows `0`
  - `intake_channel_conversations.brief_status`: invalid rows `0`
  - `intake_channel_conversations.admin_notification_status`: invalid rows `0`
  - `intake_channel_conversations.sheets_mirror_status`: invalid rows `0`
- Applied with stop-on-error enabled:
  - `web/sql/004_intake_status_constraints.sql`
- Post-apply read-only verification passed with sanitized evidence:
  - expected status constraints present: `5/5`
  - repeated invalid-count check: `0` invalid rows across all five checked fields
- Operational hygiene:
  - live SSH DB tunnel was opened only for the approved gate,
  - no credentials, connection strings, row payloads, client messages, or secret-bearing environment values were recorded,
  - tunnel was stopped and verified as not running after the gate.
- No deploy, env/secrets/config change, webhook registration, Telegram call, WhatsApp/Google Sheets call, real client/admin message, destructive SQL, or manual remediation was performed.

Acceptance criteria:

- [x] Live DB preflight was clean before DDL.
- [x] Backup/snapshot precondition was confirmed before apply.
- [x] Migration `004` applied successfully with stop-on-error.
- [x] Post-apply constraints verification passed: `5/5`.
- [x] Post-apply invalid-count verification remained clean.
- [x] Sanitized evidence only was recorded.
- [x] Out-of-scope actions were not performed.

#### Gate C.2b-3 deploy/runtime readiness plan

- Status: plan ready only; not approved for deploy, Docker push, VPS change, env/secret change, webhook registration, Telegram call, or real message.
- Purpose: define the deploy candidate, runtime config boundary, health checks, and rollback evidence before any production deploy action.
- Selected production candidate: `f2b4cf8` (`Add Telegram sender readiness contour`) unless Owner explicitly selects a newer reviewed commit before deploy.
- Live DB prerequisite: C.2b-2c is complete; migrations `002` and `003` were applied and verified with sanitized evidence.
- Canonical deploy model: WSL build -> immutable GHCR image -> VPS registry pull; do not build on the VPS.

Required Owner decisions before deploy execution:

1. Confirm selected commit/image candidate.
2. Confirm target host/runtime directory remains the production website runtime for `azursystech.fr`.
3. Confirm who enters runtime env values on the host; no secret values go into docs, chat, git, or logs.
4. Confirm `TELEGRAM_LIVE_SENDS_ENABLED=false` remains set for C.2b.
5. Confirm rollback target: previous known-good immutable image tag.
6. Confirm deploy window and operator.

Deploy readiness checks to run before any deploy approval:

- Local release checks from WSL:
  - `npm run check:types`
  - `npm run lint`
  - `npm run build`
  - optionally `npm run check:security` if not already covered by CI policy.
- Worktree/release identity:
  - clean public repo worktree,
  - exact commit hash recorded,
  - local-only workflow docs remain ignored and are not part of the public commit.
- Runtime config readiness:
  - `DATABASE_URL` present on runtime host after DB readiness, without printing value,
  - `INTAKE_STORAGE_MODE` explicitly set to the approved runtime mode,
  - `TELEGRAM_BOT_TOKEN` and `TELEGRAM_WEBHOOK_SECRET` are not required for deploy-only proof unless webhook registration is in a later approved gate,
  - `TELEGRAM_WEBHOOK_URL` matches `https://azursystech.fr/api/telegram/webhook` if prepared,
  - `TELEGRAM_LIVE_SENDS_ENABLED=false`.

Deploy execution outline for later approval:

1. Build the selected commit into an immutable GHCR image from WSL.
2. Record image tag and digest without exposing credentials.
3. Update VPS runtime to pull the immutable image through the registry-pull deploy flow.
4. Do not run `npm ci`, `npm run build`, or `docker compose build` on the VPS.
5. Do not register Telegram webhook in the same gate.
6. Do not send live Telegram, WhatsApp, Google Sheets, client, or admin messages.

Post-deploy verification plan:

- Verify runtime services are healthy.
- Verify public health endpoints:
  - `https://azursystech.fr/health`
  - `https://www.azursystech.fr/health`
- Verify the deployed image/tag matches the selected candidate.
- Verify logs do not expose Telegram or DB secrets.
- Verify no Telegram `setWebhook`, `deleteWebhook`, or `sendMessage` action occurred.
- Optional smoke only if separately approved and non-sending:
  - dry-run route proof,
  - storage/readiness proof without sending real messages.

Rollback plan:

- Primary rollback: redeploy previous known-good immutable GHCR image tag.
- Keep `TELEGRAM_LIVE_SENDS_ENABLED=false`.
- Do not delete DB rows, Docker volumes, networks, old images, or credentials without separate approval.
- If health fails after deploy, stop before webhook registration and prepare a rollback/recovery report.
- If secrets appear in logs/output, stop for Owner-led credential rotation before any further live work.

Hard Stops still active:

- production deploy/VPS/Docker push until separately approved,
- env/secret/config changes until separately approved,
- Telegram `setWebhook`, `deleteWebhook`, or `sendMessage`,
- real client/admin communications,
- destructive Docker/git/DB operations,
- combining deploy with webhook registration or first live test.

Acceptance criteria for C.2b-3 plan:

- [x] Deploy candidate rule is documented.
- [x] Runtime env boundary is documented without secret values.
- [x] Registry-pull deploy model is confirmed.
- [x] Pre-deploy checks are documented.
- [x] Post-deploy health/runtime verification is documented.
- [x] Rollback plan is documented.
- [x] Remaining Hard Stops are explicit.
- [x] No deploy, Docker push, VPS change, env/secret change, webhook registration, Telegram call, or real message was performed.

#### Gate C.2b-3 deploy execution result

- Status: PASS; approved image is deployed and public health checks passed.
- Deployed image: `ghcr.io/oleyna80/azursystech-app:sha-f2b4cf800ebe-20260518T161108Z`.
- Approved digest: `sha256:136aae9371d56589e46c59fed3cf92a290d0dff2d97176226d14678da8543fd3`.
- Candidate: `f2b4cf8` (`Add Telegram sender readiness contour`).
- Pre-deploy evidence: candidate matched, image was already built and pushed, and release checks had passed before deploy retry.
- VPS safety flags were verified in `.env` before deploy and after deploy:
  - `TELEGRAM_LIVE_SENDS_ENABLED=false`
  - `TELEGRAM_WEBHOOK_REGISTRATION_ENABLED=false`
- Runtime evidence:
  - deployed app container image matches the approved image,
  - `azursystech-app` is healthy,
  - `azursystech-web` is healthy,
  - `azursystech-postgres` is healthy,
  - `https://azursystech.fr/health` returned HTTP 200,
  - `https://www.azursystech.fr/health` returned HTTP 200.
- Telegram-disabled evidence:
  - app container has no `TELEGRAM_BOT_TOKEN`,
  - sanitized log pattern count for Telegram webhook/send/token/DB-secret patterns was `0`,
  - no Telegram `setWebhook`, `deleteWebhook`, or `sendMessage` action occurred.
- Out of scope remained respected: no WhatsApp/Google Sheets call, no DB migration/schema change, no `DATABASE_URL` change, no new secret, no webhook registration, and no real client/admin message.
- Non-blocker: `docker-compose.vps.yml` does not currently pass `TELEGRAM_LIVE_SENDS_ENABLED` / `TELEGRAM_WEBHOOK_REGISTRATION_ENABLED` into the app container. This remains fail-closed because absence disables live sending and webhook registration in code, but explicit container-level flags should be handled as a separate approved config change if desired.
- At C.2b-3 closeout, the next gate was C.2b-4 webhook registration readiness planning; webhook registration and Telegram live calls were not approved at that time.

#### Gate C.2b-4 webhook registration readiness plan

- Status: plan/spec ready only; not approved for env/secret changes, webhook registration, Telegram API calls, deploy, DB changes, live sends, or real traffic.
- Purpose: define the exact prerequisites and evidence for a later one-time Telegram `setWebhook` action without combining it with route implementation, config changes, deploy, or first live message.
- Current blocker: production `web/src/app/api/telegram/webhook/route.ts` is still dry-run/test-only and returns `404` unless the runtime is non-production and `x-azursystech-dry-run: true` is present. Do not register the real Telegram webhook until a separate approved implementation/deploy gate adds live webhook request validation and inbound handling.
- Current deploy state:
  - approved image `ghcr.io/oleyna80/azursystech-app:sha-f2b4cf800ebe-20260518T161108Z` is deployed and healthy,
  - VPS `.env` has `TELEGRAM_LIVE_SENDS_ENABLED=false` and `TELEGRAM_WEBHOOK_REGISTRATION_ENABLED=false`,
  - app container has no `TELEGRAM_BOT_TOKEN`,
  - no webhook registration or live send occurred.
- Required readiness before `setWebhook` approval:
  - live webhook route is implemented, reviewed, verified, deployed, and healthy,
  - route validates Telegram webhook secret before processing updates,
  - runtime config explicitly passes required Telegram env names into the app container if readiness/registration runs inside runtime,
  - Owner stores `TELEGRAM_BOT_TOKEN` and `TELEGRAM_WEBHOOK_SECRET` only in approved runtime secret/env storage,
  - `TELEGRAM_WEBHOOK_URL=https://azursystech.fr/api/telegram/webhook` is confirmed,
  - `TELEGRAM_LIVE_SENDS_ENABLED=false` remains false during webhook registration readiness,
  - any temporary `TELEGRAM_WEBHOOK_REGISTRATION_ENABLED=true` use is separately approved and limited to the registration operation,
  - live DB schema from C.2b-2c and deployed runtime from C.2b-3 remain healthy.
- Later approved registration shape:
  - call Telegram `setWebhook` once with HTTPS URL, webhook secret, limited `allowed_updates`, and a deliberate `drop_pending_updates` choice,
  - do not call `sendMessage`,
  - do not call `deleteWebhook` unless rollback is separately approved.
- Sanitized verification after registration:
  - `getWebhookInfo` shows the expected URL,
  - token and webhook secret are redacted from all output,
  - pending/update/error fields are recorded only if non-sensitive,
  - public `/health` remains HTTP 200,
  - any controlled inbound webhook smoke is a separate approval if it would generate live Telegram traffic.
- Stop conditions:
  - route still returns production `404` / remains dry-run-only,
  - webhook secret validation is absent,
  - token or secret would be printed,
  - webhook URL mismatch,
  - health check failure,
  - Telegram API error,
  - any need to send a message,
  - any need for DB/config/deploy changes not explicitly approved.
- Rollback plan for later approval:
  - primary rollback is not registering until the route is live-ready,
  - if webhook was registered and must be removed, request separate approval for Telegram `deleteWebhook`,
  - keep `TELEGRAM_LIVE_SENDS_ENABLED=false`,
  - do not delete DB rows or rotate secrets unless Owner approves.
- Acceptance criteria for this plan:
  - [x] Current route blocker is documented.
  - [x] Secret/env boundaries are documented.
  - [x] `setWebhook`, `getWebhookInfo`, and `deleteWebhook` boundaries are documented.
  - [x] Required preconditions and stop conditions are explicit.
  - [x] No env/secret/config change, Telegram API call, webhook registration, live send, deploy, DB change, or real message was performed.
- Next gate: C.2b-4a live webhook route implementation plan, or Owner decision to pause before implementing live route support.

#### Gate C.2b-4a live webhook route implementation plan

- Status: plan/spec ready only; no code, env/secrets, deploy, DB change, Telegram API call, webhook registration, live send, or real message is approved in this block.
- Executive verdict: implement inbound webhook receiving as a separate route-readiness gate before any `setWebhook` action. The route must accept real Telegram updates only when an explicit receive flag and secret-token validation pass. It must never send Telegram messages.
- Current route gap:
  - `web/src/app/api/telegram/webhook/route.ts` is dry-run/test-only,
  - production requests return `404`,
  - there is no production secret-header verification,
  - unsupported live update types are not explicitly classified,
  - the route currently returns dry-run response shape with `decision`, which is too verbose for production webhook acknowledgements.
- Proposed production route behavior:
  - `GET`, unsupported methods, and disabled production webhook receive path return `404`,
  - `POST` in production returns `404` unless `TELEGRAM_WEBHOOK_RECEIVE_ENABLED=true` and a webhook secret is configured,
  - verify `X-Telegram-Bot-Api-Secret-Token` before parsing/processing the update,
  - accept only JSON payloads within the existing bounded body-size pattern,
  - normalize supported Telegram updates through the existing intake adapter path,
  - return a minimal acknowledgement body such as `{ ok: true }` after successful handling,
  - return `200` for valid-but-unsupported Telegram updates after recording only sanitized evidence, so Telegram does not retry unsupported traffic forever,
  - keep the current non-production dry-run behavior available for local tests.
- Env var names:
  - `TELEGRAM_WEBHOOK_RECEIVE_ENABLED` — new route runtime gate for accepting real incoming Telegram webhook requests.
  - `TELEGRAM_WEBHOOK_SECRET` — canonical existing env name for the Telegram `secret_token` value and incoming `X-Telegram-Bot-Api-Secret-Token` comparison.
  - `TELEGRAM_WEBHOOK_URL` — public HTTPS URL used by later registration, not required for request handling.
  - `TELEGRAM_WEBHOOK_REGISTRATION_ENABLED` — registration-operation gate only; do not use as the runtime receive gate.
  - `TELEGRAM_LIVE_SENDS_ENABLED` — outbound sending gate only; must remain independent from inbound receive and false until the first-send gate.
  - `TELEGRAM_BOT_TOKEN` — required for later `setWebhook` / `getWebhookInfo` / `sendMessage` operations, not required by the inbound route itself.
  - `INTAKE_STORAGE_MODE`, `DATABASE_URL`, and `DATABASE_SSL_MODE` — existing persistence config used by the storage layer when SQL persistence is enabled.
  - Do not introduce `TELEGRAM_WEBHOOK_SECRET_TOKEN` unless a separate config migration renames the existing `TELEGRAM_WEBHOOK_SECRET`.
- Security checks:
  - compare the secret header against the configured secret before parsing or logging payload details,
  - reject missing or mismatched secret with `404` or `401`; prefer `404` if we want the endpoint to stay indistinct,
  - never log token, secret, full request headers, full raw payload, full message text, or connection strings,
  - log only sanitized fields: update type, presence of message text, provider update id/message id, channel, coarse result, and error category,
  - preserve idempotency through existing provider update/message ids.
- Accepted update types:
  - MVP accepts `message` with text from private chats first,
  - group/supergroup support is deferred unless explicitly needed,
  - `edited_message`, `callback_query`, media-only messages, business/guest updates, channel posts, joins, reactions, polls, payments, and managed-bot updates are unsupported for MVP,
  - unsupported updates return `200` with a sanitized ignored result and no persistence mutation unless a future requirement says otherwise.
- Persistence behavior:
  - supported text messages use existing normalization and `runIntakeDryRun` decision generation,
  - persist inbound client message and assistant outbound draft through existing `persistIntakeDecision`,
  - no outbound provider send is attempted,
  - `legacy`: route may acknowledge without SQL persistence only if explicitly accepted for production receive; recommended live setting is not `legacy`,
  - `dual`: persistence failure logs sanitized error and acknowledges only if the Owner accepts best-effort data loss risk,
  - `sql_primary`: persistence failure fails closed with `503` so Telegram can retry and the inbound message is not silently lost,
  - recommended live mode for webhook receive is `sql_primary`.
- Failure behavior:
  - disabled route or missing secret config: `404`,
  - secret mismatch: `404` or `401`; choose one during implementation and keep it consistent,
  - invalid JSON / too large: `400` / `413`,
  - unsupported update: `200` ignored,
  - adapter invalid supported message: `400`,
  - persistence unavailable in `sql_primary`: `503`,
  - unexpected error: `500` only after sanitized logging.
- Verification plan for the implementation gate:
  - `git diff --check`,
  - `cd web && npm run check:types`,
  - `cd web && npm run lint`,
  - `cd web && npm run build`,
  - local route smoke with no secret, wrong secret, correct secret, unsupported update, valid text update, too-large payload, invalid JSON, and persistence failure in `sql_primary`,
  - temporary local DB smoke applying `001` + `002` + `003`, then verifying inbound `sent` and outbound assistant `draft` rows,
  - direct scan proving no `setWebhook`, `deleteWebhook`, `sendMessage`, WhatsApp, or Google Sheets live call was added to the route.
- Proposed implementation write-set for next gate:
  - `web/src/app/api/telegram/webhook/route.ts`,
  - `web/src/lib/telegram/intake-adapter.ts` only if the live/dry-run type name needs clarification,
  - `web/src/lib/telegram/dry-run.ts` only if shared live intake handling is extracted,
  - `web/src/lib/telegram/sender.ts` only if webhook env helpers need the new receive flag,
  - `docs/tasklist/AZR-010-runtime-wiring-plan.tasklist.md`,
  - `memory_bank/context.md`,
  - `memory_bank/progress.md`,
  - `memory_bank/archive/progress-2026-05.md`.
- Hard Stops still active:
  - `setWebhook`, `deleteWebhook`, `sendMessage`, or any Telegram API call,
  - env/secret/config changes,
  - deploy,
  - live DB changes,
  - real client/admin messages,
  - WhatsApp/Google Sheets calls.
- Recommended next implementation block: C.2b-4b live webhook route implementation, local/test verification only, no registration and no live Telegram calls.

#### Gate C.2b-4b live webhook route implementation

- Status: implemented, locally verified, committed, and published through `bd48bbc`; not deployed, not registered, not live.
- Files changed:
  - `web/src/app/api/telegram/webhook/route.ts`
  - `web/src/lib/telegram/intake-adapter.ts`
  - `web/src/lib/telegram/dry-run.ts`
  - `web/src/lib/telegram/sender.ts`
- Result:
  - added `TELEGRAM_WEBHOOK_RECEIVE_ENABLED` as the runtime receive gate,
  - uses existing `TELEGRAM_WEBHOOK_SECRET` for `X-Telegram-Bot-Api-Secret-Token`,
  - keeps webhook registration and outbound send flags separate,
  - preserves the non-production dry-run route,
  - accepts private text messages, ignores unsupported/non-private updates with `200`,
  - returns `503` on `sql_primary` persistence failure so Telegram can retry,
  - returns minimal production responses and does not expose decisions.
- Local verification:
  - `git diff --check` passed,
  - `npm run lint` passed with only existing `<img>` warnings in `web/src/app/[locale]/page.tsx`,
  - `npm run check:types` passed,
  - `npm run build` passed,
  - route smoke passed: `GET` `404`, disabled receive `404`, wrong secret `404`, invalid JSON `400`, oversized body `413`, unsupported group update `200` ignored, private text `200` ok, `sql_primary` persistence unavailable `503`.
  - local temporary DB smoke applied migrations `001`, `002`, and `003`, then confirmed live-receive `sql_primary` path created `1` conversation, `2` messages, `1` inbound `sent` client message, `1` outbound `draft` assistant message, and `1` decision; temp DB was dropped.
- No live actions:
  - no `setWebhook`, `deleteWebhook`, `sendMessage`, Telegram API call, WhatsApp/Google Sheets call, env/secret/config change, deploy, DB migration/schema change, or real message.
- Non-blockers:
  - build/start still warns about multiple lockfiles/root inference,
  - `next start` warns that standalone output should use `node .next/standalone/server.js` for production-like serving.
- Follow-up commits:
  - `ae4d0ad` — `feat(telegram): enable gated webhook receive path`,
  - `bd48bbc` — `fix(ops): close webhook body limit and publish ref gaps`.
- Next gate: C.2b-4c deploy/live-route readiness planning if approved. Webhook registration remains blocked until the route is deployed, healthy, and separately approved.

## Gate C plan/spec: live sender wiring and external integrations

### Objective

Prepare the first live-runtime wiring path for approved outbound messages while keeping every irreversible external action behind an explicit Owner-approved Hard Stop.

### Recommended MVP split

- **Gate C.0: live readiness foundation** — code/config contract only, no live API calls by default.
- **Gate C.1: live DB apply** — apply required migrations to production database; Hard Stop.
- **Gate C.2: Telegram credentials + webhook registration** — add bot token/webhook secret and call `setWebhook`; Hard Stop.
- **Gate C.3: first approved Telegram send** — send one approved queued message to a controlled test chat; Hard Stop.
- **Gate C.4: admin notification + Google Sheets mirror** — notify admin and append brief summary after successful intake; Hard Stop.
- **Gate C.5: WhatsApp parity** — repeat sender/webhook pattern only after WhatsApp Cloud API access is approved and working.

### External API boundaries

- Telegram Bot API:
  - Incoming updates use webhooks over HTTPS and may include a webhook secret header.
  - Outbound client replies use `sendMessage` with `chat_id` and text.
  - Webhook registration through `setWebhook` is not part of normal app runtime.
- WhatsApp Cloud API:
  - Deferred until Meta API access is approved and active.
  - Use the same internal channel/outbox lifecycle; channel adapter differences must stay outside intake-core.
- Google Sheets:
  - Use append-only writes for brief summaries, not as SSOT.
  - PostgreSQL remains the authoritative intake record.

### Proposed implementation boundary for Gate C.0

- Add provider sender interfaces and adapters without calling live providers unless an explicit runtime flag is enabled.
- Add a queued-message dispatcher service that:
  - loads `status = queued` outbound messages,
  - calls the channel sender only when live sending is explicitly enabled,
  - records provider message id on success,
  - moves message to `sent` or `failed`,
  - never sends unapproved drafts.
- Keep `/api/intake/outbox` local/test only until a real admin auth decision exists.
- Keep Telegram webhook route dry-run until credentials, webhook secret validation, and live registration are approved.
- Prefer idempotent send protection using existing `provider_message_id` and status transitions.

### Proposed write-set for Gate C.0 only

- `web/src/lib/intake/outbox.ts`
- `web/src/lib/intake/persistence.ts`
- `web/src/lib/intake/sender.ts`
- `web/src/lib/intake/sql-persistence.ts`
- `web/src/lib/telegram/*` sender/config files if needed
- `web/src/app/api/telegram/webhook/route.ts` only for secret-validation/readiness hooks
- `docs/tasklist/AZR-010-runtime-wiring-plan.tasklist.md`
- `memory_bank/context.md`
- `memory_bank/progress.md`
- `memory_bank/archive/progress-2026-05.md`

### Out of scope for Gate C.0

- Adding real tokens, webhook secrets, or env values.
- Calling Telegram `setWebhook`, `sendMessage`, or any live Telegram endpoint.
- WhatsApp Cloud API implementation.
- Google Sheets writes.
- Admin public UI or final auth/session model.
- Live DB migration apply.
- Deploy, Docker push, VPS changes, or production traffic changes.
- Real client/admin messages.

### Required decisions before Gate C.1+

- Production admin approval surface:
  - temporary local/operator route,
  - protected admin route,
  - or Telegram-based admin approval commands.
- Telegram bot identity and target mode:
  - client bot only,
  - separate admin notification bot,
  - or one bot with separate client/admin chat handling.
- Credential storage:
  - env vars for MVP,
  - later encrypted DB storage if multi-account support is needed.
- Google Sheets auth model:
  - service account,
  - OAuth,
  - or postpone Sheets until after Telegram live send proof.
- Send policy:
  - manual approval required for every assistant reply in MVP,
  - no prices, deadlines, tech stack promises, or contractual claims.

### Gate C.0 acceptance criteria

- [x] No live provider call occurs by default.
- [x] Only `queued` messages can be selected for send dispatch.
- [x] Draft or merely approved messages cannot be sent directly.
- [x] Sender interface records provider response without leaking tokens.
- [x] Provider failure moves message to `failed` with clear error evidence.
- [x] Duplicate dispatch cannot send the same queued message twice when `provider_message_id` is already set.
- [x] No Telegram live adapter was added; fake sender requires no real credentials.
- [x] Existing dry-run Telegram and website-chat behavior remains compatible.
- [x] No env/secrets/config/deploy/package/schema changes are introduced in Gate C.0.

### Gate C.0 verification tier

Full, because the block prepares live sender boundaries.

Required checks:

- [x] `git status --short --untracked-files=all`
- [x] `git diff --check`
- [x] `cd web && npm run check:types`
- [x] `cd web && npm run lint`
- [x] `cd web && npm run build`
- [x] Local temporary DB smoke with migrations `001`, `002`, and `003`.
- [x] SQL smoke for `queued -> sent` and `queued -> failed` using a fake sender only.
- [x] Direct scan confirming no unguarded Telegram/WhatsApp/Google Sheets live API call.
- [x] Verify no token/secret/env value appears in the diff.

### Gate C hard stops

- Adding, changing, or reading real provider credentials.
- Applying migrations to live DB.
- Calling Telegram `setWebhook`, `sendMessage`, or webhook deletion.
- Calling WhatsApp Cloud API.
- Writing Google Sheets.
- Sending admin notification or client message.
- Deploying, pushing Docker images, or changing VPS/runtime config.

### Sources checked for Gate C planning

- Telegram Bot API: webhook setup, webhook secret header, and `sendMessage`.
- Google Sheets API: `spreadsheets.values.append` append-only write model.
- Meta WhatsApp Cloud API docs: WhatsApp remains deferred until API access is approved; final implementation must re-check official Meta docs before coding.

## Gate B plan/spec: admin approval / outbox workflow

### Objective

Add a minimal backend workflow for manager approval of assistant draft replies before any outbound message can be queued for a future sender.

### Scope

- Use existing `intake_channel_messages` rows as the outbox timeline.
- Treat assistant replies as outbound drafts:
  - `direction = outbound`
  - `author_type = assistant`
  - `status = draft`
- Add or expose backend operations to:
  - list pending outbound draft messages
  - approve a draft (`draft -> approved`, set `approved_at`)
  - queue an approved message (`approved -> queued`)
- Keep the workflow dry-run/local-safe: queueing does not send.
- Keep Telegram, WhatsApp, website chat, and future channels on the same message lifecycle.

### Out of scope

- Public admin dashboard.
- Final admin authentication model.
- Live Telegram/WhatsApp sends.
- Google Sheets writes.
- Admin notification sends.
- Env/secrets/config/deploy changes.
- Live DB migration apply.
- New dependency or package changes.

### Proposed implementation boundary

- Prefer a small service module, for example `web/src/lib/intake/outbox.ts`, over adding approval logic directly to routes.
- Extend `web/src/lib/intake/sql-persistence.ts` only where SQL-backed lifecycle operations belong.
- Add a route only if it is explicitly local/test guarded or protected by an approved admin-auth decision.
- Do not add a public unprotected admin endpoint.
- Avoid schema changes for MVP Gate B; existing `status`, `approved_at`, `sent_at`, and `provider_message_id` are enough for approve/queue dry-run flow.

### Status lifecycle

- `draft`: assistant suggestion exists, not approved.
- `approved`: manager/admin approved the draft; set `approved_at`.
- `queued`: approved message is ready for a future sender; no provider call in Gate B.
- `sent` / `failed`: reserved for Gate C live sender.

Invalid transitions must fail closed. Repeated approve/queue requests should be idempotent when the current status already matches the requested terminal state.

### Storage-mode behavior

- `legacy`: outbox workflow is unavailable because it requires SQL.
- `dual`: admin state changes should fail closed if SQL persistence is unavailable; do not claim approval success on best-effort failure.
- `sql_primary`: SQL persistence is required; failures fail closed.
- invalid mode: uses canonical helper fallback behavior, but admin outbox still requires SQL availability.

### Admin auth decision

This checkout does not yet have a confirmed admin auth/session surface. Gate B implementation should therefore either:

- stay library/service-only with local DB smoke tests, or
- expose a non-production/test-only route guarded by an explicit dry-run/test condition.

A real protected admin surface is a separate approval decision.

### Gate B acceptance criteria

- [x] Pending outbound drafts can be listed from SQL.
- [x] A draft assistant message can be approved without sending it.
- [x] Approval sets `approved_at`.
- [x] An approved message can be moved to `queued` without sending it.
- [x] Invalid transitions fail closed.
- [x] Repeated approve/queue calls are idempotent where safe.
- [x] No Telegram/WhatsApp/Google Sheets/API send path is introduced.
- [x] No env/secrets/config/deploy/package change is introduced.
- [x] No public unprotected admin endpoint is introduced.
- [x] Existing Gate A dry-run behavior remains compatible.

### Gate B verification tier

Full if any route or persistence code changes. Standard is acceptable only for service-only work with no route/schema changes.

Required checks for implementation:

- [x] `git status --short --untracked-files=all`
- [x] `git diff --check`
- [x] `cd web && npm run check:types`
- [x] `cd web && npm run lint`
- [x] `cd web && npm run build`
- [x] Local temporary DB smoke with migrations `001`, `002`, and `003`.
- [x] SQL smoke for `draft -> approved -> queued` without external sends.
- [x] Direct scan confirming no live Telegram/WhatsApp/Google Sheets send path.

### Gate B stop conditions

- Need to design or expose a real public admin surface.
- Need admin credentials/session/config/env changes.
- Need a live DB migration apply.
- Need a live Telegram/WhatsApp/Google Sheets/API call.
- Need a schema change beyond the existing lifecycle columns.
- Need deploy, webhook registration, or real client/admin messages.

## Gate B.2 plan/spec: local/test manager API contract

### Objective

Add a minimal local/test API contract so a manager approval flow can exercise the committed outbox service before any public admin surface exists.

### Recommended boundary

- Implement one non-production route, for example `web/src/app/api/intake/outbox/route.ts`.
- Guard it exactly as local/test only:
  - `process.env.NODE_ENV !== "production"`
  - request header `x-azursystech-dry-run: true`
  - otherwise return 404.
- Keep approval logic in `web/src/lib/intake/outbox.ts`; the route should validate request/response shape only.
- Do not add UI, admin auth, session handling, env variables, middleware, schema changes, or sender logic.

### Proposed API contract

`GET /api/intake/outbox?channel=telegram&limit=50`

- Lists pending outbound assistant draft messages.
- Optional `channel`: one of existing intake channels.
- Optional `limit`: integer clamped by service behavior.
- Success response:
  - `{ ok: true, mode: "dry_run", messages: [...] }`

`POST /api/intake/outbox`

- Body:
  - `{ "action": "approve", "messageId": "<uuid>" }`
  - `{ "action": "queue", "messageId": "<uuid>" }`
- `approve` calls `approveOutboundDraftMessage`.
- `queue` calls `queueApprovedOutboundMessage`.
- Success response:
  - `{ ok: true, mode: "dry_run", result }`
- Expected error mapping:
  - invalid JSON / invalid body: `400`
  - missing SQL storage / unavailable outbox: `503`
  - message not found: `404`
  - invalid transition: `409`
  - production or missing dry-run header: `404`

### Scope

- Local/test route contract for listing, approving, and queueing outbox messages.
- Request validation and response mapping.
- Route-level smoke tests against a temporary/local DB if practical.
- Tasklist and memory-bank SSOT updates.

### Out of scope

- Public admin dashboard.
- Real admin authentication/session model.
- Live Telegram/WhatsApp sends.
- Google Sheets writes.
- Admin notification sends.
- Env/secrets/config/deploy/package changes.
- Live DB migration apply.
- New SQL migration or schema change.
- Real client/admin messages.

### Proposed write-set

- `web/src/app/api/intake/outbox/route.ts`
- `web/src/lib/intake/outbox.ts` only if a small exported helper or error type adjustment is needed
- `docs/tasklist/AZR-010-runtime-wiring-plan.tasklist.md`
- `memory_bank/context.md`
- `memory_bank/progress.md`
- `memory_bank/archive/progress-2026-05.md`

### Acceptance criteria

- [x] Route is unavailable in production and without `x-azursystech-dry-run: true`.
- [x] `GET` lists pending assistant outbound drafts through `listPendingOutboundDrafts`.
- [x] `POST approve` approves a draft without sending it.
- [x] `POST queue` queues an approved message without sending it.
- [x] Invalid body returns `400`.
- [x] Missing message returns `404`.
- [x] Invalid transition returns `409`.
- [x] SQL unavailable / outbox unavailable returns `503`.
- [x] Route does not import `pg` or perform raw SQL directly.
- [x] Route does not call Telegram, WhatsApp, Google Sheets, or any external sender/API.
- [x] No UI, env/secrets/config/deploy/package/schema changes are introduced.

### Verification tier

Full, because Gate B.2 introduces a new route/API contract.

Required checks:

- [x] `git status --short --untracked-files=all`
- [x] `git diff --check`
- [x] `cd web && npm run check:types`
- [x] `cd web && npm run lint`
- [x] `cd web && npm run build`
- [x] Local temporary DB smoke with migrations `001`, `002`, and `003`
- [x] Route smoke:
  - missing dry-run header returns `404`
  - invalid body returns `400`
  - list pending draft returns `200`
  - approve draft returns `200`
  - queue approved message returns `200`
  - invalid transition returns `409`
  - missing message returns `404`
  - unavailable outbox returns `503`
- [x] Direct scan confirming no live Telegram/WhatsApp/Google Sheets send path.

### Stop conditions

- Need a real public admin route or UI.
- Need admin auth/session design.
- Need env/secrets/config/package changes.
- Need schema migration or live DB apply.
- Need live sender, webhook registration, deploy, or real client/admin communication.

## Acceptance criteria

- [x] `legacy`: dry-run behavior does not require DB and current response shape remains unchanged.
- [x] `dual`: persistence is best-effort; DB failure must not break dry-run response.
- [x] `sql_primary`: persistence failure fails closed for the dry-run request.
- [x] Invalid `INTAKE_STORAGE_MODE` falls back to `legacy` through one canonical helper.
- [x] Telegram dry-run route can load prior conversation state from SQL when storage is enabled.
- [x] Website-chat dry-run route can load prior conversation state from SQL when storage is enabled.
- [x] Inbound client messages persist as `direction=inbound`, `author_type=client`, `status=sent`.
- [x] Assistant replies persist as outbound draft rows with `direction=outbound`, `author_type=assistant`, `status=draft`.
- [x] Duplicate provider events remain idempotent and do not create duplicate decisions or outbound drafts.
- [x] Route responses remain compatible:
  - Telegram dry-run returns `{ ok, mode: "dry_run", decision }` or existing adapter error shape.
  - Website chat dry-run returns `{ ok, mode: "dry_run", decision }` or existing adapter error shape.
- [x] Normal website live chat behavior is unchanged unless a separate Owner-approved launch gate is opened.
- [x] No Telegram/WhatsApp/Google Sheets API call, real message, deploy, env/secrets/config change, or package change is introduced.

## Verification tier

Full, because the block connects routes to persistence.

## Required checks

- [x] `git status --short --untracked-files=all`
- [x] `git diff --check`
- [x] `cd web && npm run check:types`
- [x] `cd web && npm run lint`
- [x] `cd web && npm run build`
- [x] Local temporary DB smoke:
  - apply `web/sql/001_intake_schema.sql`
  - apply `web/sql/002_multi_channel_intake_foundation.sql`
  - apply `web/sql/003_intake_outbound_message_lifecycle.sql`
  - exercise Telegram and website-chat dry-run persistence where possible
  - verify inbound and outbound draft rows
  - drop the temporary DB
- [x] Duplicate provider-event smoke for Telegram dry-run.
- [x] Inspect changed sections directly.
- [x] Verify no secrets/tokens/env values are present in the diff.
- [x] Verify no live Telegram/WhatsApp/Google Sheets/API send path is introduced.

## Stop conditions

- Need to apply migrations to a live DB.
- Need for real Telegram/WhatsApp credentials.
- Need to register a webhook, poll Telegram, or call `sendMessage`.
- Need to write Google Sheets.
- Need to send a real client/admin message.
- Need to change env/secrets/config/deploy/package files.
- Need to alter live website chat behavior beyond the dry-run branch.
- Unrelated dirty production files block safe implementation.

## Rollback notes

- Revert only AZR-010 implementation files.
- No external state should exist if the implementation stays within Gate A.
- Temporary DB smoke databases must be dropped after verification.

## SSOT updates

- This tasklist is the live AZR-010 status source.
- `memory_bank/context.md` tracks only current focus and next gate.
- `memory_bank/progress.md` records closeout after verification evidence exists.

## Implementation tasks

- [x] Baseline git status and confirm write-set.
- [x] Add or identify one canonical channel-intake storage-mode helper.
- [x] Resolve SQL persistence store for dry-run runtime when storage is enabled.
- [x] Load conversation state from SQL before running intake decisions.
- [x] Persist decisions after successful dry-run normalization.
- [x] Preserve `legacy`, `dual`, and `sql_primary` behavior.
- [x] Keep normal website live chat behavior unchanged.
- [x] Run required checks and temporary DB smoke.

## Verification tasks

- [x] Confirm no live external sends or API calls were added.
- [x] Confirm route response shapes remain compatible.
- [x] Confirm inbound/outbound draft rows are persisted correctly.
- [x] Confirm duplicate/idempotency behavior.
- [x] Confirm storage mode failure behavior.
- [x] Confirm contact-form persistence behavior is not changed.
- [x] Confirm no env/secrets/config/deploy/package changes.

## Delivery notes

- AZR-010 Gate A is implemented locally and verified.
- AZR-010 Gate B is committed as `dc80775`.
- AZR-010 Gate B.2 is committed as `214e024`.
- Gate B.2 route smoke used a temporary local DB with migrations `001`, `002`, and `003`, then dropped the DB.
- Gate B.2 route smoke covered missing dry-run header `404`, invalid body `400`, list `200`, approve `200`, queue `200`, invalid transition `409`, missing message `404`, and unavailable outbox `503`; production guard was verified by direct route inspection.
- Gate B.2 review confirmed the commit contains only `web/src/app/api/intake/outbox/route.ts`.
- Temporary DB smoke confirmed successful route persistence for Telegram and website-chat dry-run paths in `sql_primary`.
- Duplicate Telegram provider update returned `duplicate_ignored` and did not create duplicate inbound/outbound/decision rows.
- `legacy`, `dual`, `sql_primary`, and invalid mode behavior were checked.
- Next gate is Gate C planning/spec for live sender wiring, admin notification, and external integrations. Gate C remains a Hard Stop before any live DB apply, deploy, credentials, webhook registration, or real client/admin communication.

## Sprint analysis

- What worked: service-first Gate B kept approval/outbox rules testable before adding a route; Gate B.2 then stayed thin and low-risk.
- What worked: temporary local DB smoke caught real connection/SSL behavior before acceptance.
- What worked: explicit dry-run route contract made status-code verification concrete (`404/400/200/200/200/409/404/503`).
- Friction: repeating full build/type/lint checks after small route-only changes is slow but justified for new API contracts.
- Friction: local PostgreSQL Unix-socket URL and `DATABASE_SSL_MODE=disable` need to stay visible in future smoke instructions.
- Keep: Gate C must remain plan/spec first because it crosses live sends, credentials, deploy, and external API boundaries.
- 2026-05-18 closeout: Gate C.2b-4b showed that larger Work Blocks work well when Hard Stops are explicit and the route is verified end-to-end locally before deploy. The reusable lesson is now captured in `telegram-webhook-gate`: keep receive, registration, outbound send, deploy, env/secrets, and live DB actions separate; include route smoke, temporary DB smoke, and cleanup of local server/DB resources in the same approved local block.

## Gate C.2b-4c delivery notes

- 2026-05-20: **DEPLOYED + VERIFIED** under Owner-approved full-cycle Work Block.
- Deployed image: `ghcr.io/oleyna80/azursystech-app:sha-b1a8870-20260520T143520Z` (digest `sha256:3d92dfad0dafd4d7503a85b779d145aae23713604837adfe34520473c860a838`).
- Commits in this deploy: `b1a8870` (compose/env.example Telegram receive vars), `51eafc6` (admin env vars `:?` → `:-` for profile-gated compose).
- Compose now passes `TELEGRAM_WEBHOOK_RECEIVE_ENABLED` (default `false`) and `TELEGRAM_WEBHOOK_SECRET` (default empty) to the app container.
- At C.2b-4c closeout, VPS .env had `TELEGRAM_WEBHOOK_RECEIVE_ENABLED=false` and `TELEGRAM_WEBHOOK_SECRET=` — route returned 404 for all webhook requests (fail-closed).
- Public health: `azursystech.fr/health` and `www.azursystech.fr/health` → 200.
- Webhook smoke: GET → 404, POST → 404 (receive disabled).
- Log scan: 0 token/secret patterns detected.
- Admin compose fix: `ADMIN_SESSION_SECRET` and `ADMIN_PASSWORD_HASH` changed from `:?` (required) to `:-` (optional) because admin is profile-gated and `docker compose config` validates all services regardless of profile activation.
- Next gate completed after this delivery: C.2b-4 webhook registration plus C.2b-5 inbound-only smoke.

## Gate C.2b-4/C.2b-5 delivery notes

- 2026-05-21: **WEBHOOK REGISTERED + INBOUND SMOKE VERIFIED** under Owner-approved autonomous Work Block with read-only subagents.
- Active VPS compose/runtime path confirmed by Docker labels: `/home/dmitrii/apps/azursystech`.
- Owner-provided bot token source for operator registration was `/home/dmitrii/projects/azursystech-site/.env` using `AZURSYSTECH_TELEGRAM_BOT_TOKEN`; no token value was written to repo, chat, or logs. Inbound app runtime does not require the app container to hold a bot token.
- Runtime env actions: generated `TELEGRAM_WEBHOOK_SECRET`, set `TELEGRAM_WEBHOOK_URL=https://azursystech.fr/api/telegram/webhook`, enabled `TELEGRAM_WEBHOOK_RECEIVE_ENABLED=true`, and kept `TELEGRAM_LIVE_SENDS_ENABLED=false`.
- VPS env backups recorded before changes: `.env.backup-20260521T173842Z-telegram-inbound-prep` and `.env.backup-20260521T194749Z-telegram-receive-enable`.
- App container was recreated without image change and became healthy; public health checks for `https://azursystech.fr/health` and `https://www.azursystech.fr/health` returned `200`.
- Webhook registration evidence: `setWebhook` returned success; `getWebhookInfo` showed expected URL, `allowed_updates=message`, `pending_update_count=0`, and no last error.
- Controlled inbound smoke: one private Owner/admin Telegram message was sent to the bot.
- Sanitized DB evidence: `candidate_inbound_rows=1`, `candidate_conversation_rows=1`, `provider_update_id_present=t`, `provider_message_id_present=t`, `target_inbound_rows=1`, `assistant_draft_rows=1`, `decision_rows=1`, and `decision_with_reply_rows=1`.
- No outbound send evidence: `outbound_non_draft_rows=0`, `outbound_provider_id_rows=0`, `outbound_sent_at_rows=0`, and sanitized log send/outbox pattern count `0`.
- Leak check evidence: sanitized token/secret/DB leak pattern count `0`.
- No repository code change, deploy/image change, live DB schema/migration change, WhatsApp/Google Sheets call, outbound Telegram send, commit, or push occurred during C.2b-4/C.2b-5.
- Next gate: C.3 first approved Telegram send remains a separate Hard Stop. Before C.3, align app/runtime token env naming if the app itself will perform `sendMessage`.

## Agent backend brief persistence delivery notes

- 2026-05-24: **R1 UNBLOCK COMMITTED / PUSHED / CI PASSED** as `1979d23` (`fix(intake): harden brief idempotency persistence`).
  - Fixed `saveBriefInTransaction` duplicate-submit behavior under PostgreSQL `READ COMMITTED` by moving duplicate lookup to a separate statement inside the same transaction.
  - Hardened `web/sql/005_intake_briefs.sql` constraint checks with `conrelid = 'intake_briefs'::regclass`.
  - Added focused unit tests for inserted and duplicate brief persistence paths.
  - Added opt-in SQL integration smoke test gated by `INTAKE_SQL_INTEGRATION_DATABASE_URL`.
  - Local/temp DB smoke passed on `azursystech_r1_smoke_20260524153138`: migrations `001`-`005` applied; `intake_briefs` had `11` constraints and `6` indexes; brief insert/duplicate/missing-conversation behavior passed; `mark_brief_ready` persisted exactly one agent-created draft brief linked to its conversation; temp DB was dropped.
  - Standard verification passed: `cd web && npm run test:ci` (`13` files + `1` skipped / `42` tests + `2` skipped), `cd web && npm run check:types`, `cd web && npm run lint` (`0` errors, `3` pre-existing `<img>` warnings), `cd web && npm run build`, and scoped `git diff --check`.
  - CI evidence: GitHub Actions CI for `1979d23` on `main` completed successfully.
  - Hard Stops preserved: no live DB migration apply, deploy, env/secret/config change, provider API call, outbound Telegram/WhatsApp/Google Sheets action, or real client/admin message.
  - Next gate: optional read-only R1 closeout review, then separate Owner-approved live DB `005` apply. Deploy/runtime smoke and Gate C.3 first approved Telegram send remain later separate Hard Stops.

- 2026-05-24: **IMPLEMENTED + PUSHED / R1 BLOCKED BY REVIEW** under the agent-backend architecture Work Block.
- Historical note: the blockers below were superseded by the R1 unblock commit `1979d23` recorded above.
- Architecture/spec source: `docs/plans/agent-backend-architecture-2026-05-24.md`.
- External review source: `docs/plans/agent-backend-architecture-review-2026-05-24.md`.
- Docs/process commit pushed: `4201f13` (`docs(sdlc): codify external audit runner boundary`).
- Backend commit pushed: `6ed691f` (`feat(intake): persist backend-derived brief drafts`).
- CI evidence: GitHub Actions CI run `26363378497` completed successfully for `6ed691f` on `main`.
- Local source verification passed:
  - `git diff --check`
  - `cd web && npm run test:ci` (`12` files / `40` tests)
  - `cd web && npm run check:types`
  - `cd web && npm run lint` (`0` errors, `3` pre-existing `<img>` warnings in `web/src/app/[locale]/page.tsx`)
  - `cd web && npm run build`
- Scope implemented: backend-derived brief drafts and `/brief` submission persistence are implemented in source.
- Read-only subagent reviewer verdict: `FAIL` for R1 closeout.
- R1 blockers:
  - local/temp PostgreSQL smoke through migrations `001`-`005` has not been run,
  - `saveBriefInTransaction` has a PostgreSQL `READ COMMITTED` duplicate-submit race in its insert-or-return-existing CTE.
- Non-blocking risks from review:
  - backend-derived `/brief` idempotency uses a 10-minute bucket,
  - repeated distinct `mark_brief_ready` decisions can create multiple draft rows,
  - activation must verify SQL mode and DB env because legacy mode can skip persistence,
  - migration `005` constraint existence checks should be schema/table-scoped before live apply.
- Live DB status: `web/sql/005_intake_briefs.sql` is committed but not applied to live DB.
- Hard Stops preserved: no live DB migration apply, deploy, env/secret/config change, provider API call, outbound Telegram/WhatsApp/Google Sheets action, or real client/admin message occurred during R1/R2 closeout.
- Next gate: fix duplicate race, harden `005` constraint checks if touched, run local/temp PostgreSQL smoke, and re-run read-only R1 review. Separate Owner-approved live DB apply of `web/sql/005_intake_briefs.sql` can only follow after R1 passes.
