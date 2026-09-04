# WB-2026-08-08 — Deployment Documentation Audit

## Stage 0 — Routing Preflight

- **Work Block type:** deployment-contract remediation after Owner-approved audit findings.
- **Side-effect class:** local workflow/runtime-script and documentation write; no live-infrastructure side effect.
- **DB action mode:** none; historical PostgreSQL consolidation is out of scope and must not run.
- **Hard Stops:** production deploy, Docker Publish/workflow dispatch, SSH/VPS mutation, database migration, destructive operations, commit, and push are all out of scope and unapproved.
- **Skill Routing:** checked=deploy-operations,current-work-block-gates,git-safety,critic-review,scoped-coder,reviewer,verifier; matched=deploy-operations,current-work-block-gates,critic-review,scoped-coder,reviewer,verifier; used=deploy-operations,current-work-block-gates,critic-review; skipped=git-safety because no commit/push is authorized; all other categories are not relevant.
- **Subagent Topology:** Subagent-Required (deployment/runtime/workflow/docs domains and independent verification); Stage 0.5 read-only Critic dispatched. Stage 1 requires exactly one write-capable Scoped Coder only after the signed source gate is READY; Reviewer and Verifier remain read-only.
- **Owner-approved intended write-set:** `.github/workflows/docker-publish.yml`; `deploy.sh`; `deploy-admin.sh`; `CLAUDE.md`; `README.md`; `.agent/skills/deploy-operations/SKILL.md`; `.claude/skills/deploy-operations/SKILL.md`; `.opencode/skills/deploy-operations/SKILL.md`.
- **Implementation constraints:** set `publish_admin` default to false; update `deploy.sh` header only; retain `deploy-admin.sh` outside canonical path and remove only its `/tmp` rendered-compose output; do not change its remaining deployment semantics; synchronize three skill mirrors byte-for-byte.
- **Write gate:** BLOCKED. Owner supplied scope approval, but `.agent/active-work-block.json` requires a committed, signed authorization record and a READY gate before any source or skill write. Coordination records and read-only review may proceed; no hand-edited gate bypass is permitted.

## Objective

Implement the Owner-approved narrow remediation for the audited deployment contract. Do not run deployment, Docker Publish, VPS/SSH operations, migrations, cleanup, commit, push, or pull request operations.

## Baseline

- Branch: `main`
- HEAD and `origin/main`: `c129fad3d79f30f62edf164a83ef243521b8ad00`
- Acknowledged dirty candidate documentation: the three deploy skill copies listed in the candidate write-set. They are untrusted and must not be discarded, reset, stashed, or presumed correct.
