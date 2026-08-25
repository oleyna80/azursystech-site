# WB-2026-08-25-worktree-ssot-binding — Worktree / coordination SSOT binding

## Status and authority

- Work Block: `WB-2026-08-25-worktree-ssot-binding`
- Governance profile: `Managed`
- Base subject: `origin/main` at `5d3f3115d14fa715c7e06839aac092da5e4a8819`
- Branch: `fix/worktree-ssot-binding`
- Lifecycle: Stage 0 Define must be `READY` before control-plane source writes.
- Publication: isolated feature branch only; merge, deploy, live infrastructure, credentials, and production remain Owner-controlled.

## Objective

Make the project-local Work Block gate explicitly bound to the Git worktree/branch represented by the hook event `cwd`, so parallel Git worktrees can safely carry independent branch-local coordination state and a stale gate in the canonical checkout cannot silently authorize or misdiagnose writes intended for another worktree.

## Requirements

- REQ-001: Treat `event.cwd` as the session identity input. Resolve the repository/worktree root from it and inspect the actual Git branch and HEAD before approving writes.
- REQ-002: Bind active source work to `subject_branch`. Source writes must be denied when the active gate has no valid subject branch, Git is detached, or the current branch does not equal the gate's `subject_branch`.
- REQ-003: Apply the binding check to coordination writes as well, except the machine gate `.agent/active-work-block.json` must remain directly repairable so stale/invalid coordination state can be corrected.
- REQ-004: On binding or scope denial, emit actionable diagnostics containing resolved worktree root, current branch, current HEAD, and active `work_block_id`; the message must explain that shell-internal `cd` does not rebind the agent session and that a new session must start from the intended worktree.
- REQ-005: Update lifecycle/default-state creation so newly opened Work Blocks record their current non-default `subject_branch` deterministically. Do not store absolute worktree paths in committed SSOT because they are host-specific.
- REQ-006: Add executable contract tests for both Codex and Claude gates covering: matching branch allow; mismatched/stale branch deny; two-worktree isolation; coordination mismatch deny; active gate repair allow; and diagnostic context.
- REQ-007: Document the operational rule: creating a Git worktree does not close the prior Work Block. Parallel work requires one branch-local gate per worktree/session; prior Work Blocks require an explicit lifecycle transition/closeout.

## Design constraints

- No absolute local paths may become durable repository state.
- `subject_branch` is the durable binding key; worktree root and HEAD are runtime diagnostics/evidence.
- Existing external hard stops remain unchanged.
- No application, website, SEO, content, database, deployment, or client-facing behavior is in scope.
- The fix must preserve repairability of `.agent/active-work-block.json` even when other binding checks fail.
- Prefer one shared behavioral contract mirrored in the existing Codex and Claude hooks; do not introduce a new service or dependency.

## Acceptance criteria

- AC-001 [req=REQ-001]: A hook event started inside a worktree resolves that worktree's repository root and reports its actual branch and HEAD.
- AC-002 [req=REQ-002]: With gate `subject_branch=fix/worktree-ssot-binding` on the same branch, an otherwise valid in-scope source write is allowed.
- AC-003 [req=REQ-002]: The same gate evaluated from another branch is denied before source scope authorization.
- AC-004 [req=REQ-002]: Detached HEAD or missing/blank `subject_branch` denies source writes with an explicit binding error.
- AC-005 [req=REQ-003]: A mismatched branch cannot write normal coordination artifacts such as `docs/plans/**`, `.agent/critic-gate.md`, or `.codex/write-gate.md`.
- AC-006 [req=REQ-003]: `.agent/active-work-block.json` remains writable for repair despite a stale/mismatched binding.
- AC-007 [req=REQ-004]: Binding-denial output includes `root`, `branch`, `HEAD`, and `work_block_id`, and tells the operator to start the agent session from the intended worktree rather than relying on command-local `cd`.
- AC-008 [req=REQ-005]: `active-work-block.default.json` carries an empty `subject_branch`, and lifecycle `open` writes the current feature branch into the active gate.
- AC-009 [req=REQ-005]: Lifecycle refuses to open source work on the repository default branch or detached HEAD unless the operation is an explicit coordination-only repair path already allowed by existing policy.
- AC-010 [req=REQ-006]: Contract tests create two linked Git worktrees/branches with different gates and prove that each hook authorizes only the gate belonging to its event `cwd`.
- AC-011 [req=REQ-006]: Existing control-plane contract tests continue to pass after fixtures are updated for `subject_branch`.
- AC-012 [req=REQ-007]: Owner-controlled workflow documentation states that worktree creation and Work Block closeout are separate lifecycle operations and gives the required pre-write identity checks (`pwd`, `git rev-parse --show-toplevel`, branch, gate).
- AC-013 [req=REQ-001,REQ-006]: `python3 scripts/test-github-capability-control-plane.py` and `git diff --check` pass for the frozen candidate.

## Non-goals

- No global lock preventing multiple worktrees.
- No central database/daemon for Work Block leases.
- No absolute-path registry of worktrees.
- No automatic closing of another Work Block when a worktree is created.
- No change to GitHub publication, merge, deployment, secret, or production authority.

## Completion boundary

Stage 2 requires read-only review, verification, and drift assessment against the frozen diff. Successful completion produces an Owner publication handoff for the exact feature-branch HEAD; merge and production remain separate explicit Owner actions.
