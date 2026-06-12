---
name: vps-db-tunnel-ops
description: Безопасный доступ к VPS PostgreSQL из WSL через SSH-туннель с loopback-bind (`127.0.0.1:5432` на VPS), без внешнего открытия порта.
user-invocable: true
allowed-tools:
  - Read
  - Bash
---

# Skill: VPS DB Tunnel Ops

## Triggers
- "проверь доступ к postgres на vps"
- "подними ssh tunnel к db"
- "wsl -> vps postgres"
- "db connectivity check"

## Objective
Дать стабильный и воспроизводимый доступ к PostgreSQL на VPS из WSL через SSH-туннель, сохраняя `5432` закрытым снаружи.

## Workflow
1. SSH preflight (non-interactive):
   - проверить рабочую связку `VPS_USER + SSH_KEY + VPS_HOST`.
2. Проверить Postgres на VPS:
   - контейнер `azursystech-postgres` в `healthy`;
   - локальный SQL probe через `psql`.
3. Проверить loopback-bind:
   - в `docker-compose.vps.yml` должен быть
     - `ports:`
     - `"127.0.0.1:5432:5432"`
   - применить `docker compose -f docker-compose.vps.yml up -d postgres`.
4. Поднять туннель из WSL:
   - `./scripts/vps-db-tunnel.sh start`
   - `./scripts/vps-db-tunnel.sh test`
5. Подтвердить безопасность:
   - внешний `VPS_HOST:5432` должен оставаться закрыт/filtered.

## Constraints
- Не открывать `5432` наружу (`0.0.0.0:5432`) без явного подтверждения.
- Не логировать секреты в отчеты и коммиты.
- Для изменений infra обязательно фиксировать результат в `memory_bank/progress.md`.

## Output
- Connectivity verdict: `PASS` / `FAIL`
- Structured return:
  1. What was done
  2. Decisions made
  3. Files / settings changed
  4. Open blockers
  5. Next recommended action

## Handoff
- **Success condition**: туннель установлен, smoke-запрос прошёл, open blockers задокументированы.
- **Next**: Control Tower
- **Auto-proceed**: 🔴 NEVER без Owner approval
- **Hard stop**: 🔴 YES — доступ к production DB требует explicit Owner approval.
