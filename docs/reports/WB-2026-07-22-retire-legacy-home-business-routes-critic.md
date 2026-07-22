# Critic Report — WB-2026-07-22 Retire Legacy Home and Business Routes

## Result

`SUPPLEMENT` adopted before implementation.

| Severity | Finding | Response |
|---|---|---|
| Must address | All five source paths have pre-existing changes. | Freeze the baseline; preserve every unrelated hunk and do not stage or restore. |
| Must address | The localized home has no business anchor. | Change only the thank-you business CTA from `/business` to the existing `/brief` route. |
| Should address | Positive sitemap assertions alone cannot prove retirement. | Remove both positives and add explicit negative assertions. |
| Should address | This is production route retirement across five files. | Use one Scoped Coder and a read-only Verifier at Standard tier. |

## Accepted write-set

- `web/src/app/home/page.tsx` (delete)
- `web/src/app/business/page.tsx` (delete)
- `web/src/app/sitemap.ts`
- `web/src/app/sitemap.test.ts`
- `web/src/app/thank-you/page.tsx`

## Required evidence

Focused sitemap test, lint, typecheck, build, diff hygiene, local 404 proof for
both routes, all-sitemap status matrix, rendered `/brief` CTA, and absence of
`/business` references from `web/src`.
