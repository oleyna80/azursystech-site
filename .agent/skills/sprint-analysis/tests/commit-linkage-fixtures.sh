#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../../.." && pwd)"
EXTRACTOR="$ROOT/.agent/skills/sprint-analysis/scripts/extract.sh"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

git config --global user.email >/dev/null 2>&1 || git config --global user.email fixture@example.invalid
git config --global user.name >/dev/null 2>&1 || git config --global user.name fixture

new_repo() {
  local name="$1"
  local repo="$TMP/$name"
  mkdir -p "$repo/memory_bank"
  git -C "$repo" init -q
  git -C "$repo" config core.hooksPath /dev/null
  printf '| 2026-09-06 | WB-2026-09-06-fixtures | implementation: done | fixture |\n' > "$repo/memory_bank/orchestrator-log.md"
  printf 'fixture\n' > "$repo/file.txt"
  git -C "$repo" add .
  GIT_AUTHOR_DATE='2026-09-06T09:00:00+0000' GIT_COMMITTER_DATE='2026-09-06T09:00:00+0000' git -C "$repo" commit -q -m 'chore: fixture baseline'
  printf '%s\n' "$repo"
}

commit_case() {
  local repo="$1" subject="$2" body="${3:-}"
  printf '%s\n' "$subject" > "$repo/file.txt"
  git -C "$repo" add file.txt
  if [ -n "$body" ]; then
    GIT_AUTHOR_DATE='2026-09-06T12:00:00+0000' GIT_COMMITTER_DATE='2026-09-06T12:00:00+0000' \
      git -C "$repo" commit -q -m "$subject" -m "$body"
  else
    GIT_AUTHOR_DATE='2026-09-06T12:00:00+0000' GIT_COMMITTER_DATE='2026-09-06T12:00:00+0000' \
      git -C "$repo" commit -q -m "$subject"
  fi
}

assert_class() {
  local output="$1" class="$2" subject="$3"
  grep -F "${class}|" <<< "$output" | grep -F "|$subject|" >/dev/null || {
    printf 'fixture failed: expected %s for %s\n%s\n' "$class" "$subject" "$output" >&2
    exit 1
  }
}

repo="$(new_repo classifications)"
commit_case "$repo" 'case valid trailer' $'Work-Block: WB-2026-09-06-valid\n\nBody'
commit_case "$repo" 'case legacy subject WB-2026-09-06-legacy'
commit_case "$repo" 'case legacy body' $'Historical reference WB-2026-09-06-legacy-body'
commit_case "$repo" 'case missing'
commit_case "$repo" 'case malformed' $'Work-Block: WB-not-canonical'
commit_case "$repo" 'case multiple' $'Work-Block: WB-2026-09-06-one\nWork-Block: WB-2026-09-06-two'
commit_case "$repo" 'case valid wins WB-2026-09-06-wrong-subject' $'Work-Block: WB-2026-09-06-canonical'
commit_case "$repo" 'case ordinary phrase' $'The Work-Block: WB-not-a-trailer phrase is prose.'
output="$(cd "$repo" && bash "$EXTRACTOR" 2026-09-06 2026-09-06)"
assert_class "$output" trailer 'case valid wins WB-2026-09-06-wrong-subject'
assert_class "$output" trailer 'case valid trailer'
assert_class "$output" legacy 'case legacy subject WB-2026-09-06-legacy'
assert_class "$output" legacy 'case legacy body'
assert_class "$output" missing 'case missing'
assert_class "$output" malformed-trailer 'case malformed'
assert_class "$output" multiple-valid-trailers 'case multiple'
assert_class "$output" missing 'case ordinary phrase'
grep -F 'id=WB-2026-09-06-canonical' <<< "$output" >/dev/null

repo="$(new_repo states)"
output="$(cd "$repo" && bash "$EXTRACTOR" 2026-09-06 2026-09-06)"
grep -F 'status=clean' <<< "$output" >/dev/null
grep -F 'evidence_caveat=upstream-unverified' <<< "$output" >/dev/null
printf 'dirty\n' >> "$repo/file.txt"
output="$(cd "$repo" && bash "$EXTRACTOR" 2026-09-06 2026-09-06)"
grep -F 'status=dirty' <<< "$output" >/dev/null
grep -F 'evidence_caveat=repository-state-caveat' <<< "$output" >/dev/null

printf 'PASS: 14 deterministic linkage/state vocabulary checks\n'
