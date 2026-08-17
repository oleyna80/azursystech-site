## Critic Implementation Report — WB-2026-08-12-showcase-production-multizone

**Date:** 2026-08-13
**Reviewed:** frozen implementation diff, active Work Block, Stage-0 plan/tasklist, and Stage-0 Critic report
**Mode:** native independent read-only Critic
**Verdict:** **SUPPLEMENT**

This is an advisory implementation critique, not a `READY`/`BLOCKED` gate. No
Docker build/run, Nginx container test, GHCR publication, workflow dispatch, VPS
operation, or production action was performed.

### Scope Review

The implementation remains within the activated source write-set. The new
standalone Dockerfile, health route, Compose service, Nginx locations, deploy
logic, workflows, and deterministic source-contract test all directly implement
the approved multizone architecture. There is no observed widening into demo
components/assets, `web/**`, database configuration, credentials, or hook
policy.

`git diff --check` is clean and `python3 scripts/test-showcase-multizone.py`
passes. That test is structural only; it does not establish Next build output,
actual Nginx matching, Docker packaging, Compose execution, rollback execution,
or a deployed request.

### Required Contract Challenge

| # | Dimension | Finding |
|---:|---|---|
| 1 | URI-preserving `/demo` routing | **Must supplement.** `nginx.proxy.conf` has `location ^~ /demo/` but no exact `location = /demo`; Nginx therefore sends bare `/demo` to the main-app catch-all. This contradicts plan AC 5 and the Stage-0 Critic guardrail. The existing `proxy_pass` values correctly omit a URI component for the two implemented prefix locations. |
| 2 | `/demo-assets` `assetPrefix` | The production config sets `/demo-assets` unconditionally and Nginx has a higher-precedence `/demo-assets/` location. However, `next/image` remains outside that namespace; see item 5. |
| 3 | No `basePath` | Pass by source inspection: no `basePath` is configured, and the route tree/public `/demo/**` layout is unchanged. |
| 4 | Public `/demo` assets | Correctly preserved in source: public assets remain `showcase/public/demo/**` and the `/demo/` proxy preserves their URI. Bare `/demo` still needs the exact-location correction above. |
| 5 | `next/image` behavior | **Must supplement.** Production sets `unoptimized: false`, while Next 16's default loader still emits `/_next/image?...` when `images.path` remains its default. A deterministic invocation against the installed loader for `/demo/assurance/paris-hero.jpg` produced `/_next/image?...`; that request is caught by Nginx `location /` and sent to the main app, not showcase. Configure/verify an optimizer path in the `/demo-assets` namespace (or use another explicit supported approach), then test an actual rendered `<Image>` request. |
| 6 | Standalone Docker packaging | The Dockerfile uses standalone output and copies the standalone server, `.next/static`, and `public` with non-root runtime ownership. This is structurally sound, but no standalone build/image startup proof is available. |
| 7 | `/demo/health` behavior | The route and internal Compose/deploy probes use `/demo/health`; public `/health` remains in the app fall-through. The production behavior is unexecuted. The retained `SHOWCASE_STATIC_EXPORT=1` branch needs separate proof because adding this route can make static-export compatibility fail without an export-compatible handler configuration. |
| 8 | Compose dependency model | The showcase service has no PostgreSQL dependency, database variable, or data volume, and `web` waits for both app and showcase health. This meets the intended isolation by source inspection. |
| 9 | Nginx location precedence | `/demo-assets/` and `/demo/` are `^~` locations before `location /`, and retain all reviewed forwarding headers. The missing exact `/demo` location is material; the structural test also does not prove actual Nginx matching or every required header. |
| 10 | Exact-SHA app/showcase publication | The mandatory app and showcase builds consume the same single `steps.meta.outputs.immutable_tag`, and deploy validates both tag format and pair equality. Admin publish/deploy remains opt-in/default false. |
| 11 | First-showcase rollout rollback | The code has an absence branch that restores previous runtime files and removes `azursystech-showcase`. It must be made distinguishable from the pre-existing-but-stopped case; see item 12. |
| 12 | Subsequent rollback | **Must supplement.** Both `deploy.sh` and `deploy-vps.yml` branch solely on `previous_showcase_running`. A pre-existing stopped showcase container has an image recorded but is treated as the first rollout and forcibly removed. The release contract distinguishes prior showcase *absence* from prior showcase *existence*, so capture an explicit existence state and restore the prior image/runtime state deliberately. |
| 13 | `/`, `/fr`, `/health` regression | Source order leaves these at the app catch-all and public `/health` is not captured by a demo location. Actual request routing is not tested. |
| 14 | Admin regression | The admin profile and workflow inputs remain optional/default false. The rollback code preserves the pre-existing admin branch, subject to the same unexecuted-runtime limitation. |
| 15 | PostgreSQL isolation | Pass by source inspection: Showcase has no `DATABASE_URL`, `depends_on: postgres`, PostgreSQL volume, or database command. No DB action occurred. |
| 16 | Verification-plan adequacy | **Must supplement.** The current Python test is useful as a lint-level contract, but its substring checks do not cover bare `/demo`, Nginx URI/header semantics, real `next/image` output, static-export compatibility, or executable rollback state transitions. |

### Skill Routing Review

The Stage-0 routing remains appropriate: deployment operations, webapp testing,
git safety, and the crash-test gate were matched for later stages, while no live
deployment operation was authorized. This Work Block remains subagent-required
under `AGENTS.md` because it spans application config, Docker, reverse proxy,
Compose, CI, deploy, and more than four files. One writer plus independent
review/verification is the right topology.

### Risk Gaps

- The default `next/image` optimizer path is a production black-hole: it reaches
  the main app's `/_next/image` handler, which does not own showcase public
  assets. This affects existing showcase `<Image>` use even though generated
  static chunks correctly use `/demo-assets`.
- A stopped pre-existing showcase is observably different from no showcase, but
  the rollback record conflates them. It can remove a pre-existing service under
  the contract's subsequent-rollout case.
- `SHOWCASE_STATIC_EXPORT=1` is retained and asserted by the new test, but the
  new route handler has not been demonstrated export-compatible. Treat that mode
  as unverified, not retained compatibility.
- Static source assertions cannot prove Nginx request handling or container
  startup. No claim of those checks passing is supportable from the available
  evidence.

### Decision Quality

The selected architecture and source boundary are sound. The two substantive
defects arise where intended behavior depends on precise framework/proxy state
rather than a configuration substring: an exact Nginx URI match, and the image
loader's independent `images.path`. The rollback design correctly adds two
high-level branches, but its implementation needs a third recorded fact
(`exists`) so a stopped prior service is not mislabeled as absent.

### Recommendations

#### Must Address (blocking quality)

- Add and test an exact `/demo` Nginx location with the same URI-preserving
  upstream/forwarding-header behavior as `/demo/`; prove `/demo`, nested
  `/demo/...`, and `/demo-assets/...` reach showcase while `/`, `/fr`, and
  `/health` reach app.
- Make production `next/image` requests reach showcase through the
  `/demo-assets` namespace, and test a real rendered/requested local
  `/demo/...` image. Do not rely on `assetPrefix` alone for the optimizer path.
- Record `previous_showcase_exists` separately from running state in both
  rollback implementations. Use absence only for the first-showcase branch;
  restore the captured prior showcase image/runtime state for every subsequent
  rollout, including a previously stopped container.
- Prove or explicitly retire the claimed static-export compatibility. If it is
  retained, run the static-export build with the new health route and add a
  deterministic check for the supported health representation.

#### Should Address (improves robustness)

- Extend `scripts/test-showcase-multizone.py` beyond substring presence: assert
  an exact `/demo` location, all proxy headers, the explicit image path, and
  state fixtures for absent/running/stopped prior showcase cases.
- Run the planned production showcase typecheck/build and a standalone image
  start/health check after the corrections. Report unavailable Docker/runtime
  evidence as unverified.

#### Might Consider (optional refinement)

- Add an inexpensive Nginx fixture/parser test that verifies the proxy target
  and unmodified upstream URI without requiring VPS credentials.

### Inspection Gaps

- No production Next build or static-export build was run by this Critic; no
  `.next/standalone` artifact was available for direct packaging inspection.
- Docker, Compose, Nginx, GHCR, workflow-dispatch, VPS, and public endpoint
  behavior were intentionally not invoked under this review's authority.
- The report does not replace the required independent Reviewer and Verifier
  stages after corrections.
