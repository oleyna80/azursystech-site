# Progress Log - AzurSysTech

## 2026-03-12: AI Runtime Scaffold

### Done

- Добавлен CLI runtime: `scripts/ai_agents.py`.
- Добавлены агенты и реестр: `05_ai/agents/registry.json`.
- Добавлены prompt templates и example payloads.
- Добавлены run artifacts pipeline + approval note generation.
- Заполнены документы в `05_ai/*`.

### Validation

- `python3 -m py_compile scripts/ai_agents.py` - pass
- `./scripts/ai_agents.py list` - pass
- `./scripts/ai_agents.py run ... --dry-run` - pass

## 2026-03-12: Agent Ops Bootstrap

### Done

- Добавлен `AGENTS.md` для проекта.
- Добавлена структура `.agent/`:
  - roles (`ROSTER.md`)
  - workflow (`workflows/sdd-protocol.md`)
  - rules (`rules/*`)
  - skills (`skills/*`)
- Инициализирован `memory_bank/`.
- Добавлены templates в `docs/specs|plans|tasklist|reports|sdd_templates`.

### Next

- Определить первый активный тикет для content/leads и перейти в execution.

## 2026-03-12: AZR-001 Handoff Package Created

### Done

- Зафиксирован активный рабочий контур для `AZR-001`:
  - `docs/specs/AZR-001-facebook-page-copy.md`
  - `docs/plans/AZR-001-facebook-page-copy-plan.md`
  - `docs/tasklist/AZR-001.tasklist.md`
  - `docs/reports/AZR-001-techlead-to-coder.md`
- Подготовлен реальный handoff `Tech Lead -> Coder` с SLA и AC.

### Next

- Выполнить перепись `01_brand/facebook-page-copy.md` в FR-first формате.
- Передать на review через handoff `Coder -> Reviewer`.

## 2026-03-12: Website Infra Bootstrap (VPS Chain)

### Done

- Добавлен production-ready web runtime в `web/`:
  - `next.config.ts` с `output: "standalone"`
  - `src/app/health/route.ts` (`GET /health`)
  - базовая стартовая страница и metadata
- Добавлен infra-контур в корне проекта:
  - `Dockerfile`
  - `docker-compose.yml`
  - `docker-compose.vps.yml`
  - `nginx.proxy.conf`
  - `.env.vps.example`
  - `deploy.sh`
  - `scripts/backup-env.sh`
- Добавлены GitHub workflows:
  - `.github/workflows/ci.yml`
  - `.github/workflows/docker-publish.yml`
  - `.github/workflows/deploy-vps.yml`
  - `.github/workflows/uptime-monitor.yml`
- Добавлены runbooks:
  - `docs/deployment/github-vps.md`
  - `docs/deployment/backup-restore-runbook.md`
- Удален случайно созданный вложенный git-репозиторий `web/.git`.

### Next

- Прописать реальные значения secrets/vars в GitHub.
- Скопировать runtime файлы на VPS и выполнить first deploy immutable tag `sha-*`.
