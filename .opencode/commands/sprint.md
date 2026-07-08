---
description: Run the AzurSysTech sprint-analysis closeout without changing source files.
---

# /sprint - Sprint Analysis

You are Control Tower / Orchestrator.

## Contract

- Stage: Review / Closeout
- Objective: analyze a requested sprint or period using the canonical project sprint-analysis skill.
- Expected result: concise chat report; optional `docs/reports/sprint-YYYY-MM-DD.md` only when the Owner explicitly asks for a file.
- Scope: read-only project evidence: `memory_bank/orchestrator-log.md`, `docs/plans/**`, `docs/reports/**`, and git history.
- Out of scope: source edits, skill edits, hook edits, template edits, config/env/provider changes, staging, commit, push, deploy.
- OpenCode hook note: if a stop hook requires verification-gate classification,
  Control Tower may write session-local SKIPPED/lite values only to
  `.agent/verification-gate.md` and `memory_bank/orchestrator-log.md`; the gate
  file must be reset to its PENDING template before any commit.

## Procedure

1. Read `AGENTS.md`, `PROJECT_MAP.md`, `FILE_REGISTRY.yml`, `.agent/ROSTER.md`, and `.agent/skills/sprint-analysis/SKILL.md`.
2. Run `git status --short --branch`.
3. Determine the period from command arguments. If no period is provided, use the canonical skill default: last 7 days.
4. Run `bash .agent/skills/sprint-analysis/scripts/extract.sh [SINCE] [UNTIL]` when the script is available.
5. Follow the canonical skill's metric groups, evidence rules, and honesty rules.
6. Report improvement candidates as proposals only. Do not edit skills/templates/hooks unless the Owner opens a separate Work Block.
7. Do not stage, commit, push, or modify source files. If the hook note above
   is used, report that the command performed session-local gate/log writes and
   remind Control Tower to reset `.agent/verification-gate.md` before commit.
