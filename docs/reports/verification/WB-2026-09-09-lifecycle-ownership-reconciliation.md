# Verification report — Lifecycle and Ownership Reconciliation

Verdict: `READY`.

## Baseline and integrated evidence

- Canonical baseline and current `origin/main`: `ae63875dfb30332afa85790c05c81c9717a357f9`.
- Subject branch: `feat/wb-lifecycle-ownership-reconciliation-027`.
- Integrated Crawl candidate: `feat/wb-crawl-indexation-reconciliation-025`
  at `1d389df343ad259409231ed948a139973995ae8f`.
- Integrated fixture candidate: `feat/wb-release-state-fixture-isolation-026`
  at `ae63875dfb30332afa85790c05c81c9717a357f9`.
- Successful GitHub workflows for `ae63875dfb30332afa85790c05c81c9717a357f9`:
  Deploy to VPS `34353836454`, Docker Publish `34353049272`, Release State
  Contract `34351587387`, Control Plane Contracts `34351587391`, and CI
  `34351587450`.
- The public deployment workflow and live probes corroborate the approved
  production revision; `/health` is healthy but intentionally exposes no
  commit identifier.

## Production reconciliation evidence

- `GET /health`: `200`, `{"status":"ok"}`.
- `GET /sitemap.xml`: `200`, exactly 38 `<loc>` entries. The set matches the
  current canonical `web/src/app/sitemap.ts` route contract, including the
  localized home, guide, portfolio, and detail routes and the four legal pages.
- Localized routes `/fr/portfolio` and
  `/fr/guides/automatiser-demandes-clients`: `200`.
- Legacy redirects: `/portfolio` → `/fr/portfolio`,
  `/portfolio?locale=ru` → `/ru/portfolio`, `/portfolio/plomberie` →
  `/fr/portfolio/plomberie`, and `/ai-automation` → `/fr/ai-automation`; all
  returned `308` before the final `200` destination.
- Self-canonicals: `/data-deletion`, `/legal`, `/privacy`, `/terms`,
  `/fr/portfolio`, and `/fr/guides/automatiser-demandes-clients` each emitted
  the matching `https://azursystech.fr<path>` canonical.
- `/demo/health`: `200`; `/demo/not-a-demo`: `404`. Showcase routing remains
  separate from the public sitemap and was not treated as drift.
- `/brief`: `200`; no policy or canonical decision was made here.
- Retired route probes `/home`, `/business`, `/contact`, `/about`, `/pricing`,
  `/faq`, and unknown portfolio/demo paths retained intended `404` behavior;
  `/thank-you` remains an existing application route and was not changed.

## Branch/worktree ownership and non-destructive cleanup manifest

The following registered missing/prunable worktrees were observed with
`git worktree prune --dry-run --verbose`; no prune was executed:

| Registration | Evidence / branch | Disposition |
|---|---|---|
| `/tmp/azursystech-wb-media-curation-disposition-017` | `audit/media-curation-disposition-017` @ `568d6ed4e7d37cbd8cfe47a0e5f7db1cfb844fcf` | `SUPERSEDED_CLEANUP_CANDIDATE` — merged PR-backed history; Owner cleanup only |
| `/tmp/azursystech-wb-multilingual-integration-021` | `feat/multilingual-integration-021` @ `4ec6a2236a9d5736ffaee6456cfc4e76bd04ece4` | `PRESERVE_OWNER_DECISION` — related multilingual Define provenance |
| `/tmp/azursystech-wb-scoped-worker-session-recovery` | `feat/scoped-worker-session-recovery` @ `4ec6a2236a9d5736ffaee6456cfc4e76bd04ece4` | `PRESERVE_REFERENCE` — predecessor control-plane reference |
| `/tmp/azursystech-wb-scoped-worker-session-recovery-reconciled` | `feat/scoped-worker-session-recovery-reconciled-024` @ `2dbe24733669238835fd2020775bb90784d4ea3a` | `PRESERVE_OWNER_DECISION` — explicitly protected candidate |
| `/tmp/azursystech-wb-sprint-analysis-hardening-020` | `feat/sprint-analysis-hardening-020` @ `0c31ad56b186d4ad7e084da16749fff61aaa6d45` | `SUPERSEDED_CLEANUP_CANDIDATE` — merged PR-backed history; Owner cleanup only |
| `/tmp/azursystech-wb-video-generator-transaction-contract-018` | `feat/video-generator-transaction-contract-018` @ `b23bf04cdb2879ae48d0ac2e552f319d71a5232a` | `SUPERSEDED_CLEANUP_CANDIDATE` — merged PR-backed history; Owner cleanup only |
| `/tmp/azursystech-wb-work-block-commit-linkage-019` | `feat/work-block-commit-linkage-019` @ `080b908020dc88f38d2127d6f612ef45ad2d0082` | `SUPERSEDED_CLEANUP_CANDIDATE` — merged PR-backed history; Owner cleanup only |

Existing present worktrees and relevant refs remain preserved:

- canonical `main` @ `ae63875dfb30332afa85790c05c81c9717a357f9`:
  `PRESERVE_ACTIVE` because the canonical checkout owns three untracked
  multilingual Define files;
- this subject worktree: `PRESERVE_ACTIVE` while the candidate is open;
- Crawl `025` and fixture `026` worktrees/branches:
  `SUPERSEDED_CLEANUP_CANDIDATE`, no action;
- `feat/scoped-worker-session-recovery-reconciled-024`:
  `PRESERVE_OWNER_DECISION`, no action;
- `feat/multilingual-integration-021`, `feat/english-translation`, and
  `feat/technical-seo-multilingual-integrity`:
  `PRESERVE_OWNER_DECISION` or `SUPERSEDED_CLEANUP_CANDIDATE` only as
  separately evidenced by their provenance; no action;
- `baseline/azursystech-441b134d`, `codex/media-production-skills-curation`,
  and `wb/2026-08-25-shared-analysis-surface`:
  `PRESERVE_REFERENCE` pending explicit Owner disposition.

## Multilingual Define artifacts

The following canonical-checkout files are untracked, byte-preserved, and have
no implementation or completion evidence:

- `docs/plans/WB-2026-09-08-multilingual-production-integration.md`
- `docs/specs/WB-2026-09-08-multilingual-production-integration.md`
- `docs/tasklist/WB-2026-09-08-multilingual-production-integration.tasklist.md`

Disposition: `PRESERVE_ACTIVE` for the dirty canonical checkout and
`PRESERVE_OWNER_DECISION` for the Define package. It is a substantive pending
successor definition, not an abandoned artifact that this Work Block may
delete, implement, or silently close.

## Validation results

| Check | Result |
|---|---|
| `python3 scripts/validate-define-traceability.py ...` | PASS — `READY`, 5 requirements / 5 acceptance / 6 tasks |
| `python3 scripts/validate-release-state.py` | PASS — `READY` before final closeout; rerun required after closeout |
| `python3 scripts/test-release-state-contracts.py` | PASS |
| `python3 scripts/test-active-work-block-recovery.py` | PASS |
| `python3 scripts/test-github-capability-control-plane.py` | PASS — 14/14 |
| GitHub required checks on integrated main | PASS — CI, Control Plane, Release State, Docker Publish, Deploy to VPS |
| `git worktree prune --dry-run --verbose` | PASS as read-only inventory; no prune executed |
| `git diff --check` | PASS after final candidate assembly |

No production code, route, sitemap, deployment, dependency, database, secret,
branch, or worktree registration was changed.
