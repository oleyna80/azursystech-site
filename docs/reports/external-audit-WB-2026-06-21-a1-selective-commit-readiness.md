# External Audit Report

- **Work Block:** `WB-2026-06-21-a1-selective-commit-readiness`
- **Runtime:** Claude Code
- **Role:** Reviewer / Commit Boundary Analyst
- **Mode:** read-only task, manually launched by Owner
- **External verdict:** `BLOCKED` at audit time
- **Control Tower disposition:** `ACCEPTED`, blocker resolved by Owner

## Accepted Findings

1. **Blocking - `AGENTS.md` baseline drift.** The accepted A1 SHA-256 is
   `a91a9301db162b9fdeb77580b064a5d8fdedec4b370ec99416ab6d10e3937d4b`;
   current SHA-256 is
   `5caab668e56efce5fdf6935088efacdc6adc36177641ce5dd27c81f884a0cb8d`.
2. The additional delta is a temporary `GPT/Codex Agents DISABLED` policy
   block. It is semantically compatible with the active-runtime policy but was
   not part of predecessor A1 Review or Verification.
3. The other seven A1 paths match their accepted hashes and pass runtime-policy,
   mirrored-body, whitespace, scope, and credential checks.
4. The Git index remains empty and no ninth path was proposed.

## Control Tower Reproduction

- Recomputed all eight SHA-256 values: only `AGENTS.md` differs.
- Inspected `git diff -- AGENTS.md`: the temporary disablement block is outside
  the accepted A1 baseline; the synchronized-agent-layer hunk remains A1 content.
- Confirmed HEAD remains
  `1b51896a222ac20fba2a3bbaf7e2d6e7f388edda` and staging is empty.
- Compared the stored pre-envelope with current state: status metadata, HEAD,
  index digest, and seven subject hashes match; only `AGENTS.md` differs.

## Read-Only Test Assessment

The audit itself was useful and correctly stopped on procedural drift. File
timestamps show `AGENTS.md` was last modified at `2026-06-21 16:04:04 +0200`,
while the manual Claude command opened its stderr capture at
`2026-06-21 16:05:03 +0200`. The drift therefore predates that Claude process.
There is no evidence that Claude modified a subject file during the audit, but
the broad pre/post envelope cannot prove a clean run because it was captured
before the intervening external edit.

## Required Decision

The Owner confirmed that the temporary block was intentional and removed it.
Control Tower recomputed all eight hashes after removal; every path now matches
the accepted baseline, staging is empty, and no scope change is required. The
exact-eight staging step may proceed under the existing approval.
