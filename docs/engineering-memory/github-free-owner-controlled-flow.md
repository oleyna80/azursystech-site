# GitHub Free + Owner-Controlled Publication — AzurSysTech

Status: active project operating decision
Effective date: 2026-08-12
Applies to: `oleyna80/azursystech-site`
Repository mode: private / GitHub Free

## Decision

AzurSysTech remains private on GitHub Free.

The project does not use per-Work-Block SSH signatures for normal development and does not require a GitHub Pro upgrade for the current operating volume.

Remote source publication is Owner-controlled:

- agents may edit, test, stage, and create local commits inside an approved Work Block/write-set;
- agents prepare a normal feature branch locally;
- the normal agent flow stops before `git push`;
- the Owner controls publication of the feature branch to GitHub;
- the Owner controls merge to `main`;
- production deployment, VPS/SSH, live DB/data, secrets, and other consequential operations remain Owner-only.

## Why this model exists

The previous signed authorization model was too complex for reversible development work. It created bootstrap, replay, expiry, digest, H0/H1/H2, and cross-runtime synchronization problems around operations such as ordinary local commits.

The project now separates two concerns:

1. **Engineering process controls** — Work Blocks, write-sets, Critic, Reviewer, Verifier, local hooks, deterministic checks.
2. **Consequential authority** — Owner-controlled publication/merge and Owner-only production/credential/data operations.

This keeps normal development fast while preserving deliberate human control over external side effects.

## Security classification

This GitHub Free/private mode does **not** provide technical protected-branch enforcement for `main`.

Owner-controlled push is an operational governance control. It must never be described as equivalent to a GitHub ruleset or protected branch.

If an Owner credential is technically reachable from an agent runtime, that technical availability does not grant authority to use it. The agent must still stop at the publication handoff.

The Owner explicitly accepts this residual repository risk for the current low-volume operating mode.

Production authority is stricter: production/VPS/DB/secrets/deployment remain outside normal development authority regardless of local repository policy text.

## Standard development-to-publication flow

```text
Owner request
  -> Define Work Block / write-set
  -> Implement locally
  -> Run deterministic checks
  -> Local commit(s)
  -> Freeze exact feature-branch HEAD
  -> Critic / Reviewer / Verifier as required
  -> OWNER PUBLICATION HANDOFF
       branch
       exact HEAD SHA
       changed scope
       check status
       intended remote ref
       no-production statement
  -> Owner publishes feature branch
  -> PR / CI / review
  -> Owner merge decision
  -> main
  -> separate Owner-controlled release/deploy path if needed
```

## Mandatory publication handoff

Before any feature-branch publication, the agent must report:

```text
Repository: oleyna80/azursystech-site
Branch: <feature-branch>
Exact HEAD: <40-char SHA>
Intended remote ref: origin/<feature-branch>
Scope: <concise changed-file/domain summary>
Checks: <PASS/BLOCKED with exact relevant checks>
Assurance: <Critic/Reviewer/Verifier state as applicable>
Production impact: NONE
Requested Owner action: publish this exact feature branch only
```

The handoff is invalid if the SHA is missing, the branch is ambiguous, checks are falsely summarized, or production/deploy/DB/VPS/secrets are bundled into the request.

## Owner actions

The Owner may:

- publish the exact prepared feature branch;
- inspect or request PR creation/update;
- decide whether to merge;
- separately authorize a production workflow after merge when appropriate.

A feature-branch publication approval does not authorize:

- direct `main` push;
- force/non-fast-forward push;
- remote branch deletion;
- tag/release publication;
- workflow dispatch for production;
- VPS/SSH mutation;
- DB/data mutation;
- credential/secret changes.

Each consequential category remains a separate Owner decision.

## Agent rules after Owner publication

After the Owner publishes the feature branch, agents may inspect PR/CI/review state and perform further local remediation inside the active Work Block.

If remediation creates a new local HEAD, the next publication handoff must bind the new exact SHA. Previous publication approval does not automatically cover later commits.

The Owner controls every subsequent push of source changes unless the project operating mode is explicitly changed in a later accepted decision.

## Merge and deployment

Merge remains Owner-controlled.

A green PR does not grant merge authority.

A merge does not grant deploy authority.

Production deploy remains a separate manual Owner-controlled GitHub Actions operation. `deploy-vps.yml` must remain manual-only and retain its immutable image/SHA and safety checks.

## Future migration option

If project activity grows, AzurSysTech may later move to GitHub Pro/private protected `main` with least-privilege agent credentials. That future mode can permit automated feature-branch push while keeping merge/deploy/secrets protected externally.

Until such a decision is explicitly accepted, this document is the project operating rule.

## Related project artifacts

- `AGENTS.md` — top-level operating contract.
- `.agent/workflows/owner-controlled-github-flow.md` — execution workflow.
- `.agent/skills/git-orchestration-flow/SKILL.md` — Git operational guidance.
- `.claude/skills/git-orchestration-flow/SKILL.md` — Claude project-local mirror.
- `.opencode/skills/git-orchestration-flow/SKILL.md` — OpenCode project-local mirror.
- `docs/plans/WB-2026-08-12-github-capability-authority-migration.md` — migration decision and acceptance criteria.
