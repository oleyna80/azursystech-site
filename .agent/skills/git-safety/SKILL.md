---
name: git-safety
description: Safe git operations—scoped commits, merge protocol, shell context guards. Explicit scope containment, secret scanning, multi-agent conflict resolution. Use for whitelisted-only commits, parallel merge coordination, and shell context fixes.
user-invocable: true
allowed-tools:
  - Read
  - Bash(git *)
  - Bash(ls *)
  - Bash(find *)
  - Bash(grep *)
  - Bash(cat *)
  - Bash(npm *)
  - Bash(npx *)
  - Bash(curl *)
  - Bash(fuser *)
  - Bash(node *)
  - Bash(rg *)
  - Bash(jq *)
---

# git-safety: Scoped Commits, Merge Protocol, Shell Context Guards

> Consolidated skill merging merge-protocol, scoped-commit-guard, and shell-context-guard. Ensures safe git operations through explicit whitelisting, conflict resolution, and shell-context awareness.

## Modes & When to Use

| Mode | Authority | Triggers | Purpose | Reference |
|---|---|---|---|---|
| **scoped-commit** | Scoped Coder + Control Tower | "scoped commit", dirty worktree, multi-file changes | Commit ONLY whitelisted files. Secret scan. Prevent noise/leaks. | `reference/scoped-commit.md` |
| **merge-protocol** | Control Tower | 2+ subagents completed, Workflow tool finished parallel tasks, stage boundary with parallel work | Deduplicate, resolve conflicts, consolidate findings across parallel agents. | `reference/merge.md` |
| **shell-context** | Control Tower | "команда не работает в PowerShell", Linux path in Windows shell, no such file/directory | Detect shell context (PowerShell vs bash) and emit commands in correct syntax. | `reference/shell-context.md` |

## Mode Decision Tree

**Q1: What am I doing?**
- Making a commit in dirty worktree → scoped-commit (whitelist-only, no `git add .`)
- 2+ subagents just completed → merge-protocol (deduplicate + resolve + consolidate)
- Command failed with shell error → shell-context (detect PowerShell vs bash, fix syntax)

**Q2: Is the scope clear?**
- scoped-commit: whitelist files before staging. Secret scan before committing.
- merge-protocol: all agents completed? All reports available? Conflicts detected?
- shell-context: PowerShell or bash? Windows or Linux?

**Q3: What are the hard limits?**
- scoped-commit: NO `git add .`, NO `git commit -a`, NO `git reset --hard`. Forbidden: .env, keys, credentials, tokens, DB dumps, secrets.
- merge-protocol: no unresolvable conflicts. BLOCK if two agents contradict on same file.
- shell-context: no mixed PowerShell+bash in one command block. Separate by shell context.

## Explicit Conflict Resolution (merge-protocol)

| Agent A | Agent B | Result | Rationale |
|---|---|---|---|
| PASS | ISSUES | **ISSUES wins** | Conservative — don't silence findings |
| PASS | BLOCKED | **BLOCKED wins** | BLOCKED is the strongest signal |
| ISSUES | BLOCKED | **BLOCKED wins** | Verifier authority |
| ISSUES (type A) | ISSUES (type B) | **Both included** | Complementary findings |
| ISSUES (same) | ISSUES (same) | **One entry, both credited** | Deduplicate |

**Unresolvable:** Two agents produce contradictory evidence on same file → ESCALATE to Control Tower. Hard stop.

## Workflow Summary

### scoped-commit
1. Whitelist files for this commit
2. `git add <whitelist only>`
3. `git status --short` to verify
4. `git diff --cached` to check diff
5. Secret scan (staged set)
6. `git commit -m "message"`
7. Attempt push; on SSH fail, provide manual command

### merge-protocol
1. Collect all subagent reports
2. Read review-log for verdicts
3. Deduplicate findings (group by file:line)
4. Detect conflicts (apply resolution rules)
5. Classify (P0/P1/P2/accepted)
6. Produce consolidation report
7. Update orchestrator-log and review-log
8. Return to Control Tower (PROCEED / ESCALATE)

### shell-context
1. Detect shell context (PowerShell vs bash)
2. Emit commands in correct syntax for detected context
3. For Linux tasks, provide SSH step first
4. Mark expected prompt before command block
5. Diagnose first failing step

## Hard Limits

- scoped-commit: Forbidden absolute: .env, .env.*, secrets/**, *.pem, *.key, DATABASE_URL, tokens, API keys, PRIVATE KEY, BEGIN RSA, BEGIN OPENSSH, BEGIN EC
- merge-protocol: Must resolve or escalate all conflicts. BLOCKED verdict halts pipeline.
- shell-context: Never mix shell syntaxes. Separate PowerShell and bash blocks.

## Handoff

- **scoped-commit:** Success = commit hash + files included + push status. Auto-proceed.
- **merge-protocol:** Success = consolidation report written, all findings deduplicated, conflicts resolved or escalated, logs updated. Auto-proceed if no conflicts; hard stop if unresolvable.
- **shell-context:** Success = commands emitted in correct syntax for detected shell. Auto-proceed.

---

## Reference Files

- [`reference/scoped-commit.md`](reference/scoped-commit.md) — Scoped Commit Guard (scoped-commit mode)
- [`reference/merge.md`](reference/merge.md) — Merge Protocol (merge-protocol mode)
- [`reference/shell-context.md`](reference/shell-context.md) — Shell Context Guard (shell-context mode)

