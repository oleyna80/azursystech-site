# Define-Stage Requirements Quality Contract

## Purpose

Stage 0 / Define must produce implementation-ready requirements without turning
an agent's guesses into silent product decisions.

This contract adds three quality functions before implementation:

1. **Clarification** — resolve material ambiguity before technical planning.
2. **Requirements-quality review** — evaluate the written specification as a
   requirements artifact, not as an implementation.
3. **Pre-execution consistency analysis** — compare specification, accepted
   architecture/plan, and task decomposition for gaps and conflicts.

These functions refine Define. They do not create new authority roles, a second
lifecycle, or a new source of truth.

## Installed Controller v1 applicability

Clarification, requirements review, traceability and consistency analysis
remain approved planning and assurance *methodologies*. Installed Controller v1
has neither a schema-v3 `define_quality` field nor a tracked write gate.
Its executable transition requires trusted admission, committed planning and
the independent Critic `READY` binding. This document cannot grant a separate
source-write permission or promote evidence into runtime authority; see
`AGENTS.md` and `governance/authority.md`.

## Authority and Source of Truth

The existing authority order remains unchanged:

```text
Owner instruction
  -> approved specification
  -> accepted architecture decisions / external contracts
  -> approved plan and write-set
  -> task decomposition
  -> assurance evidence
```

Clarification answers are authoritative only after they are recorded in the
approved specification or an Owner-approved change request.

A requirements checklist, consistency report, tasklist, validator result, or
external benchmark never overrides the approved specification and never opens a
write gate by itself.

## 1. Clarification Function

### Goal

Reduce ambiguity that would materially change behavior, architecture, data,
permissions, task decomposition, verification, operations, security, compliance,
or user experience.

### Resolution classes

Every unresolved item is routed to exactly one class:

- **evidence-resolvable** — answer from repository, accepted decisions, external
  contract, or other authoritative evidence; do not ask the Owner;
- **explicit assumption** — a reasonable, reversible, non-material default that
  does not change product scope or risk; record it visibly;
- **material independent ambiguity** — ask with other independent high-impact
  questions in a small bounded batch;
- **material dependent ambiguity** — ask sequentially because one answer changes
  the next decision;
- **blocking ambiguity** — no safe default or evidence exists; keep Define
  `BLOCKED` until resolved.

### Coverage scan

A formal clarification pass considers, when relevant:

- outcome, scope, and exclusions;
- actors, permissions, and ownership;
- domain entities, identity, state, and lifecycle transitions;
- primary, alternate, failure, retry, recovery, and conflict behavior;
- integrations and external contracts;
- performance, reliability, observability, security, privacy, compliance, and
  accessibility requirements;
- migration/compatibility expectations;
- terminology, assumptions, and measurable completion signals.

This is a coverage framework, not a requirement to ask about every category.
Questions are only justified when the answer materially changes downstream work.

### Interaction budget

Default behavior:

- resolve evidence-resolvable facts without Owner interaction;
- record non-material defaults as assumptions;
- batch up to three independent material questions when that reduces interaction
  without coupling answers;
- ask dependent questions one at a time;
- normally stop after five material Owner decisions in one clarification pass and
  surface any remaining blocking ambiguity explicitly.

The interaction budget is an efficiency rule, not permission to guess a blocking
requirement.

### Write-back rule

Accepted clarification must update the authoritative specification, including any
affected requirement, acceptance criterion, assumption, non-goal, risk, or open
decision. Do not leave contradictory stale wording in place.

## 2. Requirements-Quality Review

### Goal

Determine whether the specification is sufficiently clear, complete, consistent,
measurable, bounded, and traceable to support planning and implementation.

The review evaluates **requirements writing**, not code behavior.

Typical questions include:

- Is every material behavior explicitly required or explicitly out of scope?
- Are actors and permissions unambiguous?
- Are vague terms converted to objective criteria where necessary?
- Are failure, conflict, empty, retry, and recovery cases specified when material?
- Are security/privacy/operational constraints present when the domain requires
  them?
- Are assumptions and external dependencies explicit?
- Can each required behavior be connected to an acceptance criterion?

### Ownership

- Managed, Assured, and Distributed work with a formal specification require a
  requirements-quality review with resolved nonblocking evidence before the
  independent Critic decision and trusted Controller v1 Critic READY binding.
- The preferred reviewer is a read-only function distinct from the specification
  author when the selected governance profile expects independence.
- Controlled work uses the review by risk.
- Quick Fix and eligible NDR follow their existing narrower contracts.

The specification author may perform self-checks, but a self-check must not be
represented as independent review.

### Verdicts

Use:

- `READY` — no unresolved material requirements-quality blocker;
- `CHANGES_REQUIRED` — specification changes are required before implementation;
- `BLOCKED` — a dependency or Owner decision prevents completion;
- `UNVERIFIED` — required evidence was unavailable.

`READY` is evidence for Define. It does not grant source-write authority.

## 3. Stable Traceability

### When required

Use stable requirement/acceptance/task IDs for Managed, Assured, and Distributed
work when a formal tasklist is produced. Controlled work may use the same format
when it improves clarity. Do not force IDs into trivial quick fixes.

### Specification format

Portable minimum syntax:

```text
- REQ-001: Required behavior.
- AC-001 [req=REQ-001]: Measurable acceptance criterion.
```

An acceptance criterion may cover multiple requirements:

```text
- AC-010 [req=REQ-003,REQ-004]: Observable combined outcome.
```

### Task format

Portable minimum syntax:

```text
- [ ] TASK-001 [type=requirement] [req=REQ-001] [ac=AC-001] [paths=src/a.py,tests/test_a.py] Implement behavior.
```

Allowed task types:

- `requirement` — implements approved product/technical requirements and must
  reference at least one `REQ-*` and `AC-*`;
- `enabling` — setup/foundation work; requirement references may be `-`;
- `assurance` — tests/evidence/review support; requirement references may be `-`;
- `documentation` — derived documentation synchronization; requirement references
  may be `-`.

Every task declares explicit paths/write-set. Do not invent fake requirement IDs
for enabling or assurance work merely to satisfy a validator.

### Deterministic validation

`validate-define-traceability.py` checks structural coverage only. All task types
remain subject to syntax, duplicate-ID, explicit-path, and unknown-reference
validation when they carry references. **Only `type=requirement` tasks count as
implementation coverage** for `REQ-*` and `AC-*`.

An enabling, assurance, or documentation task may carry a meaningful requirement
or acceptance reference for context, but that reference cannot satisfy the
implementation-coverage requirement.

The validator may prove that IDs and references are complete and internally
consistent; it cannot prove that requirements are correct, sufficient, secure,
or valuable. A structural failure keeps the pre-execution traceability check
`BLOCKED` until corrected.

## 4. Pre-Execution Consistency Analysis

### Goal

Perform a read-only comparison before Execute while corrections are still cheap.

Compare:

```text
specification <-> architecture decisions / plan <-> tasks / write-set
```

Check for:

- approved requirement with no acceptance criterion;
- approved requirement with no implementation task;
- task referencing no approved requirement without an explicit enabling/
  assurance/documentation classification;
- unknown or stale requirement/acceptance IDs;
- plan decision that contradicts the specification;
- task or write-set that introduces unspecifed behavior or scope;
- unresolved blocking ambiguity or assumption presented as fact;
- dependency or parallelization claim inconsistent with write-set overlap;
- verification work that cannot demonstrate the stated acceptance criteria.

### Mutation rule

The analyzer is read-only for normative artifacts. It reports findings and routes
remediation to the owning artifact:

- requirement problem -> clarification/specification revision;
- architecture problem -> architecture/plan revision;
- decomposition problem -> regenerate/update tasks;
- authority/scope problem -> Work Block/Owner decision.

It must not silently rewrite the approved specification, plan, or tasklist.

### Result

Use:

- `READY` — no unresolved material cross-artifact inconsistency;
- `CHANGES_REQUIRED` — an owning artifact must be corrected;
- `BLOCKED` — required evidence/decision is unavailable;
- `UNVERIFIED` — the analyzer could not inspect required artifacts reliably.

## 5. Define-Quality Evidence — installed v1 and historical compatibility

### Installed Controller v1

For Managed, Assured and Distributed formal Work Blocks, all three required
Define-quality functions must be resolved **before the independent Critic
decision and its Controller `READY` binding**:

- requirements-quality review: confirmed `READY`, with a nonempty evidence reference;
- deterministic requirement/task traceability: successful validation, with a
  nonempty evidence reference;
- read-only specification/architecture/plan/task consistency analysis:
  confirmed `READY`, with a nonempty evidence reference.

Missing or blank references, unresolved `CHANGES_REQUIRED`, `BLOCKED` or
`UNVERIFIED` results, and failed traceability validation block progression
until corrected and rechecked. A fluent report or the Critic's later opinion
cannot silently waive these required process checks. Controlled work selects
proportionate evidence based on its approved risk and scope; no selection may
weaken trusted Controller admission or the Owner's authority.

These are **documented process/evidence prerequisites**, not an additional
schema-v2 Controller state, a tracked schema-v3 write gate, or permission to
mutate source. Required evidence is assessed before the committed planning
revision is submitted for Critic review.

Approved specifications, plans and quality reports retain their own artifact
statuses. There is no `define_quality` or `write_gate` field in the installed
schema-v2 Controller state. Trusted admission and Critic `READY` on an exact
committed planning revision control `DEFINE → EXECUTE`; adapters must enforce
this real Controller contract, not tracked schema-v3 JSON.

### Historical schema-v3 prerequisite (not installed authority)

Older scaffolds represented these evidence checks as a single `define_quality`
aggregate with `required`, `status`, `requirements_review`, `traceability`
and `consistency_analysis`. In that legacy model, applicable checks required
`READY` and three nonempty report bindings before the old write gate could
open. Release-state CI may still validate these **tracked compatibility
fixtures**. Such checks are not a substitute for trusted Controller v1
admission, Critic assurance or write-set decisions.

Historical `template/.agent/active-work-block.default.json` migration and
`Critic → Write Gate → write-set` instructions are preserved for provenance
only, not as the installed v1 authorization path. No quality report grants
Git, deployment, publication, credential or external capability.

## Stage 0 Integration

For Managed/Assured/Distributed formal feature work, the preferred Define order is:

```text
objective/discovery
  -> specification draft
  -> clarification
  -> requirements-quality review
  -> architecture / implementation plan
  -> traceable task decomposition + write-set
  -> deterministic traceability validation
  -> read-only consistency analysis
  -> applicable Define-quality evidence reviewed
  -> committed planning revision
  -> independent Critic review
  -> trusted Controller v1 Critic READY binding (DEFINE → EXECUTE)
```

A valid smaller path may collapse functions for low-risk Controlled work, but no
profile may use this contract to weaken existing authority, Hard Stops,
evaluation, assurance, or closeout rules.

## Provenance

- **Classification:** `adapted`
- **Influential source:** `github/spec-kit@bf88c9f9a82fa370c7a7257aa2b3cf10b457b65c`
- **Local research:** `framework/research/spec-kit-gap-analysis-2026-08-14.md`, `framework/research/spec-kit-clarify-checklist-dry-run-2026-08-14.md`
- **Material local delta:** evidence-first clarification; bounded batching of
  independent questions; historical write-gate context retained only for provenance;
  reviewer-owned requirements gate separated from implementation verification;
  deterministic stable-ID traceability added; consistency analysis remains
  read-only and subordinate to specification authority; aggregate Define-quality
  evidence is machine-observable without becoming a parallel authority system.
- **Novelty claim:** none
