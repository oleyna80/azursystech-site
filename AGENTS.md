# AGENTS.md — AzurSysTech Operating Contract

> Primary contract for all AI agents working in this repository.
> Read this file first, before any memory_bank or task docs.

---

## Process Model

AzurSysTech uses an **Agentic SDLC**: an iterative-incremental,
documentation-first, gate-based workflow with controlled multi-agent
orchestration.

The workflow borrows useful parts of Agile practice, but it is not strict Scrum.
It uses short feedback loops, scoped increments, review/verification gates, and
SSOT sync after meaningful closeouts.

It is not Waterfall: plans and architecture may evolve after each verified gate.
It is not ad hoc "vibe coding": non-trivial work requires an approved Work
Block, explicit scope, acceptance criteria, verification tier, hard stops, and
maintainability review.

## Autonomy Policy

After an Owner-approved plan is in place, the orchestrator executes the
**full planned agent stack without pausing for intermediate confirmation**.

The orchestrator does NOT pause or ask for approval between stages unless
a Hard Stop condition is met (see below). It runs all stages sequentially,
reports blockers inline, and delivers a single closeout summary at the end.

Planned edits inside an approved Work Block do not require a separate
confirmation pause unless they change scope or trigger a Hard Stop.

Short discussion or decision-only turns may use a lightweight path: answer,
recommend, or decide without running the full lifecycle. Use the full SDD flow
only when work is non-trivial, risky, multi-domain, or file-changing.

### Multi-Agent Default

The main chat is the **Control Tower**: it frames the Work Block, routes work,
tracks scope, handles hard stops, and consolidates the result.

Use subagents by default when they are likely to improve speed, quality, or
context hygiene, especially for large reviews, broad file inspection,
architecture/design/security analysis, implementation with a clear write-set,
or independent verification. Do not keep bulk review or bulk implementation in
the main chat when a scoped subagent can handle it safely.

Owner approval of a Work Block explicitly authorizes the Orchestrator to launch
scoped subagents automatically when that Work Block is classified as
`Subagent-Required` under the trigger list below. This authorization applies
only inside the approved scope and never expands file-change authority,
side-effect authority, DB authority, or Hard Stop authority.

A Work Block is `Subagent-Required` if any of these triggers apply:

1. It requires review or implementation across 2 or more domains: frontend,
   backend, ops, security, DB, docs, CI, deploy, product, or design.
2. It touches, reviews, or verifies 4 or more files.
3. It includes production code, runtime config, Docker, CI, deployment,
   database, authentication, webhook, payment, or external-provider behavior.
4. It is based on an external review, audit, security report, or generated
   reviewer output.
5. It requires independent verification after implementation.
6. Investigation is expected to span more than 3 directories.
7. It involves commit readiness, push readiness, release readiness, deploy
   readiness, or live-operation readiness.

For `Subagent-Required` Work Blocks, default permitted subagent classes are
read-only Reviewer, Verifier, and Analyst subagents inside the approved scope.
Write-capable Coder subagents require an approved write-set; use exactly one
write-capable Coder per write-set.

### Execution Topology After Plan Approval

After an approved Work Block plan, the Orchestrator (Control Tower) does not
implement or verify directly. Instead:

1. **Scoped Coder** implements the approved write-set.
2. **Verifier** gate verifies acceptance criteria, contracts, and production readiness.
3. **Browser smoke tests and screenshots** are executed only inside the Verifier
   subagent; Verifier returns a verdict and file paths to changed artifacts, not
   images themselves.

**Exception:** Quick-fix path (≤3 files, no route/schema/API/security/governance)
may be executed inline by Control Tower with lite checks and inline sync.

Native subagents must not launch nested external AI CLI tools such as `codex`,
`claude`, Gemini, DeepSeek, Qwen, or similar tools to obtain another verdict.
A native subagent is already the delegated Reviewer, Verifier, or Analyst for
its assigned mission. External AI review is a separate Control Tower work item:
assign it explicitly as `External Audit Runner`, provide a local task file,
define timeouts and fallback, and keep the same scope, read-only, side-effect,
secret, DB, deploy, commit, and push boundaries.

The Orchestrator may skip subagents for a `Subagent-Required` Work Block only
when it records one of these reasons in Stage 0:

- `trivial`: the trigger was false after inspection; the task is single-domain,
  no more than 3 files, and has no production/runtime/security/deploy/DB impact.
- `blocked`: native subagent tooling is unavailable or failing.
- `hard-stop`: delegation would require an unapproved side effect.
- `user-disabled`: the Owner explicitly requested no subagents for the Work Block.

If the skip reason is `blocked`, record the exact blocker category:
`tool-unavailable`, `thread-limit`, `usage-limit`, `model-unavailable`,
`sandbox`, or `other`. A blocked subagent does not make the review disappear:
Control Tower must run the narrowest safe inline Reviewer/Verifier fallback,
label the result `review-degraded:inline-fallback`, and add a follow-up for an
external or subagent re-review before commit/push when the Work Block touches
security, runtime, DB, deploy, auth, webhooks, provider integrations, or 4+
files. The fallback may not expand write authority or bypass Hard Stops.

For context hygiene, treat `.codexignore` as the Codex-specific exclusion list
and `.agentsignore` as the vendor-neutral advisory list. Do not bulk-read paths
listed there unless the approved objective explicitly requires them. These files
are context controls, not security boundaries.

### Committed and Local Agent Layers

The Agentic SDLC layer is split into committed policy/templates and local
runtime state.

Committed, portable workflow files include `AGENTS.md`, `PROJECT_MAP.md`,
`FILE_REGISTRY.yml`, `docs/session-bootstrap.md`,
`docs/engineering-memory/**`, `docs/templates/**`, `.agent/README.md`,
`.agent/ROSTER.md`, `.agent/critic-gate.md`, `.agent/verification-gate.md`,
`.agent/workflows/**`, `.codexignore`, `.agentsignore`, and safe Codex
policy/template files such as `.codex/AGENTS.md`, `.codex/critic.md`,
`.codex/write-gate.md`, `.codex/instructions.md`,
`.codex/config.toml.template`, and `.codex/hooks/**`.

Project-local `.agent/skills/**` wrappers are commit-eligible only after a
separate skill-curation Work Block approves the specific skill paths. Until
then, unapproved skill directories are local/deferred aids and are not required
for bootstrap, review, verification, or a fresh clone.

Local-only runtime state includes `memory_bank/**`, `.env*`, secrets,
credentials, provider tokens, private runtime config such as
`.codex/config.toml`, `.codex/agents/**`, `.claude/**`, caches, generated
browser/build artifacts, and runtime logs. These files must stay ignored unless
the Owner explicitly approves a public workflow-doc release for a specific path.
If runtime paths are already tracked from earlier work, treat them as legacy
tracked runtime payloads pending a separate cleanup/curation Work Block; do not
expand them during unrelated control-layer work.

Run `scripts/bootstrap.sh --check` after cloning or restoring a workspace to
verify that the workflow layer required by the Session Start Read Set is
present. Run `scripts/bootstrap.sh --init` when a fresh clone needs local
`memory_bank/` starter files. Bootstrap does not install secrets, fetch private
material, or change production configuration.

Owner involvement is intentionally light: the Owner starts the process,
approves Hard Stop actions when needed, and validates the final result. The
Owner does not manage internal agent handoffs during an approved Work Block.

For write-capable work, use exactly one Scoped Coder subagent per write-set.
Reviewer and Verifier subagents are read-only for source, runtime, config, DB,
infra, secrets, and production state unless explicitly approved. Verifier may
write approved verification artifacts only when the Work Block scopes that
artifact path.

Agent operations reviews are optional local-only retrospectives for permission
friction, approval waits, tooling failures, and outcomes after large Work
Blocks or sprint closeouts. They produce recommendations only: no automatic
permission changes, no raw private transcript parsing by default, and no
weakening of Hard Stops.

### Temporary Specializations

Roles define authority, not expertise. Expertise is expressed through temporary
specializations and skills.

Agents may receive a temporary specialization inside a Work Block, for example
`Architecture Analyst`, `Security Analyst`, `Backend Coder`, `QA Analyst`, or
`Docs Analyst`.

A specialization narrows focus and skill routing; it does not create a new
authority level. File-change authority always comes from the base role:
Orchestrator, Coder, Reviewer, or Verifier.

Use temporary specializations to represent team functions such as Architecture,
Backend, Frontend, Security, QA, DevOps, Product, Docs, Research, or Release
Operations. Do not add permanent roles for these functions unless they require a
new authority model.

### Structural Authority Model

Authority is structural, not prompt-based. An agent may only act when all four
boundaries allow it:

1. Base role: Orchestrator, Coder, Reviewer, or Verifier.
2. Approved Work Block scope and write-set.
3. Side-effect class.
4. Explicit Hard Stop approval, when required.

Temporary specialization and tool availability never expand authority. A
`Reviewer / Security Analyst` with access to shell tools is still read-only. A
`Coder / Backend Coder` may write only inside the approved write-set. An agent
must not grant itself broader authority because it can run `psql`, `ssh`,
`docker`, `curl`, MCP tools, or vendor CLIs.

### Hard Stops — require explicit Owner approval before proceeding

| Condition | Why |
|---|---|
| Production deploy (VPS, Docker push) | Irreversible side-effects |
| Live DB migration apply | Data risk |
| Credential rotation / secret changes | Security perimeter |
| Destructive git ops (`reset --hard`, force push to main) | Data loss risk |
| Sending real client communications (email, WhatsApp, Telegram) | External impact |
| Push to main (`git push origin main`) | Public repo side effect; irreversible |

**Push-to-main approval channel (cooperative control):** Owner may approve a plain `git push origin main` without manual `!` by instructing Control Tower to record an entry in `memory_bank/orchestrator-log.md` with format `| YYYY-MM-DD | push-approval | push: APPROVED origin main - <reason> | Owner |`. This approval is valid for the calendar day only and does not unlock force-push, destructive operations, or deletions — those remain unconditionally blocked. This is a cooperative control (prevents pushes without recorded Owner instruction), not cryptographic protection. Control Tower records the entry only on explicit Owner instruction in chat.

Everything else → **run through to closeout, then report**.

### Side-Effect Classes

Classify non-trivial work before execution. The class controls who may act and
whether Owner approval is required.

| Class | Examples | Authority |
|---|---|---|
| Read-only | file inspection, `git diff`, logs with sanitized output | Orchestrator, Reviewer, Verifier |
| Local docs/workflow write | `.agent/*`, `memory_bank/*`, `docs/tasklist/*` | Control Tower inside approved scope |
| Production code write | `web/*`, `scripts/*`, `05_ai/*` | Scoped Coder inside approved write-set |
| Local/test side effect | temp DB, local dev server, local test artifacts | Approved Work Block; no live data |
| Public repo side effect | commit, push, release tag | Explicit Owner approval |
| Live infra side effect | VPS deploy, Docker push/pull deploy, service restart | Hard Stop approval |
| Live data side effect | live DB migration, live DB write, manual row change | Hard Stop approval |
| Client-facing side effect | Telegram/WhatsApp/email/client notification | Hard Stop approval |
| Destructive side effect | `reset --hard`, `git clean`, force push, delete/drop | Hard Stop approval |

### Production Maintainability Standard

This is a mandatory acceptance rule for all production code changes. Generated
code is acceptable only if the final diff is maintainable by a human engineer
without prompt context.

Production code must:

- follow existing project patterns and naming;
- keep abstractions small and justified by current complexity;
- expose side effects, data flow, failure modes, and ownership boundaries
  clearly;
- avoid prompt-shaped, generic, over-broad, or speculative helper code;
- avoid duplicated generated boilerplate that will drift during maintenance;
- include targeted checks that prove the changed contract, not just a green
  build;
- be explainable in the closeout without relying on hidden prompt history.

Reviewer/Verifier must block acceptance if a production diff looks correct only
because of the prompt context, is hard to modify safely, or would be costly for a
future maintainer to own.

### Security Review Baseline

Security findings from external reports must be triaged against the current
tree before implementation. Record each accepted security claim as
`confirmed`, `partially confirmed`, `stale/resolved`, `rejected`, or
`needs-more-proof`. A stale finding may still produce an SDLC/docs follow-up if
the underlying rule is missing from verification.

For security-sensitive Work Blocks, Stage 0 must classify whether a lightweight
threat model is required. It is required for new or changed authentication,
authorization, admin routes, webhooks, external-provider integrations,
client-facing sends, data export/import, file/path handling, payment/order
flows, schema/storage changes, or security headers. Use STRIDE-lite: list trust
boundaries, attacker-controlled inputs, privileged actions, persistence points,
and one mitigation per relevant threat class.

Tier Full and security verification must include a code-level security review
checklist:

- no SQL string interpolation; queries are parameterized;
- no `dangerouslySetInnerHTML` without explicit sanitization;
- no `eval`, `new Function`, or dynamic execution of user-controlled input;
- no `Math.random()` or non-crypto randomness for secrets, tokens, or IDs;
- mutation endpoints have CSRF, origin, webhook secret, scheduler secret, or an
  equivalent guard;
- redirect URLs and file/path parameters are validated against allowlists or
  fixed roots;
- errors do not expose stack traces, SQL messages, internal paths, secrets, or
  provider tokens;
- logs never include tokens, secrets, passwords, `DATABASE_URL`, full request
  headers, full request/response bodies, connection strings, or row payloads;
- security headers are checked where relevant, including CSP for browser apps;
- no hardcoded API keys, tokens, credentials, private keys, or live endpoints
  beyond documented public hostnames.

Code-level header configuration is not enough to close runtime security
findings. Browser/admin/security-header findings must be verified against both
configured source files and actual served responses when a runtime is available.
Runtime proof uses this matrix:

| Surface | Minimum proof | Blocked state |
|---|---|---|
| Public web | `curl -fsSI` or `curl -fsSIL` against apex and `www` URLs, including changed routes when relevant | DNS/network unavailable |
| Admin app | `curl -fsSI`/`-L` against the admin hostname and relevant health/login route | admin hostname unresolved or app not deployed |
| API/webhook routes | positive and negative route smoke plus response headers for changed endpoint class | route not deployed or live action unapproved |
| Deploy/runtime logs | sanitized log scan for token/secret/provider/DB leakage after approved deploy/runtime smoke | deploy/live log access not approved |

A blocked runtime proof is reported as `blocked`, not `pass`. It may close the
local code Work Block only if the final report carries the blocked runtime
follow-up as a separate gate.

Security-sensitive verification must include the project tooling baseline when
available:

- `scripts/secret-scan.sh staged` before any commit that includes security,
  runtime, config, deploy, auth, webhook, provider, or DB-related files;
- `scripts/secret-scan.sh tracked` during security Work Blocks and before
  release/deploy readiness;
- `npm audit --omit=dev --audit-level=high` for changed Node applications;
- body-size limit and bounded parsing checks for new or changed mutation
  endpoints;
- explicit classification of `npm audit` findings as runtime, build-time,
  dev-only, false-positive/stale, or blocked.

Admin CSRF uses a readable double-submit cookie by design. That pattern depends
on a strict CSP and ordinary output-encoding discipline. Any change to admin
rendering, admin CSP, CSRF token handling, or user-generated content rendering
must verify this dependency explicitly.

---

## Stage Flow

```
Standard:
  Plan & Discover (Control Tower)
    └─→ Implement (Scoped Coder, per-task)
          └─→ Verify (Verifier gate, tier-scoped)
                └─→ Sync & Report (SSOT Sync + Owner report)

Quick-fix (≤2 planned write-set files, no route/schema/API/security/governance):
  Implement (Lite checks) → Inline sync → Done
```

**Pre-Edit Lifecycle Check.** Before editing files created or renamed in the
last 5 calendar days (visible via `git log --diff-filter=A --since="5 days ago"
--name-only`), ask the Owner: "These pages are recently created — are they
staying, or are we restructuring?" This prevents wasted surgical edits on pages
that will be deleted in the same session. The check is required only when the
file was recently added and the edit scope is non-trivial (more than a typo fix).

**Crash Test Gate.** Before `git commit` on any Work Block that changes routes,
navigation, or sitemap entries, run a local crash test:
- All sitemap routes return expected HTTP status (200, 308);
- Deleted routes return 404;
- All anchor targets referenced in header/footer exist on the target page;
- `npx vitest run` for affected test files;
- Zero new errors in dev server logs.
Record the result as `Crash test: PASSED / FAILED` in the commit body or closeout.

Between stages: no confirmation pause unless a Hard Stop is triggered.
If a stage fails: report the blocker, attempt recovery or skip with documented risk,
then continue remaining stages.

See `.agent/workflows/sdd-protocol.md` for full stage definitions, verification tiers, and check suite.

---

## Session Start Read Set

For non-trivial work, read these files before planning edits:

1. `AGENTS.md` — operating contract, autonomy policy, hard stops, file authority
2. `PROJECT_MAP.md` — project map, authority model, and major path boundaries
3. `FILE_REGISTRY.yml` — machine-readable registry for key files and zones
4. `docs/session-bootstrap.md` — current session intake and memory-use rules
5. `.agent/workflows/sdd-protocol.md` — stage flow, verification tiers, quick-fix rules
6. `.agent/ROSTER.md` — agent/mode and skill routing
7. Relevant `docs/engineering-memory/*` entries — durable engineering memory
8. `memory_bank/context.md` — current operational focus and next gate
9. `memory_bank/progress.md` — rolling operational status log
10. `memory_bank/decisions.md` — operational decision summaries only

Read additional specs, plans, tasklists, skills, or code only when they are relevant
to the approved objective.

### Stage 0 Routing Preflight Write Gate

For any non-trivial Work Block, **Stage 0 Routing Preflight is the write gate**.
Before any edit/write-capable tool is used, the Work Block or active tasklist
must visibly record:

- Work Block type;
- side-effect class;
- DB action mode;
- Skill Routing Gate result;
- Subagent Topology classification and dispatch/skip decision;
- Hard Stops in scope;
- `Write gate: READY` or `Write gate: BLOCKED`.

If this evidence is missing or `Write gate` is not `READY`, implementation,
documentation edits, staging, commit, push, deploy, DB, env/secret, and
client-facing actions are blocked. Trivial quick-fix tasks may use the
lightweight path, but must still report why full Stage 0 was skipped.

**Compact preflight** — for Control-Tower-Only tasks (≤2 planned write-set
files, no DB, no deploy, no security, no client-facing, no governance impact):
output one compact line instead of full 6-field preflight:

```
PREFLIGHT: CTO | <side-effect-class> | no DB | no HS | Skills: <checked>/<used>/<skipped> | READY
```

Example: `PREFLIGHT: CTO | production code | no DB | no HS | Skills: checked=roster,critic-gate; used=critic-gate; skipped=skill-file-unavailable | READY`

Compact preflight must still include Skill Routing Gate evidence (which skills
were checked, which were used, which were skipped and why). Trivial quick-fix
tasks (typo, comment, config tweak) may skip even compact preflight but must
state: `Quick-fix: <reason>`.

The preflight includes Skill Routing Gate. Before any non-trivial, Hard Stop,
ops, DB, deploy, security, runtime, multi-domain, or subagent-delegated Work
Block, Control Tower must perform Skill Routing Gate before planning or
executing actions.

### Skill Routing Gate

Skill Routing Gate requires:

0. **Relevance filter (MANDATORY first step).** Before scanning any skill files,
   state which skill categories are relevant to THIS task type. Group them:
   - **Always relevant:** `git-safety` for commit decisions, and the
     current Work Block / gate templates for non-trivial work.
   - **Relevant to this task:** e.g. "design + frontend" -> taste-skill,
     frontend-design, impeccable, emil-design-eng, if approved wrappers exist.
   - **Not relevant to this task:** everything else (skip scanning these categories)

   Then scan ONLY the relevant skills. This prevents silent skill ignorance —
   the agent must actively decide which skills are OUT of scope, not just
   "forget" to check them.

1. Inspect `.agent/ROSTER.md` for routing-critical skill candidates.
2. If approved or local `.agent/skills/*/SKILL.md` files exist for the relevant
   categories, search or inspect them for matching `description`,
   `## Triggers`, or `## When to Use` **within the relevant categories only**.
   If no matching skill file exists, record `skill-file-unavailable` and use
   the nearest committed gate/template as the fallback.
3. Read only the matching skill files; do not bulk-read every skill.
4. State in the Work Block:
   - `Skills checked` (all relevant categories scanned)
   - `Skills matched` (which matched the task)
   - `Skills used` (which were actually applied)
   - `Skills skipped and why` (matched but not used — must give reason)

If an approved or local project-local skill matches the current Work Block or
stage, use that skill's workflow. If the runtime exposes a formal Skill
invocation mechanism, invoke the skill there. If the runtime does not expose
project-local skills, read `.agent/skills/<name>/SKILL.md`, state
`Project-local skill used: <name>`, and follow its workflow manually. If the
skill exists only as a candidate in `.agent/ROSTER.md`, record the missing
skill file and continue with the committed gate/template fallback.

For frontend/design work, `.agent/skills/impeccable` may be used only if its
wrapper is present and approved for the current workspace. Vendor runtime skills
under `.claude/skills/**` remain runtime-local unless separately approved for a
public workflow-doc release; the committed Claude control layer (settings,
hooks, agents, agent-memory indexes) is governed by `FILE_REGISTRY.yml`.

Skipping a matching skill is allowed only with a recorded reason:
`not relevant after inspection`, `blocked`, or `superseded by stricter gate`.
Hard Stop skills still require explicit Owner approval before any production,
credential, deploy, live DB, destructive, or client-facing action.

### Hook-Enforced Gate Rules

Three SDLC rules are enforced deterministically at the tool-call boundary
(principle: a rule lives in a hook, or it does not exist):

1. **Skills Routing field** (`critic-gate.sh`, every gated edit). Repository
   edits are denied until `.agent/critic-gate.md` records routing evidence,
   bracket-free (a bracketed or `PENDING` value is a placeholder and denies):
   `Skills Routing: checked=...; matched=...; used=...; skipped=...`

2. **Write-set amendment** (`critic-gate.sh`, `Status: READY`). Critic reports
   must list the approved write-set verbatim, one path per line. Editing a
   path whose write-set pattern is absent from the Critic Report requires a
   same-day orchestrator-log entry:
   `| YYYY-MM-DD | <WB-id> | amendment: write-set + <path> - <reason> | Control Tower |`
   Silent scope expansion after APPROVE is impossible. SKIPPED
   (Owner-approved) Work Blocks are exempt from the amendment check.

3. **Verifier identity** (`verification-gate.sh`, `Status: READY`). The gate
   must record `Verifier: subagent | ct-inline` and classify
   `Sensitive Domains` (`none` or a list; compared case-insensitively).
   When Sensitive Domains is not `none`, `ct-inline` additionally requires a
   same-day Owner waiver:
   `| YYYY-MM-DD | <WB-id> | verifier-waiver: APPROVED - <reason> | Owner |`

All orchestrator-log lookups treat log entries and write-set paths as
literals, not patterns: WB ids match as pipe-delimited fixed strings
(`grep -F "| <WB-id> |"`), and the authorizing actor column (`| Owner |` /
`| Control Tower |`) is matched anchored at end of line — an actor token
embedded in the reason text does not authorize. Payload fixtures for both
hooks: `.claude/hooks/tests/gate-fixtures.sh` (extend it in any Work Block
that touches these hooks).

---

## SSOT Hierarchy

- `docs/tasklist/<ticket>.tasklist.md` is the only live task status source.
- `docs/plans/*` are approved plan/reference docs, not live status unless explicitly synced.
- `docs/specs/*` are approved product/technical contracts; use them as requirements/reference,
  not live task status unless they are synced in the active tasklist.
- `docs/reports/*` are immutable historical evidence snapshots, not current truth.
- `docs/engineering-memory/*` contains durable engineering memory, source-of-truth
  chains, reproducible procedures, temporary decisions, and accepted decision
  records.
- `memory_bank/context.md` contains only current focus, scope, and next gate.
- `memory_bank/progress.md` contains the rolling status log.
- `memory_bank/decisions.md` contains operational decision summaries only.
  Promote durable architecture/runtime/process decisions to
  `docs/engineering-memory/`.

If a report or plan conflicts with the active tasklist, follow the active tasklist
and document the drift during Sync & Report.

### External Review / Audit Protocol

External reviewer output from Claude Code, DeepSeek, Qwen, or another tool is
evidence, not authority. The Orchestrator must verify each accepted claim
against the live tree before planning or accepting fixes.

Before asking an external reviewer to audit non-trivial work, create a local
task file under `docs/plans/` or `docs/reports/` that defines:

- objective and scope;
- required read set;
- explicit out-of-scope items;
- file-change permission, usually read-only;
- forbidden side effects: env/secrets, live DB, deploy, provider APIs,
  client/admin messages, commit, push, destructive operations;
- required output format: findings by severity, file/line evidence, confidence,
  suggested fix, and commands/checks run.

Do not paste secrets, connection strings, row payloads, client messages, or
private runtime values into an external audit prompt. If an external audit
suggests fixes, treat the report like an input to Stage 0: triage locally,
choose a scoped Work Block, then run implementation and verification through
this contract.

Do not ask a native subagent to run an external AI CLI from inside its own
mission. If the Work Block needs a second-model audit, Control Tower creates a
separate `External Audit Runner` assignment with:

- the exact command family or tool allowed;
- timeout and kill/fallback behavior;
- read-only task file or prompt source;
- forbidden side effects matching the active Work Block;
- expected output format and evidence requirements.

If the external CLI is blocked by network, account, model availability, sandbox,
or a hung process, record the blocker and continue with the approved fallback
instead of letting the subagent wait for Owner approval or tool escalation.

### Local Runtime Memory Closeout

`memory_bank/**` is operational runtime memory and may be ignored by Git.
For any closeout that updates ignored runtime memory, `git status` and
`git diff` are not sufficient evidence. The Orchestrator must verify the update
with direct inspection and:

```bash
git check-ignore -v <changed-local-ssot-paths>
rg -n "<new status or evidence marker>" <changed-local-ssot-paths>
git diff --check -- <changed-local-ssot-paths>
```

The Owner report must state whether the SSOT changes are local-only/ignored and
therefore will not appear in public Git history unless separately approved.
Reusable knowledge that should survive a new workstation or a new agent runtime
must be promoted into `docs/engineering-memory/` before closeout.

---

## Agent Roster

| Agent / Mode | Slug | Role |
|---|---|---|
| Control Tower | `azursystech-control-tower` | Orchestration, planning, task slicing, SSOT |
| Docs Reviewer | `azursystech-docs-reviewer` | Read-only audit, SSOT drift checks |
| Scoped Coder | `azursystech-scoped-coder` | Approved-scope implementation only |
| Verifier | `azursystech-verifier` | AC verification gate |

Approved runtimes hosting these roles: Codex, Claude Code, OpenCode, Qwen,
Gemini. OpenCode follows this AGENTS.md for flow policy, Hard Stops, and file
write authority; skill routing same as Codex/Claude (stage flow + skill
triggers); its subagent contracts live in `.opencode/agents/**` and mirror
`.claude/agents/**`.

Full roster with skill assignments: `.agent/ROSTER.md`

### Model Routing

| Task Type | Model | Runtime |
|---|---|---|
| Explore, inventory, research | `haiku` | Fast context evaluation |
| Scoped Coder, Verifier, Reviewer, Critic | `sonnet` | Standard implementation, review, verification |
| Solution Architect (hard architecture only) | `opus` | Complex analysis, multi-domain design |
| GPT Critic, GPT Verifier, Codex Reviewer | `inherit` | Delegates to Codex MCP (GPT family); DEGRADED path retained when Codex unavailable |

**Model aliases in `.claude/agents/*.md` frontmatter:** `sonnet`, `opus`, `haiku`, `inherit` are native Claude Code agent frontmatter values, resolved by the harness. Do not use full model names (e.g., `claude-sonnet-4-6`) in agent YAML frontmatter.

---

## Memory Bank Protocol

Memory bank files in the session start read set:

1. `memory_bank/context.md` — current focus, scope, next step
2. `memory_bank/progress.md` — done / in-progress / next (last 15 entries)
3. `memory_bank/decisions.md` — operational decision summaries and pointers to
   durable records

Update memory bank only after a meaningful closeout has verification evidence.
Do not update it for every small discussion, clarification, or intermediate
handoff.

Durable engineering memory belongs in `docs/engineering-memory/`, not in
`memory_bank/`. Promote accepted architecture, runtime, integration, delivery,
or process decisions there during closeout.

**Rolling window**: `progress.md` keeps the last 15 entries. When exceeding 15,
move older entries to `memory_bank/archive/progress-YYYY-MM.md`.
Archived entries are read only when explicitly needed (debugging, audit).

---

## Key Constraints (all agents)

- No env/secret changes without Owner approval.
- No deploy/infra changes without Owner approval.
- No DB migrations without Owner approval.
- No real client communications without Owner approval.
- No scope expansion beyond the approved task write-set.
- Do not commit secrets, tokens, or production credentials.
- DB action mode must be explicit before any DB-related task.
- The LLM must never write directly to the database outside an approved runtime
  code path or an explicitly approved DB gate.
- Tool capability is not authority. Access to `psql`, `ssh`, `docker`, `curl`,
  MCP tools, or vendor CLIs does not permit DB, infra, secret, deploy, or client
  side effects.

### DB Access Matrix

| DB action mode | Allowed | Forbidden |
|---|---|---|
| `none` | No DB access needed | DB commands, DB credentials, schema assumptions |
| `local_temp` | temporary/local DB smoke, test migrations, disposable data | live DB, real credentials, persistent production data |
| `live_readonly` | Owner-approved sanitized schema/status inspection | writes, DDL, migrations, row payload dumps, manual fixes |
| `live_migration_apply` | Owner-approved migration files in approved order, stop-on-error, post-read-only verification | arbitrary SQL, destructive SQL, manual remediation unless separately approved |
| `runtime_app` | application writes through reviewed code paths and configured runtime permissions | LLM/manual direct DB mutation, bypassing app invariants |
| `emergency_remediation` | separately approved remediation Work Block with exact SQL/action plan | implicit fixes, exploratory writes, broad admin access |

---

## Skill Index

Approved project-local skills live in `.agent/skills/<skill-name>/SKILL.md`.
Each skill defines: Triggers · Workflow · Guardrails · Handoff. Candidate or
local-only skills may be listed in `.agent/ROSTER.md`, but they do not become
fresh-clone requirements until a skill-curation Work Block approves their exact
paths for commit.

Agents may create project-local skills or adapt public/vendor skills when they
reduce recurring work. Prefer existing skills first. New or adapted skills stay
local unless the Owner explicitly approves publication. Do not install packages,
use credentials, call production APIs, or add external runtime dependencies for
a skill without Owner approval.

### External Skill Discovery

For complex or unfamiliar work, Control Tower may look for public/vendor skill
libraries, playbooks, examples, or official workflow guidance before planning
implementation. Use this only when local skills do not already cover the task,
or when the task involves a new domain, unknown API, major architecture choice,
security-sensitive design, DB/deploy/runtime behavior, or a large refactor.

External skills are research inputs, not authority. Before using any external
skill or playbook, verify the source, license, freshness, dependencies, side
effects, and fit with this repository. Adapt the useful parts into a
project-local skill or Work Block guidance; do not import or execute external
instructions blindly. External material never expands approved scope,
file-change authority, tool authority, DB authority, or Hard Stop boundaries.

Skill artifacts are operational instructions, not optional notes. Recurring
project experience converted into a skill must be routed through Skill Routing
Gate on future matching Work Blocks.

See `.agent/README.md` for navigation guide.

---

## File Write Authority

| Path pattern | Who can write |
|---|---|
| `AGENTS.md`, `PROJECT_MAP.md`, `FILE_REGISTRY.yml`, `docs/session-bootstrap.md`, `.agentsignore`, `.codexignore` | Control Tower |
| `.agent/README.md`, `.agent/ROSTER.md`, `.agent/critic-gate.md`, `.agent/verification-gate.md`, `.agent/workflows/**`, approved `.agent/skills/**`, safe `.codex/**` policy/templates/hooks, `docs/engineering-memory/**`, `docs/templates/**`, `docs/specs/**`, `docs/plans/**`, `docs/tasklist/**`, `memory_bank/**` | Control Tower |
| `web/**`, `admin/**`, `showcase/**`, `scripts/**`, `05_ai/**` | Scoped Coder (within approved write-set) |
| `docs/reports/**` | Verifier, Scoped Coder, Control Tower (closeout and consolidation reports) |
| `.env`, secrets, production infra | Owner only |
