# WB-2026-07-17-worktree-cleanup

## Meta and lifecycle

- **Owner evidence:** Owner instructed “создай ВБ для чистки рабочего дерева”,
  2026-07-17.
- **Execution mode:** staged approval; this artifact opens Stage 0 only.
- **Side-effect class / DB mode / tier:** local docs/workflow write / none /
  lite for this planning artifact. Any later cleanup action is reclassified
  before execution.
- **State:** `Stage 0 — ready for read-only inventory`. No cleanup mutation is
  authorized by this plan.

## Objective and scope

Create an evidence-backed decision path for the current dirty worktree without
losing or modifying user work. First classify each group as retain, publish in
a dedicated Work Block, defer, or remove. Removal, staging, and commit require
their own explicit Owner approval after the classification evidence is ready.

### Current protected input inventory

| Group | Paths | Initial classification |
|---|---|---|
| Web change | `web/src/app/[locale]/_home-data.ts` | owner work; inspect and route separately |
| Codex skill adapters | `.agents/skills/impeccable/**`, `.agents/skills/source-command-sprint/**` | deferred pending skill-curation decision |
| Open Design handoff | `docs/plans/WB-2026-07-16-real-estate-demo-opendesign-handoff.md` | retain; inspect as handoff evidence |
| Real-estate demo source | `showcase/app/demo/immobilier/**`, `showcase/components/immobilier/**` | inspect as one frontend delivery candidate |
| Real-estate demo assets | `showcase/public/demo/immobilier/**` | inspect only together with the demo source |

### Exact write-set for this Stage 0 artifact

- `docs/plans/WB-2026-07-17-worktree-cleanup.md`
- `docs/tasklist/WB-2026-07-17-worktree-cleanup.tasklist.md`

### Out of scope

- Editing, staging, committing, pushing, deleting, moving, or stashing any
  protected input path.
- Changes to application source, runtime/config, agent skills, gates, hooks,
  dependencies, database, deploy, credentials, or external providers.
- Reusing the closed `WB-2026-07-15-worktree-cleanup` approval as authority for
  this new worktree state.

## Stage 0 routing preflight

`PREFLIGHT: CTO | local docs/workflow write | no DB | no Hard Stop action | Skills: checked=git-safety,memory-ops,critic-review; matched=git-safety,memory-ops; used=git-safety scope containment,memory-ops planning; skipped=critic-review skill-file-unavailable | READY for this two-file Stage 0 artifact only`

- **Topology:** not required. This write creates two coordination artifacts;
  it does not inspect payload content or mutate the dirty worktree. A later
  frontend, skill-curation, or destructive-cleanup stage is reclassified
  independently and may require read-only specialists and one Scoped Coder.
- **Codex Critic:** skipped for this planning-only artifact; no mandatory
  trigger applies. A Stage 0.5 critic review is required before any later
  non-trivial cleanup implementation.
- **Hard Stops:** destructive Git operations, deletion, stash, staging,
  commit, push, DB action, deploy, credentials, and client-facing actions.
- **Write gate:** READY only for the two exact documentation paths above.

## Acceptance criteria

1. The current dirty groups are recorded without changing them.
2. Each later action has a named decision gate and no inherited approval.
3. The live tasklist exposes the next read-only inventory step.
4. This opening Work Block does not stage, commit, delete, stash, or modify a
   protected input path.

## Planned stages

| Stage | Owner / role | Action | Exit condition |
|---|---|---|---|
| 0 | Orchestrator | Record inventory and routing boundaries | this plan and tasklist exist |
| 1 | Reviewer / specialist as required | Read-only diff and provenance inventory per group | classification report with no edits |
| 2 | Owner | Select retain, dedicated publication WB, defer, or explicitly approved removal per group | explicit decision recorded |
| 3 | Scoped Coder, if approved | Execute one selected group within a new exact write-set | targeted verification evidence |
| 4 | Verifier | Verify only the approved group | `READY`, `BLOCKED`, or `UNVERIFIED` verdict |

## Rollback and recovery

The only changes made while opening this Work Block are the two coordination
documents. If this plan is not wanted, leave the protected inputs untouched and
remove or revert these documents only after Owner approval. Do not use a broad
worktree-cleaning command as recovery.

## Execution log

| Date | Stage | Action / decision | Evidence | Status |
|---|---|---|---|---|
| 2026-07-17 | 0 | Recorded protected dirty groups and hard stops | `git status --short --branch`, `git diff --name-status`, untracked-path inventory | complete |

## Closeout and retrospective

- **Final result:** pending; no cleanup action has run.
- **Closeout classification:** reporting-only until a later selected group is
  verified.
- **Verification evidence:** documentation scope and diff hygiene only.
- **WB/commit linkage:** not committed; commit remains separately unauthorized.
- **Residual risks:** the protected inputs may contain unrelated or incomplete
  work; do not infer ownership or discardability from untracked status.
- **Engineering memory classification:** not applicable at opening.
