# Worktree Cleanup — Live Tasklist

## Coordination

- **Work Block:** `WB-2026-07-17-worktree-cleanup`
- **Owner instruction:** create a Work Block for worktree cleanup, 2026-07-17.
- **Status:** `Stage 1 inventory complete; Owner-approved removal of the two
  untracked skill directories complete. All other groups remain protected
  pending separate Owner decisions.`
- **Purpose:** preserve the current worktree while making each dirty group
  visible and individually routable. This tasklist is not approval to delete,
  stash, stage, commit, push, or alter any listed path.

## Scope guard

| Group | Current state | Required next gate |
|---|---|---|
| `web/src/app/[locale]/_home-data.ts` | modified | read-only diff review and Owner routing |
| `.agents/skills/impeccable/**` | removed | Owner-approved removal completed 2026-07-17 |
| `.agents/skills/source-command-sprint/**` | removed | Owner-approved removal completed 2026-07-17 |
| `docs/plans/WB-2026-07-16-real-estate-demo-opendesign-handoff.md` | untracked | handoff/provenance review |
| `showcase/app/demo/immobilier/**`, `showcase/components/immobilier/**`, `showcase/public/demo/immobilier/**` | untracked | frontend/demo Work Block with source and asset review |

## Routing and hard stops

- **Skills:** checked `git-safety`, `memory-ops`, `critic-review`; used
  `git-safety` scope containment and `memory-ops` planning; `critic-review`
  is unavailable as an active project-local wrapper.
- **No DB action.**
- **Hard Stops:** destructive Git operation, stash, staging, commit, push,
  deploy, credential/config change, and client-facing action. The only
  completed deletion is the two skill directories explicitly approved by the
  Owner on 2026-07-17.
- **No inherited approval:** closed Work Blocks and existing gate records do not
  authorize the current dirty state.

## Next action

Run a read-only inventory for one selected group, report provenance and
dependencies, then request an explicit Owner decision: retain, publish through
a dedicated Work Block, defer, or remove under a separately approved
destructive plan.
