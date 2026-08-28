---
artifact_type: work_block
work_block_id: WB-2026-08-28-repository-lifecycle-normalization
status: in_progress
revision: v1
---

# Work Block Plan: Repository Lifecycle Normalization

## Objective and result

Normalize repository-owned lifecycle state after the completed shared-context
work. The result is one active Work Block, a passing release-state contract, a
truthful completed predecessor, and operational branch/worktree manifests that
recommend but do not execute any external or destructive cleanup.

## Scope

Lifecycle SSOT, Define and assurance evidence, release-contract test/workflow,
safe memory records, and read-only inventory reports. The only historical
content normalized is the completed shared-context plan and its canonical
closeout projection.

## Exclusions and stops

No push, GitHub mutation, remote deletion, worktree prune/remove, merge,
deployment, product/runtime change, credentials, dependencies, or canonical
dirty-checkout modification. A manifest never authorizes its own execution.

## Write-set

`.agent/active-work-block.json`, `.agent/critic-gate.md`,
`.agent/verification-gate.md`, `.codex/write-gate.md`, `FILE_REGISTRY.yml`,
`PROJECT_MAP.md`, the matching specification/plan/tasklist/reports, the prior
shared-context plan and canonical closeout, `scripts/test-release-state-contracts.py`,
`.github/workflows/release-state-contract.yml`, and the four allowlisted
`memory_bank/*.md` records.

## Implementation plan

1. Define and record the Critic supplement and explicit classification rules.
2. Restore the release-state projection and minimum contract enforcement.
3. Replace stale active lifecycle records with this Work Block and capture audit manifests.
4. Run full local assurance, then create a scoped local commit and hand off the exact SHA.

## Final State

Pending Stage 2 assurance and local commit; no provider-state assertion belongs
in this Work Block.
