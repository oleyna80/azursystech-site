# Plan — WB-2026-09-06-video-generator-transaction-contract

- **Work Block:** `WB-2026-09-06-video-generator-transaction-contract`
- **Baseline:** `e1f9d59cde75a233641f310414b206dfa84b6ead`
- **Subject branch:** `feat/video-generator-transaction-contract-018`
- **Historical source:** `codex/media-production-skills-curation@00cd532d...`
- **Mode:** bounded AzurSysTech implementation; no provider execution

## Stages

1. Define the requirements, acceptance criteria, write-set, and lifecycle record.
2. Compare current and historical video-generator contracts read-only.
3. Implement the current-main skill and safe declarative transaction template.
4. Run Critic, Review, Verification, and Drift checks.
5. Close the WB through the canonical helper and publish only after Owner gate.

## Bounded write set

```text
.agent/active-work-block.json
.agent/critic-gate.md
.agent/verification-gate.md
.codex/write-gate.md
.agent/skills/video-generator/SKILL.md
.agent/skills/video-generator/reference/provider-transaction-record.template.yml
docs/specs/WB-2026-09-06-video-generator-transaction-contract.md
docs/plans/WB-2026-09-06-video-generator-transaction-contract.md
docs/tasklist/WB-2026-09-06-video-generator-transaction-contract.tasklist.md
docs/reports/*WB-2026-09-06-video-generator-transaction-contract*
```

## Hard stops

Stop if the exact baseline or historical reference changes unexpectedly, if
application/framework/provider paths are needed, if secrets appear, or if any
provider call, deployment, merge, deletion, or other out-of-scope action is
required.
