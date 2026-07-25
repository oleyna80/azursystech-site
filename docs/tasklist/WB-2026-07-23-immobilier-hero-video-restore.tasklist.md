# WB-2026-07-23-immobilier-hero-video-restore — Tasklist

## Work Block

- Owner-approved objective: restore the known Immobilier video hero into current `main`.
- Execution: autonomous within this literal write-set; no staging, commit, push, deployment, publication, provider action, or rights research.
- Side-effect class: production code write.
- DB action mode: none.
- Verification tier: standard, non-sensitive, with independent readonly-root formal review.

## Stage 0 — Routing preflight

- Work Block type: restoration of an existing local showcase video-hero implementation from pinned Git history.
- Relevance filter: always relevant=current Work Block gates and subagent mission brief; relevant to this task=frontend design, existing-video integration, motion direction, media-rights boundary, browser testing; not relevant=video generation, providers, postproduction, database, deployment, security hardening, commit/push, and all unrelated skills.
- Skills routing: checked=current-work-block-gates, subagent-mission-brief, frontend-skill, web-video-integration, media-art-director, media-rights-compliance, webapp-testing, git-safety; matched=current-work-block-gates, subagent-mission-brief, frontend-skill, web-video-integration, media-art-director, media-rights-compliance, webapp-testing; used=current-work-block-gates, subagent-mission-brief, frontend-skill, web-video-integration, media-art-director, media-rights-compliance, webapp-testing; skipped=git-safety (no stage, commit, or push).
- Visual and interaction brief: exact-port, not redesign; a calm, full-bleed Riviera motion backdrop preserves the current headline and CTA hierarchy; muted looping playback remains decorative, while a static hero image remains visible during load, reduced motion, and playback failure.
- Asset contract: restore only `47d28d8:showcase/public/videos/hero-part2.mp4`, SHA-256 `cde737008c53aa63ab229d1be4e930091d70281440bc2327f6f4622bf9176680`, 4,952,640 bytes.
- Rights boundary: historical provenance is unconfirmed. Conditional local demo use only; deployment, public publication, provider contact, and claims of production deliverability are out of scope.
- Recent-page lifecycle check: Owner confirmed on 2026-07-23, “больше не планируется ничего перестраивать. переноси.”
- Subagent topology: Subagent-Required (four implementation paths and client-facing runtime behavior). Critic reviews the revised plan; exactly one Scoped Coder implements; Verifier reviews frozen diff and browser evidence.
- Hard Stops: none in scope. No DB, deployment, credentials, provider, client communication, staging, commit, or push.
- Write gate: READY — revised Critic review approved the literal write-set.

## Approved write-set

- `.agent/critic-gate.md`
- `.codex/write-gate.md`
- `.agent/verification-gate.md`
- `docs/tasklist/WB-2026-07-23-immobilier-hero-video-restore.tasklist.md`
- `docs/reports/critic-WB-2026-07-23-immobilier-hero-video-restore.md`
- `docs/reports/WB-2026-07-23-immobilier-hero-video-restore-verification.md`
- `showcase/components/immobilier/HeroMedia.tsx`
- `showcase/components/immobilier/HomePage.tsx`
- `showcase/components/immobilier/home.module.css`
- `showcase/public/videos/hero-part2.mp4`

## Tasks

- [x] IHR-01 — Diagnose why the current `main` is image-only and identify the known historical implementation.
- [x] IHR-02 — Confirm current page structure remains and record immutable source asset identity.
- [x] IHR-03 — Complete revised Critic review and open the write gate.
- [x] IHR-04 — Restore the hero component, page integration, styles, and pinned MP4 asset.
- [ ] IHR-05 — Static checks passed, but required browser behavior on FR/EN desktop/mobile, reduced motion, and video failure is blocked by the local browser runtime.
- [x] IHR-06 — Independent readonly-root returned source-level `FORMAL_VERDICT: READY`; closeout recorded with a separate mandatory browser-runtime follow-up. Do not stage, commit, push, deploy, or publish.

## Closeout

- Implementation: DONE — exactly one Scoped Coder changed the four application paths.
- Formal source verification: READY — independent readonly-root, with required isolation met.
- Runtime browser evidence: BLOCKED — local Chromium/Playwright sandbox could not produce admissible browser output; it remains required before any commit, release readiness, deployment, or publication.
- Rights/provenance: conditional local-demo use only; no publication claim.

## Gate transition — 2026-07-23

- Shared gate ownership is transferred only for the separate
  `WB-2026-07-23-ai-video-production-policy` local-documentation Work Block.
- IHR-05 remains open as `HERO-BROWSER-01`: its missing browser proof is still
  a blocker for staging, commit, release readiness, deployment, and publication
  of this hero change. This transition neither marks it complete nor changes
  the historical asset's conditional local-demo rights boundary.
