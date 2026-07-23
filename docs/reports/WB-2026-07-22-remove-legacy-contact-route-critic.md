# Critic Report — WB-2026-07-22 Remove Legacy `/contact` Route

## Result

`SUPPLEMENT` adopted before implementation. The route may be deleted only
after four additional stale-link sources are included in the write-set.

## Findings and response

| Severity | Finding | Response |
|---|---|---|
| High | `/#contact` is not a valid replacement because the root redirect loses the fragment. | Add `web/src/app/pricing/page.tsx`, `web/src/components/brief/brief-form.tsx`, and `web/src/components/shell/site-footer.tsx`; use direct locale routes. |
| Medium | `web/src/app/brief/page.tsx` says "contact page" even though the page is removed. | Add the page and change the wording to the homepage contact form. |
| Medium | Web-chat has request locale, so a fixed French URL would not preserve Russian routing. | Keep the source and its unit tests in scope; generate `/ru#contact` for Russian and `/fr#contact` otherwise. |
| Low | `chat-widget-shell.tsx` is unreferenced but retains public stale links. | Retain its preventive migration to `/ru#contact`; do not broaden its obsolete service copy. |

## Boundaries affirmed

- English keeps its intentional WhatsApp-only contact behavior; never create
  `/en#contact`.
- Historical reports and old tasklists may retain `/contact` as evidence and
  are not modified.
- No form submission, DB/provider access, external send, deploy, staging,
  commit, or push is needed.

## Required verification

- Search for non-API `/contact` and `/#contact` in executable web source and
  current READMEs.
- Smoke `/contact`=`404`, and verify the French/Russian form anchors; do not
  submit.
- Unit-test French and Russian web-chat handoff link output.
- Run sitemap checks, lint, typecheck, build, sitemap-route crash smoke, and
  inspect local server errors.

## Verdict

`SUPPLEMENT` — adopted. With the four added paths, the exact approved
write-set is sufficient for one Scoped Coder to implement the owner-approved
full removal.

## Approved write-set (literal)

- .agent/critic-gate.md
- .agent/verification-gate.md
- .codex/write-gate.md
- docs/plans/WB-2026-07-22-remove-legacy-contact-route.md
- docs/tasklist/WB-2026-07-22-remove-legacy-contact-route.tasklist.md
- docs/reports/WB-2026-07-22-remove-legacy-contact-route-critic.md
- docs/reports/WB-2026-07-22-remove-legacy-contact-route-verification.md
- web/src/app/contact/page.tsx
- web/src/components/contact/contact-page-client.tsx
- web/src/app/sitemap.ts
- web/src/app/sitemap.test.ts
- web/src/ChatWidget.jsx
- web/src/components/chat-widget-shell.tsx
- web/src/components/brief/brief-form.tsx
- web/src/components/shell/site-footer.tsx
- web/src/app/about/page.tsx
- web/src/app/business/page.tsx
- web/src/app/faq/page.tsx
- web/src/app/home/page.tsx
- web/src/app/pricing/page.tsx
- web/src/app/brief/page.tsx
- web/src/app/thank-you/page.tsx
- web/src/app/ai-automation/page.tsx
- web/src/app/[locale]/ai-automation/page.tsx
- web/src/app/[locale]/ai-automation/page.test.ts
- web/src/lib/contact-submit.ts
- web/src/lib/contact-submit.test.ts
- web/src/lib/web-chat/llm.ts
- web/src/lib/web-chat/llm.test.ts
- README.md
- web/README.md
