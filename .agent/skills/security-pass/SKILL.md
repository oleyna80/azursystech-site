---
name: security-pass
description: Security audit & hardening with explicit mode selection (triage / harden / verify). Modes determine read-only vs write authority and independence. Use for security findings, CVE triage, hardening fixes, and post-implementation verification.
user-invocable: true
allowed-tools:
  - Read
  - Bash(git *)
  - Bash(ls *)
  - Bash(find *)
  - Bash(grep *)
  - Bash(cat *)
  - Bash(npm *)
  - Bash(npx *)
  - Bash(curl *)
  - Bash(fuser *)
  - Bash(node *)
  - Bash(rg *)
  - Bash(jq *)
---

# security-pass: Audit, Hardening, Verification

> Consolidated skill merging security-audit-triage, security-hardening-pass, security-verification-gate, codex-verification, and handoff-live-smoke. Explicit mode selection determines authority and read-write boundaries.

## Modes & Authority

| Mode | Authority | Read/Write | Triggers | Output | Reference |
|---|---|---|---|---|---|
| **triage** | Reviewer (read-only) | Read-only | "проверь security аудит", pentest reports, CVEs | Findings matrix (status, adjusted severity, evidence) | `reference/triage.md` |
| **harden** | Scoped Coder | Write (P0/P1 only) | "устрани security findings", confirmed P0/P1, hardening scope | Changed files, AC status, checks pass/fail | `reference/harden.md` |
| **verify** | Verifier (independent) | Read-only (verdict) | "проверь после фиксов", post-implementation, security-sensitive Work Blocks | Ship verdict, findings closure matrix, OWASP checklist, runtime proof status | `reference/verify.md` |
| **codex** | Verifier (advisory) | Read-only (advisory) | Full verification tier, auth/payments/DB/middleware changes, new domain | Codex review + findings, structured with mode/scope/gaps | `reference/codex.md` |
| **handoff-smoke** | Control Tower (evidence) | Read-only (test run) | Live handoff validation, clean scaffold smoke tests | Smoke test results, scope audit, publication-safe evidence | `reference/handoff-smoke.md` |

## Mode Selection Decision Tree

**Step 1: What am I doing?**
- Reviewing an external pentest / CVE list → **triage** (read-only)
- Implementing confirmed security fixes → **harden** (write)
- Checking implementation after harden → **verify** (read-only, independent)
- Need second opinion from different model → **codex** (advisory)
- Validating handoff runner on fresh project → **handoff-smoke** (test evidence)

**Step 2: Is the mode allowed by my role?**
- Reviewer / Analyst → triage, codex (read-only only)
- Scoped Coder → harden (write only for P0/P1)
- Verifier → verify (independent verdict), codex (advisory)
- Control Tower → codex, handoff-smoke (evidence collection)

**Step 3: What's the scope?**
- triage: all findings, no implementation
- harden: confirmed P0/P1 only, backward-compatible defaults
- verify: post-harden diff review, checks, OWASP checklist, runtime proof
- codex: complementary read-only review, not authority
- handoff-smoke: live runner validation, clean scaffold

## When to Use

✓ Security findings, pentest reports, CVE triage
✓ OWASP Top 10 patterns, injection, XSS, CSRF, auth failures
✓ Security headers, CSP, encryption, secrets management
✓ Hardening fixes (P0/P1 only)
✓ Post-implementation verification (independent check)
✓ Full verification tier Work Blocks

✗ Non-security changes
✗ Hardening P2/deferred (defer to backlog)
✗ Unconfirmed findings
✗ Production deploy without verifier sign-off

## Workflow Summary

1. **triage:** Map findings → code → confirmed/partial/not-confirmed → adjusted severity
2. **harden:** Implement P0/P1 fixes → checks pass → backward-compatible
3. **verify:** Review diff → checks → OWASP checklist → runtime proof → verdict (safe/needs changes)
4. **codex:** Parallel read-only review → findings → merge with Claude findings
5. **handoff-smoke:** Live smoke test → scope audit → evidence capture

## Hard Limits

- triage: read-only, no implementation
- harden: P0/P1 only, no architecture pivots, no deps/tooling changes without Work Block approval
- verify: no scope expansion, no fixes, only reporting
- codex: read-only advisory, not authority
- handoff-smoke: no credentials, no deploy, no live API without approval

## Handoff

- **triage:** Success = findings matrix with status + evidence. Next = harden (if P0/P1 confirmed)
- **harden:** Success = P0/P1 fixed + checks pass + residual risks documented. Next = verify
- **verify:** Success = verdict (safe ship / needs changes) + closure matrix. Next = SSOT sync or corrective WB
- **codex:** Success = review completed + findings structured. Next = merge protocol (consolidate with Claude)
- **handoff-smoke:** Success = smoke passed + scope audit + publication-safe evidence. Next = update report

---

## Reference Files

- [`reference/triage.md`](reference/triage.md) — Security Audit Triage (triage mode)
- [`reference/harden.md`](reference/harden.md) — Security Hardening Pass (harden mode)
- [`reference/verify.md`](reference/verify.md) — Security Verification Gate (verify mode)
- [`reference/codex.md`](reference/codex.md) — Codex Verification (codex mode)
- [`reference/handoff-smoke.md`](reference/handoff-smoke.md) — Handoff Live Smoke (handoff-smoke mode)

