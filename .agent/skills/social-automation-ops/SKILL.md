---
name: social-automation-ops
description: Use for AzurSysTech Facebook/Social Automation work: admin.azursystech.fr, Meta webhook, Facebook Page posts, Messenger intake, social data model, LLM reply guardrails, intake-core integration, Telegram alerts, optional n8n scheduler trigger, and MVP-safe implementation.
---

# Skill: Social Automation Ops

Use this skill for AZR-004 Facebook/Social Automation planning, implementation, review, and verification.

## Read First

Always read:

1. `AGENTS.md`
2. `.agent/workflows/sdd-protocol.md`
3. `memory_bank/context.md`
4. `memory_bank/progress.md`
5. `memory_bank/decisions.md`
6. `docs/tasklist/AZR-004-facebook-social-automation.tasklist.md`
7. `docs/specs/AZR-004-facebook-social-automation.md`

Read only if touching the related area:

- Roadmap or board status:
  - `00_strategy/roadmap.md`
  - `07_ops/task-board.md`
- Implementation plan details:
  - `docs/plans/AZR-004-facebook-social-automation-implementation-plan.md`
- Admin auth or Phase 1 work:
  - `docs/plans/AZR-004-admin-phase-1-auth-sql-plan.md`
  - `docs/plans/AZR-004-admin-phase-1-implementation-task-package.md`
- Admin implementation and deploy wiring:
   - `admin/package.json`
   - `admin/next.config.ts`
   - `admin/src/app`
   - `admin/src/lib`
   - `admin/sql`
   - `Dockerfile.admin`
   - `docker-compose.vps.yml`
   - `nginx.proxy.conf`
   - `.env.vps.example`
   - `scripts/build-push-admin-image.sh`
   - `deploy-admin.sh`
- Web/intake/database integration:
  - relevant existing implementation in `web/src/app`, `web/src/lib`, and database/migration paths discovered in the repo.

## Workflow

1. State the current stage, objective, role, and expected result.
2. Start with discovery before code:
   - backend/API route conventions;
   - database and migration conventions;
   - intake/contact persistence;
   - Telegram notification helper;
   - Google Sheets mirror/export helper;
   - existing conversation/message storage, if any.
3. Keep the module boundary from the AZR-004 spec:
   - domain/application/repositories/policies under the social module;
   - Meta API only behind a Meta client;
   - API routes as thin HTTP/auth/validation adapters.
4. Implement MVP in this order:
   - data model and repositories;
   - domain types/statuses;
   - application services;
   - Meta webhook verification/signature handling;
   - admin and webhook routes;
   - LLM, intake-core, Telegram, optional n8n scheduler trigger, and Sheets wiring;
   - verification and SSOT closeout.
5. Keep future scope separate:
   - comments;
   - public moderation queue;
   - Instagram;
   - WhatsApp;
   - unified inbox;
   - analytics.

## Guardrails

- Do not let n8n own business logic, publication state, Meta tokens, or direct Meta publishing.
- n8n may only trigger a protected admin API endpoint for scheduled publishing after manual publish is stable.
- Do not introduce SaaS or multi-tenant architecture.
- Keep PostgreSQL as the source of truth.
- Treat Google Sheets only as a mirror/export surface.
- Store Meta tokens in environment variables for MVP; require encrypted DB storage before broader OAuth/token lifecycle support.
- Keep admin deployment as a separate app/container/subdomain (`admin.azursystech.fr`) with explicit production approval gates.
- Do not run Docker push, VPS deploy, live DB apply, or production `.env` changes without Owner approval.
- Keep admin compose activation profile-gated until production rollout is explicitly approved.
- Admin health checks must be public enough for container/nginx health verification and must not expose secrets or business data.
- Validate Meta webhook challenge and request signature where applicable.
- Use idempotency for webhooks and scheduled publishing.
- Do not log secrets, full tokens, or unnecessary PII.
- Do not allow autonomous risky public replies.
- Use `draft -> scheduled -> publishing -> published / failed` as the MVP post status chain.
- Send Telegram alerts for `published` and `failed` post outcomes.
- Require human approval/scheduling for AI-generated public content.
- Prevent LLM replies from promising prices, availability, discounts, scheduling, legal conclusions, or guaranteed outcomes.
- Escalate uncertain, risky, or failed LLM decisions to admin/Telegram review.

## Validation

Run checks appropriate to the touched scope:

- `git diff --check`
- `cd admin && npm run check:ci` for admin app/runtime changes
- `cd web && npm run check:types`
- `bash -n scripts/build-push-admin-image.sh`
- `bash -n deploy-admin.sh`
- `docker compose -f docker-compose.vps.yml config` with dummy env values
- `COMPOSE_PROFILES=admin docker compose -f docker-compose.vps.yml config` with dummy env values
- local `nginx -t` for `nginx.proxy.conf` when routing changes
- local Docker image build and `/health` smoke when `Dockerfile.admin` or admin runtime wiring changes, if Docker is available
- migration apply/check command used by the repo
- webhook challenge smoke
- webhook signature fixture test
- post status transition test
- publish-due idempotency test
- scheduler trigger auth test if n8n is enabled
- Messenger low-risk reply policy test
- Messenger risky escalation policy test
- secret/PII diff review

If a check is not run, report it explicitly with the reason.

## Closeout

Update only the relevant artifacts:

- `docs/tasklist/AZR-004-facebook-social-automation.tasklist.md` as the only live ticket status source
- `00_strategy/roadmap.md` and `07_ops/task-board.md` as supporting planning context only; they must not override tasklist status
- `memory_bank/context.md` and `memory_bank/progress.md` after verified implementation
- `docs/reports/*` handoff when passing work between roles

## Handoff
- **Success condition**: задача из tasklist выполнена, handoff report создан.
- **Next**: ssot-sync-closeout
- **Auto-proceed**: 🟢 YES
- **Hard stop**: 🔴 YES — реальная публикация/отправка требует Owner approval.
