# Verification Report — WB-2026-07-05-critic-gate-fixes

Date: 2026-07-05
Tier: lite
Verdict: READY

## Changes

1. `.claude/hooks/critic-gate.sh` — three fixes:
   - Paths outside the repository (still absolute after `relative_path`) exit 0 before any gate checks — harness plan files and agent memory are no longer gated.
   - `docs/reports/*` added to the always-writable exemptions (alongside gate file and orchestrator log) — kills the bootstrap catch-22 where READY required a report that could not be written pre-READY.
   - GPT critic mandatory trigger narrowed: `RECONSIDER` only (was `SUPPLEMENT|RECONSIDER`). Full tier and New Domain triggers unchanged.
2. `.agent/workflows/sdd-protocol.md:74` — contract updated to match (SUPPLEMENT no longer escalates; Control Tower resolves supplements directly).

Not changed (out of scope, compatible): `.claude/agents/gpt-critic.md` / `.opencode/agents/gpt-critic.md` describe optional use after SUPPLEMENT — still valid as optional.

## Checks

| Test | Expected | Result |
|---|---|---|
| `bash -n` syntax | OK | PASS |
| T1/T9: Write to out-of-repo path (valid and expired gate) | allow | PASS |
| T2: Write to docs/reports/ pre-READY | allow | PASS |
| T3: Write to repo file outside write-set | deny | PASS |
| T4: Write to write-set file | allow | PASS |
| T5: Gate file + orchestrator log | allow | PASS |
| T6: Status READY, Verdict SUPPLEMENT, GPT NOT_REQUIRED | allow (deny before fix) | PASS |
| T7: Verdict RECONSIDER, GPT NOT_REQUIRED | deny (GPT required) | PASS |
| T8: Expired gate, in-repo file | deny (expired) | PASS |

Fixture tests ran against an isolated scratchpad gate; live-gate tests ran against the repo. This report itself was written via the Write tool into docs/reports/ before any READY status — confirming fix 2 in real use.

## Deferred (Owner backlog)

- `Expires` semantics (duplicate of per-WB scoping) — left as is.
- hard-stop.sh deny message hint for `git commit -F` — separate hook, not touched.
- Committing the untracked SDLC layer (`.claude/hooks/`, `.agent/`, …) — separate Work Block.
