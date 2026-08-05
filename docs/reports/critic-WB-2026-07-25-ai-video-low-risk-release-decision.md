# Critic report — WB-2026-07-25-ai-video-low-risk-release-decision

Date: 2026-07-25  
Role: Reviewer / policy-and-risk critic (read-only)  
Scope: the proposed targeted corrections to the AI-video policy, operating instruction, and evidence templates. No private evidence, media asset, API, billing, or provider account was inspected.

## Verdict: SUPPLEMENT

The earlier draft was too absolute in treating the absence of an individual provider letter or copyright assignment as a release blocker for every generated video. Google’s non-ownership statement is not an assignment, guarantee of copyrightability, exclusivity, indemnity, or proof that no third party can complain. It also does not, by itself, make a low-risk paid text-to-video result unusable in production.

For a low-risk asset, the policy should allow a documented, human `CONDITIONALLY_PERMISSIBLE` release decision when the exact paid route is current and the candidate has a bounded evidence record. This is a business risk decision, not a legal guarantee.

## Required corrections adopted in the write-set

1. Replace any assertion that Google transfers or assigns output rights with the narrower non-ownership position.
2. Keep `NEEDS_PROVIDER_CONFIRMATION` for unknown, expired, or mismatched provider evidence; do not use Preview status alone as a commercial-use prohibition.
3. Add a compact per-video release record for a low-risk text-only asset: paid route/model/terms date, prompt-and-input declaration, focused human QC, operation reference and SHA-256, exact release scope, disclosure decision, and accountable approver.
4. Preserve the distinction between evidence traceability/technical integrity and legal clearance. OS-isolated verification is only a technical control when the declared Work Block requires it.
5. Do not amend historical candidate evidence or treat this documentation correction as authorization to publish or to call a provider.

## Critic-approved write-set

- `.agent/critic-gate.md` (Control Tower gate record only)
- `.codex/write-gate.md` (Control Tower gate record only)
- `docs/engineering-memory/ai-video-production-operating-instruction.md`
- `docs/policies/ai-video-generation-and-publication-policy.md`
- `docs/templates/ai-video-evidence-package/README.md`
- `docs/templates/ai-video-evidence-package/manifest.template.yml`
- `docs/templates/ai-video-evidence-package/release-decision.template.yml` (new)
- `docs/tasklist/WB-2026-07-25-ai-video-low-risk-release-decision.tasklist.md` (new)
- `docs/reports/critic-WB-2026-07-25-ai-video-low-risk-release-decision.md`

## Residual risks

- A claimant can still allege infringement or personality/trademark harm; the record supports defense and traceability, not immunity.
- The exact existing candidate is not approved by this report. Its private evidence and the actual media must be checked in the next, read-only review stage before any human release decision.
- Publication, provider calls, regeneration, commit, and push remain out of scope.
