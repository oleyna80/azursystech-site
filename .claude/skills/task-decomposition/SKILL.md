---
name: task-decomposition
description: Декомпозиция целей в атомарные задачи с проверяемыми AC.
user-invocable: true
allowed-tools:
  - Read
  - Bash(git *)
  - Bash(ls *)
  - Bash(find *)
  - Bash(grep *)
  - Bash(cat *)
  - Bash(rg *)
  - Bash(jq *)
---

# Skill: Task Decomposition

## Triggers
- "разбей на задачи", "сделай tasklist", "декомпозиция"

## Rules
1. Одна задача = один проверяемый результат.
2. Явные зависимости.
3. AC только измеримые.
4. Для крупных approved Work Blocks явно задавай `Execution mode: End-to-end autonomous`.
5. Если ожидается большой review/implementation/verification output, явно разрешай subagents в Work Block и не возвращайся к Owner между внутренними стадиями без Hard Stop.

## Output
`docs/tasklist/<ticket>.tasklist.md`

Структура:
- Task ID
- Objective
- Scope
- Out of scope
- Approved write-set
- Depends on
- Acceptance Criteria
- Verification tier
- Assigned role
- Status
- Stop conditions
- Execution mode
- Subagent authorization

For non-trivial work blocks, use `docs/templates/work-block-template.md`.

## Handoff
- **Success condition**: `docs/tasklist/<ticket>.tasklist.md` создан; каждая задача имеет ID, scope, write-set, зависимости, измеримые AC, verification tier и stop conditions.
- **Next**: azursystech-scoped-coder after Control Tower confirms approved scope/write-set
- **Auto-proceed**: 🟢 YES
- **Hard stop**: NO
