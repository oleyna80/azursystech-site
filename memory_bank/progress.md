# Progress Log - AzurSysTech

## 2026-04-22: VPS PostgreSQL operator access hardened via loopback bind + SSH tunnel

### Done

- Updated VPS PostgreSQL operator-access baseline to use host loopback publish only:
  - `127.0.0.1:5432:5432`
- Standardized WSL access path through SSH local forwarding:
  - local `15432 -> VPS 127.0.0.1:5432`
- Added repeatable helper script:
  - `scripts/vps-db-tunnel.sh`
  - actions: `start|stop|status|test|restart`
- Updated deployment docs, tasklist, and ADR set for the new operator baseline.
- Registered a project-local skill for this workflow:
  - `.agent/skills/vps-db-tunnel-ops/SKILL.md`
  - `.agent/ROSTER.md`

### Validation

- Operator baseline verified as documented:
  - VPS PostgreSQL remains non-public;
  - tunnel target no longer depends on Docker container IP (`172.x`);
  - WSL access path is stable and reproducible.

### Notes

- This block changes operator connectivity only.
- It does not change public website behavior, lead flow, or public DB exposure policy.

## 2026-04-22: Chat assistant history pass for multi-turn context

### Done

- Extended the public chat widget payload to send recent conversation history together with the current user message.
- Kept the history contract intentionally narrow:
  - last `6` messages only;
  - `user|assistant` roles only;
  - no storage, no SQL transcript persistence, no state machine.
- Updated `/api/chat` to accept optional `history`, sanitize it, and forward recent context to DeepSeek as:
  - `system`
  - recent `history`
  - current `user` message
- Tightened the system prompt for intake-style multi-turn behavior:
  - keep the active topic;
  - do not jump to adjacent scenarios without an explicit user signal;
  - ask one next useful clarifying question;
  - do not repeat greetings;
  - do not force form/WhatsApp CTA on every early turn.
- Adjusted server-side CTA policy:
  - early turns no longer get forced CTA appended;
  - later turns still get a canonical CTA when enough context has been collected;
  - policy/security fallback branches still keep mandatory safe CTA.
- Follow-up polish pass after local printer scenario review:
  - moved forced CTA threshold later in the dialogue;
  - improved trailing CTA cleanup to avoid duplicate CTA sentences;
  - strengthened prompt guidance for ambiguous short replies so the assistant asks one clarifying question instead of reconstructing the setup too aggressively.
- Production follow-up polish after deploy verification:
  - tightened prompt wording for contradictory or ambiguous short replies;
  - instructed the assistant to prefer neutral disambiguation questions over premature paraphrase of the user's setup.
- Added a narrow server-side ambiguity guardrail for short corrective replies:
  - if the user reply is short and corrective, and the model answers with an overconfident reconstruction,
  - `/api/chat` replaces that answer with a neutral clarification template before returning it.
- Added a prompt/policy guardrail for CTA quality:
  - blocks fabricated placeholder links like `[ссылка на форму]`;
  - downgrades overly strong promises such as `оперативно свяжемся` or `подготовим предложение` to a softer manual-review handoff message.

### Validation

- Pending Verifier-stage checks for:
  - `git diff --check`
  - `cd web && npm run check:types`
  - targeted multi-turn chat request smoke

### Notes

- This pass does not add transcript persistence, chat slot memory, database schema, or VPS changes.
- If multi-turn quality is still insufficient after history-aware prompting, the next layer should be lightweight slot memory rather than immediate broad state-machine refactor.

## 2026-04-22: DB Connectivity Hardening (WSL -> VPS PostgreSQL via loopback tunnel)

### Done

- Confirmed non-interactive SSH access to VPS:
  - host: `178.156.212.10`
  - user/key: `dmitrii` + `~/.ssh/hardwarelab_deploy`
- Verified PostgreSQL runtime on VPS:
  - `azursystech-postgres` healthy
  - SQL probe successful with runtime DB user/database
- Switched VPS PostgreSQL operator access to stable loopback bind:
  - `docker-compose.vps.yml` now publishes DB as `127.0.0.1:5432:5432`
  - applied with `docker compose -f docker-compose.vps.yml up -d postgres`
- Switched WSL tunnel target from container IP to VPS loopback:
  - local `15432 -> 127.0.0.1:5432` over SSH
  - WSL `psql` probe via tunnel passed.
- Added reusable helper:
  - `scripts/vps-db-tunnel.sh` (`start|stop|status|test|restart`)
- Updated deployment docs/tasklist for this operator baseline and added ADR-025.
- Added project-local skill:
  - `.agent/skills/vps-db-tunnel-ops/SKILL.md`
  - registered in `.agent/ROSTER.md`.

### Validation

- SSH preflight matrix for candidate users/keys (non-interactive).
- VPS runtime checks:
  - `docker compose -f docker-compose.vps.yml ps postgres`
  - SQL probe in `postgres` container
  - `ss -ltn` on VPS confirms loopback listener on `127.0.0.1:5432`
- WSL checks:
  - local tunnel listener on `127.0.0.1:15432`
  - `psql -h 127.0.0.1 -p 15432 ...` query success
  - external port test: `178.156.212.10:5432` remains closed/filtered.

### Notes

- During first remote patch attempt, compose syntax was corrupted by a bad substitution and was immediately restored from timestamped backup before reapplying a safe patch.
- No secrets were committed into repository files.

## 2026-04-18: AZR-003-011 Accepted and Closed

### Done

- Accepted `AZR-003-011` after Verifier-stage review.
- Marked `AZR-003-011` as `done` in `docs/tasklist/azr-003-tasklist.md`.
- Confirmed accepted scope:
  - `/api/chat` launch gate enforces `limited_live_intake`, unsafe `AI_ALLOW_*` rejection, non-legacy intake mode, and valid DeepSeek config;
  - `/api/chat` honors `DEEPSEEK_BASE_URL` with default `https://api.deepseek.com`;
  - widget handoff remains `/api/contact/submit` with `source=website_chat`;
  - Telegram notification remains non-blocking for SQL-primary intake success;
  - Telegram success/failure event recording remains in place;
  - Telegram message includes status, urgency, lead id, source, client type, contact, city, service type, and summary.

### Validation

- `git diff --check -- web/src/app/api/chat/route.ts web/src/lib/telegram-notify.ts web/src/app/api/contact/submit/route.ts docs/tasklist/azr-003-tasklist.md memory_bank/progress.md` - pass.
- `cd web && npm run check:types` - pass.
- `cd web && npm run lint` - pass with unrelated existing warnings only.
- `cd web && npm run build` - pass.

### Notes

- `npm run check:ci` was not run end-to-end because its `npm audit` step contacts the npm registry; local CI-equivalent parts were run separately.
- No real Telegram or DeepSeek calls were made during verification.
- Chat transcript persistence remains deferred and is not part of accepted AZR-003-011 scope.

## 2026-04-18: Work Block Readiness and Verification Guardrails Added

### Done

- Extended `AGENTS.md` section `18) Subagent Model / Reasoning Policy` with model availability fallback rules:
  - prefer stronger available model when the recommended model is unavailable;
  - use a cheap read-only availability check when the environment supports it;
  - otherwise treat failed subagent launch as the availability signal and retry once with the nearest stronger available model.
- Added `AGENTS.md` section `20) Work Block Brief Template`.
- Added `AGENTS.md` section `21) Definition of Ready`.
- Added `AGENTS.md` section `22) Verifier Matrix`.
- Added `ADR-024` documenting the process guardrails.

### Validation

- Markdown-only scoped review completed.
- No runtime commands were required.

### Notes

- This is an operating-model update only; website/runtime code was not changed.

## 2026-04-18: Work Block Confirmation Policy Added

### Done

- Added `AGENTS.md` section `19) Work Block Confirmation Policy`.
- Replaced per-stage confirmation as the default operating unit with approved work blocks.
- Defined when Control Tower may proceed internally through `Reviewer`, `Coder`, and `Verifier` stages without new confirmation.
- Defined mandatory stop conditions for scope changes, new tickets, dangerous actions, external deploy/infra, secrets, production data, real client communication, destructive actions, blockers, and materially new verification fixes.
- Added `ADR-023` documenting the process decision.

### Validation

- Markdown-only scoped review completed.
- No runtime commands were required.

### Notes

- This is an operating-model update only; website/runtime code was not changed.

## 2026-04-18: AZR-003-011 Scoped Implementation Pass

### Done

- Hardened the active `web` `/api/chat` live gate for launch policy:
  - requires `AI_LAUNCH_MODE=limited_live_intake`;
  - requires `AI_ALLOW_AUTONOMOUS_OUTBOUND=false`;
  - requires `AI_ALLOW_PRICING_COMMITMENTS=false`;
  - requires `AI_ALLOW_SCHEDULING_PROMISES=false`;
  - preserves the existing non-legacy `INTAKE_STORAGE_MODE` requirement;
  - requires valid DeepSeek API configuration.
- Updated `/api/chat` to honor `DEEPSEEK_BASE_URL`, defaulting to `https://api.deepseek.com`.
- Preserved active widget flow: `ChatWidget.jsx` via `ChatWidgetContainer`; handoff continues through `/api/contact/submit` with `source=website_chat`.
- Confirmed the contact submit path already records `notification.telegram.sent` / `notification.telegram.failed` and keeps SQL-primary intake success independent from Telegram success/failure.
- Updated Telegram notification content to include `status`, `urgency`, client type, contact details, city, service type, lead id, source, and short summary.
- Updated AZR-003 tasklist status for this scoped implementation pass.

### Validation

- `cd web && npm run check:types` - pass.

### Notes

- No deploy was performed and no real secrets were touched.
- Chat transcript persistence remains deferred; no schema/runtime refactor was introduced in this scoped pass.
- AZR-003-011 remains `in_progress` pending a separate Verifier-stage acceptance pass.

## 2026-04-18: Subagent Model / Reasoning Policy Added

### Done

- Added `AGENTS.md` section `18) Subagent Model / Reasoning Policy`.
- Defined default inheritance for subagent model/reasoning settings.
- Added override requirements for Control Tower:
  - state stage, objective, role, override if any, and expected result before launch.
- Added recommended presets for `Reviewer`, `Coder`, and `Verifier`.
- Added current example model families for stronger review/planning, scoped coding, and narrow docs/checks.

### Validation

- Markdown-only scoped review completed.
- No runtime commands were required.

### Notes

- This is a process/operating-model update; runtime behavior and website code were not changed.

## 2026-04-18: Skills Added for Schema-Bound Route Work

### Done

- Reviewed the `/brief` implementation flow and identified two reusable future patterns:
  - schema-bound route implementation across docs, UI, assistant, API, payload, and SSOT;
  - hard verification against schema/UI/API drift before closeout.
- Added project-local skills:
  - `.agent/skills/azursystech-schema-route/SKILL.md`
  - `.agent/skills/azursystech-contract-verifier/SKILL.md`
- Registered both skills in `.agent/ROSTER.md`.

### Validation

- `python3 /home/dmitrii/.codex/skills/.system/skill-creator/scripts/quick_validate.py .agent/skills/azursystech-schema-route` - pass
- `python3 /home/dmitrii/.codex/skills/.system/skill-creator/scripts/quick_validate.py .agent/skills/azursystech-contract-verifier` - pass

### Notes

- No new ADR was added; this is an operational skill-pack update, not an architecture/runtime decision.

## 2026-04-17: `/brief` AI Automation Discovery Brief Implemented

### Done

- Added `/brief` to the active `web` site as a Russian multi-step discovery brief for AI automation requests.
- Implemented the five-step form flow:
  - business context;
  - goal / problem / desired result;
  - current workflow;
  - constraints and human control;
  - launch mode and contact.
- Added shared brief schema/validation/payload builder in `web/src/lib/brief-submit.ts`.
- Added dedicated `POST /api/brief/submit` endpoint returning a structured `brief.v1` payload and CRM-ready handoff.
- Added deterministic field-oriented assistant helper for `/brief`:
  - optional and visible;
  - collapsed by default on mobile;
  - visible on desktop;
  - constrained to field explanation, concise drafting guidance, and scope narrowing.
- Hard-review corrections completed:
  - frontend now consumes the shared `brief-submit` schema instead of a duplicate local schema;
  - submit response handling matches the API contract;
  - `human_approval_required` is enforced as a required selection and notes cannot replace it.

### Validation

- `cd web && npm run check:types` - pass
- `cd web && npx eslint src/app/brief/page.tsx src/components/brief/brief-form.tsx src/components/brief/brief-field.tsx src/components/brief/brief-progress.tsx src/components/brief/brief-assistant.tsx src/lib/brief-submit.ts src/lib/brief-assistant.ts src/app/api/brief/submit/route.ts` - pass
- `cd web && npm run build` - pass; route output includes `/brief` and `/api/brief/submit`
- API negative smoke: empty `human_approval_required` with notes returns validation error for `human_approval_required`
- Browser smoke on `390x844`: no horizontal overflow, assistant starts collapsed, valid multi-step submit reaches success state
- Browser smoke on desktop: no horizontal overflow, assistant visible

### Notes

- `/brief` submit currently produces a structured discovery payload and handoff response; durable PostgreSQL persistence for brief submissions is intentionally not part of this MVP pass.
- Screenshots saved in `output/playwright/brief-desktop.png` and `output/playwright/brief-mobile.png`.

## 2026-04-16: AZR-003-013 Closed (Public Phone/WhatsApp Consistency)

### Done

- Closed `AZR-003-013` with strict active-scope cleanup on commit `6895f4e` (`docs(contact): remove legacy phone refs in active docs`).
- Removed legacy phone references from active docs in the approved write-set.
- Applied privacy runtime consistency fix in `web/src/app/privacy/page.tsx`: use `whatsappDisplay` with `whatsappHref`.
- Branch push completed for `6895f4e` on `integration/azr-002-023-handoff`.

### Validation

- Verifier pass: legacy phone patterns (`7 49 70 54 65`, `33749705465`) not found in active `web/docs` scope after delivery.
- Commit scope check: only approved AZR-003-013 files included in `6895f4e`.
- Remote sync check: `HEAD` and `origin/integration/azr-002-023-handoff` include `6895f4e`.

### Notes

- Historical ADR/progress records were intentionally not rewritten.
- This closeout is SSOT sync for ticket status and delivery evidence.

## 2026-04-15: CI Lint + Next Security Unblock

### Done

- Cleared current CI lint blockers on Stage 5 branch:
  - replaced synchronous `setState` in `ChatWidgetContainer` effect with `useSyncExternalStore`;
  - replaced homepage `<a href="/">` in `SiteHeader` with Next `<Link>`.
- Updated `web` framework packages:
  - `next` to `16.2.3`;
  - `eslint-config-next` to `16.2.3`.
- Verified local CI-equivalent and production security audit.

### Validation

- `cd web && npm audit --omit=dev --audit-level=high` - pass (`0 vulnerabilities`)
- `cd web && npm run check:ci` - pass

### Notes

- Remaining lint output is warnings-only for existing unused variables and `<img>` usage.
- No runtime/deploy settings or lead data were changed in this pass.

## 2026-04-15: Stage 5 VPS Runtime Proof (persistent limiter + contact e2e)

### Done

- VPS checkout/runtime aligned to Stage 5 commit `a481c32` (`security(api): persist rate limits and enforce prod webhook host allowlist`).
- Rebuilt/recreated `app` via `docker compose -f docker-compose.vps.yml up -d --build --force-recreate app`.
- Restored required VPS compose env passthrough for Stage 5 runtime:
  - `AZURSYSTECH_CONTACT_SUBMIT_ALLOWED_HOSTS`
  - `DATABASE_SSL_MODE`
- Confirmed final app env:
  - `AZURSYSTECH_CONTACT_SUBMIT_ALLOWED_HOSTS=n8n.hardwarelab.org`
  - `DATABASE_SSL_MODE=require`
  - `NODE_ENV=production`
- Confirmed PostgreSQL SSL path from `app` (`select 1` with `ssl: { rejectUnauthorized: false }`).
- Confirmed `api_rate_limits` exists and matches Stage 5 DDL.
- Confirmed persistent limiter behavior:
  - `/api/chat` same-IP requests: first 5 returned `400`, 6th returned `429`;
  - after `app` restart, 7th same-IP request remained `429`.
- Confirmed contact e2e:
  - `/api/contact/submit` returned `200 success`;
  - SQL evidence for marker email contains `lead.submitted` and `integration.accepted`.

### Notes

- One final test lead marker remains in production DB as verification evidence: `stage5-final-e2e-20260415T164807Z-610103@example.com`.
- No lead data was deleted or modified.
- No new architectural decision was introduced; this is an operational runtime proof and env passthrough correction.

## 2026-04-15: Agent Skill Pack Added (Shell/VPS Recovery/Security Runtime Proof)

### Done

- Added reusable shell-safety skill to prevent command dialect mismatch between PowerShell and Linux bash:
  - `.agent/skills/shell-context-guard/SKILL.md`
- Added VPS deploy recovery skill for blocked git/deploy states:
  - diverged branch,
  - unmerged files,
  - compose/yaml conflict recovery,
  - controlled sync back to deploy-ready state.
  - `.agent/skills/vps-deploy-recovery/SKILL.md`
- Added VPS security runtime proof skill for post-hardening gate checks:
  - persistent limiter proof across app restart,
  - DB SSL runtime probe,
  - contact e2e + `integration.accepted` evidence,
  - `api_rate_limits` SQL snapshot.
  - `.agent/skills/vps-security-runtime-proof/SKILL.md`
- Updated skill registry in `.agent/ROSTER.md` with new triggers and file mappings.

### Notes

- Skill pack is based on real failure patterns from the completed security hardening cycle (`shell mismatch`, `ff-only divergence`, `compose parse break`, staged runtime proof requirements).

## 2026-04-15: P1 Hardening Continuation (proxy migration + CI security gate)

### Done

- Migrated Next API origin policy from deprecated `web/src/middleware.ts` convention to `web/src/proxy.ts` with equivalent behavior and matcher scope (`/api/:path*`).
- Added `web` security CI gate:
  - new script `check:security` (`npm audit --omit=dev --audit-level=high`);
  - appended to `check:ci` chain.
- Updated VPS deploy runbook with `check:security` pre-publish step and explicit `DATABASE_SSL_MODE` guidance (`disable|require|verify-full`).

## 2026-04-15: P1 Hardening Pass (headers, CORS middleware, DB TLS mode)

### Done

- Added app-level security headers in `web/next.config.ts` for defense-in-depth, aligned with existing nginx policy and kept runtime-compatible defaults.
- Added `web/src/middleware.ts` for `/api/:path*` origin policy:
  - reject only when `Origin` is present and not allowlisted;
  - allow requests with no `Origin`;
  - handle `OPTIONS` preflight for allowed origins with `Access-Control-*` headers.
- Added configurable PostgreSQL SSL policy in `web/src/lib/intake-storage.ts` via `DATABASE_SSL_MODE`:
  - supported modes: `disable` (default), `require`, `verify-full`;
  - explicit runtime error for unknown values.
- Updated `.env.vps.example` with commented `DATABASE_SSL_MODE` docs and safe default guidance.

## 2026-04-15: Web Security Hardening Pass (chat/contact runtime)

### Done

- Hardened `web` API boundaries for chat and contact submit:
  - request body size guards on `/api/chat` and `/api/contact/submit`;
  - chat input length guard (`max 1000`) and response sanitization/length cap;
  - lightweight per-IP in-memory rate limiting on contact submit;
  - bounded in-memory cleanup logic for chat/contact rate-limit stores.
- Added a minimal prompt-injection guard on `/api/chat` for common jailbreak patterns.
- Added safer integration URL validation for contact submit runtime:
  - production requires `https` for `AZURSYSTECH_CONTACT_SUBMIT_BASE_URL`;
  - optional host allowlist via `AZURSYSTECH_CONTACT_SUBMIT_ALLOWED_HOSTS`;
  - local non-production `http://localhost|127.0.0.1` remains allowed.
- Reduced health endpoint metadata exposure in production (`/health` returns only `status`).
- Updated framework dependencies in `web`:
  - `next` `16.1.6 -> 16.2.3`
  - `eslint-config-next` `16.1.6 -> 16.2.3`

### Validation

- `cd /home/dmitrii/azursystech/web && npm audit --omit=dev --json` - pass (`0` prod vulnerabilities)
- `cd /home/dmitrii/azursystech/web && npm run check:types` - pass
- `cd /home/dmitrii/azursystech/web && npm run build` - pass

### Notes

- `npm run check:ci` still reports pre-existing lint errors in unrelated files (`web/src/components/chat-widget.tsx`, `web/src/components/shell/site-header.tsx`).
- This pass intentionally avoided runtime-breaking changes (no forced Postgres TLS for internal Docker DB, no global strict CORS middleware, no app-level HTTPS redirect policy change).

## 2026-04-14: VPS Runtime Artifacts Synced To Repository (PostgreSQL Ops)

### Done

- Synced deployment/runtime repo artifacts with current SQL-first VPS reality:
  - `docker-compose.vps.yml` now includes internal `postgres` service and persistent `postgres_data` volume.
  - `.env.vps.example` extended with `POSTGRES_*` vars and SQL-first sample `DATABASE_URL`.
- Added PostgreSQL operational scripts to repository:
  - `scripts/postgres-backup.sh`
  - `scripts/postgres-restore.sh`
- Updated deployment runbooks:
  - `docs/deployment/github-vps.md` aligned with PostgreSQL service/env/runtime checks.
  - `docs/deployment/backup-restore-runbook.md` updated from env-only backup to SQL dump/restore workflow.

### Notes

- This pass syncs repo docs/ops artifacts only; no UI changes, no runtime route logic changes.
- Offsite backup is still not configured and remains an operational follow-up.

## 2026-04-14: AZR-003-014 Runtime Proof Completed (SQL-first Confirmed on VPS)

### Done

- Runtime verification on VPS confirmed `SQL-first` intake baseline:
  - `INTAKE_STORAGE_MODE=sql_primary` active in app runtime
  - self-hosted PostgreSQL service is healthy in compose stack
  - PostgreSQL is not exposed publicly (`5432` internal-only)
- SQL schema apply verified and intake tables confirmed:
  - `intake_leads`
  - `intake_lead_events`
  - `intake_conversations`
  - `intake_conversation_messages`
- Controlled submit test to `/api/contact/submit` passed with successful user response.
- Persistence proof confirmed:
  - lead row present in `intake_leads`
  - integration events present in `intake_lead_events`
- Backup/restore baseline validated:
  - `postgres-backup.sh` produced timestamped dump
  - `postgres-restore.sh` restore-check into temporary DB passed

### Verdict

- `AZR-003-014`: `PASS`
- Runtime intake baseline: `SQL-first confirmed`

### Notes

- Offsite backup target is still pending (current backup location is same VPS).
- One test lead used for runtime proof may remain in production DB as audit evidence.

## 2026-04-14: AZR-003-014 Runtime Wiring Prep (VPS Env Contract)

### Done

- Updated VPS runtime compose contract for SQL intake flags:
  - `docker-compose.vps.yml` now forwards `INTAKE_STORAGE_MODE` and `DATABASE_URL` to `app`.
- Updated deploy runbook:
  - `docs/deployment/github-vps.md` now includes SQL intake env requirements and runtime verification commands.
- Added missing project template file:
  - `.env.vps.example` (safe placeholders only, no secrets).
- Synced `AZR-003-014` delivery notes in tasklist with this runtime-wiring prep step.

### Notes

- This pass is config/docs only; backend route logic was not changed.
- SQL-first confirmation still requires runtime execution evidence on target VPS:
  - schema apply
  - env configured
  - controlled submit proving write into SQL tables.

## 2026-04-13: Intake Architecture Pivot Locked in SSOT (Backend-First SQL)

### Done

- SSOT sync completed for intake architecture pivot:
  - primary path fixed as `web backend -> validation/normalization -> PostgreSQL`
  - `n8n` and Google Sheets moved to optional secondary automation/export role
- Added ADR-020 in `memory_bank/decisions.md` to formalize the new baseline.
- Updated `docs/tasklist/azr-003-tasklist.md`:
  - added `AZR-003-014` (backend-first SQL hardening) as current execution item
  - moved `AZR-003-011` behind `AZR-003-014`
  - marked `AZR-003-010` as historical launch activation reference
- Marked `docs/specs/azr-003-010-site-n8n-google-sheets.md` as historical reference to avoid baseline ambiguity.

### Notes

- This is a docs/control-layer alignment pass; runtime code and deployment settings were not changed.

## 2026-04-13: SQL Intake Foundation + Dual-Write Mode (web backend)

### Done

- В `web` добавлен SQL foundation для intake:
  - `web/sql/001_intake_schema.sql` с таблицами:
    - `intake_leads`
    - `intake_lead_events`
    - `intake_conversations`
    - `intake_conversation_messages`
- Добавлен серверный DB adapter:
  - `web/src/lib/intake-storage.ts`
  - поддержка `INTAKE_STORAGE_MODE` (`legacy`, `dual`, `sql_primary`)
  - сохранение нормализованного lead payload в SQL
  - запись событий в `intake_lead_events`
- Обновлен `web/src/app/api/contact/submit/route.ts`:
  - при SQL mode сохраняет lead в БД до dispatch в n8n
  - продолжает отправку в n8n с контрактными заголовками
  - использует один `idempotency_key` для текущего submit цикла
  - в `sql_primary` возвращает success при SQL write даже если downstream n8n недоступен
  - логирует integration events в SQL (`integration.accepted`, `integration.not_ready`, `integration.submit_failed`)
- Контракт источников intake расширен в runtime:
  - `whatsapp_chat` добавлен как валидный `source`
- Обновлен fallback контактный номер в `web/src/lib/contact-submit.ts`:
  - `+33 7 80 72 09 94`

### Validation

- `cd /home/dmitrii/azursystech/web && npm run check:types` - pass
- `cd /home/dmitrii/azursystech/web && npm run build` - pass

### Notes

- UI/маршруты фронтенда не менялись.
- Текущий путь `web -> n8n` сохранен; SQL добавлен как foundation/primary-ready backend слой.

## 2026-04-13: Public Phone Docs Sync — New Number Marked Current, Old Number Deprecated

### Done

- Current public phone / WhatsApp number documented as `+33 7 80 72 09 94` in current public-facing docs and operational specs.
- Old number `+33 7 49 70 54 65` retained only as `legacy/deprecated` reference where needed, not deleted silently.

### Notes

- This is a docs-only pass; runtime/UI code was not changed.
- Follow-up remains: sync any stale `web` runtime/UI constants that still expose the legacy number.

## 2026-04-13: AZR-003-012 Baseline Closure — `web` Is Current Website Baseline

### Done

- Control-layer SSOT sync completed after founder clarification:
  - `frontend_mvp` is no longer the active website baseline.
  - design and relevant implementation work from `frontend_mvp` have been transferred into `web`.
  - current website/design/runtime/deploy baseline is `web`.
- `frontend_mvp` remains historical/reference only and must not be used as the target for new launch-critical implementation.
- `AZR-003-012` is treated as completed for baseline selection/parity purposes.

### Notes

- This is a docs/control-layer sync; runtime, deploy and external integrations were not changed.
- Next implementation target is `AZR-003-011` on `web`.
- Follow-up required before deploy verification: public phone / WhatsApp values drift across current `web` baseline and docs.

## 2026-04-13: AZR-003-012 Contact Contract + SSOT Parity Sync (Stages 27-35)

### Done

- В `web` завершен business-first parity pass для контактной формы на основе `frontend_mvp`:
  - inline submit states (`success/error`) вместо redirect flow;
  - `segment=tpe` как default;
  - удалены UI-дубли и неактуальные conditional branches из текущего form flow.
- Server-side validation/normalize синхронизированы с фактическим UI:
  - убрана валидация неиспользуемых form-полей (`business_needs`, `home_*`);
  - legacy fields сохранены в payload как compatibility-only `null`;
  - добавлена legacy-нормализация `service_type: wifi -> reseau_local`.
- Выполнен docs sync для form/n8n SSOT:
  - `02_website/forms-spec.md`
  - `03_leads/lead-intake-spec.md`
  - `docs/specs/azr-003-010-site-n8n-google-sheets.md`
- Закрыт финальный drift по `email` representation:
  - в spec зафиксировано `email: null if absent` (с допустимым mapping в blank на стороне n8n/Sheets).

### Validation

- `cd /home/dmitrii/azursystech/web && npm run check:types` - pass
- `cd /home/dmitrii/azursystech/web && npm run build` - pass
- Read-only parity verifier pass (`code vs docs`) по contact/n8n contract - pass

### Notes

- Это website/docs alignment pass в рамках `AZR-003-012`; deploy/infra/CRM/external integrations не менялись.
- `AZR-003-012` остается `in_progress`; следующий шаг — visual build smoke on WSL + backend readiness review перед стартом `AZR-003-011`.

## 2026-04-13: Legal + Privacy Pages Sync + New Terms Page (RU)

### Done

- `/privacy` в `web` синхронизирован с `02_website/privacy.md`, добавлен краткий блок про cookies/consent.
- `/legal` в `web` синхронизирован с `02_website/mentions_légales.md`.
- Добавлена новая русская страница `/terms` (общие условия оказания услуг) на базе `02_website/prestations-de-services-ru.md`.
- В footer добавлена ссылка на `/terms`.
- Контакты (телефон/WhatsApp) выровнены на актуальный `+33 7 80 72 09 94` в новых legal/terms страницах.

### Notes

- Это content/legal pass; runtime, deploy, CRM и внешние интеграции не менялись.

## 2026-04-13: Header Anchor Links Fixed For Legal/Privacy/Terms Pages

### Done

- В `web` исправлены якорные ссылки шапки: с `/privacy`, `/legal`, `/terms` навигация теперь ведёт на `/#section` главной.

### Notes

- Это UI-fix; runtime, deploy и интеграции не менялись.

## 2026-04-12: AZR-003-012 Docs Sync — Automation Module Explicit In Website SSOT

### Done

- Выполнен точечный docs-sync для website baseline:
  - `01_brand/homepage-copy.md`
  - `02_website/site-architecture.md`
  - `02_website/wireframes.md`
- В документах явно зафиксирован отдельный business-first модуль:
  - `Автоматизация + ИИ-агенты`
  - сценарии: повторяющиеся задачи, обработка заявок, workflow, практичные цифровые инструменты
  - единый CTA-путь через канонический contact flow

### Notes

- Это docs-only pass в рамках `AZR-003-012`.
- Runtime/deploy/integration контуры не менялись.

## 2026-04-12: AZR-003-012 A/A Baseline Pass Accepted (chat -> payload -> n8n env -> tokens)

### Done

- В `web` принят и подтвержден последовательный baseline-pass в фиксированном порядке:
  1. canonical chat cleanup (`chat-widget-shell` как единственный активный shell, legacy `ChatWidget.jsx` удален)
  2. dual payload intake (`FormData` + `JSON`) для `/api/contact/submit` с единым server-side validate/normalize
  3. `n8n` env layer (`N8N_WEBHOOK_*` как primary + legacy fallback) и required transport headers
  4. визуальные токены из `frontend_mvp` в `web` через Tailwind v4 `@theme` в `web/src/app/globals.css`
- Сводная verifier-проверка по item `1 -> 4` выполнена с итогом `PASS`.

### Validation

- `cd /home/dmitrii/azursystech/web && npm run build` - pass
- `cd /home/dmitrii/azursystech/web && npm run check:types` - pass

### Notes

- Это baseline-alignment pass в рамках `AZR-003-012`; deploy path и внешние интеграции не переключались.
- `web` остается runtime/deploy baseline до отдельного explicit решения о cutover.
- Следующий шаг в этом же тикете: визуальная проверка сборки на WSL (desktop + mobile viewport smoke).

## 2026-04-12: AZR-003-012 Parity/Migration Planning Artifact Drafted

### Done

- Выполнен planning pass для `AZR-003-012` в рамках `Safe baseline` модели.
- Добавлен spec-документ:
  - `docs/specs/azr-003-012-frontend-mvp-parity-migration-plan.md`
- В документе зафиксированы:
  - launch-critical gap register (`frontend_mvp` vs `web`)
  - выбранная стратегия миграции: `incremental parity`
  - readiness gate перед запуском `AZR-003-011`
- `docs/tasklist/azr-003-tasklist.md` обновлен:
  - `AZR-003-012` переведен в `in_progress`
  - добавлены delivery notes со ссылкой на planning artifact

### Notes

- Это planning/docs pass; runtime, deploy, CRM и внешние интеграции не менялись.
- Production baseline по-прежнему `web`; deploy switch не выполнялся.

## 2026-04-12: frontend_mvp Locked As Website Template Baseline (Safe Baseline Mode)

### Done

- Проведен control-layer SSOT sync по founder decision:
  - `frontend_mvp` зафиксирован как текущий template baseline для website build stream;
  - дальнейшая website product/UI разработка считается канонически привязанной к `frontend_mvp`.
- Зафиксировано ограничение решения:
  - production runtime/deploy baseline **не** переключался;
  - deploy path по-прежнему остается на `web` до отдельного explicit stage.
- Добавлен bridge-step в execution queue:
  - `AZR-003-012` frontend_mvp parity/migration planning;
  - `AZR-003-011` перемещен после `AZR-003-012`, чтобы не создавать baseline drift.
- Обновлены control-layer артефакты:
  - `memory_bank/context.md`
  - `memory_bank/decisions.md` (ADR-020)
  - `docs/tasklist/azr-003-tasklist.md`
  - `07_ops/task-board.md`
  - `docs/backlog.md`

### Notes

- Это SSOT/planning pass; runtime, deploy, CRM и внешние интеграции не менялись.
- Исторические записи о старом статусе `frontend_mvp` сохранены как historical context.

## 2026-04-08: AZR-003 Control-Layer Status Sync — 001/006/007 Closed, 011 Next

### Done

- Reconciled `AZR-003` control-layer tracking after drift between `tasklist` and higher-level status docs.
- Closed `AZR-003-001` in tracking artifacts based on the already-injected legal baseline:
  - real legal/business/contact/hosting values are fixed in docs and code
  - public legal/privacy routes no longer rely on placeholder identity data
- Reaffirmed `AZR-003-006` and `AZR-003-007` as closed in control-layer tracking.
- Moved the active execution queue to:
  - `AZR-003-011` AI widget live integration + Telegram notification
  - `AZR-003-008` deferred improvements separation
- Synced launch-checklist items for the completed `site -> n8n -> Google Sheets` intake baseline.

### Notes

- This entry is a status-sync pass; it does not change runtime, deploy, or website behavior.
- Historical RooCode handoffs and earlier progress entries remain as implementation history.

## 2026-04-08: Control Tower + Internal Subagents Operating Model Adopted

### Done

- Adopted the new active operating model for the control layer:
  - current chat = `Tech Lead / Control Tower / Orchestrator`
  - primary execution path = internal subagents
  - stage gate remains mandatory between stages
  - `RooCode` is fallback-only for explicit exceptions
- Preserved historical RooCode delivery records as history; no retroactive rewriting was performed.
- Locked the rule that AI outputs remain drafts until explicit human approval.

### Notes

- This update is a control-layer transition record only.
- No runtime, website, deploy, or integration artifacts were changed in this entry.

## 2026-03-20: AZR-003-010 Live Activation Completed — site -> n8n -> Google Sheets

### Done

- Live intake path `site -> n8n -> Google Sheets` activated on current shared host:
  - `https://n8n.hardwarelab.org/webhook/azursystech/contact-submit`
- Google Sheets target fixed and connected:
  - `spreadsheetId = 1xS9sF74ICi1DxU1AvPLu0O4FUAuGZ_ia4WSLlMdZGhU`
  - `tabName = intake_leads`
- Shared auth token rotated, production env updated on `n8n` and site runtime, services restarted.
- Live verification completed with 3 direct webhook tests:
  - valid request -> `200 accepted`
  - bad auth -> `401 rejected`
  - duplicate `X-Idempotency-Key` -> `200 accepted` with duplicate-ignore behavior
- Execution evidence confirmed that duplicate flow does not execute `Google Sheets Append Row`.

### Outcome

- `B1`: closed
- `B2`: closed
- `B3`: closed
- `B4`: closed
- `B5`: closed

### Notes

- `AZR-003-010` is treated as done in control-layer tracking.
- Public `/contact` smoke test remains recommended before `AZR-003-007`, but it is not held as a blocker for closing the integration stream.
- Новых архитектурных/процессных решений не принято; `memory_bank/decisions.md` без изменений.

## 2026-03-19: AZR-003-010 SSOT Re-check Pass (control-layer)

### Done

- Выполнена повторная SSOT-проверка для `AZR-003-010` в рамках control-layer pass.
- Обнаружено и исправлено 2 drift-пункта:
  1. `memory_bank/context.md` строка 52: статус `AZR-003-010` исправлен с `todo` на `in_progress` (соответствие с `azr-003-tasklist.md` и последней записью в `progress.md`).
  2. `docs/specs/azr-003-010-site-n8n-google-sheets.md` секция 3: уточнена формулировка для array-полей (`business_needs`, `home_device_type`, `home_need_type`) — добавлено явное разделение между wire-форматом (JSON array) и Google Sheets column encoding (JSON string или comma-separated).

### No Drift Found

- `web/src/app/api/contact/submit/route.ts` — полностью соответствует spec секции 1: env vars, webhook path, headers (`Authorization`, `X-Contract-Version`, `X-Idempotency-Key`), timeout 10s, response schema, fallback behavior.
- `web/src/lib/contact-submit.ts` — payload fields и enums соответствуют spec секции 3 mapping table и transport contract sections 4 ADR-016.
- `tasklist`, `go-live spec`, `decisions.md` — все согласованы между собой по launch sequence и статусам тикетов.

### Notes

- Новых архитектурных/процессных решений не принято; `memory_bank/decisions.md` без изменений.

---

## 2026-03-19: AZR-003-010 Integration Step — Launch Intake Path `site -> n8n -> Google Sheets` (contract + blockers + dry-run)

### Done

- Выполнена SSOT-проверка для `AZR-003-010` в рамках launch scope:
  - `AGENTS.md`
  - `memory_bank/context.md`
  - `memory_bank/progress.md`
  - `memory_bank/decisions.md`
  - `docs/tasklist/azr-003-tasklist.md`
  - `docs/specs/azr-003-go-live-readiness.md`
  - `docs/specs/azr-002-site-n8n-hubspot-contract.md`
  - `web/src/app/api/contact/submit/route.ts`
  - `web/src/lib/contact-submit.ts`
  - `docs/deployment/github-vps.md`
  - `.env.vps.example`
- Зафиксирован отдельный integration artifact:
  - `docs/specs/azr-003-010-site-n8n-google-sheets.md`
  - включает:
    - локальный readiness snapshot site boundary
    - точные требования для `n8n -> Google Sheets`
    - явный mapping `validated payload -> sheet columns`
    - blocker register (`B1-B5`) с owner + next action
    - проверяемый test path (local dry-run + controlled test lead + e2e AC)
    - rollback rule через `AZURSYSTECH_CONTACT_SUBMIT_ENABLED=false`
- Обновлен task artifact:
  - `docs/tasklist/azr-003-tasklist.md`
  - `AZR-003-010` переведен в `in_progress` с delivery notes и явными blockers.

### Doc-to-UI self-check (submit boundary)

- Critical: none
- High: none
- Medium: none
- Low: none

Residual untested/live-risk areas:
- реальная n8n response-schema совместимость (`accepted|temporary_failure|rejected`) не подтверждена в живом workflow;
- 24h idempotency dedupe на стороне n8n не подтвержден test evidence;
- live Google Sheets target provisioning и write credential в n8n остаются внешними зависимостями.

### Validation

- `cd /home/dmitrii/azursystech/web && npm run check:types` - pass
- `cd /home/dmitrii/azursystech/web && npm run build` - pass
- Local dry-run for `/api/contact/submit`:
  - valid payload with unconfigured integration -> `503 integration_not_ready` (pass)
  - honeypot payload -> `200 spam_detected` (pass)
  - enabled integration with unreachable upstream -> `502 submit_failed` (pass)

### Notes

- Scope строго integration-only (`AZR-003-010`), без UI redesign и без CRM/HubSpot enablement.
- Новых архитектурных/процессных решений не принято; `memory_bank/decisions.md` без изменений.

## 2026-03-19: AZR-003-009 Website Closure Pass (About + SEO Service Pages + Legal/Privacy Readiness)

### Done

- Реализован trust/founder route:
  - `web/src/app/about/page.tsx`
- Реализованы 4 Phase 1.5 service routes по `06_seo/service-pages-plan.md`:
  - `web/src/app/services/new-pc-setup/page.tsx`
  - `web/src/app/services/wifi-printer/page.tsx`
  - `web/src/app/services/tpe-setup/page.tsx`
  - `web/src/app/services/onsite-support/page.tsx`
- Добавлен shared шаблон для service landing pages:
  - `web/src/components/service-landing-page.tsx`
- Обновлен `web/src/app/services/page.tsx` с internal links на новые service routes.
- Выполнен safe-readiness pass по legal/privacy без изменения legal identity facts:
  - `web/src/app/legal/page.tsx`
  - `web/src/app/privacy/page.tsx`
  - data-вынесение в `web/src/lib/legal-content.ts` для future real-data injection readiness.
- Обновлен task artifact:
  - `docs/tasklist/azr-003-tasklist.md` — `AZR-003-009` переведен в `done`.

### Validation

- `cd /home/dmitrii/azursystech/web && npm run build` - pass
- В build output подтверждены routes:
  - `/about`
  - `/services/new-pc-setup`
  - `/services/wifi-printer`
  - `/services/tpe-setup`
  - `/services/onsite-support`
  - `/legal`
  - `/privacy`

### Notes

- Scope строго ограничен website layer (`AZR-003-009`), без drift в n8n/Sheets/Telegram/AI runtime/CRM implementation.
- Launch contact model и `/contact` submit flow не изменялись.
- Новых архитектурных/процессных решений не вводилось; `memory_bank/decisions.md` без изменений.

## 2026-03-19: Launch Path Simplified — Website First, Google Sheets via n8n, CRM Deferred

### Done

- По founder/product decision launch sequence был пересобран в более простой порядок:
  - website closure first
  - `site -> n8n -> Google Sheets`
  - AI widget live integration + Telegram notification later
  - CRM moved to phase 2
- Обновлены control-layer документы:
  - `memory_bank/context.md`
  - `memory_bank/decisions.md`
  - `07_ops/task-board.md`
  - `07_ops/launch-checklist.md`
  - `07_ops/kpi-framework.md`
  - `docs/specs/azr-003-go-live-readiness.md`
  - `docs/specs/azr-002-site-n8n-hubspot-contract.md`
  - `docs/tasklist/azr-003-tasklist.md`
- Historical HubSpot mapping retained only as future CRM reference.

### Notes

- Транспортный baseline `site -> n8n` сохранен.
- Full CRM rollout intentionally moved out of current launch scope.

## 2026-03-15: AZR-002-025 HubSpot MVP Property Mapping Locked in SSOT

### Done

- Received CRM stream mapping proposal and performed control-layer review against SSOT.
- Identified and corrected 5 drift points in CRM stream proposal:
  - `service_type` values: replaced CRM-invented values with 9 values from `contact-submit.ts`
  - `urgency` values: replaced `low/medium/high` with `urgent/standard/planning`
  - `lead_source` values: replaced `site_web/telephone/...` with canonical 10 values from `lead-taxonomy.md`
  - `device_count` type: corrected from Number to Dropdown select (string enum)
  - `onsite_required` type: corrected from Checkbox to Dropdown select (3-option enum)
- Locked full mapping in [`docs/specs/azr-002-site-n8n-hubspot-contract.md`](docs/specs/azr-002-site-n8n-hubspot-contract.md) section 7:
  - Contact: 5 standard fields, no custom properties
  - Deal: `dealstage` + 7 custom properties with exact internal names and types
  - Note: structured text format for segment-specific overflow fields
- Recorded decision as ADR-017 in [`memory_bank/decisions.md`](memory_bank/decisions.md).
- Added and closed task `AZR-002-025` in [`docs/tasklist/azr-002-tasklist.md`](docs/tasklist/azr-002-tasklist.md).

### Next

- CRM agent: verify/create exact properties in HubSpot with locked internal names.
- VPS/n8n stream: build workflow against locked mapping + transport contract.

## 2026-03-15: AZR-002-024 Site Runtime Adapter Implemented for Approved v1 Contract

### Done

- Started implementation of the site-side runtime adapter in [`web/src/app/api/contact/submit/route.ts`](web/src/app/api/contact/submit/route.ts):
- Implemented the site-side runtime adapter in [`web/src/app/api/contact/submit/route.ts`](web/src/app/api/contact/submit/route.ts):
  - reads runtime env flags for contact submit integration
  - prepares outbound `POST` JSON request for the approved webhook path
  - sends `Authorization`, `X-Contract-Version`, and `X-Idempotency-Key`
  - keeps `integration_not_ready` when runtime env is not configured
  - treats only upstream `200 {"status":"accepted","request_id":"..."}` as success
- Added required env names to:
  - [`.env.vps.example`](.env.vps.example)
  - [`docs/deployment/github-vps.md`](docs/deployment/github-vps.md)
- Added runtime implementation task in [`docs/tasklist/azr-002-tasklist.md`](docs/tasklist/azr-002-tasklist.md):
  - `AZR-002-024` closed as `done`
- Validation passed:
  - `npm run check:types`
  - `npm run build`

### Next

- Hand the env contract and approved webhook settings to the VPS/n8n stream for configuration against the fixed adapter.

## 2026-03-15: AZR-002-023 Transport Contract Approved as v1 Baseline

### Done

- Approved exact `v1` transport contract for `site -> n8n` in:
  - [`docs/specs/azr-002-site-n8n-hubspot-contract.md`](docs/specs/azr-002-site-n8n-hubspot-contract.md)
- Locked exact values for:
  - endpoint path `/webhook/azursystech/contact-submit`
  - method `POST`
  - `Content-Type: application/json`
  - `Authorization: Bearer <token>`
  - `X-Contract-Version: 1`
  - `X-Idempotency-Key: <uuid-v4>`
  - timeout `10s`
  - retry `0` from website transport layer
  - idempotency dedupe window `24h`
  - response schemas for `accepted`, `temporary_failure`, and `rejected`
  - exposure mode `proxy-protected`
  - exact logging/redaction and no-secret error-payload rules
- Updated [`docs/tasklist/azr-002-tasklist.md`](docs/tasklist/azr-002-tasklist.md):
  - `AZR-002-023` moved from `blocked` to `done` as a transport-baseline approval pass.
- Updated [`web/src/app/api/contact/submit/route.ts`](web/src/app/api/contact/submit/route.ts):
  - comment now reflects that SSOT contract is fixed, while runtime adapter/config is still disabled.

### Notes

- This pass approves transport only, not live enablement.
- HubSpot object/property mapping, pipeline/stage IDs, and secret provisioning remain follow-up items.

## 2026-03-15: AZR-002-023 VPS/n8n Handoff Package Prepared

### Done

- Подготовлен узкий handoff-пакет для VPS/n8n stream:
  - [`docs/reports/AZR-002-023-integrationlead-to-vps-n8n.md`](docs/reports/AZR-002-023-integrationlead-to-vps-n8n.md)
- В handoff зафиксированы:
  - точный scope только для transport boundary `site -> n8n`
  - запрет на production deploy changes и live workflow enablement
  - список exact values, которые VPS/n8n agent обязан вернуть или оставить как `BLOCKER`
  - canonical 5-point return format для control tower

### Notes

- Полный HubSpot property mapping оставлен вне scope этого handoff.
- [`memory_bank/decisions.md`](memory_bank/decisions.md) без изменений.

## 2026-03-15: AZR-002-023 Control-layer Closure Revalidation Applied — Status remains BLOCKED

### Status

- `AZR-002-023` повторно проверен в control-layer closure режиме.
- По явному подтверждению control layer, новых approved значений от Integration Lead / CRM Lead не поступало.
- По gate rule тикет сохранен в состоянии `blocked`; `ready-for-implementation` повторно отклонен.

### What was done

- Обновлен [`docs/specs/azr-002-site-n8n-hubspot-contract.md`](docs/specs/azr-002-site-n8n-hubspot-contract.md):
  - добавлен блок `Closure revalidation pass (control-layer)`;
  - зафиксирован revalidation-триггер и отсутствие новых approved значений;
  - зафиксировано, что все 5 обязательных групп остаются `BLOCKED`;
  - повторно зафиксирована no-silent-assumptions политика по endpoint/auth/retry/mapping/response.
- Обновлен [`docs/tasklist/azr-002-tasklist.md`](docs/tasklist/azr-002-tasklist.md):
  - добавлена запись `Gate rule revalidation (2026-03-15)` для `AZR-002-023`;
  - повторно зафиксировано `ready-for-implementation denied` и сохранение статуса `blocked`.

### Compatibility check

- Совместимость с текущей boundary-реализацией подтверждена повторно:
  - [`web/src/app/api/contact/submit/route.ts`](web/src/app/api/contact/submit/route.ts:33)
  - [`web/src/lib/contact-submit.ts`](web/src/lib/contact-submit.ts:109)
- Критичные launch-safe ограничения не нарушены:
  - HubSpot-only baseline
  - `source = website_form`
  - no fake success
  - no autonomous outbound implications

### Notes

- Новых архитектурных/процессных решений в этом pass не принято.
- [`memory_bank/decisions.md`](memory_bank/decisions.md) без изменений.

## 2026-03-15: AZR-002-023 Final Closure Pass Applied — Gate Enforced, Ticket Remains BLOCKED

### Status

- `AZR-002-023` intentionally remains `blocked` after final control-layer closure pass.
- `ready-for-implementation` explicitly denied by gate rule because all 5 mandatory decision groups still contain critical `BLOCKER` values.
- Closure performed without undocumented assumptions and without fake contract completion.

### What was done

- Updated [`docs/specs/azr-002-site-n8n-hubspot-contract.md`](docs/specs/azr-002-site-n8n-hubspot-contract.md):
  - lifecycle reason tightened to explicit critical `BLOCKER` condition across all groups;
  - added `Final closure decision snapshot` with date, gate decision, and group-by-group `BLOCKED` result;
  - added explicit no-silent-assumptions declaration for endpoint/auth/retry/mapping/response areas.
- Updated [`docs/tasklist/azr-002-tasklist.md`](docs/tasklist/azr-002-tasklist.md):
  - added gate rule check note for 2026-03-15 final closure;
  - explicitly recorded closure outcome as `blocked` with no undocumented assumptions;
  - kept next action bound to gate rule and non-`BLOCKER` requirement for all 5 groups.

### Compatibility check

- Compatibility with current site boundary reconfirmed and unchanged:
  - [`web/src/app/api/contact/submit/route.ts`](web/src/app/api/contact/submit/route.ts:33)
  - [`web/src/lib/contact-submit.ts`](web/src/lib/contact-submit.ts:109)
- Launch-safe constraints remain intact:
  - HubSpot-only baseline
  - `source = website_form`
  - no fake success
  - no autonomous outbound implications

### Notes

- New architecture/process decision was not introduced in this pass.
- [`memory_bank/decisions.md`](memory_bank/decisions.md) unchanged.

## 2026-03-15: AZR-002-023 Control-layer blocker groups revalidated and fixed as formal gate snapshot (still BLOCKED)

### Status

- `AZR-002-023` remains `blocked` after control-layer closure pass.
- Contract lifecycle is explicitly kept out of `ready-for-implementation` because mandatory approved values are still missing across all 5 blocker-groups.
- Gate rule remains enforced without hidden assumptions.

### What was done

- Updated [`docs/specs/azr-002-site-n8n-hubspot-contract.md`](docs/specs/azr-002-site-n8n-hubspot-contract.md) to lock a stricter control-layer snapshot:
  - added final approved snapshot table for all 5 groups;
  - clarified group-by-group state `CLOSED` vs `BLOCKER`;
  - added deterministic boundary rule for when site may return `success`;
  - added hard-constraints compliance check block.
- Updated [`docs/tasklist/azr-002-tasklist.md`](docs/tasklist/azr-002-tasklist.md) for `AZR-002-023`:
  - blocker reason rewritten in 5-group structure;
  - next action aligned to explicit gate enforcement and non-`BLOCKER` requirement for all groups.

### Locked vs unresolved (control-layer)

- Locked and preserved:
  - HubSpot-only launch baseline;
  - `source = website_form`;
  - deterministic no-fake-success boundary rule;
  - no autonomous outbound implications.
- Still unresolved `BLOCKER` areas:
  - Endpoint: final URL/path, method, content-type, required headers, versioning;
  - Auth: signature/auth scheme, exact header names, minimal rotation rule;
  - Timeout/Retry/Idempotency: timeout values, retry behavior, duplicate-prevention rule;
  - Mapping: target HubSpot object, exact property mapping, initial stage/property mapping;
  - Response contract: upstream success/permanent-failure/temporary-failure schemas.

### Compatibility check

- Confirmed compatible with current site boundary:
  - [`web/src/lib/contact-submit.ts`](web/src/lib/contact-submit.ts:109)
  - [`web/src/app/api/contact/submit/route.ts`](web/src/app/api/contact/submit/route.ts:33)
- Launch-safe behavior remains unchanged: no fake success and explicit fallback statuses.

### Notes

- New architectural/process decision was not introduced in this pass.
- [`memory_bank/decisions.md`](memory_bank/decisions.md) unchanged.

## 2026-03-15: AZR-002-023 Blocker Closure Pass Completed — Decision Checklist Formalized (Still BLOCKED)

### Status

- Stream status remains: `blocked`.
- `docs/specs/azr-002-site-n8n-hubspot-contract.md` updated from generic blocker snapshot to explicit 5-group Decision Checklist required by control layer.
- `ready-for-implementation` was not granted, because unresolved mandatory values remain across endpoint/auth/retry-mapping/response groups.

### What was locked vs blocked

- Locked and preserved:
  - HubSpot-only launch baseline
  - `source = website_form`
  - no-fake-success boundary rule
  - safe provisional compatibility with current submit boundary
- Still `BLOCKER` (formalized with owner + next action):
  - endpoint final URL/method/content-type/headers/versioning
  - auth/signature/header naming + minimal rotation rule
  - timeout/retry/idempotency
  - `site -> n8n -> HubSpot` object/property/stage mapping
  - upstream `n8n -> site` response schemas and deterministic success criterion details

### Artifacts updated

- `docs/specs/azr-002-site-n8n-hubspot-contract.md`
- `docs/tasklist/azr-002-tasklist.md`

### Compatibility check

- Confirmed compatible with current site boundary:
  - [`web/src/lib/contact-submit.ts`](web/src/lib/contact-submit.ts:109)
  - [`web/src/app/api/contact/submit/route.ts`](web/src/app/api/contact/submit/route.ts:33)
- Contract remains launch-safe without introducing undocumented integration assumptions.

### Notes

- New architecture/process decision was not introduced in this pass.
- `memory_bank/decisions.md` unchanged.

## 2026-03-15: AZR-002-023 Integration Contract Stream Marked BLOCKED — site -> n8n -> HubSpot

### Status

- Stream status: `blocked`.
- Артефакт `docs/specs/azr-002-site-n8n-hubspot-contract.md` подтвержден как provisional baseline и blocker register.
- Финальный контракт `site -> n8n -> HubSpot` не зафиксирован как implementation-ready.

### Blocker-level gaps

- final live endpoint details
- auth/signature contract
- timeout/retry/idempotency policy
- final `site -> n8n -> HubSpot` property mapping
- success-response schema for site boundary

### Guardrail

- `production-adapter` stream НЕ должен стартовать до закрытия всех blocker-level gaps и перевода контракта в `ready-for-implementation`.

### Validation

- Выполнена SSOT-сверка против:
  - `AGENTS.md`
  - `memory_bank/context.md`
  - `memory_bank/decisions.md`
  - `memory_bank/progress.md`
  - `02_website/forms-spec.md`
  - `03_leads/lead-intake-spec.md`
  - `03_leads/lead-taxonomy.md`
  - `03_leads/crm-pipeline.md`
  - `07_ops/task-board.md`
  - `07_ops/launch-checklist.md`
  - `web/src/app/api/contact/submit/route.ts`
  - `web/src/lib/contact-submit.ts`
  - `web/src/app/contact/page.tsx`

### Notes

- Scope строго контрактный: без UI/page правок и без runtime/infra изменений.
- Новых архитектурных решений не вводилось; `memory_bank/decisions.md` не изменялся.

## 2026-03-15: AZR-002 Integration Contract Stream Bound To Current Ticket

### Done

- Новый integration-contract stream не выделялся в отдельный ticket family и не переносился в `AZR-003`.
- Контрактный stream явно привязан к текущему `AZR-002` как следующий SSOT шаг после accepted safe submit boundary.
- Добавлен отдельный spec artifact:
  - `docs/specs/azr-002-site-n8n-hubspot-contract.md`
- В текущий `docs/tasklist/azr-002-tasklist.md` добавлена отдельная задача:
  - `AZR-002-023: Lock final integration contract for site -> n8n -> HubSpot`

### Notes

- Это только SSOT/task structuring step.
- Реализация production adapter, live endpoint config и end-to-end delivery не входили в этот шаг.
- Новых архитектурных/процессных решений не вводилось; `memory_bank/decisions.md` не изменялся.

## 2026-03-15: AZR-002-022 Follow-up Fix — External-Contract Drift in Contact Submit Boundary

### Done

- Выполнен узкий follow-up фикс в [`web/src/app/api/contact/submit/route.ts`](web/src/app/api/contact/submit/route.ts:1):
  - удалены hard-coded допущения внешнего контракта (`AZURSYSTECH_CONTACT_SUBMIT_URL`, `AZURSYSTECH_CONTACT_SUBMIT_TOKEN`, `Authorization: Bearer ...`);
  - сохранен server-side validation + payload assembly path через [`validateAndBuildContactPayload()`](web/src/lib/contact-submit.ts:109);
  - оставлена нейтральная provisional integration boundary без invent финального webhook/auth/property контракта до фиксации в SSOT;
  - при неготовом внешнем контракте API честно возвращает `integration_not_ready` с fallback message.
- Подтверждено, что redirect в [`/thank-you`](web/src/app/thank-you/page.tsx:1) остается только при `success` в [`handleSubmit()`](web/src/app/contact/page.tsx:37).
- Подтверждено, что fallback UX в [`/contact`](web/src/app/contact/page.tsx:1) сохраняется для `integration_not_ready` / `submit_failed` / `spam_detected`.

### Validation

- `cd /home/dmitrii/azursystech/web && npm run build` - pass
- Минимальная локальная проверка submit-path без live внешнего контракта:
  - POST в [`/api/contact/submit`](web/src/app/api/contact/submit/route.ts:33) с валидным payload;
  - результат: `HTTP 503` + `{"status":"integration_not_ready", ...}`.

### Notes

- Scope ограничен только drift follow-up (`needs_changes`) без broad rewrite.
- [`web/src/lib/contact-submit.ts`](web/src/lib/contact-submit.ts:1) не менялся: form contract и payload поля сохранены.
- Analytics/runtime/autonomous логика не добавлялась.
- Новых архитектурных/процессных решений не вводилось; [`memory_bank/decisions.md`](memory_bank/decisions.md:1) не изменялся.

## 2026-03-15: AZR-002-021 Safe Site-side Submit Path for `/contact`

### Done

- Убран fake-submit stub и внедрён реальный site-side submit flow для формы на [`/contact`](web/src/app/contact/page.tsx):
  - клиент отправляет [`FormData`](web/src/app/contact/page.tsx:45) в API-слой [`/api/contact/submit`](web/src/app/api/contact/submit/route.ts:1)
  - переход на [`/thank-you`](web/src/app/thank-you/page.tsx:1) происходит только при реальном статусе `success`
  - при `validation_error`, `integration_not_ready`, `submit_failed`, `spam_detected` показывается честное сообщение без fake-success
- Добавлен server-side submit handling в [`web/src/app/api/contact/submit/route.ts`](web/src/app/api/contact/submit/route.ts:1):
  - чтение данных формы
  - server-side валидация контракта
  - honeypot anti-spam branch
  - explicit integration boundary (без выдумывания внешнего endpoint contract)
- Добавлен контрактный сбор payload в [`web/src/lib/contact-submit.ts`](web/src/lib/contact-submit.ts:1):
  - сохранены только документированные поля формы
  - сохранены сегменты `particulier` / `tpe`
  - сохранены baseline-поля `source = website_form` и default `status = New`
  - условные блоки TPE/Home включаются в payload только по релевантному сегменту

### Doc-to-UI Review Findings (azursystech-doc-to-ui-review)

- Critical: none
- High: none
- Medium: none
- Low: none

Residual risks / untested areas:
- live интеграция `site -> n8n -> HubSpot` остаётся неготовой, потому что в SSOT не зафиксирован финальный webhook/auth/property contract;
- текущая реализация корректно возвращает `integration_not_ready` и честный fallback вместо фиктивной доставки.

### Validation

- `cd /home/dmitrii/azursystech/web && npm run build` - pass
- Минимальная локальная проверка безопасного поведения без live внешней доставки (локально поднят `next start` на `:3100`, затем POST в API):
  - validation branch: `400 validation_error` (обязательные поля)
  - unconfigured boundary: `503 integration_not_ready`
  - honeypot branch: `200 spam_detected`

### Notes

- Scope ограничен `AZR-002-021`: submit-path для [`/contact`](web/src/app/contact/page.tsx) + server-side boundary + обязательные task/progress updates.
- Analytics wiring, full chat integration, final HubSpot property contract и внешняя orchestration-схема не добавлялись.
- Новых архитектурных/процессных решений не вводилось; [`memory_bank/decisions.md`](memory_bank/decisions.md) не изменялся.

## 2026-03-15: AZR-002-020 Thank-you Route Implemented

### Done

- Реализован route `/thank-you` как безопасная post-submit handoff page:
  - добавлен [`web/src/app/thank-you/page.tsx`](web/src/app/thank-you/page.tsx)
- Структура страницы выровнена с implementation-map и user scope:
  - confirmation hero / success message
  - короткий блок «что дальше»
  - fallback contact methods block
  - безопасная optional note для срочного кейса (без обещаний времени)
  - CTA block на ключевые маршруты
- Явно сохранены fallback-каналы в UI:
  - [`/contact`](web/src/app/contact/page.tsx)
  - phone `+33 7 49 70 54 65`
  - WhatsApp `+33 7 49 70 54 65`
  - email `contact@azursystech.fr`
- Публичный copy сделан Russian-first, calm/reassuring/practical, без:
  - AI-autonomy wording
  - обещаний цены
  - обещаний сроков выезда
  - internal/dev wording
- Обновлен task artifact:
  - [`docs/tasklist/azr-002-tasklist.md`](docs/tasklist/azr-002-tasklist.md) добавлена и закрыта задача `AZR-002-020`.

### Doc-to-UI Review Findings (azursystech-doc-to-ui-review)

- Critical: none
- High: none
- Medium: none
- Low: none

### Visual Review Findings (azursystech-visual-review)

- High: none
- Medium: none
- Low: none

### Validation

- `cd /home/dmitrii/azursystech/web && npm run build` - pass
- В build output присутствует route `/thank-you`.

### Notes

- Scope ограничен только реализацией [`web/src/app/thank-you/page.tsx`](web/src/app/thank-you/page.tsx) и обязательными task/progress updates.
- Backend/runtime/integration/analytics не изменялись.
- Новых архитектурных/процессных решений не вводилось; [`memory_bank/decisions.md`](memory_bank/decisions.md) не изменялся.

## 2026-03-14: AZR-002-019 Post-review Micro-fixes Closed

### Done

- Закрыт узкий fix-pass после visual consistency review без broad rewrite.
- В `web/src/app/page.tsx` убран internal/dev wording в user-facing заголовке short-form блока:
  - `Короткая заявка (launch)` -> `Короткая заявка`.
- В `web/src/app/home/page.tsx` убран route-path token из FAQ:
  - `... отдельная страница /business` -> `... отдельный раздел «Для бизнеса»`.
- В `web/src/app/home/page.tsx` выровнен container rhythm по общему baseline:
  - `max-w-5xl` -> `max-w-6xl`.

### Validation

- `cd /home/dmitrii/azursystech/web && npm run build` - pass

### Notes

- Scope ограничен только 3 согласованными правками + обязательные task/progress updates.
- Структура секций, conversion logic, safe-launch chat contract, backend/runtime/analytics не изменялись.
- Новых архитектурных/процессных решений не вводилось; `memory_bank/decisions.md` не изменялся.

## 2026-03-14: AZR-002-018 Focused Visual Consistency Pass (Local Professional)

### Done

- Выполнен focused visual consistency pass в заданном scope:
  - shared shell
  - `/`
  - `/services`
  - `/business`
  - `/home`
  - `/pricing`
  - `/faq`
  - `/contact`
  - chat widget shell
- Визуальный контур выровнен под baseline `Local Professional`:
  - теплый фон / surface / border в палитре ADR-015
  - единая иерархия заголовков (serif для section heading)
  - единая иерархия CTA (teal primary, restrained secondary, terracotta WhatsApp)
  - более ровный card/container rhythm между страницами.
- Shell consistency доведена точечно:
  - updated `web/src/components/shell/site-header.tsx`
  - updated `web/src/components/shell/site-footer.tsx`
  - footer heading `Legal` -> `Правовое` для публичного RU-интерфейса.
- Homepage и contact route приведены к общему визуальному контракту без изменения content/route contracts:
  - updated `web/src/app/page.tsx`
  - updated `web/src/app/contact/page.tsx`.
- Chat widget оставлен launch-safe и secondary, дополнительно снижена навязчивость overlay:
  - compact minimized trigger
  - softer shadow
  - немного выше позиционирование на `/contact`, чтобы снизить риск конфликта с нижними CTA.

### Doc-to-UI Review Findings (azursystech-doc-to-ui-review)

- Critical: none
- High: none
- Medium: none
- Low:
  - В рамках этого pass остались визуально более «старые» legal/privacy страницы, но они вне текущего scope пользователя.

### Validation

- `cd /home/dmitrii/azursystech/web && npm run build` - pass

### Notes

- Scope intentionally limited to visual consistency only; без backend/runtime/integration/analytics работ.
- Route contracts и conversion logic не расширялись.
- `memory_bank/decisions.md` не изменялся (новых architectural/process decisions не добавлялось).

## 2026-03-14: AZR-002-015 MVP Chat Widget Shell Implemented

### Done

- Implemented reusable sitewide chat widget shell in [`web/src/components/chat-widget-shell.tsx`](web/src/components/chat-widget-shell.tsx).
- Mounted widget through shared app layout in [`web/src/app/layout.tsx`](web/src/app/layout.tsx).
- Added required MVP shell states inside widget UI:
  - minimized
  - opened
  - qualification/intake intro
  - contact handoff entry
  - safe fallback / next-step messaging
- Kept launch-safe constraints explicit in public copy:
  - intake-only role
  - no autonomous outbound behavior
  - no pricing/time commitments
  - no fake runtime behavior
- Preserved clear fallback paths in-widget and unchanged across site:
  - `/contact`
  - phone
  - WhatsApp
  - email
- Added legal/privacy processing note in widget handoff stage with links to [`/legal`](web/src/app/legal/page.tsx) and [`/privacy`](web/src/app/privacy/page.tsx).
- Applied non-intrusive placement for mobile/desktop and excluded widget from legal/privacy routes to avoid overlay on legal reading pages.
- Ran self-check using `azursystech-doc-to-ui-review` guidance:
  - no Critical / High / Medium doc-to-UI drift findings remained after final copy/UX adjustments.

### Validation

- `cd /home/dmitrii/azursystech/web && npm run build` - pass

### Notes

- Scope limited to `AZR-002-015` only.
- No backend logic, analytics wiring, or AI runtime behavior added.
- No new architectural/process decision introduced; [`memory_bank/decisions.md`](memory_bank/decisions.md) not changed.

## 2026-03-14: MVP Visual Direction Confirmed

### Done

- Approved the MVP visual direction as `Local Professional`.
- Added implementation-facing visual contract:
  - `docs/plans/azr-002-visual-direction.md`
- Updated brand baseline in `01_brand/brand-pack.md` with:
  - approved palette
  - typography direction
  - image/no-go guidance
- Recorded the design decision in `memory_bank/decisions.md` as `ADR-015`.
- Updated `memory_bank/context.md` and `docs/tasklist/azr-002-tasklist.md` so the next frontend stream can work against a stable visual baseline.

### Next

- Keep `/services`, `/business`, `/home`, and any visual cleanup passes aligned with the approved `Local Professional` design contract.

## 2026-03-14: Chat Widget Added to AZR-002 Implementation Queue

### Done

- Added explicit MVP task for chat widget implementation:
  - `AZR-002-015: Implement MVP chat widget shell and safe launch entry`
- Fixed the chat/AI assistant as an explicit part of the launch contact model:
  - secondary conversion layer
  - intake-only
  - must not replace `/contact`, phone, WhatsApp, or email
- Current continuity context updated so future sessions do not lose the chat scope.

### Next

- Keep the chat widget as a separate implementation stream after core route work, with launch-safe copy and future `site -> n8n -> HubSpot` compatibility.

## 2026-03-12: AI Runtime Scaffold

### Done

- Добавлен CLI runtime: `scripts/ai_agents.py`.
- Добавлены агенты и реестр: `05_ai/agents/registry.json`.
- Добавлены prompt templates и example payloads.
- Добавлены run artifacts pipeline + approval note generation.
- Заполнены документы в `05_ai/*`.

### Validation

- `python3 -m py_compile scripts/ai_agents.py` - pass
- `./scripts/ai_agents.py list` - pass
- `./scripts/ai_agents.py run ... --dry-run` - pass

## 2026-03-12: Agent Ops Bootstrap

### Done

- Добавлен `AGENTS.md` для проекта.
- Добавлена структура `.agent/`:
  - roles (`ROSTER.md`)
  - workflow (`workflows/sdd-protocol.md`)
  - rules (`rules/*`)
  - skills (`skills/*`)
- Инициализирован `memory_bank/`.
- Добавлены templates в `docs/specs|plans|tasklist|reports|sdd_templates`.

### Next

- Определить первый активный тикет для content/leads и перейти в execution.

## 2026-03-12: AZR-001 Handoff Package Created

### Done

- Зафиксирован активный рабочий контур для `AZR-001`:
  - `docs/specs/AZR-001-facebook-page-copy.md`
  - `docs/plans/AZR-001-facebook-page-copy-plan.md`
  - `docs/tasklist/AZR-001.tasklist.md`
  - `docs/reports/AZR-001-techlead-to-coder.md`
- Подготовлен реальный handoff `Tech Lead -> Coder` с SLA и AC.

### Next

- Выполнить перепись `01_brand/facebook-page-copy.md` в FR-first формате.
- Передать на review через handoff `Coder -> Reviewer`.

## 2026-03-12: Website Infra Bootstrap (VPS Chain)

### Done

- Добавлен production-ready web runtime в `web/`:
  - `next.config.ts` с `output: "standalone"`
  - `src/app/health/route.ts` (`GET /health`)
  - базовая стартовая страница и metadata
- Добавлен infra-контур в корне проекта:
  - `Dockerfile`
  - `docker-compose.yml`
  - `docker-compose.vps.yml`
  - `nginx.proxy.conf`
  - `.env.vps.example`
  - `deploy.sh`
  - `scripts/backup-env.sh`
- Добавлены GitHub workflows:
  - `.github/workflows/ci.yml`
  - `.github/workflows/docker-publish.yml`
  - `.github/workflows/deploy-vps.yml`
  - `.github/workflows/uptime-monitor.yml`
- Добавлены runbooks:
  - `docs/deployment/github-vps.md`
  - `docs/deployment/backup-restore-runbook.md`
- Удален случайно созданный вложенный git-репозиторий `web/.git`.

### Next

- Прописать реальные значения secrets/vars в GitHub.
- Скопировать runtime файлы на VPS и выполнить first deploy immutable tag `sha-*`.

## 2026-03-13: Facebook Group Outreach Spec Hardening

### Done

- Обновлен `04_facebook/groups-outreach-list.md`:
  - добавлены секции `SSOT tracking location`, `Field schema for tracking sheet`, `Concrete first 10 groups`, `Source mapping table`, `UTM convention`;
  - удалены конфликтующие source tags вида `facebook_group_*` из source-слоя, оставлены только как classification tags.
- Обновлен `03_leads/lead-intake-spec.md`:
  - `messenger` заменен на `facebook_messenger`;
  - source list расширен до SSOT-набора.
- Обновлен `02_website/analytics-spec.md`:
  - source buckets синхронизированы с `03_leads/lead-taxonomy.md`;
  - UTM examples выровнены с протоколом `[topic]`.

### Validation

- Выполнен repo-wide grep по source-tagам и конфликтным legacy-тегам.
- Конфликтующие теги `facebook_group_local|...` в source-контексте удалены.

## 2026-03-13: Approval Workflow Doc Fixes

### Done

- Исправлена Markdown-разметка в `05_ai/approval-workflow.md`:
  - починен сломанный code fence в секции workflow;
  - удален лишний завершающий fence в конце файла.
- Убрано расхождение с `AGENTS.md` по логированию:
  - в MVP note зафиксированы structured run artifacts в `05_ai/runs/` вместо internal markdown log.

### Validation

- Проверены все code fences через `rg`.
- Проверен хвост документа и секция `Auditability and logging`.

## 2026-03-13: Escalation Rules + Lead Agent Contract Alignment

### Done

- Исправлена Markdown-разметка в `05_ai/escalation-rules.md`:
  - починен code fence в секции escalation output example;
  - удален лишний завершающий fence в конце файла.
- Выровнен контракт escalation note:
  - `lead_segment` заменен на `lead_type` в соответствии с `05_ai/lead-agent-spec.md`.
- Расширен output contract в `05_ai/lead-agent-spec.md`:
  - добавлены `escalation_level`, `escalation_category`, `risk_reason`, `suggested_human_action`;
  - зафиксировано правило `null` для неэскалированных кейсов.

### Validation

- Проверены все code fences через `rg`.
- Перепроверены секции output contract и escalation example на совпадение полей.

## 2026-03-13: Content Engine Spec Doc Fixes

### Done

- Исправлена Markdown-разметка в `05_ai/content-engine-spec.md`:
  - починен code fence в секции content generation workflow.
- Обновлена секция `Next file to create`:
  - удалена устаревшая ссылка на уже существующий `lead-agent-spec.md`;
  - next step приведен к текущему состоянию блока `05_ai`.

### Validation

- Проверены code fences через `rg`.
- Проверен хвост документа и секция `Next file to create`.

## 2026-03-13: Lead Agent Spec Fixes and Prompt Alignment

### Done

- Исправлена Markdown-разметка в `05_ai/lead-agent-spec.md`:
  - удален лишний открывающий fence в начале файла;
  - починен code fence в CRM handoff example;
  - удалены лишние fences в конце файла.
- Уточнен контракт слоев данных в `05_ai/lead-agent-spec.md`:
  - разделены runtime fields и CRM handoff fields;
  - добавлено явное mapping rule `lead_type -> lead_segment`;
  - запрещены несуществующие `unknown_*` теги вне taxonomy.
- Выровнен prompt contract в `05_ai/prompts/lead_router_system.md`:
  - добавлены `escalation_level`, `escalation_category`, `risk_reason`, `suggested_human_action`;
  - зафиксировано правило `null` для неэскалированных кейсов.

### Validation

- Проверены code fences через `rg`.
- Перепроверены секции taxonomy mapping, CRM handoff example и output format в prompt template.

## 2026-03-13: Content Prompt Library Sanity Fix

### Done

- Обновлен `05_ai/prompt-library-content.md`:
  - в master prompt добавлено явное правило `draft until human approval`;
  - секция `Next file to create` приведена к текущему состоянию блока `05_ai` и больше не ссылается на уже существующий `prompt-library-support.md`.

### Validation

- Проверен хвост документа.
- Проверено наличие approval guardrail и отсутствие stale next-step ссылки.

## 2026-03-13: Support Prompt Library Contract Alignment

### Done

- Обновлен `05_ai/prompt-library-support.md`:
  - в master support prompt добавлено правило `draft until human approval`;
  - выходы support prompts выровнены с `05_ai/lead-agent-spec.md` и `05_ai/escalation-rules.md`;
  - `needs_escalation` заменен на `escalation_required`;
  - `recommended_human_action` заменен на `suggested_human_action`;
  - `fit_level` заменен на taxonomy-aligned `lead_quality`;
  - `later` в follow-up stages заменен на `follow_up_later`;
  - founder handoff package расширен escalation fields.

### Validation

- Проверен хвост документа.
- Выполнен grep по ключевым contract fields и status names.

## 2026-03-13: AI Runtime Contract Enforcement

### Done

- Обновлен `scripts/ai_agents.py`:
  - добавлен structured output parser/validator для schema-bound agents;
  - `lead_router` теперь может сохранять `parsed_output` в run artifact;
  - escalation status теперь берется из model-declared field `escalation_required`, а keyword fallback используется только для агентов без structured schema;
  - добавлена cross-field validation для escalation details.
- Обновлен `05_ai/agents/registry.json`:
  - добавлена `structured_output` schema для `lead_router`;
  - расширены `context_files` для `lead_router` и `content_writer` актуальными `05_ai` specs;
  - runtime-context теперь ближе к реальным contracts.
- Обновлен `05_ai/examples/lead_router_input.json`:
  - `source` заменен на SSOT-aligned `facebook_messenger`.
- Обновлен `05_ai/README.md`:
  - runtime behavior синхронизирован с новой structured validation logic.

### Validation

- `python3 -m py_compile scripts/ai_agents.py` - pass
- `./scripts/ai_agents.py run --agent lead_router --input-file 05_ai/examples/lead_router_input.json --dry-run` - pass
- `./scripts/ai_agents.py run --agent content_writer --input-file 05_ai/examples/content_writer_input.json --dry-run` - pass
- parser smoke test for valid and invalid `lead_router` structured output - pass

## 2026-03-13: DeepSeek Provider Switch for AI Runtime

### Done

- Обновлен `scripts/ai_agents.py`:
  - runtime переведен с OpenAI Responses API на DeepSeek Chat Completions API;
  - `OPENAI_API_KEY` заменен на `DEEPSEEK_API_KEY`;
  - `OPENAI_BASE_URL` заменен на `DEEPSEEK_BASE_URL`;
  - default model заменена на `deepseek-chat`;
  - extraction logic адаптирована под `choices[].message.content`.
- Обновлен `05_ai/agents/registry.json`:
  - default model для `lead_router` и `content_writer` заменена на `deepseek-chat`.
- Обновлены runtime docs:
  - `README.md`
  - `05_ai/README.md`
  - `AGENTS.md`
  - `.env.vps.example`

### Validation

- `python3 -m py_compile scripts/ai_agents.py` - pass
- `./scripts/ai_agents.py run --agent lead_router --input-file 05_ai/examples/lead_router_input.json --dry-run` - pass
- `./scripts/ai_agents.py run --agent content_writer --input-file 05_ai/examples/content_writer_input.json --dry-run` - pass

## 2026-03-13: Reviews System Doc Repair

### Done

- Исправлен `06_seo/reviews-system.md`:
  - удален лишний открывающий code fence в начале файла;
  - починен code fence в секции `Review request workflow`;
  - удалены лишние пустые fences в конце файла.
- Добавлен operational contract в секцию tracking:
  - зафиксирован SSOT для review tracking (`CRM` after `won`, `Google Sheet` as fallback);
  - добавлен mapping review statuses к CRM/follow-up действиям;
  - добавлено правило немедленного обновления статуса после review touchpoint.
- Обновлен устаревший `Next file to create`:
  - вместо уже существующего `service-pages-plan.md` указан новый логичный следующий артефакт `local-citations-plan.md`.

### Validation

- `rg -n '^```|^````' 06_seo/reviews-system.md` - pass
- проверен хвост файла и секция tracking/status mapping - pass

## 2026-03-13: Deploy Baseline Simplified to Build on VPS

### Done

- Обновлен `docker-compose.vps.yml`:
  - `app` теперь собирается из локального `Dockerfile` на VPS;
  - runtime больше не требует `IMAGE_REPO` и `IMAGE_TAG`.
- Обновлен `.github/workflows/deploy-vps.yml`:
  - trigger переведен на успешный `CI`, а не на `Docker Publish`;
  - deploy выполняет `git pull --ff-only origin main` на VPS;
  - runtime поднимается через `docker compose up -d --build --remove-orphans`.
- Обновлен `.github/workflows/docker-publish.yml`:
  - automatic trigger removed;
  - GHCR publish path оставлен только как manual fallback.
- Обновлен runbook `docs/deployment/github-vps.md` под source-based deploy без `GHCR_*`.
- Зафиксировано архитектурное решение `ADR-009`.

### Validation

- `docker compose -f docker-compose.vps.yml config` - pass
- workflow YAML checked via local readback - pass

## 2026-03-13: Next.js Container Healthcheck Fix

### Done

- Обновлен `Dockerfile`:
  - runtime теперь явно задает `HOSTNAME=0.0.0.0` для standalone Next.js.
- Обновлен `docker-compose.vps.yml`:
  - app environment дополнен `HOSTNAME=0.0.0.0`;
  - healthcheck больше не бьет в `127.0.0.1`, а использует фактический container IP.
- Обновлен `docker-compose.yml` для локального parity.
- Обновлены `.env.vps.example` и `docs/deployment/github-vps.md`.

### Validation

- локальный `docker run` smoke test showed `/health` = `200`
- container listen socket inspected: app was binding to container IP, not loopback

## 2026-03-13: Deploy Assumptions Doc Alignment

### Done

- Обновлен `docs/deployment/github-vps.md`:
  - verify command для `azursystech-app` выровнен с фактическим healthcheck behavior;
  - явно добавлена launch SSL / edge path схема: `Cloudflare -> Nginx Proxy Manager -> azursystech-web`.

### Validation

- live checks already confirmed `https://azursystech.fr/health` = `200`

## 2026-03-13: AZR-002 Website Implementation Map Added

### Done

- Добавлен `docs/plans/azr-002-implementation-map.md`.
- Зафиксированы:
  - MVP route map;
  - page-to-section mapping;
  - component inventory;
  - component-to-doc mapping;
  - recommended build order.

### Validation

- implementation map cross-checked against:
  - `02_website/site-architecture.md`
  - `02_website/wireframes.md`
  - `02_website/forms-spec.md`
  - `docs/specs/azr-002-implementation-handoff.md`

## 2026-03-13: RooCode Skills Added

### Done

- Добавлены рабочие skills в `.roo/skills/`:
  - `azursystech-page-implementation`
  - `azursystech-form-contract`
  - `azursystech-doc-to-ui-review`
  - `azursystech-safe-ai-runtime`
- Для page/form skills добавлены reference files с route map, component map и field contract.
- Skills ориентированы на пару `Tech Lead -> RooCode` и на предотвращение drift между docs и implementation.

### Validation

- checked skill folder structure under `.roo/skills`
- reread all created `SKILL.md` files after patch

## 2026-03-13: Safe Launch AI Policy Added to Runtime Config

### Done

- Обновлен `scripts/ai_agents.py`:
  - добавлена загрузка и валидация runtime policy из env;
  - launch mode и safety flags теперь попадают в prompt payload;
  - runtime policy сохраняется в run artifacts.
- Обновлен `05_ai/prompts/lead_router_system.md`:
  - добавлены explicit runtime guardrails для `limited_live_intake`.
- Обновлены:
  - `.env.vps.example`
  - `docs/deployment/github-vps.md`
  - `05_ai/README.md`
- Зафиксировано архитектурное решение `ADR-010`.

### Validation

- runtime policy defaults reviewed against AZR-003 launch rules

## 2026-03-13: Reviews System Tail Formatting Fix

### Done

- Повторно проверен `06_seo/reviews-system.md`.
- Исправлены только форматные ошибки в хвосте файла:
  - `## 330` -> `## 30`
  - имя следующего файла оформлено как inline code
  - пункты под `It must define:` возвращены в markdown list

### Validation

- проверен хвост файла через `tail` и `nl`

## 2026-03-13: Management Docs Refresh

### Done

- Обновлены stale управляющие документы:
  - `docs/implementation-readiness.md`
  - `docs/content-status.md`
  - `07_ops/task-board.md`
  - `docs/backlog.md`
  - `docs/.active_ticket`
  - `docs/decisions-log.md`
  - `docs/project-notes.md`
- Зафиксирован переход проекта из bootstrap в `implementation phase`.
- Активный тикет переключен на `AZR-002`.
- В management layer зафиксированы реальные launch blockers:
  - legal/business placeholders
  - phone / WhatsApp / contact flow
  - deploy secrets / `.env`
  - решение по AI live-run на старте

### Validation

- выполнен project audit по `.md` inventory
- проверены stale readiness/status/task pointers
- подтвержден рабочий статус AI CLI через `python3 -m py_compile` и `./scripts/ai_agents.py list`

## 2026-03-13: AZR-002 Implementation Handoff Package

### Done

- Добавлен handoff package для `AZR-002`:
  - `docs/specs/azr-002-implementation-handoff.md`
  - `docs/plans/azr-002-build-plan.md`
  - `docs/tasklist/azr-002-tasklist.md`
- В `AZR-002` зафиксированы:
  - locked MVP baseline
  - source-of-truth rule set
  - first implementation queue
  - out-of-scope boundaries
  - launch blockers
  - open decisions
- Build plan разложен по фазам:
  - website shell + core pages
  - form + CRM/Sheets
  - chat widget + AI intake
  - Facebook/GBP linkage
  - deploy + runtime hardening

### Validation

- handoff package сверён с существующим форматом `AZR-001`
- tasklist создан с owner / priority / dependency / acceptance criteria / status

## 2026-03-13: AZR-003 Go-Live Readiness Package

### Done

- Добавлен go-live package для `AZR-003`:
  - `docs/specs/azr-003-go-live-readiness.md`
  - `docs/plans/azr-003-go-live-plan.md`
  - `docs/tasklist/azr-003-tasklist.md`
- В `AZR-003` жестко разделены:
  - launch blockers
  - `cannot launch until`
  - post-launch deferred items
- Пакет разложен по этапам:
  - legal readiness
  - contact readiness
  - deployment readiness
  - AI runtime readiness
  - GBP / review / local presence readiness
  - go / no-go review

### Validation

- структура пакета выровнена с `AZR-002`
- tasklist создан с owner per blocker, priority, dependency, AC, status

## 2026-03-13: AZR-003 Priority and Launch Defaults Alignment

### Done

- В `AZR-003` зафиксирован recommended execution order:
  - legal baseline
  - contact baseline
  - deploy baseline
  - AI baseline decision
- Добавлены recommended launch defaults:
  - `form + site chat only`, если phone / WhatsApp еще не готовы
  - AI launch mode по умолчанию ограничен `intake + summary + handoff`
  - без autonomous outbound sending
  - без pricing commitments
  - без scheduling promises
- Обновлен `AZR-003` tasklist под фактическую первую очередь исполнения.

### Validation

- spec / plan / tasklist повторно сверены на непротиворечивость порядка и launch-mode guardrails

## 2026-03-13: AZR-003 Legal Baseline Partially Filled

### Done

- В `02_website/legal-pages.md` подставлены подтвержденные owner/business fields:
  - `OLEINIK DMITRII`
  - `Entrepreneur individuel - micro-entrepreneur`
  - `SIREN 940 870 140`
  - `SIRET 940 870 140 00016`
  - `9 AV EMMANUEL BRIDAULT, 06000 NICE`
- В `docs/tasklist/azr-003-tasklist.md` задача `AZR-003-001` переведена в `in_progress`.

### Still open

- public contact email
- public phone decision/value
- hosting provider data
- contact/privacy contact fields

### Validation

- legal identity block reread after patch

## 2026-03-13: AZR-003 Hosting Baseline Filled

### Done

- В `02_website/legal-pages.md` заполнен hosting block:
  - `Hetzner Online GmbH`
  - `Industriestr. 25, 91710 Gunzenhausen, Germany`
  - `https://www.hetzner.com`
- В `docs/tasklist/azr-003-tasklist.md` задача `AZR-003-002` переведена в `done`.

### Still open

- public contact email
- public phone decision/value
- public WhatsApp decision/value
- privacy contact fields

### Validation

- hosting block reread after patch

## 2026-03-13: AZR-003 Public Contact Email Filled

### Done

- В `02_website/legal-pages.md` подставлен `contact@azursystech.fr`:
  - в business identity block
  - в privacy/data contact block

### Still open

- public phone decision/value
- public WhatsApp decision/value
- `Additional contact if needed`

### Validation

- email fields reread after patch

## 2026-03-13: AZR-003 Phone and WhatsApp Baseline Filled

### Done

- В launch-critical docs подставлен public phone / WhatsApp baseline:
  - `+33 7 49 70 54 65`
- Обновлены:
  - `02_website/legal-pages.md`
  - `02_website/site-architecture.md`
  - `02_website/forms-spec.md`
  - `02_website/wireframes.md`
  - `01_brand/homepage-copy.md`
  - `01_brand/faq.md`
  - `06_seo/gbp-setup-checklist.md`
- В `docs/tasklist/azr-003-tasklist.md` задача `AZR-003-003` переведена в `in_progress`.

### Still open

- подтвердить, что WhatsApp использует тот же номер и публично доступен для launch
- deploy baseline
- AI launch mode decision

### Validation

- reread critical contact snippets after patch
- removed remaining stale contact-placeholder note in `02_website/site-architecture.md`

## 2026-03-13: AZR-003 Contact and AI Launch Decisions Confirmed

### Done

- Confirmed launch decisions:
  - WhatsApp public on the same number `+33 7 49 70 54 65`
  - AI launch mode = `limited live intake`
- Updated `AZR-003` package to reflect confirmed decisions instead of open assumptions.
- Closed tasks:
  - `AZR-003-003`
  - `AZR-003-005`
- Synchronized launch-facing docs:
  - `04_facebook/facebook-strategy.md`
  - `02_website/site-architecture.md`
  - `02_website/analytics-spec.md`
- Added ADR-008 to `memory_bank/decisions.md`.

### Validation

- reread `AZR-003` spec / plan / tasklist after patch
- grep pass on stale `WhatsApp later` / `future WhatsApp click` markers

## 2026-03-13: AZR-003 Deploy Baseline Hardening

### Done

- Переключен `docs/.active_ticket` на `AZR-003`.
- В `.env.vps.example` убран реальный AI key и заменен на placeholder.
- В `docker-compose.vps.yml` добавлен runtime passthrough для:
  - `DEEPSEEK_API_KEY`
  - `DEEPSEEK_BASE_URL`
  - `ALLOWED_ORIGINS`
- В `docs/deployment/github-vps.md` уточнены:
  - обязательные VPS `.env` runtime values
  - warning про секреты в tracked files
  - verification step for runtime env visibility
- В `docs/tasklist/azr-003-tasklist.md` задача `AZR-003-004` переведена в `in_progress`.

### Risks

- DeepSeek key previously stored in `.env.vps.example` should be rotated.

### Validation

- deploy baseline files reread after patch

## 2026-03-14: Deploy Cutover Confirmed Live

### Done

- Локальный рабочий repo был перепривязан на `git@github.com:oleyna80/azursystech-site.git`.
- Placeholder history сохранена в branch `placeholder-backup`.
- `main` в `azursystech-site` заменен реальным проектом.
- Исправлен production deploy path:
  - `Deploy to VPS` использует build-on-VPS, а не GHCR baseline;
  - `Deploy to VPS` проходит успешно;
  - `azursystech.fr` и `/health` отвечают `200`.
- Исправлен container healthcheck drift для Next.js runtime:
  - `HOSTNAME=0.0.0.0`
  - healthcheck идет по container IP, а не по `127.0.0.1`.
- Уточнен runbook `docs/deployment/github-vps.md`:
  - verify commands приведены к реальному runtime behavior;
  - SSL edge path явно зафиксирован как `Cloudflare -> NPM -> azursystech-web`.

### Validation

- GitHub Actions:
  - `CI` - pass
  - `Deploy to VPS` - pass
- Public checks:
  - `curl -I https://azursystech.fr` - `200`
  - `curl -s https://azursystech.fr/health` - `200`

## 2026-03-14: RooCode Delivery Workflow Activated

### Done

- Зафиксирован рабочий delivery mode:
  - current agent = Tech Lead
  - RooCode = coder
  - Tech Lead only tasks/review/follow-up, not primary implementation
- В `.roo/skills/` созданы рабочие skills:
  - `azursystech-page-implementation`
  - `azursystech-form-contract`
  - `azursystech-doc-to-ui-review`
  - `azursystech-safe-ai-runtime`
- Подготовлен implementation-facing artifact:
  - `docs/plans/azr-002-implementation-map.md`

### Validation

- skills directory reread after creation
- implementation map reread against `02_website/*`

## 2026-03-14: Contact Page Implemented and Accepted

### Done

- RooCode реализовал route `/contact` в `web/src/app/contact/page.tsx`.
- По результатам review были исправлены:
  - hidden honeypot anti-spam field;
  - public copy drift с internal/dev wording.
- Итоговый `/contact` принят:
  - sections соответствуют implementation map;
  - contacts соответствуют launch SSOT;
  - form contract и `particulier` / `tpe` branching сохранены;
  - submit flow остается honest stub без fake backend behavior.

### Validation

- file-level review against:
  - `02_website/forms-spec.md`
  - `03_leads/lead-intake-spec.md`
  - `docs/plans/azr-002-implementation-map.md`
- `npm run build` reported as pass by RooCode

### Risks

- Local independent build validation was not rerun by Tech Lead in this environment due WSL resolving to Windows `npm` path.

## 2026-03-14: AZR-002-009 Homepage/Shell Follow-up Closed

### Done

- Closed review gaps for `AZR-002-009` within homepage/shell scope.
- Updated shared shell components:
  - `web/src/components/shell/site-header.tsx`
  - `web/src/components/shell/site-footer.tsx`
- Header now includes full MVP primary nav links:
  - `/`, `/services`, `/business`, `/home`, `/pricing`, `/faq`, `/contact`
- Header CTA layer aligned with launch contract:
  - primary: `Оставить заявку`
  - secondary entries: WhatsApp + chat entry
- Footer aligned to MVP contract:
  - short brand line
  - links
  - area served
  - legal links `/legal` and `/privacy`
  - contact CTA
- Updated homepage `web/src/app/page.tsx`:
  - hero now explicitly shows who/for whom/where, business relevance, and multiple CTAs;
  - launch-visible dedicated WhatsApp CTA added in hero;
  - chat CTA/entry added in hero and dedicated chat entry block;
  - contact form block added as honest launch-compatible stub (UI-only, no backend flow).
- Kept `/contact` route behavior untouched for form submit logic (honest stub remains in place).
- Updated task artifact:
  - `docs/tasklist/azr-002-tasklist.md` -> `AZR-002-009` marked `done`.

### Validation

- `cd /home/dmitrii/azursystech/web && npm run build` - pass

### Notes

- No new architecture/process decision introduced; `memory_bank/decisions.md` not changed.
- Route stubs were not required for build in this follow-up scope.

## 2026-03-14: Continuity Sync for Next Session

### Done

- `memory_bank/context.md` rewritten to current execution state.
- Active ticket returned to `AZR-002` because current work has moved from launch-baseline hardening back to website implementation.
- `AZR-002` tasklist updated to reflect:
  - planning/handoff tasks completed;
  - `/contact` execution completed;
  - `app shell + homepage skeleton` queued next.
- `AZR-003` tasklist updated to reflect deploy baseline as done and to keep remaining blockers visible but secondary.

### Validation

- reread `memory_bank/context.md`
- reread `docs/.active_ticket`
- reread `docs/tasklist/azr-002-tasklist.md`
- reread `docs/tasklist/azr-003-tasklist.md`

## 2026-03-14: Multi-Agent Operating Model Standardized

### Done

- `AGENTS.md` расширен явной multi-agent operating model:
  - control tower
  - allowed parallel streams
  - reporting contract between streams
  - ownership rule for SSOT changes
- `.agent/ROSTER.md` расширен:
  - added `Integration Lead`
  - added `CRM Lead`
  - parallel stream model and handoff matrix updated
- `docs/reports/AGENT_HANDOFF_TEMPLATE.md` расширен кратким stream summary block.
- Added `ADR-012` to fix parallel-stream execution as accepted operating model.
- 5-point unified return format explicitly fixed as canonical for all parallel chats:
  - `What was done`
  - `Decisions made`
  - `Files / settings changed`
  - `Open blockers`
  - `Next recommended action`

### Validation

- reread `AGENTS.md`
- reread `.agent/ROSTER.md`
- reread `docs/reports/AGENT_HANDOFF_TEMPLATE.md`
- reread `memory_bank/context.md`

## 2026-03-14: Documentation Cleanup Batch for 00-07

### Done

- Updated `07_ops/task-board.md` to current execution state:
  - `AZR-002` website MVP build now reflected as the active work
  - stale contact/deploy blockers removed from daily execution lane
- Updated `07_ops/launch-checklist.md`:
  - marked already-true launch prerequisites as done
  - added current launch-critical checklist items for HubSpot and `n8n`
- Removed stale placeholder wording from live-resolved docs:
  - `02_website/legal-pages.md`
  - `03_leads/lead-intake-spec.md`
- Removed legacy `Next file to create` tails across `00_strategy`-`06_seo` and `05_ai` docs where sequencing is now handled by task artifacts and memory bank.

### Validation

- reread `07_ops/task-board.md`
- reread `07_ops/launch-checklist.md`
- reread updated placeholder sections in `02_website/legal-pages.md` and `03_leads/lead-intake-spec.md`
- grep pass for `Next file to create` in `00_strategy`-`07_ops`

## 2026-03-14: Language, CRM, Legal, and KPI Alignment Pass

### Done

- Fixed public language direction for MVP:
  - Russian-first public site for the russophone audience on the Côte d'Azur
  - French and English planned as phase 2
  - German optional later
- Removed Google Sheets fallback as primary launch path:
  - `03_leads/*`
  - `02_website/forms-spec.md`
  - `02_website/analytics-spec.md`
  - `05_ai/approval-workflow.md`
  - `05_ai/lead-agent-spec.md`
- Improved legal wording in `02_website/legal-pages.md`:
  - aligned expected tools with HubSpot CRM + actual launch stack direction
- Upgraded `07_ops/kpi-framework.md` from generic list to implementation-aware KPI model linked to:
  - site analytics
  - HubSpot pipeline
  - GBP / reviews

### Validation

- reread `02_website/site-architecture.md`
- reread `06_seo/local-seo-plan.md`
- reread `02_website/legal-pages.md`
- reread `03_leads/crm-pipeline.md`
- reread `03_leads/lead-intake-spec.md`
- reread `02_website/forms-spec.md`
- reread `07_ops/kpi-framework.md`

## 2026-03-14: AZR-002-010 Legal and Privacy Routes Implemented

### Done

- Реализован route `/legal`:
  - `web/src/app/legal/page.tsx`
  - секции выровнены с `02_website/legal-pages.md` (идентификация сайта, данные владельца, контакты, публикация, хостинг, IP, ответственность, внешние ссылки, применимое право).
- Реализован route `/privacy`:
  - `web/src/app/privacy/page.tsx`
  - секции выровнены с `02_website/legal-pages.md` (какие данные, каналы, цели, основание, использование, хранение, инструменты, права, контакт, аналитика, чат, формы).
- Совместимость shell links подтверждена:
  - `web/src/components/shell/site-footer.tsx` уже содержит `/legal` и `/privacy`; после добавления routes ссылки стали валидными.
- Обновлен task artifact:
  - `docs/tasklist/azr-002-tasklist.md` добавлена и закрыта задача `AZR-002-010`.

### Validation

- `cd /home/dmitrii/azursystech/web && npm run build` - pass
- В build output присутствуют routes:
  - `/legal`
  - `/privacy`

### Notes

- Публичные контакты сохранены по SSOT: `contact@azursystech.fr`, `+33 7 49 70 54 65`.
- Контракт `/contact` не менялся.
- Новых архитектурных/процессных решений не вводилось; `memory_bank/decisions.md` не изменялся.

## 2026-03-14: AZR-002-011 Services Route Implemented

### Done

- Реализован route `/services`:
  - `web/src/app/services/page.tsx`
  - страница выстроена business-first по SSOT.
- Добавлены секции route:
  - intro / page hero
  - services for business
  - services for home users
  - packaged offers
  - contact / CTA block
  - FAQ mini-block
- Pricing presentation выровнена с approved framing:
  - `от`
  - `по запросу`
  - стоимость зависит от объема задачи
- Все CTA ведут на `/contact`.
- Обновлен task artifact:
  - `docs/tasklist/azr-002-tasklist.md` добавлена и закрыта задача `AZR-002-011`.

### Validation

- `cd /home/dmitrii/azursystech/web && npm run build` - pass

### Notes

- Public copy kept Russian-first and business-first.
- Existing routes `/`, `/contact`, `/legal`, `/privacy` were not changed.
- No new architecture/process decision introduced; `memory_bank/decisions.md` not changed.

## 2026-03-14: AZR-002-012 Business Route Implemented

### Done

- Реализован route `/business`:
  - `web/src/app/business/page.tsx`
  - страница выстроена как TPE-first conversion page в требуемом порядке секций.
- Добавлены секции route:
  - business hero
  - typical business problems
  - what AzurSysTech can set up
  - use cases
  - offer blocks
  - how we work
  - contact / CTA block
  - business FAQ mini-block
- Подчеркнут practical-support scope по SSOT:
  - `postes de travail`
  - `Wi-Fi`
  - `réseau local`
  - `imprimantes`
  - `dossiers partagés`
  - `intervention sur site`
- Все ключевые CTA направлены на `/contact`.
- Обновлен task artifact:
  - `docs/tasklist/azr-002-tasklist.md` добавлена и закрыта задача `AZR-002-012`.
- Выполнен self-check через skill `azursystech-doc-to-ui-review`:
  - критичных/высоких/средних drift-факторов не выявлено.

### Validation

- `cd /home/dmitrii/azursystech/web && npm run build` - pass
- В build output присутствует route `/business`.

### Notes

- Scope ограничен только реализацией `/business` и обязательными task/memory updates.
- Новых архитектурных/процессных решений не вводилось; `memory_bank/decisions.md` не изменялся.

## 2026-03-14: AZR-002-012 Business Route Review Follow-up Closed

### Done

- По review был закрыт copy drift в `web/src/app/business/page.tsx`.
- Public-facing labels и описания переведены в Russian-first форму:
  - `postes de travail` -> `рабочие места`
  - `réseau local` -> `локальная сеть`
  - `imprimantes` -> `принтеры`
  - `dossiers partagés` -> `общие папки`
  - `intervention sur site` -> `выезд на место`
- Из public UI также убран marketing/internal wording в заголовке offer block.
- Структура route, CTA contract и pricing framing сохранены без изменений.

### Validation

- `cd /home/dmitrii/azursystech/web && npm run build` - pass

### Notes

- Follow-up был чисто copy-level и не менял route structure или architecture decisions.

## 2026-03-14: AZR-002-013 Home Route Implemented

### Done

- Реализован route `/home`:
  - `web/src/app/home/page.tsx`
  - структура выровнена с implementation map для home-user page:
    - hero
    - typical home-user problems
    - main services
    - prices from
    - how to request help
    - FAQ for home users
    - CTA block
- Подача страницы сделана заметно проще и спокойнее относительно `/business`:
  - без business-first/TPE framing
  - с упором на particuliers/home users
  - с не-техническим и reassuring тоном
- Сервисный scope сохранен строго в MVP-документах:
  - диагностика ПК
  - новый компьютер
  - Wi‑Fi
  - принтер
  - установка программ
  - оптимизация / апгрейд
  - простой перенос данных
- Pricing framing в публичном copy сохранен в контракте:
  - `от`
  - `зависит от объёма задачи`
- Все ключевые CTA на странице `/home` ведут на `/contact`.
- Обновлен task artifact:
  - `docs/tasklist/azr-002-tasklist.md` добавлена и закрыта задача `AZR-002-013`.
- Выполнен self-check по skill `azursystech-doc-to-ui-review`:
  - критичных/высоких/средних drift-факторов не выявлено.

### Validation

- `cd /home/dmitrii/azursystech/web && npm run build` - pass
- В build output присутствует route `/home`.

### Notes

- Scope ограничен реализацией `/home` и обязательными task/memory updates.
- Новых архитектурных/процессных решений не вводилось; `memory_bank/decisions.md` не изменялся.

## 2026-03-14: AZR-002-016 Pricing Route Implemented

### Done

- Реализован route `/pricing`:
  - `web/src/app/pricing/page.tsx`
  - страница оформлена как trust-oriented pricing entry page, а не как фиксированный прайс-каталог.
- Добавлены обязательные секции pricing route:
  - pricing hero
  - how pricing works
  - business pricing entry (до home-блока)
  - home-user pricing entry
  - what affects final cost
  - what is included / not included
  - how to request an estimate
  - final CTA block
- Pricing framing выровнен с SSOT и ограничен формулами:
  - `от`
  - `по запросу`
  - `зависит от объёма задачи`
- Все CTA на `/pricing` направлены на `/contact`.
- Visual direction для страницы выровнен с ADR-015 `Local Professional`:
  - теплый светлый фон/поверхности
  - restrained teal primary accent
  - terracotta secondary accent
  - dark slate text
  - serif-заголовки в сдержанной подаче
  - спокойная мобильная плотность
- Обновлен task artifact:
  - `docs/tasklist/azr-002-tasklist.md` добавлена и закрыта задача `AZR-002-016`.
- Выполнен self-check по skill `azursystech-doc-to-ui-review`:
  - критичных/высоких/средних drift-факторов не выявлено.

### Validation

- `cd /home/dmitrii/azursystech/web && npm run build` - pass
- В build output присутствует route `/pricing`.

### Notes

- Scope ограничен реализацией `/pricing` и обязательными task/memory updates.
- Новых архитектурных/процессных решений не вводилось; `memory_bank/decisions.md` не изменялся.

## 2026-03-14: RooCode Skills Expanded For Visual MVP Work

### Done

- В `.roo/skills/` добавлены два новых skills для текущего website stream:
  - `azursystech-route-mvp-implementation`
  - `azursystech-visual-review`
- `azursystech-route-mvp-implementation` формализует route-level workflow для MVP страниц:
  - SSOT read order
  - route extraction
  - CTA/pricing/legal constraints
  - visual baseline check
  - mandatory artifact updates
  - required build validation
- `azursystech-visual-review` формализует review против `ADR-015` и `docs/plans/azr-002-visual-direction.md`:
  - visual-system drift
  - CTA visibility
  - section density
  - mobile readability
  - avoidance of cold corporate / generic startup styling
- `memory_bank/context.md` обновлен, чтобы новый RooCode baseline был отражен в project context.

### Validation

- `find .roo/skills -maxdepth 2 -type f | sort` - pass

### Notes

- Изменения ограничены skill-layer и memory updates.
- Новых архитектурных или продуктовых решений не вводилось; `memory_bank/decisions.md` не изменялся.

## 2026-03-14: AZR-002-017 FAQ Route Implemented

### Done

- Реализован route `/faq`:
  - `web/src/app/faq/page.tsx`
  - страница оформлена как полный FAQ-маршрут MVP с required structure:
    - page intro
    - grouped FAQ list
    - final CTA block
- FAQ сгруппирован в спокойные, сканируемые блоки на основе approved source `01_brand/faq.md`:
  - общие вопросы
  - цены и формат работы
  - вопросы бизнеса / TPE
  - вопросы частных клиентов
  - первый контакт и чат
- Публичный copy сохранен Russian-first, launch-safe, без internal/dev wording и без route-path ссылок в тексте.
- Не добавлены новые/выдуманные FAQ и не добавлены новые обещания по цене, срокам, выезду или гарантиям.
- Все CTA на `/faq` направлены на `/contact`.
- Совместимость с текущим shell подтверждена:
  - header/footer уже содержат ссылку на `/faq`
  - существующие routes `/`, `/services`, `/business`, `/home`, `/pricing`, `/contact`, `/legal`, `/privacy` не изменялись.
- Обновлен task artifact:
  - `docs/tasklist/azr-002-tasklist.md` добавлена и закрыта задача `AZR-002-017`.

### Validation

- pending: `cd /home/dmitrii/azursystech/web && npm run build`

### Notes

- Новых архитектурных/процессных решений не вводилось; `memory_bank/decisions.md` не изменялся.

## 2026-03-15: AZR-002 Complete, transitioning to AZR-003

### Done

- Performed full documentation review of the `AZR-002` scope.
- Confirmed that all 25 implementation tasks in `AZR-002-tasklist.md` are closed.
- Closed `AZR-002` ticket and set `AZR-003` as the active ticket pointer.
- Updated SSOT to reflect the phase change:
  - `07_ops/task-board.md`
  - `docs/backlog.md`
  - `memory_bank/context.md`
- Separated blocked `AZR-003` go-live tasks (legal, GBP) from queued Phase 1.5 frontend improvements (`/about`, SEO landing pages).

### Next

- Prepare implementation handoff prompt for RooCode: `/about` page (Phase 1.5).
- Prepare implementation handoff prompt for RooCode: SEO landing pages (Phase 1.5).

## 2026-04-08: frontend_mvp landing pass, automation module added

### Done

- Подтвержден рабочий дизайн-контур: дальнейшие landing-итерации ведутся в `frontend_mvp`, при этом текущий production runtime/deploy path не менялся.
- В `frontend_mvp` выполнен первый структурный landing pass:
  - укорочен flow секций;
  - убраны повторяющиеся смысловые блоки;
  - сохранен business-first narrative.
- Добавлен новый модуль `Автоматизация, ИИ и полезные цифровые инструменты`:
  - новый section в `frontend_mvp/src/components/Automation.jsx`;
  - подключение в `frontend_mvp/src/App.jsx` после `Business`.
- Для модуля добавлена отдельная кодовая иллюстрация:
  - `frontend_mvp/public/automation-illustration.svg`
- В ценовом блоке добавлена отдельная строка:
  - `Автоматизация, ИИ и цифровые workflow — обсуждается`

### Validation

- `cd /home/dmitrii/azursystech/frontend_mvp && npm run build` - pass
- Vite dev server в текущей сессии больше не показывает parse errors для обновленных компонентов

### Notes

- Это content/UI pass в `frontend_mvp`; runtime, deploy, CRM и внешние интеграции не менялись.
- Решение о полном production parity `frontend_mvp` с `web` остается открытым и требует отдельного stage.
- В бизнес-секции убран вспомогательный текстовый хвост под иллюстрацией, чтобы правая колонка оставалась компактным image-only блоком.
- В hero убраны повторяющиеся нижние micro-proof строки, которые дублировали смысл заголовка и описания.
- В header добавлена навигационная ссылка на секцию `Автоматизация ИИ`.
- В пунктах секции `Автоматизация` добавлен мягкий hover-эффект с легким увеличением и выдвижением вперед.
- Заголовок automation-секции сокращен, чтобы занимать меньше строк в desktop-композиции.
- Выполнен общий copy-pass по русской версии `frontend_mvp`: упрощены формулировки, убраны смешанные англицизмы и приведены к более естественному русскому пользовательские тексты.
- Выполнен русский copy-pass по `frontend_mvp`: упрощены формулировки, убраны лишние англицизмы и заменены непонятные латинские слова в публичных текстах.
- Из landing flow убран отдельный блок `Также для дома`; публичное позиционирование стало business-first, при этом fallback для небизнесовых обращений сохранен через `Contact`, `FAQ` и footer.
- В header добавлена навигационная ссылка на раздел `FAQ`.
- В форме `Что нужно сделать` услуги перегруппированы в более крупные категории; добавлен видимый business-oriented пункт `Автоматизация и ИИ / рабочая среда для бизнеса` без изменения backend enum-контракта.
- В business-чекбоксах формы labels укрупнены и упрощены, без изменения `business_needs` payload-ключей.
- В business-части contact-формы дополнительно сокращены названия полей и select-подсказки, чтобы весь блок звучал ровнее и проще.
- В `frontend_mvp` публичный телефон и все `tel:` / `WhatsApp` ссылки обновлены на `+33 7 80 72 09 94`.
- Из левой колонки contact-формы убран дублирующий поясняющий блок про стартовые каналы и небизнесовые обращения; остались только прямые каналы связи и сама форма.
- В форме дополнительно сокращены служебные и длинные тексты: `Информация для бизнеса` -> `Параметры бизнеса`, `Что нужно для бизнеса (можно выбрать несколько)` -> `Что нужно для бизнеса`, `Автоматизация и ИИ / рабочая среда для бизнеса` -> `Автоматизация и ИИ`; из hero убрана лишняя фраза про основной фокус на бизнесе.
- Для мобильной версии добавлен компактный header-menu: иконка открывает dropdown со ссылками по секциям и быстрым переходом в WhatsApp. Chat button на мобильных уменьшен и сдвинут в более компактный след, а открытый chat panel теперь лучше укладывается по ширине экрана.
- В `Pricing` заголовок сокращен до `Понятные стартовые ориентиры`; из TPE-ветки contact-формы удален дублирующий checklist `Что нужно для бизнеса`, а `forms-spec` синхронизирован с обновленным form contract.
- В hero основной заголовок сокращен до `Техническая помощь для малого бизнеса`; хвост `без лишней бюрократии` удален для более чистого первого экрана.
- В review-ready polish pass дополнительно уменьшена плотность mobile header, chat trigger перестал спорить с hero CTA в верхнем мобильном экране, из automation-блока убрана слабая подпись под иллюстрацией, а footer снова приведен к более чистому business-first тону.
- Исправлена читаемость пунктов mobile dropdown в header: вместо `text-white/82` установлен явно читаемый стиль ссылок (`text-white`), чтобы пункты меню не пропадали на реальном экране.
- Усилен контраст legal/privacy страниц в `frontend_mvp`: карточка переведена на `bg-white`, основной текст параграфов повышен до явного `text-graphite` с более комфортным размером и межстрочным интервалом.
- Выполнен scoped sync-pass: новый номер `+33 7 80 72 09 94` обновлен в `web` runtime и актуальных SSOT/docs, без переписывания исторических progress-записей.

## 2026-04-15: AZR-003 lint-unblock pass (web)

### Done

- Убран lint-блокер `react-hooks/set-state-in-effect` в `web/src/components/chat-widget.tsx`:
  - runtime locale вычисляется в lazy initializer `useState(resolveRuntimeLocale)`;
  - добавлен безопасный guard на отсутствие `document`.
- Убран lint-блокер `@next/next/no-html-link-for-pages` в `web/src/components/shell/site-header.tsx`:
  - внутренние переходы переведены с `<a>` на `next/link`;
  - сохранено закрытие mobile-меню при click по пунктам;
  - hash-навигация сохранена для `/` и non-root.

### Validation

- `cd /home/dmitrii/azursystech/web && npm run lint` - pass
- `cd /home/dmitrii/azursystech/web && npm run check:ci` - pass

## 2026-04-15: DB SSL rollout pack prepared (no VPS execution)

### Done

- Added `scripts/postgres-ssl-rollout.sh` for safe `DATABASE_SSL_MODE` rollout with dry-run, apply, and automatic rollback on failed DB probe.
- Updated deployment docs with exact dry-run/apply commands and SSL precondition (`SHOW ssl;` must be `on` for `require`/`verify-full`).
- Added backup/restore runbook fallback note for restoring `.env` backup and restarting `app`.

### Validation

- `bash -n /home/dmitrii/azursystech/scripts/postgres-ssl-rollout.sh` - pass

### Notes

- This pass prepared the operational pack only; rollout was **not executed on VPS**.

## 2026-04-15: DB SSL rollout executed on VPS (`require`)

### Done

- PostgreSQL SSL enabled on VPS runtime (`SHOW ssl;` returned `on` after cert install + restart).
- Runtime policy switched to `DATABASE_SSL_MODE=require` in VPS `.env`.
- `docker-compose.vps.yml` wiring for `app` environment includes `DATABASE_SSL_MODE` passthrough.
- `app` was recreated and validated with in-container DB probe.

### Validation

- `docker compose -f docker-compose.vps.yml exec -T postgres ... "SHOW ssl;"` - `on`
- `docker compose -f docker-compose.vps.yml exec -T app sh -lc 'echo "DATABASE_SSL_MODE=$DATABASE_SSL_MODE"'` - `DATABASE_SSL_MODE=require`
- in-container Node/pg probe - `DB_PROBE_OK`
- `curl -sSI https://azursystech.fr/health | head -n 1` - `HTTP/2 200`

### Notes

- Current mode is `require` (TLS enforced, cert hostname chain not yet pinned as `verify-full`).

## 2026-04-15: Persistent API rate limit + production webhook allowlist guard

### Done

- Added shared helper `web/src/lib/request-rate-limit.ts`:
  - PostgreSQL-backed request counters (`api_rate_limits`) via `INSERT ... ON CONFLICT ... DO UPDATE`,
  - SHA-256 hashing of limiter keys before storage,
  - opportunistic cleanup of expired buckets,
  - bounded in-memory fallback (max keys) when DB is unavailable or not configured.
- Switched `/api/chat` and `/api/contact/submit` to persistent limiter backend while preserving existing thresholds:
  - chat: `5 requests / 60s`,
  - contact: `10 requests / 60s`.
- Tightened contact webhook config policy:
  - in production with integration enabled, `AZURSYSTECH_CONTACT_SUBMIT_ALLOWED_HOSTS` must be explicit and non-empty;
  - if missing/empty, integration is treated as misconfigured and outbound dispatch is skipped.
- Updated runtime docs/template:
  - `.env.vps.example` includes `AZURSYSTECH_CONTACT_SUBMIT_ALLOWED_HOSTS`,
  - deploy runbook documents production requirement.

### Validation

- `cd /home/dmitrii/azursystech/web && npm run check:types` - pass

### Notes

- Persistent limiter schema bootstrap is in-app (`CREATE TABLE IF NOT EXISTS api_rate_limits`), so immediate manual migration is not required for rollout.

## 2026-04-20: `/brief` cleanup and visual alignment

### Done

- Cleaned up `/brief` navigation and copy after the `/ai-automation` review:
  - removed stale `/contact` targets from the brief page flow and routed secondary contact actions to `/#contact`;
  - replaced mixed English/Russian UI wording in the brief helper and API messages;
  - softened the success copy so it confirms brief receipt without implying project acceptance.
- Visually aligned the brief page, progress, form controls, and helper panel with the calmer premium direction used on `/ai-automation`.
- Kept brief schema keys, enum values, validation rules, payload shape, and persistence behavior unchanged.

### Validation

- `git diff --check -- web/src/app/brief/page.tsx web/src/components/brief/brief-form.tsx web/src/components/brief/brief-assistant.tsx web/src/components/brief/brief-field.tsx web/src/components/brief/brief-progress.tsx web/src/app/api/brief/submit/route.ts web/src/lib/brief-assistant.ts web/src/lib/brief-submit.ts` - pass
- `cd /home/dmitrii/azursystech/web && npm run check:types` - pass
- Playwright smoke on `http://127.0.0.1:3001/brief` - pass: 1 H1, 1 form, no `/contact` href, `/#contact` present, no desktop/mobile horizontal overflow, no console errors.

### Notes

- Full `npm run build` was not run for this block.
- Valid brief submission was not executed to avoid creating a test request; success/API copy was checked statically.

## 2026-04-20: `/brief` inline field hints

### Done

- Replaced the persistent right-side `Помощник по брифу` panel with inline `?` help buttons next to brief fields.
- Added a short form note explaining that `?` opens field-specific guidance.
- Kept the future AI-assistant knowledge layer in `web/src/lib/brief-assistant.ts`, but removed the now-unused sidebar component.
- Kept schema keys, validation rules, payload shape, and persistence behavior unchanged; static field hints do not mark `ai_assist_used`.

### Validation

- `git diff --check -- web/src/components/brief/brief-form.tsx web/src/components/brief/brief-field.tsx web/src/components/brief/brief-assistant.tsx web/src/lib/brief-assistant.ts` - pass
- `cd /home/dmitrii/azursystech/web && npm run check:types` - pass
- Playwright smoke on `http://127.0.0.1:3001/brief` - pass: 1 H1, 1 form, inline `?` buttons present, first help opens, old sidebar label absent, no `/contact` href, no desktop/mobile horizontal overflow, no console errors.

### Notes

- Full `npm run build` was not run for this block.
- Real valid submit was not executed; this block only changed help UI placement.

## 2026-04-21: `/ai-automation` + footer + context sync

### Done

- Finalized the current `/ai-automation` conversion path:
  - preserved main CTA `Обсудить задачу` to `/brief`;
  - added a short clarifier that the next step is a compact brief for one process.
- Restored footer conversion continuity for the AI page:
  - added `Бриф` to footer navigation;
  - kept route-safe links for `/#business`, `/#contact`, `/pricing`, `/faq`, `/ai-automation`.
- Re-aligned global footer copy with current public positioning:
  - footer brand line now mentions both small business and private clients.
- Synced `memory_bank/context.md` with the actual current baseline:
  - `/brief` now documented as using inline `?` hints instead of the old helper sidebar;
  - page-QA notes added for `/ai-automation`, `/brief`, and the current homepage-anchor navigation baseline for `/contact` and `/business`.

### Validation

- `git diff --check -- web/src/app/ai-automation/page.tsx web/src/components/shell/site-footer.tsx memory_bank/context.md` - pass
- `cd /home/dmitrii/azursystech/web && npm run check:types` - pass
- Playwright smoke on `http://127.0.0.1:3001/ai-automation` - pass:
  - `1 H1`
  - footer contains `Бриф`
  - footer brand line reflects small business + private clients
  - brief clarifier visible near CTA
  - no desktop/mobile horizontal overflow
  - no console errors

### Notes

- Full `npm run build` was not run for this block.

## 2026-04-22: Ignore rules and model indexing exclusions cleanup

### Done

- Added local tooling/runtime noise exclusions to `.gitignore`:
  - `.cache/`
  - `.codex`
  - `.npm-cache/`
  - `.playwright-browsers/`
  - `.playwright-cli/`
  - `.qwen/`
  - `output/`
  - `web/.npm-cache/`
  - `web/test-results/`
- Extended `.codexignore` with the same local noise exclusions.
- Added model-only indexing exclusions for non-baseline context noise:
  - `frontend_mvp/`
  - `docs/reports/qwen/`
- Promoted archival directories to git-ignored status as well:
  - `frontend_mvp/`
  - `docs/reports/qwen/`

### Validation

- `git status --short` - reduced to real working untracked files only.
- Reviewed `.gitignore` and `.codexignore` to confirm that `docs/`, `memory_bank/`, and `web/src/` remain indexable.

### Notes

- `03_leads/contact-form.md` and `docs/specs/azr-003-012-frontend-mvp-parity-migration-plan.md` were intentionally not ignored because they are working project documents, not noise.

## 2026-04-22: Track active baseline and backend-intake decision docs

### Done

- Added `docs/specs/azr-003-012-frontend-mvp-parity-migration-plan.md` to the repository as an active SSOT artifact for the accepted `web` baseline after the `frontend_mvp -> web` migration closure.
- Added `03_leads/contact-form.md` to the repository as an active product/implementation artifact documenting the accepted move away from `n8n` toward backend-first intake handling.

### Validation

- Scoped docs tracking only; no runtime commands were required.

### Notes

- Both files are treated as active project context, not archival noise, so they remain visible to git and to project indexing.

## 2026-04-22: AZR-003 roadmap/tasklist sync to post-launch phase

### Done

- Updated `docs/plans/azr-003-go-live-plan.md` to mark the go-live plan as historically completed rather than still active.
- Added an explicit current-status note in the go-live plan pointing active execution to the tasklist and Memory Bank.
- Marked all six launch phases as completed in the historical go-live checklist.
- Updated `docs/tasklist/azr-003-tasklist.md` so the top execution queue reflects the real current stream:
  - page-by-page QA and cleanup of the public `web` site;
  - remaining numbered work under `AZR-003-008`;
  - CRM / HubSpot still deferred.

### Validation

- Docs-only sync pass; no runtime commands were required.
- Reviewed updated roadmap/tasklist against `memory_bank/context.md` and recent `memory_bank/progress.md` entries.

### Notes

- This pass does not create a new AZR-003 ticket family item; it only aligns planning artifacts with the already accepted current phase.

## 2026-04-22: Chat assistant CTA and prompt polish

### Done

- Tightened `/api/chat` reply shaping in `web`:
  - standardized the closing CTA around the same action pair: short site form + WhatsApp;
  - reduced repeated greeting noise by stripping leading greeting formulas from generated replies;
  - removed trailing model-generated CTA sentences before appending the canonical CTA, so endings stay consistent.
- Updated the chat system prompt:
  - asks the model not to start every answer with a greeting;
  - reinforces the desired closing action.
- Improved the security rejection message for prompt-injection attempts so it stays user-directed and preserves the same safe contact options.

### Validation

- `git diff --check -- web/src/app/api/chat/route.ts memory_bank/progress.md` - pass
- `cd /home/dmitrii/azursystech/web && npm run check:types` - pass
- Static review confirmed the updated policy path now normalizes greeting/CTA handling in one place (`ensureCta` / `normalizeReply`).

### Notes

- This pass changes backend reply-shaping only; no deploy was performed in this block.
