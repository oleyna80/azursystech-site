---
artifact_type: work_block
work_block_id: WB-2026-09-11-control-plane-recovery-hardening-027
revision: recovery-successor-r1
status: completed
process_feedback_required: true
---

# Plan — control-plane recovery hardening

## Recovery binding

- Existing Work Block: `WB-2026-09-11-control-plane-recovery-hardening-027`
- Successor root: `/tmp/azursystech-wb-control-plane-recovery-hardening-027-r1`
- Successor branch: `feat/control-plane-recovery-hardening-027-r1`
- Recovery baseline: `7c19720422d317ac36286691d540a966e3620fc0`
- Reason: the predecessor worktree disappeared while it contained an
  uncommitted fail-closed recovery implementation.
- WIP evidence: unreachable commit `ac039cd9fc00ad269c4fd0f48060161de24c80a2`,
  archived locally only; it is reference evidence, not a candidate commit.

## Execution sequence

1. Complete native capability and Define/traceability preflight.
2. Obtain a fresh read-only native Critic assessment before source writes.
3. Resolve Critic obligations: exact canonical key-set comparison, intentional
   hook-launch-error regressions in both harnesses, explicit routing evidence,
   and exact standard verification commands.
4. Reconstruct the approved four-file implementation from baseline and WIP
   evidence.
5. Run focused fixture/recovery tests and relevant control-plane suites.
6. Freeze the candidate, obtain separate native Reviewer acceptance, rerun any
   affected checks, freeze again, and obtain separate native Verifier READY.
7. Run Drift, Process Feedback, and Closeout; create the authorized local
   commit only after all required gates are READY.

## Verification tier and exact commands

Standard tier is required. Execute from the exact successor root, record exit
codes and material output, and do not call a fixture passed unless its hook
launch path was exercised:

```text
bash .claude/hooks/tests/gate-fixtures.sh
bash .codex/hooks/tests/gate-fixtures.sh
python3 scripts/test-active-work-block-recovery.py
python3 scripts/test-github-capability-control-plane.py
python3 scripts/validate-release-state.py --help
python3 scripts/validate-process-feedback.py --help
```

The release-state and Process Feedback commands are retained as current
contract entry points; if their repository-specific invocation differs, record
the exact accepted command and reason rather than claiming a pass from `--help`.

## Routing decisions

`requirements-quality-review`, `spec-consistency-analysis`,
`systematic-debugging`, `git-safety`, and `subagent-mission-brief` are Define/
Execute routing contracts for this Work Block. `security-pass` is a required
Stage-2 read-only review concern. No project-local skill file was available for
these names; routing follows `.agent/ROSTER.md` and governance contracts.

## Write-set

Source:

```text
.claude/hooks/tests/gate-fixtures.sh
.codex/hooks/tests/gate-fixtures.sh
.codex/scripts/recover-active-work-block.py
scripts/test-active-work-block-recovery.py
```

Coordination/evidence uses only `.agent/active-work-block.json`, gate files,
`.codex/write-gate.md`, and the declared `docs/{specs,plans,tasklist,reports}`
paths. No topology source change is permitted.

## Risks and controls

- Fixture false positives are controlled by preserving hook exit status and
  classifying launch diagnostics as ERROR.
- Recovery authority is controlled by no-argument invocation, script-owned Git
  root identity, required markers, full canonical template comparison, active
  state refusal, and durable atomic replacement.
- Earlier WIP coordination files and predecessor contents are not copied.
- No Process Feedback observation is promoted unless this Work Block produces
  separate evidence beyond PF-2026-09-09-subagent-topology-root-inheritance
  and PF-2026-09-10-subagent-topology-validator-recovery-deadlock.

## Final State

- **Stage State:** completed
- **Review Gate:** READY
- **Verification Verdict:** READY
- **Evaluation Verdict:** SKIPPED — Standard-tier deterministic control-plane change has no generative evaluation deliverable
- **Drift Gate:** ALIGNED
- **Closeout Mode:** success-closeout
- **Task Status:** completed
- **External VCS State:** non-normative; no publication or integration action authorized
