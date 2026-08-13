## Critic Implementation Re-check — WB-2026-08-12-showcase-production-multizone

**Date:** 2026-08-13
**Reviewed:** frozen implementation, active Work Block/write-set, Stage-0 plan, and the prior implementation Critic `SUPPLEMENT` report
**Mode:** native independent read-only Critic
**Verdict:** **SUPPLEMENT**

This is advisory critique, not a `READY`/`BLOCKED` gate. The re-check performed
no Docker build/run, Compose/Nginx runtime execution, workflow dispatch, GHCR
publication, VPS/SSH action, or production request.

### Scope Review

The changed implementation paths remain within the active source write-set. The
only additional artifact from this re-check is this permitted report. No route
tree, public demo asset, main-app, PostgreSQL, secret, hook-policy, remote, or
runtime mutation was made.

`git diff --check` is clean. `python3 scripts/test-showcase-multizone.py` passes
and `bash -n deploy.sh` passes. Those are static/source-level checks only.

### Closure of Prior Required Corrections

| Prior required correction | Re-check result | Evidence |
|---|---|---|
| Public-only, exact `/demo` mapping | **Resolved in the workflow runtime path.** | `nginx.proxy.conf` has exact `location = /demo`, prefix `^~ /demo/` and `^~ /demo-assets/`, each preserving the URI with a URI-less `proxy_pass`. `$showcase_upstream_service` maps only public/local hosts to `showcase:3000`; `admin.azursystech.fr` remains `admin:3000`. |
| `next/image` `/demo-assets` namespace | **Resolved in configuration.** | `showcase/next.config.ts` explicitly sets `images.path` to `${assetPrefix}/_next/image`, while generated assets retain `assetPrefix=/demo-assets`. |
| Static-export retirement | **Resolved.** | The former conditional static-export branch is absent; the config has only standalone output and documents that the route handler deliberately retires static export. CI no longer enables the retired mode. |
| Prior Showcase exists versus running | **Resolved in `deploy-vps.yml`.** | The workflow captures `previous-showcase-exists`, `previous-showcase-running`, and image separately, restores an existing prior image, removes Showcase only in the absent branch, and stops it again if it had been stopped. |
| Admin rollback-state independence | **Resolved in the workflow wrapper, but incomplete in direct `deploy.sh`; see Must Address.** | The wrapper restores the admin independently of Showcase existence and explicitly stops admin when its prior recorded state was not running. |
| Exact source-commit resolution | **Resolved.** | Docker Publish checks out the requested ref, resolves `${TARGET_REF}^{commit}`, and refuses unless checkout `HEAD` equals that exact 40-character commit; both mandatory image builds use the single resolved immutable tag. |

### Required Contract Challenge

| # | Dimension | Re-check finding |
|---:|---|---|
| 1 | URI-preserving `/demo` routing | Source-correct: exact and prefix locations precede the main catch-all, and proxying retains the requested URI. |
| 2 | `/demo-assets` `assetPrefix` | Source-correct: generated assets use `/demo-assets`; Nginx gives that namespace Showcase precedence. |
| 3 | No `basePath` | Source-correct: no `basePath` is configured and routes remain below `showcase/app/demo/**`. |
| 4 | Public `/demo` assets | Preserved: `showcase/public/demo/**` is unchanged and `/demo/` is forwarded intact. |
| 5 | `next/image` | Source-correct: the optimiser path is explicitly `/demo-assets/_next/image`, avoiding the main app's default `/_next/image` namespace. Rendered/request proof remains unexecuted. |
| 6 | Standalone Docker packaging | Structurally sound: non-root standalone server with traced server, static assets, and `public` copied. Image build/startup remains unexecuted. |
| 7 | `/demo/health` | Source-correct: handler returns the expected JSON and Docker/Compose/deploy probes use `/demo/health`; public `/health` remains at the app catch-all. Runtime HTTP proof remains unexecuted. |
| 8 | Compose dependency model | Source-correct: Showcase has no DB environment, Postgres dependency, or data volume; `web` waits for app and Showcase health. |
| 9 | Nginx precedence | Correct by source inspection, including forwarding headers and host-zone isolation. Nginx parser/request execution remains unexecuted. |
| 10 | Exact-SHA app/showcase publication | Correct by source inspection: both mandatory publication jobs consume the same resolved `sha-<40-hex>` tag; admin stays opt-in/default false. |
| 11 | First-showcase rollout rollback | Correct in `deploy-vps.yml`: prior absence is explicit, old runtime files are restored, and the newly introduced Showcase container is removed. The direct-script deficiency below means this is not consistently true across both documented deploy entry points. |
| 12 | Subsequent rollback | Correct in `deploy-vps.yml`, including a previously stopped Showcase. Direct `deploy.sh` restores Showcase's stopped state, but has the independent-admin defect below. |
| 13 | `/`, `/fr`, `/health` regression | Source ordering leaves them at the app catch-all; `/health` is not captured by a Showcase location. Actual HTTP regressions are not yet exercised. |
| 14 | Admin regression | Inputs remain optional/default false and workflow rollback now preserves its running state independently. Direct `deploy.sh` has an incomplete rollback-state model. |
| 15 | PostgreSQL isolation | Source-correct: Showcase is PostgreSQL-free and no DB action occurred. |
| 16 | Verification adequacy | Improved source contract coverage now includes exact demo, image namespace, host map intent, and absent/running/stopped Showcase model states. It still does not execute the Nginx config, a rendered `next/image` request, a standalone container, or the actual shell rollback paths. |

### Must Address (blocking quality)

- **Make direct `deploy.sh` preserve admin state independently, or explicitly
  remove/document it as an unsupported rollback entry point.** At
  `deploy.sh:159-165`, the script captures an admin image only when
  `DEPLOY_ADMIN=1`; it never captures whether the pre-existing admin container
  was running. On rollback, `deploy.sh:235-241`/`279-280` starts that previous
  admin image whenever deployment included admin, including when the old admin
  was stopped. It also leaves `${ENV_FILE}.deploy-...bak` unused rather than
  restoring the prior runtime environment (`deploy.sh:178`, `243-252`). This
  contradicts the plan's independent admin-state and previous-runtime-files
  rollback contract for the script's documented direct deployment interface.
  Capture `previous_admin_exists`/`previous_admin_running`, restore or remove
  admin accordingly, and restore the backed-up environment/runtime state; add
  deterministic fixtures which bind those state assertions to the shell logic.

### Should Address (improves assurance)

- Replace the manually modelled routing and rollback functions in
  `scripts/test-showcase-multizone.py` with fixtures that parse/assert the
  relevant Nginx map/location blocks and exercise the actual shell branch
  selections. The current model verifies intended combinations but is only
  loosely coupled to the implementation text.
- In the required Verifier stage, run the production Showcase typecheck/build,
  inspect a rendered image URL, run Nginx syntax plus container-level requests
  for `/demo`, nested `/demo/...`, `/demo-assets/...`, `/`, `/fr`, and
  `/health`, and exercise both rollback branches in an isolated fixture. Mark
  unavailable Docker/runtime proof as blocked or unverified rather than passed.

### Inspection Gaps

- No Next production build or emitted asset manifest was generated by this
  Critic; no `.next/standalone` bundle was inspected.
- Docker, Compose, Nginx, workflow dispatch, GHCR, VPS, and public endpoint
  behavior were intentionally not invoked.
- This report does not replace the required independent Reviewer and Verifier
  stages.
