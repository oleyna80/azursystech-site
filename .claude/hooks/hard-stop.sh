#!/usr/bin/env bash
# Hard Stop hook — blocks dangerous commands before execution.
# AGENTS.md § Hard Stops require explicit Owner approval.
# This hook implements structural enforcement of those rules.
#
# Reads PreToolUse JSON from stdin, checks command against blocklist,
# outputs block JSON (continue:false) when a Hard Stop is triggered.
set -euo pipefail

cmd=$(jq -r '.tool_input.command // ""' 2>/dev/null || echo "")

# Skip: git commit -m and echo contain arbitrary text, not executable intent
if echo "$cmd" | grep -qP '^(git\s+commit\b|echo\b)'; then
  exit 0
fi

# ── push to origin main ──────────────────────────────────────────────
if echo "$cmd" | grep -qP 'git\s+push\s+(-[^\s]*\s+)*origin\s+main\b'; then
  jq -n '{
    continue: false,
    systemMessage: "\n[1;31m🛑 HARD STOP: push to origin main[0m\nAGENTS.md § Hard Stops requires explicit Owner approval before pushing to main.\nUse a PR or ask Owner to approve this push.",
    hookSpecificOutput: {
      hookEventName: "PreToolUse",
      permissionDecision: "deny",
      permissionDecisionReason: "Hard Stop: push to origin main requires Owner approval (AGENTS.md)"
    }
  }'
  exit 0
fi

# ── destructive git ops ──────────────────────────────────────────────
if echo "$cmd" | grep -qP '(git\s+reset\s+--hard|git\s+(push|clean)\s+.*(-[^\s]*f|--force)\b|git\s+push\s+.*:\s*\w+\s*$|git\s+checkout\s+--\s+\.)'; then
  jq -n '{
    continue: false,
    systemMessage: "\n[1;31m🛑 HARD STOP: destructive git operation[0m\nAGENTS.md § Hard Stops: reset --hard, force push, force clean require Owner approval.\nDouble-check what you are about to destroy.",
    hookSpecificOutput: {
      hookEventName: "PreToolUse",
      permissionDecision: "deny",
      permissionDecisionReason: "Hard Stop: destructive git ops require Owner approval (AGENTS.md)"
    }
  }'
  exit 0
fi

# ── production deploy ─────────────────────────────────────────────────
if echo "$cmd" | grep -qP '(docker\s+(push|image\s+push)|(bash\s+|\./|scripts/)build-push-image\.sh|scp\s+.*\bdeploy\b|ghcr\.io.*push)'; then
  jq -n '{
    continue: false,
    systemMessage: "\n[1;31m🛑 HARD STOP: production deploy[0m\nAGENTS.md § Hard Stops: Docker push / VPS deploy require Owner approval.\nIrreversible side effect — must be explicitly approved.",
    hookSpecificOutput: {
      hookEventName: "PreToolUse",
      permissionDecision: "deny",
      permissionDecisionReason: "Hard Stop: production deploy requires Owner approval (AGENTS.md)"
    }
  }'
  exit 0
fi

# ── live DB migration ─────────────────────────────────────────────────
if echo "$cmd" | grep -qP '(prisma\s+migrate\s+deploy|prisma\s+db\s+push|psql\s+.*\b(production|live|prod)\b|DATABASE_URL)'; then
  jq -n '{
    continue: false,
    systemMessage: "\n[1;31m🛑 HARD STOP: live database operation[0m\nAGENTS.md § Hard Stops: live DB migrations require Owner approval.\nVerify DB action mode before proceeding.",
    hookSpecificOutput: {
      hookEventName: "PreToolUse",
      permissionDecision: "deny",
      permissionDecisionReason: "Hard Stop: live DB migration requires Owner approval (AGENTS.md)"
    }
  }'
  exit 0
fi

# ── client communications ─────────────────────────────────────────────
if echo "$cmd" | grep -qP '(\bsendmail\b|\bmail\s+-s\b|curl.*api\.whatsapp.*POST|\bmsmtp\b|\bssmtp\b)'; then
  jq -n '{
    continue: false,
    systemMessage: "\n[1;31m🛑 HARD STOP: client communication[0m\nAGENTS.md § Hard Stops: sending real client email/WhatsApp requires Owner approval.",
    hookSpecificOutput: {
      hookEventName: "PreToolUse",
      permissionDecision: "deny",
      permissionDecisionReason: "Hard Stop: client communications require Owner approval (AGENTS.md)"
    }
  }'
  exit 0
fi

# ── credential rotation ───────────────────────────────────────────────
if echo "$cmd" | grep -qP '(passwd\b|chpasswd\b|htpasswd\b|openssl\s+genpkey|ssh-keygen.*-f\s+\S*id_)'; then
  jq -n '{
    continue: false,
    systemMessage: "\n[1;31m🛑 HARD STOP: credential operation[0m\nAGENTS.md § Hard Stops: credential rotation/secret changes require Owner approval.\nSecurity perimeter change — must be explicitly approved.",
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
