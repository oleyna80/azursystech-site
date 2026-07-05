# WB-2026-07-03 — SDLC Baseline Reconciliation

> Reconcile the advanced SDLC/agent layer from
> `origin/feature/showcase-demo-templates` into the current `main` product
> branch without losing recent showcase/product commits or committing private
> runtime state.

## Meta
- **Work Block ID:** WB-2026-07-03-sdlc-baseline-reconciliation
- **Date:** 2026-07-03
- **Owner:** Owner
- **Execution Mode:** staged approval
- **Side-Effect Class:** local-docs + workflow-script-control
- **DB Action Mode:** none
- **Verification Tier:** standard

## Lifecycle State
- **Current Stage:** Stage 2
- **Stage Execution State:** implementation in progress after Owner approved
  `Accept / adapt now`
- **Write Gate:** READY for the exact `Accept / adapt now` write-set in the
  inventory report
- **Owner Approval Evidence:** Owner: "согласен. собирай ВБ"; Owner:
  "подтверждаю" for Stage 1 inventory after critic supplement; Owner:
  "Accept / adapt now" for Stage 2 implementation of the exact inventory
  write-set
- **Critic Gate:** SUPPLEMENT
- **Verification Gate:** PENDING
- **Verification Verdict:** PENDING
- **Stage 3 Mode:** pending

## Objective
Determine the canonical SDLC baseline for `azursystech` and selectively
reconcile the more advanced SDLC/agent layer from
`azursystech-showcase-demo-templates` / `origin/feature/showcase-demo-templates`
into `/home/azur/Projects/WSL/azursystech` on current `main`.

The Work Block must preserve current `main` as the product/showcase authority
while using the feature branch as the SDLC donor/reference.

## Expected Final Result
`/home/azur/Projects/WSL/azursystech` remains the active development workspace
on the current product base, and its committed SDLC/control layer is updated to
the chosen canonical baseline:

- `main` product/showcase changes remain intact.
- Advanced SDLC rules from `feature/showcase-demo-templates` are reviewed and
  selectively applied.
- `AGENTS.md`, `PROJECT_MAP.md`, `FILE_REGISTRY.yml`, committed core
  `.agent/` files, `.codex/**` safe policy files, `docs/session-bootstrap.md`,
  and `docs/templates/**` no longer contradict each other.
- Private runtime config, secrets, `.env*`, provider keys, local transcripts,
  caches, and build outputs remain untracked.
- A verification report documents what was accepted, adapted, rejected, and why.
- Commit and push are blocked until a separate Owner commit/push approval.

## Done Criteria
- [x] Source of truth decision is recorded: active product workspace is
  `/home/azur/Projects/WSL/azursystech`; donor SDLC reference is
  `origin/feature/showcase-demo-templates`.
- [x] SDLC delta between `origin/main` and
  `origin/feature/showcase-demo-templates` is inventoried.
- [x] Files are classified as `accept`, `adapt`, `reject`, or `defer`.
- [x] Candidate globs are converted into an exact file-by-file implementation
  write-set.
- [x] Owner approves the exact implementation write-set before any Coder edits.
- [x] Critic gate evidence is recorded before implementation starts.
- [ ] Approved SDLC files are updated in `azursystech` without touching source
  application code.
- [ ] Local-only/private boundaries are verified.
- [x] Critic review is completed before implementation.
- [ ] Verification report is written and verdict is `READY` or blockers are
  documented.
- [ ] Repo state is either clean after an Owner-approved commit or dirty state
  is explicitly documented for the next decision.

## Preflight State
- **Git baseline:** dirty.
- **Target workspace:** `/home/azur/Projects/WSL/azursystech`
- **Target branch:** `main`
- **Target HEAD:** `0a73895 Fix showcase links and websites section`
- **Target remote:** `git@github.com:oleyna80/azursystech-site.git`
- **Donor workspace:** `/home/azur/Projects/WSL/azursystech-showcase-demo-templates`
- **Donor branch:** `feature/showcase-demo-templates`
- **Donor HEAD:** `7103191 docs(memory): SDLC retros + review/external-team logs`
- **Donor remote:** `git@github.com:oleyna80/azursystech-site.git`
- **Branch divergence:** `origin/main...origin/feature/showcase-demo-templates`
  reports `7 / 30` commits.
- **Pre-existing dirty files:** current SDLC/control sync in `azursystech`,
  including modified `AGENTS.md`, `.agent/ROSTER.md`, `.gitignore`,
  `docs/templates/*`, `scripts/bootstrap.sh`, and many untracked `.agent/`,
  `.codex/`, docs, reports, templates, `PROJECT_MAP.md`, `FILE_REGISTRY.yml`.
- **Untracked local artifacts:** no application build artifacts observed in the
  current preflight output; full ignore/private scan required in Stage 2.
- **Proceed rule:** proceed only with SDLC/control files. Do not touch
  `web/`, `admin/`, `showcase/`, SQL, deploy config, package files, source
  code, `.env*`, secrets, or private runtime config.

## Dependency Check
### Must Resolve Before Start
- Critic review of this plan must complete before implementation.
- Critic `SUPPLEMENT` findings must be resolved in this plan and recorded in a
  critic report before implementation.
- Owner must approve the reconciliation write-set after the inventory is
  available.
- Any decision to stage, commit, push, merge, or delete branches requires
  separate explicit Owner approval.

### Can Resolve During Work
- Exact accept/adapt/reject classification per donor file.
- Whether `.claude/**` should remain project-committed, partially committed, or
  treated as local runtime only.
- Which `.agent/skills/**` wrappers should be curated and committed in a later
  skill-curation Work Block.
- Whether `memory_bank/**` should remain local operational state while durable
  knowledge is promoted to `docs/engineering-memory/**`.

## Runtime / Data Mutation Boundary
- **Applies:** no
- **Agent authority:** planner/draft/read-only for inventory; approved docs
  authoring only after Owner approves implementation scope
- **Structured action:** not applicable
- **Trusted executor:** not applicable
- **Policy and approval:** no DB, production, deploy, payment, external provider,
  or live data mutation
- **Audit path:** this Work Block and verification report under `docs/reports/`
- **Forbidden direct path:** no deploy, no DB writes, no provider/API key changes,
  no force push, no destructive git operations

## Scope
### In Scope
- Compare `origin/main` with `origin/feature/showcase-demo-templates` for SDLC
  paths.
- Reconcile:
  - `AGENTS.md`
  - `PROJECT_MAP.md`
  - `FILE_REGISTRY.yml`
  - `.agent/README.md`
  - `.agent/ROSTER.md`
  - `.agent/critic-gate.md`
  - `.agent/verification-gate.md`
  - `.agent/workflows/**`
  - safe `.codex/**` policy/templates/hooks
  - `.codexignore`
  - `.agentsignore`
  - `.gitignore`
  - `docs/session-bootstrap.md`
  - `docs/engineering-memory/**`
  - `docs/templates/**`
  - `scripts/bootstrap.sh` as workflow/runtime script control only, owned by
    the single approved Scoped Coder write-set
  - relevant `docs/plans/**` and `docs/reports/**` evidence
- Define whether `azursystech-showcase-demo-templates` remains a donor branch,
  archival clone, or candidate cleanup target after successful reconciliation.

### Out of Scope
- `web/`, `admin/`, `showcase/`, `chat/`, SQL, deploy, CI runtime behavior,
  package/dependency changes, app source code, production config.
- `.env*`, credentials, provider tokens, API keys, private Claude/Codex config,
  local transcripts, caches, build output, `.next`, `dist`, `node_modules`.
- Commit, push, branch deletion, branch merge, force operations.
- Live Claude Code execution unless Owner explicitly requests it for review.

## Write-Set
Initial Stage 0 write-set:
```
docs/plans/WB-2026-07-03-sdlc-baseline-reconciliation.md
```

Candidate implementation write-set after Owner approval:
```
See docs/reports/inventory-WB-2026-07-03-sdlc-baseline-reconciliation.md
for the exact proposed Stage 2 write-set.
```

This candidate list was superseded by the exact `Accept / adapt now` inventory
write-set before implementation. No broad glob authorizes Stage 2 edits.

Explicitly excluded from write-set unless a later Owner decision expands scope:
```
.codex/config.toml
.claude/settings.local.json
.claude/agent-memory/**
memory_bank/**
.env*
web/**
admin/**
showcase/**
chat/**
web/sql/**
admin/sql/**
package.json
package-lock.json
docker-compose*.yml
.github/workflows/**
```

Deferred unless separately approved:
```
.claude/**
.agent/skills/**
```

## Navigation Impact
- **Files added/moved/removed:** likely yes; exact list after inventory.
- **PROJECT_MAP.md update needed:** yes; must record canonical SDLC baseline and
  clone/branch authority.
- **FILE_REGISTRY.yml update needed:** yes; must reflect final committed
  workflow files and local-only boundaries.
- **Session bootstrap or profile docs update needed:** yes; must align with the
  chosen startup read order.
- **Engineering memory update needed:** yes if decisions are promoted from
  operational logs.
- **Generated/derived/local-only boundary changed:** yes; `.claude/**`,
  `.codex/**`, `memory_bank/**`, and docs memory boundaries require explicit
  classification.

## Commit / Stage Scope
- **Files to stage/commit:** none until separate Owner commit approval.
- **Files to leave unstaged:** all pre-existing dirty files until the
  reconciliation inventory and Owner scope decision are complete.
- **Pre-implementation snapshot required:** before any implementation edit,
  capture `git status`, modified file list, untracked file list, and donor SDLC
  delta inventory in the reconciliation report.
- **Scope guard:** before any staging, run:
  - `git status --short --branch`
  - `git diff --name-only`
  - `git ls-files --others --exclude-standard`
  - targeted secret/private scan over proposed staged files

## Acceptance Criteria
- [ ] `azursystech` is confirmed as the active product development workspace.
- [ ] `feature/showcase-demo-templates` is treated as donor/reference, not as
  active product workspace.
- [ ] Every SDLC path differing between branches has a recorded disposition:
  `accept`, `adapt`, `reject`, or `defer`.
- [ ] The final SDLC layer is internally consistent across AGENTS, map,
  registry, bootstrap, workflow, gates, templates, and ignore rules.
- [ ] Subagent/critic/orchestrator-log requirements are explicit.
- [ ] Local-only provider/model/API settings are documented as private and
  untracked.
- [ ] `scripts/bootstrap.sh --check` passes.
- [ ] `git diff --check` passes.
- [ ] `FILE_REGISTRY.yml` parses as YAML.
- [ ] Secret scan over changed SDLC/docs files finds no live keys/tokens.

## Risks and Mitigations
| Risk | Impact | Mitigation | Stop Condition |
|---|---|---|---|
| Donor branch has newer SDLC but older product base | Product regression if merged blindly | Selective path-level reconciliation, no branch merge | Any required source/app merge appears |
| Committing private runtime state | Secret or local config leak | Explicit deny list and staged secret scan | Any `.env`, token, private config, or raw transcript detected |
| Conflicting memory model | Agents read stale/local authority | Choose one durable authority model and document boundary | Cannot resolve `memory_bank` vs `docs/engineering-memory` policy |
| Oversized skill import | Low-quality or stale skills become authority | Inventory and classify skills before commit | Skill includes project-invalid, secret, or obsolete behavior |
| Current dirty tree hides unrelated edits | Accidental staging | Pathspec staging only after Owner approval | Unrelated application/source changes appear |
| Broad glob authorizes accidental changes | Files outside Owner intent enter implementation | Convert globs to exact file list before Coder stage | Exact write-set cannot be agreed |
| Workflow script treated as docs-only | Runtime behavior changes without proper owner | Classify `scripts/bootstrap.sh` as workflow script control under Scoped Coder | Bootstrap change expands beyond SDLC checks |

## Hard Stops in Scope
- [ ] Production deploy
- [ ] Live DB migration
- [ ] Credential rotation
- [x] Destructive git ops
- [x] Commit or push
- [ ] Public release/publication
- [ ] Client communications

## Subagent Strategy
- **Classification:** Subagent-Required
- **Triggers matched:** 4+ files; governance/control layer; new or changed
  subagent topology; commit readiness; independent verification required.
- **Use Claude Code team:** conditional; not required for implementation. May be
  used as external reviewer only if Owner explicitly requests.
- **Claude Code process scope:** not applicable unless later approved.
- **Claude Code external report:** not applicable unless later approved.
- **Use Codex/GPT critic or verifier:** yes; read-only Critic review required
  before implementation, read-only Verifier required after implementation.
- **Dispatch plan:**
  1. Critic / Docs+Governance Analyst reviews this plan and risk model.
  2. Control Tower inventories branch delta and proposes file disposition.
  3. Critic gate evidence is recorded in `docs/reports/` and, if updated,
     `.agent/critic-gate.md`.
  4. Owner approves final exact implementation write-set.
  5. One Coder applies approved docs/control changes and approved
     workflow-script-control changes only.
  6. Verifier checks consistency, ignore boundaries, YAML, bootstrap, and secret
     scan.
- **Budget posture:** normal
- **Skip reasons:** none planned; if native subagent tooling is unavailable,
  record `blocked:tool-unavailable` and run inline fallback review.

## Skills
- **Checked:** current project workflow and Work Block template.
- **Matched:** critic-review, technical-discovery, context-snapshot,
  orchestrator-log, ssot-sync-closeout, verifier, scoped-commit-guard,
  shell-context-guard, memory-bank-manager.
- **Used:** Work Block template.
- **Skipped:** implementation skills skipped until Owner approves write-set.

## Verification Plan
- **Canonical checks:**
  - `git status --short --branch`
  - `git diff --check`
  - `bash -n scripts/bootstrap.sh`
  - `bash scripts/bootstrap.sh --check`
  - YAML parse for `FILE_REGISTRY.yml`
  - `git check-ignore` boundary probe for committed SDLC files and ignored
    private files
  - targeted secret scan over every proposed committed file in the exact
    `Accept / adapt now` write-set, excluding deferred `.agent/skills/**`
- **Scoped fallback checks:** if bootstrap is blocked, run shell syntax plus
  direct presence checks for session start files.
- **Browser smoke:** not applicable because app source and runtime behavior are
  out of scope.
- **App build/lint:** not applicable unless implementation unexpectedly changes
  app source; that would be a stop condition.
- **Evidence expected:** verification report under `docs/reports/`, command
  outputs summarized, final dirty/staged state documented.
- **Skipped checks:** app/browser checks skipped by scope, not by tool failure.

## Rollback / Recovery
- Before implementation, create an inventory report and use path-level diffs.
- Do not merge the donor branch directly.
- If implementation goes wrong before commit, revert only files changed by this
  Work Block using targeted patches or restore from `origin/main` after Owner
  approval.
- If a bad commit is made later, prefer a normal revert commit; do not rewrite
  history without explicit Owner approval.

## Execution Log
| Time | Stage | Action / Decision | Evidence | Status |
|---|---|---|---|---|
| 2026-07-03 | Stage 0 | Confirmed both workspaces share same remote | `git remote -v` | done |
| 2026-07-03 | Stage 0 | Confirmed target branch and donor branch | `git branch -vv` | done |
| 2026-07-03 | Stage 0 | Confirmed divergence | `git rev-list --left-right --count origin/main...origin/feature/showcase-demo-templates` = `7 / 30` | done |
| 2026-07-03 | Stage 0 | Created reconciliation Work Block | this file | done |
| 2026-07-03 | Stage 0 Review | Critic review returned `SUPPLEMENT`; implementation must wait for exact write-set and gate evidence | `docs/reports/critic-WB-2026-07-03-sdlc-baseline-reconciliation.md` | done |
| 2026-07-03 | Stage 1 Inventory | Classified donor/local SDLC paths and converted candidate globs to exact proposed Stage 2 write-set | `docs/reports/inventory-WB-2026-07-03-sdlc-baseline-reconciliation.md` | done |
| 2026-07-03 | Stage 2 Implementation | Owner approved `Accept / adapt now`; implementation limited to exact inventory write-set | active conversation + inventory report | done |
| 2026-07-03 | Stage 3 Review | Post-implementation Critic returned `SUPPLEMENT`; findings addressed in approved control/docs scope except tracked runtime cleanup deferred to a future WB | `docs/reports/critic-WB-2026-07-03-sdlc-baseline-reconciliation.md` | done |
| 2026-07-03 | Stage 3 Verification | Control-layer checks, ignore-boundary probe, hook probe, YAML parse, and targeted secret scan completed | command outputs in session | done |

## Closeout and Retrospective
Complete this section after implementation and verification.

### Result Summary
- **Final Result:** SDLC navigation/control baseline accepted/adapted into the
  active `azursystech` project within the Owner-approved write-set.
- **Closeout Classification:** implementation complete; commit decision
  pending Owner approval.
- **Task Status:** ready for Owner commit decision, with one deferred cleanup
  risk recorded.
- **Verification Evidence:** `git diff --check`, `bash -n
  scripts/bootstrap.sh`, `bash scripts/bootstrap.sh --check`, `python3 -m
  py_compile .codex/hooks/stage0_write_gate.py`, YAML parse of
  `FILE_REGISTRY.yml`, targeted `git check-ignore`, targeted secret scan, and
  write-gate denial probe via `python3 .codex/hooks/stage0_write_gate.py`.
- **Residual Risks:** existing tracked runtime payloads under `.claude/**` and
  `.agent/skills/impeccable/**` still require a separate cleanup/curation Work
  Block before the repository can claim full Git-tracked private/runtime
  separation.

### Critic and Review Value
- **Critic used:** yes, read-only Critic / Docs+Governance Analyst
- **Critic verdict:** SUPPLEMENT at Stage 0 and post-implementation Review
- **What the critic caught:** `scripts/bootstrap.sh` write-authority mismatch,
  overly broad candidate glob write-set, missing explicit gate evidence update
  before implementation, verification wording gaps, committed write gate left
  open, incomplete runtime ignore boundaries, tracked legacy runtime payloads,
  cross-runtime gate divergence, bootstrap ownership drift, and template
  vocabulary drift.
- **What the critic missed:** no known misses after post-implementation pass
- **Skip/fallback reason:** not applicable unless critic is unavailable

### Lessons Learned
- **What worked:** exact file-by-file inventory prevented donor branch blind
  merge and kept application source, secrets, runtime config, dependencies,
  database, and deploy files out of scope.
- **What did not work:** broad language like `.agent/**` and “runtime local”
  was too strong while legacy tracked runtime paths still existed.
- **What not to repeat:** do not commit live `READY` gate state as baseline
  project state.
- **Evidence wording check:** runtime boundary is now stated as target policy
  plus explicit legacy tracked exception, not as already fully complete.
- **Framework updates made:** gate template hardening, hook expiry guard,
  context ignore expansion, bootstrap ownership alignment, Work Block template
  vocabulary alignment, skill/Claude runtime cleanup boundary.
- **Framework updates to consider:** separate skill-curation and Claude runtime
  cleanup Work Blocks; optional hook path-scope enforcement if future
  automation needs stronger write-set enforcement.
- **Reusable knowledge created:** SDLC baseline reconciliation inventory,
  critic report, engineering-memory templates, mission/work-block templates,
  session bootstrap, and bootstrap health check.
- **Engineering memory classification:** committed engineering-memory template
  layer only; active `memory_bank/**` remains local/deferred.
- **Navigation updates:** `PROJECT_MAP.md`, `FILE_REGISTRY.yml`,
  `docs/session-bootstrap.md`, `.agent` workflow files, `.codex` policy files,
  and ignore/context boundaries updated.
- **Follow-up Work Blocks:** curate/untrack `.agent/skills/**`, decide
  `.claude/**` public-vs-local policy, review existing unrelated dirty
  docs/reports/plans, optional hook path-scope enhancement.
