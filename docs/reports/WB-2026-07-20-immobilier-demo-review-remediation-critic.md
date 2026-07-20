# Critic Report — Immobilier Demo Review Remediation

**Work Block:** `WB-2026-07-20-immobilier-demo-review-remediation`
**Date:** 2026-07-20
**Role:** Critic (read-only)
**Verdict:** `SUPPLEMENT` — adopted by Control Tower with Owner approval.

## Required supplement

1. Preserve historical closeout documents as immutable evidence snapshots. Add
   a new traceability report instead of rewriting their former media assertion.
2. Cover all real-enquiry affordances: contact, agency, property, and footer
   contact surfaces plus their styles and typed bilingual data.
3. Do not edit the locale layout merely for the favicon. Add the route-level
   `icon.svg` metadata asset and verify its rendered metadata link.
4. The gallery must retain the exact invoking thumbnail for primary and
   secondary openers, trap forward and reverse Tab while open, and prevent
   default for Escape and arrow navigation.
5. Keep Control Tower documents/gates/logs separate from the sole Scoped
   Coder's application write-set. Do not touch hero/media files or unrelated
   dirty paths.

## Adopted write-set

- `.agent/critic-gate.md`
- `.agent/verification-gate.md`
- `memory_bank/orchestrator-log.md`
- `docs/plans/WB-2026-07-20-immobilier-demo-review-remediation.md`
- `docs/tasklist/WB-2026-07-20-immobilier-demo-review-remediation.tasklist.md`
- `docs/reports/WB-2026-07-20-immobilier-demo-review-remediation-critic.md`
- `docs/reports/WB-2026-07-20-immobilier-demo-review-remediation-traceability.md`
- `docs/reports/WB-2026-07-20-immobilier-demo-review-remediation-verification.md`
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
- `showcase/app/demo/immobilier/icon.svg`

## Constraints carried into implementation

- No API, provider, credential, dependency, configuration, deployment, media,
  staging, commit, or push action.
- Existing demo pages remain; no new routes or information-architecture change.
- The Verifier must exercise FR/EN desktop and 375px routes, client-only form
  validation, every static-contact surface, primary and secondary gallery
  focus-return, Tab/Shift+Tab containment, Escape/arrows, reduced motion,
  metadata icon, `currentSrc`, and SHA evidence.
