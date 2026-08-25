# Critic review — WB-2026-08-25-worktree-ssot-binding

## Verdict

`APPROVE`

## Review findings

The proposed fix addresses the actual authority-selection defect rather than treating Git worktree creation as a lifecycle operation. Branch binding is preferable to a committed absolute worktree path because branch names are repository-level durable identifiers while local paths vary by host/session.

The most important correction versus a diagnostics-only change is REQ-003: stale sessions must not retain unrestricted access to normal coordination artifacts. Only the active machine gate itself remains directly repairable. This prevents a canonical checkout with an old gate from mutating plans/reports for the wrong Work Block.

The lifecycle change is also necessary. Tightening the hooks without teaching `lifecycle.py open` to populate `subject_branch` would make newly opened Work Blocks fail their own gate.

## Required implementation checks

- Keep Codex and Claude denial semantics equivalent.
- Verify linked Git worktrees, not merely two directories/copies.
- Assert diagnostic fields in tests rather than relying on manual inspection.
- Preserve existing external hard-stop behavior and gate-repair escape hatch.
- Do not broaden into automatic Work Block locking/closing.

No blocking issue remains. Stage 0 may open the source Write Gate for the approved write-set.
