# Work Block — Immobilier Demo Review Remediation

**ID:** `WB-2026-07-20-immobilier-demo-review-remediation`
**Stage:** Verification — READY
**Owner authorization:** 2026-07-20 — «страницы остаются; расширение write-set на перечисленные файлы одобряю; запускай реализацию».

## Objective

Correct the confirmed demo-template defects from the independent review without
changing the demo's information architecture, adding dependencies, contacting
external services, or publishing anything. The outcome is a locally verified
Atelier Rivage demo with truthful local-demo disclosure, an accessible gallery,
correct EN accessibility copy, a local favicon, and reconciled technical media
traceability.

## Inputs and requirements SSOT

- Design brief: `showcase/app/demo/immobilier/DESIGN.md`.
- Runtime/design closeout: `docs/plans/WB-2026-07-20-immobilier-demo-template-closeout.md`.
- Independent review: the 2026-07-20 `immobilier_demo_reviewer` report in the
  owner conversation.
- Actual current hero runtime asset:
  `showcase/public/videos/hero-part2.mp4`, SHA-256
  `cde737008c53aa63ab229d1be4e930091d70281440bc2327f6f4622bf9176680`.

The review identified that historical closeout evidence instead points to
`showcase/public/demo/immobilier/hero-kling-demo.mp4`. This Work Block corrects
the technical record only. It does not assert legal ownership, commercial-use
rights, provider terms, or production suitability of either media file.

## Stage 0 preflight

- **Work Block type:** standard local frontend, accessibility, and documentation
  remediation.
- **Side-effect class:** local source/docs plus local browser process only.
- **DB action mode:** none.
- **Sensitive domains:** none. The contact form remains intentionally local-only;
  no network submission, persistence, or live contact workflow may be added.
- **Dependencies/configuration:** none authorized.
- **Hard Stops:** no deploy, provider/API call, credential/env access, external
  communication, destructive operation, staging, commit, or push is authorized.
- **Subagent-required:** yes — it remediates an external review, spans frontend,
  accessibility and docs, modifies more than four files, and needs independent
  verification.
- **Topology after approval:** Control Tower → read-only Critic → one Scoped
  Coder for the complete approved write-set → read-only Verifier for browser and
  type evidence → independent readonly-root verifier after the diff is frozen.
- **Verification tier:** standard. Browser acceptance is mandatory and the final
  source/evidence verdict must use `independent-readonly-root` isolation.
- **Skill Routing Gate:** checked=`git-safety`, `design-direction`,
  `webapp-testing`, `subagent-mission-brief`, `memory-ops`,
  `frontend-skill`; matched=all; used=`frontend-skill` for focused UI/a11y
  design constraints, `design-direction` in preserve/redesign mode,
  `webapp-testing` for browser acceptance, `subagent-mission-brief` for
  delegated boundaries, `memory-ops` for stage logging, and `git-safety` for
  dirty-tree containment. Media/provider, backend, security-hardening, and
  deployment skill categories are not relevant after inspection.
- **Write gate:** READY — Critic `SUPPLEMENT` adopted and Owner implementation
  approval recorded.

## Approved implementation write-set

### Application

- `showcase/components/immobilier/ContactForm.tsx`
- `showcase/components/immobilier/ContactPage.tsx`
- `showcase/components/immobilier/contact.module.css`
- `showcase/components/immobilier/data.ts`
- `showcase/components/immobilier/Gallery.tsx`
- `showcase/components/immobilier/SiteShell.tsx`
- `showcase/components/immobilier/shell.module.css`
- `showcase/components/immobilier/AgencePage.tsx`
- `showcase/components/immobilier/agency.module.css`
- `showcase/components/immobilier/PropertyPage.tsx`
- `showcase/components/immobilier/property.module.css`
- `showcase/components/immobilier/types.ts`
- `showcase/app/demo/immobilier/icon.svg` (new local favicon only)

### Evidence and documentation

- `docs/reports/WB-2026-07-20-immobilier-demo-review-remediation-traceability.md` (new)
- this plan and `docs/tasklist/WB-2026-07-20-immobilier-demo-review-remediation.tasklist.md`
- `docs/reports/WB-2026-07-20-immobilier-demo-review-remediation-critic.md` (new)
- `docs/reports/WB-2026-07-20-immobilier-demo-review-remediation-verification.md` (new)
- `memory_bank/orchestrator-log.md`
- `.agent/critic-gate.md` and `.agent/verification-gate.md` (Control Tower
  gate-transition records only)

Historical closeout documents are immutable evidence snapshots. The new
traceability report links their former assertion to current runtime evidence;
it must not silently rewrite those documents to make the original evidence
appear correct.

## Explicitly out of scope

- All video/image generation, replacement, crop, encoding, upload, provider
  console/API, credentials, `.env*`, and external requests.
- Any legal opinion or assertion about copyright, commercial use, SynthID, or
  provider terms.
- New routes, CMS, real lead capture, analytics, persistence, email, telephone
  changes, privacy-policy drafting, deployment, staging, commit, and push.
- Unrelated dirty paths and changes already present in the repository.

## Remediation requirements and acceptance criteria

1. **Media evidence SSOT.** A new append-only traceability record identifies
   `/videos/hero-part2.mp4` as the current runtime asset, records its SHA-256,
   links the former Kling-asset claim in the historical evidence, and records
   date, source reference, and browser `currentSrc`. The record explicitly says
   that rights/provenance verification is out of scope. No media binary or
   historical evidence snapshot is changed.
2. **Honest demo contact journey.** Before any personal-data field, both
   locales display a clear demo-only notice: no data leaves the browser and the
   contact details are not for real enquiries. The UI makes no promise of a
   human reply and every displayed `tel:`/`mailto:` contact across contact,
   agency, property, and footer surfaces cannot initiate an unintended external
   enquiry from the demo.
3. **Gallery keyboard containment.** When the gallery is open, `Tab` and
   `Shift+Tab` remain within its actionable controls; Escape, arrow navigation,
   backdrop close, and focus restoration to the invoking thumbnail still work.
   No package may be added.
4. **Locale correctness.** The EN wordmark link has an English accessible name;
   FR remains French. Gallery controls retain a localized accessible group/name
   without an incomplete tabs pattern.
5. **Favicon.** The immobilier route exposes a local
   `/demo/immobilier/icon.svg` metadata icon and the FR/EN page metadata links
   to it without an icon-request console error.
6. **No regression.** FR and EN homepage, catalogue, sale/rent, one property
   route, contact form validation/status, desktop, 375px mobile, reduced-motion
   video fallback, and hero playback remain functional. `npm run check:types`
   and scoped diff hygiene pass.
7. **Containment.** Only the approved write-set changes; generated screenshots,
   `.env*`, media binaries, unrelated dirty files, staging, commit, and push are
   excluded.

## Implementation constraints

- Reuse `ui[lang]` data for all new user-facing strings; no hard-coded language
  in an otherwise bilingual component.
- Use native browser APIs and existing React/CSS only; no accessibility package
  or runtime dependency.
- The demo notice must be visible before typing, not just after submit.
- Preserve existing form client-only validation and no-network behavior.
- The gallery must use the actual opening thumbnail as the focus-return target,
  including secondary thumbnails.
- A gallery dialog must trap forward/reverse Tab among its enabled visible
  controls, prevent default for Escape and arrow navigation, and restore focus
  after unmounting to the exact opener.
- The media-correction record must contain evidence gathered locally (path,
  SHA-256, stream status if checked, and browser `currentSrc`), not a claim
  inferred from a filename.

## Stage 0 critic addendum — adopted

- The Owner explicitly confirmed that existing demo pages remain and this is a
  remediation, not information-architecture restructuring.
- The application write-set expands to the agency, property, footer stylesheet,
  and shared types surfaces so no real-enquiry affordance remains outside the
  contact page. `showcase/app/demo/immobilier/[lang]/layout.tsx` is not changed;
  `icon.svg` is the only metadata-route exception.
- Contact strings must use typed bilingual `ui[lang]` data, and static contact
  presentation may not retain `href`, button semantics, click handlers, or
  keyboard activation.
- Control Tower owns this plan, tasklist, gate records, critic report,
  traceability addendum, and operational log. The sole Scoped Coder owns only
  application source and the icon. The Verifier owns browser evidence and the
  verification report.
- Existing hero files, media assets, existing closeout plan/report, `.artifacts`,
  configuration, dependency manifests, and unrelated dirty changes are frozen
  and out of scope.

## Stop conditions

Stop and ask the Owner if any requirement needs a real contact channel, storage,
API/backend route, privacy/legal wording beyond demo disclosure, new dependency,
asset replacement, provider action, runtime/configuration change, or publication
decision. Stop if the actual video asset is missing or differs from the recorded
SHA-256 before the documentation correction is verified.

## Verification stop record — 2026-07-20

The first independent `readonly-root` verifier returned `FORMAL_VERDICT: BLOCKED`.
It found the approved source-level remediation correct, but the worktree also
contains ambient changes to `HomePage.tsx`, `home.module.css`, hero media, and
additional untracked immobilier paths that are outside this Work Block. The
isolated runtime cannot prove those changes are unrelated. No implementation
change is authorized from this result. The required next action is a frozen
path-specific patch (or a clean worktree) containing only the approved paths.
Owner authorized that isolated-patch follow-up on 2026-07-20. The repeat
independent readonly-root verifier returned `FORMAL_VERDICT: READY` for the
frozen 21-path payload (SHA-256
`11eb83f5402a5a624848c0893b37f748b6f8a277b3cea0812005a98ed0e6565f`). It
confirmed the approved path set, destination blobs, reverse patch, scoped
whitespace, application requirements, traceability boundary, and absence of
media/configuration/dependency changes.

## Verification plan

- Critic `SUPPLEMENT` checked scope, dirty-tree containment, immutable
  historical evidence, contact-surface coverage, and focus-trap semantics; the
  required supplement is adopted before implementation.
- Scoped Coder implements all approved paths and records no other changes.
- Native Verifier runs types, scoped diff hygiene, source checks, real browser
  smoke on FR/EN desktop and 375px, contact/form checks, gallery Tab-cycle and
  focus-return checks, reduced-motion video suppression/fallback, favicon
  request, and media `currentSrc`/SHA evidence.
- Control Tower freezes the diff and sends only the approved implementation and
  evidence to an independent readonly-root verifier for the formal closeout.

## Risks and decisions deferred

- The correction can establish *technical traceability*, not media rights. A
  separate production-publication Work Block must own rights and legal review.
- Disabling demo `tel:`/`mailto:` links improves truthfulness but deliberately
  removes an affordance; this is correct for a non-production template.
- A custom JavaScript focus trap must be browser-tested with forward and reverse
  Tab navigation to avoid creating a worse accessibility regression.

## Owner decision requested

Verification is complete for the planned Scoped Coder → Verifier → independent
verifier sequence. No commit or deployment is included.
