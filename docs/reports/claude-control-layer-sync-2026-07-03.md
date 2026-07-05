# Claude Code Control Layer Sync — 2026-07-03

Work Block: WB-2026-07-03-claude-control-layer-sync
Baseline: `/home/azur/Projects/WSL/azursystech-showcase-demo-templates`
Mode: adaptation, not blind copy. No stage/commit/push performed.

## State Before

- `.claude/` contained only: `settings.json` (84 bytes, `enabledPlugins` with
  security-guidance), `claude-security-guidance.md`, `security-patterns.yaml`,
  and legacy-tracked `skills/impeccable/**`.
- No `.claude/hooks/`, `.claude/agents/`, `.claude/agent-memory/`.
- `.gitignore`, `.agentsignore`, `.codexignore` all blanket-ignored `.claude/**`
  (git-tracked legacy files remained tracked despite the rule).
- `FILE_REGISTRY.yml` marked `.claude/**` as
  `legacy_tracked_runtime_pending_cleanup`.

## Transferred (from baseline)

| Path | Content | Adaptation notes |
|---|---|---|
| `.claude/hooks/hard-stop.sh` | PreToolUse Bash gate: Hard Stops (push main, destructive git/fs, ssh, deploy, live DB, client comms, credentials, direct Codex CLI) | Verbatim; references match this repo (`AGENTS.md` Hard Stops) |
| `.claude/hooks/critic-gate.sh` | PreToolUse Edit/Write gate against `.agent/critic-gate.md` write-set | Verbatim; `.agent/critic-gate.md` exists here |
| `.claude/hooks/verification-gate.sh` | Stop gate against `.agent/verification-gate.md` | Verbatim; gate file exists here |
| `.claude/hooks/typecheck.sh` | PostToolUse `tsc --noEmit` on changed .ts/.tsx | Verbatim |
| `.claude/agents/*.md` (8) | Subagent contracts: solution-architect, critic, gpt-critic, reviewer, scoped-coder, verifier, gpt-verifier, codex-reviewer | Verbatim; project-level defs now shadow user-level `~/.claude/agents` copies (5 of which had drifted from baseline) |
| `.claude/agent-memory/*/MEMORY.md` (8) | Empty memory index stubs | Checked: no private data (headers + "no memories yet" only) |
| `.claude/settings.json` | Baseline permissions, autoMode, hooks wiring, plugin enablement, agent colors | Merged: existing security-guidance plugin preserved; baseline adds skill-creator, frontend-design. No provider/model/API/credential settings present or added |

Preserved untouched: `.claude/claude-security-guidance.md`,
`.claude/security-patterns.yaml` (byte-identical to baseline).

## Ignore Policy Changes

- `.gitignore`: replaced `.claude/**` with selective rules — committed control
  layer (settings.json, hooks/, agents/, agent-memory `MEMORY.md` indexes);
  ignored: `settings.local.json`, agent-memory session state,
  `.claude/skills/**`.
- `.agentsignore` / `.codexignore`: replaced `.claude/**` with
  `settings.local.json`, `agent-memory/**` plus `MEMORY.md` exceptions, and
  `skills/**` — the committed control layer is now indexable by external
  agents; heavy/private state is not.
- Deliberate deviation from baseline: baseline git-ignores
  `.claude/settings.json` as private. Here it is already tracked, contains only
  hooks/permissions/plugin wiring (no machine or credential state), and follows
  the Claude Code convention settings.json = shared / settings.local.json =
  local. Kept committable.

## Intentionally Not Transferred

- `.claude/skills/**` — remains a **separate curated scope**. Baseline commits
  60+ skills; exact paths need per-Work-Block approval and `git add -f`.
  Legacy-tracked `skills/impeccable/**` left as-is.
- `settings.local.json`, env files, API keys, provider/model config, `.mcp.json`
  — out of scope, none copied.
- App source code, dependencies.

## SSOT Updates

- `FILE_REGISTRY.yml`: `.claude/**` → `committed_control_layer`, boundary and
  update triggers rewritten; skills-curation note retained.
- `PROJECT_MAP.md`: `.claude/` row updated to describe committed control layer
  + separately curated skills.
- `AGENTS.md` (skill-routing section): "`.claude/**` remain runtime-local"
  narrowed to `.claude/skills/**`; committed control layer now referenced via
  `FILE_REGISTRY.yml` — removes contradiction with this Work Block.

## Skill Routing

`.agent/ROSTER.md` checked. Relevant baseline skills (`index-exclusions-manager`,
`critic-review`, `ssot-sync-closeout`) are not present locally
(`.claude/skills` has only `impeccable`, UI-scoped; `.agent/skills/**` is
ignored/empty). Skills matched: none available. Skipped reason: config-sync
Work Block executed inline by Control Tower with Owner-approved scope.

## Gate Activation Mid-Work-Block

The transferred critic-gate hook activated during this session and denied the
first report write — evidence the hook wiring works. Handled via the gate's
own protocol: `.agent/critic-gate.md` filled with live SKIPPED state backed by
an Owner-approval entry in `memory_bank/orchestrator-log.md`;
`.agent/verification-gate.md` filled with READY evidence.
Post-run Codex review reset both gate files to committed template state
(`Status: PENDING`, placeholder Work Block, no live approvals). Per their
headers, live per-Work-Block evidence must not be committed.

## Checks Performed

- `git diff --check` — clean.
- `bash -n` on all 4 hooks — syntax OK.
- `jq empty .claude/settings.json` — valid JSON.
- `git check-ignore -v` matrix — control files committable; `settings.local.json`,
  `skills/**`, agent-memory extras ignored; `MEMORY.md` re-included.
- Secret scan (`rg` for sk-/api key/token/secret/PRIVATE KEY/AUTH_TOKEN
  patterns) over `.claude`, ignore files, registry, map, reports — only policy
  language and detection patterns; no live credentials.
- Post-run strict secret-value scan (`sk-*`, `sk-ant-*`, `ANTHROPIC_AUTH_TOKEN=`,
  `OPENAI_API_KEY=`, `DEEPSEEK_API_KEY=`, private-key blocks, long Bearer
  tokens) over the committed Claude control layer and SDLC docs — no matches.
- `git status --short --branch` — new `.claude/agents|hooks|agent-memory`
  untracked and visible; `settings.json`, `.gitignore` modified.
- Runtime: critic-gate hook observed enforcing write-set live (deny → gated
  pass), confirming settings.json hook wiring is functional.

Verification: inline by Control Tower (standard tier, config-layer scope,
Owner-approved). No separate verifier agent dispatched.

## Risks

1. **Gates are live from now on.** With hooks committed, every session requires
   a filled `.agent/critic-gate.md` before repository edits and a resolved
   `.agent/verification-gate.md` before closeout. This is by design but changes
   day-to-day workflow immediately.
2. **Agent defs reference skills not yet curated locally** (e.g.
   solution-architect frontmatter lists architecture-discovery,
   task-decomposition). Harmless until the skills Work Block lands, but those
   agents run without their helper skills.
3. **User-level `~/.claude/agents` drift**: 5 of 8 user-level agent files
   differ from baseline; project-level copies now take precedence inside this
   repo — intended, but behavior may differ from other projects.
4. `typecheck.sh` runs `npx tsc --noEmit` per TS edit (30s timeout) — adds
   latency on web/admin/showcase edits.
5. Gate files are committed templates, so Claude Code sessions must populate
   them with per-Work-Block evidence before write/closeout actions.

## Status

Ready for Owner review. Nothing staged or committed.
