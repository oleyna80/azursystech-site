# Critic report — Crawl / Indexation Reconciliation

Verdict: `READY`

## Read-only challenge

- The P0 finding is tested against live production on 2026-09-09, not carried
  forward as an assumption from September 3.
- The source/deployment distinction is explicit: source already contains the
  localized routes and sitemap; the last successful deployment is older than
  the source route work.
- The plan does not silently convert `/brief` into an indexation decision and
  explicitly preserves `/demo/*`.
- The source write-set is empty unless a fresh check proves a defect. This is
  the simplest sufficient response to a stale production runtime and avoids a
  speculative workaround.
- Registry/map changes are limited to lifecycle projection fields and the
  separate control-plane branch is not touched.

## Residual challenge

The public runtime has no revision endpoint; deployment workflow provenance is
therefore the strongest available revision evidence, while route/status/body
probes remain the observable production truth. A post-deploy crawl is required
after Owner deploys the canonical immutable source revision.

No unresolved scope, authority, or acceptance blocker remains for a
reporting-only candidate.

