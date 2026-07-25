#!/usr/bin/env bash
set -euo pipefail
PATH='/usr/sbin:/usr/bin:/sbin:/bin'
export PATH

VERIFIER_USER='azursystech-verifier'
VERIFIER_GROUP='azursystech-verifier'
VERIFIER_HOME='/var/lib/azursystech-os-verifier/home'
VERIFIER_WORK='/var/lib/azursystech-os-verifier/work'

fail() { printf 'BLOCKED|os-isolated-provisioner|%s\n' "$1" >&2; exit 2; }
account_is_safe() {
  local user_entry group_entry user_uid user_gid group_gid user_home user_shell groups
  user_entry="$(getent passwd "$VERIFIER_USER" || true)"
  group_entry="$(getent group "$VERIFIER_GROUP" || true)"
  [[ -n "$user_entry" && -n "$group_entry" ]] || return 1
  IFS=: read -r _ _ user_uid user_gid _ user_home user_shell <<<"$user_entry"
  IFS=: read -r _ _ group_gid _ <<<"$group_entry"
  [[ "$user_uid" =~ ^[1-9][0-9]*$ && "$user_uid" -le 999 ]] || return 1
  [[ "$user_gid" == "$group_gid" && "$user_home" == "$VERIFIER_HOME" && "$user_shell" == /usr/sbin/nologin ]] || return 1
  groups="$(id -G "$VERIFIER_USER" 2>/dev/null || true)"
  [[ "$groups" == "$user_gid" ]] || return 1
}
check() {
  local result=0
  account_is_safe || result=1
  [[ -d /var/lib/azursystech-os-verifier && ! -L /var/lib/azursystech-os-verifier ]] || result=1
  [[ "$(stat -c '%U:%G:%a' /var/lib/azursystech-os-verifier 2>/dev/null || true)" == 'root:root:755' ]] || result=1
  for path in "$VERIFIER_HOME" "$VERIFIER_WORK"; do
    [[ -d "$path" && ! -L "$path" ]] || result=1
    [[ "$(stat -c '%U:%G:%a' "$path" 2>/dev/null || true)" == "root:${VERIFIER_GROUP}:750" ]] || result=1
  done
  [[ $result -eq 0 ]] || fail 'not-provisioned'
  printf 'PASS|os-isolated-provisioner|ready\n'
}

case "${1:---check}" in
  --check) [[ $# -eq 1 || $# -eq 0 ]] || fail 'unexpected-arguments'; check ;;
  --apply)
    [[ $# -eq 1 ]] || fail 'unexpected-arguments'
    [[ "$(id -u)" -eq 0 ]] || fail 'root-required'
    if ! getent group "$VERIFIER_GROUP" >/dev/null 2>&1; then groupadd --system "$VERIFIER_GROUP"; fi
    if getent passwd "$VERIFIER_USER" >/dev/null 2>&1; then account_is_safe || fail 'preexisting-account-unsafe'; fi
    if ! getent passwd "$VERIFIER_USER" >/dev/null 2>&1; then
      useradd --system --gid "$VERIFIER_GROUP" --home-dir "$VERIFIER_HOME" --shell /usr/sbin/nologin --no-create-home "$VERIFIER_USER"
    fi
    install -d -o root -g root -m 0755 /var/lib/azursystech-os-verifier
    install -d -o root -g "$VERIFIER_GROUP" -m 0750 "$VERIFIER_HOME" "$VERIFIER_WORK"
    check
    ;;
  -h|--help) printf '%s\n' 'Usage: scripts/provision-os-isolated-verifier.sh [--check|--apply]' ;;
  *) fail 'unknown-option' ;;
esac
