# Tasklist

> Active tasks with acceptance criteria. SSOT priority #1.

Use the following annotation on a formal Work Block task:

```text
TASK-001 [type=requirement|enabling|assurance|documentation]
  [req=REQ-001,REQ-002] [ac=AC-001] [paths=path/a,path/b]
```

Use `-` only where a relationship is intentionally not applicable. Quick Fix and
eligible NDR use proportional records rather than artificial identifiers.

## In Progress

| ID | Task | AC | Owner | Status |
|---|---|---|---|---|

## Ready

| ID | Task | AC | Priority | Blocked By |
|---|---|---|---|---|

## Completed

| ID | Task | Verdict | Date |
|---|---|---|---|

## Blocked

| ID | Task | Verification Verdict | Blocker / Missing Evidence | Corrective Action |
|---|---|---|---|---|

Only tasks with verification verdict `READY` may move to Completed.
`BLOCKED` and `UNVERIFIED` remain in Blocked after reporting-only closeout.
