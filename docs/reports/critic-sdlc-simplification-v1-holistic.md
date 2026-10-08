# Holistic Critic Review — SDLC Simplification v1

**Date:** 2026-09-28  
**Role:** Independent Critic  
**Reviewed revision:** `a9ab1cf0842d94705cc898baa616d981438a8f60`  
**Reviewed artifact:** `docs/architecture/sdlc-simplification-v1.md`  
**Comparison baseline:** current SDLC on `main`  
**Verdict:** `SUPPLEMENT`

## Executive assessment

The high-level direction is sound and materially simpler than the current SDLC.

The proposal correctly removes control-plane mechanisms whose operational cost exceeds their value while retaining the core engineering model:

- durable project intent/spec/plan in Git;
- independent mandatory pre-code Critic;
- bounded implementation through Work Blocks;
- exact source-candidate assurance;
- independent Reviewer and Verifier;
- deterministic CI;
- Owner-controlled consequential actions;
- event-driven durable learning rather than mandatory governance paperwork.

The main remaining risks are not arguments for restoring the current control plane.

They are places where a **useful invariant currently happens to be implemented by an over-complex mechanism**. The simplified design should keep the invariant and replace the mechanism.

Four clarifications should be made before implementation design.

---

## Accepted decisions that should remain

### Initiative exists before Work Blocks

Keep.

The separation is useful:

```text
Idea / Intent / Spec / Plan
        ↓
implementation decomposition
        ↓
Work Block(s)
```

A Work Block is correctly restored to its original meaning: a bounded implementation unit, not the container for all project thinking.

### Critic is reusable but one pre-code checkpoint is mandatory

Keep.

The proposal correctly distinguishes:

- voluntary Critic consultation at any useful point; and
- one mandatory independent checkpoint before source execution.

The Coder may consult Critic but may not use that consultation to redefine approved scope, architecture, acceptance criteria, or authority.

### Architect is optional

Keep.

Architecture is a capability used when complexity warrants it, not a lifecycle stage that every change must pay for.

### Full Critic / Reviewer / Verifier reports are not durable project memory by default

Keep the intent.

The current SDLC overuses committed reports as lifecycle machinery.

The simplified system should preserve only the durable result and subject identity needed to recover or validate the workflow. Full working reports may remain temporary.

A recovery caveat is discussed below.

### Remove universal topology / capability proof

Keep.

The current execution IDs, context IDs, native topology bindings, capability probes, and prepare/finalize ceremony provide much less value than their complexity suggests for ordinary Work Blocks.

Logical independence remains required. Universal proof-of-runtime topology does not.

### Source candidate SHA is the assurance identity

Keep.

Reviewer and Verifier should inspect one exact implementation revision.

Later documentation / coordination commits may exist without invalidating source assurance, provided the implementation subject is unchanged.

### Narrow hooks and deterministic CI

Keep.

The current broad shell classification and control-plane synchronization should not survive merely because they already exist.

Hooks should protect write/authority boundaries. CI should prove deterministic behavior.

### Owner remains consequential authority

Keep.

Owner control for merge, release, deploy, production/live-data mutation, credentials, material residual risk, and material business-scope changes remains appropriate.

---

# Must

## M1 — Preserve two write domains: implementation and coordination

### Problem

The proposal currently has one `approved write-set`.

It also says:

- writes outside the approved Work Block write-set are blocked;
- changing an implementation path after assurance invalidates assurance;
- post-assurance documentation / coordination / closeout commits are allowed.

Those rules cannot all be represented cleanly by one undifferentiated write-set.

If closeout documentation is inside the write-set, a harmless post-assurance documentation change can appear to invalidate candidate assurance.

If it is outside the write-set, the strict write-scope hook should deny the closeout write.

The current SDLC solves this with `write_set` plus `coordination_write_set`. The current implementation is broader and more complicated than necessary, but the **conceptual separation is useful and should not be deleted**.

### Required clarification

The simplified design should retain two minimal scopes:

1. **implementation write-set** — files whose content is part of the source candidate and whose change invalidates candidate assurance;
2. **coordination scope** — narrowly defined Work Block / project-memory / closeout artifacts that the Orchestrator may update without changing the assured implementation.

The coordination scope should be small and explicit. It does not need the current large default registry.

### Failure mode

Without this distinction, implementation will either:

- over-invalidate assurance for harmless closeout/documentation edits; or
- create ad-hoc hook exceptions that slowly rebuild the current control-plane complexity.

### Why Git/CI alone is insufficient

Git can show which files changed, but the SDLC still needs to know which changed files constitute the assured implementation subject.

### Operational cost

Low: two path sets rather than one.

---

## M2 — READY state must remain bound to an exact subject identity

### Problem

The current SDLC over-binds assurance to report paths, execution IDs, context IDs, topology records, and other evidence.

The proposal correctly removes most of that ceremony.

However, the useful invariant underneath it is:

> a READY gate is valid only for the exact thing that was reviewed.

The conceptual simplified lifecycle currently shows only:

```text
critic_status = READY
```

and:

```text
source_candidate_sha = <sha>
reviewer_status = READY
verifier_status = READY
```

A bare READY flag can become stale.

### Required clarification

Retain minimal subject binding without restoring report-path/topology ceremony.

Conceptually:

```text
critic_status = READY
critic_subject_revision = <implementation-ready package revision>

source_candidate_sha = <sha>
reviewer_status = READY
reviewer_candidate_sha = <same sha>
verifier_status = READY
verifier_candidate_sha = <same sha>
```

The exact schema is implementation detail.

For Critic, the subject identity may be one Git revision/content identity covering the approved Intent/Spec/Plan plus any material Work Block decomposition.

For Reviewer/Verifier, the subject identity is the source candidate SHA.

Changing the subject automatically makes the old READY state stale.

### Failure mode

An Orchestrator updates Plan, write-set, Work Block boundaries, or candidate code but leaves an old READY status in place.

The workflow then appears valid even though the actual subject was never independently reviewed.

### Why Git/CI alone is insufficient

Git stores revisions, but a status field without a subject binding does not say which revision earned that status.

### Operational cost

Very low: a revision/SHA beside each gate.

This preserves the useful part of the current frozen-revision/candidate binding while deleting almost all of its ceremony.

---

## M3 — Close the gap between initial Critic and Work Block decomposition

### Problem

The agreed high-level flow is:

```text
Intent -> Spec -> Plan -> Critic -> Work Block(s) -> Implementation
```

The proposal also correctly states that Work Block decomposition may itself be material when it changes:

- dependencies;
- sequencing;
- assurance;
- scope;
- implementation boundaries.

However, the mandatory Critic gate is described before decomposition, while the later decomposition review says the Critic **should** review it when material.

This creates a possible gap:

1. Plan receives Critic READY.
2. Orchestrator splits it into Work Blocks.
3. The split introduces a risky boundary or dependency.
4. Source work begins using the previously READY gate.

### Required clarification

Keep the accepted order, but make one invariant explicit:

> If Work Block decomposition is material, it is a material post-Critic change and resets the pre-code Critic gate to PENDING for the affected Work Block(s).

A purely mechanical one-to-one decomposition may inherit the approved Critic basis without a second pass.

Do not move every Work Block before the initial Critic merely to solve this.

### Failure mode

The Critic approves the plan but never sees the actual implementation boundary that creates the defect.

Typical examples:

- migration and consumer change split into unsafe order;
- shared schema/interface ownership falls between two Work Blocks;
- one Work Block is declared independently verifiable when it is not;
- a write-set split hides a cross-cutting change.

### Why Git/CI alone is insufficient

This is a design/decomposition judgment made before implementation, not a deterministic test result.

### Operational cost

Low and event-driven: second Critic pass only when decomposition is material.

---

## M4 — Define the recovery boundary for temporary reports

### Problem

The proposal states both:

- project memory is recoverable from Git without chat history; and
- Critic / Reviewer / Verifier reports are temporary, excluded from Git, and deleted at closeout.

Temporary local reports can survive a new agent session in the same worktree, but they do not necessarily survive:

- a fresh clone;
- moving execution to another machine;
- worktree loss;
- cleanup of ignored runtime state.

That is acceptable if it is intentional, but the recovery contract must say so.

### Required clarification

Choose one of these lightweight models:

**A. Same-worktree active recovery**

- full reports remain temporary;
- active-work recovery is guaranteed only from repository + persistent local runtime state;
- Git alone guarantees durable project state after closeout.

or:

**B. Compact durable gate receipts**

- full reports remain temporary;
- Work Block/initiative state stores only the minimal durable receipt needed for recovery: role, subject revision, gate result, and a concise unresolved-blocker/result summary where necessary;
- no full report is committed.

Either model is substantially simpler than the current report-as-authority system.

### Failure mode

A fresh executor sees `Reviewer = CHANGES_REQUIRED` or `Critic = BLOCKED` but cannot recover what must be corrected because the only detailed evidence existed in an ignored local file that is gone.

### Why Git/CI alone is insufficient

Git cannot recover content that was deliberately never committed.

### Operational cost

Low if the recovery promise is narrowed; modest if compact receipts are chosen.

---

# Should

## S1 — Preserve current autonomous subject-branch publication semantics explicitly

The current SDLC distinguishes:

- non-force publication of an assured candidate to its exact non-default subject branch; and
- Owner-controlled merge/release/deploy.

That distinction is useful.

The new proposal clearly preserves Owner control of merge/release/deploy but is silent about ordinary subject-branch push.

The implementation design should explicitly decide and preferably preserve:

> assured non-force subject-branch push is reversible delivery and may remain autonomous; merge remains Owner-controlled.

Otherwise implementation may accidentally add an Owner stop before every push or accidentally permit publication before assurance.

---

## S2 — Define the active-work pointer as local/worktree-scoped if parallel Work Blocks remain possible

The proposal permits one initiative to create multiple Work Blocks and mentions parallel ownership as a reason for decomposition.

A single global “active Work Block” pointer becomes ambiguous if two Work Blocks are active concurrently.

A simple model is sufficient:

- one active Work Block pointer per writable worktree/session root;
- initiative artifacts list the Work Blocks and dependencies;
- no global lifecycle registry is required.

If the intended rule is instead “only one active Work Block per initiative/repository,” state that explicitly.

Do not rebuild `FILE_REGISTRY.yml` / `PROJECT_MAP.md` synchronization to solve this.

---

## S3 — Explicitly retire or redefine the current Quick-Fix exception

Current `.agent/workflows/sdd-protocol.md` contains a Quick-Fix path that can bypass the normal pre-code Critic lifecycle.

The new accepted architecture says the mandatory pre-code Critic remains even when small-change artifacts are collapsed.

Implementation therefore needs to make one rule canonical.

Recommended direction: keep lightweight artifacts for small deterministic changes, but do not retain a hidden old path that contradicts the mandatory Critic invariant.

---

## S4 — Do not carry current `SUPPLEMENT` semantics into the new write gate accidentally

The current hook permits a required Critic verdict of `APPROVE` or `SUPPLEMENT` when the gate state is READY.

The proposal correctly states that blocking Critic concerns must be resolved before source execution.

Therefore:

- a Critic report may contain supplements;
- gate `READY` means there is no unresolved blocking finding;
- a raw `SUPPLEMENT` report must not mechanically imply READY when it contains unresolved Must findings.

The simplified implementation should model the gate result, not inherit old token semantics blindly.

---

## S5 — Preserve candidate-to-deployment provenance without a publication state machine

The proposal correctly removes a second release-state machine.

For operational traceability, the minimal deployment record should be able to connect:

```text
assured source candidate
    -> merged/released revision
    -> deployed revision
```

This matters when merge strategy rewrites identity, for example squash/rebase merge.

A lightweight deployment record or provider-native PR/merge reference is sufficient. No canonical-inactive ancestry machinery is needed.

---

# Comparison with current SDLC

## Useful invariants to keep

From the current system, retain the concepts of:

- exact branch/base identity for active implementation;
- implementation write boundary;
- separate narrow coordination authority;
- mandatory independent Critic before source work;
- fail-closed unresolved gates;
- exact candidate-bound Reviewer/Verifier assurance;
- stale assurance after source change;
- one writer per overlapping implementation scope;
- protected/default branch, force push, secrets, destructive, production/live-data Hard Stops;
- Owner-controlled merge/release/deploy.

## Current mechanisms that should not survive by default

The proposal is correct to simplify/remove:

- mandatory `define_quality` aggregate ceremony;
- universal requirements-review / traceability / consistency reports for ordinary work;
- native capability promotion gates;
- execution/context IDs;
- universal topology proof;
- `prepare-reviewer` / `finalize-reviewer` and equivalent verifier ceremony where a candidate-bound result is enough;
- report paths as lifecycle authority;
- mandatory drift/evaluation for ordinary work;
- canonical inactive-child ancestry;
- dual active/terminal candidate publication states;
- ordinary Work Block synchronization through `FILE_REGISTRY.yml` and `PROJECT_MAP.md`;
- mandatory eight-dimension Process Feedback;
- broad shell interpretation for harmless local operations;
- release-state parsing that duplicates GitHub state.

The simplified system should not use M1-M4 as a reason to reintroduce those mechanisms.

---

# Recommended minimal control model

The target does not need another layer.

A minimal Work Block/control record can conceptually contain:

```text
work_block_id
initiative_ref

subject_branch
base_commit

implementation_write_set
coordination_scope

stage

critic_status
critic_subject_revision

source_candidate_sha

reviewer_status
reviewer_candidate_sha

verifier_status
verifier_candidate_sha

closeout_status
```

Plus the small active-work pointer.

No execution ID, context ID, topology proof, report-path authority, release-state registry, or canonical inactive child is required for an ordinary Work Block.

---

# Final verdict

`SUPPLEMENT`.

The architecture is close to implementation-ready and the simplification direction remains approved.

Before implementation design, clarify M1-M4.

The most important principle is:

> **delete the ceremony, not the identity/boundary invariants hidden inside it.**

In particular, preserve:

1. implementation vs coordination write domains;
2. exact subject binding for every READY gate;
3. Critic re-entry when Work Block decomposition materially changes the reviewed package;
4. an explicit recovery contract for temporary reports.

After those are resolved, no additional architecture review layer is recommended. The next Critic pass can be a short closure check focused only on these four items.
