# Specification — WB-2026-09-06-media-production-skills-curation-disposition

## Objective

Perform a read-only disposition audit of remote branch
`codex/media-production-skills-curation` against the exact current
`origin/main`, separating historical lifecycle evidence from application and
media payloads before deciding whether the branch should be archived, deleted,
or replaced by bounded future Work Blocks.

## Frozen boundary

- Base: `c9dbff15902d2e83ef1252fc3dd7d6a6b962be03`
- Subject branch: `audit/media-curation-disposition-017`
- Remote target under audit: `codex/media-production-skills-curation`
- Target SHA at audit start: `00cd532d7e3ca57751dcdc71b8fc5ad8af3e48e8`
- Side-effect class: read-only repository/GitHub inspection plus coordination
  evidence writes in this Work Block only.
- Production impact: none.

## In scope

- commit ancestry, changed-path and object-size analysis;
- comparison with current `origin/main`;
- lifecycle plans, tasklists, critic/review/verification reports and gate state;
- determination of merged, superseded, incomplete, or unverified work;
- assessment of application/media payload only for disposition, not modification;
- reports, plan, tasklist, and lifecycle coordination SSOT required to close.

## Out of scope

- changes to `web/`, `admin/`, or `showcase/`;
- media generation, transcoding, visual editing, or asset replacement;
- dependency, hook, script, config, environment, or architecture changes;
- deployment, provider calls, credentials, publication, merge, push, or branch
  deletion.

## Required result

Produce evidence-backed disposition recommendations for the remote branch and
each discovered Work Block family, with explicit confidence, blockers, and
bounded follow-up Work Blocks where functional value remains.
