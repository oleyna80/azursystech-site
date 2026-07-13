#!/usr/bin/env bash
# Hard Stop hook — blocks dangerous commands before execution.
# AGENTS.md § Hard Stops require explicit Owner approval.
#
# Strips git commit -m "..." and echo "..." arguments before checking,
# because they contain arbitrary text, not executable intent.
set -euo pipefail

cmd=$(jq -r '.tool_input.command // ""' 2>/dev/null || echo "")

# Quote-aware newline normalization. Newline outside quotes is a command
# separator (→ ";"), inside quotes it is text (→ " "), so echo/git-commit
# segments end at line boundaries and the sed strips below cannot swallow
# the next line (echo done<NL>rm -rf x must stay visible as a command).
norm_cmd=$(printf '%s' "$cmd" | perl -0777 -ne '
  my ($sq,$dq,$esc)=(0,0,0);
  for my $c (split //) {
    if ($esc) { print($c eq "\n" ? " " : $c); $esc=0; next }
    if ($c eq "\\" && !$sq) { print $c; $esc=1; next }
    if ($c eq "\x27" && !$dq) { $sq=!$sq; print $c; next }
    if ($c eq "\"" && !$sq) { $dq=!$dq; print $c; next }
    if ($c eq "\n") { print(($sq||$dq) ? " " : ";"); next }
    print $c;
  }
')

# Block: echo / git commit -m with shell expansions — $(...), $var, backticks
if printf '%s' "$norm_cmd" \
  | grep -oP '(^|[&;|]\s*)\K(echo|git\s+commit)\s+[^&;|]*' \
  | grep -qP '\$\(|`'; then
  jq -n '{
    continue: false,
    systemMessage: "\n🛑 BLOCKED: command contains shell expansion in echo/git-commit argument\nCannot auto-validate — expansions execute before the hook can inspect text.\nRewrite without $() or backticks (for commits: write the message to a file and use `git commit -F <file>`), or ask Owner to approve manually.",
    hookSpecificOutput: {
      hookEventName: "PreToolUse",
      permissionDecision: "deny",
      permissionDecisionReason: "Shell expansion in echo/git-commit bypasses text-based stripping"
    }
  }'
  exit 0
fi

# Remove quoted text from git commit -m and echo — these carry arbitrary text
clean_cmd=$(printf '%s' "$norm_cmd" \
  | sed -E '
    s/git commit -m "[^"]*"/git commit/g
    s/git commit -m '\''[^'\'']*'\''/git commit/g
    s/echo "[^"]*"/echo/g
    s/echo '\''[^'\'']*'\''/echo/g
    s/echo\s+[^|&;]+/echo/g
  ')

# ── direct Codex CLI ─────────────────────────────────────────────────
# Codex is allowed through the configured MCP server only.
# Direct shell calls bypass the CC-native read-only reviewer/verifier contract.
codex_violation=$(
  printf '%s' "$clean_cmd" \
    | sed -E 's/[;&|]+/\n/g' \
    | sed -E 's/^[[:space:]]+//; s/[[:space:]]+$//' \
    | grep -P '^([A-Za-z_][A-Za-z0-9_]*=[^[:space:]]+[[:space:]]+)*codex\s+' \
    | grep -vP '^([A-Za-z_][A-Za-z0-9_]*=[^[:space:]]+[[:space:]]+)*codex\s+mcp-server(\s|$)' \
    || true
)
if [ -n "$codex_violation" ]; then
  jq -n '{
    continue: false,
    systemMessage: "\n🛑 HARD STOP: direct Codex CLI call\nUse the codex MCP server through mcp__codex__codex. Direct codex shell calls bypass the framework reviewer/verifier contract.",
    hookSpecificOutput: {
      hookEventName: "PreToolUse",
      permissionDecision: "deny",
      permissionDecisionReason: "Hard Stop: direct Codex CLI usage is not allowed; use MCP-backed GPT critic/verifier agents"
    }
  }'
  exit 0
fi

# ── destructive git ops ──────────────────────────────────────────────
# checkout/restore: block only whole-tree discard (bare-dot pathspec token:
# ".", "./", ".."); single-file checkout/restore stays allowed (gate-reset ritual).
# Global opts (-C/--git-dir/--work-tree) may precede the subcommand.
# push/clean -f: match f anywhere in a standalone option token (-fd, -xdf),
# not inside branch names like feat-fix.
if echo "$clean_cmd" | grep -qP '(git\s+reset\s+--hard|git\s+(push|clean)(\s+\S+)*\s+(-[a-zA-Z]*f[a-zA-Z]*|--force)(\s|$)|git\s+push\s+.*\+\s*\w+|git\s+push\s+.*:\s*\w+\s*$|git\s+((-C|--git-dir|--work-tree)(=\S+|\s+\S+)\s+)*(checkout|restore)(\s+[^&;|]*)?\s+\.{1,2}/?(\s|$))'; then
  jq -n '{
    continue: false,
    systemMessage: "\n🛑 HARD STOP: destructive git operation\nAGENTS.md § Hard Stops requires Owner approval.",
    hookSpecificOutput: {
      hookEventName: "PreToolUse",
      permissionDecision: "deny",
      permissionDecisionReason: "Hard Stop: destructive git ops require Owner approval (AGENTS.md)"
    }
  }'
  exit 0
fi

# ── push to origin main ──────────────────────────────────────────────
# Approval channel: check memory_bank/orchestrator-log.md for same-day Owner approval.
# Format: | YYYY-MM-DD | push-approval | push: APPROVED origin main - <reason> | Owner |
# This is a cooperative control, not cryptographic. Control Tower records the entry
# only on explicit Owner instruction in chat.
# Belt-and-suspenders: even with a valid approval entry, force-push/destructive ops
# are denied by the destructive-git block above.
if echo "$clean_cmd" | grep -qP 'git\s+push\s+(-[^\s]*\s+)*origin\s+main\b'; then
  # Belt-and-suspenders: re-check that this is not a force-push or destructive operation.
  # Even with approval, force-push (-f, --force, +) is denied. The destructive-git block
  # above already caught these, but we re-check here to protect against future reordering.
  if echo "$clean_cmd" | grep -qE '(-f|--force|\+)'; then
    jq -n '{
      continue: false,
      systemMessage: "\n🛑 HARD STOP: force-push blocked\nDestructive operations (force-push, rebase push, deletion) cannot be unlocked by approval. Even with orchestrator-log approval, force-push is denied. Only plain \`git push origin main\` is unlockable.",
      hookSpecificOutput: {
        hookEventName: "PreToolUse",
        permissionDecision: "deny",
        permissionDecisionReason: "Hard Stop: force-push is destructive and cannot be unlocked by orchestrator-log approval"
      }
    }'
    exit 0
  fi

  # Check for same-day approval in orchestrator-log
  today=$(date +%F)
  if [ -f "memory_bank/orchestrator-log.md" ] && \
     grep -qE "^\| $today \| push-approval \| push: APPROVED origin main - .+ \| Owner \|[[:space:]]*$" "memory_bank/orchestrator-log.md"; then
    # Approval found, allow push
    exit 0
  fi

  # No approval found, deny
  jq -n '{
    continue: false,
    systemMessage: "\n🛑 HARD STOP: push to origin main\nAGENTS.md § Hard Stops requires Owner approval.\n\nApproval channel: Owner may approve by instructing Control Tower to record an entry in memory_bank/orchestrator-log.md with format:\n| YYYY-MM-DD | push-approval | push: APPROVED origin main - <reason> | Owner |\n\nThis approval is valid for the calendar day only and does not unlock force-push or destructive operations.",
    hookSpecificOutput: {
      hookEventName: "PreToolUse",
      permissionDecision: "deny",
      permissionDecisionReason: "Hard Stop: push to origin main requires Owner approval recorded in orchestrator-log (AGENTS.md)"
    }
  }'
  exit 0
fi

# ── remote SSH access ────────────────────────────────────────────────
if echo "$clean_cmd" | grep -qP '(^|[&;|]\s*)ssh\s+'; then
  jq -n '{
    continue: false,
    systemMessage: "\n🛑 HARD STOP: remote SSH access\nAGENTS.md § Hard Stops requires Owner approval.",
    hookSpecificOutput: {
      hookEventName: "PreToolUse",
      permissionDecision: "deny",
      permissionDecisionReason: "Hard Stop: remote SSH access requires Owner approval (AGENTS.md)"
    }
  }'
  exit 0
fi

# ── destructive filesystem ops ───────────────────────────────────────
if echo "$clean_cmd" | grep -qP '(^|[&;|]\s*)(rm\s+|rmdir\s+|find\s+[^&;|]*\s-delete\b)'; then
  jq -n '{
    continue: false,
    systemMessage: "\n🛑 HARD STOP: destructive filesystem operation\nAGENTS.md § Hard Stops requires Owner approval.",
    hookSpecificOutput: {
      hookEventName: "PreToolUse",
      permissionDecision: "deny",
      permissionDecisionReason: "Hard Stop: destructive filesystem ops require Owner approval (AGENTS.md)"
    }
  }'
  exit 0
fi

# ── production deploy ─────────────────────────────────────────────────
if echo "$clean_cmd" | grep -qP '(docker\s+(push|image\s+push|compose\s+push)|(bash\s+|\./|scripts/)build-push-image\.sh|scp\s+.*\bdeploy\b|ghcr\.io.*push)'; then
  jq -n '{
    continue: false,
    systemMessage: "\n🛑 HARD STOP: production deploy\nAGENTS.md § Hard Stops requires Owner approval.",
    hookSpecificOutput: {
      hookEventName: "PreToolUse",
      permissionDecision: "deny",
      permissionDecisionReason: "Hard Stop: production deploy requires Owner approval (AGENTS.md)"
    }
  }'
  exit 0
fi

# ── live DB migration ────────────────────────────────────────────────
# DATABASE_URL is not dangerous by itself: read-only commands like
# `grep DATABASE_URL .env.example` must remain possible. Block it only when it
# is part of a DB-mutating command segment.
if echo "$clean_cmd" | grep -qP '(prisma\s+migrate\s+deploy|prisma\s+db\s+push|psql\s+.*\b(production|live|prod)\b|DATABASE_URL[^&;|]*(prisma\s+migrate\s+deploy|prisma\s+db\s+push|psql\b)|(prisma\s+migrate\s+deploy|prisma\s+db\s+push|psql\b)[^&;|]*DATABASE_URL)'; then
  jq -n '{
    continue: false,
    systemMessage: "\n🛑 HARD STOP: live database operation\nAGENTS.md § Hard Stops requires Owner approval.",
    hookSpecificOutput: {
      hookEventName: "PreToolUse",
      permissionDecision: "deny",
      permissionDecisionReason: "Hard Stop: live DB migration requires Owner approval (AGENTS.md)"
    }
  }'
  exit 0
fi

# ── client communications ─────────────────────────────────────────────
if echo "$clean_cmd" | grep -qP '(\bsendmail\b|\bmail\s+-s\b|curl.*api\.whatsapp.*POST|\bmsmtp\b|\bssmtp\b)'; then
  jq -n '{
    continue: false,
    systemMessage: "\n🛑 HARD STOP: client communication\nAGENTS.md § Hard Stops requires Owner approval.",
    hookSpecificOutput: {
      hookEventName: "PreToolUse",
      permissionDecision: "deny",
      permissionDecisionReason: "Hard Stop: client communications require Owner approval (AGENTS.md)"
    }
  }'
  exit 0
fi

# ── credential rotation ──────────────────────────────────────────────
if echo "$clean_cmd" | grep -qP '(passwd\b|chpasswd\b|htpasswd\b|openssl\s+genpkey|ssh-keygen.*-f\s+\S*id_)'; then
  jq -n '{
    continue: false,
    systemMessage: "\n🛑 HARD STOP: credential operation\nAGENTS.md § Hard Stops requires Owner approval.",
    hookSpecificOutput: {
      hookEventName: "PreToolUse",
      permissionDecision: "deny",
      permissionDecisionReason: "Hard Stop: credential rotation requires Owner approval (AGENTS.md)"
    }
  }'
  exit 0
fi

# No Hard Stop triggered — allow
exit 0
