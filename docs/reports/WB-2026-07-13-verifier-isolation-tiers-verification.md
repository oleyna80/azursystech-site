# Verification Report — verifier isolation tiers

- **Work Block:** `WB-2026-07-13-verifier-isolation-tiers`
- **Tier:** Full
- **Required verifier isolation:** `independent-readonly-root`
- **Gate verdict:** **READY**

## Verdict

The implementation passed deterministic local checks and the required
independent readonly Codex verifier returned `READY`. The formal Verification
Gate is therefore `READY` at `independent-readonly-root` isolation.

## Completed local evidence

| Check | Result |
| --- | --- |
| `bash -n .claude/hooks/verification-gate.sh .codex/hooks/verification-gate.sh` | PASS |
| `bash .claude/hooks/tests/gate-fixtures.sh` | PASS — 59 passed, 0 failed |
| `bash .codex/hooks/tests/gate-fixtures.sh` | PASS — 59 passed, 0 failed |
| `codex --strict-config --version` | PASS — configuration parsed |
| `codex --profile readonly --strict-config --version` | PASS — readonly profile parsed |
| `git diff --check` | PASS |

## Recovery and independent verifier

The initial launch could not initialize its writable Codex runtime state from a
read-only environment. The observed state-database message was a runtime
write-path failure, not evidence of database corruption. A protected temporary
Codex home was used solely for the verifier runtime state; the repository
remained read-only. An attempted host `inotify` limit increase was not applied
because interactive `sudo` authentication was unavailable. File-watch warnings
remained advisory and did not prevent the verifier from completing.

The completed separate top-level root used the `readonly` profile, `read-only`
sandbox, `never` approval policy, and an ephemeral session (session
`019f5bde-2344-7eb3-89e6-dcc05ebb032b`). It returned `READY` after:

- passing `git diff --check`;
- passing `bash -n` for both verification hooks;
- inspecting the policy, hooks, fixture parity, and recorded local fixture
  evidence;
- confirming that both fixture suites contain 59 cases and passed locally.

The fixture scripts deliberately create temporary setup, so they were not run
inside the readonly root. Their successful local execution is recorded above;
the independent verifier inspected their coverage instead.

## Scope confirmation

No application code, dependency, deployment, database, secret, credential,
commit, or push action was performed.
