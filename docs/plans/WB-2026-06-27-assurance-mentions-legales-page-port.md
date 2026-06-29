# WB-2026-06-27 - Assurance Mentions Legales Page Port

## Status

Complete

## Lifecycle stage

Verification

## Role

Orchestrator / Coder / Verifier

## Objective

Port the final root-level Assurance legal page from `/home/azur/Projects/assurance/mentions-legales.html` into the azursystech showcase as a live static Next.js route at `/demo/assurance/mentions-legales`.

## Expected result

- `/demo/assurance/mentions-legales` renders a live legal/privacy/cookies page derived from the source site.
- The route preserves the source legal content structure, including anchors:
  - `#confidentialite`
  - `#cookies`
- The page uses the same Assurance shell, logo, navigation, footer language, hero color, centered composition, and readable typography as the already migrated Assurance pages.
- Footer legal links point to the new route if implementation scope is confirmed.
- No cookie-consent runtime, analytics, backend/API route, provider config, env file, or credentials are introduced.
- No commit or push is performed unless Owner separately approves it.

## Preflight state

- **Worktree:** `/home/azur/Projects/WSL/azursystech-assurance-from-baseline`
- **Branch:** `feature/assurance-homepage-port-v2`
- **Source page:** `/home/azur/Projects/assurance/mentions-legales.html`
- **Project-local migration skill:** `.agent/skills/source-page-porting/SKILL.md`
- **Current unrelated dirty files that must not be edited by this WB:**
  - `showcase/demo-kit/sections/AutomationSection.tsx`
  - `showcase/demo-kit/sections/FinalCTASection.tsx`
  - `showcase/demo-kit/sections/ServiceAreaSection.tsx`
  - `showcase/demo-kit/sections/UrgentRequestSection.tsx`
  - `showcase/lib/demos.ts`
  - `showcase/demos/assurance/`
  - `showcase/public/demo/assurance/`
- **Current prior-WB dirty files that must be preserved and not mixed accidentally:**
  - `docs/plans/WB-2026-06-27-assurance-contact-demo-form-port.md`
  - `docs/plans/WB-2026-06-27-assurance-devis-page-port.md`
  - `docs/plans/WB-2026-06-27-assurance-info-pages-port.md`
  - `docs/reports/wb-2026-06-27-assurance-contact-demo-form-port-critic.md`
  - `docs/reports/wb-2026-06-27-assurance-devis-page-port-critic.md`
  - `docs/reports/wb-2026-06-27-assurance-info-pages-port-critic.md`
  - `showcase/app/demo/assurance/_components/`
  - `showcase/app/demo/assurance/a-propos/`
  - `showcase/app/demo/assurance/avis/`
  - `showcase/app/demo/assurance/contact/`
  - `showcase/app/demo/assurance/devis/`
  - `showcase/app/demo/assurance/faq/`

Implementation may proceed only after a fresh `git status --short --branch` confirms this boundary.

## Source inventory

### `/home/azur/Projects/assurance/mentions-legales.html`

- Page tag: `Legal`
- H1: `Mentions Legales`
- Purpose: legal notice, privacy policy, cookie information, regulated insurance activity, mediation, intellectual property, and liability information.
- Source meta behavior:
  - `robots` is `noindex, follow`
  - source title and description identify the page as legal/privacy/cookies content
- Important section anchors:
  - `id="confidentialite"`
  - `id="cookies"`
- External legal references:
  - `https://www.orias.fr`
  - `https://www.cnil.fr`
  - `https://www.mediation-assurance.org`
- Source email link:
  - `mailto:contact@paulclement-assurance.fr`

### Source sections to preserve

1. Editeur du site
2. Hebergement
3. Activite reglementee
4. Politique de confidentialite
5. Gestion des cookies
6. Propriete intellectuelle
7. Limitation de responsabilite
8. Mediation des assurances
9. Derniere mise a jour

### Source JavaScript/CSS relationship

- Source files such as `assets/js/components.js` include footer legal links and cookie-banner links to `mentions-legales.html`, `mentions-legales.html#confidentialite`, and `mentions-legales.html#cookies`.
- This WB may inspect those files to preserve navigation/link intent.
- This WB must not port source cookie-banner runtime behavior or local storage behavior.

## Lessons carried from previous Work Blocks

1. **Use the project-local source-page-porting skill.**
   The skill captures the current migration rules: dirty-tree safety, route markers, link conversion, browser checks, scroll down/up checks, and avoiding broad shared refactors.

2. **Legal links are discoverability, not top navigation.**
   `mentions-legales` should not become a main top-nav item unless Owner requests it. It should be reachable from footer/legal links and from privacy/cookies anchors.

3. **Footer edits affect every migrated Assurance page.**
   If the implementation updates `AssuranceInfoShell`, it must be a narrow route-local footer-link addition and must be verified against existing migrated pages.

4. **Do not port cookie consent behavior.**
   The legal page may describe cookies, but it must not add a cookie banner, `localStorage`, analytics, tracking, or consent runtime.

5. **Critical first-viewport text must not depend on reveal behavior.**
   Header, logo, page tag, H1, hero subtitle, and primary navigation must remain visible after scroll down/up.

6. **Keep the corrected Assurance brand shell consistent.**
   Logo treatment, nav labels, page background, hero typography, and CTA/button sizing must match the corrected homepage/devis/info/contact pages.

7. **Avoid accidental dirty-tree mixing.**
   This WB must not touch unrelated demo-kit files, generated demo asset folders, or prior-WB files outside the approved write-set.

## Scope

### In scope

- Read source files from `/home/azur/Projects/assurance`:
  - `mentions-legales.html`
  - `assets/css/variables.css`
  - `assets/css/style.css`
  - `assets/css/components.css`
  - `assets/js/components.js`
  - `assets/js/main.js`
- Create a nested static showcase route:
  - `showcase/app/demo/assurance/mentions-legales/page.tsx`
  - `showcase/app/demo/assurance/mentions-legales/AssuranceMentionsLegalesPage.tsx`
  - `showcase/app/demo/assurance/mentions-legales/page.module.css`
- Optionally update the route-local shared shell only for footer legal links:
  - `showcase/app/demo/assurance/_components/AssuranceInfoShell.tsx`
  - `showcase/app/demo/assurance/_components/AssuranceInfoShell.module.css`
- Convert source legal links:
  - `mentions-legales.html` -> `/demo/assurance/mentions-legales`
  - `mentions-legales.html#confidentialite` -> `/demo/assurance/mentions-legales#confidentialite`
  - `mentions-legales.html#cookies` -> `/demo/assurance/mentions-legales#cookies`
- Keep external legal links as plain content links with safe link attributes when opened in a new tab.
- Add a stable route marker:
  - `data-assurance-route="mentions-legales-page"`
- Preserve anchor IDs:
  - `confidentialite`
  - `cookies`

### Out of scope

- Cookie consent banner implementation.
- `localStorage`, analytics, tracking, consent runtime, or browser storage behavior.
- Legal/compliance reinterpretation of source content.
- Real form submission, backend/API routes, provider config, env files, credentials, or secrets.
- Product assurance subpages under `/assurances/*.html`.
- Changes to `/home/azur/Projects/assurance`.
- Changes to unrelated dirty files in `showcase/demo-kit/**`, `showcase/lib/demos.ts`, `showcase/demos/assurance/**`, or `showcase/public/demo/assurance/**`.
- Package/dependency/config changes.
- Commit or push.

## Write-set

```text
docs/plans/WB-2026-06-27-assurance-mentions-legales-page-port.md
docs/reports/wb-2026-06-27-assurance-mentions-legales-page-port-critic.md
showcase/app/demo/assurance/mentions-legales/**
showcase/app/demo/assurance/_components/AssuranceInfoShell.tsx
showcase/app/demo/assurance/_components/AssuranceInfoShell.module.css
```

Shared shell edits are optional and limited to footer legal-link discoverability. Existing homepage/devis/info/contact files may be read but should not be edited unless Owner expands the scope.

## Navigation impact

- `/demo/assurance/mentions-legales` should be reachable from footer legal links.
- `/demo/assurance/mentions-legales#confidentialite` should be reachable from privacy-policy references.
- `/demo/assurance/mentions-legales#cookies` should be reachable from cookie references.
- The top navigation should remain focused on the user-facing commercial pages unless Owner asks to add legal navigation.

## Acceptance criteria

- [x] `/demo/assurance/mentions-legales` returns HTTP 200.
- [x] The route includes `data-assurance-route="mentions-legales-page"`.
- [x] All source legal sections are represented.
- [x] `#confidentialite` and `#cookies` anchors work.
- [x] Footer legal links point to the new route and anchors.
- [x] Header logo/nav/CTA visually match the migrated Assurance pages.
- [x] Page hero color, font size, contrast, and centered alignment match the corrected page-shell style.
- [x] Scroll down/up does not hide header, logo, hero title, subtitle, or legal content.
- [x] No `localStorage`, cookie banner, analytics, provider token, `.env`, credential, or external form action is introduced.
- [x] Existing routes still work:
  - `/demo/assurance`
  - `/demo/assurance/devis`
  - `/demo/assurance/a-propos`
  - `/demo/assurance/faq`
  - `/demo/assurance/avis`
  - `/demo/assurance/contact`
  - `/demo/plomberie`
- [x] Pre-existing unrelated dirty files remain untouched.

## Risks and mitigations

| Risk | Impact | Mitigation | Stop Condition |
|---|---|---|---|
| Legal text is treated as production advice | Misleading compliance signal | Preserve source demo framing and avoid reinterpretation | Production/legal compliance claims are requested |
| Shared footer edit affects all Assurance routes | Regression across migrated pages | Keep footer edit narrow and verify existing routes | Shell refactor becomes necessary |
| Cookie-banner source behavior is copied | Demo gains unwanted state/tracking behavior | Port text and links only, not runtime | Runtime consent/storage logic becomes required |
| External legal links are handled unsafely | Browser/security issue | Use safe attributes for new-tab links | External script/provider is needed |
| Dirty-tree contamination | Unreviewable WB scope | Use explicit write-set and path review | Unrelated dirty file requires editing |

## Skill routing gate

- **Skills checked:** source-page-porting, frontend-skill, playwright
- **Skills matched:** source-page-porting, frontend-skill, playwright
- **Skills required:** source-page-porting for migration process; frontend-skill for visual adaptation; playwright for browser verification
- **Project-local skill fallback used:** yes, `.agent/skills/source-page-porting/SKILL.md`

## Subagent topology

- **Use Claude Code team:** no by default in the current simplified flow.
- **Use Critic:** yes, same-session read-only critic before implementation.
- **Use Verifier:** local verification after implementation.
- **Coder:** one Coder only during implementation.

## Implementation plan

1. **Plan**
   - Confirm dirty tree and source inventory.
   - Create this WB and critic report.

2. **Implementation**
   - Inspect source legal page section-by-section.
   - Build the nested static route.
   - Convert legal, privacy, cookies, mailto, and external links.
   - Add footer legal-link discoverability in the shared Assurance shell if Owner confirms implementation scope.
   - Keep critical hero/header text independent from reveal behavior.

3. **Review**
   - Compare implementation against this WB, source page, and critic guardrails.
   - Confirm no cookie runtime or provider/config/secrets were introduced.

4. **Verification**
   - Run static checks.
   - Run browser checks for route availability, anchors, footer links, console errors, and scroll down/up visibility.
   - Re-check neighboring migrated routes after any shared shell edit.

## Closeout

- **Owner decision:** Implementation confirmed.
- **Files changed by this WB:**
  - `docs/plans/WB-2026-06-27-assurance-mentions-legales-page-port.md`
  - `docs/reports/wb-2026-06-27-assurance-mentions-legales-page-port-critic.md`
  - `showcase/app/demo/assurance/mentions-legales/page.tsx`
  - `showcase/app/demo/assurance/mentions-legales/AssuranceMentionsLegalesPage.tsx`
  - `showcase/app/demo/assurance/mentions-legales/page.module.css`
  - `showcase/app/demo/assurance/_components/AssuranceInfoShell.tsx`
  - `showcase/app/demo/assurance/_components/AssuranceInfoShell.module.css`
- **Review result:** same-session Critic approved the plan with guardrails before implementation; implementation was reviewed against the approved write-set and source page.
- **Verification result:** `PASS`.
- **Checks run:**
  - `npm run lint -- app/demo/assurance/_components/AssuranceInfoShell.tsx app/demo/assurance/mentions-legales`
  - `npm run check:types`
  - `npm run build`
  - `git diff --check`
  - `curl -fsSI` for `/demo/assurance/mentions-legales`, existing Assurance routes, and `/demo/plomberie`
  - Playwright browser checks for page title, route marker, `#confidentialite`, `#cookies`, footer legal links, console warnings/errors, cookies, localStorage, screenshot, and scroll down/up visibility
  - `rg` secret/runtime scan for storage, cookie-banner, analytics, form provider, network call, token, API key, auth token, secret, and provider patterns
- **Notes:**
  - The page preserves the source legal/privacy/cookies content as demo content; it does not implement cookie consent runtime or browser storage behavior.
  - `next build` temporarily rewrote `showcase/next-env.d.ts`; it was restored to its prior tracked state because it is outside this WB scope.
- **Commit/push:** not performed; requires separate Owner approval.
