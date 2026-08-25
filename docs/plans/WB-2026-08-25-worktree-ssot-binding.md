# WB-2026-08-25-worktree-ssot-binding — Implementation plan

## Decision

Use branch identity as the durable Work Block binding and runtime Git context as evidence. Do not persist absolute worktree paths. Both Claude and Codex hooks will validate that the gate's `subject_branch` matches the branch resolved from the hook event `cwd` before approving any write other than direct repair of `.agent/active-work-block.json`.

This is the smallest sufficient fix for parallel worktrees: it makes stale canonical coordination state fail closed, produces useful diagnostics, and preserves branch-local independent gates without introducing a lock server or centralized lease system.

## Implementation sequence

1. Extend `.agent/active-work-block.default.json` with `subject_branch: ""`.
2. Extend `.codex/scripts/lifecycle.py` so `open` resolves the current branch, rejects detached/default-branch source opening, and records `subject_branch`.
3. Add a worktree-binding/context helper to `.codex/hooks/pre_tool_use_policy.py`.
4. Mirror the same binding behavior in `.claude/hooks/work_block_gate.py`.
5. Keep `.agent/active-work-block.json` repairable before normal binding validation.
6. Add contextual denial strings containing root, branch, HEAD, and Work Block ID.
7. Expand `scripts/test-github-capability-control-plane.py` with linked-worktree fixtures and stale-gate cases for both runtimes.
8. Update `.agent/workflows/owner-controlled-github-flow.md` with parallel-worktree/session rules and explicit pre-write identity checks.
9. Run the control-plane contract suite and `git diff --check`, then freeze the candidate for read-only assurance.

## Binding algorithm

For a write event:

1. Resolve the candidate root from `event.cwd` using the existing project-local gate discovery.
2. Resolve Git `--show-toplevel`, symbolic branch, and HEAD from that root.
3. Load the gate.
4. If the target is `.agent/active-work-block.json`, allow the repair path without requiring an existing valid binding.
5. Otherwise require a non-empty gate `subject_branch`, non-detached branch, Git top-level equal to the resolved root, and exact branch equality.
6. Only after binding succeeds, evaluate coordination/source write-set scope and the existing source gate requirements.
7. When binding fails, return one concise diagnostic with the runtime context and the session-restart instruction.

## Compatibility and migration

- Existing active Work Blocks that already carry `subject_branch` continue to work only from their matching branch.
- Fixtures and lifecycle-created states are migrated to include `subject_branch`.
- The default gate remains blocked and carries an empty binding.
- Old/stale canonical gates immediately become safer because a branch mismatch blocks writes rather than selecting an unrelated write-set.
- No schema-version bump is required because `subject_branch` already exists in current live gate state and the change tightens an existing schema-v3 contract.

## Verification plan

The contract suite will create a temporary repository plus two linked worktrees on distinct branches. It will place independent gates in each worktree and invoke both hooks with synthetic PreToolUse events. Tests must prove matching-context allow, cross-worktree/stale-context deny, coordination protection, repair escape hatch, lifecycle branch capture, and diagnostic content.

## Stop conditions

Return to Define if the implementation requires a central lock service, absolute-path persistence, a schema-version migration, Git config mutation outside temporary test fixtures, or changes to application/runtime product code. Stop before merge or deployment.
