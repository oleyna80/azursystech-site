---
name: vps-deploy-recovery
description: Восстановление VPS runtime/deploy state при broken compose/yaml, failed registry-pull deploy, orphan stack или старом git-checkout drift.
user-invocable: true
allowed-tools:
  - Read
  - Bash
---

# Skill: VPS Deploy Recovery

## Triggers
- "git pull --ff-only failed"
- "ahead/behind diverged"
- "You have unmerged files"
- "yaml: mapping values are not allowed in this context"
- "detached + dirty state на VPS"
- "registry pull deploy failed"
- "compose создал вторую stack"

## Objective
Быстро вернуть VPS runtime в предсказуемый deploy-state (`compose-valid`, correct project name, services healthy), не теряя safety snapshot.

Current production deploy model:
- build/push image from WSL;
- pull immutable GHCR image on VPS;
- runtime directory: `/home/dmitrii/apps/azursystech`;
- required `.env`: `COMPOSE_PROJECT_NAME=azursystech-site`.

Do not recover production by building on the VPS.

## Workflow
1. Диагностика runtime state:
   - `cd /home/dmitrii/apps/azursystech`
   - `docker compose -f docker-compose.vps.yml config -q`
   - `docker compose -f docker-compose.vps.yml ps`
   - verify `.env` contains `COMPOSE_PROJECT_NAME=azursystech-site`.
2. Если проблема связана с registry pull:
   - проверить, что `APP_IMAGE` указывает на immutable GHCR tag;
   - проверить `docker manifest inspect "$APP_IMAGE"` на VPS;
   - не выводить Docker credentials.
3. Если Compose создал вторую stack:
   - зафиксировать orphan network/volume names;
   - не удалять network/volume без explicit approval;
   - исправить `COMPOSE_PROJECT_NAME=azursystech-site`;
   - повторить `docker compose -f docker-compose.vps.yml up -d app web`.
4. Для старого git-backed checkout drift:
   - `git status -sb`
   - `git branch --show-current`
   - `git stash list | head -n 5`
5. Если есть незавершенный merge/rebase в старом checkout:
   - `git rebase --abort || true`
   - `git merge --abort || true`
6. При broken compose/yaml после конфликтов:
   - `git restore --source=HEAD --staged --worktree <conflicted files>`
   - `docker compose -f docker-compose.vps.yml config -q`
7. При diverged deploy-ветке:
   - создать backup branch (`backup/...`);
   - синхронизировать к `origin/<branch>` (для deploy checkout допускается hard reset только после explicit approval).
8. Финальная верификация:
   - `docker compose ... ps`
   - `/health` check.

## Constraints
- Перед любым потенциально разрушительным шагом обязателен safety snapshot (backup branch или stash).
- Не выполнять `git reset --hard` без явного подтверждения.
- Не выполнять `docker compose build` / `up --build` на VPS без отдельного архитектурного решения.
- Не выводить секреты из `.env` в отчет.

## Output
- Root cause блокировки.
- Recovery commands и их результат.
- Final deploy-state: `branch sync`, `compose valid`, `services healthy`.
- Остаточные риски и следующий шаг.

## Handoff
- **Success condition**: compose valid, services healthy, /health 200.
- **Next**: Control Tower (post-recovery report)
- **Auto-proceed**: 🔴 NEVER без Owner approval
- **Hard stop**: 🔴 YES — все деструктивные шаги требуют explicit Owner approval.
