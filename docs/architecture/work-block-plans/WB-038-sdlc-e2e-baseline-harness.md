---
artifact_type: work_block_plan
status: completed_reporting_only
work_block_id: WB-038
scope: planning-only
not_active_work_block: true
architecture_freeze: v0.6
---

# WB-038 — SDLC E2E Baseline Harness

## Objective

Create a deterministic diagnostic harness that exercises the **current published control plane** from a clean WB-036 base and records where the existing SDLC succeeds or blocks.

This Work Block does **not** repair lifecycle, hooks, schemas, staging, recovery, or publication semantics.

It establishes the executable baseline against which later remediation Work Blocks will be measured.

## Architecture binding

Normative architecture:

- `docs/architecture/sdlc-architecture-freeze.md` — Architecture Freeze v0.6;
- exact frozen architecture commit: `673838a2dd66e817fa8e4592ff811d62de614344`;
- `docs/architecture/sdlc-e2e-transaction-harness.md`;
- `docs/architecture/sdlc-remediation-plan.md`;
- `docs/architecture/sdlc-remediation-bootstrap.md`.

WB-038 may observe current behavior that contradicts the frozen target architecture. Such contradictions are expected baseline findings, not reasons to redesign the freeze inside this WB.

## Base / branch

Proposed base:

`c4829e77e2e9ae6a694a7def87b381c54571fd6d`

Published source ref:

`origin/audit/hook-enforcement-036`

Proposed subject branch:

`test/sdlc-e2e-baseline-038`

WB-038 must start in a new clean worktree created according to the bootstrap plan. The preserved local WB-037 worktree is out of scope.

## Scope

### In scope

1. Build an isolated temporary-Git test harness.
2. Use a temporary local bare repository as simulated remote.
3. Exercise the real current lifecycle/Git hooks/validators where practical.
4. Use deterministic fixture assurance reports rather than live AI agents.
5. Record transition results as:
   - PASS;
   - EXPECTED_BLOCK;
   - UNEXPECTED_BLOCK;
   - UNREACHABLE;
   - NOT_IMPLEMENTED.
6. Produce structured blocker diagnostics.
7. Encode known current contradictions as **expected baseline failures**, not fixes.
8. Verify the harness never merges, deploys, or touches production/external state.

### Out of scope

- changing `.agent/hooks/**`;
- changing `.codex/scripts/lifecycle.py`;
- changing runtime adapters;
- changing Git hook policy;
- adding index-recovery transitions;
- changing terminal closeout ordering;
- changing assurance semantics;
- introducing the Contract Reader;
- changing published conformance behavior;
- fixing WB-037;
- merge/deploy/release.

If the harness cannot proceed because infrastructure for deterministic simulation is missing, the WB may add harness-only fixture/adapter code, but must not change production control-plane decisions.

## Proposed implementation surface

Final write-set must be confirmed against repository layout during Define.

Preferred new files:

- `scripts/sdlc_e2e_baseline.py`
- `scripts/sdlc_e2e/**` for harness-only helpers/fixtures if needed
- `docs/reports/WB-038-sdlc-e2e-baseline.md`

Existing production policy files should remain read-only.

If one existing test-only helper must change to expose reusable fixture logic, that path must be explicitly added during Define and approved by Critic. No production source path is implicitly authorized.

## Harness model

The harness creates:

```text
temporary working repository
        +
temporary local bare remote
        +
current control-plane files
        +
synthetic WB artifacts
        +
deterministic assurance fixtures
```

Then exercises transitions through subprocess/Git operations.

The harness itself passes when observed behavior matches the declared baseline expectation, including expected blocks.

Example:

```text
expected current result: stale candidate index cannot be repaired
observed: policy blocks all supported repair paths
harness assertion: PASS_EXPECTED_BLOCK
```

This prevents a known architectural defect from making the baseline test suite unusable while still making the defect explicit.

## Required baseline scenarios

### B-001 — Clean bootstrap

Prove the synthetic repository starts from:

- exact trusted base;
- clean worktree;
- clean index;
- inactive lifecycle state;
- subject branch bound correctly.

Expected: PASS.

### B-002 — Define / OPEN

Create minimal synthetic spec/plan/task artifacts accepted by the current lifecycle and open a synthetic WB.

Expected: PASS or exact documented current blocker.

If blocked, record the first failing component and stop only that scenario.

### B-003 — Bounded source mutation

Modify one harmless harness fixture/report path inside the approved synthetic write-set.

Expected: PASS.

### B-004 — Freeze

Freeze exact candidate through current lifecycle.

Capture:

- current candidate identity representation;
- write-gate transition;
- assurance state reset.

Expected: PASS.

### B-005 — Deterministic assurance fixture

Provide candidate-bound Critic/Reviewer/Verifier fixture evidence in the exact current schemas needed to advance without live AI execution.

The fixture must not claim to test Reviewer/Verifier model quality. It tests lifecycle/evidence wiring only.

### B-006 — Candidate staging

Attempt the current supported staging sequence.

Record:

- required ordering;
- exact source/evidence split;
- effective selected paths;
- any circular precondition.

Expected result is whatever the published WB-036 control plane actually produces. Do not repair.

### B-007 — Stale-index scenario

Construct a valid frozen/assured source candidate with intentionally stale staged source/evidence state.

Attempt every **documented/supported** current recovery path only.

Expected baseline:

- reproduce the reachability defect where the required correct candidate package cannot be materialized without a prohibited transition.

This is an expected baseline block derived from WB-037.

### B-008 — Candidate/terminal transaction

Where reachable, continue:

```text
candidate commit
→ terminal preparation
→ closeout
→ terminal commit
```

Record the first blocking invariant if current control-plane semantics make the chain unreachable.

Do not patch the control plane inside WB-038.

### B-009 — Publication simulation

If terminal history becomes reachable:

- push exact non-force subject branch to the local bare remote;
- run current published-object conformance against the simulated published ref.

No GitHub mutation is required for the synthetic scenario.

### B-010 — Runtime binding fixture

Exercise normalized/runtime hook fixtures showing that command-local `cd` does not rebind an already-bound session/root.

Expected baseline behavior should be recorded, not changed.

## Structured blocker record

Every expected/unexpected block must capture:

- scenario id;
- lifecycle transition attempted;
- exact command/API;
- component that denied it;
- exit/status code;
- stable error/message excerpt;
- expected state;
- observed state;
- worktree/index/HEAD snapshot;
- whether a documented recovery exists;
- whether that recovery is reachable;
- related frozen-architecture transition/finding.

## Inputs / outputs

### Inputs

- exact WB-036 published base;
- current lifecycle/hooks/validators at that base;
- frozen Architecture v0.6;
- deterministic synthetic WB contract;
- deterministic assurance fixtures.

### Outputs

- executable E2E baseline harness;
- deterministic scenario results;
- baseline report;
- machine-readable scenario summary if simple to provide without adding unnecessary framework complexity.

No product/application output.

## Constraints

- Python standard library preferred unless the repository already has an appropriate dependency.
- No Docker requirement for the harness unless unavoidable.
- No network dependency for the synthetic E2E cycle.
- No live Codex/Claude Reviewer/Verifier required.
- No hidden mutation of developer working copy.
- No stash/reset/clean of preserved WB-037.
- No force push.
- No merge/deploy.
- No broad refactor.

## File/module responsibilities

### Harness entrypoint

Responsible for:

- temporary repo setup;
- scenario orchestration;
- result aggregation;
- cleanup of its own temporary resources.

### Harness helpers

Responsible only for test infrastructure:

- Git subprocess wrappers;
- fixture creation;
- state snapshots;
- local bare remote;
- deterministic assertion/error classes.

They must not implement replacement production lifecycle semantics.

### Baseline report

Records:

- exact tested base;
- scenario results;
- known expected blockers reproduced;
- newly discovered blockers;
- follow-on ownership mapping to the approved remediation sequence.

## Implementation plan

1. Re-verify clean WB-038 bootstrap/base.
2. Inventory current lifecycle/hook/validator CLI surfaces read-only.
3. Implement temporary repository + bare remote harness skeleton.
4. Implement state snapshot and structured result model.
5. Add B-001 through B-004.
6. Add deterministic assurance fixture support.
7. Add candidate staging and stale-index baseline scenarios.
8. Add terminal/publication scenarios as far as current controls allow.
9. Add runtime-binding fixture scenario.
10. Run harness repeatedly and remove harness nondeterminism only.
11. Record all current architectural blockers without repairing them.
12. Run independent Reviewer/Verifier for the WB-038 harness implementation itself under the current repository SDLC.
13. Publish exact subject branch if the repository lifecycle permits it.

## Acceptance criteria

- AC-001: harness runs only in isolated temporary Git state and does not mutate the preserved WB-037 worktree.
- AC-002: local bare remote is used for publication simulation.
- AC-003: at least B-001 through B-007 execute deterministically.
- AC-004: stale-index reachability defect is reproduced as an expected baseline result or, if the published base behaves differently, the difference is documented with exact evidence.
- AC-005: every block has structured diagnostic evidence.
- AC-006: no production control-plane policy is changed.
- AC-007: no live AI agent is required for deterministic harness execution.
- AC-008: harness exit status distinguishes harness failure from an expected control-plane block.
- AC-009: repeated runs from the same base produce equivalent scenario classification.
- AC-010: any newly discovered systemic defect is added to the architecture audit/remediation findings, not fixed opportunistically.
- AC-011: no merge/deploy/force push/external production mutation occurs.
- AC-012: WB-038 itself follows the current repository lifecycle and assurance requirements for its own code changes.

## Stop conditions

Stop implementation and request a new planning decision if:

- harness requires modification of production lifecycle/hook behavior to continue;
- exact WB-036 base cannot be reproduced;
- current lifecycle cannot admit a test-only WB without changing architecture;
- a required test infrastructure change would substantially broaden the write-set;
- architecture v0.6 itself is contradicted by newly proven evidence rather than merely by old implementation behavior.

## Follow-on ownership

Expected findings are mapped to later approved Work Blocks:

- parser/schema divergence → Contract Reader Foundation;
- stale index / candidate package materialization → Git Transaction & Index Recovery;
- candidate/terminal closeout deadlock → Terminal Transaction & Closeout Ordering;
- evidence producer/validator drift → Assurance & Evidence Contract Cleanup;
- duplicated runtime/hook policy → Hook Responsibility Simplification;
- final green transaction → E2E Green + Final Schema Migration + Conformance Hardening.


## Define handoff status

Bootstrap prerequisites are satisfied. WB-038 is ready for Define in the clean worktree:

`~/Projects/WSL/azursystech-wb038`

The active repository Work Block has not yet been opened. Define/Critic must occur before implementation.


## Local execution result

Status: **completed reporting-only; not published as a WB branch**.

The following result is operator-reported from the preserved local WB-038 worktree and has not been independently verified from a remote WB-038 commit because no commit/push was reachable.

Observed baseline:

- B-001–B-005: PASS;
- B-006–B-008: EXPECTED_BLOCK;
- B-009: UNREACHABLE;
- B-010: PASS;
- repeated runs preserved the same classifications;
- focused suite: 5/5;
- candidate-bound Critic: APPROVE;
- Reviewer: READY;
- Verifier: READY;
- frozen candidate: `content-sha256:a017c6a50cc289fcb695d2c63098b63f182ba85364daedf255bbf638c48454d9`.

Local output artifacts:

- `scripts/sdlc_e2e_baseline.py`;
- `scripts/test-sdlc-e2e-baseline.py`;
- `docs/reports/WB-038-sdlc-e2e-baseline.md`;
- `docs/reports/WB-038-sdlc-e2e-baseline.json`;
- reporting-only closeout: `docs/reports/closeout/WB-038.md`.

Publication result:

After valid candidate assurance, normal `git add -- scripts/sdlc_e2e_baseline.py` was denied because the frozen lifecycle had `write_gate=BLOCKED`. The index remained empty; no candidate commit or push was produced; HEAD remained the exact WB-036 terminal base.

Conclusion:

WB-038 succeeded as a diagnostic baseline. It confirmed a self-hosting publication deadlock in the current implementation and directly motivates WB-039 — SDLC Publication Bootstrap / Git Transaction Recovery.
