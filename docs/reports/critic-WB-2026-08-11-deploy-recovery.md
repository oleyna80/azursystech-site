# Critic — WB-2026-08-11 deploy recovery

## First review

- Role: read-only Reviewer / Deployment and Security Analyst.
- Verdict: `RECONSIDER`.
- Files changed by Reviewer: none.

## Findings and disposition

1. **BLOCKER — source and live actions lack signed authorization.** Confirmed.
   Gate remains BLOCKED; no publish, deploy, or source edit occurs before an
   Owner-signed committed record is bound by the lifecycle helper.
2. **HIGH — workflow default contradicts all three skill mirrors.** Confirmed.
   The exact workflow default change remains in scope and must precede accepting
   the documentation as canonical.
3. **HIGH — deploy/rollback commands omit the matching workflow ref.**
   Confirmed. The plan now requires proving `main` resolves to the target for
   this rollout, explicitly passing the workflow ref and `include_admin=false`,
   and documenting the same-ref/same-commit rollback constraint.
4. **HIGH — rollback guidance overstates `deploy.sh` and exposes an unverified
   direct runner.** Confirmed. The plan now removes the direct command and
   distinguishes workflow-owned runtime rollback from container rollback.
5. **MEDIUM — dirty checkout and readiness evidence are unresolved.**
   Confirmed. A clean disposable release root is mandatory; existing dirty
   hunks are preserved and reviewed as untrusted candidate changes.
6. **MEDIUM — root-cause and CI claims lacked immutable references.** Resolved
   in the plan with failed Deploy run `31219268116` and successful baseline CI
   run `31253715112`.
7. **LOW — three dirty mirrors have an extra blank line at EOF.** Accepted into
   reconciliation acceptance criteria; no file has yet been modified.

## Re-review request

Review the revised plan against the same read-only scope. `APPROVE` is required
before preparing the exact authorization envelope. Any remaining scope or
runtime-safety issue keeps the write gate BLOCKED.

## Re-review result

- Verdict: `APPROVE`.
- Status: `READY` for authorization preparation.
- Isolation: `same-session-degraded` advisory Reviewer.
- Reviewer confirmed all seven findings are adequately dispositioned and found
  no remaining plan-level blocker.
- Adopted optional hardening: execution evidence must record the exact dispatch
  command and resulting workflow `headSha`, with the deploy run accepted only
  when it equals the immutable baseline.
- Files changed by Reviewer: none.
