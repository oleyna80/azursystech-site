# Code Review — bijoux-artisanaux demo (WB-2026-07-09-bijoux-code-review)

Date: 2026-07-09
Mode: /code-review high effort (8 finder angles → 3 verifier subagents, 1-vote recall-biased), then `--fix` applied by Control Tower.
Scope reviewed: `showcase/app/demo/bijoux-artisanaux/**` + `showcase/components/bijoux-artisanaux/**` (added in commit 1ed7420).

## Approved Write-Set (fix phase)

- showcase/app/demo/bijoux-artisanaux/layout.tsx
- showcase/app/demo/bijoux-artisanaux/product/[slug]/page.tsx
- showcase/components/bijoux-artisanaux/*

## Findings (10, ranked)

1. **CONFIRMED / correctness** — ProductPage.tsx:100,112 — size/material option `<button>`s have no onClick and no selected state; look interactive, do nothing.
2. **PLAUSIBLE / correctness** — InquiryDrawer.tsx:43 — setTimeout chain (800+1500ms) without cleanup; stale timer can fire `onClose()` and reset state on a re-opened drawer.
3. **CONFIRMED / efficiency** — HomePage.tsx:1 — `'use client'` with no hooks/handlers; forces client bundle for a static page.
4. **PLAUSIBLE / simplification** — app/demo/bijoux-artisanaux/layout.tsx:29 — dual font mechanism (next/font `variable:` + inline `<style>` on `:root`); tokens.module.css `.root` redefines `--bx-font-*` and shadows both, so loaded fonts never reach the content (headings fall back to Georgia, body to system-ui).
5. **CONFIRMED / simplification** — product/[slug]/page.tsx:22 — `getProduct` called 3× (generateMetadata, Page, ProductPage); ProductPage fallback branch unreachable (route already calls notFound()).
6. **CONFIRMED / simplification** — ProductPage.tsx:62 — status→label mapping implemented 3× (HomePage map, ProductPage chain, CataloguePage chain).
7. **CONFIRMED / simplification** — types.ts:29 — `Product.palette` never read by any component or CSS (dead data on all 9 products).
8. **CONFIRMED / simplification** — types.ts:40 — exported `InquiryFormData` / `CustomOrderFormData` never imported.
9. **CONFIRMED / reuse** — catalogue.module.css:87 — within-demo CSS duplication (form fields, product grid 22/24px, buttons 44/46px).
10. **PLAUSIBLE / correctness** — CataloguePage.tsx:39 — `col.category as string` cast masks `category: null` of the 'all' entry; safety rests only on `slice(1)`.

Refuted during verification: broken font *loading* (fonts load; application was the issue — see #4), demos.ts entry shadowing (matches assurance precedent), missing `demos/<slug>/site.ts` (standalone precedent documented in CLAUDE.md), slug normalization, hardcoded demo-latency timeouts, return-URL behavior.

## Fix decisions

- Fixes applied for findings 1–8 and 10 (see git diff for WB).
- Finding 9 (CSS consolidation) **skipped**: merging near-identical rules forces choosing between intentionally(?) divergent values (gap 22 vs 24px, min-height 44 vs 46px) — visual change beyond review scope; left for a design pass.
- Font fix (#4): removed inline `<style>`, applied `librecaston.variable`/`dmsans.variable` classes on the layout wrapper, removed shadowing definitions from tokens.module.css `.root`, kept fallbacks in `var()` usages. This makes Libre Caslon Text / DM Sans actually render (intended by the original code, previously silently falling back).

Verification: `npm run check:types` + `npm run lint` + `npm run build` in `showcase/` after fixes (results in verification report).
