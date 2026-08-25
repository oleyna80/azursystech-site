# Critic Gate Record

- **Work Block:** `WB-2026-08-25-worktree-ssot-binding`
- **Status:** `READY`
- **Verdict:** `APPROVE`
- **Report:** `docs/reports/critic-WB-2026-08-25-worktree-ssot-binding.md`
- **Isolation:** `same-session-degraded` (advisory)
- **Reviewed at:** 2026-08-25T13:14:00+02:00

## Current state

Stage 0 Define is complete for the worktree/coordination-SSOT binding fix. The approved design binds normal writes to the active gate's `subject_branch`, keeps runtime worktree paths diagnostic-only, and preserves direct repair of `.agent/active-work-block.json`. Source writes are limited to the active Work Block write-set; Stage 2 assurance remains pending.
