# Decisions

## ADR-001: SQL-first persistence
- **Решение**: PostgreSQL как единственный SSOT для intake/chat/brief данных. LLM никогда не пишет напрямую в БД — только через backend storage layer.
- **Дата**: ≤ 2026-04
- **Контекст**: выбор между file-based / external SaaS / SQL-first. SQL-first даёт audit trail, transactional guarantees, и единую точку truth.
- **Последствия**: все маршруты persistence проходят через `web/src/lib/intake/storage.ts`; local/test DB smoke обязателен до live apply.

## ADR-002: Registry-pull deploy model
- **Решение**: build на WSL → push immutable tag в GHCR → VPS pull. Никаких `npm ci` / `npm run build` / `docker compose build` на VPS.
- **Дата**: ≤ 2026-04
- **Контекст**: VPS CPU слишком слабый для production builds; immutable tags обеспечивают reproducibility и rollback.
- **Последствия**: отдельные GHCR PATs (WSL write:packages, VPS read:packages); `COMPOSE_PROJECT_NAME=azursystech-site` фиксирован; rollback через previous known-good tag.

## ADR-003: Admin subdomain separation
- **Решение**: `admin.azursystech.fr` как отдельный Next.js app в отдельном Docker container с profile-gated compose activation.
- **Дата**: 2026-05
- **Контекст**: AZR-004 Facebook Social Automation требует admin UI. Отдельный app снижает blast radius и позволяет независимый deploy cycle.
- **Последствия**: `Dockerfile.admin`, compose `admin` profile, nginx host routing, отдельный health endpoint; production rollout — отдельный hard stop.

## ADR-004: Meta tokens in env vars for MVP
- **Решение**: Meta API tokens хранятся в environment variables на MVP этапе. Encrypted DB storage — до расширения OAuth/token lifecycle.
- **Дата**: 2026-05
- **Контекст**: MVP не требует token rotation UI; env vars проще и безопаснее на начальном этапе.
- **Последствия**: `.env` is Owner-only; tokens не логируются; при добавлении multi-page support потребуется DB migration для token storage.

## ADR-005: WSL npm isolation — никогда не запускать npm из Windows против WSL-путей
- **Решение**: Все npm-команды (`npm ci`, `npm run build`, `npm run check:types`, `npm install`) выполняются только из WSL bash/zsh shell (через nvm). Запуск из PowerShell/CMD против `\\wsl.localhost\...` путей запрещён.
- **Дата**: 2026-05-13
- **Контекст**: Windows npm оставил WSL `node_modules/.bin/` с 1 файлом вместо 19 — `tsc` и `next` отсутствовали. Причина: Windows npm пишет в свой кэш (`AppData\Local\npm-cache`) и не может корректно создать symlinks в WSL ext4 filesystem.
- **Последствия**: Правило зафиксировано в `vps-registry-pull-deploy/SKILL.md`; при сбоях — `rm -rf node_modules && npm ci` из WSL shell; Docker build всегда в Linux-контейнере и этой проблемы не имеет.

## ADR-006: npm audit — postcss moderate advisory на Next.js 16.2.6 игнорируется
- **Решение**: Остаточный advisory `postcss < 8.5.10` после upgrade до `next@16.2.6` считается false positive и не требует действий.
- **Дата**: 2026-05-13
- **Контекст**: npm registry CVE-диапазон для Next.js (`9.3.4-canary.0 – 16.3.0-canary.5`) ещё не обновлён после выхода `16.2.6`. `audit fix --force` предлагал даунгрейд до `next@9.3.3` — явный баг advisory. `postcss` в этом проекте обрабатывает только статичный Tailwind CSS; user input в CSS не попадает.
- **Последствия**: До обновления advisory в npm registry — `npm audit` возвращает exit 1 с 2 moderate. Добавить `audit-level=high` в `.npmrc` если это блокирует CI pipeline.

