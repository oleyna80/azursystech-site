# WB-2026-07-22 — Showcase demo test invariant

| ID | Stage | Owner | Status | Evidence |
|---|---|---|---|---|
| SDI-01 | Stage 0: inspect the failure and route semantics. | Control Tower | DONE | `1ed7420` intentionally maps both Bistrot cards to the existing Maison Olive demo; `/demo/bistrot` does not exist. |
| SDI-02 | Stage 0.5: Critic review. | Read-only Critic | DONE | `RECONSIDER` adopted: correct the stale test, not the valid application URL. |
| SDI-03 | Implement one scoped test-contract correction. | Scoped Coder | DONE | Only `web/src/app/[locale]/_home-data.test.ts` changed; explicit map preserves `bistrot -> maison-olive`. |
| SDI-04 | Verify focused test, typecheck, and diff hygiene. | Verifier | READY | Lite, non-sensitive, same-session-degraded: 12 focused tests, typecheck, and scoped diff hygiene passed. |
| SDI-05 | Synchronize records and report. | Control Tower | DONE | Evidence records updated; no commit or push is part of this Work Block. |
