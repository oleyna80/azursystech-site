# Critic report — WB-2026-07-22 English core launch specification

Date: 2026-07-22

Mode: native same-session Critic, advisory planning review

## Scope reviewed

Plan-only Work Block for an implementation-ready English core launch. No
production source, route, API, provider, configuration, deployment, commit, or
push action is authorized by this report.

## Verdict

SUPPLEMENT — adopted.

The future implementation must define English as a deliberately limited public
core: `/en` and `/en/ai-automation`. It must not publish `hreflang`, sitemap,
or navigation targets for pages that still have no English counterpart.

## Required supplements adopted in the plan

- The implementation separates locale-shell architecture, English editorial
  content, metadata, hreflang, and sitemap from forms, chat, brief, and other
  conversion surfaces.
- Direct locale URLs must control the shell and document language; expanding
  only the route locale union is insufficient because the current root shell is
  cookie-oriented.
- English core acceptance covers both localized routes, header/footer language
  switching, canonical and hreflang metadata, and sitemap coverage.
- Existing `web/src/i18n.js` English values are not an approved editorial
  source. They remain unchanged unless a future implementation proves a shared
  contract needs them.
- The current contact-intake Work Block remains formally BLOCKED for external
  provider compatibility and is not altered by this planning Work Block.

## Approved write-set

- .agent/critic-gate.md
- .codex/write-gate.md
- docs/plans/WB-2026-07-22-english-core-launch-spec.md
- docs/tasklist/WB-2026-07-22-english-core-launch-spec.tasklist.md
- docs/reports/WB-2026-07-22-english-core-launch-spec-critic.md
- memory_bank/orchestrator-log.md
- memory_bank/review-log.md

## Routing review

- Used: `current-work-block-gates`, `discovery`, and
  `subagent-mission-brief`.
- Reserved for the future implementation: `webapp-testing` for browser, route,
  and SEO proof; `security-pass` if the scope reaches mutation/provider code.
- Not needed in this plan-only Work Block: visual-design skills and git-safety
  commit workflow.

## Future implementation topology

The future source Work Block is Subagent-Required: it will touch more than four
production files and needs an independent verifier. Use exactly one Scoped
Coder and read-only Verifier. Formal verification should require
`independent-readonly-root`; no sensitive-domain change is approved in the EN
core slice.
