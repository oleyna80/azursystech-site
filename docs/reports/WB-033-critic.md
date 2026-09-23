# WB-033 Independent Critic Review

## Review record

- **Work Block:** `WB-033`
- **Reviewed specification revision:** `WB-033-r1`
- **Reviewed branch:** `feat/governance-recovery-033`
- **Reviewed baseline HEAD:** `3ea13015e196516a65cdcb58fff455370d66cda0`
- **Session/runtime:** Codex `/root` Critic session; Linux/WSL repository
  worktree. No separately attestable runtime-session identifier was exposed.
- **Actual isolation method:** the designated, separate Git worktree plus
  read-only review of the coordination artifacts; pre/post Git path checks and
  SHA-256 comparisons. This is mutation detection, not enforced OS-level
  read-only isolation.
- **Scope reviewed:** `docs/specs/WB-033.md`, `docs/plans/WB-033.md`, and
  `docs/tasklist/WB-033.tasklist.md` only. No controller source was inspected
  or changed.

## Positive findings

1. The package has a narrow, correct implementation boundary:
   `.agent/controllers/v1/**`. It expressly keeps v1 inert and excludes
   activation, materialization, live hooks, live SSOT, manifests, and runtime
   policy files.
2. It does not reintroduce the WB-029/030/032 deadlocks. In particular, it
   neither demands OS-root read-only enforcement nor treats a native subagent
   as a security boundary; it excludes an admission ledger and cryptographic
   Owner signature; it limits freshness to new dispatch; and it does not
   create recursive controller-bootstrap admission.
3. The intended invariants include the required core properties: a single
   active Work Block, generation pinning, candidate identity, immutable
   evidence, dispatch-only freshness, rework, three closeout outcomes,
   fail-closed behavior, bounded inactive recovery, canonical Codex/Claude
   policy, atomic persistence, and no self-hosting.
4. The plan correctly treats Codex and Claude adapters as normalization layers
   rather than independent policy evaluators, and it explicitly requires
   live-control-surface and inertness validation.

## Findings requiring supplementation

### C-1 — Lifecycle and closeout semantics are asserted, not specified

The specification requires one state machine and reachable closeouts, but it
does not define the target state/transition table. The plan and tasklist do
not say which events and guards implement
`INACTIVE -> DEFINE -> EXECUTE -> ASSURE -> INACTIVE`, how Reviewer and
Verifier rework return to execution, or how `success`, `reporting_only`, and
`cancelled` each reach closeout. Consequently an implementation can satisfy
the prose while producing incompatible transitions or treating Reviewer and
Verifier as durable lifecycle states.

### C-2 — The policy contract for `git push` is insufficiently bounded

“Push” is listed as out of scope, while the plan only calls for tests of
“unsafe push forms.” This does not specify the required distinction between a
generic push allowance, an unconditional denial, and a policy-only decision
for authorized candidate publication. The supplied authority contract permits
only bounded non-force publication to the exact non-default subject branch
after the applicable assurance predicates; it never permits merge, protected
or default-branch mutation, force push, or broad publication. The coordination
package must preserve that distinction even though WB-033 itself must not run
`git push`.

### C-3 — Candidate/evidence non-recursion is not testable from the package

“One candidate identity,” immutable completed evidence, and no ledger are
stated as outcomes, but the artifacts do not define the authoritative identity
record, its binding, or the prohibited dependency shape. In particular, they
do not expressly prohibit a completed record from requiring its own future
hash/SHA (or another record’s future hash/SHA) to validate. That leaves the
non-recursive evidence guarantee under-specified.

### C-4 — Complexity reduction has no measurable acceptance boundary

The approximate target tree and “remove obsolete production modules” show the
desired direction, but no current-to-target inventory or acceptance evidence
exists for production-module count, policy entrypoints, authority identities,
lifecycle/status fields, freshness checks, or Codex/Claude policy
implementations. The package therefore cannot demonstrate that a historical
module boundary was removed because it was redundant rather than merely
relocated.

### C-5 — Atomic persistence and bounded inactive recovery lack an executable
contract

The plan correctly says not to reconstruct active authority or history from
damaged state, but it does not identify the allowed inactive recovery entry
condition, the exact invalid-state result, or the atomic write/replacement
guarantee that focused tests must prove. These are governance-preserving
properties and need a small, explicit contract rather than a general
implementation instruction.

## Risks

- Opening the Work Block before C-1 is corrected can permit an apparently
  simplified implementation that loses a rework or closeout path.
- Without C-2, an attempted repair of unconditional push denial can accidentally
  become a generic publication permission, or preserve a denial inconsistent
  with the controlled candidate-publication contract.
- Without C-3 through C-5, tests can pass locally while evidence validation,
  recovery, or claimed complexity reduction remains ambiguous.

## Required corrections before `open`

1. Add a compact lifecycle transition table to the specification and trace it
   into plan/tasklist tests: only `INACTIVE`, `DEFINE`, `EXECUTE`, and
   `ASSURE` are lifecycle states; Reviewer and Verifier are ordered evidence
   steps in `ASSURE`; give every rework edge and the guarded closeout edge for
   `success`, `reporting_only`, and `cancelled`.
2. Add a policy decision table for command evaluation. It must deny all
   ambiguous, force, protected/default-branch, merge, deploy, credential,
   production-data, infrastructure, and explicit-override operations. It may
   return an allow decision for a push only when the authority contract’s
   exact non-force subject-branch, exact-candidate, and assurance predicates
   are all true; WB-033 must still perform no publication. Trace both allowed
   and denied cases to focused tests.
3. Define the sole candidate-identity record and immutable completed-evidence
   record, including their binding fields and validation rules. State directly
   that completed evidence never expires, freshness is evaluated only when a
   new role is dispatched, and no record needs its own or a future record’s
   hash/SHA to be valid. Add corresponding negative tests.
4. Add a pre/post simplification inventory and acceptance assertions for the
   five requested reductions: production modules, policy entrypoints,
   authority identities, lifecycle/status fields, freshness checks, and
   Codex/Claude policy implementations. A retained module must have a stated
   functional reason; historical boundaries alone are insufficient.
5. Define the narrow recovery and persistence contract: allowable inactive
   recovery preconditions, rejection/fail-closed result for malformed or
   active state, atomic persistence behavior, and the fixture-only tests that
   demonstrate it without touching live SSOT.

## Verdict

`SUPPLEMENT`

The package has the right scope and avoids the prior deadlocks, but the five
specified corrections are necessary to make the target lifecycle, hard-stop
policy, evidence model, simplification claim, and recovery behavior precise
and safe enough to open a bounded source Work Block.
