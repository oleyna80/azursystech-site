#!/bin/bash
set -euo pipefail

SAFE_PATH='/usr/sbin:/usr/bin:/sbin:/bin'
INITIAL_PATH="${PATH-}"
INITIAL_HOME="${HOME-}"
INITIAL_LANG="${LANG-}"
INITIAL_BASH_ENV_SET="${BASH_ENV+x}"
INITIAL_ENV_SET="${ENV+x}"
PATH="$SAFE_PATH"
export PATH

# Bounded integrity attestation only: no repository executable is invoked.
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
VERIFIER_USER='azursystech-verifier'
VERIFIER_HOME='/var/lib/azursystech-os-verifier/home'
VERIFIER_WORK='/var/lib/azursystech-os-verifier/work'
CANDIDATE_ROOT_PARENT='/var/lib'
CANDIDATE_PRIVATE_PARENT='/var/lib/azursystech-private'
CANDIDATE_EVIDENCE_ROOT='/var/lib/azursystech-private/ai-video-evidence'
CANDIDATE_ID='AST-IMMOBILIER-HERO-VEO31FAST-20260724-01'
CANDIDATE_OWNER='root'
CANDIDATE_GROUP='root'
MAX_CANDIDATE_RECORD_BYTES=32768
NETWORK_NAMESPACE_REFERENCE='/proc/1/ns/net'
readonly -a ALLOWLIST=(
  AGENTS.md PROJECT_MAP.md FILE_REGISTRY.yml
  scripts/ai-video-private-evidence.sh scripts/materialize-candidate-evidence.sh scripts/provision-os-isolated-verifier.sh scripts/run-os-isolated-verifier.sh scripts/tests/materialize-candidate-evidence-fixtures.sh scripts/tests/os-isolated-verifier-fixtures.sh
  docs/engineering-memory/ai-video-production-operating-instruction.md docs/policies/ai-video-generation-and-publication-policy.md
  docs/templates/ai-video-evidence-package/README.md docs/templates/ai-video-evidence-package/manifest.template.yml docs/templates/os-isolated-verifier-runbook.md
  .agent/workflows/sdd-protocol.md .codex/instructions.md
)
readonly -a CANDIDATE_MANIFEST=(
  'authorization/owner-authorization.record'
  'route-decision/no-fallback-route-decision.record'
  'input-rights/text-only-input-rights-decision.record'
  'outcome/candidate-outcome-ledger.record'
  'integrity/candidate-integrity-attestation.record'
)
fail() { printf 'BLOCKED|os-isolated-verifier|%s\n' "$1" >&2; exit 2; }
ACTIVE_SNAPSHOT=''

cleanup_active_snapshot() {
  local snapshot="${ACTIVE_SNAPSHOT:-}"
  [[ -z "$snapshot" ]] && return 0
  ACTIVE_SNAPSHOT=''
  [[ -d "$snapshot" && ! -L "$snapshot" ]] || return 1
  /bin/rm -rf -- "$snapshot"
}

trap cleanup_active_snapshot EXIT

startup_environment_is_safe() {
  [[ "$INITIAL_PATH" == "$SAFE_PATH" && "$INITIAL_HOME" == /root && "$INITIAL_LANG" == C && -z "$INITIAL_BASH_ENV_SET" && -z "$INITIAL_ENV_SET" ]]
}

network_namespace_is_isolated() {
  [[ -r /proc/self/ns/net && -r "$NETWORK_NAMESPACE_REFERENCE" ]] || return 1
  [[ "$(/usr/bin/readlink /proc/self/ns/net)" != "$(/usr/bin/readlink "$NETWORK_NAMESPACE_REFERENCE")" ]]
}

prepare_isolation() {
  local verifier_entry verifier_group verifier_uid verifier_gid verifier_home verifier_shell verifier_group_gid isolated_groups command_path
  startup_environment_is_safe || fail 'startup-environment-unsafe'
  network_namespace_is_isolated || fail 'network-namespace-not-isolated'
  [[ "$(/usr/bin/id -u)" -eq 0 ]] || fail 'root-required'
  /usr/bin/getent passwd "$VERIFIER_USER" >/dev/null 2>&1 || fail 'verifier-user-missing'
  verifier_entry="$(/usr/bin/getent passwd "$VERIFIER_USER")"
  IFS=: read -r _ _ verifier_uid verifier_gid _ verifier_home verifier_shell <<<"$verifier_entry"
  verifier_group="$(/usr/bin/getent group "$VERIFIER_USER" || true)"
  IFS=: read -r _ _ verifier_group_gid _ <<<"$verifier_group"
  [[ "$verifier_uid" =~ ^[1-9][0-9]*$ && "$verifier_uid" -le 999 && "$verifier_home" == "$VERIFIER_HOME" && "$verifier_shell" == /usr/sbin/nologin && "$verifier_gid" == "$verifier_group_gid" ]] || fail 'verifier-account-unsafe'
  [[ "$(/usr/bin/id -G "$VERIFIER_USER" 2>/dev/null || true)" == "$verifier_gid" ]] || fail 'verifier-supplementary-groups-unsafe'
  [[ -d "$VERIFIER_HOME" && ! -L "$VERIFIER_HOME" && -d "$VERIFIER_WORK" && ! -L "$VERIFIER_WORK" ]] || fail 'verifier-hierarchy-missing'
  [[ "$(/usr/bin/stat -c '%U:%G:%a' /var/lib/azursystech-os-verifier)" == 'root:root:755' ]] || fail 'verifier-parent-unsafe'
  [[ "$(/usr/bin/stat -c '%U:%G:%a' "$VERIFIER_HOME")" == "root:${VERIFIER_USER}:750" && "$(/usr/bin/stat -c '%U:%G:%a' "$VERIFIER_WORK")" == "root:${VERIFIER_USER}:750" ]] || fail 'verifier-hierarchy-unsafe'
  [[ -x /usr/sbin/runuser ]] || fail 'runuser-missing'
  for command_path in /usr/bin/env /usr/bin/id /usr/bin/sha256sum /usr/bin/stat /usr/bin/readlink /usr/bin/cmp /usr/bin/tr /usr/bin/wc /usr/bin/find /bin/cat; do [[ -x "$command_path" ]] || fail 'fixed-coreutils-missing'; done
  isolated_groups="$(/usr/sbin/runuser -u "$VERIFIER_USER" -g "$VERIFIER_USER" -- /usr/bin/env -i HOME="$VERIFIER_HOME" PATH=/usr/bin:/bin LANG=C /usr/bin/id -G)" || fail 'runuser-group-check-failed'
  [[ "$isolated_groups" == "$verifier_gid" ]] || fail 'runuser-supplementary-groups-unsafe'
}

candidate_relative_path_is_safe() {
  [[ "$1" =~ ^[a-z-]+/[a-z0-9-]+\.record$ && "$1" != *'..'* && "$1" != *'//' ]]
}

safe_candidate_directory() {
  local path="$1" mode="$2"
  [[ -d "$path" && ! -L "$path" ]] || return 1
  [[ "$(/usr/bin/stat -c '%U:%G:%a:%F' "$path")" == "${CANDIDATE_OWNER}:${CANDIDATE_GROUP}:${mode}:directory" ]]
}

expected_candidate_schema() {
  case "$1" in
    authorization/owner-authorization.record) printf '%s\n' 'candidate-evidence-v1|authorization|decision=authorized' ;;
    route-decision/no-fallback-route-decision.record) printf '%s\n' 'candidate-evidence-v1|route-decision|decision=no-fallback' ;;
    input-rights/text-only-input-rights-decision.record) printf '%s\n' 'candidate-evidence-v1|input-rights|decision=text-only' ;;
    outcome/candidate-outcome-ledger.record) printf '%s\n' 'candidate-evidence-v1|outcome|state=needs-provider-confirmation' ;;
    integrity/candidate-integrity-attestation.record) printf '%s\n' 'candidate-evidence-v1|integrity|state=recorded' ;;
    *) return 1 ;;
  esac
}

validate_snapshot_record() {
  local snapshot_path="$1" relative_path="$2" expected_size snapshot_size unexpected_byte_count
  expected_size="$(expected_candidate_schema "$relative_path" | /usr/bin/wc -c)" || fail 'candidate-schema-unknown'
  snapshot_size="$(/usr/bin/stat -c '%s' -- "$snapshot_path")" || fail 'candidate-snapshot-read-failed'
  [[ "$snapshot_size" == "$expected_size" ]] || fail 'candidate-record-schema-invalid'
  unexpected_byte_count="$(LC_ALL=C /usr/bin/tr -d '\11\12\15\40-\176' < "$snapshot_path" | /usr/bin/wc -c)" || fail 'candidate-snapshot-read-failed'
  [[ "$unexpected_byte_count" -eq 0 ]] || fail 'candidate-record-schema-invalid'
  expected_candidate_schema "$relative_path" | /usr/bin/cmp -s - "$snapshot_path" || fail 'candidate-record-schema-invalid'
}

validate_candidate_hierarchy() {
  local relative_path
  [[ "$CANDIDATE_ROOT_PARENT" == /var/lib && "$CANDIDATE_PRIVATE_PARENT" == "$CANDIDATE_ROOT_PARENT/azursystech-private" && "$CANDIDATE_EVIDENCE_ROOT" == "$CANDIDATE_PRIVATE_PARENT/ai-video-evidence" && "$CANDIDATE_ID" =~ ^AST-[A-Z0-9][A-Z0-9-]{3,79}$ ]] || fail 'candidate-identity-unsafe'
  safe_candidate_directory "$CANDIDATE_ROOT_PARENT" 755 || fail 'candidate-root-parent-unsafe'
  safe_candidate_directory "$CANDIDATE_PRIVATE_PARENT" 700 || fail 'candidate-private-parent-unsafe'
  safe_candidate_directory "$CANDIDATE_EVIDENCE_ROOT" 700 || fail 'candidate-root-unsafe'
  safe_candidate_directory "$CANDIDATE_EVIDENCE_ROOT/$CANDIDATE_ID" 700 || fail 'candidate-package-unsafe'
  for relative_path in "${CANDIDATE_MANIFEST[@]}"; do
    candidate_relative_path_is_safe "$relative_path" || fail 'candidate-manifest-path-unsafe'
    safe_candidate_directory "$CANDIDATE_EVIDENCE_ROOT/$CANDIDATE_ID/${relative_path%/*}" 700 || fail 'candidate-record-parent-unsafe'
  done
}

candidate_tree_entry_is_expected() {
  case "$1" in
    authorization|route-decision|input-rights|outcome|integrity) return 0 ;;
    authorization/owner-authorization.record|route-decision/no-fallback-route-decision.record|input-rights/text-only-input-rights-decision.record|outcome/candidate-outcome-ledger.record|integrity/candidate-integrity-attestation.record) return 0 ;;
    *) return 1 ;;
  esac
}

validate_candidate_exact_tree() {
  local package_path entry
  package_path="$CANDIDATE_EVIDENCE_ROOT/$CANDIDATE_ID"
  while IFS= read -r -d '' entry; do
    candidate_tree_entry_is_expected "$entry" || fail 'candidate-tree-unexpected-entry'
  done < <(/usr/bin/find -P "$package_path" -xdev -mindepth 1 -printf '%P\0')
}

copy_candidate_record_from_fd() {
  local source_path="$1" target_path="$2" relative_path="$3" fd path_meta fd_meta
  [[ -f "$source_path" && ! -L "$source_path" ]] || fail 'candidate-record-unsafe'
  path_meta="$(/usr/bin/stat -c '%d:%i:%U:%G:%a:%F:%h:%s' "$source_path")"
  [[ "$path_meta" =~ ^[0-9]+:[0-9]+:${CANDIDATE_OWNER}:${CANDIDATE_GROUP}:600:regular\ file:1:[1-9][0-9]{0,4}$ ]] || fail 'candidate-record-unsafe'
  exec {fd}< "$source_path"
  fd_meta="$(/usr/bin/stat -Lc '%d:%i:%U:%G:%a:%F:%h:%s' "/proc/self/fd/$fd")" || fail 'candidate-record-fd-unsafe'
  [[ "$fd_meta" == "$path_meta" ]] || fail 'candidate-record-raced'
  /usr/bin/install -o root -g "$VERIFIER_USER" -m 0440 /dev/null "$target_path"
  /bin/cat <&"$fd" > "$target_path" || fail 'candidate-snapshot-copy-failed'
  exec {fd}<&-
  validate_snapshot_record "$target_path" "$relative_path"
}

attest_process() {
  local snapshot relative_path source_path target_path attestation attestation_hash
  snapshot="$(/usr/bin/mktemp -d "$VERIFIER_WORK/attestation.XXXXXX")" || fail 'snapshot-create-failed'
  ACTIVE_SNAPSHOT="$snapshot"
  /usr/bin/chown root:"$VERIFIER_USER" "$snapshot"
  /bin/chmod 0750 "$snapshot"
  for relative_path in "${ALLOWLIST[@]}"; do
    source_path="$ROOT_DIR/$relative_path"
    [[ -f "$source_path" && ! -L "$source_path" ]] || fail 'allowlist-source-unsafe'
    [[ "$(/usr/bin/realpath -e -- "$source_path")" == "$ROOT_DIR/"* ]] || fail 'allowlist-source-outside-root'
    target_path="$snapshot/${relative_path//\//__}"
    /usr/bin/install -o root -g "$VERIFIER_USER" -m 0440 -- "$source_path" "$target_path"
  done
  attestation="$(/usr/sbin/runuser -u "$VERIFIER_USER" -g "$VERIFIER_USER" -- /usr/bin/env -i HOME="$VERIFIER_HOME" PATH=/usr/bin:/bin LANG=C /usr/bin/sha256sum "$snapshot"/*)" || fail 'isolated-coreutils-failed'
  [[ "$(printf '%s\n' "$attestation" | /usr/bin/wc -c)" -le 8192 ]] || fail 'attestation-too-large'
  attestation_hash="$(printf '%s\n' "$attestation" | /usr/bin/sha256sum | /usr/bin/awk '{print $1}')"
  [[ "$attestation_hash" =~ ^[a-f0-9]{64}$ ]] || fail 'attestation-invalid'
  cleanup_active_snapshot || fail 'snapshot-cleanup-failed'
  printf 'PASS|os-isolated-verifier|files=%s|attestation-sha256=%s\n' "${#ALLOWLIST[@]}" "$attestation_hash"
}

attest_candidate_evidence() {
  local snapshot relative_path source_path target_path attestation
  validate_candidate_hierarchy
  validate_candidate_exact_tree
  snapshot="$(/usr/bin/mktemp -d "$VERIFIER_WORK/candidate-evidence.XXXXXX")" || fail 'snapshot-create-failed'
  ACTIVE_SNAPSHOT="$snapshot"
  /usr/bin/chown root:"$VERIFIER_USER" "$snapshot"
  /bin/chmod 0750 "$snapshot"
  for relative_path in "${CANDIDATE_MANIFEST[@]}"; do
    source_path="$CANDIDATE_EVIDENCE_ROOT/$CANDIDATE_ID/$relative_path"
    target_path="$snapshot/${relative_path//\//__}"
    copy_candidate_record_from_fd "$source_path" "$target_path" "$relative_path"
  done
  attestation="$(/usr/sbin/runuser -u "$VERIFIER_USER" -g "$VERIFIER_USER" -- /usr/bin/env -i HOME="$VERIFIER_HOME" PATH=/usr/bin:/bin LANG=C /usr/bin/sha256sum "$snapshot"/*)" || fail 'isolated-coreutils-failed'
  [[ "$(printf '%s\n' "$attestation" | /usr/bin/wc -c)" -le 4096 ]] || fail 'attestation-too-large'
  [[ "$(printf '%s\n' "$attestation" | /usr/bin/sha256sum | /usr/bin/awk '{print $1}')" =~ ^[a-f0-9]{64}$ ]] || fail 'attestation-invalid'
  cleanup_active_snapshot || fail 'snapshot-cleanup-failed'
  printf 'PASS|os-isolated-verifier|candidate-evidence=PASS\n'
}

main() {
  local mode
  case "$#" in
    0) mode='process' ;;
    1) [[ "$1" == '--candidate-evidence' ]] || fail 'arguments-not-allowed'; mode='candidate-evidence' ;;
    *) fail 'arguments-not-allowed' ;;
  esac
  prepare_isolation
  if [[ "$mode" == process ]]; then attest_process; else attest_candidate_evidence; fi
}

if [[ "${BASH_SOURCE[0]}" == "$0" ]]; then main "$@"; fi
