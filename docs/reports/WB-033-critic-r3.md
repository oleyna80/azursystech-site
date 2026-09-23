# WB-033 Final Narrow Critic Check (r3)

## Review record

- **Work Block:** `WB-033`
- **Reviewed specification revision:** `WB-033-r1`
- **Reviewed branch:** `feat/governance-recovery-033`
- **Reviewed baseline HEAD:** `3ea13015e196516a65cdcb58fff455370d66cda0`
- **Reviewed files:** `docs/specs/WB-033.md`, `docs/plans/WB-033.md`,
  `docs/tasklist/WB-033.tasklist.md`, `docs/reports/WB-033-critic.md`, and
  `docs/reports/WB-033-critic-r2.md`.
- **Review scope:** closure of remaining finding C-2 only; no full
  architecture rereview.
- **Isolation method:** designated separate Git worktree with read-only
  artifact review, pre/post SHA-256 comparison, and Git path checks. This is
  mutation detection, not an OS-enforced read-only boundary.

## C-2 closure result

**CLOSED.** The policy decision contract now has a precise, non-conflicting
boundary between permitted inert source work and the External Hard Stop.

### Ordinary inert source work

The specification explicitly states that refactoring the inert package inside
the exact `.agent/controllers/v1/**` write-set is not an External Hard Stop.
It can be allowed only for an active Work Block with a `READY` write gate, the
exact subject branch, a valid lifecycle state, a target inside the admitted
write-set, no materialization or activation, no live hook/runtime/
configuration/control-surface change, and no other External Hard Stop.

### Activation and live-control boundary

The External Hard Stop now starts at controller activation, materialization,
installation or copying into live hook/runtime paths, live controller
configuration change, or live control-surface change. The specification also
states directly:

> Editing the inert controller source package is not controller activation.
> Activation begins only when controller artifacts are installed,
> materialized, referenced by, or otherwise connected to live
> runtime/control-surface paths.

The ordinary source allowance expressly excludes `.agent/hooks/**`,
`.codex/**`, `.claude/**`, `.agent/active-work-block.default.json`,
`.agent/controller-manifest.json`, and every other live/runtime/control-surface
path.

### Remaining hard stops and publication

Protected/default-branch mutation, merge, deploy, force push,
credentials/secrets operations, production/live-data operations,
infrastructure mutation, explicit governance override, and source writes
outside the admitted write-set remain External Hard Stops without separate
authority.

The correction does not create generic push permission. A possible future
subject-branch publication decision remains limited to the exact non-default,
non-protected subject branch; non-force exact publication; an exact assured
candidate; Reviewer and Verifier `READY`; and absence of every External Hard
Stop. WB-033 itself still does not execute push.

## Previously closed findings

C-1 lifecycle transition contract, C-3 candidate/evidence identity, C-4
quantified simplification, and C-5 atomic persistence/bounded recovery remain
closed. This narrow review found no direct contradiction that reopens them.

## Scope confirmation

- The source write-set remains exactly `.agent/controllers/v1/**`.
- Activation and live-hook changes remain out of scope.
- A normal legacy `Controlled` Work Block remains sufficient.
- No capability/bootstrap layer or cryptographic Owner signature is required.

## Residual risks

Normal implementation and assurance risk remains: the implementation must
exercise the defined policy cases through focused tests and keep source edits
inside the admitted write-set. No remaining coordination-package ambiguity in
C-2 requires supplementation before `open`.

## Verdict

`APPROVE`

The coordination package is precise and safe enough to open the bounded
`Controlled` source Work Block. This review neither opens it nor authorizes
activation, publication, or a live control-surface change.
