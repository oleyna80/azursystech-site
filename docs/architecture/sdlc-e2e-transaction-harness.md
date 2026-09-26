---
artifact_type: architecture_model
status: draft
scope: docs-only
not_work_block: true
---

# SDLC E2E Transaction Harness

## Purpose

Define a synthetic end-to-end harness that proves the complete SDLC transaction before enforcement is relied on for real engineering work.

This harness is architectural test infrastructure. It is not a production Work Block and must not mutate real production state.

## Core principle

> A control plane is not proven by green component tests alone. It is proven when the complete legal transaction can be executed from a clean base to a validated terminal history without manual repair or policy bypass.

WB-034 and WB-037 demonstrated that local validators could pass while the next real transition still failed.

## Test environment

The harness must run in an isolated temporary Git repository or temporary worktree whose lifecycle/control-plane files are fixture-controlled.

Requirements:

- no mutation of the developer's primary working copy;
- no mutation of live production SSOT;
- no real merge/deploy;
- no real secrets/production credentials;
- deterministic branch/base;
- deterministic clock-independent fixtures where possible;
- explicit simulated/pinned runtime context.

If runtime hooks require initial cwd/worktree binding, the harness must launch the test runtime from the intended test root rather than rely on command-local `cd`.

## Positive canonical scenario

The minimum successful transaction is:

```text
clean trusted base
→ Define artifacts
→ Define Critic approved
→ lifecycle OPEN
→ bounded source mutation
→ tests
→ FREEZE
→ candidate-bound Critic disposition
→ Reviewer READY
→ Verifier READY
→ optional assurance dispositions
→ MATERIALIZE_FROZEN_CANDIDATE
→ candidate pre-commit
→ candidate commit
→ TERMINAL_PREPARED
→ terminal projection validation
→ success closeout
→ canonical inactive materialization
→ terminal pre-commit
→ terminal commit
→ exact non-force publication simulation
→ published-object conformance
```

Success criterion:

No exceptional Owner Git intervention, bypass, manual SSOT edit, stale artifact repair, or ad-hoc parser patch is required.

## Recovery scenarios

### H-R01 — Reviewer source finding

```text
FROZEN
→ Reviewer CHANGES_REQUIRED
→ REWORK
→ source mutation
→ tests
→ new FREEZE
→ fresh candidate assurance
→ delivery continues
```

Assert:

- old freeze invalid;
- old candidate assurance invalid;
- WB/branch/base/write-set preserved.

### H-R02 — Evidence-only repair

Create a valid frozen candidate and substantive READY Reviewer result, but make the report metadata structurally incomplete.

Expected:

- evidence finalization rejects the malformed report;
- source freeze remains valid;
- EVIDENCE_REPAIR fixes only report metadata;
- source assurance is not replayed unless substantive verdict/binding changed.

### H-R03 — Stale index rebuild

Prepare:

- exact frozen worktree candidate;
- READY assurance;
- stale index from prior state.

Expected:

`REBUILD_FROZEN_INDEX` changes index only and ends with staged source exactly equal to frozen candidate.

Assert:

- no worktree source mutation;
- frozen identity unchanged;
- Reviewer/Verifier bindings unchanged.

### H-R04 — Unpublished candidate recovery

Prepare local candidate commit that is absent from all simulated remote refs.

Expected:

`RECOVER_FOR_REWORK` returns the repository to the declared canonical recovery postcondition.

Assert:

- exact predecessor restored;
- candidate bytes preserved as specified;
- index canonicalized;
- old candidate assurance invalidated;
- no force operation.

### H-R05 — Terminal evidence repair

Prepare a committed assured candidate and a terminal projection with an evidence-only defect.

Expected:

- candidate commit remains;
- source assurance remains valid;
- terminal/evidence artifact can be repaired;
- no full source assurance replay.

### H-R06 — Reporting-only STOPPED

Introduce an unrecoverable blocker.

Expected:

- blocker/reason durable;
- no synthetic READY/SKIPPED;
- state becomes explicit STOPPED;
- history/evidence remains inspectable.

## Negative scenarios

### H-N01 — Wrong branch

Source write, freeze, commit, and push requests from a non-subject branch are denied.

### H-N02 — Wrong base / predecessor

Admission or successor history with unexpected base is denied.

### H-N03 — Source outside write-set

Direct path and directory/glob selection containing unauthorized descendants are denied.

### H-N04 — Source mutation after freeze

Any source-byte mutation invalidates the frozen candidate and candidate assurance.

### H-N05 — Extra staged path

Candidate commit denied when the index contains an extra or forbidden path.

### H-N06 — Stale assurance

Reviewer/Verifier bound to an earlier frozen candidate cannot authorize a new candidate.

### H-N07 — Malformed contract

Reject duplicate keys, wrong types, unsupported constructs, malformed paths, or unsupported schema versions consistently in every consumer.

### H-N08 — Malformed evidence

Critic/Reviewer/Verifier report missing exact required bindings cannot become authoritative.

### H-N09 — Wrong terminal parent

Terminal commit denied unless parent is exact candidate commit for the same WB.

### H-N10 — Premature closeout

success-closeout denied before candidate commit and validated TERMINAL_PREPARED state.

### H-N11 — Force/ambiguous publication

Force, multi-ref, default/protected, or non-subject publication is denied.

### H-N12 — Assurance reuse across re-freeze

Any assurance from a previous frozen identity is denied after a new freeze.

## Parser/schema parity matrix

For every authoritative fixture artifact, run the same bytes through:

- lifecycle Contract Reader;
- shared policy;
- Git hook path;
- published conformance path.

Expected:

- same canonical object; or
- same schema error class.

Repeat with the artifact sourced from:

- worktree;
- index;
- local commit;
- published-history fixture.

## Transition reachability test

The harness must verify not only denial correctness but **reachability**.

For every supported non-terminal state:

1. enumerate legal next transitions;
2. execute at least one expected legal transition;
3. assert the resulting state;
4. prove that no prerequisite requires an operation forbidden by another active guard.

This is the test that would have caught the WB-037 stale-index deadlock.

## Transaction invariants

Global invariants to assert after every step:

- WB identity unchanged unless transition explicitly closes it;
- subject branch/base consistent;
- write-set authority does not silently expand;
- source candidate identity changes only on source mutation;
- index-only transition never changes worktree candidate;
- evidence repair never changes source candidate;
- no stale assurance authorizes a changed candidate;
- no success closeout before terminal readiness;
- terminal parent exact;
- publication exact and non-force;
- no merge/deploy performed by harness.

## Blocker diagnostics

Every unexpected block should produce a structured diagnostic record:

- transition id;
- command/API attempted;
- component that denied it;
- stable error class;
- expected precondition;
- observed state;
- whether a legal recovery transition exists;
- whether that recovery is reachable.

The harness must not silently repair the blocker.

## Metrics

Capture:

- number of lifecycle commands in happy path;
- number of state/evidence artifacts generated;
- number of assurance dispatches;
- number of Git index transitions;
- number of Owner interventions required;
- number of runtime-specific operations;
- total distinct policy evaluators invoked.

These metrics are used to simplify the SDLC, not as performance targets by themselves.

## Architecture acceptance criteria

The revised SDLC is not ready for broad enforcement until the harness proves:

1. canonical happy path completes;
2. all declared recovery paths complete;
3. all negative cases fail closed;
4. parser/schema parity holds;
5. transition reachability holds;
6. candidate and terminal transactions stay distinct;
7. evidence-only and index-only mutations do not trigger source-assurance replay;
8. exact subject-branch publication is reachable without reopening source write authority;
9. merge/deploy remain outside the harness and Owner-controlled.

## Rollout usage

Recommended development loop for future control-plane changes:

```text
focused unit tests
→ schema/parser parity
→ transition-specific fixtures
→ full E2E transaction harness
→ only then tighten enforcement
```

A new enforcement rule must not be enabled if the E2E harness cannot demonstrate a reachable compliant path through that rule.

## Findings from prior smoke/rehearsal work

### EH-F01 — Diagnostic smoke testing was the right pattern

WB-034 intentionally attempted the real lifecycle without repairing governance while running. This exposed control-plane contradictions more effectively than isolated tests.

### EH-F02 — Runtime/worktree bootstrap must be represented in the harness

A session bound to the wrong initial cwd/worktree could not be repaired by command-local `cd`.

### EH-F03 — Terminal rehearsal found defects missed by component suites

Before another WB-037 recovery, a rehearsal of candidate/terminal publication was proposed specifically because earlier component tests had not predicted the next real blocker.

### EH-F04 — The harness must test recovery postconditions, not Git commands

Using `git reset --soft` as the recovery mechanism preserved stale index state and eventually created another deadlock.

### EH-F05 — Green validators are necessary but insufficient

WB-037 repeatedly reached states where relevant test suites passed but a later real transition exposed a new contract mismatch.

## Resolved by Architecture Freeze v0.2

- The core deterministic CI harness does not depend on live Codex/Claude sessions. Runtime adapter parity is tested separately with fixture events.
- Remote publication is simulated with a local bare Git repository so real Git hooks/push/ref behavior can be exercised without GitHub or production mutation.
- Reviewer/Verifier lifecycle behavior in the deterministic harness uses fixture reports/role executions. Real model quality and operational independence remain separate assurance concerns.
- Governance/control-plane CI must eventually require the canonical happy path plus stale-index recovery, source rework, evidence-only repair, terminal repair, STOPPED, schema parity, transition reachability, and core negative publication/assurance cases.
- Historical schema compatibility belongs to a separate compatibility/conformance suite rather than every happy-path E2E run.

## Incremental harness rollout

The harness is introduced before the main remediation sequence as a baseline diagnostic harness.

Initially, currently known architectural blockers may be encoded as expected failures.

After each remediation Work Block:

- the owning expected failure is converted to PASS;
- new transition fixtures are added before enforcement is tightened;
- the full reachable path is rerun.

The final hardening phase promotes the complete green E2E transaction to a required CI gate.
