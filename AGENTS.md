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
