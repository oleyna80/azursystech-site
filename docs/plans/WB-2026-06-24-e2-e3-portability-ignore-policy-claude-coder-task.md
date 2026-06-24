# Claude Code Coder Task: E2/E3 Portability and Ignore Policy

## Mission

Implement the approved WB `WB-2026-06-24-e2-e3-portability-ignore-policy`.
Make the smallest safe patch that lets a clean GitHub/Windows clone receive the
intended SDLC/control files while keeping secrets, private runtime config,
generated output, caches, and machine-local state excluded.

## Role

Coder. You may modify only the approved write-set below. You are not alone in
the codebase: the tree has many pre-existing dirty files, so do not revert or
normalize unrelated paths.

## Approved Write-Set

```text
.gitattributes
.gitignore
.codexignore
.agentsignore
.env.vps.example
docs/plans/WB-2026-06-24-e2-e3-portability-ignore-policy.md
```

Do not edit any other repository file.

## Required Context To Read

```text
AGENTS.md
.codex/write-gate.md
docs/plans/WB-2026-06-24-e2-e3-portability-ignore-policy.md
.gitignore
.codexignore
.agentsignore
.gitattributes
.env.vps.example
docs/reports/disposition-WB-2026-06-20-dirty-tree-disposition.md
docs/reports/inventory-WB-2026-06-20-dirty-tree-disposition.yml
```

Read-only context may also include `docker-compose.vps.yml` and `deploy.sh` for
local preflight understanding, but do not edit them.

## Required Changes

1. Align `.gitignore`, `.codexignore`, and `.agentsignore` so SDLC/control files
   needed after a clean clone are not hidden by ignore policy.
2. Keep real `.env*`, `.codex/config.toml`, `.claude/settings.json`, provider
   keys, local runtime config, caches, generated output, logs, build outputs,
   and machine-local artifacts excluded.
3. Treat `.env.vps.example` as the sole approved `.env*` exception. It must be a
   public placeholder template only. If you find a real secret, private token,
   private endpoint, or non-placeholder credential, stop and report BLOCKED.
4. Keep `.gitattributes` conservative for Linux/WSL/Windows text/EOL behavior.
   Do not trigger broad EOL churn or force-normalize generated/binary outputs.
5. Update the WB execution log / done criteria in the plan file only as needed
   to record the implementation result.

## Hard Stops

- Editing outside the approved write-set.
- Reading or editing real `.env*`, `.codex/config.toml`, private provider
  config, API keys, tokens, or credentials.
- Application source, tests, package/dependency, CI, Docker/proxy/deploy script,
  production config, database/schema, generated-output cleanup, branch switch,
  stash, reset, clean, staging, commit, push, or deploy.
- Any real secret-like value in the candidate.

## Checks To Run

Run what is available locally and report exact outcomes:

```bash
git status --short --branch
git diff --check
git diff --name-only -- .gitattributes .gitignore .codexignore .agentsignore .env.vps.example
git check-ignore -v .env .env.local .codex/config.toml .claude/settings.json node_modules/ web/.next/
git check-ignore -v --non-matching docs/session-bootstrap.md docs/profiles.md PROJECT_MAP.md FILE_REGISTRY.yml .gitattributes .gitignore .codexignore .agentsignore .env.vps.example
bash -n deploy.sh
```

If `scripts/bootstrap.sh` exists, run:

```bash
bash scripts/bootstrap.sh
```

If Docker Compose is available, run local preflight only:

```bash
docker compose -f docker-compose.vps.yml --env-file .env.vps.example config
```

If Docker Compose is unavailable, report BLOCKED for that check with the tool
availability reason. Do not deploy and do not contact the VPS.

Run a direct secret scan over changed files/candidate diff for:

```text
DATABASE_URL|token|secret|password|api_key|api-key|PRIVATE KEY|BEGIN RSA|BEGIN OPENSSH|BEGIN EC
```

Placeholder hits in `.env.vps.example` may be benign only if explicitly triaged.

## Expected Output

Return:

- files changed;
- concise rule-by-rule change summary;
- checks run and results;
- secret-scan triage;
- any blocked/skipped checks with reason;
- residual risks;
- whether the candidate is ready for read-only review.

Do not stage, commit, push, deploy, or clean anything.
