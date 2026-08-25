# Verification Report — WB-2026-08-25-automatiser-demandes-clients-guide

## Binding

- Work Block: WB-2026-08-25-automatiser-demandes-clients-guide
- Base and current uncommitted HEAD: 5d3f3115d14fa715c7e06839aac092da5e4a8819
- Branch: feat/automatiser-demandes-clients-guide
- Verification mode: local evidence, same-session advisory isolation.

## Required checks

| Check | Result |
|---|---|
| Focused Vitest: guide, Nice, AI, sitemap | PASS — 4 files, 20 tests |
| npm run test:ci | PASS — 35 files passed, 1 skipped; 158 tests passed, 3 skipped |
| npm run check:types | PASS |
| npm run lint | PASS — 0 errors; six existing image-element warnings |
| npm run build | PASS — production build and static generation completed; 54/54 pages |
| git diff --check | PASS |

## Crash Test Gate

PASSED

- /sitemap.xml: HTTP 200.
- /fr/guides/automatiser-demandes-clients: HTTP 200.
- /ru/guides/automatiser-demandes-clients: HTTP 200.
- /en/guides/automatiser-demandes-clients: HTTP 200.
- Legacy /fr/guides: HTTP 404.
- Legacy /fr/guides/automatiser-demandes-clients-old: HTTP 404.
- Sitemap contains exactly the three guide canonical URLs.
- Existing header/footer anchors were checked against their existing target IDs.
- Runtime smoke checks confirmed the Nice and AI pages each render the localized guide link; the guide renders localized links to Nice, AI, portfolio, examples, and the existing brief flow.
- Dev logs after all smoke requests contained only successful GETs and no unhandled exception or hydration error.

## Semantic parity

Focused tests assert exact FR title/H1, canonical and hreflang targets, all four JSON-LD node types, FAQ source parity, localized discovery links, exact sitemap inventory, and prohibited unsupported-claim patterns.

## Verdict

PASS — evidence supports the defined acceptance criteria. This report is local assurance only and does not imply commit, remote publication, merge, or deployment.
