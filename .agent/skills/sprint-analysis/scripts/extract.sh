#!/usr/bin/env bash
# sprint-analysis data extractor — read-only.
# Usage: bash extract.sh [SINCE] [UNTIL]   (YYYY-MM-DD; defaults: 7 days ago .. today)
# Emits raw slices of memory_bank/orchestrator-log.md and git history for the
# period. Analysis/judgment happens in the agent, not here.
set -euo pipefail

SINCE="${1:-$(date -d '7 days ago' +%F)}"
UNTIL="${2:-$(date +%F)}"
LOG="memory_bank/orchestrator-log.md"

[ -f "$LOG" ] || { printf 'ERROR: %s not found (run from repo root)\n' "$LOG"; exit 1; }

printf '=== PERIOD ===\n%s .. %s\n\n' "$SINCE" "$UNTIL"

printf '=== LOG ENTRIES (in period) ===\n'
awk -F'|' -v s="$SINCE" -v u="$UNTIL" '
  /^\|/ {
    d=$2; gsub(/^[ \t]+|[ \t]+$/, "", d)
    if (d >= s && d <= u && d ~ /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/) print
  }' "$LOG"

printf '\n=== WB EVENT COUNTS (in period) ===\n'
awk -F'|' -v s="$SINCE" -v u="$UNTIL" '
  /^\|/ {
    d=$2; gsub(/^[ \t]+|[ \t]+$/, "", d)
    if (d < s || d > u || d !~ /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/) next
    wb=$3; gsub(/^[ \t]+|[ \t]+$/, "", wb)
    ev=$4; sub(/^[ \t]+/, "", ev); sub(/[:\-].*/, "", ev); gsub(/[ \t]+$/, "", ev)
    key=wb " :: " ev
    n[key]++
  }
  END { for (k in n) printf "%s x%d\n", k, n[k] }' "$LOG" | sort

printf '\n=== GIT COMMITS (in period) ===\n'
git log --since="$SINCE 00:00" --until="$UNTIL 23:59" \
  --pretty='%h|%ad|%s' --date=format:'%Y-%m-%d' 2>/dev/null || true

printf '\n=== GIT FILE CHURN (in period) ===\n'
git log --since="$SINCE 00:00" --until="$UNTIL 23:59" \
  --pretty='%h %s' --shortstat 2>/dev/null || true
