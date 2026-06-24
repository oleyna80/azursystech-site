# Work Block: E2/E3 Portability and Ignore Policy

## Meta

- **Work Block ID:** WB-2026-06-24-e2-e3-portability-ignore-policy
- **Parent Work Block:** WB-2026-06-20-dirty-tree-disposition
- **Predecessors:** WB-2026-06-21-a5-codex-runtime-decision; WB-2026-06-24-a6-workflow-docs-readiness
- **Date:** 2026-06-24
- **Owner:** azur
- **Stage:** Plan
- **Role:** Orchestrator
- **Execution Mode:** staged approval
- **Side-Effect Class:** local-docs/workflow now; public-repo only after separate commit/push approval
- **DB Action Mode:** none
- **Verification Tier:** Full security/config boundary plus Deploy-tier local preflight for `.env.vps.example`; no deploy execution
- **Active Profile:** Codex Control Tower, native Codex Critic only, Claude Code Team Runtime for Coder/Reviewer/Verifier
- **Allowed external runtimes/MCPs:** `mcp-codex` only as the Owner-authorized GPT-subagent bridge inside Claude Code. No other external AI runtime or MCP is authorized.

## Objective

Prepare a safe, portable ignore and cross-workplace synchronization boundary so
the Linux workspace and a clean Windows/GitHub clone receive the intended SDLC
and project-control files without committing secrets, private runtime config,
generated output, caches, provider credentials, or machine-local state.

## Expected Final Result

The project has a reviewed selective commit candidate for ignore and portability
policy. `.gitignore`, `.codexignore`, `.agentsignore`, `.gitattributes`, and the
public VPS environment template boundary are internally consistent; SDLC files
needed for cross-workplace work are not accidentally ignored; real `.env*`,
provider keys, private Codex/Claude config, local runtime logs, generated
outputs, and machine caches remain excluded. The Owner receives exact files to
stage, checks run, residual risks, and a commit recommendation. No commit or
push occurs without separate explicit approval.

## Done Criteria

- [x] Current ignore rules are audited against the dirty-tree disposition E2/E3 groups and the Windows clone objective.
- [x] `.gitattributes` exists and defines conservative cross-platform text/EOL policy without altering binary/generated content unexpectedly.
- [x] `.gitignore`, `.codexignore`, and `.agentsignore` distinguish synchronized workflow docs from private/generated/runtime noise.
- [x] `.env.vps.example` is either confirmed as the sole approved env-pattern exception and a placeholder-only public template, or removed from this WB candidate with a recorded reason.
- [x] Claude Code Coder receives a bounded implementation task and changes only the approved write-set.
- [x] Claude Code Reviewer and Verifier provide read-only evidence after implementation.
- [x] Native Codex Critic reviews the plan or final candidate; all findings are dispositioned.
- [x] Secret scans and `git check-ignore` probes confirm that private config stays excluded and intended workflow files remain visible.
- [x] Staging remains empty until the Owner separately approves a selective commit.

## Preflight State

- **Git baseline:** branch `feature/showcase-demo-templates` is synchronized with `origin/feature/showcase-demo-templates` at A6 commit `f2fd3e7`; working tree remains broadly dirty from the parent repository reconciliation.
- **Pre-existing dirty files:** many tracked and untracked files remain outside this WB. This WB may inspect them only as path/status evidence when needed to validate ignore behavior.
- **Untracked local artifacts:** `.gitattributes`, `PROJECT_MAP.md`, `FILE_REGISTRY.yml`, `.codex/*`, `.claude/skills/*`, `00_strategy/` through `07_ops/`, showcase files, docs/reports/specs/tasklist, and memory-bank artifacts remain present. Only paths in the approved write-set may be modified.
- **Proceed rule:** plan creation and implementation were approved by Owner; `.codex/write-gate.md` was refreshed for this WB before Claude Code Coder work. Staging, commit, push, deploy, cleanup, or destructive Git still require separate explicit Owner approval.

## Dependency Check

### Must Resolve Before Start

- Owner approval of this WB plan before any implementation.
- Native Codex Critic review of this plan or an explicit recorded fallback.
- Refreshed `.codex/write-gate.md` for this WB before write-capable Claude Code work.
- Confirmation that `.env.vps.example` is the sole approved env-pattern exception, contains placeholders only, and is intended as a public template; otherwise stop and split it out.

### Can Resolve During Work

- Exact additions/removals in `.codexignore` and `.agentsignore` after comparing intended workflow visibility.
- Whether `.gitattributes` should include only text normalization or also targeted binary rules.
- Whether the final commit candidate should combine E2 and E3 or split `.gitattributes` into a smaller first commit.

## Runtime / Data Mutation Boundary

- **Applies:** no runtime/data mutation; this WB may touch config-boundary files and run local Deploy-tier preflight for `.env.vps.example`, but must not execute deploy or write live state.
- **Agent authority:** Codex Orchestrator controls scope and Git; native Codex Critic is read-only; Claude Code Coder may edit only the approved write-set after Owner approval; Claude Code Reviewer/Verifier are read-only.
- **Structured action:** not applicable in Plan. Later staging would be `git-index / stage / exact-portability-paths / security-config-risk`.
- **Trusted executor:** local Git CLI under Codex Orchestrator control.
- **Policy and approval:** implementation approval authorizes only local file edits inside the write-set. Staging, commit, push, deploy, credential changes, or secret reads require separate approval.
- **Audit path:** this plan, refreshed write gate, Claude Code task/output files, Codex Critic report or inline disposition, local command output, and final Owner report.
- **Forbidden direct path:** `.env`, `.env.*` except the approved `.env.vps.example` template path, `.codex/config.toml`, `.claude/settings.json` payload changes, provider keys, API tokens, private endpoints, live DB, deploy, Docker push, branch switching, stash, reset, clean, broad staging, or generated-output cleanup.

## Scope

### In Scope

```text
.gitattributes
.gitignore
.codexignore
.agentsignore
.env.vps.example
.codex/write-gate.md
docs/plans/WB-2026-06-24-e2-e3-portability-ignore-policy.md
docs/plans/WB-2026-06-24-e2-e3-portability-ignore-policy-claude-coder-task.md
docs/plans/WB-2026-06-24-e2-e3-portability-ignore-policy-claude-review-task.md
docs/plans/WB-2026-06-24-e2-e3-portability-ignore-policy-claude-verifier-task.md
```

Read-only context may include:

```text
AGENTS.md
CLAUDE.md
.agent/ROSTER.md
.agent/workflows/sdd-protocol.md
.agent/skills/index-exclusions-manager/SKILL.md
.agent/skills/scoped-commit-guard/SKILL.md
.agent/skills/subagent-mission-brief/SKILL.md
.agent/skills/security-verification-gate/SKILL.md
.agent/skills/verifier/SKILL.md
docs/reports/disposition-WB-2026-06-20-dirty-tree-disposition.md
docs/reports/inventory-WB-2026-06-20-dirty-tree-disposition.yml
docker-compose.vps.yml
deploy.sh
```

### Out of Scope

- Application source code, tests, showcase implementation, package files, dependencies, database/schema, API behavior, payment/order/client communication, CI workflow changes, Docker/proxy/deploy execution, VPS state, production config, generated-output deletion, or broad cleanup.
- Real `.env*` files except `.env.vps.example`, provider credentials, private keys, tokens, local Claude/Codex runtime config, private model/provider settings, and private transcripts.
- `PROJECT_MAP.md` and `FILE_REGISTRY.yml`; A10 navigation remains last after accepted groups settle.
- Memory-bank history and privacy decisions; those remain A9.
- Commit, push, merge, rebase, branch switch, stash, reset, clean, deletion, or history rewrite.

## Write-Set

Plan-stage write-set:

```text
docs/plans/WB-2026-06-24-e2-e3-portability-ignore-policy.md
```

Future implementation write-set after Owner approval:

```text
.gitattributes
.gitignore
.codexignore
.agentsignore
.env.vps.example
.codex/write-gate.md
docs/plans/WB-2026-06-24-e2-e3-portability-ignore-policy.md
docs/plans/WB-2026-06-24-e2-e3-portability-ignore-policy-claude-coder-task.md
docs/plans/WB-2026-06-24-e2-e3-portability-ignore-policy-claude-review-task.md
docs/plans/WB-2026-06-24-e2-e3-portability-ignore-policy-claude-verifier-task.md
```

No directory-wide write grant is implied.

## Navigation Impact

- **Files added/moved/removed:** this plan now; possible `.gitattributes` and Claude task files later.
- **PROJECT_MAP.md update needed:** no in this WB; A10 navigation remains last.
- **FILE_REGISTRY.yml update needed:** no in this WB; A10 navigation remains last.
- **Session bootstrap or profile docs update needed:** no unless verification proves bootstrap relies on an ignored path; if so, stop and split.
- **Generated/derived/local-only boundary changed:** yes; this is the purpose of the WB. Changes must be explained rule by rule.

## Commit / Stage Scope

- **Files to stage/commit:** none in Plan. Later candidate may include only the approved implementation write-set paths, and only after separate Owner commit approval.
- **Files to leave unstaged:** all application files, showcase files, strategy/content directories, docs outside the task files, memory-bank history, deploy/proxy/Docker files outside `.env.vps.example`, private config, generated output, caches, and unrelated dirty paths.
- **Scope guard:** before any staging, run `git status --short --branch`, `git diff --name-only -- <write-set>`, and `git diff --cached --name-only`; use only `git add -- <explicit paths>`.

## Acceptance Criteria

- [ ] `.gitignore` still excludes `.env`, `.env.*`, `.codex/config.toml`, local provider config, caches, build output, logs, generated runs, and retired runtime artifacts.
- [ ] `.env.vps.example` remains the only approved `.env*` exception and is a placeholder template only; any real value, key, token, password, or connection string blocks the WB.
- [ ] `.codexignore` and `.agentsignore` exclude context noise but do not hide synchronized workflow docs required for cross-workplace SDLC operation.
- [ ] `.gitattributes` is conservative and portable: text normalization is clear, generated/binary outputs are not force-normalized, and Windows clone behavior is documented.
- [ ] `git check-ignore -v --non-matching` or split expected-ignored/expected-visible probes confirm intended tracked/synchronized files are not ignored and private/runtime paths are ignored.
- [ ] Direct secret scan of changed files and staged diff finds no committed secrets; placeholder hits are documented as benign.
- [ ] `git diff --check` passes.
- [ ] `bash scripts/bootstrap.sh` is run if present and remains non-mutating.
- [ ] Deploy-tier local preflight for `.env.vps.example` is run or explicitly marked blocked with reason; no deploy, push, live runtime, or VPS action occurs.
- [ ] Claude Code Coder, Reviewer, and Verifier evidence is captured and triaged by Control Tower.
- [ ] Native Codex Critic verdict is dispositioned before Owner commit decision.

## Risks and Mitigations

| Risk | Impact | Mitigation | Stop Condition |
|---|---|---|---|
| Ignore changes hide workflow SSOT needed on Windows | Cross-workplace clone remains incomplete | `git check-ignore -v` probes for SDLC/control paths | Any required SDLC path remains ignored without rationale |
| Ignore changes expose secrets/private config | Credential or private runtime leakage | Keep `.env*`, private config, keys, caches ignored; secret scan candidate | Any real secret-like value found |
| `.env.vps.example` is treated like ordinary docs | Deploy/runtime config risk | Placeholder-only review; Deploy-aware verification; no deploy execution | Real values or production-only semantics require Owner decision |
| `.gitattributes` changes line endings unexpectedly | Windows/Linux churn or generated file corruption | Conservative text rules; no broad binary rewriting | Diff shows mass EOL churn outside write-set |
| Broad staging captures unrelated dirty tree | Unsafe commit | Scoped commit guard and exact pathspecs only | Any staged path outside whitelist |
| Claude Code writes outside scope | Repository drift | Task file with exact write-set and hard stops | Any out-of-scope modification |

## Stage 0 Routing Preflight

- **Work Block type:** non-trivial Work Block
- **Side-effect class:** local-docs/workflow now; local-test for non-mutating Deploy-tier preflight; public-repo only after separate approval
- **DB action mode:** none
- **Hard Stops in scope:** secrets/private config, credential changes, deploy/runtime execution, production config, broad staging, commit/push, destructive Git
- **Write gate:** BLOCKED for implementation until Owner approves this plan and `.codex/write-gate.md` is refreshed for this WB
- **Threat model classification:** `threat-model-not-needed` for runtime behavior because this WB changes ignore/portability policy and a public env template only; it does not change auth, admin, webhook, storage, schema, payment, redirect, file/path handling, or executable application behavior. Secret/config-boundary verification remains mandatory.

### Skill Routing Gate

- **Skills checked:** `.agent/ROSTER.md`, `index-exclusions-manager`, `scoped-commit-guard`, `subagent-mission-brief`, `security-verification-gate`, `verifier`, `compose-preflight`, `deploy-readiness-gate`, `docs/reference/subagent-anti-patterns.md`
- **Skills matched:** `index-exclusions-manager`, `scoped-commit-guard`, `subagent-mission-brief`, `security-verification-gate`, `verifier`, `compose-preflight`, `deploy-readiness-gate`
- **Skills used:** ignore-rule workflow, scoped commit whitelist/diff/secret-scan portions only, mission brief structure, security/config verification gate, independent verifier output shape, local Deploy-tier preflight expectations
- **Skills skipped and why:** deploy execution portions of `deploy-readiness-gate` are skipped because deploy, Docker push, VPS runtime, and live proof are out of scope
- **Project-local skill fallback used:** yes

### Subagent Topology

- **Classification:** Subagent-Required
- **Triggers matched:** config/ignore boundary, 4+ files, security-sensitive secret boundary, cross-platform synchronization, independent verification before commit readiness
- **Use Claude Code team:** yes. Claude Code owns Coder, Reviewer, and Verifier missions after Owner approval.
- **Use Codex/GPT critic or verifier:** native Codex subagent only as Critic; no native Codex Coder/Verifier.
- **Dispatch plan:** Codex Critic reviews Stage 0 plan; Control Tower refreshes gate; Claude Code Coder edits approved write-set; Claude Code Reviewer performs read-only review; Claude Code Verifier performs read-only verification; Codex Critic reviews final candidate if risk remains; Control Tower consolidates.
- **Skip reason, if any:** none
- **Blocker category, if blocked:** not applicable

## Subagent Authorization

- Native Codex subagent authorization is limited to Critic review only.
- Claude Code is authorized after Owner approval to run one write-capable Coder mission over the implementation write-set.
- Claude Code Reviewer and Verifier are read-only and must not edit files.
- No artificial token or monetary budget limit is assigned to Claude Code. Operational shell timeouts may be used only to prevent a hung process and are not a model budget.
- External AI/MCP use is limited to `mcp-codex` inside Claude Code when explicitly needed for GPT-subagent support already authorized by Owner.

## Execution Topology

- **Topology:** Control Tower + native Critic + Claude Code Coder/Reviewer/Verifier
- **Context sharing:** scoped task files; no broad private transcript or secret context
- **Subagent assignments:** see matrix below

### Parallel Decomposition Matrix

| Stream | Goal | Role | Write-set | Dependencies | Verification | Execution | Reason |
|---|---|---|---|---|---|---|---|
| Plan Critic | Review scope, gates, and hard-stop coverage | Native Codex Critic / Reviewer | none | Plan exists | Findings dispositioned | sequential | Must complete before implementation approval |
| Ignore implementation | Edit ignore/gitattributes/template boundary only | Claude Code / Coder | approved implementation write-set | Owner approval, refreshed write gate | diff check, check-ignore probes, secret scan | sequential | One write-capable Coder per write-set |
| Read-only review | Find policy, scope, portability, and secret-boundary defects | Claude Code / Reviewer | none | Implementation candidate | findings first, scoped to candidate | sequential | Review needs candidate diff |
| Verification | Prove AC and checks | Claude Code / Verifier | none | Reviewer findings dispositioned | SPEC_OK/APPROVED or BLOCKED | sequential | Verification depends on final candidate |
| Commit readiness | Prepare exact stage list and message | Control Tower / Orchestrator | none unless Owner approves commit | Verification approved | scoped-commit-guard whitelist/diff/secret-scan only before separate commit approval | local | Git acceptance stays with Control Tower |

## Codex Critic

- **Required:** yes
- **Mode:** native-subagent if available; fallback-same-session only if native subagent tooling is blocked
- **Verdict:** pending
- **Report path:** inline final response or future `docs/reports/critic-WB-2026-06-24-e2-e3-portability-ignore-policy.md` if Owner approves report artifact
- **Orchestrator response:** required for every SUPPLEMENT/RECONSIDER finding before implementation starts

## External Review Inputs

- **External reports/prompts:** future Claude Code Coder/Reviewer/Verifier task files listed in the write-set
- **Evidence input paths:** `/tmp/WB-2026-06-24-e2-e3-portability-ignore-policy-claude-*.out` and `.err`, if Claude Code is run from shell
- **Triage rule:** external reviewer output is evidence, not acceptance
- **Local verification required before accepting any finding:** yes

## Verification Plan

- **Canonical checks:**
  - `git status --short --branch`
  - `git diff --check`
  - `git diff --name-only -- .gitattributes .gitignore .codexignore .agentsignore .env.vps.example`
  - `git check-ignore -v .env .env.local .codex/config.toml .claude/settings.json node_modules/ web/.next/`
  - `git check-ignore -v --non-matching docs/session-bootstrap.md docs/profiles.md PROJECT_MAP.md FILE_REGISTRY.yml .gitattributes .gitignore .codexignore .agentsignore .env.vps.example`
  - local Deploy-tier preflight for `.env.vps.example`: `docker compose -f docker-compose.vps.yml --env-file .env.vps.example config` if Docker Compose is available, otherwise record `BLOCKED` with tool availability reason
  - `bash -n deploy.sh` if `deploy.sh` remains readable and present
  - `bash scripts/bootstrap.sh` if present
  - staged or candidate diff secret scan for `DATABASE_URL|token|secret|password|api_key|api-key|PRIVATE KEY|BEGIN RSA|BEGIN OPENSSH|BEGIN EC`
- **Scoped fallback checks:** if `scripts/secret-scan.sh` is unavailable, use manual `rg -n` over changed files and staged diff.
- **Browser smoke:** not applicable.
- **Evidence expected:** command output summaries, changed-file list, check-ignore decisions, secret-scan triage, Claude Code reviewer/verifier verdicts.
- **Skipped checks:** live deploy, Docker image push, VPS runtime proof, and live log proof are skipped because no deploy or live runtime action is authorized. Local Deploy-tier preflight is required for `.env.vps.example`.

## Stop Conditions

- Any real secret, private endpoint, provider credential, private key, token, or non-placeholder password appears in candidate files.
- Implementation requires editing application source, deploy scripts, Docker/proxy files, CI workflows, or production config outside the write-set.
- `.env.vps.example` requires real production values or credential rotation.
- `git check-ignore` shows required synchronized workflow files remain ignored without a deliberate documented reason.
- Claude Code changes out-of-scope files.
- Verification returns BLOCKED or equivalent.
- Commit/push/deploy/destructive Git is requested without explicit Owner approval.

## Rollback / Recovery

Before commit, rollback is limited to applying a reverse patch for this WB's
exact write-set or manually restoring from `git diff -- <write-set>`. Do not use
`git reset --hard`, `git checkout -- .`, `git clean`, or branch switching. If
Claude Code edits out-of-scope files, stop and ask Owner before any recovery
operation.

## SSOT Updates

- **Tracked/synchronized SSOT paths:** `.gitignore`, `.codexignore`, `.agentsignore`, `.gitattributes`, `.env.vps.example` if approved as public template
- **Local-only/ignored SSOT paths and reason:** `.codex/config.toml`, `.claude/settings.json`, `.env*`, caches, logs, generated runs, private provider config remain local-only/private
- **Direct evidence markers to verify with `rg -n`:** `mcp-codex`, `.codex/config.toml`, `.env`, `05_ai/runs`, `PROJECT_MAP.md`, `FILE_REGISTRY.yml`
- **`git check-ignore -v` result for workflow docs:** pending implementation verification

## Execution Log

| Time | Stage | Action / Decision | Evidence | Status |
|---|---|---|---|---|
| 2026-06-24 | Plan | Created Stage 0 plan for E2/E3 portability and ignore policy | Owner request; dirty-tree disposition; SDD protocol; project-local skills | completed |
| 2026-06-24 | Review | Native Codex Critic reviewed the plan and all SUPPLEMENT findings were resolved | Critic final verdict: APPROVE | completed |
| 2026-06-24 | Implementation | Owner approved implementation; write gate refreshed and Claude Code Coder task created | `.codex/write-gate.md`; `docs/plans/WB-2026-06-24-e2-e3-portability-ignore-policy-claude-coder-task.md` | ready for Claude Code Coder |
| 2026-06-24 | Implementation | Claude Code Coder produced candidate, then fixed `.env.vps.example` visibility and ASCII hygiene gaps | Claude Code stdout in `/tmp/WB-2026-06-24-e2-e3-portability-ignore-policy-claude-coder*.out` | ready for read-only review |
| 2026-06-24 | Review / Verification | Claude Code Reviewer and Verifier task files created | `docs/plans/WB-2026-06-24-e2-e3-portability-ignore-policy-claude-review-task.md`; `docs/plans/WB-2026-06-24-e2-e3-portability-ignore-policy-claude-verifier-task.md` | completed |
| 2026-06-24 | Implementation | Claude Code Coder aligned `.gitignore`, `.agentsignore`, `.codexignore`, `.gitattributes`; `.env.vps.example` confirmed placeholder-only | candidate files changed; `git diff --check` clean; initial gap found and fixed | completed |
| 2026-06-24 | Fix | Orchestrator found 2 gaps: (1) `!.env.vps.example` missing in all 3 ignore files -> `.env.vps.example` was hidden; (2) `.codexignore` missing `.claude/settings.json`. Added `!.env.vps.example` to `.gitignore`, `.codexignore`, `.agentsignore`; added `.claude/settings.json` to `.codexignore` | 3 files changed; `git diff --check` clean; `git check-ignore --non-matching` confirms `.env.vps.example` visible; `.claude/settings.json` tracked (A2 pending) | completed |
| 2026-06-24 | Review | Claude Code Reviewer returned APPROVE | `/tmp/WB-2026-06-24-e2-e3-portability-ignore-policy-claude-review.out` | completed |
| 2026-06-24 | Verification | Claude Code Verifier returned APPROVED; local Orchestrator checks repeated; Docker Compose preflight passed after tool approval | `/tmp/WB-2026-06-24-e2-e3-portability-ignore-policy-claude-verifier.out`; local command output | completed |
| 2026-06-24 | Critic SUPPLEMENT | Native Codex Critic returned SUPPLEMENT: (1) `.mcp.json` is ignored by `.gitignore` but not by `.codexignore` or `.agentsignore`, despite being private/local MCP runtime config; (2) write-gate evidence wording misleading — `git diff --name-only` omits untracked files | Critic SUPPLEMENT report in Codex thread | completed |
| 2026-06-24 | Fix | Claude Code Coder added `.mcp.json` to `.codexignore` and `.agentsignore`; updated `.codex/write-gate.md` evidence section to include `git status --short -- <paths>` alongside `git diff --name-only` with explicit note about untracked-file limitation | `.codexignore` +1 line; `.agentsignore` +1 line; `.codex/write-gate.md` evidence lines updated | completed |
| 2026-06-24 | Re-review | Native Codex Critic re-reviewed the SUPPLEMENT fix and returned APPROVE with no remaining blockers before Owner commit decision | Critic re-review verdict: APPROVE | completed |

## Closeout and Retrospective

### Result Summary

- **Final Result:** implementation complete; ignore/control candidate is ready for Owner commit decision; 0 real secrets found; staging remains empty.
- **Verification Evidence:** `git diff --check` clean; `git check-ignore` probes confirm private paths ignored and SDLC paths visible; `git check-ignore --no-index` confirms `.claude/settings.json` is ignored by policy; `bash -n deploy.sh` pass; `bash scripts/bootstrap.sh` pass; `docker compose -f docker-compose.vps.yml --env-file .env.vps.example config` pass; direct secret scan hits are documentation or `replace_me` placeholders only.
- **Residual Risks:** `.claude/settings.json` remains tracked (Owner decision A2 pending); the repository remains broadly dirty outside this WB, so any commit must use exact pathspec staging only; `.env.vps.example` contains public placeholder URLs/domains and Docker-internal placeholder DB URL, not real credentials. Post-Critic SUPPLEMENT: `.mcp.json` now excluded in `.codexignore` and `.agentsignore`; write-gate evidence now includes both `git diff --name-only` (tracked modified) and `git status --short` (untracked/new).

### Critic and Review Value

- **Critic used:** native Codex subagent, read-only
- **Critic verdict:** APPROVE after supplement fixes
- **What the critic caught:** Deploy-tier handling for `.env.vps.example`, the env-pattern exception ambiguity, insufficient `git check-ignore` proof shape, missing threat-model classification, and scoped-commit-guard narrowing. Post-implementation SUPPLEMENT: `.mcp.json` missing from `.codexignore`/`.agentsignore` despite being private/local MCP runtime config; write-gate evidence wording relied solely on `git diff --name-only` which omits untracked files — both resolved.
- **What the critic missed:** not applicable (implementation complete)
- **Skip/fallback reason:** not applicable

### Lessons Learned

- **What worked:** `git check-ignore` probes provided clear evidence; replacing broad `.codex/` agent exclusions with specific private-config exclusions was the core fix; `--no-index` was needed to prove ignored policy for already tracked `.claude/settings.json`.
- **What did not work:** the first Claude Code Coder pass missed the `.env.vps.example` visibility exception and `.codexignore` private Claude config rule; Orchestrator caught this with local `git check-ignore` evidence and returned the issue to Claude Code for a scoped fix.
- **What not to repeat:** do not accept AI Coder check summaries without rerunning the exact acceptance probes locally.
- **Evidence wording check:** all probes use exact commands from the WB verification plan
- **Framework updates made:** none
- **Framework updates to consider:** none
- **Reusable knowledge created:** ignore-alignment pattern: `.gitignore` uses negated rules for Codex SDLC files; `.agentsignore` uses specific exclusions (not broad directory); `.codexignore` excludes only private config (not SDLC files needed by Codex itself)
- **Navigation updates:** none; A10 remains last
