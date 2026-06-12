---
name: vps-ghcr-credential-rotation
description: Rotate or verify AzurSysTech GHCR deploy credentials for VPS pull-only access. Use when changing Docker login, replacing broad tokens, validating read:packages access, or handling GHCR auth failures on the VPS.
user-invocable: true
allowed-tools:
  - Read
  - Bash
---

# Skill: VPS GHCR Credential Rotation

## Objective
Keep VPS production pull access to GHCR working with the least privileged token.

Canonical split:
- WSL build/push: classic GitHub PAT with `write:packages`.
- VPS pull/deploy: classic GitHub PAT with `read:packages` only.

## Preconditions
- Explicit Owner approval is required before credential changes.
- The Owner creates or provides the token manually; do not generate or request secret values in chat.
- Do not print tokens, Docker auth files, `.env`, or full credential configs.
- Use `docs/deployment/ghcr-credentials-runbook.md` as the public runbook.

## Workflow
1. Read current state:
   - `git status --short --branch`
   - `docs/deployment/ghcr-credentials-runbook.md`
   - `scripts/vps-ghcr-login.sh`
2. Confirm target credential:
   - token type: GitHub PAT classic;
   - VPS scope: `read:packages` only;
   - finite expiration preferred.
3. Install or rotate:
   - run `./scripts/vps-ghcr-login.sh` from WSL;
   - token must be entered via hidden prompt or stdin, not as argv.
4. Verify without exposing secrets:
   - VPS `docker manifest inspect <current app image> >/dev/null`;
   - `docker compose -f docker-compose.vps.yml ps`;
   - `curl -fsSI https://azursystech.fr/health`.
5. Closeout:
   - update `07_ops/task-board.md` only if the status changed;
   - commit/push only with explicit approval;
   - if keeping an old broad token as fallback, report it as an accepted temporary risk.

## Stop Conditions
- Token has `repo`, `write:packages`, `delete:packages`, or unrelated scopes for VPS use.
- Verification fails after login.
- Need to print or inspect raw Docker auth contents.
- Need to revoke credentials; Owner must approve that separately.

## Output
- Credential action: installed / rotated / verified only.
- Evidence: manifest access, compose health, public health.
- Files changed or `no files changed`.
- Residual risks, especially old broad token fallback or unencrypted Docker credential storage.

## Handoff
- **Success condition**: manifest access OK, compose healthy, public health 200.
- **Next**: Control Tower
- **Auto-proceed**: 🔴 NEVER — ротация credentials требует Owner approval.
- **Hard stop**: 🔴 YES.
