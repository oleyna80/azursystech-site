# WB-2026-06-27 - Assurance Product Pages Port

## Status

Complete - awaiting Owner review/commit decision

## Lifecycle stage

Verification

## Role

Orchestrator

## Objective

Port the Assurance source site's insurance product pages from `/home/azur/Projects/assurance/assurances/*.html` into the azursystech showcase under `/demo/assurance/assurances`, so the existing "Nos Assurances" navigation resolves to live demo pages instead of broken routes.

## Expected result

- `/demo/assurance/assurances` renders an index page for "Types d'assurances".
- `/demo/assurance/assurances/[slug]` renders live detail pages for all 8 insurance products:
  - `auto`
  - `habitation`
  - `sante`
  - `responsabilite-civile`
  - `emprunteur`
  - `prevoyance`
  - `scolaire`
  - `entreprise`
- The pages reuse the corrected Assurance shell:
  - homepage-matching logo typography
  - consistent top navigation and CTA treatment
  - compact readable hero
  - no disappearing header or hero text after scroll down/up
- The existing dropdown and footer links in the Assurance shell become valid.
- Source runtime behavior is not copied:
  - no cookie banner runtime
  - no source scripts
  - no provider/backend/API behavior
- No commit or push is performed unless Owner separately approves it.

## Source route note

The source URL `http://127.0.0.1:3004/assurances/` is a useful browser entrypoint for the insurance category, but the checked source tree does not contain `/home/azur/Projects/assurance/assurances/index.html`.

The source product content exists as 8 detail pages:

```text
/home/azur/Projects/assurance/assurances/auto.html
/home/azur/Projects/assurance/assurances/emprunteur.html
/home/azur/Projects/assurance/assurances/entreprise.html
/home/azur/Projects/assurance/assurances/habitation.html
/home/azur/Projects/assurance/assurances/prevoyance.html
/home/azur/Projects/assurance/assurances/responsabilite-civile.html
/home/azur/Projects/assurance/assurances/sante.html
/home/azur/Projects/assurance/assurances/scolaire.html
```

The showcase should therefore add both:

- an index page that explains the available insurance types;
- detail pages that preserve the source product content.

## Preflight state

- **Worktree:** `/home/azur/Projects/WSL/azursystech-assurance-from-baseline`
- **Branch:** `feature/assurance-homepage-port-v2`
- **Source directory:** `/home/azur/Projects/assurance/assurances`
- **Current related dirty tree to preserve and continue reviewing together:**
  - `.agent/skills/source-page-porting/SKILL.md`
  - `showcase/app/demo/assurance/_components/**`
  - `showcase/app/demo/assurance/a-propos/**`
  - `showcase/app/demo/assurance/avis/**`
  - `showcase/app/demo/assurance/contact/**`
  - `showcase/app/demo/assurance/devis/**`
  - `showcase/app/demo/assurance/faq/**`
  - `showcase/app/demo/assurance/mentions-legales/**`
  - `showcase/demos/assurance/**`
  - `showcase/public/demo/assurance/**`
- **Current unrelated/prior dirty files to avoid unless separately scoped:**
  - `showcase/demo-kit/sections/AutomationSection.tsx`
  - `showcase/demo-kit/sections/FinalCTASection.tsx`
  - `showcase/demo-kit/sections/ServiceAreaSection.tsx`
  - `showcase/demo-kit/sections/UrgentRequestSection.tsx`
  - `showcase/lib/demos.ts`

Implementation may proceed only after a fresh `git status --short --branch` confirms this boundary.

## Source inventory

| Slug | Source H1 | Source tag | Main source promise |
|---|---|---|---|
| `auto` | Assurance Auto | Automobile | RC obligatoire, tous risques and optional guarantees across AXA and Allianz. |
| `habitation` | Habitation (MRH) | Habitation | Multirisque habitation for owners, tenants, and co-owners. |
| `sante` | Sante / Mutuelle | Sante | Individual and family complementary health coverage. |
| `responsabilite-civile` | Responsabilite Civile | Responsabilite | Professional and private civil liability protection. |
| `emprunteur` | Assurance Emprunteur | Credit Immobilier | Mortgage insurance with Loi Lemoine switching and savings positioning. |
| `prevoyance` | Prevoyance & Assurance Vie | Prevoyance | Protection for relatives and long-term savings. |
| `scolaire` | Assurance Scolaire | Famille | School, extracurricular, accident, and child liability coverage. |
| `entreprise` | Assurance Entreprise | Professionnels | Professional multirisk, RC Pro, collective benefits, and business protection. |

## Visual thesis

Use a calm insurance advisory catalog: bright background, restrained blue/teal accents, strong white space, compact product pages, and a consistent advisory tone rather than a generic card-heavy catalog.

## Content plan

- **Index page:** compact hero, product type grid/list, advisory comparison band, final quote CTA.
- **Detail page:** product hero, guarantee list, who it is for, partner/company note, related insurance links, final quote CTA.
- **Navigation:** keep existing dropdown/footer links and make them resolve to the new pages.

## Interaction thesis

- Dropdown and footer links should feel like stable navigation, not decorative links.
- Product tiles can use small hover transitions for affordance.
- Detail pages should keep critical hero text outside reveal animation; lower sections may use subtle one-way reveal only if already consistent with the existing Assurance pages.

## Lessons carried from previous Work Blocks

1. **Use `.agent/skills/source-page-porting/SKILL.md`.**
   This WB is exactly a source-page porting task.

2. **Do not copy source runtime.**
   Source pages include shared JS and cookie/banner behavior. The showcase should rebuild visible content in React/CSS only.

3. **The Assurance shell is now the authority.**
   Logo font, menu behavior, page background, compact hero, and CTA styling must match the already corrected homepage, devis, info, contact, and legal pages.

4. **The product links are already wired.**
   `showcase/components/assurance/products.ts` and `AssuranceInfoShell.tsx` already point product links to `/demo/assurance/assurances/${slug}`. The missing part is the route implementation.

5. **Critical text must not disappear.**
   Header, logo, hero tag, H1, subtitle, and CTA must remain visible after scroll down/up.

6. **Do not mix this WB with unrelated dirty files.**
   Stage/review later must use explicit pathspecs.

## Scope

### In scope

- Read source files from `/home/azur/Projects/assurance/assurances/*.html`.
- Add the Assurance product index route:
  - `showcase/app/demo/assurance/assurances/page.tsx`
  - `showcase/app/demo/assurance/assurances/AssuranceProductsIndexPage.tsx`
  - `showcase/app/demo/assurance/assurances/page.module.css`
- Add detail routes for the 8 source pages:
  - `showcase/app/demo/assurance/assurances/[slug]/page.tsx`
  - `showcase/app/demo/assurance/assurances/[slug]/AssuranceProductPage.tsx`
  - `showcase/app/demo/assurance/assurances/[slug]/page.module.css`
- Extend product data as needed in:
  - `showcase/components/assurance/products.ts`
- Reuse:
  - `showcase/app/demo/assurance/_components/**`
  - `showcase/components/assurance/Icons.tsx`
- Add route markers:
  - `data-assurance-route="products-index"`
  - `data-assurance-route="product-detail"`
- Preserve current Assurance navigation and footer behavior, making existing product links valid.
- Apply final visual fixes to the Assurance homepage when required to keep shared navigation readable:
  - `showcase/app/demo/assurance/page.module.css`

### Out of scope

- Root app route `/assurances` outside `/demo/assurance`.
- Changes to `/home/azur/Projects/assurance`.
- Cookie banner runtime, source JS, tracking, analytics, backend/API, provider integrations, env/config, secrets, or credentials.
- Real quote/contact form behavior.
- Package/dependency/config changes.
- Changes to unrelated dirty files in `showcase/demo-kit/**` or `showcase/lib/demos.ts`.
- Commit or push.

## Write-set

```text
docs/plans/WB-2026-06-27-assurance-product-pages-port.md
docs/reports/wb-2026-06-27-assurance-product-pages-port-critic.md
showcase/app/demo/assurance/page.module.css
showcase/app/demo/assurance/assurances/**
showcase/components/assurance/products.ts
```

## Acceptance criteria

- [x] `/demo/assurance/assurances` returns HTTP 200.
- [x] `/demo/assurance/assurances/[slug]` returns HTTP 200 for all 8 slugs.
- [x] Unknown product slug returns `notFound()`.
- [x] Product dropdown links in the Assurance header resolve to real pages.
- [x] Footer product links resolve to real pages.
- [x] Index page includes all 8 insurance types.
- [x] Each detail page includes source-derived title, tag, promise, and guarantee list.
- [x] Pages match the corrected Assurance shell and logo typography.
- [x] Header and hero text remain visible after scroll down/up.
- [x] The implementation does not copy source JS, cookie banner behavior, provider calls, env keys, secrets, or tracking.
- [x] Existing routes still work:
  - `/demo/assurance`
  - `/demo/assurance/devis`
  - `/demo/assurance/contact`
  - `/demo/assurance/a-propos`
  - `/demo/assurance/faq`
  - `/demo/assurance/avis`
  - `/demo/assurance/mentions-legales`
  - `/demo/plomberie`
- [x] Pre-existing unrelated dirty files remain untouched.

## Risks and mitigations

| Risk | Impact | Mitigation | Stop condition |
|---|---|---|---|
| Treating `/assurances/` as a single source page when source only has detail files | Wrong route shape | Add an index from existing product data and details from source HTML files | Owner requires exact source index route not present in tree |
| Product pages become generic card catalog | Lower fidelity | Use source content and shared Assurance shell, not generic demo-kit layout | Fidelity requires broader redesign |
| Source JS/cookie runtime copied accidentally | Demo behavior drift | Rebuild content in React/CSS and scan for forbidden runtime patterns | Runtime/provider behavior becomes required |
| Detail routes duplicate too much markup | Maintenance cost | Use shared product data plus one detail component | Per-page custom layout becomes required |
| Existing dirty tree contaminates the WB | Unreviewable commit scope | Keep path-limited diff and stage later only with Owner approval | Unrelated dirty files need edits |
| Reveal animation hides text after scroll | Visual regression | Keep critical first-viewport text outside reveal wrappers | Scroll check fails |

## Subagent topology

- **Critic:** same-session read-only critic report before implementation.
- **Coder:** Codex only, one writer, after Owner confirmation.
- **Verifier:** local verification after implementation.
- **Claude Code:** not used in this WB unless Owner explicitly re-enables it.

## Implementation plan

1. Parse the 8 source HTML pages for title, tag, H1, subtitle/promise, guarantee list, partner note, and CTA text.
2. Extend `showcase/components/assurance/products.ts` with structured detail fields while preserving existing `PRODUCTS` consumers.
3. Create `/demo/assurance/assurances` index route with all 8 product types.
4. Create `/demo/assurance/assurances/[slug]` detail route using the structured data.
5. Verify header dropdown/footer links and unknown slug behavior.
6. Run lint, type, build, route checks, secret/runtime scans, and browser scroll checks.
7. Update this WB to Complete with files changed, checks, risks, and commit readiness.

## Planned checks

```bash
git status --short --branch
git diff --check
npm run lint -- app/demo/assurance/assurances components/assurance/products.ts
npm run check:types
npm run build
curl -fsSI http://localhost:<port>/demo/assurance/assurances
curl -fsSI http://localhost:<port>/demo/assurance/assurances/auto
curl -fsSI http://localhost:<port>/demo/assurance/assurances/habitation
curl -fsSI http://localhost:<port>/demo/assurance/assurances/sante
curl -fsSI http://localhost:<port>/demo/assurance/assurances/responsabilite-civile
curl -fsSI http://localhost:<port>/demo/assurance/assurances/emprunteur
curl -fsSI http://localhost:<port>/demo/assurance/assurances/prevoyance
curl -fsSI http://localhost:<port>/demo/assurance/assurances/scolaire
curl -fsSI http://localhost:<port>/demo/assurance/assurances/entreprise
```

Static scans:

```bash
rg -n "Formspree|formspree|fetch\\(|XMLHttpRequest|sendBeacon|localStorage|cookie|document\\.cookie|ANTHROPIC|OPENAI|sk-|AIza|token|secret|password|\\.env" showcase/app/demo/assurance/assurances showcase/components/assurance/products.ts
```

Browser checks:

- desktop and mobile screenshot/smoke for index and representative detail page;
- scroll down/up on index and detail page;
- header dropdown link navigation;
- footer product link navigation;
- console error check.

## Closeout

- **Stage:** Verification
- **Objective:** Port Assurance product/category pages into the showcase demo under `/demo/assurance/assurances`.
- **Role:** Orchestrator / Coder / Verifier
- **Files changed:**
  - `showcase/components/assurance/products.ts`
  - `showcase/app/demo/assurance/assurances/page.tsx`
  - `showcase/app/demo/assurance/assurances/AssuranceProductsIndexPage.tsx`
  - `showcase/app/demo/assurance/assurances/page.module.css`
  - `showcase/app/demo/assurance/assurances/[slug]/page.tsx`
  - `showcase/app/demo/assurance/assurances/[slug]/AssuranceProductPage.tsx`
  - `showcase/app/demo/assurance/assurances/[slug]/page.module.css`
  - `showcase/app/demo/assurance/page.module.css`
  - `docs/plans/WB-2026-06-27-assurance-product-pages-port.md`
- **Source paths:**
  - `/home/azur/Projects/assurance/assurances/auto.html`
  - `/home/azur/Projects/assurance/assurances/habitation.html`
  - `/home/azur/Projects/assurance/assurances/sante.html`
  - `/home/azur/Projects/assurance/assurances/responsabilite-civile.html`
  - `/home/azur/Projects/assurance/assurances/emprunteur.html`
  - `/home/azur/Projects/assurance/assurances/prevoyance.html`
  - `/home/azur/Projects/assurance/assurances/scolaire.html`
  - `/home/azur/Projects/assurance/assurances/entreprise.html`
- **Target routes:**
  - `/demo/assurance/assurances`
  - `/demo/assurance/assurances/auto`
  - `/demo/assurance/assurances/habitation`
  - `/demo/assurance/assurances/sante`
  - `/demo/assurance/assurances/responsabilite-civile`
  - `/demo/assurance/assurances/emprunteur`
  - `/demo/assurance/assurances/prevoyance`
  - `/demo/assurance/assurances/scolaire`
  - `/demo/assurance/assurances/entreprise`
- **Checks performed:**
  - `git status --short --branch` before implementation and before closeout.
  - `git diff --check` passed.
  - `npm run lint` passed in `showcase/`.
  - `npm run build` passed in `showcase/`; Next reported the pre-existing `metadataBase` warning only.
  - Local server check used existing showcase dev server at `http://127.0.0.1:3004`; starting another server on `3002` was skipped because the project server was already active.
  - HTTP 200 confirmed for `/demo/assurance/assurances`, representative existing routes, and all 8 product detail routes.
  - Unknown slug `/demo/assurance/assurances/not-a-product` returned HTTP 404.
  - Browser smoke with Playwright confirmed desktop/mobile rendering for index and representative detail page.
  - Scroll down/up check confirmed logo, hero tag, and H1 remain visible on index and `auto` detail page.
  - Post-review visual check confirmed the homepage hero text, header phone number, and `Nos Assurances` dropdown labels are readable against their backgrounds.
  - Playwright computed-style check confirmed dropdown menu labels use dark text (`rgb(26, 43, 74)`) and gold icons on the white dropdown surface.
  - Playwright console check found 0 errors.
  - Secret/runtime scan found no source JS, cookie runtime, provider/API calls, env keys, or credential patterns in the product implementation. The only secret-scan hit was the command text inside this WB.
- **Verdict:** PASS
- **Residual risks:**
  - The source tree had 8 detail files but no concrete `assurances/index.html`; the index page is a showcase-native synthesis from the available product data.
  - This WB did not implement root `/assurances`; the portfolio route remains scoped to `/demo/assurance/assurances`.
  - Forms remain demo-only and intentionally do not submit externally.
  - The worktree still contains pre-existing dirty files from earlier Assurance/demo-kit WBs; commit must use explicit pathspecs.
- **Next owner/action:** Owner review in browser at `http://127.0.0.1:3004/demo/assurance/assurances`, then selective commit decision if accepted.
