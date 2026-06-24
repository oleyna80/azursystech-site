# Agent Operations Review — Sprint 2026-06-01

Local-only retrospective. Recommendations only: do not change permissions
automatically, do not weaken Hard Stops.

## Stage

Full SDLC cycle: bug report → investigation → fix → architecture research → production design → implementation → verification → maintainability review.

## Objective

Fix 404 on demo tile navigation, design production integration for showcase app, implement, verify maintainability.

## Role / Skill

Control Tower (Claude Code) + solution-architect subagent + maintainability-review workflow (62 subagents).

Skills checked: scoped-commit-guard, reviewer, verifier, impeccable. Matched: none at quick-fix stage. Used: verifier (implicitly via build checks). Skipped: impeccable (no UI design), reviewer (replaced by workflow), scoped-commit-guard (no commit yet).

## Expected result

- Demo tiles work (404 gone) — ✅
- Production integration designed — ✅ Option C+
- Implementation across 8 files — ✅
- Maintainability verified — ✅ READY, 9/10

## Context

Codex created plomberie demo template in `showcase/demos/plomberie/`. Main site (`web/`) linked to `/demo/plomberie` but the route only exists in separate `showcase/` Next.js app. In production, only `web` is deployed via Docker.

## Scope

8 files: showcase/next.config.ts, Dockerfile.proxy (new), nginx.proxy.conf, docker-compose.vps.yml, .env.vps.example, deploy.sh, ci.yml, docker-publish.yml.

## Out of scope

- Multi-page demo support (all demos single-page in v1)
- Client custom domains
- CDN integration

## Evidence reviewed

- Sanitized commands: `curl` smoke tests (200 on /demo/plomberie via rewrite), `npm run build` (SHOWCASE_STATIC_EXPORT=1)
- Subagent outcomes: solution-architect report (6 options, scoring matrix, Option C recommendation)
- Workflow outcome: maintainability-review (62 subagents, 4 dimensions, 0 findings, READY verdict)
- Direct file evidence: all 8 files read and verified

## Decision

**solution-architect agent**: Keep. Produced structured analysis in 125s, 33 tool calls, 73K tokens. Missed 2 implementation details (static files location, asset namespace) — caught by Owner during plan review. This is expected: architect finds the right direction, implementation details emerge during design review.

**maintainability-review workflow**: Simplify next time. 62 subagents, 1.65M tokens, 24 minutes — over-provisioned for 8 files. The 4-dimension pipeline + adversarial verification is the right pattern, but scale to task size: 1 reviewer per dimension (not N), verify only WARNING+ findings (not all). 0 findings suggests verification was thorough but token ROI was low.

**Control Tower**: Keep current approach. Stage 0 preflight used, subagents dispatched correctly, Hard Stops respected.

## Permission / approval friction

None. Owner approved architecture direction inline, implementation proceeded without Hard Stop triggers.

## Tooling / sandbox blockers

None. All tools (Bash, Read, Write, Edit, Agent, Workflow, Playwright) worked without issues.

## Subagent coordination issues

1. **solution-architect → Control Tower handoff gap**: Architect recommended Option C (static export in app image), Owner identified 2 gaps during review (nginx can't see files in separate container; asset namespace collision). Not a tool failure — a design review finding. Mitigation: solution-architect should include "deployment topology" check in its analysis template.

2. **Workflow over-provisioning**: 62 subagents for 8 files. Pipeline structure was correct but the parallel fan-out within each review stage spawned too many verifiers. The `pipeline` correctly ran all 4 dimensions in parallel, but each dimension's `parallel(verifiers)` spawned ~12 subagents (one per finding × one verifier per finding). With 4 dimensions × ~3 findings each = ~12 findings × 1 verifier = ~48 verifiers. 0 findings after verification means the initial reviewers were accurate but the adversarial pass was unnecessary overhead.

## Outcome signals

- Build: ✅ showcase static export build successful
- Typecheck: ✅ both web and showcase pass tsc --noEmit
- Tests: ✅ 90 passed, 3 skipped (web)
- Smoke: ✅ curl /demo/plomberie → 200 via rewrite
- Maintainability: ✅ 9/10, meets Production Maintainability Standard

## Outcome anchors

- Commit: NOT YET (pending after review closeout)
- Push: NOT YET
- CI: workflow files updated (showcase in matrix, proxy image in publish)
- Local checks: build ✅, typecheck ✅, tests ✅, smoke ✅
- Remaining dirty/untracked: empty dirs `[page]` and `[demoPage]` in showcase/app/demo/[slug]/ — harmless, Next.js ignores them

## Safe automation candidates

- Safe to allow: `npm run build` in showcase with SHOWCASE_STATIC_EXPORT=1 (already in CI)
- Needs Owner approval: Docker image push, VPS deploy (existing Hard Stops cover this)
- Do not automate: showcase static export verification (requires visual check)

## Workflow or skill updates recommended

1. **solution-architect skill**: Add "deployment topology verification" step — before finalizing recommendation, trace the artifact path through all containers/volumes to catch "files in wrong container" class of bugs.
2. **maintainability-review workflow pattern**: Scale subagent count to `min(16, files * 2)`. For 8 files, cap at ~16 subagents. Skip adversarial verification for NOTE severity. Batch verify similar findings together.
3. **Session workflow cost tracking**: The maintainability-review consumed 1.65M tokens (24 min). For future sprints, set a budget hint: "+500k" for review workflows on <10 files.

## Hard Stops to preserve

All existing Hard Stops confirmed:
- Production deploy (VPS, Docker push) — not triggered
- Live DB migration — not triggered
- Credential rotation — not triggered
- Destructive git ops — not triggered
- Client communications — not triggered
- Push to main — not triggered (no commit yet)

## Risks / unknowns

- **Proxy image not yet built/pushed**: Dockerfile.proxy exists but hasn't been tested in CI. First CI run on push will validate.
- **nginx root vs alias**: Using `root /usr/share/nginx/html` with `location ^~ /demo/`. Verify in staging that `try_files $uri $uri.html $uri/index.html` resolves correctly for both `/demo/plomberie` and `/demo/plomberie/`.
- **CSP with inline scripts**: Static export generates inline `<script>` tags. Current CSP has `'unsafe-inline'` for script-src, which covers this. Revisit when hardening CSP.

## Next action

1. Commit all changes
2. Push to trigger CI (showcase build + proxy image)
3. Manual docker-publish workflow dispatch
4. Deploy to VPS with WEB_IMAGE
5. Smoke test /demo/plomberie on production
