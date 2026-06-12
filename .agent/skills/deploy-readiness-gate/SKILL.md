---
name: deploy-readiness-gate
description: Aggregated pre-deploy checklist for AzurSysTech VPS deploys. Runs compose preflight, git checks, build checks, and rollback capture before deploy.sh is allowed.
---

# Skill: Deploy Readiness Gate

## Triggers
- "deploy readiness"
- "pre-deploy check"
- "prepare deploy"
- Before ANY `deploy.sh` execution
- After Owner approves a deploy Hard Stop

## Objective
Single gate that must pass before `deploy.sh` runs. Aggregates all pre-deploy checks
so no check is skipped and no ad-hoc fix commit happens on the VPS.

## When to Use
- **ALWAYS** before running `deploy.sh` on VPS.
- When Owner approves a deploy (C.2b-3, C.2b-4c, or any future deploy gate).

## When to Skip
- Dry-run or local-only work with no deploy intent.
- Docs/tasklist changes only.

## Workflow

### Phase 1: Code Readiness

1. **Git clean check:**
   ```bash
   git status --short --branch
   git diff --check
   ```
   - Worktree must be clean (no unstaged changes to tracked production files).
   - Local workflow docs (`.agent/`, `memory_bank/`, `docs/tasklist/`) may be dirty — that's fine.
   - `git diff --check` must pass (no whitespace errors).

2. **Build checks (Tier Standard or Full):**
   ```bash
   cd web && npm run check:types
   cd web && npm run lint
   cd web && npm run build
   ```
   - All three must exit 0.
   - If `npm run build` fails, stop — do NOT proceed to deploy.

3. **Commit selection:**
   - Record exact commit SHA: `git rev-parse HEAD`.
   - Confirm it matches the intended deploy candidate.
   - If the commit changed since Owner approval, re-confirm.

### Phase 2: Image Readiness

4. **Immutable tag check:**
   - Image tag must NOT be `latest`.
   - Tag format: `ghcr.io/oleyna80/azursystech-app:sha-<shortsha>-<timestamp>`.
   - Verify image exists in GHCR: `docker manifest inspect <tag>`.

5. **Rollback capture:**
   - Record current VPS image: `ssh ... grep '^APP_IMAGE=' .env`.
   - Save previous image tag for rollback reference.

### Phase 3: Compose & Env Readiness

6. **Run `compose-preflight` skill:**
   - MUST pass before proceeding.
   - If it fails, fix the issue and re-run from Phase 1.

7. **Env var parity check:**
   - For each new env var in `.env.vps.example` diff, confirm:
     - It's documented in `.env.vps.example` with a safe default or placeholder.
     - The VPS `.env` has the var (name only — never grep values).
   ```bash
   ssh ... "grep -E '^VAR_NAME=' .env || echo MISSING: VAR_NAME"
   ```

### Phase 4: Hard Stop Confirmation

8. **Verify Owner approval:**
   - Deploy is a Hard Stop. Confirm explicit Owner approval was given.
   - Record: who approved, when, for which commit.

9. **Confirm safety flags:**
   - `TELEGRAM_LIVE_SENDS_ENABLED=false` — must stay `false` unless this deploy explicitly enables sends (separate Hard Stop).
   - `TELEGRAM_WEBHOOK_RECEIVE_ENABLED` — must be explicitly set (even if `false`).

### Verdict

- `READY` — all phases pass. Proceed to `deploy.sh`.
- `READY_WITH_CONCERNS` — non-blocking issues found. Document and proceed with caution.
- `BLOCKED` — blocking issue. Fix and re-run gate.

## Constraints
- Never print env values, only names.
- Never include `DATABASE_URL`, tokens, or secrets in output.
- Do not run `deploy.sh` if this gate returns `BLOCKED`.
- This skill is a gate, not a deploy — it stops before `docker compose up`.

## Output
Report:
- Commit SHA
- Image tag
- Build check results (3/3)
- Compose preflight verdict
- Env parity: present / missing
- Rollback image saved
- Hard Stop approval recorded
- Gate verdict: `READY` / `READY_WITH_CONCERNS` / `BLOCKED`

## Handoff
- **Success condition**: `READY` verdict, all checks passed, Owner approval confirmed.
- **Next**: `vps-registry-pull-deploy` or direct `deploy.sh`.
- **Auto-proceed**: 🟢 YES inside approved Work Block.
- **Hard stop**: 🔴 Deploy itself remains a Hard Stop — this gate only confirms readiness, it does NOT authorize deploy.
