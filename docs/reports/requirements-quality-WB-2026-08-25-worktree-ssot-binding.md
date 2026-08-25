# Requirements quality — WB-2026-08-25-worktree-ssot-binding

## Verdict

`READY`

## Review

The requirement set is bounded to project-local control-plane behavior and contains seven testable requirements. The durable binding key (`subject_branch`), runtime evidence (`root`, branch, HEAD), repair exception, lifecycle responsibility, test obligations, and operational documentation are explicit.

The scope avoids host-specific absolute paths, central locking, application code, deployment, and production authority. The requested parallel-worktree behavior is therefore implementable without introducing a new architecture layer.

## Ambiguity resolution

- Parallel work means independent Git worktrees on distinct branches, each with branch-local `.agent/active-work-block.json` state.
- A worktree does not perform a Work Block lifecycle transition.
- `event.cwd` is authoritative only as the hook's session-context input; Git branch identity is the durable binding check.
- `.agent/active-work-block.json` remains a repair escape hatch even when its current binding is stale.
- Absolute worktree paths are diagnostics only and are never committed as SSOT.

## Risks requiring implementation attention

- Both Codex and Claude hooks must fail consistently; asymmetric behavior would recreate runtime-specific drift.
- Coordination writes need binding protection, otherwise stale sessions could still mutate plans/reports even when source writes are blocked.
- Existing fixtures currently omit `subject_branch`; they must be migrated atomically with the stricter validator.
- Default-branch and detached-HEAD behavior must remain fail-closed for source Work Blocks.

No blocking Owner decision remains for Stage 0.
