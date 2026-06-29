# Critic Review — WB-2026-06-27 Assurance Devis Page Port

## Status

Complete

## Lifecycle stage

Review

## Role

Reviewer / Critic

## Scope reviewed

- `docs/plans/WB-2026-06-27-assurance-devis-page-port.md`
- Source page evidence from `/home/azur/Projects/assurance/devis.html`
- Source form behavior evidence from `/home/azur/Projects/assurance/assets/js/form.js`
- Current dirty-tree boundary from `git status --short --branch`

## Verdict

APPROVE

## Findings

No blocking findings.

## Review notes

1. **Form boundary is correctly treated as a hard stop.**
   The source page includes `action="https://formspree.io/f/XXXXXXXX"` and `form.js` performs a real `fetch(FORMSPREE_URL)`. The Work Block explicitly forbids Formspree, provider config, external POST, backend/API routes, env files, and real lead capture. This is the correct boundary for a portfolio showcase slice.

2. **Dirty-tree isolation is explicit.**
   The plan lists the existing unrelated dirty files and marks them out of scope. The implementation route is isolated under `showcase/app/demo/assurance/devis/**`, with only scoped Assurance shared files allowed if needed.

3. **Acceptance criteria are testable.**
   The plan requires route HTTP checks, route marker evidence, local validation, local success state, no Formspree/provider strings, neighbor route checks, and browser smoke. These criteria are sufficient for this slice.

4. **The plan preserves source value without over-scoping the site migration.**
   `devis.html` is the right next page because it is the natural conversion path from the homepage. The plan avoids a full multi-page migration and defers real backend behavior.

## Residual risks

1. **Shared header/footer reuse may create pressure to refactor homepage code.**
   Mitigation: keep extraction narrow or duplicate route-local markup if that is safer. Stop if broad homepage redesign becomes necessary.

2. **Demo form can be mistaken for production behavior.**
   Mitigation: implementation must prevent all network submit behavior and verification must prove no Formspree/external form action exists.

3. **Visual fidelity still depends on browser comparison.**
   Mitigation: verification must include desktop/mobile browser smoke and scroll down/up checks.

## Required implementation guardrails

- Do not copy `assets/js/form.js` as executable client code.
- Do not add `formspree.io`, `FORMSPREE_URL`, API routes, provider credentials, env files, or package dependencies.
- Do not touch:
  - `showcase/demo-kit/sections/AutomationSection.tsx`
  - `showcase/demo-kit/sections/FinalCTASection.tsx`
  - `showcase/demo-kit/sections/ServiceAreaSection.tsx`
  - `showcase/demo-kit/sections/UrgentRequestSection.tsx`
  - `showcase/lib/demos.ts`
  - `showcase/demos/assurance/**`
  - `showcase/public/demo/assurance/**`
- Preserve `/demo/assurance` and `/demo/plomberie` behavior.

## Recommended next action

Proceed to Implementation after Owner confirms the Work Block scope.
