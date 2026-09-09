# SDLC Process Feedback and Self-Improvement Design

Status: PARKED DESIGN — Owner-approved direction, not yet an active SDLC contract.

Created: 2026-09-09

## Purpose

Add a lightweight evidence-based feedback loop to every non-trivial Work Block so the system can accumulate operational friction, recurring errors, documentation gaps, contract mismatches, and avoidable process overhead, then analyze those observations and convert validated patterns into separate improvement Work Blocks.

The intended loop is:

```text
Execute → Observe → Record → Aggregate → Analyze → Decide → Improve → Verify
```

The design goal is a self-correcting delivery system without allowing individual agents to rewrite SDLC architecture or governance opportunistically during ordinary implementation work.

## Core Principle

Process reflection is mandatory; finding a problem is not.

Every non-trivial Work Block must perform a short Process Feedback check during Closeout. The valid outcomes are:

- `NONE — checked`, when the required review dimensions were explicitly considered and no material friction was found; or
- one or more structured observations with concrete evidence.

Process Feedback itself must not block successful Closeout merely because friction was discovered. The observation is recorded for later triage unless it proves that the current Work Block result is invalid.

## Mandatory Review Dimensions

Before a Work Block may report `NONE — checked`, the agent must explicitly review these dimensions:

1. documentation;
2. contracts and invariants;
3. tooling and skills;
4. context and memory retrieval;
5. governance and authority boundaries;
6. environment/setup;
7. validation and tests;
8. process overhead and repeated/manual work.

The implementation should make a bare, unqualified `NONE` invalid.

## Observation Categories

Use a small stable taxonomy:

- `DOCUMENTATION_GAP`
- `CONTRACT_MISMATCH`
- `TOOLING_FRICTION`
- `VALIDATOR_OR_TEST_ISSUE`
- `CONTEXT_OR_MEMORY_GAP`
- `GOVERNANCE_AMBIGUITY`
- `ENVIRONMENT_ISSUE`
- `PROCESS_OVERHEAD`
- `RECURRING_IMPLEMENTATION_ERROR`

Future categories should be added only when the existing taxonomy cannot express a recurring class of evidence.

## Observation Record

Each observation should contain at least:

- `work_block_id`
- `date`
- `category`
- `observation`
- `evidence`
- `likely_systemic_cause`
- `impact`
- `suggested_improvement`
- `severity`
- `status`
- optional `duplicate_of`
- optional `related_work_blocks`

Evidence should point to an observable symptom: failing command, contradictory state, duplicated work, missing canonical pointer, unnecessary Owner stop, repeated recovery step, validator masking, or equivalent reproducible fact.

Do not store private chain-of-thought. Record concise conclusions and observable evidence only.

## Severity

Severity measures system impact, not inconvenience:

- `LOW` — extra time or unnecessary manual work with little correctness risk;
- `MEDIUM` — recurring friction or a condition likely to cause future mistakes;
- `HIGH` — wrong result, masked validation, broken contract, incorrect authority stop, or material delivery risk;
- `SYSTEMIC` — repeated across Work Blocks or components and indicative of a structural SDLC/tooling/memory defect.

## Feedback Lifecycle

Use the following lifecycle for accumulated observations:

```text
NEW
  → TRIAGED
      → ACCEPTED
          → IMPROVEMENT_WB
              → VERIFIED
                  → CLOSED
      → DUPLICATE
      → REJECTED
```

An observation is not an authorization to change the SDLC.

`ACCEPTED` means the problem is considered real and worth addressing. System-level changes still require the normal architecture/Owner decision and a separately scoped improvement Work Block.

## Protection Against Formal or Lazy Feedback

The feedback mechanism must resist agents satisfying the requirement mechanically.

Minimum protections:

1. `NONE — checked` is valid only after explicit review of every mandatory dimension.
2. Every non-NONE observation requires evidence.
3. Reviewer and Verifier may add `MISSED_PROCESS_FEEDBACK` findings when worker Closeout omits an evident issue.
4. If repeated Work Blocks report `NONE` while assurance roles repeatedly identify friction, that discrepancy becomes process evidence itself.
5. The system should track `avoidable_friction_count`: incidents that had occurred previously and should already have been prevented by existing documentation, memory, tooling, validators, or governance.
6. A successful task result must not erase evidence of a poor or unnecessarily expensive process.
7. Agents must not invent friction merely to satisfy the mechanism; unsupported observations should be rejected during triage.

## Automatic Friction Signals

The following should trigger explicit consideration during Process Feedback:

- substantial context reconstruction because no canonical pointer existed;
- documentation contradicted current Git/runtime truth;
- a test or validator failed on the wrong invariant and masked the intended assertion;
- branch/worktree/lifecycle ownership had to be reconstructed manually;
- an agent requested Owner input for an ordinary reversible decision inside approved scope;
- a local refactor or workaround was repeatedly necessary for the same reason;
- an existing skill/tool should have been used but equivalent work was rebuilt manually;
- already-proven checks were repeated without a reason;
- the same failure/friction category recurred across Work Blocks;
- an environment prerequisite repeatedly blocked validation;
- a closeout or lifecycle projection remained stale after integration.

These are signals for review, not automatic proof of a defect.

## Aggregation and Meta-Analysis

Individual observations should be accumulated before changing the system.

A later triage/meta-analysis process should perform:

- deduplication;
- clustering by category and root cause;
- frequency analysis;
- severity analysis;
- recurrence across Work Blocks/components;
- `avoidable_friction_count` analysis;
- identification of candidate documentation, tooling, validator, memory, or governance improvements;
- expected benefit versus regression/complexity risk.

The exact trigger may be periodic (for example every 10–20 completed Work Blocks) or threshold-based (for example after N new observations). The implementation Work Block should choose the simplest trigger consistent with current repository operations.

## Governance Boundary

This feedback layer is observational and advisory.

An ordinary Work Block may autonomously:

- perform the feedback review;
- record evidence-backed observations;
- mark likely duplicates where evidence is strong;
- classify operational impact conservatively.

It must not autonomously:

- change SDLC architecture;
- change lifecycle semantics;
- change authority/governance rules;
- weaken validators;
- rewrite system contracts;
- turn an observation directly into implementation outside the approved Work Block scope.

Systemic changes remain subject to the normal sequence:

```text
Observation → Triage → Owner/architecture decision → Improvement Work Block → Assurance → Integration
```

## Storage Boundary

The repository already has multiple memory/log layers. Implementation must first inventory the existing error/failure/process-memory sinks and select one canonical durable destination.

Do not create a competing source of truth merely because this design document exists.

`docs/engineering-memory` is appropriate for durable lessons and recurring failure patterns, but it remains non-authoritative relative to Owner instruction, governance, active Work Blocks, specifications, plans, and assurance reports.

The implementation should decide whether observations belong in an existing error file, an extended existing log, or a new structured registry only after that inventory.

## Motivation from Recent Work

Recent Work Blocks exposed the type of evidence this mechanism is intended to capture, including:

- a release-state test fixture using stale hard-coded Work Block projection data, causing an unrelated `PROJECT_MAP.md` failure to mask the intended malformed-state assertion;
- repeated branch/worktree/lifecycle ownership reconciliation because local, remote, and control-plane projections could differ;
- stale lifecycle projections remaining relevant after integration boundaries.

These are examples, not pre-triaged entries in the future feedback registry.

## Success Criteria for the Future Implementation

The future implementation is successful when:

- every non-trivial Work Block cannot close without an explicit Process Feedback result;
- `NONE — checked` proves the mandatory dimensions were reviewed;
- structured observations are concise, evidence-backed, and machine-searchable enough for later aggregation;
- Reviewer/Verifier can surface missed feedback;
- observations do not automatically mutate SDLC contracts;
- recurring issues can be deduplicated and analyzed;
- avoidable friction can be measured;
- accepted systemic improvements flow through a separate normal Work Block;
- the mechanism adds little overhead to clean Work Blocks.

## Deferred Decisions

The implementation Work Block must inspect the current repository before deciding:

- the canonical storage file/format;
- whether storage should be Markdown, YAML/JSON, or a hybrid;
- the exact Closeout template/schema integration point;
- whether a validator should enforce the presence/shape of Process Feedback;
- the exact meta-analysis trigger;
- whether aggregation needs automation initially or should start as a lightweight manual/agent triage.

Prefer the smallest maintainable implementation that preserves the feedback loop and avoids a second parallel memory system.
