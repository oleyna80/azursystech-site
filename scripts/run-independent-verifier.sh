#!/usr/bin/env bash
set -euo pipefail

# Control Tower only. Native subagents must not use this runner to launch
# nested Codex sessions.

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DEFAULT_VERIFIER_HOME="${HOME}/.codex-verifier"
VERIFIER_HOME="${CODEX_VERIFIER_HOME:-${DEFAULT_VERIFIER_HOME}}"
TIMEOUT_SECONDS="${CODEX_VERIFIER_TIMEOUT_SECONDS:-900}"
MAX_PROMPT_BYTES="${CODEX_VERIFIER_MAX_PROMPT_BYTES:-262144}"
MAX_OUTPUT_BLOCKS="${CODEX_VERIFIER_MAX_OUTPUT_BLOCKS:-2048}"
OUTPUT_DIRECTORY='/run/codex-verifier-output'
MAX_OUTPUT_DIRECTORY_BYTES=$((4 * 1024 * 1024))
OUTPUT_PATH=""
TEMP_OUTPUT=""

usage() {
  cat >&2 <<'USAGE'
Usage: scripts/run-independent-verifier.sh [--output FILE] [--timeout SECONDS] PROMPT_FILE

Control Tower only. Run this command from a separate top-level readonly root;
native subagents must not launch nested Codex sessions. The Owner must provision
and authenticate CODEX_VERIFIER_HOME once (default: ~/.codex-verifier). This
runner never reads, copies, creates, or changes credentials.
USAGE
}

fail() {
  printf 'BLOCKED|independent-verifier|%s\n' "$1" >&2
  exit 2
}

cleanup() {
  if [[ -n "${TEMP_OUTPUT}" ]]; then
    rm -f -- "${TEMP_OUTPUT}"
  fi
}

mode_is_private() {
  local mode="$1"
  [[ "${mode}" == '700' ]]
}

require_bounded_output_directory() {
  local mount_target mount_type mount_bytes mount_mode mount_uid mount_gid

  [[ -d "${OUTPUT_DIRECTORY}" && ! -L "${OUTPUT_DIRECTORY}" && -w "${OUTPUT_DIRECTORY}" ]] || \
    fail 'output-directory-unavailable'
  command -v findmnt >/dev/null 2>&1 || fail 'findmnt-not-found'
  command -v df >/dev/null 2>&1 || fail 'df-not-found'

  mount_target="$(findmnt -n -o TARGET --target "${OUTPUT_DIRECTORY}")" || fail 'output-directory-mount-unreadable'
  mount_type="$(findmnt -n -o FSTYPE --target "${OUTPUT_DIRECTORY}")" || fail 'output-directory-mount-unreadable'
  [[ "${mount_target}" == "${OUTPUT_DIRECTORY}" && "${mount_type}" == 'tmpfs' ]] || \
    fail 'output-directory-not-dedicated-tmpfs'

  mount_mode="$(stat -c '%a' -- "${OUTPUT_DIRECTORY}")" || fail 'output-directory-mode-unreadable'
  mode_is_private "${mount_mode}" || fail 'output-directory-permissions-unsafe'
  mount_uid="$(stat -c '%u' -- "${OUTPUT_DIRECTORY}")" || fail 'output-directory-owner-unreadable'
  mount_gid="$(stat -c '%g' -- "${OUTPUT_DIRECTORY}")" || fail 'output-directory-owner-unreadable'
  [[ "${mount_uid}" == "$(id -u)" && "${mount_gid}" == "$(id -g)" ]] || \
    fail 'output-directory-ownership-unsafe'

  mount_bytes="$(df -B1 --output=size "${OUTPUT_DIRECTORY}" | awk 'NR == 2 { print $1 }')" || \
    fail 'output-directory-capacity-unreadable'
  [[ "${mount_bytes}" =~ ^[0-9]+$ && "${mount_bytes}" -le "${MAX_OUTPUT_DIRECTORY_BYTES}" ]] || \
    fail 'output-directory-capacity-unsafe'
}

validate_output_path() {
  local output_dir output_name resolved_dir

  output_dir="$(dirname -- "${OUTPUT_PATH}")"
  output_name="$(basename -- "${OUTPUT_PATH}")"
  [[ "${output_dir}" == "${OUTPUT_DIRECTORY}" && "${output_name}" != '.' && "${output_name}" != '..' ]] || \
    fail 'output-path-outside-bounded-directory'
  [[ ! -L "${OUTPUT_PATH}" ]] || fail 'output-path-symlink-unsafe'
  resolved_dir="$(realpath -e -- "${output_dir}")" || fail 'output-directory-unreadable'
  [[ "${resolved_dir}" == "${OUTPUT_DIRECTORY}" ]] || fail 'output-directory-path-unsafe'
  if [[ -n "${TEMP_OUTPUT}" ]]; then
    [[ -f "${OUTPUT_PATH}" ]] || fail 'output-path-create-failed'
  else
    [[ ! -e "${OUTPUT_PATH}" ]] || fail 'output-path-already-exists'
  fi
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --output)
      [[ $# -ge 2 ]] || fail 'missing-output-path'
      OUTPUT_PATH="$2"
      shift 2
      ;;
    --timeout)
      [[ $# -ge 2 && "$2" =~ ^[1-9][0-9]*$ ]] || fail 'invalid-timeout'
      TIMEOUT_SECONDS="$2"
      shift 2
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    --)
      shift
      break
      ;;
    -*)
      fail 'unknown-option'
      ;;
    *)
      break
      ;;
  esac
done

[[ $# -eq 1 ]] || {
  usage
  exit 2
}

PROMPT_FILE="$1"
[[ -r "${PROMPT_FILE}" && -f "${PROMPT_FILE}" ]] || fail 'prompt-file-unreadable'
[[ -d "${VERIFIER_HOME}" ]] || fail 'verifier-home-missing'
[[ -w "${VERIFIER_HOME}" ]] || fail 'verifier-home-not-writable'
[[ -f "${VERIFIER_HOME}/readonly.config.toml" ]] || fail 'readonly-profile-missing'

HOME_MODE="$(stat -c '%a' -- "${VERIFIER_HOME}")" || fail 'verifier-home-mode-unreadable'
mode_is_private "${HOME_MODE}" || fail 'verifier-home-permissions-unsafe'

PROMPT_BYTES="$(wc -c < "${PROMPT_FILE}")"
[[ "${PROMPT_BYTES}" =~ ^[0-9]+$ && "${PROMPT_BYTES}" -le "${MAX_PROMPT_BYTES}" ]] || fail 'prompt-file-too-large'
[[ "${MAX_OUTPUT_BLOCKS}" =~ ^[1-9][0-9]{0,3}$ ]] || fail 'invalid-output-size-limit'
MAX_OUTPUT_BYTES=$((MAX_OUTPUT_BLOCKS * 512))
command -v codex >/dev/null 2>&1 || fail 'codex-not-found'
command -v timeout >/dev/null 2>&1 || fail 'timeout-not-found'
require_bounded_output_directory
trap cleanup EXIT

if [[ -z "${OUTPUT_PATH}" ]]; then
  TEMP_OUTPUT="$(mktemp "${OUTPUT_DIRECTORY}/codex-independent-verifier.XXXXXX")" || \
    fail 'output-path-create-failed'
  OUTPUT_PATH="${TEMP_OUTPUT}"
fi
validate_output_path
[[ "${MAX_OUTPUT_BYTES}" -le "${MAX_OUTPUT_DIRECTORY_BYTES}" ]] || fail 'output-size-limit-exceeds-directory-capacity'

PROMPT="$(<"${PROMPT_FILE}")"
printf 'PASS|independent-verifier|starting-readonly-run\n' >&2

# Do not apply a process-wide file-size cap here: Codex creates internal
# ephemeral files and such a cap can terminate an otherwise valid readonly run.
# The captured final message is checked after a successful Codex exit instead.
set +e
(
  cd "${ROOT_DIR}"
  CODEX_HOME="${VERIFIER_HOME}" timeout --foreground "${TIMEOUT_SECONDS}" \
    codex exec --strict-config --profile readonly -c 'approval_policy="never"' \
    --sandbox read-only --ephemeral \
    --output-last-message "${OUTPUT_PATH}" "${PROMPT}"
)
STATUS=$?
set -e

if [[ "${STATUS}" -eq 124 ]]; then
  printf 'BLOCKED|independent-verifier|timeout\n' >&2
elif [[ "${STATUS}" -ne 0 ]]; then
  printf 'BLOCKED|independent-verifier|codex-exit-%s\n' "${STATUS}" >&2
else
  [[ -f "${OUTPUT_PATH}" ]] || fail 'output-capture-missing'
  OUTPUT_BYTES="$(wc -c < "${OUTPUT_PATH}")"
  [[ "${OUTPUT_BYTES}" =~ ^[0-9]+$ ]] || fail 'output-capture-size-unreadable'
  if [[ "${OUTPUT_BYTES}" -eq 0 ]]; then
    printf 'BLOCKED|independent-verifier|output-capture-empty\n' >&2
    exit 2
  elif [[ "${OUTPUT_BYTES}" -gt "${MAX_OUTPUT_BYTES}" ]]; then
    printf 'BLOCKED|independent-verifier|output-capture-too-large:%s-bytes-limit:%s\n' \
      "${OUTPUT_BYTES}" "${MAX_OUTPUT_BYTES}" >&2
    exit 2
  fi
  printf 'PASS|independent-verifier|completed\n' >&2
fi

exit "${STATUS}"
