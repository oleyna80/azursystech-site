# Critic Report — WB-2026-07-23-home-showcase-immobilier-link-fix

**Date:** 2026-07-23  
**Reviewed:** Stage 0 Preflight + Work Block definition  
**Verdict:** **APPROVE**

## Adopted Directives

1. **Dual Locale Synchronization**: Updated `slug: "immobilier"` and `demoUrl: showcaseDemoUrl("immobilier")` in both `fr` and `ru` locale objects in `_home-data.ts`.
2. **Icon Asset Alignment**: Renamed `TILE_MARKS.comptabilite` to `TILE_MARKS.immobilier` in `showcase.tsx` and substituted house SVG mark.
3. **Test Suite Invariant**: Updated `SHOWCASE_ROUTE_SLUG_BY_CARD_SLUG` map key in `_home-data.test.ts` from `comptabilite` to `immobilier`.
