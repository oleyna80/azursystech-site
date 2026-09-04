# Technical SEO / Crawl / CWV / Entity Audit

**Work Block:** `WB-2026-09-03-technical-seo-cwv-entity-audit`
**Mode:** audit-only; no application changes authorized
**Subject:** `audit/technical-seo-cwv-entity`
**Base:** `a8e4c672632a2c2cca4d5ea60770231da32d1e1c`
**Audit date:** 2026-09-03 (Europe/Paris)
**Production origin:** `https://azursystech.fr`

## Method and evidence boundary

Repository evidence is from the frozen subject checkout. Production evidence is from independent read-only HTTPS probes and a Playwright browser session on 2026-09-03. Source behavior is never substituted for production behavior. No Search Console credentials were available; Search Console conclusions are therefore `UNVERIFIED`, not failures. No CrUX or PageSpeed field/lab dataset was available; CWV numbers are not claimed.

Google interpretation used for CWV: LCP within 2.5 seconds, INP under 200 ms, and CLS within 0.1. These are targets for the 75th percentile, not values measured in this work block. Google also states that valid structured data does not guarantee a rich result and that markup must represent visible content. See [Core Web Vitals](https://developers.google.com/search/docs/appearance/core-web-vitals), [structured-data policies](https://developers.google.com/search/docs/appearance/structured-data/sd-policies), and [supported structured-data features](https://developers.google.com/search/docs/appearance/structured-data/search-gallery).

Evidence shorthand: `R:` repository; `P:` production; `B:` browser/mobile; `L:` lab/field; `GSC:` Search Console.

## Executive findings

The most material verified issue is **one production/release-drift root cause with multiple manifestations**: current source generates localized guide and portfolio routes (`web/src/app/sitemap.ts:13-40`) and localizes current homepage/footer portfolio links, while production serves an older sitemap and `/portfolio` surface and returns 404 for `/fr/portfolio` and `/fr/guides/automatiser-demandes-clients`. This can waste crawl budget, break discovery, and invalidate otherwise sound source-level canonical planning. The individual failures below remain separate observations, but they must be remediated as one deployment/release reconciliation rather than five unrelated fixes. `/demo/*` is an intentional source showcase contract and is not evidence of drift without a failed-route probe.

The `/brief` route is a conversion surface and is currently included in the repository sitemap. `?locale=ru` and `?locale=en` return 200 HTML with different language content but no canonical or robots directive in source or observed production HTML. A product/SEO decision is required before implementation: localized canonical landing pages, or one non-indexed conversion endpoint.

The source has good foundations: locale-prefixed metadata and alternates on major content pages, local fonts, eager hero loading, lazy below-fold images, and JSON-LD on several page types. Remaining performance and entity conclusions are opportunities or unverified metrics, not measured CWV failures.

## Full audit matrix

| # | Checklist item | Result | Finding and evidence | Affected URL/path(s) | SEO/user impact | Confidence | Recommended action | Priority | Future implementation WB? |
|---:|---|---|---|---|---|---|---|---|---|
| 1 | HTTP/HTTPS and host | PARTIAL | `P`: HTTPS works; `/` returns 307 to `/fr`; www probe also returns 307 to `/fr`, but no explicit source host policy is present. | `/`, `https://www.azursystech.fr/` | Extra hop and host policy is not independently proven as permanent. | High | Verify desired host with redirect-chain probes and CDN config; make one permanent canonical policy if required. | P1 | Yes: crawl/indexation cleanup |
| 2 | robots.txt | PASS | `R`: `robots.ts:51-58` allows `/` and publishes sitemap. `P`: 200, `Allow: /`, sitemap present; Cloudflare adds explicit bot restrictions. | `/robots.txt` | Broad crawl access is available; bot-specific Cloudflare policy must remain intentional. | High | Keep and document the distinction between Googlebot and AI/bot content signals. | P2 | Yes: crawl/indexation cleanup |
| 3 | Blocked resources/pages | PARTIAL | `R`: robots allows all. `P`: HTML assets load on `/fr`; a complete crawler/resource inventory was not run. | `/_next/*`, images, fonts, public routes | A blocked critical asset could affect rendering and CWV. | Medium | Run authenticated-free crawl with asset status/resource blocking checks. | P1 | Yes: crawl/indexation cleanup |
| 4 | Sitemap correctness / 200-only canonical URLs | FAIL | `R`: current generator lists localized guide/portfolio paths and `/brief` (`sitemap.ts:13-47`). `P`: sitemap dated 2026-05-31 lists old unlocalized `/portfolio*` URLs and does not list current guide paths; sampled localized portfolio/guide URLs are 404. | `/sitemap.xml`, `/fr/portfolio`, `/fr/guides/automatiser-demandes-clients` | Direct discovery of broken URLs; source and deployed sitemap are materially inconsistent. | High | Publish the exact current sitemap only after verifying every URL returns 200 and self-canonicalizes. | P0 | Yes: crawl/indexation cleanup |
| 5 | Status codes, soft 404s, 5xx | FAIL | `P`: `/fr/portfolio` and `/fr/guides/automatiser-demandes-clients` return 404. No 5xx was observed in the sampled set; full crawl not performed. | Those live URLs; sitemap URLs | Broken sitemap/discovered URLs reduce trust and user access. | High | Reconcile deployment revision/routes, then crawl all sitemap and internal URLs; classify true 404 vs soft 404. | P0 | Yes: crawl/indexation cleanup |
| 6 | Self-canonical | PARTIAL | `R`: localized home/service/guide/portfolio pages define self canonicals and alternates. `R`: `/brief` metadata returns only title/description (`brief/page.tsx:155-160`). `P`: `/fr` emits canonical `/fr`; brief emits none. | Localized content pages; `/brief*` | Most content is well-bound, but brief/query variants are ambiguous. | High | Decide and implement canonical/noindex policy for conversion variants; verify production. | P1 | Yes: crawl/indexation cleanup |
| 7 | noindex / X-Robots-Tag | PARTIAL | No source `noindex` was found for `/brief`; sampled production headers/HTML did not show one. GSC status unavailable. | `/brief*`, all indexable routes | Conversion pages may become indexable unintentionally; absence of a directive is not itself wrong. | High | Make the `/brief` indexation decision explicitly and verify headers/meta after deployment. | P1 | Yes: crawl/indexation cleanup |
| 8 | Redirect chains / internal links through redirects | PARTIAL | `R`: legacy `/ai-automation` redirect is configured; the current homepage uses `/${locale}/portfolio` and the footer localizes `/portfolio`, while `/brief` remains a conversion link. `P`: `/ai-automation` 308s to `/fr/ai-automation`; `/` 307s to `/fr`; the deployed legacy `/portfolio` surface is still live. | `/`, `/ai-automation`, deployed `/portfolio` | Internal redirect hops add crawl and interaction cost; live and current-source route graphs differ. | High | Reconcile the deployed revision first; change source links only if a post-reconciliation crawl finds non-canonical internal targets. Retain deliberate legacy redirects. | P1 | Yes: crawl/indexation cleanup |
| 9 | Legacy route handling | FAIL | `R`: tests/config cover legacy AI and portfolio redirects, but `P`: `/portfolio` and localized portfolio sample behavior is inconsistent with source; live homepage still exposes `/portfolio`. | `/ai-automation`, `/portfolio`, `/portfolio/*` | Legacy visitors and crawlers can receive wrong route/404 behavior. | High | Test each legacy route against deployed revision and define 301/404 policy per route. | P0 | Yes: crawl/indexation cleanup |
| 10 | Query duplicate risk, especially brief locale | FAIL | `R`: `/brief` reads `searchParams.locale` and cookie, with no canonical/noindex (`brief/page.tsx:151-166`). `P`: `/brief`, `?locale=ru`, and `?locale=en` all return 200, different language HTML, and no canonical link. GSC access is unavailable, so actual indexing of query variants is not established. | `/brief`, `/brief?locale=ru`, `/brief?locale=en` | Duplicate URL variants and unstable language/indexation signals are credible, but observed indexation is unknown. | High | Product decision: noindex,follow one conversion endpoint, or create canonical locale paths and remove query variants from sitemap. | P1 | Yes: crawl/indexation cleanup |
| 11 | Unique title per indexable page | PARTIAL | `R`: localized content pages define page-specific metadata; `/brief` has locale-dependent titles. Live `/fr` title is present; full production route inventory unavailable due 404/drift. | All sitemap/content routes | Duplicates or missing deployed pages can weaken snippets. | Medium | Crawl the final deployed URL set and assert unique titles for every intended indexable URL. | P1 | Yes: crawl/indexation cleanup |
| 12 | Useful unique descriptions | PARTIAL | `R`: page-specific descriptions exist for major pages; `/brief` variants have distinct descriptions but are query variants. Full live inventory not verified. | Localized pages; `/brief*` | Better snippets where stable; duplicate conversion variants dilute signals. | Medium | Keep descriptions tied to chosen canonical URL set and validate length/content uniqueness. | P2 | Yes: crawl/indexation cleanup |
| 13 | H1 structure | PASS | `R`: localized home has one hero H1 (`[locale]/page.tsx:113-115`); brief has one H1 (`brief/page.tsx:177-179`); content pages expose one principal H1. `B`: 360px home snapshot shows one level-1 heading. | `/fr`, `/brief`, content page templates | Clear primary topic for users and crawlers. | High | Retain template assertion in route QA. | P2 | No, maintenance only |
| 14 | Title/H1 relationship | PASS | `R`: page metadata is based on page copy and H1 content on home/service/guide/brief templates. No material mismatch found in inspected source/live samples. | `/fr`, `/brief`, service/guide templates | Supports understandable snippets and landing-page relevance. | Medium | Add automated title/H1 smoke assertions if route set is repaired. | P2 | Yes: crawl/indexation cleanup |
| 15 | Localized duplicate/near-duplicate pages | PARTIAL | `R`: locale copies intentionally share templates with translated copy and hreflang. `P`: brief query locales vary HTML while URL remains unlocalized; current live route set is older than source. | `/fr`, `/ru`, `/en`; `/brief?locale=*` | Translation quality and canonical alignment determine whether variants are useful or duplicate. | High | Validate translation parity and choose path-based locale strategy for indexable content. | P1 | Yes: crawl/indexation cleanup |
| 16 | Slash/case/query canonicalization | PARTIAL | `R`: no broad trailing-slash/case normalization is defined; query locale is intentionally interpreted on `/brief` and legal pages. | Any route; `/brief?locale=*` | Multiple URL spellings may fragment signals. | Medium | Probe slash/case/query variants and define one normalization contract. | P1 | Yes: crawl/indexation cleanup |
| 17 | LCP | UNVERIFIED | No CrUX/field or Lighthouse lab run was available. `R` shows eager high-priority raw hero image (`[locale]/page.tsx:93-100`), which is a hypothesis, not a metric. | `/fr` and representative templates | Cannot determine threshold status without 75th-percentile measurement. | High | Run mobile lab plus CrUX/Search Console field review after route deployment is reconciled. | P1 | Yes: CWV/image/mobile performance |
| 18 | CLS | UNVERIFIED | No field/lab CLS value. `R`: raw images omit intrinsic width/height in inspected hero and content images, creating a layout-stability risk. | Home/service/portfolio image templates | Possible visual movement; magnitude unmeasured. | Medium | Measure CLS and add dimensions/aspect reservations in a bounded performance WB if confirmed. | P1 | Yes: CWV/image/mobile performance |
| 19 | INP | UNVERIFIED | No field/lab INP value. Client chat, form, analytics, and interactive navigation are present in source. | `/fr`, `/brief`, non-English shell | Responsiveness impact is possible but not established. | Medium | Measure mobile interactions with field and lab tools; profile chat/form scripts before changing them. | P1 | Yes: CWV/image/mobile performance |
| 20 | Image dimensions/formats/sizes | PARTIAL | `R`: multiple raw `<img>` elements without width/height; hero uses PNG and content uses PNG/SVG (`[locale]/page.tsx:93-100,184,226`). | `/hero.png`, `/business.png`, `/automation-illustration.svg`, portfolio cards | Potential bytes and CLS opportunity; no transfer-size or render-size measurement. | High | Inventory image bytes/render sizes and convert only where evidence supports it. | P1 | Yes: CWV/image/mobile performance |
| 21 | Hero/LCP loading policy | PARTIAL | `R`: hero is `loading=eager`, `fetchPriority=high`, and no intrinsic dimensions; `P`: `/fr` sends high-priority hero preload. | `/fr` hero; service heroes | Priority is intentional, but raw image sizing/format remains a risk. | High | Keep one LCP candidate, measure it, and tune dimensions/format/preload in one WB. | P1 | Yes: CWV/image/mobile performance |
| 22 | Below-fold lazy loading | PASS | `R`: home below-fold raster/illustration images use `loading="lazy"`; portfolio YouTube component uses thumbnail facade and loads iframe on click. | Home sections; portfolio video component | Avoids eager cost for below-fold media. | High | Preserve lazy/facade behavior and verify with network trace. | P2 | Yes: CWV/image/mobile performance |
| 23 | Fonts | PASS | `R`: local Geist/GeistMono via `next/font/local` (`layout.tsx:12-22`); `P`: font preload links are same-origin. | Site shell | Reduces third-party font dependency and FOIT risk. | High | Retain; validate font transfer and text rendering in lab run. | P2 | No, maintenance only |
| 24 | Analytics/chat/YouTube/JS contribution | PARTIAL | `R`: GA loads afterInteractive (`layout.tsx:57-71`); chat renders for non-English (`layout.tsx:81-85`); YouTube is click-to-load. No performance trace. | `/fr`, `/ru`, `/brief`, portfolio details | Third-party/client work may affect INP/LCP, but it is unmeasured. | High | Profile per route/device; defer or reduce only measured contributors. | P1 | Yes: CWV/image/mobile performance |
| 25 | Caching/compression | PARTIAL | `P`: Cloudflare serves HTTPS, `cf-cache-status` varies; `/fr` and `/brief` are private no-store, robots is cached, sitemap is revalidated. No compression-size matrix was collected. | HTML, `/robots.txt`, `/sitemap.xml`, assets | Dynamic HTML may have higher TTFB; policy may be intentional due cookies. | Medium | Record response size/encoding/cache policy for HTML/assets and align with locale/cookie requirements. | P2 | Yes: CWV/image/mobile performance |
| 26 | 360px overflow/clipping | UNVERIFIED | `B`: browser snapshot at 360px renders navigation, hero, sections and form controls; no deterministic scrollWidth probe was admitted by the repository hook, and no screenshot pixel assertion was made. | `/fr` at 360px | Cannot certify absence of overflow from accessibility text alone. | Medium | Run approved visual/DOM mobile assertion and test 320/360/393px widths. | P1 | Yes: CWV/image/mobile performance |
| 27 | Desktop/mobile content parity | PARTIAL | `B`: 360px snapshot retains primary hero, services, portfolio, FAQ, contact and footer content. `R`: responsive classes are present. Live portfolio/guide route drift prevents whole-site parity confirmation. | `/fr`; all localized templates | Mobile users can access core homepage content, but route coverage is inconsistent. | Medium | Compare rendered route inventories at desktop/mobile after deployment reconciliation. | P1 | Yes: CWV/image/mobile performance |
| 28 | Tap target usability | UNVERIFIED | `B`: menu button is 44x44-class and form controls are exposed; no quantitative tap-target audit was completed. | Header, language controls, forms, chat | Small/overlapping controls could hurt mobile conversion. | Medium | Run automated target-size/spacing check and manual touch-flow review. | P2 | Yes: CWV/image/mobile performance |
| 29 | Mobile nav/dialog/chat interference | PARTIAL | `R/B`: mobile menu button and chat button are present; chat is enabled for non-English shell. No interaction trace was completed. | `/fr`, `/ru`, `/brief` | Floating chat may obstruct controls or compete with conversion CTA. | Medium | Test menu, dialogs, form focus, keyboard, and chat overlap at 360px. | P1 | Yes: CWV/image/mobile performance |
| 30 | Breadcrumbs | PARTIAL | `R`: guide and creation pages emit visible breadcrumb plus BreadcrumbList JSON-LD; portfolio index/detail inspected source lacks equivalent JSON-LD/visible breadcrumb. | Guide, creation, portfolio templates | Inconsistent hierarchy and rich-result eligibility. | High | Establish template-level breadcrumb contract and validate visible/schema parity. | P1 | Yes: entity/structured-data cleanup |
| 31 | Orphan pages | UNVERIFIED | `R`: sitemap and route graph can be statically enumerated; `P`: live/source drift invalidates a reliable production graph. No complete crawl graph was run. | All sitemap/internal routes | Important pages may be undiscoverable or only sitemap-discovered. | Medium | Crawl production and compute inbound-link/orphan report from canonical localized homepages. | P1 | Yes: crawl/indexation cleanup |
| 32 | Click depth from localized homepage | UNVERIFIED | `B`: homepage exposes service, brief, portfolio/demo and anchor links; exact depth for every final canonical route is not established because several links are stale. | `/fr` to content/portfolio/brief | Deep or broken paths reduce discovery and conversion. | Medium | Compute depth on the repaired canonical graph and set a target for commercial/guide pages. | P1 | Yes: crawl/indexation cleanup |
| 33 | Internal links through redirects | FAIL | `B/P`: the live homepage links `/portfolio`, whose live canonical is also `/portfolio`; `R`: current homepage/footer portfolio targets are locale-prefixed (`/${locale}/portfolio`). This is a manifestation of the verified production/release drift, not a current-source link defect. | Live homepage `/fr`, live `/portfolio`; current source homepage/footer | Users and crawlers traverse an older deployed route topology. | High | Reconcile the deployed revision and crawl its final URLs. Change source links only if stale targets remain after that reconciliation. | P0 (root cause: production/release drift) | Yes: crawl/indexation cleanup |
| 34 | Guide/commercial/portfolio/brief topology | FAIL | `R`: source has intended guide ↔ service ↔ localized portfolio ↔ brief components; `/demo/*` is an intentional showcase URL contract. `P`: old live HTML and sitemap use unlocalized `/portfolio`, while the current localized portfolio and guide samples return 404. | `/fr`, guide, service, portfolio, brief | The intended information architecture is not the deployed one. | High | Reconcile deployment and publish a route/link contract before SEO fixes; do not classify showcase `/demo/*` as drift without route-specific failure evidence. | P0 (root cause: production/release drift) | Yes: crawl/indexation cleanup |
| 35 | Language switching / locale integrity | PARTIAL | `R/B`: locale buttons and localized shell work; `P`: `/brief?locale=ru/en` changes `lang`, copy, and cookie while URL stays `/brief`. | `/fr`, `/ru`, `/en`, `/brief?locale=*` | Main content locales are coherent; query-based conversion locale is ambiguous. | High | Preserve path locales for indexable content and explicitly bind conversion locale behavior. | P1 | Yes: crawl/indexation cleanup |
| 36 | WebPage/Service/Article/Breadcrumb/FAQ validation | PARTIAL | `R`: WebPage, Service, Article, BreadcrumbList and FAQPage are emitted across selected templates; portfolio index/detail coverage is inconsistent. No Rich Results Test run. | Home, AI, creation, guide, portfolio | Some eligible context exists, but no deployment validation or complete template coverage. | High | Validate each deployed template with Rich Results Test/URL Inspection and fix only supported types. | P1 | Yes: entity/structured-data cleanup |
| 37 | Visible-content/schema parity | PARTIAL | `R`: page JSON-LD derives many values from visible copy; FAQ JSON-LD is generated from FAQ arrays. No complete rendered comparison was run against production, which is source-drifted. | Home/service/guide/AI pages | Mismatch can invalidate eligibility or mislead crawlers. | Medium | Add rendered DOM ↔ JSON-LD parity checks for title, description, FAQ, breadcrumb and language. | P1 | Yes: entity/structured-data cleanup |
| 38 | Organization entity coverage | PARTIAL | `R`: homepage JSON-LD already emits `ProfessionalService` + `Organization` nodes with `@id` values (`_home-data.ts:447-476`); Organization also appears in provider/author/publisher contexts. The gap is identity normalization, not entity absence: one confirmed canonical `@id` is not consistently reused across page references. | Homepage/site shell; service/guide schema | Entity consolidation and attribution may be weaker than necessary. | High | Normalize one Organization identity `@id` across provider/author/publisher references; add only confirmed identity fields where useful. | P1 | Yes: entity/structured-data cleanup |
| 39 | logo/name/url/contact/sameAs | PARTIAL | `R/B`: name, URL, email, phone and WhatsApp are visible; a canonical Organization logo and `sameAs` set were not confirmed. | Homepage/footer/contact | Better entity disambiguation is possible, but only verified official profiles should be added. | High | Inventory authoritative identity fields and add only verified logo/contact/sameAs properties. | P2 | Yes: entity/structured-data cleanup |
| 40 | Unsupported/obsolete rich-result expectations | PARTIAL | FAQPage is present in source. Google deprecated FAQ rich results effective 2026-05-07 and removed the feature documentation in June 2026; FAQ content and Schema.org markup may remain semantically valid, but FAQPage is not a current Google rich-result target. | Home, AI, guide, creation FAQ JSON-LD | Avoids optimizing for an obsolete Google feature; unnecessary markup still creates parity/maintenance cost. | High | Retain FAQ markup only when it accurately represents visible content and product needs; do not plan work around FAQ rich-result appearance. Prioritize supported WebPage/Article/Breadcrumb/Organization uses. | P2 | Yes: entity/structured-data cleanup |
| 41 | Search Console / real indexation | UNVERIFIED | No GSC access. Public `site:` queries were not used to infer indexation. | Property-wide | Index coverage, Google-selected canonicals, sitemap processing, crawl errors, queries and CWV remain unknown. | High | Use the GSC checklist below with Owner access. | P1 | Yes: crawl/indexation cleanup |

## Matrix counts

| Result | Count |
|---|---:|
| PASS | 5 |
| PARTIAL | 22 |
| FAIL | 6 |
| N/A | 0 |
| UNVERIFIED | 8 |
| **Total** | **41** |

## Prioritized findings

### BLOCKER

No audit blocker was raised. The work block can close as reporting-only/audit complete; implementation must not proceed under this audit authorization.

### P0

- **One root cause, multiple manifestations: production/release drift.** Live `/fr/portfolio` and guide sample are 404 while production sitemap and homepage expose an older unlocalized `/portfolio` graph. Rows 4, 5, 9, 33 and 34 describe its separate externally observable symptoms; one deployment/release reconciliation must precede independent source fixes. `/demo/*` is excluded because current source intentionally uses it for showcase routes and no demo failure was proven.

### P1

- Complete production crawl and 200/self-canonical verification after deployment reconciliation.
- Decide and enforce the `/brief` conversion indexation policy; its query-locale risk is a P1 because GSC evidence has not established actual indexing.
- Obtain CrUX/GSC and mobile lab measurements for LCP/CLS/INP; image dimensions and third-party JS are evidence-backed hypotheses only.
- Establish consistent breadcrumb and Organization/entity/schema contracts, normalizing the existing Organization identity rather than creating it from scratch.
- Verify mobile interaction, tap targets, chat overlap, and final route parity.

### P2

- Validate unique snippets and cache/compression policies.
- Inventory verified organization identity fields, logo and `sameAs` opportunities.
- Retain local fonts, lazy loading, click-to-load video facade, and current H1 foundations.

### P3

No P3 finding was required. Cosmetic or speculative SEO changes should wait until P0/P1 route and measurement evidence exists.

## Search Console verification checklist

With Owner-authorized property access, record the date, property, country/device filters, and export or screenshot references for:

1. **Pages / indexing:** indexed, not indexed, reasons, exclusions, validation status, and representative URL Inspection results for every canonical route family.
2. **Google-selected canonical:** URL Inspection for `/fr`, `/ru`, `/en`, guide, service, portfolio index/detail, `/brief`, and any query variants; compare user-declared vs Google-selected canonical.
3. **Sitemap processing:** submitted sitemap URL, discovered URLs, read/error status, last read, and sample URLs that are 404/redirect/noindex.
4. **Crawl errors:** Page indexing issues, server errors, redirect errors, blocked resources, soft 404s, and historical trend.
5. **Search performance:** queries, impressions, clicks, CTR, average position, country/device/search appearance splits, and branded/non-branded segments.
6. **Core Web Vitals:** mobile and desktop URL-group status, LCP/INP/CLS distributions and field dates; do not substitute Lighthouse values.
7. **Enhancements/structured data:** available rich-result reports, errors/warnings, sample URLs, manual actions and security issues. Validate supported features only.

## Hypothesis decisions

- **H1:** confirmed as a decision point, not a defect: `/brief` is a conversion page and currently lacks an indexation policy. Recommend a dedicated policy WB.
- **H2:** confirmed ambiguity: query locale variants are 200 and content-different without canonical/noindex. No fix implemented.
- **H3:** plausible opportunity: raw images without dimensions and PNG hero are present; no CWV failure claimed.
- **H4:** partial opportunity: Organization data already exists on the homepage; normalize its existing identity (`@id`) across provider/author/publisher references and add only confirmed logo/contact/`sameAs` fields if useful.
- **H5:** partial inconsistency: guide/creation breadcrumbs exist; portfolio coverage is not equivalent.
- **H6:** plausible/unverified: GA and non-English chat are in the shell, YouTube is click-to-load; no INP/LCP trace.
- **H7:** confirmed: source sitemap structure and live sitemap/status/canonical behavior require independent deployment reconciliation.

## Proposed future bounded Work Blocks

1. **WB-Crawl-Indexation-Reconciliation (P0):** freeze deployed revision; reconcile source/live routes; repair sitemap to verified 200 self-canonical URLs; define legacy redirects; run full crawl. Change source links only if the post-reconciliation crawl still identifies stale internal targets; decide `/brief` noindex/follow versus localized canonical pages as P1 policy work.
2. **WB-CWV-Image-Mobile (P1):** collect CrUX/GSC and lab baselines; measure LCP/CLS/INP by template; inventory image bytes/dimensions/formats; test 320/360/393px, navigation, form, chat and tap targets; implement only measured improvements.
3. **WB-Entity-Structured-Data (P1):** define canonical Organization identity; normalize WebPage/Service/Article/BreadcrumbList; validate visible/schema parity and supported Google features across final deployed templates.
4. **WB-GSC-Indexation-Baseline (Owner access dependent):** capture Pages, canonicals, sitemap, crawl, Performance, CWV, enhancements and manual-action baseline, then feed verified deltas into implementation WBs.

## Audit closeout evidence

- Source checks: lifecycle state opened by `.codex/scripts/lifecycle.py`; define traceability validator returned `READY`, `requirements=7 acceptance=7 tasks=7`.
- Runtime checks: read-only HTTPS headers/body probes for host redirects, robots, sitemap, representative pages, brief variants, portfolio and guide routes; Playwright production snapshot at 360x800 for `/fr`.
- Lab/field: not run; dependency installation was not authorized and no external CWV dataset was available.
- Search Console: unavailable; all related claims remain `UNVERIFIED`.
- Scope: no application/web source modification, deployment, push, merge, PR, or commit.

## Production P0 evidence appendix

Read-only probes recorded 2026-09-03 16:44 UTC. `final URL` is the `curl -L` effective URL; `Location` is empty where no redirect response was observed. Canonical values are HTML `link[rel=canonical]` where captured; a canonical is not applicable to a non-200 route or XML sitemap.

| Requested URL | Status | Final URL | Location | Canonical / evidence |
|---|---:|---|---|---|
| `https://azursystech.fr/fr/portfolio` | 404 | `https://azursystech.fr/fr/portfolio` | none | N/A — non-200 route; response date `Thu, 03 Sep 2026 16:44:29 GMT` |
| `https://azursystech.fr/fr/guides/automatiser-demandes-clients` | 404 | same requested URL | none | N/A — non-200 route |
| `https://azursystech.fr/portfolio` | 200 | `https://azursystech.fr/portfolio` | none | `https://azursystech.fr/portfolio`; live HTML also exposes `/portfolio/*` links and query-locale alternates |
| `https://azursystech.fr/sitemap.xml` | 200 | `https://azursystech.fr/sitemap.xml` | none | N/A — XML sitemap; entries use `lastmod` `2026-05-31` and include unlocalized `/portfolio` plus `/portfolio/*`, but no current localized guide paths |
