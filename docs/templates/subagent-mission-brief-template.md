# Subagent Mission Brief Template

> Use for all non-trivial delegated work.
> Control Tower fills this in before launching a subagent.

---

## Base Role
[Orchestrator | Coder | Reviewer | Verifier]

## Mission Role
[Architecture Analyst | Security Analyst | Frontend Analyst | Design Analyst | Backend Coder | QA Analyst | Docs Analyst]
Temporary specialization — narrows focus, does not expand authority.

## Skill(s)
- [skill-name]: [why this skill applies]

## Objective
[One sentence — what must the subagent accomplish?]

## Scope

### In Scope
- [Item 1]

### Out of Scope
- [Item 1]

## Inputs / Files to Read
- [ ] `AGENTS.md`
- [ ] `memory_bank/context.md`
- [ ] [task/spec/plan file]
- [ ] [source files]
- [ ] `memory_bank/snapshots/snapshot-[wb-id]-[stage]-[date].md` (if parallel dispatch — frozen system state)

## Allowed Tools / MCP
- Least privilege only: [exact tools required]
- MCP: [list relevant MCP servers]

## Effective Runtime Policy
- Parent live sandbox / approval policy: [effective value]
- Agent profile defaults: [model, reasoning, sandbox]
- Required verifier isolation: [same-session-degraded | independent-readonly-root | os-isolated]
- Verifier isolation attestation: [actual level, or n/a for non-verifier missions]
- Isolation evidence: [launch command/context; n/a only when no formal verifier gate applies]
- Runtime readiness: [not required | `scripts/agent-runtime-doctor.sh` result]
- Independent Codex runner: [not applicable | Control-Tower-only; verifier home is Owner-provisioned, mode 0700; no credential handling]

The verification hook validates this declared attestation, not the actual
runtime. Native same-session reviewers/verifiers are advisory. Use a separate
top-level readonly root after diff freeze for sensitive work; require OS
isolation (readonly source, clean HOME/Codex config, no `.env`, SSH, provider,
or runtime credentials) for credentials, live DB, deploy, live infrastructure,
or external-provider work.

Native subagents must not invoke `scripts/run-independent-verifier.sh` or a
nested Codex CLI. Local mutation fixtures may test the runner, but cannot serve
as formal readonly verifier evidence.

## Approved Write-Set
```
[path pattern — empty for read-only roles]
```

## Side-Effect Class
[read-only | local-docs | production-code | ...]

## DB Action Mode
[none | local_temp | live_readonly | ...]

## Parallel Group / Sibling Streams
[Other subagents running concurrently — coordination notes]

## Hard Stops
- [ ] Production deploy
- [ ] Live DB migration
- [ ] Credential rotation
- [ ] Destructive git ops
- [ ] Commit or push
- [ ] Public release/publication
- [ ] Client communications

## Required Checks / Verification Evidence
- [ ] [Check 1 — how to verify]
- [ ] [Check 2 — how to verify]

## Expected Output
[Format, file path if writing artifacts, schema if structured]

## Acceptance Owner / Handoff Target
[Who receives the output and decides whether it's accepted]
