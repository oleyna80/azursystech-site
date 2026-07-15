#!/usr/bin/env bash
# Verification Gate hook - blocks final closeout until verification status is
# evidence-backed for the current Work Block.
set -euo pipefail

GATE_FILE=".agent/verification-gate.md"

MEMORY_DIR="memory_bank"
[ -d "memory_bank" ] && [ -f "memory_bank/orchestrator-log.md" ] && MEMORY_DIR="memory_bank"
LOG_FILE="$MEMORY_DIR/orchestrator-log.md"

deny() {
  local reason="$1"
  jq -n --arg reason "$reason" '{
    decision: "block",
    reason: $reason
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

is_placeholder() {
  local value="$1"
  [ -z "$value" ] && return 0
  local lc
  lc=$(printf '%s' "$value" | tr '[:upper:]' '[:lower:]')
  case "$lc" in
    "["*|pending|none) return 0 ;;
    *) return 1 ;;
  esac
}

require_report_file() {
  local field_name="$1"
  local label="$2"
  local report_path
  report_path=$(field "$field_name")

  is_placeholder "$report_path" \
    && deny "Verification gate: ${label} requires ${field_name} to point to a report under docs/reports/."

  report_path=$(relative_path "$report_path")
  case "$report_path" in
    docs/reports/*) ;;
    *) deny "Verification gate: ${field_name} must be under docs/reports/, got '${report_path}'." ;;
  esac

  [ -s "$report_path" ] \
    || deny "Verification gate: ${field_name} report does not exist or is empty: ${report_path}."
}

require_log_entry() {
  local needle="$1"
  local label="$2"

  [ -f "$LOG_FILE" ] \
    || deny "Verification gate: ${label} requires orchestrator-log entry. ${LOG_FILE} not found."

  grep "^|" "$LOG_FILE" 2>/dev/null \
    | grep -F -- "| ${wb_id} |" \
    | grep -qF -- "$needle" \
    || deny "Verification gate: ${label} missing orchestrator-log entry for ${wb_id}: ${needle}."
}

[ -f "$GATE_FILE" ] \
  || deny "Verification gate: .agent/verification-gate.md is missing. Resolve verification before final closeout."

status=$(field "Status")
wb_id=$(field "Work Block")
verification_tier=$(field "Verification Tier")
new_domain=$(field "New Domain")
verifier_verdict=$(field "Claude Verifier Verdict")
gpt_verifier_status=$(field "GPT Verifier Status")
gpt_verifier_reason=$(field "GPT Verifier Reason")
gpt_degraded_reason=$(field "GPT Verifier Degraded Reason")
quick_fix=$(field "Quick-Fix")
verifier=$(field "Verifier")
sensitive_domains=$(field "Sensitive Domains" | tr '[:upper:]' '[:lower:]')
required_verifier_isolation=$(field "Required Verifier Isolation" | tr '[:upper:]' '[:lower:]')
verifier_isolation=$(field "Verifier Isolation" | tr '[:upper:]' '[:lower:]')

[ -n "$wb_id" ] || deny "Verification gate: Work Block is required before closeout."

# Verifier identity and declared isolation (AGENTS.md Hook-Enforced Gate Rules).
# This validates a closed-vocabulary attestation; a hook cannot prove process,
# credential, or filesystem isolation.
isolation_rank() {
  case "$1" in
    same-session-degraded) printf '1' ;;
    independent-readonly-root) printf '2' ;;
    os-isolated) printf '3' ;;
    *) return 1 ;;
  esac
}

require_verifier_isolation() {
  case "$sensitive_domains" in
    "["*|pending|"") deny "Verification gate: Sensitive Domains is ${sensitive_domains:-missing}. Classify sensitive domains (none | list) before closeout." ;;
  esac

  local required_rank actual_rank
  required_rank=$(isolation_rank "$required_verifier_isolation") \
    || deny "Verification gate: Required Verifier Isolation is ${required_verifier_isolation:-missing}. Use same-session-degraded, independent-readonly-root, or os-isolated."
  actual_rank=$(isolation_rank "$verifier_isolation") \
    || deny "Verification gate: Verifier Isolation is ${verifier_isolation:-missing}. Use same-session-degraded, independent-readonly-root, or os-isolated."

  [ "$actual_rank" -ge "$required_rank" ] \
    || deny "Verification gate: Verifier Isolation (${verifier_isolation}) is below Required Verifier Isolation (${required_verifier_isolation})."

  case "$verifier" in
    subagent)
      [ "$verifier_isolation" != "same-session-degraded" ] \
        || deny "Verification gate: same-session native subagent verification is advisory and cannot close READY. Use an independent readonly root or OS isolation."
      ;;
    ct-inline)
      [ "$sensitive_domains" = "none" ] \
        || deny "Verification gate: ct-inline is only allowed for Sensitive Domains: none; Owner waivers do not bypass this rule."
      [ "$verifier_isolation" = "same-session-degraded" ] \
        || deny "Verification gate: ct-inline must record Verifier Isolation: same-session-degraded."
      ;;
    PENDING|pending|"["*|"") deny "Verification gate: Verifier is ${verifier:-missing}. Set Verifier: subagent or ct-inline before closeout." ;;
    *) deny "Verification gate: invalid Verifier '${verifier}'. Use subagent or ct-inline." ;;
  esac

  [ "$sensitive_domains" = "none" ] || [ "$actual_rank" -ge 2 ] \
    || deny "Verification gate: Sensitive Domains (${sensitive_domains}) require at least independent-readonly-root isolation."
}

gpt_verifier_required=0
case "$verification_tier" in
  full|FULL) ;;
  lite|standard|LITE|STANDARD|"") ;;
  PENDING|pending) deny "Verification gate: Verification Tier is PENDING. Classify verification tier before closeout." ;;
  *) deny "Verification gate: invalid Verification Tier '${verification_tier}'. Use lite, standard, or full." ;;
esac
case "$new_domain" in
  true|TRUE|yes|YES) ;;
  false|FALSE|no|NO|"") ;;
  PENDING|pending) deny "Verification gate: New Domain is PENDING. Classify domain status before closeout." ;;
  *) deny "Verification gate: invalid New Domain '${new_domain}'. Use true or false." ;;
esac
case "$verifier_verdict" in
  BLOCKED) ;;
  READY|PENDING|"") ;;
  *) deny "Verification gate: invalid Claude Verifier Verdict '${verifier_verdict}'. Use READY, BLOCKED, or PENDING." ;;
esac

case "$gpt_verifier_status" in
  NOT_REQUIRED)
    [ "$gpt_verifier_required" -eq 0 ] \
      || deny "Verification gate: GPT verifier is required by trigger; NOT_REQUIRED is not allowed."
    is_placeholder "$gpt_verifier_reason" \
      && deny "Verification gate: GPT Verifier Reason is required when GPT Verifier Status is NOT_REQUIRED."
    ;;
  READY)
    require_report_file "GPT Verifier Report" "GPT verifier READY"
    ;;
  DEGRADED)
    [ "$gpt_degraded_reason" = "review-degraded:codex-mcp-unavailable" ] \
      || deny "Verification gate: GPT verifier DEGRADED requires GPT Verifier Degraded Reason: review-degraded:codex-mcp-unavailable."
    require_log_entry "review-degraded:codex-mcp-unavailable" "GPT verifier DEGRADED"
    ;;
  PENDING|"") deny "Verification gate: GPT Verifier Status is ${gpt_verifier_status:-missing}. Resolve GPT verifier decision before closeout." ;;
  *) deny "Verification gate: invalid GPT Verifier Status '${gpt_verifier_status}'. Use NOT_REQUIRED, READY, or DEGRADED." ;;
esac

case "$status" in
  READY)
    require_report_file "Verification Report" "verification READY"
    case "$verifier_verdict" in
      READY) ;;
      BLOCKED) deny "Verification gate: verifier verdict is BLOCKED; READY closeout is not allowed." ;;
      PENDING|"") deny "Verification gate: Claude Verifier Verdict is ${verifier_verdict:-missing}. Record verifier verdict before closeout." ;;
      *) deny "Verification gate: invalid Claude Verifier Verdict '${verifier_verdict}'. Use READY or BLOCKED." ;;
    esac
    require_verifier_isolation
    exit 0
    ;;

  SKIPPED)
    [ "$quick_fix" = "true" ] \
      || deny "Verification gate: SKIPPED is only allowed when Quick-Fix is true."
    require_log_entry "verification: SKIPPED" "verification SKIPPED"
    exit 0
    ;;

  *)
    deny "Verification gate: .agent/verification-gate.md status is ${status:-missing}. Complete verification before final closeout."
    ;;
esac
