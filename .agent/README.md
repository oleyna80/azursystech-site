# .agent/ - Local Agent Workflow Layer

> Local-first directory for agent skills, workflows, and routing.
> Not published to git by default (see `.gitignore`).

## Directory Structure

```
.agent/
├── README.md            # This file
├── ROSTER.md            # Agent routing table + skill assignments
├── .gitignore           # Keeps .agent/ local-only
├── workflows/
│   └── sdd-protocol.md  # Full SDLC stage definitions
└── skills/              # Project-local skills
    └── <skill-name>/
        └── SKILL.md     # Skill definition
```

## How Skills Work

Each skill is a directory under `.agent/skills/<name>/` with a `SKILL.md` file.
Skills define: Triggers (when to use), Workflow (steps), Guardrails (constraints),
and Handoff (output format).

Claude Code loads runtime skills from `.claude/skills/<name>/`. Bootstrap copies
the same core skills into `.agent/skills/` so the SDLC contract and other agent
runtimes can inspect the project-neutral routing mirror.

Agents match skills by reading their `## Triggers` or `## When to Use` sections.
The Skill Routing Gate (`AGENTS.md`) requires recording: skills checked, matched,
used, and skipped (with reason).

## Finding the Right Skill

1. Check `.agent/ROSTER.md` for the skill routing table.
2. Search `.agent/skills/*/SKILL.md` for matching triggers.
3. If no local skill matches, check `AGENTS.md § External Skill Discovery`.

## Adding a Skill

Copy a skill directory from the framework's `skills/` library into both
`.claude/skills/` and `.agent/skills/`, or create a new one following
`SKILL-CONVENTION.md`.

## Bootstrap

Run `scripts/bootstrap.sh` to verify the workflow layer is complete.
