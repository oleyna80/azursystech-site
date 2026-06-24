# Codex Stage 0 Write Gate

Status: READY
Expires: 2026-06-25
Work Block: WB-2026-06-21-a5-codex-runtime-decision
Side-effect class: local-docs/workflow
DB action mode: none

Approved Control Tower write-set:
- .codex/write-gate.md
- docs/plans/WB-2026-06-21-a5-codex-runtime-decision.md
- docs/plans/WB-2026-06-21-a5-codex-runtime-decision-claude-coder-task.md
- docs/plans/WB-2026-06-21-a5-codex-runtime-decision-claude-review-task.md
- docs/plans/WB-2026-06-21-a5-codex-runtime-decision-claude-verifier-task.md

Approved Claude Code Coder subject write-set:
- .codex/agents/verifier.toml
- .codex/agents/scoped-coder.toml
- .codex/config.toml.template
- .codex/critic.md
- .codex/hooks/stage0_write_gate.py
- .codex/instructions.md

Approved Claude Code Reviewer/Verifier write-set:
- none; read-only repository inspection and stdout reports only.

Allowed external runtimes/MCPs:
- `mcp-codex` only as the Owner-authorized GPT-subagent bridge inside Claude
  Code for this WB. No other external AI runtime or MCP is authorized.

Plan status: verification complete on 2026-06-24. Critic findings are
dispositioned. Claude Code Coder, Reviewer, and Verifier missions completed.
The A5 six-file subject candidate is ready for separate Owner commit decision;
staging, commit, and push remain unauthorized here.

Codex Critic: SUPPLEMENT; native read-only re-review completed.
Orchestrator Response: all initial `RECONSIDER` findings and both re-review
supplements are accepted and incorporated. Current Owner direction restricts
Codex-native subagents to Critic only; Coder, Review, and Verification must run
through Claude Code and its scoped subagents.

Hard Stops:
- Codex Control Tower must not edit the six A5 subject files directly;
- Claude Code may edit only the six A5 subject files after receiving the
  approved task file;
- no read or write of `.codex/config.toml`, `.claude/settings.json`, `.env*`,
  provider credentials, private endpoints, tokens, or API keys;
- no external AI CLI/MCP launch except the Owner-authorized `mcp-codex` bridge
  inside Claude Code for GPT subagents;
- no dependency, application, deploy, DB, production-config, or generated-output changes;
- no staging, commit, or push without later explicit Owner confirmation;
- destructive Git, history rewrite, branch switch, merge, stash, or cleanup.

Notes:
- The A1 runtime group is published at `c0a91e3` on
  `origin/feature/showcase-demo-templates`.
- A5 is the required dependency before A6 workflow docs.
- Claude Code is the sole A5 Coder after refreshed Critic approval; Claude Code
  also owns Review and Verification missions for this WB.
- `mcp-codex` is allowed here because the Owner authorized GPT subagents inside
  Claude Code; this is not a general permission for nested external AI tooling.
- Critic `SUPPLEMENT` disposition: gate now explicitly separates Control Tower
  lifecycle writes, Claude Code Coder subject writes, and read-only Claude Code
  Review/Verification.
- Claude Code Review verdict: `APPROVE`. Claude Code Verification verdict:
  `SPEC_OK` and `APPROVED`.
- Existing unrelated dirty files remain frozen, unstaged, and out of scope.
