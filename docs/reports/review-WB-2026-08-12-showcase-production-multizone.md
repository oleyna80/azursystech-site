# Reviewer Report — WB-2026-08-12 Showcase Production Multizone

**Review state:** CHANGES_REQUIRED

**Review basis:** frozen working-tree diff against
`257d529d4a81147b6f7dea29bd17f52228ea17d6`; active Work Block write-set;
approved plan revision
`sha256:814839dc537671161e6b2a13f1b7725989772c70273354c08d3148d5fbcf4ebd`.

**Scope reviewed:** `showcase/next.config.ts`, `showcase/app/demo/health/route.ts`,
`Dockerfile.showcase`, `docker-compose.vps.yml`, `nginx.proxy.conf`, `deploy.sh`,
the three changed GitHub workflows, and `scripts/test-showcase-multizone.py`.
The plan, tasklist, active Work Block state, and Critic report were read only as
contract context. All changed paths are contained by the active source or
coordination write-set.

## By severity

- 🔴 HIGH: 2 — admin-host routing is changed; rollback fails to restore the
  previous optional-admin state in required branches.
- 🟡 MEDIUM: 3 — `/demo` is not proxied to Showcase; the required executable
  route/image/rollback proof is absent; annotated tag refs are not resolved to
  a commit SHA.
- ⚪ LOW: 0

## Details

| Severity | File:Line | Finding | Evidence | Recommendation |
|---|---|---|---|---|
| 🔴 HIGH | `nginx.proxy.conf:79-97` | The new demo locations apply to every allowed host, including `admin.azursystech.fr`, so they override the pre-existing admin upstream selection. | `map $host $upstream_service` retains `admin.azursystech.fr admin:3000` at lines 33-36, but Nginx chooses the more-specific `^~ /demo-assets/` and `^~ /demo/` locations before `location /` (lines 79-106). Thus `Host: admin.azursystech.fr`, `/demo/...` is now sent to `showcase:3000`, not `admin:3000`. | Route Showcase prefixes only on the public/main hosts, preserving the existing admin-host catch-all model; add an admin-host routing regression test. |
| 🔴 HIGH | `.github/workflows/deploy-vps.yml:175-198` | Failure rollback does not restore the recorded admin state independently of Showcase state. | Previous state is captured at lines 343-350. When Showcase was absent, the `else` branch always invokes the rollback runner with `DEPLOY_ADMIN=0` (lines 181-184) and then stops admin whenever `include_admin=true` (lines 187-198), including when `PREVIOUS_ADMIN_RUNNING=true`. When Showcase existed but `PREVIOUS_ADMIN_RUNNING=false`, lines 178-180 also use `DEPLOY_ADMIN=0` and never stop the newly started admin. Both outcomes violate the required previous-admin-state restoration. | Make admin restoration depend exclusively on `PREVIOUS_ADMIN_RUNNING` (and prior image where applicable), in both Showcase branches. Deterministically simulate previous-admin-running true and false alongside each rollback state. |
| 🟡 MEDIUM | `nginx.proxy.conf:79-99` | The declared URI-preservation handling does not cover the exact `/demo` path. | Only `location ^~ /demo/` exists. Nginx does not match it for `/demo`; that request falls through to `location /` and the main upstream. The approved plan explicitly requires deterministic proof for `/demo`, `/demo/...`, and `/demo-assets/...`. | Add an exact `location = /demo` that proxies unchanged to Showcase (or an explicitly URI-preserving redirect if the plan is amended), then test it. |
| 🟡 MEDIUM | `scripts/test-showcase-multizone.py:21-69`, `.github/workflows/ci.yml:61-65` | The new CI check is structural substring validation only; it does not provide the required deterministic behavioural proof. | The Python program performs file-text assertions only. It makes no HTTP requests, runs no container/Nginx fixture, inspects no built asset manifest, and simulates neither rollback branch. Consequently it cannot detect the two routing/rollback defects above and does not test `next/image`, deep/direct routes, 404 handling, asset collision, or public assets. | Retain structural checks, but add deterministic executable fixtures/tests covering public and admin-host routing, standalone container health, a real deep route and 404, generated asset URLs and `next/image`, and first/subsequent rollback states. Do not claim unavailable Docker/browser checks as passed. |
| 🟡 MEDIUM | `.github/workflows/docker-publish.yml:34-58` | A tag input is not reliably resolved to an exact *commit* SHA before the CI gate and image tag are computed. | For a non-SHA ref, `git ls-remote ... "$TARGET_REF" | awk 'NR==1 {print $1}'` uses the first ref object. For an annotated tag that is the tag object's SHA, not its peeled commit SHA. It passes the 40-hex validation but is not the required exact source commit. | Resolve a checked-out ref to `git rev-parse HEAD` (or explicitly use a peeled tag ref), validate it as a commit, and use that resolved commit SHA consistently for CI lookup, checkout, and both image tags. |

## Security and architecture triage

- Security headers and forwarded proxy headers remain present in the added
  Showcase locations (`nginx.proxy.conf:67-96`); no new secret value or database
  environment variable was found in the Showcase service (`docker-compose.vps.yml:89-114`).
- `showcase` has no PostgreSQL `depends_on`; the external PostgreSQL volume
  declaration is unchanged (`docker-compose.vps.yml:190-193`).
- The standalone configuration, asset namespace, health route, and Docker
  packaging are structurally aligned with the plan (`showcase/next.config.ts:5-24`,
  `Dockerfile.showcase:1-41`, `showcase/app/demo/health/route.ts:1-5`).
- Runtime/container/browser/VPS proof is **UNVERIFIED** in this review. No
  production action was performed.

## Read-only checks executed

- `git diff --check 257d529d4a81147b6f7dea29bd17f52228ea17d6` — passed.
- `bash -n deploy.sh` — passed.
- `python3 scripts/test-showcase-multizone.py` — passed, but only establishes
  its stated static assertions.
