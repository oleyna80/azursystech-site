#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

require_path() {
  path="$1"
  if [ ! -e "${ROOT_DIR}/${path}" ]; then
    echo "Missing required local path: ${path}" >&2
    return 1
  fi
}

echo "AzurSysTech bootstrap preflight"
echo "Repository: ${ROOT_DIR}"

require_path "AGENTS.md"
require_path ".agent/workflows/sdd-protocol.md"
require_path ".agent/ROSTER.md"
require_path "memory_bank/context.md"
require_path "memory_bank/progress.md"
require_path "memory_bank/decisions.md"

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
