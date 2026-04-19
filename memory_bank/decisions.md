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
  - current: `+33 7 80 72 09 94`
  - legacy/deprecated reference: `+33 7 49 70 54 65`
- Public WhatsApp at launch:
  - current: same number `+33 7 80 72 09 94`
  - legacy/deprecated reference: `+33 7 49 70 54 65`
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

---

## ADR-019: Current Website Baseline = `web`; `frontend_mvp` Is Historical Reference

**Date:** 2026-04-13
**Status:** Accepted

### Context
`frontend_mvp` использовался как отдельный дизайн/template sandbox для ускоренной визуальной и продуктовой итерации. После parity work и переноса релевантных наработок возник риск, что документы продолжат трактовать `frontend_mvp` как активный baseline, хотя production/runtime/deploy контур и текущая реализация уже должны идти через `web`.

### Decision
- Текущий website/design/runtime/deploy baseline — `web`.
- `frontend_mvp` больше не является active baseline для launch-critical работ.
- `frontend_mvp` сохраняется только как historical/reference artifact.
- Все следующие launch-critical implementation streams, включая `AZR-003-011`, должны таргетировать `web`.

### Consequences
- Убирается baseline drift между template sandbox и production runtime.
- `AZR-003-012` считается закрытым по baseline selection/parity purpose.
- Новые изменения для сайта не должны выполняться в `frontend_mvp`, если это не отдельная явно sandboxed дизайн-задача.

---

## ADR-020: Intake Architecture Pivot = Backend-First SQL Core; n8n Is Optional Automation Layer

**Date:** 2026-04-13
**Status:** Accepted

### Context
Исторический launch intake path `site -> n8n -> Google Sheets` был успешно активирован как промежуточный operational baseline. После стабилизации `web` и принятия SQL foundation в backend стало критично убрать dual-primary ambiguity и закрепить единый intake контур для формы, сайт-чата и будущего WhatsApp-ассистента.

### Decision
- Primary intake path фиксируется как backend-first:
  - `web channels -> /api/* -> server validation/normalization -> PostgreSQL`.
- PostgreSQL становится primary system of record для intake.
- `n8n` больше не считается обязательным launch/runtime intake hop:
  - может использоваться только как optional automation/export layer.
- Унифицированный normalized intake contract обязателен для всех каналов (`website_form`, `website_chat`, `whatsapp_chat`).
- Backend отвечает за intake-side integrations (например: Telegram notifications, email dispatch, Sheets export) без требования n8n как обязательного посредника.

### Consequences
- Intake reliability больше не зависит от внешнего workflow-рантайма в критическом пути.
- Упрощается дальнейшая реализация чат-ассистента и WhatsApp-канала за счет единого backend contract.
- ADR-018 сохраняется как historical launch sequencing reference, но его часть про `site -> n8n -> Google Sheets` как baseline intake path больше не актуальна для текущей primary architecture.
- ADR-016 сохраняется как optional transport reference для случаев, когда backend явно использует n8n как secondary automation hop.

---

## ADR-021: `/brief` MVP Uses Dedicated Structured Payload Endpoint

**Date:** 2026-04-17
**Status:** Accepted for `/brief` MVP

### Context
Страница `/brief` собирает discovery brief по AI-автоматизации. Ее схема отличается от текущей support/contact intake model: там нет `service_type`, `segment`, city/device fields и других обязательных полей contact-flow. Принудительное сохранение brief в существующий contact contract создало бы fake values и schema drift.

### Decision
- `/brief` uses a separate endpoint:
  - `POST /api/brief/submit`
- Canonical payload:
  - `schema_version: brief.v1`
  - `source: brief_form`
  - `route: /brief`
  - `locale: ru`
  - `brief`
  - `metadata`
  - `crm_handoff`
- UI and API share the same schema/validation module:
  - `web/src/lib/brief-submit.ts`
- MVP behavior:
  - validate and normalize the brief;
  - return a structured discovery payload and handoff for human review;
  - do not force the brief through the existing `/api/contact/submit` SQL/contact model.
- Durable PostgreSQL persistence for brief submissions is deferred to a later backend pass with a dedicated table or generic intake entity model.

### Consequences
- `/brief` can ship without corrupting the existing contact lead schema.
- Human review receives a clean, CRM-ready discovery brief object.
- Production persistence/reporting for brief submissions remains a follow-up and must not be assumed complete until a dedicated storage migration lands.

---

## ADR-022: Subagent Model / Reasoning Selection Is Role- and Risk-Based

**Date:** 2026-04-18
**Status:** Accepted

### Context
Проект использует `Tech Lead / Control Tower / Orchestrator` режим с internal subagents и stage roles `Reviewer`, `Coder`, `Verifier`. Без явного правила выбора model/reasoning возникает риск случайно использовать слишком слабый режим для SSOT, runtime, deploy, legal/contact или AI policy решений, либо слишком дорогой режим для узких механических задач.

### Decision
- Subagents inherit parent session model/reasoning by default.
- Model/reasoning override разрешен только при явном обосновании типом задачи, риском, стоимостью или скоростью.
- Перед запуском subagent Control Tower фиксирует stage, objective, role, override если есть, и expected result.
- Выбор model/reasoning задается по роли и риску:
  - `Reviewer`: higher reasoning for architecture, planning, AC, risks, SSOT-impacting decisions; read-only.
  - `Coder`: smaller/medium settings for narrow scoped changes, stronger coding model and higher reasoning for cross-layer or runtime-sensitive implementation.
  - `Verifier`: medium reasoning for routine checks, high reasoning for release-critical, security, deploy/runtime, secrets, or SSOT validation; verification-only.
- Для production behavior, secrets, legal/contact baseline, deploy/runtime assumptions, CRM contracts, AI runtime policy и SSOT нельзя оптимизировать за счет надежности.

### Consequences
- Multi-agent execution becomes more predictable and auditable.
- Cost/speed can be optimized for narrow work without weakening high-risk decisions.
- Handoff quality improves because role, model/reasoning choice, and expected result are explicit before execution.
- Specific model names remain recommendations/examples, not a permanent architectural dependency.

---

## ADR-023: Confirmation Unit = Approved Work Block

**Date:** 2026-04-18
**Status:** Accepted

### Context
Multi-agent execution currently uses internal stage roles (`Reviewer`, `Coder`, `Verifier`) under `Tech Lead / Control Tower`. Requiring explicit confirmation between every internal stage creates unnecessary latency for a single approved task, especially when the objective and scope are unchanged.

### Decision
- The default confirmation unit is now an approved work block, not each internal stage.
- A work block is one approved objective/scope and may include multiple internal stages such as `Reviewer -> Coder -> Verifier`.
- Inside an approved work block, Control Tower may proceed between internal stages without additional confirmation if:
  - objective and scope remain unchanged;
  - no dangerous action is needed;
  - each stage states `stage`, `objective`, `role`, and `expected result`;
  - role constraints remain enforced.
- Control Tower must request new confirmation for:
  - scope/objective changes;
  - new ticket or work package;
  - files outside approved scope;
  - deploy or infrastructure changes;
  - secrets, production data, or real client communication;
  - destructive actions;
  - blockers requiring product/ops decisions;
  - verification failures that require materially new scope.

### Consequences
- Approved tasks can run end-to-end with less interruption.
- Stage discipline remains visible without forcing user confirmation on every role transition.
- Risk controls stay explicit for deploy, infra, secrets, production data, client-facing actions, destructive actions, and scope expansion.
- Final reporting must summarize internal stages, checks, risks, and follow-ups for the whole work block.

---

## ADR-024: Work Block Readiness, Model Fallback, and Verification Guardrails

**Date:** 2026-04-18
**Status:** Accepted

### Context
After adopting approved work blocks, the process needs stronger upfront framing and repeatable verification so fewer confirmations do not reduce control. The first subagent test also showed that recommended models can be unavailable in the current account/session, so model fallback must be explicit.

### Decision
- Every approved work block should start from a brief that states objective, scope, write-set, out-of-scope, AC, internal stages, model/reasoning plan, stop conditions, verification matrix, and expected final report.
- Implementation should satisfy Definition of Ready before `Coder` starts:
  - active baseline is known;
  - SSOT/source documents are known;
  - scope/write-set and AC are clear;
  - dangerous-action and secrets/production/client-data boundaries are explicit;
  - Memory Bank/tasklist update requirements are known.
- Verifier uses a matrix based on change type:
  - markdown/process;
  - content/brand/legal/contact;
  - frontend UI;
  - API/runtime logic;
  - DB/storage/intake;
  - security/secrets/runtime policy;
  - deploy/infra.
- If a recommended model is unavailable, Control Tower should prefer upward fallback to a stronger available model:
  - same family stronger model when available;
  - strongest available general model for the role;
  - inherited parent session model when it is safer than guessing a weaker model.
- For high-risk work, model/reasoning downgrade requires explicit user confirmation.
- If the environment supports a cheap read-only model availability check, Control Tower may use it before a critical work block. If not, failed subagent launch is treated as the availability signal and retried once with the nearest stronger available model.

### Consequences
- Work blocks become easier to launch end-to-end without losing scope control.
- Coder stages start with clearer readiness criteria and fewer hidden assumptions.
- Verifier stages become more consistent and less ad hoc.
- Model availability failures become recoverable without weakening high-risk tasks.
- The process stays flexible because exact model names remain examples rather than hard dependencies.
