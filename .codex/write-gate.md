# Codex Stage 0 Write Gate

Status: READY
Expires: 2026-06-25
Work Block: WB-2026-06-24-e2-e3-portability-ignore-policy
Side-effect class: local-docs/workflow plus local-test for non-mutating deploy preflight
DB action mode: none

Approved Control Tower write-set:
- .codex/write-gate.md
- docs/plans/WB-2026-06-24-e2-e3-portability-ignore-policy.md
- docs/plans/WB-2026-06-24-e2-e3-portability-ignore-policy-claude-coder-task.md
- docs/plans/WB-2026-06-24-e2-e3-portability-ignore-policy-claude-review-task.md
- docs/plans/WB-2026-06-24-e2-e3-portability-ignore-policy-claude-verifier-task.md

Approved Claude Code Coder write-set:
- .gitattributes
- .gitignore
- .codexignore
- .agentsignore
- .env.vps.example
- docs/plans/WB-2026-06-24-e2-e3-portability-ignore-policy.md

Approved Claude Code Reviewer/Verifier write-set:
- none; read-only repository inspection and stdout reports only.

Allowed external runtimes/MCPs:
- `mcp-codex` only as the Owner-authorized GPT-subagent bridge inside Claude
  Code for this WB. No other external AI runtime or MCP is authorized.

Plan status:
- Owner approved implementation on 2026-06-24.
- Native Codex Critic review verdict: APPROVE after all initial SUPPLEMENT
  findings were resolved.
- Claude Code is authorized for one write-capable Coder mission over the
  approved Coder write-set only.

Hard Stops:
- Claude Code Coder must not edit files outside the approved Coder write-set;
- Claude Code Reviewer and Verifier must not edit repository files;
- `.env.vps.example` is the only approved `.env*` exception and must remain a
  placeholder-only public template;
- no read or write of real `.env*`, `.codex/config.toml`, provider credentials,
  private keys, tokens, private endpoints, or local machine config;
- no application source, dependency, CI workflow, Docker/proxy/deploy script,
  database/schema, production config, generated-output cleanup, or package
  changes;
- no staging, commit, push, deploy, Docker push, branch switch, merge, stash,
  reset, clean, deletion, or history rewrite without later explicit Owner
  confirmation.

Required verification before Owner commit decision:
- `git status --short --branch`
- `git diff --check`
- `git diff --name-only -- .gitattributes .gitignore .codexignore .agentsignore .env.vps.example` (tracked modified files only; does NOT include untracked/new files)
- `git status --short -- .gitattributes .gitignore .codexignore .agentsignore .env.vps.example` (covers untracked/new files omitted by `git diff --name-only`)
- expected-ignored `git check-ignore -v` probes for private/runtime paths
- expected-visible `git check-ignore -v --non-matching` probes for SDLC/control
  paths and `.env.vps.example`
- direct secret scan over changed files and candidate diff, with placeholder
  hits triaged explicitly
- local deploy preflight for `.env.vps.example` or a blocked reason if Docker
  Compose is unavailable
- `bash -n deploy.sh` if present
- `bash scripts/bootstrap.sh` if present

Notes:
- Existing unrelated dirty files remain frozen, unstaged, and out of scope.
- No artificial token or monetary budget is assigned to Claude Code. Shell
  process supervision may be used only to avoid orphaned/hung local processes.
