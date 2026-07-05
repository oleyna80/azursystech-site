# Consolidation Report Template

> Fill in after all parallel subagents complete in a Work Block.
> Merges findings, resolves conflicts, and produces a single Control Tower decision.

---

## Consolidation Report — [Work Block ID]

**Date:** [YYYY-MM-DD HH:MM]
**Boundary:** Stage 2 → Stage 3
**Snapshot ref:** `memory_bank/snapshots/snapshot-[wb-id]-[stage]-[date].md`
**Agents completed:** N of N
**Conflict status:** NONE / RESOLVED / ESCALATED

### Subagent Results

| Agent | Verdict | Completed | Key Findings | Report |
|---|---|---|---|---|
| verifier | READY / BLOCKED / UNVERIFIED | HH:MM | — | `docs/reports/verifier-wb-XXX.md` |
| reviewer | ISSUES / CLEAN | HH:MM | 3 findings | `docs/reports/reviewer-wb-XXX.md` |

### Merged Findings

Deduplicated list after aggregation. Same file:line from different agents → one entry with all discoverers.

| # | Severity | File:Line | Finding | Found By | Action |
|---|---|---|---|---|---|
| 1 | HIGH | `src/api/route.ts:42` | Missing CSRF guard | reviewer, verifier | Fix in wb-XXX-followup |

### Conflicts

Different verdicts on the same artifact.

| File | Agent A | Verdict A | Agent B | Verdict B | Resolution |
|---|---|---|---|---|---|
| `src/lib/validation.ts` | reviewer | ISSUES: type mismatch | verifier | PASS: types OK | **Resolved:** reviewer read stale version — verifier's snapshot is newer. Verdict: PASS. |

**Conflict resolution rules applied:**
- READY vs ISSUES → ISSUES wins (conservative)
- ISSUES vs BLOCKED → BLOCKED wins
- Two different ISSUES on same file → both included in merged findings
- Unresolvable conflict → escalated to Control Tower

### Accepted Risks

Findings Control Tower consciously accepts without action.

| Finding | Risk | Rationale |
|---|---|---|

### Incomplete / Failed Agents

| Agent | Status | Reason | Action |
|---|---|---|---|
| security-audit | TIMEOUT | MCP server unavailable | Re-run in follow-up wb-XXX |

### Follow-ups

What is not closed in this Work Block — moves to backlog.

| ID | Description | Source | Priority |
|---|---|---|---|
| wb-XXX-f1 | Fix CSRF guard in `src/api/route.ts:42` | reviewer | P0 |
| wb-XXX-f2 | Re-run security audit | consolidation | P1 |

### Control Tower Decision

**Decision:** SUCCESS_CLOSEOUT / REPORTING_ONLY / RERUN [agent]

**Rationale:**
[Why this decision — 1-2 sentences]

### Post-Consolidation Actions

- [ ] `orchestrator-log.md` updated with consolidation outcome
- [ ] `review-log.md` updated with all subagent results
- [ ] Follow-up Work Blocks created in tasklist
- [ ] Stage transition: [next stage]

`SUCCESS_CLOSEOUT` requires authoritative verification verdict `READY`.
`BLOCKED` or `UNVERIFIED` requires `REPORTING_ONLY`; the task remains blocked.
