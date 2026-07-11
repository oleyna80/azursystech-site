# WB-2026-07-11 - Plomberie Design Refresh

## Meta
- **Work Block ID:** WB-2026-07-11-plomberie-design-refresh
- **Date:** 2026-07-11
- **Owner:** azur
- **Execution Mode:** end-to-end autonomous within approved scope
- **Side-Effect Class:** client-facing
- **DB Action Mode:** none
- **Verification Tier:** full

## Lifecycle State
- **Current Stage:** Stage 3 - Closeout
- **Stage Execution State:** complete
- **Write Gate:** READY after accepted Critic supplements
- **Owner Approval Evidence:** Owner request in current session to redesign `/demo/plomberie`, use `design-direction`, and optionally change imagery/palette
- **Critic Gate:** SUPPLEMENT accepted
- **Verification Gate:** READY
- **Verification Verdict:** READY
- **Stage 3 Mode:** closeout without commit/push

## Objective
Redesign the Plomberie showcase landing page into a distinctive, trustworthy French emergency plumbing demo while fixing the current runtime token, responsive overflow, and CTA visibility defects.

## Expected Final Result
`/demo/plomberie` presents a polished route-local showcase with an "Atelier hydraulique" art direction, clear emergency and quote paths, correct desktop/mobile layouts, accessible controls, demo-only forms, and independent review and browser verification evidence. No unrelated dirty files, dependencies, shared application surfaces, commits, or pushes are touched.

## Done Criteria
- [x] Route-local Plomberie design and copy are updated within the approved write-set.
- [x] Theme tokens are active, mobile overflow is removed, and the mobile CTA is mobile-only.
- [x] Forms remain local demo controls with no network submission.
- [x] Reviewer and Verifier return READY after type, lint, route, desktop, and mobile checks.
- [x] Existing unrelated dirty files remain untouched and documented.

## Preflight State
- **Git baseline:** dirty; `main` is ahead of `origin/main` by 1 commit.
- **Pre-existing dirty files:** `.agent/ROSTER.md`, `.agent/skills/design-direction/SKILL.md`, `.agent/verification-gate.md`, `.codex/**`, `AGENTS.md`, selected docs templates, `showcase/next-env.d.ts`, and two `web/**` files; see session `git status --short --branch`.
- **Untracked local artifacts:** existing agent skills/hooks/templates and `docs/plans/WB-2026-07-10-design-agent-routing-pilot.md`.
- **Proceed rule:** target Plomberie files are clean; implementation must use the exact write-set and must not stage, revert, or normalize pre-existing dirty files.

## Dependency Check
### Must Resolve Before Start
- None. Critic supplements were accepted into this plan before implementation.

### Can Resolve During Work
- Verify that both existing documentary plumbing image requests succeed and that their crops support the new composition.

## Runtime / Data Mutation Boundary
- **Applies:** no
- **Agent authority:** approved code authoring only
- **Structured action:** not applicable
- **Trusted executor:** not applicable
- **Policy and approval:** no external submit, CRM, payment, booking, or live-data mutation
- **Audit path:** this Work Block, review report, and verification report
- **Forbidden direct path:** external form submission or provider API calls

## Scope
### In Scope
- Route-local Plomberie information architecture, visual hierarchy, palette, typography, responsive navigation, sections, footer, and demo-only forms.
- Repair missing runtime theme tokens, mobile horizontal overflow, desktop mobile-CTA leakage, focus states, and reduced-motion behavior.
- Adapt selected compositional principles from the Synth AI reference without copying its AI branding or visual object.

### Out of Scope
- Other showcase demos, shared showcase shell, `web/`, agent/control files, dependencies, configuration, public deployment, backend integrations, real contact submission, commit, and push.

## Write-Set
```
docs/plans/WB-2026-07-11-plomberie-design-refresh.md
showcase/app/demo/plomberie/layout.tsx
showcase/components/plomberie/HomePage.tsx
showcase/components/plomberie/Nav.tsx
showcase/components/plomberie/Footer.tsx
showcase/components/plomberie/data.ts
showcase/components/plomberie/tokens.module.css
showcase/components/plomberie/home.module.css
showcase/components/plomberie/nav.module.css
showcase/components/plomberie/footer.module.css
docs/reports/review-WB-2026-07-11-plomberie-design-refresh.md
docs/reports/verification-WB-2026-07-11-plomberie-design-refresh.md
```

## Navigation Impact
- **Files added/moved/removed:** Work Block and review/verification reports only; no route added or removed.
- **PROJECT_MAP.md update needed:** no; route and ownership do not change.
- **FILE_REGISTRY.yml update needed:** no; no new authoritative control surface.
- **Session bootstrap or profile docs update needed:** no.
- **Engineering memory update needed:** no unless verification exposes a reusable process finding.
- **Generated/derived/local-only boundary changed:** no.

## Commit / Stage Scope
- **Files to stage/commit:** none in this Work Block without separate Owner approval.
- **Files to leave unstaged:** all pre-existing dirty/untracked files and all Work Block changes.
- **Commit readiness evidence:** not applicable until Owner requests a scoped commit after READY verification.
- **Scope guard:** `git status --short`, `git diff --name-only`, and path-scoped diff review.

## Acceptance Criteria
- [x] Desktop hero is asymmetric, contained, and immediately communicates emergency availability, service area, and primary action.
- [x] Palette uses mineral background, deep ink/teal, and restrained urgency coral; no generic blue gradient or translucent copy card remains.
- [x] Services are not six equal generic cards; reviews are not three equal generic cards; footer is compact and credible.
- [x] Navigation is single-row on desktop and usable without wrapping/overflow on mobile.
- [x] At `390x844`, document width does not exceed viewport width and no fixed control overlaps the showcase return control.
- [x] Interactive controls have visible focus, hover/pressed treatment, adequate contrast, and reduced-motion support.
- [x] All form buttons are demo-only and produce no network request.
- [x] Existing route anchors, phone links, and French copy remain coherent.

## Risks and Mitigations
| Risk | Impact | Mitigation | Stop Condition |
|---|---|---|---|
| Dirty tree causes scope leakage | User work overwritten | Exact path allowlist and before/after status audit | Any unrelated file changes |
| Reference becomes an AI-template imitation | Weak domain credibility | Borrow composition only; use plumbing-specific copy and documentary imagery | Design loses plumbing identity |
| Remote imagery is unavailable | Visual degradation | Retain tested URLs and meaningful alt text; defer local asset generation | Image fails during verification |
| Responsive redesign regresses route | Broken demo | Desktop/mobile Playwright verification and overflow checks | Route or key interaction fails |

## Hard Stops in Scope
- [ ] New dependency or configuration change
- [ ] Expansion into shared routes or other demos
- [ ] Real external form submission
- [ ] Commit, push, deploy, or publication

## Subagent Strategy
- **Classification:** Subagent-Required
- **Triggers matched:** non-trivial design, client-facing UI, responsive behavior, dirty tree
- **Use Claude Code team:** no; native scoped subagents are available
- **Claude Code process scope:** not applicable
- **Claude Code external report:** not applicable
- **Use Codex/GPT critic or verifier:** yes; Critic before implementation, Reviewer after implementation, Verifier for browser/runtime evidence
- **Dispatch plan:** Design Analyst read-only -> Critic read-only -> one Scoped Coder write-capable -> Reviewer read-only -> Verifier read-only
- **Budget posture:** normal
- **Skip reasons:** none

## Skills
- **Checked:** `.agent/skills/design-direction/SKILL.md`, `reference/redesign.md`, `reference/taste.md`, `reference/emil.md`
- **Matched:** design-direction redesign path
- **Used:** design-direction base, redesign, taste, restrained CSS interaction guidance; theme-factory consulted as a benchmark
- **Skipped:** theme-factory contract application because this route is deliberately route-local and introducing `DemoTheme` would expand into shared architecture; frontend-design as a second style layer because it overlaps the selected taste layer; generated imagery because two real documentary images already exist and are more authentic than synthetic evidence imagery

## Design Brief / Design Skill Stack
- **Applies:** yes
- **Design brief artifact:** this section and Design Analyst evidence in the session
- **Design Analyst required:** yes; completed read-only audit
- **Source fidelity mode:** inspired-adaptation
- **Base design skill:** `design-direction/reference/redesign.md`
- **Style/taste skill:** `design-direction/reference/taste.md`
- **Component/system skill:** existing Next.js components and CSS Modules
- **Motion/source-tool skill:** `design-direction/reference/emil.md`, limited to restrained CSS interaction feedback
- **Rejected skills:** theme-factory and overlapping frontend-design layer as noted above
- **Visual QA gates:** desktop/tablet/mobile hero, navigation, services, emergency CTA, coverage, reviews, form, footer, focus, contrast, overflow, image requests, reduced motion, and no form network request

### Direction: Atelier hydraulique
- **Design read:** A conversion-focused French emergency plumbing service for stressed homeowners, expressed through precise artisan and dispatch-center language with restrained editorial utility and documentary imagery.
- **Design dials:** `DESIGN_VARIANCE=5`, `MOTION_INTENSITY=3`, `VISUAL_DENSITY=4`.
- **Audience:** Paris and petite-couronne homeowners needing urgent or planned plumbing work.
- **Desired response:** calm trust, operational clarity, and competent artisan service.
- **Palette:** `#F2F4F1` background, `#FBFCFA` surface, `#102A2C` ink, `#006B68` primary, `#DDECE8` water tint, `#F36F45` urgency status, `#CAD5D1` border.
- **Typography:** Manrope for display/body and IBM Plex Mono for operational labels and figures, loaded through `next/font`.
- **Composition:** contained asymmetric hero, proof rail, dominant emergency service plus numbered service index, documentary image/evidence split, semantic emergency strip, text-backed coverage, a full-width Google Maps demo review marquee, one consolidated quote form, compact footer.
- **Reference use:** borrow the Synth AI template's contained stage, crisp controls, generous negative space, and asymmetric hierarchy; do not copy AI language, abstract 3D imagery, or pastel SaaS styling.
- **Reference locator:** `https://21st.dev/@serafim/templates/synth-ai`; explicit constraints above remain authoritative if the external preview is unavailable.
- **Theme-factory comparison:** consulted `Urgent-Trust`; both directions prioritize immediate action, trust, and strong contrast. The route-local `Atelier hydraulique` palette replaces conventional emergency blue with mineral teal and uses coral only as a semantic urgency signal, avoiding a shared `DemoTheme` migration.
- **Color mode:** intentionally light-only. The mineral paper/surface hierarchy and documentary photography are part of this fixed showcase art direction; no site-level theme switch exists on this route.
- **Image policy exception:** retain the two existing real Unsplash documentary images. Do not generate people, credentials, logos, vehicles, or scenes that could be mistaken for evidence from a real company. Verification must confirm both image requests and crops.

## Verification Plan
- **Canonical checks:** `git diff --check`; `npm run check:types`; `npm run lint` from `showcase/`.
- **Scoped fallback checks:** route-specific TypeScript/CSS inspection if a repository-wide command is blocked by pre-existing unrelated state.
- **Browser smoke:** `/demo/plomberie` at `1440x900`, `1024x768`, and `390x844`; anchors, telephone links, menu, demo form, horizontal overflow, successful image requests, no external form request, console errors, and screenshots.
- **Evidence expected:** review report, verification report, command output, and desktop/mobile screenshots or recorded browser observations.
- **Skipped checks:** production deployment and external submission testing are out of scope. Lighthouse is skipped because this route runs inside a local showcase shell with remote demo imagery and the Work Block does not claim production performance readiness; image success, console, layout, and interaction checks are required instead.

## Rollback / Recovery
Revert only the Work Block write-set through a scoped patch. Never reset or restore unrelated dirty files.

## Execution Log
| Time | Stage | Action / Decision | Evidence | Status |
|---|---|---|---|---|
| 2026-07-11 | Stage 0 | Preflight and dirty-tree isolation | `scripts/bootstrap.sh --check`, `git status --short --branch` | completed |
| 2026-07-11 | Stage 0 | Design Analyst audit and brief | runtime desktop/mobile inspection and scoped file review | completed |
| 2026-07-11 | Stage 0 | Critic review | SUPPLEMENT: dials, image policy, light mode, verification and theme-factory rationale | completed |
| 2026-07-11 | Stage 0 | Accepted Critic supplements and opened write gate | updated design brief and verification plan | completed |
| 2026-07-11 | Stage 1 | Scoped implementation | nine route-local Plomberie files changed by one Coder | completed |
| 2026-07-11 | Stage 2 | Reviewer pass 1 | mobile CTA overlap and coral hover contrast findings | supplement |
| 2026-07-11 | Stage 2 | Scoped corrections | route shell marker and AA-compliant hover treatment | completed |
| 2026-07-11 | Stage 2 | Verifier pass 1 | source readability blocker; global/out-of-scope observations separated | blocked |
| 2026-07-11 | Stage 2 | Source formatting correction | route TSX/CSS normalized without behavior change | completed |
| 2026-07-11 | Stage 2 | Independent review | zero findings | READY |
| 2026-07-11 | Stage 2 | Full browser verification | type, lint, diff, route, responsive, interaction and form checks | READY |
| 2026-07-11 | Stage 2 | Owner visual feedback: hero image used only part of its media zone | percentage height lacked a definite containing height | correction required |
| 2026-07-11 | Stage 2 | Focused hero image correction and verification | absolute fill; desktop and mobile image/container bounds match exactly | READY |
| 2026-07-11 | Stage 2 | Owner visual feedback: secondary service arrows were too small and priority CTA too weak | remove links from services 02-06; promote service 01 action | correction required |
| 2026-07-11 | Stage 2 | Focused services correction and verification | two-column informational rows; full-width white priority CTA; desktop/mobile browser evidence | READY |
| 2026-07-11 | Stage 2 | Owner visual feedback: Avis contained only one testimonial | preserve the composition with a manual, non-autoplay carousel | correction required |
| 2026-07-11 | Stage 2 | Avis carousel implementation and verification | three labelled demo reviews; wrap-around controls; counter; desktop/mobile browser evidence | READY |
| 2026-07-11 | Stage 2 | Owner follow-up: make Avis a separate marquee module intended for Google Maps reviews | replace the manual carousel without introducing provider credentials or backend integration | correction required |
| 2026-07-11 | Stage 2 | Avis marquee implementation and verification | five labelled demo reviews; continuous CSS track; hover/focus pause; reduced-motion fallback; desktop/mobile browser evidence | READY |
| 2026-07-11 | Stage 3 | Closeout | reports recorded; no commit or push | completed |

## Closeout and Retrospective
- **Result:** READY. The route now follows the approved `Atelier hydraulique` direction and satisfies the Done Criteria.
- **Files changed:** the nine route-local files in the write-set, this Work Block, and two reports.
- **Review:** READY with zero final findings after two scoped corrections.
- **Verification:** READY at full tier; see `docs/reports/verification-WB-2026-07-11-plomberie-design-refresh.md`.
- **Residual risks:** shared favicon 404 and global CSP/header policy are outside this route-local scope; remote documentary images remain third-party dependencies; Google Maps reviews are demo content until a separately approved provider integration supplies cached, moderated data.
- **Git state:** no staging, commit, push, deploy, or unrelated-file normalization performed.
- **Next Owner action:** visually inspect `http://localhost:3002/demo/plomberie`, then make a separate scoped commit decision.
