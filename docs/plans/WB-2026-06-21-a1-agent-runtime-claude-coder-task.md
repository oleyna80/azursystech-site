# Claude Code Coder Task: A1 Agent Runtime Reconciliation

## Mission Brief

- **Base Role:** Coder
- **Mission Role:** Agent Runtime Docs Analyst
- **Skill:** project-local `scoped-coder`
- **Work Block:** `WB-2026-06-21-a1-agent-runtime-claude-coder-pilot`
- **Objective:** reconcile the exact A1 runtime contract and mirrored skills.
- **Acceptance owner:** Codex Control Tower
- **Handoff target:** read-only Reviewer, then Verifier
- **File-change permission:** write only the eight paths listed below

You are the sole subject-file Coder for this Work Block. Other user changes
already exist in the repository. Preserve them, do not revert work you did not
create, and do not modify unrelated dirty files.

## Required Read Set

Read only what is needed from:

1. `AGENTS.md`
2. `.agent/ROSTER.md`
3. the six approved skill files below
4. `docs/plans/WB-2026-06-21-a1-agent-runtime-claude-coder-pilot.md`
5. `.agent/workflows/sdd-protocol.md`
6. `.claude/skills/scoped-coder/SKILL.md`

You may inspect `git status` and the diff limited to the approved write-set.
Do not bulk-read the dirty repository.

## Approved Write-Set

- `AGENTS.md`
- `.agent/ROSTER.md`
- `.agent/skills/ai-runtime-ops/SKILL.md`
- `.agent/skills/lead-response-ops/SKILL.md`
- `.agent/skills/nextjs-seo-build-verifier/SKILL.md`
- `.claude/skills/ai-runtime-ops/SKILL.md`
- `.claude/skills/lead-response-ops/SKILL.md`
- `.claude/skills/nextjs-seo-build-verifier/SKILL.md`

Do not write any report, log, plan, task, config, cache, transcript, or generated
file. Preflight confirms that `AGENTS.md` and all six skill files already satisfy
the relevant criteria: treat those seven paths as verification-only unless you
find and report a concrete new contradiction. `.agent/ROSTER.md` contains the
known active-runtime contradiction and is the expected implementation target.

## Implementation Requirements

1. Make `AGENTS.md` and `.agent/ROSTER.md` consistently state that Codex and
   Claude Code are the only active project agent runtimes.
2. Remove active Qwen and Gemini roster sections. Do not remove generic safety
   examples from `AGENTS.md` merely because they name external tools.
3. Keep RooCode/Cline only as explicitly retired historical context, not an
   active workflow or skill dependency.
4. For each pair below, preserve equivalent body content after YAML frontmatter:
   - `.agent/skills/ai-runtime-ops/SKILL.md` and `.claude/skills/ai-runtime-ops/SKILL.md`
   - `.agent/skills/lead-response-ops/SKILL.md` and `.claude/skills/lead-response-ops/SKILL.md`
   - `.agent/skills/nextjs-seo-build-verifier/SKILL.md` and `.claude/skills/nextjs-seo-build-verifier/SKILL.md`
5. Preserve Claude-specific `user-invocable` and `allowed-tools` frontmatter in
   `.claude` files and minimal runtime-neutral frontmatter in `.agent` files.
6. Preserve all existing trigger, validation, handoff, human-approval, deploy,
   live-call, client-communication, and secret/config hard-stop semantics.
7. Prefer the smallest coherent diff. Do not introduce a new abstraction,
   runtime, role, dependency, tool, or policy beyond this reconciliation.

## Allowed Tools

- Read/Edit/Write for the exact approved write-set
- Read-only `git status`, `git diff`, `git diff --check`
- Read-only `rg`, `sed`, `head`, `tail`, `wc`, `python3` for deterministic text comparison

Do not run package managers, builds, dev servers, network tools, external AI
CLIs, deploy commands, DB commands, or Git mutation commands. The provider
transport used by Control Tower to invoke this Claude Code process is allowed;
you may not initiate additional network activity from the mission.

## Required Checks

1. `git diff --check --` limited to the eight approved files.
2. `rg` check for `^## (Qwen|Gemini)` in `.agent/ROSTER.md`; expected no match.
3. Targeted `rg` of the eight files for Roo/Cline/Qwen/Gemini references;
   explain every retained match as retirement history or generic safety policy.
4. Deterministically strip the first YAML frontmatter block from each skill and
   compare each `.agent`/`.claude` body pair; all three must match.
5. `git diff --cached --name-only`; expected empty.
6. Final `git diff --` limited to the eight approved files.

Control Tower owns the pre/post `bash scripts/bootstrap.sh` checks. Do not mark
the mission blocked because bootstrap is not delegated to you.

## Hard Stops

Stop and return an obstacle report if:

- any required change needs a path outside the approved write-set;
- the task requires you to inspect `.claude/settings.json`, `.codex/config.toml`,
  `.env*`, credentials, tokens, provider/model configuration, or private data;
- unrelated dirty content changes or blocks safe implementation;
- staging, commit, push, deploy, dependency, additional network, DB, destructive Git, or
  production action appears necessary;
- a required check fails and cannot be fixed inside the exact write-set.

Do not bypass hooks or permissions. Do not broaden scope. Do not stage, commit,
push, reset, clean, checkout, stash, delete, or rewrite history.

## Output Contract

Return stdout only; do not create a report file. Use this exact structure:

```markdown
## Scoped Coder Report

**Status:** DONE | DONE_WITH_CONCERNS | NEEDS_CONTEXT | BLOCKED
**Write-set used:** [exact files actually changed]
**Scope check:** PASS | FAIL
**Ready for Verifier:** YES | NO
**Pre-existing in-scope changes preserved:** YES | NO

### Implementation
- file: concise change and reason

### Checks
- command: PASS | FAIL | SKIPPED with reason

### Retained external-runtime references
- file:line: why the reference remains valid

### Risks or blockers
- none, or concrete issue

### Final changed paths
- exact repository-relative path list
```

Control Tower will calculate the byte-for-byte pre/post patch. In your report,
state whether you preserved the pre-existing in-scope edits based on your
limited final diff inspection; do not claim access to Control Tower's snapshot.

Do not claim final project acceptance. Control Tower will inspect the diff and
route independent Review and Verification.

## Review-Fix Addendum

The initial Coder pass removed the Qwen and Gemini sections correctly, but the
independent Reviewer returned `NEEDS_CHANGES` for two low-severity issues.

1. In `.agent/ROSTER.md`, restore one `---` top-level separator between the end
   of the Codex section and `## Claude (Anthropic)`.
2. Restore one `---` top-level separator between the end of the Claude section
   and `## Skill -> Agent Assignment`.
3. Do not restore any Qwen or Gemini content and do not alter any other subject
   file.
4. Run the body-equivalence check programmatically, not by manual inspection.
   Use Python stdlib to remove the first YAML frontmatter block from each of the
   three skill pairs and compare the remaining bodies exactly apart from a
   final newline.

Return the same `Scoped Coder Report` structure. The expected Review-fix
write-set is only `.agent/ROSTER.md`.
