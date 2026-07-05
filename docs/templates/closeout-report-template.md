# Closeout Report Template

## Closeout Report — [Work Block ID]

- **Date:** [YYYY-MM-DD]
- **Stage Execution State:** [completed]
- **Verification Verdict:** [READY | BLOCKED | UNVERIFIED]
- **Closeout Classification:** [SUCCESS | REPORTING_ONLY]
- **Task Status:** [completed | blocked]

### Result
[Actual result compared with the expected final result.]

### Evidence
- [checks, reports, logs, artifacts]

### Engineering Memory
- **Classification:** [promoted | operational-only | not-applicable]
- **Entries Updated:** [docs/engineering-memory/* | none]
- **Reason:** [why reusable knowledge was or was not promoted]

### Residual Risk
- [none | unresolved risk]

### Corrective Action or Unresolved Dependency
- [not applicable for READY | required for BLOCKED/UNVERIFIED]

### Next Action
- [promotion/merge only for READY | corrective Work Block/rerun]

`SUCCESS` and task status `completed` require verdict `READY`.
`BLOCKED` or `UNVERIFIED` requires `REPORTING_ONLY`, keeps the task blocked,
and prohibits promotion, merge, deploy, release-ready, or success claims.
