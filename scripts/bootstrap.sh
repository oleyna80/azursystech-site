#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
MODE="check"

usage() {
  cat <<'EOF'
Usage: scripts/bootstrap.sh [--check|--init]

  --check  Verify committed workflow files and local runtime memory. No files are created. Default.
  --init   Create missing ignored memory_bank starter files, then verify.
EOF
}

case "${1:---check}" in
  --check)
    MODE="check"
    ;;
  --init)
    MODE="init"
    ;;
  -h|--help)
    usage
    exit 0
    ;;
  *)
    echo "Unknown option: $1" >&2
    usage >&2
    exit 2
    ;;
esac

require_path() {
  path="$1"
  if [ ! -e "${ROOT_DIR}/${path}" ]; then
    echo "Missing required local path: ${path}" >&2
    return 1
  fi
}

ensure_memory_file() {
  path="$1"
  title="$2"
  file="${ROOT_DIR}/${path}"
  if [ -f "${file}" ]; then
    return 0
  fi

  if [ "${MODE}" = "init" ]; then
    mkdir -p "$(dirname "${file}")"
    {
      echo "# ${title}"
      echo
      echo "Created by scripts/bootstrap.sh as local operational agent memory."
      echo "Promote durable engineering decisions to docs/engineering-memory/."
      echo
    } > "${file}"
    echo "Created local runtime memory file: ${path}"
    return 0
  fi

  echo "Missing local runtime memory file: ${path}" >&2
  echo "Run scripts/bootstrap.sh --init to create ignored starter files." >&2
  return 1
}

ensure_memory_dir() {
  path="$1"
  dir="${ROOT_DIR}/${path}"
  if [ -d "${dir}" ]; then
    return 0
  fi

  if [ "${MODE}" = "init" ]; then
    mkdir -p "${dir}"
    echo "Created local runtime memory directory: ${path}"
    return 0
  fi

  echo "Missing local runtime memory directory: ${path}" >&2
  echo "Run scripts/bootstrap.sh --init to create ignored starter files." >&2
  return 1
}

echo "AzurSysTech bootstrap preflight"
echo "Repository: ${ROOT_DIR}"
echo "Mode: ${MODE}"

require_path "AGENTS.md"
require_path "PROJECT_MAP.md"
require_path "FILE_REGISTRY.yml"
require_path "docs/session-bootstrap.md"
require_path "docs/engineering-memory/README.md"
require_path ".agent/workflows/sdd-protocol.md"
require_path ".agent/ROSTER.md"
require_path ".agent/critic-gate.md"
require_path ".agent/verification-gate.md"
require_path ".codex/critic.md"
require_path ".codex/write-gate.md"

ensure_memory_file "memory_bank/context.md" "Operational Context"
ensure_memory_file "memory_bank/progress.md" "Operational Progress"
ensure_memory_file "memory_bank/decisions.md" "Operational Decision Summaries"
ensure_memory_file "memory_bank/orchestrator-log.md" "Orchestrator Log"
ensure_memory_file "memory_bank/review-log.md" "Review Log"
ensure_memory_file "memory_bank/external-team-log.md" "External Team Log"
ensure_memory_dir "memory_bank/snapshots"

if [ -f "${ROOT_DIR}/.agentsignore" ]; then
  echo "Found .agentsignore"
else
  echo "Missing .agentsignore; agents may over-read local context." >&2
fi

if [ -f "${ROOT_DIR}/.codexignore" ]; then
  echo "Found .codexignore"
else
  echo "Missing .codexignore; Codex context pruning is incomplete." >&2
fi

echo "Bootstrap preflight passed."
