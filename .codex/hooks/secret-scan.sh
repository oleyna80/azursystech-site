#!/usr/bin/env bash
# PostToolUse advisory scanner for native Codex apply_patch and legacy edit payloads.
set -euo pipefail

payload=$(cat)
tool=$(printf '%s' "$payload" | jq -r '.tool_name // ""')

paths() {
  case "$tool" in
    apply_patch)
      printf '%s' "$payload" | jq -r '.tool_input.command // ""' \
        | awk '/^\*\*\* (Add|Update) File: / {sub(/^\*\*\* (Add|Update) File: /, ""); print}'
      ;;
    *) printf '%s' "$payload" | jq -r '.tool_input.file_path // .tool_response.filePath // empty' ;;
  esac
}

while IFS= read -r file; do
  [ -n "$file" ] && [ -f "$file" ] || continue
  if grep -qIE '(DATABASE_URL|token[[:space:]]*=[[:space:]]*['\''"][^'\''"]{12,}|secret[[:space:]]*=[[:space:]]*['\''"][^'\''"]{12,}|api[_-]key[[:space:]]*=[[:space:]]*['\''"][^'\''"]{12,}|PRIVATE[[:space:]]+KEY|BEGIN[[:space:]]+(RSA|OPENSSH|EC)[[:space:]]+PRIVATE|Bearer[[:space:]]+[A-Za-z0-9_.-]{20,})' "$file"; then
    printf '{"systemMessage":"Secret-like value detected in %s — review before commit"}\n' "$file"
  fi
done < <(paths)
