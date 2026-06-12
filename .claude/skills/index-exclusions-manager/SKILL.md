---
name: index-exclusions-manager
description: Управление исключениями для индексации/контекстного шума в проекте.
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

# Skill: Index Exclusions Manager

## Triggers
- "исключи из индексации"
- "ignore для модели"
- "лишний контекст"

## Objective
Снизить шум в индексации и поиске, сохранив релевантный код/доки.

## Workflow
1. Проверить текущие ignore-файлы:
   - `.gitignore`
   - `.codexignore` (если используется)
2. Добавить только согласованные паттерны.
3. Проверить, что не исключены критичные source directories.
4. Отдельный scoped commit только для ignore-правил.

## Constraints
- Не добавлять агрессивные маски без подтверждения.
- Не скрывать `docs/`, `memory_bank/`, `web/src/` без отдельного решения.

## Output
- Список новых pattern rules
- Где применены (`.gitignore`, `.codexignore`)
- Команда для валидации (`git status`, `rg` smoke)

## Handoff
- **Success condition**: pattern rules добавлены, smoke-проверка прошла.
- **Next**: scoped-commit-guard
- **Auto-proceed**: 🟢 YES
- **Hard stop**: NO
