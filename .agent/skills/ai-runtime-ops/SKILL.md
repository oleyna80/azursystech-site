---
name: ai-runtime-ops
description: Управление реестром агентов, промптами, примерами входов и безопасным запуском.
---

# Skill: AI Runtime Ops

## Triggers
- "добавь агента", "обнови prompt", "runtime", "registry"

## Workflow
1. Обновить `05_ai/agents/registry.json`.
2. Добавить/обновить шаблоны в `05_ai/prompts/`.
3. Добавить payload пример в `05_ai/examples/`.
4. Прогнать dry-run через `scripts/ai_agents.py`.
5. Обновить спецификацию в `05_ai/*.md`.

Related Roo skill: `.roo/skills/azursystech-safe-ai-runtime/SKILL.md`.

## Validation
- `python3 -m py_compile scripts/ai_agents.py`
- `./scripts/ai_agents.py list`
- `./scripts/ai_agents.py run --agent <id> --input-file ... --dry-run`

## Handoff
- **Success condition**: registry.json обновлён, dry-run прошёл без ошибок.
- **Next**: Control Tower (продолжение pipeline)
- **Auto-proceed**: 🟢 YES
- **Hard stop**: 🔴 YES for env/secrets, live API calls, autonomous outbound actions, production config, deploy, or real client/admin communications unless explicitly approved.
