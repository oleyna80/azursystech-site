# WB-2026-07-25-immobilier-exact-veo-hero-materialization — Tasklist

## Objective

Materialize the Owner-reviewed exact Veo candidate as the local Immobilier Hero
asset without re-encoding it, and bind the local-only use to a private
exact-hash release decision. This Work Block does not deploy or publish it.

## Stage 0 — routing preflight

- Work Block type: production frontend asset integration with a private evidence
  record.
- Side-effect class: production code/asset write plus local/test verification
  and a private local evidence write. DB action mode: none.
- Owner authorization: 2026-07-25 — the Owner reviewed the exact candidate,
  confirmed audible surf and no trade marks or identifiable locations, and
  authorized its use in the Hero only.
- Exact candidate SHA-256:
  `9345e2daebc90d9cd8c91fcacc5d8fce1ae4c6d423a576ca79a9eba58eb2961f`.
- Skills checked/matched/used: `frontend-skill`, `media-rights-compliance`,
  `video-quality-control`, `media-production-orchestrator`, and `playwright`.
  `git-safety` is skipped because no commit is in scope; `security-pass` is
  skipped because no security/configuration surface changes.
- Subagent topology: Subagent-Required. Stage 0 Critic is complete; one
  Scoped Coder materializes the exact asset and source reference; a read-only
  Verifier follows.
- Hard Stops: no provider/API call, credential/configuration change,
  deployment, public release/publication, client communication, destructive
  operation, staging, commit, or push.
- Write gate: READY.

## Approved write-set

- `docs/tasklist/WB-2026-07-25-immobilier-exact-veo-hero-materialization.tasklist.md`
- `showcase/components/immobilier/HeroMedia.tsx`
- `showcase/public/demo/immobilier/hero-veo-20260724.mp4`
- Private evidence only:
  `AST-IMMOBILIER-HERO-VEO31FAST-20260724-01/release-and-revocation/release-decision-20260725.yml`

## Out of scope

`HomePage.tsx`, `home.module.css`, the old `hero-part2.mp4`, deleted
`hero-loop.mp4`, all historic evidence/tasklists, generation, provider/API
calls, re-encoding, public publication, deployment, staging, commit, and push.

## Acceptance criteria

1. The new public asset is byte-identical to the approved private raw candidate.
2. `HeroMedia` references only the new distinct asset path and preserves its
   muted autoplay, reduced-motion, and image fallback behavior.
3. A secret-free private release decision names this exact hash, limits use to
   the repository-local `/demo/immobilier` Hero, and records that legal
   clearance is not established by the record.
4. No deployment or publication occurs.

## Stage record

- Stage 0: complete.
- Stage 1: complete — exact candidate copied without re-encoding and Hero source switched.
- Stage 2: complete — advisory read-only verification passed; same-session isolation warning recorded.
- Stage 3: complete — local integration closed; no deployment/publication is authorized.
