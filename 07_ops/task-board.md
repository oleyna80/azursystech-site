# Task Board — AzurSysTech

## Current Phase

- `post-launch / go-live hardening + page-by-page QA`
- active ticket target: `AZR-003 go-live readiness / post-launch QA`
- previous ticket `AZR-002 website MVP implementation` — **closed** (25/25 tasks done)
- launch-critical `AZR-003` path is closed; current work is QA cleanup and deferred-improvement separation
- current website/design/runtime baseline: `web`
- `frontend_mvp` is historical/reference only after design transfer to `web`

## Now

- keep `web` as the canonical launch website baseline
- run a separate `AI intake Phase 1 / backend foundation` stream:
  - Task 1-3 implementation review verdict: `ACCEPT`
  - local/test DB smoke passed for migration `001` + `002`, channel contact upsert, conversation resume, message idempotency, agent state update, brief persistence, and safe test lead linking
  - `linkBriefToLead()` sanitized-error gap fixed in the shared intake storage layer
  - `/api/chat` persistence wiring passed local runtime smoke: old `{ message, history, locale } -> { reply }` compatibility preserved, optional `conversationId` returned, and inbound/outbound messages persisted in the local smoke DB
  - `/api/brief`, contact route, env, deploy, Telegram webhook, and WhatsApp webhook were not changed in this runtime gate
- prepare a clean release decision for the current local changes:
  - publishable AZR-003 docs/QA sync and lint fixes are one scope
  - AZR-004 social automation / VPS / schema changes are a separate scope
- continue page-by-page QA after the core conversion path:
  - `/`
  - `/ai-automation`
  - `/brief`
  - `/contact`
- verify that contact/brief paths keep the backend-first SQL intake and manual-review constraints documented in SSOT
- keep launch-safe AI constraints enforced:
  - no autonomous outbound
  - no pricing commitments
  - no scheduling promises
- Meta deauthorize callback was added and committed as `ac3823f`:
  - `/api/auth/facebook/deauthorize`
  - purpose: Meta app registration callback URL check
  - current behavior: inert `200/204` response only; no token deletion yet
- record the `admin.azursystech.fr` MVP decisions for the separate social/admin track:
  - separate Next.js admin surface for Facebook Page publishing through Meta Graph API
  - implementation placement: `admin/` inside this repository, deployed as a separate app/container/subdomain
  - auth gate: app-level owner password/session auth from the start
  - Phase 1 local foundation accepted: `admin/` scaffold, owner auth gate, social SQL/domain/repository foundation, protected route contracts, local DB smoke, and local auth/API runtime smoke
  - security patch gate completed: admin `next` / `eslint-config-next` updated to `16.2.6`; high/critical Next.js advisories cleared; residual moderate `postcss` advisory remains deferred because the forced audit fix is not acceptable
  - local deploy wiring implemented, verified, and committed as `dc95746`: `Dockerfile.admin`, `/health`, registry build script, admin deploy script, compose `admin` profile, nginx `admin.azursystech.fr` routing, and VPS env template
  - Meta tokens stay in env for MVP; encrypted DB storage is deferred hardening
  - post status chain: `draft -> scheduled -> publishing -> published / failed`
  - Telegram alerts on `published` and `failed`
  - `n8n` may trigger protected scheduler APIs only; PostgreSQL/admin backend remains source of truth
  - `moderation_queue` is deferred from Phase 1 until Messenger/public comments need review workflow

## Next

- next `AI intake Phase 1` gate: production-readiness review for the accepted `/api/chat` persistence changes before any live DB apply or deploy
- deploy `/api/auth/facebook/deauthorize` when the next approved website/admin release is performed so Meta can verify the deauthorization callback URL
- next `AZR-004 social/admin` gate: plan production rollout as a separate approval-gated stack after the committed local admin deploy wiring
- plan `/brief` persistence as the next backend route after live DB verification and review of the accepted chat persistence gate
- continue page-by-page QA after the core path:
  - `/business`
  - `/services` and service detail pages
  - `/about`
  - `/faq`
  - `/pricing`
  - legal and utility pages
- close `AZR-003-008`: separate deferred improvements from launch-ready baseline
- update tasklist and Memory Bank after accepted QA verdicts

## Blocked

- no active launch-critical blocker is recorded in the current SSOT
- `AI intake Phase 1` production rollout still needs live DB schema verification before applying `web/sql/002_intake_agent_foundation.sql` outside local/test DB or deploying chat persistence
- cleanup of the local smoke-test DB requires separate explicit approval because it is a destructive database operation
- deploy now uses WSL-built GHCR images and VPS `docker compose pull`; future deploys still require explicit Owner approval
- do not start new work in `frontend_mvp` unless explicitly opened as a sandbox/reference task
- do not mix the dirty `AZR-004` social automation stream into `AZR-003` page QA
- do not put Meta tokens, page access tokens, app secrets, or n8n scheduler secrets in git
- `AZR-004 admin` production rollout still needs explicit approval for: live DB schema apply, immutable admin image push, VPS `.env` secret provisioning, compose/nginx update, DNS/proxy verification, and live health/auth smoke
- local Docker image `azursystech-admin:local-smoke` exists from verification and can be removed later only with explicit cleanup approval if desired

## Later

- French / English localization rollout
- local citations plan
- broader service page expansion beyond MVP SEO set
- CRM implementation and automation
- broader AI runtime automation beyond draft-assist mode
- social automation runtime work continues under separate `AZR-004` stream
- encrypted DB storage for Meta tokens after the MVP env-token phase
- cleanup of non-critical stale tails in legacy docs

## Done

- **AZR-002 website MVP implementation** — all 25 tasks closed:
  - strategy/brand/ops docs baseline filled (`00_strategy` – `07_ops`)
  - app shell, header, footer, nav
  - all Phase 1 routes: `/`, `/services`, `/business`, `/home`, `/pricing`, `/faq`, `/contact`, `/thank-you`, `/legal`, `/privacy`
  - chat widget shell (intake-only, launch-safe)
  - visual consistency pass (`Local Professional`, ADR-015)
  - safe site-side submit path with contract validation and honeypot handling
  - runtime adapter for `v1` transport contract `site → n8n` (ADR-016)
  - historical HubSpot MVP property mapping locked as phase-2 reference (ADR-017)
- AI runtime MVP scaffolded and aligned with DeepSeek contract (ADR-007)
- VPS delivery live with Docker registry-pull deploy; GitHub remains portfolio/source repo, not the production deploy source
- VPS GHCR pull credential rotated to a dedicated classic PAT with `read:packages` only
- deploy assumptions confirmed for `azursystech.fr`
- multi-agent operating model standardized (ADR-012)
- launch contact baseline confirmed (ADR-008): form + phone + WhatsApp + site chat
- launch AI mode confirmed (ADR-010): `limited_live_intake`
- historical launch intake activation `site -> n8n -> Google Sheets` completed (ADR-018)
- current primary intake architecture fixed as backend-first SQL; `n8n` is optional automation/export layer (ADR-020)
- `AZR-003-012` baseline closure: design/template work transferred from `frontend_mvp` to `web`; `web` remains canonical baseline (ADR-019)
- `AZR-003-013` public phone / WhatsApp consistency sync completed; canonical public number is `+33 7 80 72 09 94`
- `AZR-003-014` backend-first SQL intake hardening completed on `web`
- `AZR-003-011` live intake path moved to SQL-primary behavior with optional external integration/notification fallback
- `AI intake Phase 1 / backend foundation` Task 1-3 accepted locally: additive migration, intake contracts/statuses, and storage functions passed typecheck and local DB smoke; no route behavior changed
- `AI intake Phase 1 / website chat persistence` accepted locally: runtime smoke confirmed `/api/chat` persists website chat conversations/messages while preserving legacy response compatibility
- minimal Meta deauthorize callback endpoint added and committed as `ac3823f` for app registration: `/api/auth/facebook/deauthorize`
- `AZR-004 admin` security patch gate completed locally and committed as `31252f6`
- `AZR-004 admin` deploy wiring completed, verified, and committed as `dc95746`; no push/deploy/live DB apply performed
- `/ai-automation` and `/brief` are present in `web` as the current AI automation conversion path
- core conversion-path lint blockers cleared for `/`, `/brief`, and shared header; `web` passes `npm run check:ci` with non-blocking image optimization/audit warnings
