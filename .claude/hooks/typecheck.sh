#!/usr/bin/env bash
# PostToolUse hook: run tsc --noEmit in the affected TypeScript project.
# Reads file path from stdin JSON (jq), detects project root, runs tsc.
set -euo pipefail

f=$(jq -r '.tool_input.file_path // .tool_response.filePath // empty' 2>/dev/null || true)
[ -z "$f" ] && exit 0
[ ! -f "$f" ] && exit 0

# Only check .ts/.tsx files
case "$f" in
  *.ts|*.tsx) ;;
  *) exit 0 ;;
esac

# Detect project root — walk up for tsconfig.json
dir=$(dirname "$f")
while [ "$dir" != "/" ]; do
  if [ -f "$dir/tsconfig.json" ]; then
    proj="$dir"
    break
  fi
  dir=$(dirname "$dir")
done

[ -z "${proj:-}" ] && exit 0

# Run tsc
out=$(cd "$proj" && npx tsc --noEmit 2>&1) && rc=$? || rc=$?
if [ "$rc" -ne 0 ]; then
  errors=$(echo "$out" | grep -c "error TS" 2>/dev/null || echo "?")
  printf '{"systemMessage":"⚠ TypeScript: %s errors in %s — run npx tsc --noEmit to see details"}' "$errors" "$proj"
fi
exit 0
