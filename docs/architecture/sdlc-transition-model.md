---
artifact_type: architecture_model
status: draft
scope: docs-only
not_work_block: true
---

# SDLC Transition Model

## Purpose

This document defines the target lifecycle model for the AzurSysTech autonomous engineering SDLC.

It is an architectural draft. It does not itself change implementation authority.

## State dimensions

The control plane must reason about four independent but related state dimensions:

1. **Worktree state** — current filesystem bytes.
2. **Index state** — staged Git tree to be committed.
3. **History state** — current HEAD and published/unpublished commits.
4. **Lifecycle/assurance state** — WB status, frozen identity, Critic/Reviewer/Verifier bindings, and closeout state.

A valid transition may mutate one dimension while preserving the others.

## Canonical happy path

```text
DEFINED
→ OPEN
→ FROZEN
→ ASSURED
→ CANDIDATE_STAGED
→ CANDIDATE_COMMITTED
→ TERMINAL_PREPARED
→ CLOSED_SUCCESS
→ TERMINAL_COMMITTED
→ PUBLISHED
```

`IMPLEMENTING` is not a separate state unless it introduces a mechanically distinct contract. Normal implementation is represented by `OPEN + source_write_gate=READY`.

## Transition contracts

### T-001 — DEFINED → OPEN

Owner: Lifecycle Engine.

Preconditions:

- approved specification exists;
- subject branch and base commit are known;
- source and coordination write-sets are explicit;
- Define Critic disposition is resolved;
- no conflicting active WB exists.

Mutation:

- create active WB state;
- source write gate becomes READY;
- candidate-bound assurance becomes PENDING.

Postconditions:

- only approved source/coordination paths are writable;
- no frozen candidate exists.

### T-002 — OPEN → FROZEN

Owner: Lifecycle Engine.

Preconditions:

- source candidate is inside approved write-set;
- required pre-freeze tests/evidence are complete;
- current contract artifacts are consistent.

Mutation:

- compute exact immutable candidate identity;
- block source-byte mutation.

Postconditions:

- `frozen_revision` identifies exact candidate bytes;
- source write gate is BLOCKED;
- index may still need to be materialized.

Core invariant:

> Freeze protects frozen source identity. Freeze does not prohibit index-only operations that materialize those exact bytes.

### T-003 — FROZEN → ASSURED

Owner: Assurance lifecycle.

Sequence:

```text
candidate-bound Critic disposition
→ Reviewer
→ Verifier
→ optional assurance dispositions
```

Postconditions:

- every required assurance is bound to the same exact frozen identity;
- optional assurance is explicitly resolved;
- source remains immutable.

### T-004 — ASSURED → CANDIDATE_STAGED

Owner: Git Transaction Layer.

Required transition:

`MATERIALIZE_FROZEN_CANDIDATE`

Preconditions:

- worktree source bytes exactly match `frozen_revision`;
- selected paths are exactly within the frozen source set;
- no forbidden paths are selected;
- candidate assurance is still valid.

Allowed mutation:

- Git index only.

Forbidden mutation:

- source worktree bytes;
- frozen identity;
- assurance state.

Postconditions:

- staged source tree equals exact frozen candidate.

This transition must also support repair from a stale index.

### T-005 — CANDIDATE_STAGED → CANDIDATE_COMMITTED

Owner: Git + pre-commit guard.

Preconditions:

- staged source equals frozen candidate;
- required assurance is READY/resolved;
- commit metadata is valid;
- no forbidden paths are staged.

Mutation:

- append candidate commit to local history.

Postconditions:

- candidate commit durably records source + required evidence snapshot;
- lifecycle remains active for terminal preparation.

### T-006 — CANDIDATE_COMMITTED → TERMINAL_PREPARED

Owner: Lifecycle Engine + coordination transaction layer.

Preconditions:

- exact candidate commit exists;
- assurance bindings refer to that candidate;
- required closeout evidence exists.

Mutation:

- prepare final plan/tasklist/registry/project-map/release-state projection while WB is still active.

Postconditions:

- terminal projection is fully validated;
- no further source mutation is needed;
- WB is still active.

### T-007 — TERMINAL_PREPARED → CLOSED_SUCCESS

Owner: Lifecycle Engine.

Preconditions:

- candidate commit exists;
- terminal projection has already been prepared and validated;
- required assurance is complete;
- no unresolved required evidence remains.

Mutation:

- lifecycle active state becomes canonical inactive state.

Postconditions:

- no new source or coordination evidence should need to be created;
- only canonical terminal materialization remains.

### T-008 — CLOSED_SUCCESS → TERMINAL_COMMITTED

Owner: Git transaction + terminal pre-commit guard.

Preconditions:

- prepared terminal projection is unchanged;
- inactive lifecycle state is canonical;
- parent is exact candidate commit.

Mutation:

- create terminal commit.

Postconditions:

- WB has a durable canonical terminal boundary.

### T-009 — TERMINAL_COMMITTED → PUBLISHED

Owner: Git pre-push + remote GitHub + CI/published conformance.

Preconditions:

- exact non-force push;
- target is exact subject branch;
- terminal history validates.

Postconditions:

- branch is published;
- CI/published-object checks run;
- result may become READY_FOR_GITHUB_ARCHITECTURE_REVIEW.

## Recovery transitions

### R-001 — FROZEN/ASSURED → REWORK

Use only when source candidate bytes must change.

Mutation:

- source write gate becomes READY;
- frozen identity is cleared;
- candidate-bound assurance becomes PENDING.

Preserved:

- WB identity;
- subject branch;
- approved base;
- approved write-sets unless separately amended.

### R-002 — FROZEN/ASSURED + STALE_INDEX → REBUILD_FROZEN_INDEX

Use when source candidate is unchanged but Git index does not match it.

Preconditions:

- worktree source equals exact frozen identity;
- assurance remains valid;
- target paths are approved.

Mutation:

- index only.

Postconditions:

- staged source equals exact frozen candidate.

No source assurance invalidation.

### R-003 — UNPUBLISHED_CANDIDATE → RECOVER_FOR_REWORK

Use when an unpublished candidate commit must be undone because source must change.

Contract is expressed by postcondition, not by a specific Git command.

Preconditions:

- candidate is local/unpublished;
- exact predecessor is known;
- recovery authority is explicit.

Postconditions:

- HEAD is at approved predecessor;
- candidate bytes are preserved in worktree;
- index is returned to a canonical known state;
- lifecycle is OPEN/READY;
- old candidate-bound assurance is invalid.

Canonical recovery must not depend on incidental `git reset --soft` index semantics.

### R-004 — CANDIDATE_COMMITTED → TERMINAL_REPAIR

Use when source candidate is unchanged and only terminal/coordination/evidence state needs repair.

Preserved:

- candidate commit;
- frozen identity;
- source assurance, unless the repaired artifact is itself part of that assurance contract.

Goal:

- repair terminal projection without replaying the full source assurance cycle.

### R-005 — EVIDENCE_REPAIR

Use when only report structure/metadata is invalid.

Mutation:

- affected evidence artifact only.

Invalidation:

- only the evidence validation that depends on that artifact;
- no source freeze invalidation if candidate bytes are unchanged.

### R-006 — REPORTING_ONLY_STOP

Use when work cannot be completed successfully.

Postconditions:

- reason/blocker is durable;
- no synthetic READY/SKIPPED is created;
- active WB is released into an explicit STOPPED state.

`STOPPED` must not be represented as successful completion.

## Mutation classes and invalidation

### CLASS 1 — SOURCE

Examples: application/control-plane source bytes.

Invalidates:

- frozen identity;
- candidate-bound Critic disposition;
- Reviewer;
- Verifier;
- dependent candidate assurance.

### CLASS 2 — CONTRACT

Examples: specification, authority, acceptance criteria, write-set.

Requires:

- new Define Critic;
- candidate assurance repetition when the contract change can affect candidate validity.

### CLASS 3 — EVIDENCE

Examples: report metadata, required evidence sections, closeout narrative.

Invalidates:

- only directly affected evidence validation unless the evidence content changes a substantive assurance verdict.

### CLASS 4 — INDEX

Examples: staging exact already-frozen bytes.

Invalidates:

- nothing by itself.

Invariant:

> Index materialization is not source mutation.

## Contract integration

Detailed schema/parser semantics are defined in `sdlc-schema-contract-model.md`.

Lifecycle rules:

- every machine-gated artifact is parsed by one canonical Contract Reader;
- lifecycle consumes typed canonical objects and adds transition-specific semantic checks;
- runtime hooks, Git hooks, and published conformance must not maintain independent artifact parsers;
- worktree/index/commit/published-object views differ only in byte source, not in parsing semantics;
- artifact finalization must validate required schema/bindings before the artifact can become authoritative;
- schema version and Work Block business revision are separate concepts.

## Assurance integration

Detailed assurance/evidence semantics are defined in `sdlc-assurance-evidence-model.md`.

Lifecycle-level rules:

- Define Critic is contract assurance and precedes source mutation.
- Candidate-bound Critic disposition is separate and binds the resolved Define Critic decision to one exact frozen candidate.
- Reviewer and Verifier bind to the same frozen candidate.
- Process Feedback is process/terminal evidence, not source assurance.
- Evidence-only repair does not invalidate source assurance by default.
- Index-only materialization never invalidates candidate assurance.
- Successful closeout requires all required assurance resolved and optional assurance explicitly disposed, but no new source assurance should be generated after closeout.

## Authority boundaries

### Lifecycle Engine

Owns legal state transitions and lifecycle state mutation.

### Git Transaction Layer

Owns exact worktree/index/history materialization required by an already-authorized lifecycle transition.

### Runtime hooks

Allow or deny a requested transition. They must not independently invent lifecycle ordering.

### Git hooks

Validate Git-observable invariants immediately before commit/push.

### CI / Published Conformance

Validate the published result independently.

### Owner

Retains merge, deploy, release, destructive production operations, and exceptional recovery authority where explicitly required.

## Open design questions

1. Can a successor WB begin after `STOPPED`, and what terminal/history boundary is required?
2. Which coordination artifacts are part of candidate assurance versus terminal evidence only?
3. Should contract-only changes always repeat Reviewer/Verifier, or only when they can affect the frozen candidate semantics?
4. How should the Git Transaction Layer expose bounded Owner-authorized recovery to different runtimes without runtime-specific policy duplication?
5. Which schema/parser implementation should become the single canonical contract reader?
