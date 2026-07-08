# WB-2026-07-08 - Sprint Analysis Evidence Hardening

## Status

Complete

## Lifecycle stage

Verification

## Objective

Harden the sprint-analysis skill so sprint reviews surface evidence gaps more
directly: Work Blocks with implementation activity but no verification row, and
commits that do not carry an explicit Work Block reference.

## Role

Orchestrator / Control Tower

## Expected result

- `extract.sh` emits an evidence-gap section for common WB/commit linkage
  problems.
- `sprint-analysis` instructions require the analyst to read and report those
  gaps as heuristic evidence.
- The Work Block template records the commit-readiness discipline: non-trivial
  commits need a verification row or an explicit skip reason before scoped
  commit.
- Existing dirty runtime-adapter files and `.codex/hooks/**` files are not
  touched.

## Approved scope

- `.agent/skills/sprint-analysis/SKILL.md`
- `.agent/skills/sprint-analysis/scripts/extract.sh`
- `docs/templates/work-block-template.md`
- `docs/plans/WB-2026-07-08-sprint-analysis-evidence-hardening.md`

## Out of scope

- Runtime adapter WB files.
- `.codex/hooks/**` and Codex hook configuration.
- Application source code.
- Provider/model/API settings, env files, secrets, deploy files.
- Commit or push without separate Owner approval.

## Preflight

- `git status --short --branch`: branch `main...origin/main [ahead 2]`.
- Pre-existing dirty files:
  - Runtime command adapter WB write-set: `.agent/ROSTER.md`,
    `FILE_REGISTRY.yml`, `PROJECT_MAP.md`,
    `docs/engineering-memory/opencode-runtime-layer.md`, `.agents/**`,
    `.claude/commands/**`, `.opencode/commands/**`,
    `docs/engineering-memory/runtime-command-adapters.md`,
    `docs/plans/WB-2026-07-08-runtime-command-adapters.md`.
  - Untracked Codex hook files: `.codex/hooks.json`, `.codex/hooks/**`.
- Proceed rule: this WB touches only the approved sprint-analysis/template
  write-set and does not stage or commit anything.

## Implementation summary

- Added heuristic evidence-gap output to `extract.sh`.
- Updated the sprint-analysis skill to treat the new evidence-gap section as
  required input.
- Updated the Work Block template with a commit precondition for non-trivial
  Work Blocks.

## Closeout

- Stage: Verification
- Objective: sprint-analysis evidence hardening - complete
- Role: Orchestrator / Control Tower
- Files changed:
  - `.agent/skills/sprint-analysis/SKILL.md`
  - `.agent/skills/sprint-analysis/scripts/extract.sh`
  - `docs/templates/work-block-template.md`
  - `docs/plans/WB-2026-07-08-sprint-analysis-evidence-hardening.md`
- Checks performed:
  - `bash -n .agent/skills/sprint-analysis/scripts/extract.sh` - pass
  - `bash .agent/skills/sprint-analysis/scripts/extract.sh 2026-07-01 2026-07-08` - pass
  - `git diff --check` - pass
  - secret-pattern scan over this WB write-set - no matches
- Review result: inline Control Tower review; no critic subagent used because
  this is a small docs/script hardening change and the Owner approved the
  direction directly after comparing OpenCode, Claude Code, and Codex CLI
  reports.
- Verification result: READY for local docs/script behavior.
- Residual risks:
  - Commit orphan detection is heuristic and intentionally conservative; it
    flags missing explicit WB IDs in commit subjects, not all possible
    same-day semantic matches.
  - Existing dirty runtime-adapter and Codex hook files remain outside this WB.
- Next owner/action: decide whether to include this WB in a separate scoped
  commit after the runtime-adapter WB commit decision.
