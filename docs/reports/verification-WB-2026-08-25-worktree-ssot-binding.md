# Verification — WB-2026-08-25-worktree-ssot-binding

## Verdict

`READY`

## Subject

- Base: `5d3f3115d14fa715c7e06839aac092da5e4a8819`
- Frozen implementation head: `55b9c8f1440494a29e7d3aea291b9bbc8f270b7f`
- Branch: `fix/worktree-ssot-binding`
- Isolation: `github-actions-independent-runner`

## Deterministic evidence

### Control Plane Contracts — run #51

Result: `SUCCESS`.

The integration fixture reports `PASS=11 FAIL=0`, including:

- default schema with empty durable `subject_branch`;
- lifecycle branch capture;
- lifecycle rejection on default branch and detached HEAD;
- existing hard-stop behavior;
- Codex source/scope behavior;
- Codex coordination commit behavior;
- stale/mismatched binding denial and direct active-gate repair for Codex and Claude;
- two real linked Git worktrees with separate branches/gates and cross-worktree stale-gate denial;
- Claude source/scope and assurance behavior;
- candidate `git diff --check` against the PR base;
- OpenCode hard-stop posture.

The same workflow also passed the blocked-default schema validator, GitHub CLI/API hard-stop fixtures, and native Codex apply-patch fixtures.

### General CI — run #145

Result: `SUCCESS`.

`quality (web)`, `quality (showcase)`, `quality (admin)`, and the dependent Showcase Docker runtime completed successfully. This confirms the control-plane change does not regress the repository's normal application/build/runtime checks.

## Acceptance criteria

- AC-001: PASS — hook diagnostics resolve root/branch/HEAD from `event.cwd`.
- AC-002: PASS — matching branch + valid gate allows in-scope writes for both runtimes.
- AC-003: PASS — stale/mismatched branch denies before source authorization.
- AC-004: PASS — missing `subject_branch` and detached HEAD deny writes.
- AC-005: PASS — normal coordination writes are branch-bound.
- AC-006: PASS — `.agent/active-work-block.json` remains directly repairable.
- AC-007: PASS — denials include root/branch/HEAD/work_block_id and session/worktree guidance.
- AC-008: PASS — default state has empty `subject_branch`; lifecycle `open` records current feature branch.
- AC-009: PASS — lifecycle rejects default-branch and detached source opening.
- AC-010: PASS — linked-worktree fixture proves per-worktree gate isolation for Codex and Claude.
- AC-011: PASS — existing control-plane fixtures remain green.
- AC-012: PASS — Owner-controlled workflow documents separate worktree/WB lifecycles and pre-write identity checks.
- AC-013: PASS — control-plane fixture passes and executes the candidate `git diff --check`; GitHub Actions reports `PASS test_candidate_diff_check`.

No required verification remains unresolved.
