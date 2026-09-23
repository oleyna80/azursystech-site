# WB-033 Independent Critic Rereview (r2)

## Review record

- **Work Block:** `WB-033`
- **Reviewed specification revision:** `WB-033-r1`
- **Reviewed branch:** `feat/governance-recovery-033`
- **Reviewed baseline HEAD:** `3ea13015e196516a65cdcb58fff455370d66cda0`
- **Reviewed files:** `docs/specs/WB-033.md`, `docs/plans/WB-033.md`,
  `docs/tasklist/WB-033.tasklist.md`, and the prior Critic report
  `docs/reports/WB-033-critic.md`.
- **Review scope:** closure of C-1 through C-5 from the prior Critic report
  only. This was not a new architectural review.
- **Isolation method:** designated separate Git worktree with read-only
  artifact review, pre/post SHA-256 comparison, and Git path checks. This is
  mutation detection, not an OS-enforced read-only boundary.

## Finding closure results

| Prior finding | Result | Evidence |
|---|---|---|
| C-1 — lifecycle transition contract | **CLOSED** | The specification now names exactly `INACTIVE`, `DEFINE`, `EXECUTE`, and `ASSURE`, supplies every required transition, puts Reviewer/Verifier inside `ASSURE`, requires both `READY` verdicts for one candidate on success, makes reporting-only/cancelled closeout reachable, and fails closed for unknown state/transition. Closeout is expressly an immutable event, not an active state. The plan/tasklist trace the transition and negative tests. |
| C-2 — policy decision contract | **SUPPLEMENT REQUIRED** | The policy table correctly separates ordinary source writes, bounded future subject-branch publication, ambiguous publication denial, and the listed hard stops. It preserves a non-generic, non-force, exact-subject-branch publication decision with exact assured candidate and Reviewer/Verifier `READY`, while leaving push out of scope. However, `controller activation or change` is an unqualified External Hard Stop, which conflicts with the admitted inert source write-set `.agent/controllers/v1/**`. |
| C-3 — candidate/evidence identity | **CLOSED** | Git tree SHA is the sole `candidate_id`; commit SHA is provenance only; no uncommitted candidate is required; completed evidence is immutable and non-expiring; freshness is dispatch-only; self/future hash and ledger dependencies are prohibited. The stated minimum evidence record carries role provenance without creating another authority source, and report hashes are external references. |
| C-4 — quantified simplification | **CLOSED** | The before/after inventory fixes the requested baselines and targets: approximately 28 to 10 production modules, 6 to 2 future live hook entrypoints, one SSOT, four states, one candidate mechanism, one policy evaluator, one dispatch freshness evaluator, and zero independent Codex/Claude policy implementations. It also requires functional justification for retained modules and focused validation evidence. |
| C-5 — atomic persistence and bounded recovery | **CLOSED** | The contract requires validation before deterministic serialization, same-directory/filesystem temporary persistence, supported flush/sync, atomic replace, fresh-read validation and fail-closed behavior after uncertain replacement, and never making invalid state authoritative. Recovery is confined to provably canonical `INACTIVE`; active/corrupt/ambiguous state and all authority/evidence reconstruction fail closed, with fixtures/temp directories only. |

## Required supplement

Clarify the C-2 External Hard Stop wording before `open` so it cannot deny the
only implementation writes WB-033 admits. Replace the unqualified
`controller activation or change` item with a boundary such as **controller
activation, materialization, or live controller/control-surface change**.
State explicitly that inert source refactoring inside
`.agent/controllers/v1/**` remains an ordinary local source write and is
allowed only under the existing active-Work-Block, `READY` gate, exact branch,
valid-state, and exact-write-set predicates.

This is a wording and test-case clarification, not permission to activate the
controller or change the live control surface. It retains the intended hard
stop while resolving the direct conflict between the External Hard Stop row
and the admitted source write-set.

## Scope sanity check

- The exact source write-set remains `.agent/controllers/v1/**`.
- Activation, materialization, push execution, and live-hook changes remain
  out of scope.
- No WB-029/030/032 deadlock requirement reappears: there is no OS-root
  read-only demand, mandatory native-subagent security boundary,
  self-referential ledger, cryptographic Owner signature, completed-evidence
  freshness, or recursive bootstrap admission.
- A normal legacy `Controlled` Work Block remains sufficient. This rereview
  requires neither a capability/bootstrap layer nor an Owner cryptographic
  signature.

## Residual risk

Without the C-2 clarification, a literal evaluator can either deny every
permitted inert controller source edit or interpret “change” selectively. Both
outcomes create implementation variance at an authority boundary. No other
unclosed risk was found within the five prior Critic findings.

## Verdict

`SUPPLEMENT`

One concrete C-2 wording conflict must be resolved before the package is
precise enough to open the bounded `Controlled` Work Block.
