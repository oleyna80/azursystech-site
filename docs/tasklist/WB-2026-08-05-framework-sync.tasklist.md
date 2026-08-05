# Tasklist: WB-2026-08-05-framework-sync

Adapt latest developments from `/home/azur/Projects/WSL/agentic-sdlc-framework` into `azursystech`.

## Status
- Work Block: `WB-2026-08-05-framework-sync`
- Branch: `sync/agentic-sdlc-framework`
- Stage: `1_IMPLEMENTATION`
- Verification Tier: `Standard`

## Tasks

- [x] Create git branch `sync/agentic-sdlc-framework`
- [ ] Task 1: Integrate OpenCode runtime surface and skill bridge (`.opencode/agents/`, `.opencode/skills/`, `opencode.json`)
- [ ] Task 2: Port `.agent/skills/` additions (`skill-library-maintenance`, `git-orchestration-flow`) and update `.agent/ROSTER.md`, `.agent/critic-gate.md`, `.agent/verification-gate.md`, `.agent/workflows/sdd-protocol.md`
- [ ] Task 3: Update `.codex/` and `.claude/` control planes (agents, hooks, scripts, configs)
- [ ] Task 4: Port helper scripts (`scripts/validate-installation-profile.py`, `scripts/repair-lifecycle.py`, `scripts/validate-evaluation.py`) and update `scripts/bootstrap.sh`
- [ ] Task 5: Sync documentation templates and reference guides in `docs/` (`docs/session-bootstrap.md`, `docs/templates/`, `docs/reference/`, `docs/evals/`, `docs/reports/`, etc.)
- [ ] Task 6: Reconcile `FILE_REGISTRY.yml` and `PROJECT_MAP.md` with new entries while preserving project-specific mappings
- [ ] Task 7: Verification and SSOT closeout (run `scripts/bootstrap.sh`, verify typecheck/checks, update `memory_bank/`)
