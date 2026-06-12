---
name: vps-registry-pull-deploy
description: Deploy AzurSysTech to VPS through WSL-built GHCR images and docker compose pull. Use for production deploy, rollback, runtime proof, or when avoiding CPU-heavy builds on the VPS.
user-invocable: true
allowed-tools:
  - Read
  - Bash
---

# Skill: VPS Registry Pull Deploy

## Objective
Deploy production from an immutable GHCR image without building on the VPS.

Canonical model:
- build image on WSL;
- push immutable tag to `ghcr.io/oleyna80/azursystech-app`;
- update VPS `.env` `APP_IMAGE`;
- run `docker compose pull` / `up` in `/home/dmitrii/apps/azursystech`.

## Preconditions
- Explicit Owner approval is required before deploy, rollback, Docker cleanup, or credential changes.
- Use SSH target `dmitrii@178.156.212.10` with `/home/dmitrii/.ssh/hardwarelab_deploy`.
- Keep `COMPOSE_PROJECT_NAME=azursystech-site` in VPS `.env`; otherwise Compose creates a second stack.
- Do not run `docker compose build`, `npm ci`, or `npm run build` on the VPS.
- Do not print secrets or full `.env` / Docker credential files.
- Use separate GHCR credentials:
  - WSL push: classic PAT with `write:packages`;
  - VPS pull: classic PAT with `read:packages` only.
- **WSL npm isolation**: Always run `npm`, `npm ci`, `npm run build`, `npm run check:types` from a WSL terminal only (e.g. `bash`, `zsh` via nvm). Never invoke these from Windows PowerShell or Windows Command Prompt against WSL paths (`\\wsl.localhost\...`). Windows npm writes to its own cache and leaves WSL `node_modules/.bin/` incomplete, causing `ENOTEMPTY` errors and missing binaries (`tsc`, `next`). Recovery: `rm -rf node_modules && npm ci` from WSL shell.

## Workflow
1. Preflight local state:
   - `git status --short --branch`
   - confirm the intended commit SHA and image tag.
2. Build and push from WSL:
   - `./scripts/build-push-image.sh`
   - *Note for WSL*: If the script fails during `npm ci` with an `ENOTEMPTY` error on `node_modules/.bin` due to cross-OS path translation, run it with `RUN_CHECKS=0 bash scripts/build-push-image.sh` (ensure `npm run check:types` and `npm run build` were already run manually and passed).
   - record the immutable image tag and digest.
3. Prepare VPS runtime:
   - ensure `/home/dmitrii/apps/azursystech` has `docker-compose.vps.yml`, `deploy.sh`, `nginx.proxy.conf`, scripts, and `.env`.
   - verify `.env` has `COMPOSE_PROJECT_NAME=azursystech-site` and the new `APP_IMAGE`.
   - for credential rotation, use local skill `vps-ghcr-credential-rotation` and `./scripts/vps-ghcr-login.sh`.
4. Deploy from registry:
   - run `./deploy.sh` from `/home/dmitrii/apps/azursystech`.
   - if doing manual deploy, export `COMPOSE_PROJECT_NAME=azursystech-site` and `APP_IMAGE`.
5. Verify:
   - `docker compose -f docker-compose.vps.yml ps`
   - app image equals the intended GHCR tag;
   - `azursystech-app` and `azursystech-web` are healthy;
   - `curl -fsSI https://azursystech.fr/health`;
   - `curl -fsSI https://www.azursystech.fr/health`.
6. Closeout:
   - update deploy docs or task status if runtime facts changed;
   - do not delete old runtime checkout until rollback has been tested or one more deploy cycle passes.

## Rollback
Use the previous known-good immutable tag from `.deploy/previous-app-image` or deployment notes, then run pull/up with `COMPOSE_PROJECT_NAME=azursystech-site`.

Stop and ask before deleting Docker networks, volumes, old runtime directories, or credentials.

## Output
- Image tag and digest.
- VPS runtime directory.
- Compose project name.
- Services health.
- Public health result.
- Files/settings changed.
- Risks and next recommended action.

## Handoff
- **Success condition**: services healthy, `curl /health` вернёл 200, все пункты Output заполнены.
- **Next**: Control Tower (post-deploy closeout report)
- **Auto-proceed**: 🔴 NEVER — deploy всегда требует Owner approval до запуска.
- **Hard stop**: 🔴 YES — explicit Owner approval перед каждым deploy/rollback.
