# WB-2026-07-23-ai-video-policy-docx-curation — Tasklist

## Work Block

- Owner-approved objective: correct the supplied Russian DOCX companion so it
  cannot be read as permission to make paid Gemini API Preview calls or publish
  Preview output, then relocate it under `docs/` while retaining the existing
  Markdown instruction as the canonical source.
- Side-effect class: local docs/workflow write.
- DB action mode: none.
- Verification tier: standard, governance/provider-policy, with
  independent-readonly-root formal verification.
- Out of scope: Gemini API key, provider/API/account/console access, paid
  generation, media processing, publication, deployment, configuration,
  dependencies, staging, commit, and push.

## Stage 0 — Routing preflight

- Work Block type: durable policy-document curation and controlled companion
  relocation; it is not a provider-execution or media-production Work Block.
- Relevance filter: always relevant=current Work Block gates and git-safety
  for a future commit decision; relevant=DOCX handling, media-rights
  compliance, provider-policy routing, operational SSOT, and subagent mission
  framing; not relevant=frontend, database, deployment, security hardening,
  browser/media QA, and unrelated skills.
- Skills routing: checked=current-work-block-gates,doc,media-rights-compliance,video-provider-router,memory-ops,subagent-mission-brief,git-safety; matched=current-work-block-gates,doc,media-rights-compliance,video-provider-router,memory-ops,subagent-mission-brief; used=doc,media-rights-compliance,video-provider-router,memory-ops,subagent-mission-brief; skipped=git-safety (not relevant after inspection: no staging, commit, or push).
- Subagent topology: Subagent-Required. A read-only Critic approved the
  revised plan; exactly one Scoped Coder owns content/relocation changes; a
  read-only Verifier assesses the frozen payload.
- Hard Stops: none is authorized. The source removal is an approved controlled
  relocation, only after the destination opens and validates. Any key/provider
  use, paid call, media action, publication, deploy, stage, commit, or push
  needs separate Owner approval.
- Write gate: READY — Critic re-review APPROVE and literal write-set recorded
  below.

## Approved write-set

- `.agent/critic-gate.md`
- `.agent/verification-gate.md`
- `.codex/write-gate.md`
- `PROJECT_MAP.md`
- `FILE_REGISTRY.yml`
- `docs/engineering-memory/README.md`
- `docs/engineering-memory/ai-video-production-operating-instruction.md`
- `Политика генерации и публикации AI-видео AzurSysTech.docx` (move-from;
  remove only after verified destination)
- `docs/policies/ai-video-generation-and-publication-policy.docx`
- `docs/reports/critic-WB-2026-07-23-ai-video-policy-docx-curation.md`
- `docs/reports/WB-2026-07-23-ai-video-policy-docx-curation-verification.md`
- `docs/tasklist/WB-2026-07-23-ai-video-policy-docx-curation.tasklist.md`
- `memory_bank/context.md`
- `memory_bank/orchestrator-log.md`
- `memory_bank/progress.md`
- `memory_bank/review-log.md`

## Tasks

- [x] AVD-01 — Establish the source/destination and identify every wording
  that could permit Gemini API Preview paid generation or public release.
- [x] AVD-02 — Obtain Critic approval for the complete replacement, controlled
  move, mutual links, and visual-render requirement.
- [x] AVD-03 — Have the Scoped Coder correct and relocate the DOCX, add the
  reciprocal canonical/companion references, and update map/registry.
- [ ] AVD-04 — BLOCKED: advisory static verification passed, but visual DOCX
  inspection needs a writable LibreOffice environment and the required
  independent-readonly-root verifier is usage-limited.

## Acceptance criteria

- All formerly permissive Gemini API Preview wording is replaced: Preview is
  internal prototype/test-only and cannot authorize a paid request or public
  production release without a separate approved execution Work Block and
  fresh provider evidence tuple.
- The canonical Markdown instruction links to the DOCX companion, and the
  DOCX explicitly defers to the Markdown instruction when they differ.
- The supplied DOCX is absent from the repository root only after the relocated
  destination is valid, readable, and visually rendered.
- No API/key/provider/media/publication/deploy/stage/commit/push action occurs.

## Closeout

- Implementation: DONE. The source was controlled-moved; final DOCX SHA-256
  is `ff375e002e4759a6eaad97b1eb886d6b52ddd96c75b6553535087b4b4665963b`.
- Verification: BLOCKED. Static package/XML/content/link/security checks
  passed. Do not treat the blocked visual render or usage-limited formal
  verifier as PASS.
