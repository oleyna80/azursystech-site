# WB-2026-07-15-cleanup-verifier-isolation

**Live tasklist:** `docs/tasklist/WB-2026-07-15-worktree-cleanup.tasklist.md`

## Stage 0

- **Mode / class / DB / tier:** staged approval / workflow-script-control,
  security-sensitive / none / full.
- **State:** Stage 0.5 completed with Critic `SUPPLEMENT` adopted; Write Gate
  READY for the exact declared scope, Verification READY. Required and actual
  verifier isolation is `independent-readonly-root`.
- **Baseline:** the listed diffs are pre-existing; all other dirty paths remain
  unstaged and untouched.

## Objective and write-sets

Publish frozen pre-existing hook hardening only after fresh review proves the
Claude and Codex isolation attestations fail closed. This is not a reimplementation
of the historic isolation-tier work.

- `.claude/hooks/verification-gate.sh`
- `.claude/hooks/tests/gate-fixtures.sh`
- `.codex/hooks/verification-gate.sh`
- `.codex/hooks/tests/gate-fixtures.sh`
- `docs/plans/WB-2026-07-13-verifier-isolation-tiers.md`
- `docs/reports/WB-2026-07-13-verifier-isolation-tiers-critic.md`
- `docs/reports/WB-2026-07-13-verifier-isolation-tiers-verification.md`

### Future activation and lifecycle evidence write-set

- `.agent/critic-gate.md`
- `.agent/verification-gate.md`
- `.codex/write-gate.md`
- `docs/tasklist/WB-2026-07-15-worktree-cleanup.tasklist.md`
- `docs/plans/WB-2026-07-15-cleanup-verifier-isolation.md`
- `docs/reports/WB-2026-07-15-cleanup-verifier-isolation-critic.md`
- `docs/reports/WB-2026-07-15-cleanup-verifier-isolation-verification.md`
- `memory_bank/orchestrator-log.md`
- `memory_bank/review-log.md`

### Critic report requirement

The fresh Critic Report must repeat the complete current 16-path approved
write-set verbatim, one path per line: the seven frozen payload/evidence paths
above and the nine activation/lifecycle paths below. It cannot approve only the
publication payload.

## STRIDE-lite classification

| Element | Classification |
|---|---|
| Trust boundary | payload, gate, and verification-report fields crossing into deterministic hooks |
| Attacker-controlled inputs | payload values and proposed write-set paths |
| Privileged actions | authorization of edits and issuance of a `READY` verdict |
| Persistence | gate files, reports, and operational logs |
| Mitigations | literal exact write-set matching, closed isolation vocabulary/rank, required independent verifier, and no Owner-waiver bypass |

## Boundaries and acceptance

- **Out:** private `/home/...` files, app sources, `.agents/**`, active gate
  files until routed, staging/commit/push, delete, deploy, DB, credentials.
- **Acceptance:** a fresh Critic Report names this WB and repeats all sixteen
  approved paths verbatim, one per line;
  `bash -n`, both fixture suites, `git diff --check`, and isolation-block
  parity review pass; after freeze, the Control Tower records a formal
  independent-readonly-root verdict.
- **Checks:** `scripts/agent-runtime-doctor.sh`, then the canonical independent
  verifier runner. `scripts/secret-scan.sh staged` only after staging is
  separately approved.
- **Hard Stops:** commit/push deferred; no deletion authorized.

## Routing and recovery

- **Topology:** Subagent-Required: native read-only Critic; exactly one Scoped
  Coder only if correction is approved; independent verifier after freeze.
- **Skills:** checked=git-safety,security-pass,gate-templates;
  matched=security-pass,gate-templates; used=security-pass triage,AGENTS.md,
  SDD; skipped=git-safety no commit.
- **Recovery:** leave the diff unstaged and open a correction WB; never discard
  it without explicit Owner approval.

## Formal verifier prompt

Review the frozen diff for this Work Block read-only. Confirm that the Claude
and Codex verification-gate hooks enforce a closed isolation-level vocabulary,
rank actual isolation against the required isolation, and fail closed for
sensitive domains and missing/invalid evidence. Inspect fixture parity and the
critic report's exact 16-path write-set.

Control Tower has already executed the checks which cannot run inside this
readonly root: `scripts/agent-runtime-doctor.sh` returned `PASS|summary|ready`
from the Owner-provisioned verifier runtime, and the advisory Verifier recorded
`bash -n`, both 59/0 fixture suites, `scripts/secret-scan.sh tracked`, and
`git diff --check` as PASS. Treat those as launch evidence; do not rerun the
doctor or fixture suites inside this sandbox, and do not launch nested agents
or CLIs. You may run only read-only source/diff checks. Do not edit, stage,
commit, push, delete, deploy, or access secrets. End the response with exactly
one of `FORMAL_VERDICT: READY` or `FORMAL_VERDICT: BLOCKED`, followed by concise
evidence.

## Verification closeout

- Advisory read-only Verifier: `bash -n`, both fixture suites (59 passed,
  0 failed each), `scripts/secret-scan.sh tracked`, and `git diff --check`
  passed. The staged secret scan is not applicable because nothing is staged.
- Control Tower runtime preflight: `scripts/agent-runtime-doctor.sh` returned
  `PASS|summary|ready` outside the workspace sandbox.
- Formal independent root: separate readonly Codex root with
  `approval=never`, `--sandbox read-only`, and ephemeral session returned
  `FORMAL_VERDICT: READY` after frozen-diff source and evidence review.
- Runtime HTTP proof and `npm audit` are not applicable: this Work Block
  changes only local control hooks and introduces no web/API/dependency scope.
- Commit, push, staging, deletion, deployment, credential, and `.agents/**`
  curation actions remain out of scope and unauthorized.
