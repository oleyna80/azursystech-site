# Plan — WB-2026-09-05-automatiser-guide-closeout

- **Work Block:** `WB-2026-09-05-automatiser-guide-closeout`
- **Baseline:** `2deb2f149ef96c4790550eae9a8a0574b156e1c4`
- **Subject branch:** `feat/automatiser-demandes-clients-guide`
- **Mode:** lifecycle-only reconciliation and closeout

## Bounded write set

```text
.agent/active-work-block.json
.agent/critic-gate.md
.agent/verification-gate.md
.codex/write-gate.md
docs/specs/WB-2026-09-05-automatiser-guide-closeout.md
docs/plans/WB-2026-09-05-automatiser-guide-closeout.md
docs/tasklist/WB-2026-09-05-automatiser-guide-closeout.tasklist.md
docs/reports/*WB-2026-09-05-automatiser-guide-closeout*
```

## Execution

1. Verify branch/PR/WB evidence and implementation presence in `origin/main`.
2. Record review, verification, and drift evidence.
3. Mark all closeout tasks complete and reconcile publication wording.
4. Close through `scripts/lifecycle.py`; validate inactive release state.

## Hard stops

Stop on any need to modify application code, dependencies, config/secrets,
database, deployment, production, or to delete/merge/publish repository refs.
