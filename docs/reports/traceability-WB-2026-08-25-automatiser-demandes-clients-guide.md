# Traceability Report — WB-2026-08-25-automatiser-demandes-clients-guide

## Inputs

- Specification: `docs/specs/WB-2026-08-25-automatiser-demandes-clients-guide.md` (v1)
- Tasklist: `docs/tasklist/WB-2026-08-25-automatiser-demandes-clients-guide.tasklist.md`
- Validator: `python3 scripts/validate-define-traceability.py --spec docs/specs/WB-2026-08-25-automatiser-demandes-clients-guide.md --tasks docs/tasklist/WB-2026-08-25-automatiser-demandes-clients-guide.tasklist.md --json`

## Requirement-to-task map

| Requirement | Implementation task | Assurance task |
|---|---|---|
| REQ-001..REQ-007 | TASK-010 | TASK-020, TASK-021, TASK-022 |
| REQ-008 | TASK-011 | TASK-020, TASK-021, TASK-022 |
| REQ-009 | TASK-012 | TASK-020, TASK-021, TASK-022 |
| REQ-010..REQ-011 | TASK-013 | TASK-020, TASK-021, TASK-022 |

## Structural result

`READY`

The deterministic validator returned:

```json
{
  "verdict": "READY",
  "requirements": 11,
  "acceptance_criteria": 12,
  "tasks_count": 11,
  "errors": []
}
```

Every requirement and acceptance criterion is covered by a `type=requirement` implementation task. Task paths use validator-safe `*` locale notation; the active Work Block write-set resolves those entries to the existing `[locale]` route segment.
