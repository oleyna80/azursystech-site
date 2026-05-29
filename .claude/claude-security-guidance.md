# AzurSysTech — Security Review Guidance

> Loaded by the security-guidance plugin's LLM-backed reviews (end-of-turn + commit).
> Plain-language threat model and checklist. Additive only — cannot suppress built-in checks.

---

## Threat Model

**What we protect:**
- User PII from contact/brief forms (name, phone, email, city)
- Admin session integrity (HMAC-signed cookies, `sub: "owner"`)
- Telegram bot token — full send-message capability
- DeepSeek API key — cost abuse, prompt injection relay
- PostgreSQL credentials — read/write to leads/intake DB
- Scheduler secret — bypasses admin auth for cron endpoints

**Trust boundaries:**
1. Public internet → Next.js web app (untrusted)
2. Next.js web → PostgreSQL (trusted, parameterized)
3. Next.js web → Telegram API (trusted, internal only)
4. Next.js web → DeepSeek API (trusted, via chat server)
5. Admin panel → PostgreSQL (trusted, behind auth middleware)
6. VPS host → Docker containers (trusted)

**What we don't protect (out of scope):**
- DDoS / volumetric attacks (handled at infra level)
- Physical access to VPS
- Compromised npm dependencies at install time (audited separately)

---

## Review Checklist

### Auth & Session
- [ ] Every `/api/admin/*` route IS behind `middleware.ts` auth or has explicit scheduler-secret check
- [ ] Admin session token verified with `timingSafeEqual` — no `===` or `.toString()` comparison
- [ ] `ADMIN_SESSION_SECRET` and `ADMIN_SCHEDULER_SECRET` never appear in client bundles or logs
- [ ] No new auth bypass via pathname matching gaps (check `isPublicPath` exhaustive)

### Input Validation
- [ ] All form POST bodies read via `readJsonWithLimit` / `readFormDataWithLimit` — never `request.json()` directly
- [ ] Body size limits are set on every new endpoint (default 50KB for forms)
- [ ] SQL queries use `$1`, `$2` parameterized placeholders — never template literals or string concat
- [ ] URL params and query strings validated before use (type + range)

### Data Handling
- [ ] PII (name, phone, email) never logged at INFO level or above
- [ ] `customer_id`, `account_number`, `lead_id` never appear in error messages sent to client
- [ ] Telegram notification payloads trimmed to max lengths (`MAX_PROBLEM_SNIPPET_LENGTH = 180`)
- [ ] No contact data returned in GET responses without auth

### Secrets & Config
- [ ] Env vars starting with `NEXT_PUBLIC_` contain ONLY public values
- [ ] Bot tokens, API keys, DB URLs never hardcoded in source
- [ ] `.env` files gitignored (only `.env.example` committed)
- [ ] New env vars documented in `.env.example`

### API Security
- [ ] Mutation endpoints (POST/PUT/DELETE) check `isAllowedMutationOrigin` or equivalent CSRF guard
- [ ] Rate limiting applied via `isRateLimitedPersistent` on all form/chat endpoints
- [ ] CORS origins are explicit — no `*` wildcard
- [ ] Idempotency keys used for form submissions (prevent double-submit)

### Telegram Integration
- [ ] Bot token only used server-side in `telegram-notify.ts`
- [ ] Telegram API base URL validated — protocol must be `https:` (except localhost in dev)
- [ ] No user-controlled content injected into Telegram message formatting without sanitization

### Chat Server
- [ ] DeepSeek API key never exposed to client
- [ ] Request body validated: only `{ message: string }`, reject extra keys
- [ ] Rate limit: 5 req/min per IP on `/api/chat`
- [ ] Timeout set (15s) — no hanging connections
- [ ] Error responses don't leak API key, internal state, or stack traces

### Admin Panel
- [ ] Login endpoint uses timing-safe comparison for credentials
- [ ] Admin session cookie is `httpOnly`, `secure` (production), `sameSite: "strict"`
- [ ] No admin-only data rendered in public pages
- [ ] Scheduler endpoints only accessible via `x-admin-scheduler-secret` header

### Database
- [ ] PostgreSQL connections use SSL in production (`verify-full` or `require`)
- [ ] Connection pool has max size configured (avoid connection exhaustion)
- [ ] No raw SQL constructed from user input — always parameterized
- [ ] Migrations are idempotent and backwards-compatible

### Docker & Deployment
- [ ] Images built from specific `node:22-alpine` tag (not `latest`)
- [ ] `.dockerignore` excludes `.env`, `.git`, `node_modules`
- [ ] Container runs as non-root user
- [ ] Nginx proxy terminates TLS, forwards to app on internal network
- [ ] Healthcheck endpoint is public (no auth) but returns minimal info

---

## Privacy Rules

- **Do not log** at INFO+: `name`, `phone`, `email`, `city`, `problem_description`, `customer_id`
- **Log only**: `requestId`, `leadId`, `status`, `source`, `segment`, `service_type`, `integration_outcome`
- Contact form data persists only in PostgreSQL (encrypted at rest via VPS disk encryption)
- Telegram notifications contain summary only (max 180 chars of problem description)

---

## When Adding a New Route

1. Public web route: ensure no admin data leak, add rate limiting, validate CORS
2. Admin API route: verify middleware covers it, add scheduler bypass if cron-accessed
3. Webhook (3rd-party callback): validate signature/token before processing body, add idempotency
