---
artifact_type: work_block
work_block_id: WB-2026-08-28-repository-lifecycle-normalization
status: completed
revision: v3
---

# Work Block Plan: Repository Lifecycle Normalization

## Objective and result

Normalize repository-owned lifecycle state after the completed shared-context
work. The result is one active Work Block, a passing release-state contract, a
truthful completed predecessor, and operational branch/worktree manifests that
recommend but do not execute any external or destructive cleanup.

## Scope

Lifecycle SSOT, Define and assurance evidence, release-contract test/workflow,
specification identity binding, safe memory records, and read-only inventory
reports. The only historical content normalized is the completed shared-context
specification, plan, and canonical closeout projection.

## Exclusions and stops

No push, GitHub mutation, remote deletion, worktree prune/remove, merge,
deployment, product/runtime change, credentials, dependencies, or canonical
dirty-checkout modification. A manifest never authorizes its own execution.

## Write-set

`.agent/active-work-block.json`, `.agent/critic-gate.md`,
`.agent/verification-gate.md`, `.codex/write-gate.md`, `FILE_REGISTRY.yml`,
`PROJECT_MAP.md`, the matching specification/plan/tasklist/reports, the prior
shared-context specification/plan and canonical closeout, `scripts/test-release-state-contracts.py`,
`scripts/validate-release-state.py`, `.github/workflows/release-state-contract.yml`, and the four allowlisted
`memory_bank/*.md` records.

## Implementation plan

1. Define and record the Critic supplement and explicit classification rules.
2. Restore the release-state projection and minimum contract enforcement.
3. Replace stale active lifecycle records with this Work Block and capture audit manifests.
4. Cross-check the operational active record against the canonical registry/Map/plan
   projection and cover each mismatch direction with disposable real-validator fixtures.
5. Bind the operational specification frontmatter to the canonical active Work Block
   identity and cover wrong-existing-specification, artifact-type, and frontmatter failures.
6. Trigger the release contract for specification changes and simulate content,
   deletion, and rename path sets deterministically.
7. Run fresh local assurance, then create a scoped local commit and hand off the exact SHA.

## Final State

- **Stage state:** completed
- **Review gate:** READY
- **Verification verdict:** READY
- **Evaluation verdict:** SKIPPED — deterministic repository-lifecycle normalization has no generative or rubric-based deliverable.
- **Drift gate:** ALIGNED
- **Closeout mode:** success-closeout
- **Task status:** completed

Repository closeout is canonical repository evidence. External VCS state remains
non-normative and is not asserted by this terminal state.
