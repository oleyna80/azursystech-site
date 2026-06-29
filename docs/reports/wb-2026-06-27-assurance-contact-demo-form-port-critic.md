# Critic Review - WB-2026-06-27 Assurance Contact Demo Form Port

## Status

Complete

## Lifecycle stage

Review

## Role

Reviewer / Critic

## Scope reviewed

- `docs/plans/WB-2026-06-27-assurance-contact-demo-form-port.md`
- `/home/azur/Projects/assurance/contact.html`
- `.agent/skills/source-page-porting/SKILL.md`
- Prior Assurance migration lessons from homepage, devis, and info-page Work Blocks

## Verdict

APPROVE WITH GUARDRAILS

## Findings

No blocking findings.

## Review notes

1. **The plan correctly treats the contact form as a boundary.**
   The source page contains an external Formspree-style action. The plan explicitly rejects external provider submission and defines local-only demo behavior.

2. **The chosen form behavior is the right portfolio compromise.**
   A disabled form would be less convincing as a live demo, while a real provider/API integration would be outside scope. `preventDefault` plus local validation and a visible demo success state is the appropriate middle ground.

3. **The map decision reduces unnecessary external behavior.**
   Replacing the Google Maps iframe with a static contact panel keeps the route deterministic and avoids pulling third-party embeds into a portfolio demo.

4. **The plan carries forward the known visual failure modes.**
   It explicitly requires homepage-matching logo typography, corrected Assurance shell, compact centered hero, and scroll down/up checks.

5. **The optional skill update is justified but must remain small.**
   The project-local `source-page-porting` skill already has a generic stop condition for unapproved form submission. A concise "demo-only forms" guardrail would make future page ports safer, but a broad skill rewrite is not needed.

## Required implementation guardrails

- Do not copy the source form `action`.
- Do not add Formspree, webhook, API route, server action, CRM, email, database write, provider config, env file, token, or credential.
- Do not use `fetch`, `XMLHttpRequest`, or `navigator.sendBeacon` for the form.
- Do not implement `mailto:` as submit behavior.
- Do not add a Google Maps iframe or other third-party embed in this WB.
- Keep route behavior local to `/demo/assurance/contact`.
- Preserve the existing corrected Assurance shell and logo typography.
- Keep header and hero text independent from reveal/IntersectionObserver behavior.
- Do not edit unrelated dirty files.
- If `.agent/skills/source-page-porting/SKILL.md` is changed, limit the edit to a concise reusable demo-form rule.

## Verification requirements

- Run `git diff --check`.
- Run the project lint/type/build checks from `showcase/`.
- Run static scans for forbidden provider/form/network patterns.
- Browser-check desktop and mobile.
- Browser-check invalid and valid form submission:
  - local validation appears for invalid input
  - local success appears for valid input
  - browser URL does not change
  - no network submission is performed by the implementation
- Browser-check scroll down/up for header and hero text visibility.
- Re-check neighboring routes:
  - `/demo/assurance`
  - `/demo/assurance/devis`
  - `/demo/assurance/a-propos`
  - `/demo/assurance/faq`
  - `/demo/assurance/avis`
  - `/demo/plomberie`

## Residual risks

1. The demo form may still be interpreted by a visitor as operational if the local-only copy is too subtle. The implementation should make the demo status visible without making the page look broken.
2. A static map panel has lower fidelity than a live map embed. This is acceptable for the current showcase boundary.
3. The worktree already contains dirty files from prior WBs. Commit readiness later must use explicit path review and Owner approval.

## Recommended next action

Proceed to Implementation after Owner confirms the WB scope.
