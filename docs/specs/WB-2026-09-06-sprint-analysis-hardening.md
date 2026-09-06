---
work_block_id: WB-2026-09-06-sprint-analysis-hardening
specification_revision: "1"
status: approved
base_commit: a0e4ea629fe9e62bffa4f9e5762a225fad74d356
subject_branch: feat/sprint-analysis-hardening-020
---

# Sprint-analysis evidence hardening

## Objective

Make current AzurSysTech sprint analysis trailer-first while preserving
backward-compatible historical analysis. The extractor is an evidence layer,
not a commit-enforcement mechanism.

## Requirements

- REQ-001: Every analyzed commit has exactly one explicit linkage class:
  `trailer`, `legacy`, `missing`, `malformed-trailer`, or
  `multiple-valid-trailers`.
- REQ-002: Work-Block trailers are parsed with Git trailer semantics and a
  canonical WB-ID validator; ordinary prose is not a trailer.
- REQ-003: One valid trailer always wins over subject, body, date, or overlap
  heuristics, with conflicts retained as secondary notes.
- REQ-004: Historical WB references without a valid trailer are `legacy`, not
  canonical attribution and not automatically a governance violation.
- REQ-005: Same-day and subject-overlap logic remains secondary and is never
  emitted as canonical attribution.
- REQ-006: Commits with no valid trailer or credible legacy evidence are
  explicitly `missing`.
- REQ-007: Malformed and multiple valid trailers remain distinct findings and
  never select an arbitrary WB.
- REQ-008: Extraction includes a compact period-end repository/worktree status
  snapshot with branch, HEAD, ahead/behind, dirty, staged, unstaged,
  untracked, and ahead/unpushed indicators where available.
- REQ-009: Dirty, untracked, staged, unstaged, or ahead state is an evidence
  completeness caveat, not automatically a governance breach.
- REQ-010: Incomplete or contradictory evidence cannot silently yield `READY`;
  the analysis must preserve `UNVERIFIED`, `BLOCKED`, or `DEGRADED` vocabulary.
- REQ-011: The sprint-analysis skill and extractor use the same linkage classes,
  precedence rules, and caveat semantics.
- REQ-012: Commit output is stable and parseable with SHA, date, subject,
  class, canonical ID when present, legacy/heuristic candidates, and notes.

## Acceptance criteria

- AC-001 [req=REQ-001,REQ-002]: Exactly one canonical trailer is classified as `trailer`.
- AC-002 [req=REQ-003]: Explicit valid trailer wins over conflicting subject/date heuristics.
- AC-003 [req=REQ-004]: Historical WB references without trailer are `legacy`.
- AC-004 [req=REQ-006]: Unattributed commits are `missing`.
- AC-005 [req=REQ-007]: Malformed and multiple trailers are distinct deterministic classes.
- AC-006 [req=REQ-008]: Period-end repository snapshot is emitted.
- AC-007 [req=REQ-009]: Dirty/ahead state is a caveat, not an automatic breach.
- AC-008 [req=REQ-010]: Incomplete evidence cannot silently produce `READY`.
- AC-009 [req=REQ-011]: Skill documentation and extractor implementation agree.
- AC-010 [req=REQ-012]: Output fields are stable for downstream analysis.
- AC-011 [req=REQ-001,REQ-003,REQ-004,REQ-005,REQ-006,REQ-007,REQ-008,REQ-009]: Deterministic fixtures cover linkage and repository-state cases.
- AC-012 [req=REQ-001,REQ-002,REQ-003,REQ-004,REQ-005,REQ-006,REQ-007,REQ-008,REQ-009,REQ-010,REQ-011,REQ-012]: Historical commits remain analyzable without retroactive trailer claims.
- AC-013 [req=REQ-012]: No application or framework paths are modified; lifecycle, traceability, and release-state validations pass.

## Scope

- `.agent/skills/sprint-analysis/SKILL.md`
- `.agent/skills/sprint-analysis/scripts/extract.sh`
- `.agent/skills/sprint-analysis/tests/**`
- `docs/specs/`, `docs/plans/`, `docs/tasklist/`, and WB reports
- lifecycle/control-plane files required to open and close this WB

## Out of scope

Application paths, video-generator contract, `.githooks/commit-msg`, bootstrap
activation, provider/API/media implementation, deployment, framework upstream,
external integrations, and historical Git refs.
