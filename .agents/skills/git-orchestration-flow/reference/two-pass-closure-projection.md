# Two-Pass Work Block Closure Reference

Step-by-step guidance for executing two-pass Work Block closure evidence projections.

## Lifecycle Projection Overview

Finalizing a Work Block requires updating normative lifecycle files:
- `docs/plans/<wb-id>.md`: `status: completed`, `## Final State` section added
- `docs/tasklist/<wb-id>.md`: All tasks marked `[x]`
- `PROJECT_MAP.md`: `active_work_block: null`, WB added to `completed_work_blocks`
- `FILE_REGISTRY.yml`: `active_work_block: null`, `latest_completed_work_block` updated

Because these changes alter the repository SHA-256 aggregate, independent assurance agents must assess both the active candidate and the terminal projection.

## Execution Steps

```
Step 1: Compute candidate aggregate on active working tree
Step 2: Run preliminary independent Reviewer, Verifier, and Drift Analyst
Step 3: Mirror working tree to /tmp/<wb-id>-final-projection/
Step 4: Edit projection files to reflect terminal completed state
Step 5: Compute terminal projection aggregate
Step 6: Run final preflight Reviewer, Verifier, and Drift Analyst against /tmp projection
Step 7: Apply byte-equivalent projection changes to working tree
Step 8: Write evidence-only closeout report in docs/reports/closeout/
Step 9: Run deterministic verification suite
Step 10: Commit and proceed to Owner-authorized VCS handoff
```
