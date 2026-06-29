# WB-2026-06-27 - Assurance Contact Demo Form Port

## Status

Complete - ready for Owner visual review / commit decision

## Lifecycle stage

Verification

## Role

Orchestrator

## Objective

Port `/home/azur/Projects/assurance/contact.html` into the azursystech showcase as `/demo/assurance/contact`, with a live-looking demo contact form that never submits, redirects, calls a provider, writes data, or depends on backend/API configuration.

## Expected result

- `/demo/assurance/contact` renders as a live Next.js showcase page.
- The page uses the same Assurance brand shell as the current migrated pages:
  - homepage-matching logo typography
  - consistent top navigation and CTA treatment
  - compact centered page hero
  - no disappearing header or hero text after scroll down/up
- The contact information from the source page is represented:
  - address
  - phone
  - email
  - opening hours
- The source contact form is represented as a portfolio/demo form only:
  - no `action`
  - no `method="POST"` to an external service
  - no Formspree endpoint
  - no `fetch`, `XMLHttpRequest`, `navigator.sendBeacon`, API route, `mailto:` submission, provider config, env file, token, or credential
  - submit is handled with local React state via `preventDefault`
  - valid submit shows a local success/demo state and keeps the browser on the same route
  - the UI clearly indicates that no message is sent
- No commit or push is performed unless Owner separately approves it.

## Decision: demo-only form behavior

Use a client-only React form with local validation and a non-network success state.

This is the optimal option for the showcase because it preserves the visual and interactive value of the source page while avoiding false production behavior. The source page uses a Formspree-style `action`, but the showcase page must not inherit that provider boundary. A disabled form would be visually weaker, and a real mail/API/provider implementation would be outside portfolio-demo scope.

## Decision: map behavior

Do not port the Google Maps iframe in this WB.

Replace it with a static, self-contained map-style contact panel that shows the Paris location and office hours. This keeps the demo deterministic, avoids third-party embed/network behavior, and matches the "demo only" boundary of the contact page.

## Preflight state

- **Worktree:** `/home/azur/Projects/WSL/azursystech-assurance-from-baseline`
- **Branch:** `feature/assurance-homepage-port-v2`
- **Source page:** `/home/azur/Projects/assurance/contact.html`
- **Current unrelated/prior dirty tree to preserve:**
  - `showcase/demo-kit/sections/AutomationSection.tsx`
  - `showcase/demo-kit/sections/FinalCTASection.tsx`
  - `showcase/demo-kit/sections/ServiceAreaSection.tsx`
  - `showcase/demo-kit/sections/UrgentRequestSection.tsx`
  - `showcase/lib/demos.ts`
  - `docs/plans/WB-2026-06-27-assurance-devis-page-port.md`
  - `docs/plans/WB-2026-06-27-assurance-info-pages-port.md`
  - `docs/reports/wb-2026-06-27-assurance-devis-page-port-critic.md`
  - `docs/reports/wb-2026-06-27-assurance-info-pages-port-critic.md`
  - `showcase/app/demo/assurance/_components/**`
  - `showcase/app/demo/assurance/a-propos/**`
  - `showcase/app/demo/assurance/avis/**`
  - `showcase/app/demo/assurance/devis/**`
  - `showcase/app/demo/assurance/faq/**`
  - `showcase/demos/assurance/**`
  - `showcase/public/demo/assurance/**`

Implementation may proceed only after a fresh `git status --short --branch` confirms this boundary.

## Source inventory

### `/home/azur/Projects/assurance/contact.html`

- Page tag: `Contact`
- H1: `Contactez-moi`
- Hero subtitle: availability Monday-Friday, 9h-18h
- Contact card:
  - `Informations de contact`
  - `12 rue de la Paix`
  - `75001 Paris, France`
  - `01 23 45 67 89`
  - `contact@paulclement-assurance.fr`
  - `Lundi - Vendredi : 9h00 - 18h00`
  - `Samedi : sur rendez-vous`
- Form card:
  - `Envoyer un message`
  - fields: first name, last name, email, subject, message
  - source form provider: Formspree-style external action, explicitly excluded
- Source scripts:
  - `assets/js/components.js`
  - `assets/js/main.js`
  - `assets/js/form.js?v=2`

## Lessons carried from previous Work Blocks

1. **Use the source-page-porting skill explicitly.**
   The project-local skill is `.agent/skills/source-page-porting/SKILL.md`.

2. **Treat forms as a boundary, not as ordinary markup.**
   Source forms may contain provider URLs or hidden production assumptions. The migrated page must define the allowed behavior before coding.

3. **Keep the Assurance shell consistent.**
   The logo font, menu, CTA, page background, and hero treatment must match the already corrected homepage/devis/info pages.

4. **Critical first-viewport text must not depend on reveal animation.**
   Header, logo, page tag, H1, hero subtitle, and primary CTA must remain visible after scroll down/up.

5. **Avoid external embeds unless they are explicitly part of the demo goal.**
   The contact page can communicate location without a live Google Maps iframe.

6. **Do not mix this WB with existing dirty work.**
   Stage/review later must use pathspecs and explicit dirty-tree review.

## Scope

### In scope

- Read source files from `/home/azur/Projects/assurance`:
  - `contact.html`
  - `assets/css/variables.css`
  - `assets/css/style.css`
  - `assets/css/components.css`
  - `assets/js/form.js`
- Create the contact showcase route:
  - `showcase/app/demo/assurance/contact/page.tsx`
  - `showcase/app/demo/assurance/contact/AssuranceContactPage.tsx`
  - `showcase/app/demo/assurance/contact/page.module.css`
- Reuse the existing route-local Assurance shell where appropriate:
  - `showcase/app/demo/assurance/_components/**`
- Add stable route marker:
  - `data-assurance-route="contact-page"`
- Implement local-only demo form behavior:
  - required-field validation
  - email shape validation
  - accessible error/success messages
  - local success state
  - no network or navigation on submit
- Update `.agent/skills/source-page-porting/SKILL.md` with a small reusable "demo-only forms" guardrail if implementation confirms the rule is reusable.

### Out of scope

- Real form submission.
- Formspree, CRM, email, webhook, backend/API route, server action, database write, analytics submission, provider config, env file, token, credential, or secret.
- Google Maps iframe or any other third-party embed.
- Product assurance subpages under `/assurances/*.html`.
- Changes to `/home/azur/Projects/assurance`.
- Changes to unrelated dirty files in `showcase/demo-kit/**`, `showcase/lib/demos.ts`, `showcase/demos/assurance/**`, or `showcase/public/demo/assurance/**`.
- Package/dependency/config changes.
- Commit or push.

## Write-set

```text
docs/plans/WB-2026-06-27-assurance-contact-demo-form-port.md
docs/reports/wb-2026-06-27-assurance-contact-demo-form-port-critic.md
showcase/app/demo/assurance/contact/**
.agent/skills/source-page-porting/SKILL.md
```

The skill file is optional in the write-set. If changed, the edit must be concise and limited to demo-form migration guardrails.

## Skill update proposal

If approved during implementation, add a short rule to `source-page-porting`:

- portfolio/demo forms must remove external actions/provider endpoints and network calls;
- demo submit must use `preventDefault` and local UI state;
- no backend/API/env/provider integration is allowed without a separate Owner-approved WB;
- verification must scan for provider URLs, `action=`, network APIs, env keys, and route navigation after submit.

This should be a small addition to the existing skill, not a new skill.

## Acceptance criteria

- [x] `/demo/assurance/contact` returns HTTP 200.
- [x] The page includes `data-assurance-route="contact-page"`.
- [x] Logo, menu, CTA, background, and hero match the corrected Assurance pages.
- [x] Header and hero text remain visible after scroll down/up.
- [x] Form fields render and are keyboard-accessible.
- [x] Invalid submit shows local validation without leaving the page.
- [x] Valid submit shows local demo success state without leaving the page.
- [x] The route does not contain or execute external form submission behavior.
- [x] The route does not introduce Formspree, backend/API, env, tokens, credentials, new dependencies, or external map embeds.
- [x] Existing routes still work:
  - `/demo/assurance`
  - `/demo/assurance/devis`
  - `/demo/assurance/a-propos`
  - `/demo/assurance/faq`
  - `/demo/assurance/avis`
  - `/demo/plomberie`
- [x] Pre-existing unrelated dirty files remain untouched.

## Risks and mitigations

| Risk | Impact | Mitigation | Stop Condition |
|---|---|---|---|
| Demo form appears to send real messages | Misleading portfolio behavior | Add explicit local-only demo copy and success state | Owner wants real submission |
| External Formspree action is copied accidentally | Secret/provider drift and false production behavior | Static scan for provider/action/network APIs | Any provider/API integration is required |
| Google Maps iframe introduces external dependency | Non-deterministic demo and network/embed noise | Use a CSS/static contact location panel | Owner requires live map embed |
| Skill update becomes too broad | Process bloat | Add only one concise demo-form guardrail | Update requires broader methodology rewrite |
| Existing dirty tree contaminates the WB | Unreviewable commit scope | Keep path-limited diff and staging later | Unrelated dirty files must be edited |
| Reveal animation hides text after scroll | Visual regression | Keep critical text outside reveal wrappers | Scroll up hides header/hero text again |

## Subagent topology

- **Critic:** same-session read-only critic report before implementation.
- **Coder:** Codex only, one writer, after Owner confirmation.
- **Verifier:** local verification after implementation.
- **Claude Code:** not used in this WB unless Owner re-enables it.

## Implementation plan

1. **Plan**
   - Confirm source contact form boundary.
   - Create WB plan and critic report.

2. **Implementation**
   - Re-read source contact structure and current Assurance shared shell.
   - Build `/demo/assurance/contact` route.
   - Implement client-only local form state and validation.
   - Replace map iframe with static location panel.
   - Add optional concise skill update if still warranted.

3. **Review**
   - Review route diff for visual consistency and form-boundary violations.
   - Confirm no unrelated dirty files were edited.

4. **Verification**
   - Run syntax/build checks.
   - Run static scans for forbidden form/provider patterns.
   - Run browser smoke for desktop/mobile, invalid submit, valid submit, no navigation, scroll down/up, console errors.

## Verification plan

Run from `showcase/` unless noted otherwise:

```bash
git status --short --branch
git diff --check
npm run lint
npm run check:types
npm run build
curl -fsSI http://localhost:<port>/demo/assurance/contact
curl -fsSI http://localhost:<port>/demo/assurance
curl -fsSI http://localhost:<port>/demo/plomberie
```

Static scans:

```bash
rg -n "formspree|FORMSPREE|action=|method=\"POST\"|fetch\\(|XMLHttpRequest|sendBeacon|mailto:|API_KEY|SECRET|TOKEN|\\.env" showcase/app/demo/assurance/contact .agent/skills/source-page-porting/SKILL.md
```

Expected scan result: only approved documentation/skill guardrail references, and no route implementation violations.

Browser smoke:

- desktop screenshot
- mobile screenshot
- invalid submit shows validation
- valid submit shows local success
- URL remains `/demo/assurance/contact`
- scroll down/up preserves header and hero text
- console has no runtime errors

## Owner approval requested

Approve this WB to proceed to Implementation.

## Closeout

- **Completed stage:** Plan -> Implementation -> Review -> Verification.
- **Implementation result:** `/demo/assurance/contact` added as a live Next.js showcase page with local-only demo form behavior.
- **Files changed:**
  - `.agent/skills/source-page-porting/SKILL.md`
  - `docs/plans/WB-2026-06-27-assurance-contact-demo-form-port.md`
  - `docs/reports/wb-2026-06-27-assurance-contact-demo-form-port-critic.md`
  - `showcase/app/demo/assurance/contact/page.tsx`
  - `showcase/app/demo/assurance/contact/AssuranceContactPage.tsx`
  - `showcase/app/demo/assurance/contact/page.module.css`
- **Source adapted:** `/home/azur/Projects/assurance/contact.html`.
- **Intentional adaptations:**
  - Removed source Formspree-style provider boundary.
  - Rebuilt submit as local React `preventDefault` validation and demo success state.
  - Replaced source Google Maps iframe with a static self-contained location panel.
  - Added reusable demo-form guardrail to the project-local source-page-porting skill.
- **Checks run:**
  - `git diff --check -- .agent/skills/source-page-porting/SKILL.md showcase/app/demo/assurance/contact` - pass; command prints the local `Failed to create stream fd` environment warning but exits 0.
  - `rg -n "formspree|FORMSPREE|action=|method=\"POST\"|fetch\\(|XMLHttpRequest|sendBeacon|mailto:|API_KEY|SECRET|TOKEN|\\.env" showcase/app/demo/assurance/contact` - pass, no matches.
  - `npm run lint` - pass.
  - `npm run check:types` - pass.
  - `npm run build` - pass; Next warning about unset `metadataBase` is pre-existing/global.
  - `curl -fsSI http://127.0.0.1:3004/demo/assurance/contact` - `200 OK`.
  - `curl -fsSI http://127.0.0.1:3004/demo/assurance/devis` - `200 OK`.
  - Playwright desktop snapshot/screenshot - pass.
  - Playwright mobile screenshot - pass.
  - Playwright invalid submit - local validation shown, URL unchanged.
  - Playwright valid submit - local demo success shown, URL unchanged.
  - Playwright scroll/top check - `scrollY=0`, hero/logo visible, opacity `1`, mobile body width `390` equals viewport width `390`.
  - `curl -fsSI http://127.0.0.1:3004/demo/assurance` - `200 OK`.
  - `curl -fsSI http://127.0.0.1:3004/demo/assurance/a-propos` - `200 OK`.
  - `curl -fsSI http://127.0.0.1:3004/demo/assurance/faq` - `200 OK`.
  - `curl -fsSI http://127.0.0.1:3004/demo/assurance/avis` - `200 OK`.
  - `curl -fsSI http://127.0.0.1:3004/demo/plomberie` - `200 OK`.
  - Playwright console error check - 0 errors.
- **Unrelated dirty files:** preserved; no demo-kit or `showcase/lib/demos.ts` edits were made.
- **Commit/push:** not performed.
