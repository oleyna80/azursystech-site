# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Apps

A monorepo of three independent Next.js 16 / React 19 / TypeScript / Tailwind v4 apps. Each one runs and deploys separately.

| Dir | Purpose | Dev port (convention) |
|---|---|---|
| `web/` | Main company site + intake pipeline (Telegram, web chat) | 3000 |
| `admin/` | Internal panel: auth, social posting | 3001 |
| `showcase/` | Client demo sites | 3002 |

`npm run dev` runs `next dev` without `-p` everywhere (default 3000). To run apps in parallel, set the port manually: `npm run dev -- -p 3001`.

---

## Commands

All commands run from the app directory (`cd web`, `cd admin`, `cd showcase`).

```bash
npm run dev           # dev server
npm run build         # production build
npm run lint          # ESLint
npm run check:types   # tsc --noEmit
npm run check:ci      # web: lint + test:ci + types + build + audit; admin: same without tests
```

**Tests (`web/` only):**
```bash
npm run test          # vitest watch
npm run test:ci       # vitest run (no watch)

# Single test
npx vitest run src/lib/intake/runtime.test.ts
```

**Showcase type check:**
```bash
npm run check:types   # next typegen && tsc --noEmit
```

**Deploy:**
```bash
scripts/build-push-image.sh        # build + push web image → GHCR
scripts/build-push-admin-image.sh  # build + push admin image → GHCR
./deploy-admin.sh <image:tag>      # VPS pull-deploy with rollback (admin)
```

---

## Architecture: `web/`

### Intake Pipeline

Core business logic. Multi-channel lead intake (Telegram / Web Chat / WhatsApp) with normalization, AI dialog, safety checks, and persistence.

```
Channel route (/api/telegram/webhook, /api/chat)
  → NormalizedIntakeMessage          (lib/intake/types.ts)
  → runtime.ts (safety checks, LLM, brief extraction)
  → IntakeDecision (ask_followup | mark_brief_ready | duplicate_ignored)
  → persistence.ts / sql-persistence.ts
  → outbox.ts → sender.ts           (admin Telegram notification)
```

**Key files:**
- `lib/intake/types.ts` — all types: `NormalizedIntakeMessage`, `IntakeBriefDraft`, `IntakeDecision`, `IntakeSafetyFlags`
- `lib/intake/runtime.ts` — AI engine: safety patterns, data extraction, dialog management
- `lib/intake/config.ts` — `INTAKE_SQL_ENABLED` switch (in-memory vs PostgreSQL)
- `lib/intake/sql-persistence.ts` — SQL layer (pg)
- `lib/intake/outbox.ts` — outgoing notification queue
- `lib/telegram/intake-adapter.ts` — Telegram normalization → `NormalizedIntakeMessage`
- `lib/web-chat/intake.ts` — web chat normalization
- `lib/api-security.ts` — origin validation, body size limit, rate limit helpers

**Dry-run pattern:** every external integration has a `dry-run.ts` that returns a deterministic result with no side effects. Used in tests and when `NODE_ENV !== 'production'` + header `x-azursystech-dry-run: true`.

### Routing & i18n

- `src/app/[locale]/` — localized pages (fr, ru)
- `src/i18n.js` — i18n configuration
- Non-localized routes (`/api/*`, `/health`) live outside `[locale]`

### API Routes

| Route | Description |
|---|---|
| `/api/chat` | Web chat: rate limit, prompt injection check, LLM intake |
| `/api/telegram/webhook` | Telegram webhook: HMAC verify, dry-run support |
| `/api/brief/submit` | Client brief submission |
| `/api/contact/submit` | Contact form |
| `/api/intake/outbox` | Cron-triggered outbox flush |
| `/api/auth/facebook/deauthorize` | Facebook deauthorize callback |
| `/health` | Healthcheck |

---

## Architecture: `admin/`

Modular structure: `src/modules/social/` — domain / application / repositories / policies.

- Auth: session cookie + CSRF (`lib/auth/`)
- DB: pg pool (`lib/db/pool.ts`)
- `middleware.ts` — protects all `/api/admin/*` routes
- Social posting: draft creation → scheduling (`/api/admin/social/posts/[id]/schedule`) → publishing (`/api/admin/social/posts/publish-due`) — Facebook Page via `SocialRepository`

---

## Architecture: `showcase/`

Standalone demo sites — one pattern for all demos, each self-contained.

```
app/demo/<name>/**            →  routes (layout.tsx with next/font + page.tsx per subpage)
components/<name>/**          →  components, data.ts, types.ts, *.module.css
public/demo/<name>/           →  static images
```

- New demo = new `app/demo/<name>/` + `components/<name>/` pair
- Theme = namespaced CSS custom properties per demo (`--pl-*` plomberie, `--sb-*` salon-beaute, `--bx-*` bijoux, `--mo-*` maison-olive); fonts via `next/font` in the demo layout
- Shared layer: `demo-kit/layout/DemoReturnLink.tsx` + `lib/demo-return-url.ts` (return-to-site link), `lib/types.ts`
- Demos are static: no fetch/API calls, forms are demo-only (preventDefault + local state)
- Page titles follow `<Page> — <Site> | AzurSysTech Showcase`
- Demo links from `web/` live in `web/src/lib/portfolio-data.ts` and `web/src/app/[locale]/_home-data.ts`

---

## Key Conventions

**Tests:** `web/` only, unit/integration only (vitest, node environment). Integration tests are marked `.integration.test.ts` — they require a real PostgreSQL.

**Environment variables:** config via `process.env`, no wrappers. `INTAKE_SQL_ENABLED=true` enables PostgreSQL; in-memory by default.

**Types:** strict TypeScript. `as const` for union literals (`INTAKE_CHANNELS`, `INTAKE_LOCALES`). No `any` in production code.

**API security:** `lib/api-security.ts` — every mutating route handler must call `isAllowedMutationOrigin` and `readJsonWithLimit`.

---

## SDLC & Agent Layer

The project uses an Agentic SDLC. Authoritative files:
- `AGENTS.md` — contract: stages, Hard Stops, authority model
- `.agent/ROSTER.md` — registry of 10 active skills + routing table
- `.claude/agents/` — subagent definitions (scoped-coder, verifier, reviewer, critic, solution-architect, codex-reviewer, gpt-*)

Main chat operating mode:
- The main Claude Code chat acts as Control Tower / Orchestrator.
- Use subagents for implementation, review, fixes, verification, and specialist analysis when the Work Block is non-trivial.
- Use exactly one write-capable `scoped-coder` for a given write-set.
- Reviewer, critic, verifier, GPT critic/verifier, and codex-reviewer are read-only for project files unless their agent contract explicitly allows a narrow memory/report artifact.
- The Orchestrator owns `.agent/critic-gate.md`, `.agent/verification-gate.md`, orchestrator-log updates, scope amendments, and final Owner reporting.

Hard Stops and verification gate: `.agent/critic-gate.md`, `.agent/verification-gate.md`, `.claude/hooks/`.

Claude Code local/provider settings:
- Real API keys, provider credentials, subscription tokens, and model endpoint overrides live outside the repository.
- Codex MCP may be configured globally or locally by the developer; repo-local `.mcp.json` is optional and must not contain secrets.
- If a GPT/Codex-backed subagent cannot access its MCP tool, it must report `UNVERIFIED` or `BLOCKED`, not silently fall back to direct shell invocation.
