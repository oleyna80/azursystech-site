# Reviewer Report — WB-2026-08-12 Showcase Production Multizone

## Verdict

**READY** — no blocking defects or unrelated scope drift found.

- **Frozen range:** `257d529d4a81147b6f7dea29bd17f52228ea17d6` → `b15f2ace5794f35627d21b797124935d6a0a38a5`
- **Review function:** fresh native read-only Reviewer subagent
- **Actual isolation:** `separate_subagent` with a shared worktree. This is not OS-isolated and does not include live-runtime access.
- **Supersession:** Earlier Reviewer/Verifier records, including the records bound before `b15f2ace...`, are stale evidence and do not supply this verdict.

## Scope and integrity

The complete 24-path frozen diff was inspected. Production paths are within the approved Work Block write-set; Work Block, report, and tasklist artifacts are within its approved coordination write-set. `git diff --check` passed. No secrets, credentials, or unrelated source/configuration changes were identified.

## Required review matrix

| Requirement | Result | Evidence |
|---|---|---|
| Original P2 is closed | PASS | `ci.yml` triggers for both `pull_request` and `push` to `main`; `showcase-docker-runtime` no longer has a PR-only condition. The deterministic contract test rejects a PR-only runtime job. |
| Docker runtime contract | PASS | The job depends on `quality`, builds `Dockerfile.showcase`, starts on an isolated Docker network without host publication, waits for health, and probes `/demo/health`. |
| Exact-SHA publication gate | PASS | `docker-publish.yml` resolves and validates `TARGET_SHA`, requires a successful `ci.yml` run for `head_sha=${TARGET_SHA}`, then tags both mandatory images as `sha-${TARGET_SHA}`. |
| Immutable app/Showcase pairing | PASS | App and Showcase use the same computed immutable `sha-<40-hex>` tag. |
| Deployment SHA equality | PASS | `deploy-vps.yml` accepts only `sha-<40>` and rejects an `image_tag` that differs from `sha-${GIT_SHA}` before constructing both image names. |
| Public routing preserved | PASS | `/demo`, `/demo/*`, and `/demo-assets/*` retain their URI and route to `showcase:3000`; other public routes, including `/health`, fall through to `app:3000`. |
| PostgreSQL and admin contracts | PASS | Showcase has neither `postgres` dependency nor database environment. Admin remains profile-gated; `publish_admin` and `include_admin` both default to `false`. |
| Scope drift | PASS | No change extends beyond the approved production/coordination write-sets. |

## Checks run

- `git diff --check 257d529d4a81147b6f7dea29bd17f52228ea17d6 b15f2ace5794f35627d21b797124935d6a0a38a5`
- `PYTHONDONTWRITEBYTECODE=1 python3 scripts/test-showcase-multizone.py`
- `bash -n deploy.sh`
- YAML parse of `docker-compose.vps.yml`, `ci.yml`, `docker-publish.yml`, and `deploy-vps.yml`

All passed.

## Exact-head CI evidence

GitHub Actions evidence was inspected for `b15f2ace5794f35627d21b797124935d6a0a38a5`:

- CI #132 / run `32058801176`: **SUCCESS**.
- `Showcase Docker runtime`: **SUCCESS**; image build, isolated-network creation, container start, health wait, and `/demo/health` probe all succeeded.
- Control Plane Contracts / run `32058801212`: **SUCCESS**.

The observed execution is a pull-request event. The frozen workflow establishes that the same job is eligible on a push to `main`; no post-merge execution has been observed or claimed.

## Residual limits and coordination follow-up

No live deployment, VPS/SSH, Docker publication, workflow dispatch, credential operation, or GitHub mutation was performed. Production-runtime proof remains intentionally unperformed.

The old Codex P2 discussion is stale and ready for resolution by an authorized repository actor. PR #13's description is also stale: it names `db738f4...`, says the runtime job is PR-only, and contains superseded assurance wording. It must be updated through the Owner-controlled repository flow before merge handoff.
