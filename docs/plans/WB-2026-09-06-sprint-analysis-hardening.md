---
work_block_id: WB-2026-09-06-sprint-analysis-hardening
specification: docs/specs/WB-2026-09-06-sprint-analysis-hardening.md
specification_revision: "1"
status: complete
base_commit: a0e4ea629fe9e62bffa4f9e5762a225fad74d356
branch: feat/sprint-analysis-hardening-020
---

# Plan

## Stage 0 — Define

Confirm current-main architecture, historical reference SHA, exact write-set,
and Critic approval. Historical files are evidence only.

## Stage 1 — Implementation

1. Add trailer-first parsing and explicit classes to `extract.sh`.
2. Add period-end status snapshot and caveat classification.
3. Align `SKILL.md` workflow, linkage rules, and false-READY guidance.
4. Add deterministic local fixtures, including disposable repositories,
   synced/ahead bare-upstream states, dirty-state counts, same-day heuristic
   isolation, and local identity configuration only.
5. Run the fixture suite from Control Plane CI without adding trigger paths.

## Stage 2 — Review and Verification

Review the frozen diff for precedence, parser portability, historical safety,
and scope. Run shell syntax, fixtures, extractor smoke output, traceability,
release-state, diff, and path-containment checks.

## Risks and controls

| Risk | Control |
|---|---|
| prose mistaken for trailer | `git interpret-trailers --parse` plus exact key/value validation |
| legacy history falsely called breach | explicit `legacy` class and date-aware caveat |
| malformed/multiple values silently selected | explicit unresolved classes |
| dirty/ahead state over-interpreted | status is a caveat only |
| false READY | preserve unavailable/contradictory evidence states |
| current skill/parser drift | shared vocabulary documented and fixture-checked |
| historical implementation copied wholesale | current-main architecture is the implementation source |

## Publication boundary

Owner authorizes scoped implementation, tests, lifecycle evidence, stage,
commit, and non-force push. PR, merge, deploy, framework changes, provider/API
calls, and historical branch mutation are not authorized.
