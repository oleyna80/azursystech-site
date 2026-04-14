---
name: SSOT Sync Closeout
description: Точечный post-stage sync в memory_bank и tasklist без переписывания истории.
---

# Skill: SSOT Sync Closeout

## Triggers
- "обнови memory bank"
- "закрыть stage"
- "sync tasklist/context/progress"

## Objective
Поддерживать согласованность между:
- `memory_bank/context.md`
- `memory_bank/progress.md`
- `docs/tasklist/*`

## Workflow
1. Сверить факт stage (что реально выполнено и проверено).
2. Обновить `progress.md` новой записью (done + notes + checks).
3. Обновить `context.md` (current focus + next execution queue + date).
4. Обновить delivery notes в tasklist.
5. Прогнать `rg` на противоречивые старые формулировки.

## Constraints
- Historical entries не переписывать.
- Если проверки не запускались — писать это явно.
- Не добавлять ADR без реального архитектурного решения.

## Output
- 5-пунктовый stream summary
- Список измененных SSOT файлов
- Residual risks

