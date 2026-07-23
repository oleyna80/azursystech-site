# WB-2026-07-22 — Remove Legacy `/contact` Route

| ID | Stage | Owner | Status | Evidence |
|---|---|---|---|---|
| LCR-01 | Stage 0: define the approved deletion and link-migration scope. | Control Tower | DONE | Owner chose a complete removal with `/contact` returning `404`; no redirect. |
| LCR-02 | Read-only review and Critic review of route, links, sitemap, chat, and documentation dependencies. | Reviewer / Critic | DONE (SUPPLEMENT ADOPTED) | Reviewer found `/fr#contact` and `/ru#contact` are the only valid contact anchors; Critic added four `/#contact`/copy sources and locale-aware chat routing. |
| LCR-03 | Implement the exact approved write-set with one Scoped Coder. | Scoped Coder | DONE | Legacy page and its route-only client component are deleted; all approved active links, sitemap, handoffs, tests, and current route documentation were migrated without a redirect. |
| LCR-04 | Verify route status, links, tests, build, browser smoke, and crash conditions. | Verifier | DONE WITH BLOCKERS | Local route, browser, crash, test, lint, type, and diff checks pass. Build is blocked by Google Fonts network access; native and independent verifier runs produced no formal verdict. |
| LCR-05 | Record the formal gate outcome and close out. | Control Tower | CLOSED — BLOCKED | Formal `READY` is withheld pending a successful independent readonly verdict and a build with font-network access. No staging, commit, or push occurred. |
