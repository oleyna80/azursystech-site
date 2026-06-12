---
name: lead-response-ops
description: Процедуры triage, классификации и первого ответа по входящим лидам.
user-invocable: true
allowed-tools:
  - Read
  - Bash(git *)
  - Bash(ls *)
  - Bash(find *)
  - Bash(grep *)
  - Bash(cat *)
  - Bash(rg *)
  - Bash(jq *)
---

# Skill: Lead Response Ops

## Triggers
- "ответь лиду", "triage", "lead routing"

## Workflow
1. Классифицировать лид: particulier/tpe/unknown.
2. Определить intent и urgency.
3. Сформировать первый ответ в нужном языке.
4. Проверить поведение по `05_ai/lead-agent-spec.md`.
5. Применить escalation правила (`05_ai/escalation-rules.md`).
6. Зафиксировать next action для оператора.

## Runtime Link
- Использовать `scripts/ai_agents.py` + агент `lead_router`.
- Related Roo skill: `.roo/skills/azursystech-form-contract/SKILL.md`.
- В live-режиме обязательно human approval перед отправкой.

## Handoff
- **Success condition**: лид обработан, ответ подготовлен.
- **Next**: Control Tower
- **Auto-proceed**: 🟢 YES (подготовка)
- **Hard stop**: 🔴 YES — отправка реального ответа клиенту требует Owner approval.
