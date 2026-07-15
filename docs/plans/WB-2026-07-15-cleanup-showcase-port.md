# WB-2026-07-15-cleanup-showcase-port

**Live tasklist:** `docs/tasklist/WB-2026-07-15-worktree-cleanup.tasklist.md`

## Stage 0

- **Mode / class / DB / tier:** staged approval / production-code write / none
  / standard.
- **State:** verification READY. The formal readonly root accepted the frozen
  payload, and an Owner-authorized localhost/browser follow-up confirmed the
  `3002` navigation at desktop and 375px. Write Gate covers only the exact
  scope below; staging, commit, push, and deletion remain unauthorized.
- **Baseline:** both fallback-origin diffs are pre-existing and atomic.

## Objective and exact write-set

Verify and, only if correct, publish the synchronized development fallback
origin change from showcase port `3007` to `3002`.

- `web/src/app/[locale]/_home-data.ts`
- `web/src/lib/portfolio-data.ts`

### Future activation and lifecycle evidence write-set

- `.agent/critic-gate.md`
- `.agent/verification-gate.md`
- `.codex/write-gate.md`
- `docs/tasklist/WB-2026-07-15-worktree-cleanup.tasklist.md`
- `docs/plans/WB-2026-07-15-cleanup-showcase-port.md`
- `docs/reports/WB-2026-07-15-cleanup-showcase-port-critic.md`
- `docs/reports/WB-2026-07-15-cleanup-showcase-port-verification.md`
- `memory_bank/orchestrator-log.md`
- `memory_bank/review-log.md`

## Boundaries and acceptance

- **Out:** new dependencies, routes, unrelated web changes, `.agents/**`,
  hooks, env/config changes, staging/commit/push, deletion, DB, deploy,
  credentials, and client actions.
- **Acceptance:** fresh Critic approves these exact paths; typecheck passes;
  when `NEXT_PUBLIC_SHOWCASE_BASE_URL` is unset, French and Russian home and
  portfolio links target `http://localhost:3002`; an explicit override still
  wins.
- **Checks:** `cd web && npm run check:types`; run web/showcase; browser smoke
  desktop and 375px; request `/demo/plomberie`; require no new server errors.
  Expand the test write-set only if reproducible smoke cannot prove the port.
- **Hard Stops:** commit/push deferred.

## Routing and recovery

- **Design:** no design brief required; visual QA is required because links are
  user-facing.
- **Topology:** Subagent-Required: native Critic, one Scoped Coder only for an
  approved correction, and read-only Verifier for browser smoke.
- **Skill relevance:** always relevant: git-safety and current gate templates;
  relevant: webapp-testing for browser smoke and playwright for terminal browser
  automation; not relevant: design-direction, impeccable, security-pass, and
  all other skill categories because this is a two-line fallback-origin
  verification, not a design or security change.
- **Skills:** checked=git-safety,gate-templates,webapp-testing,playwright;
  matched=playwright; used=playwright CLI browser-smoke workflow;
  skipped=git-safety no commit,gate-templates no matching project SKILL.md,
  webapp-testing skill-file-unavailable.
- **Isolation:** native Critic and native browser Verifier are advisory;
  formal closeout requires an independent-readonly-root review of the frozen
  payload and evidence.
- **Recovery:** if `3007` proves intentional, retain the diff and mark this WB
  blocked; do not discard it without Owner approval.
