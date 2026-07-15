# Verification Gate — active Work Block. OWNED BY CONTROL TOWER — subagents must not edit this file.

Status: READY
Work Block: WB-2026-07-15-cleanup-showcase-port
Verification Tier: standard
New Domain: false
Sensitive Domains: none
Required Verifier Isolation: independent-readonly-root
Verifier Isolation: independent-readonly-root
Claude Verifier Verdict: READY
Verification Report: docs/reports/WB-2026-07-15-cleanup-showcase-port-verification.md
Verifier: subagent
GPT Verifier Status: NOT_REQUIRED
GPT Verifier Reason: native browser verification is advisory-only under the declared isolation policy; formal closeout requires a separate top-level readonly root
GPT Verifier Degraded Reason: review-degraded:inline-fallback — native Verifier runtime command hung after its sandbox socket failure; Control Tower completed the Owner-authorized localhost/browser follow-up without changing source
Quick-Fix: false
Stage 3 Mode: formal local-code closeout plus Owner-authorized localhost/browser runtime follow-up complete; staging, commit, push, and deletion remain separately unauthorized

## Entry conditions

- The native Verifier passed typecheck and diff hygiene, but localhost socket
  policy blocked its HTTP and desktop/375px browser smoke; its permitted
  retry hung and was not treated as evidence.
- The separate top-level readonly root returned `FORMAL_VERDICT: READY` from
  `/run/codex-verifier-output/WB-2026-07-15-cleanup-showcase-port.txt` after
  confirming the atomic fallback, override precedence, port-3002 contract,
  scoped diff, and hygiene.
- Owner then authorized localhost/browser smoke. Control Tower's narrow
  `review-degraded:inline-fallback` recorded HTTP 200 for `/fr`, `/portfolio`,
  and `/demo/plomberie`; Playwright followed Portfolio → Plomberie →
  `http://localhost:3002/demo/plomberie` at desktop and 375px, and its mobile
  CTA reached `#contact`. The only console error was an unrelated 404 for
  `favicon.ico` on the showcase server.
