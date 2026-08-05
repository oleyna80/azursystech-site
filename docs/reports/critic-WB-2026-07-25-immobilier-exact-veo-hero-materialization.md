# Critic report — WB-2026-07-25-immobilier-exact-veo-hero-materialization

Date: 2026-07-25  
Role: Critic / release-integration reviewer (read-only)  
Scope: local materialization of the Owner-approved exact candidate into the Immobilier showcase Hero. No provider, deployment, publication, or private-media modification occurred during this review.

## Verdict: SUPPLEMENT

The Owner's visual and audible review completes the human QC for the exact
candidate `9345e2daebc90d9cd8c91fcacc5d8fce1ae4c6d423a576ca79a9eba58eb2961f`.
It supports a bounded local Hero integration after a release-decision record
binds that approval to the exact hash and scope.

The currently referenced `showcase/public/videos/hero-part2.mp4` is a distinct
ambient asset. It must neither be overwritten nor treated as the approved
candidate. The implementation must use a new, traceable filename and modify
only the Hero media source.

## Required boundaries

1. Materialize the exact private candidate as
   `showcase/public/demo/immobilier/hero-veo-20260724.mp4` and prove its
   SHA-256 before changing the component.
2. Update only `HeroMedia.tsx`; preserve ambient `HomePage.tsx`, CSS,
   `hero-part2.mp4`, and the deleted historical `hero-loop.mp4`.
3. Write a private, secret-free release decision for the exact hash. Its scope
   is repository-local Immobilier Hero integration only; public deployment and
   disclosure review remain separate decisions.
4. Keep the video muted for autoplay. Enabling audible surf is a separate
   UX/accessibility change.
5. Verify types, production build, and both FR/EN Hero routes at desktop and
   mobile, including the reduced-motion fallback.

## Critic-approved write-set

- `.agent/critic-gate.md` (Control Tower gate record only)
- `.codex/write-gate.md` (Control Tower gate record only)
- `docs/reports/critic-WB-2026-07-25-immobilier-exact-veo-hero-materialization.md`
- `docs/tasklist/WB-2026-07-25-immobilier-exact-veo-hero-materialization.tasklist.md`
- `showcase/components/immobilier/HeroMedia.tsx`
- `showcase/public/demo/immobilier/hero-veo-20260724.mp4` (new, exact private candidate only)
- `/home/azur/.local/share/azursystech-private/ai-video-evidence/AST-IMMOBILIER-HERO-VEO31FAST-20260724-01/release-and-revocation/release-decision-20260725.yml` (private record only)

## Exclusions

No modification of `HomePage.tsx`, `home.module.css`, `hero-part2.mp4`,
`hero-loop.mp4`, historical tasklists, generation/provider records, secrets,
deployment configuration, commit, push, or public release is authorized.
