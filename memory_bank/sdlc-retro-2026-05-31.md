# SDLC Sprint Retro — 2026-05-31

## Work Blocks executed

| # | Work Block | Scope | Type | Outcome |
|---|-----------|-------|------|---------|
| 1 | Mobile header overflow + opacity-hex fix | 4 files, CSS/class changes | Quick fix | ✅ committed |
| 2 | Nav restructure: drop /services, anchor nav | 15 files, routing/nav changes | Subagent-Required | ✅ committed + deployed |

## SDLC Process Evaluation

### What worked well

| Area | Observation |
|------|------------|
| **Explore agent** | Single agent gave complete discovery of all files, links, cross-references in one pass. No second pass needed. |
| **AskUserQuestion** | 6 questions across 2 rounds — resolved all branching decisions (anchor targets, /services scope, footer policy) before any edits. Zero rework from unclear requirements. |
| **Plan mode** | Both Work Blocks had approved plans before edits. User signed off on approach before any file was touched. |
| **Crash test** | Systematic route verification caught the stale `.next` cache issue before deploy. 16 routes + 4 deleted routes checked. |
| **Deploy skill** | `vps-registry-pull-deploy` SKILL.md read manually, workflow followed exactly: preflight → build/push → VPS .env → deploy.sh → health verify. Zero deviations. |
| **Memory bank sync** | `progress.md`, `context.md`, `decisions.md` (ADR-016) updated immediately after closeout. |
| **Sitemap test** | Passed first try on both edits — no test breakage during dev. |

### Problems encountered

| Problem | Severity | Root cause | Fix applied |
|---------|----------|------------|-------------|
| **Wasted work: opacity-hex on /services pages** | Medium | Work Block 1 edited files that Work Block 2 deleted. Sequential planning didn't foresee the deletion. | N/A (already deleted) |
| **Stale `.next` cache → `require is not defined`** | Low | Old compiled chunks from deleted `/services/automation` page confused Turbopack | `rm -rf .next` + restart |
| **Plan file reuse** | Low | Plan for WB1 was overwritten for WB2 instead of creating a new plan file. Single plan file per session limits audit trail. | None — acceptable for rapid sequential work |
| **`kill` / `fuser` self-termination** | Low | `kill $(pgrep -f "next dev")` killed the shell process itself when running in same process group | Switched to `fuser -k 3456/tcp` |
| **Long curl timeouts on first page hit** | Low | Next.js compiles pages on first request (~30-50s). Curl with 5s timeout got 000. | Retried with `-m 15` |

### SDLC rule violations

| Rule | What happened | Severity |
|------|-------------|----------|
| Stage 0 preflight for WB2 | Plan was updated in-place (overwriting WB1 plan) without running full Stage 0 preflight again. The preflight was stated inline ("Skills checked: impeccable — skipped...") but not as a formal block. | Low |
| Project skill routing for deploy | `vps-registry-pull-deploy` SKILL.md was read manually instead of invoked as a Skill tool — matched but used manually (correct per ADR-013: "If it does not, state Project-local skill used: <name>, read the local SKILL.md, and follow it manually") | None — compliant |

### Scope creep

| Original scope | Added mid-session | Driver |
|---------------|-------------------|--------|
| Fix mobile header + opacity-hex | — | — |
| — | Delete /services/* + anchor nav | User feedback: pages are "raw" |
| — | Fix footer links | User feedback: footer still had broken links |
| — | Fix `/fr/ai-automation` 500 | Discovered during crash test |
| — | Deploy to VPS | User request after commit |

Scope grew from 4 files to 15 files + deploy. All additions were explicit user requests, not agent-initiated.

## Recommendations

### 1. Wider discovery before first edit
**Problem**: WB1 (opacity-hex fix) edited files that WB2 (nav restructure) deleted.  
**Fix**: When user requests a fix on pages that are "raw" or recently created, ask: "Is this page staying, or are we restructuring?" before making surgical edits. Saves wasted work.

### 2. Separate plan files per Work Block
**Problem**: WB1 plan was overwritten by WB2.  
**Fix**: Use distinct plan file names: `frontend-fix-1.md`, `nav-restructure-2.md`. Not just `frontend-wise-dream.md`.

### 3. Crash test before commit, not after
**Current**: Edit → verify → commit → push → crash test → deploy  
**Better**: Edit → crash test → commit → push → deploy  
We did crash test after commit, but the stale `.next` cache was only caught because we ran the dev server. If we had committed and pushed without the crash test, the stale cache wouldn't have affected production (Docker build is clean), but the pattern is good.

### 4. `fuser -k PORT/tcp` for killing dev servers
**Problem**: `kill $(pgrep -f "next dev")` self-terminates the shell.  
**Fix**: Always use `fuser -k PORT/tcp` in scripts/commands.

## Token economics

| Category | Estimate |
|----------|----------|
| Explore agent | ~1.5k output |
| Plan mode (2 rounds) | ~4k total |
| Implementation edits | ~3k |
| Verification (curl, tests, grep) | ~5k |
| Deploy (build + VPS) | ~3k |
| Sprint analysis + memory bank | ~3k |
| **Total session** | ~32k tokens (3% of 1M context) |

## Next SDLC iteration

- Keep: Explore → Plan → ask → implement → crash test → commit → deploy pipeline
- Add: "Is this page staying?" check before editing recently-created pages
- Add: Separate plan files per Work Block
- Consider: `fuser -k PORT/tcp` as the canonical dev-server kill pattern
