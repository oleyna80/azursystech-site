# Project Skills

Core framework skills live here for project-local agent routing.

All runtimes may inspect `.agent/skills/<skill>/SKILL.md` (canonical) when the
Skill Routing Gate in `AGENTS.md` matches the current Work Block.

Runtime mirror locations:
- `.agent/skills/` — canonical, project-neutral (all runtimes route here)
- `.claude/skills/` — Claude Code runtime-local skills (may have executable assets)
- `.opencode/skills/` — opencode mirror of `.agent/skills/` for native `Skill` tool
  loading. Kept in sync with `.agent/skills/`; `.agent/skills/` is the source of
  truth. Skill-curation Work Blocks edit `.agent/skills/` then re-copy to
  `.opencode/skills/`.

The directories do not need to be identical across runtimes. Use wrappers in
`.agent/skills/` when a runtime-specific skill is too large or has its own
executable assets.
