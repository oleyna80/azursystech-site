# Work Block — Media Production Skills Curation

## Meta

- Work Block ID: `WB-2026-07-17-media-production-skills-curation`
- Branch: `codex/media-production-skills-curation`
- Work Block type: project-local skill curation; documentation/workflow only.
- Owner approval: curate and adapt the complete media-production suite; provider choice is deferred.
- Lifecycle: Stage 3 complete; verification verdict `READY`.
- Verification standard: independent review plus repository checks; no provider execution.
- Write gate: `READY` for the exact approved write set only.

## Objective

Bring the complete media-production skill suite from the verified framework revision into Azursystech as project-local, authority-bounded guidance for future paid website video work.

## Protected baseline

- Do not modify or stage `showcase/app/demo/immobilier/**`, `showcase/components/immobilier/**`, `showcase/public/demo/immobilier/**`, `showcase/next-env.d.ts`, `web/src/app/[locale]/_home-data.ts`, or `docs/plans/WB-2026-07-16-real-estate-demo-opendesign-handoff.md`.
- Owner confirmed parallel work on the immobilier project; all listed paths remain untouched.

## Verified source and provenance

- Source: `git@github.com:oleyna80/agentic-sdlc-framework.git`
- Source branch: `agent/media-production-skills`
- Pinned revision: `49850ff6fa0816bbe7feee2d54af2d792444bb5a`
- License: MIT.
- Pin exception: the source revision has no release tag. Owner approved this immutable SHA for this curation; replace it with a source release tag only in a separately approved maintenance change.

## Stage 0 preflight

`PREFLIGHT: Subagent-Required | local documentation/workflow write | database none | Hard Stops: provider config, credentials, API calls, paid requests, uploads, downloads, manual Google Flow, generated media, runtime dependencies, publication, staging, commit, push | Skills: git-safety, memory-ops, subagent-mission-brief, security-pass | READY`

- Topology: one Scoped Coder may write only the approved skill curation set; reviewers and verifier are read-only.
- The imported content is declarative Markdown/YAML only. Its source `allowed-tools` values do not authorize local actions.
- Skill Routing Gate: checked `git-safety`, `memory-ops`, `subagent-mission-brief`, and `security-pass`; matched and used all four for scoped safety, SSOT, mission control, and provider-boundary review; skipped design/frontend skills because no UI is changed.
- Security classification: no external-provider integration is implemented in this Work Block, so STRIDE-lite is not required; provider/action hard stops remain mandatory for every future activation Work Block.

## Approved write set

- `.agent/skills.lock.yml`
- `.agent/README.md`
- `.agent/ROSTER.md`
- `.agent/skills/media-production-orchestrator/**`
- `.agent/skills/media-art-director/**`
- `.agent/skills/media-rights-compliance/**`
- `.agent/skills/short-video-scriptwriter/**`
- `.agent/skills/storyboard-director/**`
- `.agent/skills/cinematography-director/**`
- `.agent/skills/video-creative-brief/**`
- `.agent/skills/video-prompt-engineer/**`
- `.agent/skills/video-provider-router/**`
- `.agent/skills/video-generator/**`
- `.agent/skills/video-quality-control/**`
- `.agent/skills/video-postproduction/**`
- `.agent/skills/web-video-integration/**`

## Adaptation rules

- Preserve source provenance and MIT attribution in the lock file.
- Replace capability-granting source metadata with an Azursystech authority boundary that defers all external or paid work to a future Owner-approved Work Block.
- Keep provider registry as a non-operational template; add no provider, key, endpoint, credential, dependency, runtime resolver, or Google Flow procedure.
- Make generation, quality-control, post-production, and web integration planning-only in this Work Block.
- Do not stage, commit, push, or alter project runtime/configuration.

## Acceptance criteria

- All 13 requested skills and both source reference documents are present as adapted project-local artifacts.
- `.agent/skills.lock.yml` records exact source, immutable revision, license, SHA-only exception, and each curated skill path.
- README and roster route agents to the local skills and state the authority boundary.
- Review confirms no executable provider action, secret, runtime/config change, or protected-path modification.

## Stages

1. Stage 0 — Plan and source/security inventory: complete.
2. Stage 1 — Scoped skill curation: complete.
3. Stage 2 — Review: complete; security and full-instruction parity approved after remediation.
4. Stage 3 — Verification and handoff: complete; `READY` without provider execution, staging, commit, or push.
