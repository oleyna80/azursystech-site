# Critic Report — WB-2026-07-23-ai-video-policy-markdown-normalization

## Verdict

**APPROVE** after one required supplement.

## Initial supplement adopted

- Include the primary Markdown companion in the literal write-set.
- Require zero `file:///` links, zero self-description of the `.md` companion
  as DOCX, and inbound canonical links to the `.md` companion.
- Require a semantic non-regression diff review.
- Preserve the historical DOCX Work Block and its `BLOCKED` visual/formal
  verification result unchanged; this Markdown Work Block cannot launder or
  close that result.

## Approved boundary

The Coder may change only document-format terminology and canonical-link
targets in the three approved Markdown files. It may not change provider
eligibility, Preview/GA restrictions, release authorization, rights/consent,
watermark/provenance, or evidence-gate requirements.

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

## Required verification

- inspect the frozen diff and word-diff for non-regression;
- validate the two relative Markdown link directions;
- scan for `file:///` and stale DOCX self-description in the companion;
- verify literal write-set containment and that historical DOCX evidence was
  not edited.

## Constraints

No API key, provider/account/console activity, terms research, generation,
media operation, publication, deploy, configuration, staging, commit, or push
is authorized.
