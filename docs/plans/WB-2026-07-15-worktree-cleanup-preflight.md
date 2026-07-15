# WB-2026-07-15-worktree-cleanup-preflight

## Meta and lifecycle

- **Owner evidence:** Owner instructed “оформляй”, 2026-07-15.
- **Execution mode:** staged approval.
- **Side-effect class / DB mode / tier:** local-docs coordination / none /
  standard planning evidence.
- **State:** Stage 0 completed after the native Critic `SUPPLEMENT` below;
  write gate READY only for this exact coordination write-set. Verification is
  not applicable to planning artifacts.

## Objective and scope

Create one live tasklist, three sequential publication plans, and a process
incident record. It must not treat old evidence as approval of the current diff.

### Exact Write-Set

- `docs/tasklist/WB-2026-07-15-worktree-cleanup.tasklist.md`
- `docs/plans/WB-2026-07-15-worktree-cleanup-preflight.md`
- `docs/plans/WB-2026-07-15-cleanup-verifier-isolation.md`
- `docs/plans/WB-2026-07-15-cleanup-design-routing.md`
- `docs/plans/WB-2026-07-15-cleanup-showcase-port.md`
- `docs/reports/WB-2026-07-15-worktree-cleanup-preflight-critic.md`
- `.agent/critic-gate.md`
- `.codex/write-gate.md`
- `memory_bank/orchestrator-log.md`
- `memory_bank/review-log.md`

### Out of scope

Source/hook changes, staging, commit, push, deletion, `.agents/**` curation,
DB, deploy, credentials, and runtime configuration.

## Acceptance, risk, and routing

- **Acceptance:** all dirty groups have an exact child write-set and gate;
  the incident is logged; no unrelated path changes.
- **Risk / stop:** this is not critic approval. If the critic requests a
  correction, update only these Stage 0 artifacts and re-review.
- **Topology:** Subagent-Required: read-only Critic plus docs/process analysts.
- **Skills:** checked=git-safety,memory-ops,gate-templates;
  matched=gate-templates; used=AGENTS.md/SDD/template; skipped=git-safety no
  commit,memory-ops no project SKILL.md.
- **Commit / rollback:** no commit is approved; targeted revert of these Stage
  0 artifacts requires a later explicit Owner decision.

## Critic response

The native Critic returned `SUPPLEMENT` in
`docs/reports/WB-2026-07-15-worktree-cleanup-preflight-critic.md`. The Control
Tower adopted it by correcting the topology vocabulary, publishing the report,
expanding the Codex gate's approved scope to the full ten-path write-set, and
separating each child WB's payload write-set from its future activation evidence.

## Commit-Closeout activation

- **Owner evidence:** explicit staging and commit approval, 2026-07-15; push
  is not approved.
- **Work Block / side effect:** `WB-2026-07-15-cleanup-commit-closeout` /
  local staging and four atomic commits only; no DB action.
- **Skills routing:** checked=git-safety,gate-templates,memory-ops;
  matched=git-safety; used=git-safety scoped-commit protocol;
  skipped=gate-templates no matching project SKILL.md,memory-ops ignored logs
  cannot be staged.
- **Topology:** Subagent-Required. A native read-only Commit-Closeout Critic
  returned `APPROVE`; exactly one Scoped Coder may stage and commit the four
  literal packets. No parallel writer is allowed.
- **Write gate:** READY. The exact 29-path set is in `.agent/critic-gate.md`;
  packet definitions, checks, and prohibited paths are in the fresh Critic
  supplement.
