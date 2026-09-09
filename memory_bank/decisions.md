# Shared Operational Decisions

## WB-2026-08-25-shared-analysis-surface

- Keep memory_bank/ ignored by default with an explicit four-file allowlist.
- Author safe shared context from committed repository evidence; do not promote
  stale ignored local memory.
- Protect .codex/worktrees/ without moving existing worktrees.
- Make PROJECT_MAP.md point to .agent/active-work-block.json as the active
  Work Block SSOT.
- Use `FILE_REGISTRY.yml:migration_state` plus the release-state validator as
  the machine-readable lifecycle projection; `PROJECT_MAP.md` is its visible
  human projection.
- Treat remote branch and local-worktree inventories as timestamped operational
  evidence, never as autonomous cleanup authority.
- Validate Git index membership and forbidden tracked surfaces without network
  access. The existing .env.vps.example template is the only environment-file
  exception.
- Keep source zones such as 00_strategy/ through 08_showcase/ local unless
  individual files are already intentionally tracked.
- Run the shared-context regression fixture and validator in the existing
  control-plane workflow to enforce the P1 environment-file boundary.

## 2026-09-09 Process Feedback

- Select `docs/engineering-memory/process-feedback-registry.yml` as the single
  canonical Process Feedback sink. It is structured for aggregation, while
  systemic SDLC/governance change remains advisory and requires a separate
  improvement Work Block.
- Require every new non-trivial Work Block to record an explicit closeout result
  with all eight reviewed dimensions; clean work may use only the evidence-backed
  `NONE — checked` form.
