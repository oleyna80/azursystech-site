# Work Block: A2 Agent Runtime Control Readiness

## Meta

- **Work Block ID:** WB-2026-06-24-a2-agent-runtime-control-readiness
- **Parent Work Block:** WB-2026-06-20-dirty-tree-disposition
- **Predecessors:** WB-2026-06-21-a5-codex-runtime-decision; WB-2026-06-24-a6-workflow-docs-readiness; WB-2026-06-24-e2-e3-portability-ignore-policy
- **Date:** 2026-06-24
- **Owner:** azur
- **Stage:** Plan
- **Role:** Orchestrator
- **Execution Mode:** staged approval; read-only Claude inventory first; write-capable Claude only after refreshed gates and exact write-set approval
- **Side-Effect Class:** local-docs/workflow; public-repo only after separate commit/push approval
- **DB Action Mode:** none
- **Verification Tier:** full
- **Active Profile:** Codex Control Tower with Claude Code Team Runtime and Codex MCP GPT subagents
- **Allowed external runtimes/MCPs:** Claude Code CLI from `/home/azur/Projects/WSL/azursystech`; `mcp-codex` inside Claude Code via user-local `~/.mcp.json` and `settings.local.json`; Playwright MCP only for local UI/browser checks if a later stage explicitly needs it. No provider keys or local absolute Codex paths may be committed.

## Objective

Make the agent runtime/control layer commit-ready for future Work Blocks by
auditing and, if approved, synchronizing the project-local Claude, Codex, and
Agent control files now present in the dirty tree. The Work Block must prove
that Claude Code can be used as the controlled execution runtime with its
project subagents, while Codex remains the Control Tower and uses only the
native Codex Critic subagent directly.

## Expected Final Result

The Owner receives a reviewed selective commit candidate for the runtime/control
layer. The candidate clearly separates synchronized project workflow files from
local-private runtime configuration, proves that Claude Code subagents are
available and gated, confirms that Codex MCP remains user-local/private, and
documents exactly what should be staged or left unstaged. No application,
deployment, database, secret, provider credential, or production config changes
are made. Commit and push remain blocked until separate Owner approval.

## Done Criteria

- [ ] Current `.agent`, `.claude`, and `.codex` runtime/control files are inventoried against Git status and ignore policy.
- [ ] Files intended for shared project workflow are listed explicitly.
- [ ] Files that must stay local/private are listed explicitly and verified as ignored or unstaged.
- [ ] Claude Code is run from `/home/azur/Projects/WSL/azursystech` first in read-only inventory/review mode with a task that exercises project subagent routing.
- [ ] `.codex/write-gate.md`, `.agent/critic-gate.md`, and `.agent/verification-gate.md` are refreshed for this WB before any write-capable Claude Code invocation.
- [ ] Any write-capable Claude Code invocation uses exact pathspecs approved after inventory, not wildcard directory authority.
- [ ] Claude Code uses `solution-architect`, `critic`, `gpt-critic`, `reviewer`, `gpt-verifier`, `verifier`, and `codex-reviewer` where applicable; `scoped-coder` is the only write-capable Claude agent.
- [ ] Claude Code does not write outside the approved write-set.
- [ ] Codex MCP use is verified as local/private runtime config and not added to tracked project `.mcp.json`.
- [ ] Hook and config syntax checks pass.
- [ ] Secret and private-config scans over the candidate files pass or produce only documented placeholder hits.
- [ ] Native Codex Critic reviews the plan or final candidate; all findings are dispositioned.
- [ ] Final stage report contains exact staging pathspecs and residual risks.

## Preflight State

- **Git baseline:** branch `feature/showcase-demo-templates` is synchronized with `origin/feature/showcase-demo-templates` after E2/E3 push. The working tree remains broadly dirty from repository reconciliation.
- **Pre-existing dirty files:** many application, deployment, memory-bank, showcase, docs, and workflow paths are dirty or untracked. This WB may inspect them only to classify runtime/control scope. It must not modify application source, deploy files, production config, package files, database/schema, or unrelated docs.
- **Untracked local artifacts:** `.claude/skills/mcp-builder/`, `.claude/skills/skill-creator/`, `.claude/skills/webapp-testing/`, `.codex/agents/`, `.codex/config.toml.template`, `.codex/critic.md`, `.codex/hooks/`, `.codex/instructions.md`, plus unrelated dirty tree outside runtime/control scope.
- **Proceed rule:** Plan creation is approved by Owner. Implementation begins with read-only Claude inventory/review. File edits require Owner confirmation of the narrowed write-set plus refreshed `.codex/write-gate.md`, `.agent/critic-gate.md`, and `.agent/verification-gate.md` before any write-capable Claude Code task.

## Dependency Check

### Must Resolve Before Start

- Owner approval of this WB plan.
- Run the first Claude Code task in read-only inventory/review mode; it must not modify files.
- Refresh `.codex/write-gate.md`, `.agent/critic-gate.md`, and `.agent/verification-gate.md` for this WB before Claude Code writes.
- Replace the implementation candidate universe with exact approved pathspecs after inventory; wildcard skill or agent directory grants are not approved.
- Confirm whether newly copied `.claude/skills/mcp-builder/`, `.claude/skills/skill-creator/`, and `.claude/skills/webapp-testing/` are intended to be synchronized project assets or left local/untracked.
- Confirm that Codex MCP remains configured only in user-local/global config and is not copied into tracked `.mcp.json`.

### Can Resolve During Work

- Whether `.codex/config.toml.template` should document private model/provider configuration boundaries.
- Whether `.codex/agents/*.toml` are synchronized project-level templates or local-only experiments.
- Whether reports should be captured under `docs/reports/` or only stdout/stderr in `/tmp` plus final plan closeout.

## Runtime / Data Mutation Boundary

- **Applies:** no data mutation. This WB changes workflow/runtime-control files only.
- **Agent authority:** Codex Orchestrator controls scope and Git. Native Codex Critic is read-only. Claude Code first runs read-only inventory/review. Claude Code may use one write-capable `scoped-coder` only after Owner approval, refreshed gates, and exact approved pathspecs. Claude reviewers/verifiers are read-only.
- **Structured action:** not applicable.
- **Trusted executor:** local shell, Git, Claude Code CLI, and Codex MCP inside Claude Code only for read-only GPT review/verification.
- **Policy and approval:** implementation approval authorizes local file edits inside the approved write-set only. Staging, commit, push, deploy, credential changes, dependency installs, or destructive operations require separate approval.
- **Audit path:** this plan, Claude task file, gate files, Claude stdout/stderr, Claude-generated reports if any, Codex Critic report, local command outputs, and final Owner report.
- **Forbidden direct path:** content reads or edits of `.claude/settings.local.json`, `.codex/config.toml`, global `~/.mcp.json`, `.env*`, secrets, provider keys, application code, deploy/prod config, DB/schema, package/dependency changes, branch switching, stash, reset, clean, broad staging. Only ignore/status metadata checks are allowed for local-private config.

## Scope

### In Scope

Plan-stage write only:

```text
docs/plans/WB-2026-06-24-a2-agent-runtime-control-readiness.md
docs/plans/WB-2026-06-24-a2-agent-runtime-control-readiness-claude-team-task.md
```

Read-only implementation candidate universe after Owner approval:

```text
.agent/critic-gate.md
.agent/verification-gate.md
.codex/write-gate.md
.claude/settings.json
.claude/hooks/hard-stop.sh
.claude/hooks/critic-gate.sh
.claude/hooks/typecheck.sh
.claude/hooks/verification-gate.sh
.claude/agents/*.md
.claude/agent-memory/*/MEMORY.md
.claude/skills/SKILL-CONVENTION.md
.claude/skills/*/SKILL.md
.claude/skills/*/agents/*.yaml
.claude/skills/*/scripts/*
.claude/skills/*/reference/*
.claude/claude-security-guidance.md
.claude/security-patterns.yaml
.codex/agents/*.toml
.codex/config.toml.template
.codex/critic.md
.codex/hooks/stage0_write_gate.py
.codex/instructions.md
docs/plans/WB-2026-06-24-a2-agent-runtime-control-readiness.md
docs/plans/WB-2026-06-24-a2-agent-runtime-control-readiness-claude-team-task.md
docs/reports/WB-2026-06-24-a2-agent-runtime-control-readiness-*.md
```

This list is not write authority. It is the candidate universe for inventory.
The write-capable phase must replace it with exact approved pathspecs, for
example individual files or specific report paths. Directory wildcards such as
`.claude/skills/*/scripts/*` are allowed for read-only inventory only unless
the inventory produces a narrowed explicit file list and the Owner approves it.

Read-only context:

```text
AGENTS.md
CLAUDE.md
.mcp.json
.claude/settings.local.json
.codex/config.toml
.codex/write-gate.md
docs/templates/work-block-template.md
docs/templates/subagent-mission-brief-template.md
.agent/workflows/sdd-protocol.md
memory_bank/orchestrator-log.md
memory_bank/review-log.md
```

Private/local config paths are metadata-only context:

```text
.claude/settings.local.json
.codex/config.toml
global ~/.mcp.json
.env*
```

They may be checked with `git status`, `git check-ignore`, and file existence
metadata only. Their contents must not be read, copied, summarized, scanned into
logs, or emitted into reports.

### Out of Scope

- Application source and tests under `web/` or `showcase/`.
- CI, Docker, nginx, deploy scripts, VPS config, production config, database,
  payment, lead, CRM, provider, webhook, or client-facing runtime behavior.
- `.claude/settings.local.json`, `.codex/config.toml`, global `~/.mcp.json`,
  API keys, provider credentials, tokens, private keys, `.env*`, private
  transcripts, local caches, generated outputs, `node_modules`, `.next`, `dist`.
- Commit, push, merge, rebase, branch switch, stash, reset, clean, deletion, or
  history rewrite.

## Write-Set

Current Plan write-set:

```text
docs/plans/WB-2026-06-24-a2-agent-runtime-control-readiness.md
docs/plans/WB-2026-06-24-a2-agent-runtime-control-readiness-claude-team-task.md
```

Future implementation write-set is blocked until Claude inventory review and
Owner approval produce exact pathspecs. The first write-set after plan approval
is gate refresh only:

```text
.codex/write-gate.md
.agent/critic-gate.md
.agent/verification-gate.md
```

After gate refresh, any Claude write-capable phase must use a second exact
pathspec list generated from inventory. No directory-wide write grant is implied
for `.claude/agents/**`, `.claude/skills/**`, `.agent/**`, `.codex/**`, or
`docs/reports/**`.

## Navigation Impact

- **Files added/moved/removed:** this plan and Claude task file now; possible runtime/control files later.
- **PROJECT_MAP.md update needed:** no in this WB unless implementation confirms new durable navigation entries are required. A10 navigation remains the preferred final sync step.
- **FILE_REGISTRY.yml update needed:** no in this WB unless runtime/control files become authoritative tracked assets. A10 navigation remains the preferred final sync step.
- **Session bootstrap or profile docs update needed:** no unless Claude runtime bootstrap requirements need a durable cross-workplace note; if so, record as follow-up unless the Owner expands scope.
- **Generated/derived/local-only boundary changed:** yes. This WB must document shared runtime-control versus user-local/private runtime config.

## Commit / Stage Scope

- **Files to stage/commit:** none during Plan. Later selective commit may include only the narrowed approved runtime/control candidate, after separate Owner approval.
- **Files to leave unstaged:** application/deploy/production dirty tree, `.claude/settings.local.json`, `.codex/config.toml`, private/global MCP config, `.env*`, generated/caches, unrelated docs, memory history outside explicitly approved log/report updates.
- **Scope guard:** before any staging, run `git status --short --branch`, `git diff --name-only -- <write-set>`, and `git diff --cached --name-only`; stage only explicit pathspecs.

## Acceptance Criteria

- [ ] `.claude/settings.json` declares the intended project agents and hooks without embedding private user paths, tokens, model-provider credentials, or local-only MCP server definitions.
- [ ] `.claude/hooks/*.sh` pass `bash -n` and enforce hard-stop, critic-gate, typecheck, and verification-gate behavior without weakening existing safety rules.
- [ ] `.claude/agents/gpt-critic.md`, `.claude/agents/gpt-verifier.md`, and `.claude/agents/codex-reviewer.md` call Codex only through `mcp__codex__codex`, never direct Bash `codex`.
- [ ] `.mcp.json` remains project-local and does not gain the user-specific Codex MCP command path.
- [ ] `.claude/settings.local.json` and `.codex/config.toml` remain unstaged/local-private.
- [ ] `.agent/critic-gate.md` and `.agent/verification-gate.md` are refreshed for the active WB if Claude Code edits files, and their status fields are evidence-backed.
- [ ] `.codex/write-gate.md` is refreshed for the active WB before Codex or Claude performs any implementation edit.
- [ ] Claude Code task output includes subagent evidence for `solution-architect`, `critic`, `gpt-critic`, `reviewer`, `verifier`, `gpt-verifier`, and optional `codex-reviewer` or a concrete skip/degraded reason.
- [ ] No Claude Code subagent edits files except `scoped-coder`, and `scoped-coder` changes only the approved write-set.
- [ ] `git diff --check -- <approved-exact-pathspecs>` passes for the final candidate; full-tree `git diff --check` is informational because unrelated dirty files exist.
- [ ] Secret/private-config scan over changed runtime/control docs uses explicit candidate pathspecs, excludes local-private config contents, and finds no real secrets.
- [ ] Final report identifies exact commit candidate paths and paths intentionally left unstaged.

## Risks and Mitigations

| Risk | Impact | Mitigation | Stop Condition |
|---|---|---|---|
| User-local Codex MCP config is accidentally committed | Clone portability breaks and local path leaks | Keep Codex MCP in global/local config; verify `.mcp.json` diff | Any tracked file adds `/home/azur/.local/bin/codex` or provider config |
| Claude or Codex hooks use stale gates from prior WB | WB stalls, bypass temptation, or wrong write authority | Refresh `.codex/write-gate.md`, `.agent/critic-gate.md`, and `.agent/verification-gate.md` before any write task | Hook denies an in-scope file after gate refresh, or gate still references prior WB |
| Broad `.claude/skills/**` sync includes private or generated content | Repo noise or sensitive local state enters commit | Inventory skills and narrow candidate; scan for secrets/private paths | Secret/private transcript/cache found in candidate |
| Multiple write-capable agents modify same files | Conflicting or unreviewable diff | Only `scoped-coder` may write; all other Claude agents read-only | Any non-coder agent writes repo files |
| GPT subagent path fails despite prior live test | Review quality degrades | Record `DEGRADED` only with explicit Codex MCP unavailable evidence and fallback review | GPT review required but neither READY nor valid DEGRADED |
| Runtime-control changes weaken safety policy | Future WBs lose guardrails | Critic and verifier specifically inspect hard stops and write gates | Reviewer/verifier returns BLOCKED or safety regression confirmed |

## Stage 0 Routing Preflight

- **Work Block type:** non-trivial Work Block
- **Side-effect class:** local-docs/workflow; public-repo only after separate approval
- **DB action mode:** none
- **Hard Stops in scope:** secrets/private config, runtime provider config, write gates, commit/push, destructive Git, deploy/prod config, broad staging
- **Write gate:** BLOCKED for implementation edits until Owner approves this plan and `.codex/write-gate.md` plus `.agent/*-gate.md` files are refreshed for A2. Read-only Claude inventory/review may run before gate refresh.

### Skill Routing Gate

- **Skills checked:** `.agent/ROSTER.md`, `ai-runtime-ops`, `subagent-mission-brief`, `scoped-coder`, `reviewer`, `verifier`, `scoped-commit-guard`, `security-verification-gate`, `shell-context-guard`, `ssot-sync-closeout`
- **Skills matched:** `ai-runtime-ops`, `subagent-mission-brief`, `scoped-coder`, `reviewer`, `verifier`, `scoped-commit-guard`, `security-verification-gate`, `shell-context-guard`
- **Skills used:** mission brief structure, scoped coder boundary, reviewer/verifier evidence shape, runtime/private config boundary, shell and commit guards
- **Skills skipped and why:** deploy/live runtime skills are skipped because no deploy, VPS, DB, or production runtime action is in scope
- **Project-local skill fallback used:** yes

### Subagent Topology

- **Classification:** Subagent-Required
- **Triggers matched:** runtime-control layer, hook/gate safety, external MCP boundary, cross-workplace portability, 4+ files, future multi-agent execution dependency
- **Use Claude Code team:** yes, maximally within role boundaries.
- **Use Codex/GPT critic or verifier:** yes inside Claude Code through `gpt-critic`, `gpt-verifier`, and optional `codex-reviewer`; native Codex direct subagent use is limited to Critic review only.
- **Dispatch plan:** native Codex Critic reviews this plan; Claude first runs read-only inventory/review to validate topology and propose exact write-set; Control Tower refreshes `.codex/write-gate.md` and `.agent/*-gate.md` after Owner approval of the narrowed write-set; Claude `solution-architect` validates topology; Claude `critic` and `gpt-critic` review the gate boundary; Claude `scoped-coder` performs only approved edits; Claude `reviewer` plus optional `codex-reviewer` review final candidate; Claude `verifier` and `gpt-verifier` verify acceptance criteria; Control Tower consolidates and performs final Git/secret checks.
- **Skip reason, if any:** none
- **Blocker category, if blocked:** not applicable

## Subagent Authorization

- Native Codex subagent: `critic` only, read-only.
- Claude Code write-capable subagent: `scoped-coder` only, exact approved write-set only, and only after gate refresh.
- Claude Code read-only subagents: `solution-architect`, `critic`, `gpt-critic`, `reviewer`, `verifier`, `gpt-verifier`, `codex-reviewer`.
- GPT subagents may call Codex only through `mcp__codex__codex` as configured in user-local Claude/MCP settings. They must not call direct `codex` through Bash.
- No token or monetary budget limit is imposed on Claude Code. Shell timeout is allowed only to prevent a hung process.

## Execution Topology

- **Topology:** Codex Control Tower + native Codex Critic + Claude Code team runtime
- **Context sharing:** scoped task file, explicit read/write sets, no secrets or private transcripts
- **Subagent assignments:** see matrix below

### Parallel Decomposition Matrix

| Stream | Goal | Role | Write-set | Dependencies | Verification | Execution | Reason |
|---|---|---|---|---|---|---|---|
| Plan critique | Challenge scope, gates, and subagent topology | Native Codex Critic | none | Plan exists | APPROVE/SUPPLEMENT/RECONSIDER | sequential | Must complete before implementation approval |
| Runtime topology audit | Confirm Claude agents/hooks/MCP assumptions and propose exact write-set | Claude `solution-architect` | none | Owner approval for read-only Claude run | topology finding report | parallel | Read-only and independent of candidate edits |
| Stage 0 adversarial review | Review WB/gates before write task | Claude `critic` + `gpt-critic` | none | read-only inventory complete | reports under docs/reports or stdout evidence | parallel | Different review models catch different failure modes |
| Gate refresh | Refresh Codex and Agent gates for A2 | Codex Orchestrator | `.codex/write-gate.md`; `.agent/critic-gate.md`; `.agent/verification-gate.md` | Owner approval of exact write-set | gate files reference A2 | sequential | Write-capable Claude must not run under stale gates |
| Runtime-control implementation | Edit approved runtime/control files | Claude `scoped-coder` | exact approved runtime-control pathspecs | gate refresh complete | syntax/secret/diff checks | sequential | Only one write-capable agent per write-set |
| Candidate review | Review diff for scope, safety, portability, maintainability | Claude `reviewer` + optional `codex-reviewer` | none | implementation candidate | findings dispositioned | parallel | Read-only reviews can run independently on same diff |
| Verification | Verify AC, checks, gates, and private boundary | Claude `verifier` + `gpt-verifier` | none | candidate review dispositioned | READY/BLOCKED with evidence | parallel | Independent verification required for full tier |
| Commit readiness | Produce exact pathspecs and final Owner report | Codex Orchestrator | none unless Owner approves commit | verification READY | status, diff, secret scan, staged diff empty | local | Git staging/commit stays with Control Tower |

## Codex Critic

- **Required:** yes; this WB changes the execution-control layer and subagent contract.
- **Mode:** native-subagent
- **Verdict:** SUPPLEMENT
- **Report path:** `docs/reports/WB-2026-06-24-a2-agent-runtime-control-readiness-codex-critic.md`
- **Orchestrator response:** supplement applied by separating read-only Claude inventory from write-capable Claude execution, adding `.codex/write-gate.md` refresh, excluding private config content reads/scans, and requiring exact pathspecs plus scoped checks.

## External Review Inputs

- **External reports/prompts:** `docs/plans/WB-2026-06-24-a2-agent-runtime-control-readiness-claude-team-task.md`
- **Evidence input paths:** `/tmp/WB-2026-06-24-a2-agent-runtime-control-readiness-claude.out`, `/tmp/WB-2026-06-24-a2-agent-runtime-control-readiness-claude.err`, optional `docs/reports/WB-2026-06-24-a2-agent-runtime-control-readiness-*.md`
- **Triage rule:** Claude and GPT outputs are evidence, not acceptance. Control Tower must verify scope, dirty tree, secret boundary, and checks before accepting.
- **Local verification required before accepting any finding:** yes; final acceptance depends on local Git/syntax/secret checks and scope guard.

## Verification Plan

- **Canonical checks:**
  - `git status --short --branch`
  - `bash -n .claude/hooks/hard-stop.sh .claude/hooks/critic-gate.sh .claude/hooks/typecheck.sh .claude/hooks/verification-gate.sh`
  - `python -c "import ast, pathlib; ast.parse(pathlib.Path('.codex/hooks/stage0_write_gate.py').read_text())"`
  - JSON/TOML/YAML parse checks for changed config files where parser is available
  - `git diff --check -- <approved-exact-pathspecs>`
  - full-tree `git diff --check` is informational only while unrelated dirty files remain
  - `rg --files-with-matches "(BEGIN (RSA|OPENSSH|EC) PRIVATE|PRIVATE KEY|Bearer [A-Za-z0-9_.-]{20,}|api[_-]?key|secret|token|DATABASE_URL|ANTHROPIC_API_KEY|OPENAI_API_KEY)" <approved-exact-pathspecs>` with private config paths excluded
  - `git check-ignore -v .claude/settings.local.json .codex/config.toml .env .env.local`
  - `git diff --name-only -- <approved-write-set>`
  - `git diff --cached --name-only`
- **Scoped fallback checks:** if a parser is unavailable, use read-only structural inspection plus `rg` markers and document residual risk.
- **Browser smoke:** not applicable.
- **Evidence expected:** Claude stdout/stderr, report files if created, Codex Critic report, command outputs summarized in closeout.
- **Skipped checks:** none expected; any skipped parser/tool check must include reason and residual risk.

## Stop Conditions

- Any real secret, token, key, private path, or provider credential appears in a tracked candidate file.
- `.claude/settings.local.json`, `.codex/config.toml`, global MCP config, `.env*`, app code, deploy/prod config, DB/schema, or package/dependency files require modification.
- Claude Code writes outside approved write-set.
- A non-`scoped-coder` Claude subagent writes repository files.
- GPT critic/verifier is required but cannot produce READY or valid DEGRADED evidence.
- Hook/gate changes weaken hard stops or allow broad/destructive actions.
- Verification returns BLOCKED.

## Rollback / Recovery

Do not use destructive Git. If implementation produces unwanted changes, isolate
them with `git diff -- <path>` and use scoped reverse patches only after Owner
approval. If Claude writes outside scope, stop, report exact paths, and ask for
Owner disposition.

## SSOT Updates

- **Tracked/synchronized SSOT paths:** runtime/control files that pass candidate review.
- **Local-only/ignored SSOT paths and reason:** `.claude/settings.local.json`, `.codex/config.toml`, global `~/.mcp.json`, `.env*`; they contain user-local runtime/provider configuration.
- **Direct evidence markers to verify with `rg -n`:** `mcp__codex__codex`, `gpt-critic`, `gpt-verifier`, `codex-reviewer`, `direct Codex CLI call`, `settings.local.json`, `Allowed external runtimes/MCPs`.
- **`git check-ignore -v` result for workflow docs:** must show local-private files ignored or intentionally untracked, and synchronized workflow files visible.

## Execution Log

| Time | Stage | Action / Decision | Evidence | Status |
|---|---|---|---|---|
| 2026-06-24 | Plan | Created WB plan and Claude team task file | `docs/plans/WB-2026-06-24-a2-agent-runtime-control-readiness.md` | pending critic |
| 2026-06-24 | Review | Native Codex Critic reviewed plan/task and returned SUPPLEMENT | stale gates, broad write-set, private config scan risk, unscoped checks | supplement applied |

## Closeout and Retrospective

### Result Summary

- **Final Result:** PENDING
- **Verification Evidence:** PENDING
- **Residual Risks:** PENDING

### Critic and Review Value

- **Critic used:** native Codex Critic, read-only
- **Critic verdict:** SUPPLEMENT
- **What the critic caught:** stale `.codex/write-gate.md`, stale `.agent/*-gate.md`, broad wildcard write-set before `acceptEdits`, private config scan/log risk, and unscoped checks in a broad dirty tree
- **What the critic missed:** PENDING
- **Skip/fallback reason:** not applicable

### Lessons Learned

- **What worked:** PENDING
- **What did not work:** PENDING
- **What not to repeat:** PENDING
- **Evidence wording check:** use "demonstrated" for one run and "validated" only for repeatable scripted checks.
- **Framework updates made:** PENDING
- **Framework updates to consider:** PENDING
- **Reusable knowledge created:** PENDING
- **Navigation updates:** PENDING
