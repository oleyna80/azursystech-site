# Hook and Enforcement Policy

## Purpose

This policy defines how AzurSysTech enforces Agentic SDLC invariants across
different agent runtimes without making the governance contract depend on one
harness-specific hook API.

The architecture defines **what must remain true**. Git hooks, shared validators,
Codex hooks, Claude Code hooks, future runtime adapters, and external platform
controls are implementation surfaces for those invariants. An enforcement
mechanism cannot create authority that the governance model does not already
grant.

## Core Principles

### Durable memory

If a decision, constraint, assumption, exception, failure, approval, or
verification result can matter after the current agent session ends, it must be
persisted in an appropriate repository artifact before the Work Block is
considered complete.

Chat history, model context, local runtime memory, and an individual agent's
recollection are working memory, not durable project authority.

Specifications, plans, ADRs, tasklists, reports, engineering memory, tests, Git
history, and other approved repository artifacts provide the durable record.

### Reversible autonomous execution

Agents may autonomously perform approved engineering work when the action is
bounded, inspectable, and recoverable.

Git is the primary versioning and recovery mechanism for source work:

- implementation occurs on an attached non-default subject branch;
- meaningful work is preserved in commits;
- history is not rewritten as part of normal autonomous work;
- force pushes and destructive ref updates are not normal agent operations;
- an assured subject branch may be published only through the approved
  lifecycle path.

Merge, deployment, release, destructive production data changes, production
infrastructure mutation, credential changes, and other consequential external
actions remain Owner-controlled unless the Owner gives explicit authority for
that exact action.

A merge authorization does not imply deploy authorization.

### Poka-yoke safety

When an SDLC invariant is important enough that violating it could corrupt the
candidate, lose recoverability, cross an authority boundary, or create a
consequential external side effect, compliance must not depend only on the
model following prose instructions if the invariant can be checked
deterministically.

Text explains the process. Enforcement prevents invalid transitions or unsafe
actions.

### Invariant-first, runtime-neutral design

Governance specifies observable invariants, not the hook API of a particular
runtime.

For example, the architecture may require that before subject-branch
publication:

- the current branch is the exact Work Block subject branch;
- the update is non-force and does not target a default/protected branch;
- the candidate identity is unchanged;
- required Reviewer and Verifier evidence belongs to that exact candidate;
- no External Hard Stop applies.

Codex, Claude Code, or another supported runtime may expose different native
events and response schemas. Their adapters may therefore differ, but the
observable decision and fail-closed semantics must remain equivalent.

## Enforcement Placement

Prefer the least runtime-specific control surface that can reliably enforce the
invariant.

The default placement order is:

1. **External platform and capability controls** — GitHub rulesets, protected
   branches, deployment environments, least-privilege credentials, database
   roles, infrastructure permissions, and equivalent boundaries. These are the
   final boundary for consequential actions.
2. **Git-native hooks and validators** — use when the invariant is visible at a
   Git transition such as commit or push.
3. **Shared runtime-neutral policy and validators** — hold common decision
   semantics so Git and runtime-specific adapters do not independently
   reimplement the same rule.
4. **Harness-specific adapters/hooks** — use for events Git cannot observe, such
   as pre-write tool calls, shell commands, session-root binding, runtime role
   dispatch, SSH, database, or infrastructure tool use.
5. **Textual instructions** — guidance for judgment, workflow, and behavior that
   cannot be made deterministic. Text must not be the sole protection for a
   mechanically enforceable critical invariant.

Critical boundaries may be enforced at more than one layer as defense in depth.
A local hook is still a cooperative project guardrail; it does not replace an
external security or authority boundary.

## Git-Native Control Points

Use Git-native hooks where Git has sufficient evidence.

### `commit-msg`

Appropriate checks include:

- active Work Block and current branch consistency;
- required `Work-Block:` trailer;
- exact Work Block identifier grammar;
- commit-message invariants.

### `pre-commit`

Appropriate checks include:

- staged paths are inside the admitted write-set;
- prohibited local/session-only files are not accidentally committed;
- required deterministic staged-candidate checks;
- no obviously forbidden source/control-surface combination is staged.

A pre-commit hook should not duplicate broad code review or architectural
judgment that belongs to Reviewer or Verifier.

### `pre-push`

Appropriate checks include:

- remote/ref destination is the exact permitted subject branch;
- default/protected branch publication is denied;
- force/non-fast-forward/destructive ref updates are denied unless separately
  Owner-authorized;
- required candidate and assurance predicates are satisfied;
- the candidate being pushed is still the candidate that was reviewed and
  verified.

Git hooks should be thin where practical and call shared validators or policy
code instead of carrying independent copies of lifecycle business logic.

Agents must not use `--no-verify` or equivalent bypass mechanisms to defeat a
required repository control.

## Harness-Specific Control Points

Runtime hooks remain necessary for events that Git cannot see early enough or
cannot see at all, including:

- repository/session-root binding;
- writes attempted before staging;
- write-set enforcement at tool-call time;
- destructive shell commands;
- secrets and credential operations;
- live database mutations;
- SSH and infrastructure mutations;
- runtime capability probes;
- Critic, Reviewer, and Verifier dispatch boundaries.

A runtime adapter should:

1. read the runtime-native event;
2. normalize it into the repository's canonical policy/event model;
3. invoke shared policy/validation logic where available;
4. translate the decision into the runtime-native allow/deny/result format.

The adapter should not silently create a second governance implementation.

If a runtime cannot enforce a required critical invariant and no stronger Git or
external boundary covers it, that capability must be treated as unavailable or
degraded rather than assumed from textual compliance.

## SDLC Control Points

The expected control points are:

- **Bootstrap/admission** — verify the intended repository/session root, attached
  branch, active Work Block, specification identity, approved scope, exact
  write-set, and required capability evidence before write authority is opened.
- **Before write** — allow mutation only inside the admitted write-set and only
  in a lifecycle state that permits source writes.
- **Before freeze** — verify that the candidate is coherent, the approved scope
  and write-set have not expanded, and the required deterministic checks for
  freezing have completed. Freezing establishes the exact candidate identity
  used by assurance.
- **Before Reviewer/Verifier** — require the exact frozen candidate, the required
  role/context isolation for the selected governance profile, and valid durable
  evidence/report paths. Verifier dispatch must respect the lifecycle ordering
  after Reviewer where required.
- **After rework** — any source change that creates a new candidate invalidates
  candidate-specific Reviewer/Verifier assurance from the previous candidate;
  a new freeze establishes a new assurance boundary.
- **Before commit** — verify branch/Work Block consistency, the required
  `Work-Block:` trailer or equivalent linkage, staged scope/write-set, and
  absence of prohibited local/session-only or otherwise forbidden files.
- **Before push** — require the exact subject branch and explicit non-force
  publication form, deny default/protected/destructive ref updates, prove the
  frozen candidate is unchanged, and require the applicable Reviewer/Verifier
  assurance for that exact candidate.
- **Before dangerous operations** — default/protected branch mutation, merge,
  deployment, release, destructive production database mutation, live
  infrastructure mutation, secrets/credentials changes, and equivalent Hard
  Stops require the applicable explicit Owner/external authority.
- **Closeout** — preserve required durable documentation and assurance reports,
  promote reusable engineering memory/process feedback when applicable, and
  restore the canonical inactive lifecycle state without inventing successful
  evidence.

## Fail-Closed and Advisory Boundaries

Fail closed when authority, target, candidate identity, branch, write scope, or
a required safety predicate is missing, malformed, contradictory, or unknown.

Do not turn subjective quality judgments into hard stops merely because they
can be expressed in prose. Architecture quality, maintainability, product
fitness, and similar judgments belong primarily to Critic, Reviewer, Verifier,
and Owner review unless a specific deterministic invariant has been defined.

The goal is strong protection at real control points without blocking normal
reversible engineering work.

## Change and Test Rule

A change to an enforcement mechanism must identify:

- the SDLC invariant it enforces;
- the layer where enforcement belongs;
- expected allow and deny behavior;
- regression tests for both legitimate workflow and prohibited cases;
- any runtime-specific adapter differences;
- the external authority boundary that remains outside project-local control.

Observed agent failures are useful regression inputs, but hooks are designed
from the SDLC control points and required invariants, not only after a model has
already failed.

## Relationship to Other Governance

- `governance/authority.md` defines who may authorize consequential actions.
- `governance/lifecycle.md` defines lifecycle semantics and transitions.
- `.agent/workflows/sdd-protocol.md` defines the operating procedure.
- Runtime adapters implement the required control points using their native
  capabilities.

This policy defines enforcement placement and portability. It does not by
itself change the current lifecycle eligibility rules for commit, publication,
closeout, merge, or deployment.
