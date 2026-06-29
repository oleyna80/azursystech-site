# WB-2026-06-27 — Assurance Devis Page Port

## Status

Complete

## Lifecycle stage

Verification

## Role

Orchestrator / Coder / Reviewer / Verifier

## Objective

Port the Assurance source quotation page from `/home/azur/Projects/assurance/devis.html` into the azursystech showcase as a live Next.js nested route at `/demo/assurance/devis`.

This Work Block continues the static Assurance showcase route started by `WB-2026-06-26-assurance-next-homepage-port.md`. It preserves the source page's visual structure while keeping form behavior demo-only and local.

## Expected result

- `/demo/assurance/devis` renders a live Next.js page derived from `/home/azur/Projects/assurance/devis.html`.
- The page includes the original devis page structure:
  - page hero with "Devis gratuit" tag
  - two-column quotation layout
  - "Votre demande" form
  - "Comment ça marche ?" sidebar
  - phone contact card
  - shared Assurance header/footer visual language
- The form is frontend-only:
  - local validation is allowed
  - local demo success state is allowed
  - no Formspree request, external POST, backend endpoint, provider config, or env file is introduced
- Existing routes remain usable:
  - `/demo/assurance`
  - `/demo/plomberie`
- Pre-existing unrelated dirty files remain untouched.
- No commit or push is performed unless Owner separately approves it.

## Preflight state

- **Worktree:** `/home/azur/Projects/WSL/azursystech-assurance-from-baseline`
- **Branch:** `feature/assurance-homepage-port-v2`
- **Source page:** `/home/azur/Projects/assurance/devis.html`
- **Source JS to inspect but not copy as-is:** `/home/azur/Projects/assurance/assets/js/form.js`
- **Current unrelated dirty files:**
  - `showcase/demo-kit/sections/AutomationSection.tsx`
  - `showcase/demo-kit/sections/FinalCTASection.tsx`
  - `showcase/demo-kit/sections/ServiceAreaSection.tsx`
  - `showcase/demo-kit/sections/UrgentRequestSection.tsx`
  - `showcase/lib/demos.ts`
  - `showcase/demos/assurance/`
  - `showcase/public/demo/assurance/`
- **Proceed rule:** implementation may proceed only by creating or modifying the scoped static Assurance route files. The unrelated dirty files listed above are out of scope and must not be edited, staged, normalized, or deleted.

## Source findings

`devis.html` contains:

- `title`: `Demander un Devis – Paul Clément, Agent d'Assurance`
- hero:
  - tag: `Devis gratuit`
  - H1: `Demandez votre devis`
  - subtitle: response under 24 business hours
- form:
  - `id="devis-form"`
  - `action="https://formspree.io/f/XXXXXXXX"`
  - `method="POST"`
  - fields: first name, last name, email, phone, insurance type, message, RGPD checkbox
  - success block: `id="form-success"`
- sidebar:
  - three-step "Comment ça marche ?"
  - phone card with `01 23 45 67 89`
- scripts:
  - `assets/js/components.js`
  - `assets/js/main.js`
  - `assets/js/form.js?v=2`

`assets/js/form.js` performs real `fetch(FORMSPREE_URL)` submission. This behavior is explicitly out of scope for this Work Block.

## Visual thesis

The page should feel like the next step after the Assurance homepage: calm, professional, trust-building, and conversion-focused. The first viewport should identify the Assurance brand context, show the quote request purpose, and immediately expose the form path without turning the page into a generic SaaS form.

## Content plan

1. Shared Assurance header/navigation, matching the homepage route.
2. Compact page hero with clear quote-request copy.
3. Main form panel with all visible source fields and RGPD acceptance copy.
4. Sidebar explaining the three-step process.
5. Direct phone contact fallback.
6. Shared Assurance footer.

## Interaction thesis

- Preserve visible source interactions that matter to the page:
  - responsive navigation if already implemented in the Assurance homepage route
  - field validation feedback
  - demo success state after a valid local submit
- Do not perform any network submission.
- Keep critical first-viewport text independent from reveal/IntersectionObserver behavior.
- Use animation only if it is already safely scoped and one-way visible after first reveal.

## Scope

### In scope

- Read source files from `/home/azur/Projects/assurance`:
  - `devis.html`
  - `assets/css/variables.css`
  - `assets/css/style.css`
  - `assets/css/components.css`
  - `assets/js/components.js`
  - `assets/js/main.js`
  - `assets/js/form.js` for validation logic reference only
- Create a nested static showcase route:
  - `showcase/app/demo/assurance/devis/page.tsx`
  - optional route-local CSS/module files under `showcase/app/demo/assurance/devis/`
- Reuse or lightly extend existing Assurance route components/styles only when this does not cause broad homepage refactoring.
- Implement frontend-only validation and demo success state in React.
- Preserve internal links as future showcase paths such as:
  - `/demo/assurance/contact`
  - `/demo/assurance/mentions-legales#confidentialite`
  - `/demo/assurance/assurances/auto`
- Add a stable route marker such as `data-assurance-route="devis-page"`.

### Out of scope

- Real form submission.
- Formspree integration.
- Backend/API route creation.
- Provider credentials, `.env`, secrets, private config, or production config.
- Package/dependency changes.
- Changes to source project `/home/azur/Projects/assurance`.
- Changes to unrelated dirty files in `showcase/demo-kit/**`, `showcase/lib/demos.ts`, `showcase/demos/assurance/**`, or `showcase/public/demo/assurance/**`.
- Full multi-page migration beyond `/demo/assurance/devis`.
- Commit or push.

## Write-set

```text
docs/plans/WB-2026-06-27-assurance-devis-page-port.md
docs/reports/wb-2026-06-27-assurance-devis-page-port-critic.md
showcase/app/demo/assurance/devis/**
showcase/app/demo/assurance/AssuranceHomePage.tsx
showcase/app/demo/assurance/page.module.css
showcase/components/assurance/**
showcase/public/demo/assurance-site/**
```

`AssuranceHomePage.tsx`, `page.module.css`, shared Assurance components, and `assurance-site` assets are allowed only if implementation needs route-shared header/footer or existing scoped Assurance styling. Broad homepage redesign is out of scope.

## Navigation impact

- **PROJECT_MAP.md update needed:** no. This is a showcase route addition inside an existing area.
- **FILE_REGISTRY.yml update needed:** no, unless a later verification finds this project tracks every showcase route individually.
- **Session bootstrap/profile docs update needed:** no.
- **Generated/local-only boundary changed:** no.

## Commit / stage scope

- **Files to stage/commit if Owner later approves commit:** only files created or modified by this Work Block.
- **Files to leave unstaged:** all pre-existing unrelated dirty files listed in Preflight state.
- **Scope guard before staging:** `git status --short`, `git diff --name-only`, and explicit pathspec review.

## Acceptance criteria

- [ ] `/demo/assurance/devis` returns HTTP 200 in the showcase dev server.
- [ ] The route includes a stable marker proving it is the nested static Assurance route.
- [ ] The page visually follows `/home/azur/Projects/assurance/devis.html` on desktop and mobile.
- [ ] The form fields, labels, insurance options, RGPD text, submit CTA, success block, three-step sidebar, and phone card are represented.
- [ ] Valid demo submit does not make a network request and shows a local success state.
- [ ] Invalid demo submit shows local validation feedback and focuses or identifies the first invalid field.
- [ ] No `formspree.io`, `FORMSPREE_URL`, provider token, `.env`, credential, or external form action is introduced.
- [ ] `/demo/assurance` still works.
- [ ] `/demo/plomberie` still works.
- [ ] Pre-existing dirty files remain untouched.

## Risks and mitigations

| Risk | Impact | Mitigation | Stop Condition |
|---|---|---|---|
| Copying `form.js` as-is preserves external Formspree POST | Scope leak into provider/backend behavior | Rebuild validation in React and omit external fetch | Any implementation needs real submission |
| Shared Assurance header/footer is not factored for nested pages | Duplicate code or risky refactor | Prefer narrow extraction or minimal route-local duplication | Broad homepage redesign is required |
| Old dirty demo-kit Assurance attempt overlaps with new route | Accidental coupling or staging pollution | Use static route under `showcase/app/demo/assurance/devis` and do not touch old dirty paths | Existing dirty files must be edited |
| Visual mismatch between source page and Next route | Portfolio demo loses credibility | Compare source and target in browser at desktop/mobile widths | Required source assets/styles are missing |
| Form UX appears production-ready despite being demo-only | User confusion | Keep copy focused on visual demo and avoid network submission | Owner requests real lead capture |

## Stage 0 routing preflight

- **Work Block type:** non-trivial Work Block
- **Side-effect class:** production-code, local-test
- **DB action mode:** none
- **Hard Stops in scope:** form backend/provider behavior is a stop condition
- **Write gate:** READY for plan/review artifacts; implementation requires Owner approval

### Skill routing gate

- **Skills checked:** frontend-skill, source-page-porting
- **Skills matched:** frontend-skill, source-page-porting
- **Skills used:** frontend-skill, source-page-porting
- **Skills skipped and why:** none
- **Project-local skill fallback used:** yes, `.agent/skills/source-page-porting/SKILL.md`

### Subagent topology

- **Classification:** Control-Tower + read-only critic/reviewer optional
- **Triggers matched:** frontend route migration, form behavior boundary, dirty-tree isolation
- **Use Claude Code team:** no for implementation by default; user previously simplified process to avoid Claude Code for coding
- **Use Codex/GPT critic or verifier:** critic required before implementation; verification can be local unless Owner asks for external review
- **Dispatch plan:** same-session Codex Critic review before implementation; later implementation by one Coder only
- **Skip reason, if any:** not applicable
- **Blocker category, if blocked:** not applicable

## Parallel decomposition matrix

| Stream | Goal | Role | Write-set | Dependencies | Verification | Execution | Reason |
|---|---|---|---|---|---|---|---|
| Route implementation | Build `/demo/assurance/devis` | Coder / Frontend | `showcase/app/demo/assurance/devis/**`, optional scoped Assurance shared files | Owner approval, source page read | lint, typecheck, build, browser smoke | sequential | One write-set and shared route styling |
| Critic review | Check plan and diff for scope leaks | Reviewer / Critic | none | Plan/diff available | written report | sequential | Reviewer is read-only and follows plan |
| Verification | Confirm route, form boundaries, neighboring routes | Verifier / QA | none | Implementation complete | commands + browser smoke | sequential | Needs built route and running server |

## Codex Critic

- **Required:** yes
- **Mode:** fallback-same-session
- **Verdict:** APPROVE
- **Report path:** `docs/reports/wb-2026-06-27-assurance-devis-page-port-critic.md`
- **Orchestrator response:** no blocking findings; carry residual risks into implementation checks

## Verification plan

Expected commands from `showcase/` unless noted:

```bash
git status --short --branch
git diff --check
npm run lint
npm run check:types
npm run build
curl -fsSI http://127.0.0.1:<port>/demo/assurance/devis
curl -fsSI http://127.0.0.1:<port>/demo/assurance
curl -fsSI http://127.0.0.1:<port>/demo/plomberie
rg -n "formspree|FORMSPREE|ANTHROPIC_|OPENAI_|API_KEY|SECRET|TOKEN|\\.env" docs/plans docs/reports showcase/app/demo/assurance showcase/components/assurance
```

Browser smoke:

- desktop screenshot of `/demo/assurance/devis`
- mobile screenshot of `/demo/assurance/devis`
- submit invalid empty form and verify local errors
- submit valid demo data and verify local success without network request
- scroll down/up and confirm hero/header text remains visible
- inspect console errors
- confirm `/demo/assurance` and `/demo/plomberie` still render

## Stop conditions

- Real form submission is requested or becomes necessary.
- Any dependency, config, env, provider, backend, database, deploy, payment, or production setting change is needed.
- Implementation requires editing unrelated dirty files.
- Source private/control files are needed.
- Verification fails and cannot be fixed within the approved write-set.
- Commit or push is requested without explicit Owner confirmation.

## Rollback / recovery

Remove the nested route and any scoped files created by this Work Block. Do not revert or delete pre-existing dirty files.

## Execution log

| Time | Stage | Action / Decision | Evidence | Status |
|---|---|---|---|---|
| 2026-06-27 | Plan | Recorded dirty tree and source page structure | `git status --short --branch`, source `devis.html` read | Complete |
| 2026-06-27 | Review | Same-session critic reviewed plan | `docs/reports/wb-2026-06-27-assurance-devis-page-port-critic.md` | Complete |
| 2026-06-27 | Implementation | Created nested route `/demo/assurance/devis` with route-local React and CSS | `showcase/app/demo/assurance/devis/` | Complete |
| 2026-06-27 | Review | Scoped diff review confirmed no Formspree/backend/env/config implementation | route-local code review, boundary `rg` scans | Complete |
| 2026-06-27 | Verification | Ran static, build, HTTP, and browser smoke checks | lint, typecheck, build, curl, Playwright CLI | Complete |

## Closeout and retrospective

- **Stage:** Verification
- **Objective:** Port Assurance `devis.html` into a live Next.js showcase route at `/demo/assurance/devis`.
- **Result:** Complete.
- **Files changed by this Work Block:**
  - `docs/plans/WB-2026-06-27-assurance-devis-page-port.md`
  - `docs/reports/wb-2026-06-27-assurance-devis-page-port-critic.md`
  - `showcase/app/demo/assurance/devis/page.tsx`
  - `showcase/app/demo/assurance/devis/AssuranceDevisPage.tsx`
  - `showcase/app/demo/assurance/devis/page.module.css`
- **Implementation summary:** Added a route-local page with shared Assurance visual language, page hero, quotation form, validation errors, local success state, three-step sidebar, phone fallback, footer, stable marker `data-assurance-route="devis-page"`, and mobile navigation.
- **Form boundary:** The route intentionally has no `action`, no Formspree URL, no `fetch`, no backend/API route, no provider config, no env file, and no dependency change.
- **Checks performed:**
  - `npm run lint` from `showcase/` — pass
  - `npm run check:types` from `showcase/` — pass
  - `npm run build` from `showcase/` — pass; route list includes `/demo/assurance/devis`
  - `git diff --check -- ...scoped paths...` — exit code 0; sandbox emitted `stream fd` noise but no diff errors
  - `curl -I http://127.0.0.1:3004/demo/assurance/devis` — `200 OK`
  - `curl -I http://127.0.0.1:3004/demo/assurance` — `200 OK`
  - `curl -I http://127.0.0.1:3004/demo/plomberie` — `200 OK`
  - `rg` for Formspree/action/fetch in `showcase/app/demo/assurance/devis` — no matches
  - `rg` for obvious secret/token patterns in `showcase/app/demo/assurance/devis` — no matches
  - Playwright CLI desktop snapshot — page renders header, hero, form, sidebar, footer
  - Playwright CLI invalid submit — local validation errors and `aria-invalid` appear
  - Playwright CLI valid submit — local `Demande envoyee !` success state appears
  - Playwright CLI network requests after submit — no non-static submit request shown
  - Playwright CLI console warning/error check — 0 warnings, 0 errors
  - Playwright CLI mobile snapshot/menu smoke — closed menu hidden from accessibility tree; open menu works
- **Out-of-scope files left untouched:** pre-existing dirty files in `showcase/demo-kit/**`, `showcase/lib/demos.ts`, `showcase/demos/assurance/**`, and `showcase/public/demo/assurance/**`.
- **Residual risks:**
  - The new page is a faithful live demo route, not a real lead-capture flow.
  - Footer/header code is route-local duplication rather than a shared extracted component; extraction can be done later after more Assurance pages are ported.
  - Some links point to planned future nested Assurance routes and may remain placeholders until those pages are ported.
- **Next owner/action:** Owner review and optional selective commit decision for this Work Block's scoped files only.
