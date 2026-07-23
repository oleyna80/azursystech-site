# WB-2026-07-21 — Preferred Contact Language and Web-Service Focus

## Status

| Field | Value |
|---|---|
| Work Block | `WB-2026-07-21-web-contact-language-and-service-focus` |
| Status | Locally verified; formal closure blocked |
| Owner authorization | 2026-07-21 chat instruction: add Russian, French, and English contact-language choice; remove onsite equipment repair, setup, and maintenance from feedback forms. |
| Work Block type | Contact-intake frontend and validated-payload evolution |
| Verification tier | Full |
| Side-effect class | Production-code write; local docs/workflow write; local/test side effects |
| DB action mode | None |
| Hard Stops | None |
| Write gate | READY |

## Objective and acceptance criteria

The public contact surfaces must:

1. collect a required preferred language using only `ru`, `fr`, or `en`;
2. remove onsite equipment repair, setup, maintenance, and their hardware-only
   conditional questions from rendered forms;
3. present the web applications, websites, and AI automation focus consistently;
4. validate the language allowlist server-side and include it in lead
   notification output;
5. preserve legacy server acceptance of retired service values for non-UI
   historical or external producers; and
6. avoid changes to provider configuration, endpoint security controls,
   persistence schema, deployment, commit, and push.

## Stage 0 routing preflight

| Requirement | Record |
|---|---|
| Relevance filter | Always relevant: current Work Block/gate templates and git-safety for any commit decision. Relevant: frontend-skill, design-direction, webapp-testing, security-pass, subagent-mission-brief. Not relevant: media, deploy, DB, payment, sprint-analysis. |
| Skills checked | `frontend-skill`, `design-direction`, `webapp-testing`, `security-pass`, `git-safety`, `subagent-mission-brief`, current gates |
| Skills matched and used | `frontend-skill`, `design-direction`, `webapp-testing`, `security-pass`, `subagent-mission-brief`, current gates |
| Skills skipped | `git-safety` — no staging, commit, or push in this Work Block; other categories are not relevant after inspection. |
| Topology | Subagent-Required: production mutation endpoint and frontend across more than four files; read-only Design, Contract/Security, and Critic agents dispatched. One Scoped Coder will hold all source write authority; a read-only Verifier follows. |
| External side effects | Prohibited: live webhook/Telegram calls, configuration changes, deploy, commit, push, database action, and client messages. |

## Design and compatibility decisions

- Preserve the existing contact form visual language; add the selector beside
  urgency after the description and stack naturally on mobile.
- French field copy: `Langue de contact préférée *`; Russian field copy:
  `Предпочтительный язык связи *`; values are `Русский`, `Français`,
  and `English`.
- Rename the selector’s intent to project/web services and remove onsite
  intervention wording.
- Scope includes the contact page, home contact section, and live chat handoff
  because all three send to the same endpoint.
- API compatibility policy: UI retirement only. Existing legacy service values
  remain accepted in `contact-submit.ts` pending a separate approved API
  retirement Work Block.
- Webhook payload is forwarded with `X-Contract-Version: 1`. A strict
  consumer may reject the new field; no live call is authorized, so this is a
  formal external-compatibility follow-up.

## Approved write-set

- `.agent/critic-gate.md`
- `.agent/verification-gate.md`
- `docs/tasklist/WB-2026-07-21-web-contact-language-and-service-focus.tasklist.md`
- `docs/reports/WB-2026-07-21-web-contact-language-and-service-focus-critic.md`
- `docs/reports/WB-2026-07-21-web-contact-language-and-service-focus-verification.md`
- `memory_bank/orchestrator-log.md`
- `memory_bank/context.md`
- `memory_bank/progress.md`
- `memory_bank/decisions.md`
- `web/src/components/contact/contact-page-client.tsx`
- `web/src/components/sections/home-contact.tsx`
- `web/src/ChatWidget.jsx`
- `web/src/i18n.js`
- `web/src/lib/contact-submit.ts`
- `web/src/lib/telegram-notify.ts`
- `web/src/lib/contact-submit.test.ts`
- `web/src/lib/telegram-notify.test.ts`

## Task flow

| ID | Stage | Owner | Status | Evidence |
|---|---|---|---|---|
| CLF-01 | Discover live contact surfaces and intake contract. | Control Tower / Analysts | DONE | Direct page, home section, and root chat handoff traced to the shared endpoint. |
| CLF-02 | Design and contract review. | Read-only reviewers | DONE | Design and security/contract findings consolidated; Critic `SUPPLEMENT` adopted. |
| CLF-03 | Implement approved frontend, validation, notification, and tests. | Scoped Coder | DONE | Eight approved source/test paths only; legacy API service acceptance preserved. |
| CLF-04 | Review diff and run full local verification, including browser smoke. | Read-only Verifier | DONE (local) | Focused tests, lint, typecheck, build, source review, and browser smoke pass; one unrelated showcase full-suite failure recorded. |
| CLF-05 | Record formal verification and SSOT synchronization. | Control Tower | BLOCKED | The 2026-07-22 one-shot local delivery smoke returned `503 integration_not_ready` before the webhook fetch, so it did not send an e-mail or prove external compatibility. Formal READY still requires an Owner-provisioned os-isolated verifier and a separately approved integration/configuration diagnostic. |

## Verification plan

- Focused validation tests cover accepted, missing, and invalid language values.
- Notification test proves the selected language reaches the message, with no
  secrets in output.
- Run lint, typecheck, targeted tests, relevant suite, and build.
- Verifier smoke-tests `/contact`, `/fr`, `/ru`, and chat handoff at 375px
  and desktop; checks that retired hardware fields and onsite wording are absent.
- Inspect the changed contract for an allowlist and unchanged origin,
  body-size, and rate-limit controls.
- Required formal verifier isolation is `os-isolated` due the existing
  external-provider integration. No live provider call is authorized.

## Risks and stop conditions

- A new field can break a strict downstream webhook consumer. Do not change
  contract version or call the provider in this Work Block.
- If the approved source write-set must grow, stop for a write-set amendment.
- Any config, deployment, database, provider call, commit, or push requires
  separate authorization.
