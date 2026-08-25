# Review — WB-2026-08-25-worktree-ssot-binding

## Verdict

`READY`

## Reviewed subject

- Base: `5d3f3115d14fa715c7e06839aac092da5e4a8819`
- Frozen implementation head: `55b9c8f1440494a29e7d3aea291b9bbc8f270b7f`
- Branch: `fix/worktree-ssot-binding`
- PR: `#18`
- Isolation: `same-session-degraded`; deterministic behavior is independently exercised by GitHub Actions.

## Findings

No blocking or material correctness finding remains.

The implementation binds normal source and coordination writes to the active gate's durable `subject_branch`, derives runtime root/branch/HEAD from the hook event `cwd`, rejects missing branch binding and detached/mismatched Git state, and leaves only `.agent/active-work-block.json` directly repairable when binding state is stale or invalid.

Lifecycle `open` records the current attached non-default branch and refuses source opening on the repository default branch or detached HEAD. No absolute worktree path is persisted.

Both Codex and Claude hooks emit the required runtime diagnostic context on binding/scope denial and explain that command-local `cd` does not rebind an already-started agent session.

The first CI cycle exposed a real Claude hidden-path normalization defect: `.lstrip("./")` could strip the leading dot from `.agent/...`, preventing the intended active-gate repair exception. The candidate replaces that behavior with exact `./` prefix removal and carries a regression fixture. The corrected control-plane suite is green.

## Scope review

Changed implementation surfaces are limited to the approved control-plane/default-state/lifecycle/hooks/tests/workflow documentation plus Work Block coordination artifacts. No application, website, SEO, content, database, deployment, credential, live-infrastructure, or client-facing behavior is changed.

## Residual risk

The mechanism is deliberately cooperative, not a global lease/lock. Operators still must start each write-capable agent session from the intended worktree. The new branch binding turns a wrong-session `cwd` into an explicit deny/diagnostic instead of silently using another Work Block's authority.
