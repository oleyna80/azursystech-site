# Worktree Cleanup Publication — Live Tasklist

## Coordination

- **Coordinator ID:** `WB-2026-07-15-worktree-cleanup`
- **Owner approval:** Owner instructed “оформляй” on 2026-07-15 after a
  read-only Critic verdict `BLOCKED`, then explicitly approved staging and
  commit on 2026-07-15. Push remains unapproved.
- **Purpose:** publish or explicitly defer pre-existing dirty changes in
  atomic groups. This is not approval to stage, commit, or delete anything.

## Stage 0 Routing Preflight

`PREFLIGHT: Standard SDLC | local-docs coordination only | no DB | no HS action | Skills: checked=git-safety,memory-ops,gate-templates; matched=gate-templates; used=AGENTS.md,SDD,work-block template; skipped=git-safety no commit,memory-ops no project SKILL.md | READY for Stage 0 artifacts only`

- **Topology:** Subagent-Required — 14+ dirty paths, control/security hooks,
  production web source, and independent verification requirements. Read-only
  Critic, Docs Analyst, and Process Analyst dispatched. One Scoped Coder only
  within a later individually approved publication WB.
- **Hard Stops:** commit/push and destructive cleanup are deferred. DB, deploy,
  credentials, live data, and client-facing actions are out of scope.
- **Incident:** `memory_bank/orchestrator-log.md` contains the 2026-07-15
  `incident: process` follow-up for the next sprint analysis.

## Live Work Block Status

| Work Block | Scope | Status | Required next gate |
|---|---|---|---|
| `WB-2026-07-15-cleanup-verifier-isolation` | hook/fixture diffs and historical evidence | verification READY | separate Owner approval to stage/commit, or route next child WB |
| `WB-2026-07-15-cleanup-design-routing` | residual design-routing pilot | verification READY | separate Owner approval to stage/commit, or route next child WB |
| `WB-2026-07-15-cleanup-showcase-port` | two web fallback-origin diffs | verification READY | formal readonly root and Owner-authorized localhost/browser smoke READY; separate Owner approval still required to stage/commit |
| `.agents` curation | `impeccable/**`, `source-command-sprint/**` | blocked/deferred | separate Owner decision and skill-curation WB |

## Scope Guard

- The current dirty tree is pre-existing; every child WB may touch only its
  declared write-set.
- No child may stage, commit, push, or delete without a fresh Critic Report,
  verification evidence, and separate Owner approval for the side effect.
- `.agents/skills/impeccable/**` and `.agents/skills/source-command-sprint/**`
  remain untracked and excluded from all child write-sets.

## Commit-Closeout activation

- **Work Block:** `WB-2026-07-15-cleanup-commit-closeout`
- **Side effect:** Owner-approved local staging and four commits only; no DB,
  deploy, credentials, deletion, release, or push.
- **Skills:** checked=git-safety,gate-templates,memory-ops;
  matched=git-safety; used=git-safety scoped-commit protocol;
  skipped=gate-templates no matching project SKILL.md,memory-ops ignored logs
  cannot be staged.
- **Topology:** native read-only Commit-Closeout Critic `APPROVE`, followed by
  exactly one Scoped Coder for the index/commit operations.
- **Write gate:** READY in `.agent/critic-gate.md` and `.codex/write-gate.md`.
  The four literal packets and required checks are recorded in the fresh
  Critic supplement.

## Next Gate

Execute the four Owner-authorized atomic commits, retaining only the explicitly
excluded `showcase/next-env.d.ts` and `.agents/**` paths afterward. Push stays
unapproved.
