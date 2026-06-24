# Claude Code Verifier Task: E2/E3 Portability and Ignore Policy

## Mission

Verify the implementation candidate for
`WB-2026-06-24-e2-e3-portability-ignore-policy` against the approved acceptance
criteria.

## Role

Verifier. Read-only. Do not modify repository files, do not stage, do not
commit, do not push, do not deploy, and do not clean the tree.

## Candidate Files

```text
.gitattributes
.gitignore
.codexignore
.agentsignore
.env.vps.example
.codex/write-gate.md
docs/plans/WB-2026-06-24-e2-e3-portability-ignore-policy.md
docs/plans/WB-2026-06-24-e2-e3-portability-ignore-policy-claude-coder-task.md
docs/plans/WB-2026-06-24-e2-e3-portability-ignore-policy-claude-review-task.md
docs/plans/WB-2026-06-24-e2-e3-portability-ignore-policy-claude-verifier-task.md
```

## Required Checks

Run what is available locally and report exact command results:

```bash
git status --short --branch
git diff --check
git diff --name-only -- .gitattributes .gitignore .codexignore .agentsignore .env.vps.example .codex/write-gate.md docs/plans/WB-2026-06-24-e2-e3-portability-ignore-policy.md docs/plans/WB-2026-06-24-e2-e3-portability-ignore-policy-claude-coder-task.md docs/plans/WB-2026-06-24-e2-e3-portability-ignore-policy-claude-review-task.md docs/plans/WB-2026-06-24-e2-e3-portability-ignore-policy-claude-verifier-task.md
git check-ignore -v .env .env.local .codex/config.toml node_modules/ web/.next/
git check-ignore --no-index -v .claude/settings.json
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

If Docker Compose is unavailable or blocked by approval/tooling, report it as
BLOCKED with the exact reason. Do not deploy, push, or contact the VPS.

Run a direct secret scan over candidate files and the candidate diff for:

```text
DATABASE_URL|token|secret|password|api_key|api-key|PRIVATE KEY|BEGIN RSA|BEGIN OPENSSH|BEGIN EC
```

Triage placeholder hits in `.env.vps.example` explicitly.

## Output Format

Start with verdict: `SPEC_OK`, `APPROVED`, or `BLOCKED`.

Then list:

- commands run and result;
- acceptance criteria status;
- secret-scan triage;
- blocked/skipped checks with reason;
- residual risks;
- exact staged status, if any.
