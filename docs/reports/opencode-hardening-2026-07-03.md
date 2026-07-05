# OpenCode Hardening — Closeout Report — 2026-07-03

Work Block: WB-2026-07-03-opencode-hardening
Mode: Owner-approved implementation of items 1–3 from prior assessment.
Nothing staged or committed.

## Changes

- **`opencode.json` (new, repo root, committed):**
  - `permission.bash` floor: default `ask` for everything; `allow` for
    read-only commands (git status/diff/log/show, rg, grep, find, ls, cat,
    head, tail, wc, sort, uniq, jq, npm run, npx tsc --noEmit); `deny` for
    Hard-Stop mirrors — push to origin main, force push, `git reset --hard`,
    ssh/scp, `docker push`, `prisma migrate deploy` / `db push`, direct
    `codex` CLI.
  - `share: "disabled"` — session sharing off (client/code data never
    published by accident).
  - `autoupdate: false` — version pinned; frontmatter schema already broke
    startup once, updates now deliberate.
  - No provider/model/credential settings — opencode auth lives in
    `~/.local/share/opencode`, outside the repo.
- `FILE_REGISTRY.yml`: new `opencode.json` entry
  (`opencode_permission_floor`), update_when tied to AGENTS.md Hard Stops and
  `.claude/hooks/hard-stop.sh` sync.
- `PROJECT_MAP.md`: `opencode.json` row in Key Paths.
- `.agent/ROSTER.md` (OpenCode section): root config described + GPT-model
  note (below).

## GPT Models in OpenCode (Owner question)

Confirmed against opencode docs: OpenCode authenticates OpenAI natively via
ChatGPT Plus/Pro subscription (`opencode auth login` → OpenAI →
ChatGPT Plus/Pro), no separate API key needed. Therefore Codex MCP is NOT
required inside OpenCode — it remains the contract mechanism for the Claude
Code runtime only. Inside OpenCode, gpt-critic/gpt-verifier can pin a GPT
model directly via `model:` frontmatter.

Follow-up (Owner to pick model IDs): run `opencode models`, then set
`model: openai/<id>` in `.opencode/agents/gpt-critic.md` and
`gpt-verifier.md`. Not done now to avoid committing wrong model IDs.
The `"codex *": "deny"` bash rule stays — it blocks the *shell* bypass, not
native provider routing.

## Deliberate Semantics

Claude's `hard-stop.sh` denies outright (Owner runs manually); in OpenCode the
default `ask` is itself an Owner-approval prompt, so `deny` is reserved for
never-in-agent-hands operations (destructive git, deploy, live DB, ssh, direct
codex CLI). Everything unlisted still requires interactive approval.

## Verification (lite, inline)

- `opencode agent list` loads with the new root config — schema valid, no
  startup errors.
- `git check-ignore opencode.json` — committable.
- `git diff --check` — clean.
- FILE_REGISTRY.yml parses as YAML.

## Follow-ups Open

1. `model:` frontmatter for gpt-* opencode agents (after `opencode models`).
2. Plugin gates in `.opencode/plugins/` (tool.execute.before: .env read
   protection, critic/verification gate parity) — separate Work Block.
3. Drift-check `.claude/agents/` ↔ `.opencode/agents/` — separate Work Block.

## Status

Ready for Owner review/commit. Gate files hold live session values — reset
from scratchpad backups before commit.
