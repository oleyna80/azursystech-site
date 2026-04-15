---
name: Scoped Commit Guard
description: Безопасный commit в dirty worktree только по whitelist файлам.
---

# Skill: Scoped Commit Guard

## Triggers
- "scoped commit"
- "грязное дерево"
- "не захвати лишнее"

## Objective
Сделать предсказуемый commit без утечки чужих/вне-scope изменений.

## Workflow
1. Зафиксировать whitelist файлов stage.
2. `git add <whitelist only>`.
3. Проверить staged set через `git status --short -- <whitelist>`.
4. Проверить diff только по whitelist.
5. Сделать commit с осмысленным message.
6. Попытка push; при SSH fail — передать точную ручную команду.

## Constraints
- Запрещено: `git add .`, `git commit -a`, `git reset --hard`, `git checkout -- .`.
- Не включать untracked noise (`.cache`, `output`, browser artifacts).

## Output
- Commit hash + message
- Файлы в commit
- Push status (ok / manual required)

