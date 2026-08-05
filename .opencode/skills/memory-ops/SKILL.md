---
name: memory-ops
description: Operational memory management (session logs, snapshots, memory bank, SSOT sync, ops review). Modes—log (stage transitions), snapshot (pre-parallel), bank (maintenance), ssot-sync (closeout), ops-review (friction analysis). Use for audit trails, context freezing, SSOT accuracy, and operational optimization.
user-invocable: true
allowed-tools:
  - Read
  - Bash(git *)
  - Bash(ls *)
  - Bash(find *)
  - Bash(grep *)
  - Bash(cat *)
  - Bash(npm *)
  - Bash(npx *)
  - Bash(curl *)
  - Bash(fuser *)
  - Bash(node *)
  - Bash(rg *)
  - Bash(jq *)
---

# memory-ops: Session & Operational Memory Management

> Consolidated skill merging orchestrator-log, context-snapshot, memory-bank-manager, ssot-sync-closeout, and agent-operations-review. Explicit mode selection determines when and what to log/freeze/sync/review.

## Modes & When to Use

| Mode | Authority | Triggers | Purpose | Reference |
|---|---|---|---|---|
| **log** | Control Tower (inline) | After Stage 0 Preflight, after subagent return, after Stage 3 closeout | Maintain audit trail: orchestrator decisions (why?), subagent findings (what?), external team work (how?) | `reference/log.md` |
| **snapshot** | Control Tower (create) | Before 2+ parallel subagents, before Workflow tool launch, stage transition with pending tasks | Freeze system state so all subagents see consistent baseline | `reference/snapshot.md` |
| **bank** | Memory Ops task (maintenance) | Rolling session housekeeping, durable knowledge promotion | Keep `memory_bank/` concise, promote cross-runtime lessons to `docs/engineering-memory/` | `reference/bank-manager.md` |
| **ssot-sync** | Control Tower (post-stage) | After verifier verdict, before stage transition, on closeout | Point-in-time sync: docs, engineering memory, memory_bank, tasklist; classify knowledge (promoted/operational/not-applicable) | `reference/ssot-sync.md` |
| **ops-review** | Control Tower (optional) | Sprint closeout, repeated approvals slowed execution, tooling/sandbox failures | Read-only recommendation analysis of operational friction; may hand off safe automation/skill/template ideas as improvement candidates, not direct edits or permission changes | `reference/ops-review.md` |

## Mode Decision Tree

**Q1: What stage am I in?**
- Stage 0 (Preflight) → log (tier selection + skips + topology)
- Stage 0.5 (Critic) → log (verdict)
- Between stages (pending work) → snapshot (if 2+ parallel) or ssot-sync (post-stage)
- Stage 3 (Closeout) → log (verdict + residual) + ssot-sync (sync SSOT files)

**Q2: Do I need to capture state before parallel work?**
- 2+ subagents launching in parallel → snapshot (freeze before dispatch)
- Single subagent, sequential → skip snapshot
- Stage transition with pending tasks → snapshot (if overlap) or log (if cleanup)

**Q3: Is memory_bank rotting? Should I promote knowledge?**
- Session mid-point, 3+ context.md entries → bank (cleanup rolling window)
- Cross-runtime reusable lesson → bank (promote to docs/engineering-memory/)
- Dead, stale, or obsolete entries → bank (remove)

**Q4: Post-implementation, what's the verdict?**
- All checks pass, READY → ssot-sync (success-closeout mode)
- Some checks fail, BLOCKED/UNVERIFIED → ssot-sync (reporting-only mode)
- Controversial approval/tooling friction → ops-review (optional, for retrospective)

## Explicit Mode Documentation in SKILL.md

### log → Audit Trail

Control Tower writes to `memory_bank/orchestrator-log.md` and `memory_bank/review-log.md`:
- **After Stage 0:** tier selection, skipped skills + reason, subagent topology
- **After critic:** verdict + action taken
- **On Hard Stop:** trigger, Owner decision
- **After closeout:** verification verdict, residual risks, critic value

### snapshot → Context Freeze

Before 2+ parallel subagents:
- Location: `memory_bank/snapshots/snapshot-[wb-id]-[stage]-[date].md`
- Content: WB, stage, agent topology, memory bank state, file state, constraints, recovery plan
- Subagents: read-only (no modification by subagents)
- Lifecycle: create → reference → archive (never delete)

### bank → Maintenance & Promotion

Housekeeping skill:
- Keep context.md, progress.md, decisions.md current (rolling 15-entry window)
- Promote durable lessons to docs/engineering-memory/ (marked: promoted, operational-only, or not-applicable)
- Remove outdated / rotted entries
- No duplication between memory_bank and docs

### ssot-sync → Point-in-Time Accuracy

After stage completion:
- Verify evidence: subagent DONE ≠ Control Tower accept (need verdict)
- Classify closeout: success-closeout (READY) or reporting-only (BLOCKED/UNVERIFIED)
- Update progress.md with new entry (done + notes + checks)
- Update context.md (current focus + next queue + date)
- Update decisions.md if ADR/architectural decision made
- Update tasklist delivery notes
- Classify knowledge: promoted / operational-only / not-applicable
- Check SSOT files are actually gitignored if local-only

### ops-review → Friction Analysis

Optional, read-only retrospective (not TrustGate):
- Permission friction: which approvals repeated?
- Tooling failures: sandbox/MCP/model/subagent issues?
- Outcome evidence: broken runtime, failed checks, safety issues?
- Safe automation candidates: which repeated actions appear safe to pre-allow?
- Improvement candidates: skill-update, skill-create, skill-archive, agent-prompt, template, workflow, hook, or no-action; keep them evidence-based and hand them off for critic review
- Recommendations: advisory only; no direct edits, no permission changes, no gate bypass

## Hard Limits

- log: never log secrets, tokens, credentials. One row per decision/return. Inline, not blocking.
- snapshot: Control Tower only. Immutable after dispatch. No secrets. Never delete.
- bank: no rot. Remove dead entries. Promote cross-runtime lessons.
- ssot-sync: don't overwrite historical entries. If checks didn't run, state explicitly. No ADR without real architectural decision.
- ops-review: no raw transcripts, secrets, full bodies, client-private messages. Read-only analysis only; recommendations do not edit files or alter permissions.

## Gate Lifecycle (commit ritual)

When committing to close a Work Block, follow this gate reset-and-restore order:

1. **Write reports** — save all closeout reports to `docs/reports/`
2. **Reset gates to template** — IMPORTANT order to avoid blocking:
   - First reset `verification-gate.md` to template
   - Then reset `critic-gate.md` to template (its write-set now includes `.agent/verification-gate.md`)
3. **Commit** — stage + git commit all changes
4. **Restore session state** — IMPORTANT order to re-enable:
   - First restore `critic-gate.md` with current session values (write-set includes `.agent/verification-gate.md`)
   - Then restore `verification-gate.md` with current session values (avoids Hard Stop hook failure at session end)

**Expires field:** Optional. If set, use formula: Work Block start date + 7 days, not 1 day.

**Push-approval log entries:** The `push-approval` WB-column in `orchestrator-log.md` is reserved exclusively for Owner approval entries authorizing plain `git push origin main` (not force-push or destructive ops). Format: `| YYYY-MM-DD | push-approval | push: APPROVED origin main - <reason> | Owner |`. No other log entries may use `push-approval` as the WB id to prevent collisions with the hard-stop.sh approval check.

## Handoff

- **log:** Success = row added, no secrets leaked, no duplicates. Auto-proceed (inline, non-blocking).
- **snapshot:** Success = written to `memory_bank/snapshots/`, referenced in all parallel mission briefs. Auto-proceed.
- **bank:** Success = memory_bank current, durable lessons classified, no rot. Auto-proceed.
- **ssot-sync:** Success = engineering memory classified, memory_bank updated (context, progress, decisions), tasklist updated, closeout mode matches verdict. Auto-proceed.
- **ops-review:** Success = concise local recommendation for reducing friction. Next = separate Work Block if changes approved.

---

## Reference Files

- [`reference/log.md`](reference/log.md) — Orchestrator Log (log mode)
- [`reference/snapshot.md`](reference/snapshot.md) — Context Snapshot (snapshot mode)
- [`reference/bank-manager.md`](reference/bank-manager.md) — Memory Bank Manager (bank mode)
- [`reference/ssot-sync.md`](reference/ssot-sync.md) — SSOT Sync Closeout (ssot-sync mode)
- [`reference/ops-review.md`](reference/ops-review.md) — Agent Operations Review (ops-review mode)
