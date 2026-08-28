# Shared Operational Decisions

## WB-2026-08-25-shared-analysis-surface

- Keep memory_bank/ ignored by default with an explicit four-file allowlist.
- Author safe shared context from committed repository evidence; do not promote
  stale ignored local memory.
- Protect .codex/worktrees/ without moving existing worktrees.
- Make PROJECT_MAP.md point to .agent/active-work-block.json as the active
  Work Block SSOT.
- Validate Git index membership and forbidden tracked surfaces without network
  access. The existing .env.vps.example template is the only environment-file
  exception.
- Keep source zones such as 00_strategy/ through 08_showcase/ local unless
  individual files are already intentionally tracked.
- Run the shared-context regression fixture and validator in the existing
  control-plane workflow to enforce the P1 environment-file boundary.
