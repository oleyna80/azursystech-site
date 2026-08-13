## Verifier Report

**Tier:** full
**Work Block:** `WB-2026-08-12-showcase-production-multizone` — standalone Showcase service, public multizone routing, immutable image binding, and rollback.
**Verdict:** **READY**
**Isolation:** separate read-only verifier subagent in the shared local worktree (`same-session-degraded`). This verdict covers the frozen local source/configuration gate; it is not production, Docker-runtime, or PR-CI execution proof.

### Changed Files

- `showcase/next.config.ts` — standalone output and `/demo-assets` generated-asset namespace without `basePath`.
- `showcase/app/demo/health/route.ts` — internal Showcase health handler.
- `Dockerfile.showcase` — Node 22 standalone Showcase image.
- `docker-compose.vps.yml` — PostgreSQL-free Showcase service and web dependency.
- `nginx.proxy.conf` — `/demo` and `/demo-assets` routing to Showcase with main-app fallback.
- `deploy.sh` — exact-SHA app/Showcase coherence and both rollback branches.
- `.github/workflows/docker-publish.yml` — same-SHA Showcase publication.
- `.github/workflows/deploy-vps.yml` — Showcase preflight, deploy, and rollback state restoration.
- `.github/workflows/ci.yml` — required local source checks and authoritative PR Docker runtime job.
- `scripts/test-showcase-multizone.py` — deterministic contract and rollback-model check.

All source paths are inside the approved write-set. Untracked plan, tasklist, critic/reviewer reports, and this report are in approved coordination paths.

### Checks

- [PASS] Diff scope and integrity — `git status --porcelain`, tracked diff, and untracked-file inventory contain only approved source or coordination paths; `git diff --check 257d529d4a81147b6f7dea29bd17f52228ea17d6` passed.
- [PASS] Showcase lint — `npm run lint` in `showcase/` exited 0 (10 warnings, 0 errors; warnings are in unchanged demo sources).
- [PASS] Showcase typecheck — `npm run check:types` in `showcase/` exited 0 (`next typegen && tsc --noEmit`).
- [PASS] Standalone Webpack build and assets — `npx next build --webpack` in `showcase/` exited 0; it generated the expected `/demo/**` route tree including dynamic `/demo/health`. `.next/standalone/server.js`, `.next/static`, `public`, and `public/demo` exist. Emitted HTML contains generated `/demo-assets/_next/...` URLs while public demo references remain `/demo/bijoux-artisanaux/hero.jpg`.
- [PASS] Deterministic multizone contract — `python3 scripts/test-showcase-multizone.py` passed. It asserts standalone/no-`basePath`, internal health, PostgreSQL isolation, Nginx precedence and header forwarding, public/admin host routing, immutable tag binding, and first/subsequent Showcase plus independent-admin rollback models ([`scripts/test-showcase-multizone.py`](../../scripts/test-showcase-multizone.py:45)).
- [PASS] Configuration syntax — PyYAML safely parsed `docker-compose.vps.yml`, `.github/workflows/ci.yml`, `.github/workflows/docker-publish.yml`, and `.github/workflows/deploy-vps.yml`; `bash -n deploy.sh` passed.
- [PASS] Routing and service contract review — Showcase is isolated from PostgreSQL and has the required health endpoint ([`docker-compose.vps.yml`](../../docker-compose.vps.yml:89), [`showcase/app/demo/health/route.ts`](../../showcase/app/demo/health/route.ts:3)); exact `/demo`, `/demo-assets/`, and nested `/demo/` locations preserve URI and forwarding headers, with `/` retaining main-app upstream fallback ([`nginx.proxy.conf`](../../nginx.proxy.conf:90)).
- [PASS] Immutable release/admin contract — source review and deterministic contract confirm a single resolved `sha-<40-hex>` bind for app/Showcase plus `publish_admin` and `include_admin` defaulting to false.
- [PASS] Required PR-CI runtime gate is declared — CI labels `showcase-docker-runtime` as `Showcase Docker runtime (PR authoritative)`, limits it to pull requests, builds `Dockerfile.showcase`, starts the container, and checks `GET /demo/health` for `"status":"ok"` ([`ci.yml`](../../.github/workflows/ci.yml:71)).
- [UNVERIFIED] PR-CI Docker runtime execution — intentionally not run locally. The Work Block makes PR CI authoritative; no Docker/socket, network, workflow-dispatch, publication, VPS, or production operation was attempted. The next PR must provide the job’s successful execution evidence before deployment/publication decisions.

### Warnings (non-blocking)

- The current verdict is local source/configuration readiness only. A local Docker absence is not a local commit blocker under the approved assurance plan; the mandatory authoritative runtime proof remains pending PR CI.
- No `npm audit` was run in this verification pass because the assigned acceptance scope was the enumerated local source/config checks; CI retains its runtime dependency-audit step.

### Follow-ups (optional)

- Preserve the successful `Showcase Docker runtime (PR authoritative)` job result with the PR evidence before considering deployment or publication.
