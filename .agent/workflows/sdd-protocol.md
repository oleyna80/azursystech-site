---
description: Strict Spec-Driven Development (SDD) Protocol for AzurSysTech
---
# SDD Protocol Workflow

## Prerequisites
- `memory_bank/` должен быть инициализирован.
- `docs/specs/`, `docs/plans/`, `docs/tasklist/` должны существовать.

## Phase 1: Specification (What)
1. Зафиксировать scope и ограничения.
2. Прочитать `memory_bank/context.md`, `progress.md`, `decisions.md`.
3. Подготовить spec в `docs/specs/<ticket>.md`.
4. Получить явное подтверждение пользователя.

## Phase 2: Planning (How)
1. Подготовить план в `docs/plans/<ticket>-plan.md`.
2. Зафиксировать риски и критерии приемки.
3. Обновить `memory_bank/context.md` и при необходимости `decisions.md`.

## Phase 3: Task Slicing (When)
1. Разбить на атомарные задачи в `docs/tasklist/<ticket>.tasklist.md`.
2. Обновить статусы в `memory_bank/progress.md`.

## Phase 4: Execution (Code/Content)
1. Выполнять по одной задаче.
2. Проверять AC на каждом шаге.
3. После шага обновлять `progress.md`.

## Phase 5: Closure
1. Финальная верификация.
2. Финальное обновление memory bank.
3. Handoff с рисками и следующими шагами.
