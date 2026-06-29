# WB-2026-06-27 - Assurance Info Pages Port

## Status

Complete

## Lifecycle stage

Verification

## Role

Orchestrator / Coder / Verifier

## Objective

Port the next Assurance informational pages from `/home/azur/Projects/assurance` into the azursystech showcase as live Next.js nested routes, using the project-local `source-page-porting` skill and avoiding the visual and routing issues found in the homepage and devis Work Blocks.

## Expected result

- `/demo/assurance/a-propos` renders a live page derived from `/home/azur/Projects/assurance/a-propos.html`.
- `/demo/assurance/faq` renders a live page derived from `/home/azur/Projects/assurance/faq.html`.
- `/demo/assurance/avis` renders a live page derived from `/home/azur/Projects/assurance/avis.html`.
- The pages share the same visible Assurance brand shell as `/demo/assurance` and `/demo/assurance/devis`:
  - matching `Paul Clement` / `Paul Clément` logo treatment used by the homepage
  - matching top navigation labels and CTA routing
  - matching page hero color, centered composition, and readable typography
  - no disappearing hero/header text after scroll down/up
- Existing routes remain usable:
  - `/demo/assurance`
  - `/demo/assurance/devis`
  - `/demo/plomberie`
- No commit or push is performed unless Owner separately approves it.

## Preflight state

- **Worktree:** `/home/azur/Projects/WSL/azursystech-assurance-from-baseline`
- **Branch:** `feature/assurance-homepage-port-v2`
- **Source site:** `/home/azur/Projects/assurance`
- **Current known unrelated dirty files:**
  - `showcase/demo-kit/sections/AutomationSection.tsx`
  - `showcase/demo-kit/sections/FinalCTASection.tsx`
  - `showcase/demo-kit/sections/ServiceAreaSection.tsx`
  - `showcase/demo-kit/sections/UrgentRequestSection.tsx`
  - `showcase/lib/demos.ts`
  - `showcase/demos/assurance/`
  - `showcase/public/demo/assurance/`
- **Current prior-WB in-scope dirty files that must not be mixed accidentally:**
  - `docs/plans/WB-2026-06-27-assurance-devis-page-port.md`
  - `docs/reports/wb-2026-06-27-assurance-devis-page-port-critic.md`
  - `showcase/app/demo/assurance/devis/`

Implementation may proceed only after a fresh `git status --short --branch` confirms this boundary.

## Source inventory

### `/home/azur/Projects/assurance/a-propos.html`

- Page tag: `À propos`
- H1: `Paul Clément`
- Purpose: advisor biography, independence, values, CTA to quote/contact
- Primary future links:
  - `devis.html` -> `/demo/assurance/devis`
  - `contact.html` -> `/demo/assurance/contact`

### `/home/azur/Projects/assurance/faq.html`

- Page tag: `FAQ`
- H1: `Questions fréquentes`
- Purpose: FAQ accordion/content page
- Primary future links:
  - `devis.html` -> `/demo/assurance/devis`
  - `contact.html` -> `/demo/assurance/contact`

### `/home/azur/Projects/assurance/avis.html`

- Page tag: `Témoignages`
- H1: `Avis de mes clients`
- Purpose: trust/testimonial page
- Primary future links:
  - `devis.html` -> `/demo/assurance/devis`

## Lessons carried from previous Work Blocks

1. **Use the source-page-porting skill explicitly.**
   The skill is project-local at `.agent/skills/source-page-porting/SKILL.md`. It is required for this WB.

2. **Do not create an unlinked page without a routing decision.**
   Previous confusion around `devis` came from it being a CTA destination rather than a top-menu item. This WB must document whether each page is linked from the shared header, footer, CTA blocks, or only future routes.

3. **Keep the logo and nav consistent from the start.**
   The header must match the homepage visual shell before page-specific styling begins.

4. **Do not let page hero typography drift.**
   Page heroes must use the same compact, centered, navy/gold treatment used after the `devis` correction unless the source page clearly requires a different hero.

5. **Critical first-viewport text must not depend on reveal animation.**
   Header, logo, page tag, H1, hero subtitle, and primary CTAs must remain visible after scroll down/up.

6. **Avoid broad shared-component refactors until duplication justifies it.**
   Route-local duplication is acceptable if it prevents touching unrelated dirty files or redesigning the homepage.

7. **Forms remain separate work.**
   `contact.html` is intentionally excluded from this WB because it contains a Formspree-style form and should get its own form-boundary plan like `devis`.

## Scope

### In scope

- Read source files from `/home/azur/Projects/assurance`:
  - `a-propos.html`
  - `faq.html`
  - `avis.html`
  - `assets/css/variables.css`
  - `assets/css/style.css`
  - `assets/css/components.css`
  - `assets/js/components.js`
  - `assets/js/main.js`
- Create nested static showcase routes:
  - `showcase/app/demo/assurance/a-propos/page.tsx`
  - `showcase/app/demo/assurance/a-propos/AssuranceAProposPage.tsx`
  - `showcase/app/demo/assurance/a-propos/page.module.css`
  - `showcase/app/demo/assurance/faq/page.tsx`
  - `showcase/app/demo/assurance/faq/AssuranceFaqPage.tsx`
  - `showcase/app/demo/assurance/faq/page.module.css`
  - `showcase/app/demo/assurance/avis/page.tsx`
  - `showcase/app/demo/assurance/avis/AssuranceAvisPage.tsx`
  - `showcase/app/demo/assurance/avis/page.module.css`
- Optionally add route-local shared helpers under:
  - `showcase/app/demo/assurance/_components/**`
  - `showcase/app/demo/assurance/_styles/**`
  only if this reduces duplication without touching unrelated dirty paths.
- Convert internal source links to showcase routes.
- Add stable route markers:
  - `data-assurance-route="a-propos-page"`
  - `data-assurance-route="faq-page"`
  - `data-assurance-route="avis-page"`

### Out of scope

- `contact.html` form page.
- Any real form submission, backend/API route, Formspree integration, provider config, env file, or credentials.
- Product assurance subpages under `/assurances/*.html`.
- Changes to `/home/azur/Projects/assurance`.
- Changes to unrelated dirty files in `showcase/demo-kit/**`, `showcase/lib/demos.ts`, `showcase/demos/assurance/**`, or `showcase/public/demo/assurance/**`.
- Package/dependency/config changes.
- Commit or push.

## Write-set

```text
docs/plans/WB-2026-06-27-assurance-info-pages-port.md
docs/reports/wb-2026-06-27-assurance-info-pages-port-critic.md
showcase/app/demo/assurance/a-propos/**
showcase/app/demo/assurance/faq/**
showcase/app/demo/assurance/avis/**
showcase/app/demo/assurance/_components/**
showcase/app/demo/assurance/_styles/**
```

Shared `_components` and `_styles` are optional and should be created only if the implementation needs them. Existing homepage/devis files may be read but should not be edited unless Owner expands the scope.

## Navigation impact

- `/demo/assurance/a-propos` should be reachable from the existing header item `Qui Suis-Je`.
- `/demo/assurance/faq` should be reachable from the existing header item `FAQ`.
- `/demo/assurance/avis` may be linked from testimonial CTA blocks and footer, but does not need to become a top-level header item unless the source header includes it.
- `/demo/assurance/contact` remains a deferred future route.

## Acceptance criteria

- [ ] All three target routes return HTTP 200.
- [ ] Each route includes its stable marker.
- [ ] Each page visually follows its source page on desktop and mobile.
- [ ] Header logo/nav/CTA visually match the homepage and devis route.
- [ ] Page hero color, font size, contrast, and centered alignment are consistent with the corrected `devis` page.
- [ ] Scroll down/up does not hide hero/header text.
- [ ] FAQ interactions are represented as accessible static content or a local accordion without external scripts.
- [ ] No `formspree.io`, `FORMSPREE_URL`, provider token, `.env`, credential, or external form action is introduced.
- [ ] `/demo/assurance`, `/demo/assurance/devis`, and `/demo/plomberie` still work.
- [ ] Pre-existing unrelated dirty files remain untouched.

## Risks and mitigations

| Risk | Impact | Mitigation | Stop Condition |
|---|---|---|---|
| Bundle of three pages becomes too large | Visual drift or incomplete verification | Keep pages informational only; exclude forms and product detail pages | One page needs broad behavior or asset work |
| Header/footer duplication becomes inconsistent | Different logo/menu behavior across routes | Use a narrow route-local shared component only if needed | Shared extraction requires homepage redesign |
| FAQ source JS behavior is copied blindly | Browser/runtime mismatch | Rebuild only visible FAQ behavior in React | External/global script is needed |
| Previous dirty tree contaminates staging | Unreviewable commit scope | Explicit pathspec-only status and diff checks | Unrelated dirty files must be edited |
| Reveal animation hides text after scroll | Broken visual UX | Keep critical first viewport text outside reveal wrappers | Text disappears after scroll and cannot be fixed in route scope |

## Skill routing gate

- **Skills checked:** source-page-porting, frontend-skill, playwright
- **Skills matched:** source-page-porting, frontend-skill, playwright
- **Skills required:** source-page-porting for migration process; frontend-skill for visual adaptation; playwright for browser verification
- **Project-local skill fallback used:** yes, `.agent/skills/source-page-porting/SKILL.md`

## Subagent topology

- **Use Claude Code team:** no by default; user simplified current process to local Codex implementation without Claude Code.
- **Use Critic:** yes, same-session read-only critic before implementation.
- **Use Verifier:** local verification after implementation.
- **Coder:** one Coder only during implementation.

## Implementation plan

1. **Plan**
   - Confirm dirty tree and source inventory.
   - Create this WB and critic report.

2. **Implementation**
   - Inspect each source page section-by-section.
   - Build `a-propos`, `faq`, and `avis` nested routes.
   - Reuse consistent route-local Assurance header/footer visual language.
   - Convert internal links to showcase routes.
   - Keep critical hero text independent from reveal behavior.

3. **Review**
   - Check diff for scope leaks, external form/provider strings, dirty-tree contamination, and visual-shell consistency.

4. **Verification**
   - Run lint, typecheck, build, diff check.
   - Check target and neighbor routes by HTTP.
   - Use browser/Playwright desktop and mobile smoke.
   - Scroll down/up on all three pages and confirm first-viewport text remains visible.

## Implementation result

- Created route-local shared Assurance shell:
  - `showcase/app/demo/assurance/_components/AssuranceInfoShell.tsx`
  - `showcase/app/demo/assurance/_components/AssuranceInfoShell.module.css`
- Created informational routes:
  - `/demo/assurance/a-propos`
  - `/demo/assurance/faq`
  - `/demo/assurance/avis`
- Preserved the corrected navy/gold page hero treatment from the prior `devis` work.
- Kept critical first-viewport text outside reveal animation wrappers.
- Rebuilt FAQ behavior as a local React accordion without external scripts.
- Added stable route markers:
  - `data-assurance-route="a-propos-page"`
  - `data-assurance-route="faq-page"`
  - `data-assurance-route="avis-page"`
- Left prior dirty files and prior-WB `devis` files untouched.

## Verification plan

Expected commands from `showcase/` unless noted:

```bash
git status --short --branch
git diff --check
npm run lint
npm run check:types
npm run build
curl -fsSI http://127.0.0.1:<port>/demo/assurance/a-propos
curl -fsSI http://127.0.0.1:<port>/demo/assurance/faq
curl -fsSI http://127.0.0.1:<port>/demo/assurance/avis
curl -fsSI http://127.0.0.1:<port>/demo/assurance
curl -fsSI http://127.0.0.1:<port>/demo/assurance/devis
curl -fsSI http://127.0.0.1:<port>/demo/plomberie
rg -n "formspree|FORMSPREE|ANTHROPIC_|OPENAI_|API_KEY|SECRET|TOKEN|\\.env|action=|fetch\\(" docs/plans docs/reports showcase/app/demo/assurance
```

Browser smoke:

- desktop screenshot for each target page
- mobile screenshot for each target page
- scroll down/up on each target page
- inspect console warnings/errors
- verify mobile body width equals viewport width
- verify header/nav routes for `Qui Suis-Je`, `FAQ`, and quote CTA

## Verification result

- `npm run lint` — PASS.
- `npm run check:types` — PASS.
- `npm run build` — PASS; Next warning about missing `metadataBase` remains unrelated to this WB.
- `curl -fsSI` target routes — PASS:
  - `/demo/assurance/a-propos` — 200
  - `/demo/assurance/faq` — 200
  - `/demo/assurance/avis` — 200
- `curl -fsSI` neighbor routes — PASS:
  - `/demo/assurance` — 200
  - `/demo/assurance/devis` — 200
  - `/demo/plomberie` — 200
- Code-only secret/form scan over new implementation files — PASS; no `formspree`, env, token, external `action=`, or `fetch(` matches.
- `git diff --check` over this WB write-set — PASS.
- Playwright desktop smoke — PASS:
  - all route markers present
  - H1 remains visible after scroll down/up
  - no horizontal overflow
  - devis links present
- Playwright mobile smoke — PASS:
  - all route markers present
  - H1 remains visible after scroll down/up
  - no horizontal overflow
- Playwright FAQ interaction — PASS:
  - default open item can close
  - closed item can open and reveal its answer
- Playwright console errors — PASS, 0 errors.
- Verification screenshots saved under ignored `showcase/output/playwright/wb-2026-06-27-assurance-info-pages-port/`.

## Review notes

- The header CTA text is `Devis gratuit`, while some acceptance wording said `Obtenir un devis`; routing is correct and matches the current shared Assurance shell.
- `/demo/assurance/contact` remains intentionally deferred and may 404 until a separate contact/form Work Block is opened.
- `npm run build` temporarily changed `showcase/next-env.d.ts`; the generated diff was reverted because it was outside this WB write-set.

## Stop conditions

- Contact form or real lead capture is requested.
- Implementation requires package/dependency/config/env/backend/database/deploy changes.
- Implementation requires editing unrelated dirty files.
- A broad homepage/devis refactor becomes necessary.
- Verification fails and cannot be fixed inside the approved write-set.
- Commit or push is requested without explicit Owner confirmation.

## Rollback / recovery

Remove only files created by this Work Block. Do not revert or delete pre-existing dirty files or prior Work Block outputs.

## Next owner/action

Owner review of the implemented scope. If approved, proceed to commit decision for this WB together with the related prior `devis` WB, or open the next WB for `/demo/assurance/contact` as a separate form-boundary task.
