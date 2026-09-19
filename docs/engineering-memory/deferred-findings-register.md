# Deferred Findings Register

This file is the durable, advisory parking place for **material findings discovered while working on another task** when they should not expand the active Work Block.

It exists to prevent useful findings from being lost while preserving scope discipline.

## Operating rule

- Record only findings with enough evidence to be actionable later.
- Do not fix them opportunistically inside an unrelated Work Block.
- Each finding is advisory until the Owner explicitly promotes it into a dedicated Work Block/specification.
- Re-check the evidence before implementation because production state may have changed.
- Close an item only after the corresponding Work Block verifies the correction, or when the Owner explicitly rejects it.
- Review this register periodically (for example, during a maintenance / technical-debt session).

## Status values

- **NEW** — captured, not yet triaged.
- **TRIAGED** — priority and likely action agreed.
- **PLANNED** — promoted into an approved Work Block.
- **RESOLVED** — verified fixed.
- **REJECTED** — intentionally not pursued.

---

## DF-2026-09-19-001 — AI crawler receives HTTP 403

- **Domain:** SEO / AI readability / delivery edge
- **Status:** NEW
- **Priority:** P0
- **Observed:** 2026-09-19
- **Source:** external agent-readability scan of `https://azursystech.fr`
- **Finding:** Normal browser/scanner access returned the public site, but the audit reported that AI crawler user-agents such as GPTBot receive HTTP 403 even though `robots.txt` does not block them.
- **Why it matters:** If confirmed, AI crawlers cannot fetch the public site regardless of page-level SEO or `llms.txt` work.
- **Next action:** Reproduce with controlled HTTP requests against production, identify whether the block comes from Cloudflare/WAF/reverse proxy/hosting policy, and decide the intended crawler policy. If public AI crawling is desired, allow it at the HTTP edge while keeping policy in `robots.txt`.
- **Do not:** weaken unrelated security controls or change production WAF rules without a separate approved Work Block.

## DF-2026-09-19-002 — Missing Open Graph title and description

- **Domain:** SEO / social metadata
- **Status:** NEW
- **Priority:** P1
- **Observed:** 2026-09-19
- **Source:** external agent-readability scan of the production homepage
- **Finding:** The sampled page did not expose `og:title` or `og:description`.
- **Why it matters:** These fields improve link previews and provide another explicit machine-readable statement of page identity and summary.
- **Next action:** Audit current Next.js metadata generation for the root/localized pages and service pages; add Open Graph metadata using the same canonical localized copy rather than a separate divergent source.

## DF-2026-09-19-003 — Structured-data completeness needs audit

- **Domain:** SEO / structured data
- **Status:** NEW
- **Priority:** P1
- **Observed:** 2026-09-19
- **Source:** external agent-readability scan of the production homepage
- **Finding:** JSON-LD is present, but the scanner reported missing page-identity fields such as name/headline, description, URL and breadcrumb context in the primary interpreted entity.
- **Why it matters:** Existing JSON-LD should make page identity and hierarchy unambiguous and remain consistent with visible content.
- **Next action:** Audit the actual JSON-LD graph on localized home/service pages. Normalize `WebPage` / `Service` / `BreadcrumbList` relationships where needed. Treat the scanner result as a trigger for inspection, not proof that every reported field is required on every schema type.
- **Constraint:** Do not add structured-data claims that are absent from visible content.

## DF-2026-09-19-004 — Public form accessibility gaps

- **Domain:** Accessibility / agent interaction
- **Status:** NEW
- **Priority:** P1
- **Observed:** 2026-09-19
- **Source:** external accessibility/agent-readability scan
- **Finding:** The scan reported 11 of 13 form controls without an accessible label and one control whose accessible name did not contain its visible label.
- **Why it matters:** Screen readers and browser/AI agents need stable accessible names to understand and operate forms.
- **Next action:** Audit rendered contact/intake forms for `label`, `for`/`id`, `aria-label`, and `aria-labelledby` correctness and fix the exact affected controls in a focused accessibility Work Block.

## DF-2026-09-19-005 — AI discovery file is absent

- **Domain:** AI readability / experimental discovery
- **Status:** NEW
- **Priority:** P2
- **Observed:** 2026-09-19
- **Source:** external agent-readability scan
- **Finding:** `/llms.txt` is absent and there is no page-level discovery link for it.
- **Why it matters:** `llms.txt` is an emerging voluntary discovery convention for some AI agents. It is not a prerequisite for normal search indexing and should not be treated as a ranking mechanism.
- **Next action:** After crawler access is confirmed, consider a small generated or maintained `/llms.txt` containing only canonical public service, portfolio and contact URLs. If adopted, keep it synchronized with real public routes and add discovery metadata only where justified.
- **Priority note:** Do not prioritize this above HTTP crawler access, canonical HTML content, metadata or accessibility.

## DF-2026-09-19-006 — Markdown alternatives / content negotiation absent

- **Domain:** AI readability
- **Status:** NEW
- **Priority:** P3
- **Observed:** 2026-09-19
- **Source:** external agent-readability scan
- **Finding:** The sampled page has no Markdown mirror, no `rel="alternate" type="text/markdown"`, and no `Accept: text/markdown` content negotiation.
- **Why it matters:** Clean Markdown can make long documentation easier for agents to parse, but the benefit for a small commercial marketing site is uncertain.
- **Next action:** Reassess only after the higher-priority crawler, metadata and accessibility items. Prefer high-quality semantic HTML first. Do not build a parallel content system solely to satisfy a scanner.

## DF-2026-09-19-007 — Media dimensions are not explicit

- **Domain:** Performance / accessibility / Core Web Vitals
- **Status:** NEW
- **Priority:** P2
- **Observed:** 2026-09-19
- **Source:** external accessibility/agent-readability scan
- **Finding:** The scan reported that six sampled media elements did not declare explicit dimensions/aspect ratio.
- **Why it matters:** Missing reserved dimensions can contribute to layout shift and make visual interaction less stable.
- **Next action:** Audit actual image components and verify whether Next.js/image CSS already reserves layout space. Fix only elements that can cause CLS.

## DF-2026-09-19-008 — Sitemap has no lastmod values

- **Domain:** Technical SEO
- **Status:** NEW
- **Priority:** P3
- **Observed:** 2026-09-19
- **Source:** external agent-readability scan
- **Finding:** The production sitemap was valid and contained 38 URLs, but the scanner reported no `lastmod` values.
- **Why it matters:** Trustworthy modification dates can help crawlers understand freshness, but fabricated or build-time-only dates are misleading.
- **Next action:** Add `lastmod` only if the application has a reliable source of meaningful per-page modification dates. Otherwise keep the sitemap without synthetic dates.

## Explicitly not accepted from the scan

The scan also suggested publishing a public `AGENTS.md`, a glossary link, and other agent-specific surfaces. These are **not automatically accepted requirements** for AzurSysTech.

- Do not expose the repository's internal `AGENTS.md` operating contract on the public website.
- Do not create a glossary solely to satisfy a generic scanner unless real user/content needs justify it.
- Do not add synthetic metadata or duplicate content solely to increase an agent-readability score.

The scanner is evidence and a discovery aid, not a source of product or architecture authority.
