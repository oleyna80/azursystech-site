# Codex Write Gate — Compatibility View

> Human-readable compatibility note. The executable source of truth is
> `.agent/active-work-block.json`.

## Default State

- **Status:** BLOCKED
- **Active Work Block:** unset
- **Specification:** unset
- **Base commit:** unset
- **Expiry:** unset
- **Critic:** PENDING
- **Approved write-set:** empty

The generated project starts fail-closed.

`scripts/lifecycle.py` is an optional local coordination helper. `status` is
read-only; `prepare`, `freeze`, and `close` leave the source gate BLOCKED.
`open --authorization .agent/authorizations/<work-block>.json` derives every
authority-bearing value from that committed record at `HEAD`: Work Block/spec
digest, exact write-set, expiry ceiling, Owner evidence, and Critic evidence.
It refuses a missing, dirty, malformed, expired, or uncommitted record and
stores its Git blob ID in the gate. `renew` can refresh only the time within the
committed expiry ceiling; it cannot broaden authority. The helper never creates
or edits an authorization record.

## Executable Gate

Codex `PreToolUse` reads `.agent/active-work-block.json` and checks:

- schema version;
- Work Block ID;
- specification path and revision;
- `write_gate.status`;
- timezone-aware expiry;
- current `HEAD` against `base_commit`;
- the committed authorization record, its working-tree equality, and blob ID;
- required Critic status and verdict;
- source targets against the approved write-set;
- Hard Stop approval flags for supported Bash operations.

Do not set this Markdown file to READY. Updating it alone does not authorize a
write.

## Coordination Before READY

While the source gate remains BLOCKED, the hook permits only the configured
coordination write-set, normally:

```text
.agent/active-work-block.json
.agent/critic-gate.md
.agent/verification-gate.md
.codex/write-gate.md
docs/architecture/drafts/**
docs/specs/**
docs/plans/**
docs/tasklist/**
docs/reports/**
memory_bank/**
```

These paths allow Define-stage and evidence work. They do not authorize source,
configuration, runtime, infrastructure, credential, or data mutations.

## Opening the Source Gate

Commit a role-separated authorization record only after:

1. the human Work Block is approved;
2. the active specification and revision are recorded;
3. the architecture baseline and implementation plan are resolved;
4. the source write-set is explicit;
5. the required Critic function completed or an allowed degraded/skip state is
   documented;
6. `base_commit` matches the current Git `HEAD`;
7. `expires_at` is short-lived and timezone-aware;
8. relevant Hard Stop approvals are recorded.

Sign the committed authorization JSON out of band with the Owner key and commit
its detached sibling `<record-path>.sig`. Then explicitly provide an external
OpenSSH `allowed_signers` trust anchor:

```bash
export AGENTIC_SDLC_OWNER_SIGNERS=/absolute/path/to/owner-signers
python3 .codex/scripts/lifecycle.py open --authorization <record-path>
```

Do not hand-edit a READY gate. `open` verifies the signature as
`owner@agentic-sdlc` in namespace `agentic-sdlc-authorization`, and derives all
READY fields from the committed record and signature. A missing environment
variable, external anchor, committed signature, or valid Owner signature blocks
the gate.

```json
"write_gate": {
  "status": "READY",
  "opened_at": "2026-07-25T12:00:00+02:00",
  "expires_at": "2026-07-25T18:00:00+02:00"
}
```

After a commit changes `HEAD`, renew the gate before further source writes.

## Limitations

Hooks remain cooperative project guardrails, not OS-level isolation. Project
hooks can be bypassed and same-user writers can alter local project files, but
they cannot forge an Owner-approved signature without the separately held
private key. Stronger assurance may require a separate read-only root,
worktree, runtime, container, or OS boundary.
