# WB-2026-07-23 — Resend Email Notifications

## Objective

Implement dual email notifications via Resend API upon contact form submission:
1. **Admin Email Notification**: Detailed lead summary sent to `AZURSYSTECH_ADMIN_EMAIL`.
2. **Client Confirmation Email**: Localized thank-you message (RU, EN, FR) sent to the client's `payload.email`.

## Environmental Guard & Flags

- `AZURSYSTECH_RESEND_EMAIL_ENABLED="true"`: Master feature flag. Defaults to disabled (`false`).
- `RESEND_API_KEY`: Secret API key for `api.resend.com/emails`.
- `RESEND_FROM_EMAIL`: Authorized sender address (e.g. `AzurSysTech <contact@azursystech.com>`).
- `AZURSYSTECH_ADMIN_EMAIL`: Receiver email address for admin lead alerts.

## Critical Requirements (Adopted Critic SUPPLEMENT)

1. **Feature Flag Guard**: Skip email dispatch safely if `AZURSYSTECH_RESEND_EMAIL_ENABLED !== "true"`.
2. **HTML Sanitization**: Use `escapeHtml()` on all user-controlled payload fields before building HTML email bodies.
3. **Non-Blocking Delivery**: Email failures must be logged and recorded as lead events, but MUST NOT fail the HTTP 200 submit response.
4. **Missing Email Handling**: Skip client email cleanly if `payload.email` is absent.
5. **Lead Event Audit**: Log `notification.email.admin.sent/failed` and `notification.email.client.sent/failed`.
6. **Multi-locale Support**: Client confirmation subjects and content in `ru`, `en`, and `fr`.

## Write-Set

Production source (Scoped Coder):
- `web/src/lib/resend-email.ts`
- `web/src/lib/resend-email.test.ts`
- `web/src/app/api/contact/submit/route.ts`

Governance & Documentation (Control Tower):
- `docs/plans/WB-2026-07-23-resend-email-notifications.md`
- `docs/tasklist/WB-2026-07-23-resend-email-notifications.tasklist.md`
- `docs/reports/WB-2026-07-23-resend-email-notifications-critic.md`
- `docs/reports/WB-2026-07-23-resend-email-notifications-verification.md`
