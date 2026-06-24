# AZR-OPS VPS Registry Deploy Follow-ups

Status: proposed  
Created: 2026-05-08  
Owner: AzurSysTech  
Scope: deployment operations, GHCR credentials, VPS runtime cleanup  

## Background

Production deploy moved from a git-backed VPS checkout and server-side build to
the registry-pull model:

1. Build and push an immutable Docker image from WSL.
2. Store the image in GHCR.
3. Pull and restart the runtime stack on the VPS with Docker Compose.

The current runtime directory is `/home/dmitrii/apps/azursystech`.

The old git-backed runtime directory
`/home/dmitrii/projects/azursystech-site` is intentionally retained until
rollback confidence is higher.

The VPS now has a dedicated GHCR pull credential with `read:packages` only.
The previous broad token is intentionally kept for a short fallback window.

## Goals

- Prove rollback works with immutable image tags.
- Confirm the next regular deploy works end-to-end with the registry-pull path.
- Remove unnecessary fallback credentials and old runtime artifacts after proof.
- Reduce secret-handling risk without adding operational complexity too early.

## Non-goals

- No production code changes.
- No database schema changes.
- No change to the current public GitHub portfolio/source repository model.
- No CI/CD automation requirement.
- No build workload on the VPS.

## Follow-up Work Items

### OPS-001: Rollback smoke test

Objective: prove the rollback path before deleting the old runtime checkout or
revoking fallback credentials.

Steps:

1. Record current `APP_IMAGE` from `/home/dmitrii/apps/azursystech/.env`.
2. Record previous image from `.deploy/previous-app-image`.
3. Run rollback to the previous immutable image.
4. Verify:
   - `docker compose -f docker-compose.vps.yml ps`
   - `azursystech-app` healthy
   - `azursystech-web` healthy
   - `https://azursystech.fr/health` returns `200`
   - `https://www.azursystech.fr/health` returns `200`
5. Deploy the current image again.
6. Repeat the same health checks.

Acceptance criteria:

- Rollback image boots and passes health checks.
- Current image redeploys and passes health checks.
- No PostgreSQL container or production volume is recreated.
- Evidence is recorded in the session closeout.

Stop conditions:

- Health check fails.
- Compose wants to recreate `postgres`.
- `COMPOSE_PROJECT_NAME` is missing or not `azursystech-site`.
- The previous image is unavailable from GHCR or local Docker cache.

### OPS-002: Next full registry-pull deploy cycle

Objective: prove the normal happy path with the new architecture.

Steps:

1. Run local pre-release checks from WSL.
2. Build and push a new immutable GHCR image from WSL.
3. Deploy on the VPS through `/home/dmitrii/apps/azursystech/deploy.sh`.
4. Verify compose state, app image tag, internal health, and public health.
5. Update task-board or deployment notes if runtime facts changed.

Acceptance criteria:

- New image tag is immutable and includes commit SHA.
- VPS performs only image pull/restart, not build.
- Production health checks pass.
- `HEAD` / `origin/main` state is known before and after deploy.

### OPS-003: Broad token revocation

Objective: remove the temporary broad fallback token after rollback and one
normal deploy cycle are proven.

Prerequisites:

- OPS-001 passed.
- OPS-002 passed.
- Dedicated VPS `read:packages` credential still verifies GHCR manifest access.

Steps:

1. Confirm with the Owner that the broad token is no longer needed.
2. Revoke the old broad token in GitHub.
3. Verify VPS manifest access still works.
4. Verify public health still returns `200`.
5. Update `07_ops/task-board.md` if any status line still references the old
   fallback.

Acceptance criteria:

- Broad token is revoked.
- VPS pull access still works with the dedicated read-only credential.
- No secret values are printed or committed.

### OPS-004: Docker credential storage hardening

Objective: decide whether the unencrypted Docker credential warning is accepted
or should be fixed with a credential helper.

Options:

- Accept current Docker config storage as a documented short-term risk.
- Configure a credential helper on WSL, VPS, or both.
- Keep token lifetime short and rely on rotation instead of helper setup.

Acceptance criteria:

- Decision is documented.
- If helper setup is chosen, deploy and GHCR manifest checks still pass.
- No token values are printed in logs or reports.

### OPS-005: Old runtime checkout cleanup

Objective: remove the old git-backed runtime directory only after the new path
is proven.

Prerequisites:

- OPS-001 passed.
- OPS-002 passed.
- No rollback dependency remains on `/home/dmitrii/projects/azursystech-site`.

Steps:

1. Snapshot the old directory listing and any non-secret operational files.
2. Confirm no active Docker Compose command uses the old path.
3. Confirm production stack runs from `/home/dmitrii/apps/azursystech`.
4. Ask Owner for explicit deletion approval.
5. Remove or archive the old directory.

Acceptance criteria:

- Production remains healthy.
- No secrets are copied into the repository.
- Cleanup action is documented in session closeout.

## Verification Matrix

For every work item:

- `git status --short --branch`
- no secret values printed
- no `.env` committed
- public health check: `https://azursystech.fr/health`

For deploy or rollback:

- `docker compose -f docker-compose.vps.yml ps`
- app image equals the intended immutable GHCR tag
- `azursystech-postgres` remains the existing healthy container
- no `docker compose build` on the VPS

## Required Skills

Use local project skills:

- `.agent/skills/vps-registry-pull-deploy/SKILL.md`
- `.agent/skills/vps-ghcr-credential-rotation/SKILL.md`
- `.agent/skills/vps-deploy-recovery/SKILL.md` only if deploy state breaks
- `.agent/skills/scoped-commit-guard/SKILL.md` for any tracked closeout commit

## References

- `docs/deployment/github-vps.md`
- `docs/deployment/ghcr-credentials-runbook.md`
- `scripts/build-push-image.sh`
- `scripts/vps-ghcr-login.sh`
- `deploy.sh`
