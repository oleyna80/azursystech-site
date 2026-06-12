---
name: compose-preflight
description: "Use this skill to check a Docker Compose config before deploy — validate YAML syntax, confirm all required env vars are present, and catch missing variables or broken references that would cause the deploy to fail. Run it after editing docker-compose.vps.yml or .env.vps.example, or as a preflight check before any VPS deploy. Triggers on: проверка docker-compose на ошибки, сравнение env vars, проверка конфига перед деплоем, compose config validation, env var audit, compose syntax check, pre-deploy compose verification."
user-invocable: true
allowed-tools:
  - Read
  - Bash
---

# Skill: Compose Preflight

## Triggers
- "validate compose before deploy"
- "check compose config"
- "compose preflight"
- Before any `deploy.sh` or `vps-registry-pull-deploy` execution
- After any `docker-compose.vps.yml` or `.env.vps.example` change

## Objective
Catch `docker compose config` failures locally with the same variable state the VPS
would see, so deploy doesn't fail on a missing `:?` interpolation.

## When to Use
- **ALWAYS** before running `deploy.sh` or any VPS deploy action.
- After editing `docker-compose.vps.yml` or `.env.vps.example`.
- After adding new required env vars to compose services.

## When to Skip
- Docs-only or tasklist-only changes with no compose/env diff.
- Dry-run or local-only work that doesn't touch deploy artifacts.

## Workflow

1. **Check what changed:**
   ```bash
   git diff --stat -- docker-compose.vps.yml .env.vps.example
   ```
   If no diff, skip to step 3 (validate current state anyway).

2. **Build a synthetic .env for validation:**
   - Read `.env.vps.example` — it defines all known vars with placeholder/empty defaults.
   - Construct a minimal validation env that satisfies every `:?` required variable.
   - Required vars that need non-empty placeholders for `config` to pass:
     - `POSTGRES_PASSWORD`, `POSTGRES_DB`, `POSTGRES_USER`
     - `DEEPSEEK_API_KEY`
     - `APP_IMAGE` (use any valid immutable tag for syntax check)
   - Profile-gated vars (admin) must also be set if they use `:?` syntax.

3. **Run compose config:**
   ```bash
   # Create temp env file with all required vars
   cat > /tmp/azursystech-preflight.env << 'PREFLIGHT'
   POSTGRES_DB=preflight_check
   POSTGRES_USER=preflight_check
   POSTGRES_PASSWORD=preflight_check
   DEEPSEEK_API_KEY=preflight_check
   APP_IMAGE=ghcr.io/oleyna80/azursystech-app:preflight-check
   DATABASE_URL=postgresql://preflight:check@postgres:5432/preflight
   ADMIN_SESSION_SECRET=preflight_check
   ADMIN_PASSWORD_HASH=preflight_check
   PREFLIGHT

   docker compose -f docker-compose.vps.yml --env-file /tmp/azursystech-preflight.env config > /dev/null
   rm -f /tmp/azursystech-preflight.env
   ```

4. **Check VPS env parity:**
   - For each `:?` variable in compose, confirm the VPS `.env` has a value (via SSH grep).
   - For each new `${VAR:-default}` added to compose, confirm it's documented in `.env.vps.example`.

5. **Verdict:**
   - `PASS` — `docker compose config` exits 0, all required vars accounted for.
   - `FAIL` — config render fails, or a required var is missing from VPS `.env`.

## Constraints
- Never print or log real secret values from VPS `.env`.
- Use synthetic placeholder values for local validation only.
- This skill does NOT connect to VPS for validation unless explicitly combined with a read-only SSH grep of var names (never values).

## Output
- Compose config exit code.
- List of vars validated (names only, not values).
- Missing or failed vars.
- Verdict: `PASS` / `FAIL`.
- If `FAIL` — blocking: do not proceed to deploy until fixed.

## Handoff
- **Success condition**: `docker compose config` passes with synthetic env; all VPS-required vars confirmed present.
- **Next**: `deploy-readiness-gate` or direct deploy if Owner-approved.
- **Auto-proceed**: 🟢 YES — no side effects, local-only validation.
- **Hard stop**: 🔴 NEVER — this skill is read-only validation.
