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

---

## ADR-005: Source Tag SSOT = lead-taxonomy + Operational Tracking SSOT = Google Sheet

**Date:** 2026-03-13
**Status:** Accepted

### Context
В документах Facebook/website/leads появились расхождения по source-тегам (`messenger`, `facebook_group_*`, `unknown`), что создает риск неконсистентной аналитики и CRM-разметки.

### Decision
- Канонический список source tags определяется только в `03_leads/lead-taxonomy.md`.
- Разрешенные source tags:
  - `website_form`
  - `website_chat`
  - `facebook_page`
  - `facebook_group`
  - `facebook_messenger`
  - `direct`
  - `referral`
  - `google_business_profile`
  - `organic_search`
  - `unknown_source`
- Теги вида `facebook_group_*` используются только как campaign/group classification, не как source.
- Operational SSOT для группового трекинга — Google Sheet; markdown хранит только модель и правила.

### Consequences
- Сквозная сопоставимость лидов и аналитики между Facebook, сайтом и CRM.
- Снижение риска потери данных из-за разных схем source-тегов.
- Быстрая операционная работа через живой tracking sheet без конфликтов с markdown.

---

## ADR-006: AI Runtime Enforces Structured Output for Schema-Bound Agents

**Date:** 2026-03-13
**Status:** Accepted

### Context
Документы `05_ai/*` уже описывали строгие output contracts и escalation fields, но runtime `scripts/ai_agents.py` до этого сохранял только raw text и keyword-based escalation, без машинной валидации.

### Decision
- Для schema-bound agents runtime валидирует structured model output перед сохранением run result.
- Для `lead_router` escalation status определяется по полю `escalation_required`, а не по keyword scan.
- Keyword-based escalation остается только fallback-механизмом для агентов без structured schema.
- Parsed structured output сохраняется в run artifact как `parsed_output`.

### Consequences
- Runtime ближе к enforceable MVP, а не только document-driven prototype.
- Ошибки формата всплывают сразу при вызове агента.
- Интеграция с CRM/handoff становится предсказуемее.

---

## ADR-007: Default AI Provider = DeepSeek

**Date:** 2026-03-13
**Status:** Accepted

### Context
Runtime `scripts/ai_agents.py` был привязан к `OPENAI_API_KEY` и OpenAI Responses API, хотя для проекта принято решение использовать DeepSeek как базового провайдера.

### Decision
- Базовый live-runtime провайдер для `05_ai` переведен на DeepSeek.
- Канонические runtime secrets:
  - `DEEPSEEK_API_KEY`
  - `DEEPSEEK_BASE_URL`
- Default model в agent registry: `deepseek-chat`.
- CLI использует DeepSeek Chat Completions API и соответствующий response shape.

### Consequences
- Локальный запуск и VPS runtime теперь согласованы с выбранным провайдером.
- Для live-run больше не подходит старый `OPENAI_API_KEY` contract.
- Если позже потребуется multi-provider runtime, его нужно вводить отдельным ADR, а не ad hoc переменными.

---

## ADR-008: Launch Contact Baseline = Phone + WhatsApp; Launch AI Mode = Limited Live Intake

**Date:** 2026-03-13
**Status:** Accepted

### Context
Для `AZR-003 go-live readiness` нужно было явно закрыть два launch decision area:
- public contact path at launch;
- AI runtime mode at launch.

### Decision
- Public phone at launch:
  - `+33 7 49 70 54 65`
- Public WhatsApp at launch:
  - same number `+33 7 49 70 54 65`
- Launch contact model:
  - form
  - phone
  - WhatsApp
  - site chat
- Launch AI mode:
  - `limited live intake`
  - intake + summary + handoff only
  - no autonomous outbound sending
  - no pricing commitments
  - no scheduling promises

### Consequences
- Contact UX and legal/public contact data can now be aligned across website, Facebook, and GBP.
- Analytics should treat phone and WhatsApp clicks as active launch events, not future placeholders.
- AI remains useful at launch without crossing into risky autonomous client communication.
