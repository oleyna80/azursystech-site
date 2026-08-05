# WB-2026-07-25 — AI-video low-risk release decision

## Stage 0 — routing preflight

- Work Block type: targeted documentation correction and reusable low-risk
  per-video release-decision procedure.
- Side-effect class: local docs/workflow write only.
- DB action mode: none.
- Skills Routing: checked=current-work-block-gates,media-rights-compliance,video-provider-router,video-quality-control,media-production-orchestrator,git-safety,frontend-skills,security-pass; matched=media-rights-compliance,video-provider-router,video-quality-control,media-production-orchestrator; used=media-rights-compliance,video-provider-router,video-quality-control,media-production-orchestrator; skipped=git-safety(no staging, commit, or push),frontend-skills(no UI work),security-pass(no code, runtime, credential, or configuration change).
- Subagent topology: Subagent-Required (external-provider/rights policy,
  six documentation artifacts, and independent verification). Independent
  critic completed before Owner approval; one Scoped Coder has the literal
  write-set and a read-only Verifier follows.
- Hard Stops: none. Provider/API calls, credentials/env access, private-evidence
  access, generation, video processing, publication, integration, staging,
  commit, push, and deletion are out of scope.
- Write gate: READY.

## Objective

Correct Google-output wording and align the paid Gemini API/Veo route with a
compact, evidence-based release decision for a low-risk, text-only video.

## Approved write-set

- `docs/engineering-memory/ai-video-production-operating-instruction.md`
- `docs/policies/ai-video-generation-and-publication-policy.md`
- `docs/templates/ai-video-evidence-package/README.md`
- `docs/templates/ai-video-evidence-package/manifest.template.yml`
- `docs/templates/ai-video-evidence-package/release-decision.template.yml`
- `docs/tasklist/WB-2026-07-25-ai-video-low-risk-release-decision.tasklist.md`

## Acceptance criteria

1. No claim says Google transfers or assigns output rights; the documents state
   the narrower non-ownership position and its limits.
2. Fresh exact-route evidence may support `CONDITIONALLY_PERMISSIBLE` for paid
   Gemini API/Veo; unknown or expired evidence remains
   `NEEDS_PROVIDER_CONFIRMATION`; `Preview` is lifecycle risk, not prohibition.
3. The low-risk per-video procedure and secret-free template bind the exact
   asset hash, route evidence, input declaration, focused QC, restricted
   release scope, responsible human, and disclosure decision.
4. OS-isolated attestation is described as a conditional technical integrity
   control, not a universal legal prerequisite.
5. Historic tasklists and global gates remain unchanged.

## Verification tier

Lite documentation verification: scoped diff hygiene, Markdown/YAML syntax,
and focused wording scan.

## Stage 1 — implementation

Completed by the single Scoped Coder. No private evidence or media was read.
The targeted policy, operating instruction, evidence-package README and
manifest now distinguish non-ownership from assignment, retain the safe
`NEEDS_PROVIDER_CONFIRMATION` default, and add the per-video release-decision
template. No historic tasklist or global gate was changed by the Coder.
