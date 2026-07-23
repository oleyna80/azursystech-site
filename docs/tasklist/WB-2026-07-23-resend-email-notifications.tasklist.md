# WB-2026-07-23-resend-email-notifications.tasklist

- [x] Stage 0: Plan & Discover (Control Tower)
- [x] Stage 0.5: Critic Review (Critic SUPPLEMENT adopted)
- [ ] Stage 1: Implement `web/src/lib/resend-email.ts` with Resend API client, HTML escaping, and RU/EN/FR localized templates
- [ ] Stage 1: Implement `web/src/lib/resend-email.test.ts` with 100% mocked test suite
- [ ] Stage 1: Integrate Resend email notifications into `web/src/app/api/contact/submit/route.ts` with non-blocking try/catch and lead event auditing
- [ ] Stage 2: Verification (`npm run check:types` & `npx vitest run web/src/lib/resend-email.test.ts`)
- [ ] Stage 3: SSOT Sync & Closeout
