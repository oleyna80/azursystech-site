# Work Block: Repository Reconciliation

## Meta

- **Work Block ID:** WB-2026-06-19-repository-reconciliation
- **Date:** 2026-06-19
- **Owner:** azur
- **Stage:** Verification
- **Role:** Orchestrator
- **Execution Mode:** staged approval
- **Side-Effect Class:** public-repo overall; local-docs for this stage
- **DB Action Mode:** none
- **Verification Tier:** full overall; tiered by change group
- **Active Profile:** Codex -> Claude Code Handoff with optional Codex model routing overlay

## Objective

Reconcile the complete Linux working tree into reviewable, dependency-aware
change groups, preserve private/generated state, integrate the current feature
branch with `origin/main`, and make the intended SDLC and product changes
available to the Windows clone through Git without losing work or mixing
unrelated changes.

## Expected Final Result

Every current dirty path has an Owner-confirmed disposition. Intentional,
portable changes are committed in scoped groups on the feature branch; private,
generated, machine-local, and credential-bearing files remain uncommitted and
are ignored or documented. The feature branch contains `origin/main` without
rewriting existing local commit IDs, all required checks have evidence, and the
Windows clone can fetch the same reviewed branch and reproduce the SDLC
navigation/bootstrap state. No commit, push, deploy, or destructive cleanup
occurs without the corresponding Owner approval.

## Done Criteria

- [ ] All 234 entries in the full-audit baseline have an ownership/disposition record.
- [ ] Exact path manifests and dependency order are frozen before any staging.
- [ ] Intentional changes pass group-specific review and verification.
- [ ] Each approved commit contains only its whitelist and passes staged secret scanning.
- [ ] The feature branch integrates `origin/main` without history rewrite.
- [ ] Owner-approved push publishes the feature branch; Windows checkout matches its SHA.
- [ ] Remaining local-only files are ignored or explicitly documented; stale worktree cleanup is deferred.

## Preflight State

- **Git baseline:** dirty on `feature/showcase-demo-templates` at `1b51896`; no upstream.
- **Branch topology:** local `main` is 11 ahead and 2 behind `origin/main`; current feature is 14 ahead and 2 behind `origin/main`. The two remote-only commits add and remove `test-windows.txt`, leaving no net tree delta.
- **Full-audit dirty baseline:** 41 tracked modifications and 193 expanded
  untracked paths, 234 total; none staged. Counts may change as approved Work
  Block artifacts are created and must be refreshed before staging. Domains
  include agent/SDLC, strategy docs, showcase, web, analytics consent, CI,
  Docker, proxy, deploy, and config-adjacent files.
- **Untracked local artifacts:** classification pending; secrets and generated/private state must not be opened by external reviewers or committed.
- **Proceed rule:** the exact 12-path cross-platform SDLC slice may proceed
  through review and verification. All broader implementation, staging, branch
  integration, commit, and push remain blocked until exact path groups and
  ownership are frozen and Stage 0 is rerun.

## Dependency Check

### Must Resolve Before Start

- Owner disposition for every ambiguous or private/generated-looking path.
- Exact commit pathspecs and cross-group dependency order.
- License/provenance review for imported Claude skills and vendor-like assets.
- Decision on whether a tracked `.gitattributes` policy is needed; any normalization must be isolated.
- Fresh Stage 0 and Codex Critic verdict after the inventory.

### Can Resolve During Work

- Exact test commands per package after package scripts are inventoried.
- Whether documentation-only groups can use `lite` instead of `standard` verification.
- Whether the three prunable worktree records warrant a separate cleanup Work Block.

## Runtime / Data Mutation Boundary

- **Applies:** no
- **Agent authority:** one Coder may update only the 12-path SDLC write-set;
  all broader repository work remains planner/read-only
- **Structured action:** not applicable
- **Trusted executor:** Git CLI under Control Tower supervision after approval
- **Policy and approval:** commit/push require explicit Owner approval; deploy/live-data actions are excluded
- **Audit path:** this plan, Git evidence, critic/reviewer/verifier reports, and memory-bank logs
- **Forbidden direct path:** `.env`, credentials, provider APIs, live DB, deploy, destructive cleanup

## Scope

### In Scope

- Inventory and classify the complete dirty tree.
- Build exact, dependency-aware path manifests for proposed commit groups.
- Reconcile safe portable `.codex`, `.agent`, `.claude`, SDLC, docs, web, showcase, analytics, and infra-related changes only after local validation.
- Preserve current feature branch history and plan a non-rewriting merge of `origin/main`.
- Define Linux and Windows verification evidence.

### Out of Scope

- Deploy, live DB/data, provider/API operations, dependency installation, or credential/config changes.
- Reading or publishing `.env`, secrets, tokens, private keys, provider payloads, or private local configuration.
- `git reset --hard`, `git clean`, force push, history rewriting, deletion, or worktree pruning.
- Direct push to `main`.
- Stale worktree cleanup as a completion requirement.

## Write-Set

Current cross-platform SDLC implementation slice:

```text
.gitattributes
.codex/write-gate.md
PROJECT_MAP.md
FILE_REGISTRY.yml
docs/session-bootstrap.md
docs/plans/WB-2026-06-19-repository-reconciliation.md
docs/reports/critic-WB-2026-06-19-repository-reconciliation.md
docs/reports/external-audit-WB-2026-06-19-repository-reconciliation.md
docs/reports/critic-implementation-WB-2026-06-19-repository-reconciliation.md
memory_bank/orchestrator-log.md
memory_bank/review-log.md
memory_bank/external-team-log.md
```

The cross-platform SDLC slice is complete and its write gate is **BLOCKED**.
The broader repository-reconciliation execution remains blocked until exact
path manifests are approved. Directory-wide write grants are not valid.

## Navigation Impact

- **Files added/moved/removed:** `.gitattributes`, this Work Block plan, and
  review/audit reports added in the current slice.
- **PROJECT_MAP.md update:** completed for the portable/private `.codex` boundary.
- **FILE_REGISTRY.yml update:** completed; project root is checkout-relative and
  portable `.codex` files are distinct from private local config.
- **Session bootstrap update:** completed with cross-platform manual checks.
- **Generated/derived/local-only boundary:** clarified; no private config changed.

## Candidate Commit Groups

These are inventory buckets, not staging permissions:

1. Agent governance and runtime contracts.
2. Portable `.codex` policy/templates versus local/private `.codex` state.
3. Imported Claude skills/agents after provenance and redistribution review.
4. SDLC navigation, profiles, templates, registry, and memory-bank structure.
5. Strategy, brand, website, leads, AI, SEO, and operations documentation.
6. Showcase application and demo-kit changes.
7. Public web routing, localization, showcase integration, and tests.
8. Analytics consent behavior and tests.
9. CI, Docker, proxy, deploy scripts, and runbooks, with no deployment.
10. Optional cross-platform `.gitattributes`/EOL policy as an isolated decision and commit.

## Commit / Stage Scope

- **Files to stage/commit:** none in this execution; later only frozen explicit
  pathspecs approved by Owner.
- **Files to leave unstaged:** all current dirty files until classified; always exclude secrets, `.env`, machine-local config, generated output, caches, and unknown artifacts.
- **Scope guard:** `git status --short`, `git diff --name-only`, explicit `git add -- <path...>`, `git diff --cached --name-only`, `git diff --cached --check`, and `scripts/secret-scan.sh staged` when available. Never use `git add .` or `git commit -a`.

## Acceptance Criteria

- [ ] Inventory maps each path to owner, intent, portability, dependency group, verification tier, and disposition.
- [ ] Claude Code read-only findings are locally triaged and never accepted as authority.
- [ ] Concurrent changes trigger a fresh inventory before staging.
- [ ] Commit groups have exact pathspecs and staged-diff evidence.
- [ ] Private/provider/model/API settings remain outside the committed base/project framework.
- [ ] Windows clone verifies the published feature SHA and SDLC bootstrap files.

## Risks and Mitigations

| Risk | Impact | Mitigation | Stop Condition |
|---|---|---|---|
| Broad dirty tree mixes unrelated work | Incorrect commits or lost ownership | Inventory every path and freeze whitelists | Any ambiguous path remains |
| Secret/private state is exposed | Credential or privacy incident | Do not inspect forbidden files externally; staged secret scan | Any suspected secret or private payload |
| Branch divergence is handled by rewrite | Lost or changed commit identity | Preserve branch and use merge after clean state | Rebase/force/reset becomes necessary |
| Cross-platform EOL/case drift | Windows clone differs unexpectedly | Audit attributes/case; isolate normalization | Broad unexplained line-ending diff |
| Imported assets lack provenance | Redistribution risk | License/source audit before commit | Provenance cannot be established |
| Concurrent edits invalidate manifests | Wrong staging boundary | Re-run status and compare frozen manifest | Dirty set changes during execution |
| Full tests are unreliable in dirty tree | False confidence | Verify groups in isolated clean worktree | Required test cannot run or fails |

## Stage 0 Routing Preflight

- **Work Block type:** non-trivial Work Block
- **Side-effect class:** public-repo overall; local-docs/read-only inventory now
- **DB action mode:** none
- **Hard Stops in scope:** secrets, config, commit, push, merge conflict, destructive cleanup, deploy
- **Write gate:** BLOCKED after completion of the exact 12-path SDLC slice;
  broader execution remains BLOCKED

### Skill Routing Gate

- **Skills checked:** `.agent/ROSTER.md`, `scoped-commit-guard`, `index-exclusions-manager`, `verifier`
- **Skills matched:** `scoped-commit-guard`, `index-exclusions-manager`, `verifier`; conditional `compose-preflight` and `deploy-readiness-gate` for group 9
- **Skills used:** `scoped-commit-guard` and `index-exclusions-manager` to define staging/ignore boundaries; `verifier` to define evidence states
- **Skills skipped and why:** deploy/VPS skills are deferred because deploy and live infra are out of scope
- **Project-local skill fallback used:** yes

### Subagent Topology

- **Classification:** Subagent-Required
- **Triggers matched:** multi-domain dirty tree, branch divergence, public-repo side effects, independent review required
- **Use Claude Code team:** yes, initially read-only and partitioned by domain
- **Use Codex/GPT critic or verifier:** yes; critic completed, verifier required after implementation
- **Dispatch plan:** native Repository Analyst and Codex Critic in parallel; then one read-only Claude Code external audit; Control Tower triage; later one Coder only; independent Reviewer; independent Verifier
- **Blocker category, if blocked:** execution-scope not frozen

### Parallel Decomposition Matrix

| Assignment | Role | Read scope | Write permission | Expected output |
|---|---|---|---|---|
| Repository inventory | Native analyst | Git topology and complete status/diff metadata | none | counts, domains, constraints, recovery plan |
| Decision audit | Codex Critic | governance files and draft Work Block | none | verdict and required changes |
| Cross-runtime inventory | Claude Code external team | bounded tracked/untracked paths excluding forbidden private files | none | path classification findings with evidence |
| Triage and freeze | Control Tower | all reports plus live tree | Plan artifacts only after new gate | exact manifests and Owner decisions |

## Subagent Authorization

- Native analyst and critic were explicitly authorized as read-only assignments.
- External AI audit runner is authorized by the Owner as a separate Control Tower assignment after this plan exists.
- Claude Code receives no write, web, provider, or side-effect capability.
  The completed audit allowed only bounded read commands and safe Git metadata
  commands, without token or monetary budget flags and with a 10-minute timeout.
- Only one Coder modified the approved 12-path execution write-set.

## Execution Topology

- **Topology:** Control Tower + one Coder for the closed SDLC slice, with
  independent read-only Reviewer and Verifier
- **Context sharing:** scoped prompts and bounded read sets
- **Subagent assignments:** repository analyst, critic, Claude Code audit,
  Reviewer, and Verifier complete

## Codex Critic

- **Required:** yes; broad public-repo reconciliation needs an independent decision audit
- **Mode:** native-subagent
- **Verdict:** RECONSIDER
- **Report path:** `docs/reports/critic-WB-2026-06-19-repository-reconciliation.md`
- **Orchestrator response:** accepted. Execution remains blocked; scope ownership, risk classes, skill routing, branch/commit strategy, exact verification, concurrent-edit stops, and Windows evidence were added. Stage 0 and critic must rerun after inventory.

## External Review Inputs

- **External reports/prompts:** Claude Code assignment below; output is evidence only.
- **Triage rule:** Control Tower verifies every accepted claim against the live tree.
- **Local verification required before accepting any finding:** yes.

### Claude Code External Audit Assignment

- **Role:** External Audit Runner, read-only repository classifier.
- **Objective:** challenge the proposed grouping and identify missing ownership, dependency, portability, provenance, secret-risk, and verification constraints.
- **Required read set:** this Work Block; `AGENTS.md`; `PROJECT_MAP.md`; `FILE_REGISTRY.yml`; `.gitignore`; safe tracked `.codex/*.md` and templates; `docs/session-bootstrap.md`; `docs/profiles.md`; Git-visible project paths in the candidate groups. Do not open ignored/private configuration.
- **Out of scope:** implementation, fixes, staging, commit/push, branch operations, dependency changes, tests with side effects, network/provider access, deploy, DB/data, client actions, and stale worktree cleanup.
- **File-change permission:** none.
- **Forbidden side effects:** Bash, Edit/Write, web, MCP/provider calls, `.env` or credential reads, private config reads, live services, destructive commands.
- **Timeout/fallback:** 10 minutes; if blocked or hung, stop and retain the native analyst/critic evidence. Do not apply token or monetary budget flags to Claude Code runs.
- **Required output:** findings ordered by severity; path or file/line evidence; confidence; proposed disposition/group; missing checks; explicit list of inspected and uninspected areas; final `READY_FOR_TRIAGE` or `BLOCKED` verdict.

## Branch and Integration Strategy

1. Preserve `feature/showcase-demo-templates`; do not rename, switch, or set upstream during inventory.
2. Capture baseline SHAs/status and create recoverable local evidence before implementation; do not stash, reset, or clean.
3. Reconcile and verify each Owner-approved group with explicit staging pathspecs.
4. Once the tree is clean or safely isolated, fetch and merge `origin/main` into the feature branch without rebasing. Abort on conflict and return to Owner review.
5. After full verification and explicit Owner approval, push only the feature branch and set its upstream. Direct push to `main` remains forbidden.

## Verification Plan

- **Canonical checks:** `git diff --check`; `bash scripts/bootstrap.sh` when present; publication/project validator when present; YAML parse for registry files; `scripts/secret-scan.sh staged` for every approved staged set; package lint/typecheck/tests from declared scripts for web/showcase groups; shell syntax and compose/config rendering for infra group without deploy.
- **Scoped fallback checks:** path-limited diff checks, syntax checks, targeted tests, and `UNVERIFIED` classification with reason when canonical checks are unavailable.
- **Browser smoke:** required only for user-visible web/showcase groups after an approved implementation stage; desktop and mobile key routes.
- **Evidence expected:** command output, exact staged file lists, critic/reviewer/verifier reports, commit SHAs, and Windows SHA/bootstrap evidence.
- **Skipped checks:** none pre-authorized; unavailable checks remain `UNVERIFIED`, never `PASS`.

### Windows Reproduction Evidence

After Owner-approved push, on the Windows clone (Git Bash or WSL):

```bash
git fetch origin
git switch --track origin/feature/showcase-demo-templates
git rev-parse HEAD
git status --short --branch
bash scripts/bootstrap.sh
```

The Windows `HEAD` must equal the published feature SHA, the working tree must
be clean except documented local-only files, and the SDLC map/registry/profile
files must be present. Existing local branch cases use `git switch
feature/showcase-demo-templates` followed by an explicit fast-forward only.

## Stop Conditions

- Scope or dirty-set changes after a manifest is frozen.
- Ambiguous ownership, private/generated classification, or suspected secrets.
- Missing provenance/license for imported content.
- Required dependency/config/DB/deploy/payment change.
- Merge conflict, history rewrite, branch deletion/rename, or destructive command.
- Required verification failure or unacceptable `UNVERIFIED` result.
- Linux/Windows case, EOL, Unicode, or SHA mismatch.
- Any commit or push without fresh explicit Owner approval.

## Rollback / Recovery

Record branch/HEAD/upstream/status and create local, non-committed recovery
evidence for tracked and untracked work before implementation. Prefer an
isolated clean worktree for integration checks. Preserve existing commits and
use merge abort on integration conflicts. Never use reset/clean/stash as an
automatic recovery mechanism, and do not prune stale worktrees in this Work
Block.

## SSOT Updates

- **Tracked/synchronized SSOT paths:** this plan, critic report, and later approved tasklist/report/log updates.
- **Local-only/ignored SSOT paths and reason:** private provider/model/API configuration and machine-local runtime state.
- **Direct evidence markers to verify with `rg -n`:** Work Block ID, `RECONSIDER`, `Write gate: BLOCKED`, and Claude assignment boundaries.
- **`git check-ignore -v` result:** portable `.codex` policy resolves through
  explicit negation rules; private config and backups remain ignored.

## Execution Log

| Time | Stage | Action / Decision | Evidence | Status |
|---|---|---|---|---|
| 2026-06-19 | Plan | Captured branch and dirty-tree evidence | native repository analyst | complete |
| 2026-06-19 | Plan | Ran independent Codex Critic | critic report | RECONSIDER accepted |
| 2026-06-19 | Plan | Blocked execution pending exact inventory | write gate and this plan | blocked |
| 2026-06-19 | Plan | Ran full Claude Code inventory without a budget flag | external audit report | complete |
| 2026-06-19 | Implementation preflight | Froze cross-platform SDLC slice and reran critic | implementation critic report | SUPPLEMENT accepted |
| 2026-06-19 | Implementation | Updated the exact 12-path SDLC slice; broader tree remained excluded | approved write-set | complete |
| 2026-06-19 | Review | Reviewer required consistency and safe gate-close corrections | read-only reviewer | corrected |
| 2026-06-19 | Verification | Bootstrap, lite validator, YAML, ignore, attributes, portability, secret-pattern, whitespace, and staging checks passed | read-only verifier and local commands | VERIFIED |

## Closeout and Retrospective

### Result Summary

- **Final Result:** the narrow cross-platform SDLC slice is implemented and its
  write gate is closed. The broader repository-reconciliation WB remains open.
- **Verification Evidence:** `git diff --check`, untracked whitespace check,
  PyYAML parse, `bash scripts/bootstrap.sh`, `bash scripts/verify.sh lite`, Git
  ignore/attribute checks, case/reserved-name/path-length checks, scoped secret
  pattern scan, and empty staging all passed.
- **Residual Risks:** the broader dirty tree is unclassified; portable `.codex`
  depends on the existing `.gitignore` change; Windows-clone SHA verification
  requires a later Owner-approved commit/push.

### Critic and Review Value

- **Critic used:** yes; native Codex Critic.
- **Critic verdict:** initial `RECONSIDER`; implementation preflight `SUPPLEMENT`.
- **What the critic/reviewer caught:** broad scope, missing risk/skill/branch
  detail, inventory count drift, inconsistent stage wording, unsafe persistence
  of a READY gate, incomplete portable ignore example, and Windows evidence.
- **What was corrected:** scope stayed narrow, counts and lifecycle wording were
  aligned, the timeout/no-budget rule was unified, the bootstrap example checks
  portable and private `.codex` paths, and the gate was closed.
- **Skip/fallback reason:** not applicable.

### Lessons Learned

- **What worked:** parallel read-only topology and explicit critic gate.
- **What did not work:** the initial draft treated the whole dirty tree as one execution scope.
- **What not to repeat:** opening write access before path ownership and exact manifests exist.
- **Evidence wording check:** only demonstrated checks will be reported as such.
- **Framework updates made:** none; project-local planning artifacts only.
- **Framework updates to consider:** a reusable repository-reconciliation inventory template.
- **Reusable knowledge created:** this Work Block and critic report.
- **Navigation updates:** pending inventory.
- **Follow-up Work Blocks:** exact implementation Work Blocks per frozen group; optional stale-worktree cleanup.
