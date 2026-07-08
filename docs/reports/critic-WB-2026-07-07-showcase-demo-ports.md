# Critic Report — WB-2026-07-07-showcase-demo-ports

**Date:** 2026-07-07
**Reviewed:** Stage 0 Preflight + Work Block definition, AGENTS.md, ROSTER, assurance reference pattern
**Verdict:** SUPPLEMENT
**Note:** report delivered by critic agent in final message; materialized to file by Control Tower verbatim (critic agent did not persist the file itself).

---

## Scope Review

The approved write-set is well-defined and necessary:
- Maison Olive: HTML → React composition, CSS Modules, vanilla JS → client components
- Bijoux: Component port with Tailwind v3→v4 adaptation, form interception, data migration
- Registry updates (lib/demos.ts, site.ts files for both)

**Scope gaps found:**

1. **Missing: app/demo/bijoux-artisanaux/layout.tsx (or use root).** Bijoux carries next/font declarations. Should isolate fonts to avoid global collision: demo-local layout wrapping children with prefixed font CSS variables, OR inline fonts in first-loaded component.
2. **Missing: metadata + icon.svg per demo.** Assurance has `Metadata` export + `icon.svg`. Both new demos should have metadata with title/description and optionally a branded icon.svg for parity.
3. **Robots/OG:** assurance mentions-legales sets `robots: { index: false }`. Defer full robots/OG to AC (lite version = root pages only).
4. **Missing: 404 for Bijoux invalid product slug.** Add notFound() boundary to the dynamic route handler.

## Skill Routing Review

Checked: roster-10. Matched: memory-ops, git-safety. Used: memory-ops-log.

| Skill | Skip Reason | Assessment |
|---|---|---|
| design-direction | porting existing approved visuals | VALID |
| git-safety (commit/push) | Owner forbids commit/push in this WB | VALID & DOCUMENTED |
| security-pass | implied trivial | WEAK — recommend explicit justification: demo-only forms, no external POST; Coder to call out validation strategy; Verifier to spot-check input handling |

## Subagent Topology Review

Classification `Subagent-Required` ✓ (multi-domain, 9+ paths, production showcase, independent verification). Dispatch: 1 scoped-coder sequential (Maison Olive → Bijoux), 1 verifier (smoke + build + typecheck + mobile). CORRECT; no issues.

## Tailwind v4 Feasibility (Critical Decision)

Evidence from assurance: `tokens.module.css` defines all design tokens as CSS vars scoped to `.root`; components import `.root`/`.container` classnames; no Tailwind arbitrary values needed.

CSS-vars-on-wrapper + arbitrary values is viable but risky (naming collisions, arbitrary-value leakage). **Safer recommendation — follow assurance pattern:**
- `components/bijoux-artisanaux/tokens.module.css` with namespaced vars: `--bx-espresso`, `--bx-champagne`, etc.
- Wrap demo root with `<div className={styles.root}>`
- Replace `@apply` rules with CSS classes
- Write-set impact: none (implementation detail).

## Font Management (Potential Collision)

Root `app/layout.tsx` defines global font vars. If Bijoux layout reuses `--font-body`/`--font-heading` they collide. **Solution:** demo-local layout with prefixed vars (`--bx-font-body`, `--bx-font-heading` via next/font variable option). Within already-approved directory — not a write-set change, call out in AC.

## Registry & Route Conflict (Routing Precedent Check)

Assurance is BOTH in lib/demos.ts registry AND has a static folder — static routes take precedence, build succeeds. Bijoux follows same pattern: SAFE; placeholder entry becomes redundant but harmless. Maison Olive: not in registry — static folder alone works (dynamicParams=false constrains only the dynamic route). Registry entry decision (keep/remove/add) deferred to AC.

## Large Asset Management (Bijoux ~11MB JPEG)

Copy as-is to `showcase/public/demo/bijoux-artisanaux/`; optimization out of scope; note repo-size implication to Owner before commit (commit is outside this WB anyway).

## Risk Gaps & Acceptance Criteria

- No new dependencies ✓, no secrets/env ✓, no runtime/DB ✓. Verification tier standard ✓.
- Maison Olive form: replicate original mock behavior (client-side validation, ~1.4s pending state → success), document strategy.
- Image strategy: `<img>` for demo assets avoids config changes; next/image with local statics also works without remotePatterns; coder decides, flag for efficiency.
- Mobile vetting: nav, modals, forms on small screens — verifier AC.

## Approved Write-Set (Exact Copy)

- showcase/app/demo/maison-olive/
- showcase/app/demo/bijoux-artisanaux/
- showcase/components/maison-olive/
- showcase/components/bijoux-artisanaux/
- showcase/public/demo/maison-olive/
- showcase/public/demo/bijoux-artisanaux/
- showcase/demos/maison-olive/site.ts
- showcase/demos/bijoux-artisanaux/site.ts
- showcase/lib/demos.ts

## Recommendations

**Must address:** (1) `--bx-font-*` namespacing via demo-local layout; (2) documented form-mock strategy for Maison Olive; (3) explicit security-pass skip justification (demo-only forms; React escaping; no network).
**Should address:** (4) namespaced tokens.module.css per assurance; (5) metadata + icon.svg parity; (6) registry decision for maison-olive; (7) notFound() for invalid product slug.
**Might consider:** (8) asset size/git tracking note; (9) `<img>` vs next/image; (10) registry cleanup post-implementation.

## Inspection Gaps

None.

## Conclusion

**Verdict: SUPPLEMENT.** Write-set complete and appropriate; scope does not expand; topology correct. Proceed to Stage 1 after folding the three Must Address items into the coder brief.
