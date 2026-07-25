# Verification Report — WB-2026-07-23-immobilier-local-materials-relocation

## Verdict

READY — verified by an independent read-only root after the implementation diff was frozen.

## Scope

- Two unused Immobilier MP4 files relocated from the public demo directory to `.artifacts/immobilier/`.
- Two route-local OpenDesign payloads relocated to `.agent/skills/` as locally discoverable candidates only.
- No skill installation or execution, media processing, application-code change, provider call, configuration/dependency/roster/lockfile change, stage, commit, push, or deployment.

## Evidence

- `scripts/agent-runtime-doctor.sh`: PASS for Codex profile, readonly verifier profile, verifier home, inotify capacity, file-limit, workspace capacity.
- Independent verifier: `scripts/run-independent-verifier.sh --timeout 240 docs/reports/WB-2026-07-23-immobilier-local-materials-relocation-verification.md` completed with `PASS|independent-verifier|completed` in `independent-readonly-root` isolation.
- MP4 hashes and byte lengths matched exactly: `hero-loop.mp4` `ed776654bb65e6b6347ea05d3be7d78353d752b7075f905ff46b09d5ecebd7fa` / `8221522`; `hero-kling-demo.mp4` `66dffbe19076fab09b62d081048386d4d9e10de70793133249d3de5000b3f1e5` / `14020712`.
- Both old MP4 paths and both old `.od-skills` source directories were absent after relocation.
- Retained pre-move manifests matched target skills after root-prefix normalization: `agent-browser` (1 file) and `web-prototype` (6 files). The independent verifier rechecked every target skill hash and the exact six-file `web-prototype` inventory.
- `rg` found no `hero-loop.mp4` or `hero-kling-demo.mp4` reference under `showcase/app`, `showcase/components`, or `showcase/public`; `HomePage` uses `hero.jpg`.
- `npm run check:types` in `showcase`: PASS (`next typegen && tsc --noEmit`); only ignored `.next` artifacts were generated.
- `git diff --check`: PASS with no output.
- Independent read-only diff review found no change to application code, dependencies, lockfiles, configuration, or `.agent/ROSTER.md`.

## Ambient state and follow-up

- `memory_bank/orchestrator-log.md` and three pre-existing untracked `.artifacts/immobilier/` provenance files remain ambient and out of this write-set.
- `hero-loop.mp4` remains a tracked-file deletion paired with a local untracked archival copy; no staging occurred. Any future commit must stage only explicit, Owner-approved paths.
- `.agent/skills/**` is ignored and locally discoverable; future routing may select these candidates. Their curation, provenance, installation, and registry/lockfile inclusion remain separate work.
