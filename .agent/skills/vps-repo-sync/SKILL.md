---
name: vps-repo-sync
description: Сверка VPS runtime-фактов с репозиторием и точечный sync deployment артефактов для registry-pull deploy модели.
---

# Skill: VPS Repo Sync

## Triggers
- "sync vps -> repo"
- "документация не совпадает с VPS"
- "зафиксируй runtime артефакты"

## Objective
Убрать drift между реальным VPS состоянием и проектным SSOT:
- `docker-compose.vps.yml`
- `.env.vps.example`
- `docs/deployment/*`
- `scripts/*` для ops
- `.agent/skills/*` для deploy/recovery workflow

## Workflow
1. Собрать факт-слой с VPS (read-only evidence).
2. Сравнить с репозиторием.
3. Проверить deploy baseline:
   - runtime dir: `/home/dmitrii/apps/azursystech`;
   - deploy model: WSL build -> GHCR push -> VPS `docker compose pull`;
   - required compose project: `COMPOSE_PROJECT_NAME=azursystech-site`.
4. Выделить `missing sync` только по infra/docs.
5. Подготовить минимальный patch без UI/feature scope.
6. Обновить `memory_bank/progress.md` и task delivery notes, если задача затрагивает tracked progress.

## Constraints
- Не менять app UI/routes.
- Не менять внешние интеграции без explicit approval.
- Не добавлять секреты в `.env.vps.example`.
- Не возвращать VPS deploy к `git pull` или build-on-VPS модели без нового architecture decision.

## Output
- Список `already synced` / `missing sync`
- Scoped file list для commit
- Риски (например offsite backup pending)

## Handoff
- **Success condition**: все целевые файлы synced, scoped commit list готов.
- **Next**: scoped-commit-guard или vps-registry-pull-deploy
- **Auto-proceed**: 🟢 YES
- **Hard stop**: NO
