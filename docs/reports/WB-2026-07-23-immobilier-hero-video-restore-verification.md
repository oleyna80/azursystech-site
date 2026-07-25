# Verification Brief — WB-2026-07-23-immobilier-hero-video-restore

## Frozen payload

- `showcase/components/immobilier/HeroMedia.tsx`
- `showcase/components/immobilier/HomePage.tsx`
- `showcase/components/immobilier/home.module.css`
- `showcase/public/videos/hero-part2.mp4`

Asset identity: SHA-256 `cde737008c53aa63ab229d1be4e930091d70281440bc2327f6f4622bf9176680`; 4,952,640 bytes. Historical provenance is unconfirmed: this Work Block authorizes local-demo source restoration only, never deployment or publication.

## Native Verifier evidence (advisory)

- PASS: asset hash and size, `npm run check:types`, `npm run build`, scoped `git diff --check`, and static review of persistent `hero.jpg` underlay, `poster`, reduced-motion branch, and video-error branch.
- BLOCKED: browser runtime proof. The prescribed Playwright wrapper exited before launch with `Failed to create stream fd: Operation not permitted`; a narrow escalated localhost/Chromium recovery was interrupted after 92.9 seconds without HTTP, console, screenshot, or browser output.
- Therefore FR/EN route runtime status, desktop/375px visual smoke, no-flash transition, reduced-motion execution, forced-MP4-error execution, console, and overflow are unverified. Do not represent them as passed.

## Formal read-only request

You are an independent readonly verifier. Review only the frozen four-path payload and its integration contract. Do not modify files; do not run deploy, provider, browser, DB, credential, staging, commit, or push actions. Verify that the source is maintainable, path-contained, statically satisfies progressive enhancement, uses the pinned local MP4 correctly, and introduces no security/config/dependency regression. Distinguish your source-level formal verdict from the separately blocked browser-runtime evidence. Emit exactly `FORMAL_VERDICT: READY` only if the frozen local source is acceptable with that runtime follow-up retained; otherwise emit `FORMAL_VERDICT: BLOCKED` and actionable reasons.

## Independent readonly-root result

- Isolation: `independent-readonly-root`; `scripts/agent-runtime-doctor.sh` reported all prerequisites `PASS`.
- Asset: SHA-256 and byte size match; `ffprobe` reports a valid 1280×720 H.264/YUV420p MP4, duration 6 seconds.
- Source: permanent static underlay, metadata preload, poster, motion preference branch, readiness opacity transition, and error fallback are coherent; the asset resolves locally to `public/videos/hero-part2.mp4`.
- No dependency, config, external-resource, or security regression was found.
- `FORMAL_VERDICT: READY` — source-level only. It does not convert the blocked browser-runtime evidence into a pass.

## Closeout

Formal local-source verification is READY. Browser runtime verification remains BLOCKED due to the local Chromium/Playwright sandbox failure, and must be completed before any commit, release-readiness, deployment, or public publication claim.
