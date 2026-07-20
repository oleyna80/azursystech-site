# Media Traceability Addendum — Immobilier Demo

**Work Block:** `WB-2026-07-20-immobilier-demo-review-remediation`
**Date:** 2026-07-20
**Record type:** append-only technical reconciliation

## Purpose and historical boundary

This record reconciles the current browser runtime source with prior local
closeout evidence. It does **not** change the historical plan or verification
report, their verdicts, or any media file.

The earlier snapshot,
`docs/reports/WB-2026-07-20-immobilier-demo-template-closeout-verification.md`
(lines 11–15), listed
`showcase/public/demo/immobilier/hero-kling-demo.mp4` as the unchanged
read-only video dependency, SHA-256
`66dffbe19076fab09b62d081048386d4d9e10de70793133249d3de5000b3f1e5`.
That record remains a point-in-time snapshot and is not rewritten here.

## Current local runtime evidence

| Field | Evidence |
|---|---|
| Source reference | `showcase/components/immobilier/HomePage.tsx` video source resolves to `/videos/hero-part2.mp4`. |
| Browser `currentSrc` | `http://localhost:3010/videos/hero-part2.mp4` on the FR desktop route, recorded by the native Verifier on 2026-07-20. |
| Current asset path | `showcase/public/videos/hero-part2.mp4` |
| Current SHA-256 | `cde737008c53aa63ab229d1be4e930091d70281440bc2327f6f4622bf9176680` |
| Playback evidence | `readyState=4`, `paused=false`, `muted=true`, `autoplay=true`; local request returned HTTP `206`. |
| Reduced-motion evidence | At 375px with reduced motion, video was `display:none` and local `/demo/immobilier/hero.jpg` fallback loaded. |
| Earlier local dependency | `showcase/public/demo/immobilier/hero-kling-demo.mp4` |
| Earlier dependency SHA-256 | `66dffbe19076fab09b62d081048386d4d9e10de70793133249d3de5000b3f1e5` |

The source and browser evidence above establish only the local technical
mapping used by the current demo. They do not establish copyright ownership,
commercial-use rights, provider terms, provenance, consent, watermark status,
or production-publication suitability. Those questions remain out of scope.

## Evidence links

- Native browser evidence:
  `docs/reports/WB-2026-07-20-immobilier-demo-review-remediation-verification.md`.
- Historical evidence snapshot (unchanged):
  `docs/reports/WB-2026-07-20-immobilier-demo-template-closeout-verification.md`.
- Runtime source dependency:
  `showcase/components/immobilier/HomePage.tsx` (read-only ambient change in
  this Work Block).
