# WB-2026-06-26 — Assurance Next Homepage Port

## Status

Ready for Owner review

## Lifecycle stage

Verification

## Role

Orchestrator

## Objective

Port the existing local insurance-agent site from `/home/azur/Projects/assurance` into the azursystech showcase as a live Next.js demo, starting with a faithful homepage slice at `/demo/assurance`.

This Work Block implements Variant B: rebuild the source HTML/CSS/JS behavior as native showcase code instead of using the generic demo-kit content renderer.

## Expected result

- `/demo/assurance` renders a live homepage derived from `/home/azur/Projects/assurance/index.html`.
- The page uses the original site's real visual structure, CSS decisions, image assets, navigation, CTAs, and interactive behavior where required for the homepage.
- Source assets needed for the homepage are copied into a showcase public asset namespace.
- Existing showcase demos, especially `/demo/plomberie`, remain unchanged.
- No commit or push is performed.

## Current baseline and preflight state

- Worktree: `/home/azur/Projects/WSL/azursystech-assurance-from-baseline`
- Baseline branch state: detached from `origin/feature/showcase-demo-templates`
- Source site: `/home/azur/Projects/assurance`
- Source reference server: `http://127.0.0.1:3005/`
- Known pre-existing dirty files from the earlier demo-kit migration attempt:
  - `showcase/demo-kit/sections/AutomationSection.tsx`
  - `showcase/demo-kit/sections/FinalCTASection.tsx`
  - `showcase/demo-kit/sections/ServiceAreaSection.tsx`
  - `showcase/demo-kit/sections/UrgentRequestSection.tsx`
  - `showcase/lib/demos.ts`
  - `showcase/demos/assurance/`
  - `showcase/public/`

These files are treated as pre-existing dirty scope. This Work Block must not rewrite or normalize them unless Owner explicitly changes the scope. The preferred implementation path is a dedicated route and asset namespace that avoids relying on those prior changes.

## Dirty-tree isolation gate

Before implementation starts, record:

- `git status --short --branch`
- `git diff --name-only`
- untracked file inventory under:
  - `showcase/demos/assurance/`
  - `showcase/public/`

After implementation, record the same inventory and explicitly list which files were created or modified by this Work Block. Any change inside the pre-existing dirty demo-kit files is a stop condition unless Owner expands scope.

The asset namespace for this Work Block must not overlap the prior dirty `showcase/public/demo/assurance/` path. Use a distinct namespace such as `showcase/public/demo/assurance-site/`.

### Pre-implementation inventory

Captured before implementation:

```text
## HEAD (no branch)
 M showcase/demo-kit/sections/AutomationSection.tsx
 M showcase/demo-kit/sections/FinalCTASection.tsx
 M showcase/demo-kit/sections/ServiceAreaSection.tsx
 M showcase/demo-kit/sections/UrgentRequestSection.tsx
 M showcase/lib/demos.ts
 M .agent/critic-gate.md
 ?? docs/plans/WB-2026-06-26-assurance-next-homepage-port-claude-coder-task.md
 ?? docs/plans/WB-2026-06-26-assurance-next-homepage-port.md
 ?? showcase/demos/assurance/
 ?? showcase/public/
```

Tracked dirty files before implementation:

```text
showcase/demo-kit/sections/AutomationSection.tsx
showcase/demo-kit/sections/FinalCTASection.tsx
showcase/demo-kit/sections/ServiceAreaSection.tsx
showcase/demo-kit/sections/UrgentRequestSection.tsx
showcase/lib/demos.ts
```

Pre-existing untracked files under prior Assurance attempt:

```text
showcase/demos/assurance/site.ts
showcase/public/demo/assurance/paul-clement.jpg
showcase/public/demo/assurance/homepage-mockup.png
showcase/public/demo/assurance/paris-hero.jpg
```

Files created during the first blocked Claude Code attempt and now classified as in-scope output of this Work Block:

```text
showcase/public/demo/assurance-site/agent/paul-clement.jpg
showcase/public/demo/assurance-site/hero/paris-hero.jpg
```

The implementation Coder may reuse, replace, or add files under `showcase/public/demo/assurance-site/**`. The older `showcase/public/demo/assurance/**` path remains out of scope.

Orchestration/control metadata changed during gate preparation:

```text
.agent/critic-gate.md
```

This file is Control Tower scope only. The implementation Coder must not modify it.

Critic report generated for the hook gate:

```text
docs/reports/wb-2026-06-26-assurance-next-homepage-port-critic.md
```

This report is Control Tower scope only. The implementation Coder must not modify it.

## Approved scope after Owner implementation approval

### In scope

- Read source files from `/home/azur/Projects/assurance`:
  - `index.html`
  - `assets/css/variables.css`
  - `assets/css/style.css`
  - `assets/css/components.css`
  - `assets/js/main.js`
  - `assets/js/components.js`
  - homepage image and icon assets needed by the page
- Create a dedicated showcase route for the homepage:
  - `showcase/app/demo/assurance/page.tsx`
  - supporting colocated components/CSS under `showcase/app/demo/assurance/` or `showcase/components/assurance/`
- Copy homepage assets into a dedicated namespace, for example:
  - `showcase/public/demo/assurance-site/`
- Reimplement source homepage behavior in React/CSS when needed:
  - responsive header/menu
  - anchor navigation
  - CTA links
  - simple reveal/scroll effects if they materially affect the page
- Keep implementation scoped so that `/demo/plomberie` and other existing demos are not changed.

### Out of scope

- Commit or push.
- Changes to the main worktree `/home/azur/Projects/WSL/azursystech`.
- Changes to source project `/home/azur/Projects/assurance`.
- Importing source agent/control files, memory files, config, secrets, `.env`, provider settings, or build artifacts.
- Importing or executing `assets/js/form.js` unless a homepage form dependency is discovered and Owner approves scope expansion.
- Reworking the generic `showcase/demo-kit` renderer.
- Dependency/package changes.
- Full multi-page migration beyond the homepage.
- Production deployment.

## Route strategy

Use a dedicated static route at `showcase/app/demo/assurance/page.tsx`. This should take precedence over the existing dynamic `showcase/app/demo/[slug]/page.tsx` route and keeps the Assurance demo independent from the generic demo registry.

Later Work Blocks may add nested static routes such as `/demo/assurance/devis`, `/demo/assurance/contact`, and `/demo/assurance/assurances/auto`. This Work Block does not need to complete those pages.

The implementation should include a stable route marker, for example `data-assurance-route="static-homepage"`, so verification can prove `/demo/assurance` is served by the new static route and not by `DemoPageRenderer`, `showcase/lib/demos.ts`, or the pre-existing dirty `showcase/demos/assurance/` content.

## Deferred link policy

Homepage links to not-yet-migrated source pages must be preserved as future showcase paths, not as localhost source links and not as absolute file paths. Examples:

- `devis.html` -> `/demo/assurance/devis`
- `contact.html` -> `/demo/assurance/contact`
- `assurances/auto.html` -> `/demo/assurance/assurances/auto`

Those non-home routes may return 404 during this homepage-only Work Block. The homepage acceptance criteria cover visible link correctness, not full linked-page completion.

## Execution plan

1. **Plan**
   - Record current dirty state and approved boundaries.
   - Define the first slice as homepage-only.
   - Run read-only Critic review of this plan.

2. **Implementation**
   - Inspect source homepage structure, CSS variables, shared components, and homepage JS.
   - Create the dedicated Next route and scoped stylesheet/components.
   - Copy only homepage-required assets into the showcase public namespace.
   - Rebuild homepage sections in React with source-faithful layout and content.
   - Keep prior demo-kit dirty files untouched unless an explicit conflict requires escalation.

3. **Review**
   - Use read-only review to check:
     - source fidelity
     - route isolation
     - no accidental coupling to old demo-kit attempt
     - no secrets/private config
     - no dependency/config drift

4. **Verification**
   - Run local checks.
   - Start or reuse showcase dev server.
   - Verify:
     - `/demo/assurance`
     - `/demo/plomberie`
   - Capture desktop and mobile screenshots for the Assurance page and compare against the source reference server.
   - Capture at least one `/demo/plomberie` browser screenshot to detect visual regression, not only HTTP availability.

## Claude Code / subagent usage

After Owner approves implementation, Claude Code may be used as the controlled execution runtime:

- **Write-capable Coder:** one scoped implementation agent for the route/assets/components only.
- **Read-only Reviewer:** inspect diff and source fidelity.
- **Read-only Verifier:** run checks and browser smoke where possible.

Codex remains the Orchestrator and consolidates results. Native Codex Critic is used for this plan review before implementation starts.

## Acceptance criteria

- `/demo/assurance` returns HTTP 200 in the showcase dev server.
- `/demo/assurance` includes the static route marker and does not render via `DemoPageRenderer`.
- The homepage is a live Next.js page, not a static screenshot.
- Visual structure closely follows `/home/azur/Projects/assurance/index.html` at desktop and mobile widths.
- Homepage images load from showcase public assets.
- Header/navigation and primary CTAs work for homepage scope.
- Non-home internal links use future `/demo/assurance/...` paths and do not point to localhost or filesystem paths.
- `/demo/plomberie` still returns HTTP 200 and is not visually broken.
- No secrets, API keys, provider credentials, `.env`, build output, or dependency lockfile changes are introduced.
- Pre-existing dirty demo-kit files are not modified by this Work Block unless Owner explicitly expands scope.

## Checks

Checks performed:

- `git status --short --branch` - completed; unrelated dirty files remain isolated.
- `git diff --check` - passed. The command printed environment stream-fd warnings but exited successfully.
- Package/config drift check over package files, lockfiles, Next config, tsconfig, env files, and `showcase/next-env.d.ts` - no changed files reported.
- `npm run lint` from `showcase/` - passed.
- `npm run check:types` from `showcase/` - passed.
- `npm run build` from `showcase/` - passed; `/demo/assurance` is listed as a separate static route.
- `curl -fsSI http://localhost:3004/demo/assurance` - HTTP 200.
- `curl -fsSI http://localhost:3004/demo/plomberie` - HTTP 200.
- Browser route-isolation check for `/demo/assurance` - static marker present.
- Deferred link policy check - required future paths are present for `devis`, `contact`, and all product detail links; source localhost links are absent. Remaining `#contact` links are homepage section navigation.
- Browser mobile geometry check for `/demo/assurance` - viewport width equals body width; overflowing element count is 0.
- Browser smoke screenshot for `/demo/assurance` - captured on mobile after final CSS fixes.
- Browser smoke screenshot for `/demo/plomberie` - captured; page remains visually usable.
- Post-visual-fix scroll regression check for `/demo/assurance` - after wheel down/up, `scrollY: 0`, `h1Opacity: 1`, `heroTextOpacity: 1`, and no reveal wrapper around the hero text.
- Header contrast check for `/demo/assurance` - phone link color resolves to `rgba(255, 255, 255, 0.9)` on desktop and remains hidden with desktop nav at 390px mobile width.
- Browser console error check after final scroll regression pass - 0 errors.
- Secret scan over changed docs and Assurance route/components - no matches.

If a check is unavailable or blocked by existing unrelated dirty state, record the limitation explicitly.

Limitations recorded:

- `/demo/plomberie` browser console reports a pre-existing-looking `favicon.ico` 404. The page itself returns 200, has no Assurance route marker, and shows no viewport overflow.
- `npm run build` reports the existing `metadataBase` warning from project metadata. No build failure.

## Risks

- The source site is static HTML/CSS/JS; not every behavior should be copied directly. React reimplementation is safer for homepage interactivity.
- The current worktree already contains dirty files from a prior migration attempt. The implementation must avoid blending the new dedicated route with that older demo-kit path.
- A homepage-only slice may still expose links to pages that are not yet migrated. Those links should be retained as part of the site model, but full page behavior belongs to later Work Blocks.
- Exact visual parity may require iterative screenshot comparison and adjustment.

## Stop conditions

- Implementation requires editing pre-existing dirty demo-kit files.
- Source project contains private/config/agent files needed for page behavior.
- Homepage implementation requires `assets/js/form.js` or form submission behavior.
- New dependency or package change appears necessary.
- The dedicated route conflicts with Next routing in a way that requires broader showcase architecture changes.
- `/demo/assurance` is served by the existing demo registry or `DemoPageRenderer` instead of the static route.
- Verification shows `/demo/plomberie` regression.

## Critic review

Native Codex Critic returned `SUPPLEMENT`.

Required supplements were applied:

- added before/after dirty-tree inventory gate
- required a non-overlapping asset namespace
- added static route marker verification
- excluded `assets/js/form.js` unless explicitly escalated
- added package/config drift checks
- added `/demo/plomberie` browser visual smoke
- defined deferred internal link behavior for homepage-only scope

Post-implementation read-only Critic review returned `SUPPLEMENT` for deferred link policy. The links were corrected and the re-check returned `APPROVE`.

## Implementation result

- Created a dedicated static Next route at `showcase/app/demo/assurance/page.tsx`.
- Rebuilt the Assurance homepage as a live React/CSS implementation, not a static screenshot.
- Copied homepage-required images into `showcase/public/demo/assurance-site/**`.
- Added scoped Assurance components and CSS modules under `showcase/components/assurance/**`.
- Removed reveal-state dependency from first-viewport hero text after visual review found text could disappear when scrolling down and back to the top.
- Hardened header phone link contrast over the dark hero background while preserving the mobile hide behavior.
- Kept the earlier dirty demo-kit files and old `showcase/demos/assurance/**` / `showcase/public/demo/assurance/**` paths out of scope.
- Preserved deferred non-home source links as future showcase paths such as `/demo/assurance/devis`, `/demo/assurance/contact`, and `/demo/assurance/assurances/auto`.
- Captured the reusable migration process as a project-local skill at `.agent/skills/source-page-porting/SKILL.md`.

## Files changed by this Work Block

Control and planning:

- `.agent/critic-gate.md`
- `docs/plans/WB-2026-06-26-assurance-next-homepage-port.md`
- `docs/plans/WB-2026-06-26-assurance-next-homepage-port-claude-coder-task.md`
- `docs/reports/wb-2026-06-26-assurance-next-homepage-port-critic.md`
- `.agent/skills/source-page-porting/SKILL.md`

Showcase implementation:

- `showcase/app/demo/assurance/AssuranceHomePage.tsx`
- `showcase/app/demo/assurance/icon.svg`
- `showcase/app/demo/assurance/page.module.css`
- `showcase/app/demo/assurance/page.tsx`
- `showcase/components/assurance/Icons.tsx`
- `showcase/components/assurance/Reveal.module.css`
- `showcase/components/assurance/Reveal.tsx`
- `showcase/components/assurance/buttons.module.css`
- `showcase/components/assurance/products.ts`
- `showcase/components/assurance/tokens.module.css`
- `showcase/public/demo/assurance-site/agent/paul-clement.jpg`
- `showcase/public/demo/assurance-site/hero/paris-hero.jpg`

## Claude Code usage result

Claude Code was used as the attempted controlled execution runtime. It copied the homepage image assets and produced initial scoped component files, but one run was blocked by the critic gate and a later run hung after partial output. Codex completed and verified the implementation within the approved scope.

## Closeout template

- Stage: Verification
- Objective: Port the Assurance homepage into the showcase as a live Next.js route - completed for homepage scope.
- Role: Orchestrator
- Files changed: listed in "Files changed by this Work Block".
- Checks run: lint, typecheck, build, diff check, HTTP smoke, browser smoke, route marker, mobile overflow, package/config drift, secret scan.
- Additional visual regression checks: scroll down/up hero text visibility, header phone contrast, mobile header hide rules, browser console errors.
- Review result: plan Critic supplements resolved; post-implementation Critic returned SUPPLEMENT on deferred link policy; policy was corrected and re-check returned APPROVE.
- Verification result: PASS with recorded limitations.
- Risks: homepage-only slice; non-home Assurance pages are not migrated; existing unrelated dirty files remain in the worktree; `/demo/plomberie` has an unrelated favicon 404.
- Derived reusable artifact: `.agent/skills/source-page-porting/SKILL.md` for future page/site migration Work Blocks.
- Next owner/action: Owner visual review at `http://localhost:3004/demo/assurance`; no commit or push until explicitly approved.
