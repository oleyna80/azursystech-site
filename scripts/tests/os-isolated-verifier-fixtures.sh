#!/bin/bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
HELPER="$ROOT_DIR/scripts/ai-video-private-evidence.sh"
PROVISIONER="$ROOT_DIR/scripts/provision-os-isolated-verifier.sh"
RUNNER="$ROOT_DIR/scripts/run-os-isolated-verifier.sh"
TMP_ROOT="$(/usr/bin/mktemp -d /tmp/os-isolated-verifier-fixtures.XXXXXX)"
EVIDENCE_PARENT="$TMP_ROOT/root-parent"
EVIDENCE_ROOT="$EVIDENCE_PARENT/azursystech-private/ai-video-evidence"
TEST_HELPER="$TMP_ROOT/ai-video-private-evidence-test.sh"
TEST_RUNNER="$TMP_ROOT/run-os-isolated-verifier-test.sh"
SUCCESS_RUNNER="$TMP_ROOT/run-os-isolated-verifier-success-test.sh"
SUCCESS_WORK="$TMP_ROOT/verifier-work"
TRAVERSAL_RUNNER="$TMP_ROOT/run-os-isolated-verifier-traversal-test.sh"
NETNS_RUNNER="$TMP_ROOT/run-os-isolated-verifier-netns-test.sh"
OWNER_RUNNER="$TMP_ROOT/run-os-isolated-verifier-owner-test.sh"
TEST_OWNER="$(/usr/bin/id -un)"
TEST_GROUP="$(/usr/bin/id -gn)"
cleanup() { /bin/rm -rf -- "$TMP_ROOT"; }
trap cleanup EXIT
fail() { printf 'FAIL|os-isolated-fixtures|%s\n' "$1" >&2; exit 1; }
expect_blocked() { if "$@" >/dev/null 2>&1; then fail 'expected-blocked'; fi; }

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
expect_candidate_blocked() { if candidate_validate "$1" >/dev/null 2>&1; then fail 'expected-candidate-blocked'; fi; }

/bin/bash -n "$HELPER" "$PROVISIONER" "$RUNNER"
sed "s|^DEFAULT_ROOT=.*|DEFAULT_ROOT='$EVIDENCE_ROOT'|" "$HELPER" > "$TEST_HELPER"
/bin/chmod 700 "$TEST_HELPER"
sed -e "s|^CANDIDATE_ROOT_PARENT=.*|CANDIDATE_ROOT_PARENT='$EVIDENCE_PARENT'|" \
    -e "s|^CANDIDATE_PRIVATE_PARENT=.*|CANDIDATE_PRIVATE_PARENT='$EVIDENCE_PARENT/azursystech-private'|" \
    -e "s|^CANDIDATE_EVIDENCE_ROOT=.*|CANDIDATE_EVIDENCE_ROOT='$EVIDENCE_ROOT'|" \
    -e "s|^CANDIDATE_OWNER=.*|CANDIDATE_OWNER='$TEST_OWNER'|" \
    -e "s|^CANDIDATE_GROUP=.*|CANDIDATE_GROUP='$TEST_GROUP'|" \
    -e '/candidate-identity-unsafe/c\  [[ "$CANDIDATE_ROOT_PARENT" == /tmp/* && "$CANDIDATE_PRIVATE_PARENT" == "$CANDIDATE_ROOT_PARENT/azursystech-private" && "$CANDIDATE_EVIDENCE_ROOT" == "$CANDIDATE_PRIVATE_PARENT/ai-video-evidence" && "$CANDIDATE_ID" =~ ^AST-[A-Z0-9][A-Z0-9-]{3,79}$ ]] || fail '\''candidate-identity-unsafe'\''' \
    -e 's|/usr/bin/install -o root -g "$VERIFIER_USER"|/usr/bin/install -o "$CANDIDATE_OWNER" -g "$CANDIDATE_GROUP"|' \
    -e 's|-m 0440 /dev/null|-m 0640 /dev/null|' \
    "$RUNNER" > "$TEST_RUNNER"
/bin/chmod 700 "$TEST_RUNNER"
mkdir -p "$SUCCESS_WORK"
sed -e "s|^VERIFIER_WORK=.*|VERIFIER_WORK='$SUCCESS_WORK'|" \
    -e '/^prepare_isolation() {$/,/^}$/c\prepare_isolation() { :; }' \
    -e 's|/usr/bin/chown root:"$VERIFIER_USER" "$snapshot"|/usr/bin/chown "$CANDIDATE_OWNER:$CANDIDATE_GROUP" "$snapshot"|' \
    -e 's|/usr/sbin/runuser -u "$VERIFIER_USER" -g "$VERIFIER_USER" -- /usr/bin/env -i HOME="$VERIFIER_HOME" PATH=/usr/bin:/bin LANG=C /usr/bin/sha256sum "$snapshot"/\*|/usr/bin/sha256sum "$snapshot"/*|' \
    "$TEST_RUNNER" > "$SUCCESS_RUNNER"
/bin/chmod 700 "$SUCCESS_RUNNER"
sed 's|authorization/owner-authorization.record|../outside.record|' "$TEST_RUNNER" > "$TRAVERSAL_RUNNER"
sed "s|^NETWORK_NAMESPACE_REFERENCE=.*|NETWORK_NAMESPACE_REFERENCE='/proc/self/ns/net'|" "$TEST_RUNNER" > "$NETNS_RUNNER"
sed "s|^CANDIDATE_OWNER=.*|CANDIDATE_OWNER='missing-owner'|" "$TEST_RUNNER" > "$OWNER_RUNNER"
/bin/chmod 700 "$TRAVERSAL_RUNNER" "$NETNS_RUNNER" "$OWNER_RUNNER"

source_record=/tmp/os-isolated-fixture.record
printf '%s\n' 'redacted reference only' > "$source_record"
trap '/bin/rm -f "$source_record"; cleanup' EXIT
"$TEST_HELPER" AST-TEST-20260724 authorization "$source_record" >/dev/null
[[ "$(/usr/bin/stat -c '%a' "$EVIDENCE_ROOT")" == 700 ]] || fail 'root-mode'
[[ "$(/usr/bin/stat -c '%a' "$EVIDENCE_ROOT/AST-TEST-20260724/authorization/os-isolated-fixture.record")" == 600 ]] || fail 'record-mode'
expect_blocked "$TEST_HELPER" ../escape authorization "$source_record"

/bin/mkdir -p "$EVIDENCE_PARENT"
/bin/chmod 755 "$EVIDENCE_PARENT"
candidate_package="$EVIDENCE_ROOT/AST-IMMOBILIER-HERO-VEO31FAST-20260724-01"
while IFS='|' read -r candidate_record candidate_schema; do
  /bin/mkdir -p "$candidate_package/${candidate_record%/*}"
  /bin/chmod 700 "$candidate_package/${candidate_record%/*}"
  printf '%s\n' "$candidate_schema" > "$candidate_package/$candidate_record"
  /bin/chmod 600 "$candidate_package/$candidate_record"
done <<'EOF'
authorization/owner-authorization.record|candidate-evidence-v1|authorization|decision=authorized
route-decision/no-fallback-route-decision.record|candidate-evidence-v1|route-decision|decision=no-fallback
input-rights/text-only-input-rights-decision.record|candidate-evidence-v1|input-rights|decision=text-only
outcome/candidate-outcome-ledger.record|candidate-evidence-v1|outcome|state=needs-provider-confirmation
integrity/candidate-integrity-attestation.record|candidate-evidence-v1|integrity|state=recorded
EOF
/bin/chmod 700 "$EVIDENCE_ROOT" "$candidate_package"
candidate_validate "$TEST_RUNNER" || fail 'candidate-schema-success'
success_output="$(/usr/bin/env -i HOME=/root PATH=/usr/sbin:/usr/bin:/sbin:/bin LANG=C /bin/bash "$SUCCESS_RUNNER" --candidate-evidence 2>&1)" || fail 'candidate-success-exit'
[[ "$success_output" == 'PASS|os-isolated-verifier|candidate-evidence=PASS' ]] || fail 'candidate-success-output'

printf '%s\n' 'unexpected' > "$candidate_package/unexpected.record"
expect_candidate_blocked "$TEST_RUNNER"
/bin/rm -f "$candidate_package/unexpected.record"
/bin/mkdir "$candidate_package/unexpected-dir"
expect_candidate_blocked "$TEST_RUNNER"
/bin/rmdir "$candidate_package/unexpected-dir"
/bin/ln -s /tmp "$candidate_package/unexpected-link"
expect_candidate_blocked "$TEST_RUNNER"
/bin/rm -f "$candidate_package/unexpected-link"
/bin/ln "$candidate_package/authorization/owner-authorization.record" "$candidate_package/unexpected-hardlink"
expect_candidate_blocked "$TEST_RUNNER"
/bin/rm -f "$candidate_package/unexpected-hardlink"

/bin/mv "$EVIDENCE_ROOT" "$TMP_ROOT/parked-evidence-root"
/bin/rmdir "$EVIDENCE_PARENT/azursystech-private"
/bin/ln -s /tmp "$EVIDENCE_PARENT/azursystech-private"
expect_candidate_blocked "$TEST_RUNNER"
/bin/rm -f "$EVIDENCE_PARENT/azursystech-private"
/bin/mkdir "$EVIDENCE_PARENT/azursystech-private"
/bin/chmod 700 "$EVIDENCE_PARENT/azursystech-private"
/bin/mv "$TMP_ROOT/parked-evidence-root" "$EVIDENCE_ROOT"

expect_candidate_blocked "$TRAVERSAL_RUNNER"
expect_candidate_blocked "$OWNER_RUNNER"
/bin/chmod 755 "$EVIDENCE_ROOT"
expect_candidate_blocked "$TEST_RUNNER"
/bin/chmod 700 "$EVIDENCE_ROOT"

set_invalid_record() { printf '%s\n' "$2" > "$candidate_package/$1"; /bin/chmod 600 "$candidate_package/$1"; }
/usr/bin/printf '%s\n\0' 'candidate-evidence-v1|authorization|decision=authorized' > "$candidate_package/authorization/owner-authorization.record"
/bin/chmod 600 "$candidate_package/authorization/owner-authorization.record"
expect_candidate_blocked "$TEST_RUNNER"
set_invalid_record 'authorization/owner-authorization.record' 'candidate-evidence-v1|authorization|decision=authorized'
set_invalid_record 'authorization/owner-authorization.record' 'prompt=unapproved'
expect_candidate_blocked "$TEST_RUNNER"
set_invalid_record 'authorization/owner-authorization.record' 'candidate-evidence-v1|authorization|decision=authorized'
set_invalid_record 'route-decision/no-fallback-route-decision.record' 'provider-operation=unapproved'
expect_candidate_blocked "$TEST_RUNNER"
set_invalid_record 'route-decision/no-fallback-route-decision.record' 'candidate-evidence-v1|route-decision|decision=no-fallback'
set_invalid_record 'input-rights/text-only-input-rights-decision.record' 'raw-provider-terms=unapproved'
expect_candidate_blocked "$TEST_RUNNER"
set_invalid_record 'input-rights/text-only-input-rights-decision.record' 'candidate-evidence-v1|input-rights|decision=text-only'
set_invalid_record 'outcome/candidate-outcome-ledger.record' 'token=not-allowed'
expect_candidate_blocked "$TEST_RUNNER"
set_invalid_record 'outcome/candidate-outcome-ledger.record' 'candidate-evidence-v1|outcome|state=needs-provider-confirmation'

/bin/rm -f "$candidate_package/authorization/owner-authorization.record"
/bin/ln -s /tmp "$candidate_package/authorization/owner-authorization.record"
expect_candidate_blocked "$TEST_RUNNER"
/bin/rm -f "$candidate_package/authorization/owner-authorization.record"
set_invalid_record 'authorization/owner-authorization.record' 'candidate-evidence-v1|authorization|decision=authorized'
/bin/rm -f "$candidate_package/input-rights/text-only-input-rights-decision.record"
/bin/ln "$candidate_package/route-decision/no-fallback-route-decision.record" "$candidate_package/input-rights/text-only-input-rights-decision.record"
expect_candidate_blocked "$TEST_RUNNER"
/bin/rm -f "$candidate_package/input-rights/text-only-input-rights-decision.record"
set_invalid_record 'input-rights/text-only-input-rights-decision.record' 'candidate-evidence-v1|input-rights|decision=text-only'
/usr/bin/head -c 32769 /dev/zero | /usr/bin/tr '\0' x > "$candidate_package/integrity/candidate-integrity-attestation.record"
/bin/chmod 600 "$candidate_package/integrity/candidate-integrity-attestation.record"
expect_candidate_blocked "$TEST_RUNNER"
set_invalid_record 'integrity/candidate-integrity-attestation.record' 'candidate-evidence-v1|integrity|state=recorded'

if /bin/bash -c 'source "$1"; network_namespace_is_isolated' /bin/bash "$NETNS_RUNNER"; then fail 'network-namespace-predicate-accepted-shared'; fi
hostile_output="$(BASH_ENV=/dev/null PATH=/tmp/unsafe HOME=/root LANG=C /bin/bash "$RUNNER" --candidate-evidence 2>&1 || true)"
[[ "$hostile_output" == *'startup-environment-unsafe'* ]] || fail 'hostile-startup-environment'
safe_output="$(/usr/bin/env -i HOME=/root PATH=/usr/sbin:/usr/bin:/sbin:/bin LANG=C /bin/bash "$RUNNER" 2>&1 || true)"
[[ "$safe_output" == *'network-namespace-not-isolated'* ]] || fail 'safe-startup-network-precondition'
invalid_arg_output="$(/usr/bin/env -i HOME=/root PATH=/usr/sbin:/usr/bin:/sbin:/bin LANG=C /bin/bash "$RUNNER" --candidate-evidence /tmp 2>&1 || true)"
[[ "$invalid_arg_output" == *'arguments-not-allowed'* ]] || fail 'candidate-argument-rejection'

if [[ "$(/usr/bin/id -u)" -ne 0 ]]; then
  "$PROVISIONER" --check >/dev/null 2>&1 || true
  expect_blocked "$RUNNER"
  printf 'SKIP|root-required\n'
else
  printf 'SKIP|live-host-provisioning-not-run-by-fixture\n'
fi
/usr/bin/grep -Fq 'user_uid" -le 999' "$PROVISIONER" || fail 'provisioner-uid-check-missing'
/usr/bin/grep -Fq 'runuser-supplementary-groups-unsafe' "$RUNNER" || fail 'runner-supplementary-group-check-missing'
printf 'PASS|os-isolated-fixtures|process-continuity-and-candidate-boundaries\n'
