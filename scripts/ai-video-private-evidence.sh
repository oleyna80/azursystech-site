#!/usr/bin/env bash
set -euo pipefail

# Stores one small, redacted evidence record. This helper never handles media,
# credentials, provider responses, or caller-selected destination roots.
DEFAULT_ROOT='/var/lib/azursystech-private/ai-video-evidence'
MAX_RECORD_BYTES=32768
readonly -a CATEGORIES=(authorization request route-decision input-rights provider-evidence outcome quarantine integrity release)

fail() { printf 'BLOCKED|private-evidence|%s\n' "$1" >&2; exit 2; }
usage() {
  printf '%s\n' 'Usage: scripts/ai-video-private-evidence.sh PACKAGE_ID CATEGORY /tmp/record-name.record' >&2
}
allowed_category() {
  local item
  for item in "${CATEGORIES[@]}"; do [[ "$item" == "$1" ]] && return 0; done
  return 1
}
private_root() {
  # Test fixtures may copy this file and replace the literal DEFAULT_ROOT with
  # a private /tmp path. Production never reads a caller-selected root.
  if [[ "$DEFAULT_ROOT" == /var/lib/* ]]; then
    [[ "$(id -u)" -eq 0 ]] || fail 'root-required-for-default-root'
  else
    [[ "$DEFAULT_ROOT" == /tmp/* && "$DEFAULT_ROOT" != /tmp && "$DEFAULT_ROOT" != /tmp/ ]] || fail 'compiled-root-unsafe'
  fi
  printf '%s\n' "$DEFAULT_ROOT"
}

[[ $# -eq 3 ]] || { usage; exit 2; }
package_id="$1"
category="$2"
source_record="$3"
[[ "$package_id" =~ ^AST-[A-Z0-9][A-Z0-9-]{3,79}$ ]] || fail 'invalid-package-id'
allowed_category "$category" || fail 'invalid-category'
[[ "$source_record" =~ ^/tmp/[a-z0-9][a-z0-9._-]{0,63}\.record$ ]] || fail 'invalid-source-name'
[[ -f "$source_record" && ! -L "$source_record" ]] || fail 'source-must-be-regular-file'
[[ "$(realpath -e -- "$(dirname -- "$source_record")")" == /tmp ]] || fail 'source-must-be-direct-tmp-file'
record_bytes="$(wc -c < "$source_record")"
[[ "$record_bytes" =~ ^[0-9]+$ && "$record_bytes" -gt 0 && "$record_bytes" -le "$MAX_RECORD_BYTES" ]] || fail 'record-size-invalid'
LC_ALL=C grep -Eiq '(^|[^[:alpha:]])(authorization:|bearer[[:space:]]|api[_-]?key|signed[_-]?(url|uri)|-----BEGIN)' "$source_record" && fail 'record-contains-sensitive-marker'

root="$(private_root)"
package_dir="$root/$package_id"
category_dir="$package_dir/$category"
destination="$category_dir/$(basename -- "$source_record")"
umask 077
if [[ ! -d "$root" ]]; then mkdir -p -- "$root" || fail 'private-root-unavailable'; fi
[[ -d "$root" && ! -L "$root" ]] || fail 'private-root-unsafe'
chmod 700 -- "$root" || fail 'private-root-permissions-unsettable'
if [[ -e "$package_dir" ]]; then [[ -d "$package_dir" && ! -L "$package_dir" ]] || fail 'package-path-unsafe'; else mkdir -- "$package_dir" || fail 'package-create-failed'; fi
chmod 700 -- "$package_dir" || fail 'package-permissions-unsettable'
if [[ -e "$category_dir" ]]; then [[ -d "$category_dir" && ! -L "$category_dir" ]] || fail 'category-path-unsafe'; else mkdir -- "$category_dir" || fail 'category-create-failed'; fi
chmod 700 -- "$category_dir" || fail 'category-permissions-unsettable'
[[ ! -e "$destination" && ! -L "$destination" ]] || fail 'record-already-exists'
set -C
: > "$destination" || fail 'record-create-failed'
cat -- "$source_record" >> "$destination" || fail 'record-copy-failed'
chmod 600 -- "$destination" || fail 'record-permissions-unsettable'
printf 'PASS|private-evidence|recorded\n'
