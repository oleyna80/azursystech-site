# SDD Protocol — Stage-Driven Development

> Workflow protocol for AzurSysTech multi-agent execution.
> Defines stage transitions, handoff rules, verification tiers, and autonomous execution policy.

---

## Overview

SDD (Stage-Driven Development) structures agent work into discrete, verifiable stages.
The orchestrator runs the full stage chain autonomously after plan approval.
This protocol implements the Agentic SDLC process model defined in `AGENTS.md`.

**Standard pipeline**: 4 stages.
**Quick-fix pipeline**: abbreviated flow for trivial changes.

**Discussion path**: answer/decide/recommend only; no file lifecycle unless the
turn becomes actionable implementation.

## Execution Topology

Control Tower chooses the execution topology during Stage 0:

- `Control Tower only` — trivial/local work where delegation would add overhead.
- `Control Tower + read-only subagents` — audits, research, review, verification,
  large inspections, or parallel analysis.
- `Control Tower + one Coder subagent` — implementation with a clear write-set.

Stage 0 must classify topology as one of:

- `Subagent-Required`
- `Subagent-Optional`
- `Control-Tower-Only`

For every non-trivial Work Block, Stage 0 must produce a visible Routing
Preflight before any edit/write-capable tool is used:

- Work Block type
- Side-effect class
- DB action mode
- Skill Routing Gate result
- Subagent Topology classification and dispatch/skip decision
- Hard Stops in scope
- `Write gate: READY` or `Write gate: BLOCKED`

If the preflight is missing, incomplete, or `BLOCKED`, no implementation,
documentation edit, staging, commit, push, deploy, DB, env/secret, or
client-facing action may proceed. The active tasklist is preferred for
ticketed work; otherwise use the Work Block template or an inline Stage 0
summary for short-lived local work.

A Work Block is `Subagent-Required` when any trigger in
`AGENTS.md -> Multi-Agent Default` applies. For those Work Blocks, Owner
approval of the Work Block explicitly authorizes scoped read-only Reviewer,
Verifier, or Analyst subagents inside the approved scope. The Orchestrator must
either dispatch scoped subagents or record an allowed skip reason:
`trivial`, `blocked`, `hard-stop`, or `user-disabled`.

When the skip reason is `blocked`, Control Tower must record the concrete
blocker category: `tool-unavailable`, `thread-limit`, `usage-limit`,
`model-unavailable`, `sandbox`, or `other`. It must then run the narrowest safe
inline Reviewer/Verifier fallback, label the verdict
`review-degraded:inline-fallback`, and add a follow-up for an external or
subagent re-review before commit/push when the Work Block touches security,
runtime, DB, deploy, auth, webhooks, provider integrations, or 4+ files.
Fallback review does not expand write authority and never bypasses Hard Stops.

Default to subagents when they improve speed, quality, or context hygiene. Do
not keep bulk review, broad implementation, or independent verification in the
main chat when a scoped subagent can handle it safely. The Owner does not
approve internal handoffs after the Work Block is approved; stop only for
`AGENTS.md` Hard Stops or a `BLOCKED` verifier verdict.

For non-trivial delegated work, Control Tower should use
`subagent-mission-brief` to define base role, temporary mission role, scope,
tools, write-set, hard stops, expected output, and handoff target. This is
delegation guidance, not a new workflow stage.

For `Subagent-Required` and otherwise non-trivial Work Blocks, Control Tower
records a compact Parallel Decomposition Matrix before dispatching
implementation or review:

| Stream | Goal | Role | Write-set | Dependencies | Verification | Execution | Reason |
|---|---|---|---|---|---|---|---|
| Example | Backend review | Reviewer / Backend Analyst | none | none | AC + diff | parallel | independent |

`Execution` is `parallel`, `sequential`, or `local`. If a stream is sequential
or local, state the concrete reason: write conflict, dependency chain, shared
runtime/resource, uncertain scope, hard-stop boundary, or no delegation value.
Returned subagent output is evidence, not acceptance; Control Tower accepts it
only after checking scope, AC coverage, and required verification evidence.

---

## Optional Pre-SDD Architecture Discovery

Before Stage 0, Control Tower may invoke `architecture-discovery` for new projects,
major modules, integrations, stack selection, DB/API design, security-sensitive
architecture, large refactors, or unclear technical direction.

For complex or unfamiliar work not covered by local skills, Control Tower may
also perform External Skill Discovery under `AGENTS.md -> Skill Index`. Treat
public/vendor skills and playbooks as research input only: vet the source and
adapt useful parts locally before they influence implementation.

Skip it for small/local tasks and tasks with an already approved implementation plan.
When used, produce an Architecture Brief from
`docs/templates/architecture-brief-template.md`, then hand off to Stage 0.

---

## Optional Agent Operations Review

After a large Work Block, sprint closeout, repeated approval waits, sandbox
failures, or subagent/tooling incident, Control Tower may invoke
`agent-operations-review`.

This is sanitized and synchronized by default. It may recommend allowlist,
skill, mission-brief, or workflow changes, but it must not read or commit raw
private transcripts by default, change permissions automatically, or weaken
`AGENTS.md` Hard Stops.

---

## Standard Pipeline (4 stages)

### Stage 0 · Plan & Discover

**Owner**: Control Tower
**Input**: Owner request or active ticket from `docs/tasklist/`
**Actions**:
1. Read `AGENTS.md`, `memory_bank/context.md`, `memory_bank/progress.md`, `memory_bank/decisions.md`.
2. Run Skill Routing Gate from `AGENTS.md`.
3. Read relevant spec from `docs/specs/` or `docs/plans/`.
4. Read all SSOT files in scope (relevant code, schemas, routes).
5. Identify gaps, conflicts, missing preconditions.
6. Classify execution topology as `Subagent-Required`, `Subagent-Optional`, or
   `Control-Tower-Only`; record subagent assignments or an allowed skip reason.
7. For non-trivial work, record `Write gate: READY` only after Skill Routing
   Gate, topology, side-effect class, DB action mode, and Hard Stops are known.
8. For `Subagent-Required` or otherwise non-trivial work, produce the Parallel
   Decomposition Matrix.
9. Produce: ticket scope, write-set, AC per task, agent assignments.
10. Assign **verification tier** (see § Verification Tiers below).
11. Confirm hard stop conditions in scope.

Use `AGENTS.md` → SSOT Hierarchy for current status. Active task status comes
from `docs/tasklist/<ticket>.tasklist.md`; plans and reports are not live status
unless explicitly synced there.

**Success condition**: Routing Preflight is visible and `READY`; plan document
exists with scope, write-set, AC, verification tier, agent assignments. Gaps documented.
**Next stage**: Stage 1 · Implement (auto-proceed, no pause)
**Hard stop**: If scope contains any `AGENTS.md` Hard Stop condition, confirm with Owner.

---

### Stage 1 · Implement

**Owner**: Scoped Coder
**Input**: Approved write-set + verification tier from Stage 0
**Actions**:
1. Implement only the approved write-set. No scope expansion.
2. Run validation checks per the assigned verification tier (see § Check Suite).
3. Document risks and skipped checks with reason.
4. Report implementer status (see § Implementer Status Protocol).

**Implementer status**:
- `DONE` — proceed to Verify.
- `DONE_WITH_CONCERNS` — completed, but flagged doubts. Orchestrator reads concerns before proceeding. If correctness/scope issue → address first. If observation → note and proceed.
- `NEEDS_CONTEXT` — missing information. Orchestrator provides context, re-dispatch.
- `BLOCKED` — cannot complete. Assess: context problem → re-dispatch with more context. Task too large → split. Plan wrong → escalate to Owner.

**Success condition**: All write-set files changed, tier-appropriate checks pass or skipped with documented reason.
**Next stage**: Stage 2 · Verify (auto-proceed on DONE or DONE_WITH_CONCERNS)
**Hard stop**: Never stop to ask about implementation details — make a decision, document it, move on.

---

### Stage 2 · Verify

**Owner**: Verifier
**Input**: Implementation diff + AC + verification tier from Stage 0

**Two-stage review** (catches different error classes):

**Stage 2a · Spec Compliance** — Does the code match the plan?
1. Check each AC criterion against implementation.
2. Verify write-set scope: nothing extra, nothing missing.
3. For non-trivial Work Blocks, confirm Stage 0 Routing Preflight existed and
   `Write gate: READY` was recorded before edit/write actions.
4. Verdict: `SPEC_OK` / `SPEC_GAPS` (list gaps).

**Stage 2b · Code Quality** (only after SPEC_OK) — Is the code well-built?
1. Run tier-appropriate check suite (Lite / Standard / Full).
2. Review for regressions, security, edge cases.
3. Enforce `AGENTS.md § Production Maintainability Standard`: local patterns,
   minimal justified abstractions, readable naming, explicit side effects,
   bounded data flow/failure modes, no prompt-shaped boilerplate, and targeted
   checks for the changed contract.
4. Return final verdict: `APPROVED` / `NEEDS_CHANGES` / `BLOCKED`.

> Do NOT start code quality review before spec compliance passes.

**Success condition**: Verdict `APPROVED` issued.
**Next stage**: Stage 3 · Sync & Report (auto-proceed on APPROVED)
**Hard stop**: `BLOCKED` verdict → report to Owner and halt pipeline.
**On NEEDS_CHANGES**: loop back to Stage 1 once, then escalate if still failing.

### External Reviewer Inputs

External audits and reviewer reports are treated as Stage 0 evidence, not as an
acceptance verdict. Before acting on them:

1. Confirm the report's scope against the live tree.
2. Mark each finding `confirmed`, `partially confirmed`, `stale/resolved`,
   `rejected`, or `needs-more-proof`.
3. Convert confirmed findings into scoped Work Blocks with write-set,
   verification tier, and Hard Stops.
4. Re-run local verification after fixes; external approval alone is not enough.

For external Claude Code or similar runs, create a task file first with scope,
read set, out-of-scope actions, read-only/write permission, forbidden side
effects, and required output format.

---

### Stage 3 · Sync & Report

**Owner**: Control Tower (SSOT Sync Closeout skill)
**Input**: Verified implementation
**Actions**:
1. Update `memory_bank/progress.md` with done/checks/risks entry.
2. Update `memory_bank/context.md` with new focus and next step.
3. Update `memory_bank/decisions.md` if an architectural/runtime decision was made.
4. Update relevant `docs/tasklist/` delivery notes.
5. Run `rg` scan for contradictory stale formulations.
6. Verify workflow SSOT sync status with `git check-ignore -v`: normal
   workflow docs should be tracked/synchronized; ignored files need an explicit
   reason such as secrets, private transcripts, logs, caches, or machine state.
7. Produce owner report:
   - Summary of all stages completed
   - Files changed (list)
   - Checks run and results
   - Residual risks
   - Next recommended action

Reports in `docs/reports/*` are immutable evidence snapshots. They must not be
treated as current task status unless the active tasklist confirms the same state.

If ignored SSOT was changed, the owner report must state why it remains local
only and what synchronized file carries the durable project context.

**Success condition**: Memory bank updated, no stale contradictions, report delivered.
**Hard stop**: None.

---

## Quick-Fix Pipeline

For trivial changes that don't touch routes, schemas, APIs, DB/storage/runtime,
deploy/env/config, or security-sensitive code.

### Entry criteria (ALL must be true)
- Write-set ≤ 3 files
- No route/schema/API/DB/storage/runtime/deploy/env/config/security changes
- No new dependencies
- Owner tags task as "quick-fix" or change is clearly trivial

### Flow
```
Implement (Lite checks) → Inline sync (one-line progress entry) → Done
```

Skip Plan & Discover. Skip full Verify. No separate report — inline summary suffices.

### Guardrails
- If during implementation the change turns out to be non-trivial → **escalate to Standard pipeline**.
- Quick-fix never applies to: production deploy, DB migration, credential changes, new API endpoints.
- Quick-fix is prohibited for these paths/classes:
  - SQL and schema files: `*.sql`, `web/sql/*`
  - env/secret/config boundaries: `.env*`, `*.env*`, `docker-compose*`
  - deploy/runtime ops: deploy scripts, VPS/runtime configuration
  - API routes/endpoints: `web/src/app/api/**`
  - auth, security, rate limiting, proxy, DB, storage, persistence, or runtime modules
- If path sensitivity is unclear, use Standard pipeline.

---

## Discussion / Decision Path

Use for short questions, tradeoff discussion, process feedback, or decisions
that do not require file edits.

Flow:
```
Answer or recommend → note risks/next action → Done
```

Do not run the full SDD lifecycle for discussion-only turns. If the discussion
turns into file changes, switch to Quick-fix or Standard based on scope and risk.

---

## Verification Tiers

Assigned in Stage 0 based on the write-set scope.

| Tier | When | Checks (see § Check Suite) |
|---|---|---|
| **Lite** | docs-only, config, comments, typos, README | `git diff --check` |
| **Standard** | web/admin code changes, no new route/schema | `check:types` + `lint` + `build` |
| **Full** | new route, schema change, API contract, security, UI | Full contract-verifier 6-point checklist |
| **Deploy** | any VPS/Docker push, env var changes, compose changes | Standard + `deploy-readiness-gate` + `compose-preflight` + runtime smoke (see § Deploy Tier) |

Security-sensitive Work Blocks must use Tier Full unless Stage 0 records why a
narrower tier is sufficient. If the Work Block changes auth, admin routes,
webhooks, external-provider integration, client-facing sends, storage/schema,
security headers, file/path handling, redirects, or payment/order flow, Stage 0
must include a STRIDE-lite note or an explicit `threat-model-not-needed`
rationale.

The Deploy tier applies when the write-set or Work Block includes:
- `docker-compose.vps.yml` or `.env.vps.example` changes
- Docker image build/push
- `deploy.sh` execution
- VPS env var additions

The Deploy tier is additive to Standard/Full — code checks still apply to code changes.

### Check Suite Reference

#### Tier Lite
```bash
git diff --check
```

For workflow docs, `git status` and `git diff --stat` are not enough to prove
sync status. Verify with direct section inspection plus:
```bash
git check-ignore -v <changed workflow-doc paths>
```

#### Tier Standard
```bash
git diff --check
cd web && npm run check:types        # or cd admin && npm run check:ci
cd web && npx eslint <changed files>
cd web && npm run build
```

#### Tier Full
All of Standard, plus:
```bash
npm audit --omit=dev
# API smoke: one valid + one negative payload per changed endpoint
# Browser smoke: mobile (~390px) + desktop (~1365px)
# Contract-verifier 6-point checklist (schema/UI/API/assistant/payload/SSOT)
```

Security-sensitive Tier Full also requires this review checklist to be answered
in the verifier closeout:

- SQL uses parameterized queries; no query string interpolation from
  attacker-controlled input.
- No `dangerouslySetInnerHTML` without explicit sanitization.
- No `eval`, `new Function`, shell command construction, or dynamic execution
  from attacker-controlled input.
- No `Math.random()` for secrets, tokens, session IDs, CSRF, idempotency keys,
  or security-sensitive identifiers.
- Mutation endpoints have CSRF, origin validation, webhook secret, scheduler
  secret, or an equivalent guard.
- Redirect URLs and file/path parameters are fixed, normalized, or allowlisted.
- Error responses do not expose stack traces, SQL/provider messages, internal
  paths, secrets, or credential names with values.
- Logs do not include tokens, passwords, API keys, `DATABASE_URL`, full
  headers, full bodies, connection strings, row payloads, or client-private
  message bodies.
- Browser apps preserve security headers, including CSP; admin CSRF changes
  explicitly verify the readable-CSRF-cookie-to-CSP dependency.
- No hardcoded secrets, private keys, credentials, or new live endpoints beyond
  documented public hostnames.

Before any commit or push that includes security-sensitive files, run a
diff-level secret scan or record why an equivalent tool already covered it. The
minimum acceptable manual check is a staged-diff scan for common secret terms
and private-key markers; hits must be inspected and either removed or documented
as benign public identifiers before commit.

#### Design Lint — `impeccable detect` (recommended for UI/frontend changes)

For design-sensitive changes (new components, layout shifts, style/tailwind
changes, landing page edits), run the deterministic anti-pattern detector:

```bash
npx impeccable detect <changed-file-or-glob>
# or for the full project:
npx impeccable detect src/
```

This catches 24 anti-patterns with zero LLM calls and zero API keys — pure
pattern matching: AI slop (purple gradients, Inter font everywhere, cards in
cards), accessibility issues (small touch targets, skipped heading levels),
typography problems (line length, cramped padding), and animation mistakes
(bounce/elastic easing).

**When to run:**
- New section/component with visual output → run on changed files
- Landing page or marketing surface → run on full project
- Before commit of any design-sensitive PR → recommended (not blocking)
- Quick-fix or non-visual change → skip

A finding from `impeccable detect` is evidence for the Verifier, not a
blocking gate. Treat false positives as expected (emoji in buttons, intentional
asymmetry). Record skipped findings with reason.

#### Design Critique Lite — for tasks ≤5 files (Control Tower inline)

Full `impeccable critique` requires two isolated assessments (A: design review,
B: detector evidence) plus subagent orchestration. For small tasks (≤5 files,
no new route/schema/API, no security-sensitive surface), use the lite version:

1. **One inline review** — Control Tower reviews the rendered page (browser
   snapshot or `curl` + source read) against the 5 design dimensions:
   AI slop, holistic design (hierarchy/IA/composition/typography/color),
   cognitive load (>4 visible options?), emotional fit, heuristic violations.
2. **Run `impeccable detect`** on changed files (same as Design Lint above).
3. **Output:** 2-3 strengths, 3-5 priority issues, verdict (SHIP / TWEAK /
   BLOCKED). No subagent needed, no persistence snapshot, no trend analysis.

Use lite critique for section additions, component reworks, and layout
adjustments. Use full `impeccable critique` for new surfaces (new page, new
app shell, landing redesign) or security-sensitive UI (auth, admin, webhooks).

### Runtime Proof Matrix

Code/config inspection and runtime proof are separate evidence classes. A
security header or deployment-sensitive finding is not closed by source review
alone when the relevant runtime can be checked.

| Surface | Minimum proof | Blocked state |
|---|---|---|
| Public web | `curl -fsSI` or `curl -fsSIL` for apex and `www`; include changed public routes when relevant | DNS/network unavailable |
| Admin app | `curl -fsSI` or `curl -fsSIL` for admin host plus relevant health/login route | admin host unresolved or app not deployed |
| API/webhook routes | one positive and one negative smoke for changed endpoint class, plus response headers where security headers matter | route not deployed or live action unapproved |
| Deploy/runtime logs | sanitized post-deploy log scan for token/secret/provider/DB leakage | deploy or live log access not approved |

If runtime proof is blocked, mark it `blocked` with the blocker and carry it as
a separate follow-up gate. Do not silently convert blocked runtime proof into a
local pass.

### Security Tooling Baseline

For security-sensitive Work Blocks, Verifier uses these tools when present:

```bash
scripts/secret-scan.sh staged
scripts/secret-scan.sh tracked
npm audit --omit=dev --audit-level=high
```

`staged` is required before commit for security, runtime, config, deploy, auth,
webhook, provider, or DB-related staged files. `tracked` is required during
security Work Blocks and before release/deploy readiness. `npm audit` findings
must be classified as runtime, build-time, dev-only, false-positive/stale, or
blocked. New or changed mutation endpoints must also prove bounded parsing and
body-size limits.

### OWASP Coverage Baseline

Security review should map findings to OWASP Top 10 categories when practical:

| OWASP 2021 | Project verification anchor |
|---|---|
| A01 Broken Access Control | admin middleware, role/session checks, route guards, CSRF/origin validation |
| A02 Cryptographic Failures | timing-safe comparisons, HMAC/session signing, token secrecy, no weak randomness |
| A03 Injection | parameterized SQL, bounded parsing, no shell/dynamic code injection |
| A04 Insecure Design | STRIDE-lite for security-sensitive Work Blocks |
| A05 Security Misconfiguration | CSP/HSTS/security headers, fail-closed env gates, deploy preflight |
| A06 Vulnerable Components | `npm audit`, dependency review when package files change |
| A07 Identification/Auth Failures | session TTL, cookie flags, logout invalidation, login rate limits |
| A08 Software/Data Integrity | immutable image tags, CI provenance checks, scoped commits |
| A09 Logging/Monitoring Failures | sanitized logs, no secrets/PII/full payloads, runtime smoke log scan |
| A10 SSRF | no server-side fetch from user-controlled URLs without allowlist |

#### Tier Deploy

Control Tower owns deploy-readiness skill invocation and any deploy/infra Hard
Stop action. Verifier reviews deploy evidence and may run read-only proof or
smoke checks only inside the approved Work Block.

1. Run **`compose-preflight`** skill — validates `docker compose config` with synthetic env.
2. Run **`deploy-readiness-gate`** skill — aggregates: git clean, build checks, immutable tag, rollback capture, env parity, Hard Stop confirmation.
3. Post-deploy runtime smoke:
   ```bash
   # Public health
   curl -fsSI https://azursystech.fr/health
   curl -fsSI https://www.azursystech.fr/health
   # Route smoke (per changed route)
   # Log scan — no token/secret leakage
   ssh ... "docker logs azursystech-app --since 5m 2>&1 | grep -c -i 'token\|secret\|bot_token'"
   ```
4. Container health:
   ```bash
   ssh ... "docker compose -f docker-compose.vps.yml ps"
   ```

Skills reference this section instead of inline check lists.
Example: "Run checks per `sdd-protocol.md § Check Suite → Tier Standard`."

---

## Transition Rules

```
Stage N completes → Stage N+1 starts automatically
Exception: Hard Stop condition met → pause, report to Owner, wait
Exception: BLOCKED verdict from Verifier → pause, report to Owner, wait
```

> **Hard stop conditions**: see `AGENTS.md` → Hard Stops for the canonical list
> (production deploy, live DB migration, credential rotation, destructive git ops, real client comms).

## Skill Invocation Rule

When a skill in `.agent/skills/<name>/SKILL.md` matches the current Work Block
or stage, **use it before planning or executing the matching work**.

**Why:** Skipping a matching project-local skill means:
- No traceability — future sessions can't see what skill was used or skipped.
- Steps can be skipped because the full workflow isn't loaded into context.
- Verification evidence may not match the skill's output format.

**Rule:**
- Stage 0 must run Skill Routing Gate for every non-trivial, Hard Stop, ops,
  DB, deploy, security, runtime, multi-domain, or subagent-delegated Work
  Block.
- Inspect `.agent/ROSTER.md`, then read only matching
  `.agent/skills/<name>/SKILL.md` files.
- Record `Skills checked`, `Skills matched`, `Skills used`, and
  `Skills skipped and why`.
- If the runtime exposes a formal Skill tool for the matching project-local
  skill, invoke it.
- If the runtime does not expose project-local skills through a formal Skill
  tool, state `Project-local skill used: <name>`, read the `SKILL.md`, and
  follow its workflow manually.
- The skill's workflow then drives the implementation; do not re-derive the
  steps from memory.
- If the skill's workflow is incomplete for the task, update the skill after
  the Work Block closes (document drift during Stage 3).
- Skipping a matching skill is allowed only with a recorded reason:
  `not relevant after inspection`, `blocked`, or `superseded by stricter gate`.

**Exception:** Skills with 🔴 Hard Stop handoff (e.g., `vps-registry-pull-deploy`)
still require Owner approval before any production, credential, deploy, live DB,
destructive, or client-facing action. Once approved, use the skill instead of
replicating its steps from memory.

## Parallelism

Tasks within the same stage that have no inter-dependency may be executed in parallel.
The orchestrator decides parallelism and subagent use; no Owner confirmation is
needed after the Work Block is approved.

For DB, deploy, infra, secret, or client-facing work, Stage 0 must classify the
side-effect class and DB action mode from `AGENTS.md` before implementation or
verification starts. This classification belongs in the Work Block or mission
brief; it is not a new approval gate by itself.

Prefer scoped, self-contained subagent prompts. Use a full-history fork only
when the subagent needs inherited conversation context that cannot be summarized
safely in the assignment.

Subagents must not launch nested external AI CLI tools (`codex`, `claude`,
Gemini, DeepSeek, Qwen, or similar) to get another verdict. A native subagent is
already the delegated reviewer/verifier for its mission. External audit runners
are separate Control Tower-assigned work items with their own task file,
timeouts, and fallback.

Use the same mission-brief shape for Codex subagents, Claude Code subagents, or
manual fallback prompts. Tool capability does not expand process authority:
roles, write-sets, hard stops, and acceptance still come from `AGENTS.md` and
the active Work Block.

Before declaring a subagent timed out, check whether it is waiting for Owner
approval or tool escalation. If so, report `approval wait`; otherwise use a
local fallback verifier/reviewer and document the risk.

For sandbox or tooling failures, report the failed command or tool, approval or
escalation state, fallback used, and verification impact.

## Blocked Task Handling

If a task in Stage 1 is blocked (missing precondition, external dep):
- Document the blocker inline.
- Skip that task.
- Continue with remaining tasks.
- Report all skipped tasks in Stage 3 output.

Do NOT halt the entire pipeline for one blocked task.
