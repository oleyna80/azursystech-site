# WB-2026-08-11 — Production deploy recovery and publish-default hardening

| Stage | Status | Evidence / next gate |
| --- | --- | --- |
| 0. Preflight and Define | completed | Revised scope, immutable run evidence, clean-release-root rule, rollback constraint, and Owner live-infra approval are recorded in the plan. |
| 0.5. Critic review | completed | First verdict `RECONSIDER`; revised plan re-review verdict `APPROVE`, status `READY`, advisory isolation `same-session-degraded`. |
| 1. Authorization | completed | Owner-signed authorization pair verified against the external trust anchor and committed alone as `441b134d71f781d2d0fcc48d3a8da86875835a9c`; lifecycle write gate is `READY`. |
| 2. Publish and deploy | completed | Docker Publish run `31494425319` succeeded for exact `headSha=c129fad3d79f30f62edf164a83ef243521b8ad00`; web digest `sha256:a2c08d9121fab46a1e289d5c7ef723cfc1e8a2b35fb6b1622f6e428a90840168`; admin skipped. After explicit Owner approval, `VPS_APP_DIR` was corrected to `/home/dmitrii/apps/azursystech`; retry run `31507130602` succeeded for the exact SHA and `include_admin=false`. |
| 3. Hardening | completed | Docker Publish now defaults `publish_admin` to `false`; the three byte-identical skill mirrors were reconciled and Reviewer re-review returned `APPROVE`. |
| 4. Verification | operational runtime verified | Independent local verifier session `019ff0e3-b204-7011-a7ac-6ef177eba591` returned `READY` for the frozen diff. Owner-authorized read-only SSH verification subsequently confirmed healthy app/web/postgres and zero deployment-related fatal/error pattern matches in the bounded recent logs. This is operational proof; it does not upgrade the verifier-isolation classification. |

## Controls

- Side effects: Docker Publish only after local verification; VPS Deploy only
  after a separate explicit Owner approval for the exact published immutable
  artifact. No DB, admin, credentials, migrations, further commit/push, or
  destructive operation.
- Pre-existing dirty paths are untrusted user work and must be preserved:
  the three deploy-operation skill mirrors and
  `WB-2026-08-08-deployment-documentation-audit.tasklist.md`.
- Skills Routing: checked=`git-safety`, `deploy-operations`,
  `systematic-debugging`; matched/used all three; other categories are out of
  scope.
- Subagent topology: Reviewer and Verifier are required and read-only.
- Write gate: READY until `2026-08-11T19:15:00+02:00` for the signed exact
  write-set at base commit `441b134d71f781d2d0fcc48d3a8da86875835a9c`.
- Release evidence must come from a clean disposable root at the immutable
  baseline; the dirty primary checkout is not a release root.
- Independent verifier runtime doctor: PASS on 2026-08-11. Formal local verifier
  run used `independent-readonly-root`; the first result was `BLOCKED` solely on
  stale tasklist state, with implementation/static checks otherwise passing.
- Docker Publish evidence: GitHub Actions run `31494425319`, conclusion
  `success`, exact `headSha=c129fad3d79f30f62edf164a83ef243521b8ad00`,
  image
  `ghcr.io/oleyna80/azursystech-site-app:sha-c129fad3d79f30f62edf164a83ef243521b8ad00`,
  digest
  `sha256:a2c08d9121fab46a1e289d5c7ef723cfc1e8a2b35fb6b1622f6e428a90840168`;
  admin build/publish skipped.
- VPS Deploy evidence: GitHub Actions run `31495804943`, exact
  `headSha=c129fad3d79f30f62edf164a83ef243521b8ad00`, conclusion `failure` in
  VPS preflight. The workflow rejected a `VPS_APP_DIR` secret mismatch before
  installing runtime files or changing containers. Current public
  `https://azursystech.fr/health` remained HTTP 200 after the failed attempt.
- Owner approved correction of repository secret `VPS_APP_DIR` to
  `/home/dmitrii/apps/azursystech` and a retry of the exact immutable artifact.
  VPS Deploy run `31507130602` concluded `success` with exact `headSha`, exact
  full-SHA image tag, and `include_admin=false`. Workflow evidence showed
  `app`, `postgres`, and `web` healthy, no admin container, and no migration.
- Public runtime proof after the successful retry: apex redirected to `/fr` and
  returned HTTP 200; `/health` returned HTTP 200 with `{"status":"ok"}`; `/fr`
  returned HTTP 200. Sanitized Actions-log scanning found no common raw-secret
  forms, but the workflow does not capture container stdout; at that point the
  specific proof was `BLOCKED/UNVERIFIED` pending separately authorized
  read-only SSH/log inspection.
- Owner subsequently authorized that SSH/log inspection for the exact VPS and
  runtime path. Two strictly read-only `docker ps` SSH attempts reached
  authentication but failed with `Permission denied (publickey)` before any
  remote command ran. No raw logs were read or stored; the container-log proof
  remained `BLOCKED` until access was restored as recorded below.
- The Owner then restored the required SSH access. Read-only `docker ps`
  confirmed `azursystech-app` on the exact full-SHA image plus healthy
  `azursystech-web` and `azursystech-postgres`; PostgreSQL uptime was four days,
  consistent with preservation rather than recreation. Bounded scans of the
  latest 200 lines of each AzurSysTech container exposed only sanitized counts:
  `app=0`, `web=0`, `postgres=0` for fatal/error deployment patterns. Raw logs
  were neither displayed nor persisted. Container-log proof: `PASS`.
