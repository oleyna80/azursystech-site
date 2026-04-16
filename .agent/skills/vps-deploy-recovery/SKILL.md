---
name: vps-deploy-recovery
description: Восстановление VPS deploy-checkout при diverged branch, unmerged files, broken compose/yaml и блокирующих git-состояниях.
---

# Skill: VPS Deploy Recovery

## Triggers
- "git pull --ff-only failed"
- "ahead/behind diverged"
- "You have unmerged files"
- "yaml: mapping values are not allowed in this context"
- "detached + dirty state на VPS"

## Objective
Быстро вернуть VPS checkout в предсказуемый deploy-state (`on-branch`, `up-to-date`, compose-valid), не теряя safety snapshot.

## Workflow
1. Диагностика состояния:
   - `git status -sb`
   - `git branch --show-current`
   - `git stash list | head -n 5`
2. Если есть незавершенный merge/rebase:
   - `git rebase --abort || true`
   - `git merge --abort || true`
3. При broken compose/yaml после конфликтов:
   - `git restore --source=HEAD --staged --worktree <conflicted files>`
   - `docker compose -f docker-compose.vps.yml config -q`
4. При diverged deploy-ветке:
   - создать backup branch (`backup/...`);
   - синхронизировать к `origin/<branch>` (для deploy checkout допускается hard reset только после explicit approval).
5. Пересобрать/пересоздать `app` при изменениях runtime wiring:
   - `docker compose ... up -d --build --force-recreate app`
6. Финальная верификация:
   - `git status -sb`
   - `docker compose ... ps`
   - `/health` check.

## Constraints
- Перед любым потенциально разрушительным шагом обязателен safety snapshot (backup branch или stash).
- Не выполнять `git reset --hard` без явного подтверждения.
- Не выводить секреты из `.env` в отчет.

## Output
- Root cause блокировки.
- Recovery commands и их результат.
- Final deploy-state: `branch sync`, `compose valid`, `services healthy`.
- Остаточные риски и следующий шаг.
