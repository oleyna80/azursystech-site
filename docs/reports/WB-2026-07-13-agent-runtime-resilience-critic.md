# Critic Report — agent runtime resilience

- **Work Block:** `WB-2026-07-13-agent-runtime-resilience`
- **Role:** Reviewer / Architecture Analyst
- **Mode:** native read-only Critic
- **Verdict:** **SUPPLEMENT**

## Evidence-based supplements accepted by Control Tower

1. `CODEX_VERIFIER_HOME` must be a separate writable directory with mode
   `0700`, provisioned and authenticated once by the Owner. Codex layers a
   named profile from `$CODEX_HOME`; `--ephemeral` avoids session rollout
   files but does not guarantee that no runtime state is written. The runner
   therefore must neither copy nor read authentication material.
2. `scripts/run-independent-verifier.sh` is a Control Tower command only.
   Native subagents are prohibited from launching nested external Codex CLIs by
   `AGENTS.md`; the runner must repeat that boundary in its usage text.
3. `.codex/agents/verifier.toml` is local ignored runtime payload. It may be
   updated only as a local policy alignment; it is not a commit candidate. Its
   formal-verdict wording must defer to the declared verifier-isolation gate.
4. The existing uncommitted config template is preserved except for the
   intended `max_threads = 6` to `max_threads = 3` change. With four available
   execution slots, three workers retain capacity for Control Tower and the
   independent verifier.
5. The host action is accepted only after the applied values are reread. If
   interactive elevation is unavailable, that blocks the host acceptance
   criterion but not the safe repository implementation.

## Decision

All supplements are included in the approved plan and write-set. No missing
authority, secret handling, or scope expansion remains. Proceed to the single
Scoped Coder.

## Critic-approved write-set

- `AGENTS.md`
- `.agent/critic-gate.md`
- `.agent/verification-gate.md`
- `.agent/workflows/sdd-protocol.md`
- `.codex/AGENTS.md`
- `.codex/config.toml.template`
- `.codex/instructions.md`
- `.codex/write-gate.md`
- `.codex/agents/verifier.toml`
- `docs/engineering-memory/runtime-command-adapters.md`
- `docs/templates/subagent-mission-brief-template.md`
- `docs/plans/WB-2026-07-13-agent-runtime-resilience.md`
- `docs/reports/WB-2026-07-13-agent-runtime-resilience-critic.md`
- `docs/reports/WB-2026-07-13-agent-runtime-resilience-verification.md`
- `memory_bank/context.md`
- `memory_bank/progress.md`
- `memory_bank/decisions.md`
- `memory_bank/orchestrator-log.md`
- `memory_bank/review-log.md`
- `scripts/run-independent-verifier.sh`
- `scripts/agent-runtime-doctor.sh`
- `scripts/agent-runtime-sysctl.conf`
- `scripts/tests/agent-runtime-fixtures.sh`
- `/home/azur/.codex/config.toml`
- `/etc/sysctl.d/99-codex-agent-runtime.conf`
