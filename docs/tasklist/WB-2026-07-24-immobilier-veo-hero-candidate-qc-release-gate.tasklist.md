# WB-2026-07-24-immobilier-veo-hero-candidate-qc-release-gate — Tasklist

## Objective

Evaluate the one existing private Veo candidate for technical integrity, visual
fitness against the approved hero brief, and conditional commercial-use/release
readiness. Keep it private and do not alter, integrate, publish, or regenerate.

## Stage 0 — routing preflight

- Work Block type: exact-candidate private QC and rights-release gate.
- Side-effect class: private media inspection/evidence write plus local workflow
  records. DB action mode: none.
- Owner authorization: 2026-07-24 — move to the next stage after one paid
  candidate completed. This authorizes assessment of the existing private video,
  not a new generation or public use.
- Candidate: the quarantined raw candidate in package
  `AST-IMMOBILIER-HERO-VEO31FAST-20260724-01`; no source assets or human subjects
  were supplied.
- Rights position: conditional, not automatically cleared. Current Google terms
  state that Google does not claim ownership of generated content, may generate
  same or similar content for others, and makes the user responsible for lawful
  use. Active billing and the recorded charge support Paid Service status but do
  not alone establish exclusivity, copyrightability, indemnity, or freedom from
  third-party claims.
- Outcome ceiling: this Work Block cannot set `RELEASE_APPROVED`, authorize
  publication, or treat Paid Service/non-ownership as commercial clearance. The
  canonical direct Gemini Developer API Preview route is
  `NEEDS_PROVIDER_CONFIRMATION`. Only `approved-for-private-QC`,
  `NEEDS_PROVIDER_CONFIRMATION`, or `BLOCKED` may be recorded.
- Acceptance criteria: record private codec/container/dimensions/duration/fps/
  audio/decode and hash continuity; inspect opening, traversal, terrace, and
  closing frames plus temporal continuity for cuts, geometry drift, pseudo-text,
  logos, people, watermark, flicker, unsafe content, and brief mismatch; record
  a rights report covering exact provider/model/endpoint, terms date, paid tier,
  provenance/SynthID/watermark, output-rights limitations, input-rights,
  third-party restrictions, and human decision. No blocking defect may be
  waived by taste.
- Raw-candidate handling: preserve raw bytes unchanged. Any extracted frames or
  contact sheet are private, non-release QA artifacts only within the approved
  private QA directory, carry the raw-hash relation, and must not remove, hide,
  crop around, transcode away, or otherwise manipulate any watermark/SynthID or
  provenance signal. A missing/unassessable required proof is recorded as such
  and blocks a release-positive conclusion.
- Security-pass mode: advisory `codex`/review for this planning and native
  verification stage; independent `verify` in a separate credential-free
  `os-isolated` readonly environment is required before any future release claim.
- Topology: Subagent-Required. One Scoped Coder can inspect/write only the
  private QA/rights/release records after Critic approval. A Verifier then
  supplies an advisory verdict; formal release needs `os-isolated` isolation.
- Hard Stops: no public release, application integration, provider call,
  credential/billing/config change, deploy, client communication, destructive
  operation, staging, commit, or push.

## Approved write-set

- `.agent/critic-gate.md`
- `.agent/verification-gate.md`
- `.codex/write-gate.md`
- `docs/tasklist/WB-2026-07-24-immobilier-veo-hero-candidate-qc-release-gate.tasklist.md`
- `docs/reports/critic-WB-2026-07-24-immobilier-veo-hero-candidate-qc-release-gate.md`
- `docs/reports/WB-2026-07-24-immobilier-veo-hero-candidate-qc-release-gate-verification.md`
- `memory_bank/context.md`
- `memory_bank/orchestrator-log.md`
- `memory_bank/progress.md`
- `memory_bank/review-log.md`
- private QA, rights, and release directories within the existing candidate package only.

## Out of scope

New generation, retry/fallback, any provider/API call, credentials, billing,
configuration, watermark removal, media transform, public storage, hero/site
integration, release, publication, deployment, database, staging, commit, and
push.

## Stage record

- Stage 0: complete. Stage 0.5 Critic: SUPPLEMENT adopted; scope is private QC
  only and the route's outcome ceiling is `NEEDS_PROVIDER_CONFIRMATION`.
- Stage 1: complete. One Scoped Coder performed private-only QC, retained raw
  immutability/hash-continuity evidence, recorded clean decode/technical
  coverage and sampled visual coverage with zero visual blockers, and saved
  QA-only derived artifacts in the approved private subtree. Embedded SynthID
  was not assessable with local tools; no visible watermark was found in the
  reviewed frames. The private rights and release records set
  `NEEDS_PROVIDER_CONFIRMATION`; no release approval was recorded.
- Stage 2: complete (native advisory Verifier). Evidence coverage and the
  private-only boundary passed; same-session verification cannot issue formal
  READY. Repository-wide attribution remains unverified because ambient dirty
  Immobilier paths existed before this Work Block.
- Stage 3: closed — BLOCKED for formal release. No application/public-media
  change, integration, publication, deploy, staging, commit, or push occurred.

## Outcome and follow-up

- Private QC outcome: advisory-pass with no visual blocking defect recorded.
- Formal release outcome: `BLOCKED`; the direct Gemini Developer API Preview
  route remains `NEEDS_PROVIDER_CONFIRMATION` and actual verifier isolation was
  `same-session-degraded`, below the required `os-isolated` level.
- A separately approved release Work Block must first freeze the exact evidence
  set, obtain documented provider confirmation, and run a credential-free,
  provider-free, readonly `os-isolated` verifier. Until then the candidate
  remains private and may not be integrated or published.
