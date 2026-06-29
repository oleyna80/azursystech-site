# Critic Review - WB-2026-06-27 Assurance Product Pages Port

## Status

Complete

## Lifecycle stage

Review

## Role

Reviewer / Critic

## Scope reviewed

- `docs/plans/WB-2026-06-27-assurance-product-pages-port.md`
- `/home/azur/Projects/assurance/assurances/*.html`
- `showcase/app/demo/assurance/_components/AssuranceInfoShell.tsx`
- `showcase/components/assurance/products.ts`
- `.agent/skills/source-page-porting/SKILL.md`

## Verdict

APPROVE WITH GUARDRAILS

## Findings

No blocking findings.

## Review notes

1. **The plan correctly identifies the route gap.**
   The Assurance shell already links product slugs to `/demo/assurance/assurances/${slug}`, but the target routes do not exist. Implementing the index plus detail routes is the right repair.

2. **The source does not provide a tracked `assurances/index.html`.**
   The plan avoids inventing a blind one-to-one copy. It uses the 8 tracked source detail pages as the authority and creates a showcase index from the same product set.

3. **A shared data-driven detail route is preferable.**
   Eight nearly identical static page implementations would increase drift. A `[slug]` route backed by structured source-derived data is the cleaner approach, as long as the source-specific text and guarantee lists are preserved.

4. **The plan preserves the existing Assurance shell.**
   This is important because previous WBs fixed logo typography, menu treatment, hero scale, and scroll visibility problems. Product pages should inherit that corrected shell rather than reintroduce source-page header variants.

5. **The plan keeps runtime boundaries clear.**
   Source JS, cookie banners, provider calls, env/config, and backend behavior remain out of scope. This matches portfolio-demo expectations.

## Required implementation guardrails

- Do not add a root `/assurances` route outside `/demo/assurance` unless Owner explicitly expands scope.
- Do not copy source JavaScript, cookie banner runtime, analytics, provider integrations, env/config, secrets, or credentials.
- Keep implementation data-driven enough to avoid 8 divergent page copies.
- Preserve existing `PRODUCTS` consumers when extending product data.
- Keep product dropdown and footer links working.
- Keep header, logo, hero H1, and hero subtitle independent from reveal/IntersectionObserver behavior.
- Do not edit unrelated dirty files in `showcase/demo-kit/**` or `showcase/lib/demos.ts`.
- Do not commit or push without separate Owner approval.

## Verification requirements

- Run `git diff --check`.
- Run lint/type/build checks from `showcase/`.
- Check HTTP 200 for the index and all 8 product detail routes.
- Check unknown product slug returns a 404.
- Browser-check desktop and mobile for index plus at least two representative detail pages.
- Browser-check scroll down/up for header and hero visibility.
- Browser-check header dropdown and footer product navigation.
- Static-scan the changed route/data files for source runtime, provider calls, env/secrets, and token-like strings.
- Re-check neighboring demo routes, including `/demo/assurance` and `/demo/plomberie`.

## Residual risks

1. The source has no tracked category index page, so the showcase index will be a composed page rather than a literal source port. This is acceptable if the Owner wants a portfolio route for "Types d'assurances".
2. Product detail fidelity depends on capturing enough source content in structured data. If the source pages contain additional nuanced sections beyond guarantees and CTA, a second refinement pass may be needed.
3. The current dirty tree already includes multiple previous WBs. Commit readiness must remain selective and path-reviewed.

## Recommended next action

Proceed to Implementation after Owner confirms this WB scope.
