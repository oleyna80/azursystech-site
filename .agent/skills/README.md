# Project Skills

Core framework skills live here for project-local agent routing.

All runtimes may inspect `.agent/skills/<skill>/SKILL.md` when the Skill Routing
Gate in `AGENTS.md` matches the current Work Block.

Claude Code runtime skills may also live under `.claude/skills/`, but the two
directories do not need to be identical. Use wrappers in `.agent/skills/` when a
runtime-specific skill is too large or has its own executable assets.
