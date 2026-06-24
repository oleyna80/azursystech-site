# Code Quality Audit Report

**Date:** 2026-05-22
**Scope:** Full repository read-only audit
**Method:** 5-domain parallel subagent review + static checks
**Artifacts:** `git status --short`, `git diff --check`, `tsc --noEmit`, `eslint`, `vitest run`, `npm run build`

---

## Executive Verdict

**Codebase is well-constructed for an MVP.** The backend shows strong security awareness (rate limiting, body-size enforcement, timing-safe crypto, origin gating). The frontend is functional but carries typical MVP debt: large monolithic page files, duplicated i18n patterns, and no error boundaries. The ops layer is well-guarded with manual deploy gates and immutable tags. No critical production-blocking security vulnerabilities were found in the deployed code — the 3 BLOCKERs are data-integrity and operational-readiness issues, not live exploits.

---

## Codebase Health Score: 🟡 YELLOW

**Green on:** backend security, API validation, Docker/CI safety, test coverage for critical paths, deploy guardrails.
**Yellow on:** frontend maintainability, i18n consistency, SQL constraint enforcement, ops configuration portability.
**No red zones** — nothing requires an emergency fix or deploy freeze.

---

## Architecture Summary

```
azursystech/
├── web/                          # Main Next.js 16 website + API
│   ├── src/app/
│   │   ├── [locale]/             # Locale-prefixed pages (fr/ru)
│   │   ├── api/                  # API routes
│   │   │   ├── brief/submit/     # Lead brief intake
│   │   │   ├── chat/             # AI chat widget (700-line handler)
│   │   │   ├── contact/submit/   # Contact form intake
│   │   │   ├── intake/outbox/    # Dry-run outbox inspector
│   │   │   ├── telegram/webhook/ # Telegram inbound receive
│   │   │   └── auth/facebook/    # Facebook deauthorize callback
│   │   ├── health/               # Public health check
│   │   ├── about|brief|business|contact|faq|legal|pricing|privacy|terms|thank-you|data-deletion|services/
│   │   └── robots.ts, sitemap.ts
│   ├── src/lib/
│   │   ├── intake/               # Multi-channel intake persistence
│   │   ├── telegram/             # Telegram adapter + sender + dry-run
│   │   ├── web-chat/             # Web chat adapter + dry-run
│   │   ├── api-security.ts       # Body limits, origin checks, rate-limit keys
│   │   ├── request-rate-limit.ts # Dual-store rate limiter (memory + PG)
│   │   ├── brief-submit.ts       # Brief validation + handoff (1728 lines)
│   │   ├── brief-assistant.ts    # AI brief field guidance
│   │   ├── contact-submit.ts     # Contact form validation
│   │   ├── telegram-notify.ts    # Telegram notification sender
│   │   └── legal-content.ts      # Legal content definitions
│   ├── src/components/           # React components (brief, chat, contact, shell)
│   ├── proxy.ts                  # CORS middleware
│   └── sql/                      # PostgreSQL migrations (3 files)
├── admin/                        # Next.js 16 admin panel
│   ├── src/app/api/auth/         # Login/logout/session
│   ├── src/app/api/admin/social/ # Social media channels + posts
│   ├── src/lib/auth/             # Session, CSRF, password, rate-limit
│   ├── src/lib/db/               # Postgres pool
│   ├── src/modules/social/       # DDD-lite: domain, application, repositories, policies
│   ├── middleware.ts              # Auth middleware (session + scheduler secret)
│   └── sql/                      # Social admin schema
├── docker-compose.vps.yml        # Production: postgres + app + admin(profile) + nginx
├── docker-compose.yml            # Local dev: app only
├── Dockerfile / Dockerfile.admin # 3-stage non-root builds with healthchecks
├── .github/workflows/            # CI, docker-publish, deploy-vps, uptime-monitor
├── scripts/                      # Deploy, backup, restore, SSL, tunnel, verify, bootstrap
├── 05_ai/                        # AI prompt templates and agent registry
├── 00_strategy – 08_showcase/    # Business/product directories
└── frontend_mvp/                 # Deprecated Vite MVP (dead code)
```

---

## Static Check Results

| Check | web/ | admin/ |
|-------|------|--------|
| `tsc --noEmit` | PASS | PASS |
| `eslint` | PASS (3 warnings: `<img>` vs `<Image/>`) | PASS |
| `vitest run` | 6 files / 21 tests PASS | N/A (no tests) |
| `npm run build` | PASS | PASS |
| `npm audit --omit=dev` | PASS (high-level only) | N/A |

---

## Main Risks

1. **Data integrity:** Missing CHECK constraints on status columns mean the DB cannot reject invalid states. TypeScript types are the only enforcement.
2. **Frontend fragility:** No error boundaries — any client component crash renders a blank page.
3. **i18n fragmentation:** Two competing systems (legacy `i18n.js` + inline page content) with no shared types or patterns.
4. **Dual-mode persistence gap:** SQL write failures in dual storage mode are silently swallowed by callers.
5. **Admin debugging blindness:** Admin DB pool wraps all errors with no original context.

---

## Findings

### BLOCKER (3)

**B1. Dual-mode SQL persistence failures silently swallowed**
- **File:** `web/src/lib/telegram/dry-run.ts:61-73`, `web/src/lib/web-chat/dry-run.ts:54-71`, `web/src/lib/intake/storage.ts:71-89`
- **Problem:** When `INTAKE_STORAGE_MODE=dual` and SQL fails, `persistIntakeDecision` returns `null` but callers never inspect the return value. Intake pipeline silently drops writes.
- **Why it matters:** Data loss is invisible during DB outages.
- **Fix:** Check return value in callers; return `{ ok: false, persistence: "unavailable" }` when null in dual mode.
- **Fix now:** Yes, before production Telegram/web-chat intake goes live.

**B2. Production secrets in plaintext on local filesystem**
- **File:** `web/.env`
- **Problem:** Live DeepSeek API key, database password, and webhook token stored in plaintext. File is gitignored but accessible to any process with filesystem access.
- **Why it matters:** Filesystem compromise = full credential leak. No rotation mechanism.
- **Fix:** Restrict to `chmod 600`, rotate all values, plan secrets manager migration.
- **Fix now:** Rotate credentials, document rotation procedure.

**B3. Sitemap missing most pages**
- **File:** `web/src/app/sitemap.ts`
- **Problem:** Only lists 2 locale pairs. Missing: `/about`, `/business`, `/contact`, `/services/*`, `/legal`, `/privacy`, `/terms`, `/faq`, `/pricing`, `/thank-you`, `/data-deletion`. `lastModified` hardcoded to `2026-05-13`.
- **Why it matters:** Search engines cannot discover most site pages. Critical SEO gap for a public website.
- **Fix:** Add all routes to sitemap, derive `lastModified` from build time or git history.
- **Fix now:** Yes, before any SEO investment.

---

### HIGH (11)

**H1. Missing CHECK constraints on status columns**
- **Files:** `web/sql/001_intake_schema.sql:9`, `web/sql/002_multi_channel_intake_foundation.sql:8,9,11,13`
- **Problem:** `intake_leads.status`, `intake_channel_conversations.status|brief_status|admin_notification_status|sheets_mirror_status` accept any text value. TypeScript types define specific enums but DB has no enforcement.
- **Fix:** Add CHECK constraints via idempotent DO-block migration (follow `003_` pattern).

**H2. Admin DB pool swallows all error context**
- **File:** `admin/src/lib/db/pool.ts:73-77,81-97`
- **Problem:** `catch { throw new AdminDbError() }` — no original message, no cause, no stack trace. Original constraint violation / timeout / syntax error is completely lost.
- **Why it matters:** Admin project is near-undebuggable in production.
- **Fix:** Preserve original error message: `throw new AdminDbError(msg, { cause: error })`.

**H3. Build-push scripts lack docker login**
- **Files:** `scripts/build-push-image.sh`, `scripts/build-push-admin-image.sh`
- **Problem:** No `docker login` step before `docker buildx build --push`. Fail silently if GHCR credentials are expired or missing.
- **Fix:** Add credential check + `docker login ghcr.io` step.

**H4. Admin login rate-limit trusts X-Forwarded-For unconditionally**
- **File:** `admin/src/lib/auth/rate-limit.ts:27-31`
- **Problem:** Reads `x-forwarded-for` / `x-real-ip` directly without proxy trust check. Attacker can spoof IP per-request, bypassing 8-attempt/15min window.
- **Fix:** Apply `AZURSYSTECH_TRUST_PROXY_HEADERS` gate (matching `api-security.ts` pattern).

**H5. Telegram webhook secret uses non-timing-safe comparison**
- **File:** `web/src/app/api/telegram/webhook/route.ts:62-64`
- **Problem:** `===` comparison on shared secret. Attacker with timing measurements can deduce secret character-by-character.
- **Fix:** Replace with `crypto.timingSafeEqual` (helper already exists in `admin/src/lib/auth/csrf.ts`).

**H6. Two competing i18n systems**
- **Files:** `web/src/i18n.js` (legacy dictionary, 1100+ lines) vs inline `CONTENT = { fr: {...}, ru: {...} }` in every page
- **Problem:** `i18n.js` holds translations for navbar/footer/legal but pages ignore it. Each page defines its own bilingual content. English locale shipped but unreachable.
- **Fix:** Unify on one strategy. Either adopt next-intl/react-i18next or remove dead `i18n.js` dictionary.

**H7. No error boundaries anywhere**
- **Files:** All client components — `chat-widget.tsx`, `contact-page-client.tsx`, `brief-form.tsx`, `site-header.tsx`, etc.
- **Problem:** Any client-side render error → blank white page. No `error.tsx` at app root.
- **Fix:** Add global `error.tsx` + wrap interactive components in `ErrorBoundary`.

**H8. Duplicate contact form implementations**
- **Files:** `home-contact.tsx` (459 lines), `contact-page-client.tsx` (674 lines)
- **Problem:** Both POST to `/api/contact/submit` with different field layouts, honeypot strategies, and error handling. Full logic duplication.
- **Fix:** Extract `useContactForm` hook; keep only rendering differences in components.

**H9. Massively oversized page files**
- **Files:** `[locale]/ai-automation/page.tsx` (837 lines), `ai-automation/page.tsx` (821 lines), `faq/page.tsx` (523 lines), `terms/page.tsx` (504 lines), `pricing/page.tsx` (475 lines)
- **Problem:** Content data + JSX + JSON-LD + helper components all in one file. Inline helpers (`Label`, `CaseIcon`, `ShieldIcon`) duplicated between locale-param and cookie-based versions.
- **Fix:** Split into content file + shared components + page composition.

**H10. Two nearly-identical ai-automation pages**
- **Files:** `[locale]/ai-automation/page.tsx`, `ai-automation/page.tsx`
- **Problem:** ~1650 lines of duplicated code. Identical helper components defined twice.
- **Fix:** Consolidate into single shared component accepting locale as prop.

**H11. Chat route handler is monolithic (700+ lines)**
- **File:** `web/src/app/api/chat/route.ts`
- **Problem:** 30+ helper functions, CTA enforcement, commitment detection, ambiguity guardrails all inline. Safety logic untestable without importing Next.js route handler.
- **Fix:** Extract to `@/lib/chat/safety.ts` and `@/lib/chat/guardrails.ts`.

---

### MEDIUM (18)

1. **Deploy healthcheck depends on external URL** — `deploy.sh:77`, `deploy-admin.sh:72`. DNS/proxy failure triggers unnecessary rollback. Check container health internally first.
2. **DATABASE_URL lacks `:?` validation in compose** — `docker-compose.vps.yml:60,94`. Unset var passes empty string silently.
3. **Admin deploy unnecessarily restarts nginx** — `deploy-admin.sh:67-68`. Pulls/restarts `web` (nginx) container during admin-only deploy.
4. **Hardcoded VPS IP in scripts** — `vps-db-tunnel.sh`, `vps-ghcr-login.sh`. Infrastructure addresses committed to repo. Extract to env vars.
5. **Tag format mismatch** — WSL scripts generate `sha-<12hex>-<timestamp>`, CI/CD requires `^sha-[0-9a-f]{40}$`. Incompatible tag formats.
6. **No active alert channel in uptime monitor** — `uptime-monitor.yml`. Only passive GitHub issue; no Slack/Telegram/PagerDuty webhook configured.
7. **Missing UNIQUE on decisions.idempotency_key** — `002_multi_channel_intake_foundation.sql:62`. Messages table has UNIQUE, decisions does not.
8. **`normalized_payload` JSONB duplicates column data** — `sql-persistence.ts:437-438`. Redundant snapshot of values already in dedicated columns.
9. **`intake_channel_messages.role` no CHECK constraint** — `002_multi_channel_intake_foundation.sql:41`. Migration 003 added CHECK for direction/author_type/status but not role.
10. **Admin pool max hard-capped at 2** — `admin/src/lib/db/pool.ts:15-21`. `ADMIN_DB_POOL_MAX` env var is misleading; pool never exceeds 2.
11. **Dry-run catches errors too broadly** — `telegram/dry-run.ts:44-57`, `web-chat/dry-run.ts:37-50`. All errors reported as "persistence unavailable" masking programming bugs.
12. **`storage.ts` and `outbox.ts` duplicate gating logic** — Same lazy-store-init, mode-check, error-logging pattern in two files with no shared base.
13. **`lead_id` FK never set** — `002_multi_channel_intake_foundation.sql:15`. Column exists with FK constraint but application never populates it.
14. **Idempotency lookup fetches up to 100 keys per message** — `sql-persistence.ts:162-171`. O(n) client-side search on every message. Use targeted WHERE clause.
15. **Rate-limit key uses spoofable headers in non-proxy mode** — `api-security.ts:72-74`. `user-agent` + `accept-language` trivially randomized by attacker.
16. **Session verification duplicated** — `admin/middleware.ts:85-123` vs `admin/src/lib/auth/session.ts:71-106`. Two independent implementations of same crypto logic.
17. **Plaintext password in runtime config** — `admin/src/lib/auth/config.ts:43,70-82`. `ADMIN_PASSWORD` flows through config object even after hash is computed.
18. **`publish-due` route always dry-run** — `admin/.../publish-due/route.ts`. Named as publish action, registered in SCHEDULER_PATHS, but hardcoded `dryRun: true`.

---

### LOW (20)

1. `admin/.../schedule/route.ts` — `scheduledAt` validated only as `typeof string`, no ISO 8601 check
2. `admin/.../channels/route.ts`, `posts/route.ts` — No body-size limit on POST
3. `web/.../contact/submit/route.ts` — Sequential awaits (DB, webhook, Telegram) cascade latency
4. `admin/.../rate-limit.ts` — In-memory Map has no size bound
5. `admin/.../config.ts` — Session TTL has no maximum cap
6. `webhook/route.ts`, `deauthorize/route.ts` — No rate limiting on webhook endpoints
7. Admin CSRF cookie `httpOnly: false` — Accepted double-submit pattern trade-off; document dependency on strict CSP
8. 11 identical locale type aliases (`FaqLocale`, `LegalLocale`, etc.) across pages
9. 8 identical `resolveXxxLocale` functions across pages
10. `i18n.js` is `.js` in TypeScript project — no type safety for translation keys
11. Dead English locale (~350 lines) shipped but unreachable from UI
12. `useSyncExternalStore` with no-op subscribe in chat-widget
13. Competing `useEffect` hooks for locale state in `SiteHeader`
14. `getPageMeta` matches only `/legal` and `/privacy` — everything else gets home metadata
15. `frontend_mvp/` directory is deprecated dead code
16. Hardcoded date in sitemap (`new Date("2026-05-13")`)
17. Migration 003 backfill UPDATE runs unconditionally on every deploy
18. `createFakeIntakeOutboundSender` test utility shipped in production code
19. `dedupe_key` has index but no UNIQUE constraint — misleading name
20. `social_publish_jobs` UNION ALL pattern fragile without ORDER BY

---

## Spaghetti-Code Hotspots

1. **`web/src/app/api/chat/route.ts`** — 700 lines: HTTP handling + AI prompting + safety guardrails + CTA enforcement + commitment detection + ambiguity resolution. The most complex file in the repo.
2. **`web/src/app/[locale]/ai-automation/page.tsx` + `web/src/app/ai-automation/page.tsx`** — 1658 lines of near-duplicate code. Content + rendering + JSON-LD + helpers all inline.
3. **`web/src/app/faq/page.tsx`, `terms/page.tsx`, `pricing/page.tsx`** — 475-523 lines each. Pattern: inline bilingual data + JSX + metadata.
4. **`web/src/components/contact/contact-page-client.tsx` + `web/src/components/sections/home-contact.tsx`** — 1133 lines total. Two independent implementations of the same API call.
5. **`web/src/i18n.js`** — 1100+ lines of dictionaries that pages mostly ignore. Dead English locale.

---

## AI-Generated-Pattern Risks

1. **Per-page locale type aliases** — Classic copypaste pattern: each file gets its own `type XxxLocale = "fr" | "ru"` and `resolveXxxLocale()` function. 11+ instances.
2. **Inline helper components in page files** — `Label`, `CaseIcon`, `ShieldIcon`, `HeroAnchors`, `MethodPanel` defined identically inside two ai-automation page files instead of in `components/`.
3. **`normalized_payload` JSONB column** — Stores a full-text snapshot of values already in dedicated columns. Common AI pattern: "save everything just in case."
4. **`lead_id` FK with no writer** — Forward-looking schema column that nothing populates. AI tendency to model future state.
5. **`AdminDbError` with no cause** — Generic wrapper that discards information. Pattern of "wrap everything" without preserving context.
6. **Defensive `|| true` in rollback paths** — `deploy-admin.sh:89`. Silently swallows pull errors during rollback.
7. **UNION ALL fallback pattern** — `social-repository.ts:352-376`. Clever CTE that works but is fragile without ORDER BY.

---

## API Design Review

**Well-designed:**
- Consistent structured responses: `{ ok, error/message }` or `{ success, message, issues }`
- Appropriate HTTP status codes (400/401/403/404/413/429/503)
- Streaming body-size enforcement (no buffering into memory)
- Rate limiting on all public mutation endpoints
- CORS origin gating on all public routes
- Timing-safe comparisons for crypto verifications

**Needs attention:**
- `/api/chat/route.ts` is monolithic — extract safety/guardrail logic
- `/api/admin/social/posts/publish-due` — misleading name (always dry-run)
- Admin routes lack body-size limits (Next.js platform constrains this but explicit limits are consistent)
- No rate limiting on webhook/deauthorize endpoints
- Contact submit chains 3 sequential async operations (DB + webhook + Telegram)

---

## Persistence/Schema Review

**Well-designed:**
- Idempotent migrations: `IF NOT EXISTS` / `IF EXISTS` guards
- Idempotency keys on messages with UNIQUE constraint
- Unified timeline model: `intake_channel_messages` as single message history
- DO-block pattern for safe constraint addition in migration 003
- SQL injection prevention: parameterized queries throughout

**Needs attention:**
- 5 status columns with no CHECK constraints (BLOCKER-level data integrity gap)
- `intake_channel_decisions.idempotency_key` — no UNIQUE
- `normalized_payload` JSONB redundancy
- `lead_id` FK dead column
- Batch idempotency lookup scales poorly with conversation history
- Dual `storage.ts` / `outbox.ts` gating pattern duplication

---

## Security Boundary Review

**Well-designed:**
- Separate Telegram gates: receive, registration, and send use independent env flags
- Admin auth: session + CSRF double-submit pattern with strict CSP
- Scheduler auth: shared-secret header with timing-safe comparison
- Facebook deauthorize: HMAC-SHA256 signed_request verification
- CSP headers in production (both web and admin)
- Non-root Docker runtime
- Manual deploy gates (workflow_dispatch only, no auto-deploy triggers)

**Needs attention:**
- Telegram webhook secret comparison is not timing-safe (HIGH)
- Admin login rate-limiter trusts X-Forwarded-For unconditionally (HIGH)
- Plaintext password in runtime config object (MEDIUM)
- Rate-limit key uses spoofable headers when proxy trust disabled (MEDIUM)
- Duplicated session verification code paths (MEDIUM)
- No rate limiting on webhook endpoints (LOW)
- In-memory rate-limit Map unbounded (LOW)
- Session TTL unlimited (LOW)

---

## Deploy/Ops Review

**Well-designed:**
- 3-stage Docker builds with non-root runtime
- Immutable SHA-based image tags
- CI gate before Docker publish
- Manual deploy triggers with tag format validation
- Rollback on failure with previous-image capture
- `.env` backup before modification
- Postgres SSL rollout with dry-run, probe, and auto-rollback

**Needs attention:**
- Deploy healthcheck depends on external URL → internal check first
- `DATABASE_URL` in compose lacks `:?` validation
- Admin deploy unnecessarily touches nginx container
- `build-push-image.sh` has no docker login — incompatible with CI/CD
- Tag format mismatch between WSL scripts and GitHub deploy workflow
- Hardcoded VPS IP and SSH key paths in tunnel/GHCR-login scripts
- Uptime monitor has no active notification channel
- Stale verify-image tag in `vps-ghcr-login.sh`

---

## What Not to Change

- **`i18n.js` dictionary** — Don't delete yet. It powers navbar/footer/chat translations. Remove only after unifying on a single i18n strategy.
- **`intake_channel_conversations` table design** — Acceptable MVP schema conflation. Decompose only when a domain (e.g., sheets mirror) needs independent lifecycle.
- **`brief-submit.ts` (1728 lines)** — Large but primarily locale data. Extract data to JSON when adding a third locale, not before.
- **Two separate DB pool modules** — web and admin are separate apps; independent configs are correct.
- **`frontend_mvp/` directory** — Archive/remove when convenient, not urgent.
- **`<img>` vs `<Image/>` lint warnings** — 3 instances in `[locale]/page.tsx`. Fix when touching that file; not a separate PR.

---

## Recommended Action Plan

### Phase 1: Must Fix (before production Telegram/web-chat intake goes live)

| # | Finding | Severity | Effort |
|---|---------|----------|--------|
| 1 | Fix dual-mode SQL failures silently swallowed (B1) | BLOCKER | Small |
| 2 | Rotate plaintext credentials in `web/.env` (B2) | BLOCKER | Small |
| 3 | Complete sitemap with all routes (B3) | BLOCKER | Small |
| 4 | Add CHECK constraints to status columns (H1) | HIGH | Medium |
| 5 | Preserve error context in AdminDbError (H2) | HIGH | Small |
| 6 | Fix timing-safe webhook secret comparison (H5) | HIGH | Small |
| 7 | Fix admin login rate-limit IP spoofing (H4) | HIGH | Small |

### Phase 2: Cleanup (before adding pages or locales)

| # | Finding | Severity | Effort |
|---|---------|----------|--------|
| 8 | Add error boundaries (H7) | HIGH | Medium |
| 9 | Extract chat route safety/guardrail logic (H11) | HIGH | Large |
| 10 | Unify i18n strategy — pick one (H6) | HIGH | Large |
| 11 | Consolidate ai-automation pages (H10) | HIGH | Medium |
| 12 | Extract shared contact form hook (H8) | HIGH | Medium |
| 13 | Split oversized page files (H9) | HIGH | Large |
| 14 | Add docker login to build-push scripts (H3) | HIGH | Small |
| 15 | Decouple deploy healthcheck from external URL | MEDIUM | Small |
| 16 | Fix DATABASE_URL `:?` in compose | MEDIUM | Small |
| 17 | Add UNIQUE on decisions.idempotency_key | MEDIUM | Small |
| 18 | Fix admin deploy nginx restart | MEDIUM | Small |
| 19 | Add uptime alert notification channel | MEDIUM | Small |
| 20 | Remove `normalized_payload` or document purpose | MEDIUM | Small |
| 21 | Extract hardcoded VPS config to env vars | MEDIUM | Small |
| 22 | Shared locale type + resolve function | MEDIUM | Small |

### Phase 3: Optional Refactor (when convenient)

| # | Finding | Severity | Effort |
|---|---------|----------|--------|
| 23 | Extract shared store-access pattern (storage/outbox) | MEDIUM | Medium |
| 24 | Add body-size limits to admin routes | LOW | Small |
| 25 | Add ISO 8601 validation to schedule route | LOW | Small |
| 26 | Add rate limiting to webhook endpoints | LOW | Small |
| 27 | Cap admin rate-limit Map size | LOW | Small |
| 28 | Cap session TTL maximum | LOW | Small |
| 29 | Remove `frontend_mvp/` dead code | LOW | Small |
| 30 | Rename `i18n.js` → `i18n.ts` with types | LOW | Medium |
| 31 | Remove dead English locale or enable it | LOW | Small |
| 32 | Fix sitemap hardcoded date | LOW | Small |
| 33 | Remove redundant backfill UPDATE from migration 003 | LOW | Small |

---

## Final Recommendation

**Do not rewrite.** The codebase is solid for its stage. The issues found are concentrated in three areas:
1. **Data integrity** (CHECK constraints, dual-mode error swallowing)
2. **Frontend maintainability** (monolithic pages, duplicated i18n, no error boundaries)
3. **Ops portability** (hardcoded configs, tag format mismatch)

Fix Phase 1 items (7 findings, ~2-3 days) before routing production Telegram/web-chat traffic. Phase 2 cleanup (15 findings, ~1-2 weeks) should happen before adding a third locale or more than ~3 new pages. Phase 3 is low-priority polish.

The backend API layer and security model are the strongest parts of the codebase — continue the current patterns there. The deploy/ops tooling is well-guarded but needs configuration portability work.
