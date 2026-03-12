# Conventions (azursystech)

## Purpose
Краткие правила для Codex/RooCode при работе с проектом.

## Scope
- Strategy/brand: `00_strategy/`, `01_brand/`
- Funnel/content ops: `02_website/`, `03_leads/`, `04_facebook/`, `06_seo/`
- AI runtime: `05_ai/`, `scripts/ai_agents.py`

## Content Rules
- Сохранять тон: простой, спокойный, практичный, локальный.
- Не обещать незафиксированные гарантии, SLA, цены.
- Не выдумывать кейсы/отзывы/сертификации.

## Technical Rules
- Изменения runtime должны быть минимальными и обратимыми.
- Любой новый агент регистрируется в `05_ai/agents/registry.json`.
- Любые новые промпты должны иметь пример payload в `05_ai/examples/`.

## Testing Rules
- Для runtime: py_compile + dry-run.
- Для контента: проверка against `01_brand/brand-pack.md` и `00_strategy/positioning.md`.

## Safety Rules
- Секреты только в env.
- Нельзя отправлять AI-draft клиенту без human approval.
