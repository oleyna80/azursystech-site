#!/usr/bin/env bash
# Critic Gate hook - blocks Edit/MultiEdit/Write until critic review is
# resolved for the current Work Block and requested file path.
set -euo pipefail

GATE_FILE=".agent/critic-gate.md"

MEMORY_DIR="memory_bank"
[ -d "memory_bank" ] && [ -f "memory_bank/orchestrator-log.md" ] && MEMORY_DIR="memory_bank"
LOG_FILE="$MEMORY_DIR/orchestrator-log.md"

payload=$(cat)
tool=$(printf '%s' "$payload" | jq -r '.tool_name // ""' 2>/dev/null || echo "")
file_path=$(printf '%s' "$payload" | jq -r '.tool_input.file_path // ""' 2>/dev/null || echo "")
session_id=$(printf '%s' "$payload" | jq -r '.session_id // ""' 2>/dev/null || echo "")

deny() {
  local reason="$1"
  jq -n --arg reason "$reason" '{
    continue: false,
    hookSpecificOutput: {
      hookEventName: "PreToolUse",
      permissionDecision: "deny",
      permissionDecisionReason: $reason
    }
  }'
  exit 0
}

field() {
  local name="$1"
  grep -i "^${name}:" "$GATE_FILE" 2>/dev/null \
    | head -1 \
    | sed -E "s/^${name}:[[:space:]]*//I" \
    | xargs \
    || true
}

is_placeholder() {
  local value="$1"
  [ -z "$value" ] && return 0
  case "$value" in
    "["*"]"|PENDING|pending|none|NONE) return 0 ;;
    *) return 1 ;;
  esac
}

require_report_file() {
  local field_name="$1"
  local label="$2"
  local report_path
  report_path=$(field "$field_name")

  is_placeholder "$report_path" \
    && deny "Critic gate: ${label} requires ${field_name} to point to a report under docs/reports/."

  report_path=$(relative_path "$report_path")
  case "$report_path" in
    docs/reports/*) ;;
    *) deny "Critic gate: ${field_name} must be under docs/reports/, got '${report_path}'." ;;
  esac

  [ -s "$report_path" ] \
    || deny "Critic gate: ${field_name} report does not exist or is empty: ${report_path}."
}

require_log_entry() {
  local needle="$1"
  local label="$2"

  [ -f "$LOG_FILE" ] \
    || deny "Critic gate: ${label} requires orchestrator-log entry. ${LOG_FILE} not found."

  grep -q "^|.*${wb_id}.*${needle}" "$LOG_FILE" 2>/dev/null \
    || deny "Critic gate: ${label} missing orchestrator-log entry for ${wb_id}: ${needle}."
}

approved_write_set() {
  awk '
    BEGIN { in_set = 0 }
    /^Approved[ -]Write-Set:/ || /^Approved write-set:/ {
      in_set = 1
      next
    }
    in_set && /^[[:space:]]*[-*][[:space:]]+/ {
      sub(/^[[:space:]]*[-*][[:space:]]+/, "")
      print
      next
    }
    in_set && /^[[:space:]]*$/ { next }
    in_set && /^[A-Za-z][A-Za-z -]*:/ { exit }
  ' "$GATE_FILE"
}

relative_path() {
  local path="$1"
  local cwd
  cwd=$(pwd)
  path="${path#./}"
  case "$path" in
    "$cwd"/*) path="${path#"$cwd"/}" ;;
  esac
  printf '%s' "$path"
}

path_allowed() {
  local path="$1"
  local rel_path pattern
  rel_path=$(relative_path "$path")

  while IFS= read -r pattern; do
    pattern="${pattern%%#*}"
    pattern="$(printf '%s' "$pattern" | xargs)"
    [ -z "$pattern" ] && continue
    [ "$pattern" = "[to be defined per Work Block]" ] && continue

    case "$pattern" in
      */)
        [[ "$rel_path" == "$pattern"* ]] && return 0
        ;;
      *)
        [[ "$rel_path" == "$pattern" ]] && return 0
        [[ "$rel_path" == $pattern ]] && return 0
        ;;
    esac
  done < <(approved_write_set)

  return 1
}

case "$tool" in
  Edit|MultiEdit|Write) ;;
  *) exit 0 ;;
esac

rel_file_path=$(relative_path "$file_path")

# Paths outside the repository (harness plan files, agent memory dirs) are not gated.
case "$rel_file_path" in
  /*) exit 0 ;;
esac

# Control Tower must always be able to open/refresh critic gate, verification gate,
# orchestrator log, and record critic/verification reports before gates reach READY.
case "$rel_file_path" in
  "$GATE_FILE"|"$LOG_FILE"|.agent/verification-gate.md) exit 0 ;;
  .claude/agent-memory/*/MEMORY.md) exit 0 ;;
  docs/reports/*) exit 0 ;;
esac

[ -n "$file_path" ] || deny "Critic gate: Edit/MultiEdit/Write payload did not include tool_input.file_path."
[ -f "$GATE_FILE" ] || deny "Critic gate: .agent/critic-gate.md is missing. Complete Stage 0 Preflight with critic review decision before editing files."

status=$(field "Status")
wb_id=$(field "Work Block")
verification_tier=$(field "Verification Tier")
new_domain=$(field "New Domain")
topology_status=$(field "Subagent Topology Status")
critic_verdict=$(field "Critic Verdict")
gpt_critic_status=$(field "GPT Critic Status")
gpt_critic_reason=$(field "GPT Critic Reason")
gpt_degraded_reason=$(field "GPT Critic Degraded Reason")
expires=$(field "Expires")
gate_session=$(field "Session")

[ -n "$wb_id" ] || deny "Critic gate: Work Block is required before repository edits."

if [ -n "$expires" ]; then
  today=$(date +%F)
  [[ "$expires" =~ ^[0-9]{4}-[0-9]{2}-[0-9]{2}$ ]] \
    || deny "Critic gate: Expires must use YYYY-MM-DD."
  [[ "$expires" < "$today" ]] \
    && deny "Critic gate: approval expired on ${expires}. Refresh Stage 0/0.5 before editing files."
fi

if [ -n "$gate_session" ] && [ "$gate_session" != "any" ]; then
  [ -n "$session_id" ] \
    || deny "Critic gate: Session is locked but hook payload has no session_id."
  [ "$gate_session" = "$session_id" ] \
    || deny "Critic gate: approval belongs to session ${gate_session}, current session is ${session_id}."
fi

path_allowed "$file_path" \
  || deny "Critic gate: ${rel_file_path} is outside the Approved Write-Set for ${wb_id}. If this file is intended, update Stage 0 approval by adding this line under Approved Write-Set in ${GATE_FILE}: - ${rel_file_path}"

case "$topology_status" in
  SINGLE_AGENT|PLANNED|BLOCKED) ;;
  PENDING|"") deny "Critic gate: Subagent Topology Status is ${topology_status:-missing}. Complete Stage 0 topology classification before editing files." ;;
  *) deny "Critic gate: invalid Subagent Topology Status '${topology_status}'. Use SINGLE_AGENT, PLANNED, or BLOCKED." ;;
esac

case "$gpt_critic_status" in
  NOT_REQUIRED|READY|DEGRADED) ;;
  PENDING|"") deny "Critic gate: GPT Critic Status is ${gpt_critic_status:-missing}. Complete GPT critic decision before editing files." ;;
  *) deny "Critic gate: invalid GPT Critic Status '${gpt_critic_status}'. Use NOT_REQUIRED, READY, or DEGRADED." ;;
esac

gpt_critic_required=0
case "$verification_tier" in
  full|FULL) gpt_critic_required=1 ;;
  lite|standard|LITE|STANDARD|"") ;;
  PENDING|pending) deny "Critic gate: Verification Tier is PENDING. Classify verification tier before editing files." ;;
  *) deny "Critic gate: invalid Verification Tier '${verification_tier}'. Use lite, standard, or full." ;;
esac
case "$new_domain" in
  true|TRUE|yes|YES) gpt_critic_required=1 ;;
  false|FALSE|no|NO|"") ;;
  PENDING|pending) deny "Critic gate: New Domain is PENDING. Classify domain status before editing files." ;;
  *) deny "Critic gate: invalid New Domain '${new_domain}'. Use true or false." ;;
esac
case "$critic_verdict" in
  RECONSIDER) gpt_critic_required=1 ;;
  APPROVE|SUPPLEMENT|PENDING|"") ;;
  *) deny "Critic gate: invalid Critic Verdict '${critic_verdict}'. Use APPROVE, SUPPLEMENT, RECONSIDER, or PENDING." ;;
esac

case "$gpt_critic_status" in
  NOT_REQUIRED)
    [ "$gpt_critic_required" -eq 0 ] \
      || deny "Critic gate: GPT critic is required by trigger; NOT_REQUIRED is not allowed."
    is_placeholder "$gpt_critic_reason" \
      && deny "Critic gate: GPT Critic Reason is required when GPT Critic Status is NOT_REQUIRED."
    ;;
  READY)
    require_report_file "GPT Critic Report" "GPT critic READY"
    ;;
  DEGRADED)
    [ "$gpt_degraded_reason" = "review-degraded:codex-mcp-unavailable" ] \
      || deny "Critic gate: GPT critic DEGRADED requires GPT Critic Degraded Reason: review-degraded:codex-mcp-unavailable."
    require_log_entry "review-degraded:codex-mcp-unavailable" "GPT critic DEGRADED"
    ;;
esac

case "$status" in
  READY)
    require_report_file "Critic Report" "Critic READY"
    case "$critic_verdict" in
      APPROVE|SUPPLEMENT) ;;
      RECONSIDER) deny "Critic gate: Critic Verdict is RECONSIDER. Re-run Stage 0 before editing files." ;;
      PENDING|"") deny "Critic gate: Critic Verdict is ${critic_verdict:-missing}. Record critic verdict before editing files." ;;
      *) deny "Critic gate: invalid Critic Verdict '${critic_verdict}'. Use APPROVE, SUPPLEMENT, or RECONSIDER." ;;
    esac
    exit 0
    ;;

  SKIPPED)
    no_skip=$(field "No-Skip")
    [ "$no_skip" = "true" ] \
      && deny "Critic gate: this Work Block touches a new domain. SKIPPED is not allowed; launch critic agent."

    [ -f "$LOG_FILE" ] \
      || deny "Critic gate: SKIPPED requires orchestrator-log entry. ${LOG_FILE} not found."

    grep -q "^|.*${wb_id}.*critic: SKIPPED" "$LOG_FILE" 2>/dev/null \
      || deny "Critic gate: SKIPPED not authorized. No matching critic: SKIPPED Owner approval entry in orchestrator-log for ${wb_id}."

    skip_count=0
    while IFS= read -r line; do
      case "$line" in
        *"SKIPPED"*) skip_count=$((skip_count + 1)) ;;
        *"APPROVE"*|*"SUPPLEMENT"*|*"RECONSIDER"*) skip_count=0 ;;
      esac
    done < <(grep "critic:" "$LOG_FILE" 2>/dev/null || true)

    [ "$skip_count" -ge 3 ] \
      && deny "Critic gate: ${skip_count} consecutive SKIPs. Critic is mandatory for this Work Block."

    exit 0
    ;;

  *)
    deny "Critic gate: .agent/critic-gate.md status is ${status:-missing}. Launch critic agent or obtain Owner approval before editing files."
    ;;
esac
