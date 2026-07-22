# Critic Report — WB-2026-07-22 Retire Legacy Information Routes

## Result

`SUPPLEMENT` adopted before implementation.

## Findings and response

| Severity | Finding | Response |
|---|---|---|
| Must address | Current gates belong to the closed `/contact` Work Block and all seven source paths have ambient changes. | Open a WB-specific Stage 0 gate, freeze the current baseline, preserve ambient changes, and never restore or stage them. |
| Must address | Removing positive sitemap expectations alone would not prove retirement. | Add explicit negative assertions and prove six retired URLs return `404`; run the all-sitemap crash matrix. |
| Should address | Footer must reuse the existing `/#` localizer rather than duplicate locale literals. | Change FR/RU targets to `/#pricing` and `/#faq`, then prove rendered localized targets. |
| Should address | The thank-you FAQ CTA is the only remaining active source link to root `/faq`. | Change it to `/${locale}#faq`; its current locale domain remains FR/RU only. |
| Should address | The Work Block is Subagent-Required. | Use exactly one Scoped Coder and one read-only Verifier; Standard tier, no DB, Sensitive Domains none. |
| Might consider | No localized homepage source change is needed. | Keep the seven-source-path write-set exact because the shared localized page already contains `#pricing` and `#faq`. |

## Orchestrator response

All supplements are adopted. The Critic's provisional statement that matching
skill files were unavailable was corrected after direct inspection: the local
`webapp-testing`, `subagent-mission-brief`, and `memory-ops` instructions, as
well as the active Playwright instruction, are present and applied. No scope
is expanded by that correction.

## Boundaries affirmed

- No `/en/about`, `/en/pricing`, or `/en/faq` route is created.
- `/home`, `/business`, translations, provider/contact behavior, deployment,
  staging, commit, and push remain outside the Work Block.
- Historical evidence is not rewritten.

## Verdict

`SUPPLEMENT` — adopted. The exact seven-source-path write-set is sufficient
for one Scoped Coder to implement the Owner-approved deletion safely.
