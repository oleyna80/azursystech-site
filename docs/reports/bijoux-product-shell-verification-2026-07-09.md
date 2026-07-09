# Verification — bijoux product/merci SiteShell fix (WB-2026-07-09-bijoux-product-shell)

Date: 2026-07-09 · Tier: lite · Verifier: ct-inline (Sensitive Domains: none)

## Change

ProductPage.tsx и ThankYouPage.tsx обёрнуты в SiteShell (шапка+подвал); собственный `tokenStyles.root`-враппер убран (его даёт SiteShell); product.module.css `.page` — снят min-height:100vh (высоту держит shell), паддинг 40/80px; thankyou.module.css `.page` — min-height 100vh → 55vh, паддинг 80px; с ThankYouPage снят лишний `'use client'`.

## Evidence

- `npm run check:types`: `✓ Types generated successfully`, exit 0.
- `npm run lint`: `✖ 9 problems (0 errors, 9 warnings)` — те же 9 pre-existing `no-img-element`.
- Live (dev :3002): `/product/bague-eclat` — header nav «Catalogue» ×3, «Atelier Liora» ×5, footer «Façonné à la main avec passion» ×1, контент «Bague Éclat» ×5; `/merci` — footer present.

Verdict: READY
