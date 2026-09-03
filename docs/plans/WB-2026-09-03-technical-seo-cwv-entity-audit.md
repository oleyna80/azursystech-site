---
artifact_type: work_block
work_block_id: WB-2026-09-03-technical-seo-cwv-entity-audit
status: in_progress
revision: v1
---

# Work Block Plan: Technical SEO / CWV / Entity Audit

## Objective and boundary

Read-only audit of repository/main and `https://azursystech.fr`. Allowed writes are lifecycle coordination, this specification/plan/tasklist, and reports for this Work Block. No `web/`, `admin/`, `showcase/`, runtime, deployment, dependency, or configuration changes.

## Execution stages

1. Define: bind exact SHA, requirements, taxonomy, evidence rules, access limits, and task traceability.
2. Discovery: inventory routes, metadata, robots, sitemap, redirects, images, scripts, schema, internal links, and existing tests.
3. Runtime: read-only HTTP checks against production; browser checks at desktop and 360px-class mobile; lab performance only where reproducible.
4. Synthesis: classify 41 rows, test H1-H7, count statuses, prioritize findings, and decompose future WBs.
5. Assure/Close: independent read-only review, verification against acceptance criteria, drift check, final path/diff integrity, and reporting-only closeout if any required evidence remains unavailable.

## Evidence rules

Source evidence is labeled `repository`; HTTP headers/status/body and browser observations are labeled `production`; Lighthouse/PageSpeed are `lab`; CrUX/RUM is `field`; Search Console is `GSC`. A missing capability is UNVERIFIED, not FAIL. Public search queries cannot establish indexation. Each row names exact URLs/paths or says not applicable.

## Checks

- Exact preflight and final Git state; `git diff --check`.
- Source inspection of `web/` route tree, metadata, robots, sitemap, redirects, schemas, images, fonts, scripts, and link topology.
- Production `curl`/HTTP probes for canonical hosts, status/redirects, robots, sitemap, representative localized/legacy/query URLs, headers, and schema-bearing pages.
- Browser/mobile inspection at 360px-class and desktop widths, including overflow, navigation/dialog/chat interference, and representative page parity.
- Lab performance probes when tooling and runtime access permit; report tool/version and limitations.
- `scripts/validate-define-traceability.py --spec ... --tasks ...` and relevant repository validators only; no application mutation.

## Deliverables

`docs/reports/requirements-quality-*`, `traceability-*`, `consistency-*`, `critic-*`, `technical-seo-cwv-entity-audit-*`, `prioritized-findings-*`, `remediation-decomposition-*`, `review-*`, `verification-*`, and `drift-*`.

## Future implementation grouping

Recommendations should normally be grouped into: (1) crawl/indexation and URL integrity, (2) CWV/image/mobile performance, and (3) entity/structured-data cleanup. A separate content/architecture WB is proposed only if evidence requires it.
