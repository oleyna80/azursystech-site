---
name: deploy-operations
description: Safe procedures for production deployments, Hard Stop verification, secret scanning, GitHub Actions Docker build & VPS SSH release triggers, health checks, and runtime HTTP smoke verification. Use when preparing, authorizing, triggering, or verifying live production deployments.
---

# Deploy Operations & Release Verification

Procedural guide for managing production deployments, Hard Stop authorization, GitHub Actions workflow triggers, VPS SSH container rollouts, and post-deploy runtime verification.

---

## 1. Pre-Deploy Gate Checks

Before requesting deploy authorization or triggering build workflows, verify all prerequisite gates:

1. **Working Tree & Commit Status**:
   - Repository MUST be on `main` branch.
   - `git status` MUST be clean (no unstaged/untracked production changes).
   - Head commit MUST have passed local unit/type checks (`npm run check:types`, `npm run test:ci`).

2. **Secret Scan Verification**:
   - Execute tracked secret scanning:
     ```bash
     bash scripts/secret-scan.sh tracked
     ```
   - Must return 0 matches for hardcoded tokens, private keys, or credentials.

3. **Verifier Gate Verdict**:
   - Gated Work Block or deploy task must record `Status: READY` in `.agent/verification-gate.md` or closeout report.

---

## 2. Hard Stop & Owner Approval Protocol

Production deployment carries irreversible side effects and falls under **AGENTS.md § Hard Stops**.

### Approval Channel
- Control Tower must obtain explicit Owner approval in chat.
- Record the Owner approval in `memory_bank/orchestrator-log.md`:
  ```markdown
  | YYYY-MM-DD | push-approval | push: APPROVED origin main - <reason> | Owner |
  ```

---

## 3. Deployment Workflow Execution

Deployment relies on two GitHub Actions workflows:

### Step 3.1: Docker Image Build & GHCR Publish
1. Resolve full commit SHA of `main`:
   ```bash
   COMMIT_SHA="$(git rev-parse HEAD)"
   ```
2. Trigger `docker-publish.yml` with full SHA parameter to bypass unauthenticated ls-remote checks:
   ```bash
   gh workflow run docker-publish.yml -f ref="${COMMIT_SHA}"
   ```
3. Monitor build progress:
   ```bash
   gh run watch "$(gh run list --workflow=docker-publish.yml --limit=1 --json databaseId -q '.[0].databaseId')"
   ```

### Step 3.2: VPS Deployment
Once `docker-publish.yml` completes successfully:
1. Trigger VPS deployment over SSH with immutable image tag:
   ```bash
   gh workflow run deploy-vps.yml -f image_tag="sha-${COMMIT_SHA}"
   ```
2. Monitor deployment run:
   ```bash
   gh run watch "$(gh run list --workflow=deploy-vps.yml --limit=1 --json databaseId -q '.[0].databaseId')"
   ```

---

## 4. Post-Deploy Runtime Proof Matrix

Verify live application health after deployment using direct HTTP inspection:

| Surface | Verification Command | Expected Result |
|---|---|---|
| Apex Web | `curl -fsSI https://azursystech.fr` | `HTTP 200 OK` |
| Web Subroutes | `curl -fsSI https://azursystech.fr/portfolio` | `HTTP 200 OK` |
| Admin App | `curl -fsSI https://admin.azursystech.fr` | `HTTP 200` or `302` |
| Health Check | `curl -fsSI https://azursystech.fr/api/health` | `HTTP 200` |

### Log Scan Safety
Scan live container logs for secret leakage:
- Ensure no tokens, connection strings, or request bodies appear in container stdout.
- Verify container health status: `docker inspect --format '{{.State.Health.Status}}' <container>`.
