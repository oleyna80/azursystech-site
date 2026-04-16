---
name: security-verification-gate
description: Независимая post-implementation проверка security-патча: diff review, validation commands, регрессии, ship/no-ship verdict и обновление SSOT.
---

# Skill: Security Verification Gate

## Triggers
- "проверь после фиксов"
- "security verifier"
- "ship verdict"

## Objective
Дать независимый verdict по security-pass и зафиксировать фактический остаточный риск перед релизом.

## Workflow
1. Проверить фактический diff по заявленному scope.
2. Перепроверить базовые команды верификации:
   - `npm run check:types`
   - `npm run build`
   - `npm audit --omit=dev --json`
3. Сопоставить исходные findings со статусами:
   - `fixed`
   - `partially fixed`
   - `not addressed`
4. Явно зафиксировать side effects/regression risks.
5. Синхронизировать `memory_bank/progress.md` и tasklist delivery notes.

## Constraints
- Verifier-mode: не расширять scope implementation в этом шаге.
- Любой follow-up fix — отдельным coder step.
- Если какая-то проверка не запускалась, указывать это явно.

## Output
- Ship verdict: `safe incremental ship` / `needs changes`
- Findings closure matrix
- Open blockers
- Next recommended action
