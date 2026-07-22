# WB-2026-07-22 — Retire Legacy Information Routes

| ID | Stage | Owner | Status | Evidence |
|---|---|---|---|---|
| RIR-01 | Stage 0: record approved deletion, scope, skill routing, and write gate. | Control Tower | DONE | Owner approved root `/about`, `/pricing`, `/faq` removal with 404/no redirect; new gate is READY. |
| RIR-02 | Critic review of source dependencies, baseline, and verification matrix. | Critic | DONE (SUPPLEMENT ADOPTED) | Preserve dirty baseline; add negative sitemap and six-route 404 checks; use current footer localizer. |
| RIR-03 | Implement the exact seven-source-path write-set. | Control Tower (inline fallback) | DONE | Two Scoped Coder dispatches were blocked by native `thread-limit`; implementation remained in the exact literal source write-set. |
| RIR-04 | Standard verification: source/test/build plus route, sitemap, anchor, footer, and log smoke. | Control Tower (read-only fallback) | DONE — READY | Native Verifier was blocked by `thread-limit`; same-session non-sensitive fallback passed all required evidence. |
| RIR-05 | Sync the formal outcome and close out. | Control Tower | CLOSED — READY | `review-degraded:inline-fallback`; no staging, commit, or push. |
