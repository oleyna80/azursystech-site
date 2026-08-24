# WB-2026-08-24-technical-seo-multilingual-integrity — Specification v1

## Authority and state

- Work Block: `WB-2026-08-24-technical-seo-multilingual-integrity`
- Governance profile: `Managed`
- Owner instruction: 2026-08-24
- Base subject: `origin/main` at `d647f6ab1bf6dc40cdcde09d7e4cc554ad31882d`
- Predecessor: `WB-2026-08-24-english-translation-completion`, closed through merged PR #15.
- Lifecycle: Stage 0 Define; application-source writes remain blocked until the Critic verdict and write gate are recorded.

## Problem statement

Portfolio pages currently use legacy unprefixed routes and query/cookie locale selection. This permits several language presentations for one URL and makes canonical/hreflang URLs inconsistent. The legacy `/ai-automation` entry also must remain a redirect-only alias and must not appear in the sitemap.

## Approved scope

1. Make the canonical portfolio index available at `/{fr|ru|en}/portfolio`.
2. Make each canonical project page available at `/{fr|ru|en}/portfolio/[slug]`.
3. Give each localized portfolio index and project page a self-canonical URL and `fr`, `ru`, `en`, and `x-default` alternates; `x-default` is the French URL.
4. Permanently redirect `/portfolio`, `/portfolio/[slug]`, and their `?locale=fr|ru|en` variants to the corresponding localized portfolio URL. Missing or invalid legacy `locale` values resolve to French and no legacy query parameter is retained.
5. Retain `/ai-automation` as a permanent redirect to `/fr/ai-automation`; retain the existing `/fr|ru|en/ai-automation` pages as canonical pages.
6. Point portfolio cards, localized home CTAs, header/footer links, and language switching at localized portfolio paths.
7. Publish only canonical/indexable URLs in the sitemap. Remove the global synthetic `lastModified` value rather than asserting timestamps that cannot be evidenced.
8. Add regression coverage for the new route metadata, legacy redirects, navigation/language switching, legacy AI redirect, and sitemap topology.
9. Execute the mandatory Crash Test Gate and the web test suite, typecheck, and production build before closeout/handoff.

## Requirements

### REQ-001 — Localized portfolio topology

The application SHALL render the existing portfolio index at `/{locale}/portfolio` and existing project data at `/{locale}/portfolio/[slug]`, where `locale` is exactly `fr`, `ru`, or `en`. Unsupported locales and unknown slugs SHALL remain non-indexable (`notFound`). Rendering SHALL select portfolio language from the path parameter, not from a cookie or query parameter.

Acceptance criteria:

- AC-001: All three localized index URLs render the portfolio index using the matching existing translation.
- AC-002: Every existing portfolio slug has localized static paths for all three locales.
- AC-003: No portfolio text, project data, design, or visual structure changes except URL routing/link targets needed for this Work Block.

### REQ-002 — Portfolio metadata identity

Each canonical localized portfolio index and project URL SHALL declare itself as canonical and SHALL declare alternates for `fr`, `ru`, `en`, and `x-default`, with `x-default` pointing to the French equivalent. No canonical or alternate portfolio URL SHALL use `?locale=`.

Acceptance criteria:

- AC-004: Generated metadata for every localized index uses its own localized canonical URL.
- AC-005: Generated metadata for every localized project URL uses its own localized canonical URL and the matching slug for all alternates.
- AC-006: The alternate map contains `fr`, `ru`, `en`, and `x-default` only as locale-path URLs.

### REQ-003 — Legacy portfolio redirects

`/portfolio` and `/portfolio/[slug]` SHALL be permanent redirects. A valid `?locale=fr|ru|en` value selects that locale; an absent or invalid value selects French. Redirects SHALL discard legacy locale-query variants and target the matching canonical locale-path URL.

Acceptance criteria:

- AC-007: Legacy index and detail requests return permanent redirects to the required locale-path targets.
- AC-008: Valid legacy locale query variants redirect to their requested locale; missing/invalid variants redirect to French.
- AC-009: No legacy portfolio route renders a portfolio page or emits canonical portfolio metadata.

### REQ-004 — Legacy AI route integrity

`/ai-automation` SHALL remain a permanent redirect to `/fr/ai-automation`. The localized AI routes SHALL remain the canonical pages and their current localized metadata contract SHALL not regress.

Acceptance criteria:

- AC-010: Regression coverage proves the configured legacy AI redirect is permanent and targets `/fr/ai-automation`.
- AC-011: The sitemap excludes `/ai-automation` and retains only the localized AI canonical URLs.

### REQ-005 — Localized navigation and switching

Portfolio links in the localized home page, cards, header, and footer SHALL target the current locale-path portfolio URL. Switching language while on a canonical localized portfolio index or detail URL SHALL preserve the portfolio path and slug while replacing the locale prefix.

Acceptance criteria:

- AC-012: Navigation targets do not introduce unprefixed `/portfolio` URLs.
- AC-013: Language switching maps localized portfolio index and detail URLs to the same localized destination path in the selected language.

### REQ-006 — Canonical sitemap and truthful dates

The sitemap SHALL include the three localized portfolio indexes and every localized portfolio project URL, SHALL exclude all redirect-only legacy portfolio and AI URLs, and SHALL not emit an unevidenced global `lastModified` value.

Acceptance criteria:

- AC-014: Sitemap entries include each canonical localized portfolio route exactly once.
- AC-015: Sitemap entries exclude `/portfolio`, `/portfolio/[slug]`, and `/ai-automation`.
- AC-016: Sitemap entries have no synthetic global `lastModified` field.

### REQ-007 — Regression and release assurance

The change SHALL have focused automated regression tests and reproducible assurance evidence. Before any publication handoff, the Crash Test Gate, `npm run test:ci`, `npm run check:types`, and `npm run build` SHALL pass from `web/`.

Acceptance criteria:

- AC-017: Focused tests cover REQ-002 through REQ-006 and pass.
- AC-018: Crash Test Gate records sitemap/public-route status, one real 404, navigation-anchor audit, affected Vitest results, and clean runtime logs.
- AC-019: Full test, typecheck, and production build evidence is recorded.

## Clarifications and constraints

- The existing redirect rule in `web/next.config.ts` already supplies `/ai-automation` → `/fr/ai-automation`; this Work Block verifies it instead of adding a duplicate redirect mechanism.
- A canonical localized portfolio URL with a stray `?locale=` query is outside the legacy-route redirect rule. Its path locale remains authoritative and generated metadata stays query-free.
- Existing non-portfolio URLs and their SEO treatment are out of scope unless required solely to keep the sitemap free of a redirect-only URL named above.
- No blog, service page, `llms.txt`, dependency, database, environment, deployment, payment, content, or design work is authorized.

## Risks and controls

| Risk | Control |
| --- | --- |
| A legacy query variant leaves duplicate content reachable | Route-level permanent redirect resolves valid locale and falls back to French. |
| New route metadata diverges by index/detail | Focused metadata tests assert canonical and all four alternates. |
| Navigation reintroduces legacy paths | Header, footer, home CTA, and card regressions are tested. |
| Sitemap lists redirect aliases or fabricated timestamps | Generate locale/slug canonical URLs, remove the global date, and test exclusions. |
| Routing change breaks public navigation | Run the mandatory Crash Test Gate against an active local development server; a production-mode smoke check is optional additional evidence only. |

## Completion boundary

Completion is limited to a frozen local candidate with passing Stage 2 evidence and an Owner publication handoff. It does not authorize a commit, push, merge, deployment, or any production action.

## Machine-readable Define traceability

- REQ-001: Render the existing portfolio index and project data only at `/{fr|ru|en}/portfolio` and `/{fr|ru|en}/portfolio/[slug]`, selecting locale solely from the path.
- REQ-002: Emit self-canonical portfolio metadata and `fr`, `ru`, `en`, and French `x-default` alternates using only locale-path URLs.
- REQ-003: Permanently redirect all legacy portfolio index/detail routes and their locale-query variants to locale-path URLs, falling back to French for missing or invalid values.
- REQ-004: Preserve `/ai-automation` as the existing permanent redirect to `/fr/ai-automation` and keep localized AI pages canonical.
- REQ-005: Make portfolio home, card, header, footer, and language-switch links use localized portfolio paths while preserving a detail slug on language switch.
- REQ-006: List only canonical/indexable portfolio and localized AI URLs in the sitemap and remove the unevidenced global `lastModified` field.
- REQ-007: Add regression coverage and pass the Crash Test Gate, full tests, typecheck, and production build.

- AC-001 [req=REQ-001]: All three localized index URLs render the matching existing translation.
- AC-002 [req=REQ-001]: Every existing portfolio slug has localized static paths for all three locales.
- AC-003 [req=REQ-001]: Portfolio text, project data, design, and visual structure do not change except necessary route/link targets.
- AC-004 [req=REQ-002]: Each localized index metadata result uses its own locale-path canonical URL.
- AC-005 [req=REQ-002]: Each localized project metadata result uses its own locale-path canonical URL and matching slug alternates.
- AC-006 [req=REQ-002]: Every portfolio alternate map contains `fr`, `ru`, `en`, and `x-default` as locale-path URLs only.
- AC-007 [req=REQ-003]: Legacy portfolio index and detail requests return permanent redirects to matching locale-path targets.
- AC-008 [req=REQ-003]: Valid legacy locales redirect to that locale and missing or invalid values redirect to French.
- AC-009 [req=REQ-003]: Legacy portfolio routes render no portfolio content and emit no canonical portfolio metadata.
- AC-010 [req=REQ-004]: Regression coverage proves `/ai-automation` permanently redirects to `/fr/ai-automation`.
- AC-011 [req=REQ-004]: The sitemap excludes `/ai-automation` and includes only localized canonical AI URLs.
- AC-012 [req=REQ-005]: Portfolio navigation targets never introduce unprefixed `/portfolio` URLs.
- AC-013 [req=REQ-005]: Switching locale preserves canonical portfolio index/detail path and slug under the chosen locale prefix.
- AC-014 [req=REQ-006]: Sitemap entries include each canonical localized portfolio route exactly once.
- AC-015 [req=REQ-006]: Sitemap entries exclude all legacy portfolio URLs and `/ai-automation`.
- AC-016 [req=REQ-006]: Sitemap entries do not contain a synthetic global `lastModified` field.
- AC-017 [req=REQ-007]: Focused regression tests for metadata, redirects, navigation, and sitemap pass.
- AC-018 [req=REQ-007]: Crash Test Gate records sitemap/public-route status, a real 404, anchor audit, affected tests, and clean runtime logs.
- AC-019 [req=REQ-007]: `npm run test:ci`, `npm run check:types`, and `npm run build` pass from `web/`.
