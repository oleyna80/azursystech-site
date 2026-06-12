---
name: contact-drift-audit
description: Аудит drift по phone/WhatsApp/email между web и актуальными docs.
---

# Skill: Contact Drift Audit

## Triggers
- "проверь контакты"
- "phone drift"
- "whatsapp sync"
- "AZR-003-013"

## Objective
Найти все несоответствия контактных данных и разделить их на:
- P0 user-facing runtime
- P1 docs source
- historical legacy references (не трогать без причины)

## Workflow
1. Получить canonical contact из SSOT (`memory_bank/context.md`, ADR-008/ADR-020).
2. Прогнать `rg` по `web/src` и текущим docs.
3. Сгруппировать находки:
   - живые страницы/компоненты
   - активные docs
   - historical records
4. Сформировать scoped fix list.
5. После фикса сделать re-scan и выдать AC status.

## Constraints
- Не переписывать historical progress/ADR как будто их не было.
- Не смешивать contact sync с другими copy/refactor задачами.

## Output
- Drift report (file + line)
- AC verdict:
  - AC1 canonical number confirmed
  - AC2 web runtime consistent
  - AC3 docs consistent
  - AC4 history preserved

## Handoff
- **Success condition**: все 4 AC проверены, дрейф задокументирован или отсутствует.
- **Next**: azursystech-scoped-coder (если найден дрейф) или ssot-sync-closeout
- **Auto-proceed**: 🟢 YES
- **Hard stop**: NO
