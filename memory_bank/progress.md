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

## 2026-03-13: Facebook Group Outreach Spec Hardening

### Done

- Обновлен `04_facebook/groups-outreach-list.md`:
  - добавлены секции `SSOT tracking location`, `Field schema for tracking sheet`, `Concrete first 10 groups`, `Source mapping table`, `UTM convention`;
  - удалены конфликтующие source tags вида `facebook_group_*` из source-слоя, оставлены только как classification tags.
- Обновлен `03_leads/lead-intake-spec.md`:
  - `messenger` заменен на `facebook_messenger`;
  - source list расширен до SSOT-набора.
- Обновлен `02_website/analytics-spec.md`:
  - source buckets синхронизированы с `03_leads/lead-taxonomy.md`;
  - UTM examples выровнены с протоколом `[topic]`.

### Validation

- Выполнен repo-wide grep по source-tagам и конфликтным legacy-тегам.
- Конфликтующие теги `facebook_group_local|...` в source-контексте удалены.

## 2026-03-13: Approval Workflow Doc Fixes

### Done

- Исправлена Markdown-разметка в `05_ai/approval-workflow.md`:
  - починен сломанный code fence в секции workflow;
  - удален лишний завершающий fence в конце файла.
- Убрано расхождение с `AGENTS.md` по логированию:
  - в MVP note зафиксированы structured run artifacts в `05_ai/runs/` вместо internal markdown log.

### Validation

- Проверены все code fences через `rg`.
- Проверен хвост документа и секция `Auditability and logging`.

## 2026-03-13: Escalation Rules + Lead Agent Contract Alignment

### Done

- Исправлена Markdown-разметка в `05_ai/escalation-rules.md`:
  - починен code fence в секции escalation output example;
  - удален лишний завершающий fence в конце файла.
- Выровнен контракт escalation note:
  - `lead_segment` заменен на `lead_type` в соответствии с `05_ai/lead-agent-spec.md`.
- Расширен output contract в `05_ai/lead-agent-spec.md`:
  - добавлены `escalation_level`, `escalation_category`, `risk_reason`, `suggested_human_action`;
  - зафиксировано правило `null` для неэскалированных кейсов.

### Validation

- Проверены все code fences через `rg`.
- Перепроверены секции output contract и escalation example на совпадение полей.

## 2026-03-13: Content Engine Spec Doc Fixes

### Done

- Исправлена Markdown-разметка в `05_ai/content-engine-spec.md`:
  - починен code fence в секции content generation workflow.
- Обновлена секция `Next file to create`:
  - удалена устаревшая ссылка на уже существующий `lead-agent-spec.md`;
  - next step приведен к текущему состоянию блока `05_ai`.

### Validation

- Проверены code fences через `rg`.
- Проверен хвост документа и секция `Next file to create`.

## 2026-03-13: Lead Agent Spec Fixes and Prompt Alignment

### Done

- Исправлена Markdown-разметка в `05_ai/lead-agent-spec.md`:
  - удален лишний открывающий fence в начале файла;
  - починен code fence в CRM handoff example;
  - удалены лишние fences в конце файла.
- Уточнен контракт слоев данных в `05_ai/lead-agent-spec.md`:
  - разделены runtime fields и CRM handoff fields;
  - добавлено явное mapping rule `lead_type -> lead_segment`;
  - запрещены несуществующие `unknown_*` теги вне taxonomy.
- Выровнен prompt contract в `05_ai/prompts/lead_router_system.md`:
  - добавлены `escalation_level`, `escalation_category`, `risk_reason`, `suggested_human_action`;
  - зафиксировано правило `null` для неэскалированных кейсов.

### Validation

- Проверены code fences через `rg`.
- Перепроверены секции taxonomy mapping, CRM handoff example и output format в prompt template.

## 2026-03-13: Content Prompt Library Sanity Fix

### Done

- Обновлен `05_ai/prompt-library-content.md`:
  - в master prompt добавлено явное правило `draft until human approval`;
  - секция `Next file to create` приведена к текущему состоянию блока `05_ai` и больше не ссылается на уже существующий `prompt-library-support.md`.

### Validation

- Проверен хвост документа.
- Проверено наличие approval guardrail и отсутствие stale next-step ссылки.

## 2026-03-13: Support Prompt Library Contract Alignment

### Done

- Обновлен `05_ai/prompt-library-support.md`:
  - в master support prompt добавлено правило `draft until human approval`;
  - выходы support prompts выровнены с `05_ai/lead-agent-spec.md` и `05_ai/escalation-rules.md`;
  - `needs_escalation` заменен на `escalation_required`;
  - `recommended_human_action` заменен на `suggested_human_action`;
  - `fit_level` заменен на taxonomy-aligned `lead_quality`;
  - `later` в follow-up stages заменен на `follow_up_later`;
  - founder handoff package расширен escalation fields.

### Validation

- Проверен хвост документа.
- Выполнен grep по ключевым contract fields и status names.

## 2026-03-13: AI Runtime Contract Enforcement

### Done

- Обновлен `scripts/ai_agents.py`:
  - добавлен structured output parser/validator для schema-bound agents;
  - `lead_router` теперь может сохранять `parsed_output` в run artifact;
  - escalation status теперь берется из model-declared field `escalation_required`, а keyword fallback используется только для агентов без structured schema;
  - добавлена cross-field validation для escalation details.
- Обновлен `05_ai/agents/registry.json`:
  - добавлена `structured_output` schema для `lead_router`;
  - расширены `context_files` для `lead_router` и `content_writer` актуальными `05_ai` specs;
  - runtime-context теперь ближе к реальным contracts.
- Обновлен `05_ai/examples/lead_router_input.json`:
  - `source` заменен на SSOT-aligned `facebook_messenger`.
- Обновлен `05_ai/README.md`:
  - runtime behavior синхронизирован с новой structured validation logic.

### Validation

- `python3 -m py_compile scripts/ai_agents.py` - pass
- `./scripts/ai_agents.py run --agent lead_router --input-file 05_ai/examples/lead_router_input.json --dry-run` - pass
- `./scripts/ai_agents.py run --agent content_writer --input-file 05_ai/examples/content_writer_input.json --dry-run` - pass
- parser smoke test for valid and invalid `lead_router` structured output - pass

## 2026-03-13: DeepSeek Provider Switch for AI Runtime

### Done

- Обновлен `scripts/ai_agents.py`:
  - runtime переведен с OpenAI Responses API на DeepSeek Chat Completions API;
  - `OPENAI_API_KEY` заменен на `DEEPSEEK_API_KEY`;
  - `OPENAI_BASE_URL` заменен на `DEEPSEEK_BASE_URL`;
  - default model заменена на `deepseek-chat`;
  - extraction logic адаптирована под `choices[].message.content`.
- Обновлен `05_ai/agents/registry.json`:
  - default model для `lead_router` и `content_writer` заменена на `deepseek-chat`.
- Обновлены runtime docs:
  - `README.md`
  - `05_ai/README.md`
  - `AGENTS.md`
  - `.env.vps.example`

### Validation

- `python3 -m py_compile scripts/ai_agents.py` - pass
- `./scripts/ai_agents.py run --agent lead_router --input-file 05_ai/examples/lead_router_input.json --dry-run` - pass
- `./scripts/ai_agents.py run --agent content_writer --input-file 05_ai/examples/content_writer_input.json --dry-run` - pass

## 2026-03-13: Reviews System Doc Repair

### Done

- Исправлен `06_seo/reviews-system.md`:
  - удален лишний открывающий code fence в начале файла;
  - починен code fence в секции `Review request workflow`;
  - удалены лишние пустые fences в конце файла.
- Добавлен operational contract в секцию tracking:
  - зафиксирован SSOT для review tracking (`CRM` after `won`, `Google Sheet` as fallback);
  - добавлен mapping review statuses к CRM/follow-up действиям;
  - добавлено правило немедленного обновления статуса после review touchpoint.
- Обновлен устаревший `Next file to create`:
  - вместо уже существующего `service-pages-plan.md` указан новый логичный следующий артефакт `local-citations-plan.md`.

### Validation

- `rg -n '^```|^````' 06_seo/reviews-system.md` - pass
- проверен хвост файла и секция tracking/status mapping - pass

## 2026-03-13: Deploy Baseline Simplified to Build on VPS

### Done

- Обновлен `docker-compose.vps.yml`:
  - `app` теперь собирается из локального `Dockerfile` на VPS;
  - runtime больше не требует `IMAGE_REPO` и `IMAGE_TAG`.
- Обновлен `.github/workflows/deploy-vps.yml`:
  - trigger переведен на успешный `CI`, а не на `Docker Publish`;
  - deploy выполняет `git pull --ff-only origin main` на VPS;
  - runtime поднимается через `docker compose up -d --build --remove-orphans`.
- Обновлен `.github/workflows/docker-publish.yml`:
  - automatic trigger removed;
  - GHCR publish path оставлен только как manual fallback.
- Обновлен runbook `docs/deployment/github-vps.md` под source-based deploy без `GHCR_*`.
- Зафиксировано архитектурное решение `ADR-009`.

### Validation

- `docker compose -f docker-compose.vps.yml config` - pass
- workflow YAML checked via local readback - pass

## 2026-03-13: Next.js Container Healthcheck Fix

### Done

- Обновлен `Dockerfile`:
  - runtime теперь явно задает `HOSTNAME=0.0.0.0` для standalone Next.js.
- Обновлен `docker-compose.vps.yml`:
  - app environment дополнен `HOSTNAME=0.0.0.0`;
  - healthcheck больше не бьет в `127.0.0.1`, а использует фактический container IP.
- Обновлен `docker-compose.yml` для локального parity.
- Обновлены `.env.vps.example` и `docs/deployment/github-vps.md`.

### Validation

- локальный `docker run` smoke test showed `/health` = `200`
- container listen socket inspected: app was binding to container IP, not loopback

## 2026-03-13: Reviews System Tail Formatting Fix

### Done

- Повторно проверен `06_seo/reviews-system.md`.
- Исправлены только форматные ошибки в хвосте файла:
  - `## 330` -> `## 30`
  - имя следующего файла оформлено как inline code
  - пункты под `It must define:` возвращены в markdown list

### Validation

- проверен хвост файла через `tail` и `nl`

## 2026-03-13: Management Docs Refresh

### Done

- Обновлены stale управляющие документы:
  - `docs/implementation-readiness.md`
  - `docs/content-status.md`
  - `07_ops/task-board.md`
  - `docs/backlog.md`
  - `docs/.active_ticket`
  - `docs/decisions-log.md`
  - `docs/project-notes.md`
- Зафиксирован переход проекта из bootstrap в `implementation phase`.
- Активный тикет переключен на `AZR-002`.
- В management layer зафиксированы реальные launch blockers:
  - legal/business placeholders
  - phone / WhatsApp / contact flow
  - deploy secrets / `.env`
  - решение по AI live-run на старте

### Validation

- выполнен project audit по `.md` inventory
- проверены stale readiness/status/task pointers
- подтвержден рабочий статус AI CLI через `python3 -m py_compile` и `./scripts/ai_agents.py list`

## 2026-03-13: AZR-002 Implementation Handoff Package

### Done

- Добавлен handoff package для `AZR-002`:
  - `docs/specs/azr-002-implementation-handoff.md`
  - `docs/plans/azr-002-build-plan.md`
  - `docs/tasklist/azr-002-tasklist.md`
- В `AZR-002` зафиксированы:
  - locked MVP baseline
  - source-of-truth rule set
  - first implementation queue
  - out-of-scope boundaries
  - launch blockers
  - open decisions
- Build plan разложен по фазам:
  - website shell + core pages
  - form + CRM/Sheets
  - chat widget + AI intake
  - Facebook/GBP linkage
  - deploy + runtime hardening

### Validation

- handoff package сверён с существующим форматом `AZR-001`
- tasklist создан с owner / priority / dependency / acceptance criteria / status

## 2026-03-13: AZR-003 Go-Live Readiness Package

### Done

- Добавлен go-live package для `AZR-003`:
  - `docs/specs/azr-003-go-live-readiness.md`
  - `docs/plans/azr-003-go-live-plan.md`
  - `docs/tasklist/azr-003-tasklist.md`
- В `AZR-003` жестко разделены:
  - launch blockers
  - `cannot launch until`
  - post-launch deferred items
- Пакет разложен по этапам:
  - legal readiness
  - contact readiness
  - deployment readiness
  - AI runtime readiness
  - GBP / review / local presence readiness
  - go / no-go review

### Validation

- структура пакета выровнена с `AZR-002`
- tasklist создан с owner per blocker, priority, dependency, AC, status

## 2026-03-13: AZR-003 Priority and Launch Defaults Alignment

### Done

- В `AZR-003` зафиксирован recommended execution order:
  - legal baseline
  - contact baseline
  - deploy baseline
  - AI baseline decision
- Добавлены recommended launch defaults:
  - `form + site chat only`, если phone / WhatsApp еще не готовы
  - AI launch mode по умолчанию ограничен `intake + summary + handoff`
  - без autonomous outbound sending
  - без pricing commitments
  - без scheduling promises
- Обновлен `AZR-003` tasklist под фактическую первую очередь исполнения.

### Validation

- spec / plan / tasklist повторно сверены на непротиворечивость порядка и launch-mode guardrails

## 2026-03-13: AZR-003 Legal Baseline Partially Filled

### Done

- В `02_website/legal-pages.md` подставлены подтвержденные owner/business fields:
  - `OLEINIK DMITRII`
  - `Entrepreneur individuel - micro-entrepreneur`
  - `SIREN 940 870 140`
  - `SIRET 940 870 140 00016`
  - `9 AV EMMANUEL BRIDAULT, 06000 NICE`
- В `docs/tasklist/azr-003-tasklist.md` задача `AZR-003-001` переведена в `in_progress`.

### Still open

- public contact email
- public phone decision/value
- hosting provider data
- contact/privacy contact fields

### Validation

- legal identity block reread after patch

## 2026-03-13: AZR-003 Hosting Baseline Filled

### Done

- В `02_website/legal-pages.md` заполнен hosting block:
  - `Hetzner Online GmbH`
  - `Industriestr. 25, 91710 Gunzenhausen, Germany`
  - `https://www.hetzner.com`
- В `docs/tasklist/azr-003-tasklist.md` задача `AZR-003-002` переведена в `done`.

### Still open

- public contact email
- public phone decision/value
- public WhatsApp decision/value
- privacy contact fields

### Validation

- hosting block reread after patch

## 2026-03-13: AZR-003 Public Contact Email Filled

### Done

- В `02_website/legal-pages.md` подставлен `contact@azursystech.fr`:
  - в business identity block
  - в privacy/data contact block

### Still open

- public phone decision/value
- public WhatsApp decision/value
- `Additional contact if needed`

### Validation

- email fields reread after patch

## 2026-03-13: AZR-003 Phone and WhatsApp Baseline Filled

### Done

- В launch-critical docs подставлен public phone / WhatsApp baseline:
  - `+33 7 49 70 54 65`
- Обновлены:
  - `02_website/legal-pages.md`
  - `02_website/site-architecture.md`
  - `02_website/forms-spec.md`
  - `02_website/wireframes.md`
  - `01_brand/homepage-copy.md`
  - `01_brand/faq.md`
  - `06_seo/gbp-setup-checklist.md`
- В `docs/tasklist/azr-003-tasklist.md` задача `AZR-003-003` переведена в `in_progress`.

### Still open

- подтвердить, что WhatsApp использует тот же номер и публично доступен для launch
- deploy baseline
- AI launch mode decision

### Validation

- reread critical contact snippets after patch
- removed remaining stale contact-placeholder note in `02_website/site-architecture.md`

## 2026-03-13: AZR-003 Contact and AI Launch Decisions Confirmed

### Done

- Confirmed launch decisions:
  - WhatsApp public on the same number `+33 7 49 70 54 65`
  - AI launch mode = `limited live intake`
- Updated `AZR-003` package to reflect confirmed decisions instead of open assumptions.
- Closed tasks:
  - `AZR-003-003`
  - `AZR-003-005`
- Synchronized launch-facing docs:
  - `04_facebook/facebook-strategy.md`
  - `02_website/site-architecture.md`
  - `02_website/analytics-spec.md`
- Added ADR-008 to `memory_bank/decisions.md`.

### Validation

- reread `AZR-003` spec / plan / tasklist after patch
- grep pass on stale `WhatsApp later` / `future WhatsApp click` markers

## 2026-03-13: AZR-003 Deploy Baseline Hardening

### Done

- Переключен `docs/.active_ticket` на `AZR-003`.
- В `.env.vps.example` убран реальный AI key и заменен на placeholder.
- В `docker-compose.vps.yml` добавлен runtime passthrough для:
  - `DEEPSEEK_API_KEY`
  - `DEEPSEEK_BASE_URL`
  - `ALLOWED_ORIGINS`
- В `docs/deployment/github-vps.md` уточнены:
  - обязательные VPS `.env` runtime values
  - warning про секреты в tracked files
  - verification step for runtime env visibility
- В `docs/tasklist/azr-003-tasklist.md` задача `AZR-003-004` переведена в `in_progress`.

### Risks

- DeepSeek key previously stored in `.env.vps.example` should be rotated.

### Validation

- deploy baseline files reread after patch
