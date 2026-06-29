# Critic Review - WB-2026-06-27 Assurance Info Pages Port

## Status

Complete

## Lifecycle stage

Review

## Role

Reviewer / Critic

## Scope reviewed

- `docs/plans/WB-2026-06-27-assurance-info-pages-port.md`
- Source inventory for:
  - `/home/azur/Projects/assurance/a-propos.html`
  - `/home/azur/Projects/assurance/faq.html`
  - `/home/azur/Projects/assurance/avis.html`
  - `/home/azur/Projects/assurance/contact.html` as an explicit exclusion reference
- Prior lessons from:
  - `WB-2026-06-26-assurance-next-homepage-port.md`
  - `WB-2026-06-27-assurance-devis-page-port.md`
  - `.agent/skills/source-page-porting/SKILL.md`

## Verdict

APPROVE WITH GUARDRAILS

## Findings

No blocking findings.

## Review notes

1. **The page bundle is reasonable because it excludes forms.**
   `a-propos`, `faq`, and `avis` are informational pages. `contact.html` contains a Formspree-style form and is correctly excluded for a separate form-boundary WB.

2. **The plan correctly treats the project-local skill as required.**
   `.agent/skills/source-page-porting/SKILL.md` directly covers this migration type and includes checks for route markers, link conversion, scroll text visibility, asset hygiene, and dirty-tree safety.

3. **The plan explicitly carries forward the previous visual failures.**
   It requires homepage-matching logo/nav, corrected page hero treatment, and scroll down/up checks. These are the exact areas that caused manual correction in the `devis` page.

4. **Dirty-tree isolation is still the main operational risk.**
   There are unrelated dirty files and prior WB files in the same worktree. Implementation must use explicit path review before any staging or commit decision.

5. **Shared extraction should remain optional.**
   A narrow `_components` or `_styles` helper can reduce duplication, but broad homepage/devis refactoring would make this WB too large.

## Required implementation guardrails

- Do not port `contact.html` in this WB.
- Do not add real form behavior, Formspree, backend/API routes, provider config, env files, credentials, or dependencies.
- Do not edit:
  - `showcase/demo-kit/sections/AutomationSection.tsx`
  - `showcase/demo-kit/sections/FinalCTASection.tsx`
  - `showcase/demo-kit/sections/ServiceAreaSection.tsx`
  - `showcase/demo-kit/sections/UrgentRequestSection.tsx`
  - `showcase/lib/demos.ts`
  - `showcase/demos/assurance/**`
  - `showcase/public/demo/assurance/**`
- Do not rely on reveal/IntersectionObserver behavior for header, logo, nav, hero title, hero subtitle, or primary CTA visibility.
- Verify scroll down/up on every new page.
- Verify `/demo/assurance`, `/demo/assurance/devis`, and `/demo/plomberie` after implementation.

## Recommended next action

Proceed to Implementation after Owner confirms the WB scope.
