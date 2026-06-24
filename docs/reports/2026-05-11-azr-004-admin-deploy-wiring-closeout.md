# AZR-004 Admin Deploy Wiring Closeout — 2026-05-11

## Verdict

ACCEPT locally. The admin deployment wiring is ready for review/commit planning, not production rollout.

## Work Completed

- Admin security patch gate completed and committed as `31252f6`.
- Admin `next` and `eslint-config-next` updated to `16.2.6`.
- Admin deployment wiring implemented locally:
  - `Dockerfile.admin`
  - `admin/src/app/health/route.ts`
  - `scripts/build-push-admin-image.sh`
  - `deploy-admin.sh`
  - `docker-compose.vps.yml` admin profile/service
  - `nginx.proxy.conf` host routing for `admin.azursystech.fr`
  - `.env.vps.example` admin placeholders
- `admin/middleware.ts` updated so `/health` does not redirect to `/login`.

## Verification Evidence

- `git diff --check` passed.
- `cd admin && npm run check:ci` passed.
- `bash -n scripts/build-push-admin-image.sh` passed.
- `bash -n deploy-admin.sh` passed.
- `docker compose -f docker-compose.vps.yml config` passed with dummy env values and no admin profile.
- `COMPOSE_PROFILES=admin docker compose -f docker-compose.vps.yml config` passed with dummy env values.
- Local `nginx -t` passed via `nginx:1.27-alpine`.
- Local Docker build passed:
  - `docker buildx build --file Dockerfile.admin --tag azursystech-admin:local-smoke --load .`
- Local container `/health` smoke passed:
  - `GET http://127.0.0.1:3021/health`
  - response: `200`
  - body: `{"ok":true,"service":"azursystech-admin"}`
- Secret scan found only env names/placeholders, not real secrets.

## Not Performed

- No Docker push.
- No VPS deploy.
- No live DB schema apply.
- No production `.env` edits.
- No Meta Graph API publishing implementation.
- No Telegram runtime wiring.
- No n8n runtime wiring.
- No real client/social communication.

## Known Risks

- Production rollout still needs a separate approved plan for live DB apply, immutable admin image push, VPS `.env` secret provisioning, compose/nginx update, DNS/proxy verification, and live health/auth smoke.
- `npm audit` still reports moderate transitive `postcss` issues; forced audit fix is not acceptable because it proposes an unsafe Next.js downgrade.
- `memory_bank/decisions.md` exists in the current repository snapshot; keep it in the standard closeout read set.
- Local Docker image `azursystech-admin:local-smoke` remains from verification; cleanup is optional and should be approved if treated as destructive local cleanup.

## Next Gate

1. Review the admin deploy wiring diff.
2. Commit the deploy wiring if accepted.
3. Plan production rollout as two explicit approval gates:
   - live DB schema apply;
   - admin image push + VPS compose/nginx rollout.
