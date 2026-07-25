# WB-2026-07-23-ai-video-policy-markdown-normalization — Tasklist

## Meta

- Owner-approved objective: normalize the readable Russian AI-video Markdown
  companion and replace its stale DOCX references without changing policy.
- Side-effect class: local docs/workflow write.
- DB action mode: none.
- Verification tier: standard.
- Write gate: READY.
- Subagent topology: Subagent-Required — one Scoped Coder, then read-only
  Verifier; formal verifier isolation is `independent-readonly-root`.

## Scope

### In scope

- Make `docs/policies/ai-video-generation-and-publication-policy.md` a
  correctly named, non-normative Markdown companion with a portable relative
  link to the canonical instruction.
- Point the canonical instruction and engineering-memory index to that
  Markdown companion.
- Record the new Work Block, gates, verification evidence, and redacted local
  operating logs.

### Out of scope

- Any change to provider eligibility, Preview/GA restrictions, release
  authorization, rights/consent, watermark/provenance, or evidence-gate rules.
- Gemini API keys, provider/account/console activity, terms research, paid
  generation, media processing, publication, application code, deploy,
  configuration, dependencies, DB, staging, commit, and push.
- Historical DOCX tasklist and reports. They remain evidence of a distinct,
  blocked Work Block.

## Approved write-set

- `.agent/critic-gate.md`
- `.agent/verification-gate.md`
- `.codex/write-gate.md`
- `docs/policies/ai-video-generation-and-publication-policy.md`
- `docs/engineering-memory/ai-video-production-operating-instruction.md`
- `docs/engineering-memory/README.md`
- `docs/reports/critic-WB-2026-07-23-ai-video-policy-markdown-normalization.md`
- `docs/reports/WB-2026-07-23-ai-video-policy-markdown-normalization-verification.md`
- `docs/tasklist/WB-2026-07-23-ai-video-policy-markdown-normalization.tasklist.md`
- `memory_bank/context.md`
- `memory_bank/orchestrator-log.md`
- `memory_bank/progress.md`
- `memory_bank/review-log.md`

## Tasks

- [x] AVM-01 — Identify all stale DOCX terminology and absolute/inbound links.
- [x] AVM-02 — Obtain Critic approval for a non-substantive Markdown-only
  normalization plan that preserves historical DOCX evidence.
- [x] AVM-03 — Scoped Coder normalized the three approved Markdown documents,
  including explicit canonical-instruction precedence after Verifier feedback.
- [x] AVM-04 — Verifier checks relative links, retained policy restrictions,
  literal write-set containment, and preservation of the prior DOCX BLOCKED
  history.

## Acceptance criteria

- The companion has no `file:///` link and never describes itself as a DOCX.
- The companion links to
  `../engineering-memory/ai-video-production-operating-instruction.md`.
- The canonical instruction and engineering-memory README link to
  `../policies/ai-video-generation-and-publication-policy.md`.
- A word-diff inspection demonstrates that policy sentences changed only for
  document-format terminology or link normalization; no provider eligibility,
  Preview/GA, release, rights/consent, watermark/provenance, or evidence-gate
  rule changes.
- The previous DOCX Work Block remains recorded as BLOCKED; this Work Block
  does not claim to satisfy its visual-render or formal-verifier requirements.
- No provider, key, media, publication, deploy, staging, commit, or push action
  occurs.

## Closeout

- Implementation: DONE.
- Verification: READY — native Verifier advisory READY and the required
  `independent-readonly-root` returned `FORMAL_VERDICT: READY`.
- Residual limitation: the user-converted Markdown companion and historical
  evidence are untracked, so Git cannot establish a historical word-diff
  baseline; direct current-content checks passed.
- Historical DOCX curation remains BLOCKED as a distinct record; this Markdown
  normalization does not claim its missing visual-render evidence.
