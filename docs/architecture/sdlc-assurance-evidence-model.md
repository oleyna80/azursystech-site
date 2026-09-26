---
artifact_type: architecture_model
status: draft
scope: docs-only
not_work_block: true
---

# SDLC Assurance & Evidence Model

## Purpose

This document separates **engineering assurance** from **evidence packaging** and defines which artifacts are allowed to block which lifecycle transitions.

It is an architectural draft for the SDLC revision branch. It does not grant implementation authority.

## Core principle

> Assurance validates a candidate or contract. Evidence records the result. Evidence formatting defects must not be treated as source defects unless they change the substance of the assurance decision.

The current control plane sometimes couples these concerns too tightly. WB-037 repeatedly showed cases where a valid frozen candidate and READY assurance were forced back into broader lifecycle work because a report, closeout artifact, or process-feedback section was incomplete.

## Assurance layers

### A-001 — Define Critic

Purpose:

- review the proposed specification, plan, scope, authority, acceptance criteria, and implementation approach before source mutation.

Binding:

- exact Work Block id;
- exact `contract_projection_id`;
- exact specification path/revision and reviewed artifact provenance;
- subject branch/base where relevant.

Does **not** bind to a frozen source candidate because the source candidate does not yet exist.

Valid outcomes:

- APPROVE;
- SUPPLEMENT / RECONSIDER / equivalent non-ready outcome;
- explicit SKIPPED only where policy allows it and requires a reason.

Invalidation:

- substantive contract mutation;
- authority/write-set expansion;
- acceptance-criteria changes;
- plan changes that alter the approved implementation contract.

Does not need repetition for evidence-only edits that do not change the approved contract.

### A-002 — Candidate-bound Critic disposition

Purpose:

Confirm that the already-resolved Define Critic decision still applies to the exact frozen candidate.

This is a separate artifact from the Define Critic report.

Binding:

- Work Block id;
- exact `contract_projection_id`;
- exact specification path/revision;
- original Define Critic report;
- original Critic status/verdict;
- exact `source_candidate_id`;
- explicit skip reason when SKIPPED.

Allowed only when the original Critic state is already resolved.

Invalidation:

- any new freeze;
- source mutation;
- contract change that invalidates the original Define Critic decision.

No invalidation for index-only materialization of the same frozen bytes.

### A-003 — Reviewer

Purpose:

Perform independent engineering review of the exact frozen candidate against the approved contract.

Binding:

- exact frozen candidate;
- exact approved specification/acceptance criteria;
- Reviewer execution identity;
- candidate-bound Critic disposition.

Expected outputs:

- READY; or
- CHANGES_REQUIRED / BLOCKED with concrete findings.

A source finding requires REWORK and invalidates the current frozen candidate assurance.

A report-formatting defect does **not** by itself invalidate the source verdict.

### A-004 — Verifier

Purpose:

Independently reproduce relevant checks and verify that the exact frozen candidate satisfies the acceptance contract.

Binding:

- exact frozen candidate;
- exact current Reviewer binding;
- exact specification/acceptance criteria;
- verifier execution identity.

Expected outputs:

- READY; or
- BLOCKED.

Verifier must remain logically independent from the implementation context and must not mutate the candidate.

### A-005 — Optional assurance

Examples currently include evaluation and drift.

Rule:

- optional does not mean implicit success;
- PENDING means unresolved;
- SKIPPED is an explicit disposition and requires a non-empty reason;
- required assurance may not be converted to SKIPPED through the optional-disposition mechanism.

Target lifecycle semantics:

- optional assurance may remain PENDING through candidate commit by default;
- optional assurance must be explicitly resolved before successful terminal closeout;
- a WB contract may explicitly promote an optional assurance to required candidate assurance, in which case it becomes part of ASSURED/candidate-commit prerequisites.

## Evidence versioning

Authoritative finalized assurance evidence is append-only/immutable.

Rules:

- draft artifacts may be corrected by their owner before lifecycle finalization;
- finalized artifacts are never edited in place;
- later repair creates a new version/artifact with explicit `supersedes` linkage;
- the previous artifact remains durable historical evidence;
- lifecycle binding changes only through a supported evidence transition;
- if the finalized artifact is already included in an unpublished candidate package, use `RECOVER_CANDIDATE_PACKAGE` before creating the replacement package.

## Evidence classes

### E-001 — Assurance reports

Examples:

- Define Critic report;
- candidate-bound Critic disposition;
- Reviewer report;
- Verifier report.

These are substantive evidence.

A semantic change to verdict/findings/bindings can affect assurance validity.

A draft formatting defect may be corrected before finalization.

After finalization, evidence is immutable. A formatting-only repair creates a superseding evidence version/artifact with explicit `supersedes` linkage if the substantive verdict and candidate/contract binding remain unchanged.

### E-002 — Test evidence

Purpose:

Record reproducible test commands/results associated with the candidate.

Binding should identify:

- candidate/freeze identity where applicable;
- test suite/version;
- result;
- execution context sufficient for reproduction.

Test evidence should not duplicate lifecycle state as hand-maintained prose.

### E-003 — Process Feedback

Purpose:

Capture process friction, missed checks, avoidable rework, and improvement observations.

This is **process evidence**, not source-candidate assurance.

Target rule:

> Process Feedback may gate terminal evidence completeness, but it must not retroactively turn a READY source review into a source-assurance failure.

Recommended design:

- keep Process Feedback as its own machine-validated artifact/registry entry;
- do not require substantive mutation of a finalized Reviewer verdict merely to satisfy Process Feedback formatting;
- if Reviewer input is required, capture it as a separately validated process-feedback assessment or immutable Reviewer appendix.

### E-004 — Closeout evidence

Current problem:

Closeout artifacts can duplicate mutable references to Critic/Reviewer/Verifier versions, test results, task status, Process Feedback, and publication state. Repeated lifecycle repair can make those references stale.

Target design:

The closeout artifact should become a **derived terminal manifest**, not a manually synchronized narrative source of truth.

It should reference canonical current artifacts and machine-readable state rather than restating them.

Minimum content:

- Work Block id;
- specification revision;
- exact candidate commit;
- exact terminal parent relationship;
- frozen candidate identity;
- Critic disposition ref;
- Reviewer ref/verdict;
- Verifier ref/verdict;
- optional assurance dispositions;
- required test evidence refs;
- Process Feedback disposition/ref;
- closeout mode;
- blocker/reason when STOPPED.

Publication/CI status should be recorded separately after publication if it cannot exist before terminal commit.

## Assurance dependency rules

### Source mutation

Invalidates:

- frozen identity;
- candidate-bound Critic disposition;
- Reviewer;
- Verifier;
- candidate-bound test evidence that no longer applies.

Requires:

- REWORK;
- new freeze;
- new candidate assurance.

### Contract mutation

Invalidates:

- Define Critic;
- downstream assurance whose meaning depends on the changed contract.

The lifecycle should determine dependency precisely rather than always replaying every assurance layer.

Examples:

- acceptance criteria changed: repeat Define Critic and candidate assurance;
- prose-only typo with no contract meaning: evidence/contract formatting repair only.

### Evidence-only mutation

Examples:

- missing required metadata field;
- missing Process Feedback section;
- malformed report frontmatter;
- stale narrative reference.

Default effect:

- invalidate/revalidate only the affected evidence artifact;
- preserve frozen candidate and source assurance if substantive verdict/binding is unchanged.

### Index-only mutation

Does not invalidate assurance.

Index materialization is a Git transaction concern, not an assurance concern.

## Lifecycle gates

### Before freeze

Required:

- current approved contract;
- resolved Define Critic;
- required pre-freeze test evidence.

### Before Reviewer/Verifier

Required:

- exact frozen candidate;
- valid candidate-bound Critic disposition.

### Before candidate commit

Required:

- exact `source_candidate_id`;
- required candidate assurance READY;
- staged source exactly materializes frozen bytes;
- every candidate-bound Critic/Reviewer/Verifier/test artifact is schema- and binding-valid;
- candidate package contents are final for this commit.

Optional evaluation/drift do not block candidate commit unless explicitly promoted to required candidate assurance.

Process Feedback and terminal-only closeout evidence do not block candidate commit by default.

### Before terminal preparation

Required:

- exact `candidate_commit_sha` exists;
- assurance bindings match the same `source_candidate_id`;
- candidate-bound evidence is already immutable inside the candidate commit;
- terminal-only evidence required for closeout is structurally valid or explicitly repairable.

### Before successful closeout

Required:

- terminal projection already prepared and validated;
- all required assurance resolved;
- optional assurance explicitly resolved;
- Process Feedback disposition resolved;
- closeout manifest valid.

### After closeout

No new source assurance or ordinary evidence generation is permitted.

Only canonical inactive-state materialization and terminal commit remain.

## Candidate package immutability

Once `candidate_commit_sha` is created, candidate-bound evidence inside that commit is immutable for that package.

`TERMINAL_REPAIR` is limited to terminal-only evidence.

If a candidate-bound evidence formatting/binding defect is found after an unpublished candidate commit, use `RECOVER_CANDIDATE_PACKAGE`:

- preserve `source_candidate_id` when source bytes are unchanged;
- preserve substantive assurance verdicts only when exact meaning/bindings remain valid;
- repair/revalidate the affected evidence;
- create a replacement candidate commit.

A source or substantive assurance defect uses normal REWORK.

## Evidence ownership

### Define Critic owner

Independent Critic context.

### Reviewer report owner

Reviewer context.

### Verifier report owner

Verifier context.

### Process Feedback owner

Lifecycle/process-feedback layer, with attributed Reviewer/Verifier observations where needed.

### Closeout manifest owner

Lifecycle Engine.

This prevents the implementation agent from manually maintaining duplicated cross-artifact truth.

## Schema requirements

Every machine-gated assurance/evidence artifact should have a shared schema implementation with:

- strict field types;
- duplicate-key rejection;
- exact Work Block binding;
- exact specification revision binding where applicable;
- exact frozen candidate binding where applicable;
- explicit verdict/status enum;
- explicit report version;
- deterministic validation errors.

Evidence validation should happen at artifact creation/finalization time, not first surface during terminal closeout.

## Findings derived from WB-037

### AE-F01 — Define Critic and candidate-bound Critic disposition were initially overloaded

The publication guard required candidate-bound Critic disposition metadata, while the lifecycle Critic report represented pre-implementation Define review.

Required direction:

Keep them as two explicit assurance artifacts.

### AE-F02 — Process Feedback was coupled to Reviewer report structure

A Reviewer could already be substantively READY, yet closeout remained blocked because the report lacked the exact Process Feedback section required by a later validator.

Required direction:

Decouple process evidence from source assurance and validate required report structure before Reviewer finalization.

### AE-F03 — Closeout duplicated stale assurance references

Repeated recovery/reopen cycles required manual updates from old Reviewer/Verifier versions to current ones.

Required direction:

Generate closeout/terminal manifest from lifecycle bindings instead of maintaining duplicated narrative references.

### AE-F04 — Evidence validation happened too late

Some report/schema defects were discovered only at Process Feedback or closeout validation after assurance execution had completed.

Required direction:

Run schema/contract validation as part of report finalization.

### AE-F05 — Invalidation semantics were broader than the changed object

Evidence-only defects could trigger or threaten broad lifecycle replay even when frozen source bytes and substantive assurance verdicts were unchanged.

Required direction:

Use mutation-class-specific invalidation.

## Audit decisions so far

Accepted architectural direction:

1. Define Critic and candidate-bound Critic disposition remain separate.
2. Reviewer and Verifier bind to one exact frozen candidate.
3. Optional assurance must be explicitly resolved; SKIPPED requires reason.
4. Process Feedback is terminal/process evidence, not source assurance.
5. Closeout should be derived from canonical lifecycle bindings.
6. Evidence-only repair must not invalidate source assurance by default.
7. Evidence schemas must be checked at creation/finalization time.
8. Index-only transitions never invalidate assurance.

## Resolved by Architecture Freeze v0.2

- Optional evaluation/drift do not block candidate commit by default; PENDING blocks successful closeout. A WB may promote one to required candidate assurance.
- Process Feedback is standalone process/terminal evidence, not a hidden Reviewer-report requirement.
- Candidate commit contains exact source candidate, enforcement-relevant contract artifacts, the exact Define Critic evidence referenced by the disposition, candidate-bound Critic disposition, Reviewer, Verifier, required candidate test evidence, and any optional assurance promoted to required candidate assurance.
- Terminal commit contains Process Feedback, non-promoted optional assurance reports/dispositions, final release/task projections, generated closeout manifest, and canonical inactive lifecycle state.
- Any new freeze invalidates candidate-bound assurance, even if the resulting source digest equals an earlier freeze; no evidence-reuse optimization is part of this revision.
- Contract fields explicitly classified by schema as non-semantic may be repaired without full assurance replay; all unknown contract changes default to enforcement-relevant.
