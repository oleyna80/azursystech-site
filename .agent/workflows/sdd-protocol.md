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

For non-trivial `Managed` or `Assured` work, Stage 0/1 admission also records
the runtime capability probe and a `native-separate-context-required` topology
binding. When native capability is `available`, the Critic admission binding
and the later Reviewer/Verifier bindings must carry distinct native execution
and context identifiers. `unknown`, `conditional`, `unavailable`, and
`launch_failed` capability states are fail-closed for promotion; they may be
reported explicitly as `DEGRADED` or `BLOCKED`, but may not be represented by
main-thread substitution.

## Stage 1 — Execute

One write-capable Coder edits only its approved exclusive write-set after the Critic
gate is resolved and the write gate is `READY`.

- Parallel Coders require distinct isolated worktrees or clones; their worker-path intersection must remain empty.
- Inspect Git state first, preserve unrelated work, run scoped checks, and stop for any scope, authority, risk, or acceptance change.
- Freeze each worker handoff at its named revision and report `DONE`, `DONE_WITH_CONCERNS`, `NEEDS_CONTEXT`, or `BLOCKED`.
- Each freeze records a new `frozen_revision` content identity over the
  approved candidate write-set; Git HEAD remains only the base anchor until a
  candidate commit is materialized. Freeze resets candidate-specific Reviewer
  and Verifier state. Critic admission evidence must match `base_commit`;
  Reviewer and Verifier evidence must match the current `frozen_revision`.
- Native role-context separation and security-isolation tier are independent:
  the topology validator proves the former, while the verification hook only
  applies stronger isolation requirements where sensitive domains require it.
- When integration is required, the Integration Coder cleanly merges frozen worker revisions and verifies the integrated subject before Stage 2.

## Stage 2 — Assure

Reviewer and Verifier assess the frozen subject read-only:
- **Reviewer** checks correctness, boundaries, maintainability, security, and documentation drift.
- **Verifier** demonstrates acceptance criteria with reproducible evidence; missing evidence is `BLOCKED` or `UNVERIFIED`.
- **Evaluator** (when required) inspects observable output/events against approved rubrics without demanding hidden reasoning or private chain-of-thought.
- **Drift Auditor** checks consistency between specification, code, tests, and documentation.

Use `prepare-reviewer` and `finalize-reviewer` to bind a separate Reviewer
execution, context, report, and verdict to the current frozen candidate.
Verifier dispatch follows Reviewer `READY` for that same candidate; use
`prepare-verifier` and `finalize-verifier` with a distinct execution and
context. `CHANGES_REQUIRED` or `BLOCKED` reopens source work, invalidates the
old candidate assurance, and requires a new freeze after correction. Applicable
native topology requirements continue to govern non-trivial higher profiles.
The source write gate stays `BLOCKED` after a successful freeze; exact
subject-branch publication uses its own predicate under `governance/authority.md`.

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
5. Record the required Process Feedback closeout result, including an explicit
   `CLEAR`/`FRICTION_OBSERVED` state and evidence for every dimension. Use
   `NONE — checked` only when all dimensions are clear; observed friction must
   link evidence-backed observations in the canonical registry. Process
   Feedback remains advisory and cannot grant systemic change authority.
6. When closeout is used, follow its own terminal rules. An assured frozen
   candidate may instead be pushed to the exact subject branch after Stage 2,
   before GitHub architecture review or legacy closeout, subject to
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
