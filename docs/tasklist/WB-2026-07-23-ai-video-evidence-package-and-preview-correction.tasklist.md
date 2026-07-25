# WB-2026-07-23-ai-video-evidence-package-and-preview-correction — Tasklist

## Meta

- Owner-approved objective: establish the standard private evidence package for
  every AI-video asset and correct the canonical policy/instruction so a model
  `Preview` status is a route-specific operational risk, not an automatic bar
  to commercial use or public release.
- Side-effect class: local docs/workflow write.
- DB action mode: none.
- Verification tier: standard.
- Write gate: READY. The Owner confirmed on 2026-07-23 that both policy
  documents remain in the current canonical/companion structure.
- Subagent topology: Subagent-Required — read-only Critic, one Scoped Coder,
  then read-only Verifier; formal verifier isolation is
  `independent-readonly-root`.

## Scope

### In scope

- Correct both canonical and companion wording about Preview while retaining
  route-specific provider evidence, input-rights/consent, exact-candidate,
  and human-release controls.
- Define a portable private per-video evidence-package directory and safe
  manifest template that link request, provider operation, output hashes,
  transformations, rights/consent, terms snapshot, QA, and release decision.
- Record this Work Block's gates, Critic/Verifier evidence, and redacted
  operating logs.

### Out of scope

- API keys, provider/account/console activity, paid generation, media
  upload/download/processing, publication, application integration, deploy,
  configuration, dependencies, database, staging, commit, and push.
- A claim of exclusive ownership, universal copyright, or automatic legal
  clearance for any output.
- Editing historical DOCX tasklists/reports or the existing asset provenance
  record.

## Approved write-set

- `.agent/critic-gate.md`
- `.agent/verification-gate.md`
- `.codex/write-gate.md`
- `docs/engineering-memory/ai-video-production-operating-instruction.md`
- `docs/policies/ai-video-generation-and-publication-policy.md`
- `docs/templates/ai-video-evidence-package/README.md`
- `docs/templates/ai-video-evidence-package/manifest.template.yml`
- `docs/reports/critic-WB-2026-07-23-ai-video-evidence-package-and-preview-correction-critic.md`
- `docs/reports/WB-2026-07-23-ai-video-evidence-package-and-preview-correction-verification.md`
- `docs/tasklist/WB-2026-07-23-ai-video-evidence-package-and-preview-correction.tasklist.md`
- `memory_bank/context.md`
- `memory_bank/decisions.md`
- `memory_bank/orchestrator-log.md`
- `memory_bank/progress.md`
- `memory_bank/review-log.md`

## Acceptance criteria

- [x] The canonical instruction and companion state that Preview alone neither
  grants nor removes commercial/public-release eligibility; it requires an
  exact current route evidence decision and carries operational lifecycle risk.
- [x] The template defines a private per-video folder, contains traceability
  fields sufficient to link prompt/request/operation/output/release, and
  explicitly excludes keys, auth headers, signed URLs, raw sensitive bodies,
  personal data, and source media from repository evidence.
- [x] The template requires hashes for original and released files,
  transformation history, current terms/model snapshot, rights/consent,
  SynthID/provenance result where available, and exact-candidate approval.
- [x] No provider/key/media/publication or source-code side effect occurs.
- [x] Critic conditions are adopted, one Scoped Coder reports DONE, and a
  frozen current-state independent-readonly-root verifier returns READY.

## Stage record

- Stage 0 — complete: source baseline and relevant skills read; Critic
  `SUPPLEMENT` adopted. Both target policy documents were added today.
- Pre-Edit Lifecycle Check — passed: Owner confirmed on 2026-07-23 that the
  current canonical/companion structure remains.
- Stage 1 — complete: one Scoped Coder reported `DONE`. It removed trailing
  whitespace only from the two policy documents, checked the two template
  files unchanged, and passed normal plus `--no-index` whitespace checks for
  all four scoped implementation artifacts. The corresponding redacted
  `implementation: DONE` record is in `memory_bank/orchestrator-log.md`.
- Stage 2 — complete: advisory Verifier passed substantive
  policy, privacy, YAML, secret, and containment checks. The first independent
  capture returned `FORMAL_VERDICT: BLOCKED` for trailing whitespace; the
  Coder remediated it. The second capture exists and returned `BLOCKED` only
  because this tasklist had not yet recorded the completed Coder handoff. The
  four scoped content artifacts are intentionally untracked, so Git cannot
  provide a historical before/after baseline; their current state, literal
  scope, Coder report, and recorded checks were assessed explicitly.
- Stage 3 — complete: the synchronised formal independent-readonly-root
  capture `WB-2026-07-23-ai-video-evidence-package-recovery-formal-v3.txt`
  returned `FORMAL_VERDICT: READY`. Its six checks passed, including the exact
  current-state hash baseline, repository-safe template, lifecycle correction,
  diff hygiene, and focused secret scan.
