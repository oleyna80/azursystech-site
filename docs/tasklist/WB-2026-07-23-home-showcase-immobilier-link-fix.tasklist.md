# WB-2026-07-23-home-showcase-immobilier-link-fix.tasklist

- [x] Stage 0: Plan & Discover
- [x] Stage 0.5: Critic Review (Critic APPROVE)
- [ ] Stage 1: Implement `slug: "immobilier"` and `demoUrl: showcaseDemoUrl("immobilier")` in `web/src/app/[locale]/_home-data.ts` (fr and ru)
- [ ] Stage 1: Update `SHOWCASE_ROUTE_SLUG_BY_CARD_SLUG` in `web/src/app/[locale]/_home-data.test.ts`
- [ ] Stage 1: Update `TILE_MARKS` key and icon in `web/src/components/sections/showcase.tsx`
- [ ] Stage 2: Verification (`npm run check:types` & `npx vitest run web/src/app/[locale]/_home-data.test.ts`)
- [ ] Stage 3: SSOT Sync & Closeout
