---
name: VPS Repo Sync
description: Сверка VPS runtime-фактов с репозиторием и точечный sync deployment артефактов.
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

## Workflow
1. Собрать факт-слой с VPS (read-only evidence).
2. Сравнить с репозиторием.
3. Выделить `missing sync` только по infra/docs.
4. Подготовить минимальный patch без UI/feature scope.
5. Обновить `memory_bank/progress.md` и task delivery notes.

## Constraints
- Не менять app UI/routes.
- Не менять внешние интеграции без explicit approval.
- Не добавлять секреты в `.env.vps.example`.

## Output
- Список `already synced` / `missing sync`
- Scoped file list для commit
- Риски (например offsite backup pending)

