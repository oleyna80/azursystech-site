# Claude Code Coder Task — WB-2026-06-26 Assurance Next Homepage Port

## Role

Coder

## Repository/worktree

`/home/azur/Projects/WSL/azursystech-assurance-from-baseline`

## Source site

`/home/azur/Projects/assurance`

Reference server, if still running: `http://127.0.0.1:3005/`

## Objective

Implement the first live Next.js slice of the Assurance showcase demo: a dedicated homepage at `/demo/assurance` based on `/home/azur/Projects/assurance/index.html`.

This is Variant B: rebuild the homepage as native Next/React code. Do not use the generic demo-kit renderer for this page.

## Required context

Read before editing:

- `docs/plans/WB-2026-06-26-assurance-next-homepage-port.md`
- `showcase/app/demo/[slug]/page.tsx`
- `showcase/app/demo/[slug]/layout.tsx`
- `showcase/app/globals.css`
- `/home/azur/Projects/assurance/index.html`
- `/home/azur/Projects/assurance/assets/css/variables.css`
- `/home/azur/Projects/assurance/assets/css/style.css`
- `/home/azur/Projects/assurance/assets/css/components.css`
- `/home/azur/Projects/assurance/assets/js/components.js`
- `/home/azur/Projects/assurance/assets/js/main.js`

Do not read or import source agent/control/memory/config files unless explicitly needed for understanding project context. They are out of scope for implementation.

## Allowed write-set

You may create or modify only:

- `showcase/app/demo/assurance/**`
- `showcase/components/assurance/**`
- `showcase/public/demo/assurance-site/**`

Two files may already exist under `showcase/public/demo/assurance-site/**` from the first blocked Claude Code attempt:

- `showcase/public/demo/assurance-site/agent/paul-clement.jpg`
- `showcase/public/demo/assurance-site/hero/paris-hero.jpg`

Treat them as in-scope output of this Work Block. You may reuse, replace, or add to this `assurance-site` namespace.

Do not modify these pre-existing dirty paths:

- `showcase/demo-kit/sections/AutomationSection.tsx`
- `showcase/demo-kit/sections/FinalCTASection.tsx`
- `showcase/demo-kit/sections/ServiceAreaSection.tsx`
- `showcase/demo-kit/sections/UrgentRequestSection.tsx`
- `showcase/lib/demos.ts`
- `showcase/demos/assurance/**`
- `showcase/public/demo/assurance/**`

Do not modify package files, lockfiles, config files, environment files, or source project files.

Do not modify Control Tower metadata:

- `.agent/critic-gate.md`
- `docs/reports/wb-2026-06-26-assurance-next-homepage-port-critic.md`

## Implementation requirements

- Create a dedicated static route at `showcase/app/demo/assurance/page.tsx`.
- Ensure the rendered page includes `data-assurance-route="static-homepage"` on a stable top-level element.
- Prefer CSS Modules or route-local component styling; do not add global CSS unless unavoidable.
- Copy only homepage-required assets into `showcase/public/demo/assurance-site/`.
- Recreate the homepage as a live page, not a screenshot.
- Preserve the source page's brand, hero hierarchy, sections, CTAs, navigation, visual assets, and responsive behavior.
- Reimplement only homepage-needed behavior in React/CSS:
  - responsive menu if present
  - in-page anchors if present
  - primary CTA hover/focus states
  - simple reveal/scroll behavior only if it materially affects the source homepage
- Convert non-home internal links to future showcase paths:
  - `devis.html` -> `/demo/assurance/devis`
  - `contact.html` -> `/demo/assurance/contact`
  - `assurances/auto.html` -> `/demo/assurance/assurances/auto`
  - same pattern for other `assurances/*.html`
- It is acceptable that those future paths return 404 during this homepage-only Work Block.

## Out of scope

- Do not import or execute `/home/azur/Projects/assurance/assets/js/form.js`.
- Do not implement contact/devis/assurance subpages.
- Do not edit the demo registry or generic `DemoPageRenderer`.
- Do not add dependencies.
- Do not run commit or push.
- Do not revert or clean existing dirty files; you are not alone in the codebase.

## Stop and report instead of editing if

- You need to edit any path outside the allowed write-set.
- Next routing requires a broader architecture change.
- The implementation appears to require `form.js`, form submission, package changes, or config changes.
- You discover private config, secrets, credentials, or `.env` content in files you would need to copy.
- Existing dirty files block the route implementation.

## Suggested visual thesis

Paris insurance advisor homepage: clear, local, trustworthy, image-led, with a calm navy/white foundation and warm gold CTA accent.

## Suggested content plan

- Hero: brand, local insurance promise, primary CTA, Paris/agent visual anchor.
- Support: core insurance products and client value.
- Detail: advisory process, proofs, local trust cues.
- Final CTA: request quote or contact advisor.

## Suggested interaction thesis

- Mobile menu opens cleanly without layout shift.
- CTA and product links have restrained hover/focus transitions.
- Sections may reveal softly on scroll only if it can be done without dependency changes.

## Checks to run if feasible

From `showcase/`:

- `npm run lint`
- `npm run build`

From repo root:

- `git status --short --branch`
- `git diff --name-only`
- `git diff --check`

If checks cannot be run, explain why.

## Required final response

Report:

- files changed
- assets copied
- route strategy used
- whether any stop condition was encountered
- checks run and results
- risks or follow-up needed
