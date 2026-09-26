---
artifact_type: remediation_plan
status: draft
scope: docs-only
not_work_block: true
---

# SDLC Remediation Plan

## Status

Draft architecture plan derived from the SDLC audit.

This document does not authorize implementation. Each implementation batch must later be converted into a separate bounded Work Block with its own scope, acceptance criteria, Critic, assurance, and publication flow.

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

Decide and document:

1. canonical lifecycle states;
2. explicit transition names;
3. mutation classes;
4. assurance invalidation semantics;
5. canonical Git index state for each lifecycle phase;
6. terminal transaction ordering;
7. STOPPED/reporting-only semantics;
8. single schema/parser ownership.

Exit criteria:

- one approved architecture model exists;
- no two layers independently define conflicting transition semantics.

## Phase C — Git transaction layer

Primary objective:

Make worktree/index/history transitions explicit and deterministic.

Expected capabilities:

- materialize exact frozen candidate into index;
- rebuild stale index from exact frozen candidate;
- recover an unpublished candidate to a known canonical state;
- verify no extra/forbidden path enters the index;
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

Likely future Work Block:

**Control-Plane Schema Unification**

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

Minimum recovery scenarios:

- source rework after Reviewer CHANGES_REQUIRED;
- evidence-only repair;
- stale-index rebuild;
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

Likely future Work Block:

**SDLC E2E Transaction Harness**

## Proposed implementation order

Do not implement everything in one Work Block.

Recommended sequence after architecture approval:

1. Git Transaction & Index Recovery.
2. Terminal Transaction & Closeout Ordering.
3. Assurance & Evidence Contract Cleanup.
4. Control-Plane Schema Unification.
5. Hook Responsibility Simplification.
6. SDLC E2E Transaction Harness.
7. Final conformance hardening after the E2E path is green.

The exact number and boundaries of Work Blocks may change after the audit is complete.

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
