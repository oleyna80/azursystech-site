# Code Audit Phase 2 External Review Task

## Purpose

Run a read-only external Claude Code audit after Code-audit Phase 1 fixes were
implemented and live DB migration `004` was applied. The goal is to verify the
current state and identify the next highest-value Phase 2 cleanup work without
performing repository changes.

## Required Read Set

1. `AGENTS.md`
2. `.agentsignore`
3. `.codexignore`
4. `memory_bank/context.md`
5. `memory_bank/progress.md`
6. `memory_bank/decisions.md`
7. `docs/reports/code-audit-2026-05-22.md`
8. `docs/tasklist/AZR-010-runtime-wiring-plan.tasklist.md`
9. Current Git history around:
   - `0cce161 fix(intake): enforce persistence and status constraints`
   - `17b63e0 fix(ops): harden sitemap, admin errors, proxy trust, and publish scripts`

## Scope

- Review the current repository tree after Phase 1 fixes.
- Re-check the original audit findings that were supposed to be addressed by
  `0cce161` and `17b63e0`.
- Identify stale, resolved, partially resolved, and still-valid findings.
- Recommend the next Phase 2 work blocks, ranked by risk and value.
- Focus especially on remaining HIGH/MEDIUM findings from the 2026-05-22 audit:
  frontend maintainability, i18n fragmentation, error boundaries, chat route
  decomposition, contact form duplication, DB constraint gaps not covered by
  `004`, ops portability, admin observability, and runtime safety.

## Out of Scope

- No file edits.
- No commit, push, branch rewrite, or staging.
- No deploy, Docker push/pull deploy, VPS restart, or runtime change.
- No env/secret/config changes and no secret reading.
- No live DB connection, migration, row dumps, or manual data changes.
- No Telegram, WhatsApp, Google Sheets, DeepSeek, Meta, or other provider API calls.
- No real client/admin messages.
- No destructive commands.

## Allowed Checks

Read-only/local checks are allowed if the local environment supports them:

```bash
git status --short --branch --untracked-files=all
git log --oneline -8
git diff --check
cd web && npm run check:types
cd web && npm run lint
cd web && npm run build
cd admin && npm run check:ci
```

If a check is skipped, explain why. Do not install dependencies or change
package files.

## Required Output Format

Return one Markdown report with these sections:

1. `Verdict` — Green / Yellow / Red and one paragraph rationale.
2. `Phase 1 Re-check` — table with original finding, current status
   (`resolved`, `partial`, `stale`, `still-valid`), evidence, and risk.
3. `Findings` — ordered by severity. Each finding must include file path,
   line reference when available, impact, confidence, and suggested fix.
4. `Recommended Phase 2 Work Blocks` — small scoped blocks with write-set,
   verification tier, and dependencies.
5. `Checks Run` — commands and pass/fail/skipped result.
6. `Hard Stops / Risks` — anything requiring Owner approval.

Do not include secrets, connection strings, row payloads, client messages, or
private runtime values in the report.

## Short Claude Code Prompt

```text
Read /home/dmitrii/azursystech/docs/plans/code-audit-phase-2-external-review-2026-05-22.md and run the requested read-only audit in /home/dmitrii/azursystech. Do not edit files, do not use live DB/VPS/provider APIs/secrets, and do not commit/push. Return only the Markdown report in the required format.
```
