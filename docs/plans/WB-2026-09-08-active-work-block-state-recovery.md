---
artifact_type: work_block
work_block_id: WB-2026-09-08-active-work-block-state-recovery
status: completed
revision: amendment-recovery-v2
---

# Plan — active Work Block state recovery

## Objective and authority

Implement the Owner-requested missing/corrupt recovery correction on the exact
subject branch while retaining terminal publication. The current `main`
residue is observed evidence, not permission to edit `main`; the candidate must
carry recovery, durable lifecycle persistence, and canonical inactive closeout.

## Execution

1. Restore missing/corrupt recovery through the dedicated Git-bound helper.
2. Make the default JSON template the sole producer and add durable atomic
   replacement.
3. Run recovery, control-plane, traceability, release-state, syntax, whitespace, and
   secret-safety checks.
4. Complete read-only Review and Verification, then close and push the exact
   assured subject branch.
5. Add ancestry-bound terminal closeout publication while preserving the
   existing assured-active path and all external hard stops.
6. Validate a final pushed terminal candidate as canonical inactive.

## Write set

See `.agent/active-work-block.json`; one Coder owns only that write-set and its
declared coordination artifacts. No application, dependency, database,
deployment, default-branch, or merge changes are permitted.

## Final State

- **Stage state:** completed
- **Review gate:** READY
- **Verification verdict:** READY
- **Drift gate:** ALIGNED
- **Closeout mode:** success-closeout
- **Task status:** completed

## Risks

The validator must reject residue without rejecting a legitimate inactive
coordination commit. The regression matrix therefore includes both negative
stale-authority fixtures and the canonical inactive positive path. Terminal
publication is not an inactive-state bearer token: only one committed active
parent with READY assurance and a minimal coordination-only child qualifies.
