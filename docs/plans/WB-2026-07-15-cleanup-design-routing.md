# WB-2026-07-15-cleanup-design-routing

**Live tasklist:** `docs/tasklist/WB-2026-07-15-worktree-cleanup.tasklist.md`

## Stage 0

- **Mode / class / DB / tier:** staged approval / local-docs and workflow
  control / none / standard.
- **State:** verification `READY`: Critic supplements and the template-only
  formal-verifier remediation are closed. Staging, commit, push, and deletion
  remain separately unauthorized.
- **Baseline:** residual pre-existing pilot files only; distinguish them from
  clean paths listed in the historic plan.

## Objective and exact write-set

Publish the residual Design Analyst routing pilot as one coherent control/docs
unit.

- `.agent/skills/design-direction/SKILL.md`
- `.claude/agents/design-analyst.md`
- `.opencode/agents/design-analyst.md`
- `docs/templates/design-brief-template.md`
- `docs/plans/WB-2026-07-10-design-agent-routing-pilot.md`

### Future activation and lifecycle evidence write-set

- `.agent/critic-gate.md`
- `.agent/verification-gate.md`
- `.codex/write-gate.md`
- `docs/tasklist/WB-2026-07-15-worktree-cleanup.tasklist.md`
- `docs/plans/WB-2026-07-15-cleanup-design-routing.md`
- `docs/reports/WB-2026-07-15-cleanup-design-routing-critic.md`
- `docs/reports/WB-2026-07-15-cleanup-design-routing-verification.md`
- `memory_bank/orchestrator-log.md`
- `memory_bank/review-log.md`

## Boundaries and acceptance

- **Out:** hooks, web files, `.agents/**`, staging/commit/push, deletion,
  config, DB, deploy, credentials, and client actions.
- **Acceptance:** fresh Critic approves this residual write-set; both agent
  definitions and `design-direction` agree on responsibilities; the template
  supports the declared brief flow.
- **Critic supplement:** both runtime agent definitions must explicitly require
  the canonical `design-direction` skill and
  `docs/templates/design-brief-template.md`; this prevents a divergent Brief
  handoff between Claude and OpenCode.
- **Checks:** `git diff --check`, ROSTER consistency review,
  `bash scripts/bootstrap.sh --check`, and secret scan before a separately
  approved commit.
- **Isolation supplement:** native same-session Verifier is advisory-only under
  the repository gate. Its `UNVERIFIED` result requires a frozen-diff,
  independent-readonly-root run before formal `READY`.
- **Formal verifier blocker:** the independent root found only one contract
  mismatch in `docs/templates/design-brief-template.md`: its motion/source-tool
  selector and dials must match the canonical skill. The existing Scoped Coder
  corrected that single path; the frozen correction awaits fresh Critic review
  and formal readonly verification.
- **Formal closeout:** the repeat independent readonly root returned
  `FORMAL_VERDICT: READY` after Critic approval of the template remediation.
- **Hard Stops:** commit/push deferred.

## Routing and recovery

- **Topology:** Subagent-Required: native Critic and one Scoped Coder only for
  approved corrections; independent review if policy sensitivity is identified.
- **Skill Routing Gate:** relevance filter — always relevant: `git-safety` and
  current Work Block/gate templates; relevant here: `design-direction` for the
  Design Analyst/Brief contract and `memory-ops` for stage logging and SSOT
  sync; not relevant: application, security, deploy, DB, and runtime skills.
- **Skills:** checked=git-safety,memory-ops,design-direction,gate-templates;
  matched=memory-ops,design-direction; used=design-direction routing contract,
  memory-ops log mode; skipped=git-safety no commit,gate-templates no matching
  project SKILL.md.
- **Recovery:** retain locally and report blocked; do not fold into another
  cleanup commit.
