#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
VERIFIER_HOME="${CODEX_VERIFIER_HOME:-${HOME}/.codex-verifier}"
MIN_WATCHES="${AGENT_RUNTIME_MIN_INOTIFY_WATCHES:-524288}"
MIN_INSTANCES="${AGENT_RUNTIME_MIN_INOTIFY_INSTANCES:-512}"
MIN_OPEN_FILES="${AGENT_RUNTIME_MIN_OPEN_FILES:-4096}"
MIN_AVAILABLE_KB="${AGENT_RUNTIME_MIN_AVAILABLE_KB:-1048576}"
WORKSPACE="${AGENT_RUNTIME_WORKSPACE:-${ROOT_DIR}}"
HAS_WARN=0
HAS_BLOCKED=0

record() {
  local level="$1"
  local check="$2"
  local detail="$3"
  printf '%s|%s|%s\n' "${level}" "${check}" "${detail}"
  case "${level}" in
    WARN) HAS_WARN=1 ;;
    BLOCKED) HAS_BLOCKED=1 ;;
  esac
}

private_mode() {
  local mode="$1"
  [[ "${mode}" == '700' ]]
}

numeric_at_least() {
  local actual="$1"
  local minimum="$2"
  [[ "${actual}" =~ ^[0-9]+$ && "${minimum}" =~ ^[0-9]+$ ]] || return 1
  (( actual >= minimum ))
}

if command -v codex >/dev/null 2>&1; then
  record PASS codex-binary available
  if codex --strict-config --version >/dev/null 2>&1; then
    record PASS codex-standard-profile parsed
  else
    record BLOCKED codex-standard-profile parse-failed
  fi
else
  record BLOCKED codex-binary missing
fi

if [[ ! -d "${VERIFIER_HOME}" ]]; then
  record BLOCKED verifier-home missing
else
  MODE="$(stat -c '%a' -- "${VERIFIER_HOME}" 2>/dev/null || true)"
  if private_mode "${MODE}"; then
    record PASS verifier-home-permissions private
  else
    record BLOCKED verifier-home-permissions unsafe
  fi
  if [[ -w "${VERIFIER_HOME}" ]]; then
    record PASS verifier-home-writable ready
  else
    record BLOCKED verifier-home-writable unavailable
  fi
  if [[ -f "${VERIFIER_HOME}/readonly.config.toml" ]]; then
    record PASS verifier-readonly-profile present
    if CODEX_HOME="${VERIFIER_HOME}" codex --profile readonly --strict-config --version >/dev/null 2>&1; then
      record PASS codex-readonly-profile parsed
    else
      record BLOCKED codex-readonly-profile parse-failed
    fi
  else
    record BLOCKED verifier-readonly-profile missing
  fi
  # Presence only: this never reads authentication contents.
  if [[ -f "${VERIFIER_HOME}/auth.json" ]]; then
    record PASS verifier-auth-marker present
  else
    record BLOCKED verifier-auth-marker missing
  fi
fi

if command -v sysctl >/dev/null 2>&1; then
  WATCHES="$(sysctl -n fs.inotify.max_user_watches 2>/dev/null || true)"
  INSTANCES="$(sysctl -n fs.inotify.max_user_instances 2>/dev/null || true)"
  if numeric_at_least "${WATCHES}" "${MIN_WATCHES}"; then
    record PASS inotify-watches sufficient
  else
    record WARN inotify-watches below-recommended
  fi
  if numeric_at_least "${INSTANCES}" "${MIN_INSTANCES}"; then
    record PASS inotify-instances sufficient
  else
    record WARN inotify-instances below-recommended
  fi
else
  record WARN inotify unavailable
fi

OPEN_FILES="$(ulimit -n 2>/dev/null || true)"
if numeric_at_least "${OPEN_FILES}" "${MIN_OPEN_FILES}"; then
  record PASS open-file-limit sufficient
else
  record WARN open-file-limit below-recommended
fi

if command -v df >/dev/null 2>&1 && [[ -d "${WORKSPACE}" ]]; then
  AVAILABLE_KB="$(df -Pk "${WORKSPACE}" 2>/dev/null | awk 'NR == 2 { print $4 }')"
  if numeric_at_least "${AVAILABLE_KB}" "${MIN_AVAILABLE_KB}"; then
    record PASS workspace-capacity sufficient
  else
    record WARN workspace-capacity below-recommended
  fi
else
  record WARN workspace-capacity unavailable
fi

if [[ "${HAS_BLOCKED}" -eq 1 ]]; then
  record BLOCKED summary remediation-required
  exit 2
fi
if [[ "${HAS_WARN}" -eq 1 ]]; then
  record WARN summary degraded-capacity
else
  record PASS summary ready
fi
