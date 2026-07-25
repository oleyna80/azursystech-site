# Critic Report — WB-2026-07-23-ai-video-evidence-package-and-preview-correction

## Verdict

`SUPPLEMENT` — adopted. The evidence-package and Preview correction are
justified, but the canonical documents were created today and require the
Pre-Edit Lifecycle Check before their non-trivial correction.

## Required conditions

- Replace every categorical `Preview = internal-only`, `no paid generation`,
  or `no public release` claim in both policy documents. Preview remains a
  lifecycle/stability/revalidation signal; eligibility is decided only from
  current exact route/terms/billing, input-rights/consent, provenance, and the
  exact-candidate release gate.
- Keep the distinction between output-use terms and separate GA-only
  indemnity/protection eligibility. The latter does not create a universal
  publication ban for a Preview route.
- Put only a redacted, public-safe skeleton in
  `docs/templates/ai-video-evidence-package/`. Every real evidence package,
  generated file, source file, thumbnail, raw prompt, consent proof, provider
  response, account/project identifier, key/header, and signed URL is private
  and outside the repository.
- Describe the package as an auditable internal authorization/traceability
  chain, not proof of external-world facts or universal legal clearance.
- Include lifecycle evidence: model/status documentation date,
  compatibility/change-monitoring decision, fallback/migration decision, and
  reapproval triggers.

## Approved literal write-set

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

## Required acceptance checks

- Targeted `rg` finds no categorical Preview-only-internal/no-paid/no-public
  rule in either policy document.
- Both documents retain current provider terms, route/tier, input rights and
  consent, provenance/disclosure, hash-bound exact candidate, and responsible
  human release approval.
- The template contains only safe references and no secrets, personal data,
  media, raw prompts/responses, account identifiers, or signed URLs.
- The template says actual evidence is private/outside Git; copying it grants
  no provider, storage, generation, or release authority.
- Standard verification records `governance/provider-policy` sensitivity and
  uses `independent-readonly-root` after the documentation diff is frozen.

## Evidence basis

- Current Google Veo documentation labels the relevant Developer API models
  Preview; that is a model lifecycle status, not a published categorical ban
  on paid/public use. The exact route must still be rechecked.
- Google’s Gemini API terms separate output treatment and paid-service data
  conditions from the distinct GA eligibility of the Cloud indemnity list.
