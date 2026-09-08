# SDD Protocol — AzurSysTech Operating Procedure

This procedure operationalizes the runtime-neutral Agentic SDLC lifecycle in
`azursystech`. It is subordinate to `AGENTS.md` and `governance/`; it does not
grant authority or bypass external security controls.

## State and Authority

Use the lifecycle states in `governance/lifecycle.md`:
`Define -> Execute -> Assure -> Close`, with execution state tracked separately
from assurance verdicts. A failed, unavailable, or unverified check is never a pass.
Drafts, candidates, generated context, requirements-quality reports, tasklists, and
operational memory cannot override higher authority.

## Stage 0 — Define

The Orchestrator records objective, scope/exclusions, authority chain, risk,
side effects, Hard Stops, exact write-set, single-Coder ownership, topology,
capability limitations, acceptance checks, required assurance, and explicit
Owner approvals.

For formal Managed, Assured, and Distributed work, Stage 0 follows `governance/define-quality.md`:

```text
specification draft
  -> requirements clarification
  -> requirements-quality review
  -> architecture / implementation plan
  -> traceable task decomposition + write-set
  -> deterministic traceability validation
  -> read-only spec/plan/task consistency analysis
  -> Critic gate
  -> write gate READY
```

- Repository/discovery-resolvable facts are resolved from evidence instead of asking the Owner.
- Reasonable non-material defaults are recorded as explicit assumptions.
- Independent material questions may be asked in a small bounded batch (<=3); dependent questions are asked sequentially.
- Unresolved blocking ambiguity keeps Define blocked.
- Formal requirement implementation tasks use stable `REQ-*`, `AC-*`, and `TASK-*` references and explicit paths.
- Run `scripts/validate-define-traceability.py` when stable IDs are used. A `BLOCKED` structural result cannot be waived by fluent text.

For Managed work, a read-only Critic challenges this record after the applicable
requirements-quality and consistency checks. `READY` means its challenge found no
unresolved blocker; `BLOCKED` returns to Define. A Critic result does not itself open a write gate.

## Stage 1 — Execute

One write-capable Coder edits only its approved exclusive write-set after the Critic
gate is resolved and the write gate is `READY`.

- Parallel Coders require distinct isolated worktrees or clones; their worker-path intersection must remain empty.
- Inspect Git state first, preserve unrelated work, run scoped checks, and stop for any scope, authority, risk, or acceptance change.
- Freeze each worker handoff at its named revision and report `DONE`, `DONE_WITH_CONCERNS`, `NEEDS_CONTEXT`, or `BLOCKED`.
- When integration is required, the Integration Coder cleanly merges frozen worker revisions and verifies the integrated subject before Stage 2.

## Stage 2 — Assure

Reviewer and Verifier assess the frozen subject read-only:
- **Reviewer** checks correctness, boundaries, maintainability, security, and documentation drift.
- **Verifier** demonstrates acceptance criteria with reproducible evidence; missing evidence is `BLOCKED` or `UNVERIFIED`.
- **Evaluator** (when required) inspects observable output/events against approved rubrics without demanding hidden reasoning or private chain-of-thought.
- **Drift Auditor** checks consistency between specification, code, tests, and documentation.

Requirements-quality review is not Stage 2 implementation assurance: it checks whether the specification was implementable before coding. Stage 2 reviews and verifies the delivered code against the approved specification.

## Stage 3 — Close

Only completed required assurance permits successful closeout. Otherwise use
`reporting-only` closeout and preserve the blocker.

1. Determine closeout mode (`success-closeout` or `reporting-only`).
2. Synchronize derived artifacts with the approved specification and delivered state.
3. Update task status in the tasklist and reset the operational active Work Block
   record to its canonical inactive state. The canonical coordination list includes
   the exact release-state projections `FILE_REGISTRY.yml` and `PROJECT_MAP.md`,
   but no root or directory wildcard. Inactive state permits only declared
   coordination artifacts to be edited, staged, and locally committed; source
   writes and staged source commits remain denied until a successor Work Block
   explicitly opens a branch-bound write gate.
4. Promote durable, reusable rationale and lessons to non-authoritative
   `docs/engineering-memory/`.
5. For an assured candidate, use the operational exact-subject push and
   Owner `MERGE / REVISION / REJECT` report in
   `.agent/workflows/owner-controlled-github-flow.md`, subject to
   `governance/authority.md`.

## Quick-Fix Path

A Quick Fix is allowed only when all are true:
- at most 2 implementation files;
- no behavior, route, API, schema, persistence, security, architecture, runtime, dependency, evaluation, governance, or public contract impact;
- no Hard Stop;
- rollback is trivial;
- targeted deterministic checks are available.

```text
Scope statement -> Implement -> targeted self-review/checks -> sync -> close
```
