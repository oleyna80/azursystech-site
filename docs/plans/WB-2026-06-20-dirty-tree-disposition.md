# Work Block: Dirty Tree Inventory and Disposition

## Meta

- **Work Block ID:** WB-2026-06-20-dirty-tree-disposition
- **Parent Work Block:** WB-2026-06-19-repository-reconciliation
- **Date:** 2026-06-20
- **Owner:** azur
- **Stage:** Verification complete / Owner disposition pending
- **Role:** Orchestrator
- **Execution Mode:** staged approval
- **Side-Effect Class:** local-docs; repository inspection is read-only
- **DB Action Mode:** none
- **Verification Tier:** standard
- **Active Profile:** Codex -> Claude Code Handoff with optional Codex model routing overlay

## Objective

Inventory and classify every path in the current dirty working tree, resolve or
surface ownership and portability ambiguity, and freeze exact dependency-aware
disposition manifests that can drive later scoped Work Blocks without touching
the files being classified.

## Expected Final Result

Every path in the frozen subject baseline `B0` has exactly one recorded
disposition: proposed portable commit group, local/private, generated/derived,
deferred to a separate Work Block, or Owner decision required. Exact path
manifests, dependencies, verification tiers, provenance/config risks, and
unresolved decisions are recorded in synchronized reports. The inventory count
reconciles exactly with Git, no classified file is edited or staged, private
payloads are not opened, and commit, push, merge, deploy, dependency, database,
and production actions remain blocked.

## Done Criteria

- [x] The pre-Work-Block `B0` subject baseline is preserved with branch, HEAD, statuses, raw path encodings, and a digest.
- [x] Every baseline path occurs exactly once in the disposition inventory.
- [x] Each path has domain, tracked state, disposition, proposed group, dependency, verification tier, and risk/decision markers.
- [x] Exact group manifests contain no duplicates, omissions, ignored secrets, or paths outside the baseline.
- [x] Native Critic and read-only Claude Code findings are triaged against the live tree.
- [x] Owner decisions and follow-up Work Blocks are explicit; no file is silently classified by assumption.
- [x] Staging remains empty and the working tree differs only by approved planning/report artifacts plus the documented baseline.

## Preflight State

- **Git baseline:** dirty on `feature/showcase-demo-templates` at `1b51896`; the pre-Work-Block subject baseline `B0` contains 41 tracked modifications and 196 expanded untracked paths, 237 total; staging was empty.
- **Branch topology:** current feature is 14 commits ahead and 2 behind `origin/main`; local `main` is 11 ahead and 2 behind `origin/main`.
- **Pre-existing dirty files:** all 237 `B0` paths are pre-existing or prior approved SDLC artifacts; they are inventory subjects, not this Work Block's write authority.
- **Untracked local artifacts:** classification pending. Ignored/private content is checked only through metadata such as `git check-ignore`, never opened.
- **Proceed rule:** Stage 0 may write only this plan, its Critic report, and `.codex/write-gate.md`. A refreshed gate is required before inventory reports are written.

### Baseline Model

- `B0` is the exact NUL-delimited path/status set captured immediately before
  this child Work Block created its plan: 237 subject paths. It is immutable for
  inventory acceptance.
- `C` is the exact control-artifact set authorized by this Work Block. Its B0
  intersection is `.codex/write-gate.md` plus the three approved memory logs.
  Pre-Work-Block log history remains classified in A9; only new append entries
  are control writes. The inventory preserves frozen B0 metadata for all four.
- Inventory set equality is `inventory.paths == B0.paths`.
- Live dirty-path equality is `live.paths == union(B0.paths, C.paths)`. For
  `B0 - C`, status and content metadata must remain unchanged. Any other drift
  blocks execution and requires a new baseline decision.
- Control artifacts are excluded from subject classification only when they are
  not members of `B0`; membership in `C` never silently removes a `B0` path
  from the inventory.

## Dependency Check

### Must Resolve Before Start

- Codex Critic must review this plan and the Orchestrator must disposition every finding.
- The dirty baseline must remain stable between capture and manifest reconciliation, except for approved Work Block artifacts.
- Any path that appears private, credential-bearing, generated, vendor-imported, or production-config related must remain unresolved until evidence or Owner direction supports classification.

### Can Resolve During Work

- Exact proposed commit-group boundaries and ordering.
- Verification commands for each package/domain, using declared local scripts only.
- Whether ambiguous files become separate follow-up Work Blocks or explicit Owner decisions.

## Runtime / Data Mutation Boundary

- **Applies:** no
- **Agent authority:** Orchestrator and analysts may inspect safe repository files and Git metadata; one Coder may later write only approved inventory/report artifacts.
- **Structured action:** not applicable
- **Trusted executor:** local Git and repository read tools under Control Tower supervision
- **Policy and approval:** no runtime/data mutation; all commit, push, merge, deploy, config, dependency, DB, and secret actions require separate approval or are excluded.
- **Audit path:** this plan, Critic report, Claude audit report, inventory/disposition manifests, and review/verification reports.
- **Forbidden direct path:** `.env` contents, credentials, provider/private config, live APIs, live DB, deploy, staging, commit, push, merge, reset, clean, stash, or history rewrite.

## Scope

### In Scope

- Read-only expanded Git inventory of the complete dirty tree.
- Safe path/domain classification and dependency mapping.
- Exact disposition and proposed commit-group manifests.
- Metadata-only ignore, portability, case, EOL, path-length, and provenance-risk checks.
- Read-only native subagent analysis, Codex Critic review, and Claude Code external audit.
- Documentation of unresolved Owner decisions and follow-up Work Blocks.

### Out of Scope

- Editing any of the 237 classified baseline paths, except approved Work Block artifacts already in that baseline.
- Staging, committing, pushing, fetching, merging, rebasing, switching branches, setting upstream, or modifying Git history.
- Application fixes, dependencies, config/env changes, deploy, database, payment, provider, API, or production actions.
- Opening ignored/private files or exposing secrets, tokens, keys, credentials, provider payloads, or private model settings.
- Deleting generated files, pruning worktrees, cleaning caches, or resolving dispositions through destructive cleanup.

## Write-Set

Stage 0 planning write-set:

```text
.codex/write-gate.md
docs/plans/WB-2026-06-20-dirty-tree-disposition.md
docs/reports/critic-WB-2026-06-20-dirty-tree-disposition.md
```

Proposed Stage 1 report write-set, requiring a refreshed gate after Critic:

```text
.codex/write-gate.md
docs/plans/WB-2026-06-20-dirty-tree-disposition-claude-audit-task.md
docs/reports/inventory-WB-2026-06-20-dirty-tree-disposition.yml
docs/reports/disposition-WB-2026-06-20-dirty-tree-disposition.md
docs/reports/external-audit-WB-2026-06-20-dirty-tree-disposition.md
docs/reports/review-WB-2026-06-20-dirty-tree-disposition.md
docs/reports/verification-WB-2026-06-20-dirty-tree-disposition.md
memory_bank/orchestrator-log.md
memory_bank/review-log.md
memory_bank/external-team-log.md
scripts/validate-dirty-tree-inventory.py
```

No directory-wide write grant is implied. Existing history in memory-bank logs
must be preserved and only appended to when the Stage 1 gate explicitly permits it.

The Claude task file and validator are authored by the single report-only
Coder. Claude Code is read-only and writes no repository file. Control Tower
runs `timeout 600s claude -p --permission-mode plan --tools "Read,Glob,Grep" "$(cat docs/plans/WB-2026-06-20-dirty-tree-disposition-claude-audit-task.md)" > /tmp/WB-2026-06-20-dirty-tree-disposition-claude-audit.txt`.
The Coder is the sole repository writer and converts that `/tmp` evidence into
the approved external-audit report; no budget or token limit flag is used.
The validator is a C-B0 control artifact, not a subject inventory entry. Its
observed mode is non-executable `0664` and must remain so unless an explicit
Owner-approved policy change requires executable mode.

## Navigation Impact

- **Files added/moved/removed:** this plan and bounded evidence reports only.
- **PROJECT_MAP.md update needed:** no; report paths already fall under documented plans/reports structure. Reassess only if a new durable artifact class is introduced.
- **FILE_REGISTRY.yml update needed:** no for current report artifacts; reassess if a new SSOT manifest becomes permanent.
- **Session bootstrap or profile docs update needed:** no.
- **Generated/derived/local-only boundary changed:** no; this Work Block records boundaries but does not change ignore policy.

## Commit / Stage Scope

- **Files to stage/commit:** none.
- **Files to leave unstaged:** every dirty path, including all Work Block artifacts; ignored/private/generated files remain untouched.
- **Scope guard:** fresh expanded NUL-delimited status, `git diff --name-only`, `git diff --cached --name-only`, and exact comparison against the approved write-set. `git add .`, `git add -A`, and `git commit -a` are forbidden.

## Acceptance Criteria

- [ ] Inventory path set equals `B0`; live dirty paths equal `union(B0, C)` and all `B0 - C` metadata remains unchanged.
- [ ] Each path appears once and only once; rename/copy entries are normalized without losing both source and destination metadata.
- [ ] Each proposed group has purpose, exact path list, dependencies, verification tier, risk class, and required Owner approval.
- [ ] Private/generated classification is evidence-based; unknown is recorded as `owner-decision-required`, not guessed.
- [ ] Analyst, Critic, and Claude outputs list inspected and uninspected areas and are treated as evidence only.
- [ ] No tracked/untracked subject file, ignore rule, application file, config, or runtime file is changed.
- [ ] `git diff --check` passes for Work Block artifacts, secret-pattern scan finds no explicit credentials, and staging remains empty.

## Risks and Mitigations

| Risk | Impact | Mitigation | Stop Condition |
|---|---|---|---|
| Dirty baseline changes during inventory | Omitted or misgrouped paths | Hash/freeze normalized baseline and compare before acceptance | Any unexplained path/status drift |
| Private or credential-bearing file is opened | Secret exposure | Use names and Git/ignore metadata only; exclude payload reads | Suspected secret/private content |
| Config/deploy files are treated as ordinary docs | Unsafe later commit | Assign high-risk marker and separate Owner decision/group | Classification needs runtime assumptions |
| Imported skills/assets lack provenance | Redistribution or license risk | Record source/license evidence or unresolved marker | Provenance cannot be established locally |
| Parallel analysts overlap or contradict | Duplicate or inconsistent records | Partition domains; Control Tower performs uniqueness and evidence checks | Unresolved ownership conflict |
| Reports accidentally become staging authority | Broad unintended commit | State that manifests are proposals; require fresh gate and Owner approval | Any staging/commit request in this WB |
| Path quoting/case/Unicode is mishandled | Windows mismatch or missing path | Use NUL-delimited Git data and byte-safe manifest generation | Non-round-trippable or colliding path |

## Stage 0 Routing Preflight

- **Work Block type:** non-trivial Work Block
- **Side-effect class:** local-docs with read-only repository inspection
- **DB action mode:** none
- **Hard Stops in scope:** secrets/private config, config/runtime/deploy interpretation, dirty-set drift, scope expansion, staging, commit, push, merge, destructive Git
- **Write gate:** READY for Stage 0 plan artifacts only

### Skill Routing Gate

- **Skills checked:** `subagent-mission-brief`, `scoped-commit-guard`, `index-exclusions-manager`, `verifier`, and `docs/reference/subagent-anti-patterns.md`
- **Skills matched:** all four skills; anti-pattern guidance is a mandatory pre-dispatch read
- **Skills used:** mission boundaries and matrix; exact whitelist/staging prohibition; ignore-boundary checks; independent evidence verdicts
- **Skills skipped and why:** deploy/runtime skills are not invoked because deploy and runtime execution are out of scope.
- **Project-local skill fallback used:** yes

#### Anti-Pattern Preflight

- **Verdict:** PASS with mandatory batching before A-F dispatch.
- **Trivial delegation:** not present; each mission classifies a bounded domain subset.
- **Chain without validation:** avoided; Control Tower validates Critic, A-F, and Claude evidence before each dependent stream.
- **Insufficient context:** each batch receives governance files, its exact `B0` subset, routing rules, and adjacent examples where needed.
- **Over-broad scope:** A-E subsets must be split into batches of 3-15 safe files; no analyst receives more than 15 content files. F may process all paths as Git metadata only and must not inspect content.
- **Decision delegation:** absent; analysts recommend dispositions, while Control Tower and Owner retain acceptance and hard-stop decisions.
- **Reviewer blindness:** independent Critic, Reviewer, and Verifier roles remain separate.

### Subagent Topology

- **Classification:** Subagent-Required
- **Triggers matched:** 237 paths, 15+ top-level domains, product/SDLC/frontend/CI/config-adjacent boundaries, provenance and secret risk, independent review requirement
- **Use Claude Code team:** yes, after native Critic; read-only external audit with bounded task file, no token or monetary budget flags, and a 10-minute operational timeout.
- **Use Codex/GPT critic or verifier:** yes; native Critic in Stage 0 and independent Reviewer/Verifier after inventory artifacts exist.
- **Dispatch plan:** native Critic; corrections and acceptance; `B0` freeze; domain analysts in parallel; Control Tower consolidation; Claude task/report Coder; Claude audit; final report Coder; independent Reviewer; independent Verifier.
- **Skip reason, if any:** none
- **Blocker category, if blocked:** not blocked; use `usage-limit` plus `review-degraded:inline-fallback` only if native subagent service rejects dispatch.

## Subagent Authorization

- Native read-only analyst, Reviewer, and Verifier missions are authorized within the read scopes below.
- One Coder may write only the refreshed Stage 1 report write-set; classified repository files remain read-only.
- Native subagents must not launch Claude Code or any other external AI CLI.
- External AI audit runner: authorized as a separate Control Tower assignment after the native Critic response, using a task file, 10-minute timeout, and local fallback. No token or monetary budget flags.

## Execution Topology

- **Topology:** Control Tower + read-only subagents, then one report-only Coder
- **Context sharing:** scoped prompts; no full-history fork unless needed for the Critic.
- **Subagent assignments:** Agent/SDLC Analyst, Product/Docs Analyst, Showcase Frontend Analyst, Web/Analytics Analyst, CI/Ops/Security Analyst, Git/Portability Analyst, Codex Critic, external Claude auditor, Reviewer, Verifier.

### Parallel Decomposition Matrix

| Stream | Goal | Role | Write-set | Dependencies | Verification | Execution | Reason |
|---|---|---|---|---|---|---|---|
| H Codex Critic | Challenge scope, routing, hard stops, AC, and verification before execution | Reviewer / Architecture Analyst | none | draft plan | Findings-first verdict and evidence gaps | sequential | Must approve a complete draft before any inventory dispatch |
| A Agent/SDLC | Classify the exact governance/documentation prefixes in the routing table | Reviewer / Docs Analyst | none | Critic acceptance and frozen `B0` | Exact paths, provenance/private markers | parallel | Disjoint routed read domain and no writes |
| B Strategy/content | Classify the exact strategy/content prefixes in the routing table | Reviewer / Product Analyst | none | Critic acceptance and frozen `B0` | Exact paths, ownership and dependency evidence | parallel | Disjoint routed read domain and no writes |
| C Showcase | Classify showcase application, demo-kit, assets, and package metadata | Reviewer / Frontend Analyst | none | Critic acceptance and frozen `B0` | Exact paths, generated/dependency markers | parallel | Disjoint routed read domain and no writes |
| D Web/analytics | Classify web routes, components, localization, tests, and analytics consent | Reviewer / Frontend and QA Analyst | none | Critic acceptance and frozen `B0` | Exact paths, feature/test coupling | parallel | Disjoint routed read domain and no writes |
| E CI/ops/config | Classify workflows, Docker, proxy, deploy, env example, and ignore boundaries | Reviewer / Security Analyst | none | Critic acceptance and frozen `B0` | Risk class, secret/config boundary, exact paths | parallel | Disjoint routed read domain; high-risk findings remain read-only |
| F Git/portability | Validate branch metadata, statuses, ignored boundaries, case/EOL/path portability | Reviewer / Architecture Analyst | none | Critic acceptance and frozen `B0` | Count/hash reconciliation and portability evidence | parallel | Cross-cutting Git metadata only; no disposition ownership |
| G Consolidation | Merge A-F evidence into one unique disposition model and identify Owner decisions | Orchestrator | none during analysis | A-F complete | No duplicates/omissions; AC coverage | local | Acceptance authority and shared manifest require one Control Tower owner |
| J1 Task/report draft | Write validator, baseline inventory, disposition draft, and exact Claude task | Coder / Docs Analyst | exact Stage 1 script/report/task paths | G complete; refreshed READY gate | Schema/count checks and diff scope | sequential | Claude requires stable inputs and one repository write owner |
| I Claude audit | Challenge domain coverage and proposed dispositions as an external read-only audit | Reviewer / External Audit Runner | none | J1 task and draft reports | Evidence-linked findings and inspected gaps | sequential | Audit must evaluate the consolidated proposal through a bounded task |
| J2 Report finalization | Convert `/tmp` Claude evidence and triage it in approved reports | Coder / Docs Analyst | exact Stage 1 report paths | I complete | Finding dispositions and diff scope | sequential | Same single repository write owner; external output is not self-accepting |
| K Review | Check spec compliance, then report quality | Reviewer / QA Analyst | none | J2 complete | `SPEC_OK` or `SPEC_GAPS`, then quality verdict | sequential | Review requires stable implementation artifacts |
| L Verification | Independently rerun reconciliation and safety checks | Verifier / Repository Verifier | none | K `SPEC_OK` | `APPROVED`, `NEEDS_CHANGES`, or `BLOCKED` | sequential | Independent verification requires reviewed final artifacts |

### Mission Briefs

All missions inherit the active model/reasoning unless Control Tower records a
specific reason. Base role remains `Reviewer` for A-F, H, I, K and `Verifier`
for L. Approved write-set is `none. Read-only.` Hard stops are scope expansion,
secret/private payload discovery, required config/runtime assumptions,
unrelated dirty drift, unavailable required evidence, or any side effect.

Each A-F mission receives only its matrix domain and the normalized baseline
subset. Allowed tools are `rg`, `sed`, `git status`, `git diff`, `git ls-files`,
and `git check-ignore` against safe paths. Required output is: verdict; exact
paths inspected/uninspected; proposed dispositions and dependencies; evidence;
risks/blockers; next action. Acceptance owner and handoff target are Control
Tower Stage 0. Sibling streams are the other A-F missions.

### Exact Domain Routing

Routing is applied to `B0` in table order. A path is assigned to the first
matching owner; later streams must exclude paths already assigned. Control
Tower receives every unmatched path and must either assign it explicitly or
mark it `owner-decision-required`; unmatched paths never disappear.

| Owner | Included prefixes/paths | Explicit exclusions |
|---|---|---|
| A Agent/SDLC | `.agent/`, `.claude/`, `.codex/`, `memory_bank/`, `AGENTS.md`, `PROJECT_MAP.md`, `FILE_REGISTRY.yml`, `docs/plans/`, `docs/reports/`, `docs/reference/`, `docs/specs/`, `docs/tasklist/`, `docs/templates/`, `docs/profiles.md`, `docs/session-bootstrap.md`, `docs/implementation-readiness.md` | This WB's `C - B0` control artifacts; `docs/deployment/` |
| B Strategy/content | `00_strategy/`, `01_brand/`, `02_website/`, `03_leads/`, `04_facebook/`, `05_ai/`, `06_seo/` | `07_ops/`; all `docs/` paths owned by A or E |
| C Showcase | `showcase/`, `DEMO_TEMPLATES_STRATEGY.md` | none |
| D Web/analytics | `web/` | none |
| E CI/ops/config | `.github/`, `07_ops/`, `docs/deployment/`, `.agentsignore`, `.codexignore`, `.env.vps.example`, `.gitattributes`, `.gitignore`, `Dockerfile.proxy`, `deploy.sh`, `docker-compose.vps.yml`, `nginx.proxy.conf` | ignored/private payload contents; metadata only for `.env.vps.example` until Security Analyst confirms safe example status |
| F Git/portability | Cross-cutting metadata validation only; no disposition ownership | all content classification; F reports collisions/drift to the owning stream |
| G Control Tower | Any unmatched `B0` path | none; explicit assignment or Owner decision is mandatory |

The Critic mission H reads this plan, `AGENTS.md`, the SDD protocol, parent WB,
and relevant project-local skills. It returns findings ordered by severity,
verdict `APPROVE`, `SUPPLEMENT`, or `RECONSIDER`, inspection gaps, and required
changes. It is read-only and hands off to Control Tower.

The external Claude mission I uses the same read-only authority and receives a
separate bounded task file. It may inspect safe Git-visible files only, cannot
open ignored/private config, cannot write or run nested agents, and returns
evidence rather than acceptance.

## Codex Critic

- **Required:** yes; the Work Block spans many domains and defines later public-repo commit boundaries.
- **Mode:** native-subagent
- **Verdict:** APPROVE after RECONSIDER and SUPPLEMENT corrections
- **Report path:** `docs/reports/critic-WB-2026-06-20-dirty-tree-disposition.md`
- **Orchestrator response:** accepted all seven initial findings and four repeat supplements. Added `B0`/`C` set semantics, corrected dispatch order, exact disjoint routing, exact Claude task/output authority, executable schema/checks, child/parent authority, per-path drift evidence, and anti-pattern batching. Final Critic verdict is APPROVE.

## External Review Inputs

- **External reports/prompts:** `docs/plans/WB-2026-06-20-dirty-tree-disposition-claude-audit-task.md`; stdout was captured under `/tmp` by the approved runner and summarized in `docs/reports/external-audit-WB-2026-06-20-dirty-tree-disposition.md` by the sole repository writer.
- **Triage rule:** every external finding is marked confirmed, partially confirmed, stale/resolved, rejected, or needs-more-proof against the live tree.
- **Local verification required before accepting any finding:** yes; external output is evidence only.
- **Execution evidence:** Claude Code `2.1.183`; first input-substitution attempt failed immediately, stdin sandbox invocation returned `ConnectionRefused`, approved network rerun exited `0`; no token or monetary budget flags; 600-second timeout; stdout 154 lines and 16,299 bytes.
- **Coverage limitation:** Claude received the task contents as its prompt but did not separately read the task source path and could not read B0 under `/tmp`. This is an external chain-of-custody/coverage limit. No B0 repository copy is authorized; K/L must independently recheck count, hash, and raw fields.

## Review K

- **Initial verdict:** `NEEDS_CHANGES` / `SPEC_GAPS`.
- **Finding:** C2 depended on C3/D2 while C3 and D2 depended on C2; the validator checked reference integrity but did not reject internal group cycles.
- **Fix:** merged the exact 29 C2, 2 C3, and 3 D2 entries into `C2D2-showcase-integration-atomic-hold` (34 paths), preserving entry domain owners and conservative dispositions. The boundary represents one focused future showcase/main-web integration Work Block; generated-derived membership does not imply commit worthiness.
- **Dependencies:** only unresolved external gates remain: Owner integration decision, asset provenance, showcase fixes, generated-artifact regenerate-and-compare, and T1-T3 verification.
- **Validator:** internal group dependencies are now checked as a directed graph; any cycle fails with its concrete path and remediation. The current model must validate as acyclic.
- **Re-review:** no findings; `SPEC_OK` / `APPROVE`. The Reviewer confirmed validator PASS, exact 237-path/raw equality, 27 groups with 5 acyclic internal edges, the exact 34-path merged boundary (31 C + 3 D), rejection of a synthetic `A -> B -> C -> A` cycle, 42 explicit unresolved external dependencies, all groups not approved to commit, live `244 = B0 union C`, no `B0 - C` drift, append-only logs, empty staging, validator mode `0664`, clean scans, and documented Claude limitations.
- **Report:** `docs/reports/review-WB-2026-06-20-dirty-tree-disposition.md`.
- **Status:** Review K complete. Verification L remains pending; no Verification or group approval is claimed.

## Verification Plan

- **Canonical path encoding:** repository-relative POSIX display path normalized to UTF-8 NFC plus required `path_b64` containing the unmodified Git path bytes; comparisons use decoded `path_b64`, never shell line splitting.
- **Inventory schema:** JSON-compatible YAML `schema_version: 1`; `work_block`; exact `baseline`; coverage/portability/control metadata; declared `groups`; structured `external_dependencies`; and 237 `entries` with the required raw and classification fields.
- **Canonical checks:** capture `git status --porcelain=v1 -z -uall` without shell line parsing; run `git rev-parse --abbrev-ref HEAD` and `git rev-parse HEAD`; store status plus SHA-256 content digest for each regular file in `B0 - C` and compare both at acceptance; run `python3 scripts/validate-dirty-tree-inventory.py --baseline /tmp/WB-2026-06-20-dirty-tree-disposition-B0.json --inventory docs/reports/inventory-WB-2026-06-20-dirty-tree-disposition.yml`; the validator base64-decodes paths, rejects duplicates, asserts inventory paths equal frozen `B0`, resolves every dependency to a group or external registry key, rejects internal group cycles with an actionable cycle path, validates the exact merged showcase boundary, validates dual-role controls and non-executable validator mode, verifies live paths equal `B0 | C`, verifies status/content digests for `B0 - C`, and checks empty staging; run scoped whitespace checks for tracked and untracked Work Block artifacts; run the credential-pattern scan only against exact Work Block artifacts.
- **Scoped fallback checks:** path-count and set reconciliation with standard Git tools; mark unavailable canonical checks `UNVERIFIED` with reason, never `PASS`.
- **Browser smoke:** not applicable; no frontend implementation or runtime launch.
- **Evidence expected:** baseline hash/count, parse output, missing/extra/duplicate result sets, changed-file list, staging evidence, Critic/Claude/Reviewer/Verifier reports.
- **Skipped checks:** application builds/tests, compose rendering, deploy checks, and browser smoke are intentionally deferred to later implementation Work Blocks because this WB changes reports only.

## Stop Conditions

- Any unexplained baseline drift after freeze.
- Any suspected secret, credential, private provider/model setting, or ignored private payload.
- Classification requires editing/reading forbidden config or making runtime, deploy, DB, payment, dependency, or production assumptions.
- Scope expansion beyond exact report artifacts or any request to stage, commit, push, fetch, merge, switch, reset, clean, stash, delete, or rewrite history.
- Provenance/license cannot be established for a path proposed as portable.
- Native/Claude/Reviewer/Verifier evidence reveals unresolved omissions or contradictory ownership.
- Required verification fails or remains unacceptably `UNVERIFIED`.

## Rollback / Recovery

Only approved documentation artifacts may change. Revert this Work Block's own
new report edits with a reviewed patch if needed; do not use reset, checkout,
clean, stash, or deletion. Classified baseline files are never modified, so no
product/runtime rollback should be necessary.

## SSOT Updates

- **Tracked/synchronized SSOT paths:** this plan and approved reports. This child supersedes only the parent's stale inventory baseline/count and path-disposition evidence; the parent's integration, commit, push, and Windows reproduction objective remains authoritative and blocked. Parent synchronization requires a later explicit write-set.
- **Local-only/ignored SSOT paths and reason:** private provider/model/API configuration, secrets, raw external transcripts, caches, and machine state.
- **Direct evidence markers to verify with `rg -n`:** Work Block ID, `237`, `Subagent-Required`, `PENDING`, `no token or monetary budget flags`, and `staging remains empty`.
- **`git check-ignore -v` result for workflow docs:** to be checked during verification; synchronized workflow artifacts must not be ignored.

## Execution Log

| Time | Stage | Action / Decision | Evidence | Status |
|---|---|---|---|---|
| 2026-06-20 | Plan | Captured expanded dirty-tree preflight | 41 modified + 196 untracked = 237; staging empty | complete |
| 2026-06-20 | Plan | Classified topology and constrained Stage 0 gate | Subagent-Required; plan artifacts only | complete |
| 2026-06-20 | Plan | Independent Codex Critic reviewed the draft | RECONSIDER; seven findings | complete |
| 2026-06-20 | Plan | Applied all Critic findings | `B0`/`C`, order, routing, Claude paths, checks, authority | complete |
| 2026-06-20 | Plan | Repeat and final Critic audits completed | SUPPLEMENT resolved; final APPROVE | complete |
| 2026-06-20 | Implementation / J1 | Consolidated A-F evidence and drafted exact inventory, validator, disposition, and Claude task | Validator PASS; 237 unique B0 paths; no staging | complete |
| 2026-06-20 | External Audit / I | Ran bounded read-only Claude audit | `SUPPLEMENT`; 154 lines/16,299 bytes; B0 inaccessible to Claude | complete |
| 2026-06-20 | Implementation / J2 | Triaged F1-F8 and added control, dependency, locale, and ignore-probe clarifications | all findings dispositioned; validator and external report updated | complete |
| 2026-06-20 | Review / K | Initial native spec review | `NEEDS_CHANGES`: C2/C3/D2 cycle; validator lacked cycle rejection | complete |
| 2026-06-20 | Implementation / Review-fix | Merged C2/C3/D2 into one 34-path boundary and added internal cycle detection | 27-group acyclic model; entry semantics preserved | complete |
| 2026-06-20 | Review / K re-review | Re-run native spec and quality review | no findings; `SPEC_OK` / `APPROVE`; report recorded | complete |
| 2026-06-21 | Verification / L | Native verifier dispatch attempted | unavailable: subagent `usage-limit`; no checks executed by subagent | blocked; inline fallback selected |
| 2026-06-21 | Implementation / Verification-control-fix | Verification preflight found stale lifecycle control-set and missing ephemeral B0 file | review report/review log absent from `C`; B0 reconstructible from frozen inventory metadata | in progress |
| 2026-06-21 | Verification / L | Inline fallback reconciliation and safety checks | `APPROVED`; independence degraded by verifier `usage-limit`; report recorded | complete |

## Closeout and Retrospective

Verification is complete. Owner disposition remains required before any group,
staging, commit, push, or follow-up implementation action.

### Result Summary

- **Final Result:** exact 237-path dirty-tree inventory and 27-group disposition model completed; no group is approved to stage or commit.
- **Verification Evidence:** canonical validator PASS, synthetic cycle rejection, bootstrap PASS, clean staging/whitespace/credential scans, non-ignored workflow artifacts, validator mode `0664`, and preserved prefixes for all three dual-role logs. See `docs/reports/verification-WB-2026-06-20-dirty-tree-disposition.md`.
- **Residual Risks:** 42 external dependencies remain unresolved; private/config/provenance and generated-artifact decisions require Owner-directed follow-up. Independent Verifier execution was unavailable due `usage-limit`, and the ephemeral B0 file required reconstruction from frozen inventory metadata after Review K had independently confirmed original equality.

### Critic and Review Value

- **Critic used:** yes; native-subagent
- **Critic verdict:** APPROVE after RECONSIDER and SUPPLEMENT corrections
- **What the critic caught:** self-referential baseline, contradictory order, overlapping domains, missing Claude task authority, non-executable checks, parent/child ambiguity, and missing anti-pattern preflight.
- **What the critic missed:** the initial cross-domain group cycle and lifecycle growth of `C` after J2.
- **Skip/fallback reason:** Verification L used an inline Orchestrator fallback because native verifier dispatch stopped at `usage-limit` before running checks.

### Lessons Learned

- **What worked:** exact raw-path inventory, executable set validation, independent Review K, bounded Claude supplement, and append-only control logs.
- **What did not work:** ephemeral-only B0 retention across the date/session boundary and a validator control-set frozen too early in the lifecycle.
- **What not to repeat:** treating broad inventory buckets as staging authority.
- **Evidence wording check:** complete; independent Review K evidence is distinguished from degraded inline Verification L.
- **Framework updates made:** none
- **Framework updates to consider:** none identified yet
- **Reusable knowledge created:** exact inventory/disposition manifests, dependency registry, cycle-rejecting validator, and explicit lifecycle control-set model.
- **Navigation updates:** none planned
- **Follow-up Work Blocks:** exact implementation/review groups derived from Owner-approved dispositions
