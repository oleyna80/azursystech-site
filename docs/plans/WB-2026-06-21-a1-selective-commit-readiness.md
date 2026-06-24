# Work Block: A1 Selective Commit Readiness

## Meta

- **Work Block ID:** `WB-2026-06-21-a1-selective-commit-readiness`
- **Parent Work Block:** `WB-2026-06-20-dirty-tree-disposition`
- **Predecessor:** `WB-2026-06-21-a1-agent-runtime-claude-coder-pilot`
- **Date:** 2026-06-21
- **Owner:** azur
- **Stage:** Closeout complete / pushed
- **Role:** Orchestrator
- **Execution Mode:** staged approval
- **Side-Effect Class:** public-repo
- **DB Action Mode:** none
- **Verification Tier:** T2 / standard
- **Active Profile:** Codex -> Claude Code Handoff

## Objective

Prepare an auditable selective staging candidate for the exact verified
eight-path A1 agent-runtime group while leaving every unrelated dirty path
unstaged. Use Claude Code for a bounded read-only commit-boundary audit, keep
the shared Git index under Codex control, and stop for a separate Owner decision
before commit.

## Expected Final Result

Exactly the eight A1 paths are staged and their staged content matches the
already approved A1 runtime contract. All other dirty and untracked paths remain
unstaged and unchanged. Claude Code supplies a read-only manifest/audit report;
native Review and Verification independently approve the staged diff. No
subject-worktree edit, secret/config access, commit, push, branch operation, deploy,
dependency, application, or DB action occurs. The Owner receives the exact
staged manifest, proposed commit message, verification evidence, and a distinct
commit approval gate.

## Done Criteria

- [x] Native Critic approves or supplements this plan with all findings dispositioned.
- [x] Owner explicitly approves implementation of this Work Block.
- [x] Claude Code completes the read-only commit-boundary audit without writes.
- [x] Control Tower accepts or rejects every Claude finding against local evidence.
- [x] Only the exact eight A1 paths are staged.
- [x] Staged content passes scope, policy, body-equivalence, whitespace, and secret checks.
- [x] Independent Reviewer returns `SPEC_OK` / `APPROVED`.
- [x] Independent Verifier returns `APPROVED`.
- [x] Commit and push performed only after separate Owner confirmations.

## Preflight State

- **Git baseline:** dirty on `feature/showcase-demo-templates`; staging empty.
- **Pre-existing dirty files:** the parent WB inventories the dirty tree. A1 is
  the exact eight-path group; application, showcase, config, deployment,
  strategy, imported skills, memory history, navigation, and other workflow
  artifacts remain unrelated to this WB.
- **Untracked local artifacts:** numerous parent-inventoried paths remain
  untracked; none is authorized for staging here.
- **Proceed rule:** use only explicit pathspecs; freeze the worktree during
  staging and immediate post-stage verification; abort and unstage the exact
  whitelist if any staged path or content differs from the accepted manifest.

## Dependency Check

### Must Resolve Before Start

- Critic verdict and disposition.
- Owner approval of this plan and its exact future staging whitelist.
- Claude audit must confirm the A1 group still matches the predecessor's final
  subject snapshot or identify all drift before staging.

### Can Resolve During Work

- Final commit-message wording.
- Benign terminology matches from staged secret scans, provided each is
  explicitly classified from staged content.

## Accepted A1 Baseline

The durable baseline below was transcribed from the predecessor's final
review-fix snapshot at
`/tmp/WB-2026-06-21-a1-agent-runtime-claude-coder-pilot-reviewfix-post2/sha256.txt`.
The predecessor Verification report records that these values matched its final
post-snapshot. Current worktree hashes were recomputed during this Plan stage
and match all eight values. The `/tmp` file is provenance only; this table is
the durable comparison authority for this WB.

| Path | Accepted SHA-256 |
|---|---|
| `AGENTS.md` | `a91a9301db162b9fdeb77580b064a5d8fdedec4b370ec99416ab6d10e3937d4b` |
| `.agent/ROSTER.md` | `76f3a249961b575504cabe6274d34e7a6a59b140211bc7f6fcca7a3162036741` |
| `.agent/skills/ai-runtime-ops/SKILL.md` | `c5fb4910649d1a8d1adfea75ac8f214350538f00c0fb0e4800ca0714ac4a92e6` |
| `.agent/skills/lead-response-ops/SKILL.md` | `a746600849db3b12cacd232c154be66f1285f3ecb5aa48a8f878a60c8462135a` |
| `.agent/skills/nextjs-seo-build-verifier/SKILL.md` | `d736e81383864f902de9ed7020698ed7d6cae7ae15ae284347b43aea9c84d1e4` |
| `.claude/skills/ai-runtime-ops/SKILL.md` | `596bb72fa023321d0550edb925c50763812ba07ad2899d3acda97c42d4500502` |
| `.claude/skills/lead-response-ops/SKILL.md` | `c07f7137c864a72aa723101947a42e6f667716c7b81b03f038c857dba3c2cc7b` |
| `.claude/skills/nextjs-seo-build-verifier/SKILL.md` | `7fbd83be4cdc129a16d477eb57a1c90fb16a8ebb525a2e18cfe833cf3d030929` |

## Runtime / Data Mutation Boundary

- **Applies:** no runtime or data mutation; Git index mutation only.
- **Agent authority:** Claude Code is read-only; the scoped Codex Coder may
  stage only the exact whitelist after approval.
- **Structured action:** `git-index / stage / exact-eight-A1-paths / medium-risk`.
- **Trusted executor:** local Git CLI invoked by the scoped Codex Coder.
- **Policy and approval:** plan approval authorizes selective staging and its
  exact-whitelist rollback only; commit and push require later explicit Owner approval.
- **Audit path:** this plan, Claude audit capture/report, Review report,
  Verification report, and final staged manifest.
- **Forbidden direct path:** `git add .`, `git add -A`, `git commit -a`, broad
  pathspecs, destructive reset/checkout/clean, or staging through Claude Code.

## Scope

### In Scope

- Read-only Claude Code audit of the exact A1 commit boundary.
- Freeze and compare the eight A1 paths against accepted predecessor evidence.
- Selective staging of the exact eight paths by Codex after approval.
- Review and verification of staged content and exclusion of all other paths.
- Proposed commit message: `docs(sdlc): align active agent runtimes`.

### Out of Scope

- Any subject-worktree content edit, including opportunistic cleanup.
- Staging any path outside the exact A1 whitelist, including Control Tower
  plans, reports, logs, `.codex/`, navigation files, and memory-bank updates.
- `.claude/settings.json`, `.env*`, provider/model/API configuration, secrets,
  application source, showcase, dependencies, config, deploy, DB, or production.
- Commit, push, merge, branch switch, fetch, rebase, tag, release, or cleanup.
- Starting A2-A10 or any B-E dirty-tree group.

## Write-Set

Subject worktree write-set: none.

Lifecycle control write-set after Owner approval:

```text
docs/plans/WB-2026-06-21-a1-selective-commit-readiness-claude-task.md
docs/reports/external-audit-WB-2026-06-21-a1-selective-commit-readiness.md
docs/reports/review-WB-2026-06-21-a1-selective-commit-readiness.md
docs/reports/verification-WB-2026-06-21-a1-selective-commit-readiness.md
```

These paths hold instructions or sanitized evidence only and remain unstaged.

Future Git index whitelist after Owner approval:

```text
AGENTS.md
.agent/ROSTER.md
.agent/skills/ai-runtime-ops/SKILL.md
.agent/skills/lead-response-ops/SKILL.md
.agent/skills/nextjs-seo-build-verifier/SKILL.md
.claude/skills/ai-runtime-ops/SKILL.md
.claude/skills/lead-response-ops/SKILL.md
.claude/skills/nextjs-seo-build-verifier/SKILL.md
```

Control Tower plan/review artifacts may be written during lifecycle stages but
must remain unstaged in this WB.

## Navigation Impact

- **Files added/moved/removed:** only WB control artifacts; no subject path changes.
- **PROJECT_MAP.md update needed:** no; no durable structure changes.
- **FILE_REGISTRY.yml update needed:** no; no registry boundary changes.
- **Session bootstrap or profile docs update needed:** no.
- **Generated/derived/local-only boundary changed:** no.

## Commit / Stage Scope

- **Files to stage/commit:** exact eight-path A1 whitelist above.
- **Files to leave unstaged:** every other tracked modification and untracked
  path, including this WB's plans/reports/logs and private/config-sensitive files.
- **Scope guard:** compare NUL-safe staged names to a sorted exact manifest;
  inspect `git diff --cached --` only for the whitelist; require no staged
  additions outside it.
- **Rollback guard:** on any failure run only
  `git restore --staged -- <exact-eight-paths>` and confirm staging is empty;
  do not alter worktree content.

## Acceptance Criteria

- [ ] **AC1:** Claude's audit identifies exactly the eight A1 paths, confirms
  predecessor acceptance evidence, reports no proposed extra path, and gives an
  explicit `READY` or `BLOCKED` recommendation.
- [ ] **AC2:** `git diff --cached --name-only -z` equals the exact eight-path
  manifest; all non-A1 dirty paths remain unstaged.
- [ ] **AC3:** staged A1 policy presents Codex and Claude Code as the only active
  runtimes; Qwen/Gemini have no active sections; RooCode/Cline appear only as
  retired or generic safety references.
- [ ] **AC4:** the three staged `.agent`/`.claude` skill bodies are exactly equal
  after frontmatter removal while runtime-specific frontmatter remains valid.
- [ ] **AC5:** staged whitespace and credential scans pass; no private/config
  path or value is staged.
- [ ] **AC6:** Reviewer and Verifier approve; commit and push remain blocked.

## Risks and Mitigations

| Risk | Impact | Mitigation | Stop Condition |
|---|---|---|---|
| Shared index captures unrelated dirty files | mixed or unsafe commit | empty-index preflight, literal eight-path `git add --`, exact NUL-safe comparison | any ninth staged path |
| A1 drift after predecessor Verification | accepted evidence no longer applies | compare current SHA/diff to final predecessor snapshot before staging | any unexplained subject drift |
| Claude overclaims commit readiness | weak acceptance | Claude stays read-only; Control Tower triages; native Reviewer/Verifier rerun checks | missing manifest or unsupported conclusion |
| Secret-like content in staged docs | disclosure | strict staged diff scan and manual classification of every match | unclassified credential-like value |
| Control artifacts accidentally included | commit mixes lifecycle evidence with subject group | exclude all WB artifacts from stage manifest | any control artifact staged |
| Rollback alters worktree | loss of user changes | index-only exact-path unstage; no checkout/reset/clean | rollback requires worktree mutation |

## Stage 0 Routing Preflight

- **Work Block type:** non-trivial Work Block.
- **Side-effect class:** public-repo.
- **DB action mode:** none.
- **Hard Stops in scope:** staging requires approved exact scope; commit and push
  require later explicit Owner confirmation.
- **Write gate:** `READY / PLAN-ONLY`; implementation `BLOCKED` pending Critic
  and Owner approval.

### Skill Routing Gate

- **Skills checked:** `scoped-commit-guard`, `subagent-mission-brief`,
  `reviewer`, `verifier`, `ssot-sync-closeout`.
- **Skills matched:** all listed skills.
- **Skills used:** mission brief for Claude; scoped commit guard for index
  operation; Reviewer and Verifier for acceptance; closeout only after verdict.
- **Skills skipped and why:** production/deploy/DB/frontend skills do not match.
- **Project-local skill fallback used:** no.

### Subagent Topology

- **Classification:** Subagent-Required.
- **Triggers matched:** public-repo side effect, large unrelated dirty tree,
  external runtime delegation, independent staged-diff verification.
- **Use Claude Code team:** yes, one read-only Commit Boundary Analyst.
- **Use Codex/GPT critic or verifier:** yes, Critic before approval and separate
  read-only Reviewer and Verifier after staging.
- **Dispatch plan:** native Critic -> Owner approval -> Claude read-only audit ->
  Control Tower triage -> scoped Codex index Coder -> Reviewer -> Verifier ->
  Owner commit decision.
- **Skip reason, if any:** not applicable.
- **Blocker category, if blocked:** not applicable.

## Subagent Authorization

- Claude Code assignment is read-only and must be provided through a dedicated
  task file after plan approval. It may run `git status`, `git diff`, `rg`,
  hashing, and deterministic comparison commands, but may not edit, stage,
  unstage, commit, push, or invoke another AI runtime.
- Native Reviewer and Verifier are read-only.
- The only write-capable implementation role is the scoped Codex Coder, whose
  authority is limited to the Git index entries for the exact eight paths.
- External AI audit runner: conditionally authorized after Owner plan approval;
  output is evidence, not acceptance.

## Claude Code Assignment

Claude Code can be trusted here for the following bounded work:

1. Reconstruct the exact eight-path A1 candidate manifest from the parent
   inventory and predecessor reports.
2. Compare current A1 content with predecessor final acceptance evidence.
3. Inspect the complete A1 diff for runtime-policy consistency, accidental
   unrelated edits, private/config references, and credential-like values.
4. Re-run deterministic mirrored-body comparison.
5. Return `READY` or `BLOCKED`, exact include/exclude lists, findings, checks,
   residual risks, and proposed commit message.

Claude Code must not stage because the Git index is shared across the entire
dirty tree. This is a boundary decision, not a quality judgment. The previous
A1 pilot already demonstrated that Claude can make a narrow documentation edit
and correct Reviewer findings. This WB tests the next capability safely:
commit-boundary analysis and evidence quality without index risk.

Before and after Claude runs, Control Tower captures the same evidence envelope:

- `git rev-parse HEAD`;
- NUL-safe `git status --porcelain=v1 -z` plus its SHA-256 metadata digest;
- NUL-safe staged manifest plus its SHA-256 metadata digest;
- SHA-256 for each of the eight A1 worktree files.

Claude passes the read-only discipline test only if HEAD, status metadata,
staged manifest, and all eight hashes are byte-identical before and after.

## Execution Topology

- **Topology:** Control Tower + read-only Claude analyst + scoped Codex index Coder + read-only native Reviewer/Verifier.
- **Context sharing:** dedicated task file with exact inputs and output contract.
- **Subagent assignments:** Claude Commit Boundary Analyst; Codex Critic;
  Codex Scoped Commit Operator; Reviewer / Docs Analyst; Verifier / Repository Verifier.

### Parallel Decomposition Matrix

| Stream | Goal | Role | Write-set | Dependencies | Verification | Execution | Reason |
|---|---|---|---|---|---|---|---|
| P0 | Challenge plan and index boundary | Reviewer / Codex Critic | none | plan | Critic contract | sequential | Owner approval depends on reviewed plan |
| A1 | Audit exact commit candidate | Reviewer / Claude Commit Boundary Analyst | none | P0 + Owner approval | manifest, diff, policy, secret and body checks | sequential | current tree must be frozen for attributable evidence |
| T1 | Triage Claude evidence | Orchestrator | control report only | A1 | reproduce material claims | local | Control Tower owns acceptance |
| I1 | Stage exact whitelist | Coder / Scoped Commit Operator | Git index for exact eight paths | T1 accepted | exact staged manifest | sequential | shared index permits one writer only |
| R1 | Review staged spec and quality | Reviewer / Docs Analyst | none | I1 | AC1-AC6 | sequential | review requires stable staged diff |
| V1 | Independently verify staged candidate | Verifier / Repository Verifier | none | R1 `APPROVED` | T2 checks | sequential | final gate must inspect reviewed index |
| C1 | Record evidence and stop at commit gate | Orchestrator | approved reports/logs only | V1 | closeout scan | local | commit requires Owner decision |

## Codex Critic

- **Required:** yes; shared-index operation inside a large dirty tree.
- **Mode:** native-subagent.
- **Verdict:** `SUPPLEMENT`; no blocking finding.
- **Report path:** `docs/reports/critic-WB-2026-06-21-a1-selective-commit-readiness.md`.
- **Orchestrator response:** accepted all three findings: durable hashes,
  staged-blob-only checks, and a Claude pre/post evidence envelope were added.

## External Review Inputs

- **External reports/prompts:** predecessor Claude implementation report and the
  future read-only Claude commit-boundary audit.
- **Triage rule:** external output is evidence, not acceptance.
- **Local verification required before accepting any finding:** yes; every
  manifest, drift, secret, and policy claim affects staging authority.

## Verification Plan

- **Canonical checks:** empty-index preflight; predecessor/current SHA and diff
  comparison; exact NUL-safe staged manifest; `git diff --cached --check`;
  runtime-heading/reference scan, Python stdlib exact body comparison, and
  secret scan all reading index blobs through `git show :<path>` or an
  equivalent temporary extraction; `bash scripts/bootstrap.sh`; then repeat
  the exact staged manifest and staged SHA-256 comparison to detect concurrent
  drift, and confirm all non-A1 paths remain unstaged and HEAD is unchanged.
- **Scoped fallback checks:** none for manifest or staging checks; failure means
  exact-path unstage and `BLOCKED`.
- **Browser smoke:** not applicable.
- **Evidence expected:** Claude capture, sanitized external audit report,
  pre/post index snapshots, Review report, Verification report, exact commands.
- **Skipped checks:** publication/inventory validator is not an A1 staged-content
  validator and models the parent frozen inventory; its non-use must be recorded.

## Stop Conditions

- Staging is non-empty before the index Coder starts.
- Current A1 content differs from accepted predecessor evidence without a new
  reviewed implementation pass.
- Claude requests write/index/private-config authority or reports incomplete scope.
- Any staged path falls outside the exact eight-path whitelist.
- Any secret, credential, private config, dependency, application, deploy, DB,
  destructive Git, branch, merge, commit, or push action becomes necessary.
- Reviewer returns `SPEC_GAPS`, `NEEDS_CHANGES`, or `BLOCKED` after one bounded loop.

## Rollback / Recovery

If staging verification fails, unstage only the exact eight paths with
`git restore --staged -- <exact-eight-paths>`, confirm the index is empty, and
preserve all worktree changes. Do not use reset, checkout, clean, stash, or
automatic worktree correction. A content defect requires a separate approved
implementation WB; this commit-readiness WB does not edit subject files.

## SSOT Updates

- **Tracked/synchronized SSOT paths:** this plan and sanitized lifecycle reports.
- **Local-only/ignored SSOT paths and reason:** raw Claude stdout/stderr in
  `/tmp`; provider/private runtime configuration remains local and unread.
- **Direct evidence markers to verify with `rg -n`:** WB ID, exact eight-path
  manifest, `READY`/`BLOCKED`, Reviewer and Verifier verdicts.
- **`git check-ignore -v` result for workflow docs:** to be checked at closeout;
  these workflow artifacts must not be silently ignored.

## Execution Log

| Time | Stage | Action / Decision | Evidence | Status |
|---|---|---|---|---|
| 2026-06-21 | Plan | Opened exact A1 selective commit-readiness WB | parent inventory + predecessor Verification | complete |
| 2026-06-21 | Plan | Reserved Claude for read-only boundary audit; retained index control in Codex | shared-index risk | planned |
| 2026-06-21 | Plan Review | Critic returned `SUPPLEMENT`; all three findings incorporated | durable baseline + staged-blob checks + evidence envelope | complete |
| 2026-06-21 | Plan Verification | Checked whitespace, bootstrap, Git visibility, secrets, baseline hashes, and empty staging | local command evidence | complete |
| 2026-06-21 | Implementation | Owner approved WB; created bounded read-only Claude task and captured pre-run envelope | task file + `/tmp` evidence | complete |
| 2026-06-21 | Implementation | Sandboxed Claude attempt returned `ConnectionRefused`; escalated calls remained at external-network approval gate and were stopped before process launch | stdout + process check | blocked |
| 2026-06-21 | Implementation | Compared post-attempt envelope to pre-run envelope | HEAD, status digest, staged digest, and eight hashes identical | pass |
| 2026-06-21 | Implementation | Owner manually ran Claude task; external verdict `BLOCKED` on `AGENTS.md` baseline drift | raw `/tmp` output + sanitized external audit | accepted |
| 2026-06-21 | Implementation | Control Tower reproduced drift and confirmed it predates the Claude process | SHA-256, diff, and file timestamps | blocked pending Owner scope decision |
| 2026-06-21 | Implementation | Owner identified the drift as a temporary requested policy block and removed it | Owner statement + restored `a91a...` hash | blocker resolved |
| 2026-06-21 | Implementation | Scoped Coder staged literal exact-eight manifest | staged names + staged SHA-256 | complete |
| 2026-06-21 | Review | Independent Reviewer returned `SPEC_OK / APPROVED` with no findings | review report | complete |
| 2026-06-21 | Verification | Independent Verifier returned `APPROVED`; AC1-AC6 passed | verification report | complete |
| 2026-06-21 | Commit | Owner approved commit; repeated manifest, staged SHA, and whitespace checks; committed exact eight paths | `c0a91e3f7b5545f83aae7a5e0d1c08e4dbbe8154` | complete |
| 2026-06-21 | Publish | Owner approved push; published branch and confirmed local/remote identity | `origin/feature/showcase-demo-templates` at `c0a91e3` | complete |

## Closeout and Retrospective

### Result Summary

- **Final Result:** exact-eight A1 group committed and pushed as `c0a91e3` on
  `origin/feature/showcase-demo-templates`.
- **Verification Evidence:** plan/control-artifact whitespace checks passed;
  bootstrap passed; control artifacts are Git-visible; secret scan passed;
  current A1 hashes match the durable baseline; staging remains empty.
- **Residual Risks:** the shared index remains the primary implementation risk;
  exact-path staging, staged-blob checks, and immediate rollback are mandatory.

### Critic and Review Value

- **Critic used:** yes, native read-only subagent.
- **Critic verdict:** `SUPPLEMENT`; all findings accepted.
- **What the critic caught:** missing durable hashes, insufficiently explicit
  staged-blob checks, and missing pre/post proof of Claude's read-only behavior.
- **What the critic missed:** no additional plan defect identified at closeout.
- **Skip/fallback reason:** not applicable.

### Lessons Learned

- **What worked:** pending.
- **What did not work:** pending.
- **What not to repeat:** broad staging or giving an external runtime shared-index authority.
- **Evidence wording check:** pending.
- **Framework updates made:** none planned.
- **Framework updates to consider:** whether `scoped-commit-guard` should split
  staging readiness from commit/push authority in a future framework WB.
- **Reusable knowledge created:** exact A1 commit-boundary audit contract.
- **Navigation updates:** none planned.
- **Follow-up Work Blocks:** A5 Codex runtime decision; A6 workflow docs only
  after the A5 dependency is resolved.
