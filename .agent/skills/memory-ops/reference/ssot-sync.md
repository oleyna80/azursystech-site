---
name: ssot-sync-closeout
description: Точечный post-stage sync в docs, engineering memory, memory_bank и tasklist без переписывания истории.
user-invocable: true
allowed-tools:
  - Read
  - Bash(git *)
  - Bash(ls *)
  - Bash(find *)
  - Bash(grep *)
  - Bash(cat *)
  - Bash(npm *)
  - Bash(npx *)
  - Bash(curl *)
  - Bash(fuser *)
  - Bash(node *)
  - Bash(rg *)
  - Bash(jq *)
---

# Skill: SSOT Sync Closeout

## Triggers
- "обнови memory bank"
- "закрыть stage"
- "sync tasklist/context/progress"

## Objective
Поддерживать согласованность между:
- `docs/engineering-memory/*`
- `memory_bank/context.md`
- `memory_bank/progress.md`
- `docs/tasklist/*`

## Workflow
1. Сверить факт stage (что реально выполнено и проверено).
2. Проверить acceptance evidence: subagent `DONE` не равен принятию результата;
   нужен scope/AC/checks verdict от Control Tower или Verifier.
3. Классифицировать closeout: `success-closeout` только для `READY`;
   `reporting-only` для `BLOCKED` или `UNVERIFIED`.
4. При reporting-only оставить задачу `blocked`, записать corrective action или
   unresolved dependency и не использовать completed/release-ready/success
   формулировки.
5. Обновить `progress.md` новой записью (done + notes + checks).
6. Обновить `context.md` (current focus + next execution queue + date).
7. Классифицировать reusable knowledge:
   `promoted`, `operational-only`, или `not-applicable`.
8. Если знание durable и cross-runtime, обновить `docs/engineering-memory/`;
   если это только оперативный след, оставить в `memory_bank/` или reports.
9. Обновить `decisions.md` если в текущем stage принято архитектурное/runtime решение.
10. Обновить delivery notes в tasklist.
11. Прогнать `rg` на противоречивые старые формулировки.
12. Для local-only ignored SSOT проверить, что Git их действительно игнорирует:
   `git check-ignore -v <paths>`.
13. Прямо проверить новые маркеры статуса/evidence через `rg -n` или `sed -n`,
   потому что `git diff` может быть пустым для ignored files.

## Constraints
- Historical entries не переписывать.
- Если проверки не запускались — писать это явно.
- Не добавлять ADR без реального архитектурного решения.
- Не добавлять durable engineering memory без reusable evidence или clear
  future-use trigger.
- В closeout явно указать, являются ли SSOT-изменения local-only/ignored и
  попадут ли они в публичную историю Git.

## Output
- 5-пунктовый stream summary
- Список измененных SSOT файлов
- Engineering memory classification: `promoted`, `operational-only`, or
  `not-applicable`
- Local-only/ignored статус SSOT файлов
- Residual risks

## Handoff
- **Success condition**: engineering memory classification recorded,
  memory_bank обновлён (context, progress, decisions при наличии ADR),
  tasklist обновлён, closeout mode соответствует verdict, нет противоречий.
- **Next**: Control Tower (closeout report to Owner)
- **Auto-proceed**: 🟢 YES
- **Hard stop**: NO
