# WB-2026-07-08-agent-self-improvement-loop

## Meta
- **Work Block ID:** WB-2026-07-08-agent-self-improvement-loop
- **Date:** 2026-07-08
- **Owner:** Azur
- **Execution Mode:** staged approval
- **Side-Effect Class:** local-docs / workflow-script-control
- **DB Action Mode:** none
- **Verification Tier:** standard

## Lifecycle State
- **Current Stage:** Stage 3
- **Stage Execution State:** completed
- **Write Gate:** READY
- **Owner Approval Evidence:** Owner approved opening the Work Block in chat on 2026-07-08
- **Critic Gate:** SUPPLEMENT
- **Verification Gate:** READY
- **Verification Verdict:** READY
- **Stage 3 Mode:** success-closeout

## Objective
Create a controlled agent self-improvement process for AzurSysTech.

The process must automate sprint retrospectives and produce actionable
improvement candidates for skills, templates, workflows, hooks, and agent
prompts, while preventing agents from self-authorizing unsafe changes to their
own authority model.

## Expected Final Result
The repository has a documented, repeatable improvement loop, implemented as a
minimal first increment in existing SDLC artifacts rather than a new autonomous
meta-framework:

1. Work Block closeouts and sprint retrospectives capture process evidence.
2. `sprint-analysis` can surface improvement candidates, not just velocity and
   incident metrics.
3. Candidate changes are classified before implementation:
   `skill-update`, `skill-create`, `skill-archive`, `agent-prompt`,
   `template`, `workflow`, `hook`, or `no-action`.
4. Any candidate that changes agent behavior goes through critic review,
   scoped implementation, verification, and Owner commit decision.
5. `memory-ops` clarifies that ops-review recommendations are advisory inputs,
   not automatic permission or policy changes.
6. `work-block-template.md` captures improvement candidates and explicitly
   separates process learning from approved framework changes.
7. No production source code, secrets, provider configuration, or unrelated
   showcase work is touched.

## Done Criteria
- [x] `sprint-analysis` documents an improvement-candidate output section.
- [x] `memory-ops` documents that ops-review output is recommendation-only and
  must not directly patch skills, hooks, gates, or permissions.
- [x] `work-block-template.md` includes a closeout section for agent improvement
  candidates and their disposition.
- [x] Critic review is recorded and all blocking supplements are resolved.
- [x] Verification output confirms no weakening of Hard Stops or role authority.
- [x] Existing unrelated dirty files remain untouched by this Work Block.

## Preflight State
- **Git baseline:** dirty
- **Command:** `git status --short --branch`
- **Pre-existing dirty files:**
  - `.agent/critic-gate.md`
  - `.agent/verification-gate.md`
  - `showcase/app/demo/[slug]/layout.tsx`
  - `showcase/app/globals.css`
  - `web/src/app/[locale]/_home-data.ts`
  - `web/src/lib/portfolio-data.ts`
  - `docs/reports/critic-WB-2026-07-07-showcase-demo-ports.md`
  - `docs/reports/showcase-demo-ports-verification-2026-07-07.md`
  - `showcase/app/demo/bijoux-artisanaux/`
  - `showcase/app/demo/maison-olive/`
  - `showcase/components/bijoux-artisanaux/`
  - `showcase/components/maison-olive/`
  - `showcase/demo-kit/layout/DemoReturnLink.tsx`
  - `showcase/lib/demo-return-url.ts`
  - `showcase/public/demo/bijoux-artisanaux/`
  - `showcase/public/demo/maison-olive/`
- **Untracked local artifacts:** none inspected beyond the list above
- **Proceed rule:** implementation may proceed only within the write-set below.
  Commit for this Work Block is blocked until the pre-existing showcase dirty
  tree is either committed, explicitly included in a separate commit scope, or
  otherwise resolved by Owner decision.

## Dependency Check
### Must Resolve Before Start
- Critic review must approve or supplement this Stage 0 plan.
- Owner must approve implementation after critic supplements are incorporated.
- Commit for this WB must wait until the unrelated showcase dirty tree is
  closed, explicitly separated, or otherwise resolved by Owner decision.

### Can Resolve During Work
- Exact wording of candidate classifications can be adjusted during
  implementation if the authority boundaries remain unchanged.

## Runtime / Data Mutation Boundary
- **Applies:** no
- **Agent authority:** documentation and local workflow-script authoring only
- **Structured action:** not applicable
- **Trusted executor:** not applicable
- **Policy and approval:** no DB, provider, live service, deploy, client
  communication, or secret mutation
- **Audit path:** Work Block plan, critic report, verification report,
  orchestrator closeout
- **Forbidden direct path:** any production source edit, secret/provider config
  edit, deploy, DB mutation, or commit/push without separate Owner approval

## Scope
### In Scope
- Update `.agent/skills/sprint-analysis/SKILL.md` to include improvement
  candidate extraction and reporting guidance.
- Update `.agent/skills/memory-ops/SKILL.md` to clarify ops-review as
  recommendation-only input and define safe handoff into improvement candidates.
- Update `docs/templates/work-block-template.md` to capture improvement
  candidates, dispositions, and future framework-update proposals during
  closeout.
- Add a critic report under `docs/reports/`.

### Out of Scope
- Production application code.
- Showcase demo files and portfolio files from the pre-existing dirty tree.
- `.agent/critic-gate.md` and `.agent/verification-gate.md` unless a separate
  gate-reset step is explicitly approved after the previous WB is resolved.
- `.claude/agents/**`, `.claude/settings*`, provider/model/API configuration.
- `.codex/config.toml`, `.env*`, secrets, credentials, private runtime config.
- New external dependencies.
- New hooks, hook behavior changes, or validator scripts in this first
  increment.
- New active skills in this first increment.
- Commit or push.
- Fully autonomous loop engineering or recursive self-modification.

## Write-Set
```text
.agent/skills/sprint-analysis/SKILL.md
.agent/skills/memory-ops/SKILL.md
docs/templates/work-block-template.md
docs/reports/critic-WB-2026-07-08-agent-self-improvement-loop.md
docs/plans/WB-2026-07-08-agent-self-improvement-loop.md
```

## Navigation Impact
- **Files added/moved/removed:** plan and reports only; no new workflow,
  template, skill, hook, or script files in this first increment
- **PROJECT_MAP.md update needed:** no
- **FILE_REGISTRY.yml update needed:** no
- **Session bootstrap or profile docs update needed:** no
- **Engineering memory update needed:** maybe after verification, if the loop is
  accepted as durable practice
- **Generated/derived/local-only boundary changed:** no

## Commit / Stage Scope
- **Files to stage/commit:** only the write-set above after verification and
  separate Owner commit approval
- **Files to leave unstaged:** all pre-existing showcase dirty files and active
  gate files unless Owner explicitly approves a broader commit scope
- **Scope guard:** `git status --short`, `git diff --name-only`,
  `git diff --check`

## Acceptance Criteria
- [x] The workflow makes agent self-improvement evidence-based and gated.
- [x] Agents may propose skill/template/hook changes but cannot self-approve
  authority expansion or Hard Stop weakening.
- [x] Improvement candidates include source evidence, problem, proposed change,
  expected effect, risk, verification, and disposition.
- [x] Sprint retrospectives distinguish process learning from actionable
  framework changes.
- [x] `sprint-analysis` remains concise and does not become a broad
  orchestration manual.
- [x] No active skill count increase unless explicitly justified by critic.

## Risks and Mitigations
| Risk | Impact | Mitigation | Stop Condition |
|---|---|---|---|
| Self-improvement becomes self-authorization | Agents weaken their own controls | Candidate queue + critic + verifier + Owner commit decision | Any text allows bypassing Hard Stops or approval |
| Skill bloat returns after recent curation | Skill Routing Gate becomes expensive again | Prefer updating existing skills/templates; avoid new active skill | New skill proposed without evidence |
| Dirty tree cross-contamination | Showcase changes get mixed with governance work | Narrow write-set and no commit until dirty tree resolved | Any diff outside write-set |
| Hook/script overreach | First increment grows into brittle enforcement | No hooks or validators in this WB | Script/hook changes become required |
| Retro overfitting | One-off incidents become permanent process burden | Require evidence and classification; allow `no-action` | Candidate lacks repeated or high-impact evidence |

## Hard Stops in Scope
- [ ] Production deploy
- [ ] Live DB migration
- [ ] Credential rotation
- [ ] Destructive git ops
- [ ] Commit or push
- [ ] Public release/publication
- [ ] Client communications

## Subagent Strategy
- **Classification:** Subagent-Required
- **Triggers matched:** governance/workflow changes, skill changes, script
  addition, independent verification required
- **Use Claude Code team:** optional; not required for this Codex-led control WB
- **Claude Code process scope:** not applicable unless Owner asks to delegate
- **Claude Code external report:** not applicable
- **Use Codex/GPT critic or verifier:** yes, native Codex critic/explorer for
  read-only Stage 0 critic; GPT verifier optional if verifier result is blocked
  or authority-risk findings appear
- **Dispatch plan:**
  1. Read-only critic reviews Stage 0 plan.
  2. One scoped coder implements the write-set after Owner approval.
  3. Read-only verifier validates structure, authority boundaries, and template
     consistency.
- **Budget posture:** normal; use cheap models/subagents for inventory and
  deterministic checks where possible
- **Skip reasons:** none expected

## Skills
- **Checked:** `sprint-analysis`, `memory-ops`, `subagent-mission-brief`,
  `skill-creator`
- **Matched:** `sprint-analysis`, `memory-ops`, `skill-creator`
- **Used:** `skill-creator` for skill-update design principles,
  `memory-ops` for ops-review/SSOT boundaries, `sprint-analysis` as target
  skill
- **Skipped:** `design-direction`, `webapp-testing`, `security-pass`,
  `git-safety`, `discovery`, `systematic-debugging`, `impeccable` because this
  is control-layer documentation and validation scripting, not UI, security
  hardening, commit, research, debugging, or visual implementation

## Verification Plan
- **Canonical checks:**
  - `git diff --check`
  - `rg -n "self-approve|self-authoriz|ignore Hard Stop|bypass approval|force push|secret|token|API key" .agent/skills/sprint-analysis/SKILL.md .agent/skills/memory-ops/SKILL.md docs/templates/work-block-template.md`
  - `rg -n "Improvement Candidate|agent improvement|skill-update|skill-create|skill-archive|no-action" .agent/skills/sprint-analysis/SKILL.md .agent/skills/memory-ops/SKILL.md docs/templates/work-block-template.md`
- **Scoped fallback checks:** if the new validator is not executable, run it via
  `bash scripts/validate-agent-skills.sh`
- **Browser smoke:** not applicable
- **Evidence expected:** critic report, command outputs, changed-file
  inventory
- **Skipped checks:** app build/test not required because no production app
  code should change; hook/script tests not applicable because hooks/scripts are
  out of scope in this first increment

## Rollback / Recovery
Before commit, remove the new plan/report files and revert the targeted
skill/template edits only. Do not touch unrelated showcase changes. If the
process wording proves too broad, keep only the `sprint-analysis` candidate
section and defer `memory-ops` / template edits.

## Execution Log
| Time | Stage | Action / Decision | Evidence | Status |
|---|---|---|---|---|
| 2026-07-08 | Stage 0 | Owner approved opening this WB | chat confirmation | ready |
| 2026-07-08 | Stage 0 | Dirty tree detected; narrow write-set required | `git status --short --branch` | documented |
| 2026-07-08 | Stage 0 | Critic returned SUPPLEMENT; plan narrowed to minimal existing-artifact patch | read-only critic review | incorporated |
| 2026-07-08 | Stage 1 | Implemented the approved docs-only increment and ran scoped checks | `git diff --check`; `rg -n` scoped validation | done |
| 2026-07-08 | Stage 2 | Read-only verifier returned READY; no authority weakening found | verifier output; `git diff --check`; scoped `rg` scans | ready |
| 2026-07-08 | Stage 3 | Closed WB as docs-only control-layer increment | this plan closeout | done |

## Closeout and Retrospective
Complete after verification.

### Result Summary
- **Final Result:** Controlled agent self-improvement is now captured as an
  evidence-based candidate loop in existing SDLC artifacts. `sprint-analysis`
  can report improvement candidates, `memory-ops` keeps ops-review
  recommendation-only, and `work-block-template.md` records candidate
  disposition during closeout.
- **Closeout Classification:** SUCCESS
- **Task Status:** completed
- **Verification Evidence:** `git diff --check`; scoped `rg` scans for
  self-approval / bypass / secret patterns; read-only verifier verdict `READY`
- **Residual Risks:** unrelated pre-existing showcase and gate dirty files
  remain outside this WB and must be handled separately before a clean commit
  strategy.

### Critic and Review Value
- **Critic used:** yes; read-only Codex critic subagent
- **Critic verdict:** SUPPLEMENT
- **What the critic caught:** the first increment needed to stay bounded to
  existing artifacts, avoid hooks/validators/new active skills, preserve Owner
  approval, and keep ops-review recommendations advisory.
- **What the critic missed:** nothing material discovered during verification
- **Skip/fallback reason:** not applicable

### Lessons Learned
- **What worked:** a narrow candidate queue is enough for this stage; it gives
  the agent a place to learn from sprint evidence without granting new
  authority.
- **What did not work:** the repo still carried unrelated dirty showcase/gate
  changes, which blocks straightforward commit hygiene for governance work.
- **What not to repeat:** do not turn one sprint-retro lesson directly into a
  hook, permission, or active skill without critic/verifier review and Owner
  approval.
- **Evidence wording check:** used advisory language such as "candidate" and
  "recommendation"; avoided claims that the loop proves or guarantees process
  quality.
- **Framework updates made:** updated `sprint-analysis`, `memory-ops`, and
  `work-block-template.md`; added a critic report.
- **Framework updates to consider:** after several sprints, consider a separate
  WB for a small validator or archived candidate ledger if repeated evidence
  shows manual candidate tracking is not enough.
- **Reusable knowledge created:** closeout candidate-disposition pattern.
- **Engineering memory classification:** operational-only for now; promote only
  after the loop has worked across repeated WBs.
- **Navigation updates:** none / not applicable.
- **Follow-up Work Blocks:** separate dirty-tree commit hygiene for showcase and
  active gate files before committing this governance WB.

### Agent Improvement Candidates
| Candidate | Class | Evidence | Disposition |
|---|---|---|---|
| Candidate ledger after repeated use | template | This WB created only inline closeout capture | defer |
| Validator for unsafe self-improvement wording | workflow | Scoped `rg` checks were enough for this first increment | defer |
| Promote durable lesson to engineering memory | no-action | Only one run so far | no-action |
