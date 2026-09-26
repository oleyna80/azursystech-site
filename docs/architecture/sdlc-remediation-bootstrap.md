---
artifact_type: remediation_bootstrap_plan
status: completed
scope: docs-only
not_work_block: true
architecture_freeze: v0.6
---

# Bootstrap — WB-037 Preservation to SDLC Remediation

## Purpose

Define the safe transition from the current unfinished local WB-037 state to a clean starting point for the first remediation Work Block.

This bootstrap is **not a Work Block** and does not authorize source implementation.

## Verified starting facts

Remote/GitHub state checked on 2026-09-26:

- published branch `audit/hook-enforcement-036` exists;
- canonical published WB-036 terminal SHA is `c4829e77e2e9ae6a694a7def87b381c54571fd6d`;
- remote branch `fix/shared-context-trigger-037` is absent.

Reported preserved local WB-037 state:

- local branch: `fix/shared-context-trigger-037`;
- local HEAD: `c4829e77e2e9ae6a694a7def87b381c54571fd6d`;
- no final WB-037 candidate commit/push exists for the current v21 state;
- source candidate is frozen and has fresh Critic/Reviewer/Verifier assurance;
- current blocker is stale staged source state after earlier soft-reset recovery;
- normal staging/index repair is unreachable under the current frozen-write policy;
- local untracked/coordination evidence also exists.

The operator must re-verify local facts immediately before bootstrap. Chat/audit records are not a substitute for live Git state.

## Live local verification — 2026-09-26

Operator output confirms:

- local branch: `fix/shared-context-trigger-037`;
- local HEAD: `c4829e77e2e9ae6a694a7def87b381c54571fd6d`;
- active lifecycle Work Block: `WB-037`;
- base commit: `c4829e77e2e9ae6a694a7def87b381c54571fd6d`;
- write gate: `BLOCKED`;
- frozen revision: `content-sha256:ccd0d263e0e01fc79187f1c6918ebf31f5232661f72ef1698bebd9787975dd21`;
- Reviewer: READY for the same frozen revision;
- Verifier: READY for the same frozen revision;
- optional evaluation/drift: SKIPPED with explicit reasons;
- the working copy contains a substantial staged WB-037 set, additional unstaged WB-037 changes, and many untracked files;
- untracked `.agents/skills/**` material is present and must not be treated as WB-038 source implicitly.

The local state therefore matches the bootstrap assumption: WB-037 must be preserved, not normalized in place.

## Decision

Do **not** reset, clean, stash, or otherwise normalize the current WB-037 working copy merely to start remediation.

Preserve that working copy as forensic/recovery material.

Start remediation in a **new clean worktree** from the exact published WB-036 terminal SHA.

Reason:

- avoids destructive manipulation of the blocked WB-037 index;
- preserves all current local evidence for later recovery;
- avoids making unfinished WB-037 a predecessor of remediation work;
- starts from the control-plane version whose behavior was actually audited;
- makes runtime/worktree bootstrap explicit, matching Architecture Freeze v0.6.

## Bootstrap authority

Owner approval is required for this bootstrap because it creates a new remediation branch/worktree while intentionally leaving an unfinished local WB preserved outside the new lifecycle.

This authority does not include:

- force push;
- merge;
- deploy/release;
- deletion of WB-037 files/worktree;
- stash deletion;
- cleanup of unrelated local changes.

## Phase A — Preserve WB-037 evidence

Before creating the new worktree, capture read-only inventory from the existing WB-037 working copy:

- current branch;
- current HEAD;
- `git status --short --branch`;
- staged path list;
- unstaged path list;
- untracked path list;
- current lifecycle status;
- current frozen candidate identity;
- current Reviewer/Verifier bindings where readable.

Create external recovery artifacts outside the repository working tree:

1. tracked diff against HEAD, including binary-safe content;
2. untracked-file archive or equivalent exact copy;
3. text inventory containing branch/HEAD/status/path lists.

The preservation artifacts are **non-authoritative recovery material**. They are not successor WB source.

Do not use `git stash`; existing user stashes must remain untouched.

## Phase B — Verify published base

Fetch the remote and verify that:

- `origin/audit/hook-enforcement-036` resolves to the expected published WB-036 history;
- exact terminal SHA `c4829e77e2e9ae6a694a7def87b381c54571fd6d` is reachable from that remote ref;
- no remote `fix/shared-context-trigger-037` exists;
- no WB-037 local candidate is being mistaken for published state.

If any check disagrees, stop bootstrap and update this plan before creating the remediation branch.

## Phase C — Create clean remediation worktree

Create a new branch/worktree from exact SHA:

- proposed branch: `test/sdlc-e2e-baseline-038`;
- proposed Work Block: `WB-038`;
- base: `c4829e77e2e9ae6a694a7def87b381c54571fd6d`.

The new worktree must start clean:

- clean worktree;
- clean index;
- canonical inactive lifecycle state from WB-036 terminal;
- no WB-037 local files copied implicitly;
- no user stashes applied.

A new Codex/Claude runtime session must start **from the new worktree root**. Command-local `cd` from the old session is not an authority rebind.

## Phase D — Architecture contract availability

Architecture Freeze v0.6 remains the authoritative design SSOT in branch:

`audit/sdlc-revision`

Before WB-038 admission, the WB-038 Define artifacts must explicitly bind/reference:

- `docs/architecture/sdlc-architecture-freeze.md` v0.6;
- `docs/architecture/sdlc-e2e-transaction-harness.md`;
- `docs/architecture/sdlc-remediation-plan.md`;
- this bootstrap plan.

Implementation must not redesign frozen architecture.

The first WB may copy the frozen architecture documents into its own branch as coordination/contract material only if its approved Define contract explicitly includes those paths. No implicit cross-branch mutation is allowed.

## Phase E — WB-038 admission boundary

WB-038 starts only after:

- new worktree is clean;
- exact base is verified;
- runtime session is bound to the new worktree;
- WB-038 spec/plan/tasklist are prepared;
- Define Critic approves the exact enforcement-relevant contract;
- current lifecycle admits the WB normally.

The existing WB-037 working copy remains preserved and is not mutated during WB-038.

## Completion criteria

Bootstrap is complete when:

- WB-037 local state is preserved and recoverable;
- no existing stash has been modified/deleted;
- a new clean worktree exists from exact WB-036 terminal SHA;
- remediation branch is distinct from WB-037;
- runtime session is correctly bound to the new root;
- no source remediation has yet occurred;
- WB-038 Define may begin from a deterministic clean state.

## Later WB-037 disposition

This bootstrap does not decide whether WB-037 will later be:

- recovered and published under the revised SDLC;
- superseded by remediation work;
- formally STOPPED once the new STOPPED lifecycle exists.

That is a separate Owner decision after the remediation control plane provides a safe supported transition.

## Clean remediation worktree verification — 2026-09-26

Operator verified after `git fetch origin --prune`:

- local preserved WB-037 HEAD: `c4829e77e2e9ae6a694a7def87b381c54571fd6d`;
- `origin/audit/hook-enforcement-036` resolves to the same exact SHA;
- exact SHA is contained by the published remote WB-036 branch;
- new local worktree created successfully;
- new subject branch: `test/sdlc-e2e-baseline-038`;
- new worktree HEAD: `c4829e77e2e9ae6a694a7def87b381c54571fd6d`;
- new worktree status is clean.

Remaining bootstrap check:

- verify external WB-037 recovery artifact checksums from inside the recovery directory.

After checksum verification succeeds, the bootstrap boundary is complete and WB-038 Define may begin in the new worktree.



## Bootstrap completion — 2026-09-26

Owner/operator confirmed that all external WB-037 recovery artifact checksums validate successfully.

Bootstrap is complete:

- WB-037 remains preserved in its original local worktree;
- external recovery artifacts are integrity-verified;
- WB-038 has a separate clean worktree;
- WB-038 branch is `test/sdlc-e2e-baseline-038`;
- WB-038 base is exact published WB-036 terminal `c4829e77e2e9ae6a694a7def87b381c54571fd6d`;
- no stash/reset/clean/force/merge/deploy was used to normalize WB-037;
- remediation Define may now begin.
