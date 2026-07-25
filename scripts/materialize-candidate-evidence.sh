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

# The candidate identity, paths, and bytes are fixed declarations; no caller
# input or private evidence is read by this materializer.
CANDIDATE_ROOT_PARENT='/var/lib'
CANDIDATE_PRIVATE_PARENT='/var/lib/azursystech-private'
CANDIDATE_EVIDENCE_ROOT='/var/lib/azursystech-private/ai-video-evidence'
CANDIDATE_ID='AST-IMMOBILIER-HERO-VEO31FAST-20260724-01'
CANDIDATE_OWNER='root'
CANDIDATE_GROUP='root'
readonly -a CANDIDATE_MANIFEST=(
  'authorization/owner-authorization.record'
  'route-decision/no-fallback-route-decision.record'
  'input-rights/text-only-input-rights-decision.record'
  'outcome/candidate-outcome-ledger.record'
  'integrity/candidate-integrity-attestation.record'
)

fail() { printf 'BLOCKED|candidate-materializer|%s\n' "$1" >&2; exit 2; }

startup_environment_is_safe() {
  [[ "$INITIAL_PATH" == "$SAFE_PATH" && "$INITIAL_HOME" == /root && "$INITIAL_LANG" == C && -z "$INITIAL_BASH_ENV_SET" && -z "$INITIAL_ENV_SET" ]]
}

safe_directory() {
  local path="$1" mode="$2"
  [[ -d "$path" && ! -L "$path" ]] || return 1
  [[ "$(/usr/bin/stat -c '%U:%G:%a:%F' -- "$path")" == "${CANDIDATE_OWNER}:${CANDIDATE_GROUP}:${mode}:directory" ]]
}

candidate_relative_path_is_safe() {
  [[ "$1" =~ ^[a-z-]+/[a-z0-9-]+\.record$ && "$1" != *'..'* && "$1" != *'//' ]]
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

validate_fixed_identity() {
  [[ "$CANDIDATE_ROOT_PARENT" == /var/lib && "$CANDIDATE_PRIVATE_PARENT" == "$CANDIDATE_ROOT_PARENT/azursystech-private" && "$CANDIDATE_EVIDENCE_ROOT" == "$CANDIDATE_PRIVATE_PARENT/ai-video-evidence" && "$CANDIDATE_ID" =~ ^AST-[A-Z0-9][A-Z0-9-]{3,79}$ ]] || fail 'candidate-identity-unsafe'
}

validate_fixed_base_hierarchy() {
  safe_directory /var 755 || fail 'candidate-var-parent-unsafe'
  safe_directory "$CANDIDATE_ROOT_PARENT" 755 || fail 'candidate-root-parent-unsafe'
}

validate_fixed_hierarchy() {
  validate_fixed_identity
  validate_fixed_base_hierarchy
  safe_directory "$CANDIDATE_PRIVATE_PARENT" 700 || fail 'candidate-private-parent-unsafe'
  safe_directory "$CANDIDATE_EVIDENCE_ROOT" 700 || fail 'candidate-root-unsafe'
}

create_absent_private_directory() {
  local path="$1" parent="$2" parent_mode="$3" failure_code="$4"
  [[ ! -e "$path" && ! -L "$path" ]] || fail "$failure_code"
  safe_directory "$parent" "$parent_mode" || fail "$failure_code"
  /bin/mkdir -- "$path" || fail "$failure_code"
  /usr/bin/chown "$CANDIDATE_OWNER:$CANDIDATE_GROUP" -- "$path" || fail "$failure_code"
  /bin/chmod 0700 -- "$path" || fail "$failure_code"
  safe_directory "$path" 700 || fail "$failure_code"
}

ensure_private_directory() {
  local path="$1" parent="$2" parent_mode="$3" failure_code="$4"
  if [[ -e "$path" || -L "$path" ]]; then
    safe_directory "$path" 700 || fail "$failure_code"
  else
    create_absent_private_directory "$path" "$parent" "$parent_mode" "$failure_code"
  fi
}

write_staged_record() {
  local staging="$1" relative_path="$2" destination
  destination="$staging/$relative_path"
  /usr/bin/install -d -o "$CANDIDATE_OWNER" -g "$CANDIDATE_GROUP" -m 0700 -- "${destination%/*}" || fail 'staging-category-create-failed'
  expected_candidate_schema "$relative_path" > "$destination" || fail 'candidate-schema-unknown'
  /bin/chmod 0600 -- "$destination" || fail 'staging-record-permissions-unsettable'
  [[ "$(/usr/bin/stat -c '%U:%G:%a:%F:%h' -- "$destination")" == "${CANDIDATE_OWNER}:${CANDIDATE_GROUP}:600:regular file:1" ]] || fail 'staging-record-unsafe'
}

main() {
  local final_package staging relative_path
  [[ "$#" -eq 0 ]] || fail 'arguments-not-allowed'
  startup_environment_is_safe || fail 'startup-environment-unsafe'
  [[ "$(/usr/bin/id -u)" -eq 0 ]] || fail 'root-required'
  validate_fixed_identity
  validate_fixed_base_hierarchy
  ensure_private_directory "$CANDIDATE_PRIVATE_PARENT" "$CANDIDATE_ROOT_PARENT" 755 'candidate-private-parent-unsafe'
  ensure_private_directory "$CANDIDATE_EVIDENCE_ROOT" "$CANDIDATE_PRIVATE_PARENT" 700 'candidate-root-unsafe'
  validate_fixed_hierarchy
  final_package="$CANDIDATE_EVIDENCE_ROOT/$CANDIDATE_ID"
  [[ ! -e "$final_package" && ! -L "$final_package" ]] || fail 'candidate-package-already-exists'
  umask 077
  staging="$(/usr/bin/mktemp -d "$CANDIDATE_EVIDENCE_ROOT/.${CANDIDATE_ID}.staging.XXXXXX")" || fail 'staging-create-failed'
  cleanup() { [[ -n "${staging-}" && -d "$staging" && ! -L "$staging" ]] && /bin/rm -rf -- "$staging"; }
  trap cleanup EXIT
  /usr/bin/chown "$CANDIDATE_OWNER:$CANDIDATE_GROUP" -- "$staging"
  /bin/chmod 0700 -- "$staging"
  [[ "$(/usr/bin/stat -c '%U:%G:%a:%F' -- "$staging")" == "${CANDIDATE_OWNER}:${CANDIDATE_GROUP}:700:directory" ]] || fail 'staging-directory-unsafe'
  for relative_path in "${CANDIDATE_MANIFEST[@]}"; do
    candidate_relative_path_is_safe "$relative_path" || fail 'candidate-manifest-path-unsafe'
    write_staged_record "$staging" "$relative_path"
  done
  /usr/bin/mv --no-copy --update=none-fail -T -- "$staging" "$final_package" >/dev/null 2>&1 || fail 'candidate-package-publish-refused'
  [[ ! -e "$staging" && ! -L "$staging" ]] || fail 'candidate-package-publish-refused'
  trap - EXIT
  printf 'PASS|candidate-materializer|records=%s\n' "${#CANDIDATE_MANIFEST[@]}"
}

if [[ "${BASH_SOURCE[0]}" == "$0" ]]; then main "$@"; fi
