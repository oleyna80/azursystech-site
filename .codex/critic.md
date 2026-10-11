# Codex Critic Subagent Contract

Purpose: give Codex the same decision-check pattern that Claude Code has:
the Codex-Orchestrator is not the sole unchecked decision maker on
non-trivial Work Blocks.

The critic is read-only. It challenges the Orchestrator's DEFINE planning decisions
before implementation starts, returns findings to the Orchestrator, and gives
the Owner an audit trail for later review. The Orchestrator records the result
in an approved coordination report; a report alone does not bind authority.

## Position in the Flow

```text
DEFINE: committed planning revision → independent read-only Critic
Critic READY binding: Controller v1 atomically transitions DEFINE → EXECUTE
EXECUTE: scoped implementation → exact committed candidate
ASSURE: Reviewer and Verifier bind that exact candidate → trusted publish
```

Owner approval authorizes scoped independent review. Controller v1 and trusted
external active admission remain authoritative; neither an advisory review nor
tracked schema-v3/write-gate records open execution.

## Mandatory Triggers

Use independent Critic planning review before implementation. The following
risk triggers also identify work needing particular scrutiny:

- Work Block touches 3+ files
- side-effect class is Production code write or higher
- new subagent topology is used
- 2+ skills are skipped in one Work Block
- Work Block involves security, auth, payments, DB, deploy, or external providers
- Codex acts as mega-orchestrator for a Claude Code handoff
- `Subagent-Required` classification is skipped with reason `trivial`

## Advisory Work and Isolation

Read-only research and trivial commentary may receive advisory critique without
opening a Work Block. An advisory skip or same-context fallback cannot replace
Controller v1's required planning READY binding. Record unmet independent
assurance as BLOCKED/UNVERIFIED and resolve it before execution.

Record the actual independent context and read-only boundary required by the
approved Work Block. Runtime availability, native-topology labels or historic
schema-v3 bindings do not create trusted admission. Stronger filesystem/OS
isolation must be evidenced separately where required.

## Inputs

The critic receives:

- Work Block objective and expected final result
- approved scope and out-of-scope list
- Stage 0 Routing Preflight
- planned write-set
- skill routing decisions and skip reasons
- subagent topology
- side-effect class, DB action mode, and hard stops
- planned verification tier and checks

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
**Reviewed:** exact committed planning revision + Work Block definition
**Mode:** independent context and actual read-only boundary
**Verdict:** READY | BLOCKED

### Findings
| Severity | Dimension | Finding | Evidence | Recommendation |
|---|---|---|---|---|

### Required Orchestrator Response
- [How each Must Address item was handled]

### Inspection Gaps
- [What could not be checked and why]
```

The Orchestrator stores evidence only in approved coordination paths. Bind
READY through Controller v1 to the exact planning revision after addressing
blocking findings; do not edit private controller state manually.

## Verdict Semantics

| Verdict | Meaning | Orchestrator action |
|---|---|---|
| READY | No blocking planning issue remains | Bind exact planning revision through Controller v1; DEFINE → EXECUTE |
| BLOCKED | Concrete planning defect or required evidence missing | Correct planning, revise bind committed revision, and repeat independent review |

The Critic judges planning only. Reviewer and Verifier separately assess the
exact source candidate; a Critic report does not substitute for those bindings.

## Authority Limits

- Read-only only.
- No file writes, commits, pushes, deploys, DB actions, or secret reads.
- No expansion of the approved Work Block scope.
- No launching Claude Code from inside a Codex critic subagent.
- Planning READY/BLOCKED only; no self-binding, manual state mutation, or
  substitution for Reviewer/Verifier candidate outcomes or Owner approval.
