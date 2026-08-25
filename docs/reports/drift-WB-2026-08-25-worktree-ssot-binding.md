# Drift assessment — WB-2026-08-25-worktree-ssot-binding

## Verdict

`ALIGNED`

## Compared subject

- Specification: `docs/specs/WB-2026-08-25-worktree-ssot-binding.md` revision `v1`
- Base: `5d3f3115d14fa715c7e06839aac092da5e4a8819`
- Frozen implementation head: `55b9c8f1440494a29e7d3aea291b9bbc8f270b7f`
- Isolation: `same-session-degraded`, with changed-file inventory and deterministic checks supplied by GitHub.

## Scope alignment

The implementation remains inside the declared control-plane scope:

- default active Work Block state;
- lifecycle helper;
- Codex and Claude write hooks;
- executable control-plane fixtures;
- Owner-controlled workflow documentation;
- Work Block specification/plan/tasklist/reports and gate records.

No web/application source, SEO/content, database, deployment workflow, production configuration, credential material, or client-facing surface is part of the candidate diff.

## Requirement alignment

- `event.cwd` remains the runtime session identity input; no absolute worktree path is persisted.
- `subject_branch` is the durable gate binding key.
- source and normal coordination writes require binding equality.
- missing branch, detached HEAD, and branch mismatch fail closed.
- direct repair of `.agent/active-work-block.json` is preserved.
- diagnostics expose root/branch/HEAD/work_block_id and the command-local-`cd` limitation.
- lifecycle opens source work only on an attached non-default branch and records that branch.
- linked-worktree tests cover independent gates and stale cross-worktree denial for both Codex and Claude.
- documentation explicitly separates worktree creation from Work Block lifecycle closeout.

## Non-goal check

No global worktree lock, lease daemon/database, absolute-path registry, automatic closure of other Work Blocks, or change to GitHub merge/deploy/production authority was introduced.

No specification drift requires a return to Define.
