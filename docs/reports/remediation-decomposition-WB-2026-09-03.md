# Remediation decomposition — WB-2026-09-03-technical-seo-cwv-entity-audit

This report proposes bounded successor Work Blocks. No remediation is authorized
by the audit Work Block.

1. **WB-Crawl-Indexation-Reconciliation (P0):** reconcile deployed revision and
   source routes; repair sitemap and legacy redirects; run a full crawl. Treat
   `/brief` indexation as a separate P1 policy decision, and change source links
   only if post-reconciliation crawling proves stale targets or redirects.
2. **WB-CWV-Image-Mobile (P1):** collect field/lab baselines; measure template
   LCP/CLS/INP; inventory image bytes and formats; test mobile interaction and
   implement only measured improvements.
3. **WB-Entity-Structured-Data (P1):** define canonical Organization identity;
   normalize WebPage/Service/Article/BreadcrumbList; validate visible/schema parity.
4. **WB-GSC-Indexation-Baseline (Owner access dependent):** capture Pages,
   canonicals, sitemap, crawl, Performance, CWV, enhancements, and manual-action
   baselines, preserving unavailable data as `UNVERIFIED`.

Each successor Work Block needs its own specification, write-set, assurance, and
Owner-controlled publication/deployment decisions where applicable.
