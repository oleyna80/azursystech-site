#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../../.." && pwd)"
EXTRACTOR="$ROOT/.agent/skills/sprint-analysis/scripts/extract.sh"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT
ASSERTIONS=0

expect_contains() {
  local haystack="$1" needle="$2"
  ASSERTIONS=$((ASSERTIONS + 1))
  if ! grep -F "$needle" <<< "$haystack" >/dev/null; then
    printf 'fixture failed (%s): expected %s\n%s\n' "$ASSERTIONS" "$needle" "$haystack" >&2
    exit 1
  fi
}

new_repo() {
  local name="$1"
  local repo="$TMP/$name"
  mkdir -p "$repo/memory_bank"
  git -C "$repo" init -q
  git -C "$repo" branch -M main
  git -C "$repo" config core.hooksPath /dev/null
  git -C "$repo" config user.email fixture@example.invalid
  git -C "$repo" config user.name fixture
  printf '| 2026-09-06 | WB-2026-09-06-fixtures | implementation: done | fixture |\n' > "$repo/memory_bank/orchestrator-log.md"
  printf 'fixture\n' > "$repo/file.txt"
  git -C "$repo" add .
  GIT_AUTHOR_DATE='2026-09-06T09:00:00+0000' GIT_COMMITTER_DATE='2026-09-06T09:00:00+0000' git -C "$repo" commit -q -m 'chore: fixture baseline'
  NEW_REPO="$repo"
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
  local line
  line="$(grep -F "|$subject|" <<< "$output" | tail -1 || true)"
  expect_contains "$line" "${class}|"
}

new_repo classifications
repo="$NEW_REPO"
commit_case "$repo" 'case valid trailer' $'Work-Block: WB-2026-09-06-valid\n\nBody'
commit_case "$repo" 'case legacy subject WB-2026-09-06-legacy'
commit_case "$repo" 'case legacy body' $'Historical reference WB-2026-09-06-legacy-body'
commit_case "$repo" 'case same-day heuristic WB-2026-09-06-other-wb'
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
assert_class "$output" legacy 'case same-day heuristic WB-2026-09-06-other-wb'
assert_class "$output" missing 'case missing'
assert_class "$output" malformed-trailer 'case malformed'
assert_class "$output" multiple-valid-trailers 'case multiple'
assert_class "$output" missing 'case ordinary phrase'
expect_contains "$output" 'id=WB-2026-09-06-canonical'

new_repo states
repo="$NEW_REPO"
bare="$TMP/origin.git"
git init --bare -q "$bare"
git -C "$repo" remote add origin "$bare"
git -C "$repo" push -q -u origin main
output="$(cd "$repo" && bash "$EXTRACTOR" 2026-09-06 2026-09-06)"
expect_contains "$output" 'status=clean'
expect_contains "$output" 'upstream=available'
expect_contains "$output" 'behind=0'
expect_contains "$output" 'ahead_unpushed=0'
expect_contains "$output" 'evidence_caveat=none'
expect_contains "$output" 'status_short_branch:'
expect_contains "$output" '## main...origin/main'

commit_case "$repo" 'case local ahead'
output="$(cd "$repo" && bash "$EXTRACTOR" 2026-09-06 2026-09-06)"
expect_contains "$output" 'behind=0'
expect_contains "$output" 'ahead_unpushed=1'
expect_contains "$output" 'evidence_caveat=repository-state-caveat'
expect_contains "$output" '[ahead 1]'

printf 'staged\n' >> "$repo/file.txt"
git -C "$repo" add file.txt
printf 'unstaged\n' >> "$repo/file.txt"
printf 'untracked\n' > "$repo/untracked.txt"
output="$(cd "$repo" && bash "$EXTRACTOR" 2026-09-06 2026-09-06)"
expect_contains "$output" 'status=dirty'
expect_contains "$output" 'staged=1'
expect_contains "$output" 'unstaged=1'
expect_contains "$output" 'untracked=1'
expect_contains "$output" 'MM file.txt'
expect_contains "$output" '?? untracked.txt'

skill_text="$(cat "$ROOT/.agent/skills/sprint-analysis/SKILL.md")"
workflow_text="$(cat "$ROOT/.github/workflows/control-plane-contracts.yml")"
expect_contains "$skill_text" 'UNVERIFIED'
expect_contains "$skill_text" 'DEGRADED'
expect_contains "$skill_text" 'BLOCKED'
expect_contains "$workflow_text" 'Run sprint-analysis evidence fixtures'
expect_contains "$workflow_text" 'bash .agent/skills/sprint-analysis/tests/commit-linkage-fixtures.sh'

printf 'PASS: %s deterministic sprint-analysis evidence fixture assertions\n' "$ASSERTIONS"
