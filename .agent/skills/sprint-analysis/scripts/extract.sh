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

printf '\n=== EVIDENCE GAPS (heuristic) ===\n'
printf 'WB rows with implementation/DONE activity but no verification row in period:\n'
awk -F'|' -v s="$SINCE" -v u="$UNTIL" '
  /^\|/ {
    d=$2; gsub(/^[ \t]+|[ \t]+$/, "", d)
    if (d < s || d > u || d !~ /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/) next
    wb=$3; gsub(/^[ \t]+|[ \t]+$/, "", wb)
    ev=$4; gsub(/^[ \t]+|[ \t]+$/, "", ev)
    if (wb == "" || wb == "Work Block") next
    seen[wb]=1
    if (tolower(ev) ~ /(implementation: done|implementation|done)/) impl[wb]=1
    if (tolower(ev) ~ /(verification:|gpt-verification:)/) ver[wb]=1
  }
  END {
    found=0
    for (wb in seen) {
      if (impl[wb] && !ver[wb]) {
        print "- " wb
        found=1
      }
    }
    if (!found) print "- none"
  }' "$LOG" | sort

printf '\nCommits without explicit WB id in subject (heuristic):\n'
git log --since="$SINCE 00:00" --until="$UNTIL 23:59" \
  --pretty='%H|%ad|%s' --date=format:'%Y-%m-%d' 2>/dev/null \
  | while IFS='|' read -r sha date subject; do
      [ -n "$sha" ] || continue
      message="$(git show -s --format='%B' "$sha" 2>/dev/null || true)"
      parsed="$(printf '%s\n' "$message" | git interpret-trailers --parse 2>/dev/null || true)"
      valid_ids=()
      malformed=0
      while IFS= read -r trailer; do
        [ -n "$trailer" ] || continue
        key="${trailer%%:*}"
        value="${trailer#*: }"
        if [[ "$key" =~ ^[Ww][Oo][Rr][Kk]-[Bb][Ll][Oo][Cc][Kk]$ ]]; then
          if [[ "$value" =~ ^WB-[0-9]{4}-[0-9]{2}-[0-9]{2}-[a-z0-9]+(-[a-z0-9]+)*$ ]]; then
            valid_ids+=("$value")
          else
            malformed=$((malformed + 1))
          fi
        fi
      done <<< "$parsed"
      legacy_ids="$(printf '%s\n' "$message" | grep -oE 'WB-(init|[0-9]{4}-[0-9]{2}-[0-9]{2}-[a-z0-9]+(-[a-z0-9]+)*)' | sort -u | paste -sd, - || true)"
      if [ "${#valid_ids[@]}" -eq 0 ] && [ "$malformed" -eq 0 ] && [ -z "$legacy_ids" ]; then
        printf -- '- %s|%s|%s|class=missing;heuristic=secondary-only\n' "${sha:0:12}" "$date" "$subject"
      fi
    done || true

printf '\n=== COMMIT LINKAGE (trailer-first) ===\n'
printf 'Class|Commit|Date|Subject|Evidence\n'
git log --since="$SINCE 00:00" --until="$UNTIL 23:59" \
  --pretty='%H|%ad|%s' --date=format:'%Y-%m-%d' 2>/dev/null \
  | while IFS='|' read -r sha date subject; do
      [ -n "$sha" ] || continue
      message="$(git show -s --format='%B' "$sha" 2>/dev/null || true)"
      parsed="$(printf '%s\n' "$message" | git interpret-trailers --parse 2>/dev/null || true)"
      valid_ids=()
      malformed=0
      while IFS= read -r trailer; do
        [ -n "$trailer" ] || continue
        key="${trailer%%:*}"
        value="${trailer#*: }"
        if [[ "$key" =~ ^[Ww][Oo][Rr][Kk]-[Bb][Ll][Oo][Cc][Kk]$ ]]; then
          if [[ "$value" =~ ^WB-[0-9]{4}-[0-9]{2}-[0-9]{2}-[a-z0-9]+(-[a-z0-9]+)*$ ]]; then
            valid_ids+=("$value")
          else
            malformed=$((malformed + 1))
          fi
        fi
      done <<< "$parsed"
      legacy_ids="$(printf '%s\n' "$message" | grep -oE 'WB-(init|[0-9]{4}-[0-9]{2}-[0-9]{2}-[a-z0-9]+(-[a-z0-9]+)*)' | sort -u | paste -sd, - || true)"
      if [ "${#valid_ids[@]}" -gt 1 ]; then
        printf 'multiple-valid-trailers|%s|%s|%s|valid_ids=%s;heuristic=not-used\n' "${sha:0:12}" "$date" "$subject" "$(IFS=,; echo "${valid_ids[*]}")"
      elif [ "${#valid_ids[@]}" -eq 1 ] && [ "$malformed" -eq 0 ]; then
        printf 'trailer|%s|%s|%s|id=%s;legacy_or_heuristic=secondary\n' "${sha:0:12}" "$date" "$subject" "${valid_ids[0]}"
      elif [ "$malformed" -gt 0 ]; then
        printf 'malformed-trailer|%s|%s|%s|malformed_count=%s;legacy_or_heuristic=secondary;unresolved= true\n' "${sha:0:12}" "$date" "$subject" "$malformed"
      elif [ -n "$legacy_ids" ]; then
        printf 'legacy|%s|%s|%s|legacy_ids=%s;compatibility-evidence-only;heuristic=secondary\n' "${sha:0:12}" "$date" "$subject" "$legacy_ids"
      else
        printf 'missing|%s|%s|%s|canonical_id=none;heuristic=secondary-only;unresolved=true\n' "${sha:0:12}" "$date" "$subject"
      fi
    done || true

printf '\n=== GIT COMMITS (in period) ===\n'
git log --since="$SINCE 00:00" --until="$UNTIL 23:59" \
  --pretty='%h|%ad|%s' --date=format:'%Y-%m-%d' 2>/dev/null || true

printf '\n=== GIT FILE CHURN (in period) ===\n'
git log --since="$SINCE 00:00" --until="$UNTIL 23:59" \
  --pretty='%h %s' --shortstat 2>/dev/null || true

printf '\n=== PERIOD-END REPOSITORY SNAPSHOT ===\n'
printf 'branch=%s\n' "$(git branch --show-current 2>/dev/null || printf unknown)"
printf 'head=%s\n' "$(git rev-parse HEAD 2>/dev/null || printf unknown)"
porcelain="$(git status --porcelain 2>/dev/null || true)"
if [ -n "$porcelain" ]; then snapshot_status=dirty; else snapshot_status=clean; fi
printf 'status=%s\n' "$snapshot_status"
printf 'status_short_branch:\n'
git status --short --branch 2>/dev/null || true
printf '\n'
printf 'staged=%s\n' "$(printf '%s\n' "$porcelain" | awk 'NF && substr($0,1,1) != " " && substr($0,1,2) != "??" { n++ } END { print n+0 }')"
printf 'unstaged=%s\n' "$(printf '%s\n' "$porcelain" | awk 'NF && substr($0,2,1) != " " && substr($0,1,2) != "??" { n++ } END { print n+0 }')"
printf 'untracked=%s\n' "$(printf '%s\n' "$porcelain" | awk '$1 == "??" { n++ } END { print n+0 }')"
if upstream_counts="$(git rev-list --left-right --count '@{upstream}...HEAD' 2>/dev/null)"; then
  read -r behind ahead <<< "$upstream_counts"
  if [[ "$behind" =~ ^[0-9]+$ && "$ahead" =~ ^[0-9]+$ ]]; then
    printf 'upstream=available\nbehind=%s\nahead_unpushed=%s\n' "$behind" "$ahead"
    if [ "$snapshot_status" = dirty ] || [ "$ahead" -gt 0 ]; then
      printf 'evidence_caveat=repository-state-caveat\n'
    else
      printf 'evidence_caveat=none\n'
    fi
  else
    printf 'upstream=unavailable\nbehind=unknown\nahead_unpushed=unknown\n'
    printf 'evidence_caveat=upstream-unverified\n'
  fi
else
  printf 'upstream=unavailable\nbehind=unknown\nahead_unpushed=unknown\n'
  if [ "$snapshot_status" = dirty ]; then
    printf 'evidence_caveat=repository-state-caveat\n'
  else
    printf 'evidence_caveat=upstream-unverified\n'
  fi
fi
