---
artifact_type: runtime_capability_evidence
work_block_id: WB-2026-09-09-subagent-topology-reconciliation
status: available
revision: v1
verified_at: 2026-09-09T20:46:09Z
runtime: codex
adapter: multi_agent_v1
adapter_version: runtime-provided
probe_event_ref: native_dispatch:01a087d5-b5c7-7e60-aa27-c00b2f98df1c,native_dispatch:01a087df-18c4-7ba0-8093-df520c8ce8c9,native_dispatch:01a087df-1795-75f2-97ae-4b301ecbceaa
critic_probe_event_ref: native_dispatch:01a087d5-b5c7-7e60-aa27-c00b2f98df1c
reviewer_probe_event_ref: native_dispatch:01a087df-18c4-7ba0-8093-df520c8ce8c9
verifier_probe_event_ref: native_dispatch:01a087df-1795-75f2-97ae-4b301ecbceaa
---

# Capability preflight — Subagent topology reconciliation

## Bounded probe result

`native_subagents: available`. The native dispatch facility successfully
launched separate read-only Critic executions in this continuation. The first
execution ID is `01a087c3-9548-7ba0-b368-cd33a4090b93`; the fresh Define Critic
execution ID is `01a087cc-e1cc-7ff3-bc2a-48ab02c90bf6`; and the latest Define
Critic execution ID is `01a087d5-b5c7-7e60-aa27-c00b2f98df1c`. These are the
actual identifiers returned by the native dispatch tool.

The bounded role-capability probe is tracked separately from assurance
bindings. Its current event ledger is:

| Role | Probe event / execution ID | Status | Reusable as assurance binding |
|---|---|---|---|
| Critic | `native_dispatch:01a087d5-b5c7-7e60-aa27-c00b2f98df1c` | observed | No |
| Reviewer | `native_dispatch:01a087df-18c4-7ba0-8093-df520c8ce8c9` | observed | No |
| Verifier | `native_dispatch:01a087df-1795-75f2-97ae-4b301ecbceaa` | observed | No |

All three required role probes returned from the native dispatch event source,
so the facility is available for the role-context matrix. The three probe IDs
are distinct and are explicitly prohibited from reuse as assurance bindings.

The Critic, Reviewer, and Verifier probe executions each reported the actual repository root as
`/tmp/azursystech-wb-subagent-topology-reconciliation-026`, branch
`feat/subagent-topology-reconciliation-026`, and the expected baseline
`cafd2733e489d0d2a91553e70294d99d243046c0`. They reported no project-file
changes. The native tool exposes agent execution IDs but no separate platform
session identifier. Evidence records therefore use `context_id_source:
execution_id` when no second platform identifier is exposed; this report does
not invent one. The Orchestrator-visible dispatch IDs are the authoritative
execution IDs. Reviewer and Verifier child reports observed only shell PID 2,
which is not promoted to a platform identity.

The model/reasoning values in the mission briefs are requested role-profile
defaults from the dispatch contract, not runtime-observed effective-model
evidence. The adapter did not expose an effective model field, so none is
claimed here.

## Selected policy

`native-separate-context-required` for non-trivial `Managed`/`Assured` Work
Blocks. Required bindings: `critic`, `reviewer`, `verifier`. The observed
native contexts are distinct at the execution boundary, while their repository
root is the same approved worktree. This proves role-context separation only;
it does not prove `independent-readonly-root`, process, user, mount, or OS
isolation.

## Evidence limits and freshness

The probe is runtime dispatch evidence, not a self-authored role claim. The
24-hour freshness window, UTC clock, and invalidation on adapter/runtime/root
change, failed launch, Work Block reopen, or revision mismatch are defined by
the specification. A missing or unknown capability result is not promoted to
available. A failed required launch must be recorded as `DEGRADED` and cannot
be replaced by main-thread assurance. A capability probe execution is never
reused as a Critic, Reviewer, or Verifier assurance binding.

## Prior failed-session evidence

The resume instruction supplies the prior attempt’s observed condition:
session-root inheritance left parent/child execution bound to the canonical
checkout, so the scoped Coder could not mutate this intended worktree; the
guard correctly blocked the mutation. No raw prior event artifact is present
in this repository, so the observation is retained as Owner-supplied resume
evidence and classified conservatively in Process Feedback; it is not treated
as independently replayed runtime proof.
