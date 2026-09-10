---
artifact_type: runtime_capability_evidence
work_block_id: WB-2026-09-09-subagent-topology-reconciliation
status: available
revision: v2-recovery
verified_at: 2026-09-10T08:11:04Z
runtime: codex
adapter: multi_agent_v1
adapter_version: runtime-provided
probe_event_ref: native_dispatch:01a08a55-ba9c-7ea3-9835-6d5e77386b8f,native_dispatch:01a08a5b-23ae-7013-9316-f3628692c02b,native_dispatch:01a08a5d-ec97-7cc1-a885-05b5291a4a69
critic_probe_event_ref: native_dispatch:01a08a55-ba9c-7ea3-9835-6d5e77386b8f
reviewer_probe_event_ref: native_dispatch:01a08a5d-ec97-7cc1-a885-05b5291a4a69
verifier_probe_event_ref: native_dispatch:01a08a5b-23ae-7013-9316-f3628692c02b
repository_root: /tmp/azursystech-wb-subagent-topology-reconciliation-026-r1
branch: feat/subagent-topology-reconciliation-026-r1
baseline: 39a059394aacf70c0c6cb68e3dc947891788f112
---

# Capability preflight — Subagent topology reconciliation

## Recovery result

The fresh recovery capability probes report `native_subagents: available`.
Each probe observed the exact recovery session root
`/tmp/azursystech-wb-subagent-topology-reconciliation-026-r1`, branch
`feat/subagent-topology-reconciliation-026-r1`, and baseline
`39a059394aacf70c0c6cb68e3dc947891788f112` without a shell-local rebind or
repository mutation.

The current role-labeled capability ledger is:

| Role | Probe event / execution ID | Status | Reusable as assurance binding |
|---|---|---|---|
| Critic | `native_dispatch:01a08a55-ba9c-7ea3-9835-6d5e77386b8f` | observed | No |
| Reviewer | `native_dispatch:01a08a5d-ec97-7cc1-a885-05b5291a4a69` | observed | No |
| Verifier | `native_dispatch:01a08a5b-23ae-7013-9316-f3628692c02b` | observed | No |

The three probe IDs are distinct and are not assurance bindings. Probe status
observed a dirty tree only because the Orchestrator had already made the
approved recovery coordination edits to `.agent/active-work-block.json` and
this report; the probes themselves changed no files.

The native tool exposes execution IDs but no separate platform session ID.
Evidence therefore uses `context_id_source: execution_id` and does not promote
shell PIDs or requested model settings to identity evidence. The probes prove
native dispatch availability and inherited root correctness; they do not prove
OS, process, user, mount, or independent-filesystem isolation.

## Required separation

The selected policy is `native-separate-context-required` for the required
`critic`, `reviewer`, and `verifier` roles. Capability probes are aggregate
availability evidence and remain separate from role assurance bindings. Every
assurance binding must carry its own single `native_dispatch:<execution_id>`
reference and must not reuse one of the three probe references above.

## Evidence limits and freshness

The capability evidence is valid only for the recorded runtime, adapter,
adapter version, repository root, branch, baseline, and freshness window. Any
runtime, adapter, root, branch, Work Block, or revision change invalidates the
record. A failed required launch is `DEGRADED` and cannot be replaced by
main-thread assurance.

## Historical original execution evidence

The original worktree `/tmp/azursystech-wb-subagent-topology-reconciliation-026`
and branch `feat/subagent-topology-reconciliation-026` are blocked execution
evidence only. Earlier probe IDs and reports rooted there are historical and
are not current recovery capability or assurance evidence. The recovery
baseline is the exact commit recorded in the frontmatter above.

The prior session-root inheritance failure and the partial-validator
fail-closed recovery deadlock remain recorded in Process Feedback. This
recovery does not introduce a generic recovery lane or weaken any guard.
