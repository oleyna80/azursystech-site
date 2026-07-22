# Verification report — WB-2026-07-22 English core implementation

## Formal verdict

READY

The independent top-level readonly Codex root returned `FORMAL_VERDICT: READY`
for the frozen approved 13-path EN core diff. No files were modified, staged,
committed, pushed, deployed, or externally accessed by the verifier.

## Scope and acceptance evidence

- `/en` and `/en/ai-automation` are the only English sitemap entries.
- The URL-derived locale boundary makes direct FR/RU/EN requests authoritative
  for the server-rendered document language; API requests retain their prior
  CORS and OPTIONS path.
- English has no chat, forms, brief/contact, showcase, portfolio, or legal
  conversion paths. Its calls to action use WhatsApp.
- English canonical URLs, hreflang/x-default, JSON-LD language, and service
  positioning match the two-route information-only launch.
- Current web-application, website, and AI-automation wording replaces local
  hardware/onsite positioning in the EN core, without changing FR/RU route
  structure.

## Advisory verifier checks

- Focused EN page, EN AI page, and sitemap tests: passed (6/6).
- `npm run lint`: passed; three existing `<img>` warnings only.
- `npm run check:types`: passed.
- `npm run build`: passed (39 pages).
- `scripts/verify.sh standard`: lint completed with five non-blocking existing
  `<img>` warnings; its full Vitest phase stopped only on the same two ambient
  `bistrot` assertions described below.
- `git diff --check`, scoped secret-signature scan, metadata/JSON-LD,
  sitemap, header/footer conversion boundaries, and `web/src/proxy.ts` CORS
  source review: passed.
- The focused-file full Vitest run reported two ambient `bistrot` expectation
  failures in `_home-data.test.ts`; they are outside the frozen EN change.

## Independent readonly-root checks

- `scripts/agent-runtime-doctor.sh`: ready.
- `git diff --check -- <frozen write-set>`: passed.
- `npx tsc --noEmit --incremental false`: passed.
- Source, scope, routing, SEO, conversion-boundary, and CORS-preservation
  review: passed.

## Residual runtime follow-up

The readonly verifier could not create temporary SSR files or open sockets, so
it could not run Vitest, localhost/browser smoke, screenshots, console checks,
or served-response inspection. This is a runtime-evidence limitation, not a
source finding. Run an authorized local browser smoke before a commit or
release that relies on this public-facing change.
