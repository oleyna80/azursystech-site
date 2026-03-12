# PLAN: AZR-001 Facebook Page Copy (Launch FR)

## Implementation Steps

1. Context alignment
- Прочитать `01_brand/brand-pack.md`, `00_strategy/positioning.md`, `00_strategy/offer-stack.md`, `02_website/forms-spec.md`.
- Зафиксировать обязательные messaging anchors и CTA правила.

2. Copy rewrite (FR-first)
- Обновить `01_brand/facebook-page-copy.md`:
  - metadata
  - bio/about
  - pinned post
  - CTA templates
  - 10 posts
- Сохранить практичный и локальный стиль.

3. Consistency pass
- Проверить соответствие услуг офферам.
- Убрать непроверяемые обещания.
- Проверить покрытие `particuliers + TPE`.

4. Review handoff
- Сформировать handoff `Coder -> Reviewer` с AC статусом и рисками.

## Validation Plan

- Manual check against spec AC1-AC5.
- `rg -n "Nice|30 km|particuliers|TPE|azursystech.fr" 01_brand/facebook-page-copy.md`
- `rg -n "garanti|100%|immédiat|illimité" 01_brand/facebook-page-copy.md` (должно быть пусто или осознанно обосновано)

## Rollback / Safety

- Если FR версия ухудшает структуру, сохранить RU draft как appendix section, но основной launch copy оставить FR.

## Execution Checklist

- [ ] Step 1: Context alignment completed
- [ ] Step 2: FR rewrite completed
- [ ] Step 3: Consistency pass completed
- [ ] Step 4: Reviewer handoff submitted
