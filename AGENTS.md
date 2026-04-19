# AGENTS.md

Операционные правила для AI-агентов в `azursystech`.

## 1) Языки и формат
- Основные языки: `Markdown`, `JSON`, `Python` (runtime-скрипты).
- Форматтеры в репо не зафиксированы централизованно.
- Требование: не делать массовый reformat вне scope задачи.

## 2) Архитектурные слои
- `00_strategy/` - стратегия, позиционирование, офферы.
- `01_brand/` - бренд и продающий копирайт.
- `02_website/` - структура и требования сайта.
- `03_leads/` - intake, шаблоны ответа, CRM-пайплайн.
- `04_facebook/` - social/outreach контур.
- `05_ai/` - AI-агенты, промпты, правила эскалации.
- `06_seo/` - локальное SEO.
- `07_ops/` - KPI, запуск, операционные чеклисты.
- `scripts/` - автоматизация и runtime (`ai_agents.py`).

## 3) Логирование и артефакты
- Для runtime использовать только структурированные run-артефакты в `05_ai/runs/`.
- Не логировать секреты (`DEEPSEEK_API_KEY` и другие токены).
- Любая AI-генерация считается draft до human approval.

## 4) Тестирование и валидация
- Для изменений runtime-логики: минимум `python3 -m py_compile scripts/ai_agents.py` + dry-run команды.
- Для изменений контента: проверка на соответствие brand-pack и positioning.
- Если проверки не запускались, указать это явно в отчете.

## 5) Работа с секретами
- Секреты хранить только в `.env`/локальном окружении.
- В репозиторий не добавлять реальные ключи.

## 6) Как выбирать текущий тикет
Приоритет:
1. Явно заданный пользователем тикет/задача.
2. `docs/.active_ticket`.
3. Первый приоритетный пункт из `docs/backlog.md` или `07_ops/task-board.md`.

## 7) Что читать перед правками
- `memory_bank/context.md`
- `memory_bank/progress.md`
- `memory_bank/decisions.md`
- релевантные файлы стратегии/бренда/ops по задаче

## 8) Что делать после правок
- Обновить checklist/tasklist по задаче.
- Обновить `memory_bank/progress.md`.
- При новом архитектурном/процессном решении добавить запись в `memory_bank/decisions.md`.

## 9) Definition of Done
- AC по задаче выполнены.
- Проведена минимальная техническая/контентная проверка.
- Memory Bank обновлен.

## 10) Формат финального отчета агента
- Changed files
- AC status
- Commands run
- Risks
- Commit message (если применимо)

## 11) Запрещенные действия без подтверждения
- Изменения внешнего деплоя/инфраструктуры.
- Удаление важных контентных артефактов.
- Публикация AI-ответов клиенту без approval.

## 12) SSOT приоритет
1. `AGENTS.md`
2. `memory_bank/*`
3. `00_strategy/*`, `01_brand/*`
4. task-артефакты в `docs/specs|plans|tasklist`

## 13) Где хранить планы
- Все планы/спеки и tasklist хранятся только внутри проекта:
  - `docs/specs/`
  - `docs/plans/`
  - `docs/tasklist/`

## 14) Handoff-протокол между ролями
- Передача задачи между ролями обязательна через шаблон:
  - `docs/reports/AGENT_HANDOFF_TEMPLATE.md`
- В handoff обязательно фиксировать:
  - source role -> target role;
  - ticket ID и приоритет (`P0/P1/P2`);
  - scope, AC, ограничения;
  - артефакты проверки и открытые риски.
- SLA по ролям определяется в `.agent/ROSTER.md` и обязателен к соблюдению.

## 15) Multi-Agent Operating Model
- Для проекта принят multi-agent execution model.
- Канонический control layer:
  - `Tech Lead / Control Tower` - приоритеты, tasking, review, финальные решения, SSOT sync
- Разрешенные execution streams:
  - `Website Build Stream` - Tech Lead/Reviewer <-> RooCode
  - `VPS / n8n Integration Stream` - integration lead <-> VPS/n8n agent
  - `HubSpot CRM Stream` - CRM lead <-> HubSpot agent
- Каждый stream работает в отдельном чате/контуре, чтобы не смешивать:
  - product decisions
  - coding execution
  - infra/integration setup
  - CRM setup
- Этот проектный контур считает нормой параллельную работу нескольких агентов, если:
  - scope streams разделен;
  - финальные решения возвращаются в control layer;
  - SSOT обновляется после принятого результата.

## 16) Reporting Contract Between Streams
- Любой параллельный stream возвращает итог только в коротком structured формате:
  1. `What was done`
  2. `Decisions made`
  3. `Files / settings changed`
  4. `Open blockers`
  5. `Next recommended action`
- Этот 5-пунктовый блок считается каноническим return format для всех parallel chats и stream summaries.
- В control layer не переносить:
  - длинные live-debug логи;
  - промежуточные варианты без решения;
  - шумовые обсуждения интерфейсов сторонних систем.
- В control layer переносить обязательно:
  - accepted code changes;
  - принятые integration contracts;
  - принятые CRM stage/property names;
  - любые изменения deploy/runtime assumptions;
  - все решения, влияющие на SSOT.

## 17) Ownership Rule for Parallel Work
- `Tech Lead` остается владельцем:
  - active ticket state
  - task priority
  - acceptance / rejection of results
  - updates to `memory_bank/*`
  - updates to `docs/specs|plans|tasklist`
- Stream leads не должны silently менять SSOT.
- Любое решение, которое меняет:
  - pipeline names
  - source taxonomy
  - deploy path
  - AI runtime policy
  - legal/contact baseline
  должно быть возвращено в control layer и только после этого считаться принятым.

## 18) Subagent Model / Reasoning Policy
- По умолчанию subagents наследуют model и reasoning settings родительской сессии.
- Override model или reasoning effort разрешен только если это явно оправдано типом задачи, риском, стоимостью или скоростью.
- Перед запуском subagent Control Tower обязан явно указать:
  - stage;
  - objective;
  - role;
  - model / reasoning override, если он применяется;
  - expected result.
- Не использовать более слабую модель/reasoning для решений, которые влияют на:
  - production behavior;
  - secrets;
  - legal/contact baseline;
  - deploy/runtime assumptions;
  - CRM pipeline contracts;
  - AI runtime policy;
  - SSOT в `AGENTS.md`, `memory_bank/*`, `docs/specs|plans|tasklist`.
- Предпочитать минимально достаточную модель и reasoning setting, которые безопасно покрывают role-specific задачу.

### Recommended current presets
- `Reviewer`:
  - architecture review, planning, risk analysis, AC, SSOT-impacting decisions: stronger available model, `high` or `xhigh` reasoning;
  - routine read-only docs review: inherited model or smaller capable model, `medium` reasoning;
  - read-only, без code changes.
- `Coder`:
  - narrow Markdown/JSON updates: smaller capable model, `medium` reasoning;
  - scoped Python/runtime changes: codex-optimized or stronger inherited model, `medium` or `high` reasoning;
  - cross-layer implementation or data migration: stronger available coding model, `high` reasoning;
  - changes are limited to explicitly approved scope.
- `Verifier`:
  - routine checks, compile/lint/content checklist: smaller capable model, `medium` reasoning;
  - release-critical, security, deploy/runtime, secrets, or SSOT validation: stronger available model, `high` reasoning;
  - verification-only, без code changes.
- Current examples, when available in the session:
  - stronger review/planning: `gpt-5.4`, `gpt-5.2`;
  - scoped coding: `gpt-5.2-codex`, `gpt-5.3-codex`;
  - narrow docs/checks: `gpt-5.4-mini`, `gpt-5.1-codex-mini`.

### Model availability fallback
- If a recommended model is unavailable, prefer an upward fallback to a stronger available model, not a downgrade.
- Preferred fallback order:
  - same family stronger model when available, for example `gpt-5.2-codex -> gpt-5.3-codex`;
  - strongest available general model for the role, for example `gpt-5.4`;
  - inherited parent session model if it is safer than guessing a weaker model.
- For high-risk work (`production`, `secrets`, `deploy/runtime`, `legal/contact`, `CRM contracts`, `AI runtime policy`, `SSOT`), do not downgrade model/reasoning without explicit user confirmation.
- If the environment supports a cheap read-only model availability check, Control Tower may run it before starting a critical work block.
- If no availability check exists, a failed subagent launch counts as the availability signal; Control Tower should retry once with the nearest stronger available model and record the fallback in the report.

## 19) Work Block Confirmation Policy
- Control Tower должен получить explicit user confirmation перед стартом нового work block.
- Work block - это один approved objective/scope, который может включать несколько внутренних stage, например:
  - `Reviewer -> Coder -> Verifier`;
  - `Reviewer -> Coder -> Reviewer corrections -> Verifier`;
  - несколько scoped Coder tasks внутри одного утвержденного ticket/scope.
- Внутри approved work block Control Tower может переходить между внутренними stage без дополнительного подтверждения, если:
  - objective не меняется;
  - scope не расширяется;
  - не появляются dangerous actions;
  - каждая stage явно фиксирует `stage`, `objective`, `role`, `expected result`;
  - роли не смешиваются внутри одной stage.
- Role constraints сохраняются всегда:
  - `Reviewer` = read-only;
  - `Coder` = only scoped changes;
  - `Verifier` = checks against goals.
- Control Tower обязан остановиться и запросить новое confirmation, если:
  - следующий шаг меняет approved objective или scope;
  - работа переходит к другому ticket/work package;
  - нужны файлы вне approved scope;
  - нужен external deploy или infrastructure change;
  - затрагиваются secrets, production data, или real client communication;
  - рассматривается destructive action;
  - subagent сообщает blocker, требующий product/ops decision;
  - verification failed и исправление требует materially new scope.
- Dangerous actions всегда требуют отдельного explicit confirmation:
  - deploy / infra changes;
  - удаление важных content/runtime artifacts;
  - публикация AI/client-facing сообщений;
  - использование или изменение real secrets;
  - изменение production data;
  - broad refactor вне approved task.
- Финальный отчет по work block должен явно разделять:
  - что было сделано;
  - какие internal stages прошли;
  - какие проверки выполнены;
  - какие риски или follow-up остались.

## 20) Work Block Brief Template
- Перед стартом approved work block Control Tower должен сформулировать brief в коротком виде:
  - `Work block`;
  - `Objective`;
  - `Approved scope`;
  - `Approved write-set`;
  - `Out of scope`;
  - `Acceptance criteria`;
  - `Internal stages`;
  - `Model/reasoning plan`;
  - `Stop conditions`;
  - `Verification matrix`;
  - `Expected final report`.
- Brief может быть дан в чате или сохранен в `docs/specs|plans|tasklist`, если блок достаточно крупный.
- Для коротких markdown-only задач допускается compact brief, но он все равно должен явно задавать scope, role plan и stop conditions.
- Если в ходе работы меняются objective, scope, write-set или dangerous-action boundary, Control Tower останавливает work block и запрашивает новое confirmation.

## 21) Definition of Ready
- Implementation work block готов к старту, когда известны:
  - active ticket или явно заданная задача;
  - active baseline (`web`, runtime path, docs layer, или другой target);
  - source of truth для задачи;
  - approved scope и out-of-scope;
  - approved write-set или правила его расширения;
  - acceptance criteria;
  - минимальная verification matrix;
  - dangerous actions boundary;
  - secrets/production/client-data boundary;
  - Memory Bank / tasklist update requirements.
- Если readiness неполная, Control Tower сначала запускает `Reviewer` stage или задает пользователю точечный вопрос.
- `Coder` stage не должен начинаться, если:
  - нет понятного active baseline;
  - нет approved scope/write-set;
  - AC нельзя проверить;
  - задача требует product/ops decision, которого нет в SSOT;
  - нужен deploy/infra/secret/production-data action без отдельного confirmation.

## 22) Verifier Matrix
- `Verifier` выбирает минимальные проверки по типу изменения и явно указывает, что запускалось и что не запускалось.
- Markdown/process-only:
  - `git diff --check`;
  - review affected docs for SSOT consistency;
  - no runtime commands required unless docs describe executable behavior.
- Content/brand/legal/contact:
  - `git diff --check`;
  - compare with `00_strategy/*`, `01_brand/*`, `02_website/*`, or relevant legal/contact SSOT;
  - verify no deprecated public contact values are reintroduced.
- Frontend UI:
  - typecheck/lint/build as appropriate for touched app;
  - browser smoke for changed route/component when layout or interaction changes;
  - mobile and desktop viewport check for user-facing layout.
- API route / runtime logic:
  - typecheck;
  - targeted request smoke or unit-level check where available;
  - negative-path checks for validation, disabled mode, and unsafe config;
  - confirm errors do not leak secrets.
- DB/storage/intake:
  - typecheck;
  - schema/contract review;
  - controlled local or mocked persistence smoke when available;
  - verify event/audit records expected by AC.
- Security/secrets/runtime policy:
  - typecheck/lint/security check where available;
  - verify deny-by-default behavior;
  - verify unsafe env flags disable risky behavior;
  - confirm no real secrets are logged or committed.
- Deploy/infra:
  - requires separate explicit confirmation before execution;
  - dry-run or config validation first when available;
  - record exact commands and rollback/failure notes.
- Verifier must not silently broaden checks into deploy, production data mutation, or external client communication.
