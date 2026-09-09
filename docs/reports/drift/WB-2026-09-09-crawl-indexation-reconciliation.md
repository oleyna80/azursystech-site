# Drift report — Crawl / Indexation Reconciliation

Verdict: `ALIGNED` for source, specification, tasklist, and evidence; runtime
drift remains explicitly open at the Owner deployment boundary.

- Specification REQ/AC, tasklist, and source diff agree on the four
  self-canonical corrections and the no-`/brief`-policy boundary.
- `origin/main` contains the localized sitemap/routes and legacy redirects;
  production is demonstrably older (`d647f6a` deployment evidence versus
  `d5fc9ed` source base).
- The intentionally separate showcase surface is preserved: `/demo/health`
  is not added to the website sitemap or treated as drift.
- Registry/map lifecycle projections point at this Work Block while active;
  no unrelated branch/worktree or dirty baseline was reconciled.

The remaining production/source mismatch is release drift, not documentation
drift or an unresolved source-route defect.

