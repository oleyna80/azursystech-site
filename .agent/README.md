# Agent Configuration

This directory contains project-local rules, workflows, roster entries, and reusable skills for AzurSysTech agent work.

## Source of Truth

Read in this order at the start of a session:

1. `AGENTS.md`
2. `memory_bank/context.md`
3. `memory_bank/progress.md`
4. `memory_bank/decisions.md`
5. `docs/.active_ticket`
6. Relevant files in `docs/specs/`, `docs/plans/`, `docs/tasklist/`
7. Relevant strategy, brand, website, leads, AI, SEO, and ops docs
8. Relevant workflow or skill in `.agent/`

`AGENTS.md` is the operating contract. This README is only a map.

## Structure

| Path | Purpose |
| --- | --- |
| `rules/` | Project rules for task tracking and execution discipline |
| `workflows/` | Reusable workflows, including SDD |
| `skills/` | Project-local skills in `SKILL.md` format |
| `ROSTER.md` | Agent roles, streams, skill triggers, SLA hints |

## Operating Model

The canonical control layer is:

- `Tech Lead / Control Tower`: priority, planning, review, acceptance, SSOT sync

Execution can be split into scoped streams:

- Website build stream
- VPS / n8n integration stream
- HubSpot CRM stream
- Content, SEO, lead ops, or verifier streams when needed

Use subagents only when they improve quality or parallelism. Keep scopes separated and return accepted decisions to the control layer.

## Role Discipline

- `Reviewer`: read-only analysis, risks, AC, plan, verdict.
- `Coder`: scoped implementation only.
- `Verifier`: checks against goals; no code changes.

Every stage should state:

- `stage`
- `objective`
- `role`
- `expected result`

## Closeout Requirements

After accepted changes:

- update the relevant tasklist/checklist;
- update `memory_bank/progress.md`;
- add an ADR to `memory_bank/decisions.md` only for durable architecture/process decisions;
- report changed files, AC status, commands run, risks, and commit message if applicable.
