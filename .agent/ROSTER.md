# Agent Routing Roster — AzurSysTech

> Maps logical SDLC roles to authority, responsibilities, and portable skills.
> Runtime-specific agent names, models, plugins, judges, and launch commands
> belong in adapters or Work Block evidence. They do not create governance roles.

## Core Logical Roles

| Role | Responsibility | Default authority | Core skills |
|---|---|---|---|
| Orchestrator | Frame Work Blocks, select profiles/evaluation posture, manage scope, route functions, consolidate evidence, enforce gates, close out | Workflow artifacts and approved coordination paths | task-decomposition, ssot-sync-closeout, memory-ops, subagent-mission-brief, orchestrator-log, sprint-analysis |
| Architect | Discover constraints, propose architecture, draft specifications and implementation/evaluation plans | Read-only by default; approved draft paths | discovery, architecture-discovery, technical-discovery, project-estimation |
| Critic | Challenge scope, assumptions, risk, routing, verification, and evaluation design before implementation | Read-only; critic report path only | critic-review |
| Coder | Implement the approved plan inside one explicit write-set | Approved source write-set only | scoped-coder, git-safety, scoped-commit-guard, shell-context-guard, systematic-debugging, design-direction |
| Reviewer | Inspect the frozen diff for defects, regressions, security, architecture, and maintainability | Read-only; review report path only | reviewer, security-pass, security-audit-triage, media-rights-compliance |
| Verifier | Test acceptance criteria and synthesize deterministic/output/trajectory evidence | Read-only for source/runtime; verification/evaluation artifacts only | verifier, webapp-testing, security-verification-gate, video-quality-control |

## Temporary Specializations

Specializations narrow focus but never expand authority. Examples:

- Design Analyst / Visual Director
- Architecture Analyst
- Product Analyst
- Frontend Reviewer
- Backend Coder
- Security Reviewer
- QA Verifier
- **Evaluator** — executes an approved output/trajectory evaluation plan
- Media Production Specialist (video-creative-brief, short-video-scriptwriter, storyboard-director, cinematography-director, video-prompt-engineer, video-provider-router, video-generator, video-postproduction, web-video-integration)
- Release Analyst / Git Orchestrator (`git-orchestration-flow`)
- Specification Drift Auditor (`spec-drift-audit`)

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

## Core Skill and Contract Routing

| Skill / contract | Route when |
|---|---|
| `design-direction` | Visual direction, UI/UX polish, landing pages, brutalism, minimalism, or design audits |
| `discovery` | Codebase exploration, architectural discovery, or dependency mapping |
| `security-pass` | Security audit, vulnerability triage, or hardening verification |
| `git-safety` | Safe git operations, scoped commits, or branch worktree context guards |
| `git-orchestration-flow` | Git branch management, worktrees, PR ruleset handling, GraphQL thread resolution, two-pass closure projections |
| `memory-ops` | Operational memory logging, snapshots, SSOT sync, and retrospectives |
| `sprint-analysis` | Velocity analysis, WB outcome tracking, process quality analysis |
| `skill-library-maintenance` | GitHub source checks, skill curation, and safe skill adaptation |
| `task-decomposition` | Goal decomposition into atomic tasks with acceptance criteria |
| `critic-review` | Define-stage decisions require independent pre-execution challenge |
| `scoped-coder` | Approved file-changing implementation work |
| `reviewer` | Frozen diff requires independent review across code/docs/security/architecture |
| `verifier` | Acceptance criteria or technical contracts require evidence (status, TS, tests, CSP/CSRF) |
| `systematic-debugging` | Root cause must be established before a fix |
| `ssot-sync-closeout` | Post-stage SSOT synchronization |
| `subagent-mission-brief` | Operational mission briefs for subagents and delegated gates |

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

---

## Runtime Command Adapters

| Runtime | Invocation | Adapter | Canonical source |
|---|---|---|---|
| OpenCode | `/sprint` | `.opencode/commands/sprint.md` | `.agent/skills/sprint-analysis/SKILL.md` |
| Claude Code | `/sprint` | `.claude/commands/sprint.md` | `.agent/skills/sprint-analysis/SKILL.md` |
| Codex | skill discovery | `.agents/skills/sprint-analysis/SKILL.md` | `.agent/skills/sprint-analysis/SKILL.md` |

---

**This ROSTER is canonical for "which skill?" and "who decides?". All implementation flows through Control Tower → Scoped Coder execution → Verifier gates.**
