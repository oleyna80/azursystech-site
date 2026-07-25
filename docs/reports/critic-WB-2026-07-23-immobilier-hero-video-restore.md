# Critic Report — WB-2026-07-23-immobilier-hero-video-restore

## Approved write-set

- `showcase/components/immobilier/HeroMedia.tsx`
- `showcase/components/immobilier/HomePage.tsx`
- `showcase/components/immobilier/home.module.css`
- `showcase/public/videos/hero-part2.mp4`

## Initial verdict

RECONSIDER — source restoration is technically bounded, but it needs an explicit no-publication provenance boundary and a static loading fallback before implementation.

## Findings and Control Tower response

1. Rights/provenance: the historical plan classifies `hero-part2.mp4` as provenance unconfirmed and not approved for publication. Response: scope is conditionally limited to the local showcase demo; no deployment, publication, provider interaction, rights research, or production-deliverability claim is authorized.
2. Progressive enhancement: the historical component did not supply a poster or static visual during normal-motion loading. Response: the approved implementation requires an always-visible static `hero.jpg` underlay and `poster` on the muted decorative video. Browser verification will cover normal load, reduced motion, and forced video failure.
3. Verification: client-facing video integration needs browser evidence. Response: use `webapp-testing` in Standard verification for FR/EN routes, desktop and 375px viewports, CTA legibility, reduced motion, forced video error, and no-flash static-to-video transition. Also run typecheck, build, scoped diff hygiene, and verify the pinned MP4 SHA-256/size.
4. Lifecycle: relevant pages are recent. Response: the Owner explicitly confirmed the current Immobilier structure stays in place on 2026-07-23.

## Re-review request

The revised plan keeps the original four implementation paths, fixes the progressive-enhancement gap inside that same scope, and introduces no generation, provider, rights research, deployment, or publication activity. A second Critic result is required before `Status: READY`.

## Re-review verdict

APPROVE — the revised plan pins the historical asset, confines unconfirmed provenance to local demo use, supplies static loading/reduced-motion/error fallback, and requires proportionate browser verification. No further Stage 0 condition remains.

## Gate-transition amendment — 2026-07-23

The active hero Work Block may additionally write
`memory_bank/orchestrator-log.md` and its own tasklist solely to preserve its
source-level verification result and its unresolved browser-runtime blocker
while a later, separate local-documentation Work Block takes over the shared
gate files. This amendment does not close IHR-05, authorize staging, commit,
release, deployment, publication, provider activity, or rights claims for the
historical asset.
