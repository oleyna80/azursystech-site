#!/usr/bin/env bash
set -euo pipefail
SOURCE_ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
FIXTURE="$(mktemp -d)"
trap 'rm -rf "$FIXTURE"' EXIT
git init -q -b main "$FIXTURE"
git -C "$FIXTURE" config user.email fixture@example.invalid
git -C "$FIXTURE" config user.name fixture
mkdir -p "$FIXTURE/.agent/hooks" "$FIXTURE/.codex/scripts" "$FIXTURE/scripts" "$FIXTURE/src" "$FIXTURE/docs/reports"
cp "$SOURCE_ROOT/.agent/hooks/git_transition_policy.py" "$SOURCE_ROOT/.agent/hooks/hard_stop_policy.py" "$FIXTURE/.agent/hooks/"
cp "$SOURCE_ROOT/.codex/scripts/lifecycle.py" "$FIXTURE/.codex/scripts/"
cp "$SOURCE_ROOT/scripts/subagent_topology.py" "$FIXTURE/scripts/"
cp "$SOURCE_ROOT/.agent/active-work-block.default.json" "$FIXTURE/.agent/"
printf 'baseline\n' > "$FIXTURE/readme.txt"
git -C "$FIXTURE" add readme.txt .agent/active-work-block.default.json
git -C "$FIXTURE" commit -q -m baseline
git -C "$FIXTURE" switch -q -c fixture-subject
git -C "$FIXTURE" remote add origin fixture-origin
git -C "$FIXTURE" update-ref refs/remotes/origin/main "$(git -C "$FIXTURE" rev-parse main)"
git -C "$FIXTURE" symbolic-ref refs/remotes/origin/HEAD refs/remotes/origin/main
POLICY="$FIXTURE/.agent/hooks/git_transition_policy.py"
write_state() {
  python3 - "$FIXTURE" "$1" <<'PY'
import json, pathlib, sys
root=pathlib.Path(sys.argv[1]); mode=sys.argv[2]
value=json.loads((root/'.agent/active-work-block.default.json').read_text())
value['lifecycle_note']='fixture state'
value['closeout_mode']='success-closeout'
if mode in ('active','blocked','malformed'):
    value['work_block_id']='WB-036'
    value['subject_branch']='fixture-subject'
    value['specification']={'path':'docs/specs/WB-036.md','revision':'v1'}
    value['base_commit']='fixture-base'
    value['write_set']=['src/allowed.txt']
    value['write_gate']={'status':'READY','opened_at':'2026-09-24T00:00:00Z'}
    value['critic']={'required':True,'status':'READY','verdict':'SUPPLEMENT'}
if mode == 'blocked':
    import sys
    sys.path.insert(0,str(root/'.codex/scripts'))
    from lifecycle import candidate_content_identity
    value['write_gate']={'status':'BLOCKED','opened_at':None}
    value['frozen_revision']=candidate_content_identity(root,value['write_set'])
if mode == 'malformed':
    value['subject_branch']='wrong'
(root/'.agent/active-work-block.json').write_text(json.dumps(value)+'\n')
PY
}
expect() {
  local name="$1" expected="$2"; shift 2
  if "$@" >/dev/null 2>&1; then
    [ "$expected" = allow ] || { echo "FAIL $name: unexpected allow" >&2; exit 1; }
  else
    [ "$expected" = deny ] || { echo "FAIL $name: unexpected deny" >&2; exit 1; }
  fi
  echo "PASS $name"
}
write_state active
printf 'candidate\n' > "$FIXTURE/src/allowed.txt"
git -C "$FIXTURE" add .agent/active-work-block.json src/allowed.txt
expect active-scope allow python3 "$POLICY" pre-commit
expect configured-default-normalized allow python3 - "$POLICY" "$FIXTURE" <<'PY'
import importlib.util, pathlib, sys
path=pathlib.Path(sys.argv[1]); root=pathlib.Path(sys.argv[2])
sys.path.insert(0,str(path.parent))
spec=importlib.util.spec_from_file_location('git_transition_policy',path)
policy=importlib.util.module_from_spec(spec); spec.loader.exec_module(policy)
assert policy.default_branch(root)=='main'
PY
git -C "$FIXTURE" symbolic-ref HEAD refs/heads/main
python3 - "$FIXTURE/.agent/active-work-block.json" <<'PY'
import json, pathlib, sys
path=pathlib.Path(sys.argv[1]); value=json.loads(path.read_text())
value['subject_branch']='main'; path.write_text(json.dumps(value)+'\n')
PY
git -C "$FIXTURE" add .agent/active-work-block.json
expect configured-default-commit deny python3 "$POLICY" pre-commit
git -C "$FIXTURE" symbolic-ref HEAD refs/heads/fixture-subject
write_state active
git -C "$FIXTURE" add .agent/active-work-block.json
expect configured-subject-commit allow python3 "$POLICY" pre-commit
git -C "$FIXTURE" restore --staged .agent/active-work-block.json
expect unstaged-active-gate deny python3 "$POLICY" pre-commit
git -C "$FIXTURE" add .agent/active-work-block.json
python3 - "$FIXTURE/.agent/active-work-block.json" <<'PY'
import json, pathlib, sys
path=pathlib.Path(sys.argv[1]); value=json.loads(path.read_text())
value['critic']['status']='PENDING'; path.write_text(json.dumps(value)+'\n')
PY
git -C "$FIXTURE" add .agent/active-work-block.json
expect missing-critic deny python3 "$POLICY" pre-commit
python3 - "$FIXTURE/.agent/active-work-block.json" <<'PY'
import json, pathlib, sys
path=pathlib.Path(sys.argv[1]); value=json.loads(path.read_text())
value['critic']={'required':True,'status':'SKIPPED','verdict':'SKIPPED','skip_reason':'explicit fixture exception'}
path.write_text(json.dumps(value)+'\n')
PY
git -C "$FIXTURE" add .agent/active-work-block.json
expect reasoned-critic-skip allow python3 "$POLICY" pre-commit
python3 - "$FIXTURE/.agent/active-work-block.json" <<'PY'
import json, pathlib, sys
path=pathlib.Path(sys.argv[1]); value=json.loads(path.read_text())
value['critic']['skip_reason']=''; path.write_text(json.dumps(value)+'\n')
PY
git -C "$FIXTURE" add .agent/active-work-block.json
expect unreasoned-critic-skip deny python3 "$POLICY" pre-commit
write_state active
git -C "$FIXTURE" add .agent/active-work-block.json
expect shared-inspection-exit-precommit deny python3 - "$POLICY" pre-commit <<'PY'
import importlib.util, pathlib, sys
from unittest.mock import patch
path=pathlib.Path(sys.argv[1]); event=sys.argv[2]
sys.path.insert(0,str(path.parent))
spec=importlib.util.spec_from_file_location('git_transition_policy',path)
policy=importlib.util.module_from_spec(spec); spec.loader.exec_module(policy)
sys.argv=[str(path),event]
with patch.object(policy,'default_branch',side_effect=SystemExit(0)):
    raise SystemExit(policy.main())
PY
printf 'outside\n' > "$FIXTURE/outside.txt"
git -C "$FIXTURE" add outside.txt
expect outside-scope deny python3 "$POLICY" pre-commit
git -C "$FIXTURE" restore --staged outside.txt
printf 'secret\n' > "$FIXTURE/.env.local"
git -C "$FIXTURE" add -f .env.local
expect prohibited-path deny python3 "$POLICY" pre-commit
git -C "$FIXTURE" restore --staged .env.local
printf 'secret\n' > "$FIXTURE/docs/reports/.env.local"
git -C "$FIXTURE" add -f docs/reports/.env.local
expect nested-secret-in-approved-scope deny python3 "$POLICY" pre-commit
git -C "$FIXTURE" restore --staged docs/reports/.env.local
for secret in .env.production .env.vps; do
  printf 'secret\n' > "$FIXTURE/docs/reports/$secret"
  git -C "$FIXTURE" add -f "docs/reports/$secret"
  expect "nested-$secret-in-approved-scope" deny python3 "$POLICY" pre-commit
  git -C "$FIXTURE" restore --staged "docs/reports/$secret"
done
printf 'placeholder\n' > "$FIXTURE/docs/reports/.env.vps.example"
git -C "$FIXTURE" add -f docs/reports/.env.vps.example
expect documented-env-example allow python3 "$POLICY" pre-commit
git -C "$FIXTURE" restore --staged docs/reports/.env.vps.example
mkdir -p "$FIXTURE/docs/reports/node_modules"
printf 'dependency\n' > "$FIXTURE/docs/reports/node_modules/file.txt"
git -C "$FIXTURE" add -f docs/reports/node_modules/file.txt
expect nested-dependency-in-approved-scope deny python3 "$POLICY" pre-commit
git -C "$FIXTURE" restore --staged docs/reports/node_modules/file.txt
write_state malformed
git -C "$FIXTURE" add .agent/active-work-block.json
expect wrong-branch deny python3 "$POLICY" pre-commit
write_state blocked
git -C "$FIXTURE" add .agent/active-work-block.json
git -C "$FIXTURE" restore --staged src/allowed.txt
expect omitted-frozen-source deny python3 "$POLICY" pre-commit
git -C "$FIXTURE" add src/allowed.txt
expect frozen-candidate allow python3 "$POLICY" pre-commit
printf 'rework\n' > "$FIXTURE/src/allowed.txt"
expect stale-frozen-candidate deny python3 "$POLICY" pre-commit
git -C "$FIXTURE" restore --staged src/allowed.txt
expect stale-frozen-coordination-only deny python3 "$POLICY" pre-commit
write_state inactive
git -C "$FIXTURE" add .agent/active-work-block.json
expect inactive-coordination allow python3 "$POLICY" pre-commit
cp "$SOURCE_ROOT/.agent/active-work-block.default.json" "$FIXTURE/.agent/active-work-block.json"
git -C "$FIXTURE" add .agent/active-work-block.json
expect default-inactive-coordination allow python3 "$POLICY" pre-commit
write_state inactive
git -C "$FIXTURE" add .agent/active-work-block.json
printf 'other\n' > "$FIXTURE/src/allowed.txt"
git -C "$FIXTURE" add src/allowed.txt
expect inactive-source deny python3 "$POLICY" pre-commit
git -C "$FIXTURE" restore --staged src/allowed.txt
printf 'review\n' > "$FIXTURE/docs/reports/evidence.md"
git -C "$FIXTURE" add docs/reports/evidence.md
expect inactive-report allow python3 "$POLICY" pre-commit
write_state active
git -C "$FIXTURE" add .agent/active-work-block.json
HEAD_OID="$(git -C "$FIXTURE" rev-parse HEAD)"
ZERO=0000000000000000000000000000000000000000
push_event() { printf '%s %s %s %s\n' "$1" "$HEAD_OID" "$2" "$3" | python3 "$POLICY" pre-push "$4" fixture-origin; }
expect unassured-push deny push_event HEAD refs/heads/fixture-subject "$ZERO" origin
expect shared-inspection-exit-prepush deny python3 - "$POLICY" "$HEAD_OID" <<'PY'
import importlib.util, io, pathlib, sys
from unittest.mock import patch
path=pathlib.Path(sys.argv[1]); oid=sys.argv[2]
sys.path.insert(0,str(path.parent))
spec=importlib.util.spec_from_file_location('git_transition_policy',path)
policy=importlib.util.module_from_spec(spec); spec.loader.exec_module(policy)
sys.argv=[str(path),'pre-push','origin','fixture-origin']
sys.stdin=io.TextIOWrapper(io.BytesIO(f'HEAD {oid} refs/heads/fixture-subject {"0" * len(oid)}\n'.encode()))
with patch.object(policy,'autonomous_subject_push_allowed',side_effect=SystemExit(0)):
    raise SystemExit(policy.main())
PY
expect wrong-remote deny push_event HEAD refs/heads/fixture-subject "$ZERO" other
expect wrong-ref deny push_event HEAD refs/heads/main "$ZERO" origin
expect non-fast-forward deny push_event HEAD refs/heads/fixture-subject 1111111111111111111111111111111111111111 origin
expect wrong-url deny sh -c "printf 'HEAD $HEAD_OID refs/heads/fixture-subject $ZERO\\n' | python3 '$POLICY' pre-push origin other-url"
expect extra-update deny sh -c "printf 'HEAD $HEAD_OID refs/heads/fixture-subject $ZERO\\nHEAD $HEAD_OID refs/heads/main $ZERO\\n' | python3 '$POLICY' pre-push origin fixture-origin"
echo 'All Git transition fixtures passed.'
