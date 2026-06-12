---
name: ssot-sync-closeout
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
2. Проверить acceptance evidence: subagent `DONE` не равен принятию результата;
   нужен scope/AC/checks verdict от Control Tower или Verifier.
3. Обновить `progress.md` новой записью (done + notes + checks).
4. Обновить `context.md` (current focus + next execution queue + date).
5. Обновить `decisions.md` если в текущем stage принято архитектурное/runtime решение.
6. Обновить delivery notes в tasklist.
7. Прогнать `rg` на противоречивые старые формулировки.
8. Проверить, что SSOT-файлы синхронизируются через Git по умолчанию:
   `git check-ignore -v <paths>` должен быть пустым для обычных workflow docs.
9. Если SSOT-файл остается ignored, зафиксировать причину: secrets, private
   transcripts, local runtime logs, caches, or machine-specific state.
10. Прямо проверить новые маркеры статуса/evidence через `rg -n` или `sed -n`.

## Constraints
- Historical entries не переписывать.
- Если проверки не запускались — писать это явно.
- Не добавлять ADR без реального архитектурного решения.
- В closeout явно указать, какие SSOT-изменения tracked/synchronized и какие
  остаются local-only/ignored из-за secrets/private transcripts/logs/caches или
  machine-specific state.

## Output
- 5-пунктовый stream summary
- Список измененных SSOT файлов
- Tracked/synchronized или local-only/ignored статус SSOT файлов
- Residual risks

## Handoff
- **Success condition**: memory_bank обновлён (context, progress, decisions при наличии ADR), tasklist обновлён, нет противоречий.
- **Next**: Control Tower (closeout report to Owner)
- **Auto-proceed**: 🟢 YES
- **Hard stop**: NO
