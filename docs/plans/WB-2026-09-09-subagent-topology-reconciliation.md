---
artifact_type: work_block
work_block_id: WB-2026-09-09-subagent-topology-reconciliation
status: completed
revision: v1
baseline: 39a059394aacf70c0c6cb68e3dc947891788f112
governance_profile: Assured
process_feedback_required: true
---

# Plan — Subagent topology reconciliation

## Stage 0 — Define

Rebind the target Work Block package to the `-r1` recovery worktree and
baseline, record the first-session `SUPPLEMENT` and recovery friction, and
obtain a fresh native Critic verdict against this package. No implementation
source is changed before the fresh Critic resolves the material findings.

## Stage 1 — Execute

One scoped Coder updates only the topology contract, lifecycle admission and
closeout validation, active runtime context evidence, focused deterministic
tests, and the explicitly listed governance/template/index artifacts. The
Coder must report its actual root, branch, revision, and changed paths. The
correction must enforce capability-tuple equality, structural single-dispatch
references, non-reuse of capability probes as assurance bindings, and exact
role-report linkage.

## Stage 2 — Assure

Freeze the candidate. A separate native read-only Reviewer and a separate native
read-only Verifier inspect the frozen revision. Their execution identifiers,
role bindings, root evidence, report linkage, and verdicts are recorded by the
Orchestrator. Drift compares the frozen candidate and authoritative artifacts.

## Stage 3 — Close

Record Process Feedback, synchronize closeout evidence and memory-bank status,
validate the canonical inactive state, and publish only the exact non-default
subject refspec. Stop at Owner integration review; do not merge or deploy.

## Approved write-set

Write ownership is exclusive and non-overlapping. The Orchestrator owns only
coordination/projection/evidence artifacts and lifecycle transitions. The one
scoped Coder owns every listed implementation source and deterministic test
path. Reviewer and Verifier remain read-only. The Orchestrator updates the
active state only in the ordered coordination transitions: project
`PROJECT_MAP.md` and `FILE_REGISTRY.yml` first, perform the `open` transition
last, validate the active state, then admit the Coder; after freeze, record the
Reviewer/Verifier bindings in the active state before closeout.

### Control-plane and governance source

- `.agent/ROSTER.md`
- `.agent/active-work-block.default.json`
- `.agent/active-work-block.json`
- `.agent/workflows/sdd-protocol.md`
- `governance/authority.md`
- `governance/lifecycle.md`
- `governance/runtime-capabilities.md`
- `runtimes/codex/README.md`
- `.codex/critic.md`
- `.codex/hooks/pre_tool_use_policy.py`
- `.codex/hooks/subagent_context.py`
- `.codex/hooks/verification-gate.sh`
- `.codex/scripts/lifecycle.py`
- `scripts/validate-release-state.py`
- `FILE_REGISTRY.yml`
- `PROJECT_MAP.md`

### Deterministic implementation and tests

- `scripts/subagent_topology.py`
- `scripts/test-subagent-topology.py`
- `scripts/test-release-state-contracts.py`

### Define, assurance, and closeout artifacts

- `docs/specs/WB-2026-09-09-subagent-topology-reconciliation.md`
- `docs/plans/WB-2026-09-09-subagent-topology-reconciliation.md`
- `docs/tasklist/WB-2026-09-09-subagent-topology-reconciliation.tasklist.md`
- `docs/reports/requirements-quality-WB-2026-09-09-subagent-topology-reconciliation.md`
- `docs/reports/traceability-WB-2026-09-09-subagent-topology-reconciliation.md`
- `docs/reports/consistency-WB-2026-09-09-subagent-topology-reconciliation.md`
- `docs/reports/capability/WB-2026-09-09-subagent-topology-reconciliation.md`
- `docs/reports/critic/WB-2026-09-09-subagent-topology-reconciliation.md`
- `docs/reports/reviews/WB-2026-09-09-subagent-topology-reconciliation.md`
- `docs/reports/verification/WB-2026-09-09-subagent-topology-reconciliation.md`
- `docs/reports/drift/WB-2026-09-09-subagent-topology-reconciliation.md`
- `docs/reports/closeout/WB-2026-09-09-subagent-topology-reconciliation.md`
- `docs/reports/process-feedback/WB-2026-09-09-subagent-topology-reconciliation.md`
- `.agent/critic-gate.md`
- `.agent/verification-gate.md`
- `.codex/write-gate.md`
- `memory_bank/context.md`
- `memory_bank/progress.md`
- `memory_bank/decisions.md`
- `memory_bank/orchestrator-log.md`
- `memory_bank/review-log.md`

## Stage 0 routing and mission briefs

Side-effect class: local control-plane source and documentation only. DB action
mode: `none`. Assurance tier: `Full` because the change governs assurance
admission. Hard Stops: production, live data, credentials, external
publication, merge, default/protected branch mutation, and destructive actions
remain out of scope.

Repository skill routing is explicit: matched `requirements-quality-review`,
`spec-consistency-analysis`, `task-decomposition`, `subagent-mission-brief`,
`security-pass`, `systematic-debugging`, `spec-drift-audit`, `git-safety`, and
`memory-ops`, and `git-orchestration-flow`. The frontend, database, deployment,
and browser skills are
explicitly not applicable because the write-set is control-plane-only. The
first-session root-inheritance failure is handled as evidence-backed
environment/tooling friction, not as a reason to weaken the guard. The Critic,
Coder, Reviewer, and Verifier mission briefs are:

| Role | Inputs | Scope | Out of scope / side effects | Dependency / parallel group | Required checks and evidence | Expected output / acceptance owner | File-change permission / handoff |
| Critic | Approved spec, plan, tasklist, Define reports, capability report, baseline identity | Define package, topology, capability, risk, task ordering | All source edits, lifecycle mutation, DB action; no side effects | None; serial before open | Identity probe, traceability, consistency, capability freshness, profile matrix, exact write-set | Advisory `APPROVE`, `SUPPLEMENT`, or `RECONSIDER` with evidence; Orchestrator accepts | Read-only; handoff is approval or bounded findings |
| Coder | Approved Define package, active state, approved write-set, Critic approval | Exact control-plane/runtime/test write-set listed above | Application, DB, dependencies, secrets, deploy, merge, destructive actions; no external side effects | TASK-002 prerequisite; sole writer, serial | Focused topology tests including tuple, structural dispatch, probe non-reuse, and report-linkage denials; release-state tests, syntax, traceability; report root/branch/HEAD and paths | Changed paths, checks, concerns, root evidence; Orchestrator owns acceptance | One writer; handoff is frozen candidate |
| Reviewer | Frozen candidate, active state, capability and Critic evidence, Coder report | Frozen diff, security/fail-open paths, docs↔code drift | Any edit, stage transition, DB action, or verdict mutation | After freeze; serial with Verifier only if read-only | Focused tests, adversarial admission/closeout review, root/revision/report linkage | Read-only report and `READY`/`CHANGES_REQUIRED`/`BLOCKED`; Orchestrator accepts | Read-only; handoff is review binding |
| Verifier | Frozen candidate, tasklist, acceptance criteria, Reviewer-independent view | Frozen revision, positive/negative fixtures, lifecycle/release evidence | Any edit, main-thread substitution, DB action, merge/deploy | After freeze; read-only parallel group with Reviewer | Reproducible focused tests, release validation, Drift inputs, exact fixture results | Verification report and `READY`/`BLOCKED`; Orchestrator accepts | Read-only; handoff is verification binding |

All briefs declare `side_effect_class: local-control-plane-only`,
`db_action_mode: none`, and `allowed_tools: repository read/validation tools
only` for read-only roles. Coder may use the repository edit/test tools only
within the approved write-set. Every handoff includes the Work Block ID,
branch, root, source/frozen revision, execution ID, report path, checks, and
acceptance owner; a missing field invalidates the binding.

### Template-complete mission briefs

The following normalized records fill every field required by
`docs/templates/subagent-mission-brief-template.md`. They are the dispatch
authority for this Work Block; the summary table above is only the routing
index.

#### Critic brief

- **Base Role:** Critic
- **Mission Role:** Architecture Analyst
- **Skills:** `requirements-quality-review`, `spec-consistency-analysis`, `subagent-mission-brief`, `task-decomposition`
- **Objective:** Independently inspect the Define package and capability policy before lifecycle open and return bounded findings.
- **In Scope:** Target spec, plan, tasklist, Define reports, capability report, current governance/roster/gate contracts, and identity/traceability checks.
- **Out of Scope:** All edits, lifecycle mutation, source implementation, external communication, DB/config/secret/deploy activity, and any claim not backed by dispatch evidence.
- **Inputs / Files:** `AGENTS.md`, relevant `memory_bank` context, target Define artifacts, current governance files, and the bounded capability-probe records.
- **Allowed Tools / MCP:** Repository read, `git status`, `git rev-parse`, `git worktree`, `rg`, `sed`, `python3` validators, and shell syntax checks; no write tools and no MCP server required.
- **Effective Runtime Policy:** Parent live policy is the inherited managed sandbox with session-root guards; requested agent profile default is `gpt-5.6-terra`, high reasoning, managed sandbox, with no override. The runtime's effective model is not asserted unless exposed by the adapter. Native `critic` dispatch; read-only. Technical isolation required: no stronger root isolation for this review. The execution ID is authoritative; same repository root does not establish OS isolation.
- **Approved Write-Set:** Empty.
- **Side-Effect Class:** read-only.
- **DB Action Mode:** none.
- **Parallel Group / Siblings:** Serial before `open`; capability probes are completed separately and are not reused.
- **Hard Stops:** Production/deploy, live DB, credentials, destructive Git, commit/push, merge, branch deletion, public release, and client communication.
- **Required Checks / Evidence:** Exact root/branch/HEAD; Define traceability; consistency; skill routing; capability freshness; policy-dimension reconciliation; explicit verdict.
- **Expected Output:** Advisory `APPROVE`, `SUPPLEMENT`, or `RECONSIDER` report with execution ID, identity, findings, checks, and limitations.
- **Acceptance Owner / Handoff:** Orchestrator decides whether findings are resolved; approval is required before `open`.

#### Coder brief

- **Base Role:** Coder
- **Mission Role:** Backend Coder / QA Analyst
- **Skills:** `security-pass`, `systematic-debugging`, `git-safety`, `subagent-mission-brief`
- **Objective:** Implement the approved topology evidence contract and its deterministic enforcement tests within the exact source write-set.
- **In Scope:** Only the source and test paths listed under TASK-003, including lifecycle admission/closeout, context metadata, policy reconciliation, and adversarial fixtures.
- **Out of Scope:** Application code, routes, database/schema, dependencies, config/secrets, deploy, merge, destructive operations, and Define/assurance report authorship.
- **Inputs / Files:** `AGENTS.md`, active Work Block state, approved v1 spec/plan/tasklist, Critic report/binding, and existing source files named by TASK-003.
- **Allowed Tools / MCP:** Repository read/edit tools, `apply_patch`, `git diff/status`, Python syntax/test runners, and project validators; no external MCP required.
- **Effective Runtime Policy:** Parent live policy is the inherited managed sandbox with session-root guards; requested agent profile default is `gpt-5.6-terra`, medium reasoning, managed sandbox, with no override. The runtime's effective model is not asserted unless exposed by the adapter. Exactly one scoped Coder; local control-plane edits only. Technical isolation required: no stronger root isolation was authorized; session-root binding remains mandatory.
- **Approved Write-Set:** Exactly the TASK-003 path list in the tasklist; no other path.
- **Side-Effect Class:** local-control-plane.
- **DB Action Mode:** none.
- **Parallel Group / Siblings:** Serial after the Orchestrator-only projection/open transition; no parallel writer.
- **Hard Stops:** Any scope/authority change, new dependency/config/secret/DB/deploy action, destructive Git operation, commit, push, merge, or production activity.
- **Required Checks / Evidence:** Focused topology tests, release-state contract tests, Python syntax, Define traceability, changed-path report, exact root/branch/HEAD, and no unplanned files.
- **Expected Output:** `DONE`, `DONE_WITH_CONCERNS`, `NEEDS_CONTEXT`, or `BLOCKED`, with changed paths and reproducible checks; no commit.
- **Acceptance Owner / Handoff:** Orchestrator reviews the changed-path report and freezes the candidate for assurance.

#### Reviewer brief

- **Base Role:** Reviewer
- **Mission Role:** Security Analyst / Architecture Analyst
- **Skills:** `security-pass`, `spec-consistency-analysis`, `spec-drift-audit`, `git-safety`
- **Objective:** Review the frozen candidate for correctness, fail-closed behavior, policy-boundary preservation, and documentation/code drift.
- **In Scope:** Frozen diff, active frozen state, capability/Critic evidence, source/test behavior, adversarial admission and closeout paths, and report linkage.
- **Out of Scope:** All edits, staging, lifecycle mutation, main-thread substitution, DB/config/secret/deploy activity, commit/push, merge, and verdict alteration.
- **Inputs / Files:** `AGENTS.md`, stage snapshot, frozen revision, active state, spec/plan/tasklist, Coder report, and current governance/gate files.
- **Allowed Tools / MCP:** Repository read, `git diff/show/status`, `rg`, `sed`, Python and shell validation/test tools; no write tools and no external MCP required.
- **Effective Runtime Policy:** Parent live policy is the inherited managed sandbox with session-root guards; requested agent profile default is `gpt-5.6-terra`, high reasoning, managed sandbox, with no override. The runtime's effective model is not asserted unless exposed by the adapter. Native read-only Reviewer dispatch. Role separation requires a distinct execution ID; this does not claim independent root/process/OS isolation. Read-only boundary is enforced by mission and observable no-change evidence.
- **Approved Write-Set:** Empty.
- **Side-Effect Class:** read-only.
- **DB Action Mode:** none.
- **Parallel Group / Siblings:** Stage 2 read-only parallel group with Verifier, after freeze.
- **Hard Stops:** Any edit or state mutation; production/deploy, live DB, credentials, destructive Git, commit/push, merge, branch deletion, or client communication.
- **Required Checks / Evidence:** Frozen SHA/root/branch; positive and negative topology tests; fail-closed gate review; isolation-tier distinction; report linkage; no file changes.
- **Expected Output:** Read-only report with execution ID, evidence, findings, and `READY`, `CHANGES_REQUIRED`, or `BLOCKED`.
- **Acceptance Owner / Handoff:** Orchestrator records the binding only if identity, revision, report path, and read-only evidence match.

#### Verifier brief

- **Base Role:** Verifier
- **Mission Role:** QA Analyst
- **Skills:** `spec-drift-audit`, `git-safety`, `systematic-debugging`, `requirements-quality-review`
- **Objective:** Independently reproduce acceptance checks against the frozen candidate and issue a fail-closed verification result.
- **In Scope:** Frozen revision, tasklist acceptance criteria, focused positive/negative fixtures, release-state validation, Drift inputs, and exact identity checks.
- **Out of Scope:** All edits, lifecycle mutation, main-thread substitution, DB/config/secret/deploy activity, commit/push, merge, and report backfilling.
- **Inputs / Files:** `AGENTS.md`, stage snapshot, frozen state, spec/plan/tasklist, Coder and Reviewer-independent inputs, and validation scripts.
- **Allowed Tools / MCP:** Repository read, `git diff/show/status`, `rg`, `sed`, Python and shell validation/test tools; no write tools and no external MCP required.
- **Effective Runtime Policy:** Parent live policy is the inherited managed sandbox with session-root guards; requested agent profile default is `gpt-5.6-terra`, high reasoning, managed sandbox, with no override. The runtime's effective model is not asserted unless exposed by the adapter. Native read-only Verifier dispatch. A distinct execution ID proves role-context separation only; no independent root/process/OS isolation is inferred. Observable no-change evidence is required.
- **Approved Write-Set:** Empty.
- **Side-Effect Class:** read-only.
- **DB Action Mode:** none.
- **Parallel Group / Siblings:** Stage 2 read-only parallel group with Reviewer, after freeze.
- **Hard Stops:** Any edit or state mutation; production/deploy, live DB, credentials, destructive Git, commit/push, merge, branch deletion, or client communication.
- **Required Checks / Evidence:** Frozen SHA/root/branch; reproducible focused tests; all denial fixtures; release-state validation; Drift inputs; no file changes.
- **Expected Output:** Verification report with execution ID, checks, evidence limitations, and `READY` or `BLOCKED`.
- **Acceptance Owner / Handoff:** Orchestrator records the binding only if it matches the frozen revision and the Reviewer binding is distinct.

### Skill routing and explicit skips

| Installed skill | Decision | Evidence-based reason |
|---|---|---|
| `requirements-quality-review` | Selected | Formal Define requirements and acceptance-quality review |
| `critic-review` | Unavailable/not installed | No `.agent/skills/critic-review/SKILL.md` exists; the native Critic role plus the selected requirements-quality and consistency skills provide review support, with no skill-based authority claimed |
| `requirements-clarification` | Not applicable | Owner supplied an explicit, bounded objective and no unresolved product ambiguity remains after Define reconstruction |
| `spec-consistency-analysis` | Selected | Cross-artifact contract reconciliation |
| `discovery` | Selected for implementation discovery | Existing control-plane consumers must be rechecked before source edits; no external discovery connector is needed |
| `task-decomposition` | Selected | Task ownership/dependency contract is material |
| `subagent-mission-brief` | Selected | Four separate native role bindings require complete dispatch records |
| `security-pass` | Selected | Admission and closeout controls are security-relevant |
| `systematic-debugging` | Selected | Prior root-inheritance failure and adversarial gate fixtures require evidence-led diagnosis |
| `spec-drift-audit` | Selected | Frozen docs, code, active state, and reports require Drift |
| `git-safety` | Selected | Exact subject publication and preservation of unrelated worktrees are in scope |
| `git-orchestration-flow` | Selected | Lifecycle projection, freeze/close, commit, and exact subject publication are in scope |
| `memory-ops` | Selected | Required snapshots, operational synchronization, and closeout records |
| `crash-test-gate` | Not applicable | No routes, navigation, sitemap, or frontend behavior changes |
| `webapp-testing` | Not applicable | No browser/UI behavior changes |
| `deploy-operations` | Not applicable | Deployment is explicitly excluded and remains a Hard Stop |
| `vps-operations` | Not applicable | No VPS or live-service action is authorized |
| `design-direction` | Not applicable | No visual/design artifact changes |
| `impeccable` | Not applicable | No UI implementation |
| `media-*` skills | Not applicable | No media generation or integration |

### Owner-approved unavailable-skill exception

The Owner's continuation instruction explicitly requires separate native
Critic, Reviewer, and Verifier subagents whenever native capability is
available. That instruction is the authority for this Work Block's narrow
`critic-review` fallback: the native Critic role is used with the selected
requirements-quality and consistency skills, while no unavailable skill is
claimed or substituted. `.codex/AGENTS.md` remains unchanged because the
approved scope is preserved and the inactive-state write guard correctly
rejects unlisted source edits. Any future repository-wide change to that
runtime instruction requires its own approved scope.

## Stage 0 capability and task ordering

Before `open`, the Orchestrator runs the bounded native capability probe and
records its authoritative dispatch event reference, runtime, adapter and
version, root, branch, baseline, role probes, and RFC3339 UTC timestamp in the
capability report. The probe uses separate read-only Critic, Reviewer, and
Verifier launches only to establish role availability; those probe executions
are never reused as assurance bindings. The fresh Critic reviews that report
and the Define package. Only after its approval does the Orchestrator perform
the `open` transition with the Critic binding. Implementation admission does
not depend on Reviewer/Verifier assurance records that can exist only after
freeze.

The ordered task dependencies are: `TASK-001` Define and probe; `TASK-002`
Orchestrator-only projection and open transition; `TASK-003` sole Coder
implementation; `TASK-004` Orchestrator evidence and Process Feedback;
`TASK-005` freeze, post-freeze active-state bindings, and separate
Reviewer/Verifier assurance; `TASK-006` closeout, registry/projection
synchronization, and exact subject publication.
No task may be marked complete without its stated owner, dependency, paths,
checks, and evidence fields.

## Exact assurance checks

The Coder runs the focused topology test, the Define traceability validator,
Python syntax checks for changed Python files, and the release-state contract
tests. After freeze, Reviewer and Verifier independently run the focused
topology tests and release-state validator. The focused test must show one
valid admission and denials for missing/unknown/failed capability, stale state,
duplicate role, reused execution/context ID, same-session overclaim, wrong
Work Block, wrong root/branch, frozen-revision mismatch, missing report,
capability tuple mismatch, malformed/multi-value role dispatch, malformed,
duplicate, or non-native aggregate probe ledgers, aggregate-probe reuse,
Critic binding/report mismatch at admission, and Reviewer/Verifier
binding/report mismatch at closeout. Any failed required role launch is
recorded as `DEGRADED` with its actual error; the closeout remains
blocked/reporting-only.

## Out of scope

Application code and routes; deployment or live restart; PostgreSQL/schema or
migrations; credentials, tokens, secrets, and environment files; dependency
changes; external services; merge; default/protected branch mutation; force
push; remote branch deletion; reset, clean, or other destructive operations;
and weakening or bypassing existing write/session-root guards.

## Stop conditions

Return to Define if a contract requires a new dependency, config/secret,
database, deployment, authority change, broader write-set, or a weaker guard.
If native role launch fails after implementation, record the actual degraded
state and leave the assurance verdict blocked rather than substituting
main-thread assurance.

## Final State

- **Stage State:** completed
- **Review Gate:** READY
- **Verification Verdict:** READY
- **Drift Gate:** ALIGNED
- **Evaluation Verdict:** SKIPPED — no generative or rubric-based deliverable is in scope
- **Task Status:** completed
- **Closeout Mode:** success-closeout
- **Final Candidate:** recorded after the approved subject-branch commit and publication
- **Owner Handoff:** integration review required; no merge or deployment
