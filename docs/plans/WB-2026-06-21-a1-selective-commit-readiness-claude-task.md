# Claude Code Task: A1 Commit Boundary Audit

## Mission

- **Work Block:** `WB-2026-06-21-a1-selective-commit-readiness`
- **Role:** Reviewer / Commit Boundary Analyst
- **Mode:** strictly read-only
- **Objective:** determine whether the exact eight-path A1 runtime-policy group
  is a coherent selective commit candidate in the current dirty tree.
- **Expected output:** stdout report with `READY` or `BLOCKED`, exact include and
  exclude conclusions, findings, commands/checks, residual risks, and proposed
  commit message.
- **File-change permission:** none.

## Authorized Read Scope

Read only these subject paths:

```text
AGENTS.md
.agent/ROSTER.md
.agent/skills/ai-runtime-ops/SKILL.md
.agent/skills/lead-response-ops/SKILL.md
.agent/skills/nextjs-seo-build-verifier/SKILL.md
.claude/skills/ai-runtime-ops/SKILL.md
.claude/skills/lead-response-ops/SKILL.md
.claude/skills/nextjs-seo-build-verifier/SKILL.md
```

You may also read these control/evidence files:

```text
docs/plans/WB-2026-06-20-dirty-tree-disposition.md
docs/plans/WB-2026-06-21-a1-agent-runtime-claude-coder-pilot.md
docs/plans/WB-2026-06-21-a1-selective-commit-readiness.md
docs/reports/review-WB-2026-06-21-a1-agent-runtime-claude-coder-pilot.md
docs/reports/verification-WB-2026-06-21-a1-agent-runtime-claude-coder-pilot.md
```

Git metadata and diffs may be read with `git status`, `git rev-parse`,
`git diff`, `git show`, `git ls-files`, and deterministic hashing/comparison
commands. Do not read `.claude/settings.json`, `.env*`, provider configuration,
credentials, application files, deployment files, or unrelated untracked
content.

## Accepted Manifest and SHA-256

```text
a91a9301db162b9fdeb77580b064a5d8fdedec4b370ec99416ab6d10e3937d4b  AGENTS.md
76f3a249961b575504cabe6274d34e7a6a59b140211bc7f6fcca7a3162036741  .agent/ROSTER.md
c5fb4910649d1a8d1adfea75ac8f214350538f00c0fb0e4800ca0714ac4a92e6  .agent/skills/ai-runtime-ops/SKILL.md
a746600849db3b12cacd232c154be66f1285f3ecb5aa48a8f878a60c8462135a  .agent/skills/lead-response-ops/SKILL.md
d736e81383864f902de9ed7020698ed7d6cae7ae15ae284347b43aea9c84d1e4  .agent/skills/nextjs-seo-build-verifier/SKILL.md
596bb72fa023321d0550edb925c50763812ba07ad2899d3acda97c42d4500502  .claude/skills/ai-runtime-ops/SKILL.md
c07f7137c864a72aa723101947a42e6f667716c7b81b03f038c857dba3c2cc7b  .claude/skills/lead-response-ops/SKILL.md
7fbd83be4cdc129a16d477eb57a1c90fb16a8ebb525a2e18cfe833cf3d030929  .claude/skills/nextjs-seo-build-verifier/SKILL.md
```

## Required Checks

1. Confirm HEAD and report whether the Git index is initially empty.
2. Confirm the candidate manifest is exactly the eight paths above and propose
   no ninth path.
3. Recompute all eight worktree SHA-256 values and compare to the baseline.
4. Inspect the complete unstaged diff for only these eight paths.
5. Confirm Codex and Claude Code are the only active runtimes; Qwen/Gemini have
   no active runtime sections; RooCode/Cline are only retired/generic references.
6. Strip YAML frontmatter deterministically and byte-compare each matching
   `.agent` and `.claude` skill body.
7. Scan only the eight subject files/diff for credential values, private keys,
   provider settings, private config paths, and unrelated content.
8. Return an explicit `READY` only if every check passes; otherwise return
   `BLOCKED` with exact evidence.

## Hard Prohibitions

- Do not edit, create, remove, rename, format, or chmod any file.
- Do not stage or unstage anything.
- Do not commit, push, fetch, merge, rebase, switch branches, stash, clean, or reset.
- Do not invoke another AI runtime or subagent.
- Do not request expanded scope.
- Do not expose secrets or private configuration in the report.

## Output Contract

Write the report to stdout only with these sections:

```text
VERDICT: READY | BLOCKED
HEAD
INDEX STATE
EXACT INCLUDE MANIFEST
EXPLICIT EXCLUSIONS
BASELINE HASH RESULTS
POLICY RESULTS
MIRRORED BODY RESULTS
SECURITY/SCOPE RESULTS
FINDINGS
CHECKS EXECUTED
RESIDUAL RISKS
PROPOSED COMMIT MESSAGE
```

The recommended message is `docs(sdlc): align active agent runtimes`; propose a
different message only with a concrete reason. End after the report.
