# Context Snapshot Template

> Fill in before parallel subagent spawning or state transitions.
> Snapshot is read-only for subagents. Only Control Tower creates and archives.

---

## Context Snapshot — [Work Block ID] / [Stage]

**Created:** [YYYY-MM-DD HH:MM]
**Created by:** Control Tower
**Purpose:** [parallel spawning / recovery / handoff / stage transition]
**Snapshot ID:** [snapshot-id]

### Current State

| Field | Value |
|---|---|
| Active Work Block | wb-XXX |
| Stage | Stage 0 / 1 / 2 / 3 |
| Side-effect class | read-only / production-code / live-infra / ... |
| DB action mode | none / local_temp / live_readonly / ... |
| Write gate | READY / BLOCKED |
| Verification tier | lite / standard / full |

### Agent Topology

**Parallel agents launching:**

| Agent | Role | Isolated Write Zone | Shared Read |
|---|---|---|---|
| agent-name | role | files only this agent writes | files all agents read |

**Isolation zones:**
- Agent A: [files/dirs owned exclusively]
- Agent B: [files/dirs owned exclusively]
- Shared (read-only for all): [files all agents may read]

### Memory Bank State

**context.md summary:**
[Current focus, active WBs, next gate — 1-2 lines]

**progress.md latest:**
[Last status entry from progress.md]

**decisions.md latest:**
[Last decision from decisions.md]

**orchestrator-log.md relevant:**
[Key decisions relevant to this snapshot]

### File State (pre-spawn)

**Modified but uncommitted:**
```
[git status --porcelain output or summary]
```

**Files created in last 5 days:**
```
[git log --diff-filter=A --since="5 days ago" --name-only]
```

### Constraints

**Do NOT modify:**
- [file/dir] — [reason]

**Decisions already made (do NOT reconsider):**
- [Decision] — [rationale]

**Hard Stops active:**
- [ ] [Hard Stop condition]

### Expected Parallel Outcomes

| Agent | Expected Output | Success Criteria | Timeout |
|---|---|---|---|
| agent-A | report / diff / verdict | AC to verify | N minutes |
| agent-B | report / diff / verdict | AC to verify | N minutes |

### Recovery Plan

**If agent hangs:** [timeout action — re-spawn / skip / escalate]
**If results conflict:** [resolution — Control Tower decides / re-run both / escalate to Owner]
**If snapshot is stale:** [re-create snapshot before proceeding]

### Post-Completion

- [ ] All agent outputs received
- [ ] Results consolidated (see consolidation template)
- [ ] Snapshot archived (keep for audit trail)
- [ ] Progress log updated
