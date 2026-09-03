---
artifact_type: specification
work_block_id: WB-2026-09-03-technical-seo-cwv-entity-audit
revision: v1
---

# Technical SEO, Crawl, CWV, Mobile, Structured-Data and Entity Audit

## Status and authority

- Governance profile: Managed
- Subject branch: `audit/technical-seo-cwv-entity`
- Frozen base: `a8e4c672632a2c2cca4d5ea60770231da32d1e1c`
- Mode: audit-only, read-only against application/runtime; documentation and lifecycle evidence only
- Production target: `https://azursystech.fr`

## Objective

Produce an evidence-backed audit of the current repository/main implementation and live production site, using the supplied 41-point taxonomy. Classify every item as PASS, PARTIAL, FAIL, N/A, or UNVERIFIED; distinguish source, lab, field, and Search Console evidence; test hypotheses H1-H7; and propose bounded future implementation Work Blocks without implementing fixes.

## Requirements

- REQ-001: Inspect the exact frozen repository subject and current production origin without modifying application code, deploying, pushing, merging, opening a PR, or changing live data.
- REQ-002: Evaluate every checklist item 1-41 with the required fields: finding, evidence, affected URL/path, SEO/user impact, confidence, recommended action, priority P0-P3, and future-WB disposition.
- REQ-003: Cover repository/source, live HTTP/runtime, browser/mobile, performance, structured-data, and Search Console access boundaries separately; never infer production behavior from source or public `site:` queries.
- REQ-004: Interpret Core Web Vitals with current thresholds LCP <=2.5s, INP <=200ms, CLS <=0.1, labeling CrUX/field versus Lighthouse/PageSpeed/lab evidence and reporting unavailable field data as UNVERIFIED.
- REQ-005: Test hypotheses H1-H7 and record evidence-supported conclusions, including whether `/brief` and locale query variants have an indexation risk.
- REQ-006: Produce requirements-quality, traceability, plan/tasklist, full audit matrix, prioritized findings, remediation decomposition, Review, Verification, and Drift evidence within the approved documentation/report paths.
- REQ-007: Prove audit-only scope integrity with exact base/current HEAD, clean or documented status, `git diff --check`, and a changed-path allowlist showing no application source modifications.

## Acceptance criteria

- AC-001 [req=REQ-001]: Preflight and final reports bind evidence to the exact branch, base SHA, current HEAD, and production origin, and explicitly state no application code, push, merge, PR, or deploy occurred.
- AC-002 [req=REQ-002]: The main report contains exactly one classified matrix row for each item 1-41 with all required fields populated or explicitly marked unavailable.
- AC-003 [req=REQ-003]: Findings identify evidence source and avoid treating source as proof of live behavior or public search queries as proof of indexation.
- AC-004 [req=REQ-004]: CWV rows distinguish field and lab evidence and apply the stated thresholds without presenting lab scores as real-user CWV.
- AC-005 [req=REQ-005]: H1-H7 each has a tested conclusion, evidence, confidence, and bounded follow-up recommendation.
- AC-006 [req=REQ-006]: Requirements-quality, traceability, plan, tasklist, review, verification, drift, matrix, priorities, and remediation reports exist under the approved write-set.
- AC-007 [req=REQ-007]: Final integrity checks pass or are transparently reported, and the final diff contains only lifecycle/docs/report paths authorized for this Work Block.

## Non-goals and hard stops

No application/web source edits, SEO fixes, dependency/config/env changes, database action, deployment, service restart, cache purge, Search Console mutation, commit, push, PR, merge, destructive operation, or external client communication. Search Console data is not assumed available; absent access is UNVERIFIED.

## Audit taxonomy

The matrix covers A1-A10, B11-B16, C17-C25, D26-D29, E30-E35, F36-F40, and G41. The supplied numbering is authoritative for this audit even though sections contain 41 total checks.
