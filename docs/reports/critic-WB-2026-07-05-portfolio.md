# Critic Report — WB-2026-07-05-portfolio

Date: 2026-07-05
Reviewed: approved Work Block plan (Portfolio section) + codebase inspection
Verdict: SUPPLEMENT

## Scope
- Write-set (13 files) well-bounded; no scope creep; static /portfolio does not conflict with [locale] routing or next.config redirects.
- fr-only Portfolio content on bilingual site: accepted Owner design choice; document asymmetry.

## Findings
1. BLOCKER-quality gap: web/src/app/sitemap.test.ts has hardcoded expected URLs (lines 10-27); must add /portfolio + 6 slugs (or count assertion). Add file to write-set.
2. MAJOR: mobile menu (site-header.tsx lines 217-235) untested with 6 nav items at ~375px; smoke-test required before merge.
3. MAJOR (resolved by analysis): frame-src is the correct CSP2 directive; child-src not needed; Permissions-Policy (camera/mic disabled) does not affect YouTube playback. Document with inline comment.
4. MINOR: add hreflang fr + x-default alternates to portfolio/page.tsx and portfolio/[slug]/page.tsx generateMetadata (fr-only signal for search engines).
5. MINOR: img.youtube.com thumbnails already allowed by img-src https:. OK.

## Skill routing
- security-audit-triage SKIPPED: weak-but-defensible — CSP change is additive single-directive, no loosening of existing directives; admin CSP untouched.

## Topology
- SINGLE_AGENT correct (bounded frontend/config work).

## Required supplements before/during implementation
- Add sitemap.test.ts to write-set and update expectations.
- Verify mobile menu at 375px.
- Add hreflang/x-default to portfolio metadata.
- Document nav insertion position (after "websites") and CSP comment.

## Note
- Critic verdict SUPPLEMENT triggers mandatory GPT critic per critic-gate.sh.
