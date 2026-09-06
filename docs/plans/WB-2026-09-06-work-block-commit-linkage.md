# Plan — WB-2026-09-06-work-block-commit-linkage

## Stages

1. Define: freeze refs, inspect current schema-v3 lifecycle and historical
   hook as reference only, complete critic and traceability.
2. Implement: write a fresh structured-state `commit-msg` hook, deterministic
   disposable fixtures, and explicit bootstrap install/check modes. Update CI
   only for relevant hook/bootstrap paths and fixture execution.
3. Review: challenge state authority, branch binding, trailer parsing,
   inactive/frozen behavior, bootstrap side effects, portability, and claims.
4. Verify: run shell, JSON, Git trailer, fixture, bootstrap, CI-path,
   containment, traceability, and release-state checks without mutating the
   real repository hook configuration.
5. Closeout: set terminal lifecycle projections and prepare the authorized
   commit/non-force push handoff. No PR or merge.

## Write set

- `.githooks/commit-msg`
- `.githooks/tests/commit-msg-fixtures.sh`
- `scripts/bootstrap.sh`
- `.github/workflows/control-plane-contracts.yml`
- `.agent/active-work-block.json`, `.agent/critic-gate.md`,
  `.agent/verification-gate.md`, `.codex/write-gate.md`
- `docs/specs/**`, `docs/plans/**`, `docs/tasklist/**`, `docs/reports/**`

Historical files are evidence only and will not be cherry-picked or copied.

## Hard stops

Stop for application/framework/config expansion, real shared Git config
mutation, provider/API calls, deployment, secrets, historical ref mutation,
PR/merge, or destructive cleanup.
