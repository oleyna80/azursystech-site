# WB-2026-07-10 — Design Agent Routing Pilot

## Status

Complete

## Stage

Plan -> Implementation -> Review -> Verification

## Objective

Add a pilot design-routing layer so the Orchestrator can assign a read-only
Design Analyst to choose an appropriate design-skill stack and produce a Design
Brief before frontend/showcase coding starts.

## Role

Orchestrator

## Expected Result

The repository has a small, documented pilot path for:

- design reference analysis;
- design-skill stack selection;
- design brief creation;
- handoff from Design Analyst to Scoped Coder;
- visual QA gates for Review and Verification.

## Scope

- `.claude/agents/design-analyst.md`
- `.opencode/agents/design-analyst.md`
- `.agent/ROSTER.md`
- `.agent/skills/design-direction/SKILL.md`
- `docs/templates/design-brief-template.md`
- `docs/templates/subagent-mission-brief-template.md`
- `docs/templates/work-block-template.md`

## Out Of Scope

- Application source code.
- Showcase demo changes.
- New dependencies.
- Runtime/provider/API configuration.
- Secrets, `.env`, credentials, private config.
- Commit or push without Owner approval.
- Existing dirty files outside the approved scope.

## Pilot Rules

- Design Analyst is read-only.
- Design Analyst selects the design-skill stack; Scoped Coder implements.
- Design Brief is required for non-trivial design/source-porting work.
- One dominant aesthetic should be selected; conflicting design skills must be
  explicitly rejected.
- Exact-port, inspired-adaptation, redesign, and greenfield modes must be
  distinguished before coding.

## Verification Plan

- `git diff --check`
- Targeted search for secret-like strings in changed docs/agent files.
- Read-back review of the routing text for role separation and gate safety.

## Closeout

- Stage: Verification
- Files changed:
  - `.claude/agents/design-analyst.md`
  - `.opencode/agents/design-analyst.md`
  - `.agent/ROSTER.md`
  - `.agent/skills/design-direction/SKILL.md`
  - `docs/templates/design-brief-template.md`
  - `docs/templates/subagent-mission-brief-template.md`
  - `docs/templates/work-block-template.md`
  - `docs/plans/WB-2026-07-10-design-agent-routing-pilot.md`
- Checks run:
  - `git diff --check`
  - `git diff --no-index --check /dev/null ...` for new pilot files
  - `bash scripts/bootstrap.sh --check`
  - targeted secret-pattern search across changed docs/agent files
- Result: Pilot design-routing layer added. Design Analyst is read-only and
  routes design skill selection and Design Brief creation before Scoped Coder
  implementation.
- Risks:
  - This is a pilot and has not yet been exercised on a real design Work Block.
  - Runtime-specific slash commands were not added in this WB.
  - Existing unrelated dirty files remain outside this scope.
- Next action: Use the Design Analyst path on the next frontend/showcase design
  task, then decide whether to promote it from pilot to default workflow.
