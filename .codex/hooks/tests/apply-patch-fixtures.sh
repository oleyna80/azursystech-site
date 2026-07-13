#!/usr/bin/env bash
# Native Codex apply_patch payload regression for the critic gate.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../../.." && pwd)"
SANDBOX="$(mktemp -d)"
trap 'rm -rf "$SANDBOX"' EXIT
mkdir -p "$SANDBOX/.agent" "$SANDBOX/docs/reports" "$SANDBOX/memory_bank"

cat > "$SANDBOX/.agent/critic-gate.md" <<'EOF'
Status: READY
Work Block: WB-native
Verification Tier: standard
New Domain: false
Subagent Topology Status: PLANNED
Critic Verdict: APPROVE
Critic Report: docs/reports/critic.md
GPT Critic Status: NOT_REQUIRED
GPT Critic Reason: fixture
Skills Routing: checked=x; matched=x; used=x; skipped=none
Session: any
Expires: 2099-01-01
Approved Write-Set:
- src/allowed.ts
EOF
printf '# report\n- src/allowed.ts\n' > "$SANDBOX/docs/reports/critic.md"

allow_payload='{"tool_name":"apply_patch","tool_input":{"command":"*** Begin Patch\n*** Update File: src/allowed.ts\n*** End Patch"}}'
deny_payload='{"tool_name":"apply_patch","tool_input":{"command":"*** Begin Patch\n*** Update File: src/forbidden.ts\n*** End Patch"}}'

printf '%s' "$allow_payload" | (cd "$SANDBOX" && bash "$ROOT/.codex/hooks/critic-gate.sh") | grep -q 'permissionDecision' && exit 1
printf '%s' "$deny_payload" | (cd "$SANDBOX" && bash "$ROOT/.codex/hooks/critic-gate.sh") | grep -q '"deny"'
printf 'PASS  native apply_patch payload allow/deny paths\n'
