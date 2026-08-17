# WB-2026-08-12 — Showcase Production Multizone

## Metadata

- **Work Block ID:** `WB-2026-08-12-showcase-production-multizone`
- **Date:** 2026-08-13
- **Owner approval:** explicit resumed Work Block instruction in this session
- **Role / mode:** Orchestrator, staged Agentic SDLC
- **Governance profile:** Managed
- **Current stage:** Review (Stage 2)
- **Write gate:** `READY`; source implementation is frozen pending Reviewer and Verifier assurance
- **Verification tier:** Full
- **Evaluation:** not required; the requested result is deterministic infrastructure and routing behavior, not agent-generated runtime output.
- **Plan revision:** SHA-256 content revision recorded at source-gate opening in `.agent/active-work-block.json`

## Objective and expected result

Deploy the existing `showcase/app/demo/**` Next application as a separate, PostgreSQL-free `showcase:3000` service while preserving public demo URIs. Nginx must send `/demo/*` and `/demo-assets/*` to the showcase service and all other main-host paths to the existing `app:3000` service.

The completed source change must bind both required images to one exact 40-character source SHA:

```text
ghcr.io/oleyna80/azursystech-site-app:sha-<SHA>
ghcr.io/oleyna80/azursystech-site-showcase:sha-<SHA>
```

Admin publication and deployment remain opt-in/default `false`. Public `https://azursystech.fr/health` remains owned by the main application; the showcase route is only `http://showcase:3000/demo/health` internally.

## Normative baseline and preflight

- **Workspace root:** `/home/azur/Projects/WSL/azursystech/.codex/worktrees/showcase-production-multizone-github`
- **Branch / baseline:** `agent/showcase-production-multizone-github` at `257d529d4a81147b6f7dea29bd17f52228ea17d6`
- **Pre-existing worktree changes:** none (`git status --short` was empty)
- **Authority:** `schema_version=3`, `authority_mode=github_capability`
- **DB action mode:** `none`; no database command, credential access, schema operation, or live-data operation is authorized.
- **Architecture candidate:**

  ```text
  azursystech.fr/demo/*        -> showcase:3000
  azursystech.fr/demo-assets/* -> showcase:3000
  everything else              -> app:3000
  ```

- **Route and asset evidence, not a test result:** existing route files are under `showcase/app/demo/**`; public demo material is under `showcase/public/demo/**`; source contains absolute `/demo/...` links and asset references. `showcase/next.config.ts` currently has no `basePath` and conditionally supplies `assetPrefix`; its production branch must be made compatible with `/demo-assets` in implementation.
- **Packaging/deployment evidence, not a test result:** `Dockerfile.showcase` does not exist; Compose currently has `postgres`, `app`, optional-profile `admin`, and `web`; Nginx currently has only a catch-all `/` proxy; publish currently builds app and optional admin only; deploy/rollback currently record an app and optional admin only.

## Scope

### Approved source write-set after Stage 0 gate opens

```text
showcase/next.config.ts
showcase/app/demo/health/route.ts
Dockerfile.showcase
docker-compose.vps.yml
nginx.proxy.conf
deploy.sh
.github/workflows/docker-publish.yml
.github/workflows/deploy-vps.yml
.github/workflows/ci.yml
scripts/test-showcase-multizone.*
```

Exactly one Scoped Coder may modify this source write-set during Stage 1. Coordination artifacts are governed separately by the active Work Block’s coordination write-set.

### Out of scope

- Any `basePath="/demo"` setting or route move; existing paths stay `showcase/app/demo/**`.
- Changes to demo pages/components, their `/demo/...` links, or assets under `showcase/public/demo/**`.
- Main app (`web/**`) routes, including `/`, `/fr`, and `/health`.
- Admin source/runtime contract other than preserving its optional/default-false behavior in changed workflows/runtime logic.
- PostgreSQL, `.env`, secrets, credentials, migrations, data, production runtime, VPS, Docker/GHCR publication, workflow dispatch, push, PR, merge, or deployment.
- Project-local hook policy.

## Risk and authority

- **Side-effect classes planned:** production source write and local/test side effect only, after the gate opens.
- **Sensitive domains:** deployment topology, reverse proxy routing, immutable image release binding, rollback.
- **Hard Stops retained:** all remote Git mutation, Docker/GHCR publication, workflow dispatch, VPS/SSH, production deploy/restart, DB/data action, secrets/credentials, destructive operations, PR/merge.
- **Rollback contract:**
  - **First showcase rollout:** if the prior runtime has no showcase container/image, failure rollback restores the previous runtime files and returns to a runtime with no showcase service/container.
  - **Subsequent rollout:** if the prior runtime has showcase, rollback restores the coherent previous app/showcase image pair plus previous runtime files; optional admin state remains independently preserved.
- **Collision risks to control:** Nginx prefix/exact location precedence; trailing URI behavior for `/demo`; Next’s generated `_next` assets under `assetPrefix`; public `public/demo/**` references; `next/image` loader behavior; the main-app catch-all and health route; Compose `depends_on` isolation; first-rollout absence handling.

## Skill routing and topology

- **Checked:** `critic-review` contract (`.codex/critic.md`), `git-orchestration-flow`, `deploy-operations`, `git-safety`, `webapp-testing`, `crash-test-gate` from `.agent/ROSTER.md` / installed profile.
- **Matched and used now:** Critic contract; `git-orchestration-flow` safety boundary for the isolated branch and no-push rule.
- **Matched for later stages:** deploy operations (deployment/runtime design and verification), git safety (local commit preparation only), webapp testing (route/browser checks), crash-test gate (before any commit affecting route/proxy navigation).
- **Skipped now:** no deployment skill execution because deployment is a Hard Stop; no browser/live test because implementation does not exist; no security-pass because no auth/data/input/security-header contract is being changed, while reverse-proxy regression checks remain in the verification plan.
- **Topology:** Stage 0 Orchestrator → fresh native Critic (separate subagent, read-only) → one Scoped Coder for the complete source write-set → Reviewer → Verifier. No parallel writer.

## Fresh Critic result

The independent Critic returned `APPROVE`. Its report is
`docs/reports/critic-WB-2026-08-12-showcase-production-multizone.md`.

The approval does not widen scope. It retains five implementation and
verification reminders: prove first-rollout rollback removes the new showcase
container, reject mismatched app/showcase SHA pairs, exercise an actual local
`next/image` request, test Nginx routing for `/demo`, nested demo routes, and
`/demo-assets/_next/static`, and preserve existing Nginx headers/maps.

## Implementation plan

| ID | Task | Owner | Dependencies | Status |
|---|---|---|---|---|
| P1 | Make production showcase generated assets use `assetPrefix="/demo-assets"` without adding `basePath`; retain public `/demo/**` asset URLs and make the `next/image` behavior explicit/tested. | Scoped Coder | source gate READY | completed in retained candidate |
| P2 | Add the internal `showcase/app/demo/health/route.ts` route and standalone showcase Docker image. | Scoped Coder | P1 | completed; Dockerfile build now explicitly uses Webpack |
| P3 | Add a PostgreSQL-free Compose showcase service and Nginx `/demo` / `/demo-assets` routing with main-app fall-through preserved. | Scoped Coder | P2 | completed in retained candidate |
| P4 | Extend immutable publication/deploy/rollback logic for the exact-SHA app/showcase pair while preserving optional/default-false admin. | Scoped Coder | P3 | completed in retained candidate |
| P5 | Add deterministic structural/fixture checks for configuration, routes, Compose/Nginx, release binding, and both rollback branches. | Scoped Coder | P1-P4 | completed; includes PR-CI Docker/runtime contract |

## Acceptance criteria and verification plan

No item below has been executed or passed at Stage 0.

1. Local source assurance must pass: `npm run lint`, `npm run check:types`, the standalone production Webpack build (`npx next build --webpack`), contract tests, workflow/config validation, and `git diff --check`. The build must produce `.next/standalone`; generated asset references must resolve beneath `/demo-assets/` while demo public asset references remain `/demo/...`.
2. A test must prove no `basePath` is configured and the existing `showcase/app/demo/**` routes retain their public `/demo/**` URI.
3. A test must exercise the new internal showcase health endpoint at `http://showcase:3000/demo/health`; main app `/health` remains distinct.
4. Compose rendering/fixture checks must prove showcase has no `postgres` dependency and no database environment variable, and `web` waits for both required upstreams as designed.
5. Nginx syntax plus deterministic request/fixture tests must prove `/demo`, `/demo/…`, and `/demo-assets/…` resolve to showcase, while `/`, `/fr`, `/health`, and non-demo paths resolve to app. Tests must cover location precedence and preserve forwarding headers.
6. PR CI must build `Dockerfile.showcase`, start the Showcase container, and verify `GET /demo/health == 200`. These Docker/runtime integration checks are mandatory and authoritative for packaging proof: the standalone bundle includes `.next/static` and `public`, starts on port 3000, and reaches `/demo/health` without PostgreSQL.
7. Workflow/static tests must prove both app and showcase images use the same resolved `sha-<40-char-SHA>` tag and that admin stays optional/default false.
8. Deploy/rollback tests must cover: (a) no prior showcase: restore runtime without showcase; (b) prior showcase: restore prior coherent app/showcase pair and prior runtime files. They must also retain app `/health`, optional admin handling, and safe failure behavior.
9. Before any local commit, run the project crash-test gate because proxy routing changes can affect navigation; no push/dispatch/publish/deploy occurs.

## Assurance plan

- **Local deterministic assurance:** mandatory before local commit/publication handoff: lint, typecheck, standalone Webpack build, contract tests, workflow/config validation, `git diff --check`, and source/config review. Local Docker access is optional and its absence must not block a local feature-branch commit or Owner publication handoff.
- **PR CI runtime assurance:** mandatory and authoritative for Docker runtime proof. PR CI must build `Dockerfile.showcase`, start the Showcase container, verify `GET /demo/health == 200`, and run the required Docker/runtime integration checks. A local Docker socket is neither required nor a substitute for this gate.
- **Critic:** required, native independent read-only subagent; the earlier Critic supplement is reconciled below and a fresh Critic `APPROVE` is required before reopening the source gate.
- **Review:** required after source diff freeze; inspect routing, release coherence, rollback correctness, health ownership, PostgreSQL isolation, and maintainability.
- **Verification:** required after review; verify the local source/config proof and that the PR-CI workflow declares the mandatory Docker/runtime gate. Runtime execution is not represented as locally passed unless actually run in the required PR CI environment.
- **Evaluation / drift:** evaluation not required because acceptance is deterministic; drift audit required after implementation because this is a multi-domain deployment contract.

## Critic supplement reconciliation

The fresh Critic returned `SUPPLEMENT` solely because the earlier contract made
local Docker access a blocker for local commit and Owner publication handoff.
This revision resolves that gap without changing architecture or the approved
source write-set: Docker runtime proof is now an explicit mandatory PR-CI gate,
while local Docker remains optional.

## Stage 0 exit rule

The fresh independent Critic returned `APPROVE`; the lifecycle source gate was
reopened with the preserved write-set. The Webpack and PR-CI contract correction
is implemented and frozen. The next mandatory stages are Reviewer and Verifier.
