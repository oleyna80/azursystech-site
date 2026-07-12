# WB-2026-07-12-salon-beaute-fidelity

## Stage 0 Routing Preflight

- Work Block type: frontend/design source-fidelity redesign
- Side-effect class: production code write plus local test
- DB action mode: none
- Skill Routing Gate: READY
- Subagent topology: Subagent-Required; Design Analyst, one Scoped Coder, independent Verifier
- Hard Stops in scope: no deploy, dependency/config changes, commit, push, deletion, or destructive operations
- Write gate: READY

## Objective

Bring the four `/demo/salon-beaute` pages materially closer to the approved
handoff design while preserving the existing routes, Next.js stack, local-only
demo behavior, and unrelated working-tree changes.

## Owner approval

On 2026-07-12 the Owner confirmed that the recently created pages remain and
should be brought closer to the source design.

## Scope

In scope: the shared Salon Beaute components, content, responsive layout,
navigation, footer, local service filtering, and local-only contact form state.

Out of scope: route files, layout metadata, public assets, other demos, backend,
external requests, dependencies, configuration, deployment, commit, and push.

## Approved write-set

```text
showcase/components/salon-beaute/HomePage.tsx
showcase/components/salon-beaute/data.ts
showcase/components/salon-beaute/Nav.tsx
showcase/components/salon-beaute/Footer.tsx
showcase/components/salon-beaute/home.module.css
showcase/components/salon-beaute/nav.module.css
showcase/components/salon-beaute/footer.module.css
```

Lifecycle evidence may update this plan and the repository gate files. No
application or asset path outside the approved write-set may be changed.

## Design brief

- Fidelity mode: inspired-adaptation / redesign-preserve
- Approved source: `/home/azur/Projects/salon_beaute/Салон красоты тз-handoff.zip`
- Design read: a warm, refined neighborhood beauty salon whose spacious,
  image-led presentation should feel calm and trustworthy rather than generic.
- Preserve: four routes, French content model, Playfair Display plus Inter,
  burgundy and blush palette, supplied imagery, demo-only behavior.
- Adapt: source SPA interactions to accessible React and CSS Modules.
- Do not import: source runtime scripts, external submit behavior, new packages,
  or source build artifacts.
- Base design skill: `design-direction` redesign-preserve workflow.
- Style skill: `impeccable`, brand register, identity preservation.
- Component/system skill: existing Next.js and CSS Modules only.
- Motion: restrained CSS transitions with reduced-motion fallback.
- Rejected: theme replacement, greenfield redesign, image generation, and new
  component libraries because they reduce source fidelity or expand scope.
- Collision guard: source fidelity takes priority over generic design trends;
  no unrelated AzurSysTech showcase styling may leak into the demo.
- Dials: DESIGN_VARIANCE 4/10; MOTION_INTENSITY restrained; VISUAL_DENSITY balanced.

## Route implementation notes

- Home: left-gradient hero, benefits band, unified booking panel, open service
  thumbnails, and light split satisfaction section.
- Services: split header, horizontal service rows, local category filters, and
  light split advice CTA.
- About: split introduction, benefits band, philosophy split, stats, and clean
  gallery without extra review content.
- Contact: split hero, contact details plus stylized map, decorative split form,
  local validation and success state without external submission.
- Shared: source-like desktop navigation, accessible mobile drawer, active
  route, dark four-column footer, visible focus states, and responsive layouts.

## Skills

- Checked: git-safety, Work Block and verification gates, design-direction,
  impeccable, frontend-skill, browser verification.
- Matched: design-direction, impeccable, frontend-skill.
- Used: design-direction redesign workflow, impeccable brand register,
  frontend-skill image-led composition rules.
- Skipped: backend, DB, deploy, security, payment, ops, image generation; not
  relevant to this local frontend fidelity task.

## Acceptance criteria

1. All four pages visibly follow the supplied reference compositions at desktop.
2. Navigation works at desktop and mobile, exposes the active route, and has
   keyboard-visible states.
3. Services filtering works locally; contact form validates and shows a local
   success state without network traffic.
4. No fixed mobile CTA, extra About reviews, cyclic font variables, horizontal
   overflow, or dead controls remain.
5. The supplied assets are reused without modification.
6. `npm run check:types` and `npm run build` pass in `showcase`.
7. Live browser smoke passes for all routes at desktop and 375px; key controls
   respond and screenshots are captured by the Verifier.

## Risks and guards

- Existing unrelated dirty files: preserve them and verify the final diff by
  exact path.
- Visual crop/spacing drift: close through browser comparison at desktop and
  mobile.
- Form accidentally submitting: keep the interaction local-only and verify no
  external request is made.
- Any required dependency, config, asset, route, or scope change is a stop
  condition requiring Owner approval.

## Verification plan

- `npm run check:types`
- `npm run build`
- Live route smoke for `/demo/salon-beaute`, `/services`, `/about`, `/contact`
- Browser checks at desktop and 375px for layout, navigation, filters, form,
  focus behavior, overflow, fonts, header/footer, and console errors
- Final exact-path `git diff --check` and changed-file scope audit

## Stage state

- Current stage: Stage 3 complete
- Critic verdict: APPROVE, based on read-only Design Analyst source comparison
- Implementation: DONE in the exact seven-file application write-set
- Verification verdict: READY from the independent read-only Verifier
- Checks: targeted ESLint, `npm run check:types`, `npm run build`, and
  `git diff --check` passed
- Browser evidence: all four routes returned 200 at desktop and 375px; the
  mobile drawer, service filters, fonts, overflow guard, native form validation,
  and local-only success state passed
- Verification artifacts: `showcase/output/playwright/salon-beaute/`
- Residual risk: route metadata outside the approved write-set still contains
  `Salon de Beauté`; this does not affect the verified visual interface
- Commit/push/deploy: not authorized
