---
name: copy-review
description: Проверка продающего текста на brand-fit, ясность и конверсионность.
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

# Skill: Copy Review

## Triggers
- "проверь текст", "tone review", "редактура"

## Checklist
- Соответствие `01_brand/brand-pack.md`
- Соответствие `00_strategy/positioning.md`
- Ясный CTA и отсутствие jargon
- Нет невалидных обещаний/гарантий
- Локальный фокус (Nice + alentours)

## Output
- Список правок по приоритету: critical / improve / optional
- Обновленный draft (если запрошено)

## Handoff
- **Success condition**: список правок по приоритетам готов.
- **Next**: azursystech-scoped-coder (если есть critical) или ssot-sync-closeout
- **Auto-proceed**: 🟢 YES
- **Hard stop**: NO
