# Work Block: A6 Workflow Docs Readiness

## Meta

- **Work Block ID:** WB-2026-06-24-a6-workflow-docs-readiness
- **Parent Work Block:** WB-2026-06-20-dirty-tree-disposition
- **Predecessors:** WB-2026-06-21-a1-selective-commit-readiness; WB-2026-06-21-a5-codex-runtime-decision
- **Date:** 2026-06-24
- **Owner:** azur
- **Stage:** Plan
- **Role:** Orchestrator
- **Execution Mode:** staged approval
- **Side-Effect Class:** local-docs now; public-repo only after separate staging/commit approval
- **DB Action Mode:** none
- **Verification Tier:** T2 / standard
- **Active Profile:** Codex -> Claude Code Handoff with Codex Critic
- **Allowed external runtimes/MCPs:** `mcp-codex` is Owner-authorized only as
  the GPT-subagent bridge inside Claude Code for this WB. No other external AI
  runtime or MCP is authorized.

## Objective

Prepare an auditable selective commit candidate for the A6 workflow documentation
group after A1 and A5 are published, while leaving all unrelated dirty tree
paths unstaged and unchanged.

## Expected Final Result

The remaining A6 workflow docs are reviewed for consistency with the published
A1/A5 runtime layer, any required documentation-only corrections are made within
the approved A6 write-set, Claude Code supplies Coder/Review/Verification
evidence, Codex Critic reviews the plan or final candidate, and the Owner
receives an exact selective staging scope and commit message. No staging,
commit, push, application change, private config read, dependency change, deploy,
or destructive Git action occurs without a later explicit approval.

## Done Criteria

- [x] Current branch confirms A1 and A5 commits are present and pushed.
- [x] The A6 baseline is reconciled against the live tree, including the fact
  that `docs/templates/work-block-template.md` was already committed in A5.
- [x] Every remaining A6 path is either accepted for the candidate, corrected
  within scope, or explicitly removed from the candidate with a reason.
- [x] Claude Code Coder, Reviewer, and Verifier missions complete with bounded
  evidence paths.
- [x] Codex Critic findings are dispositioned.
- [x] Staging remains empty until a separate Owner commit decision.

## Preflight State

- **Git baseline:** branch `feature/showcase-demo-templates` is synchronized
  with `origin/feature/showcase-demo-templates` at `5172ca9`.
- **Pre-existing dirty files:** broad dirty/untracked tree remains from the
  parent repository reconciliation. These files are unrelated unless explicitly
  listed in the A6 subject scope below.
- **Untracked local artifacts:** many parent-inventoried artifacts remain
  untracked; no directory-wide add is allowed.
- **Proceed rule:** only exact A6 pathspecs may be edited, staged, or checked
  for this WB. Exact read-only context paths are allowed for consistency review:
  `AGENTS.md`, A1/A5 plans, the published A5 commit, the current Work Block
  template, and parent disposition reports. If A6 review requires
  app/config/deploy/private changes, stop and split to another WB.

## Dependency Check

### Must Resolve Before Start

- A1 agent runtime transition is published.
- A5 Codex runtime decision is published.
- Owner approves this A6 plan before any write-capable Claude Code mission.

### Can Resolve During Work

- Whether all 11 remaining A6 files are commit-ready without edits.
- Whether the already-committed `work-block-template.md` should be referenced in
  the A6 closeout as completed-by-A5 rather than restaged.
- Final commit message.

## Runtime / Data Mutation Boundary

- **Applies:** no runtime or data mutation; possible future Git index mutation
  only after explicit Owner commit decision.
- **Agent authority:** Codex Orchestrator controls scope and Git; Codex Critic is
  read-only; Claude Code performs bounded Coder/Review/Verification missions.
- **Structured action:** not applicable in Plan; later staging would be
  `git-index / stage / exact-A6-paths / medium-risk`.
- **Trusted executor:** local Git CLI under Codex Orchestrator control.
- **Policy and approval:** plan approval authorizes only bounded A6 review and
  documentation edits; staging, commit, and push require separate approval.
- **Audit path:** this plan, Claude task files/output, Critic review, local
  verification output, and final commit-decision report.
- **Forbidden direct path:** `.env*`, `.claude/settings.json`,
  `.codex/config.toml`, provider credentials, private endpoints, deploys, DB,
  dependency changes, broad staging, destructive Git, or branch operations.

## Scope

### In Scope

- Review and documentation-only correction of remaining A6 workflow docs:

```text
docs/implementation-readiness.md
docs/profiles.md
docs/reference/codex-model-routing.md
docs/reference/estimation-benchmarks.md
docs/reference/security-baseline.md
docs/reference/subagent-anti-patterns.md
docs/reference/verification-matrix.md
docs/session-bootstrap.md
docs/templates/architecture-brief-template.md
docs/templates/project-agent-update-template.md
docs/templates/stage-artifact-template.md
```

- A6 closeout accounting for `docs/templates/work-block-template.md`, which was
  part of the original A6 inventory but has already been committed and pushed in
  A5 commit `5172ca9`.
- Consistency checks against AGENTS.md, A1 runtime contracts, A5 Codex runtime
  rules, and the current Work Block template.

### Out of Scope

- Editing or staging `docs/templates/work-block-template.md` unless a new Owner
  approval expands this WB.
- Application source, showcase, web, strategy, legal, leads, AI assets, deploy,
  CI, Docker, proxy, dependencies, database, private config, secrets, generated
  output, and memory-bank history.
- Commit, push, merge, rebase, branch switch, stash, reset, clean, or deletion.

## Write-Set

Plan-stage write-set:

```text
docs/plans/WB-2026-06-24-a6-workflow-docs-readiness.md
```

Future implementation write-set after Owner approval:

```text
docs/implementation-readiness.md
docs/profiles.md
docs/reference/codex-model-routing.md
docs/reference/estimation-benchmarks.md
docs/reference/security-baseline.md
docs/reference/subagent-anti-patterns.md
docs/reference/verification-matrix.md
docs/session-bootstrap.md
docs/templates/architecture-brief-template.md
docs/templates/project-agent-update-template.md
docs/templates/stage-artifact-template.md
docs/plans/WB-2026-06-24-a6-workflow-docs-readiness-claude-coder-task.md
docs/plans/WB-2026-06-24-a6-workflow-docs-readiness-claude-review-task.md
docs/plans/WB-2026-06-24-a6-workflow-docs-readiness-claude-verifier-task.md
```

No directory-wide write grant is implied.

## Navigation Impact

- **Files added/moved/removed:** this WB plan now; possible A6 docs later.
- **PROJECT_MAP.md update needed:** no in this WB; A10 navigation remains last.
- **FILE_REGISTRY.yml update needed:** no in this WB; A10 navigation remains last.
- **Session bootstrap or profile docs update needed:** yes, those are A6 subject
  docs and may be corrected within scope.
- **Generated/derived/local-only boundary changed:** no.

## Commit / Stage Scope

- **Files to stage/commit:** none in Plan. Later candidate is the 11 remaining
  A6 subject paths plus approved A6 task/evidence docs only if Owner approves.
- **Files to leave unstaged:** all other dirty paths, private config, generated
  output, app files, deploy/config, and the already-published
  `docs/templates/work-block-template.md`.
- **Scope guard:** before staging, compare `git status --short -- <exact paths>`
  and `git diff --cached --name-only`; use only `git add -- <explicit paths>`.

## Acceptance Criteria

- [ ] No private/provider/API values are introduced.
- [ ] A6 docs consistently describe Codex as Orchestrator, Codex Critic as
  reviewer, and Claude Code as controlled execution runtime.
- [ ] Real model/provider/API configuration remains private user/project config
  and is not committed.
- [ ] `mcp-codex` permission is narrow and explicit where mentioned.
- [ ] No A10 navigation artifacts are committed by this WB.
- [ ] `git diff --check`, explicit untracked-file whitespace checks, and
  targeted secret scan pass for the candidate.
- [ ] Staging remains empty until Owner approves selective commit.

## Risks and Mitigations

| Risk | Impact | Mitigation | Stop Condition |
|---|---|---|---|
| A6 files duplicate or contradict A5 runtime rules | Confusing SDLC layer | Compare against A5 commit and `work-block-template.md` | Contradiction needs policy decision |
| Workflow docs accidentally become navigation refresh | A10 dependency order broken | Keep PROJECT_MAP/FILE_REGISTRY out of scope | Need to edit navigation files |
| Private model/provider settings enter docs | Secret/config leakage | Direct secret scans; no private config reads | Any real credential/private endpoint found |
| Broad staging captures unrelated dirty tree | Unsafe commit | Exact pathspecs only; staged manifest check | Any staged path outside whitelist |
| Claude Code writes outside scope | Repository drift | Task files list exact write-set and hard stops | Any out-of-scope modification |

## Stage 0 Routing Preflight

- **Work Block type:** non-trivial Work Block
- **Side-effect class:** local-docs now; public-repo later only after approval
- **DB action mode:** none
- **Hard Stops in scope:** secrets/private config, runtime/provider settings,
  navigation refresh, staging/commit/push, broad dirty tree drift
- **Write gate:** READY for this plan only

### Skill Routing Gate

- **Skills checked:** project-local workflow template, dirty-tree disposition,
  Codex model routing overlay, subagent anti-pattern guidance
- **Skills matched:** SDLC workflow docs and controlled multi-agent routing
- **Skills used:** exact path manifests, scoped write-set, external evidence
  handling, Reviewer/Verifier separation
- **Skills skipped and why:** deploy/runtime/browser skills are out of scope
- **Project-local skill fallback used:** yes

### Subagent Topology

- **Classification:** Subagent-Required
- **Triggers matched:** 11 untracked workflow docs, cross-document consistency,
  SDLC/runtime policy risk, independent review requirement
- **Use Claude Code team:** yes; Coder/Reviewer/Verifier through Claude Code
  with bounded task files and `/tmp` evidence capture
- **Use Codex/GPT critic or verifier:** yes; Codex-native Critic only
- **Dispatch plan:** Codex Critic plan review; Claude Code Coder; Claude Code
  Reviewer; Claude Code Verifier; Codex Orchestrator local verification and
  commit-decision report
- **Skip reason, if any:** none
- **Blocker category, if blocked:** not applicable

## Subagent Authorization

- Codex-native subagents are limited to Critic for this WB.
- Claude Code may use its own controlled subagents under the exact task-file
  boundaries.
- `mcp-codex` is permitted only as the Owner-authorized GPT-subagent bridge
  inside Claude Code for this WB; any other external AI CLI/MCP remains
  forbidden unless named in this plan after Owner approval.
- Claude Code Reviewer and Verifier must remain read-only.

## Execution Topology

- **Topology:** Codex Control Tower + Codex Critic + Claude Code Coder/Review/Verifier
- **Context sharing:** scoped prompts and exact path lists
- **Subagent assignments:** pending Owner approval

### Parallel Decomposition Matrix

| Stream | Goal | Role | Write-set | Dependencies | Verification | Execution | Reason |
|---|---|---|---|---|---|---|---|
| Plan Critic | Review A6 scope/order/risk before implementation | Codex Critic | none | plan draft | verdict + findings | sequential | Owner requested Critic-only native subagent |
| A6 Coder | Correct A6 docs within exact write-set | Claude Code Coder | 11 A6 subject paths + task file if needed | Critic disposition and Owner approval | local diff + summary | sequential | single writer avoids doc conflicts |
| A6 Review | Check semantic consistency and scope | Claude Code Reviewer | none | Coder output | APPROVE/REQUEST_CHANGES | sequential | reviewer must see final candidate |
| A6 Verification | Check commands, secrets, staging, path scope | Claude Code Verifier | none | Review output | APPROVED/BLOCKED | sequential | verifier depends on final reviewed candidate |
| Commit Decision | Produce exact staging manifest | Codex Orchestrator | none unless Owner approves commit | verifier approval | staged scope proposal | local | Git index controlled by Codex |

## Codex Critic

- **Required:** yes
- **Mode:** native-subagent
- **Verdict:** pending
- **Report path:** inline or future report if needed
- **Orchestrator response:** required for SUPPLEMENT/RECONSIDER

## External Review Inputs

- **External reports/prompts:** future Claude Code task files listed in write-set
- **Evidence input paths:** future `/tmp/WB-2026-06-24-a6-workflow-docs-readiness/*.out`
  and `*.err`
- **Triage rule:** external reviewer output is evidence, not acceptance.
- **Local verification required before accepting any finding:** yes; Codex
  Orchestrator checks scope and safety locally.

## Verification Plan

- **Canonical checks:**
  - `git diff --check`
  - exact-path untracked whitespace check for all untracked A6 files, for
    example `git diff --no-index --check /dev/null <path>` or an equivalent
    line-level whitespace scan before any staging approval
  - `bash scripts/bootstrap.sh`
  - targeted `rg` scan for real secrets/tokens/private keys in A6 files
  - `git status --short -- <exact A6 paths>`
  - `git diff --cached --name-only`
- **Scoped fallback checks:** if bootstrap is blocked, run markdown/text
  consistency checks and record residual risk.
- **Browser smoke:** not applicable.
- **Evidence expected:** Claude stdout/stderr, local command output, final
  path manifest, Critic verdict.
- **Skipped checks:** application/build/browser checks unless A6 unexpectedly
  touches app behavior, which is a stop condition.

## Stop Conditions

- Need to edit files outside the A6 write-set.
- Need to read `.env*`, `.claude/settings.json`, `.codex/config.toml`, provider
  config, private endpoints, or secrets.
- Need to update PROJECT_MAP.md or FILE_REGISTRY.yml before A10.
- Any staged path appears before Owner commit approval.
- Claude Code modifies out-of-scope paths.
- Verification fails without a documentation-only fix inside scope.

## Rollback / Recovery

If implementation edits are rejected, restore only approved A6 paths from a
fresh diff review after Owner approval. Do not use `git reset --hard`,
`git clean`, broad checkout, or deletion. If staging is later approved and then
fails, unstage only the exact A6 whitelist.

## SSOT Updates

- **Tracked/synchronized SSOT paths:** remaining A6 workflow docs after approval
- **Local-only/ignored SSOT paths and reason:** none expected
- **Direct evidence markers to verify with `rg -n`:** `mcp-codex`, `Owner-authorized`,
  `Claude Code`, `Codex Critic`, `provider`, `API keys`
- **`git check-ignore -v` result for workflow docs:** pending

## Execution Log

### 2026-06-24 - Plan Review

- Codex Critic reviewed the A6 plan before implementation.
- Verdict: `SUPPLEMENT`.
- Findings dispositioned:
  - clarified that exact read-only context paths are allowed while
    edit/stage/check remain limited to A6;
  - added explicit untracked-file whitespace check requirement.

### 2026-06-24 - Claude Code Coder

- Initial sandboxed Claude Code run failed with `API Error: Unable to connect to
  API (ConnectionRefused)`.
- Escalated Claude Code Coder run completed successfully.
- Files corrected within the 11-file A6 subject write-set:
  - `docs/implementation-readiness.md`
  - `docs/profiles.md`
  - `docs/reference/security-baseline.md`
  - `docs/reference/subagent-anti-patterns.md`
  - `docs/templates/stage-artifact-template.md`
- Claude Code Reviewer requested two blocking follow-up changes.
- Claude Code Coder fix pass completed successfully:
  - `docs/reference/codex-model-routing.md` now describes Claude Code teams as
    having internal subagent management rather than "their own orchestrator";
  - `docs/templates/architecture-brief-template.md` now includes SDD-aligned
    side-effect, DB action mode, review evidence, verification evidence, and
    final result fields.

### 2026-06-24 - Claude Code Review

- First sandboxed Claude Code Reviewer run failed with `API Error: Unable to
  connect to API (ConnectionRefused)`.
- Escalated Claude Code Reviewer run returned `REQUEST_CHANGES`.
- Follow-up escalated Claude Code Reviewer run after fix pass found no blocking
  issues.
- Residual non-blocking notes:
  - some implementation-readiness and estimation content may become stale over
    time;
  - references to `PROJECT_MAP.md` and `FILE_REGISTRY.yml` are read-time
    bootstrap references only, with navigation refresh deferred to A10.

### 2026-06-24 - Claude Code Verification

- Claude Code Verifier `plan` mode produced a plan only, so the Verifier was
  rerun with `acceptEdits` while the task remained read-only.
- Verifier verdict: `VERIFIED`.
- Verifier confirmed:
  - candidate files are in A6 scope;
  - `PROJECT_MAP.md`, `FILE_REGISTRY.yml`, and
    `docs/templates/work-block-template.md` remain outside the A6 candidate;
  - Git index is empty;
  - trailing whitespace and secret scans are clean;
  - `bash scripts/bootstrap.sh` passes;
  - runtime policy is consistent with Codex as Orchestrator, Codex Critic as
    read-only reviewer, Claude Code as controlled execution runtime, and
    provider config as private.

### 2026-06-24 - Orchestrator Local Verification

- `git status --short --branch`: branch
  `feature/showcase-demo-templates...origin/feature/showcase-demo-templates`;
  broad unrelated dirty tree remains.
- `git status --short -- <A6 candidate paths>`: 15 A6 candidate files are
  untracked and unstaged.
- `git diff --cached --name-only`: empty.
- `git diff --check -- <A6 candidate paths>`: passed.
- `rg -n "[ \t]+$" <A6 candidate paths>`: no matches.
- Targeted secret scan for common API/token/private-key patterns: no matches.
- `bash scripts/bootstrap.sh`: passed.

### Selective Commit Candidate

If the Owner approves commit, stage only these exact paths:

```text
docs/implementation-readiness.md
docs/profiles.md
docs/reference/codex-model-routing.md
docs/reference/estimation-benchmarks.md
docs/reference/security-baseline.md
docs/reference/subagent-anti-patterns.md
docs/reference/verification-matrix.md
docs/session-bootstrap.md
docs/templates/architecture-brief-template.md
docs/templates/project-agent-update-template.md
docs/templates/stage-artifact-template.md
docs/plans/WB-2026-06-24-a6-workflow-docs-readiness.md
docs/plans/WB-2026-06-24-a6-workflow-docs-readiness-claude-coder-task.md
docs/plans/WB-2026-06-24-a6-workflow-docs-readiness-claude-review-task.md
docs/plans/WB-2026-06-24-a6-workflow-docs-readiness-claude-verifier-task.md
```

Suggested commit message:

```text
docs: prepare A6 workflow documentation layer
```

| Date | Actor | Action | Evidence | Status |
|---|---|---|---|---|
| 2026-06-24 | Codex Orchestrator | Created A6 readiness plan after A5 push. | `git status --short --branch`; A6 inventory records | complete |
