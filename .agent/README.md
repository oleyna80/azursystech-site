# .agent/ - Agent Workflow Layer

> Project-level directory for runtime-neutral agent workflows, gates, routing,
> and approved skill wrappers. Core policy-bearing files in this directory are
> committed so another workstation or agent runtime can reproduce the project
> workflow. Skill directories are curated separately.

## Directory Structure

```
.agent/
├── README.md            # This file
├── ROSTER.md            # Agent routing table + skill assignments
├── critic-gate.md       # Stage 0 critic evidence contract
├── verification-gate.md # Stage 2/3 verification evidence contract
├── workflows/
│   └── sdd-protocol.md  # Full SDLC stage definitions
└── skills/              # Optional project-local skills, curated separately
    └── <skill-name>/
        └── SKILL.md     # Skill definition
```

## How Skills Work

Each approved skill is a directory under `.agent/skills/<name>/` with a
`SKILL.md` file. Skills define: Triggers (when to use), Workflow (steps),
Guardrails (constraints), and Handoff (output format).

Claude Code may load runtime skills from `.claude/skills/<name>/`. Other
agents inspect `.agent/skills/<name>/SKILL.md` as the runtime-neutral routing
mirror. When a vendor skill is too large or runtime-specific, keep a small
project wrapper in `.agent/skills/` and point to the runtime source.

The core bootstrap does not require `.agent/skills/**`. Candidate or local-only
skills may exist in a workspace while they are being evaluated, but they become
portable project policy only after a skill-curation Work Block approves the
exact skill paths for commit. Local skill candidates are ignored by default;
after curation, add approved exact paths explicitly with `git add -f`.

Agents match skills by reading their `## Triggers` or `## When to Use` sections.
The Skill Routing Gate (`AGENTS.md`) requires recording: skills checked, matched,
used, and skipped (with reason).

## Finding the Right Skill

1. Check `.agent/ROSTER.md` for the skill routing table.
2. Search approved or local `.agent/skills/*/SKILL.md` files for matching
   triggers when those files exist.
3. If no local skill file matches, record `skill-file-unavailable` and check
   `AGENTS.md § External Skill Discovery` or the nearest committed gate/template.

## Adding a Skill

Open a skill-curation Work Block before committing skill directories. Copy a
skill directory from the framework's `skills/` library into `.agent/skills/`,
or create a new one following the existing `SKILL.md` structure. For
runtime-specific skills, add a wrapper in `.agent/skills/` and keep the full
implementation in the runtime directory. Commit only the approved exact skill
paths; use `git add -f` for curated skill wrappers while `.agent/skills/**`
remains ignored by default.

## Bootstrap

Run `scripts/bootstrap.sh --check` to verify the workflow layer is complete.
Run `scripts/bootstrap.sh --init` in a fresh clone when local ignored
`memory_bank/` starter files are missing.
