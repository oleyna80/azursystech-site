# WB-2026-07-23-immobilier-local-materials-relocation — Tasklist

## Work Block

- Owner-approved objective: move the two unused Immobilier MP4 files to the local archive and move the local OpenDesign skill payloads to the shared project skill root.
- Execution: autonomous within this write-set; no staging, commit, push, deployment, or external-provider action.
- Side-effect class: production-code write (public asset relocation) and local workflow write.
- DB action mode: none.
- Verification tier: standard, non-sensitive.

## Stage 0 — Routing preflight

- Work Block type: local material relocation across showcase assets and project-local skill payloads.
- Skills routing: checked=current-work-block-gates, subagent-mission-brief, media-production-skills, git-safety; matched=subagent-mission-brief, current-work-block-gates; used=subagent-mission-brief, current-work-block-gates; skipped=media-production-skills (no generation, processing, or integration), git-safety (no stage, commit, or push).
- Subagent topology: Subagent-Required (more than four files and two domains). Critic, one Scoped Coder, and Verifier run sequentially; parallel agents are read-only.
- Critic supplement accepted: the destination paths are locally discoverable common skill candidates, not a dormant archive. No installation, execution, registry, or lockfile change is authorized.
- Hard Stops: none. No DB, deployment, credentials, external provider, client communication, staging, commit, or push.
- Write gate: READY.

## Approved write-set

- `.agent/critic-gate.md`
- `.codex/write-gate.md`
- `.agent/verification-gate.md`
- `docs/tasklist/WB-2026-07-23-immobilier-local-materials-relocation.tasklist.md`
- `docs/reports/critic-WB-2026-07-23-immobilier-local-materials-relocation.md`
- `docs/reports/WB-2026-07-23-immobilier-local-materials-relocation-verification.md`
- `showcase/public/demo/immobilier/hero-loop.mp4` -> `.artifacts/immobilier/hero-loop.mp4`
- `showcase/public/demo/immobilier/hero-kling-demo.mp4` -> `.artifacts/immobilier/hero-kling-demo.mp4`
- `showcase/app/demo/immobilier/.od-skills/agent-browser-5d929c64c8/**` -> `.agent/skills/agent-browser/**`
- `showcase/app/demo/immobilier/.od-skills/web-prototype-4b854134ea/**` -> `.agent/skills/web-prototype/**`

## Tasks

- [x] ILM-01 — Inspect source contents, references, destination conventions, and repository state.
- [x] ILM-02 — Critic review of scope, preservation, and skill-discovery risks.
- [x] ILM-03 — Move the two MP4 files without transcoding or other content changes.
- [x] ILM-04 — Move the two local OpenDesign skill payloads without content changes.
- [x] ILM-05 — Verify byte preservation, source removal, destination inventory, reference safety, and types.
- [x] ILM-06 — Record verification and report closeout; do not stage, commit, or push.
