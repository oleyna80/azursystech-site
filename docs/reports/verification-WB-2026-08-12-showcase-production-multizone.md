# Verifier Report — WB-2026-08-12 Showcase Production Multizone

## Formal verdict

**READY**

- **Tier:** Full
- **Frozen range:** `257d529d4a81147b6f7dea29bd17f52228ea17d6` → `b15f2ace5794f35627d21b797124935d6a0a38a5`
- **Verifier function:** fresh native read-only Verifier subagent
- **Required / actual isolation:** `same-session-degraded` / `same-session-degraded` (separate subagent sharing the workspace/runtime). This is not `independent-readonly-root` or `os-isolated`.

## Acceptance evidence

| Acceptance area | Result | Evidence |
|---|---|---|
| Frozen candidate and scope | PASS | HEAD is `b15f2ace...`; the complete diff is within approved source or coordination paths and `git diff --check` is clean. |
| Source/configuration contract | PASS | `PYTHONDONTWRITEBYTECODE=1 python3 scripts/test-showcase-multizone.py` passed. |
| Syntax and configuration | PASS | `bash -n deploy.sh` and PyYAML parsing for Compose and changed workflows passed. |
| Showcase quality | PASS | Lint completed with 10 pre-existing warnings and zero errors; `npm run check:types` passed. |
| Standalone packaging | PASS | `npx next build --webpack` passed and emitted `.next/standalone` and `.next/static`. |
| P2 and CI event topology | PASS | CI declares both pull-request and main-push triggers; the Docker runtime job has no PR-only condition and verifies the health endpoint through the isolated Docker network. |
| Image/release binding | PASS | Publication requires successful CI for the exact resolved SHA and binds app plus Showcase to one `sha-<40>` tag. Deploy requires an input tag equal to its workflow SHA. |
| Routing, PostgreSQL, and admin behavior | PASS | `/demo`, `/demo/*`, and `/demo-assets/*` route to Showcase; app/admin routing stays distinct; Showcase has no DB dependency/environment; admin defaults are unchanged. |
| Newly introduced secrets | PASS | Frozen-diff review found none. |

## Exact-head CI/runtime proof

GitHub Actions run `32058801176` (CI #132), associated with exact head `b15f2ace5794f35627d21b797124935d6a0a38a5`, completed successfully. Its `Showcase Docker runtime` job successfully built the image, created the isolated network, started the container, waited for health, and probed `/demo/health`. Control Plane Contracts run `32058801212` also completed successfully for that head.

## Limitations

No local Docker execution, VPS/SSH access, deployment, publication, workflow dispatch, secret operation, or GitHub mutation was performed. The verdict covers the frozen source/configuration candidate and exact-head CI evidence. It is not production-runtime evidence; live Nginx/CSP and deployed-service proof remains intentionally unperformed.

## Unresolved findings

None blocking. The 10 lint warnings predate this range and are non-failing.
