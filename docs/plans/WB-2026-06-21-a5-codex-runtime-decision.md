# Work Block: A5 Codex Runtime Decision

## Meta

- **Work Block ID:** `WB-2026-06-21-a5-codex-runtime-decision`
- **Parent Work Block:** `WB-2026-06-20-dirty-tree-disposition`
- **Predecessor:** `WB-2026-06-21-a1-selective-commit-readiness`
- **Date:** 2026-06-21
- **Owner:** azur
- **Stage:** Verification complete / commit decision pending
- **Role:** Orchestrator
- **Execution Mode:** approved Work Block, staged by role
- **Side-Effect Class:** local docs/workflow write + local test
- **DB Action Mode:** none
- **Verification Tier:** T3 / full
- **Active Profile:** Codex -> Claude Code Handoff
- **Allowed external runtimes/MCPs:** `mcp-codex` is Owner-authorized only as
  the GPT-subagent bridge inside Claude Code for this WB. No other external AI
  runtime or MCP is authorized.

## Objective

Decide whether the six inventoried A5 Codex runtime files form a coherent,
portable, and safe project runtime layer. Adapt them to the current AzurSysTech
SDLC and the base framework contracts, then prepare an independently reviewed
commit candidate without touching private runtime configuration or unrelated
dirty files.

## Expected Final Result

The exact six A5 paths implement one consistent Codex runtime contract:
Codex remains the Control Tower, the critic and verifier are read-only, one
scoped Coder may write only an approved write-set, and the Stage 0 hook enforces
the documented declaration gate without claiming semantic or security proof.
The committed template contains no real provider/model/API configuration and
states that such settings stay private. Hook behavior, TOML syntax, bootstrap,
publication checks, secret scans, Review, and Verification pass. The exact A5
candidate is ready for a separate Owner commit decision; no staging, commit, or
push occurs inside implementation without that confirmation.

## Done Criteria

- [x] Native Critic verdict is dispositioned before implementation.
- [x] Owner explicitly approves this completed plan and exact write-set.
- [x] Claude Code acts as the sole write-capable Coder for the six A5 paths.
- [x] No path outside the exact A5 write-set is changed by the Coder.
- [x] Runtime docs, agent TOML, and hook agree with `AGENTS.md`, SDD protocol,
  A1 active-runtime policy, and framework Codex routing/critic contracts.
- [x] Private config and credential boundary is preserved and verified.
- [x] Claude Code Reviewer returns advisory quality approval with findings
  dispositioned.
- [x] Claude Code Verifier returns `SPEC_OK` and `APPROVED` for T3 checks.
- [x] Staging remains empty until a separate Owner decision.

## Preflight State

- **Git baseline:** dirty on `feature/showcase-demo-templates`; local and remote
  heads match `c0a91e3` after A1 publication; staging is empty.
- **Pre-existing dirty files:** the parent inventory owns all remaining dirty
  paths. A5 consists only of six untracked `.codex` files. Tracked application,
  deployment, workflow, memory, config, and showcase changes remain unrelated.
- **Untracked local artifacts:** parent-inventoried plans, reports, navigation,
  strategy, showcase, and SDLC files remain frozen unless named as lifecycle
  artifacts below.
- **Proceed rule:** snapshot the exact A5 files and whole-tree status before the
  external Coder; compare both after it finishes; reject or revert only Coder
  changes outside the approved A5 paths. Unknown user changes must not be
  reverted.

## Dependency Check

### Must Resolve Before Start

- A1 agent runtime transition: resolved and published as `c0a91e3`.
- Native Critic review of this Stage 0 plan.
- Owner approval of the Critic-adjusted plan; received by current Owner message
  on 2026-06-24. That approval explicitly grants the sole Claude Coder write
  authority for the exact six `.codex` paths under the structural authority
  model. It grants no directory-wide authority.
- Confirm the base framework is a semantic reference, because it has no direct
  project `.codex/*` equivalents.

### Can Resolve During Work

- Whether each A5 file needs content changes or can be accepted unchanged.
- Exact hook test fixture implementation under `/tmp`.
- Final commit message, subject to separate commit approval.

## Runtime / Data Mutation Boundary

- **Applies:** no live runtime or data mutation.
- **Agent authority:** approved repository documentation/config-template/hook
  authoring only.
- **Structured action:** not applicable.
- **Trusted executor:** local Git worktree and local test commands only.
- **Policy and approval:** Owner approved this plan on 2026-06-24; no
  staging/commit/push without separate approval.
- **Audit path:** this plan, Critic report, Claude Code task prompts, and
  sanitized Claude Code Coder/Reviewer/Verifier stdout summaries.
- **Forbidden direct path:** private provider config, secrets, live APIs, DB,
  deploy, production config, or client-facing action.

## Scope

### In Scope

- Review and adapt the exact six A5 runtime files.
- Reconcile project-specific runtime behavior with:
  - `AGENTS.md`;
  - `.agent/workflows/sdd-protocol.md`;
  - `.agent/ROSTER.md`;
  - framework `codex-model-routing.md`;
  - framework Codex critic research and publication validation rules.
- Exercise the write-gate hook with isolated temporary fixtures.
- Create lifecycle plan/task artifacts through Control Tower and post-change
  reports only through their authorized Verifier or Scoped Coder role.

### Out of Scope

- `.codex/config.toml` and all real provider/model/profile configuration.
- `.claude/settings.json`, `.env*`, secrets, tokens, credentials, private URLs.
- A6 workflow docs, navigation files, memory history, imported skills.
- Application source, dependencies, CI, deployment, DB, payments, production.
- Staging, commit, push, branch operations, cleanup, or destructive Git.

## Write-Set

### Subject Coder

```text
.codex/agents/verifier.toml
.codex/agents/scoped-coder.toml
.codex/config.toml.template
.codex/critic.md
.codex/hooks/stage0_write_gate.py
.codex/instructions.md
```

### Lifecycle Artifacts and Role Ownership

```text
.codex/write-gate.md
docs/plans/WB-2026-06-21-a5-codex-runtime-decision.md
docs/plans/WB-2026-06-21-a5-codex-runtime-decision-claude-coder-task.md
docs/plans/WB-2026-06-21-a5-codex-runtime-decision-claude-review-task.md
docs/plans/WB-2026-06-21-a5-codex-runtime-decision-claude-verifier-task.md
```

Control Tower may write `.codex/write-gate.md` and `docs/plans/*`. The
read-only Critic verdict and Orchestrator disposition are recorded in this plan
rather than written by Reviewer under `docs/reports/*`. Claude Code returns
implementation, review, and verification reports through stdout; it does not
create extra repository report files in this WB unless a later Owner message
approves exact report paths. Review and Verification are delegated to Claude
Code missions rather than Codex-native Reviewer/Verifier subagents per the
Owner's 2026-06-24 routing direction.

## Navigation Impact

- **Files added/moved/removed:** six A5 files are candidates to become tracked;
  no rename or removal.
- **PROJECT_MAP.md update needed:** deferred to A10 after accepted groups settle.
- **FILE_REGISTRY.yml update needed:** deferred to A10.
- **Session bootstrap or profile docs update needed:** A6 depends on this A5
  decision and will reconcile those docs later.
- **Generated/derived/local-only boundary changed:** yes; the six portable
  `.codex` templates/runtime contracts become Git-synchronized. Real config
  stays private and ignored. `.codex/write-gate.md` remains mutable generated
  per-WB state outside the A5 commit candidate; its authoritative field schema,
  fail-closed behavior, and gate-only bootstrap path live in the portable hook
  and critic contract.

## Commit / Stage Scope

- **Files to stage/commit:** none during implementation; a later selective
  commit candidate may contain only the six subject paths after approval.
- **Files to leave unstaged:** every other dirty/untracked path, all lifecycle
  artifacts unless a later WB explicitly approves them, and all private config.
- **Scope guard:** before/after status envelope, exact path manifest, SHA-256
  snapshot, `git diff --name-only`, `git diff --cached --name-only`.

## Acceptance Criteria

- [x] AC1: all six files use only Codex and Claude Code as active runtime names;
  historical/unsupported runtime names do not become active policy.
- [x] AC2: custom Reviewer/Verifier/Critic roles are read-only; the scoped Coder
  is bounded by the approved write-set and cannot bypass Hard Stops.
- [x] AC3: the hook and docs agree on mandatory Stage 0 fields, critic states,
  expiration, and the gate-file self-update exception.
- [x] AC4: hook limitations are explicit: declaration/process enforcement, not
  semantic validation, sandboxing, or proof of critic quality.
- [x] AC5: `config.toml.template` contains only sanitized behavior/examples and
  explicitly keeps real providers, models, API keys, endpoints, and credentials
  at user/private project level outside Git.
- [x] AC6: no absolute workstation paths, private endpoints, secret values, or
  machine-specific runtime assumptions exist in the six files.
- [x] AC7: isolated hook tests cover missing gate, expired gate, READY gate,
  critic-required states, unresolved critic response, gate-only patch, and
  out-of-write-set patch behavior as required by the final contract.
- [x] AC8: bootstrap/publication/TOML/Python/whitespace/secret checks pass, or a
  failed canonical check blocks commit readiness.
- [x] AC9: after Claude exits, only the exact six subject paths differ from the
  pre-run envelope; staging remains empty.

## Risks and Mitigations

| Risk | Impact | Mitigation | Stop Condition |
|---|---|---|---|
| Hook/docs contract drift | Writes may be allowed or blocked incorrectly | derive tests from final documented states | fixture contradicts docs |
| Private provider config leakage | credentials or machine config enter Git | never read real config; scoped secret/path scan | any value/private endpoint detected |
| Claude scope expansion | unrelated dirty work is overwritten | exact write-set, pre/post hashes, one Coder | any ninth path changed |
| Overclaiming enforcement | users trust a declaration gate as security | document limitations and Reviewer check | claims exceed tested behavior |
| A6 started too early | workflow docs encode unresolved runtime policy | finish A5 Review/Verification first | A6 edits proposed in this WB |

## Stage 0 Routing Preflight

- **Work Block type:** non-trivial Work Block.
- **Side-effect class:** local docs/workflow write + local test. Public-repo
  begins only in a later selective commit WB.
- **DB action mode:** none.
- **Hard Stops in scope:** private config/secrets; staging/commit/push; scope
  expansion. None is authorized by implementation approval.
- **Write gate:** `READY` for plan/Critic artifacts only; subject implementation
  remains blocked pending Critic disposition and Owner approval.

### Skill Routing Gate

- **Skills checked:** `subagent-mission-brief`, `agent-operations-review`,
  `scoped-commit-guard`, `shell-context-guard`.
- **Skills matched:** `subagent-mission-brief`, `agent-operations-review`,
  `shell-context-guard`.
- **Skills used:** read project-local `subagent-mission-brief`; use its exact
  authority/output shape for Claude and native review assignments;
  shell-context boundaries in planned commands.
- **Skills skipped and why:** `agent-operations-review` is deferred to closeout
  unless implementation exposes runtime friction; `scoped-commit-guard` is not
  active until a later commit-readiness WB.
- **Project-local skill fallback used:** yes; local skill contracts are applied
  manually because no dedicated runtime Skill tool is exposed.

### Subagent Topology

- **Classification:** Subagent-Required.
- **Triggers matched:** 6 files, 3 directories, runtime/security boundary,
  external Coder handoff, independent full verification.
- **Use Claude Code team:** yes, as the sole subject Coder and as the Review
  and Verification runtime for this WB.
- **Use Codex/GPT critic or verifier:** native read-only Critic only. No
  Codex-native Reviewer or Verifier subagents are used in this WB by Owner
  direction.
- **Dispatch plan:** Critic -> Owner approval -> Claude Code Coder -> Claude
  Code Reviewer -> Claude Code Verifier -> Control Tower closeout.
- **Skip reason, if any:** none.
- **Blocker category, if blocked:** not applicable.

## Subagent Authorization

- Native read-only Critic is authorized during planning and topology refresh.
- After Owner plan approval, Claude Code is the only write-capable Coder and may
  modify only the six subject paths.
- No other Codex-native subagents are authorized. Claude Code may use its own
  internal subagents for Coder, Review, and Verification. `mcp-codex` is
  permitted only as the Owner-authorized GPT-subagent bridge inside Claude Code;
  any other external AI CLI/MCP remains forbidden unless named in this plan.
- Claude Code Reviewer and Verifier are read-only for repository files.
- External AI audit runner: Claude execution is authorized only after a task
  file defines the exact write-set, forbidden side effects, and output contract.

## Execution Topology

- **Topology:** Control Tower + native Critic + Claude Code Coder/Reviewer/Verifier missions.
- **Context sharing:** scoped task files and local source references; no private
  config or full transcript export.
- **Subagent assignments:** Critic challenges plan; Claude Code implements;
  Claude Code Reviewer checks spec/quality; Claude Code Verifier runs
  independent T3 evidence.

### Parallel Decomposition Matrix

| Stream | Goal | Role | Write-set | Dependencies | Verification | Execution | Reason |
|---|---|---|---|---|---|---|---|
| P | Challenge Stage 0 | Critic | none | draft plan/topology refresh | scope/risk/checks | sequential | must finish before implementation |
| I | Reconcile A5 runtime | Claude Coder | exact six A5 paths | Critic + Owner | self-check + manifest | sequential | sole Coder/shared contract |
| R | Spec and quality review | Claude Code Reviewer | none | implementation | AC1-AC9 + diff | sequential | requires final diff |
| V | Issue `SPEC_OK`, run T3, issue `APPROVED` | Claude Code Verifier | none | completed implementation + advisory Reviewer findings | AC1-AC9 + canonical checks | sequential | Verifier owns formal SDD verdicts |
| C | Closeout and approval package | Orchestrator | `.codex/write-gate.md`; `docs/plans/WB-2026-06-21-a5-codex-runtime-decision.md`; task file under `docs/plans/` only | R + V | evidence synthesis | local | Control Tower authority is limited to gate/plans |

## Codex Critic

- **Required:** yes; six runtime files and external Coder handoff.
- **Mode:** native-subagent.
- **Verdict:** `SUPPLEMENT` after initial `RECONSIDER`; all findings incorporated.
- **Report path:** this plan, because Critic is read-only and `AGENTS.md`
  reserves `docs/reports/*` writes for Verifier or Scoped Coder.
- **Orchestrator response:** initial `RECONSIDER` accepted in full. Corrected
  authority, gate lifecycle, untracked scans, hook matrix, verification profile,
  verdict ownership, and side-effect class were re-reviewed. Both remaining
  `SUPPLEMENT` items were accepted: Verifier now has an exact artifact-only
  report write-set and owns the sequential `SPEC_OK` -> T3 -> `APPROVED` flow;
  Control Tower is limited to gate and `docs/plans/*` artifacts.

## External Review Inputs

- **External reports/prompts:** Claude Code Coder, Reviewer, and Verifier task
  prompts plus sanitized stdout summaries.
- **Evidence input paths:** `/tmp/WB-2026-06-21-a5-codex-runtime-decision/claude-coder.out`,
  `/tmp/WB-2026-06-21-a5-codex-runtime-decision/claude-coder.err`,
  `/tmp/WB-2026-06-21-a5-codex-runtime-decision/claude-coder-safe.out`,
  `/tmp/WB-2026-06-21-a5-codex-runtime-decision/claude-coder-safe.err`,
  `/tmp/WB-2026-06-21-a5-codex-runtime-decision/claude-review.out`,
  `/tmp/WB-2026-06-21-a5-codex-runtime-decision/claude-review.err`,
  `/tmp/WB-2026-06-21-a5-codex-runtime-decision/claude-verifier.out`, and
  `/tmp/WB-2026-06-21-a5-codex-runtime-decision/claude-verifier.err`.
- **Triage rule:** external output is evidence, not acceptance.
- **Local verification required before accepting any finding:** yes.

## Verification Plan

- **Canonical checks:** runtime-specific T3 matrix:
  1. exact six-path pre/post status and SHA-256 envelope; cached diff empty;
  2. per-file `git diff --no-index --check /dev/null <path>` for all untracked
     candidates, requiring empty diagnostic output and accepting `rc=1` only as
     the normal no-index content-difference status; any whitespace diagnostic or
     other status fails the check. Also run `git diff --check` for tracked
     lifecycle artifacts;
  3. direct six-path secret/private-key/provider-value/absolute-path scans using
     the same patterns and exclusions as `scripts/secret-scan.sh` where applicable;
  4. Python AST parse with `python3 -B`, and TOML parse of all three TOML files;
  5. isolated `/tmp` JSON fixture matrix for `Bash`, `apply_patch`, `Edit`, and
     `Write`: missing, expired, valid READY, required Critic states, unresolved
     response, gate-only create/update, ordinary in-scope write, and write with
     no valid gate;
  6. verify configured matcher names and payload assumptions against the locally
     installed Codex contract when available; otherwise label compatibility as
     unverified and block commit readiness rather than overclaim;
  7. `bash scripts/bootstrap.sh` and `scripts/verify.sh lite` for repository
     shell sanity;
  8. `scripts/validate-dirty-tree-inventory.py` only if its CLI supports a
     read-only validation of the frozen inventory; no publication validator is
     present, so none may be claimed;
  9. Claude Code Reviewer inspection and independent Claude Code Verifier repetition.
- **Scoped fallback checks:** none for path integrity, hook fixtures, TOML/Python
  syntax, direct secret scan, or gate compatibility. `scripts/verify.sh full`
  is intentionally inapplicable: it exercises dirty application, compose, and
  deploy surfaces outside A5. T3 here means full coverage of the runtime
  contract, with that substitution explicitly approved in this WB.
- **Browser smoke:** not applicable.
- **Evidence expected:** command output, exact manifests, Critic output captured
  in this plan, Claude Code Reviewer output, Claude Code Verifier output, and
  sanitized Claude stdout summaries.
- **Skipped checks:** `scripts/verify.sh full` application/compose checks are
  outside the A5 contract and may be contaminated by frozen unrelated changes;
  residual risk is limited to integration outside the project-local Codex layer.

## Stop Conditions

- Need to read or change private config, provider values, secrets, `.env*`, or
  `.claude/settings.json`.
- Any Coder-modified path outside the six A5 files.
- Hook behavior cannot be reconciled with the documented contract.
- Canonical T3 check fails or Reviewer/Verifier returns a blocking verdict.
- Need for dependency, application, CI, deploy, DB, production config, A6,
  staging, commit, push, branch, cleanup, or destructive action.

## Rollback / Recovery

Before Claude starts, store the six-file SHA-256 manifest and full status digest
in `/tmp`. If Claude changes an unauthorized path, stop and report it; do not
revert unknown user work automatically. For authorized A5 files, retain the
pre-run copies under `/tmp` so the Owner can approve a scoped restoration if
needed. Keep staging empty throughout.

## SSOT Updates

- **Tracked/synchronized SSOT paths:** candidate six A5 runtime files. Their
  exact-path write authority is granted to the sole Coder only by Owner approval
  of this WB; the general authority table is not broadened.
- **Local-only/ignored SSOT paths and reason:** `.codex/config.toml`, raw Claude
  stdout/stderr, and temporary manifests because they can contain private or
  machine-specific runtime state.
- **Direct evidence markers to verify with `rg -n`:** `Stage 0`, `Critic`,
  `write-set`, `private`, `provider`, `declaration`.
- **`git check-ignore -v` result for workflow docs:** six A5 paths are exposed
  through `.gitignore` negation rules and appear as untracked, so they are
  eligible for later selective synchronization.

## Execution Log

| Time | Stage | Action / Decision | Evidence | Status |
|---|---|---|---|---|
| 2026-06-21 | Plan | Confirmed A1 published locally/remotely at `c0a91e3` | Git branch/log | complete |
| 2026-06-21 | Plan | Selected A5 because A6 depends on A5 runtime decision | frozen inventory | complete |
| 2026-06-21 | Plan | Restricted current gate to plan/Critic artifacts | `.codex/write-gate.md` | complete |
| 2026-06-21 | Plan Review | Native Critic returned `RECONSIDER` with seven findings | read-only agent output | complete |
| 2026-06-21 | Plan Correction | Accepted all findings and corrected Stage 0 | authority, gate boundary, scans, hook matrix, T3 profile, role ownership, side-effect class | complete |
| 2026-06-21 | Plan Re-review | Native Critic returned `SUPPLEMENT` | two ownership/dependency clarifications | complete |
| 2026-06-21 | Plan Correction | Accepted both supplements and corrected execution matrix | exact Verifier report write-set + non-circular verdict flow | complete |
| 2026-06-21 | Plan Closeout | Closed the implementation gate pending explicit Owner approval | plan + `.codex/write-gate.md` | complete |
| 2026-06-24 | Routing Update | Owner approved continuation and restricted Codex-native subagents to Critic only; Coder, Review, and Verification route through Claude Code | Owner message + plan/gate update | in progress |
| 2026-06-24 | Critic Supplement | Accepted refreshed Critic findings: gate separated Control Tower/Claude write-sets, Review/Verifier task files created before use, Coder task clarified subject drift and private-config false positives | `.codex/write-gate.md` + Claude task files | in progress |
| 2026-06-24 | Claude Coder | First non-safe-mode Claude run was stopped because task wording did not yet distinguish Owner-authorized `mcp-codex` GPT-subagent bridging from unauthorized external AI CLIs. Owner clarified `mcp-codex` was authorized; cumulative edits were limited to approved subject paths. Safe-mode rerun completed with no further edits and reported ready for review. | `/tmp/WB-2026-06-21-a5-codex-runtime-decision/claude-coder*.out` + six-file hashes | complete |
| 2026-06-24 | Local Verification | Orchestrator ran AST parse, TOML parse, secret/path scan, whitespace checks, extended hook fixtures, `git diff --check`, `bash scripts/bootstrap.sh`, and `scripts/verify.sh lite`. | local command output; staging empty | complete |
| 2026-06-24 | Claude Review | Claude Code Reviewer returned `APPROVE` and `Ready for Verifier: YES`; review noted its own Python/TOML fixture execution gap. | `/tmp/WB-2026-06-21-a5-codex-runtime-decision/claude-review.out` | complete |
| 2026-06-24 | Claude Verification | Claude Code Verifier returned `SPEC_OK` and `APPROVED`; its sandbox report underclaimed local Python/verify evidence, so closeout relies on both Claude verdict and Orchestrator local command evidence. | `/tmp/WB-2026-06-21-a5-codex-runtime-decision/claude-verifier.out` + local command output | complete |

## Closeout and Retrospective

### Result Summary

- **Final Result:** approved A5 commit candidate. The six subject files form a
  coherent Codex runtime contract and are ready for a separate selective commit
  decision. No staging, commit, or push was performed.
- **Verification Evidence:** native Critic `SUPPLEMENT` disposition complete;
  Claude Code Reviewer `APPROVE`; Claude Code Verifier `SPEC_OK` and
  `APPROVED`; local AST/TOML parses, extended hook fixture matrix,
  secret/private-config scan, `git diff --check`, `bash scripts/bootstrap.sh`,
  and `scripts/verify.sh lite` passed. `git diff --cached --name-only` remained
  empty.
- **Residual Risks:** the first Claude Code Coder attempt was stopped because
  the task files lacked an explicit `Allowed external runtimes/MCPs` field and
  Control Tower misclassified Owner-authorized `mcp-codex` GPT-subagent
  bridging as unauthorized nested external AI tooling. Its repository edits
  stayed within the approved six-path write-set, and the safe-mode rerun plus
  Review/Verification accepted the resulting subject state. `.codex/config.toml`
  remains private and was not read. The broader unrelated dirty tree remains
  unresolved under the parent WB.

### Critic and Review Value

- **Critic used:** yes, native read-only subagent planned.
- **Critic verdict:** initial `RECONSIDER`, then `SUPPLEMENT`; all findings incorporated.
- **What the critic caught:** unresolved `.codex`/report write authority,
  missing portable gate bootstrap contract, untracked scan blindness, incomplete
  tool matrix, mismatched T3 suite, incorrect verdict ownership, and premature
  public-repo classification.
- **What the critic missed:** the plan needed a first-class `Allowed external
  runtimes/MCPs` field so Owner-authorized `mcp-codex` GPT-subagent bridging
  would not be confused with unauthorized external AI tooling.
- **Skip/fallback reason:** not applicable.

### Lessons Learned

- **What worked:** explicit write-set separation, `/tmp` evidence capture, and
  independent local verification of checks that Claude's own sandbox could not
  execute.
- **What did not work:** task wording used an absolute nested-AI prohibition and
  did not record Owner-authorized `mcp-codex`, causing unnecessary stop/safe-mode
  rerun and weaker GPT-subagent coverage. Future Claude Code missions should
  list allowed runtimes/MCPs explicitly before execution.
- **What not to repeat:** treating a declaration hook as a security boundary or
  copying user-level provider configuration into the repository.
- **Evidence wording check:** accepted external AI outputs only as evidence,
  not authority. Closeout distinguishes Claude's reported sandbox limitations
  from local checks actually executed by Orchestrator.
- **Framework updates made:** none planned.
- **Framework updates to consider:** only after evidence from A5 execution.
- **Reusable knowledge created:** portable A5 runtime acceptance matrix.
- **Navigation updates:** deferred to A10; A6 follows A5.
- **Follow-up Work Blocks:** A5 selective commit readiness after successful
  Review/Verification; then A6 workflow docs.
