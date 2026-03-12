# Agent Configuration (azursystech)

Минимальная конфигурация агентной разработки для связки Codex + RooCode.

## Структура

1. `rules/` - обязательные операционные правила
2. `workflows/` - сценарии выполнения задач (SDD)
3. `skills/` - переиспользуемые процедуры
4. `ROSTER.md` - роли и триггеры skills

## Read Order (каждая сессия)

1. `AGENTS.md`
2. `memory_bank/context.md`
3. `memory_bank/progress.md`
4. `memory_bank/decisions.md`
5. релевантные файлы из `00_strategy`, `01_brand`, `05_ai`
6. нужный workflow/skill

## Основной принцип

- Tech Lead (Codex): архитектура, спецификация, review, координация.
- Coder (RooCode): реализация атомарных задач по tasklist.
- Все изменения проходят через memory discipline.
