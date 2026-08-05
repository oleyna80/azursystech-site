---
name: ssot-sync-closeout
description: "Post-stage sync of docs, engineering memory, memory_bank, and tasklist without rewriting history. Classify closeout as success-closeout or reporting-only. Triggers: обнови memory bank, закрыть stage, sync tasklist/context/progress, closeout."
compatibility: opencode
---

# SSOT Sync Closeout

> Adapted from framework `skills/ssot-sync-closeout/SKILL.md` for OpenCode.
> Original remains authoritative; this copy provides OpenCode-compatible tool references.

## Objective

Maintain consistency between:
- `docs/engineering-memory/*`
- `memory_bank/context.md`
- `memory_bank/progress.md`
- `docs/tasklist/*`

## Workflow

1. Verify actual stage completion against evidence.
2. Check acceptance: subagent `DONE` ≠ result acceptance; need scope/AC/checks verdict.
3. Classify closeout: `success-closeout` only when all gates READY; `reporting-only` for BLOCKED/UNVERIFIED.
4. For reporting-only: leave task `blocked`, record corrective action, no completed/release-ready claims.
5. Update `progress.md` with new entry (done + notes + checks).
6. Update `context.md` (current focus + next execution queue + date).
7. Classify reusable knowledge: `promoted`, `operational-only`, or `not-applicable`.
8. If durable and cross-runtime, update `docs/engineering-memory/`.
9. Update `decisions.md` if architecture/runtime decision was made.
10. Update delivery notes in tasklist.
11. Run `rg` on contradictory stale formulations.
12. Verify Git ignore: `git check-ignore -v <paths>`.
13. Verify new status markers: `rg -n` because `git diff` may be empty for ignored files.

## Constraints

- Never rewrite historical entries.
- If checks were not run — state this explicitly.
- `BLOCKED` or `UNVERIFIED` permits diagnostics and reporting-only closeout, not merge/deploy/release readiness.
