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
- Critic
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
  Codex-specific execution rules and subagent usage; Controller v1 owns runtime authority.

Role rules:
- Orchestrator plans, assigns scoped subagents, consolidates findings, identifies risks, and proposes next actions.
- Reviewer is read-only and must not modify files.
- Critic is read-only and reviews the committed planning revision before Controller v1 binds `READY` in DEFINE.
- Verifier is read-only unless explicitly approved for narrow evidence updates. Reviewer and Verifier outcomes bind the exact source candidate SHA; reports do not substitute for bindings.
- Coder may modify only files within the approved scope.
- Exactly one Coder owns each approved write-set; parallel writers require non-overlapping ownership and the approved isolation.
- Subagents are read-only by default unless explicitly approved for write-capable work.

Subagent rules:
- Assign bounded independent Critic, Reviewer, and Verifier contexts as required
  by the approved Work Block; exactly one Coder owns each approved write-set.
- Each assignment defines role, scope, exclusions, expected output and write permission.
- Capability/topology evidence describes actual isolation; it does not create
  admission or replace trusted external active-admission authority.
- Same-context advisory discovery does not substitute for required independent assurance.
- Subagents inherit the parent session sandbox; declared read-only intent is
  not proof of an OS or filesystem boundary.
- Do not launch Claude Code from a Codex subagent. External-team delegation is
  a separate main-Orchestrator action within approved scope.

Codex critic gate:
- Use `.codex/critic.md` for the planning review. Controller v1 binds Critic
  READY to the committed planning revision and atomically moves DEFINE to EXECUTE.
- Missing required evidence keeps execution blocked; fallback or a legacy
  write-gate record cannot satisfy the binding.
- Resolve material findings through planning correction/revise bind and a new
  Critic review. Log/report only within approved coordination paths.
- Reviewer and Verifier subsequently bind the exact committed source candidate.

Approval rules:
- Any repository file change requires an approved scope.
- Do not proceed with production/risky changes without explicit Owner approval.
- Always stop for approval before: production code changes outside approved scope, architecture changes outside approved scope, database/schema/migration changes, new dependencies, config/secrets/env changes, deploys, payment/checkout/order changes, destructive operations, and every Owner-controlled publication action. An approved Work Block may instead authorize local commits and the sole bounded candidate push defined in `governance/authority.md`.

Autonomous Execution Mode:
- Once the Owner has approved the Work Block objective, scope, architectural
  constraints, and authority boundary, Codex autonomously performs planning and
  the remaining lifecycle through Controller v1 without asking for confirmation
  after every small subtask. Trusted external active admission, Git-private
  schema-v2 state, immutable profile and approved scope remain prerequisites;
  tracked schema-v3 state and historical gates neither grant nor deny authority.
- Stay strictly within the approved scope.
- After each stage, report: completed stage, files changed, checks run, review/verification result, risks, next stage.
- Stop and ask for Owner approval if a stop condition occurs.

Git and safety rules:
- Before Coder/Fix stages, check git status.
- Do not modify unrelated dirty files.
- Do not stage, commit, or push without an approved Work Block. Local commits and
  the exact assured subject-branch candidate push may proceed autonomously only
  under `governance/authority.md`; every other publication action remains
  Owner-controlled.
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
- External-team evidence never replaces required Critic/Reviewer/Verifier
  controller bindings or changes the human-governed Owner boundary.

Small Task Path:
- For trivial tasks, do not use the full Agentic Lifecycle.
- Trivial tasks may use: understand → scoped change → check → report.
- Still follow Git safety, scope control, no secrets and changed-file reporting.
- A small-task label never bypasses installed admission/state or Controller v1 decisions.
