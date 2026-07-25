# Verification Report — WB-2026-07-23-ai-video-policy-docx-curation

## Verdict

**BLOCKED** — documentation content and package checks pass, but the required
visual DOCX inspection and formal independent verifier evidence are unavailable.

## Verified implementation

- The supplied root DOCX was controlled-moved to
  `docs/policies/ai-video-generation-and-publication-policy.docx`. Its pre-move
  SHA-256 was `40b60b596331d7fc81b50e087835d93dc711f19f9e712ea15c88fa91739dac29`;
  the final corrected destination SHA-256 is
  `ff375e002e4759a6eaad97b1eb886d6b52ddd96c75b6553535087b4b4665963b`.
- All Gemini API Preview language is internal prototype/test-only and denies
  paid generation and public production release without a separate approved
  execution Work Block and fresh provider evidence tuple.
- The Vertex AI GA recommendation now also requires an approved execution Work
  Block, fresh evidence tuple, and exact-candidate release gate.
- Markdown is canonical. It links to the non-normative companion; the DOCX
  links back using `rId9` to
  `../engineering-memory/ai-video-production-operating-instruction.md` and
  denies any self-authorisation.

## Passed checks

- `unzip -t docs/policies/ai-video-generation-and-publication-policy.docx`
- Python standard-library XML parsing of all 16 DOCX XML/relationship parts.
- Extracted-text checks for restrictive Preview language, conditional Vertex
  language, canonical path, absence of all replaced permissive claims, and
  absence of the former root source.
- OOXML hyperlink relationship and visible `w:hyperlink r:id="rId9"` check.
- Scoped token/secret-pattern scan and `git diff --check`.

## Blocking evidence and recovery

1. **Visual inspection:** LibreOffice/UNO could not render the final DOCX in
   this sandbox: UNO returned `NoConnectException`; headless PDF conversion
   failed with readonly `dconf` state and created no PDF. Render the final
   file in a writable LibreOffice environment and inspect every page.
2. **Formal isolation:** `scripts/agent-runtime-doctor.sh` passed, but the
   Control Tower's `scripts/run-independent-verifier.sh` launch exited
   `codex-exit-1` because the dedicated verifier account hit its usage limit.
   Rerun the same frozen prompt from an `independent-readonly-root` after the
   runtime capacity is restored.

No API key/account/provider call, paid generation, media action, publication,
deployment, staging, commit, or push occurred.
