## Critic Report — WB-2026-08-12-showcase-production-multizone

**Date:** 2026-08-13
**Reviewed:** Stage 0 Routing Preflight, Work Block plan/tasklist, current source/configuration/workflow structure, `AGENTS.md`, `.agent/ROSTER.md`, and the Codex Critic contract
**Mode:** native independent read-only subagent
**Verdict:** **APPROVE**

This is a pre-implementation decision review. No Nginx, container, build, publish,
deploy, health, or rollback test has been run or is claimed to have passed.

### Scope Review

The proposed source write-set is aligned with the requested deployment boundary:
showcase production configuration and health route, its standalone image, VPS
Compose/Nginx/deploy logic, immutable-image workflows, and deterministic tests.
It does not widen into demo route/component/asset rewrites, `web/**`, admin source,
database configuration, secrets, or hook policy.

The current tree substantiates the plan's baseline evidence: the showcase route tree
is already rooted at `showcase/app/demo/**`; public material is under
`showcase/public/demo/**`; many source references deliberately use absolute
`/demo/...` URIs; the main health route is `web/src/app/health/route.ts`; and
`Dockerfile.showcase` does not yet exist. Current production deployment logic is
app-centric with optional admin, so changing the listed deployment surfaces is
necessary rather than scope creep.

### Required Contract Challenge

| # | Dimension challenged | Critic conclusion / implementation guardrail |
|---:|---|---|
| 1 | URI-preserving `/demo` routing | Sound. Use an exact `/demo` location plus a `^~ /demo/` prefix location whose `proxy_pass` has no URI replacement; fixture requests must prove the upstream receives the original URI. |
| 2 | `/demo-assets` `assetPrefix` | Sound. Production Next configuration must set exactly `/demo-assets`, and Nginx must forward `/demo-assets/_next/...` unchanged to showcase. |
| 3 | Absence of `basePath` | Sound and required. The existing route tree and numerous hard-coded `/demo/...` references would be semantically changed by `basePath`; a negative structural test is correctly planned. |
| 4 | Public `/demo` assets | Sound. `assetPrefix` does not relocate `public/**`; the current `/demo/...` image/video/CSS URLs must remain owned by showcase through the `/demo` proxy rule. |
| 5 | `next/image` behavior | Adequately identified. Production `assetPrefix` currently makes `images.unoptimized` true; implementation must preserve that explicit behavior and test a local `next/image` source remains `/demo/...`, not an unserved optimizer path. |
| 6 | Standalone Docker packaging | Sound. The future config must enable standalone output and `Dockerfile.showcase` must copy the standalone server, `.next/static`, and `public`, analogous to the existing app Dockerfile but with a `/demo/health` healthcheck. |
| 7 | `/demo/health` behavior | Sound. A showcase-only route at `showcase/app/demo/health/route.ts` and internal probe `http://showcase:3000/demo/health` avoid collision with the main app's existing `/health`. |
| 8 | Compose dependency model | Sound. Showcase must have no `DATABASE_URL`, PostgreSQL environment, volume, or `depends_on: postgres`; Nginx/web dependency ordering should include a healthy showcase where the rollout expects demo availability. |
| 9 | Nginx location precedence | Sound if implemented as planned. Exact/prefix locations must outrank the existing catch-all and be regression-tested for `/demo`, `/demo/...`, and `/demo-assets/...`; preserving proxy headers remains required. |
| 10 | Exact-SHA app/showcase publication | Sound. The existing publish workflow already resolves a full SHA once; both app and showcase tags must consume that same resolved `sha-<40-char-SHA>` value, never independently resolve a ref. |
| 11 | First-showcase-rollout rollback | Sound and explicitly distinguished. The workflow must record prior-showcase absence before mutation, restore prior runtime files, and stop/remove the newly introduced showcase service so the restored runtime has no showcase. |
| 12 | Subsequent rollback | Sound and explicitly distinguished. The rollback record must capture the prior showcase image and restore the coherent prior app/showcase pair together with prior Compose/Nginx/deploy/env runtime files. |
| 13 | `/`, `/fr`, `/health` regression | Adequately covered by the stated Nginx fixture matrix. These main-app paths must retain the catch-all `app:3000` target; public `/health` must not be captured by showcase. |
| 14 | Admin regression | Adequately covered. The existing `publish_admin` and `include_admin` inputs default to false; showcase additions must not start, publish, deploy, or alter admin unless the existing opt-in path is chosen. |
| 15 | PostgreSQL isolation | Sound. `DB action mode: none`, scope exclusions, and the planned Compose structural assertions adequately prohibit a showcase database dependency. |
| 16 | Verification-plan adequacy | Full tier is appropriate for a multi-domain release topology. The plan combines build/type checks with deterministic structural/fixture tests for proxying, packaging, publication, dependency isolation, and both rollback branches; unavailable live proof is correctly required to remain blocked/unverified. |

### Skill Routing Review

| Skill / contract | Status | Skip reason | Assessment |
|---|---|---|---|
| Codex Critic contract | used | — | Required by `.codex/critic.md` because this Work Block touches well over three files, uses a new topology, and changes deploy/runtime behavior. Native independent review is correctly used. |
| `git-orchestration-flow` | used for boundary | — | Appropriate for worktree isolation and the Owner-controlled no-push boundary. |
| `deploy-operations` | matched for later stage | deploy is an external Hard Stop at Stage 0 | Appropriate. It remains relevant to implementation/review design, but no live deployment operation is authorized now. |
| `git-safety` | matched for later stage | no staging/commit in this session | Appropriate; it must be used before any scoped local commit. |
| `webapp-testing` | matched for later stage | no implementation/runtime exists | Appropriate. Its browser proof complements, rather than substitutes for, the deterministic fixture plan. |
| `crash-test-gate` | matched for later stage | no route/proxy change exists yet | Appropriate. The skill explicitly triggers before committing route/config changes and must be run before a commit. |
| `security-pass` | not matched for Stage 0 execution | no security finding or security-hardening request; security-relevant proxy regressions are in verification | Credible. A post-implementation verifier should still inspect header forwarding/CSP implications because Nginx is changed. |

`AGENTS.md` and `.agent/ROSTER.md` make this Work Block subagent-required: it spans deployment, CI, Docker, reverse proxy, application configuration, and more than four files. The proposed sequence—one writer, then independent reviewer and verifier—is therefore correct. There is no parallel writer and no inappropriate live-operation delegation.

### Risk Gaps

No material unaddressed risk invalidates the Stage 0 plan. The following execution reminders are deliberately retained as implementation/verification guardrails:

- The first-rollout rollback test must prove the newly created showcase container is absent after restoration; merely restoring old runtime files does not remove a Compose orphan.
- Exact-SHA tests must reject a mismatched app/showcase pair, not only assert that each image string independently matches the tag pattern.
- The `next/image` check must cover a concrete local `<Image src="/demo/...">` output or request path, since asset-prefix checks alone do not prove image-loader behavior.
- Nginx tests should include `/demo` without a trailing slash, nested demo routes, and `/demo-assets/_next/static/...` so location precedence and URI preservation are demonstrated rather than inferred.

These are already compatible with P1–P5 and AC-001–AC-009; they do not require a scope expansion.

### Decision Quality

The plan is specific about authority, DB mode, source boundaries, first versus
subsequent rollout state, and honest Stage 0 evidence. Its verification tier and
agent topology match the blast radius required by `AGENTS.md` and `.codex/critic.md`.
The current `deploy-vps.yml` is necessarily the highest-risk surface: it presently
backs up only app/admin state and its existing rollback runner would not by itself
remove a first-rollout showcase. The plan correctly recognizes this as source work
and requires both rollback branches to be tested before any implementation is
accepted.

### Recommendations

#### Must Address (blocking quality)

- None. The reconciled plan is sufficiently bounded and testable to open the
  declared source write-set.

#### Should Address (improves robustness)

- Encode the four execution reminders above in the deterministic test script(s),
  not only in prose, when Stage 1 is implemented.
- Preserve the existing Nginx proxy-header and host/CSP maps; route-specific
  locations should reuse the same required header forwarding rather than creating
  an unreviewed proxy behavior divergence.

#### Might Consider (optional refinement)

- Keep test fixtures self-contained and static where possible so they can run in
  CI without Docker/VPS credentials; report any Docker daemon/browser proof that
  cannot run locally as blocked rather than passed.

### Required Orchestrator Response

- No plan supplement is required for the APPROVE verdict. On gate opening, retain
  exactly the declared source write-set and record this report as the resolved
  native Critic result. Do not treat the verdict as permission for an external
  publication, dispatch, VPS action, or deploy.

## Verification-contract supplement — 2026-08-13

**Verdict:** **SUPPLEMENT**

The retained Showcase candidate does not require an architecture or write-set
change. The verification contract must be reconciled before source-gate
reopening:

| Severity | Dimension | Finding | Required reconciliation |
|---|---|---|---|
| Must Address | Verification / publication boundary | Local Docker socket access was treated as a blocker for local commit and Owner publication handoff, although that environment capability is not part of the requested source contract. | Make local Docker optional. Require PR CI to build `Dockerfile.showcase`, start the Showcase container, verify `GET /demo/health == 200`, and execute required Docker/runtime integration checks. |

**Orchestrator response required:** amend the plan and tasklist to distinguish
mandatory local source/config assurance from authoritative mandatory PR-CI
Docker/runtime assurance, then obtain a fresh independent Critic verdict before
reopening the schema-v3 source gate.

## Fresh Critic re-check — 2026-08-13

**Mode:** native independent read-only Critic subagent
**Verdict:** **APPROVE**

The reconciled plan correctly makes local Docker optional and non-blocking for a
scoped local commit and Owner publication handoff. It requires local
source/config assurance without representing unavailable runtime evidence as
passed. It also explicitly requires PR CI to build `Dockerfile.showcase`, start
the Showcase container, and assert `GET /demo/health == 200` as the mandatory,
authoritative Docker/runtime proof.

`npx next build --webpack` is an appropriate local standalone packaging check.
The current CI workflow does not yet implement the required Docker runtime job;
that is the planned implementation correction inside the preserved source
write-set, not a Stage 0 defect. No write-set expansion, publication,
deployment, database, credential, or Docker operation is authorized by this
verdict.

## Post-implementation Critic re-check — 2026-08-13

**Mode:** native independent read-only Critic subagent
**Verdict:** **SUPPLEMENT**

The frozen source/configuration correctly makes the Showcase Dockerfile run
`npx next build --webpack`; PR CI is pull-request gated and builds
`Dockerfile.showcase`, starts the container, and uses a failing curl request to
require a successful `/demo/health` response. Local Docker remains optional and
no unexecuted runtime proof is represented as passed.

**Required Orchestrator response:**

- Fresh local proof has now been run: lint (warnings only), typecheck,
  `npx next build --webpack`, standalone/static/public output existence,
  deterministic contract test, YAML parse, `git diff --check`, and deploy shell
  syntax all pass.
- The prior Verifier report is historical/stale: it predates the reconciled
  plan revision and incorrectly treats local Docker denial as a commit blocker.
  A fresh Verifier must replace that conclusion with a current source/config
  verdict while marking PR-CI Docker execution pending rather than locally
  passed.
- SSOT status is synchronized in the plan/tasklist; lifecycle state remains the
  authoritative `READY` source gate until formal assurance completes.

## Final assurance Critic re-check — 2026-08-13

**Mode:** native independent read-only Critic subagent
**Verdict:** **APPROVE**

The final plan digest `sha256:31ed54212eb290f31d1f51828b13f5aa8f756e2c8795135e7ba90d05832a0510`
matches the active Work Block. Current R5 review and Verifier evidence are
recorded `READY`; they establish lint, typecheck, standalone Webpack build,
contract/config checks, and a clean diff. The CI workflow mandates PR-only
Docker build, container startup, and `/demo/health` proof while correctly
leaving that execution pending and non-blocking locally. The tasklist has been
synchronized to reflect completed Reviewer/Verifier assurance. No source scope
change is required.

### Inspection Gaps

- No implementation diff exists, so runtime routing, generated Next output,
  Docker image contents, Compose rendering, and rollback behavior could not be
  executed. They remain future verification work, not passed evidence.
- `.agent/skills/critic-review/SKILL.md` was not present in this worktree even
  though `.agent/ROSTER.md` names the logical skill. The committed
  `.codex/critic.md` contract supplied the applicable mandatory-trigger and
  output rules; this is an inspection limitation, not a reason to bypass the
  required independent critic.
