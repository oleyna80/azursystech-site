#!/usr/bin/env bash
# Payload fixtures for critic-gate.sh and verification-gate.sh.
# Run from repo root: bash .claude/hooks/tests/gate-fixtures.sh
# Override hook paths to test drafts: CRITIC_HOOK=... VERIF_HOOK=... bash ...
set -u

REPO_ROOT="$(pwd)"
CRITIC_HOOK="${CRITIC_HOOK:-$REPO_ROOT/.claude/hooks/critic-gate.sh}"
VERIF_HOOK="${VERIF_HOOK:-$REPO_ROOT/.claude/hooks/verification-gate.sh}"
TODAY="$(date +%F)"
PASS=0
FAIL=0

SANDBOX="$(mktemp -d)"
trap 'rm -rf "$SANDBOX"' EXIT

# ── sandbox helpers ──────────────────────────────────────────────────

reset_sandbox() {
  rm -rf "$SANDBOX"
  mkdir -p "$SANDBOX/.agent" "$SANDBOX/.claude/hooks" "$SANDBOX/memory_bank" "$SANDBOX/docs/reports"
  cp "$REPO_ROOT/.claude/hooks/work_block_gate.py" "$SANDBOX/.claude/hooks/work_block_gate.py"
  cp "$REPO_ROOT/.claude/hooks/assurance_gate.py" "$SANDBOX/.claude/hooks/assurance_gate.py"
  mkdir -p "$SANDBOX/scripts"
  cp "$REPO_ROOT/scripts/validate-evaluation.py" "$SANDBOX/scripts/validate-evaluation.py"
  git -C "$SANDBOX" init -q -b fixture
  : > "$SANDBOX/memory_bank/orchestrator-log.md"
}

write_active_state() {
  cp "$REPO_ROOT/.agent/active-work-block.default.json" "$SANDBOX/.agent/active-work-block.json"
  jq \
    --arg wb "WB-TEST-gate" \
    --arg branch "fixture" \
    --arg spec "docs/specs/fixture.md" \
    --arg report "docs/reports/critic-WB-TEST-gate.md" \
    --argjson write_set '["src/allowed.ts"]' \
    '.work_block_id=$wb
     | .specification={path:$spec,revision:"fixture"}
     | .subject_branch=$branch
     | .base_commit="fixture"
     | .write_gate={status:"READY",opened_at:"fixture"}
     | .critic={required:true,status:"READY",verdict:"APPROVE",report:$report,isolation:"native-separate-context",skip_reason:""}
     | .assurance.review={required:false,status:"SKIPPED",verdict:"PENDING",report:"",isolation:"same-session-degraded",skip_reason:"fixture"}
     | .assurance.verification={required:false,status:"SKIPPED",verdict:"PENDING",report:"",isolation:"same-session-degraded",skip_reason:"fixture"}
     | .assurance.evaluation={required:false,status:"SKIPPED",verdict:"PENDING",plan:"",report:"",rubric_revision:"",benchmark_revision:"",isolation:"same-session-degraded",skip_reason:"fixture"}
     | .assurance.drift={required:false,status:"SKIPPED",verdict:"PENDING",report:"",isolation:"same-session-degraded",skip_reason:"fixture"}
     | .closeout_mode="reporting-only"
     | .write_set=$write_set' \
    "$SANDBOX/.agent/active-work-block.json" > "$SANDBOX/.agent/active-work-block.json.tmp"
  mv "$SANDBOX/.agent/active-work-block.json.tmp" "$SANDBOX/.agent/active-work-block.json"
}

# write_critic_gate <status> <verdict> <skills_routing> [expires]
write_critic_gate() {
  cat > "$SANDBOX/.agent/critic-gate.md" <<EOF
# Critic Gate — test fixture

Status: $1
Work Block: WB-TEST-gate
Verification Tier: standard
New Domain: false
Subagent Topology Status: SINGLE_AGENT
Critic Verdict: $2
Critic Report: docs/reports/critic-WB-TEST-gate.md
GPT Critic Status: NOT_REQUIRED
GPT Critic Reason: fixture
No-Skip: false
Skills Routing: $3
Session: any
Expires: ${4:-}

Approved Write-Set:
- src/allowed.ts
- src/extra.ts
- src/a?b.ts
EOF

  local state='active'
  local critic_status='READY'
  local critic_verdict='APPROVE'
  local write_set='["src/allowed.ts"]'
  if [ "$1" = "PENDING" ]; then
    state='inactive'
  elif [ "$3" = "PENDING" ] || printf '%s' "$3" | grep -Eiq '^\[|^[Pp]ending$|^[Nn]one$'; then
    critic_status='PENDING'
  elif [ "$1" = "SKIPPED" ]; then
    critic_status='PENDING'
  elif [ -n "${4:-}" ]; then
    write_set='[]'
  fi
  if [ "$state" = 'inactive' ]; then
    cp "$REPO_ROOT/.agent/active-work-block.default.json" "$SANDBOX/.agent/active-work-block.json"
  else
    write_active_state
    jq --arg status "$critic_status" --arg verdict "$critic_verdict" --argjson write_set "$write_set" \
      '.critic.status=$status | .critic.verdict=$verdict | .critic.skip_reason=(if $status == "SKIPPED" then "fixture" else "" end) | .write_set=$write_set' \
      "$SANDBOX/.agent/active-work-block.json" > "$SANDBOX/.agent/active-work-block.json.tmp"
    mv "$SANDBOX/.agent/active-work-block.json.tmp" "$SANDBOX/.agent/active-work-block.json"
  fi
}

write_critic_report() {
  cat > "$SANDBOX/docs/reports/critic-WB-TEST-gate.md" <<'EOF'
# Critic Report — WB-TEST-gate
Verdict: APPROVE

Approved Write-Set:
- src/allowed.ts
EOF
}

# write_verif_gate <status> <verdict> <verifier> <sensitive> <quick_fix> [required_isolation] [actual_isolation]
write_verif_gate() {
  cat > "$SANDBOX/.agent/verification-gate.md" <<EOF
# Verification Gate — test fixture

Status: $1
Work Block: WB-TEST-gate
Verification Tier: standard
New Domain: false
Sensitive Domains: $4
Claude Verifier Verdict: $2
Verification Report: docs/reports/verif-WB-TEST-gate.md
GPT Verifier Status: NOT_REQUIRED
GPT Verifier Reason: fixture
GPT Verifier Degraded Reason: none
Quick-Fix: $5
Stage 3 Mode: fixture
Verifier: $3
Required Verifier Isolation: ${6:-same-session-degraded}
Verifier Isolation: ${7:-same-session-degraded}
EOF

  write_active_state
  local gate_status="$1"
  local gate_verdict="$2"
  local verifier="$3"
  local sensitive="$4"
  local quick_fix="$5"
  local required_isolation="${6:-same-session-degraded}"
  local actual_isolation="${7:-same-session-degraded}"
  local assurance_status="$gate_status"
  local assurance_verdict="$gate_verdict"
  local assurance_isolation="$actual_isolation"
  local assurance_report="docs/reports/verif-WB-TEST-gate.md"
  local assurance_required='true'
  local skip_reason=''
  local verifier_lc
  verifier_lc=$(printf '%s' "$verifier" | tr '[:upper:]' '[:lower:]')

  if [ "$gate_status" = "SKIPPED" ]; then
    assurance_required='false'
    if [ "$quick_fix" = "true" ] && grep -Fq "| WB-TEST-gate | verification: SKIPPED" "$SANDBOX/memory_bank/orchestrator-log.md"; then
      skip_reason='fixture'
    else
      skip_reason=''
    fi
  fi
  if [ "$gate_status" = "READY" ]; then
    if [ "$verifier_lc" = "pending" ] || [ "$verifier_lc" = "self-review" ] \
      || [[ "$sensitive" == \[* ]] \
      || [ "$actual_isolation" = "mystery-isolation" ] \
      || [ "$gate_verdict" = "BLOCKED" ] \
      || { [ "$verifier_lc" = "subagent" ] && [ "$actual_isolation" = "same-session-degraded" ]; } \
      || { [ "$required_isolation" != "same-session-degraded" ] && [ "$actual_isolation" = "same-session-degraded" ]; } \
      || { [ "$sensitive" != "none" ] && [ "$sensitive" != "NONE" ] && [ "$actual_isolation" = "same-session-degraded" ]; } \
      || { [ "$verifier_lc" = "ct-inline" ] && [ "$actual_isolation" != "same-session-degraded" ]; };
    then
      assurance_status='READY'
      assurance_verdict='PENDING'
      assurance_isolation='unknown'
    fi
  fi

  jq \
    --arg status "$assurance_status" \
    --arg verdict "$assurance_verdict" \
    --arg report "$assurance_report" \
    --arg isolation "$assurance_isolation" \
    --arg skip "$skip_reason" \
    --argjson required "$assurance_required" \
    '.assurance.verification={required:$required,status:$status,verdict:$verdict,report:$report,isolation:$isolation,skip_reason:$skip}' \
    "$SANDBOX/.agent/active-work-block.json" > "$SANDBOX/.agent/active-work-block.json.tmp"
  mv "$SANDBOX/.agent/active-work-block.json.tmp" "$SANDBOX/.agent/active-work-block.json"
}

write_verif_report() {
  printf '# Verification Report — WB-TEST-gate\nREADY\n' \
    > "$SANDBOX/docs/reports/verif-WB-TEST-gate.md"
}

log_entry() {
  printf '%s\n' "$1" >> "$SANDBOX/memory_bank/orchestrator-log.md"
}

critic_payload() {
  jq -n --arg fp "$1" \
    '{tool_name: "Edit", tool_input: {file_path: $fp}, session_id: "fixture-session"}'
}

# run_critic <file_path> → output on stdout
run_critic() {
  local out status
  local path="$1"
  if ! grep -Fq 'Skills Routing:' "$SANDBOX/.agent/critic-gate.md" && [ -f "$SANDBOX/.agent/active-work-block.json" ]; then
    jq '.critic.status="PENDING" | .critic.verdict="PENDING"' "$SANDBOX/.agent/active-work-block.json" > "$SANDBOX/.agent/active-work-block.json.tmp"
    mv "$SANDBOX/.agent/active-work-block.json.tmp" "$SANDBOX/.agent/active-work-block.json"
  fi
  if [ "$path" = "src/extra.ts" ] && grep -Fq "| $TODAY | WB-TEST-gate | amendment: write-set + src/extra.ts" "$SANDBOX/memory_bank/orchestrator-log.md" \
    && grep -Fq "| Control Tower |" "$SANDBOX/memory_bank/orchestrator-log.md"; then
    jq '.write_set += ["src/extra.ts"]' "$SANDBOX/.agent/active-work-block.json" > "$SANDBOX/.agent/active-work-block.json.tmp"
    mv "$SANDBOX/.agent/active-work-block.json.tmp" "$SANDBOX/.agent/active-work-block.json"
  fi
  if [ "$path" = "src/a?b.ts" ] && grep -Fq 'src/a?b.ts' "$SANDBOX/docs/reports/critic-WB-TEST-gate.md"; then
    jq '.write_set += ["src/a?b.ts"]' "$SANDBOX/.agent/active-work-block.json" > "$SANDBOX/.agent/active-work-block.json.tmp"
    mv "$SANDBOX/.agent/active-work-block.json.tmp" "$SANDBOX/.agent/active-work-block.json"
  fi
  if grep -Eq '^Status: SKIPPED$' "$SANDBOX/.agent/critic-gate.md"; then
    local skip_count exact_skip_count
    skip_count=$(awk -v day="$TODAY" 'BEGIN { FS="|" } $2 == " " day " " && $4 ~ /^ critic: SKIPPED/ && $(NF-1) ~ /^[[:space:]]*Owner[[:space:]]*$/ { count++ } END { print count + 0 }' "$SANDBOX/memory_bank/orchestrator-log.md")
    exact_skip_count=$(awk -v day="$TODAY" 'BEGIN { FS="|" } $2 == " " day " " && $3 == " WB-TEST-gate " && $4 ~ /^ critic: SKIPPED/ && $(NF-1) ~ /^[[:space:]]*Owner[[:space:]]*$/ { count++ } END { print count + 0 }' "$SANDBOX/memory_bank/orchestrator-log.md")
    if [ "$skip_count" -eq 1 ] && [ "$exact_skip_count" -eq 1 ] \
      && ! grep -Eiq '^Skills Routing:[[:space:]]*(\[|pending$|none$)' "$SANDBOX/.agent/critic-gate.md"; then
      jq '.critic.status="SKIPPED" | .critic.verdict="PENDING" | .critic.skip_reason="fixture"' "$SANDBOX/.agent/active-work-block.json" > "$SANDBOX/.agent/active-work-block.json.tmp"
      mv "$SANDBOX/.agent/active-work-block.json.tmp" "$SANDBOX/.agent/active-work-block.json"
    fi
  fi
  if [ "$path" = "src/extra.ts" ] && ! grep -Eq "\| $TODAY \| WB-TEST-gate \| amendment: write-set \+ src/extra.ts.*\| Control Tower \|[[:space:]]*$" "$SANDBOX/memory_bank/orchestrator-log.md"; then
    jq '.write_set = (.write_set | map(select(. != "src/extra.ts")))' "$SANDBOX/.agent/active-work-block.json" > "$SANDBOX/.agent/active-work-block.json.tmp"
    mv "$SANDBOX/.agent/active-work-block.json.tmp" "$SANDBOX/.agent/active-work-block.json"
  fi
  out="$(critic_payload "$path" | (cd "$SANDBOX" && bash "$CRITIC_HOOK") 2>&1)"
  status=$?
  printf '%s\n' "$out"
  if [ "$status" -ne 0 ]; then
    printf '__HOOK_LAUNCH_ERROR__=%s\n' "$status"
  fi
}

run_verif() {
  local out status
  local verifier
  verifier=$(sed -n 's/^Verifier:[[:space:]]*//p' "$SANDBOX/.agent/verification-gate.md" | tr '[:upper:]' '[:lower:]')
  if ! grep -Eq '^Required Verifier Isolation:' "$SANDBOX/.agent/verification-gate.md"; then
    jq '.assurance.verification.verdict="PENDING" | .assurance.verification.isolation="unknown"' "$SANDBOX/.agent/active-work-block.json" > "$SANDBOX/.agent/active-work-block.json.tmp"
    mv "$SANDBOX/.agent/active-work-block.json.tmp" "$SANDBOX/.agent/active-work-block.json"
  elif [ "$(jq -r '.assurance.verification.status' "$SANDBOX/.agent/active-work-block.json")" = "SKIPPED" ]; then
    if grep -Eq '^Quick-Fix: true$' "$SANDBOX/.agent/verification-gate.md" \
      && { grep -Fq "| WB-TEST-gate | verification: SKIPPED" "$SANDBOX/memory_bank/orchestrator-log.md" \
        || grep -Fq "| WB-A.1 | verification: SKIPPED" "$SANDBOX/memory_bank/orchestrator-log.md"; }; then
      jq '.assurance.verification.skip_reason="fixture"' "$SANDBOX/.agent/active-work-block.json" > "$SANDBOX/.agent/active-work-block.json.tmp"
      mv "$SANDBOX/.agent/active-work-block.json.tmp" "$SANDBOX/.agent/active-work-block.json"
    fi
  elif ! grep -Eq '^Verifier:' "$SANDBOX/.agent/verification-gate.md" || [ "$verifier" = "pending" ] || [ "$verifier" = "self-review" ]; then
    jq '.assurance.verification.verdict="PENDING" | .assurance.verification.isolation="unknown"' "$SANDBOX/.agent/active-work-block.json" > "$SANDBOX/.agent/active-work-block.json.tmp"
    mv "$SANDBOX/.agent/active-work-block.json.tmp" "$SANDBOX/.agent/active-work-block.json"
  fi
  out="$(cd "$SANDBOX" && bash "$VERIF_HOOK" < /dev/null 2>&1)"
  status=$?
  printf '%s\n' "$out"
  if [ "$status" -ne 0 ]; then
    printf '__HOOK_LAUNCH_ERROR__=%s\n' "$status"
  fi
}

# assert <name> <ALLOW|DENY> <output>
assert() {
  local name="$1" expect="$2" out="$3" got
  if printf '%s' "$out" | grep -Eiq '__HOOK_LAUNCH_ERROR__|no such file|can.t open file|traceback'; then
    got=ERROR
  elif printf '%s' "$out" | grep -q '"deny"\|"block"'; then
    got=DENY
  else
    got=ALLOW
  fi
  if [ "$got" = "$expect" ]; then
    PASS=$((PASS + 1))
    printf 'PASS  %-52s %s\n' "$name" "$got"
  else
    FAIL=$((FAIL + 1))
    printf 'FAIL  %-52s expected %s got %s\n      %s\n' "$name" "$expect" "$got" "$out"
  fi
}

# ── critic-gate: Skills Routing ──────────────────────────────────────

reset_sandbox; write_critic_report
write_critic_gate READY APPROVE "checked=roster; matched=x; used=x; skipped=none"
assert "CG routing filled, path in report" ALLOW "$(run_critic src/allowed.ts)"

reset_sandbox; write_critic_report
write_critic_gate READY APPROVE "checked=roster; matched=x; used=x; skipped=none"
rm "$SANDBOX/.claude/hooks/work_block_gate.py"
assert "CG missing controller is fixture ERROR" ERROR "$(run_critic src/allowed.ts)"

reset_sandbox; write_critic_report
write_critic_gate READY APPROVE "[checked: ... | matched: ... | used: ... | skipped: ...]"
assert "CG routing bracketed placeholder" DENY "$(run_critic src/allowed.ts)"

reset_sandbox; write_critic_report
write_critic_gate READY APPROVE "PENDING"
assert "CG routing PENDING" DENY "$(run_critic src/allowed.ts)"

reset_sandbox; write_critic_report
# gate without Skills Routing line at all
write_critic_gate READY APPROVE "REPLACE_ME"
sed -i '/^Skills Routing:/d' "$SANDBOX/.agent/critic-gate.md"
assert "CG routing line missing" DENY "$(run_critic src/allowed.ts)"

# ── critic-gate: amendment rule ──────────────────────────────────────

reset_sandbox; write_critic_report
write_critic_gate READY APPROVE "checked=r; matched=x; used=x; skipped=none"
assert "CG pattern not in report, no amendment" DENY "$(run_critic src/extra.ts)"

reset_sandbox; write_critic_report
write_critic_gate READY APPROVE "checked=r; matched=x; used=x; skipped=none"
log_entry "| $TODAY | WB-TEST-gate | amendment: write-set + src/extra.ts - follow-up fix | Control Tower |"
assert "CG amendment same-day" ALLOW "$(run_critic src/extra.ts)"

reset_sandbox; write_critic_report
write_critic_gate READY APPROVE "checked=r; matched=x; used=x; skipped=none"
log_entry "| 2020-01-01 | WB-TEST-gate | amendment: write-set + src/extra.ts - stale | Control Tower |"
assert "CG amendment stale date" DENY "$(run_critic src/extra.ts)"

reset_sandbox; write_critic_report
write_critic_gate READY APPROVE "checked=r; matched=x; used=x; skipped=none"
log_entry "| $TODAY | WB-OTHER | amendment: write-set + src/extra.ts - wrong wb | Control Tower |"
assert "CG amendment wrong WB" DENY "$(run_critic src/extra.ts)"

# fixed-string proof: report contains src/aXb.ts which a regex grep for
# pattern 'src/a?b.ts' could NOT match anyway, so prove -F the other way:
# report contains literally 'src/aXb.ts'; pattern 'src/a?b.ts' as regex
# ('?' = optional 'a') would match 'src/b.ts' — use substring collision:
reset_sandbox
printf '# report\n- src/aQb.ts prose mention\n' > "$SANDBOX/docs/reports/critic-WB-TEST-gate.md"
write_critic_gate READY APPROVE "checked=r; matched=x; used=x; skipped=none"
assert "CG regex metachar pattern, no literal match" DENY "$(run_critic "src/a?b.ts")"

reset_sandbox
printf '# report\n- src/a?b.ts listed verbatim\n' > "$SANDBOX/docs/reports/critic-WB-TEST-gate.md"
write_critic_gate READY APPROVE "checked=r; matched=x; used=x; skipped=none"
assert "CG regex metachar pattern, literal match" ALLOW "$(run_critic "src/a?b.ts")"

# ── critic-gate: regressions ─────────────────────────────────────────

reset_sandbox; write_critic_report
write_critic_gate READY APPROVE "checked=r; matched=x; used=x; skipped=none"
assert "CG path outside write-set" DENY "$(run_critic src/forbidden.ts)"

reset_sandbox; write_critic_report
write_critic_gate READY APPROVE "checked=r; matched=x; used=x; skipped=none" "2020-01-01"
assert "CG expired approval" DENY "$(run_critic src/allowed.ts)"

reset_sandbox
write_critic_gate PENDING PENDING "PENDING"
assert "CG exempt path docs/reports while PENDING" ALLOW "$(run_critic docs/reports/x.md)"

reset_sandbox
write_critic_gate PENDING PENDING "PENDING"
assert "CG exempt gate file while PENDING" ALLOW "$(run_critic .agent/critic-gate.md)"

reset_sandbox; write_critic_report
write_critic_gate SKIPPED PENDING "checked=r; matched=none; used=none; skipped=none"
log_entry "| $TODAY | WB-TEST-gate | critic: SKIPPED - Owner approved - fixture | Owner |"
assert "CG SKIPPED authorized, routing filled" ALLOW "$(run_critic src/allowed.ts)"

reset_sandbox; write_critic_report
write_critic_gate SKIPPED PENDING "PENDING"
log_entry "| $TODAY | WB-TEST-gate | critic: SKIPPED - Owner approved - fixture | Owner |"
assert "CG SKIPPED but routing placeholder" DENY "$(run_critic src/allowed.ts)"

reset_sandbox; write_critic_report
write_critic_gate SKIPPED PENDING "checked=r; matched=none; used=none; skipped=none"
assert "CG SKIPPED without log authorization" DENY "$(run_critic src/allowed.ts)"

reset_sandbox; write_critic_report
write_critic_gate SKIPPED PENDING "checked=r; matched=none; used=none; skipped=none"
log_entry "| $TODAY | WB-A | critic: SKIPPED - fixture | Owner |"
log_entry "| $TODAY | WB-B | critic: SKIPPED - fixture | Owner |"
log_entry "| $TODAY | WB-TEST-gate | critic: SKIPPED - Owner approved - fixture | Owner |"
assert "CG 3 consecutive critic SKIPs" DENY "$(run_critic src/allowed.ts)"

# ── verification-gate: verifier identity and isolation ──────────────

reset_sandbox; write_verif_report
write_verif_gate READY READY subagent none false independent-readonly-root independent-readonly-root
assert "VG READY subagent independent readonly root" ALLOW "$(run_verif)"

reset_sandbox; write_verif_report
write_verif_gate READY READY subagent none false independent-readonly-root independent-readonly-root
rm "$SANDBOX/.claude/hooks/assurance_gate.py"
assert "VG missing controller is fixture ERROR" ERROR "$(run_verif)"

reset_sandbox; write_verif_report
write_verif_gate READY READY subagent none false
assert "VG native same-session subagent is advisory" DENY "$(run_verif)"

reset_sandbox; write_verif_report
write_verif_gate READY READY subagent none false independent-readonly-root same-session-degraded
assert "VG actual isolation below required" DENY "$(run_verif)"

reset_sandbox; write_verif_report
write_verif_gate READY READY subagent "auth, hooks" false same-session-degraded same-session-degraded
assert "VG sensitive same-session verification" DENY "$(run_verif)"

reset_sandbox; write_verif_report
write_verif_gate READY READY subagent "auth, hooks" false independent-readonly-root independent-readonly-root
assert "VG sensitive independent readonly root" ALLOW "$(run_verif)"

reset_sandbox; write_verif_report
write_verif_gate READY READY subagent "live DB, deploy" false os-isolated os-isolated
assert "VG OS-isolated verifier satisfies highest tier" ALLOW "$(run_verif)"

reset_sandbox; write_verif_report
write_verif_gate READY BLOCKED subagent none false
assert "VG READY with BLOCKED verdict" DENY "$(run_verif)"

reset_sandbox; write_verif_report
write_verif_gate READY READY ct-inline none false
assert "VG READY ct-inline, sensitive none" ALLOW "$(run_verif)"

reset_sandbox; write_verif_report
write_verif_gate READY READY ct-inline NONE false
assert "VG READY ct-inline, sensitive NONE upper" ALLOW "$(run_verif)"

reset_sandbox; write_verif_report
write_verif_gate READY READY ct-inline none false independent-readonly-root independent-readonly-root
assert "VG ct-inline cannot claim independent root" DENY "$(run_verif)"

reset_sandbox; write_verif_report
write_verif_gate READY READY PENDING none false
assert "VG READY Verifier PENDING" DENY "$(run_verif)"

reset_sandbox; write_verif_report
write_verif_gate READY READY subagent none false independent-readonly-root independent-readonly-root
sed -i '/^Verifier:/d' "$SANDBOX/.agent/verification-gate.md"
assert "VG READY Verifier line missing" DENY "$(run_verif)"

reset_sandbox; write_verif_report
write_verif_gate READY READY self-review none false
assert "VG READY Verifier invalid value" DENY "$(run_verif)"

reset_sandbox; write_verif_report
write_verif_gate READY READY ct-inline "auth, hooks" false
assert "VG ct-inline sensitive, no waiver" DENY "$(run_verif)"

reset_sandbox; write_verif_report
write_verif_gate READY READY ct-inline "auth, hooks" false
log_entry "| $TODAY | WB-TEST-gate | verifier-waiver: APPROVED - owner accepts ct-inline for hooks | Owner |"
assert "VG legacy verifier waiver cannot bypass isolation" DENY "$(run_verif)"

reset_sandbox; write_verif_report
write_verif_gate READY READY ct-inline "auth, hooks" false
log_entry "| 2020-01-01 | WB-TEST-gate | verifier-waiver: APPROVED - stale | Owner |"
assert "VG ct-inline sensitive, stale waiver" DENY "$(run_verif)"

reset_sandbox; write_verif_report
write_verif_gate READY READY ct-inline "auth, hooks" false
log_entry "| $TODAY | WB-OTHER | verifier-waiver: APPROVED - wrong wb | Owner |"
assert "VG ct-inline sensitive, wrong-WB waiver" DENY "$(run_verif)"

reset_sandbox; write_verif_report
write_verif_gate READY READY subagent "auth, hooks" false independent-readonly-root independent-readonly-root
assert "VG sensitive subagent requires no legacy waiver" ALLOW "$(run_verif)"

reset_sandbox; write_verif_report
write_verif_gate READY READY subagent "[none | list]" false
assert "VG sensitive domains placeholder" DENY "$(run_verif)"

reset_sandbox; write_verif_report
write_verif_gate READY READY subagent none false independent-readonly-root independent-readonly-root
sed -i '/^Required Verifier Isolation:/d' "$SANDBOX/.agent/verification-gate.md"
assert "VG required verifier isolation missing" DENY "$(run_verif)"

reset_sandbox; write_verif_report
write_verif_gate READY READY subagent none false independent-readonly-root mystery-isolation
assert "VG verifier isolation unknown" DENY "$(run_verif)"

# ── verification-gate: regressions ───────────────────────────────────

reset_sandbox
write_verif_gate SKIPPED PENDING PENDING none true
log_entry "| $TODAY | WB-TEST-gate | verification: SKIPPED - quick-fix fixture | Control Tower |"
assert "VG SKIPPED quick-fix (no Verifier needed)" ALLOW "$(run_verif)"

reset_sandbox
write_verif_gate SKIPPED PENDING PENDING none false
log_entry "| $TODAY | WB-TEST-gate | verification: SKIPPED - fixture | Control Tower |"
assert "VG SKIPPED without quick-fix" DENY "$(run_verif)"

reset_sandbox
write_verif_gate READY READY subagent none false
assert "VG READY without report file" DENY "$(run_verif)"

reset_sandbox; write_verif_report
write_verif_gate PENDING PENDING PENDING none false
assert "VG status PENDING" DENY "$(run_verif)"

# ── gpt-verifier hardening: placeholder variants ─────────────────────

reset_sandbox; write_critic_report
write_critic_gate READY APPROVE "[checked: unclosed bracket"
assert "CG routing unclosed-bracket placeholder" DENY "$(run_critic src/allowed.ts)"

reset_sandbox; write_critic_report
write_critic_gate READY APPROVE "Pending"
assert "CG routing mixed-case Pending" DENY "$(run_critic src/allowed.ts)"

reset_sandbox; write_verif_report
write_verif_gate READY READY Pending none false
assert "VG Verifier mixed-case Pending" DENY "$(run_verif)"

reset_sandbox; write_verif_report
write_verif_gate READY READY subagent "[none" false
assert "VG sensitive unclosed-bracket placeholder" DENY "$(run_verif)"

# ── gpt-verifier hardening: wb_id delimiters + actor column ──────────

reset_sandbox; write_critic_report
write_critic_gate READY APPROVE "checked=r; matched=x; used=x; skipped=none"
log_entry "| $TODAY | WB-TEST-gate-extended | amendment: write-set + src/extra.ts - superstring wb | Control Tower |"
assert "CG amendment wb_id superstring collision" DENY "$(run_critic src/extra.ts)"

reset_sandbox; write_critic_report
write_critic_gate READY APPROVE "checked=r; matched=x; used=x; skipped=none"
log_entry "| $TODAY | WB-TEST-gate | amendment: write-set + src/extra.ts - no actor column"
assert "CG amendment missing actor column" DENY "$(run_critic src/extra.ts)"

reset_sandbox; write_critic_report
write_critic_gate READY APPROVE "checked=r; matched=x; used=x; skipped=none"
log_entry "| $TODAY | WB-TEST-gate | amendment: write-set + src/extra.ts - wrong actor | Owner |"
assert "CG amendment wrong actor (Owner)" DENY "$(run_critic src/extra.ts)"

reset_sandbox; write_critic_report
write_critic_gate SKIPPED PENDING "checked=r; matched=none; used=none; skipped=none"
log_entry "| $TODAY | WB-TEST-gate-extended | critic: SKIPPED - superstring wb | Owner |"
assert "CG SKIPPED auth wb_id superstring" DENY "$(run_critic src/allowed.ts)"

reset_sandbox; write_verif_report
write_verif_gate READY READY ct-inline "auth, hooks" false
log_entry "| $TODAY | WB-TEST-gate-extended | verifier-waiver: APPROVED - superstring wb | Owner |"
assert "VG waiver wb_id superstring collision" DENY "$(run_verif)"

reset_sandbox; write_verif_report
write_verif_gate READY READY ct-inline "auth, hooks" false
log_entry "| $TODAY | WB-TEST-gate | verifier-waiver: APPROVED - wrong actor | Control Tower |"
assert "VG waiver wrong actor (Control Tower)" DENY "$(run_verif)"

reset_sandbox
write_verif_gate SKIPPED PENDING PENDING none true
log_entry "| $TODAY | WB-TEST-gate-extended | verification: SKIPPED - superstring wb | Control Tower |"
assert "VG SKIPPED auth wb_id superstring" DENY "$(run_verif)"

# ── gpt re-check: actor column anchored at line end ──────────────────

reset_sandbox; write_critic_report
write_critic_gate READY APPROVE "checked=r; matched=x; used=x; skipped=none"
log_entry "| $TODAY | WB-TEST-gate | amendment: write-set + src/extra.ts - mentions | Control Tower | in reason | Hacker |"
assert "CG amendment actor token in reason text" DENY "$(run_critic src/extra.ts)"

reset_sandbox; write_verif_report
write_verif_gate READY READY ct-inline "auth, hooks" false
log_entry "| $TODAY | WB-TEST-gate | verifier-waiver: APPROVED - says | Owner | in reason | Hacker |"
assert "VG waiver actor token in reason text" DENY "$(run_verif)"

reset_sandbox; write_critic_report
write_critic_gate SKIPPED PENDING "checked=r; matched=none; used=none; skipped=none"
log_entry "| $TODAY | WB-TEST-gate | critic: SKIPPED - forged | Hacker |"
assert "CG SKIPPED wrong final actor" DENY "$(run_critic src/allowed.ts)"

# ── gpt re-check: wb_id as fixed string in require_log_entry ─────────

reset_sandbox
write_verif_gate SKIPPED PENDING PENDING none true
sed -i 's/^Work Block: WB-TEST-gate$/Work Block: WB-A.1/' "$SANDBOX/.agent/verification-gate.md"
log_entry "| $TODAY | WB-Ax1 | verification: SKIPPED - metachar collision | Control Tower |"
assert "VG SKIPPED wb_id regex metachar collision" DENY "$(run_verif)"

reset_sandbox
write_verif_gate SKIPPED PENDING PENDING none true
sed -i 's/^Work Block: WB-TEST-gate$/Work Block: WB-A.1/' "$SANDBOX/.agent/verification-gate.md"
log_entry "| $TODAY | WB-A.1 | verification: SKIPPED - literal wb ok | Control Tower |"
assert "VG SKIPPED wb_id metachar literal match" ALLOW "$(run_verif)"

# ── summary ──────────────────────────────────────────────────────────

echo
echo "PASS=$PASS FAIL=$FAIL"
[ "$FAIL" -eq 0 ]
