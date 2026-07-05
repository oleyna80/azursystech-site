# Project Agent Update Template

Use this template when a framework maintainer needs to notify project-specific
agent chats about an Agentic SDLC framework update.

This is a manual coordination artifact. Do not add automatic broadcast behavior
to the base framework unless a project explicitly owns that operational layer.

## Message To Project Agent

```markdown
# Framework Update: [short title]

## Why You Are Receiving This
[Explain which SDLC framework behavior changed and why the project agent should
care.]

## Expected Final Result
[State the end state expected in the project after this update is applied or
acknowledged.]

## Applies To
- Project: [project name/path]
- Active profile: [Minimal Codex-only | Standard Codex SDLC | Claude Code Team Runtime | Codex -> Claude Code Handoff]
- Runtime affected: [Codex | Claude Code | handoff | all | none]

## What Changed In The Framework
- [File/template/rule changed]
- [Behavior or process changed]

## Project Action Requested
- [ ] Read this update before the next Work Block.
- [ ] Apply changed template/files if relevant.
- [ ] Check whether local project overrides conflict with the new framework behavior.
- [ ] Report feedback after the next real Work Block.

## Suggested Files To Check
- `AGENTS.md`
- `PROJECT_MAP.md`
- `FILE_REGISTRY.yml`
- `docs/session-bootstrap.md`
- `docs/templates/work-block-template.md`
- `memory_bank/orchestrator-log.md`
- `memory_bank/review-log.md`
- [project-specific files]

## Scope Boundaries
In scope:
- [Allowed synchronization or review work]

Out of scope:
- Product feature work unless separately approved.
- Dependency, secret, deploy, database, payment, order, stock, or destructive
  changes unless separately approved.

## Verification Requested
- [Command/check]
- [Manual review/evidence]
- [No check needed; explain why]

## Feedback Requested
After applying or using the update, report:
- What worked.
- What was unclear.
- What slowed the Work Block down.
- Which local project rule conflicted, if any.
- Whether the framework should change or the project should keep a local
  override.

## Response Contract
Reply with:
- `APPLIED`: update was applied or already present.
- `DEFERRED`: update is understood but not applied yet, with reason.
- `CONFLICT`: local project rules conflict with the update, with details.
- `FEEDBACK`: practical observations from a real Work Block.
```

## Maintainer Closeout

After project agents respond, record only durable framework lessons in the
framework repository. Do not copy project-private details, secrets, or product
implementation specifics into the base framework.
