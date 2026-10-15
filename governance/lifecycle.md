# Runtime-Neutral Lifecycle

## Purpose

The lifecycle defines control functions and evidence transitions. It does not
require one permanent agent per function and does not prescribe a specific
runtime topology.

The lifecycle is a process-control system, not the primary security boundary.
Work Blocks, write sets, Critic/Reviewer/Verifier gates, and project-local hooks
constrain normal agent behavior. Consequential authority is enforced externally
wherever practical through GitHub repository rules, least-privilege credentials,
workflow permissions, OS isolation, and separately held production credentials.

Per-Work-Block SSH signatures and authorization-bootstrap commits are not part of
the normal lifecycle. They were retired because the cryptographic local state
machine introduced circular bootstrap, replay, H0/H1/H2, expiry, digest, and
runtime-parity complexity while remaining dependent on project-local hooks that
are not an OS security boundary.

## Installed Controller v1 — state and precedence

The installed runtime lifecycle is `INACTIVE → DEFINE → EXECUTE → ASSURE → INACTIVE`
(schema v2). Trusted installation configuration, external active admission and
per-worktree Git-private Controller state determine executable authority. Missing
or corrupt state is **not** `INACTIVE`. See `AGENTS.md`,
`governance/authority.md` and `.agent/controllers/v1/`.

The macro stages below describe *process activities*, not a second runtime
state machine. Process Close is not a Controller v1 state; tracked schema-v3
write gates and legacy terminal publication are historical/CI projections only.

## Macro Stages

### Stage 0 — Define

Functions:

1. Intake and objective framing.
2. Discovery and repository orientation.
3. Architecture and dependency decisions.
4. Specification and acceptance criteria.
5. Implementation planning and write-set definition.
6. Critic review of scope, risks, topology, verification, and evaluation design.
7. Classification of consequential external capabilities and Hard Stops.

Required outcome:

- approved objective;
- authoritative specification or explicit quick-fix contract;
- implementation plan and write set;
- risk, side-effect, and external Hard-Stop classification;
- verification plan;
- evaluation plan when output or trajectory evaluation is required;
- resolved Critic gate or documented permitted fallback;
- explicit external capability path for any consequential action.

No implementation write may begin while Stage 0 is blocked.

For installed v1, requirements-quality, traceability and consistency reports
remain planning evidence, not schema-v3 source-write gates. With trusted
admission and a committed planning revision, an independent Critic `READY`
binding permits `DEFINE → EXECUTE`. No local evidence grants production,
credential, live-data, destructive, protected-branch or external authority.
Trusted publication is governed by `governance/authority.md`.

### Stage 1 — Execute

Functions:

1. Scoped implementation by one Coder per write set.
2. Targeted self-checks.
3. Scope and side-effect re-evaluation when new information appears.
4. Observable event and evidence capture required by the approved evaluation plan.
5. Diff freeze for assurance.

Required outcome:

- implementation matches the approved write set;
- no unapproved side effect occurred;
- required observable trajectory evidence is attributable to the Work Block;
- the diff is frozen or its exact revision is recorded;
- implementation concerns and unresolved assumptions are reported.

Installed v1 does not publish from a schema-v3 frozen/write-gate predicate
or a terminal closeout commit. A clean committed candidate enters `ASSURE`;
independent Reviewer and Verifier `READY` bindings must refer to that exact
source SHA. Trusted publish of the exact non-force subject ref through origin
then verifies remote tip and records immutable provenance before `INACTIVE`.
Only allowed linear coordination-only changes may follow the assured candidate;
source/planning changes or merges are denied or require renewed assurance.

Within approved scope, ordinary reversible development operations may include
staging, local commits, and corrective loops. After required assurance is READY,
the trusted Controller exact-subject publication defined by
`governance/authority.md` is also autonomous within the approved scope and
external capability boundary. A `CHANGES_REQUIRED` loop stays autonomous only until the
next candidate again completes its required assurance.

Direct protected/default-branch mutation, force/history-rewriting operations,
production/live infrastructure, live data, credentials/secrets, irreversible
external publication, and real client-facing communication remain outside the
normal agent channel and require the separately controlled capability defined in
Stage 0.

A material scope, requirement, architecture, authority, or external-capability
change returns the Work Block to Stage 0.

### Stage 2 — Assure

Functions:

1. Independent code review of the frozen diff.
2. Technical verification against acceptance criteria and contracts.
3. Output and observable trajectory evaluation when required.
4. Specification drift audit when required.
5. Consolidation of findings and corrective-loop decision.

Review asks whether the change is safe and maintainable.

Verification asks whether the required behavior is demonstrated by evidence.

Evaluation asks whether the final artifact and observable execution events meet an
approved rubric and benchmark revision. Trajectory evaluation inspects tool, gate,
check, retry, side-effect, and evidence events; it never requires hidden reasoning or
private chain-of-thought.

Drift audit asks whether specification, architecture decisions, plan, code,
tests, evaluation evidence, and documentation still describe the same system.

Required outcome:

- review verdict;
- verification verdict;
- evaluation verdict when evaluation is required;
- drift classification when triggered;
- residual risks and inspection gaps;
- corrective action for blocking findings.

For applicable non-trivial `Managed`/`Assured` work, independent Critic,
Reviewer and Verifier reports require actual execution evidence and trusted
Controller bindings. Critic `READY` binds the committed planning revision;
Reviewer and Verifier `READY` bind the exact clean source candidate in
`ASSURE`. Missing, provisional, mismatched or `BLOCKED` reports never
satisfy assurance; reports alone do not create authority.

The old schema-v3 `prepare-verifier` / `finalize-verifier` coordination
procedure is historical, not an installed Controller v1 transition.

Passing local assurance does not grant an external Hard Stop capability. For
example, a `READY` verification may prove a deployable artifact while the actual
production deploy remains unavailable until the external Owner-controlled
workflow or credential boundary permits it.

### Process closeout and reporting (not a Controller v1 state)

Functions:

1. Classify closeout.
2. Synchronize specifications, decisions, task state, and documentation.
3. Promote reusable knowledge into engineering memory.
4. Record residual risks and follow-up Work Blocks.
5. Produce an Owner-facing report.

Only a verification verdict of `READY` and every required evaluation verdict of
`READY` permit successful closeout.

`BLOCKED` or `UNVERIFIED` verification/evaluation permits diagnostics, corrective
planning, and reporting-only closeout. It does not permit merge-ready, deploy-ready,
release-ready, or completed claims.

Successful process closeout also does not bypass an external repository or
production control. A protected merge, release, or deploy must still satisfy the
applicable GitHub/OS/credential boundary.

## Lifecycle State — installed Controller v1

The installed state machine is `INACTIVE | DEFINE | EXECUTE | ASSURE`:
`INACTIVE → DEFINE → EXECUTE → ASSURE → INACTIVE`. The external admission,
trusted configuration and Git-private schema-v2 state bind permissions.
Missing state does not authorize anything. Normal completion requires trusted
publication, remote-tip verification and immutable provenance. Failure
preserves `ASSURE`, while reporting-only/cancelled outcomes are separate.

## Historical schema-v3 process state (non-authoritative)

Older generated projects and CI release-state fixtures use tracked fields
such as `stage: define|execute|assure|close`, `execution_state`,
`closeout_mode`, `authority_mode: github_capability` and
`write_gate: READY|BLOCKED`. These are **historical compatibility projections**,
not installed Controller state. They cannot grant source writes, reopen scope
or authorize inactive-state coordination. Historical signed approvals likewise
grant no current authority.

## Governance Profiles

### Advisory

- Read-only analysis.
- No implementation write.
- Same-context critique is acceptable when labeled.
- Evaluation is normally optional and cannot be represented as independent when it is not.

### Controlled

- One bounded executor.
- Explicit scope and write set.
- Basic review and verification may run sequentially.
- Deterministic tests are required when applicable; focused evaluation is selected by risk.

#### Narrow Deterministic Repair (NDR)

NDR is a mechanically constrained submode of `Controlled`, not a governance
profile. It is available only for a deterministic, reversible low- or
medium-risk repair with no architecture decision and an exact approved path
allowlist wholly inside CI, bootstrap, or runtime-validation surfaces. Product,
auth, security-boundary, public API, schema, data, deploy, and dependency-upgrade
changes are ineligible.

An eligible NDR has one repair record, one Coder implementation pass, and one
independent read-only combined assurance pass. The repair record names the root
cause, allowlist, prohibited changes, deterministic commands, and stop condition.
Combined assurance records logical review, deterministic verification, and its
final verdict. NDR allows at most one correction round. If that procedural
ceiling is exceeded, NDR mode terminates and the Orchestrator reclassifies the
work under the appropriate broader governance profile or ordinary corrective
loop within the same approved Work Block. Execution continues autonomously
when the approved architecture, scope, authority, and risk boundary are
unchanged. An Owner decision is required only when the reclassification itself
would change one of those boundaries (including a prohibited-domain change),
or when another Owner-controlled Hard Stop is reached.

#### Integration Stabilization

Integration Stabilization is a bounded execution envelope, not a profile. It may
group at most three sequentially discovered eligible NDR items and at most two
correction rounds. Every item keeps its own exact CI/bootstrap/runtime-validation
allowlist. Exceeding either procedural ceiling terminates the stabilization
envelope and causes the Orchestrator to reclassify the work under the
appropriate broader governance profile or ordinary corrective loop within the
same approved Work Block. It may continue autonomously when architecture,
scope, authority, and risk boundaries remain unchanged. A prohibited-domain
change, architecture decision, or other material boundary change requires the
Owner decision that the reclassification entails; the numeric ceiling alone is
not a human blocker.

### Managed

- Approved specification and plan.
- Critic before execution.
- Reviewer and Verifier contracts after execution.
- For non-trivial work, available native capability with distinct native Critic,
  Reviewer, and Verifier role bindings; unavailable capability is explicitly
  degraded/blocked and cannot be replaced by the main thread.
- Approved evaluation plan for non-deterministic outputs, agent behavior, or consequential automation.
- Evidence-based closeout.

### Assured

- Independent review and verification.
- For non-trivial work, Critic `READY` must bind the exact committed
  `planning_subject.revision`. Reviewer and Verifier `READY` must each bind
  the identical `source_candidate_sha` in Controller v1 before trusted
  publication. `base_commit` anchors admission; the legacy
  `frozen_revision` does not replace these exact v1 bindings.
- Preserve evidence of independent native execution contexts and actual
  isolation where required; these are assurance conditions, not extra
  schema-v2 authority fields.
- Independent output and observable trajectory evaluation when applicable.
- Fixed rubric and benchmark revisions.
- Drift audit.
- Threat model or domain-specific assurance when relevant.
- Runtime evidence and stronger isolation.

### Distributed

- Multiple runtimes, sessions, worktrees, or external teams.
- Formal handoff, consolidation, conflict handling, recovery, and audit trail.
- Cross-runtime evaluation evidence records source runtime, role, event provenance, and actual isolation.

Governance profile and runtime profile are independent selections.

## Quick-Fix Path

A quick-fix path may be used only when all of the following are true:

- the objective is unambiguous;
- implementation scope is small and bounded;
- there is no material logic, API, schema, auth, security, database, runtime,
  deployment, provider, or governance impact;
- verification is cheap and deterministic;
- output/trajectory evaluation is not required by risk or non-determinism;
- no external Hard Stop is in scope.

The quick-fix contract still requires scope, an explicit result, checks, and a
truthful closeout. It does not exempt side-effect, secret, or external-capability
rules.

## Failure Rules

When a lifecycle function fails:

- downstream state-changing functions remain blocked;
- diagnostics and corrective planning may continue;
- reporting-only closeout may continue;
- a failed or unavailable review, verification, or evaluation step must not be represented as a pass;
- a required evaluation with missing observable events remains `BLOCKED` or `UNVERIFIED`;
- implementation may resume only after the trusted Controller admission, state,
  write-set and corrective-loop rules permit it;
- missing external capability remains unavailable regardless of project-local
  text, local gate state, test results, or evaluation scores.
