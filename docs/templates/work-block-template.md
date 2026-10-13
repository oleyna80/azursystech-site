# Work Block Template

> Fill this before non-trivial repository mutation. The Work Block binds the
> runtime-neutral governance contract to one concrete objective.
>
> **Installed Controller v1:** The authoritative runtime state is trusted external
> admission plus per-worktree Git-private schema-v2 Controller state. This
> Markdown template records planning and assurance evidence; schema-v3 tracked
> write gates and process Close do not grant runtime authority. See
> `AGENTS.md` and `governance/authority.md`.

## Metadata

- **Work Block ID:** [wb-xxx]
- **Date:** [YYYY-MM-DD]
- **Owner:** [name/reference]
- **Orchestrator:** [logical role binding]
- **Governance Profile:** [Advisory | Controlled | Managed | Assured | Distributed]
- **Execution Mode:** [conductor | orchestrator | staged approval | read-only review | advisory]
- **Verification Tier:** [lite | standard | full]
- **Evaluation Required:** [yes | no; risk/non-determinism reason]
- **Process Feedback Contract:** [required-v1 for every non-trivial Work Block]

## Lifecycle State

- **Observed Controller v1 State (not set by this document):** [INACTIVE | DEFINE | EXECUTE | ASSURE | ABSENT/UNVERIFIED]
- **Trusted Active Admission:** [admission ID + verified repository/branch/base/profile | none]
- **Approved Write Set:** [exact paths or scope reference]
- **Committed Planning Revision:** [exact SHA | not yet committed]
- **Critic Binding:** [PENDING | READY | BLOCKED; planning SHA and evidence]
- **Committed Source Candidate:** [exact SHA | not yet committed]
- **Reviewer Controller Binding:** [PENDING with candidate_sha=null | READY with exact source_candidate_sha]
- **Verifier Controller Binding:** [PENDING with candidate_sha=null | READY with exact source_candidate_sha]
- **Reviewer Report Verdict (separate from binding):** [PENDING | READY | CHANGES_REQUIRED | BLOCKED | UNVERIFIED]
- **Trusted Publication:** [NOT_STARTED | VERIFIED with remote exact tip and provenance | BLOCKED]
- **Verification Report Verdict (separate from binding):** [PENDING | READY | BLOCKED | UNVERIFIED]
- **Evaluation Verdict:** [PENDING | READY | BLOCKED | UNVERIFIED | NOT_REQUIRED]
- **Drift Gate:** [PENDING | READY | BLOCKED | UNVERIFIED | SKIPPED]
- **Closeout Mode:** [pending | success-closeout | reporting-only]
- **Owner Approval Evidence:** [message/reference | not required]

### Define Quality Prerequisite

- **Required:** [yes | no; profile/risk reason]
- **Status:** [PENDING | READY | BLOCKED]
- **Requirements Review Evidence:** [path/reference | not required]
- **Traceability Evidence:** [path/reference | not required]
- **Consistency Analysis Evidence:** [path/reference | not required]

For Managed/Assured/Distributed formal work, required requirements-quality
review and consistency analysis must be `READY`, and deterministic
traceability validation must pass. All three evidence references must be
nonempty; missing, failed, `CHANGES_REQUIRED`, `BLOCKED` or `UNVERIFIED`
results prevent Critic progression. These are **process prerequisites**, not
a schema-v3 machine aggregate or source-write gate. Trusted Controller v1
Critic `READY` on committed planning controls `DEFINE → EXECUTE`.

## Objective

[What user or technical outcome must this Work Block produce?]

## Expected Final Result

[Describe the exact recognizable end state, including user-visible behavior,
repository/runtime state, evidence, documentation, and what must remain clean.]

## Done Criteria

- [ ] [Measurable outcome]
- [ ] [Required deterministic, output, and trajectory evidence exists]
- [ ] [Repository/runtime state is clean or documented]
- [ ] [Process Feedback closeout block completed: eight explicit `CLEAR`/`FRICTION_OBSERVED` states with evidence, and `NONE — checked` or linked registry observations]

## Process Feedback Closeout

At process closeout (not a Controller v1 `Close` state), complete the structured Process Feedback block from
`docs/templates/closeout-report-template.md`. Review documentation,
contracts/invariants, tooling/skills, context/memory, governance/authority,
environment/setup, validation/tests, and process overhead/repeated work.
Each dimension must explicitly use `CLEAR` or `FRICTION_OBSERVED` with concise
evidence. `NONE — checked` is valid only when all eight dimensions are `CLEAR`.
Material observations go only
to `docs/engineering-memory/process-feedback-registry.yml`; observations are
advisory and never grant authority for systemic change.

## Normative Baseline

- **Approved Specification:** [path]
- **Specification Status:** [draft | proposed | approved | superseded]
- **Specification Revision:** [commit/hash/version]
- **Accepted Architecture Decisions:** [paths/IDs]
- **External Contracts:** [API/schema/legal/provider/user contract or not applicable]
- **Derived Implementation Plan:** [path]
- **Approved Evaluation Plan:** [not required | docs/evals/<id>/plan.json]
- **Active Tasklist:** [path]

Rule: approved specification and accepted architecture decisions outrank plans,
tasklists, evaluation reports, and operational logs.

## Repository Preflight

- **Git baseline:** [branch/commit/status]
- **Pre-existing dirty files:** [none | list with ownership]
- **Untracked artifacts:** [none | list]
- **Current diff:** [none | summary/reference]
- **Proceed rule:** [why unrelated changes will not be touched]

## Dependency Check

### Must Resolve Before Start

- [Permission, requirement, access, design, environment, or decision]

### May Resolve During Work

- [Non-blocking uncertainty and stop condition]

## Scope

### In Scope

- [Item]

### Out of Scope

- [Item]

## Write-Set

```text
[Approved files/directories]
```

- **One Coder per write-set:** [yes]
- **Parallel writers:** [no | separate worktrees and non-overlapping write-sets]
- **Scope guard:** [git diff/status/path validation]

Lifecycle reports, evaluation evidence, logs, and gate artifacts are counted
separately from implementation files when applying Quick-Fix and trigger thresholds.

## Risk and Authority

- **Side-Effect Class:** [read-only | local-docs | production-code | local-test | public-repo | live-infra | live-data | client-facing | destructive]
- **DB/Data Action Mode:** [none | local_temp | live_readonly | live_migration_apply | runtime_app | emergency_remediation]
- **Sensitive Domains:** [none | auth | payments | DB/schema | webhooks | provider | deploy | security | client communications | other]
- **Output Non-Determinism:** [none | bounded | material; why]
- **Autonomous Tool/Trajectory Risk:** [none | bounded | material; why]
- **Threat Model Required:** [yes | no; reason]
- **Rollback / Recovery:** [procedure]

## Hard Stops in Scope

- [ ] Production deploy or live service restart
- [ ] Live DB migration or live-data mutation
- [ ] Credential/token/secret change
- [ ] Destructive git/filesystem/database operation
- [ ] Force push, branch deletion, tag/release publication, or push to a default/protected branch
- [ ] Public release/publication
- [ ] Client/user communication
- [ ] Payment/order/stock/CRM/external consequential mutation
- [ ] Material specification, evaluation-plan, or scope expansion

For each checked Hard Stop, record its **separate Owner/external authorization**
and evidence. Neither a Work Block, Controller state, runtime permission prompt,
nor an evaluation verdict independently authorizes production deployment, live
database mutation or any other Hard Stop.

### Permitted routine Git actions (not Hard Stops)

- **Local commits** may proceed inside the approved Work Block, exact write set,
  trusted active admission and applicable Controller state.
- **Ordinary subject-branch publication** may proceed only through the existing
  **trusted Controller v1 publish transaction**, after exact-candidate Reviewer
  and Verifier `READY` bindings and all origin/default/protection predicates.
  It is limited to an authorized non-force push of the exact non-default subject
  ref followed by remote-tip verification and immutable provenance.

A standalone shell `git push` or GitHub ref update is **not** a replacement
for trusted publish. Neither routine action authorizes merge, deployment,
live database writes, tags/releases, forced or protected-branch updates,
remote deletion or publication to another destination.

## Runtime Capability Snapshot

- **Primary Runtime:** [codex | claude-code | opencode | generic | other]
- **Runtime Adapter:** [path/reference]
- **Runtime Version:** [observed version | unknown]
- **Native Subagents:** [available | unavailable | unknown]
- **Separate Sessions:** [available | unavailable | unknown]
- **Worktrees / Isolated Roots:** [available | unavailable | unknown]
- **Hooks / Tool Guards:** [available | unavailable | unknown]
- **Sandbox / Permission Controls:** [description]
- **Observable Event Sources:** [tool log/gate log/CI/artifacts/none]
- **MCP / Plugin / External Tools:** [available inventory or none]
- **Known Limitations:** [list]
- **Capability Evidence:** [version/config/smoke/reference]

## Integration Profile and Admission

- **Integration Profile:** [none | official plugin | MCP | file handoff | hosted connector | direct runtime CLI | manual handoff]
- **Approved Integration IDs:** [none | stable IDs of approved integration evidence]
- **Admission Records:** [none | approved integration admission IDs/paths, separate from trusted Work Block admission]
- **Logical Functions Served:** [none | Critic/Reviewer/Verifier/Evaluator/etc.]
- **From / To Boundary:** [runtime/service endpoints]
- **Exact Tools / Actions:** [none | list]
- **Authority:** [read-only | approved write-set | reports only | other]
- **Data Sent Externally:** [none | exact content boundary]
- **Secret / Authentication Source:** [none | local runtime/keychain/env name, no values]
- **Network / External Directory Boundary:** [deny/ask/approved endpoints or paths]
- **Timeout / Cancellation / Retry:** [behavior]
- **Disable / Recovery Procedure:** [steps]
- **Integration Smoke Evidence:** [not required for none | path/result]

Rules:

- generated projects default to `none`;
- availability does not imply permission;
- every automated non-`none` integration requires an admission record;
- record external runtime CLI IDs and approved integration-admission paths in
  the appropriate Work Block and integration evidence; **never** use tracked
  schema-v3 `.agent/active-work-block.json` as current authority;
- any installed v1 Work Block execution still requires the **existing trusted
  external admission and Git-private schema-v2 Controller bindings**; do not
  invent additional Controller state fields for integrations;
- integration access does not expand the bound logical role or write-set.

## Function Bindings

| Function | Logical Role | Runtime | Model Class | Actual Model | Isolation | Authority | Adapter / Integration / Launch Evidence |
|---|---|---|---|---|---|---|---|
| Orchestration | Orchestrator | [runtime] | [class] | [optional] | [level] | workflow | [reference] |
| Architecture | Architect | [runtime] | [class] | [optional] | [level] | read-only/drafts | [reference] |
| Critic | Critic | [runtime] | [class] | [optional] | [level] | read-only | [reference] |
| Implementation | Coder | [runtime] | [class] | [optional] | [level] | write-set | [reference] |
| Review | Reviewer | [runtime] | [class] | [optional] | [level] | read-only | [reference] |
| Verification | Verifier | [runtime] | [class] | [optional] | [level] | read-only | [reference] |
| Evaluation | Verifier/Evaluator specialization | [runtime] | [class] | [optional] | [level] | read-only/evidence | [reference] |
| Drift Audit | Reviewer/Verifier specialization | [runtime] | [class] | [optional] | [level] | read-only | [reference] |

Use `not required` for functions legitimately skipped by profile and triggers.
Model/provider/integration names do not define roles or authority.

## Degraded / Fallback Plan

- **Missing capability:** [none | capability]
- **Preferred execution:** [method]
- **Fallback:** [same-context | separate-session | alternate runtime | manual | other]
- **Degraded label:** [none | exact label]
- **Residual limitation:** [what independence/evidence is not established]
- **Follow-up required:** [yes/no]

## Skills

- **Checked:** [list]
- **Matched:** [list]
- **Used:** [list]
- **Skipped:** [list with reasons]

## Implementation Plan

| Task | Owner Role | Write-Set | Dependencies | Expected Evidence | Status |
|---|---|---|---|---|---|
| [Task] | [role] | [paths] | [deps] | [evidence] | [planned] |

## Acceptance Criteria

- [ ] [AC-001]
- [ ] [AC-002]

## Assurance Plan

### Critic

- **Required:** [yes/no; trigger]
- **Inputs:** [spec/plan/risk/topology/integration admissions/evaluation design]
- **Expected report:** [path]

### Independent Review

- **Required:** [yes/no; trigger]
- **Frozen diff:** [reference]
- **Review dimensions:** [correctness/security/architecture/maintainability/integration/evaluation boundaries]
- **Expected report:** [path]

### Technical Verification

- **Canonical checks:** [exact commands/flows]
- **Runtime/browser/API/integration smoke:** [required/optional/not applicable]
- **Positive and negative cases:** [list]
- **Evidence expected:** [logs/screenshots/report/artifacts]
- **Allowed fallback checks:** [narrower checks and residual risk]
- **Skipped checks:** [none | reason]

### Agent Evaluation

- **Required:** [yes/no; trigger]
- **Evaluation ID / Plan:** [not required | ID and path]
- **Subject/Frozen Revision:** [revision]
- **Deterministic Checks:** [criterion IDs and commands]
- **Output Criteria:** [criterion IDs, thresholds, evaluator types]
- **Trajectory Requirements:** [required/prohibited observable events]
- **Event Sources:** [paths/logs/artifacts]
- **Rubric Revision:** [revision]
- **Benchmark/Dataset Revision:** [revision | not-applicable]
- **LM Judge Policy:** [disabled | identity/prompt revision/calibration]
- **Isolation:** [actual or required boundary]
- **Expected Report:** [docs/reports/evaluations/<id>.json]
- **No Hidden Reasoning:** [confirmed; observable events only]

### Specification Drift Audit

- **Required:** [yes/no; trigger]
- **Inputs:** [spec/decisions/plans/diff/tests/evals/docs]
- **Expected report:** [path]
- **Valid skip reason:** [Quick Fix only, or not applicable]

## Navigation and Documentation Impact

- **Files added/moved/removed:** [none | list]
- **PROJECT_MAP update:** [yes/no; why]
- **FILE_REGISTRY update:** [yes/no; why]
- **Specification update:** [yes/no; approval state]
- **Architecture decision update:** [yes/no; path]
- **Runtime / integration adapter update:** [yes/no; paths]
- **Evaluation contract/update:** [yes/no; paths]
- **User/engineering documentation update:** [yes/no; paths]
- **Engineering memory candidate:** [yes/no; classification]
- **Generated/local boundary change:** [yes/no; why]

## Commit / Publication Scope

- **Files to stage:** [explicit paths]
- **Files to leave unstaged:** [list]
- **Trusted Controller publication:** [not requested | admissible exact subject ref | blocked/verified evidence]
- **Release/deploy approval:** [not applicable | required | evidence]

## Execution Log

| Time | Stage | Function | Runtime / Integration | Action / Decision | Evidence | Status |
|---|---|---|---|---|---|---|
| [time] | [stage] | [function] | [runtime/integration] | [action] | [reference] | [status] |

Record observable trajectory events or references only. Do not include hidden
reasoning, private chain-of-thought, model scratchpads, secrets, or protected payloads.

## Process Closeout (not a Controller v1 state)

Normal success requires Controller v1 trusted publish, remote exact-tip
verification, immutable provenance and then `INACTIVE`. Failed publication
remains `ASSURE`; reporting-only/cancelled outcomes are not delivered
successfully. Process reporting does not authorize runtime transitions.

### Result

- **Final Result:** [actual vs expected]
- **Closeout Classification:** [SUCCESS | REPORTING_ONLY]
- **Task Status:** [completed only when required gates pass | blocked/incomplete]
- **Review Verdict:** [verdict/path]
- **Verification Verdict:** [verdict/path]
- **Evaluation Verdict:** [READY/BLOCKED/UNVERIFIED/NOT_REQUIRED and path]
- **Drift Verdict:** [verdict/path]
- **Integration Evidence:** [none | admission/smoke/result paths]
- **Residual Risks:** [list]
- **Inspection Gaps:** [list]

### Specification and SSOT Sync

- **Specification changed:** [no | approved change path/revision]
- **Architecture decisions synchronized:** [yes/no/not applicable]
- **Implementation/evaluation plans and tasklist synchronized:** [yes/no]
- **Runtime/integration documentation synchronized:** [yes/no/not applicable]
- **Reports linked:** [paths]

### Knowledge and Retrospective

- **What worked:** [evidence-based]
- **What failed or caused friction:** [evidence-based]
- **What not to repeat:** [specific]
- **Reusable knowledge:** [path | none]
- **Engineering memory classification:** [promoted | operational-only | not-applicable]
- **Framework updates to consider:** [list]
- **Follow-up Work Blocks:** [IDs/paths]

`SUCCESS` requires all required assurance gates, including evaluation when required,
to pass. Otherwise use `REPORTING_ONLY`; do not claim merge, deploy, release, or
completion readiness.
