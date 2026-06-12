---
name: local-seo-ops
description: Планирование и проверка локального SEO-контента и GBP-активностей.
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

# Skill: Local SEO Ops

## Triggers
- "local seo", "GBP", "service pages"

## Workflow
1. Проверить базовые артефакты: `06_seo/*`, `02_website/site-architecture.md`.
2. Сопоставить услуги с офферами (`00_strategy/offer-stack.md`).
3. Сформировать SEO-приоритеты: pages, GBP posts, review flow.
4. Проверить consistency по географии и CTA.

## Output
- Короткий план в `06_seo/local-seo-plan.md` или tasklist в `docs/tasklist/`.

## Handoff
- **Success condition**: plan/tasklist в `06_seo/` или `docs/tasklist/` создан.
- **Next**: azursystech-scoped-coder или ssot-sync-closeout
- **Auto-proceed**: 🟢 YES
- **Hard stop**: NO
