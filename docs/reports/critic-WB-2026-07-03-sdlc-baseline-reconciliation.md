# Critic Report — WB-2026-07-03 SDLC Baseline Reconciliation

## Status

Complete

## Stage

Review

## Objective

Review the SDLC baseline reconciliation Work Block before implementation and
identify governance gaps, scope risks, and missing controls.

## Role

Critic / Docs+Governance Analyst, read-only.

## Scope

- `docs/plans/WB-2026-07-03-sdlc-baseline-reconciliation.md`
- Root governance docs needed for authority checks
- Live git status and donor branch delta context

## Out of Scope

- File edits by the Critic
- Staging, commit, push, branch merge, branch deletion, or destructive commands
- Secrets, provider config, app source, production config, database, deploy, or
  package/dependency changes

## Verdict

`SUPPLEMENT`

Implementation should not start until the plan records the supplement controls
below and the Owner approves an exact implementation write-set.

## Blocking Findings

1. `scripts/bootstrap.sh` was included in the candidate write-set while the Work
   Block was classified as `local-docs` and described implementation as
   docs/control-only. Supplement required: classify bootstrap as
   workflow/runtime script control and keep it under the single approved Scoped
   Coder write-set.
2. Candidate globs such as `.agent/**`, `docs/engineering-memory/**`, and
   `docs/templates/**` are too broad in a dirty tree. Supplement required:
   Stage 1 must convert globs into an exact file-by-file disposition and
   Owner-approved write-set before any implementation edits.
3. Critic gate evidence update was not explicit enough. Supplement required:
   record this verdict and gate status before implementation.

## Non-Blocking Improvements

- Add a pre-implementation dirty-tree snapshot requirement.
- Keep donor branch/workspace read-only unless Owner separately approves
  mutation.
- Defer `.claude/**` unless separately approved.
- Run secret/private scan over every proposed committed file, including skills,
  safe Codex files, scripts, reports, YAML, and TOML.
- Mark app build/browser checks as not applicable because app source is out of
  scope.

## Orchestrator Resolution

The Work Block plan was supplemented to:

- change side-effect class to `local-docs + workflow-script-control`;
- mark Critic Gate as `SUPPLEMENT`;
- require exact file-by-file write-set approval before implementation;
- classify `scripts/bootstrap.sh` as workflow/runtime script control;
- defer `.claude/**`;
- require a pre-implementation dirty-tree and donor delta snapshot;
- scope secret scan to every proposed committed file;
- mark app/browser checks as out of scope unless app source changes.

## Files Changed By This Review Closeout

- `docs/plans/WB-2026-07-03-sdlc-baseline-reconciliation.md`
- `docs/reports/critic-WB-2026-07-03-sdlc-baseline-reconciliation.md`

## Checks

- Critic review: completed with `SUPPLEMENT`.
- File edits: documentation only.
- Implementation: not started.

## Next Action

Proceed to Stage 1 inventory only after Owner approval. Stage 1 output must
produce an exact accept/adapt/reject/defer file list and proposed implementation
write-set. Commit and push remain hard-stopped until separate Owner approval.

## Post-Implementation Critic Pass

### Status

Complete

### Verdict

`SUPPLEMENT`

### Findings and Disposition

1. **Committed Codex write gate left open.** Resolved in the implementation
   pass by returning `.codex/write-gate.md` to committed `BLOCKED` template
   state and adding a short-lived expiry guard to
   `.codex/hooks/stage0_write_gate.py`.
2. **Deferred/local skill and Claude runtime boundary not true for existing
   tracked files.** Partially resolved inside this Work Block by documenting the
   actual state: existing tracked `.claude/**` and
   `.agent/skills/impeccable/**` are legacy tracked runtime payloads pending a
   separate cleanup/curation Work Block. This Work Block does not untrack or
   delete those files.
3. **Agent context/private ignore boundary incomplete.** Resolved for future
   reads/files by adding `.codex/config.toml`, `.codex/agents/**`,
   `.agent/skills/**`, `.claude/**`, and `memory_bank/` to `.agentsignore` and
   `.codexignore`.
4. **Cross-runtime gate state diverged.** Resolved by converting
   `.agent/critic-gate.md` to an explicit committed template/contract instead
   of a live per-Work-Block gate state.
5. **Bootstrap script ownership ambiguous.** Resolved by aligning
   `FILE_REGISTRY.yml` and `.agent/workflows/sdd-protocol.md` with the current
   classification: `scripts/bootstrap.sh` is workflow-layer control owned by
   the orchestrator-approved write-set.
6. **Template vocabulary drift.** Resolved by adding
   `workflow-script-control` and explicit critic verdict values to the Work
   Block template vocabulary.

### Residual Risk

Existing tracked runtime payloads under `.claude/**` and
`.agent/skills/impeccable/**` still require a separate Owner-approved cleanup or
curation Work Block before the repository can claim that all runtime-specific
payloads are private/local by Git history and tracked-file state.
