# Codex Critic Subagent Contract

Purpose: give Codex the same decision-check pattern that Claude Code has: the
Codex-Orchestrator is not the sole unchecked decision maker on non-trivial Work
Blocks.

The critic is read-only. It challenges the Orchestrator's Stage 0 decisions
before implementation starts, returns findings to the Orchestrator, and gives
the Owner an audit trail for later review. The Orchestrator records the result
in `memory_bank/review-log.md`.

## Position in the Flow

```text
Stage 0: Routing Preflight        Codex-Orchestrator
Stage 0.5: Codex Critic Review    read-only critic subagent
Stage 1: Implementation           scoped coder / main thread
Stage 2: Verification             verifier / checks
Stage 3: Sync & Report            Codex-Orchestrator
```

Owner approval of a Work Block authorizes the Codex-Orchestrator to run the
critic automatically when the triggers below match. The Owner does not need to
ask for the critic separately.

## Mandatory Triggers

Run Stage 0.5 Codex Critic Review when Stage 0 is complete and any condition is
true:

- Work Block touches 3 or more files.
- Side-effect class is production code write or higher.
- New subagent topology is used.
- Two or more skills are skipped in one Work Block.
- Work Block involves security, auth, payments, DB, deploy, external providers,
  env/secrets, or client-facing effects.
- Codex acts as mega-orchestrator for a Claude Code handoff.
- `Subagent-Required` classification is skipped with reason `trivial`.

## Valid Skip Conditions

Skipping the critic is allowed only for:

- trivial single-file typo/comment/docs correction with no logic change;
- pure read-only research with no file writes;
- Owner explicitly approves skipping the critic for the current Work Block.

Every skip must be recorded in:

- `.codex/write-gate.md`;
- `memory_bank/orchestrator-log.md`.

## Runtime Modes

| Mode | When to use | Required label |
|---|---|---|
| Native Codex subagent | Preferred for non-trivial Work Blocks when subagents are available and authorized | `Codex Critic: READY` |
| Same-session fallback | Native subagent/fork is unavailable, but critique is still required | `Codex Critic: FALLBACK` |
| External critic | High-risk Work Block benefits from Claude Code, MCP, or another reviewer | `Codex Critic: READY` plus report path |
| Skipped | Skip condition is valid and recorded | `Codex Critic: SKIPPED` |

The fallback mode must be named honestly. Do not describe a same-session review
as an independent subagent.

## Inputs

The critic receives:

- Work Block objective and expected final result;
- approved scope and out-of-scope list;
- Stage 0 Routing Preflight;
- planned write-set;
- skill routing decisions and skip reasons;
- subagent topology;
- side-effect class, DB action mode, and hard stops;
- planned verification tier and checks.

## Critique Dimensions

| Dimension | What to check |
|---|---|
| Scope | Write-set matches objective; no scope creep; missing files noted |
| Skill routing | Required skills were used or skipped with strong reasons |
| Subagent topology | Delegation is useful, bounded, and not excessive |
| Risk | Hard stops, side effects, secrets, DB, deploy, provider risks are named |
| Verification | Checks match blast radius and acceptance criteria |
| Decision quality | Rationale is concrete enough to audit later |

## Output Contract

The critic returns:

```markdown
## Codex Critic Report - [Work Block ID]

**Date:** YYYY-MM-DD
**Reviewed:** Stage 0 Routing Preflight + Work Block definition
**Mode:** native-subagent | fallback-same-session | external
**Verdict:** APPROVE | SUPPLEMENT | RECONSIDER

### Findings
| Severity | Dimension | Finding | Evidence | Recommendation |
|---|---|---|---|---|

### Required Orchestrator Response
- [How each Must Address item was handled]

### Inspection Gaps
- [What could not be checked and why]
```

The Orchestrator dispositions critic findings directly in the Work Block plan
or in `memory_bank/review-log.md`. Do not write critic reports under
`docs/reports/` unless the Work Block explicitly authorizes a Verifier or
Scoped Coder to write that report path. Short fallback reviews may be logged
in `memory_bank/review-log.md` only.

## Verdict Semantics

| Verdict | Meaning | Orchestrator action |
|---|---|---|
| APPROVE | No material issue found | Proceed to Stage 1 |
| SUPPLEMENT | Minor gap found | Address or explicitly accept before Stage 1 |
| RECONSIDER | Material gap found | Re-run Stage 0 before Stage 1 |

The critic is advisory, not a write gate owner. The Orchestrator decides, but
must record the response in `memory_bank/orchestrator-log.md`.

## Authority Limits

- Read-only only.
- No file writes, commits, pushes, deploys, DB actions, or secret reads.
- No expansion of the approved Work Block scope.
- No launching Claude Code from inside a Codex critic subagent.
- No `READY` or `BLOCKED` gate verdicts; only critic verdicts above.
- Codex-native Reviewer and Verifier subagents are not authorized by this
  contract. Review and Verification roles are assigned per Work Block by the
  Owner and may be routed through Claude Code missions or external audit
  runners.
