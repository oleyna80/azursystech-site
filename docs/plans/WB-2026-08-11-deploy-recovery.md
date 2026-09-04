# WB-2026-08-11 — Production deploy recovery and publish-default hardening

## Objective

Validate and execute the post-hotfix production rollout for commit
`c129fad3d79f30f62edf164a83ef243521b8ad00`, then align the Docker Publish
manual-dispatch default with the documented web-only release path.

## Baseline and confirmed cause

- Baseline application commit: `c129fad3d79f30f62edf164a83ef243521b8ad00`.
- The prior failed deploy stopped in `appleboy/ssh-action@v1.2.0` before the
  VPS script ran; its generated shell rejected `script_stop: true`.
- The baseline replaces that action with `v1.2.5` and removes `script_stop`.
- CI passed for the baseline; no Docker Publish or Deploy workflow has tested
  that hotfix in production.
- Failed Deploy run: `31219268116` at source commit
  `81564af9ba2d43b27292016958a5827ce3f13fcd`; sanitized job evidence records
  `appleboy/ssh-action@v1.2.0`, `INPUT_SCRIPT_STOP:true`, and
  `bash: -c: line 126: syntax error near unexpected token ';'` before any VPS
  command executed.
- Baseline CI run: `31253715112`, successful at `c129fad3d79f30f62edf164a83ef243521b8ad00`.

## Approved scope

1. From a clean disposable release root, verify that remote `main` resolves to
   the baseline, then run Docker Publish with input `ref` equal to that full SHA
   and `publish_admin=false`. Execution evidence must capture the exact command
   and resulting workflow `headSha`:
   `gh workflow run docker-publish.yml --ref main -f ref=<FULL_SHA> -f publish_admin=false`.
2. Run Deploy to VPS using workflow ref `main` only after proving it still
   resolves to the same baseline, with
   `image_tag=sha-c129fad3d79f30f62edf164a83ef243521b8ad00` and
   `include_admin=false`. The exact dispatch is
   `gh workflow run deploy-vps.yml --ref main -f image_tag=sha-<FULL_SHA> -f include_admin=false`;
   the resulting workflow `headSha` must equal the baseline before its SSH step
   can be accepted.
3. Verify the public root and `/health`, deployed image identity, and sanitized
   workflow outcome.
4. Change the manual `publish_admin` default in
   `.github/workflows/docker-publish.yml` from `true` to `false` and reconcile
   the three existing deploy-operation skill mirrors by preserving all current
   dirty hunks, adding an explicit matching deploy workflow ref and
   `include_admin=false`, correcting rollback semantics, and removing the
   unverified direct rollback-runner command.

## Out of scope

- Admin image build or admin deploy.
- Database migrations, live data mutation, credentials, secrets, or env edits.
- Application code changes, commit/push other than the separately authorized
  authorization-record commit, rollback execution, and destructive operations.
- Replacing or discarding pre-existing dirty documentation changes.
- Claiming that `deploy.sh` restores workflow-owned runtime/config backups, or
  documenting direct rollback-runner execution without a separately approved
  and tested recovery Work Block.

## Stage 0 preflight

- Work Block type: production deployment recovery plus workflow-contract
  hardening.
- Side-effect class: live infra (Docker Publish and VPS Deploy); local
  workflow/documentation writes.
- DB action mode: none.
- Hard Stops: live infra approved in Owner chat; no admin, migrations, commit
  beyond the authorization record, or push.
- Skills Routing: checked=`git-safety`, `deploy-operations`,
  `systematic-debugging`; matched all three; used all three; design, frontend,
  backend, DB, security, and client-communication skills skipped as not
  relevant after inspection.
- Subagent topology: Subagent-Required (deploy/runtime and four-plus files).
  One read-only Reviewer reviews the frozen scope; one read-only Verifier
  verifies the frozen diff and rollout evidence. No write-capable subagent.
- Threat model: required for live-infra workflow changes. Trust boundaries are
  GitHub Actions, GHCR, SSH transport, and VPS runtime; mitigations are
  immutable full-SHA image tags, fixed deploy root, web-only flags, workflow
  approval, and health checks.
- Write gate: BLOCKED pending a committed Owner-signed authorization record and
  detached signature. It must bind this plan, exact write-set, critic evidence,
  expiry, and the external Owner trust anchor.
- Release-root rule: the dirty primary checkout is not used as release
  evidence. Publish/deploy commands run only after a clean disposable root at
  the immutable baseline passes tracked secret scan and readiness checks.
- Rollback rule: the deploy workflow requires `image_tag=sha-${github.sha}`.
  Any rollback therefore needs a workflow branch/tag ref resolving to the same
  prior commit; this Work Block documents that constraint but does not execute
  rollback or create/push a ref.

## Required authorization write-set

- `.github/workflows/docker-publish.yml`
- `.agent/skills/deploy-operations/SKILL.md`
- `.claude/skills/deploy-operations/SKILL.md`
- `.opencode/skills/deploy-operations/SKILL.md`
- `.agent/active-work-block.json`
- `.agent/critic-gate.md`
- `.agent/verification-gate.md`
- `docs/plans/WB-2026-08-11-deploy-recovery.md`
- `docs/tasklist/WB-2026-08-11-deploy-recovery.tasklist.md`
- `docs/reports/critic-WB-2026-08-11-deploy-recovery.md`
- `docs/reports/WB-2026-08-11-deploy-recovery-verification.md`
- `docs/plans/WB-2026-08-11-deploy-recovery.authorization-draft.json`

The signed record itself must be created by the Owner outside this blocked
source gate at `.agent/authorizations/WB-2026-08-11-deploy-recovery.json`, with
its sibling `.sig`, then committed as the separately authorized governance-only
commit.

## Acceptance criteria

- Docker Publish succeeds for the baseline and publishes the immutable full-SHA
  web image without the admin image.
- Deploy succeeds with exactly that full-SHA image and no admin path.
- Root and `/health` provide successful live responses; logs contain no secret
  output.
- The workflow default is web-only (`publish_admin: false`) and the three
  skill mirrors accurately explain that default.
- Independent verification records the runtime proof or an explicit blocked
  condition; no commit or push follows the hardening edit in this Work Block.
- Existing dirty skill hunks remain byte-for-byte present except for the exact
  reviewed amendments above; `git diff --check` is clean after reconciliation.
