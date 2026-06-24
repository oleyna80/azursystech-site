#!/usr/bin/env bash
# Hard Stop hook — blocks dangerous commands before execution.
# AGENTS.md § Hard Stops require explicit Owner approval.
#
# Strips git commit -m "..." and echo "..." arguments before checking,
# because they contain arbitrary text, not executable intent.
set -euo pipefail

cmd=$(jq -r '.tool_input.command // ""' 2>/dev/null || echo "")

# Block: echo / git commit -m with shell expansions — $(...), $var, backticks
if echo "$cmd" \
  | tr '\n' ' ' \
  | grep -oP '(^|[&;|]\s*)\K(echo|git\s+commit)\s+[^&;|]*' \
  | grep -qP '\$\(|`'; then
  jq -n '{
    continue: false,
    systemMessage: "\n🛑 BLOCKED: command contains shell expansion in echo/git-commit argument\nCannot auto-validate — expansions execute before the hook can inspect text.\nRewrite without $() or backticks, or ask Owner to approve manually.",
    hookSpecificOutput: {
      hookEventName: "PreToolUse",
      permissionDecision: "deny",
      permissionDecisionReason: "Shell expansion in echo/git-commit bypasses text-based stripping"
    }
  }'
  exit 0
fi

# Remove quoted text from git commit -m and echo — these carry arbitrary text
clean_cmd=$(echo "$cmd" \
  | tr '\n' ' ' \
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

# ── push to origin main ──────────────────────────────────────────────
if echo "$clean_cmd" | grep -qP 'git\s+push\s+(-[^\s]*\s+)*origin\s+main\b'; then
  jq -n '{
    continue: false,
    systemMessage: "\n🛑 HARD STOP: push to origin main\nAGENTS.md § Hard Stops requires Owner approval.",
    hookSpecificOutput: {
      hookEventName: "PreToolUse",
      permissionDecision: "deny",
      permissionDecisionReason: "Hard Stop: push to origin main requires Owner approval (AGENTS.md)"
    }
  }'
  exit 0
fi

# ── destructive git ops ──────────────────────────────────────────────
if echo "$clean_cmd" | grep -qP '(git\s+reset\s+--hard|git\s+(push|clean)\s+.*(-[^\s]*f|--force)\b|git\s+push\s+.*:\s*\w+\s*$|git\s+checkout\s+--\s+\.)'; then
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
if echo "$clean_cmd" | grep -qP '(docker\s+(push|image\s+push)|(bash\s+|\./|scripts/)build-push-image\.sh|scp\s+.*\bdeploy\b|ghcr\.io.*push)'; then
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
