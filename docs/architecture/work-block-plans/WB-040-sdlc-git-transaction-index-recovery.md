---
artifact_type: work_block_plan
status: owner_authorized_define
work_block_id: WB-040
scope: planning-only
not_active_work_block: true
architecture_freeze: v0.6
strategy: maintenance_mode
base_commit: 96c6f35d0cb219ceaebd192d4d3993a19f40f172
subject_branch: fix/sdlc-git-transaction-040
---

# WB-040 — Git Transaction & Index Recovery

## Objective

Implement the Git transaction layer required by Architecture Freeze v0.6 so that an already frozen and assured candidate can be materialized into the Git index deterministically without mutating source bytes or invalidating source assurance.

WB-040 owns the index/candidate-package reachability problem exposed by WB-037/WB-038 and the Git-native transaction gap confirmed during WB-039 publication.

WB-040 does **not** redesign terminal closeout, assurance semantics, shared schema ownership, or merge/deploy authority.

## Base and branch

Canonical remediation base:

`96c6f35d0cb219ceaebd192d4d3993a19f40f172`

Published predecessor:

`fix/sdlc-publication-bootstrap-039`

New subject branch:

`fix/sdlc-git-transaction-040`

Start from a fresh worktree/checkout created from the exact published WB-039 commit. Do not reuse the WB-039 worktree because it contains unrelated local `CLAUDE.md` and maintenance-audit state.

## Architecture binding

Normative sources:

- `docs/architecture/sdlc-architecture-freeze.md` revision v0.6;
- `docs/architecture/sdlc-transition-model.md`;
- `docs/architecture/sdlc-remediation-plan.md`;
- `docs/architecture/sdlc-e2e-transaction-harness.md`;
- `docs/architecture/sdlc-maintenance-mode.md`;
- findings F-017, F-018 and F-019 in `docs/architecture/sdlc-revision-audit.md`.

Core invariant:

> Index mutation is not source mutation.

The Git transaction layer owns deterministic worktree/index/history postconditions. Runtime hooks must not infer or redefine those postconditions independently.

## In scope

WB-040 must implement and verify the minimum transaction semantics for:

### 1. `MATERIALIZE_CANDIDATE_PACKAGE`

Preconditions:

- exact frozen/source candidate identity is known;
- worktree source projection still matches that identity;
- required candidate-bound evidence is finalized and valid enough for this transition;
- every source/evidence path belongs to the candidate package contract.

Allowed mutation:

- Git index only.

Postconditions:

- staged source subset exactly materializes the frozen source candidate;
- staged candidate evidence is complete and exact;
- no terminal-only, unrelated, stale, or forbidden path remains staged;
- source worktree bytes are unchanged;
- source candidate identity is unchanged;
- source assurance is not invalidated.

### 2. `REBUILD_CANDIDATE_INDEX`

Purpose:

Recover from stale, partial, or contaminated index state without replaying source implementation or source assurance.

Required behavior:

- clear/reconstruct the candidate package deterministically from canonical source/evidence bindings;
- preserve source worktree bytes;
- preserve source candidate identity;
- preserve valid candidate assurance;
- reject unexpected/unauthorized staged content;
- finish with the same canonical index tree that normal candidate materialization would produce.

### 3. Candidate commit reachability

Once the exact candidate package is staged:

- the normal Git-native commit path must be able to validate the staged package;
- the transaction layer must not require a prohibited source mutation to progress;
- commit validation must reason from the staged tree and canonical bindings, not from incidental command history.

WB-040 may adjust the minimum Git-native commit enforcement required to make the candidate commit reachable, but must not redesign terminal commit or push semantics beyond what is necessary for candidate commit correctness.

## Maintenance Mode usage

WB-040 executes under the Owner-controlled Maintenance Mode capability introduced by WB-039.

For the WB-040 repair window:

- activate Maintenance Mode only for the exact new repo/worktree/branch/base/path scope;
- downgrade only cooperative guards required to repair/test this transaction layer;
- keep all immutable hard stops enforced;
- log downgraded decisions with `normal_lifecycle_approval=false`;
- deactivate the mode after implementation/verification;
- prove ordinary enforcement is restored.

Maintenance Mode is a repair mechanism, not the target transaction semantics.

## E2E baseline continuity

The original WB-038 deterministic baseline harness exists only in its preserved local worktree and is **not present in the published WB-039 ancestry**.

WB-040 must restore durable E2E coverage as part of its test scope.

Allowed approach:

- port/recreate the minimum WB-038 deterministic harness scenarios needed for Git transaction/index recovery;
- preserve the same scenario intent and expected blocker semantics;
- do not import unrelated WB-038 worktree state.

At minimum, the scenarios corresponding to stale/post-freeze candidate staging must move from expected blocker to PASS after WB-040.

Terminal-history scenarios may remain blocked/unreachable when their owning architecture belongs to the later Terminal Transaction & Closeout Ordering batch.

## Define requirements

Before implementation, inspect the current repository and identify the exact modules that currently own:

- candidate/frozen identity;
- lifecycle transition dispatch;
- index staging/materialization;
- Git-native pre-commit validation;
- staged-tree inspection;
- candidate evidence package membership;
- recovery/reset/rebuild behavior.

Define must produce:

- exact source write-set;
- exact coordination/evidence write-set;
- transition-to-module responsibility mapping;
- old behavior still supported;
- new behavior introduced;
- activation point;
- rollback boundary;
- compatibility tests.

Do not create a second independent transaction engine if an existing shared layer can be made authoritative.

## Required positive regressions

- exact frozen source + exact finalized candidate evidence → canonical candidate index;
- stale/partial index → `REBUILD_CANDIDATE_INDEX` → same canonical candidate index;
- index-only materialization leaves source worktree bytes unchanged;
- index-only materialization leaves source candidate identity unchanged;
- index-only materialization does not invalidate Critic/Reviewer/Verifier bindings;
- candidate commit validation accepts the exact canonical staged package;
- rebuild is deterministic when repeated from equivalent source/evidence state.

## Required negative regressions

- extra staged source path → DENY;
- extra staged evidence/terminal-only path → DENY;
- missing required source path → DENY;
- missing required candidate evidence → DENY;
- stale source bytes that no longer match source candidate identity → DENY;
- wrong branch/base/WB binding → DENY;
- malformed or ambiguous candidate package membership → fail closed;
- candidate commit with non-canonical staged tree → DENY;
- force push / merge / deploy / protected-default mutation remain DENY.

## Acceptance criteria

- AC-001: one deterministic transaction path materializes the complete candidate package into the index.
- AC-002: materialization mutates index state only; source worktree bytes remain unchanged.
- AC-003: candidate identity and valid source assurance remain unchanged after index-only transitions.
- AC-004: stale/partial/contaminated candidate index can be rebuilt deterministically.
- AC-005: rebuilt index equals the canonical index produced by normal materialization.
- AC-006: extra, missing, terminal-only, unrelated, or forbidden staged paths fail closed.
- AC-007: exact candidate commit is reachable through the repaired Git-native validation path without source mutation or lifecycle falsification.
- AC-008: transaction semantics are shared/runtime-neutral; Claude/Codex adapters do not define independent candidate/index rules.
- AC-009: immutable Owner/external hard stops remain enforced under Maintenance Mode.
- AC-010: Maintenance Mode is disabled after verification and normal enforcement is restored.
- AC-011: durable deterministic E2E coverage exists in the WB-040 commit for the repaired candidate/index scenarios.
- AC-012: former WB-038 candidate/index blocker scenarios are converted to PASS where owned by WB-040.
- AC-013: terminal closeout/publication scenarios not owned by WB-040 remain explicitly expected-blocked rather than being opportunistically repaired.
- AC-014: no merge, deploy, release, force push, protected/default mutation, credential, live-production, or destructive cleanup authority is introduced.
- AC-015: exact changed paths, test evidence, maintenance audit summary, and rollback boundary are recorded before publication.

## Implementation sequence

1. Create a fresh WB-040 worktree from exact WB-039 published SHA.
2. Fetch/read the latest audit SSOT.
3. Inspect current transaction/lifecycle/Git-native ownership.
4. Recreate/port the minimum durable WB-038 E2E candidate/index scenarios.
5. Prepare WB-040 spec/plan/tasklist/Define-quality artifacts with exact write-sets.
6. Run independent Critic if capacity is available; if unavailable, record the external limitation honestly and do not fabricate approval.
7. Activate bounded Maintenance Mode for the exact WB-040 scope.
8. Implement shared candidate-package materialization.
9. Implement deterministic stale-index rebuild.
10. Align minimum Git-native candidate-commit validation with the transaction contract.
11. Run focused positive/negative transaction fixtures.
12. Run the durable E2E candidate/index scenarios.
13. Run existing hard-stop/control-plane/regression suites.
14. Deactivate Maintenance Mode and prove normal enforcement is restored.
15. Stop WB-040 and report exact branch/HEAD, changed paths, remaining blockers, and publication readiness.

## Out of scope

- Contract Reader Foundation / broad schema migration;
- `TERMINAL_PREPARED` implementation;
- success-closeout ordering;
- terminal commit transaction;
- Process Feedback redesign;
- closeout-manifest redesign;
- broad assurance/evidence cleanup;
- broad hook simplification;
- final CI/conformance hardening;
- merge/deploy/release;
- production data/infrastructure;
- general `CLAUDE.md` cleanup.

## Owner authorization — 2026-09-27

Owner instructed the remediation sequence to continue after verified publication of WB-039.

This authorizes WB-040 Define and bounded implementation under the Maintenance Mode strategy described above.

It does not authorize merge, deploy/release, force/non-fast-forward push, protected/default branch mutation, production mutation, credentials/secrets changes, remount/privilege escalation, destructive cleanup, or unrelated source changes.
