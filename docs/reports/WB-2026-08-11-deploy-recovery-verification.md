# WB-2026-08-11 deploy recovery — local verification

- Verdict: `READY`
- Sensitive Domains: `deploy, runtime`
- Required Verifier Isolation: `independent-readonly-root`
- Verifier Isolation: `independent-readonly-root`
- Verifier runtime session: `019ff0e3-b204-7011-a7ac-6ef177eba591`
- Captured output: `/run/codex-verifier-output/WB-2026-08-11-deploy-recovery-v3.txt`
- Verifier live proof: none; the verifier performed no workflow dispatch,
  network query, Docker Publish, VPS Deploy, SSH, or runtime smoke.
- Subsequent Control Tower publish evidence: Docker Publish run `31494425319`
  succeeded for exact `headSha=c129fad3d79f30f62edf164a83ef243521b8ad00`;
  the web image digest is
  `sha256:a2c08d9121fab46a1e289d5c7ef723cfc1e8a2b35fb6b1622f6e428a90840168`;
  admin build/publish was skipped.
- Subsequent Control Tower deploy attempt: run `31495804943` had the exact
  approved `headSha` but failed closed during VPS preflight because the
  repository secret `VPS_APP_DIR` did not equal the workflow target
  `/home/dmitrii/apps/azursystech`. The failure occurred before runtime-file
  installation and container mutation. A post-failure request to
  `https://azursystech.fr/health` returned HTTP 200 for the existing runtime.
- After explicit Owner approval, Control Tower corrected repository secret
  `VPS_APP_DIR` to `/home/dmitrii/apps/azursystech` and retried the exact
  immutable artifact. VPS Deploy run `31507130602` concluded `success` with
  exact `headSha=c129fad3d79f30f62edf164a83ef243521b8ad00` and
  `include_admin=false`.
- Advisory read-only runtime verifier verdict: `BLOCKED` only for sanitized
  container-log proof. Workflow/run identity, exact deployed tag, healthy
  `app`/`postgres`/`web`, absence of admin, and public HTTP checks passed.

## Findings

- `publish_admin` defaults to `false` in
  `.github/workflows/docker-publish.yml`.
- The three deploy-operation mirrors are byte-identical at SHA-256
  `36ffba95dc2058bfdf6fd0e271ae76f61a7598130313dc1fd71cd99b14479399`.
- The mirrors require separate exact-target Owner approval, explicit workflow
  refs, full-SHA tags, `publish_admin=false`, `include_admin=false`, unambiguous
  run capture, `headSha` equality, `--exit-status`, and fail-closed ambiguity.
- Rollback ownership matches the implementation: the workflow owns runtime and
  configuration restoration; root `deploy.sh` owns container/image rollback;
  `.deploy/rollback-runner.sh` is a workflow-generated VPS runtime artifact and
  the guide prohibits direct execution.
- SSOT drift found by the first verifier attempt was reconciled in the active
  tasklist before the successful rerun.

## Checks

- `git diff --check`: PASS.
- Three-way byte comparison and SHA-256 mirror comparison: PASS.
- `bash -n deploy.sh`: PASS.
- `bash -n scripts/secret-scan.sh`: PASS.
- `bash scripts/secret-scan.sh tracked`: PASS.
- Static workflow and rollback provenance inspection: PASS.
- `actionlint`: unavailable; workflow YAML received static inspection only.

## Residual gate

This `READY` verdict covers the frozen local remediation diff only. Docker
Publish and VPS Deploy subsequently succeeded and established the immutable
artifact and deployed full-SHA image identity. Public runtime checks passed:
the apex redirected to `/fr` and returned HTTP 200, `/health` returned HTTP 200
with `{"status":"ok"}`, and `/fr` returned HTTP 200. The workflow does not
capture container stdout, and the approved verification boundary excluded SSH;
therefore sanitized container-log proof remains `BLOCKED/UNVERIFIED` and the
live-runtime gate must not be represented as formal `READY`.

## Authorized SSH log-verification attempt

The Owner subsequently granted a one-time, read-only SSH authority limited to
`docker ps` and bounded container-log reads on `178.156.212.10` for
`/home/dmitrii/apps/azursystech`. The local SSH configuration selected user
`dmitrii`, but two `docker ps` attempts failed at public-key authentication
before any remote command executed. No container logs, Compose configuration,
environment values, database state, or files were accessed; no raw evidence
was persisted. The sanitized container-log verdict therefore remains
`BLOCKED/UNVERIFIED` pending an Owner-provisioned workflow-equivalent
read-only SSH credential. This access failure does not contradict the
successful deployment, healthy container evidence in run `31507130602`, or the
public HTTP checks.

## Successful authorized container-log verification

After the Owner restored SSH access, a strictly read-only `docker ps` confirmed
the exact app image
`ghcr.io/oleyna80/azursystech-site-app:sha-c129fad3d79f30f62edf164a83ef243521b8ad00`
and healthy `azursystech-app`, `azursystech-web`, and
`azursystech-postgres`. PostgreSQL had been up for four days, consistent with
its preservation during the deployment. No AzurSysTech admin container was
present.

Only bounded log scans were performed: the last 200 lines of each of those
three containers were evaluated remotely against deployment-related fatal/error
patterns. Sanitized evidence only: `app=0`, `web=0`, `postgres=0`. Raw logs,
configuration, environment values, database data, and request contents were
not displayed or persisted. Sanitized container-log verdict: `PASS`.

Operational conclusion: `AZURSYSTECH PRODUCTION DEPLOYMENT VERIFIED` for run
`31507130602` and immutable image digest
`sha256:a2c08d9121fab46a1e289d5c7ef723cfc1e8a2b35fb6b1622f6e428a90840168`.
The live proof was collected by the Control Tower under Owner-granted SSH
authority, so it is operational runtime evidence and does not alter the
separately recorded formal verifier-isolation level.
