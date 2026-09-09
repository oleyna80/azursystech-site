---
schema_version: 1
artifact_type: specification
work_block_id: WB-2026-09-09-crawl-indexation-reconciliation
revision: 1
status: approved
---

# Specification — Crawl / Indexation Reconciliation

## Objective

Reconcile the P0 route and sitemap drift identified by the September 3
technical SEO audit against the current production observable state and the
canonical source at exact `origin/main` `d5fc9ed2c64f0d2f62ac46cb294637bac5657793`.
Determine whether source remediation is still required, preserve intentional
showcase routing, and stop at the Owner-controlled deployment boundary when
the source is already correct.

## Requirements

- REQ-001: Record the latest successful production deployment provenance and
  the observable production revision evidence, distinguishing it from the
  canonical source revision.
- REQ-002: Re-check the audited P0 surfaces: sitemap contents, localized
  portfolio and guide routes, legacy portfolio and AI-automation behavior,
  internal localized links, and self-canonical behavior. Preserve `/demo/*` as
  intentional showcase routing and do not decide `/brief` locale/indexation
  policy in this Work Block.
- REQ-003: Change application source only when current evidence proves a
  source defect. The four sitemap-listed legal/information pages must expose
  self-canonical metadata; if canonical source is otherwise correct and
  production is stale, produce the exact Owner deployment handoff and do not
  manufacture a source workaround or deploy.
- REQ-004: Run reproducible crawl, route, sitemap, redirect, and canonical
  assertions for the intended indexable URL set, recording positive and
  negative cases and any production limitation.
- REQ-005: Keep the Work Block bounded: no `/brief` policy decision, CWV or
  GSC inference, speculative SEO or structured-data changes, dependency,
  database, secret, merge, default-branch push, force-push, or deployment.

## Acceptance criteria

- AC-001 [req=REQ-001]: Evidence identifies the latest successful deployment
  run/head and the exact canonical source/base; public headers and bodies are
  recorded where no runtime revision endpoint exists.
- AC-002 [req=REQ-002]: Every September 3 P0 finding is classified as resolved,
  still present, or not currently observable, with `/demo/*` and `/brief`
  boundaries explicit.
- AC-003 [req=REQ-003]: The four proven missing self-canonicals are corrected
  minimally; no other application source change is present, and the report
  names the exact deployment/release action remaining with Owner.
- AC-004 [req=REQ-004]: The route matrix covers sitemap URLs, localized guide
  and portfolio routes, representative project routes, legacy redirects,
  `/demo/health`, and canonical tags; failures are not reported as passes.
- AC-005 [req=REQ-005]: No merge, deploy, default-branch mutation, force-push,
  or unrelated branch/worktree mutation occurs.

## Assumptions and explicit boundaries

- The September 3 audit and its canonical remediation decomposition are the
  baseline evidence; live probes on September 9 supersede stale observations.
- `/brief` remains a separately identified P1 product-policy decision. Its
  presence in source sitemap is observed, not changed here.
- Public production probing is read-only. VPS deployment execution and any
  service restart remain Owner-controlled hard stops.
