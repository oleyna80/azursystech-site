---
name: AI Runtime Ops
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

## Validation
- `python3 -m py_compile scripts/ai_agents.py`
- `./scripts/ai_agents.py list`
- `./scripts/ai_agents.py run --agent <id> --input-file ... --dry-run`
