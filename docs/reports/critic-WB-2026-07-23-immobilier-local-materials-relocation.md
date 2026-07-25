# Critic Report — WB-2026-07-23-immobilier-local-materials-relocation

## Verdict

SUPPLEMENT — relocation may proceed only with the destination skills classified as locally discoverable candidates, rather than dormant archive material. The Owner explicitly requested relocation to common skills. This Work Block does not authorize installation, execution, registry or lockfile changes.

## Findings and response

1. Critical resolved: `.agent/skills/<name>/SKILL.md` is a local discovery path; `.gitignore` does not make it inactive. The Stage 0 scope and write gate now state this consequence.
2. High resolved: the actual inspected component is `showcase/components/immobilier/HomePage.tsx`; it has no reference to either MP4 filename. Verification must scan `showcase/app`, `showcase/components`, and `showcase/public` for `hero-loop.mp4` and `hero-kling-demo.mp4`.
3. Preservation requirement: verify SHA-256, byte count, complete relative file manifest, successful destination creation, and source absence after each move. No media transcoding, copy-only duplicate, install, browser, provider, or external command is in scope.
4. Ambient state: `hero-loop.mp4` is tracked and modified; `hero-kling-demo.mp4`, `.artifacts/`, and source `.od-skills/` payloads are untracked. Do not stage anything and do not use `git add -A`.

## Approved Write-Set

- .agent/critic-gate.md
- .codex/write-gate.md
- .agent/verification-gate.md
- docs/tasklist/WB-2026-07-23-immobilier-local-materials-relocation.tasklist.md
- docs/reports/critic-WB-2026-07-23-immobilier-local-materials-relocation.md
- docs/reports/WB-2026-07-23-immobilier-local-materials-relocation-verification.md
- showcase/public/demo/immobilier/hero-loop.mp4
- showcase/public/demo/immobilier/hero-kling-demo.mp4
- .artifacts/immobilier/hero-loop.mp4
- .artifacts/immobilier/hero-kling-demo.mp4
- showcase/app/demo/immobilier/.od-skills/agent-browser-5d929c64c8/**
- showcase/app/demo/immobilier/.od-skills/web-prototype-4b854134ea/**
- .agent/skills/agent-browser/**
- .agent/skills/web-prototype/**
