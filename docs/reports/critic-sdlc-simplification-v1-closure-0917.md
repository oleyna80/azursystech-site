# Critic Closure Review — SDLC Simplification v1

**Date:** 2026-09-28  
**Role:** Independent Critic  
**Reviewed revision:** `0917f725fb4ce00dd2736f7ffa1821d333611859`  
**Reviewed artifact:** `docs/architecture/sdlc-simplification-v1.md`  
**Prior report:** `docs/reports/critic-sdlc-simplification-v1-holistic.md`  
**Verdict:** `SUPPLEMENT`

## Scope

This review checks whether the four Must findings from the holistic Critic review are closed and whether the resulting high-level model remains coherent against the useful invariants in the current SDLC.

The architecture direction remains accepted. This review does not request restoration of the current control-plane ceremony.

## Closure status

### M1 — implementation vs coordination write domains

**Status: PARTIALLY CLOSED**

The proposal now correctly introduces:

- `implementation_write_set`;
- `coordination_scope`.

This preserves the useful boundary from the current SDLC without retaining the old broad coordination registry.

However, the new wording makes `coordination_scope` broad enough to include “durable documentation paths”, while Section 9 says documentation/coordination/closeout commits inside that scope do not invalidate source assurance when no `implementation_write_set` path changed.

That creates an assurance gap for authoritative planning artifacts.

Example:

```text
Spec/AC v1
  -> Critic READY
  -> source candidate
  -> Reviewer READY
  -> Verifier READY
  -> spec.md / acceptance criteria changed inside coordination_scope
  -> source unchanged
  -> old candidate assurance still appears READY
```

The current SDLC avoids this class of error by binding verification evidence to both the implementation subject and the specification revision.

The simplified design does not need the current report machinery, but it must keep the invariant.

**Required clarification:**

Changes to the authoritative planning subject — Intent, Spec, Plan, material Work Block definition/decomposition, acceptance criteria, architecture/authority constraints — are **not** harmless closeout coordination changes.

If such a path changes materially after Critic or candidate assurance:

- `critic_subject_revision` changes and Critic becomes stale;
- candidate assurance is stale where the changed planning subject affects what Reviewer/Verifier were judging;
- relevant assurance must rerun before successful closeout.

Only genuinely non-normative coordination/closeout artifacts may change after assurance without invalidating it, for example an Orchestrator log entry, closeout result, or engineering-memory note that does not redefine the approved subject.

Do not solve this by restoring the old broad `coordination_write_set` or report-path authority.

### M2 — READY bound to exact subject identity

**Status: CLOSED, subject to M1 clarification**

The proposal now binds:

```text
critic_status
critic_subject_revision
```

and:

```text
source_candidate_sha

reviewer_status
reviewer_candidate_sha

verifier_status
verifier_candidate_sha
```

It also explicitly states that READY without a matching current Critic subject grants no implementation authority and that unresolved blocking findings do not become READY merely because a raw Critic result is `SUPPLEMENT`.

This is the correct minimal replacement for the current execution/context/report-path ceremony.

The only remaining issue is the M1 case where the planning subject itself changes after candidate assurance. The final implementation design must treat the assured subject as including the current approved planning basis, not only source paths.

### M3 — Critic coverage of Work Block decomposition

**Status: SUBSTANTIVELY CLOSED, but canonical flow is internally contradictory**

The revised top-level flow is now:

```text
Idea
 -> Intent
 -> Spec
 -> Plan
 -> Work Block definition/decomposition
 -> Critic
 -> Implementation
```

The implementation-ready package explicitly includes Work Block definition/decomposition. This removes the original gap.

However, Section 4 still says:

> After the implementation-ready package is accepted, the Orchestrator decomposes the Plan into one or more Work Blocks.

That cannot be true at the same time as the new canonical flow, because the implementation-ready package already contains the Work Block definition/decomposition reviewed by Critic.

Section 4 then says the Critic “should” review material decomposition, even though the new mandatory package makes that review part of the required gate.

**Required clarification:**

Separate **definition** from **execution activation**.

Recommended meaning:

```text
Plan
 -> define/decompose Work Block(s)
 -> Critic reviews complete implementation-ready package
 -> Critic READY
 -> Work Block implementation lifecycle becomes active
 -> Coder
```

A Work Block may therefore be defined before implementation, but its source execution does not begin until the mandatory Critic gate is READY.

Remove the residual wording that decomposition happens only after the package is accepted.

This is a small text correction, not an architectural redesign.

### M4 — recovery boundary for temporary reports

**Status: CLOSED**

The proposal explicitly chooses the lightweight local-runtime recovery model:

- full Critic/Reviewer/Verifier reports remain temporary and excluded from Git;
- ordinary pauses/session restarts are recoverable while persistent local runtime state exists;
- fresh clone/worktree/machine loss does not guarantee transient report recovery;
- lost transient evidence is rerun against the durable subject/candidate;
- Git remains the durable project-memory boundary.

This is internally coherent and materially simpler than committed report authority.

No gate receipt is required solely to archive transient agent output.

## Prior Should findings

The revision also closes two prior Should findings:

- the active Work Block pointer is now explicitly per-worktree;
- a raw `SUPPLEMENT` result does not mechanically open the gate.

The following remain appropriate implementation-design decisions rather than blockers for the high-level architecture:

- preserve autonomous non-force publication of an assured exact subject branch while merge remains Owner-controlled;
- explicitly remove/redefine the current legacy Quick-Fix path so it cannot bypass the new mandatory Critic invariant;
- preserve candidate -> merged/released revision -> deployed revision provenance when merge strategy rewrites SHA;
- preserve one-writer-per-overlapping-implementation-scope behavior for parallel execution.

## Comparison with current SDLC

The revised proposal now preserves most of the useful invariants hidden inside the current heavier control plane:

- branch/base identity;
- separate implementation and coordination authority;
- mandatory independent pre-code Critic;
- fail-closed gate resolution;
- exact planning-subject Critic binding;
- exact source-candidate Reviewer/Verifier binding;
- per-worktree active execution context;
- Owner-controlled consequential boundaries.

It remains correct to remove the current mechanisms that prove these invariants through topology IDs, report paths, capability probes, canonical inactive ancestry, release-state projections, broad shell parsing, and mandatory process-feedback ceremony.

## Final verdict

`SUPPLEMENT`.

Three of the four holistic Must findings are effectively resolved.

Before marking the architectural proposal fully closed, make two small but important corrections:

1. distinguish harmless closeout coordination changes from authoritative planning-subject changes, so a changed Spec/AC/Plan cannot inherit stale Reviewer/Verifier assurance merely because source files did not change;
2. make Section 4 consistent with the new canonical order: Work Block definition/decomposition occurs before the mandatory Critic gate, while Work Block **source execution** begins only after Critic READY.

After those corrections, a short closure check is sufficient. No additional control layer or broad architecture review is recommended.
