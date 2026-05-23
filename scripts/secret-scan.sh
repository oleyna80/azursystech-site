#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
MODE="${1:-tracked}"

PATTERN_LABELS=(
  "aws-access-key"
  "private-key"
  "github-token"
  "slack-token"
  "provider-secret-key"
  "database-url-with-password"
  "quoted-sensitive-assignment"
)

PATTERNS=(
  'AKIA[0-9A-Z]{16}'
  '-----BEGIN (RSA |EC |OPENSSH |DSA |PGP )?PRIVATE KEY-----'
  'gh[pousr]_[A-Za-z0-9_]{36,}'
  'xox[baprs]-[A-Za-z0-9-]{10,}'
  'sk-[A-Za-z0-9]{20,}'
  'postgres(ql)?://[^[:space:]'"'"'"<>]+:[^[:space:]'"'"'"<>]+@'
  '(?i)(api[_-]?key|secret|token|password|webhook[_-]?secret|database_url|private[_-]?key)\s*[:=]\s*['"'"'"][A-Za-z0-9_./+=:@%~-]{20,}['"'"'"]'
)

collect_tracked_files() {
  git -C "${ROOT_DIR}" ls-files -z \
    ':(exclude)node_modules/**' \
    ':(exclude)**/node_modules/**' \
    ':(exclude).next/**' \
    ':(exclude)**/.next/**' \
    ':(exclude)dist/**' \
    ':(exclude)**/dist/**' \
    ':(exclude)build/**' \
    ':(exclude)**/build/**' \
    ':(exclude)coverage/**' \
    ':(exclude)**/coverage/**' \
    ':(exclude)package-lock.json'
}

collect_staged_files() {
  git -C "${ROOT_DIR}" diff --cached --name-only -z --diff-filter=ACMR -- \
    ':(exclude)node_modules/**' \
    ':(exclude)**/node_modules/**' \
    ':(exclude).next/**' \
    ':(exclude)**/.next/**' \
    ':(exclude)dist/**' \
    ':(exclude)**/dist/**' \
    ':(exclude)build/**' \
    ':(exclude)**/build/**' \
    ':(exclude)coverage/**' \
    ':(exclude)**/coverage/**' \
    ':(exclude)package-lock.json'
}

scan_files() {
  local -a files=("$@")
  local found=0

  if ((${#files[@]} == 0)); then
    return 0
  fi

  for index in "${!PATTERNS[@]}"; do
    local pattern="${PATTERNS[$index]}"
    local label="${PATTERN_LABELS[$index]}"

    while IFS= read -r location; do
      if [[ -n "${location}" ]]; then
        printf '%s [%s]\n' "${location}" "${label}"
        found=1
      fi
    done < <(
      (
        cd "${ROOT_DIR}"
        rg -n --no-heading -I --pcre2 -- "${pattern}" "${files[@]}" \
          | awk -F: '
              BEGIN { IGNORECASE = 1 }
              /process\.env|verify-only|replace_me|example|localhost|postgres:5432|your_/ { next }
              { print $1 ":" $2 }
            '
      )
    )
  done

  return "${found}"
}

case "${MODE}" in
  tracked)
    mapfile -d '' files < <(collect_tracked_files)
    ;;
  staged)
    mapfile -d '' files < <(collect_staged_files)
    ;;
  *)
    echo "Usage: $0 [tracked|staged]" >&2
    exit 2
    ;;
esac

if scan_files "${files[@]}"; then
  echo "Secret scan passed: ${MODE}"
else
  echo "Secret scan failed: ${MODE}" >&2
  exit 1
fi
