# Architectural Decisions - AzurSysTech

## ADR-001: AI Drafts Require Human Approval

**Date:** 2026-03-12
**Status:** Accepted

### Context
Для нового локального сервиса высок важен бренд-тон и точность обещаний.

### Decision
Любой AI-сгенерированный ответ/контент в production каналы проходит human approval.

### Consequences
- Пониженный риск репутационных ошибок.
- Более медленный throughput на старте.

---

## ADR-002: Minimal Agent Runtime First

**Date:** 2026-03-12
**Status:** Accepted

### Context
Проект на bootstrap-этапе, важно быстро получить работающий контур.

### Decision
Сначала внедряется простой CLI runtime (`scripts/ai_agents.py`) с JSON registry/prompt templates, без сложной оркестрации.

### Consequences
- Быстрый старт и легкая отладка.
- Позже потребуется эволюция к интеграциям (CRM/messaging).

---

## ADR-003: Agent Operations Standardized via .agent + memory_bank

**Date:** 2026-03-12
**Status:** Accepted

### Context
Нужна унификация процесса между несколькими агентами и сессиями.

### Decision
Ввести стандартный контур: `AGENTS.md`, `.agent/*`, `memory_bank/*`, task artifacts в `docs/`.

### Consequences
- Снижается риск потери контекста.
- Повышается предсказуемость handoff между агентами.

---

## ADR-004: Deploy Stack = Next.js Standalone + Docker + GHCR + VPS Compose

**Date:** 2026-03-12
**Status:** Accepted

### Context
Нужен быстрый и предсказуемый путь до production на собственном VPS, без managed PaaS.

### Decision
В качестве production-контура принят стек:
- `Next.js` в `web/` с `standalone` output;
- multi-stage `Dockerfile` на базе `node:22-alpine`;
- цепочка GitHub Actions: `CI -> Docker Publish -> Deploy to VPS`;
- immutable deploy source только через `sha-*` теги;
- runtime на VPS через `docker-compose.vps.yml` (`app` + `nginx` reverse proxy).

### Consequences
- Быстрый rollout/rollback по immutable image tag.
- Прозрачный self-hosted контур под контроль VPS.
- Нужно поддерживать secrets, GHCR доступ и регулярный uptime monitoring.
