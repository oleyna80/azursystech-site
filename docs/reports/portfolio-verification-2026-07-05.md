# Verification Report — WB-2026-07-05-portfolio

Date: 2026-07-05
Tier: standard
Verdict: READY

## Checks

| Check | Result |
|---|---|
| `tsc --noEmit` | PASS |
| `vitest run` (18 files, 85 tests, incl. updated sitemap.test.ts) | PASS |
| `next build` (routes /portfolio, /portfolio/[slug] present) | PASS |
| `eslint` | 0 errors, 5 warnings (`no-img-element`, existing codebase idiom) |
| Smoke /portfolio | 200, 6 cards, YouTube thumbnails render |
| Smoke /portfolio/plomberie | 200, video facade, capacities + automation sections |
| Smoke /portfolio/unknown-slug | 404 |
| Smoke /fr and /ru home | 200, portfolio teaser after showcase, CTA works |
| Header/footer nav | Portfolio link present in fr and ru |
| sitemap.xml | 7 portfolio URLs |
| CSP header (prod build) | `frame-src https://www.youtube-nocookie.com https://www.youtube.com` present; single CSP header on existing pages |
| hreflang | canonical + fr + x-default on /portfolio pages |
| Mobile menu 375×667 (Playwright) | All 6 items + WhatsApp visible and within viewport |

## Critic supplements resolution

1. sitemap.test.ts updated with 7 portfolio URLs — DONE.
2. Mobile menu at 375px verified — found PRE-EXISTING bug: `overflow-hidden` on `<header>` (introduced in 086dba3, 2026-05-31) clipped the mobile dropdown entirely (menu invisible on production since then). Fixed by removing `overflow-hidden`; re-verified with screenshot.
3. hreflang/x-default added to portfolio metadata — DONE.
4. Nav position documented (after "websites"); CSP inline comments added in next.config.ts and nginx.proxy.conf — DONE.

## Outstanding (Owner)

- Real YouTube video IDs: placeholder `dQw4w9WgXcQ` in web/src/lib/portfolio-data.ts until channel videos are published.
- French review texts are drafts based on showcase demo data; Owner to edit.
- nginx.proxy.conf CSP change requires VPS deploy (outside this Work Block).
