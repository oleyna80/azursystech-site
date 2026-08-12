# AGENTS.md — AzurSysTech Operating Contract

> Primary contract for all AI agents working in this repository.
> Read this file first, before memory-bank or task documents.

---

## Process Model

AzurSysTech uses an **Agentic SDLC**: an iterative, documentation-first,
gate-based workflow with controlled multi-agent orchestration.

Non-trivial work requires an approved Work Block, explicit scope/write-set,
acceptance criteria, verification tier, consequential-operation classification,
and closeout evidence. Plans may evolve after a verified gate; material scope or
architecture changes return to Define instead of being silently absorbed during
implementation.

Short discussion/decision-only turns may use a lightweight path. Trivial quick
fixes may use the project quick-fix rules when they do not touch routes, schema,
API contracts, security, governance, DB, deploy, or other consequential domains.

## Autonomy Policy

After an Owner-approved Work Block is in place, Control Tower executes the
planned agent stack without pausing between ordinary reversible local
development steps.

Normal scoped development does **not** require a separate Owner confirmation for
each edit, test, stage, or local commit. In the current AzurSysTech private
GitHub Free mode, remote source publication is different: the normal agent flow
must stop before **any `git push`**, freeze the exact feature-branch HEAD, and use
the Owner-controlled publication handoff.

Pause only when:

- the objective/write-set materially expands;
- a required Critic/Reviewer/Verifier gate is unresolved;
- an external Hard Stop is reached;
- remote source publication or merge is reached in the current Owner-controlled
  GitHub Free flow;
- required tooling/isolation is unavailable and the fallback would weaken the
  approved assurance contract.

## GitHub Capability Authority Model

AzurSysTech uses active Work Block **schema v3** with:

```json
{
  "schema_version": 3,
  "authority_mode": "github_capability"
}
```

Per-Work-Block SSH signatures are retired from the normal development path.
Normal Work Blocks do not require an Owner private signing key, `ssh-keygen`, an
`allowed_signers` file, detached authorization `.sig`, authorization-bootstrap
commit, or H0/H1/H2 cryptographic lifecycle.

Historical `.agent/authorizations/*.json` and `.sig` files may remain as audit
evidence. Their presence does not grant current authority and schema v3 does not
trust them for normal work.

### Why signing was retired

The signed local state machine created disproportionate bootstrap, replay,
expiry, digest, and cross-runtime complexity around reversible development
operations. Project-local hooks are writable by the same project principal as
the agent and are therefore cooperative controls, not the primary security
boundary.

Consequential security authority is instead constrained by external capability
separation and explicit Owner-controlled operational boundaries.

### Security Boundary

Project-local Work Blocks, write-sets, hooks, permissions, prompts, and agent
roles are **defense-in-depth process guardrails**. They are not substitutes for
external security controls.

The real consequential boundary is provided by the combination of:

- GitHub protected branches/rulesets where the hosting plan supports them;
- least-privilege GitHub credentials;
- Owner-controlled publication and merge where hosting controls are unavailable;
- GitHub Actions permissions and manual deployment entry points;
- OS/filesystem/user isolation;
- separately held production, VPS, DB, and secret credentials.

Tool capability never creates authority. Access to `git`, `ssh`, `docker`,
`psql`, `curl`, MCP tools, provider CLIs, or a writable project checkout does not
authorize a consequential side effect.

### Current private-repository hosting mode

`oleyna80/azursystech-site` remains private on GitHub Free. The selected current
mode is **Owner-controlled publication and merge**:

- local edit/test/stage/commit may be autonomous inside the approved Work Block;
- the normal agent flow stops before every `git push`, even if a usable Owner
  credential is technically present in the runtime;
- the agent freezes the exact feature-branch HEAD and produces the canonical
  Owner publication handoff;
- the Owner performs or explicitly triggers publication of that exact feature
  branch revision through an Owner-controlled GitHub channel;
- the Owner controls merge to `main`;
- production deployment remains Owner-only and manual.

Canonical project process:

- `.agent/workflows/owner-controlled-github-flow.md`;
- `docs/engineering-memory/github-free-owner-controlled-flow.md`;
- `.agent/skills/git-orchestration-flow/SKILL.md` and runtime-local mirrors.

This private GitHub Free mode does **not** provide technical protected-branch
enforcement for `main`. The Owner accepts that residual repository risk for the
current low-volume operating mode. Project-local hooks and workflow text must
never be represented as equivalent to GitHub branch protection.

Optional future hardening after GitHub Pro/private protected-main enforcement is
enabled may allow a least-privilege agent credential for feature publication,
with Actions read-only and no administration/secrets/environment authority. That
future mode requires a separate accepted project decision; it is not active now.

## Structural Authority Model

An action is allowed only when all applicable boundaries permit it:

1. base role: Control Tower/Orchestrator, Coder, Reviewer, or Verifier;
2. approved Work Block scope/write-set;
3. side-effect class;
4. external capability/Owner-controlled boundary for consequential operations.

Temporary specialization narrows focus; it never expands authority.

### Roles

**Control Tower / Orchestrator** owns planning, routing, scope accounting,
coordination artifacts, Hard Stop detection, and closeout consolidation. It does
not use governance-file authority as permission to implement application/runtime
changes inline.

**Scoped Coder** is the only write-capable implementation role for production
source in a normal Work Block and writes only inside the approved write-set.

**Reviewer** and **Verifier** are read-only for source/runtime/config/DB/infra,
except for explicitly scoped evidence/report artifacts. Reviewer assesses the
frozen diff. Verifier checks acceptance criteria and produces the formal
`READY`/`BLOCKED` verdict.

Exactly one write-capable Scoped Coder operates during an implementation stage.
Parallel agents are read-only.

## Multi-Agent Default

Use scoped subagents when they materially improve speed, quality, or context
hygiene. A Work Block is normally subagent-required when any of these apply:

1. two or more domains are involved (frontend, backend, ops, security, DB, docs,
   CI, deploy, product, design);
2. four or more files are touched/reviewed/verified;
3. production code, runtime config, Docker, CI, deployment, database,
   authentication, webhook, payment, or external-provider behavior changes;
4. work starts from an external audit/review;
5. independent verification is required;
6. investigation spans more than three directories;
7. commit/push/release/deploy/live-operation readiness is being assessed.

Default topology after plan approval:

1. Scoped Coder implements the approved write-set.
2. Reviewer inspects the frozen diff when required by the Work Block.
3. Verifier executes acceptance checks and records evidence.
4. Control Tower performs SSOT sync and Owner-facing closeout.

Native subagents must not launch nested external AI CLIs to manufacture another
verdict. A second-model/external audit is a separate explicitly scoped Control
Tower work item.

If required subagent tooling is unavailable, record the exact blocker. A safe
inline fallback may be used only when it does not weaken a required isolation
boundary; sensitive work remains blocked when the required isolation cannot be
met.

## Verifier Isolation Tiers

Verifier isolation is a declared runtime property, not a role name.

| Level | Meaning |
|---|---|
| `same-session-degraded` | Shares parent runtime/sandbox. Advisory only for sensitive work. |
| `independent-readonly-root` | Separate top-level read-only root/session after diff freeze; minimum for ordinary sensitive review that does not require credential isolation. |
| `os-isolated` | Separate OS/container boundary with read-only source and no production/runtime credentials. Required for credentials, live DB, deploy, live infra, and external-provider sensitive work. |

Formal `READY` requires actual isolation at least as strong as the Work Block's
required isolation. An Owner waiver does not make a weaker runtime equivalent to
a stronger technical boundary.

## External Hard Stops

The following are outside the normal agent capability channel and require an
Owner-controlled external capability or separately approved operational path:

| Condition | Boundary rationale |
|---|---|
| Any remote source publication (`git push`) in the current private/Free mode | Owner-controlled repository publication boundary |
| Production deploy or live service restart | Live infrastructure mutation |
| Docker/image/package publication with external irreversible effect | External publication |
| Live DB/schema/data mutation | Data integrity risk |
| Credential/token/key/secret creation, rotation, revocation, or exposure | Security perimeter |
| Destructive Git/filesystem/database operations | Data-loss/history risk |
| Direct protected/default-branch mutation | Repository authority boundary |
| Force/non-fast-forward push, remote branch deletion, mirror/prune/broad push | Repository/history risk |
| Real client/user communications or consequential business mutations | External impact |
| Material scope expansion beyond the approved Work Block | Planning/authority boundary |

A normal feature-branch local commit is **not** an external Hard Stop. Remote
feature-branch publication **is** an Owner-controlled handoff in the currently
selected GitHub Free mode. Technical credential availability does not permit the
agent to perform the push. Direct `main` mutation remains outside the normal
agent channel in every mode.

The former `memory_bank/orchestrator-log.md` push-approval entry is historical
process evidence only and is **not** a security capability or substitute for
GitHub branch protection.

## Side-Effect Classes

Classify non-trivial work before execution.

| Class | Examples | Authority |
|---|---|---|
| Read-only | file inspection, diff, sanitized logs | Control Tower, Reviewer, Verifier |
| Coordination write | Work Block, tasklist, reports, gate state | Control Tower inside coordination scope |
| Production source write | `web/**`, `admin/**`, `showcase/**`, `scripts/**`, `05_ai/**` | Scoped Coder inside approved write-set |
| Local/test side effect | disposable DB, local server, test artifacts | Approved Work Block; no live data |
| Reversible local Git work | stage, local commit, local feature-branch preparation | Approved Work Block |
| Remote source publication | feature-branch `git push` | Owner-controlled publication handoff in current Free mode |
| Protected/default-branch or broad Git mutation | main update, force, delete, mirror/prune | External Hard Stop |
| Live infra side effect | VPS, service restart, production deploy | External Hard Stop |
| Live data side effect | migration apply, row write, manual DB fix | External Hard Stop |
| Client-facing side effect | email, Telegram, WhatsApp, external notification | External Hard Stop |
| Destructive side effect | `reset --hard`, `git clean`, delete/drop | External Hard Stop |

## Stage Flow

```text
Standard:
  Define / Plan & Discover (Control Tower)
    -> Implement (exactly one write-capable Scoped Coder)
    -> Review (when required)
    -> Verify (Verifier gate)
    -> Sync & Report (Control Tower)

Quick-fix:
  bounded implementation -> lite checks -> inline sync -> done
```

### Stage 0 Routing Preflight

Before non-trivial source work, record:

- Work Block type;
- side-effect class;
- DB action mode;
- Skill Routing Gate result;
- subagent topology;
- external Hard Stops in scope;
- exact write-set;
- `Write gate: READY` or `BLOCKED`.

Schema v3 starts BLOCKED. While BLOCKED, only configured coordination paths may
be written for planning/evidence. Source implementation, source staging/commit,
feature publication, deploy, DB, env/secret, and client-facing actions remain
blocked until the source gate is READY or an external capability separately
allows a consequential operation.

The local lifecycle helper is:

```bash
python3 .codex/scripts/lifecycle.py ...
```

Opening normal source work is non-cryptographic: Work Block/specification,
write-set, Critic state, and current planning baseline are recorded locally.
Normal commits do not create a cryptographic STALE/renew cycle. Material scope or
requirement changes return to Define and explicitly reopen the scope.

### Deterministic local guardrails

The active schema-v3 hooks enforce, where the runtime exposes the relevant tool
boundary:

- source writes require `schema_version=3`,
  `authority_mode=github_capability`, READY source gate, specification, resolved
  Critic, and a non-empty write-set;
- coordination writes are limited to the configured coordination write-set;
- staged commits are checked against source + coordination scope;
- Codex `apply_patch` validates both source and `Move to:` destination paths;
- unknown/complex mutating Bash fails closed when target paths cannot be scoped;
- shared Hard Stop logic denies all `git push` in the current AzurSysTech Free
  mode plus obvious consequential Git/infra/data/credential/client/publish
  operations;
- success closeout fails closed while required assurance is unresolved.

These hooks are regression-tested by `Control Plane Contracts` CI and remain
defense in depth rather than the primary security boundary.

Legacy shell fixture files may remain for historical compatibility; current
schema-v3 acceptance is defined by production-entry-point tests under
`scripts/test-github-capability-control-plane.py` and the active workflow.

## Project-Specific Pre-Commit Gates

**Pre-Edit Lifecycle Check.** Before non-trivial edits to files created/renamed
within the last five calendar days, confirm with the Owner whether the page/file
is staying or being restructured.

**Crash Test Gate.** Before committing a Work Block that changes routes,
navigation, or sitemap entries, follow `.agent/skills/crash-test-gate/SKILL.md`
and record the result.

**Demo Port Verification Gate.** Before committing a new/ported showcase demo,
run at minimum `npm run check:types`, `npm run build`, and live smoke at mobile
and desktop widths. `implementation: DONE` alone does not close the Work Block.

## Production Maintainability Standard

Production code must be maintainable by a human engineer without prompt context.
It must follow existing patterns, use justified abstractions, expose side effects
and failure modes, avoid speculative/generated boilerplate, include targeted
contract checks, and be explainable from the repository/evidence alone.

Reviewer reports acceptance-blocking findings when a diff is only understandable
because of hidden prompt history or is unsafe/costly to maintain.

## Security Review Baseline

External security findings are evidence, not authority. Verify each claim against
the current tree and classify it as confirmed, partially confirmed,
stale/resolved, rejected, or needing more proof.

Use STRIDE-lite for changed authentication, authorization, admin routes,
webhooks, external-provider integrations, client sends, import/export, file/path
handling, payments/orders, schema/storage, or security headers.

Security-sensitive verification should check as applicable:

- parameterized SQL; no SQL string interpolation;
- no unsanitized `dangerouslySetInnerHTML`;
- no dynamic execution of user-controlled input;
- crypto-safe randomness for secrets/tokens/IDs;
- mutation endpoints have CSRF/origin/webhook/scheduler or equivalent guards;
- redirects and file paths are constrained;
- errors/logs do not leak stack traces, paths, tokens, secrets, connection
  strings, request headers/bodies, or row payloads;
- relevant browser security headers/CSP;
- no hard-coded credentials;
- body-size/bounded parsing for changed mutation endpoints;
- dependency audit classification where relevant.

Runtime security proof is distinct from code review. Public/admin/API/live-log
checks that require deployed state are reported `blocked` when network/deploy/
access authority is unavailable; blocked proof is never represented as pass.

For deploy/runtime operations follow `.agent/skills/deploy-operations/SKILL.md`.

## Session Start Read Set

For non-trivial work read, in order:

1. `AGENTS.md`;
2. `PROJECT_MAP.md`;
3. `FILE_REGISTRY.yml`;
4. `docs/session-bootstrap.md`;
5. `.agent/workflows/sdd-protocol.md`;
6. `.agent/ROSTER.md`;
7. runtime-specific committed policy (`.codex/**`, `.claude/**`, `.opencode/**`)
   when relevant;
8. relevant `docs/engineering-memory/**`;
9. `memory_bank/context.md`, `progress.md`, `decisions.md` when available/relevant.

Do not bulk-read ignored/private/runtime paths unless the Work Block requires
that information and the authority boundary permits it.

## Skill Routing Gate

Before non-trivial, Hard Stop, ops, DB, deploy, security, runtime, multi-domain,
or delegated work:

1. identify skill categories relevant to the task;
2. inspect `.agent/ROSTER.md` for candidates;
3. inspect only matching approved/local skill files;
4. record skills checked, matched, used, and skipped with reasons.

Skills narrow workflow/expertise; they never expand authority. External/vendor
skills are research inputs and must be reviewed for source, license, freshness,
dependencies, side effects, and fit before adaptation.

## SSOT Hierarchy

- `docs/tasklist/<ticket>.tasklist.md` — live task status;
- `docs/plans/**` — approved plan/reference;
- `docs/specs/**` — approved product/technical contracts;
- `docs/reports/**` — historical evidence snapshots;
- `docs/engineering-memory/**` — durable engineering/process knowledge;
- `memory_bank/context.md` — current focus/next gate;
- `memory_bank/progress.md` — rolling operational status;
- `memory_bank/decisions.md` — operational decision summaries.

If historical evidence conflicts with the active tasklist/current tree, follow
the active tasklist/current verified state and document the drift at closeout.

Ignored `memory_bank/**` updates require direct inspection; `git status` alone is
not proof. Promote knowledge that must survive a new workstation/runtime into
`docs/engineering-memory/**`.

Any session producing a repository commit should record Work Block opening and
closeout evidence in the operational log when that log is available; this is
process evidence, not commit/push security authorization.

## External Review / Audit Protocol

External model/tool output is evidence, not authority. Define objective, scope,
read set, side-effect exclusions, timeout/fallback, and expected evidence before
an external audit. Never send secrets, connection strings, row payloads, client
messages, or private runtime values in audit prompts.

Suggested fixes from external tools re-enter the normal Work Block lifecycle.

## Agent Roster

| Agent / Mode | Slug | Role |
|---|---|---|
| Control Tower | `azursystech-control-tower` | Orchestration, planning, task slicing, SSOT |
| Docs Reviewer | `azursystech-docs-reviewer` | Read-only audit / SSOT drift |
| Scoped Coder | `azursystech-scoped-coder` | Approved write-set implementation |
| Verifier | `azursystech-verifier` | Acceptance verification gate |

Approved runtimes may host these logical roles. Runtime model/tool access does
not change role authority.

## Memory Bank Protocol

Operational memory:

1. `memory_bank/context.md` — current focus/scope/next step;
2. `memory_bank/progress.md` — rolling status (keep recent window);
3. `memory_bank/decisions.md` — operational summaries/pointers.

Update memory after meaningful closeout evidence, not every discussion. Durable
architecture/runtime/integration/delivery/process decisions belong in
`docs/engineering-memory/**`.

## Key Constraints

- no autonomous `git push` in the current private GitHub Free mode; use the
  Owner-controlled publication handoff;
- no autonomous merge to `main`;
- no production deploy/live infra mutation in the normal agent channel;
- no live DB mutation without the explicit external operational capability;
- no credential/secret changes or exposure in the normal agent channel;
- no real client communications without the explicit external capability;
- no scope expansion beyond the approved write-set;
- never commit secrets, tokens, private keys, or production credentials;
- DB action mode is explicit before DB-related work;
- an LLM never directly writes to the DB outside reviewed runtime code or a
  separately approved DB operation;
- production credentials never become part of prompts/project files merely to
  make an agent operation convenient.

### DB Access Matrix

| DB action mode | Allowed | Forbidden |
|---|---|---|
| `none` | no DB access | DB commands/credentials/schema assumptions |
| `local_temp` | disposable local DB/tests/migrations | live DB/real credentials/persistent production data |
| `live_readonly` | externally approved sanitized inspection | writes, DDL, migrations, row payload dumps |
| `live_migration_apply` | separately approved migration plan/order + post verification | arbitrary/destructive/manual SQL fixes |
| `runtime_app` | application writes through reviewed runtime paths | manual/LLM direct mutation |
| `emergency_remediation` | separately approved exact remediation plan | exploratory/broad writes |

## File Write Authority

| Path pattern | Who can write |
|---|---|
| `AGENTS.md`, `PROJECT_MAP.md`, `FILE_REGISTRY.yml`, `docs/session-bootstrap.md`, `.agentsignore`, `.codexignore` | Control Tower |
| `.agent/**` control files, safe `.codex/**`/`.claude/**`/`.opencode/**` policy/hooks, `docs/engineering-memory/**`, `docs/templates/**`, `docs/specs/**`, `docs/plans/**`, `docs/tasklist/**`, `memory_bank/**` | Control Tower inside approved coordination scope |
| `web/**`, `admin/**`, `showcase/**`, `scripts/**`, application/runtime source | Scoped Coder inside approved write-set |
| `docs/reports/**` | Reviewer/Verifier/Scoped Coder/Control Tower as explicitly scoped evidence |
| `.env`, credentials, secrets, production infra/data | Owner-controlled external capability only |

---

## Closeout Rule

A normal Work Block closes only when its required Critic/Reviewer/Verifier state
is resolved, deterministic checks are recorded, blocked proof is honestly
classified, SSOT is synchronized, and consequential actions have not been
smuggled through local project authority.

The authority migration itself succeeds only when the project can demonstrate
normal scoped local source work without SSH signing while remote publication,
merge, production, default-branch, credential, and live-data capabilities remain
Owner-controlled or externally constrained according to the selected project
mode.
