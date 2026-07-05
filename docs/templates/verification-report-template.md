# Verification Report Template

## Verification Report — [Work Block ID]

- **Date:** [YYYY-MM-DD]
- **Tier:** [lite | standard | full]
- **Sensitive Domains:** [none | auth,payments,db-schema,middleware]
- **Authoritative Verdict:** [READY | BLOCKED | UNVERIFIED]
- **GPT Verifier:** [NOT_REQUIRED | READY | DEGRADED]

### Changed Files
- `[path]` — [change]

### Checks
| Check | Result | Evidence |
|---|---|---|
| [check] | [PASS | FAIL | BLOCKED | UNVERIFIED] | [command/file:line] |

### Blockers or Missing Evidence
- [none | concrete blocker, attempted check, missing dependency, and risk]

### Required Next Action
- [success-closeout | corrective action | resolve dependency and rerun]

Only `READY` permits successful closeout. `BLOCKED` and `UNVERIFIED` require
reporting-only Stage 3 and keep the task blocked.
