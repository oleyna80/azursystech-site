# Critic Report — WB-2026-07-15-cleanup-showcase-port

## Mission

Pending fresh read-only Critic review of the frozen two-path development
fallback-origin change. The Reviewer has no file-change permission.

## Required assessment

- Verify whether the `3007` to `3002` fallback aligns with the local showcase
  runtime contract.
- Verify home and portfolio fallbacks stay synchronized and an explicit
  `NEXT_PUBLIC_SHOWCASE_BASE_URL` override still wins.
- Verify the exact write-set and out-of-scope boundaries.

## Verdict

**APPROVE**

## Evidence

- `web/src/app/[locale]/_home-data.ts:3-7` and
  `web/src/lib/portfolio-data.ts:1-5` use the same expression; the frozen diff
  changes only the development fallback from `3007` to `3002` in both paths.
- `??` keeps any defined `NEXT_PUBLIC_SHOWCASE_BASE_URL` override, while the
  helper continues to append `/demo/${slug}`.
- `CLAUDE.md:15` declares the showcase dev-port convention as `3002`; prior
  runtime evidence records both `next start -p 3002` and `/demo/plomberie`
  returning 200 there.
- `web/src/app/[locale]/_home-data.test.ts:4-44` covers both locales' demo URL
  paths; portfolio entries use the same base-url helper.
- `git diff --check` passed and the candidate diff is limited to the two
  approved payload paths.

## Boundary

The Critic did not run typecheck, servers, or browser smoke. Those are the
read-only Verifier's remaining checks. Listener inspection with `ss` was
restricted by the sandbox and is not treated as runtime proof.
