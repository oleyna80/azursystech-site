---
artifact_type: work_block_plan
status: ready_for_define
work_block_id: WB-039
scope: planning-only
not_active_work_block: true
architecture_freeze: v0.6
---

# WB-039 — SDLC Publication Bootstrap / Git Transaction Recovery

## Objective

Implement the minimum bounded self-hosting remediation required to make exact frozen candidate-package materialization and stale-index rebuild reachable under Architecture Freeze v0.6.

WB-039 exists because WB-038 proved that the current published control plane can complete Define, implementation, freeze, Critic, Reviewer, and Verifier, yet still cannot stage the assured candidate because post-freeze index mutation is denied as source mutation.

## Architecture binding

Normative architecture remains:

- `docs/architecture/sdlc-architecture-freeze.md` v0.6;
- `docs/architecture/sdlc-e2e-transaction-harness.md`;
- `docs/architecture/sdlc-remediation-plan.md`;
- WB-038 baseline result recorded in the audit branch.

This Work Block does not amend the freeze.

## Target capabilities

Primary target transitions:

- `MATERIALIZE_CANDIDATE_PACKAGE`;
- `REBUILD_CANDIDATE_INDEX`.

Required semantics:

### MATERIALIZE_CANDIDATE_PACKAGE

- worktree source remains unchanged;
- staged source exactly matches `source_candidate_id`;
- finalized candidate-bound evidence is staged exactly;
- no terminal-only path is staged;
- no extra/forbidden path is staged;
- staging does not reopen source mutation authority;
- valid candidate assurance remains bound to the same source candidate.

### REBUILD_CANDIDATE_INDEX

- stale candidate index is replaced deterministically from canonical source/evidence bindings;
- worktree source remains unchanged;
- `source_candidate_id` remains unchanged;
- valid Reviewer/Verifier assurance remains valid when candidate semantics are unchanged;
- extra, stale, forbidden, and terminal-only index content is rejected or removed according to the explicit transaction contract;
- the operation is index-only and not treated as ordinary source mutation.

## Scope

In scope:

- runtime-neutral Git transaction semantics required for the two target transitions;
- focused lifecycle/API exposure needed to authorize those transitions;
- hook/adapter changes strictly required to recognize the transition without weakening general source-write policy;
- focused positive and negative tests;
- WB-038 E2E regression proving B-006/B-007 become actually reachable.

Out of scope unless separately Owner-approved:

- Contract Reader Foundation;
- terminal transaction/closeout redesign;
- assurance-model redesign;
- Process Feedback redesign;
- broad hook simplification;
- final schema migration;
- merge/deploy/release.

## Self-hosting constraint

Normal lifecycle/publication must be attempted first.

If WB-039 reaches a fully valid frozen and assured candidate but current guards still prevent publication solely because the defect being repaired is not yet active in the running control plane, do not bypass policy.

At that boundary, stop and prepare a one-time Owner-controlled bootstrap transaction containing:

1. exact reason normal publication is unreachable;
2. exact `source_candidate_id`;
3. exact allowed paths;
4. exact expected index/tree/commit state;
5. exact commands;
6. preconditions;
7. postconditions;
8. rollback procedure;
9. validation commands;
10. residual risk.

The exceptional transaction must be minimal, exact-path scoped, non-force, subject-branch only, reversible through Git history, independently verifiable, and incapable of merge/deploy/release.

## Verification requirements

WB-039 must verify:

- focused unit/regression tests;
- affected Git-conformance tests;
- WB-038 E2E scenarios repeatedly;
- negative tests for forbidden paths;
- negative tests for stale/extra index content;
- candidate mismatch;
- source mutation after freeze;
- malformed candidate/evidence bindings.

Expected progression:

Before WB-039:
- B-006/B-007 = EXPECTED_BLOCK.

After WB-039:
- exact candidate materialization and stale-index rebuild are reachable.

Do not satisfy this by only changing expected classifications. The real transaction must become reachable.

If B-008 exposes an independent terminal-transaction defect after B-006/B-007 are fixed, record it and stop at scope boundary.

## Acceptance criteria

- AC-001: exact frozen candidate package can be materialized into index without changing worktree source.
- AC-002: stale candidate index can be rebuilt deterministically.
- AC-003: `source_candidate_id` is preserved through index-only recovery.
- AC-004: valid candidate assurance is preserved when only index state changes.
- AC-005: extra/forbidden/terminal-only paths fail closed.
- AC-006: effective Git-selected paths are validated, not only command arguments.
- AC-007: WB-038 B-006/B-007 become reachable in real execution.
- AC-008: production safeguards are not broadly weakened.
- AC-009: no force push, merge, deploy, or production mutation.
- AC-010: any one-time bootstrap authority is isolated from normal runtime behavior.

## Completion boundary

After WB-039 reaches the smallest trustworthy publication-capable state, stop and report:

- resulting branch/HEAD;
- exact candidate and terminal state;
- whether normal autonomous publication is now possible for subsequent Work Blocks;
- any residual blocker assigned to the next approved remediation Work Block.

Do not begin Contract Reader Foundation automatically.


## Define progress — 2026-09-27

Status: **in progress; not yet OPEN**.

Operator-reported local WB-039 progress:

- authoritative checkout: `~/Projects/WSL/azursystech-wb039`;
- branch: `fix/sdlc-publication-bootstrap-039`;
- base/HEAD remains `c4829e77e2e9ae6a694a7def87b381c54571fd6d`;
- worktree was clean before Define;
- Define artifacts were created locally only;
- traceability validation returned READY;
- no production source modification has occurred;
- lifecycle OPEN has not yet been executed.

The first independent Define Critic verdict was **SUPPLEMENT**, not APPROVE.

The Critic required four material clarifications before admission:

1. explicit authoritative recording of `CANDIDATE_STAGED`;
2. compatibility handling between Architecture Freeze v0.6 `source_candidate_id` and legacy WB-036 `frozen_revision`;
3. lifecycle binding for candidate-bound Critic disposition;
4. a closed, machine-verifiable candidate evidence-package schema.

The local Define artifacts were revised accordingly:

- MATERIALIZE records a minimal candidate-stage snapshot while keeping the source write gate BLOCKED;
- REBUILD remains index-only;
- both source identities are preserved during staged migration;
- candidate-bound disposition is lifecycle-bound;
- evidence materialization uses an explicit closed manifest/package contract;
- the staged transaction is intended to preserve original index/worktree/assurance state on failure.

Traceability remained READY after revision. A second independent Critic verdict is pending.

These refinements are treated as WB-039 Define convergence, not as an Architecture Freeze v0.6 amendment.


## Define gate status — 2026-09-27

Status: **READY pending independent Critic capacity; lifecycle not OPEN**.

Operator-reported local state after reconciliation with audit head `48a27a7b3dbd4147b33f0e7b8f207cf9c6878652`:

- branch: `fix/sdlc-publication-bootstrap-039`;
- HEAD/base: `c4829e77e2e9ae6a694a7def87b381c54571fd6d`;
- production source remains unchanged;
- local Define artifacts only:
  - `docs/specs/WB-039.md`;
  - `docs/plans/WB-039.md`;
  - `docs/tasklist/WB-039.tasklist.md`;
  - `docs/reports/WB-039-define-quality.md`;
- Define traceability: READY;
- 4 requirements;
- 4 acceptance criteria;
- 6 tasks;
- `git diff --check`: PASS.

The refreshed local Define explicitly reconciles:

- audit AC-001…AC-010;
- atomic `MATERIALIZE_CANDIDATE_PACKAGE` semantics;
- deterministic index replacement;
- B-008 scope boundary;
- completion-boundary reporting;
- exact fields required for any one-time Owner-controlled bootstrap transaction.

Independent Critic APPROVE is still required before lifecycle OPEN.

The Critic gate is currently blocked only by runtime usage capacity: both the original Critic and a read-only replacement were unavailable due the same runtime usage limit. This is an operational capacity delay, not an SDLC architecture finding. No attempt was made to weaken or bypass the Define gate.
