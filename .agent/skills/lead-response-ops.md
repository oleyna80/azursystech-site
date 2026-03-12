---
name: Lead Response Ops
description: Процедуры triage, классификации и первого ответа по входящим лидам.
---

# Skill: Lead Response Ops

## Triggers
- "ответь лиду", "triage", "lead routing"

## Workflow
1. Классифицировать лид: particulier/tpe/unknown.
2. Определить intent и urgency.
3. Сформировать первый ответ в нужном языке.
4. Применить escalation правила (`05_ai/escalation-rules.md`).
5. Зафиксировать next action для оператора.

## Runtime Link
- Использовать `scripts/ai_agents.py` + агент `lead_router`.
- В live-режиме обязательно human approval перед отправкой.
