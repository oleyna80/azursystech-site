# WB-2026-07-03 SDLC Control Layer Corrections

## Meta
- **Work Block ID:** WB-2026-07-03-sdlc-control-layer-corrections
- **Date:** 2026-07-03
- **Owner:** azur
- **Execution Mode:** staged approval
- **Side-Effect Class:** local-docs
- **DB Action Mode:** none
- **Verification Tier:** standard

## Lifecycle State
- **Current Stage:** Stage 3
- **Stage Execution State:** completed
- **Write Gate:** READY
- **Owner Approval Evidence:** Owner confirmed correction after feedback report: "подтверждаю"
- **Critic Gate:** READY
- **Verification Gate:** READY
- **Verification Verdict:** READY
- **Stage 3 Mode:** success-closeout

## Objective
Correct the SDLC/control-layer inconsistencies found by
`docs/reports/sdlc-control-layer-feedback-2026-07-03.md`.

## Expected Final Result
The repository has a coherent Agentic SDLC navigation/control layer that is
portable to a fresh clone, clearly separates committed policy/templates from
local runtime state, does not claim missing mechanical hooks, and has verified
bootstrap/ignore behavior. No application source code, dependencies, secrets,
deploy files, or production config are changed.

## Done Criteria
- [x] Committed/local-only boundary is explicit and consistent.
- [x] Gate files are described as evidence contracts unless real hooks exist.
- [x] Quick-fix threshold is consistent.
- [x] New normative navigation/control files are covered by authority rules.
- [x] Bootstrap check/init behavior is explicit.
- [x] Machine-specific absolute project root is removed from the registry.
- [x] Verification checks pass or blockers are documented.

## Preflight State
- **Git baseline:** dirty; existing SDLC sync files are modified/untracked.
- **Pre-existing dirty files:** prior SDLC/control-layer sync work, including
  `.agent/**`, `.codex/**`, `.agentsignore`, `.codexignore`, `PROJECT_MAP.md`,
  `FILE_REGISTRY.yml`, `docs/engineering-memory/**`,
  `docs/session-bootstrap.md`, `docs/templates/**`, and `scripts/bootstrap.sh`.
- **Untracked local artifacts:** `docs/plans/**` and `docs/reports/**` contain
  current Work Block evidence.
- **Proceed rule:** Owner approved correction. This Work Block edits only
  SDLC/control-layer files and its own evidence artifacts.

## Dependency Check
### Must Resolve Before Start
- None.

### Can Resolve During Work
- Whether future runtime hooks should be implemented separately. This Work
  Block only corrects the claims around existing gate evidence.

## Runtime / Data Mutation Boundary
- **Applies:** no
- **Agent authority:** approved documentation/control-layer authoring only
- **Structured action:** not applicable
- **Trusted executor:** not applicable
- **Policy and approval:** no app/runtime/DB/deploy/client side effects
- **Audit path:** this Work Block and verification report
- **Forbidden direct path:** app source, env/secrets, DB, deploy, production config

## Scope
### In Scope
- `AGENTS.md`
- `PROJECT_MAP.md`
- `FILE_REGISTRY.yml`
- `.gitignore`
- `.agent/README.md`
- `.agent/workflows/sdd-protocol.md`
- `.agent/critic-gate.md`
- `.agent/verification-gate.md`
- `docs/session-bootstrap.md`
- `docs/templates/work-block-template.md`
- `scripts/bootstrap.sh`
- this Work Block and verification report

### Out of Scope
- Application source code.
- Dependency changes.
- `.env`, secrets, API/provider credentials, private config.
- Commit, push, deploy, destructive Git operations.

## Write-Set
```
AGENTS.md
PROJECT_MAP.md
FILE_REGISTRY.yml
.gitignore
.agent/README.md
.agent/workflows/sdd-protocol.md
.agent/critic-gate.md
.agent/verification-gate.md
docs/session-bootstrap.md
docs/templates/work-block-template.md
scripts/bootstrap.sh
docs/plans/WB-2026-07-03-sdlc-control-layer-corrections.md
docs/reports/sdlc-control-layer-corrections-verification-2026-07-03.md
```

## Navigation Impact
- **Files added/moved/removed:** adds this correction WB and verification report.
- **PROJECT_MAP.md update needed:** yes, for committed/local runtime boundary.
- **FILE_REGISTRY.yml update needed:** yes, for portable project root and authority notes.
- **Session bootstrap or profile docs update needed:** yes, for bootstrap check/init.
- **Engineering memory update needed:** no durable decision promotion in this WB.
- **Generated/derived/local-only boundary changed:** yes, documentation and ignore
  rules clarify the boundary.

## Commit / Stage Scope
- **Files to stage/commit:** no staging without separate Owner approval.
- **Files to leave unstaged:** all changes until selective commit decision.
- **Scope guard:** `git status --short --branch`, `git diff --name-only`,
  `git diff --check`, `git check-ignore -v`.

## Acceptance Criteria
- [x] No stale hook-script enforcement claims remain.
- [x] No workstation-specific absolute registry root remains.
- [x] `AGENTS.md` and `.gitignore` agree on committed vs local-only files.
- [x] `bash -n scripts/bootstrap.sh` passes.
- [x] `bash scripts/bootstrap.sh` passes without creating tracked files.
- [x] `git diff --check` passes.

## Risks and Mitigations
| Risk | Impact | Mitigation | Stop Condition |
|---|---|---|---|
| Ignore rules accidentally hide needed SDLC files | Fresh clone loses workflow files | Verify with `git check-ignore -v` on representative paths | If intended committed file is ignored |
| Bootstrap behavior change surprises existing workflow | Agents miss local memory files | Keep `--init` available and document it | If no-arg check blocks current repo unexpectedly |
| Gate wording becomes too weak | Review/verification discipline erodes | Keep evidence contract mandatory, remove only non-existent hook claim | If gate no longer blocks by policy |

## Hard Stops in Scope
- [ ] Production deploy
- [ ] Live DB migration
- [ ] Credential rotation
- [ ] Destructive git ops
- [ ] Commit or push
- [ ] Public release/publication
- [ ] Client communications

## Subagent Strategy
- **Classification:** Subagent-Required
- **Triggers matched:** 4+ files; governance/control layer; commit readiness.
- **Use Claude Code team:** no; correction is local docs/control.
- **Claude Code process scope:** not applicable.
- **Claude Code external report:** not applicable.
- **Use Codex/GPT critic or verifier:** previous feedback WB already used
  read-only critic/reviewer subagents; this WB will run inline verification
  unless Owner requests another subagent pass.
- **Dispatch plan:** inline correction by Control Tower; optional follow-up
  critic after implementation if requested.
- **Budget posture:** normal.
- **Skip reasons:** `user-not-explicit-for-new-subagent-dispatch`; previous
  feedback report remains the critic input for this correction.

## Skills
- **Checked:** shell-context-guard, ssot-sync-closeout, critic-review, verifier
- **Matched:** shell-context-guard, ssot-sync-closeout, critic-review
- **Used:** shell/context guard via git status and scoped write-set;
  feedback report as critic input
- **Skipped:** new subagent dispatch skipped pending explicit Owner request

## Verification Plan
- **Canonical checks:** `bash -n scripts/bootstrap.sh`;
  `bash scripts/bootstrap.sh`; `bash scripts/bootstrap.sh --check`;
  `git diff --check`; `git check-ignore -v` for committed/local paths;
  targeted `rg -n`; YAML parse for `FILE_REGISTRY.yml`.
- **Scoped fallback checks:** direct file inspection if a command is unavailable.
- **Browser smoke:** not applicable.
- **Evidence expected:** command output and verification report.
- **Skipped checks:** app builds/tests, because app source is out of scope.

## Rollback / Recovery
This Work Block only changes documentation/control files. If a correction is
wrong, apply a follow-up docs correction rather than touching app code.

## Execution Log
| Time | Stage | Action / Decision | Evidence | Status |
|---|---|---|---|---|
| 2026-07-03 | Stage 0 | Feedback report accepted as correction input | `docs/reports/sdlc-control-layer-feedback-2026-07-03.md` | completed |
| 2026-07-03 | Stage 1 | Correction WB opened | this file | completed |
| 2026-07-03 | Stage 1 | Corrected committed/local-only boundary, gate wording, quick-fix threshold, navigation authority, bootstrap mode, and portable registry root | approved write-set | completed |
| 2026-07-03 | Stage 2 | Ran bootstrap, diff, registry, ignore, stale-marker, and secret-pattern checks | `docs/reports/sdlc-control-layer-corrections-verification-2026-07-03.md` | READY |
| 2026-07-03 | Stage 3 | Closed correction WB as ready for Owner commit-scope decision | this file | completed |

## Closeout and Retrospective
### Result Summary
- **Final Result:** SDLC/control-layer feedback findings F-001 through F-010
  were corrected or explicitly bounded.
- **Closeout Classification:** SUCCESS
- **Task Status:** completed
- **Verification Evidence:**
  `docs/reports/sdlc-control-layer-corrections-verification-2026-07-03.md`
- **Residual Risks:** runtime hook enforcement remains optional; broader dirty
  tree still needs selective commit scope; fresh clones should run
  `scripts/bootstrap.sh --init` once to create ignored local memory files.

### Critic and Review Value
- **Critic used:** yes, previous feedback report used as correction input.
- **Critic verdict:** SUPPLEMENT
- **What the critic caught:** committed/local-only conflict, missing hook claim,
  quick-fix drift, missing authority coverage, bootstrap side-effect ambiguity,
  absolute registry root, stage mapping gap, stale README, verification wording,
  and broad ignore rule.
- **What the critic missed:** nothing material found in correction verification.
- **Skip/fallback reason:** no new subagent dispatch in this correction pass;
  Owner approved the correction after the feedback report.

### Lessons Learned
- **What worked:** separating committed policy/templates from local runtime
  memory made the Git portability boundary testable.
- **What did not work:** gate files sounded like mechanical hooks were installed
  before such hooks existed.
- **What not to repeat:** do not describe aspirational runtime enforcement as
  current hook behavior.
- **Evidence wording check:** this WB demonstrates the corrected policy and
  validates the script/ignore behavior with local checks.
- **Framework updates made:** work-block template, bootstrap script, gate docs,
  SDD mapping, registry, project map, session bootstrap, and ignore rules.
- **Framework updates to consider:** add a separate Work Block for mechanical
  hook enforcement if the Owner wants runtime blocking.
- **Reusable knowledge created:** verification report for SDLC control-layer
  portability corrections.
- **Engineering memory classification:** operational-only; no durable engineering
  memory promotion in this WB.
- **Navigation updates:** `PROJECT_MAP.md`, `FILE_REGISTRY.yml`,
  `docs/session-bootstrap.md`, `.agent/README.md`.
- **Follow-up Work Blocks:** selective commit decision for the corrected
  SDLC/control-layer scope.
