# WB-2026-07-22 — Retire Legacy Home and Business Routes

| ID | Stage | Owner | Status | Evidence |
|---|---|---|---|---|
| RHB-01 | Stage 0: record Owner-approved deletion, scope, routing, and write gate. | Control Tower | DONE | New Work Block is READY; baseline frozen. |
| RHB-02 | Critic review of dependencies and verification matrix. | Critic | DONE — SUPPLEMENT ADOPTED | Preserve baseline; use `/brief` for the thank-you business CTA. |
| RHB-03 | Delete routes and update sitemap/link contract. | Scoped Coder | DONE | Deleted the two route modules; updated sitemap, negative sitemap assertions, and thank-you CTA only. |
| RHB-04 | Standard verification. | Verifier | DONE — READY | Native source/build verification passed; its sandbox blocked localhost sockets, so the non-sensitive local runtime smoke was completed as review-degraded:inline-fallback. |
| RHB-05 | Sync and closeout. | Control Tower | CLOSED — READY | /home and /business return 404 without redirects; no staging, commit, or push. |
