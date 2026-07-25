# Critic Report — WB-2026-07-23-ai-video-policy-docx-curation

## Verdict

APPROVE — after the supplementary re-review.

## Scope and authority

- The literal approved write-set includes the supplied root-level DOCX as a
  move-from path and the `docs/policies/` destination. The source may be
  removed only after the destination has been validated.
- Exactly one Scoped Coder may change the DOCX, Markdown navigation, project
  map, and registry. Control Tower owns gates, tasklist, report, and SSOT logs.
- No API key, provider account, paid generation, media action, publication,
  deployment, staging, commit, or push is authorized.

## Conditions incorporated before implementation

1. **Preview wording — high.** Replace every permissive direct Gemini API
   Preview statement, not merely two quoted sentences. The former positions
   32, 34, 247, and 292 must not leave a path to paid generation or public
   release.
2. **Controlled relocation — high.** Preserve the supplied DOCX during its
   move; record pre-edit and final destination hashes and validate its package
   and readable content before removing the root source.
3. **Canonical-source clarity — medium.** The Markdown operating instruction
   must link to the DOCX companion and the DOCX must name the Markdown file as
   canonical, including a conflict rule. The companion itself grants no
   provider access, paid generation, or release permission.
4. **Visual confidence — medium.** Produce a visual render of the final DOCX
   for review. If the renderer is unavailable, record `BLOCKED`, never `PASS`.
5. **Skill routing — low.** Record `subagent-mission-brief` alongside the
   document, compliance, provider-router, and SSOT workflows.

## Verification requirement

The frozen local-documents payload requires advisory read-only review plus an
`independent-readonly-root` formal verdict. The formal check must prove the
literal write-set, reciprocal links, Preview language removal, controlled root
source removal, DOCX package/readability, and visual-render outcome.
