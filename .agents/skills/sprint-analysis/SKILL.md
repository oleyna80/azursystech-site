---
name: sprint-analysis
description: AzurSysTech sprint and period analysis adapter for Codex. Use when the Owner asks to analyze a sprint, week, period, velocity, plan/fact, shipped work, process quality, incidents, scope creep, or retro metrics; read and follow .agent/skills/sprint-analysis/SKILL.md as the canonical source.
---

# Sprint Analysis Adapter

This is a Codex discovery adapter. The canonical project skill is
`.agent/skills/sprint-analysis/SKILL.md`.

## Workflow

1. Read `AGENTS.md`, `PROJECT_MAP.md`, `FILE_REGISTRY.yml`, `.agent/ROSTER.md`, then `.agent/skills/sprint-analysis/SKILL.md` completely.
2. Follow the canonical skill workflow. When the period is not specified, use the canonical default: last 7 days.
3. Use `bash .agent/skills/sprint-analysis/scripts/extract.sh [SINCE] [UNTIL]` when available.
4. Treat sprint analysis as read-only by default.
5. Write `docs/reports/sprint-YYYY-MM-DD.md` only when the Owner explicitly requests a report file.
6. If a runtime stop hook requires verification-gate classification, Control Tower may write session-local SKIPPED/lite values only to `.agent/verification-gate.md` and `memory_bank/orchestrator-log.md`; reset `.agent/verification-gate.md` to its PENDING template before any commit.
7. Never edit source code, skills, hooks, templates, env/provider config, commit, push, or deploy from this skill.
8. If the canonical `.agent` skill is unavailable, stop and report `BLOCKED`; do not invent a parallel sprint-analysis process.
