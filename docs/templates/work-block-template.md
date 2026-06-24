# Work Block Template

> Fill in before Stage 0 Preflight.

## Meta

- **Work Block ID:** [wb-xxx]
- **Date:** [YYYY-MM-DD]
- **Owner:** [name]
- **Stage:** [Plan | Spec | Implementation | Review | Verification | Closeout]
- **Role:** [Orchestrator | Coder | Reviewer | Verifier]
- **Execution Mode:** [end-to-end autonomous | staged approval | read-only review | advisory]
- **Side-Effect Class:** [read-only | local-docs | production-code | local-test | public-repo | live-infra | live-data | client-facing | destructive]
- **DB Action Mode:** [none | local_temp | live_readonly | live_migration_apply | runtime_app | emergency_remediation]
- **Verification Tier:** [lite | standard | full]
- **Active Profile:** [Minimal Codex-only | Standard Codex SDLC | Claude Code Team Runtime | Codex -> Claude Code Handoff | Codex model routing overlay]
- **Allowed external runtimes/MCPs:** [none | exact names, purpose, and
  authorization source; for example `mcp-codex` for GPT subagents inside
  Claude Code when explicitly approved by Owner]

## Objective

[What user or technical outcome does this Work Block produce?]

## Expected Final Result

[What exact end state should be true when this Work Block is complete? Write it
as the target state the Owner can recognize. Include user-visible result,
published/deployed state if relevant, verification evidence, docs/logs updated,
and what must be left clean.]

## Done Criteria

- [ ] [Measurable completion condition 1]
- [ ] [Measurable completion condition 2]
- [ ] [Repo/runtime state is clean or documented]

## Preflight State

- **Git baseline:** [clean | dirty; command and summary]
- **Pre-existing dirty files:** [none | list files and owner/status]
- **Untracked local artifacts:** [none | list ignored/untracked artifacts]
- **Proceed rule:** [why this Work Block can proceed without touching unrelated
  changes, or what must be resolved first]

## Dependency Check

### Must Resolve Before Start

- [Dependency, permission, credential, access, design, or decision required
  before implementation starts]

### Can Resolve During Work

- [Non-blocking uncertainty the Orchestrator may solve without pausing unless
  it hits a Hard Stop]

## Runtime / Data Mutation Boundary

- **Applies:** [yes | no; required for DB, payment, order, stock, CRM, live
  service, or production data changes]
- **Agent authority:** [planner/draft/read-only only | approved code authoring
  only | not applicable]
- **Structured action:** [ActionSpec/resource/operation/scope/risk, or not
  applicable]
- **Trusted executor:** [backend service/API/repository/job that performs the
  mutation, or not applicable]
- **Policy and approval:** [deny/read-only/requires approval/execute rules]
- **Audit path:** [where proposed action, policy decision, approval, executor,
  and result are logged]
- **Forbidden direct path:** [raw SQL/manual row mutation/unrestricted provider
  API/direct agent tool call, or not applicable]

## Scope

### In Scope

- [Item 1]

### Out of Scope

- [Item 1]

## Write-Set

```text
[Approved files/directories]
```

## Navigation Impact

- **Files added/moved/removed:** [none | list]
- **PROJECT_MAP.md update needed:** [yes | no; why]
- **FILE_REGISTRY.yml update needed:** [yes | no; why]
- **Session bootstrap or profile docs update needed:** [yes | no; why]
- **Generated/derived/local-only boundary changed:** [yes | no; why]

## Commit / Stage Scope

- **Files to stage/commit:** [explicit list or pathspec]
- **Files to leave unstaged:** [pre-existing dirty files, local artifacts,
  generated output, secrets]
- **Scope guard:** [command/check used before staging, for example
  `git diff --name-only` and `git status --short`]

## Acceptance Criteria

- [ ] [AC 1]
- [ ] [AC 2]

## Risks and Mitigations

| Risk | Impact | Mitigation | Stop Condition |
|---|---|---|---|
| [Risk] | [Impact] | [Mitigation] | [When to stop and ask Owner] |

## Stage 0 Routing Preflight

- **Work Block type:** [trivial quick-fix | non-trivial Work Block | Hard Stop gate]
- **Side-effect class:** [read-only | local-docs | production-code | local-test | public-repo | live-infra | live-data | client-facing | destructive]
- **DB action mode:** [none | local_temp | live_readonly | live_migration_apply | runtime_app | emergency_remediation]
- **Hard Stops in scope:** [none | list]
- **Write gate:** [READY | BLOCKED]

### Skill Routing Gate

- **Skills checked:** [list]
- **Skills matched:** [list]
- **Skills used:** [list]
- **Skills skipped and why:** [list]
- **Project-local skill fallback used:** [yes | no | not needed]

### Subagent Topology

- **Classification:** [Subagent-Required | Subagent-Optional | Control-Tower-Only]
- **Triggers matched:** [list]
- **Use Claude Code team:** [yes | no | conditional; why]
- **Use Codex/GPT critic or verifier:** [yes | no | conditional; why]
- **Dispatch plan:** [agents, order, parallel groups]
- **Skip reason, if any:** [trivial | blocked | hard-stop | user-disabled]
- **Blocker category, if blocked:** [tool-unavailable | thread-limit | usage-limit | model-unavailable | sandbox | other]

## Subagent Authorization

- Native subagents authorized when the Orchestrator determines they improve
  speed, quality, or context hygiene and the active runtime permits them.
- Use one write-capable Coder per approved write-set; keep Reviewer/Verifier
  subagents read-only unless explicitly approved.
- Native subagents must not launch nested external AI CLI tools for a second
  verdict unless the exact runtime/MCP is listed under `Allowed external
  runtimes/MCPs` with Owner authorization and mission boundaries.
- External AI audit runner: [not authorized | authorized as separate Control
  Tower assignment with task file, timeout, and fallback].

## Execution Topology

- **Topology:** [Control Tower only | Control Tower + read-only subagents | Control Tower + one Coder subagent]
- **Context sharing:** [scoped prompt | full-history fork only if required]
- **Subagent assignments:** [list]

### Parallel Decomposition Matrix

Required for `Subagent-Required` and otherwise non-trivial Work Blocks before
dispatching implementation or review. Returned subagent output is evidence,
not acceptance; the Orchestrator must check scope, acceptance-criteria coverage,
and verification evidence before accepting it.

| Stream | Goal | Role | Write-set | Dependencies | Verification | Execution | Reason |
|---|---|---|---|---|---|---|---|
| [Stream] | [Scoped outcome] | [Base role / specialization] | [none or exact paths] | [none or prerequisites] | [AC/checks/evidence] | [parallel | sequential | local] | [why this execution mode applies] |

For every `sequential` or `local` stream, record a concrete reason: write
conflict, dependency chain, shared runtime/resource, uncertain scope,
hard-stop boundary, or no delegation value. Use `parallel` only when streams
have no write-set, dependency, or shared-resource conflict.

## Codex Critic

- **Required:** [yes | no; why]
- **Mode:** [native-subagent | fallback-same-session | external | skipped]
- **Verdict:** [APPROVE | SUPPLEMENT | RECONSIDER | SKIPPED]
- **Report path:** [path or not applicable]
- **Orchestrator response:** [required for SUPPLEMENT/RECONSIDER or skip]

## External Review Inputs

- **External reports/prompts:** [none | list]
- **Evidence input paths:** [none | exact stdout/stderr/report paths provided
  to external Reviewer/Verifier, for example `/tmp/.../coder.out`]
- **Triage rule:** external reviewer output is evidence, not acceptance.
- **Local verification required before accepting any finding:** [yes | no; why]

## Verification Plan

- **Canonical checks:** [exact commands expected for this repository and
  Verification Tier]
- **Scoped fallback checks:** [acceptable narrower checks if canonical checks
  are blocked or disproportionate]
- **Browser smoke:** [required pages/flows/screenshots for frontend work, or
  not applicable]
- **Evidence expected:** [logs, screenshots, command output, reports, result
  files]
- **Skipped checks:** [none | checks skipped with reason and residual risk]

## Stop Conditions

- [Condition that requires Owner approval or halts pipeline]

## Rollback / Recovery

[How to undo if this goes wrong?]

## SSOT Updates

- **Tracked/synchronized SSOT paths:** [none | list]
- **Local-only/ignored SSOT paths and reason:** [none | list]
- **Direct evidence markers to verify with `rg -n`:** [none | list]
- **`git check-ignore -v` result for workflow docs:** [empty | ignored with reason | not checked]

## Execution Log

| Time | Stage | Action / Decision | Evidence | Status |
|---|---|---|---|---|
| [time] | [stage] | [what happened] | [command, file, review, or artifact] | [status] |

## Closeout and Retrospective

Complete this before the Work Block is considered closed. Keep this evidence
based: record what happened, not private reasoning or unsupported claims. Use
`none` or `not applicable` when there is no real signal; do not invent lessons
to fill the form.

### Result Summary

- **Final Result:** [actual end state compared with Expected Final Result]
- **Verification Evidence:** [commands, logs, reports, artifacts]
- **Residual Risks:** [known gaps, deferred checks, assumptions]

### Critic and Review Value

- **Critic used:** [yes | no | fallback; agent/model if relevant]
- **Critic verdict:** [APPROVE | SUPPLEMENT | RECONSIDER | SKIPPED]
- **What the critic caught:** [specific useful findings, or "nothing material"]
- **What the critic missed:** [only if discovered later]
- **Skip/fallback reason:** [required if critic was skipped or unavailable]

### Lessons Learned

- **What worked:** [process/tooling/agent behavior worth preserving]
- **What did not work:** [friction, missed context, weak gate, slow step]
- **What not to repeat:** [concrete mistake or weak pattern to avoid]
- **Evidence wording check:** [use "demonstrated" for one run, "validated"
  for repeatable scripted checks; avoid "proved/guaranteed" unless
  mathematically or formally justified]
- **Framework updates made:** [template, hook, skill, doc, runner, memory]
- **Framework updates to consider:** [future improvements not done in this WB]
- **Reusable knowledge created:** [skill, checklist, report, memory entry, none
  / not applicable]
- **Navigation updates:** [PROJECT_MAP.md, FILE_REGISTRY.yml, session bootstrap,
  profile docs, none / not applicable]
- **Follow-up Work Blocks:** [links or IDs]
