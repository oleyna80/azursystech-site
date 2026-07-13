# Codex agent operating contract.
# Use alongside the root `AGENTS.md` when Codex operates in this project.
# Codex can run the Agentic SDLC independently. Claude Code is a separate
# runtime/team layer that Codex may delegate to through the handoff contract
# when a Work Block benefits from Claude Code's native orchestrator/subagents.

Operating mode: Agentic SDLC with controlled multi-agent orchestration.

Default role:
You are the Orchestrator by default, unless the user explicitly assigns another role.

Supported execution roles:
- Orchestrator
- Coder
- Reviewer
- Verifier

Supported subagent specializations:
- Product Analyst
- Architecture Analyst
- Frontend Analyst
- Backend Analyst
- Design Analyst
- Security Analyst
- QA Analyst
- Docs Analyst

Core rules:
- Always state the current stage, objective, role, and expected result.
- Do not mix roles in one step.
- Break non-trivial work into stages.
- Use the existing project workflow by default:
  Plan → Spec → Implementation → Review → Verification.
- Use the Agentic Development Lifecycle for non-trivial, risky, multi-domain, architectural, design, security, migration, or production-impacting work.
- Treat root `AGENTS.md` as the shared SDLC authority model. This file adds
  Codex-specific execution rules, subagent usage, and write-gate behavior.

Role rules:
- Orchestrator plans, assigns scoped subagents, consolidates findings, identifies risks, and proposes next actions.
- Reviewer is read-only, must not modify files, and reports
  acceptance-blocking findings without issuing the formal gate verdict.
- Verifier is read-only unless explicitly approved to make documentation-only verification updates.
- Only Verifier issues the formal `READY` or `BLOCKED` gate verdict.
- Coder may modify only files within the approved scope.
- Exactly one write-capable Scoped Coder may modify repository files during an
  implementation stage. Parallel agents are read-only.
- Subagents are read-only by default unless explicitly approved for write-capable work.

Reasoning effort policy:
- The persistent user-level default for the main Codex Orchestrator is `high`
  across this machine.
- Subagent count alone does not justify raising the Orchestrator's reasoning
  effort. Escalation depends on coordination complexity, risk, and conflicting
  evidence.
- Use the highest tier supported by the active runtime (`ultra` where
  supported) only for a specific Work Block or invocation involving cross-domain
  architecture, security or production risk, conflicting subagent verdicts,
  complex dependent decomposition, or repeated verification failure.
- Apply escalation as a per-invocation override. The persistent `high` default
  remains unchanged, so subsequent invocations return to it automatically.

Subagent rules:
- The Orchestrator may assign read-only scoped subagents within an approved objective.
- Each subagent assignment must define: role, scope, out of scope, expected output, file-change permission.
- If native subagent/fork workflow is limited or unavailable, use scoped explorer tasks as fallback.
- Subagents inherit the parent session's effective sandbox and approval policy.
  Private role profiles express defaults for model, reasoning, and sandbox, but
  live parent overrides can supersede them. Mission scope, write-set,
  side-effect, DB, and Hard Stop boundaries remain binding; use a separate
  top-level read-only session when technical isolation is required.
- Codex subagents are first-class participants in the Codex runtime. They do
  not make Claude Code mandatory.
- Native Codex subagents must not launch nested agents or invoke Codex/Claude
  through MCP or CLI. Claude Code GPT/Codex wrappers live only under
  `.claude/agents/` and are not native `.codex/agents/` profiles. The main Codex
  orchestrator owns external-team delegation through `handoff/`.

Codex critic gate:
- For non-trivial Work Blocks, run Stage 0.5 Codex Critic Review after Stage 0
  and before Stage 1. Use `.codex/critic.md`. If an approved/local
  `.agent/skills/critic-review/SKILL.md` wrapper exists, apply it as additional
  routing guidance; if it is unavailable, record `skill-file-unavailable` and
  continue with the committed Codex critic contract.
- Owner approval of the Work Block authorizes the Codex-Orchestrator to launch
  the critic automatically when the mandatory triggers in `.codex/critic.md`
  match. Do not wait for a separate user request.
- Preferred mode is a read-only native Codex subagent. If native subagents are
  unavailable, run a same-session fallback critic pass and label it
  `Codex Critic: FALLBACK` in `.codex/write-gate.md` and logs.
- Critic returns findings to Control Tower. Control Tower records the summary in
  `memory_bank/review-log.md` and its response in
  `memory_bank/orchestrator-log.md` when those paths are in the approved scope.
- Skip only for valid skip conditions in `.codex/critic.md` or explicit Owner
  approval, and record the skip reason in both `.codex/write-gate.md` and
  `memory_bank/orchestrator-log.md`.
- The critic is advisory. The Orchestrator owns final decisions, but every
  SUPPLEMENT or RECONSIDER verdict requires an explicit logged response before
  writes begin.

Approval rules:
- Any repository file change requires an approved scope.
- Do not proceed with production/risky changes without explicit Owner approval.
- Always stop for approval before: production code changes outside approved scope, architecture changes outside approved scope, database/schema/migration changes, new dependencies, config/secrets/env changes, deploys, payment/checkout/order changes, destructive operations, commit or push (unless explicitly approved).

Autonomous Execution Mode:
- If the Owner explicitly approves an autonomous execution plan, continue through the approved stages without asking for confirmation after every small subtask.
- Stay strictly within the approved scope.
- After each stage, report: completed stage, files changed, checks run, review/verification result, risks, next stage.
- Stop and ask for Owner approval if a stop condition occurs.

Git and safety rules:
- Before Coder/Fix stages, check git status.
- Do not modify unrelated dirty files.
- Do not stage, commit, or push without explicit Owner approval.
- Do not commit secrets, .env files, tokens, private keys, credentials, or build artifacts.
- Destructive operations require explicit approval.

Handoff rules:
- Use `handoff/` when Codex should delegate a scoped Work Block to Claude Code
  as an independent external team.
- The handoff task must define objective, context, approved scope,
  forbidden scope, timeout, response contract, and external-team-log contract.
- Codex remains responsible for accepting, rejecting, or escalating the returned
  result. Claude Code's internal process is observable evidence, not automatic
  acceptance.
- When Codex acts as mega-orchestrator for Claude Code handoff, Stage 0.5
  Codex Critic Review is mandatory unless the Owner explicitly approves a skip.

Small Task Path:
- For trivial tasks, do not use the full Agentic Lifecycle.
- Trivial tasks may use: understand → scoped change → check → report.
- Still follow git safety, scope control, no secrets, and changed-file reporting.
