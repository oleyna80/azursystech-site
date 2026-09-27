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

---

## Temporary WB-041 Bootstrap Operating Profile

This section exists only to keep Claude Code productive while WB-041 repairs the current control-plane hook behavior. These are **operational workarounds for known defects**, not the target architecture. Do not copy these restrictions into the final command-authority design unless the approved WB-041 specification explicitly requires them.

### Session and worktree binding

- Treat the Claude Code session as bound to the worktree from which the session was started.
- Do not attempt to rebind authority with command-local `cd`.
- For WB-041, the intended worktree is:
  `/home/azur/Projects/WSL/azursystech-wb041`
- The intended branch is:
  `fix/sdlc-control-plane-hooks-041`
- If the session root does not match the intended worktree, stop and report the mismatch rather than attempting a shell-level workaround.

### Git commands during WB-041 bootstrap

Until WB-041 changes the command-authority layer:

- Use **one direct Git invocation per Bash tool call**.
- Do not combine Git commands with `&&`, `;`, pipes, shell variables, command substitution, nested shells, or wrapper commands.
- Do not use command-local `cd` before Git.
- Prefer direct read-only commands when inspecting repository state.

Examples of acceptable bootstrap Git calls:

```bash
git status --short --branch
git rev-parse HEAD
git branch --show-current
git diff -- path/to/file
git diff --cached -- path/to/file
git show HEAD:path/to/file
```

If a normal read-only Git workflow is denied only because it is compound, treat that as evidence for the existing WB-041 command-authority defect. Do not create a new finding ID and do not weaken hooks ad hoc.

### Shell redirects

Until F-038 is repaired:

- Do not use shell redirects to `/dev/null` or other paths.
- Do not use `>/dev/null`, `2>/dev/null`, `&>/dev/null`, temporary-file redirection, or equivalent output suppression.
- Run the command directly and inspect its output instead.
- Prefer repository-aware Read/Search tools when shell output suppression would otherwise be needed.

The final WB-041 target may explicitly recognize exact `/dev/null` as a non-persistent sink. This temporary section must not be interpreted as a permanent prohibition.

### Repository reading

For specification, plan, governance, hook, and policy inspection:

- Prefer Read/Search over shell pipelines.
- Do not use shell pipelines merely to filter file content.
- Use exact file paths and focused searches.
- Read the durable audit SSOT before inventing or renumbering control-plane findings.

Durable audit SSOT:

`audit/sdlc-revision:docs/architecture/sdlc-revision-audit.md`

Relevant existing findings include F-027, F-030, F-034, F-035, F-036, F-037, F-038, and F-039. Preserve those IDs and meanings.

### WB-041 scope discipline

WB-041 is:

`Control Plane Hook Simplification & Command Authority`

Primary architectural direction:

- one shared semantic owner for supported shell grammar and command capability classification;
- restricted supported grammar rather than an incomplete POSIX shell interpreter;
- unsupported executable constructs fail closed;
- executable command structure must be distinguished from inert argument/prompt/document text;
- provider-specific Claude/Codex adapters should be thin consumers;
- hard-stop precedence remains intact;
- Maintenance Mode does not become another shell parser;
- reporting-only local coordination commit must not create publication authority;
- Stop-hook re-entrancy must not fabricate lifecycle or assurance state.

Do not silently expand WB-041 into application, deployment, production, credential, unrelated lifecycle, or WB-040 repair work.

### Known bootstrap defects are evidence, not stop reasons

During DEFINE/implementation, the following already-known bootstrap failures may recur:

- direct-single-Git restriction on compound read-only Git;
- `/dev/null` classified as an external write;
- dangerous command literals inside prompt/data classified as executable intent;
- shell parser ambiguity around substitution, grouping, comments, empty quoted words, variables, and unsupported operators;
- recursive Stop-hook pressure when assurance is intentionally pending.

When one of these occurs:

1. preserve the denial as evidence;
2. use the narrow non-bypass bootstrap form described above when one exists;
3. do not disable hooks;
4. do not use `--no-verify`;
5. do not mutate lifecycle state merely to make a command pass;
6. do not create a duplicate audit finding;
7. continue only when the operation remains within the approved WB-041 authority.

### Hard boundaries remain unchanged

This temporary profile does not authorize:

- force or non-fast-forward push;
- merge;
- deploy or release;
- protected/default branch mutation;
- credentials or secrets access;
- production/live infrastructure or data mutation;
- destructive cleanup;
- irreversible external effects;
- prohibited cross-repository writes;
- bypassing hooks or verification controls.

Owner-controlled boundaries remain Owner-controlled.

