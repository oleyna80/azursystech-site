#!/usr/bin/env bash
# Fixture payload tests for .claude/hooks/hard-stop.sh.
# Pipes JSON PreToolUse payloads into the hook and asserts ALLOW/DENY.
# Run from repo root: bash .claude/hooks/tests/hard-stop-fixtures.sh
set -u
cd "$(dirname "$0")/../../.."
fail=0
nl=$'\n'

run_case() {
  local desc="$1" cmd="$2" expect="$3"
  local out verdict
  out=$(jq -n --arg c "$cmd" '{tool_input:{command:$c}}' | bash .claude/hooks/hard-stop.sh)
  if [ -z "$out" ]; then verdict=ALLOW; else verdict=DENY; fi
  if [ "$verdict" = "$expect" ]; then
    echo "PASS [$expect] $desc"
  else
    echo "FAIL [want $expect, got $verdict] $desc :: $cmd"
    fail=1
  fi
}

echo "--- destructive git: must DENY ---"
run_case "checkout -- ."             'git checkout -- .' DENY
run_case "checkout ."                'git checkout .' DENY
run_case "checkout ./"               'git checkout ./' DENY
run_case "checkout HEAD -- ."        'git checkout HEAD -- .' DENY
run_case "restore ."                 'git restore .' DENY
run_case "restore --worktree ."      'git restore --worktree .' DENY
run_case "restore -W ."              'git restore -W .' DENY
run_case "restore --staged . (accepted strictness)" 'git restore --staged .' DENY
run_case "checkout -- . && ls"       'git checkout -- . && ls' DENY
run_case "git -C /tmp checkout -- ." 'git -C /tmp checkout -- .' DENY
run_case "reset --hard"              'git reset --hard HEAD~1' DENY
run_case "push --force"              'git push --force origin main' DENY
run_case "clean -fd"                 'git clean -fd' DENY
run_case "clean -xdf"                'git clean -xdf' DENY
run_case "clean -f"                  'git clean -f' DENY
run_case "git --git-dir=.git checkout -- ." 'git --git-dir=.git checkout -- .' DENY
run_case "git --work-tree /x restore ."     'git --work-tree /x restore .' DENY

echo "--- destructive git: must ALLOW ---"
run_case "checkout -- dotfile path"  'git checkout -- .agent/verification-gate.md' ALLOW
run_case "restore dotfile path"      'git restore .agent/verification-gate.md' ALLOW
run_case "restore src file"          'git restore web/src/lib/intake/runtime.ts' ALLOW
run_case "restore two files"         'git restore a.txt b.txt' ALLOW
run_case "checkout branch"           'git checkout main' ALLOW
run_case "checkout -b branch"        'git checkout -b feat/x' ALLOW
run_case "checkout -- README.md"     'git checkout -- README.md' ALLOW
run_case "git add ."                 'git add .' ALLOW
run_case "git status"                'git status' ALLOW
run_case "git diff ."                'git diff .' ALLOW
run_case "push branch with -f in name" 'git push origin feat-fix' ALLOW
run_case "clean dry-run -n"          'git clean -n' ALLOW
run_case "push non-main (push-block scope)" 'git push origin dev' ALLOW
run_case "commit -F file"            'git commit -F /tmp/msg.txt' ALLOW

echo "--- origin main approval: exact target and owner required ---"
mkdir -p memory_bank
printf '| %s | push-approval | push: APPROVED origin main - fixture | Owner |\n' "$(date +%F)" > memory_bank/orchestrator-log.md
run_case "plain origin main with exact Owner approval" 'git push origin main' ALLOW
printf '| %s | push-approval | push: APPROVED origin dev - fixture | Owner |\n' "$(date +%F)" > memory_bank/orchestrator-log.md
run_case "wrong approval target" 'git push origin main' DENY
printf '| %s | push-approval | push: APPROVED origin main - fixture | Control Tower |\n' "$(date +%F)" > memory_bank/orchestrator-log.md
run_case "wrong approval actor" 'git push origin main' DENY

echo "--- multi-line: bypasses closed (DENY) ---"
run_case "echo then rm on next line" "echo done${nl}rm -rf ./build" DENY
run_case "echo then git reset --hard next line" "echo ok${nl}git reset --hard" DENY
run_case "commit -m quoted multi-line expansion" "git commit -m \"a${nl}\$(rm -rf /)\"" DENY
run_case "echo continuation then expansion" "echo foo \\${nl}\$(x)" DENY

echo "--- multi-line: false positives fixed (ALLOW) ---"
run_case "inline script: echo line then var=\$(jq)" "echo SYNTAX_OK${nl}out=\$(jq -n 1)${nl}echo \"ok\"" ALLOW
run_case "for-loop with \$(seq) after echo line" "echo start${nl}for i in \$(seq 3); do true; done" ALLOW
run_case "function body with \$() after echo" "run() {${nl}  local out${nl}  out=\$(date)${nl}}${nl}echo ready${nl}run" ALLOW

echo "--- expansion block: single-line regressions ---"
run_case "commit -m with \$()"        'git commit -m "$(rm -rf /)"' DENY
run_case "echo with backtick"        'echo `whoami`' DENY
run_case "echo plain"                'echo hello' ALLOW
run_case "commit -m plain"           'git commit -m "fix: typo"' ALLOW

exit $fail
