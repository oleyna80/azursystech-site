---
name: nextjs-seo-build-verifier
description: Verify Next.js App Router build outputs for correct SEO tags (hreflang, canonical, JSON-LD) directly from compiled bundles, without requiring a browser.
---

# Skill: Next.js SEO Build Verifier

## Objective
Quickly and reliably confirm that critical SEO tags and Structured Data (JSON-LD) are present in the compiled Next.js App Router build output before deploying. This prevents deploying regressions in SEO architecture.

## Preconditions
- The project must have just been built locally (`npm run build`).
- Target paths: `.next/server/app/` (for static HTML pages) and `.next/server/chunks/` (for dynamic JS bundles).

## Workflow

1. **Locate Build Artifacts**
   Next.js App Router outputs pages in two formats depending on rendering strategy:
   - **Static Pages (`○`)**: Exported as `.html` files in `.next/server/app/`.
   - **Dynamic Pages (`ƒ`)**: Bundled into JavaScript chunks in `.next/server/chunks/ssr/`.

2. **Verify Static Pages (`○`)**
   Use the `grep_search` tool to search the `.next/server/app/` directory.
   - For `hreflang`: Search for `"hreflang"` or `"x-default"`.
   - For `canonical`: Search for `"canonical"`.
   - For JSON-LD: Search for `"LocalBusiness"`, `"FAQPage"`, `"ITService"`, etc.

3. **Verify Dynamic Pages (`ƒ`)**
   Use the `grep_search` tool to search the `.next/server/chunks/ssr/` directory.
   Since dynamic pages compile to JS bundles containing React rendering instructions, look for exact string literals:
   - For `hreflang`: Search for `\"hreflang\"` or `\"x-default\"`.
   - For JSON-LD: Search for `\"LocalBusiness\"`, `\"FAQPage\"`.
   
   *Tip: Because JS chunks are minified and large, use narrow search queries and limit output lines to confirm presence without overwhelming the agent context.*

4. **Verify Sitemap and Robots**
   - Check `sitemap.xml`: Use `view_file` on `.next/server/app/sitemap.xml.body` (if generated dynamically via `sitemap.ts`) or `.next/server/app/sitemap.xml`.
   - Check `robots.txt`: Use `view_file` on `.next/server/app/robots.txt.body`.

## Output
- Confirmation of presence/absence of `canonical`.
- Confirmation of presence/absence of all required `hreflang` locales (e.g., `fr`, `ru`, `x-default`).
- Confirmation of specific JSON-LD types (`LocalBusiness`, `FAQPage`, etc.).
- Validation of `sitemap.xml` contents.

## Guardrails
- **Do not use bash commands for simple file searches.** Always prioritize the agent's built-in `grep_search` and `view_file` tools.
- Do not run this before a fresh `npm run build`. Old build artifacts might return false positives.
- If SEO tags are missing from the build, halt deployment and return to the `Scoped Coder` phase to fix the metadata generation.

## Handoff
- **Success condition**: All expected SEO tags and structured data types are found in the relevant `.next/server/` output files.
- **Next**: Proceed to deployment (`vps-registry-pull-deploy`).
