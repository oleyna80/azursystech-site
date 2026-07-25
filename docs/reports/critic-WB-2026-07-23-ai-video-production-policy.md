# Critic Report — WB-2026-07-23-ai-video-production-policy

## Verdict

APPROVE — after the re-review.

## Scope and authority

- Approved local documentation/control-record paths are listed verbatim in the
  active tasklist and Critic Gate.
- No API key, provider account, console, paid generation, upload/download,
  media processing, publication, deployment, staging, commit, or push is
  authorized.
- Control Tower owns the policy, gates, tasklist, SSOT links, and redacted
  logs; no application Coder is needed for this documentation-only scope.

## Findings adopted before implementation

1. **Shared-gate conflict — high.** The former hero Work Block has a formal
   source result but unresolved browser evidence. Response: amend its critic
   report before logging the transition, then record in its tasklist/log that
   IHR-05/HERO-BROWSER-01 still blocks hero staging, commit, release,
   deployment, and publication. Do not recast it as complete.
2. **Over-broad rights claim — high.** Provider non-ownership is not
   exclusivity, copyrightability, third-party clearance, or automatic
   indemnification. Response: use explicit policy statuses and require an
   exact, fresh provider evidence tuple; unknown/expired evidence blocks paid
   generation and release.
3. **Preview/GA ambiguity — high.** Current Gemini API Veo model identifiers
   are documented as preview. Response: `Gemini Developer API Veo preview` is
   `NEEDS_PROVIDER_CONFIRMATION`, not automatically releasable. A paid GA
   Cloud route is only conditionally permissible after exact model/service,
   billing, terms, region, and indemnity-list confirmation.
4. **Provenance and candidate control — medium.** SynthID/provenance is not
   legal clearance and must not be stripped or hidden. Response: retain the
   redacted manifest, record transformations, and require human approval of
   the exact final candidate/hash before release.
5. **SSOT drift — medium.** Live task status belongs to the current tasklist,
   not an approved plan/report. Response: correct the source-of-truth chain
   and make future release records tasklist-led.

## Verification requirement

The frozen local-docs payload requires advisory read-only verification plus an
`independent-readonly-root` formal verdict. Any account or provider action is
out of scope and would require a separately approved `os-isolated` Work Block.
