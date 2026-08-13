## Critic Implementation Re-check R3 — WB-2026-08-12-showcase-production-multizone

**Date:** 2026-08-13
**Reviewed:** final frozen implementation, active Work Block/write-set, Stage-0 plan, R2 Critic report, and corrective diff
**Mode:** native independent read-only Critic
**Verdict:** **SUPPLEMENT**

This is advisory critique, not a `READY`/`BLOCKED` gate. No source/runtime
mutation, Docker/Compose execution, workflow dispatch, registry operation,
VPS/SSH connection, or public request was performed.

### Scope Review

The implementation and this report remain within the active Work Block's
source/coordination write-sets. `git diff --check` is clean. The active state
still declares schema v3, `github_capability`, the expected Work Block ID, and
the explicit approved source write-set. No PostgreSQL, secret, hook, canonical
checkout, remote, or live-runtime action was inspected or changed.

### Closure of R2 Required Corrections

| R2 correction | R3 result | Evidence |
|---|---|---|
| Capture Admin existence/running state | Resolved in both entry points. | `deploy.sh` captures `previous_admin_exists`, image, and `previous_admin_running`; `deploy-vps.yml` writes and validates equivalent backup state files. |
| Restore complete direct-script environment | Resolved. | `deploy.sh` saves `${ENV_FILE}.deploy-${timestamp}.bak` and copies it back before rollback recreation. |
| Restore runtime files in workflow rollback | Resolved. | The workflow restores Compose, deploy script, Nginx config, and `.env` before invoking the backup rollback runner. |
| Independent Admin absent/stopped behavior | Resolved in workflow wrapper. | It removes an absent prior Admin and stops/verifies a prior stopped Admin separately from Showcase state. |

### Required Contract Challenge

| # | Dimension | R3 assessment |
|---:|---|---|
| 1 | URI-preserving `/demo` routing | Source-correct: exact `/demo`, `^~ /demo/`, and URI-less `proxy_pass` preserve the request URI. |
| 2 | `/demo-assets` `assetPrefix` | Source-correct: generated assets use `/demo-assets`; Nginx maps that namespace to Showcase on public/local hosts. |
| 3 | Absence of `basePath` | Source-correct: no `basePath` is configured; routes remain `showcase/app/demo/**`. |
| 4 | Public `/demo` assets | Preserved by the unchanged `showcase/public/demo/**` tree and URI-preserving `/demo/` proxy route. |
| 5 | `next/image` | Source-correct: `images.path` is `${assetPrefix}/_next/image`. Rendered image-request proof remains unavailable. |
| 6 | Standalone Docker packaging | Structurally sound: standalone server, static output, public files, non-root user, and `/demo/health` healthcheck are present. Docker build/start was not run. |
| 7 | `/demo/health` behavior | Source-correct: route handler and internal checks use `/demo/health`; public `/health` stays on the app catch-all. Runtime HTTP proof was not run. |
| 8 | Compose dependency model | Showcase has neither PostgreSQL dependency nor DB configuration; web depends on app and Showcase health. That dependency creates the direct rollback ordering defect below. |
| 9 | Nginx precedence | Source-correct for public/local host mapping, forwarding headers, and fallback to app. Nginx parse/request execution remains unverified. |
| 10 | Exact-SHA publication | Source-correct: publication resolves one peeled commit, requires checkout `HEAD` equality, and tags mandatory app/showcase builds with one `sha-<40-hex>` tag. |
| 11 | First Showcase rollout rollback | Workflow path is correct because it restores the pre-Showcase Compose files before rollback. Direct `deploy.sh` is not correct when used with the current Compose file; see Must Address. |
| 12 | Subsequent rollback | Workflow explicitly restores prior Showcase image and stopped state, plus independent Admin state. Direct `deploy.sh` can re-start a prior stopped Showcase after it stops it; see Must Address. |
| 13 | `/`, `/fr`, `/health` regression risk | Source ordering leaves them at the existing app catch-all. Actual HTTP regression checks have not run. |
| 14 | Admin regression risk | Default/optional Admin behavior and rollback state independence are preserved by source inspection. Runtime proof remains unavailable. |
| 15 | PostgreSQL isolation | Source-correct: Showcase has no database environment, dependency, or volume; no DB action occurred. |
| 16 | Verification adequacy | The source test passes, but its route and rollback functions are manually modelled and do not bind the relevant operational state transitions to actual `deploy.sh`/Compose behavior. |

### Must Address (blocking quality)

- **Fix or explicitly retire the direct `deploy.sh` rollback entry point for a
  Compose file that contains Showcase.** In `deploy.sh:278-288`, the script
  removes an absent prior Showcase (or stops a prior stopped one) and then runs
  `docker compose ... up ... --force-recreate web` without `--no-deps`.
  `web` has a health-gated `depends_on: showcase` in
  `docker-compose.vps.yml:159-163`; Compose can therefore create/start
  Showcase again while bringing up web. For a first Showcase rollout, the
  exported new `SHOWCASE_IMAGE` remains in the shell, so this can recreate the
  very Showcase container that rollback just removed. For a previously stopped
  Showcase, the final `up web` can re-start it after the earlier `stop`. This
  violates both rollback branches in the plan whenever direct `deploy.sh` is
  used with the current Compose topology. Reorder restoration or use an
  appropriately scoped `--no-deps` web recreation, then assert absent/stopped
  final state before health success.

- **Replace the rollback state model with an execution-bound fixture.**
  `scripts/test-showcase-multizone.py:31-42` hard-codes desired results; it
  does not invoke or parse the direct script's actual state paths/order.
  Its string checks do not detect the dependency-driven re-creation above.
  Add a hermetic fake-Docker/Compose fixture (or equivalent shell branch test)
  that starts from absent, running, and stopped Showcase/Admin states, records
  commands/state transitions, and proves: first rollout ends with no Showcase;
  stopped Showcase/Admin end stopped; required health checks occur only for
  prior running services; and `.env`/workflow backup paths are restored.

### Should Address (improves assurance)

- Add a final state assertion after workflow removal of an absent prior
  Showcase/Admin, not only best-effort `docker rm ... || true`, so a runtime
  failure cannot be reported as a restored absence.
- In the required Verifier stage, execute the Showcase typecheck/build, inspect
  emitted generated/image URLs, run Nginx syntax and container-level routing
  requests for `/demo`, nested demo, `/demo-assets`, `/`, `/fr`, and `/health`,
  and exercise both rollback branches in an isolated Docker fixture.

### Inspection Gaps

- Docker build/run, Compose behavior, Nginx parsing, real Next emitted assets,
  workflow execution, GHCR, VPS, and public endpoint behavior were intentionally
  not available to this Critic.
- `python3 scripts/test-showcase-multizone.py` passed and `bash -n deploy.sh`
  passed; both are static checks and do not close the direct rollback defect.
- This report does not replace the required Reviewer and Verifier gates.
