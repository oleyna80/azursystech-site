#!/usr/bin/env bash
# WB-039 hook wiring fixtures.
#
# Every configured hook entrypoint (PreToolUse, PostToolUse, Stop) must resolve
# from the stable project root after the session cwd changes, and an
# unresolvable entrypoint must report a wiring failure distinct from a policy
# denial.
set -uo pipefail

FIXTURE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(cd "$FIXTURE_DIR/../../.." && pwd)"
NESTED="$ROOT/web"
SETTINGS="$ROOT/.claude/settings.json"
MARKER="[hook-wiring-failure]"
EVENT="{\"cwd\": \"$ROOT\"}"
PASS=0
FAIL=0

pass() { PASS=$((PASS + 1)); printf 'PASS  %s\n' "$1"; }
fail() { FAIL=$((FAIL + 1)); printf 'FAIL  %s\n' "$1"; }

mapfile -t COMMANDS < <(python3 - "$SETTINGS" <<'PY'
import json
import sys

data = json.load(open(sys.argv[1], encoding="utf-8"))
for entries in data["hooks"].values():
    for entry in entries:
        for hook in entry["hooks"]:
            print(hook["command"])
PY
)

if [ "${#COMMANDS[@]}" -ne 4 ]; then
  fail "expected 4 configured hook commands, found ${#COMMANDS[@]}"
fi

run_from_nested() {
  local command="$1"
  (cd "$NESTED" && CLAUDE_PROJECT_DIR="$ROOT" bash -c "$command" <<<"$EVENT") 2>&1
}

for index in "${!COMMANDS[@]}"; do
  command="${COMMANDS[$index]}"

  if [[ "$command" == *CLAUDE_PROJECT_DIR* ]]; then
    pass "hook $index binds to the stable project root"
  else
    fail "hook $index does not bind to the stable project root"
  fi

  output="$(run_from_nested "$command")"
  if [[ "$output" != *"$MARKER"* ]]; then
    pass "hook $index resolves from a nested cwd"
  else
    fail "hook $index failed to resolve from a nested cwd: $output"
  fi
done

broken="${COMMANDS[0]//hard_stop_policy.py/absent_policy.py}"
output="$(run_from_nested "$broken")"
status=$?
if [ "$status" -eq 2 ] && [[ "$output" == *"$MARKER"* ]] && [[ "$output" != *permissionDecision* ]]; then
  pass "unresolvable entrypoint is reported as a wiring failure"
else
  fail "unresolvable entrypoint status=$status output=$output"
fi

printf '\nPASS=%s FAIL=%s\n' "$PASS" "$FAIL"
[ "$FAIL" -eq 0 ]
