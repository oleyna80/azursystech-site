# WB-2026-07-22 — English Core Launch and Product Positioning

Status: Stages 0–2 complete. The Owner authorized the exact production
write-set and, after the required localhost/browser smoke, one scoped local
closeout commit on 2026-07-22. Push remains excluded.

## Objective

Prepare a safe first English-language launch while aligning the public service
message with the current business focus: web applications, public websites,
and AI automation. The English launch must not revive obsolete onsite hardware
repair, setup, maintenance, or local-support offers.

## Product and URL decision

The first English public core consists only of:

- `/en`
- `/en/ai-automation`

French remains the `x-default` locale and the current root-default behavior
remains unchanged. English copy must be editorially native, not copied from the
legacy `web/src/i18n.js` dictionary, which contains obsolete service language.

All other public and conversion pages remain outside this slice. They receive
no English `hreflang`, sitemap URL, or language-switch target until an English
version exists. A visible fallback link may lead to the supported English core,
but a user must not be silently downgraded to French or Russian after choosing
English.

## Required implementation design

1. Expand the typed locale contract from French/Russian to French/Russian/
   English for the localized core.
2. Make the locale URL authoritative for the shell and `<html lang>` on
   localized routes. `web/src/proxy.ts` injects a validated request-only locale
   header for `/fr`, `/ru`, and `/en`; the root layout reads it before the
   existing FR/RU cookie fallback. The API CORS branch remains separate.
3. Add reviewed English content for the home and AI-automation pages; normalize
   French and Russian core copy where it still promises local hardware support.
4. Extend the header, footer, locale switch, canonical metadata, hreflang, and
   sitemap only for routes that really exist in all three locales.
5. Preserve behavior of FR/RU routes and do not add a dependency or translation
   framework in this slice.
6. Keep the EN core information-only: hide form, chat, showcase, and portfolio
   surfaces until their localized conversion contracts are separately approved;
   EN project CTAs may use the existing public WhatsApp link only.

## Deliberate exclusions

- Contact form, submission contract, Telegram/webhook payloads, and the active
  `WB-2026-07-21-web-contact-language-and-service-focus` verification record.
- Chat widget, `/api/chat`, LLM prompt, and provider behavior.
- Brief flow, cookie-backed `/contact`, `/brief`, `/pricing`, `/faq`, legal,
  privacy, terms, and thank-you pages.
- Legacy secondary pages: decide separately whether to rewrite, redirect,
  unpublish, or noindex them before claiming English SEO coverage.
- Database, dependencies, environment, deploy, and push.

## Approved implementation write-set

The exact set was refreshed against the dirty worktree and is owned by
`WB-2026-07-22-english-core-implementation`:

- `web/src/proxy.ts`
- `web/src/app/layout.tsx`
- `web/src/app/[locale]/layout.tsx`
- `web/src/app/[locale]/page.tsx`
- `web/src/app/[locale]/_home-data.ts`
- `web/src/app/[locale]/_home-data.test.ts`
- `web/src/app/[locale]/page.test.ts`
- `web/src/app/[locale]/ai-automation/page.tsx`
- `web/src/app/[locale]/ai-automation/page.test.ts`
- `web/src/components/shell/site-header.tsx`
- `web/src/components/shell/site-footer.tsx`
- `web/src/app/sitemap.ts` and `web/src/app/sitemap.test.ts`

`web/src/app/[locale]/page.tsx` is already dirty. The future Coder must first
separate the existing change from the approved English work; it may not replace
or discard it.

## Acceptance criteria for the future EN core Work Block

- `/en` and `/en/ai-automation` return 200 and serve English page, shell, and
  server-rendered document language.
- `/fr` and `/ru` preserve their present route behavior.
- The language selector exposes FR, RU, and EN and never links to an absent EN
  page as though it were localized.
- English core copy contains only the current service focus; obsolete onsite
  hardware repair/setup/maintenance wording is removed from those source texts.
- Canonical URLs, hreflang values, and sitemap entries include EN only for
  implemented localized routes; `x-default` is French.
- Type and locale-content tests cover EN; metadata/sitemap tests cover both EN
  routes.
- EN metadata and structured data contain no obsolete local IT/hardware offer,
  use `inLanguage: "en"`, include all three localized `hreflang` links and
  French `x-default`, and do not advertise an untranslated contact route.
- Required checks: `npm run lint`, `npm run test:ci`, `npm run check:types`,
  and `npm run build` from `web/`, then browser smoke at 375px and desktop for
  each EN core route and language switch. Any pre-existing failing locale test
  is triaged before a verification verdict.

## Verification and routing

The implementation uses one Scoped Coder followed by a read-only Verifier. It
is a standard production Work Block with required verifier isolation
`independent-readonly-root`. Browser/SEO checks use `webapp-testing`. The
`proxy.ts` locale branch receives source review to confirm it does not change
the API CORS contract. If scope reaches form, chat, brief, or provider code,
stop and create a separate Full-tier Work Block with STRIDE-lite and the
isolation required for that domain.

## Follow-up sequence

1. Owner approves the proposed production write-set and English editorial
   source/copy review.
2. Implement the EN core only.
3. Verify and close the EN core independently.
4. Create the Owner-authorized local closeout commit with trailer
   `Work-Block: WB-2026-07-22-english-core-implementation`.
5. Plan English conversion surfaces as a separate Work Block.
6. Decide treatment of legacy and legal pages before expanding English SEO.
