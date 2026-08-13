## Critic Implementation Re-check R4 — WB-2026-08-12-showcase-production-multizone

**Date:** 2026-08-13
**Reviewed:** final frozen Work Block diff, active write-set, `deploy.sh`,
`scripts/test-showcase-multizone.py`, and R3 Critic finding
**Mode:** native independent read-only Critic
**Verdict:** **APPROVE**

This is advisory critique, not a `READY`/`BLOCKED` gate. No source/runtime
mutation, Docker/Compose execution, workflow dispatch, registry operation,
VPS/SSH connection, or public request was performed.

### Scope Review

The implementation paths remain inside the active Work Block source write-set;
this R4 report is inside the permitted coordination write-set. The active state
continues to declare schema v3, `github_capability`, the intended Work Block,
and an explicit source write-set. No PostgreSQL, secret, hook, canonical
checkout, remote, or live-runtime action was changed or invoked.

`git diff --check` is clean. `python3 scripts/test-showcase-multizone.py` and
`bash -n deploy.sh` pass. These are deterministic source/syntax checks, not
Docker or production-runtime evidence.

### R3 Required Correction

**Resolved.** `deploy.sh` now explicitly manages Showcase before recreating
`web`, then uses:

```text
docker compose -f "${COMPOSE_FILE}" up -d --no-build --no-deps --force-recreate web
```

in both normal deployment and rollback. On rollback, an absent prior Showcase
is removed, while a prior stopped Showcase is stopped, before the `--no-deps`
web command. This prevents Compose from traversing `web.depends_on.showcase`
and recreating/restarting the intentionally absent or stopped service.

The deterministic test now binds this invariant to the actual `deploy.sh` text:
it locates the final rollback `web` command, requires `--no-deps`, and requires
both Showcase removal and Showcase stop commands to appear before it. This is a
meaningful source-level coupling rather than the former wholly independent
rollback model.

### Required Contract Revalidation

| # | Dimension | R4 assessment |
|---:|---|---|
| 1 | URI-preserving `/demo` routing | Correct by source: exact `/demo`, `^~ /demo/`, and URI-less `proxy_pass` preserve the request URI. |
| 2 | `/demo-assets` `assetPrefix` | Correct by source: Showcase generated assets use `/demo-assets`, which Nginx routes to Showcase on public/local hosts. |
| 3 | No `basePath` | Correct by source: no `basePath`; app routes remain under `showcase/app/demo/**`. |
| 4 | Public `/demo` assets | Preserved: public `/demo/**` remains separate from Next-generated assets and is proxied intact. |
| 5 | `next/image` | Correct by source: optimiser is explicitly `${assetPrefix}/_next/image`. A rendered image request remains unexecuted. |
| 6 | Standalone packaging | Structurally correct: standalone server, static/public copies, non-root runtime, and `/demo/health` healthcheck. Docker build/start remains unexecuted. |
| 7 | `/demo/health` | Correct by source: Showcase probes target `/demo/health`; public `/health` remains on the main-app fall-through. |
| 8 | Compose dependencies | Showcase is PostgreSQL-free; `web` depends on app/Showcase health. Explicit service management plus `--no-deps` now prevents that dependency from violating direct rollback state. |
| 9 | Nginx precedence | Correct by source: exact/prefix Showcase locations precede app catch-all and preserve forwarding headers; Admin remains isolated. |
| 10 | Exact-SHA publication | Correct by source: one peeled, checked-out commit produces mandatory app and Showcase `sha-<40-hex>` tags. |
| 11 | First Showcase rollout rollback | Correct by source in direct and workflow paths: first rollout removes Showcase before no-dependency web recreation; workflow restores prior runtime files first. |
| 12 | Subsequent rollback | Correct by source: previous Showcase image/state and independently recorded Admin existence/running state are restored; stopped services are not made health requirements. |
| 13 | `/`, `/fr`, `/health` regression | Correct by source ordering: they retain app catch-all ownership. Runtime requests remain unexecuted. |
| 14 | Admin regression | Correct by source: optional/default-false publication/deployment and independent absent/stopped rollback state are retained. |
| 15 | PostgreSQL isolation | Correct by source: Showcase has no DB environment, dependency, or volume; no DB operation occurred. |
| 16 | Verification adequacy | Adequate deterministic source coverage for this frozen correction: the test directly asserts the rollback command/order and passed. Runtime Docker/Nginx/Next proof remains a Verifier obligation. |

### Should Address (Verifier evidence)

- Use an isolated Docker fixture, when tooling is available, to execute absent,
  running, and stopped Showcase/Admin rollback states and observe final
  containers/health requests. The new direct binding gives good static
  assurance but cannot itself prove Compose implementation behavior.
- Run Showcase production typecheck/build, Nginx syntax, and container-level
  requests for `/demo`, nested `/demo/...`, `/demo-assets/...`, `/`, `/fr`, and
  `/health`; inspect a rendered `next/image` URL.

### Inspection Gaps

- Docker build/run, Compose behavior, Nginx parsing, emitted Next assets,
  workflow execution, GHCR, VPS, and public endpoint behavior were intentionally
  unavailable to this Critic.
- This approval is source-level and does not replace the required independent
  Reviewer and Verifier stages.
