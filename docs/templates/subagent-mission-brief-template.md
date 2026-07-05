# Subagent Mission Brief Template

> Use for all non-trivial delegated work.
> Control Tower fills this in before launching a subagent.

---

## Base Role
[Orchestrator | Coder | Reviewer | Verifier]

## Mission Role
[Architecture Analyst | Security Analyst | Backend Coder | QA Analyst | Docs Analyst]
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
- Read, Bash, LSP, Grep, Glob, WebFetch, WebSearch
- MCP: [list relevant MCP servers]

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
