---
artifact_type: specification
work_block_id: WB-035
revision: v2
status: approved
---

# WB-035 — Governance Recovery & State Separation

## Reason and architecture

The WB-034 control-plane smoke branch exposed two legacy governance defects.
A valid active Work Block with unfinished assurance could not use reporting-only
closeout because lifecycle validation rejected PENDING assurance before checking
closeout mode. Release-state validation also required an ordinary operational
Work Block to equal the migration Work Block projection. WB-035 v1 corrected
both and passed tests, but attempted publication exposed missing or inconsistent
local assurance transitions.

Revision v2 completes the Codex engineering loop: implementation, tests,
content-sha256 candidate freeze, separate-context Reviewer, corrective rework
and new freeze when needed, separate-context Verifier, local commit, and exact
non-force subject-branch push. GitHub/Owner architecture and conformance review
starts with the remote diff; merge and deployment are separate Owner decisions.
External GitHub architecture review is not a prerequisite for subject-branch
push. Controller v1 remains inert.

Source-write permission and candidate-publication permission are independent.
Freeze sets source `write_gate` to BLOCKED. Publication may admit the unchanged
frozen candidate when its separate evidence and destination predicates pass.
The legacy content-sha256 identity covers the declared source `write_set`;
repository assurance reports are coordination evidence bound to that identity,
not inputs to their own hash.

## Approved scope and exclusions

Implementation may change `.codex/scripts/lifecycle.py`,
`scripts/validate-release-state.py`, `.agent/hooks/hard_stop_policy.py`, and
focused tests for those components. Documentation may change this
specification, `governance/release-state.md`, `governance/authority.md`,
`.agent/workflows/sdd-protocol.md`,
`.agent/workflows/owner-controlled-github-flow.md`, WB-035 reports under
`docs/reports/`, and
`docs/engineering-memory/process-feedback-registry.yml`. Session-local
`.agent/active-work-block.json` may record operational coordination but must
not enter the product commit. Other file changes require a new approved scope
revision.

Controller v1, `.codex/hooks/`, `.claude/`, `.githooks/`, Managed Linux,
topology rules, coordination wildcard, candidate identity, and terminal
publication semantics are excluded. Critic admission redesign, worktree/session
binding, content-sha256 to Git tree migration, default/protected-branch push,
force push, merge, release, deployment, and live infrastructure/data changes
remain deferred. Legacy closeout and terminal-child publication are not
prerequisites for this subject-branch push.

## Reporting-only recovery and release state

- Reporting-only closeout accepts a structurally valid active state with
  PENDING, BLOCKED, DEGRADED, or other unfinished assurance. It requires a
  nonempty reason and produces canonical inactive state with
  `closeout_mode: reporting-only` and the reason in `lifecycle_note`.
- Reporting-only does not synthesize READY, SKIPPED, or successful assurance.
  Success-closeout still requires completed mandatory assurance.
- `.agent/active-work-block.json` is operational state. It validates as exact
  canonical inactive state or structurally valid active state, including
  specification path/ID consistency and applicable topology checks. An
  ordinary operational Work Block need not equal
  `FILE_REGISTRY.yml:migration_state.active_work_block`.
- `FILE_REGISTRY.yml:migration_state`, its `PROJECT_MAP.md` projection,
  migration Work Block artifacts, and completed/active migration invariants
  remain independently fail-closed.

## Assurance and publication transitions

- Every freeze creates a new candidate assurance boundary, sets source writes
  BLOCKED, and resets Reviewer/Verifier state to PENDING. Old READY evidence
  cannot carry to a new freeze.
- `prepare-reviewer` records the current WB, frozen revision, execution ID,
  separate context, and `docs/reports/` path. `finalize-reviewer` accepts READY,
  CHANGES_REQUIRED, or BLOCKED only when its report binds execution and
  candidate. The durable report frontmatter must bind Work Block ID,
  specification path/revision, frozen candidate, verdict, execution ID, and
  context ID. READY preserves the freeze. CHANGES_REQUIRED/BLOCKED reopen
  source work, invalidate the freeze and both assurance records, and require
  rework plus a new freeze before READY can be claimed.
- Verifier starts only after Reviewer READY for the same frozen candidate.
  Ordinary Controlled Work Blocks use a separate-context Verifier transition
  with execution ID, report, and READY/BLOCKED verdict. Managed, Assured, and
  Distributed non-trivial Work Blocks retain stricter native topology checks.
  Verifier BLOCKED reopens source work and requires a new freeze.
- Exact publication is the literal command
  `git push origin HEAD:refs/heads/fix/governance-recovery-035`. It requires
  the exact current non-default subject branch, frozen unchanged source at
  HEAD, complete repository Reviewer and Verifier READY reports bound to the
  same revision, applicable Define requirements, a committed candidate-bound
  Critic disposition report matching READY APPROVE/SUPPLEMENT or reasoned
  SKIPPED, and no
  External Hard Stop. Critic is resolved by READY with APPROVE or SUPPLEMENT,
  or explicit SKIPPED with a nonempty reason. DEGRADED and FALLBACK are not
  autonomously publishable. Force, wrong/default branch, changed source,
  missing candidate, and incomplete or stale evidence fail closed.

## Durable evidence and acceptance

Critic disposition, Reviewer result, Verifier result, test summary, process
defects and resolutions, and deferred work must be reconstructible from
repository artifacts. WB-035 reports under `docs/reports/` identify this
specification revision and exact frozen candidate. Reviewer and Verifier inspect
the final source candidate including this specification, workflow documentation,
process-feedback registry, and report structure. Their final result records
are committed as coordination evidence against that same frozen source
candidate before publication; neither report enters its own content hash.

Required regressions cover reporting-only PENDING recovery and strict
success-closeout; independent operational/migration validation and malformed
state/projection denial; Reviewer/Verifier READY publication and stale,
pending, changed-source, rework, Critic, force/default/wrong-branch denials.
Focused tests and the relevant complete governance suite must pass. The final
branch contains only scoped product and evidence files, a `Work-Block: WB-035`
commit trailer, and the published exact subject branch. READY requires real
separate-context Reviewer and Verifier READY on the same frozen candidate and
remote branch confirmation.
