# WB-2026-07-03 Sync Engineering Memory

## Meta
- **Work Block ID:** WB-2026-07-03-sync-engineering-memory
- **Date:** 2026-07-03
- **Owner:** azur
- **Execution Mode:** end-to-end autonomous
- **Side-Effect Class:** local-docs
- **DB Action Mode:** none
- **Verification Tier:** lite

## Lifecycle State
- **Current Stage:** Stage 3
- **Stage Execution State:** completed
- **Write Gate:** READY
- **Owner Approval Evidence:** user requested SDLC documentation check and engineering memory transfer into `azursystech`
- **Critic Gate:** SKIPPED
- **Verification Gate:** READY
- **Verification Verdict:** READY
- **Stage 3 Mode:** success-closeout

## Objective
Synchronize the `azursystech` project-level Agentic SDLC layer with the current
framework conventions for durable project engineering memory, navigation, and
project-local skills.

## Expected Final Result
A new Codex, Claude Code, OpenCode, Antigravity, Gemini, DeepSeek, or future
agent can enter `azursystech`, read the documented bootstrap set, understand
where durable engineering memory lives, route through the current SDD workflow
and project skills, and run the local bootstrap check without relying on old
chat context.

## Done Criteria
- [x] `docs/engineering-memory/` exists with a project-specific README,
  source-of-truth chains, temporary decision register, reproducibility log, and
  decision record template.
- [x] `PROJECT_MAP.md`, `FILE_REGISTRY.yml`, and `docs/session-bootstrap.md`
  exist and describe `azursystech`, not framework placeholders.
- [x] `.agent/workflows/sdd-protocol.md` and project-local skills are available
  for new agents.
- [x] `AGENTS.md`, `.agent/ROSTER.md`, `.gitignore`, and `scripts/bootstrap.sh`
  are consistent with the durable-memory model.
- [x] Bootstrap and syntax checks pass or any residual risk is documented.

## Preflight State
- **Git baseline:** clean before edits: `## main...origin/main`
- **Pre-existing dirty files:** none observed before edits
- **Untracked local artifacts:** none relevant before edits
- **Proceed rule:** local documentation/workflow changes only; no production
  source, DB, deploy, secrets, or dependency changes.

## Dependency Check
### Must Resolve Before Start
- None.

### Can Resolve During Work
- Decide whether `memory_bank/` is committed or generated locally by bootstrap.
  Current decision: durable memory is committed under `docs/engineering-memory/`;
  operational `memory_bank/` remains local runtime state and bootstrap creates
  missing starter files.

## Runtime / Data Mutation Boundary
- **Applies:** no
- **Agent authority:** not applicable
- **Structured action:** not applicable
- **Trusted executor:** not applicable
- **Policy and approval:** not applicable
- **Audit path:** this Work Block
- **Forbidden direct path:** DB, deploy, secrets, production runtime changes

## Scope
### In Scope
- Agentic SDLC navigation and memory docs.
- Bootstrap and ignore-rule alignment for project-local agent files.
- Project-local skill synchronization from `agentic-sdlc-framework`.

### Out of Scope
- Application code in `web/`, `admin/`, `showcase/`, or `chat/`.
- Production deployment, database changes, dependency updates, env/secrets.
- Replacing the project-specific `AGENTS.md` with a generic template.

## Write-Set
```
AGENTS.md
PROJECT_MAP.md
FILE_REGISTRY.yml
.gitignore
.agentsignore
.codexignore
.agent/ROSTER.md
.agent/README.md
.agent/critic-gate.md
.agent/verification-gate.md
.agent/workflows/sdd-protocol.md
.agent/skills/**
.codex/**
docs/session-bootstrap.md
docs/engineering-memory/**
docs/templates/**
docs/plans/WB-2026-07-03-sync-engineering-memory.md
scripts/bootstrap.sh
```

## Navigation Impact
- **Files added/moved/removed:** added durable memory, navigation registry,
  Codex runtime scaffold, SDD protocol, and project-local skills.
- **PROJECT_MAP.md update needed:** yes, file added.
- **FILE_REGISTRY.yml update needed:** yes, file added.
- **Session bootstrap or profile docs update needed:** yes, session bootstrap
  added.
- **Engineering memory update needed:** yes, directory added.
- **Generated/derived/local-only boundary changed:** yes, `.gitignore` adjusted
  so committed SDLC files are visible while runtime/cache/secrets stay ignored.

## Commit / Stage Scope
- **Files to stage/commit:** only files in the Write-Set after verification and
  explicit Owner commit approval.
- **Files to leave unstaged:** local runtime logs, caches, build output,
  secrets, `.env*`, `node_modules`, `.next`.
- **Scope guard:** `git status --short`, `git diff --name-only`, and
  `git check-ignore -v` for key SDLC paths.

## Acceptance Criteria
- [x] `scripts/bootstrap.sh` passes from repository root.
- [x] `bash -n scripts/bootstrap.sh` passes.
- [x] Key committed SDLC files are no longer ignored by `.gitignore`.
- [x] `PROJECT_MAP.md` and `FILE_REGISTRY.yml` list the durable-memory layer.
- [x] `AGENTS.md` no longer treats `memory_bank/decisions.md` as the primary
  durable ADR store.

## Risks and Mitigations
| Risk | Impact | Mitigation | Stop Condition |
|---|---|---|---|
| Overwriting project-specific rules with generic framework text | Agents lose local constraints | Patch only targeted sections; preserve `AGENTS.md` and `ROSTER` structure | If local rule meaning becomes ambiguous |
| Too many copied skills create noise | Agents over-read | Keep Skill Routing Gate relevance filter; registry points to routing-critical skills | If bootstrap or docs become inconsistent |
| Committing operational logs | Local/private noise in Git | Keep `memory_bank/` local-generated by bootstrap | If existing memory contains private data |

## Hard Stops in Scope
- [ ] Production deploy
- [ ] Live DB migration
- [ ] Credential rotation
- [ ] Destructive git ops
- [ ] Commit or push
- [ ] Public release/publication
- [ ] Client communications

## Subagent Strategy
- **Classification:** Single-Agent
- **Triggers matched:** documentation sync, workflow-layer sync, skill sync
- **Use Claude Code team:** no; this is framework transfer into one project and
  does not need external execution.
- **Use Codex/GPT critic or verifier:** no separate critic in this WB; verify
  with direct file and shell checks.
- **Dispatch plan:** single Codex orchestrator/coder/verifier sequence.
- **Budget posture:** normal.
- **Skip reasons:** subagents would add coordination overhead for mostly
  mechanical docs/workflow synchronization.

## Skills
- **Checked:** memory-bank-manager, ssot-sync-closeout, scoped-coder,
  codex-verification, shell-context-guard
- **Matched:** memory-bank-manager, ssot-sync-closeout, shell-context-guard
- **Used:** manual project-local workflow following AGENTS.md and framework
  templates
- **Skipped:** frontend/security/deploy skills, not relevant to this WB

## Verification Plan
- **Canonical checks:** `bash -n scripts/bootstrap.sh`,
  `scripts/bootstrap.sh`, `git check-ignore -v` on key SDLC paths,
  `git diff --check`.
- **Scoped fallback checks:** direct `rg -n` inspections if bootstrap must
  create local ignored runtime files.
- **Browser smoke:** not applicable.
- **Evidence expected:** command output and changed-file list.
- **Skipped checks:** app builds/tests, because application code is out of
  scope.

## Rollback / Recovery
Revert only this Work Block's files if needed after explicit Owner approval.
Do not reset unrelated repository state.

## Execution Log
| Time | Stage | Action / Decision | Evidence | Status |
|---|---|---|---|---|
| 2026-07-03 | Stage 0 | Baseline checked and missing SDLC files identified | `git status`, `find`, `test`, `git check-ignore -v` | completed |
| 2026-07-03 | Stage 0 | Work Block created | this file | completed |
| 2026-07-03 | Stage 1 | Durable memory, project map, file registry, session bootstrap, SDD workflow, Codex scaffold, and skills added | `PROJECT_MAP.md`, `FILE_REGISTRY.yml`, `docs/engineering-memory/**`, `.agent/**`, `.codex/**` | completed |
| 2026-07-03 | Stage 2 | Project rules aligned to durable-memory model | `AGENTS.md`, `.agent/ROSTER.md`, `.gitignore`, `scripts/bootstrap.sh` | completed |
| 2026-07-03 | Stage 3 | Verification completed | `bash -n scripts/bootstrap.sh`, `scripts/bootstrap.sh`, `git check-ignore -v`, `git diff --check`, `rg` placeholder scan | completed |

## Closeout and Retrospective
### Result Summary
- **Final Result:** `azursystech` now has a committed navigation and durable
  engineering-memory layer, a current SDD workflow, a project-local skill
  library, and bootstrap that creates ignored operational `memory_bank` starter
  files locally.
- **Closeout Classification:** SUCCESS
- **Task Status:** completed
- **Verification Evidence:** `bash -n scripts/bootstrap.sh`; `scripts/bootstrap.sh`;
  `git check-ignore -v PROJECT_MAP.md FILE_REGISTRY.yml
  docs/engineering-memory/README.md docs/plans/WB-2026-07-03-sync-engineering-memory.md
  .agent/workflows/sdd-protocol.md .agent/skills/frontend-design/SKILL.md
  .agent/skills/impeccable/reference/audit.md .codex/critic.md .agentsignore
  .codexignore memory_bank/context.md`; `git diff --check`; `rg` placeholder scan.
- **Residual Risks:** Application checks were intentionally skipped because no
  `web/`, `admin/`, `showcase/`, or production source files were changed.

### Critic and Review Value
- **Critic used:** no separate critic
- **Critic verdict:** SKIPPED
- **What the critic caught:** not applicable
- **What the critic missed:** not applicable
- **Skip/fallback reason:** this was a local docs/workflow synchronization WB;
  verification used direct repository checks instead.

### Lessons Learned
- **What worked:** keeping durable engineering memory in committed docs while
  bootstrap creates ignored operational `memory_bank` files solves fresh-clone
  startup without committing local runtime logs.
- **What did not work:** the old `.gitignore` treated SDLC files as indexing
  noise, so new project-memory files would have been invisible to Git.
- **What not to repeat:** do not make `memory_bank/decisions.md` the durable ADR
  store; it is runtime memory and should point to promoted records.
- **Evidence wording check:** this WB demonstrated the bootstrap path and
  validated the static checks listed above.
- **Framework updates made:** project-level sync only; no base framework changes.
- **Framework updates to consider:** add a documented project sync command later
  if repeated project updates become too manual.
- **Reusable knowledge created:** `docs/engineering-memory/**`,
  `PROJECT_MAP.md`, `FILE_REGISTRY.yml`, and `docs/session-bootstrap.md`.
- **Engineering memory classification:** promoted to
  `docs/engineering-memory/*`.
- **Navigation updates:** `PROJECT_MAP.md`, `FILE_REGISTRY.yml`,
  `docs/session-bootstrap.md`.
- **Follow-up Work Blocks:** optional commit/push closure after Owner approval.
