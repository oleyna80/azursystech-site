#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
RUNNER="${ROOT_DIR}/scripts/run-independent-verifier.sh"
DOCTOR="${ROOT_DIR}/scripts/agent-runtime-doctor.sh"
MOUNT_UNIT="${ROOT_DIR}/scripts/systemd/run-codex\\x2dverifier\\x2doutput.mount"
TMP_ROOT="$(mktemp -d "${TMPDIR:-/tmp}/agent-runtime-fixtures.XXXXXX")"
FAKE_BIN="${TMP_ROOT}/bin"
FAKE_CODEX_ARGS="${TMP_ROOT}/codex-args"
OUTPUT_DIRECTORY='/run/codex-verifier-output'

cleanup() {
  local output_path
  for output_path in "${OUTPUT:-}" "${SYMLINK_OUTPUT:-}" "${EXISTING_OUTPUT:-}" \
    "${CODEX_EXIT_OUTPUT:-}" "${EMPTY_OUTPUT:-}" "${OVERSIZED_OUTPUT:-}"; do
    [[ -z "${output_path}" ]] || rm -f -- "${output_path}"
  done
  rm -rf -- "${TMP_ROOT}"
}
trap cleanup EXIT

fail() {
  printf 'FAIL: %s\n' "$1" >&2
  exit 1
}

expect_failure() {
  if "$@"; then
    fail "expected failure: $*"
  fi
}

expect_status() {
  local expected="$1"
  shift
  set +e
  "$@"
  local actual=$?
  set -e
  [[ "${actual}" -eq "${expected}" ]] || fail "expected exit ${expected}, got ${actual}: $*"
}

mkdir -p "${FAKE_BIN}"
cat >"${FAKE_BIN}/codex" <<'FAKE_CODEX'
#!/usr/bin/env bash
set -euo pipefail
{
  printf 'CODEX_HOME=%s\n' "${CODEX_HOME:-}"
  printf '%s\n' "$@"
} >"${FAKE_CODEX_ARGS}"
for ((index = 1; index <= $#; index++)); do
  if [[ "${!index}" == "--output-last-message" ]]; then
    next=$((index + 1))
    if [[ "${FAKE_CODEX_EMPTY_OUTPUT:-0}" == '1' ]]; then
      : >"${!next}"
    elif [[ "${FAKE_CODEX_OVERSIZED_OUTPUT:-0}" == '1' ]]; then
      head -c 513 /dev/zero >"${!next}"
    else
      printf 'fake verifier result\n' >"${!next}"
    fi
  fi
done
exit "${FAKE_CODEX_STATUS:-0}"
FAKE_CODEX
cat >"${FAKE_BIN}/sysctl" <<'FAKE_SYSCTL'
#!/usr/bin/env bash
case "${2:-}" in
  fs.inotify.max_user_watches) printf '%s\n' "${FAKE_WATCHES:-524288}" ;;
  fs.inotify.max_user_instances) printf '%s\n' "${FAKE_INSTANCES:-512}" ;;
  *) exit 1 ;;
esac
FAKE_SYSCTL
chmod +x "${FAKE_BIN}/codex" "${FAKE_BIN}/sysctl"

PROMPT="${TMP_ROOT}/prompt.txt"
printf 'Verify only this fixture.\n' >"${PROMPT}"

[[ -d "${OUTPUT_DIRECTORY}" && ! -L "${OUTPUT_DIRECTORY}" && -w "${OUTPUT_DIRECTORY}" ]] || \
  fail "host prerequisite missing: ${OUTPUT_DIRECTORY} must be a writable dedicated tmpfs"
[[ "$(findmnt -n -o TARGET --target "${OUTPUT_DIRECTORY}")" == "${OUTPUT_DIRECTORY}" ]] || \
  fail "host prerequisite missing: ${OUTPUT_DIRECTORY} is not a dedicated mount"
[[ "$(findmnt -n -o FSTYPE --target "${OUTPUT_DIRECTORY}")" == 'tmpfs' ]] || \
  fail "host prerequisite missing: ${OUTPUT_DIRECTORY} is not tmpfs"
[[ "$(stat -c '%a' -- "${OUTPUT_DIRECTORY}")" == '700' ]] || \
  fail "host prerequisite missing: ${OUTPUT_DIRECTORY} mode must be 0700"
[[ "$(stat -c '%u:%g' -- "${OUTPUT_DIRECTORY}")" == "$(id -u):$(id -g)" ]] || \
  fail "host prerequisite missing: ${OUTPUT_DIRECTORY} must belong to the current user"
OUTPUT_MOUNT_BYTES="$(df -B1 --output=size "${OUTPUT_DIRECTORY}" | awk 'NR == 2 { print $1 }')"
[[ "${OUTPUT_MOUNT_BYTES}" =~ ^[0-9]+$ && "${OUTPUT_MOUNT_BYTES}" -le $((4 * 1024 * 1024)) ]] || \
  fail "host prerequisite missing: ${OUTPUT_DIRECTORY} capacity must be at most 4 MiB"
grep -Fqx 'Where=/run/codex-verifier-output' "${MOUNT_UNIT}" || fail 'mount unit has an unexpected target'
grep -Fqx 'Type=tmpfs' "${MOUNT_UNIT}" || fail 'mount unit must use tmpfs'
grep -Fqx 'Options=size=4M,mode=0700,uid=1000,gid=1000,nosuid,nodev,noexec' "${MOUNT_UNIT}" || \
  fail 'mount unit has an unsafe capacity or mount option set'

PATH="${FAKE_BIN}:${PATH}" CODEX_VERIFIER_HOME="${TMP_ROOT}/missing" \
  expect_failure "${RUNNER}" "${PROMPT}"
[[ ! -e "${FAKE_CODEX_ARGS}" ]] || fail 'runner invoked Codex for a missing verifier home'

VERIFIER_HOME="${TMP_ROOT}/verifier-home"
mkdir -p "${VERIFIER_HOME}"
printf '[profiles.readonly]\n' >"${VERIFIER_HOME}/readonly.config.toml"
chmod 755 "${VERIFIER_HOME}"
PATH="${FAKE_BIN}:${PATH}" CODEX_VERIFIER_HOME="${VERIFIER_HOME}" \
  expect_failure "${RUNNER}" "${PROMPT}"
[[ ! -e "${FAKE_CODEX_ARGS}" ]] || fail 'runner invoked Codex for an unsafe verifier home'

chmod 700 "${VERIFIER_HOME}"
OUTPUT="$(mktemp "${OUTPUT_DIRECTORY}/agent-runtime-fixture.XXXXXX")"
rm -f -- "${OUTPUT}"
PATH="${FAKE_BIN}:${PATH}" FAKE_CODEX_ARGS="${FAKE_CODEX_ARGS}" \
  CODEX_VERIFIER_HOME="${VERIFIER_HOME}" "${RUNNER}" --output "${OUTPUT}" --timeout 5 "${PROMPT}"
[[ -f "${OUTPUT}" ]] || fail 'runner did not request output capture'
for expected in exec --strict-config --profile readonly -c 'approval_policy="never"' --sandbox read-only --ephemeral --output-last-message; do
  grep -Fqx -- "${expected}" "${FAKE_CODEX_ARGS}" || fail "runner omitted safe argument: ${expected}"
done
grep -Fqx "CODEX_HOME=${VERIFIER_HOME}" "${FAKE_CODEX_ARGS}" || fail 'runner used an unexpected CODEX_HOME'
EXTERNAL_OUTPUT="${TMP_ROOT}/external-last-message.txt"
set +e
PATH="${FAKE_BIN}:${PATH}" FAKE_CODEX_ARGS="${FAKE_CODEX_ARGS}" \
  CODEX_VERIFIER_HOME="${VERIFIER_HOME}" "${RUNNER}" --output "${EXTERNAL_OUTPUT}" \
  "${PROMPT}" >/dev/null 2>"${TMP_ROOT}/external-output-stderr.txt"
EXTERNAL_OUTPUT_STATUS=$?
set -e
[[ "${EXTERNAL_OUTPUT_STATUS}" -eq 2 ]] || fail "expected external output path to exit 2, got ${EXTERNAL_OUTPUT_STATUS}"
grep -Fqx 'BLOCKED|independent-verifier|output-path-outside-bounded-directory' \
  "${TMP_ROOT}/external-output-stderr.txt" || fail 'runner accepted an external output path'

SYMLINK_OUTPUT="${OUTPUT_DIRECTORY}/agent-runtime-fixture-symlink"
ln -s "${TMP_ROOT}/symlink-target" "${SYMLINK_OUTPUT}"
set +e
PATH="${FAKE_BIN}:${PATH}" FAKE_CODEX_ARGS="${FAKE_CODEX_ARGS}" \
  CODEX_VERIFIER_HOME="${VERIFIER_HOME}" "${RUNNER}" --output "${SYMLINK_OUTPUT}" \
  "${PROMPT}" >/dev/null 2>"${TMP_ROOT}/symlink-output-stderr.txt"
SYMLINK_OUTPUT_STATUS=$?
set -e
rm -f -- "${SYMLINK_OUTPUT}"
[[ "${SYMLINK_OUTPUT_STATUS}" -eq 2 ]] || fail "expected symlink output path to exit 2, got ${SYMLINK_OUTPUT_STATUS}"
grep -Fqx 'BLOCKED|independent-verifier|output-path-symlink-unsafe' \
  "${TMP_ROOT}/symlink-output-stderr.txt" || fail 'runner accepted an output symlink'
EXISTING_OUTPUT="$(mktemp "${OUTPUT_DIRECTORY}/agent-runtime-fixture.XXXXXX")"
set +e
PATH="${FAKE_BIN}:${PATH}" FAKE_CODEX_ARGS="${FAKE_CODEX_ARGS}" \
  CODEX_VERIFIER_HOME="${VERIFIER_HOME}" "${RUNNER}" --output "${EXISTING_OUTPUT}" \
  "${PROMPT}" >/dev/null 2>"${TMP_ROOT}/existing-output-stderr.txt"
EXISTING_OUTPUT_STATUS=$?
set -e
rm -f -- "${EXISTING_OUTPUT}"
[[ "${EXISTING_OUTPUT_STATUS}" -eq 2 ]] || fail "expected existing output path to exit 2, got ${EXISTING_OUTPUT_STATUS}"
grep -Fqx 'BLOCKED|independent-verifier|output-path-already-exists' \
  "${TMP_ROOT}/existing-output-stderr.txt" || fail 'runner accepted an existing output path'
CODEX_EXIT_OUTPUT="$(mktemp "${OUTPUT_DIRECTORY}/agent-runtime-fixture.XXXXXX")"
rm -f -- "${CODEX_EXIT_OUTPUT}"
expect_status 23 env PATH="${FAKE_BIN}:${PATH}" FAKE_CODEX_ARGS="${FAKE_CODEX_ARGS}" \
  FAKE_CODEX_STATUS=23 CODEX_VERIFIER_HOME="${VERIFIER_HOME}" \
  "${RUNNER}" --output "${CODEX_EXIT_OUTPUT}" "${PROMPT}"

EMPTY_OUTPUT="$(mktemp "${OUTPUT_DIRECTORY}/agent-runtime-fixture.XXXXXX")"
rm -f -- "${EMPTY_OUTPUT}"
EMPTY_STDERR="${TMP_ROOT}/empty-output-stderr.txt"
set +e
PATH="${FAKE_BIN}:${PATH}" FAKE_CODEX_ARGS="${FAKE_CODEX_ARGS}" \
  FAKE_CODEX_EMPTY_OUTPUT=1 CODEX_VERIFIER_HOME="${VERIFIER_HOME}" \
  "${RUNNER}" --output "${EMPTY_OUTPUT}" "${PROMPT}" >/dev/null 2>"${EMPTY_STDERR}"
EMPTY_STATUS=$?
set -e
[[ "${EMPTY_STATUS}" -eq 2 ]] || fail "expected empty output to exit 2, got ${EMPTY_STATUS}"
grep -Fqx 'BLOCKED|independent-verifier|output-capture-empty' "${EMPTY_STDERR}" || \
  fail 'runner did not reject an empty output capture'

OVERSIZED_OUTPUT="$(mktemp "${OUTPUT_DIRECTORY}/agent-runtime-fixture.XXXXXX")"
rm -f -- "${OVERSIZED_OUTPUT}"
OVERSIZED_STDERR="${TMP_ROOT}/oversized-stderr.txt"
set +e
PATH="${FAKE_BIN}:${PATH}" FAKE_CODEX_ARGS="${FAKE_CODEX_ARGS}" \
  FAKE_CODEX_OVERSIZED_OUTPUT=1 CODEX_VERIFIER_HOME="${VERIFIER_HOME}" \
  CODEX_VERIFIER_MAX_OUTPUT_BLOCKS=1 "${RUNNER}" --output "${OVERSIZED_OUTPUT}" \
  "${PROMPT}" >/dev/null 2>"${OVERSIZED_STDERR}"
OVERSIZED_STATUS=$?
set -e
[[ "${OVERSIZED_STATUS}" -eq 2 ]] || fail "expected oversized output to exit 2, got ${OVERSIZED_STATUS}"
grep -Fq 'BLOCKED|independent-verifier|output-capture-too-large:' "${OVERSIZED_STDERR}" || \
  fail 'runner did not report oversized output clearly'

DOCTOR_HOME="${TMP_ROOT}/doctor-home"
mkdir -p "${DOCTOR_HOME}"
chmod 700 "${DOCTOR_HOME}"
printf '[profiles.readonly]\n' >"${DOCTOR_HOME}/readonly.config.toml"
printf 'fixture-only marker\n' >"${DOCTOR_HOME}/auth.json"

PASS_OUTPUT="${TMP_ROOT}/doctor-pass"
PATH="${FAKE_BIN}:${PATH}" FAKE_CODEX_ARGS="${FAKE_CODEX_ARGS}" \
  CODEX_VERIFIER_HOME="${DOCTOR_HOME}" AGENT_RUNTIME_WORKSPACE="${TMP_ROOT}" \
  AGENT_RUNTIME_MIN_AVAILABLE_KB=0 "${DOCTOR}" >"${PASS_OUTPUT}"
grep -Fqx 'PASS|summary|ready' "${PASS_OUTPUT}" || fail 'doctor did not classify healthy fixture as PASS'

WARN_OUTPUT="${TMP_ROOT}/doctor-warn"
PATH="${FAKE_BIN}:${PATH}" FAKE_CODEX_ARGS="${FAKE_CODEX_ARGS}" \
  CODEX_VERIFIER_HOME="${DOCTOR_HOME}" AGENT_RUNTIME_WORKSPACE="${TMP_ROOT}" \
  AGENT_RUNTIME_MIN_AVAILABLE_KB=0 FAKE_WATCHES=1 FAKE_INSTANCES=1 "${DOCTOR}" >"${WARN_OUTPUT}"
grep -Fqx 'WARN|summary|degraded-capacity' "${WARN_OUTPUT}" || fail 'doctor did not classify low inotify capacity as WARN'

BLOCKED_OUTPUT="${TMP_ROOT}/doctor-blocked"
if PATH="${FAKE_BIN}:${PATH}" FAKE_CODEX_ARGS="${FAKE_CODEX_ARGS}" \
  CODEX_VERIFIER_HOME="${TMP_ROOT}/absent" AGENT_RUNTIME_WORKSPACE="${TMP_ROOT}" \
  AGENT_RUNTIME_MIN_AVAILABLE_KB=0 "${DOCTOR}" >"${BLOCKED_OUTPUT}"; then
  fail 'doctor accepted a missing verifier home'
fi
grep -Fqx 'BLOCKED|summary|remediation-required' "${BLOCKED_OUTPUT}" || fail 'doctor did not classify missing home as BLOCKED'

printf 'Agent runtime fixtures passed.\n'
