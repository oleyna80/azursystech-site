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
- normal feature-branch push when the external credential permits it;
- PR creation/update and CI/review inspection.

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

- direct default/protected branch mutation;
- force/non-fast-forward/broad/prune/mirror/remote-delete pushes;
- production deploy or live service restart;
- VPS/SSH mutation;
- live DB/schema/data mutation;
- credential/token/key/secret access or changes beyond explicitly safe reads;
- destructive filesystem/Git/database operations;
- irreversible external publication;
- real client/user communications or consequential business mutations.

Production secrets remain in GitHub/VPS and are never copied into project files or agent prompts.

## Repository hosting mode

`azursystech-site` is private. On the current GitHub Free plan, protected-branch/ruleset enforcement is unavailable for this repository.

Until GitHub Pro protection is enabled, the project uses the **Free fallback**:

- no standalone agent credential with repository Contents write;
- local edit/test/commit may be autonomous;
- feature-branch publication is performed through an Owner-controlled GitHub channel;
- deploy remains Owner-only.

Preferred final mode after GitHub Pro is enabled:

- protect `main`;
- require PR and relevant CI checks;
- deny force push/deletion;
- agent fine-grained credential: Contents RW, Pull Requests RW, Actions READ only, no administration/secrets/environment permission;
- verify negative tests: direct main update denied and workflow dispatch/rerun/cancel denied.

A local hook must never be represented as equivalent to protected-branch enforcement.

## Implementation scope

Port only project-relevant semantics from framework WB-CORE-003F:

- `.agent/active-work-block.default.json` and active state → schema v3;
- legacy authorization README;
- provider-neutral consequential-operation guard;
- Codex Work Block/write-set hooks, lifecycle, doctor, write-gate docs;
- Claude Work Block and assurance hooks/settings;
- OpenCode Coder permission posture while preserving AzurSysTech-specific instruction and skill paths;
- installation/evaluation validators required by the migrated lifecycle;
- targeted AzurSysTech operating-contract reconciliation so old normal-commit/feature-push signing rules do not contradict schema v3;
- project Work Block/tasklist/review/verification evidence.

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
7. Direct default-branch mutation is externally unavailable: protected by GitHub Pro when enabled, otherwise no agent Contents-write credential exists.
8. Agent credential cannot dispatch/rerun/cancel deploy workflows in preferred mode; Free fallback grants no such credential capability.
9. Production VPS/DB/secrets remain unavailable to the normal agent channel.
10. Critic/Reviewer/Verifier remain required as configured for closeout.
11. Existing production runtime is untouched.
12. Canonical local dirty/staged user state remains untouched.

## Assurance

Required sequence: Critic → Reviewer → Verifier → closeout.

No READY verdict may claim GitHub protected-branch enforcement until it exists. If GitHub Pro has not been enabled, verification must explicitly record Free fallback and the absence of an agent Contents-write credential.

## Explicit exclusions

- no showcase implementation in this Work Block;
- no production deploy;
- no SSH/VPS action;
- no DB/data mutation;
- no secret/key/token rotation;
- no destructive cleanup of historical authorization artifacts;
- no direct push to `main`;
- no reset/clean of the canonical local checkout.

## Success condition

`AZURSYSTECH GITHUB CAPABILITY AUTHORITY MIGRATION VERIFIED`

Then return immediately to the showcase multi-zone Work Block with a fresh schema-v3 local Work Block state.
