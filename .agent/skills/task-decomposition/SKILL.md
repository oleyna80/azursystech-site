---
name: task-decomposition
description: Декомпозиция целей в атомарные задачи с проверяемыми AC.
---

# Skill: Task Decomposition

## Triggers
- "разбей на задачи", "сделай tasklist", "декомпозиция"

## Rules
1. Одна задача = один проверяемый результат.
2. Явные зависимости.
3. AC только измеримые.

## Output
`docs/tasklist/<ticket>.tasklist.md`

Структура:
- Task ID
- Depends on
- Acceptance Criteria
- Status
