# Consistency analysis — WB-2026-08-25-worktree-ssot-binding

## Status

`READY`

## Cross-artifact consistency

The specification, plan, and task list agree on the same binding model: durable branch identity plus runtime worktree/Git diagnostics, with no persisted absolute worktree path.

The implementation scope is consistent with the observed failure mode:

- stale canonical gate selected because hook resolution begins from `event.cwd`;
- command-local directory changes cannot safely replace session identity;
- current hooks validate write-set state but do not verify that gate `subject_branch` equals the actual branch;
- current lifecycle helper does not populate `subject_branch` even though live Work Block state already uses it.

The repair exception for `.agent/active-work-block.json` is preserved consistently across requirements and plan so a stale gate cannot make itself impossible to repair.

## Conflict checks

- No conflict with Owner-controlled GitHub publication boundaries.
- No conflict with existing external hard stops.
- No application or production behavior is changed.
- No schema-version bump is required by the proposed contract because `subject_branch` is already present in current schema-v3 active state.

## Residual design risk

The two runtime hooks duplicate policy logic today. This Work Block intentionally keeps the fix mirrored rather than introducing a new shared Python package; tests must therefore enforce behavioral parity.
