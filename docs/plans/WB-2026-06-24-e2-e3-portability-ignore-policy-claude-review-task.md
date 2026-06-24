# Claude Code Reviewer Task: E2/E3 Portability and Ignore Policy

## Mission

Perform a read-only review of the implementation candidate for
`WB-2026-06-24-e2-e3-portability-ignore-policy`.

## Role

Reviewer. Read-only. Do not modify repository files, do not stage, do not
commit, do not push, do not deploy, and do not clean the tree.

## Review Scope

Review only the candidate files:

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
```

Read-only context may include:

```text
AGENTS.md
docs/reports/disposition-WB-2026-06-20-dirty-tree-disposition.md
docs/reports/inventory-WB-2026-06-20-dirty-tree-disposition.yml
docker-compose.vps.yml
deploy.sh
```

## Findings To Prioritize

- Secrets/private config accidentally exposed.
- `.env.vps.example` not being the sole explicit `.env*` exception.
- Required SDLC/control files still hidden from Git or agent indexing.
- `.codex/config.toml`, `.claude/settings.json`, real `.env*`, caches,
  generated output, or local runtime state no longer excluded.
- `.gitattributes` causing broad line-ending churn or unsafe generated/binary
  handling.
- Out-of-scope file changes or commit-readiness gaps.

## Suggested Read-Only Commands

```bash
git status --short --branch
git diff -- .gitattributes .gitignore .codexignore .agentsignore .env.vps.example .codex/write-gate.md docs/plans/WB-2026-06-24-e2-e3-portability-ignore-policy.md docs/plans/WB-2026-06-24-e2-e3-portability-ignore-policy-claude-coder-task.md docs/plans/WB-2026-06-24-e2-e3-portability-ignore-policy-claude-review-task.md
git check-ignore -v .env .env.local .codex/config.toml node_modules/ web/.next/
git check-ignore --no-index -v .claude/settings.json
git check-ignore -v --non-matching docs/session-bootstrap.md docs/profiles.md PROJECT_MAP.md FILE_REGISTRY.yml .gitattributes .gitignore .codexignore .agentsignore .env.vps.example
```

## Output Format

Start with verdict: `APPROVE`, `SUPPLEMENT`, or `RECONSIDER`.

Then list findings first, ordered by severity, with file/path references. If no
issues, say that clearly and list residual risks/test gaps.
