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

---

## ADR-009: Launch Deploy Path = GitHub Actions SSH + Git Pull + Docker Build on VPS

**Date:** 2026-03-13
**Status:** Accepted

### Context
Первичный deploy-контур был собран вокруг `GHCR` и immutable image tags, но фактический launch setup использует минимальный GitHub repo `oleyna80/azursystech-site`, VPS checkout в `/home/dmitrii/projects/azursystech-site`, и SSH-based deploy без настроенных `GHCR_*` secrets.

### Decision
- Launch deploy path переводится на `CI -> Deploy to VPS`.
- `Deploy to VPS` обновляет git checkout на VPS и выполняет `docker compose up -d --build`.
- Production app image собирается непосредственно на VPS из текущего commit checkout.
- `GHCR_USERNAME` и `GHCR_TOKEN` не требуются для launch baseline.
- ADR-004 не удаляется, но для launch-phase superseded этим решением.

### Consequences
- Deploy контур становится проще и совместим с текущей operational reality.
- Rollback выполняется через git history, а не через immutable image tags.
- Позже можно вернуться к registry-based deploy, если понадобится более быстрый rollback и artifact traceability.

---

## ADR-010: Launch AI Runtime Policy Enforced via Env Flags

**Date:** 2026-03-13
**Status:** Accepted

### Context
Safe launch mode для AI уже был описан в `AZR-003` и docs, но не был зафиксирован как runtime configuration contract. Это оставляло риск, что live runtime будет запущен без явных ограничений по outbound, pricing, или scheduling behavior.

### Decision
- Runtime получает канонические launch policy env flags:
  - `AI_LAUNCH_MODE`
  - `AI_ALLOW_AUTONOMOUS_OUTBOUND`
  - `AI_ALLOW_PRICING_COMMITMENTS`
  - `AI_ALLOW_SCHEDULING_PROMISES`
- Launch default:
  - `AI_LAUNCH_MODE=limited_live_intake`
  - все три `AI_ALLOW_*` flags = `false`
- `scripts/ai_agents.py` валидирует эти флаги при запуске.
- Runtime policy добавляется в prompt context и сохраняется в run artifacts.

### Consequences
- Safe launch mode больше не живет только в документации.
- Misconfiguration всплывает на runtime startup, а не после нежелательного поведения агента.
- Lead agent получает явные prompt-level guardrails для intake-only launch behavior.

---

## ADR-011: Delivery Workflow = Tech Lead Tasking + RooCode Implementation + Tech Lead Review

**Date:** 2026-03-14
**Status:** Accepted

### Context
После стабилизации docs, deploy baseline и runtime contracts проект перешел в implementation phase. Для скорости и снижения context drift нужен стабильный execution loop между текущим агентом и RooCode.

### Decision
- Текущий агент работает как `Tech Lead`, а не как primary coder.
- Основной код пишет `RooCode`.
- Стандартный цикл работы:
  1. Tech Lead формулирует task со scope, SSOT, AC и constraints
  2. RooCode реализует и возвращает structured report
  3. Tech Lead делает review
  4. Follow-up corrections при необходимости снова уходят RooCode
- К пользователю эскалируются только product/ops decisions, которые нельзя безопасно вывести из документов.

### Consequences
- Снижается риск, что implementation уйдет от SSOT между сессиями.
- Review становится отдельным обязательным шагом, а не опциональной проверкой.
- Context continuity теперь должна фиксировать не только code/runtime state, но и delivery mode.

---

## ADR-012: Multi-Agent Project Execution Uses Parallel Streams With Control Tower SSOT

**Date:** 2026-03-14
**Status:** Accepted

### Context
Проект одновременно ведет website implementation, VPS/n8n integration и HubSpot CRM setup. Без отдельного control layer промежуточные решения начинают конфликтовать и теряется continuity между чатами.

### Decision
- Execution разбивается на параллельные stream'ы.
- Этот чат работает как control tower и держит SSOT по решениям.
- Все stream'ы возвращают итог только в 5-пунктовом формате:
  1. What was done
  2. Decisions made
  3. Files / settings changed
  4. Open blockers
  5. Next recommended action

### Consequences
- Снижается context noise в control layer.
- Повышается управляемость параллельной работы.
- Все принятые решения нужно явно возвращать в SSOT, иначе stream считается незавершенным.

---

## ADR-013: Public MVP Launches in Russian for the Russophone Audience on the Côte d'Azur

**Date:** 2026-03-14
**Status:** Accepted

### Context
Нужно было снять tension между local French market, local SEO и фактическим launch scope сайта. Без явного решения implementation мог метаться между RU-first и FR-first публичным интерфейсом.

### Decision
- Public MVP website launches in Russian.
- Primary launch audience: russophone residents and small businesses on the Côte d'Azur.
- French and English versions move to phase 2 after MVP validation.
- German remains optional later expansion.

### Consequences
- Copy, routes and UI can be implemented without waiting for FR/EN localization.
- SEO/public expansion to French moves into later iteration planning.
- Docs may remain multilingual internally, but public MVP output should stay Russian-first.

---

## ADR-014: Launch CRM SSOT = HubSpot Only

**Date:** 2026-03-14
**Status:** Superseded by ADR-018 for launch baseline

### Context
Initial docs still allowed a dual model with CRM plus Google Sheets fallback. For launch operations this created ambiguity in the intake path, reporting model and future n8n integration.

### Decision
- HubSpot is the only launch CRM SSOT.
- Google Sheets is no longer the standard launch operating path.
- Website, lead intake, AI handoff and ops docs should refer to CRM as the primary destination.

### Consequences
- Intake and reporting assumptions become simpler.
- Future `site -> n8n -> HubSpot` integration can be specified against one target.
- Any future spreadsheet use should be treated as contingency or export, not baseline CRM.

---

## ADR-015: MVP Visual Direction = Local Professional

**Date:** 2026-03-14
**Status:** Accepted

### Context
Frontend implementation moved from page contracts into actual UI work. Without an approved visual direction, parallel page implementation risked drifting into generic, inconsistent, or overly technical layouts.

### Decision
- Approved MVP visual direction: `Local Professional`.
- Design intent:
  - local
  - trustworthy
  - practical
  - calm
  - human
  - structured
- MVP palette baseline:
  - background: `#F6F1E8`
  - surface: `#FFFDFC`
  - text: `#1F2A37`
  - primary accent: `#1F6F78`
  - secondary accent: `#C96F4A`
  - border: `#D8D0C4`
- Layout/visual constraints:
  - no generic startup purple
  - no cold corporate look
  - no noisy gradients
  - no stock-photo clutter
  - no dark-mode-first bias

### Consequences
- Agent + RooCode stream now has a stable visual contract for MVP routes.
- Existing and upcoming pages should be reviewed not only for content drift, but also for visual-system drift.
- Later visual iteration remains allowed after MVP, but changes should start from this baseline rather than from an unbounded style search.

---

## ADR-016: Site -> n8n Transport Contract v1 = JSON POST With Bearer Auth and Idempotency Header

**Date:** 2026-03-15
**Status:** Accepted

### Context
`/contact` already had a safe server-side submit boundary, but the outbound `site -> n8n` hop stayed blocked because endpoint, auth, timeout, retry, idempotency, and response semantics had never been fixed with exact values.

### Decision
- Approved `v1` transport path:
  - `/webhook/azursystech/contact-submit`
- Approved request contract:
  - method: `POST`
  - `Content-Type: application/json`
  - `Authorization: Bearer <token>`
  - `X-Contract-Version: 1`
  - `X-Idempotency-Key: <uuid-v4>`
- Approved runtime behavior:
  - website timeout: `10s`
  - website retries: `0`
  - idempotency dedupe window: `24h`
- Approved response contract:
  - `200 {"status":"accepted","request_id":"..."}`
  - `503 {"status":"temporary_failure","message":"...","request_id":"..."}`
  - `400|401|403|422 {"status":"rejected","message":"...","request_id":"..."}`
- Approved operational constraints:
  - exposure mode: `proxy-protected`
  - no secrets in repo/docs/logs/error payloads
  - raw request bodies and auth headers must not be logged

### Consequences
- Site adapter implementation can proceed against a fixed transport contract without guessing.
- Current route may still return `integration_not_ready` until runtime adapter/config is implemented.
- HubSpot object/property mapping remains a separate follow-up and no longer blocks transport-baseline approval.

---

## ADR-017: HubSpot MVP Object Model = Contact (Standard Fields) + Deal (Custom Properties) + Note (Overflow)

**Date:** 2026-03-15
**Status:** Accepted as future CRM reference; superseded by ADR-018 for launch baseline

### Context
Transport contract (ADR-016) was approved but the outbound hop could not proceed without a locked HubSpot object model and property mapping. The CRM stream proposed an initial mapping that required corrections to align with site payload enums and canonical source taxonomy.

### Decision
- **Contact** uses only standard HubSpot fields: `firstname`, `phone`, `email`, `city`, `company`. No custom contact properties at MVP.
- **Deal** uses standard `dealstage` + 7 custom properties:
  - `lead_segment` (dropdown): `particulier`, `tpe`
  - `service_type` (dropdown): 9 values from `contact-submit.ts`
  - `urgency` (dropdown): `urgent`, `standard`, `planning`
  - `lead_source` (dropdown): 10 values from `lead-taxonomy.md`
  - `problem_summary` (text): mapped from site `problem_description`
  - `device_count` (dropdown): `1`, `2-3`, `4-10`, `10+`
  - `onsite_required` (dropdown): `yes`, `no`, `not_sure`
- **Note** on Deal at creation: structured text with all segment-specific overflow fields (TPE: `business_type`, `workstation_count`, `business_needs`, `business_address`; Particulier: `home_device_type`, `device_state`, `home_need_type`; Common: raw `problem_description`).
- `name` maps to `firstname`; `lastname` left empty, not parsed.
- 5 corrections applied to CRM stream proposal values/types (service_type, urgency, lead_source values; device_count and onsite_required field types).

### Consequences
- n8n workflow can now map site payload to HubSpot objects without guessing property names or types.
- Dropdown enums are 1:1 with site payload, eliminating runtime re-mapping.
- Segment-specific data preserved in Notes avoids custom-field sprawl on free HubSpot tier.

---

## ADR-018: Launch Execution Order = Website Closure -> n8n + Google Sheets -> AI Widget + Telegram -> CRM Later

**Date:** 2026-03-19
**Status:** Accepted

### Context
К марту 2026 сайт уже вышел на стабильный MVP baseline, но launch path оставался перегружен одновременными ожиданиями по `n8n`, AI widget, Telegram notifications и HubSpot CRM. Это делало go-live unnecessarily complex и затягивало closure по самому сайту.

### Decision
- Приоритетный launch sequence фиксируется так:
  1. полностью закрыть website scope;
  2. включить `site -> n8n -> Google Sheets`;
  3. после стабилизации intake path включить live AI widget integration + Telegram notification;
  4. CRM перенести на phase 2.
- Google Sheets разрешен как launch intake log и operational board.
- HubSpot больше не считается launch blocker.
- ADR-014 и ADR-017 остаются как historical CRM references, но больше не задают launch baseline.
- ADR-016 сохраняет силу без изменений: transport contract `site -> n8n` остается активным baseline.

### Consequences
- Launch scope упрощается и снова фокусируется на реально нужных зависимостях.
- Сайт можно закрыть до интеграционного слоя без ожидания CRM setup.
- `n8n` workflow может запускаться против Google Sheets без HubSpot private app token и property provisioning.
- AI widget и Telegram notifications становятся controlled step after the primary form intake path proves stable.
