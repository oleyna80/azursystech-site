## Reviewer Report

**Stage:** STAGE 1 — IMPLEMENTATION & LOCAL VERIFICATION
**Objective:** Independent read-only re-review of the frozen multizone implementation against the approved Work Block and its exact write-set.
**Role:** Reviewer
**Expected result:** Assess corrected routing, standalone/image namespace, immutable release binding, rollback states, and test quality without asserting unavailable runtime proof.

**Verdict:** **CHANGES_REQUIRED**

**Files reviewed:**

- `showcase/next.config.ts`
- `showcase/app/demo/health/route.ts`
- `Dockerfile.showcase`
- `docker-compose.vps.yml`
- `nginx.proxy.conf`
- `deploy.sh`
- `.github/workflows/docker-publish.yml`
- `.github/workflows/deploy-vps.yml`
- `.github/workflows/ci.yml`
- `scripts/test-showcase-multizone.py`
- active Work Block, approved plan/tasklist, and implementation Critic report for contract context

**Findings:** 3 total

### By severity

- 🔴 HIGH: 2 — rollback does not restore a pre-existing stopped Showcase; a pre-existing stopped Admin is conflated with absent Admin.
- 🟡 MEDIUM: 1 — the rollback test models desired state independently instead of testing the implementation’s state transitions.
- ⚪ LOW: 0

### Details

| Severity | File:Line | Finding | Evidence | Recommendation |
|---|---|---|---|---|
| 🔴 HIGH | `deploy.sh:268-283` | Direct deploy rollback cannot complete when the prior Showcase existed but was stopped. | The rollback starts Showcase when `previous_showcase_exists=true` (lines 268-270), then deliberately stops it when `previous_showcase_running=false` (lines 275-277). It still calls `wait_for_health` with `rollback_showcase=1` (line 283), which executes `docker exec azursystech-showcase ... /demo/health` at lines 121-124. That health probe must fail for the intentionally restored stopped state, causing exit 2. | Make the final health requirement depend on `previous_showcase_running`, or probe it before stopping and then verify the intended stopped state. Add a fixture that drives this exact branch. |
| 🔴 HIGH | `.github/workflows/deploy-vps.yml:367-374,141-152,192-223` | Workflow rollback does not restore an existing-but-stopped Admin’s previous image/state independently. | Snapshot records an Admin image and running flag only when a container exists, but has no `previous-admin-exists` state (367-374). Cleanup validates and passes the prior Admin image only if it was *running* (141-152, 192-195). For the existing/stopped case it invokes the runner with `DEPLOY_ADMIN=0` and only stops whichever Admin container now exists (212-223), leaving a newly deployed Admin image rather than restoring the prior stopped runtime. | Record Admin existence separately, require and pass its prior image whenever it existed, recreate it, then stop it if it was previously stopped; remove a newly introduced Admin only when it was previously absent. Exercise all absent/running/stopped Admin states independently of Showcase. |
| 🟡 MEDIUM | `scripts/test-showcase-multizone.py:31-39,98-114` | The deterministic test does not bind its rollback assertions to the shell/workflow implementation. | `rollback_plan` is a separate Python boolean model. The suite passes although the actual stopped-Showcase health contradiction above is present, and it contains no assertion for Admin existence/image restoration. | Test shell command ordering/arguments or extract the state transition logic into an executable, fixture-driven unit; include absent, running, and stopped Showcase/Admin fixtures. |

### Corrected items confirmed by source inspection

- `nginx.proxy.conf:40-47,90-118` now confines Showcase routing to public hosts, preserves the admin upstream, includes exact `/demo`, and uses URI-preserving `proxy_pass` for `/demo`, `/demo/`, and `/demo-assets/`.
- `showcase/next.config.ts:6-16` has standalone output, no `basePath`, a `/demo-assets` asset prefix, an explicit namespaced `next/image` optimizer path, and an explicit rationale for retiring static export because a route handler is required.
- `.github/workflows/docker-publish.yml:45-55` peels annotated tags with `^{commit}` and checks the checked-out source equals the resolved full commit; both app and Showcase use the same immutable tag at lines 93-108.
- `docker-compose.vps.yml:89-114` keeps Showcase PostgreSQL-free; `web` waits for Showcase health at lines 156-184. The external PostgreSQL volume definition remains unchanged at lines 190-193.

### Checks run

- `git diff --check 257d529d4a81147b6f7dea29bd17f52228ea17d6 --` — PASS.
- `bash -n deploy.sh` — PASS.
- `python3 scripts/test-showcase-multizone.py` — PASS, but the test-quality finding above applies.
- Changed-path containment against the active source and coordination write-sets — PASS by inspection; no out-of-scope changed path observed.

### Inspection gaps

- No Showcase standalone build, Docker image build/start, Compose execution, Nginx container routing, rendered `next/image` request, browser route request, or rollback execution was performed by this Reviewer. These are **UNVERIFIED**, not passed.
- No GHCR publication, workflow dispatch, VPS/SSH, production endpoint, database, secret, or remote Git operation was attempted.

**Files changed:** `docs/reports/review-WB-2026-08-12-showcase-production-multizone-r2.md` only (review evidence permitted by the assigned scope).
**Risks:** The two rollback defects violate critical restoration invariants if the corresponding stopped prior runtime state occurs.
**Next action:** Scoped Coder resolves the two high findings and strengthens the targeted rollback fixture; then freeze the revised diff for another Reviewer/Verifier pass.
