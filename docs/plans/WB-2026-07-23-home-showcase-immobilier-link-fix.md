# WB-2026-07-23 — Home Showcase Immobilier Link Fix

## Objective

Fix link and card data alignment in the home page showcase section (`_home-data.ts` & `showcase.tsx`).
The 6th showcase card is titled **"Agence Immobilière"** (French) / **"Агентство недвижимости"** (Russian), but previously pointed to `slug: "comptabilite"` and `demoUrl: showcaseDemoUrl("comptabilite")` (Cabinet Comptable stub).

Update item 6 to `slug: "immobilier"` and `demoUrl: showcaseDemoUrl("immobilier")`, connecting it directly to the existing Real Estate demo (`/demo/immobilier`).

## Scope & Changes

- `web/src/app/[locale]/_home-data.ts`: Update item 6 slug and demoUrl in both `fr` and `ru` locale objects.
- `web/src/app/[locale]/_home-data.test.ts`: Update test route map key from `comptabilite` to `immobilier`.
- `web/src/components/sections/showcase.tsx`: Rename `TILE_MARKS.comptabilite` to `TILE_MARKS.immobilier` and use house SVG icon.

## Preflight

| Field | Record |
|---|---|
| Work Block type | Frontend card data and link alignment |
| Side-effect class | Local code write |
| DB action mode | None |
| Hard Stops | None |
| Verification tier | Lite / Standard (`vitest` + `check:types`) |
