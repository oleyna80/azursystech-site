---
artifact_type: specification
work_block_id: WB-2026-09-09-subagent-topology-reconciliation
status: approved
revision: v1
baseline: 39a059394aacf70c0c6cb68e3dc947891788f112
---

# Specification — Subagent topology reconciliation

## Objective

Reconcile the repository's lifecycle, runtime, and assurance contracts so a
non-trivial `Managed` or `Assured` Work Block requires evidenced separate
native execution contexts for Critic, Reviewer, and Verifier whenever the
native capability is available. The contract must fail closed on unknown,
failed, stale, reused, or self-declared evidence and must preserve the actual
degraded condition when the capability is unavailable.

This is a control-plane change only. It does not change application behavior,
deployment behavior, database behavior, credentials, dependencies, or the
authority boundary for merge or deployment.

## Definitions and policy

- A Work Block is **non-trivial** for this contract when its governance profile
  is `Managed` or `Assured` and `non_trivial: true` is recorded in its active
  state. The selected target profile is `Assured`.
- **Native available** means a current capability probe has successfully
  launched the native subagent facility and has evidenced distinct execution
  contexts capable of read-only Critic, Reviewer, and Verifier roles. A
  bootstrap profile or an agent's assertion alone is not a probe.
- **Separate context** means a distinct native execution identifier for each
  required role. `context_id` is recorded as a second platform identifier when
  the runtime exposes one; otherwise it is a normalized alias of the execution
  identifier with `context_id_source: execution_id`. The contract never invents
  a second identifier. This is role-context separation only: it does not claim
  an independent OS process, user, mount, or repository root.
  `independent-readonly-root` and `os-isolated` remain stronger, separately
  evidenced tiers.
- A native launch with an unavailable, unknown, conditional, or failed result
  is never recorded as native success. A fallback may be recorded as
  `same-session-degraded`, with `DEGRADED` status and promotion blocked for an
  Assured closeout; it may not be silently replaced by main-thread assurance.

## Profile and promotion matrix

| Profile | Applicability | Native capability available | Capability unavailable/unknown/launch failed | Promotion rule |
|---|---|---|---|---|
| `Managed` | `non_trivial: true` | Native Critic, Reviewer, and Verifier contexts with unique IDs and complete evidence are required | Record explicit `DEGRADED`; no native claim and no main-thread substitution; closeout is reporting-only until evidence is restored | `READY` only with all three valid bindings |
| `Assured` | `non_trivial: true` | Same three role-context bindings are required; this is role separation, not an OS/root security claim | Record explicit `DEGRADED`; no native claim and no main-thread substitution; successful closeout is blocked | `READY` only with all three valid bindings plus frozen-revision match; stronger `independent-readonly-root` remains required when a sensitive-domain contract calls for it |

The topology contract and the security-isolation tier are separate dimensions:
distinct native execution contexts satisfy role separation, but do not upgrade
`same-session-degraded` to `independent-readonly-root` or `os-isolated`.

This Work Block makes the requested policy delta explicit: for non-trivial
`Managed` and `Assured` work, valid native role-context bindings are sufficient
for the *role-separation* admission dimension. The existing stronger isolation
requirement is not superseded: a sensitive-domain contract still requires
`independent-readonly-root` or `os-isolated`, and the stored isolation value
remains `same-session-degraded` when no stronger root/session evidence exists.
The closeout gate must therefore evaluate topology tier and security-isolation
tier independently; allowing a valid native role binding is not a security
boundary downgrade.

## Evidence authority and freshness

The native multi-agent runtime dispatch result is the authoritative source for
execution IDs. The Orchestrator records the returned ID, role, and observable
root/branch/revision in the active state and report; role prose is not accepted
as a substitute. Capability evidence is valid for 24 hours from its
`verified_at` timestamp and is invalidated by a runtime/adapter change, a
different repository root, or a failed launch. A role binding is invalidated by
Work Block ID, branch, root, or source/frozen revision change, by role/context
reuse, or by a new lifecycle open. UTC timestamps are the clock source.

The capability report and role-binding records are coordination evidence. The
active lifecycle validator is the admission authority for the cooperative
repository gate; it cannot prove a host-level security boundary.

The evidence schema has three non-interchangeable references. Aggregate
capability evidence is a comma-separated ledger of distinct
`native_dispatch:<execution_id>` probe references. Each role binding contains
exactly one structurally valid `native_dispatch:<execution_id>` assurance
reference, and that execution ID must differ from every capability probe ID and
from every other role binding ID. A binding's runtime, adapter, and
adapter-version tuple must equal the capability tuple, and the binding's
report path must equal the report path recorded for that role. These checks are
required at admission and closeout; a non-empty string alone is not evidence.

## Requirements

- REQ-001: Applicability and topology selection

The lifecycle must identify the governance profile, non-trivial flag,
capability result, selected topology policy, and required role bindings before
implementation. For an applicable Work Block with native capability available,
the selected policy is `native-separate-context-required` and the required
roles are exactly `critic`, `reviewer`, and `verifier`.

- REQ-002: Capability fail-closed behavior

Capability states are `available`, `unavailable`, `conditional`, `unknown`,
and `launch_failed`. Only `available` permits native topology promotion. The
other states require an explicit degraded record containing the state and
reason; missing or ambiguous capability evidence blocks assurance admission.

- REQ-003: Role evidence contract

Each required role binding records the Work Block ID, role, execution ID,
context ID (or the execution-ID alias), `context_id_source`, runtime, adapter
and adapter version, source/frozen revision, repository root, branch,
read-only boundary evidence, launch mechanism, topology tier, probe event
reference, report path, status, and an RFC3339 UTC observed timestamp.
Required bindings must have distinct native execution IDs, one role per
binding, matching revisions, and report linkage. A second context ID is
required only when the platform actually exposes one; an alias must be marked
explicitly and cannot be used to claim stronger isolation. The
orchestrator/runtime event path is the evidence authority; role reports cannot
self-certify native capability or isolation.

- REQ-004: Runtime and lifecycle enforcement

The active pre-tool gate must reject implementation writes when the applicable
Critic binding is absent, stale, reused, mismatched, degraded, or based on a
non-native claim while native capability is available. Freeze/close validation
must reject missing or invalid Reviewer/Verifier bindings and must validate the
frozen revision. The subagent-start context adapter must expose observable
execution/root metadata without treating a declared label as proof of stronger
isolation.

- REQ-005: Adversarial regression coverage

Deterministic tests must prove both positive admission and denial of: absent
capability evidence, unknown capability, launch failure, reused execution or
context IDs, duplicate roles, same-session overclaim, stale Work Block,
mismatched frozen revision, and missing report linkage. The recovery-specific
negative fixtures are explicit and mandatory: capability/runtime/adapter/
adapter-version tuple mismatch; malformed, non-native, empty, or multi-value
role dispatch references; malformed, duplicate, or non-native aggregate probe
ledgers; reuse of an aggregate probe ID as an assurance execution ID; Critic
binding/report mismatch at admission; and Reviewer/Verifier binding/report
mismatch at closeout. The valid path must use distinct capability probes and
distinct assurance dispatch IDs.

- REQ-006: Process Feedback

The failed first-session execution is recorded as current Work Block friction
only if the canonical Process Feedback evidence contract is satisfied. The
observation is classified conservatively as tooling/environment friction:
session-root inheritance prevented the scoped Coder from mutating the intended
isolated worktree; the mutation was correctly blocked; no guard weakening is
proposed.

- REQ-007: Compatibility and boundaries

Historical closeouts and non-applicable lightweight Work Blocks remain valid
under their existing contracts. No application source, route, sitemap,
database/schema, deployment, secret, dependency, merge, or destructive cleanup
is included in this Work Block.

- AC-001 [req=REQ-001,REQ-007]: The specification, active state, lifecycle, authority, roster, and runtime capability documents use one topology vocabulary and applicability rule.
- AC-002 [req=REQ-001,REQ-002,REQ-003]: A native capability probe and three distinct role executions are represented with complete, matching, non-reused evidence.
- AC-003 [req=REQ-002,REQ-004,REQ-005]: The active write gate and closeout path reject every listed generic and recovery-specific adversarial fixture and accept the valid path with distinct capability and assurance evidence.
- AC-004 [req=REQ-003,REQ-004]: The runtime context adapter records observable root/identity metadata and does not overclaim process or OS isolation.
- AC-005 [req=REQ-004,REQ-005]: Focused contract tests, release-state validation, Drift, Reviewer, and Verifier all pass for the frozen candidate.
- AC-006 [req=REQ-006,REQ-007]: Process Feedback contains the bounded failed-session observation and no unrelated historical artifact is changed.

## Acceptance criteria details

- AC-001: The specification, active state, lifecycle, authority, roster, and
  runtime capability documents use one topology vocabulary and applicability
  rule.
- AC-002: A native capability probe and three distinct role executions are
  represented with complete, matching, non-reused evidence.
- AC-003: The active write gate and closeout path reject every listed generic
  and recovery-specific adversarial fixture and accept the valid path with
  distinct capability and assurance evidence. Coverage includes tuple
  mismatch, malformed or multi-value dispatch references, malformed/duplicate
  aggregate probe ledgers, aggregate-probe reuse, Critic report mismatch, and
  Reviewer/Verifier report mismatch.
- AC-004: The runtime context adapter records observable root/identity metadata
  and does not overclaim process or OS isolation.
- AC-005: Focused contract tests, release-state validation, Drift, Reviewer,
  and Verifier all pass for the frozen candidate.
- AC-006: Process Feedback contains the bounded failed-session observation and
  no unrelated historical artifact is changed.
