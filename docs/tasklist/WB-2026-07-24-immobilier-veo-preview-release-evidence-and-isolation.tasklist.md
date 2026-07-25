# WB-2026-07-24 — Veo Preview: release evidence and verifier isolation

## Owner-authorized objective

Revalidate the direct Gemini API / Veo Preview route for the existing private
Immobilier candidate, record the provider-evidence decision basis, and assess
whether the required formal release verification isolation is available.

This Work Block does **not** authorize generation, a retry, provider API calls,
publication, integration, deployment, or a client-facing release.

## Stage 0 — Routing preflight

- Work Block type: provider-rights and release-readiness evidence.
- Side-effect class: local documentation/workflow write and private evidence write.
- DB action mode: none.
- Hard Stops: no deploy, public release, credential/config change, commit, or push.
- Sensitive domains: external provider, private evidence, production release decision.
- Required verifier isolation: `os-isolated`.
- Skill routing: checked=current-wb, media-production-orchestrator,
  video-provider-router, media-rights-compliance, video-quality-control,
  security-pass, mission, memory, git-safety, video-generation, creative;
  matched=media-production-orchestrator, video-provider-router,
  media-rights-compliance, security-pass, mission, memory;
  used=media-production-orchestrator, video-provider-router,
  media-rights-compliance, security-pass, mission, memory;
  skipped=video-quality-control (existing QC evidence only; raw media is out of
  scope), git-safety (no commit), video-generation (no provider call), creative
  (no UI work).
- Subagent topology: Subagent-Required. Critic (read-only) completed;
  one Scoped Coder may record only the approved evidence; Verifier remains
  read-only.
- Write gate: READY. Critic verdict: SUPPLEMENT, adopted.

## Approved write-set

- `.agent/critic-gate.md`
- `.agent/verification-gate.md`
- `.codex/write-gate.md`
- `docs/tasklist/WB-2026-07-24-immobilier-veo-preview-release-evidence-and-isolation.tasklist.md`
- `docs/reports/critic-WB-2026-07-24-immobilier-veo-preview-release-evidence-and-isolation.md`
- `docs/reports/WB-2026-07-24-immobilier-veo-preview-release-evidence-and-isolation-verification.md`
- `memory_bank/context.md`
- `memory_bank/orchestrator-log.md`
- `memory_bank/progress.md`
- `memory_bank/review-log.md`
- private `provider-evidence/**`
- private `rights-and-consent/**`
- private `release-and-revocation/**`

## Acceptance criteria

1. Exact direct Gemini API / Veo Preview provider facts are recorded with source
   URLs, retrieval date, and scope limits; no inference from Vertex AI terms.
2. The private evidence package has a reviewable completeness result without
   copying, transforming, or exposing the candidate media.
3. The route receives only a recommendation or a documented blocker; it is not
   marked released without a responsible-human decision and required isolation.
4. Verification records the actual isolation level truthfully. Existing
   `independent-readonly-root` is not represented as `os-isolated`.

## Stage record

- Plan / Critic: completed. Critic supplements adopted: complete exact-tier
  evidence tuple, explicit Preview exception for rights-sensitive final output,
  and a genuine OS-isolated verifier are still required for formal READY.
- Implementation: BLOCKED. Scoped Coder performed metadata-only inspection but
  could not write the approved private evidence paths outside this sandbox.
- Verification: BLOCKED. The release tuple is incomplete, no responsible-human
  release decision or explicit Preview final-output exception exists, and no
  credential-free `os-isolated` verifier is available.

## Closeout result

No candidate release status changed. The existing private candidate remains
quarantined; no provider request, raw-media action, application change,
publication, integration, deployment, staging, commit, or push occurred.

## Out of scope

No raw-video access, copy, transformation, generation, provider/API request,
billing operation, secret or environment access/change, app integration,
storage/publication, deploy, client communication, staging, commit, push, or
destructive operation.
