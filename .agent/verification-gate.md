# Verification Gate — active Work Block. OWNED BY CONTROL TOWER — subagents must not edit this file.

Status: READY — native evidence and isolated path-specific independent verification passed
Work Block: WB-2026-07-20-immobilier-demo-review-remediation
Verification Tier: standard
New Domain: false — existing local demo remediation only
Quick-Fix: false
Verifier: subagent
Sensitive Domains: none
Required Verifier Isolation: independent-readonly-root
Verifier Isolation: independent-readonly-root — formal verifier reviewed only the frozen 21-path payload; native browser verification remains advisory evidence
Claude Verifier Verdict: READY — advisory same-session browser and type verification passed
GPT Verifier Status: NOT_REQUIRED
GPT Verifier Reason: no second verifier runtime requested; independent readonly root is required for formal closeout
Verification Report: docs/reports/WB-2026-07-20-immobilier-demo-review-remediation-verification.md
Formal Verdict: READY — independent readonly-root returned `FORMAL_VERDICT: READY` for frozen patch SHA-256 `11eb83f5402a5a624848c0893b37f748b6f8a277b3cea0812005a98ed0e6565f`

Native evidence passed: `npm run check:types`, scoped diff hygiene, FR/EN desktop
and 375px browser smoke, client-only contact validation and static contacts,
gallery forward/reverse Tab, exact opener focus return, Escape/arrows,
reduced-motion hero behavior, metadata icon link/endpoint, and hero
`currentSrc` plus SHA traceability. No provider, credential, media, staging,
commit, push, or deployment action is in scope.

Historical formal evidence: `/run/codex-verifier-output/immobilier-demo-review-remediation.txt`
returned `FORMAL_VERDICT: BLOCKED` on 2026-07-20 because global dirty-tree
scope could not be attributed. Owner then authorized an isolated patch whose
only paths are the approved write-set. The repeat result at
`/run/codex-verifier-output/immobilier-demo-review-remediation-patch-v2.txt`
returned `FORMAL_VERDICT: READY`: patch SHA, all 21 paths, blob hashes,
reverse-patch validation, scoped whitespace, application requirements, and
media hashes passed. In its read-only runtime, `npm run check:types` cannot
create `.next/types/routes.d.ts`; the native successful type-check remains
advisory browser/type evidence.
