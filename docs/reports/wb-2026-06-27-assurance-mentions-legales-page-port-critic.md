# Critic Review - WB-2026-06-27 Assurance Mentions Legales Page Port

## Status

Complete

## Lifecycle stage

Review

## Role

Reviewer / Critic

## Scope reviewed

- `docs/plans/WB-2026-06-27-assurance-mentions-legales-page-port.md`
- Source legal page:
  - `/home/azur/Projects/assurance/mentions-legales.html`
- Source shell behavior references:
  - `/home/azur/Projects/assurance/assets/js/components.js`
  - `/home/azur/Projects/assurance/assets/js/main.js`
- Existing migrated Assurance shared shell:
  - `showcase/app/demo/assurance/_components/AssuranceInfoShell.tsx`
- Project-local migration skill:
  - `.agent/skills/source-page-porting/SKILL.md`

## Verdict

APPROVE WITH GUARDRAILS

## Findings

No blocking findings.

## Review notes

1. **The selected page is the correct final root-level page.**
   `mentions-legales.html` is a static legal/privacy/cookies page and can be ported without introducing a form, backend, provider, or runtime integration.

2. **The plan correctly treats legal links as footer discoverability.**
   The page should not become a main commercial nav item by default. Footer links and anchor links are the right route exposure mechanism.

3. **The anchor requirements are essential.**
   The source has meaningful `#confidentialite` and `#cookies` anchors. Losing them would break privacy/cookie references from other migrated pages or future footer links.

4. **The shared shell edit is the main regression risk.**
   Updating `AssuranceInfoShell` can affect every migrated Assurance route. The implementation must keep this change narrow and verify neighboring routes after the edit.

5. **Cookie text must not become cookie behavior.**
   Source scripts reference cookie-link behavior, but this WB should port only legal text and links. It must not add cookie banners, local storage, analytics, or tracking state.

6. **External legal links are acceptable content links.**
   ORIAS, CNIL, and mediation links may be preserved as content references, with safe new-tab link attributes if opened externally.

## Required implementation guardrails

- Do not port cookie-consent runtime behavior.
- Do not add `localStorage`, analytics, tracking, consent banners, provider endpoints, env files, credentials, or dependencies.
- Do not reinterpret legal/compliance claims beyond faithful source transfer and demo framing.
- Preserve `id="confidentialite"` and `id="cookies"`.
- Keep top navigation unchanged unless Owner explicitly requests legal navigation there.
- Keep shared shell edits limited to footer legal-link discoverability.
- Do not edit unrelated dirty files:
  - `showcase/demo-kit/sections/AutomationSection.tsx`
  - `showcase/demo-kit/sections/FinalCTASection.tsx`
  - `showcase/demo-kit/sections/ServiceAreaSection.tsx`
  - `showcase/demo-kit/sections/UrgentRequestSection.tsx`
  - `showcase/lib/demos.ts`
  - `showcase/demos/assurance/**`
  - `showcase/public/demo/assurance/**`
- Verify existing migrated Assurance routes after any shell edit.
- Verify scroll down/up visibility on the new legal page.

## Recommended next action

Proceed to Implementation only after Owner confirms the WB scope.
