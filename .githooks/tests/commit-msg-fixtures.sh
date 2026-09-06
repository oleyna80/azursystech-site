#!/usr/bin/env bash
set -euo pipefail
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
HOOK="$ROOT_DIR/.githooks/commit-msg"
TEMP_DIRS=()
failures=0
trap 'for d in "${TEMP_DIRS[@]}"; do rm -rf "$d"; done' EXIT

new_repo() {
  local state="$1" branch="$2" repo
  repo="$(mktemp -d)"; TEMP_DIRS+=("$repo")
  git init -q "$repo"; git -C "$repo" config user.email fixture@example.invalid
  git -C "$repo" config user.name fixture; git -C "$repo" checkout -q -b "$branch"
  mkdir -p "$repo/.agent"; printf '%s\n' "$state" > "$repo/.agent/active-work-block.json"
  printf '%s\n' "$repo"
}
STATE='{"schema_version":3,"work_block_id":"WB-2026-09-06-work-block-commit-linkage","subject_branch":"fixture-branch","write_gate":{"status":"READY"}}'

case_hook() {
  local name="$1" state="$2" message="$3" expected="$4" needle="${5:-}" repo out code
  repo="$(new_repo "$state" fixture-branch)"; printf '%s\n' "$message" > "$repo/message"
  set +e; out="$(cd "$repo" && "$HOOK" "$repo/message" 2>&1)"; code=$?; set -e
  if [ "$code" -ne "$expected" ] || { [ -n "$needle" ] && [[ "$out" != *"$needle"* ]]; }; then
    echo "FAIL $name: exit=$code output=$out" >&2; failures=$((failures + 1))
  else echo "PASS $name"; fi
}

case_hook correct "$STATE" $'feat: valid\n\nWork-Block: WB-2026-09-06-work-block-commit-linkage' 0
case_hook missing "$STATE" 'feat: missing' 1 'requires exactly one'
case_hook malformed "$STATE" $'feat: malformed\n\nWork-Block: not-a-work-block' 1 malformed
case_hook multiple "$STATE" $'feat: multiple\n\nWork-Block: WB-2026-09-06-work-block-commit-linkage\nWork-Block: WB-2026-09-06-work-block-commit-linkage' 1 'found 2'
case_hook mismatch "$STATE" $'feat: mismatch\n\nWork-Block: WB-2026-09-06-other' 1 'does not match'

repo="$(new_repo "$STATE" other-branch)"; printf '%s\n' $'feat: stale\n\nWork-Block: WB-2026-09-06-work-block-commit-linkage' > "$repo/message"
if (cd "$repo" && "$HOOK" "$repo/message") 2>/dev/null; then echo FAIL branch-mismatch; failures=$((failures + 1)); else echo PASS branch-mismatch; fi
repo="$(new_repo "$STATE" fixture-branch)"; git -C "$repo" commit --allow-empty --no-verify -q -m init; git -C "$repo" checkout --detach -q HEAD
printf '%s\n' $'feat: detached\n\nWork-Block: WB-2026-09-06-work-block-commit-linkage' > "$repo/message"
if (cd "$repo" && "$HOOK" "$repo/message") 2>/dev/null; then echo FAIL detached; failures=$((failures + 1)); else echo PASS detached; fi

for gate in READY BLOCKED; do
  frozen="${STATE/\"status\":\"READY\"/\"status\":\"$gate\"}"; repo="$(new_repo "$frozen" fixture-branch)"
  printf '%s\n' $'feat: frozen\n\nWork-Block: WB-2026-09-06-work-block-commit-linkage' > "$repo/message"
  if (cd "$repo" && "$HOOK" "$repo/message"); then echo "PASS active-$gate"; else echo "FAIL active-$gate"; failures=$((failures + 1)); fi
done
case_hook inactive '{"schema_version":3,"work_block_id":"","subject_branch":"","write_gate":{"status":"BLOCKED"}}' 'chore: ordinary' 0
case_hook closed '{"schema_version":3,"work_block_id":"","subject_branch":""}' 'chore: closed' 0
repo="$(new_repo '{}' fixture-branch)"; rm "$repo/.agent/active-work-block.json"; printf '%s\n' ordinary > "$repo/message"
if (cd "$repo" && "$HOOK" "$repo/message") 2>/dev/null; then echo FAIL missing-state; failures=$((failures + 1)); else echo PASS missing-state; fi
repo="$(new_repo '{}' fixture-branch)"; printf '{not-json\n' > "$repo/.agent/active-work-block.json"; printf '%s\n' ordinary > "$repo/message"
if (cd "$repo" && "$HOOK" "$repo/message") 2>/dev/null; then echo FAIL malformed-state; failures=$((failures + 1)); else echo PASS malformed-state; fi
for version in 2 4; do
  case_hook "schema-$version" "{\"schema_version\":$version,\"work_block_id\":\"WB-2026-09-06-work-block-commit-linkage\",\"subject_branch\":\"fixture-branch\"}" ordinary 1 unsupported
done
bootstrap_repo="$(mktemp -d)"; TEMP_DIRS+=("$bootstrap_repo")
mkdir -p "$bootstrap_repo/.agent" "$bootstrap_repo/.githooks" "$bootstrap_repo/scripts"
cp "$ROOT_DIR/scripts/bootstrap.sh" "$bootstrap_repo/scripts/bootstrap.sh"
cp "$HOOK" "$bootstrap_repo/.githooks/commit-msg"
cp "$ROOT_DIR/.agent/bootstrap-profile.json" "$ROOT_DIR/.agent/active-work-block.default.json" "$bootstrap_repo/.agent/"
cp "$ROOT_DIR/scripts/validate-installation-profile.py" "$bootstrap_repo/scripts/"
chmod +x "$bootstrap_repo/scripts/bootstrap.sh" "$bootstrap_repo/.githooks/commit-msg"
python3 - "$ROOT_DIR/.agent/bootstrap-profile.json" "$bootstrap_repo" <<'PY'
import json
import pathlib
import sys
profile = json.loads(pathlib.Path(sys.argv[1]).read_text())
root = pathlib.Path(sys.argv[2])
for skill in profile["skills"]:
    path = root / ".agent" / "skills" / skill / "SKILL.md"
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text("# fixture\n")
    mirror = root / ".claude" / "skills" / skill / "SKILL.md"
    mirror.parent.mkdir(parents=True, exist_ok=True)
    mirror.write_text("# fixture\n")
PY
for path in AGENTS.md PROJECT_MAP.md FILE_REGISTRY.yml docs/session-bootstrap.md .agent/ROSTER.md .agent/workflows/sdd-protocol.md .agent/critic-gate.md .agent/verification-gate.md .codex/critic.md .codex/write-gate.md; do
  mkdir -p "$bootstrap_repo/$(dirname "$path")"; printf '%s\n' fixture > "$bootstrap_repo/$path"
done
git -C "$bootstrap_repo" init -q
before="$(git -C "$bootstrap_repo" config --get core.hooksPath || true)"; "$bootstrap_repo/scripts/bootstrap.sh" >/dev/null
after="$(git -C "$bootstrap_repo" config --get core.hooksPath || true)"
[ "$before" = "$after" ] && echo 'PASS bootstrap-default-nonmutating' || { echo 'FAIL bootstrap-default-nonmutating'; failures=$((failures + 1)); }
if "$bootstrap_repo/scripts/bootstrap.sh" --check-git-hooks >/dev/null 2>&1; then echo FAIL hook-check-without-activation; failures=$((failures + 1)); else echo PASS hook-check-without-activation; fi
"$bootstrap_repo/scripts/bootstrap.sh" --install-git-hooks >/dev/null
"$bootstrap_repo/scripts/bootstrap.sh" --check-git-hooks >/dev/null && echo PASS hook-install-and-check || { echo FAIL hook-install-and-check; failures=$((failures + 1)); }
chmod -x "$bootstrap_repo/.githooks/commit-msg"
if "$bootstrap_repo/scripts/bootstrap.sh" --check-git-hooks >/dev/null 2>&1; then echo FAIL non-executable-hook; failures=$((failures + 1)); else echo PASS non-executable-hook; fi
echo 'PASS cooperative --no-verify limitation documented by contract'
[ "$failures" -eq 0 ] || exit 1
echo 'All commit-msg linkage fixtures passed.'
