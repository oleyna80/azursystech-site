# AI Intake Website Chat Persistence Closeout

Date: 2026-05-10
Stage: Phase 1 / Website Chat Persistence Verification
Role: Verifier
Verdict: ACCEPT locally

## Changed Files In Current Worktree

- `web/src/app/api/chat/route.ts`
- `web/src/ChatWidget.jsx`
- `web/sql/002_multi_channel_intake_foundation.sql`
- `web/src/lib/intake/types.ts`
- `web/src/lib/intake/persistence.ts`
- `web/src/lib/intake/storage.ts`
- `00_strategy/roadmap.md`
- `07_ops/task-board.md`

No Telegram webhook, WhatsApp webhook, `/api/brief`, contact route, env,
package, deploy, commit, or push changes were made in this gate.

## Runtime Smoke Result

Local runtime smoke passed with:

- mock DeepSeek endpoint on localhost;
- Next dev server on localhost;
- isolated PostgreSQL smoke DB:
  `azursystech_intake_smoke_20260510205512`.

Verified behavior:

- old website chat request shape still works:
  `{ message, history, locale }`;
- old response compatibility is preserved:
  `{ reply }`;
- optional `conversationId` is returned when persistence is active;
- second request with `conversationId` resumes the same conversation;
- local DB stored 2 inbound and 2 outbound website chat messages;
- conversation remained `open` with `agent_status = collecting` and
  `handoff_status = none`;
- best-effort persistence failure still allowed the chat to return a reply.

## Checks Passed

- `git diff --check`
- `cd web && npm run check:types`
- `cd web && npm run lint`
- local SQL apply/smoke for `001` + `002`
- local `/api/chat` runtime smoke

`npm run lint` passed with existing non-blocking `<img>` warnings in
`web/src/app/page.tsx`.

## Known Risks

- HIGH: live DB schema state is not verified yet; do not apply migration `002`
  to production without a separate approval and schema check.
- MEDIUM: production `DATABASE_URL` must be verified separately. The local smoke
  showed that an invalid Node `pg` URL causes persistence to be skipped, while
  the chat still replies.
- LOW: the local smoke DB still exists and cleanup requires separate approval
  because dropping it is destructive.

## Next Gate

Before production rollout:

1. Review the current tracked/untracked diff as one release scope.
2. Verify live DB schema state without printing secrets.
3. Apply `002` only after explicit Owner approval.
4. Run a production-like chat smoke after deploy approval.
