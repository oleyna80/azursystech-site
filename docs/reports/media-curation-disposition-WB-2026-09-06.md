# Media Production Skills Curation — Branch Disposition Audit

## Executive verdict

**REJECT WHOLE-BRANCH MERGE; HOLD FOR SELECTIVE SALVAGE.**

The remote branch `codex/media-production-skills-curation` is a stale,
multi-purpose development line, not a merge-ready feature branch. It contains
useful historical evidence and three potentially reusable payload clusters, but
also stale gates, old Work Block records, and a superseded immobilier hero
implementation. The safe disposition is to retain it temporarily as evidence,
extract the three approved salvage payloads into new bounded WBs, then retain it
until those WBs are complete or explicitly rejected before a separate
Owner-controlled deletion decision.

## Frozen identity

| Subject | Value |
|---|---|
| Audit WB | `WB-2026-09-06-media-production-skills-curation-disposition` |
| Audit branch | `audit/media-curation-disposition-017` |
| Audit base / current main | `c9dbff15902d2e83ef1252fc3dd7d6a6b962be03` |
| Remote target | `codex/media-production-skills-curation` |
| Target head | `00cd532d7e3ca57751dcdc71b8fc5ad8af3e48e8` |
| Target date / subject | 2026-07-21 / `feat(sdlc): enforce work block commit trailer` |
| PR evidence | No PR found for this head/branch via `gh pr list --state all --head ...` |

## Divergence

The target is 127 commits behind and 8 commits ahead of `origin/main`; `git
cherry` reports all 8 target commits as non-equivalent (`+`). The three-dot
diff contains 59 paths, 2,529 textual additions, and 161 textual deletions.
The path grouping is 5 application/media paths, 50 coordination/docs paths,
and 4 other paths.

### Functional payload disposition

| Cluster | Evidence | Value | Disposition |
|---|---|---|---|
| Immobilier `HomePage.tsx` | Target blob `025d67c...`; main blob identical | Already integrated | No port; retain only as historical overlap evidence |
| `hero-part2.mp4` | Target and main blob `d4b8623...`, 4,952,640 bytes | Already integrated | No port |
| Immobilier `HeroMedia.tsx` + CSS | Target differs from main; main has a later `HeroMedia` using `hero-veo-20260724.mp4`, static priority image and no loop | Historical alternative; regression risk if copied blindly | No direct port; if needed, open a new showcase review WB with browser/mobile evidence |
| `generate_hero_veo.py` | Unique to target; 191 lines | Historical script, not a current implementation baseline | **DO NOT MIGRATE / REFERENCE ONLY**; do not port or use the script as implementation. Salvage only its transaction-contract semantics, skill/template, and architecture rules, freshly adapted to current `main` |
| video-generator skill/template | Unique target additions; provider-neutral state machine and allowlisted record template | Reusable transaction-contract semantics and governance documentation | **SALVAGE** in a separate bounded video-generator transaction-contract WB; adapt to current `main`, not the historical implementation |
| commit hook/tests | Unique target `.githooks/commit-msg` and fixture test | Potential local trailer control | New governance-control WB; not a direct merge because current main lacks this payload |
| historical July docs/gates | 50 coordination/docs paths; several closed, blocked, UNVERIFIED, or pending records | Evidence, not current state | Preserve as historical reference; do not treat target gate as active |

## Historical Work Block findings

- The July video transaction and verifier-correction records are substantially
  documented. They explicitly preserve `UNVERIFIED` or advisory outcomes where
  independent evidence was unavailable.
- The immobilier reconciliation tasklist has IVR-01 through IVR-05 `DONE`, but
  IVR-06 (“stage and commit only the six literal packets; do not push”) is
  `PENDING`. This is a historical unfinished publication step, not authority
  to stage or publish now.
- The original target `.agent/critic-gate.md`, `.agent/verification-gate.md`,
  and `.codex/write-gate.md` refer to July Work Blocks and cannot be used as
  current lifecycle SSOT.
- The target's last commit has a valid `Work-Block:` trailer for
  `WB-2026-07-21-workblock-commit-hook`, but the branch as a whole combines
  several unrelated Work Block families.

## Priorities

- **BLOCKER:** none for this read-only audit. Merge/deletion authority is not
  implied.
- **P0:** none. No production outage or security defect was established by this
  disposition audit.
- **P1:** execute or explicitly reject the three Owner-approved salvage
  clusters: video-generator transaction contract, commit ↔ Work Block trailer
  hook redesign, and sprint-analysis evidence/linkage hardening. Retain the
  target until those bounded WBs are complete or explicitly rejected.
- **P2:** historical application/media implementation, including the old
  generator script, is not part of the salvage backlog; historical docs remain
  reference-only. A future immobilier hero/media review or historical
  lifecycle closeout requires a new need and a separate Owner decision.
- **P3:** preserve or prune historical documentation after all references and
  retention needs are checked.

## Recommended future Work Blocks

1. **Video-generator transaction contract** — separate AzurSysTech WB;
   salvage state-machine, acknowledgement, retrieval, provenance/quarantine,
   template, and technical/provenance/commercial semantics; no direct script
   migration, provider call, or media publication.
2. **Commit ↔ Work Block trailer hook redesign** — separate governance WB;
   redesign and test the historical hook against the current lifecycle record
   format and its active/inactive and malformed-input cases.
3. **Sprint-analysis evidence/linkage hardening** — separate small AzurSysTech
   WB; strengthen trailer-first attribution, fallback classification, status
   caveats, and evidence-gap language.

Immobilier hero/media review and historical lifecycle closeout are not current
recommended salvage WBs; either requires a separate future need and new Owner
decision.

## Final recommendation

Do not merge the remote branch. The Owner has already selected three salvage
clusters: the video-generator transaction contract, the commit ↔ Work Block
trailer hook redesign, and sprint-analysis evidence/linkage hardening. Retain
the target branch until those three bounded WBs are implemented or explicitly
rejected. Once the needed payloads are preserved or rejected, the branch
becomes a candidate for separate Owner-controlled deletion; until then,
deletion risks losing unique evidence.

## Owner-approved disposition matrix

| Cluster | Disposition | Required handling |
|---|---|---|
| Video-generator transaction contract | **SALVAGE — separate AzurSysTech Work Block** | Preserve the state machine, ambiguous-acknowledgement stop, bounded retrieval, transaction template, provenance/quarantine rules, and the technical/provenance/commercial decision split. Adapt to current `main`; do not cherry-pick blindly. |
| Commit ↔ Work Block trailer hook | **REDESIGN + SALVAGE — separate governance Work Block** | Historical capability is valuable, but the old parser reads legacy `Status: READY` / `Work Block: WB-...` lines, while current records use Markdown `- **Status:**` / `- **Work Block:**`. Redesign against the current schema and test active/inactive, missing/correct/mismatched/malformed/multiple trailers, closed lifecycle, and `--no-verify` limitations. |
| Sprint-analysis evidence/linkage improvements | **SALVAGE — separate small AzurSysTech Work Block** | Review current `sprint-analysis` skill and extractor for trailer-first attribution, legacy/missing/malformed/multiple classes, secondary heuristic matching, period-end status caveats, and stricter false-READY/evidence-gap language. Do not copy historical versions blindly. |
| Historical media/immobilier plans, reports, tasklists | **REFERENCE ONLY** | Do not migrate wholesale. Preserve as historical source until selective salvage decisions are implemented or rejected; reference exact SHAs when needed. |
| Historical showcase/media implementation | **DO NOT MIGRATE** | Do not carry forward historical `HeroMedia`, CSS, generator implementation, media, or historical lifecycle state. Any new need requires a fresh bounded showcase/media review WB. |

## Sequencing and framework boundary

1. Publish this disposition audit.
2. Open separate bounded AzurSysTech WBs for the three salvage clusters.
3. Retain `codex/media-production-skills-curation` until salvage decisions are
   implemented or explicitly rejected.
4. Perform Owner-controlled remote branch deletion only after that decision.
5. Defer framework upstreaming to a later separate activity.

Potential future framework candidates are limited to the commit↔Work Block
linkage contract, the sprint-analysis trailer-first evidence model, and a
generic external/billable transaction-safety pattern. No framework change is
authorized or performed by this WB.
