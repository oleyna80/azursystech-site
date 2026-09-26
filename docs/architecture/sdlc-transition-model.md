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
→ PUBLISHED_VERIFIED
```

`IMPLEMENTING` is not a separate state unless it introduces a mechanically distinct contract. Normal implementation is represented by `OPEN + source_write_gate=READY`.

## Candidate identity

The authoritative frozen source identity is `source_candidate_id`.

Current target representation:

```text
content-sha256:<digest>
```

The digest is computed over a deterministic canonical manifest containing:

- exact `base_commit`;
- sorted effective changed source paths;
- for each changed path: repository-relative path, present/deleted state, Git mode when present, and exact blob content identity;
- unambiguous deterministic serialization.

Rename detection is not authoritative; delete + add is a valid canonical representation.

`candidate_commit_sha` is the durable source+evidence package commit and is not a competing candidate identity.

`terminal_commit_sha` is the terminal history boundary.

Reviewer/Verifier bind `source_candidate_id`; terminal publication binds both `source_candidate_id` and exact `candidate_commit_sha`.

## Transition contracts

### T-001 — DEFINED → OPEN

Owner: Lifecycle Engine.

Preconditions:

- approved specification exists;
- exact `contract_projection_id` is known;
- subject branch and base commit are known;
- source and coordination write-sets are explicit;
- Define Critic is resolved for that exact contract projection;
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
→ any assurance explicitly promoted to required candidate assurance
```

Postconditions:

- every **required candidate assurance** is bound to the same exact `source_candidate_id`;
- optional evaluation/drift may remain PENDING unless promoted to required candidate assurance;
- source remains immutable.

Optional assurance must be explicitly resolved before `CLOSED_SUCCESS`, but does not block candidate commit by default.

### T-004 — ASSURED → CANDIDATE_STAGED

Owner: Git Transaction Layer.

Required transition:

`MATERIALIZE_CANDIDATE_PACKAGE`

Preconditions:

- worktree source projection exactly matches `source_candidate_id`;
- required candidate assurance is valid;
- candidate-bound Critic/Reviewer/Verifier/test evidence is finalized and schema/binding-valid;
- every candidate source/evidence path is authorized.

Allowed mutation:

- Git index only.

Forbidden mutation:

- source worktree bytes;
- frozen identity;
- assurance state.

Postconditions:

- staged source subset exactly matches `source_candidate_id`;
- staged candidate-evidence subset exactly matches the finalized candidate evidence set;
- no terminal-only path is staged;
- no extra/forbidden path is staged.

A stale index is repaired by `REBUILD_CANDIDATE_INDEX`, which produces this same postcondition.

### T-005 — CANDIDATE_STAGED → CANDIDATE_COMMITTED

Owner: Git + pre-commit guard.

Preconditions:

- index is in exact `CANDIDATE_STAGED` state;
- staged source subset matches `source_candidate_id`;
- staged candidate-evidence subset matches the finalized candidate evidence set;
- required candidate assurance is READY/resolved;
- commit metadata is valid;
- no terminal-only, extra, or forbidden path is staged.

Mutation:

- append candidate package commit to local history.

Postconditions:

- `candidate_commit_sha` durably records the exact source candidate + finalized candidate-bound evidence package;
- package includes the authoritative candidate lifecycle-state snapshot with frozen source identity and required assurance bindings;
- candidate-bound evidence is immutable for that package;
- lifecycle remains active for optional dispositions and terminal preparation.

### T-006 — CANDIDATE_COMMITTED → TERMINAL_PREPARED

Owner: Lifecycle Engine + Git Transaction Layer.

Preconditions:

- exact `candidate_commit_sha` exists;
- assurance bindings refer to the same `source_candidate_id`;
- required terminal-only closeout/process evidence exists.

Mutation:

- generate final plan/tasklist/registry/project-map/release-state projection while WB is still active;
- validate it;
- stage all permitted terminal projection files except the canonical inactive lifecycle-state delta.

Postconditions:

- terminal projection is fully validated;
- staged terminal bytes equal their worktree copies;
- no source path is staged;
- no further source mutation or ordinary evidence generation is needed;
- WB is still active.

### T-007 — TERMINAL_PREPARED → CLOSED_SUCCESS

Owner: Lifecycle Engine.

Preconditions:

- exact candidate commit exists;
- terminal projection is already generated, validated, and staged except for the inactive lifecycle-state delta;
- required candidate assurance is complete;
- optional assurance is explicitly resolved;
- Process Feedback/terminal evidence disposition is resolved;
- no unresolved required evidence remains.

Mutation:

- lifecycle active state becomes canonical inactive state.

Postconditions:

- no new source or ordinary coordination/evidence artifact may be created;
- Git Transaction Layer may stage only the canonical inactive lifecycle-state delta required by the terminal commit.

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

Owner: Git pre-push + remote Git host.

Preconditions:

- local published-conformance dry run passes on exact terminal history;
- exact non-force push;
- target is exact subject branch;
- terminal history validates.

Postconditions:

- remote subject-branch ref points to the exact terminal SHA.

### T-010 — PUBLISHED → PUBLISHED_VERIFIED

Owner: CI / published conformance.

Preconditions:

- exact remote terminal SHA is known;
- CI/published-object checks are evaluated for that exact SHA.

Postconditions:

- published conformance is READY;
- state is eligible for `READY_FOR_GITHUB_ARCHITECTURE_REVIEW`.

A mere successful push is not sufficient for architecture-review readiness.

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

### R-002 — ASSURED + STALE_INDEX → REBUILD_CANDIDATE_INDEX

Use when source candidate and candidate assurance are unchanged but Git index does not match the required candidate package.

Preconditions:

- worktree source equals exact `source_candidate_id`;
- candidate assurance remains valid;
- finalized candidate evidence set is valid;
- all target paths are approved.

Mutation:

- index only.

Postconditions:

- full staged source + candidate-evidence package equals the canonical candidate package;
- no terminal-only or extra path is staged.

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

Use when source candidate is unchanged and only **terminal-only** coordination/process evidence needs repair.

Preserved:

- candidate commit;
- `source_candidate_id`;
- source assurance.

Forbidden:

- rewriting candidate-bound Critic/Reviewer/Verifier/test evidence already contained in the candidate commit.

Goal:

- repair terminal projection without replaying the full source assurance cycle.

### R-005 — CANDIDATE_COMMITTED → RECOVER_CANDIDATE_PACKAGE

Use when candidate-bound evidence inside an unpublished candidate commit requires formatting/binding repair but source bytes and substantive assurance remain valid.

Postconditions:

- source candidate identity preserved;
- exact candidate package commit is replaced;
- affected evidence is repaired/revalidated;
- substantive assurance is replayed only if its verdict/binding meaning changed.

A source or substantive assurance defect uses normal REWORK instead.

### R-006 — EVIDENCE_REPAIR

Use when only report structure/metadata is invalid.

Before finalization:

- draft evidence may be corrected by its owner.

After finalization:

- authoritative evidence is immutable;
- repair creates a new evidence version/artifact with explicit `supersedes` linkage;
- lifecycle binding moves to the replacement through a supported transition.

Before candidate commit:

- a superseding candidate-bound evidence artifact may be created/re-finalized;
- `source_candidate_id` and source freeze remain valid when substantive verdict/binding meaning is unchanged.

After candidate commit:

- ordinary EVIDENCE_REPAIR is limited to terminal-only evidence;
- candidate-bound evidence repair uses `RECOVER_CANDIDATE_PACKAGE`.

Mutation:

- create/replace lifecycle binding to the affected evidence version within the phase-specific boundary; never rewrite finalized historical evidence.

Invalidation:

- only the evidence validation that depends on that artifact;
- no source freeze invalidation if candidate bytes are unchanged.

### R-007 — REPORTING_ONLY_STOP

Use when work cannot be completed successfully from any active lifecycle phase.

Mutation / history contract:

- create stop/coordination evidence;
- do not include uncommitted source candidate bytes;
- create a STOPPED terminal commit whose parent is current branch HEAD;
- write canonical STOPPED/inactive lifecycle projection;
- clean the canonical index.

Postconditions:

- reason/blocker is durable;
- whether a candidate commit existed before stop is recorded;
- no synthetic READY/SKIPPED is created;
- active WB is released into an explicit STOPPED state;
- unfinished source, if preserved, exists only as explicit non-authoritative recovery material outside successor authority.

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

Examples: normative specification content, authority, acceptance criteria, write-set, normative plan/task definition.

Rules:

- enforcement-relevant changes alter `contract_projection_id`;
- schema-declared progress/status/evidence fields do not alter `contract_projection_id`;
- unknown contract changes default to enforcement-relevant.

Requires for enforcement-relevant change:

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
- Index-only candidate-package materialization never invalidates candidate assurance.
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

## Resolved by Architecture Freeze v0.2

- A successor WB may begin after a valid STOPPED terminal boundary only with a clean canonical branch and no implicit carry-over of unfinished source. Unfinished work may survive only in explicit non-authoritative recovery material outside successor authority.
- Candidate versus terminal evidence is explicitly separated; candidate-bound evidence must be valid before candidate commit.
- Enforcement-relevant contract changes require fresh Define Critic and downstream assurance as applicable; explicitly schema-classified non-semantic changes do not.
- Recovery is exposed through named lifecycle capabilities calling a shared Git Transaction Layer.
- One shared Python Contract Reader with one YAML implementation is the current target; the architecture does not mandate a specific schema framework dependency.
- `source_candidate_id` is the authoritative frozen source identity; candidate/terminal commit SHAs are package/history provenance.
- `PUBLISHED` and `PUBLISHED_VERIFIED` are distinct external publication states; architecture-review readiness requires the latter.
