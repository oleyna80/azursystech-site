## Reviewer Report

**Work Block:** `WB-2026-08-12-showcase-production-multizone`
**Stage:** Stage 1 — final frozen implementation review
**Verdict:** **CHANGES_REQUIRED**
**Review mode:** independent, read-only source review. No Docker/Compose run,
registry, workflow dispatch, VPS/SSH, or public endpoint request was performed.

**Dimension:** code, architecture, security, drift
**Files reviewed:** `showcase/next.config.ts`,
`showcase/app/demo/health/route.ts`, `Dockerfile.showcase`,
`docker-compose.vps.yml`, `nginx.proxy.conf`, `deploy.sh`,
`.github/workflows/docker-publish.yml`, `.github/workflows/deploy-vps.yml`,
`.github/workflows/ci.yml`, `scripts/test-showcase-multizone.py`, active Work
Block/task/plan context, and the complete diff from
`257d529d4a81147b6f7dea29bd17f52228ea17d6`.

**Findings:** 2 total

### By severity

- 🔴 HIGH: 1 — direct rollback can restore an absent or stopped Showcase as running.
- 🟡 MEDIUM: 1 — rollback test is an unbound desired-state model and misses that defect.
- ⚪ LOW: 0

### Confirmed contract coverage

- Nginx has exact `/demo`, `^~ /demo-assets/`, `^~ /demo/`, then main `/`;
  URI-less `proxy_pass` preserves the URI. The public-host map sends only the
  demo namespaces to Showcase, leaving the Admin host mapped to Admin.
- Showcase has no `basePath`, production standalone output, a `/demo-assets`
  prefix, namespaced `next/image` path, and a `/demo/health` route. Public
  `/demo/**` remains unprefixed.
- The Showcase image structurally copies standalone/static/public output and
  runs non-root. Compose makes Showcase independent of PostgreSQL and preserves
  the external PostgreSQL volume.
- Publication/deployment source enforces a single exact peeled source SHA and
  uses it for mandatory App and Showcase images; deployment pre-pulls both.
- The workflow restores runtime files and `.env` before its rollback runner,
  captures independent Admin/Showcase existence/running/image state, and gates
  health only for prior running optional services.
- Changed paths are within the active Work Block's source or coordination
  write-set. `git diff --check` is clean.

### Details

| Severity | File:Line | Finding | Evidence | Recommendation |
|---|---|---|---|---|
| 🔴 HIGH | `deploy.sh:278-306`; `docker-compose.vps.yml:156-163` | The standalone rollback path does not preserve a previously absent or stopped Showcase. | It removes an absent Showcase at lines 279-284, and stops a previously stopped one at lines 285-287, but then recreates `web` at line 288 without `--no-deps`. `web` depends on healthy `showcase`. Compose can therefore create/start Showcase again; the new `SHOWCASE_IMAGE` remains exported from lines 193-195. The result violates both explicit rollback states when this documented direct entry point is used with the current Compose file. | Restore App/Web without starting dependencies (for example, the appropriately scoped `--no-deps` operation), or remove/stop Showcase after the final Web recreation. Assert the final absent/stopped state before successful rollback health is reported. |
| 🟡 MEDIUM | `scripts/test-showcase-multizone.py:31-42, 101-122` | The deterministic rollback proof models intended booleans rather than the commands/state transitions in the actual scripts. | `rollback_plan()` returns hard-coded desired values. The deploy-script checks only search for broad substrings, so the test passes despite the dependency-driven re-creation at `deploy.sh:288`. | Add a hermetic fake-Docker/Compose fixture or an equivalently execution-bound shell test covering absent/running/stopped Showcase and Admin states, `.env` restoration, the final service states, and health requirements. |

### Inspection gaps

- The required standalone build, Docker image/container health, Next emitted
  asset/image URL behavior, Nginx syntax/routing, and main-route regressions
  were not executed in this review and are **UNVERIFIED**, not passing runtime
  evidence.
- `python3 scripts/test-showcase-multizone.py`, `bash -n deploy.sh`, and
  `git diff --check` were observed as passing static checks; they do not close
  the two findings above.
