# WB-2026-07-23 — Immobilier Veo provider diagnostic

## Objective

Determine the prior Veo `HTTP 400` cause from the current official Gemini API
contract, without generating a video or changing the Immobilier demo.

## Stage 0 — Routing preflight

- Work Block type: external-provider contract diagnostic; no generation.
- Side-effect class: official-provider metadata read plus private diagnostic
  evidence and local workflow records.
- DB action mode: none.
- Hard Stops: none triggered. Explicit Owner authorization dated 2026-07-23
  permits this diagnostic only; it does not authorize a new generation POST,
  polling, download, upload, publication, deployment, commit, or push.
- Skill Routing Gate — relevance filter:
  - Always relevant: current Work Block/gate templates; `git-safety` is not
    relevant after inspection because staging, commit, and push are excluded.
  - Relevant: `systematic-debugging`, `security-pass`,
    `media-production-orchestrator`, `video-provider-router`,
    `subagent-mission-brief`, and `memory-ops`.
  - Not relevant: frontend/design, video creation, post-production, QC,
    browser integration, deployment, database, and client-communication skills.
- Skills checked: current-work-block-gates, systematic-debugging,
  security-pass, media-production-orchestrator, video-provider-router,
  subagent-mission-brief, memory-ops, git-safety.
- Skills matched: systematic-debugging, security-pass,
  media-production-orchestrator, video-provider-router,
  subagent-mission-brief, memory-ops.
- Skills used: systematic-debugging, security-pass,
  media-production-orchestrator, video-provider-router,
  subagent-mission-brief, memory-ops.
- Skills skipped: git-safety (not relevant after inspection: no staging,
  commit, or push); all frontend/media-production skills (not relevant after
  inspection: this Work Block has no media creation or integration).
- Subagent topology: Subagent-Required because this is provider-contract,
  privacy, evidence, and independent-verification work. A read-only Critic
  reviews Stage 0; exactly one Scoped Coder writes the approved local records;
  then a read-only Verifier assesses the result.
- Required verifier isolation: `os-isolated`; same-session results are
  advisory only and cannot close a formal provider-facing `READY` verdict.
- Write gate: READY after scoped Critic `SUPPLEMENT` adoption.

## Approved scope

1. Fetch and inspect only the public official Gemini API discovery metadata.
2. Compare the prior request's non-sensitive field shapes to that metadata.
3. Write a redacted private diagnostic record under
   `/home/azur/.local/share/azursystech-private/ai-video-evidence/AST-IMMOBILIER-VEO-DIAGNOSTIC-20260723-01`.
4. Synchronize only the control records listed in the Critic gate.

## Out of scope

No `predictLongRunning` POST, generation, polling, download, model fallback,
account/billing change, credential or `.env` change, application/public-asset
change, integration, publication, deployment, staging, commit, or push.

## Acceptance criteria

- [x] Official schema evidence identifies or rules out only request-shape
      mismatches demonstrable from the current public contract. All other
      historical causes are recorded as `UNASSESSABLE` because the prior raw
      request and 400 body were not retained.
- [x] Evidence records state that no generation request was sent.
- [x] Private diagnostic package contains only redacted diagnostic material.
- [x] Immobilier source and public media remain untouched.
- [x] Independent verification is attempted and its isolation limitation is
      recorded honestly.

## Stage 1 implementation note

Scoped Coder dispatch was blocked by native thread capacity. Control Tower
performed the narrowest documentation/evidence fallback within the approved
write-set; this is an orchestration limitation, not a substitute for the
required os-isolated verifier.
