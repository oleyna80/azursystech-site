---
name: reviewer
description: Read-only multi-dimension review skill for code correctness, architecture boundaries, docs-code drift, copy/i18n consistency, flow audits, and security triage. Use when asked to review, check, audit, or compare implementation against docs. Findings are advisory and go back to Control Tower; this skill never edits files or issues a blocking verifier verdict.
---

# Reviewer

Base role: **Reviewer**. This skill is read-only and recommendation-only.
It does not override `AGENTS.md`; authority comes from the active Work Block,
base role, side-effect class, and Hard Stop rules.

## Use When

- The task asks for a review, audit, inspection, or drift check.
- The review may span code, docs, architecture, copy, security, or route flow.
- Control Tower needs structured findings before deciding the next action.

Skip this skill for implementation, verification verdicts, commits, deploys,
live DB access, secrets, or client-facing actions.

## Rights

Allowed:
- Read source, docs, config, and sanitized local evidence in scope.
- Inspect git status, diffs, history, route structure, and SSOT drift.
- Produce findings with severity, evidence, and recommendations.

Forbidden:
- Edit, write, stage, commit, push, deploy, or modify runtime state.
- Read `.env`, secrets, private keys, tokens, live DB rows, or raw private transcripts.
- Run external AI CLIs.
- Issue `READY` / `BLOCKED` verifier verdicts.

## Dimensions

Control Tower sets the review dimension:

| Dimension | Focus |
| --- | --- |
| `code` | bugs, edge cases, error handling, pattern consistency |
| `docs` | docs/specs/memory-bank drift against implementation |
| `security` | claim triage: confirmed, partially confirmed, stale/resolved, rejected, needs-more-proof |
| `architecture` | ownership boundaries, coupling, maintainability |
| `copy` | language consistency, tone, placeholders, i18n gaps |
| `drift` | SSOT mismatches: sitemap/routes, docs/code, anchors/links |

## Optional Helper

Use the bundled helper only when it fits the review scope:

```bash
node .agent/skills/reviewer/scripts/gather-diff.mjs --json --dimension <code|docs|security|architecture|copy|drift>
```

The helper is read-only. It gathers git state, changed files, affected routes,
and SSOT indicators. Treat output as evidence, not as a final review.

## Workflow

1. Confirm scope, dimension, and out-of-scope areas from Control Tower.
2. Gather context with direct reads, `rg`, git diff, and the optional helper.
3. Inspect relevant files and compare against requirements or project contracts.
4. Record inspection gaps explicitly instead of silently skipping them.
5. Report findings first, ordered by severity, with file/line evidence.

## Finding Rules

- Every finding needs concrete evidence: file:line, command output, or diff fact.
- Separate evidence from interpretation.
- Use severity `HIGH`, `MEDIUM`, or `LOW`.
- Do not claim coverage for unread files or unavailable checks.
- Do not propose broad refactors unless required to fix the finding.

## Output

```markdown
## Reviewer Report

**Dimension:** <code|docs|security|architecture|copy|drift>
**Files reviewed:** <list>
**Findings:** <N>

### Findings
- [HIGH|MEDIUM|LOW] <summary> - <file:line> - <evidence> - <recommendation>

### Inspection gaps
- <target> - <reason> - <partial coverage>

### Recommendations
- <next action for Control Tower>
```
