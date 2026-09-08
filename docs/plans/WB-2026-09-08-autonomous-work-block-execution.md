---
artifact_type: work_block
work_block_id: WB-2026-09-08-autonomous-work-block-execution
status: in_progress
revision: v1
---

# Plan — WB-2026-09-08-autonomous-work-block-execution

## Objective and authority

The 2026-09-08 Owner instruction approves a bounded governance change: ordinary
non-force publication of the exact isolated Work Block subject branch becomes
part of autonomous execution after required assurance. It does not authorize a
merge, deployment, protected/default branch mutation, force/history rewrite,
remote deletion, tag/release, or other irreversible external effect.

`governance/authority.md` will be the sole authority source. This plan, task
list, workflow, templates, runtime adapters, and engineering memory are derived
or operational artifacts and cannot expand the authority boundary.

## Stages

1. Define: freeze the subject baseline; create the specification, plan,
   traceable tasks, requirements-quality review, consistency record, and
   independent Critic result.
2. Execute: one Coder updates only the approved governance/runtime/template/test
   write set. Corrective loops remain autonomous while inside the approved
   boundary.
3. Assure: freeze the diff; obtain independent read-only Review and Verification;
   fix focused findings and repeat affected assurance.
4. Close: synchronize Work Block state and evidence, commit the exact candidate,
   non-force push only the matching subject branch, and report it to the Owner
   for `MERGE / REVISION / REJECT`.

## Write set

- `AGENTS.md`, `PROJECT_MAP.md`, `FILE_REGISTRY.yml`
- `governance/authority.md`, `governance/lifecycle.md`, `governance/artifacts.md`
- `.agent/active-work-block.json`, `.agent/active-work-block.default.json`,
  `.agent/authorizations/README.md`, `.agent/hooks/hard_stop_policy.py`,
  `.agent/workflows/sdd-protocol.md`, `.agent/workflows/owner-controlled-github-flow.md`
- `.codex/hooks/hard-stop.sh`, `.codex/hooks/hard_stop_policy.py`, `.codex/AGENTS.md`,
  `.codex/hooks/pre_tool_use_policy.py`, `.codex/scripts/lifecycle.py`,
  `.codex/write-gate.md`
- `.claude/hooks/work_block_gate.py`, `.claude/hooks/tests/hard-stop-fixtures.sh`
- `.opencode/agents/{architect,coder,critic,reviewer,verifier}.md`,
  `.opencode/agents/build.md`, `opencode.json`
- `docs/templates/work-block-template.md`,
  `docs/engineering-memory/github-free-owner-controlled-flow.md`,
  `docs/engineering-memory/README.md`, `docs/engineering-memory/source-of-truth-chains.md`
- `scripts/test-github-capability-control-plane.py`,
  `scripts/test-github-capability-github-cli-hard-stops.py`,
  `.codex/hooks/tests/hard-stop-fixtures.sh`
- `docs/specs/WB-2026-09-08-autonomous-work-block-execution.md`,
  `docs/plans/WB-2026-09-08-autonomous-work-block-execution.md`,
  `docs/tasklist/WB-2026-09-08-autonomous-work-block-execution.tasklist.md`,
  `docs/reports/**`, `.agent/critic-gate.md`, `.agent/verification-gate.md`

## Hard stops

Owner-controlled: material scope/authority or architecture expansion, default or
protected branch update, force/non-fast-forward/broad/mirror/prune/delete push,
tags/releases, merge, deployment, live infrastructure/data, credentials/secrets,
client/business mutation, and destructive operations. The authorized ordinary
push is limited to this Work Block's exact non-default `subject_branch` after
all required assurance is READY.

## Assurance plan

The Critic, Reviewer, and Verifier are read-only delegated roles. The test matrix
must include positive exact-subject push authorization and negative coverage for
all retained hard stops; it must also exercise lifecycle/default-state and
Define-quality consistency. `python3` control-plane tests, traceability,
release-state contracts, JSON/shell syntax, `git diff --check`, scoped path
inspection, and secret-pattern inspection are required. Evaluation is not
required because the change is deterministic control-plane behavior.
