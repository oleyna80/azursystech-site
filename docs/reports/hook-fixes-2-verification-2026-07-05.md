# Verification Report — WB-2026-07-05-hook-fixes-2

Date: 2026-07-05
Tier: lite
Verdict: READY (independent verifier subagent, sonnet)

## Changes (scoped-coder, sonnet)

1. `.claude/hooks/critic-gate.sh` — `.agent/verification-gate.md` added to always-exempt paths: Control Tower can fill the verification gate regardless of critic-gate state (closes the Stop-hook deadlock and the reset-order trap).
2. `.claude/hooks/hard-stop.sh` — shell-expansion deny message now suggests `git commit -F <file>`.
3. `.claude/agents/*.md` (all 8) — Hard Limit added: subagents must never edit `.agent/critic-gate.md` / `.agent/verification-gate.md`; on hook deny — stop and report, do not work around the gate (response to the coder-B gate-edit incident).
4. `.agent/skills/memory-ops/SKILL.md` — new "Gate Lifecycle (commit ritual)" section: reports → reset verification-gate → reset critic-gate → commit → refill critic-gate → refill verification-gate; Expires guidance: WB start + 7 days.

## Verifier checks (all PASS)

bash -n both hooks; 5 payload tests of critic-gate.sh incl. the new verification-gate-at-PENDING ALLOW case and out-of-write-set DENY; hard-stop deny message contains the -F hint while `ls` passes; 8/8 agents carry the ban clause with intact markdown; SKILL.md lifecycle order and Expires formula verified; git status confined to write-set; no secrets.
