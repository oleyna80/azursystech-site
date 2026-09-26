---
artifact_type: remediation_plan
status: ready_for_work_block_planning
scope: docs-only
not_work_block: true
---

# SDLC Remediation Plan

## Status

Implementation planning sequence derived from the frozen SDLC Architecture v0.6.

This document does not authorize implementation. Each implementation batch must later be converted into a separate bounded Work Block with its own scope, acceptance criteria, Critic, assurance, and publication flow.



## Planning status

Architecture design is frozen. The next activity is **Work Block decomposition**, not further architecture redesign.

No remediation implementation is authorized by this document alone. Each implementation batch requires its own bounded Work Block contract.

## Guiding principle

The goal is not to add more controls.

The goal is to make the control plane smaller, more explicit, and mechanically consistent:

- one lifecycle state machine;
- one transaction model for worktree/index/history;
- thin deterministic hooks;
- shared schemas/parsers;
- precise assurance invalidation;
- end-to-end transaction tests before broad enforcement.

## Phase A — Complete the audit

Deliverables:

- findings register complete;
- transition matrix complete;
- recovery matrix complete;
- assurance/evidence dependency map complete;
- authority map complete;
- unresolved design questions explicitly listed.

Exit criteria:

- every happy-path and recovery transition has preconditions, allowed mutation, postconditions, owner, invalidation rules, and positive/negative test expectations;
- no implementation changes are required to understand the model.

## Phase B — Freeze target architecture

Frozen architecture contract: `docs/architecture/sdlc-architecture-freeze.md` revision v0.6.

Decide and document:

1. canonical lifecycle states;
2. explicit transition names;
3. mutation classes;
4. assurance invalidation semantics;
5. canonical Git index state for each lifecycle phase;
6. terminal transaction ordering;
7. STOPPED/reporting-only semantics;
8. single schema/parser ownership.

Exit criteria: **COMPLETE (2026-09-26)**

- Owner approved Architecture Freeze v0.6;
- one frozen architecture model exists;
- the consistency review found no remaining material internal contradiction;
- later implementation Work Blocks must treat the frozen architecture as their contract rather than redesigning it opportunistically.

## Phase C — Git transaction layer

Primary objective:

Make worktree/index/history transitions explicit and deterministic.

Expected capabilities:

- materialize the complete candidate package into index: exact frozen source + finalized candidate-bound evidence;
- rebuild stale candidate index from canonical source/evidence bindings;
- recover an unpublished candidate to a known canonical state;
- recover an unpublished candidate package for evidence-only repair without replaying source assurance when semantics are unchanged;
- verify no terminal-only/extra/forbidden path enters the candidate index;
- preserve source bytes during index-only transitions.

Key invariant:

> Git commands are implementation details. The SDLC contract specifies the required postcondition.

Likely future Work Block:

**Git Transaction & Index Recovery**

Scope should be limited to transaction semantics, focused runtime/Git hook adapters, and regression fixtures.

## Phase D — Lifecycle and terminal transaction

Primary objective:

Make candidate and terminal publication two explicit transactions.

Target sequence:

```text
candidate staged
→ candidate committed
→ terminal prepared while active
→ success closeout
→ canonical inactive materialized
→ terminal committed
```

Required changes:

- explicit `TERMINAL_PREPARED` state or equivalent invariant;
- success-closeout must refuse to run before terminal projection is complete;
- no evidence generation should be required after successful close;
- terminal commit parent/bindings must be deterministic.

Likely future Work Block:

**Terminal Transaction & Closeout Ordering**

## Phase E — Assurance and evidence contracts

Detailed target model: `docs/architecture/sdlc-assurance-evidence-model.md`.

Primary objective:

Separate source assurance from evidence formatting/metadata validation.

Define:

- Define Critic as contract assurance;
- candidate-bound Critic disposition as a separate frozen-candidate binding;
- Reviewer and Verifier as exact-candidate assurance;
- explicit optional assurance dispositions;
- Process Feedback as process/terminal evidence rather than source assurance;
- closeout as a derived terminal manifest;
- which transitions each artifact blocks.

Required result:

- evidence schemas are validated at artifact finalization time;
- evidence-only repair does not automatically invalidate source assurance;
- source changes always invalidate candidate assurance;
- contract changes invalidate only assurance layers whose semantics may have changed;
- index-only materialization invalidates no assurance;
- closeout does not manually duplicate stale Critic/Reviewer/Verifier bindings.

Likely future Work Block:

**Assurance & Evidence Contract Cleanup**

## Phase F — Shared schema/parser layer

Detailed schema/contract model: `docs/architecture/sdlc-schema-contract-model.md`.

Primary objective:

Remove independent interpretations of the same repository contract.

Target architecture:

- one canonical Contract Reader;
- versioned strict artifact schemas;
- one canonical path grammar;
- identical parsing semantics for worktree/index/commit/published views;
- schema/binding validation at artifact creation/finalization time;
- transition semantics kept outside the parser.

Candidate shared contracts:

- specification frontmatter;
- source/coordination write-sets;
- active WB state;
- assurance reports;
- terminal projection metadata.

Required properties:

- strict types with no truthiness coercion;
- duplicate-key rejection;
- malformed/unsupported YAML rejection;
- control-character rejection;
- explicit schema version separate from WB business revision;
- stable machine-readable error classes;
- consumer parity tests across lifecycle, hooks and published conformance;
- consistent behavior in lifecycle, local hooks, and published conformance.

Implementation split:

- **Contract Reader Foundation** early in the sequence for enforcement-critical schemas/parity;
- remaining legacy-reader/schema migration in the final conformance-hardening phase.

## Phase G — Hook simplification

Detailed authority/control model: `docs/architecture/sdlc-authority-control-model.md`.

Primary objective:

Reduce hooks to deterministic enforcement at the correct control points.

Runtime hooks should answer:

> Is this already-defined transition allowed from the current state?

Runtime-specific adapters should only normalize events into one shared runtime-neutral evaluator. Local hooks remain cooperative guardrails; merge/deploy/protected-branch/production boundaries must remain independently enforced by Owner and external platform controls.

They should not:

- invent recovery semantics;
- infer full lifecycle ordering;
- become the system of record;
- duplicate schema logic unnecessarily.

Git-native hooks should keep checks that Git can observe reliably:

- staged tree;
- commit metadata;
- parent/history shape;
- exact push target;
- force/non-force semantics.

Likely future Work Block:

**Hook Responsibility Simplification**

## Phase H — Synthetic end-to-end transaction harness

Detailed harness design: `docs/architecture/sdlc-e2e-transaction-harness.md`.

Primary objective:

Prove the whole SDLC as one transaction before relying on it for real control-plane work.

Minimum positive scenario:

```text
clean base
→ define
→ open
→ source change
→ tests
→ freeze
→ Critic disposition
→ Reviewer
→ Verifier
→ materialize frozen index
→ candidate commit
→ terminal prepare
→ success closeout
→ terminal commit
→ exact non-force publication simulation/conformance
```

Required harness properties:

- transition reachability from each supported non-terminal state;
- parser/schema parity across worktree, index, local commit, and published-history fixtures;
- structured blocker diagnostics;
- canonical happy path completes without ad-hoc repository repair.

Minimum recovery scenarios:

- source rework after Reviewer CHANGES_REQUIRED;
- evidence-only repair;
- stale candidate-index rebuild;
- unpublished candidate recovery;
- reporting-only STOPPED path.

Minimum negative scenarios:

- wrong branch/base/WB;
- stale assurance;
- source mutation after freeze;
- extra staged path;
- malformed contract;
- wrong terminal parent;
- force push;
- reuse of assurance from previous freeze.

Implementation split:

- **SDLC E2E Baseline Harness** first, encoding current expected blockers;
- extend the harness after each remediation WB;
- final phase promotes the fully green E2E suite to a required CI gate.

## Proposed implementation order

Do not implement everything in one Work Block.

Recommended diagnostic-first sequence after architecture approval:

0. **SDLC E2E Baseline Harness** — build isolated fixture infrastructure and encode the current expected blockers without redesigning enforcement.
1. **Contract Reader Foundation** — implement the minimum shared strict schemas/path grammar/parity required by existing enforcement.
2. **Git Transaction & Index Recovery** — add deterministic index materialization and named recovery postconditions.
3. **Terminal Transaction & Closeout Ordering** — make terminal preparation/staging/closeout reachable and deterministic.
4. **Assurance & Evidence Contract Cleanup** — separate candidate assurance from process/terminal evidence and generate closeout manifest.
5. **Hook Responsibility Simplification** — remove duplicated orchestration/parser logic and keep hooks thin.
6. **E2E Green + Final Schema Migration + Conformance Hardening** — migrate remaining consumers and require the complete E2E path in CI.

The E2E harness is extended after every implementation Work Block. Each known blocker becomes a passing scenario when its owning remediation lands.

The exact number and boundaries of Work Blocks may change if a proposed WB becomes too broad.

## Staged migration rule

Because implementation spans multiple Work Blocks, every remediation WB must declare:

- old behavior still supported;
- new behavior introduced;
- producer/consumer versions affected;
- activation point;
- compatibility tests;
- rollback boundary.

A new state, schema, transition, or enforcement rule becomes authoritative only when its producer, consumer, validation path, and corresponding E2E scenario are available together.

Do not activate partially implemented control-plane semantics.

## Work Block creation rule

Each remediation Work Block must:

- fix one coherent architectural concern;
- have a bounded source write-set;
- include positive and negative regressions;
- avoid opportunistic fixes outside its scope;
- record newly discovered systemic findings back into this audit branch;
- stop and request a new plan if a finding changes architecture or authority.

## Rollout principle

New enforcement should be introduced only after the corresponding transition is proven reachable.

Recommended order:

```text
observe
→ model
→ implement
→ focused tests
→ synthetic E2E
→ enforce
```

Not:

```text
enforce
→ discover deadlock
→ repair live control plane
→ repeat
```

## Completion criteria for the revision

The SDLC revision is ready for production use when:

- the canonical happy path passes end-to-end without exceptional Owner Git intervention;
- every supported recovery path has a deterministic postcondition;
- index-only operations cannot invalidate source assurance;
- terminal closeout cannot occur too early;
- published conformance uses the same contract semantics as local lifecycle/hooks;
- no lifecycle state requires a prohibited operation to reach its next valid state;
- merge and deploy remain explicit Owner boundaries.
