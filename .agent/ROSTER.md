# Agent Routing Roster — AzurSysTech

> Maps logical SDLC roles to authority, responsibilities, and portable skills.
> Runtime-specific agent names, models, plugins, judges, and launch commands
> belong in adapters or Work Block evidence. They do not create governance roles.

## Core Logical Roles

| Role | Responsibility | Default authority | Core skills |
|---|---|---|---|
| Orchestrator | Frame Work Blocks, select profiles/evaluation posture, manage scope, route functions, consolidate evidence, enforce gates, close out | Workflow artifacts and approved coordination paths | task-decomposition, ssot-sync-closeout, memory-ops, subagent-mission-brief, orchestrator-log, sprint-analysis, spec-drift-audit |
| Architect | Discover constraints, propose architecture, draft specifications and implementation/evaluation plans | Read-only by default; approved draft paths | discovery, architecture-discovery, technical-discovery, project-estimation, requirements-clarification |
| Critic | Challenge scope, assumptions, risk, routing, verification, and evaluation design before implementation | Read-only; critic report path only | critic-review, requirements-quality-review, spec-consistency-analysis |
| Coder | Implement the approved plan inside one explicit write-set | Approved source write-set only | scoped-coder, git-safety, scoped-commit-guard, shell-context-guard, systematic-debugging, design-direction |
| Reviewer | Inspect the frozen diff for defects, regressions, security, architecture, and maintainability | Read-only; review report path only | reviewer, security-pass, security-audit-triage, media-rights-compliance |
| Verifier | Test acceptance criteria and synthesize deterministic/output/trajectory evidence | Read-only for source/runtime; verification/evaluation artifacts only | verifier, webapp-testing, security-verification-gate, video-quality-control |

## Temporary Specializations

Specializations narrow focus but never expand authority:

- Design Analyst / Visual Director (`design-direction`)
- Architecture Analyst (`discovery`)
- Requirements Specialist (`requirements-clarification`, `requirements-quality-review`)
- Consistency Analyst (`spec-consistency-analysis`)
- Drift Auditor (`spec-drift-audit`)
- Frontend Reviewer / Backend Coder
- Security Reviewer (`security-pass`)
- QA Verifier (`webapp-testing`, `crash-test-gate`)
- Evaluator — executes an approved output/trajectory evaluation plan
- Media Production Specialist (media skills 1–13)
- Git Orchestrator (`git-orchestration-flow`)

## Isolation Levels

From weakest to strongest:

1. `same-context`
2. `separate-subagent`
3. `separate-session`
4. `separate-worktree`
5. `separate-runtime`
6. `independent-readonly-root`
7. `os-isolated`

The Work Block chooses the minimum sufficient level and records the actual boundary.

For the AzurSysTech assurance contract:
- `same-context` and `separate-subagent` map to `same-session-degraded` (advisory only for sensitive work) unless an independently read-only root is evidenced;
- `separate-session` satisfies `independent-readonly-root` only when that root and its access boundary are evidenced;
- `os-isolated` maps to `os-isolated` (required for credentials, live DB, live infra, and production deployment).

## Core Skill and Contract Routing

| Skill / contract | Route when |
|---|---|
| `requirements-clarification` | Ambiguities in scope, actors, edge cases, or acceptance criteria must be resolved prior to planning |
| `requirements-quality-review` | Specification completeness, testability, and non-ambiguity must be audited prior to implementation |
| `spec-consistency-analysis` | Consistency between specification, architecture decisions, and task decomposition must be proven |
| `spec-drift-audit` | Auditing consistency between specification, code, tests, and documentation during assurance |
| `task-decomposition` | Goal decomposition into atomic tasks with stable REQ/AC/TASK IDs and explicit paths |
| `design-direction` | Visual direction, UI/UX polish, landing pages, brutalism, minimalism, or design audits |
| `discovery` | Codebase exploration, architectural discovery, or dependency mapping |
| `security-pass` | Security audit, vulnerability triage, or hardening verification |
| `git-safety` | Safe git operations, scoped commits, or branch worktree context guards |
| `git-orchestration-flow` | Git branch management, worktrees, PR ruleset handling, two-pass closure projections |
| `memory-ops` | Operational memory logging, snapshots, SSOT sync, and retrospectives |
| `sprint-analysis` | Velocity analysis, WB outcome tracking, process quality analysis |
| `skill-library-maintenance` | GitHub source checks, skill curation, and safe skill adaptation |
| `systematic-debugging` | Root cause must be established before a fix |
| `subagent-mission-brief` | Operational mission briefs for subagents and delegated gates |
| `crash-test-gate` | Route integrity, navigation, anchor link, and sitemap validation |
| `deploy-operations` | Production deployment preparation, secret scanning, and verification |
| `vps-operations` | VPS server connectivity, SSH keys, tunnels, GHCR login |

## Media Production Skills (Planning Baseline)

| # | Skill | Purpose | Role | Phase | Target Boundary |
|---|---|---|---|---|---|
| 1 | **media-production-orchestrator** | End-to-end AI media pipeline planning | Control Tower | Planning | Controlled roadmap |
| 2 | **media-art-director** | Motion role & UX necessity decision | Design Analyst | Planning | Motion brief |
| 3 | **video-creative-brief** | Production-ready media brief | Control Tower / Design Analyst | Planning | Budget & approval role |
| 4 | **short-video-scriptwriter** | Visual beat script | Design Analyst | Planning | Beat breakdown |
| 5 | **storyboard-director** | Composition & framing plan | Design Analyst | Planning | Shot specification |
| 6 | **cinematography-director** | Camera, lens, light, motion | Design Analyst | Planning | Lens & lighting specs |
| 7 | **video-prompt-engineer** | Provider-neutral prompt package | Design Analyst | Planning | Motion constraints |
| 8 | **video-provider-router** | Route selection & cost evaluation | Control Tower / Reviewer | Planning | Cost & license constraints |
| 9 | **media-rights-compliance** | Licensing, watermark & consent checks | Reviewer | Advisory planning | Legal & compliance boundary |
| 10 | **video-generator** | Approved generation contract | Scoped Coder | Execution contract | Requires approved WB |
| 11 | **video-quality-control** | Fidelity & stability review | Verifier | Quality gate | Defect review |
| 12 | **video-postproduction** | Encoding & web delivery criteria | Scoped Coder | Post-processing | Delivery variants |
| 13 | **web-video-integration** | Accessible web video embedding | Scoped Coder | Web integration | HTML5/CSS video integration |
