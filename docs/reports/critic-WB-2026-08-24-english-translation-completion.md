# Critic Report — WB-2026-08-24-english-translation-completion

**Date:** 2026-08-24
**Reviewed:** Stage 0 Define Preflight + Specification Revision `v2` (Expanded Portfolio Multi-Language Scope)
**Verdict:** SUPPLEMENT

### Scope Review

| Issue | Detail | Recommendation |
|---|---|---|
| Scope containment | Work block modifies `web/**` localization across marketing, brief intake, legal/utility pages, portfolio data & components, reports, and tests. | Approved. Safe bounded scope. |
| Non-goals clarity | Database, VPS infrastructure, CI secrets, and showcase demo internals are explicitly out of scope. | Approved. |
| Hard stops | No autonomous `git push` or merge to `main`. Publication handoff remains Owner-controlled. | Approved. |

### Skill Routing Review

| Skill | Status | Assessment |
|---|---|---|
| `task-decomposition` | matched | Tasks are atomic with explicit REQ, AC, and path linkage (18 tasks). |
| `spec-consistency-analysis` | matched | Traceability validated with zero errors across specification `v2`. |
| `requirements-quality-review` | matched | Requirements review passed with `READY` verdict for revision `v2`. |
| `git-safety` | matched | Isolated feature branch `feat/english-translation` active. |

### Subagent Topology Review

| Aspect | Finding | Recommendation |
|---|---|---|
| Execution Topology | Single sequential Scoped Coder. | No race conditions or parallel write overlap. |

### Risk Gaps

| Risk | Potential Impact | Recommendation |
|---|---|---|
| In-place switching displacement | Switching language on `/portfolio` or `/portfolio/[slug]` might redirect to home. | Ensured `COOKIE_BACKED_ROUTES` contains `/portfolio` and middleware matches `/portfolio/:path*`. |
| Untranslated keys in portfolio | Missing portfolio fields in RU/EN could break cards or project pages. | Fully populated `PORTFOLIO_PROJECTS_BY_LOCALE` for FR, RU, EN and tested via `portfolio-data.test.ts`. |

### Remediation Supplement

The independent remediation Critic approved the targeted correction subject to
these conditions: add `site-header.test.ts` to the Plan and active write-set;
link its route-preservation assertions to REQ/AC-003 and REQ/AC-007; correct
the stale task paths; and retain source-review evidence that the preserved path
branch calls `router.refresh()`. Browser-test dependencies are out of scope.

### Recommendations

#### Must Address (blocking quality)
- None. Define-quality criteria for revision `v2` fully satisfied.

#### Should Address (improves robustness)
- Maintain automated unit test assertions verifying zero Cyrillic characters in all English brief and portfolio fields.

### Verdict

**SUPPLEMENT** — The remediation plan is safe to execute within the existing write-set. Fresh Review and Verification are required after the correction.

---

## Local-Font Supplement — v3

**Reviewed:** Owner-approved local-font change in `web/src/app/layout.tsx` and
`web/src/app/fonts/*`.

**Isolation:** native read-only subagent, `same-session-degraded`.

**Verdict:** **APPROVE**

- `next/font/google` is replaced by `next/font/local` with relative WOFF2
  paths; the two CSS variable names consumed by `globals.css` are unchanged.
- `fc-scan` recognizes valid Geist and Geist Mono variable faces (100–900),
  and `OFL.txt` supplies the Geist Project Authors copyright and SIL OFL 1.1.
- No source import or URL targets Google Fonts. Analytics references are not a
  font-loading path.
- REQ-008 / AC-008, TASK-019, plan, active write-set, and traceability bind
  the assets and root layout.

Production build success remains a Stage 2 Verification obligation; this Critic
review does not claim it.
