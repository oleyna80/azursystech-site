# Codex Critic Report — WB-2026-07-13-verifier-isolation-tiers

## Verdict

**APPROVE WITH REQUIRED SUPPLEMENTS INCORPORATED IN SCOPE**

## Findings that shape implementation

1. `Verifier: subagent` alone is not technical isolation. The gate must require a closed-vocabulary isolation field and deny `READY` for sensitive domains when the actual level is same-session.
2. The gate validates an attestation, not the operating-system/process boundary. The verification report must record launch mode, profile, sandbox, approval policy, and advisory status.
3. The low-friction path remains: `SKIPPED` Quick-Fix is unchanged; non-sensitive work may use `ct-inline`/same-session; sensitive work requires `independent-readonly-root`; credentials, live DB, deploy, production infrastructure, or external-provider operations require `os-isolated`.
4. A readonly root protects repository writes but may still layer user-level MCP configuration and credentials. `os-isolated` therefore requires a clean HOME/Codex configuration, no `.env`/SSH/provider credentials, and a read-only source mount.
5. Claude and Codex hooks require matched validation and fixture coverage for allow, deny, missing field, unknown level, and legacy-waiver denial cases.

## Constraints

- No attempt to infer or prove process isolation in a shell hook.
- No credential or MCP configuration modification in this Work Block.
- No broadening of `READY` through an Owner waiver.

## Evidence

- `.claude/hooks/verification-gate.sh` and `.codex/hooks/verification-gate.sh` currently accept `Verifier: subagent` for sensitive domains without an isolation level.
- Existing policy already correctly states that native subagents inherit the parent live sandbox and approval state.

## File changes

None; read-only critic review.
