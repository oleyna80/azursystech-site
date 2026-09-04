---
artifact_type: work_block
work_block_id: WB-2026-09-03-lifecycle-inactive-commit-bypass-correction
status: completed
revision: v1
---

# Work Block Plan: Inactive Commit Bypass Correction

## Authority and Result

The Owner directed this narrow correction after an exact-head review found a
P1 inactive commit bypass and a P2 stale Critic Gate record. The expected result
is a new locally verified branch revision that closes the bypass. Publication,
merge, and deployment remain separate Owner-controlled actions.

## Final State

- **Stage state:** completed
- **Review gate:** READY
- **Verification verdict:** READY
- **Drift gate:** ALIGNED
- **Closeout mode:** success-closeout
- **Task status:** completed

The bypass correction passed review, verification, drift, and deterministic
control-plane regression checks. The Work Block was closed with
`success-closeout`; `.agent/active-work-block.json` is canonical inactive and
the release-state projections contain no active Work Block.

## Write Set and Ownership

One Coder owns only:

- `.agent/active-work-block.json`
- `.agent/critic-gate.md`
- `.agent/verification-gate.md`
- `FILE_REGISTRY.yml`
- `PROJECT_MAP.md`
- `.claude/hooks/work_block_gate.py`
- `.codex/hooks/pre_tool_use_policy.py`
- `scripts/test-github-capability-control-plane.py`
- `scripts/test-release-state-contracts.py`
- `docs/specs/WB-2026-09-03-lifecycle-inactive-commit-bypass-correction.md`
- `docs/plans/WB-2026-09-03-lifecycle-inactive-commit-bypass-correction.md`
- `docs/tasklist/WB-2026-09-03-lifecycle-inactive-commit-bypass-correction.tasklist.md`
- `docs/reports/**`

## Execution Plan

1. Bind this correction to the current feature branch and exact reviewed head;
   complete requirements, consistency, and Critic gates before source edits.
2. Parse direct Git invocation arguments in both adapters, including supported
   global-option prefixes and direct shell execution wrappers, and make inactive state fail closed for all-tracked,
   include, only, explicit pathspec, and pathspec-file content selectors without
   changing the allowed coordination-only staged commit path.
3. Add adapter-symmetric deterministic regressions for short and long
   all-tracked, include, only, pathspec, pathspec-file, and Git-global-prefix
   forms plus unknown-global and shell-wrapper prefixes; retain the allowed control and add stale-active-binding commit coverage.
4. Run the required contract, release-state, traceability, and whitespace
   checks; complete independent read-only Review and Verification, then Drift.
5. Commit the verified correction locally, close to canonical inactive state,
   synchronize closeout artifacts, freeze the new SHA, and wait for the Owner
   to publish it. Do not merge or deploy from this Work Block.

## Risks

- Overbroad argument denial could prevent a valid staged coordination commit;
  the allowed control is a required regression.
- Incomplete option coverage could leave a different working-tree selection
  path open; tests explicitly cover the identified forms and the parser must
  fail closed for uninspectable content selectors while inactive.
- CI, review, and protected-branch merge state remain external evidence and do
  not change local assurance requirements.
