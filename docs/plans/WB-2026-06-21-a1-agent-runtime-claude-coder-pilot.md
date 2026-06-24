# Work Block: A1 Agent Runtime Claude Coder Pilot

## Meta

- **Work Block ID:** WB-2026-06-21-a1-agent-runtime-claude-coder-pilot
- **Parent Work Block:** WB-2026-06-20-dirty-tree-disposition
- **Date:** 2026-06-21
- **Owner:** azur
- **Stage:** Verification complete / closeout
- **Role:** Orchestrator
- **Execution Mode:** autonomous inside approved scope
- **Side-Effect Class:** local-docs/workflow-write
- **DB Action Mode:** none
- **Verification Tier:** T2 / Standard workflow-document verification
- **Active Profile:** Codex -> Claude Code Handoff with optional model-routing overlay

## Objective

Use Claude Code as the sole write-capable Coder for the exact eight-path A1
agent-runtime group. Reconcile the active-runtime registry and mirrored skills
with the project policy that Codex and Claude Code are the only active agent
runtimes, while preserving runtime-specific frontmatter and all operational
guardrails.

## Expected Final Result

The A1 group has one coherent portable runtime contract. `.agent/ROSTER.md`
does not present Qwen, Gemini, RooCode, or Cline as active project runtimes;
historical retirement and external-tool safety references remain allowed where
they are semantically necessary. Each `.agent`/`.claude` skill pair has the
same operational body after excluding runtime-specific YAML frontmatter.
Claude Code makes the implementation directly, reports its exact diff and
checks, and touches no path outside the approved subject write-set. No staging,
commit, push, config/provider, secret, application, deploy, DB, dependency, or
production action occurs.

## Done Criteria

- [x] Native Codex Critic reviews this Stage 0 plan and mission brief.
- [x] The eight-file pre-handoff snapshot is frozen as byte copies plus path, status, size, and SHA-256 metadata.
- [x] Claude Code acts as the only Coder for the subject write-set.
- [x] Active-runtime policy is consistent across `AGENTS.md` and `.agent/ROSTER.md`.
- [x] The three runtime-neutral/Claude skill pairs preserve equivalent bodies.
- [x] Existing operational and hard-stop guardrails are not weakened.
- [x] Claude Code returns the required Coder report and scope evidence.
- [x] Independent Review and Verification approve the final diff.
- [x] Staging remains empty; commit and push remain blocked.

## Routing Preflight

- **Work Block type:** agent-runtime policy reconciliation and external Coder pilot.
- **Skill Routing Gate:** `subagent-mission-brief` and `scoped-coder` apply; `reviewer` and `verifier` apply after implementation. No production-domain skill is triggered.
- **Subagent Topology:** `Subagent-Required`; eight files, a new external write-capable execution topology, and independent verification.
- **Dispatch decision:** native Codex Critic -> one external Claude Code Coder -> native read-only Reviewer -> native read-only Verifier. Inline fallback is permitted only with the exact blocked category recorded.
- **Side-effect class:** local-docs/workflow-write.
- **DB action mode:** none.
- **Hard Stops in scope:** secrets/private settings, provider config, dependency changes, application/runtime/deploy/DB changes, staging, commit, push, merge, destructive Git, or any write outside the exact write-set.
- **Write gate:** `READY` for Stage 0 corrections; subject implementation remains contingent on Critic `APPROVE` or dispositioned `SUPPLEMENT`.
- **Unrelated dirty tree:** all paths outside A1 and the approved Control Tower artifacts are frozen and must not be modified.

## Parallel Decomposition Matrix

| Stream | Goal | Role | Write-set | Dependencies | Verification | Execution | Reason |
|---|---|---|---|---|---|---|---|
| P0 | Challenge scope and acceptance model | Reviewer / Codex Critic | none | plan + task | Critic contract | sequential | implementation depends on Critic disposition |
| I1 | Reconcile A1 runtime contract | Coder / Claude Code Docs Analyst | exact eight subject paths | P0 approved | self-check + exact diff | sequential | sole Coder and shared mirrored files |
| R1 | Review scope and semantic quality | Reviewer / Docs Analyst | none | I1 | spec then quality | sequential | must inspect final implementation |
| V1 | Re-run deterministic checks | Verifier | none | R1 `APPROVED` | T2 checks | sequential | independent acceptance gate |
| C1 | Record evidence and close gate | Orchestrator | approved reports/logs only | V1 | closeout scan | local | Control Tower owns lifecycle evidence |

## Approved Subject Write-Set

Claude Code is the sole Coder and may modify only:

1. `AGENTS.md`
2. `.agent/ROSTER.md`
3. `.agent/skills/ai-runtime-ops/SKILL.md`
4. `.agent/skills/lead-response-ops/SKILL.md`
5. `.agent/skills/nextjs-seo-build-verifier/SKILL.md`
6. `.claude/skills/ai-runtime-ops/SKILL.md`
7. `.claude/skills/lead-response-ops/SKILL.md`
8. `.claude/skills/nextjs-seo-build-verifier/SKILL.md`

Write permission does not require artificial edits. Preflight confirms that
`AGENTS.md` and all six skill files already satisfy their relevant acceptance
criteria; treat those seven paths as verification-only unless a concrete new
contradiction is found and reported. `.agent/ROSTER.md` contains the known
Qwen/Gemini contradiction and is the expected implementation target.

## Control Tower Write-Set

- `.codex/write-gate.md`
- this plan and the paired Claude task file
- Critic, external implementation, Review, and Verification reports for this WB
- append-only orchestrator, review, and external-team logs
- `memory_bank/context.md` and `memory_bank/progress.md` at verified closeout

## Out Of Scope

- task-directed reading or editing of `.claude/settings.json`, `.codex/config.toml`, `.env*`, secrets, credentials,
  provider/model configuration, private agent memory, and raw transcripts;
- application source, tests, package/dependency files, CI, deploy, Docker,
  proxy, production configuration, database, payment, and client actions;
- imported Claude skill bundles outside the three exact mirrored skills;
- staging, commit, push, branch operations, release, deploy, or destructive Git;
- resolving any dirty-tree group other than A1.

## Acceptance Criteria

### AC1: Active Runtime Registry

- `AGENTS.md` and `.agent/ROSTER.md` identify Codex and Claude Code as the only
  active project agent runtimes.
- Qwen and Gemini are not presented as active project sections in the roster.
- RooCode/Cline may appear only as explicitly retired history; generic external
  AI safety examples in `AGENTS.md` are not incorrectly removed.

### AC2: Mirrored Skill Contract

- For each of the three skill pairs, content after the closing YAML frontmatter
  delimiter is byte-equivalent apart from a final newline.
- Claude-specific `user-invocable` and `allowed-tools` frontmatter remains only
  in `.claude` copies; runtime-neutral frontmatter remains minimal.
- Trigger, workflow, validation, handoff, and hard-stop semantics are preserved.

### AC3: Scope And Safety

- The final changed-path delta caused by Claude Code is a subset of the exact
  eight subject paths.
- No private/config payload is task-directed for reading or changed. Claude
  Code may automatically load its user/project runtime configuration during
  startup; that runtime behavior grants no permission to inspect, quote, edit,
  or report the private payload.
- No file is staged; no commit, push, deploy, package command, network tool, or
  nested external AI tool is used. The Control-Tower-managed provider transport
  needed to invoke Claude Code is the sole permitted network boundary.
- Existing unrelated dirty paths remain unchanged against the pre-handoff
  snapshot.

### AC4: Evidence

- Claude Code returns `DONE`, `DONE_WITH_CONCERNS`, `NEEDS_CONTEXT`, or
  `BLOCKED`, plus changed files, checks, risks, and readiness for Verifier.
- Control Tower records stdout summary and independently verifies the diff.

## Claude Code Execution Contract

- **Task:** `docs/plans/WB-2026-06-21-a1-agent-runtime-claude-coder-task.md`
- **Invocation:** task content through stdin from repository root.
- **Budget policy:** no token or monetary budget flags.
- **Operational timeout:** 1200 seconds only to terminate a hung process.
- **Repository writes:** allowed only for the exact eight subject paths; no
  Control Tower or other agent repository writes occur between the final
  pre-snapshot and post-snapshot.
- **Output:** stdout/stderr captured outside the repository; Control Tower
  writes the sanitized durable implementation report.
- **Fallback:** if Claude Code cannot edit because of sandbox, hook, permission,
  model, or runtime failure, stop and report the exact category. Codex does not
  silently take over subject implementation in this pilot.
- **Timeout/partial state:** on timeout, capture exit status and sanitized
  stdout/stderr, immediately take the post-snapshot, and inspect any partial
  in-scope diff as a failed Coder pass. Do not auto-retry or auto-rollback.

## Verification Plan

1. Capture NUL-safe Git status and metadata for the entire dirty tree, plus byte copies and SHA-256/size for all eight subject files, before handoff.
2. Hold an execution lock: no other repository writer runs until the Claude post-snapshot is complete.
3. Compare byte-for-byte pre/post subject files and full dirty-tree metadata; require all attributed content drift to be inside the eight subject paths.
4. Inspect the pre/post patch and `git diff --` for the exact eight paths; reject unrelated reverts.
5. Run `git diff --check` for the exact subject and WB artifacts.
6. Use `rg` to locate active Qwen/Gemini headings and stale Roo/Cline operational references.
7. Parse each skill's YAML frontmatter boundary with Python stdlib and compare the three bodies exactly.
8. Control Tower runs `bash scripts/bootstrap.sh` before and after handoff.
9. Scan exact changed artifacts for explicit credential/key/private-key patterns.
10. Confirm `git diff --cached --name-only` is empty.
11. Reviewer performs Stage 2a spec compliance before Stage 2b quality review; Verifier reruns deterministic checks independently.

## Stop Conditions

- Critic returns unresolved `RECONSIDER`.
- Claude Code needs a path outside the eight-file subject write-set.
- A private setting, credential, provider config, production config, or secret
  must be opened or modified.
- Existing unrelated dirty content drifts during the handoff.
- Required checks fail or Claude cannot provide an auditable changed-file list.
- Any staging, commit, push, deploy, DB, dependency, additional network action,
  or destructive action becomes necessary. Provider transport for the single
  Control-Tower invocation is explicitly allowed.

## Rollback / Recovery

Do not use reset, checkout, clean, stash, or deletion. If Claude Code produces
an unacceptable in-scope diff, preserve evidence and correct it only through a
newly approved scoped Coder pass. Unknown or unrelated user changes are never
reverted.

## Review Plan

- **Stage 0.5 Critic:** challenge scope, task clarity, sole-Coder boundary,
  mirrored-body acceptance, dirty-tree isolation, and verification adequacy.
- **Stage 2a Reviewer:** require exact AC coverage and write-set compliance.
- **Stage 2b Reviewer:** check clarity, portability, non-duplication, and no
  weakened operational guardrails.
- **Verifier:** rerun all deterministic checks without modifying subject files.

## Review-Fix Status

The initial Claude Code pass changed only `.agent/ROSTER.md` and removed the
active Qwen and Gemini sections. Independent Review returned `SPEC_GAPS` /
`NEEDS_CHANGES` for two low-severity findings: the pass removed two useful
top-level separators, and its report described the required body comparison as
manual rather than deterministic. Claude Code completed the narrow Review-fix,
restoring only the two separators in `.agent/ROSTER.md`. Re-review returned
`SPEC_OK` / `APPROVED`, and independent Verification returned `APPROVED` after
programmatic body comparison and the full T2 check set.

## Closeout

Closeout evidence is recorded in the reports and workflow logs. The write gate
is closed. This Work Block is ready for a separate Owner-approved commit
decision; no staging, commit, or push is part of this Work Block.
