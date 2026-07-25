#!/bin/bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
MATERIALIZER="$ROOT_DIR/scripts/materialize-candidate-evidence.sh"
RUNNER="$ROOT_DIR/scripts/run-os-isolated-verifier.sh"
TMP_ROOT="$(/usr/bin/mktemp -d /tmp/materialize-candidate-evidence-fixtures.XXXXXX)"
TEST_OWNER="$(/usr/bin/id -un)"
TEST_GROUP="$(/usr/bin/id -gn)"
cleanup() { /bin/rm -rf -- "$TMP_ROOT"; }
trap cleanup EXIT
fail() { printf 'FAIL|candidate-materializer-fixtures|%s\n' "$1" >&2; exit 1; }
expect_blocked() { if "$@" >/dev/null 2>&1; then fail 'expected-blocked'; fi; }

make_base_hierarchy() {
  local test_root="$1"
  /bin/mkdir -p "$test_root/var/lib"
  /bin/chmod 755 "$test_root/var" "$test_root/var/lib"
}

make_full_hierarchy() {
  local test_root="$1"
  make_base_hierarchy "$test_root"
  /bin/mkdir -p "$test_root/var/lib/azursystech-private/ai-video-evidence"
  /bin/chmod 700 "$test_root/var/lib/azursystech-private" "$test_root/var/lib/azursystech-private/ai-video-evidence"
}

make_test_materializer() {
  local test_root="$1" target="$2" root_parent private_parent evidence_root
  root_parent="$test_root/var/lib"
  private_parent="$root_parent/azursystech-private"
  evidence_root="$private_parent/ai-video-evidence"
  sed \
    -e "s|^CANDIDATE_ROOT_PARENT=.*|CANDIDATE_ROOT_PARENT='$root_parent'|" \
    -e "s|^CANDIDATE_PRIVATE_PARENT=.*|CANDIDATE_PRIVATE_PARENT='$private_parent'|" \
    -e "s|^CANDIDATE_EVIDENCE_ROOT=.*|CANDIDATE_EVIDENCE_ROOT='$evidence_root'|" \
    -e "s|^CANDIDATE_OWNER=.*|CANDIDATE_OWNER='$TEST_OWNER'|" \
    -e "s|^CANDIDATE_GROUP=.*|CANDIDATE_GROUP='$TEST_GROUP'|" \
    -e 's@  safe_directory /var 755 || fail '\''candidate-var-parent-unsafe'\''@  true@' \
    -e '/candidate-identity-unsafe/c\  [[ "$CANDIDATE_ROOT_PARENT" == /tmp/* && "$CANDIDATE_PRIVATE_PARENT" == "$CANDIDATE_ROOT_PARENT/azursystech-private" && "$CANDIDATE_EVIDENCE_ROOT" == "$CANDIDATE_PRIVATE_PARENT/ai-video-evidence" && "$CANDIDATE_ID" =~ ^AST-[A-Z0-9][A-Z0-9-]{3,79}$ ]] || fail '\''candidate-identity-unsafe'\''' \
    -e 's@  \[\[ "$(/usr/bin/id -u)" -eq 0 \]\] || fail '\''root-required'\''@  true@' \
    "$MATERIALIZER" > "$target"
  /bin/chmod 700 "$target"
}

make_test_runner() {
  local test_root="$1" target="$2" root_parent private_parent evidence_root
  root_parent="$test_root/var/lib"
  private_parent="$root_parent/azursystech-private"
  evidence_root="$private_parent/ai-video-evidence"
  sed \
    -e "s|^CANDIDATE_ROOT_PARENT=.*|CANDIDATE_ROOT_PARENT='$root_parent'|" \
    -e "s|^CANDIDATE_PRIVATE_PARENT=.*|CANDIDATE_PRIVATE_PARENT='$private_parent'|" \
    -e "s|^CANDIDATE_EVIDENCE_ROOT=.*|CANDIDATE_EVIDENCE_ROOT='$evidence_root'|" \
    -e "s|^CANDIDATE_OWNER=.*|CANDIDATE_OWNER='$TEST_OWNER'|" \
    -e "s|^CANDIDATE_GROUP=.*|CANDIDATE_GROUP='$TEST_GROUP'|" \
    -e '/candidate-identity-unsafe/c\  [[ "$CANDIDATE_ROOT_PARENT" == /tmp/* && "$CANDIDATE_PRIVATE_PARENT" == "$CANDIDATE_ROOT_PARENT/azursystech-private" && "$CANDIDATE_EVIDENCE_ROOT" == "$CANDIDATE_PRIVATE_PARENT/ai-video-evidence" && "$CANDIDATE_ID" =~ ^AST-[A-Z0-9][A-Z0-9-]{3,79}$ ]] || fail '\''candidate-identity-unsafe'\''' \
    -e 's|/usr/bin/install -o root -g "$VERIFIER_USER"|/usr/bin/install -o "$CANDIDATE_OWNER" -g "$CANDIDATE_GROUP"|' \
    -e 's|-m 0440 /dev/null|-m 0640 /dev/null|' \
    "$RUNNER" > "$target"
  /bin/chmod 700 "$target"
}

candidate_validate() {
  /bin/bash -c '
    source "$1"
    snapshot="$(/usr/bin/mktemp -d "$2/snapshot.XXXXXX")"
    trap "/bin/rm -rf -- \"$snapshot\"" EXIT
    validate_candidate_hierarchy
    validate_candidate_exact_tree
    for record in "${CANDIDATE_MANIFEST[@]}"; do
      copy_candidate_record_from_fd "$CANDIDATE_EVIDENCE_ROOT/$CANDIDATE_ID/$record" "$snapshot/${record//\//__}" "$record"
    done
  ' /bin/bash "$1" "$TMP_ROOT"
}

/bin/bash -n "$MATERIALIZER" "$RUNNER"

success_root="$TMP_ROOT/success"
make_base_hierarchy "$success_root"
success_materializer="$TMP_ROOT/materializer-success.sh"
success_runner="$TMP_ROOT/runner-success.sh"
make_test_materializer "$success_root" "$success_materializer"
make_test_runner "$success_root" "$success_runner"
/usr/bin/env -i HOME=/root PATH=/usr/sbin:/usr/bin:/sbin:/bin LANG=C /bin/bash "$success_materializer" >/dev/null
candidate_package="$success_root/var/lib/azursystech-private/ai-video-evidence/AST-IMMOBILIER-HERO-VEO31FAST-20260724-01"
[[ "$(/usr/bin/stat -c '%U:%G:%a:%F' -- "$success_root/var/lib/azursystech-private")" == "${TEST_OWNER}:${TEST_GROUP}:700:directory" ]] || fail 'private-parent-metadata'
[[ "$(/usr/bin/stat -c '%U:%G:%a:%F' -- "$success_root/var/lib/azursystech-private/ai-video-evidence")" == "${TEST_OWNER}:${TEST_GROUP}:700:directory" ]] || fail 'evidence-root-metadata'
[[ "$(/usr/bin/find "$candidate_package" -type d | /usr/bin/wc -l)" == 6 ]] || fail 'directory-count'
[[ "$(/usr/bin/find "$candidate_package" -type f | /usr/bin/wc -l)" == 5 ]] || fail 'record-count'
while IFS= read -r -d '' path; do
  [[ "$(/usr/bin/stat -c '%U:%G:%a:%F' -- "$path")" == "${TEST_OWNER}:${TEST_GROUP}:700:directory" ]] || fail 'directory-metadata'
done < <(/usr/bin/find "$candidate_package" -type d -print0)
while IFS= read -r -d '' path; do
  [[ "$(/usr/bin/stat -c '%U:%G:%a:%F:%h' -- "$path")" == "${TEST_OWNER}:${TEST_GROUP}:600:regular file:1" ]] || fail 'record-metadata'
done < <(/usr/bin/find "$candidate_package" -type f -print0)
candidate_validate "$success_runner" || fail 'materializer-runner-contract'

expect_blocked /usr/bin/env -i HOME=/root PATH=/usr/sbin:/usr/bin:/sbin:/bin LANG=C /bin/bash "$success_materializer" ignored
expect_blocked /usr/bin/env -i HOME=/root PATH=/usr/sbin:/usr/bin:/sbin:/bin LANG=C /bin/bash "$success_materializer"

existing_root="$TMP_ROOT/existing"
make_full_hierarchy "$existing_root"
existing_materializer="$TMP_ROOT/materializer-existing.sh"
make_test_materializer "$existing_root" "$existing_materializer"
/bin/mkdir "$existing_root/var/lib/azursystech-private/ai-video-evidence/AST-IMMOBILIER-HERO-VEO31FAST-20260724-01"
/bin/chmod 700 "$existing_root/var/lib/azursystech-private/ai-video-evidence/AST-IMMOBILIER-HERO-VEO31FAST-20260724-01"
expect_blocked /usr/bin/env -i HOME=/root PATH=/usr/sbin:/usr/bin:/sbin:/bin LANG=C /bin/bash "$existing_materializer"

unsafe_root="$TMP_ROOT/unsafe"
make_full_hierarchy "$unsafe_root"
unsafe_materializer="$TMP_ROOT/materializer-unsafe.sh"
make_test_materializer "$unsafe_root" "$unsafe_materializer"
/bin/mv "$unsafe_root/var/lib/azursystech-private/ai-video-evidence" "$TMP_ROOT/unsafe-evidence-root"
/bin/rmdir "$unsafe_root/var/lib/azursystech-private"
/bin/ln -s /tmp "$unsafe_root/var/lib/azursystech-private"
expect_blocked /usr/bin/env -i HOME=/root PATH=/usr/sbin:/usr/bin:/sbin:/bin LANG=C /bin/bash "$unsafe_materializer"

printf 'PASS|candidate-materializer-fixtures|materialization-and-runner-contract\n'
