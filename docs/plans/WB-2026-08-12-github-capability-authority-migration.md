# WB-2026-08-12 — GitHub Capability Authority Migration

Status: IMPLEMENTING
Date: 2026-08-12
Owner: Project Owner
Baseline: `441b134d71f781d2d0fcc48d3a8da86875835a9c`
Framework reference: `oleyna80/agentic-sdlc-framework` / `WB-CORE-003F` / main `975262b2eebbe4733b6fb97959f23e8acc404e97`
Hosting coordination: GitHub issue #11

## Objective

Migrate AzurSysTech from per-Work-Block SSH-signed authorization to the GitHub capability authority model already accepted in the framework, while preserving Work Block, write-set, Critic, Reviewer, Verifier, and closeout discipline.

After this migration closes, resume `WB-2026-08-12-showcase-production-multizone` under schema v3 without signing/bootstrap authorization.

## Owner decision: retire SSH signing from normal development

The Owner approved retiring SSH signatures, detached `.sig` files, `allowed_signers`, and authorization-bootstrap commits from the normal development path.

Reasons:

1. the H0/H1/H2 signed state machine created circular bootstrap and recovery problems around reversible development operations;
2. replay, expiry, digest, detached-signature, and cross-runtime parity requirements made the control plane disproportionately complex;
3. project-local hooks are mutable by the same project principal and are therefore cooperative guardrails, not the primary security boundary;
4. consequential authority is better constrained by external GitHub, OS, workflow, and credential capabilities;
5. production/VPS/DB/secrets must remain unavailable to the normal agent channel regardless of project-local text state.

Historical signed authorization files may remain as audit evidence. They do not grant current authority and are not trusted by schema v3.

## Baseline preservation

The exact local baseline was published without changing remote `main`:

- H0: `441b134d71f781d2d0fcc48d3a8da86875835a9c`;
- H0 tree: `627ee887f374719992eda93a72fa6531e72ead94`;
- baseline branch: `baseline/azursystech-441b134d`;
- implementation branch: `agent/github-capability-authority-migration`.

The canonical local checkout contains legitimate dirty/staged user work and must not be reset, cleaned, or used as the migration staging area.

The previously signed showcase authorization pair is superseded and must not be reused.

## Target authority model

### Normal scoped development

Inside an approved Work Block and write-set, normal reversible work may include:

- read and edit approved paths;
- tests, builds, linting, local disposable tooling;
- stage approved paths;
- local commit;
- prepare a normal feature branch for publication;
- inspect PR/CI/review state after the Owner publishes the branch.

These operations do not require an Owner private signing key or SSH authorization record.

### Cooperative project guardrails

Project-local hooks continue to enforce:

- schema v3 and `authority_mode: github_capability`;
- Work Block and write-set discipline;
- staged-commit path validation;
- `apply_patch` source and `Move to:` destination validation;
- fail-closed handling of unscopable mutating Bash;
- obvious consequential-operation denial;
- required Critic/Reviewer/Verifier closeout state.

These hooks are defense in depth only.

### External capability boundary

The normal agent channel must not possess authority for:

- production deploy or live service restart;
- VPS/SSH mutation;
- live DB/schema/data mutation;
- credential/token/key/secret creation, rotation, revocation, or exposure;
- destructive filesystem/Git/database operations;
- irreversible external publication;
- real client/user communications or consequential business mutations.

Production secrets remain in GitHub/VPS and are never copied into project files or agent prompts.

Repository source publication uses a separate project policy described below: Owner-controlled push. This is intentionally an operational control on GitHub Free, not a claim of protected-branch enforcement.

## Repository hosting mode — selected: GitHub Free + Owner-controlled push

`azursystech-site` remains **private** on GitHub Free.

The Owner explicitly selected this mode on 2026-08-12 instead of GitHub Pro and rejected a temporary `private -> public -> private` visibility cycle.

Reasoning:

- current project activity does not justify a paid upgrade solely for private-repository branch protection;
- temporary public visibility would disclose the repository and would not provide a durable control after returning to private;
- the Owner prefers to retain direct control over publication while development volume is modest.

### Operating rule

The normal agent workflow stops before remote source publication.

The agent may autonomously:

- edit inside the Work Block write-set;
- test/build/lint;
- stage approved paths;
- create local commits;
- prepare a feature branch;
- prepare PR/CI/review evidence and an Owner handoff.

The agent must **not autonomously execute `git push`** for this repository. Before publication it must hand control to the Owner with:

- branch name;
- exact local HEAD SHA;
- concise changed-file/scope summary;
- deterministic check status;
- exact intended remote ref;
- explicit statement that no production/deploy/DB/VPS action is included.

The Owner then performs or explicitly triggers the bounded feature-branch publication through an Owner-controlled GitHub channel.

Direct `main` push remains forbidden by project policy. Merge is Owner-controlled. Production deployment remains Owner-only and manual.

### Security semantics

On GitHub Free/private, this Owner-controlled-push rule is an **operational governance boundary**, not technical protected-branch enforcement. The repository must not claim otherwise.

If Owner credentials happen to be technically reachable from an agent runtime, their availability does not grant authority to use them for push, merge, workflow dispatch, secrets, deploy, or other consequential mutations. The residual risk of an unprotected private `main` is accepted by the Owner for the current low-volume operating mode.

A future migration to GitHub Pro may replace this operational publication boundary with protected `main` plus least-privilege agent credentials. That is optional future hardening, not a blocker for the current Work Block.

## Canonical AzurSysTech operating process

The project-specific process must be durable and discoverable by every supported agent runtime.

Canonical durable decision/process record:

- `docs/engineering-memory/github-free-owner-controlled-flow.md`

Canonical execution workflow:

- `.agent/workflows/owner-controlled-github-flow.md`

Git skill integration:

- `.agent/skills/git-orchestration-flow/SKILL.md`
- `.claude/skills/git-orchestration-flow/SKILL.md`
- `.opencode/skills/git-orchestration-flow/SKILL.md`

`AGENTS.md` remains the top-level operating contract and must point agents to the Owner-controlled publication semantics. The skill/workflow narrows execution behavior; neither grants authority.

## Implementation scope

Port only project-relevant semantics from framework WB-CORE-003F and complete the AzurSysTech-specific operating process:

- `.agent/active-work-block.default.json` and active state -> schema v3;
- legacy authorization README;
- provider-neutral consequential-operation guard;
- Codex Work Block/write-set hooks, lifecycle, doctor, write-gate docs;
- Claude Work Block and assurance hooks/settings;
- OpenCode Coder permission posture while preserving AzurSysTech-specific instruction and skill paths;
- installation/evaluation validators required by the migrated lifecycle;
- targeted AzurSysTech operating-contract reconciliation so old normal-commit/feature-push signing rules do not contradict schema v3;
- project Work Block/tasklist/review/verification evidence;
- `docs/engineering-memory/github-free-owner-controlled-flow.md`;
- `.agent/workflows/owner-controlled-github-flow.md`;
- `.agent/skills/git-orchestration-flow/SKILL.md`;
- `.claude/skills/git-orchestration-flow/SKILL.md`;
- `.opencode/skills/git-orchestration-flow/SKILL.md`.

Do not copy framework-only roadmap, release-state, or publication artifacts into AzurSysTech.

## Deployment workflow invariant

`.github/workflows/deploy-vps.yml` remains manual-only `workflow_dispatch` and keeps immutable SHA/image binding plus `include_admin=false` default.

This Work Block does not execute deployment, SSH, VPS, DB, Docker publication, credential rotation, or production mutation.

## Acceptance criteria

1. Normal scoped source edit + local commit requires no SSH signing.
2. Out-of-write-set source edit is rejected.
3. A staged commit containing an out-of-write-set path is rejected.
4. `apply_patch Move to:` outside the write-set is rejected.
5. Unknown/complex mutating Bash fails closed when its targets cannot be scoped.
6. Normal read/test/build paths remain usable.
7. AzurSysTech Free mode is documented and enforced as an Owner-controlled publication workflow: the normal agent path stops before `git push`, direct `main` push is forbidden by project policy, and the Owner receives an exact branch/SHA/check handoff.
8. The normal agent path does not autonomously dispatch/rerun/cancel deploy workflows.
9. Production VPS/DB/secrets remain outside normal development authority.
10. Critic/Reviewer/Verifier remain required as configured for closeout.
11. Existing production runtime is untouched.
12. Canonical local dirty/staged user state remains untouched.
13. The Owner-controlled publication decision is durable in engineering memory, represented in an executable workflow, and integrated into the Git orchestration skill for Codex/Claude/OpenCode project surfaces.

## Assurance

Required sequence: Critic -> Reviewer -> Verifier -> closeout.

The final assurance must distinguish technical enforcement from process governance. It may verify the selected GitHub Free Owner-controlled-push operating model, but it must not claim protected-branch enforcement or credential isolation that does not exist.

Residual risk to record explicitly: private `main` remains technically unprotected on the current GitHub Free plan. The Owner accepts that residual risk and retains publication/merge control manually.

## Explicit exclusions

- no showcase implementation in this Work Block;
- no production deploy;
- no SSH/VPS action;
- no DB/data mutation;
- no secret/key/token rotation;
- no destructive cleanup of historical authorization artifacts;
- no direct push to `main`;
- no reset/clean of the canonical local checkout;
- no repository visibility change to public;
- no GitHub Pro upgrade/configuration in this Work Block.

## Success condition

`AZURSYSTECH GITHUB CAPABILITY AUTHORITY MIGRATION VERIFIED`

Then return immediately to the showcase multi-zone Work Block with a fresh schema-v3 local Work Block state.
