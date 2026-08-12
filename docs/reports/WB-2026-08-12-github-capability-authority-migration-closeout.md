# Closeout — WB-2026-08-12 GitHub Capability Authority Migration

Status: ASSURANCE COMPLETE — OWNER MERGE PENDING
Date: 2026-08-12
PR: #12
Issue: #11
Implementation assurance head: `60def93d9ca18e0326861406f229b6fe6e587ba3`

## Result

AzurSysTech has migrated its proposed repository control plane from per-Work-Block SSH-signed authorization to schema v3 `authority_mode: github_capability` with the project-specific **GitHub Free + private repository + Owner-controlled publication/merge** operating mode.

Normal scoped local development no longer requires SSH signing. Work Block/write-set/Critic/Reviewer/Verifier discipline remains active. Remote source publication is not part of the normal agent path in the selected Free mode: every `git push` is stopped by project policy/guardrail and routed to the exact-SHA Owner publication handoff.

This mode is intentionally described as operational governance, not technical GitHub protected-branch enforcement. The Owner accepts the residual risk that private `main` remains technically unprotected on GitHub Free.

## Assurance evidence

Frozen implementation head: `60def93d9ca18e0326861406f229b6fe6e587ba3`.

- Critic rerun: **APPROVE** — PR #12 comment `5273172490`.
- Reviewer: **READY** — PR #12 comment `5273211102`.
- Verifier: **READY** — PR #12 comment `5273216221`.
- `Control Plane Contracts` run 31: **success**.
- CI run 125: **success**.
- CI quality jobs for web, admin, and showcase: **success**.
- PR review threads: none unresolved at assurance time.

The earlier Critic `RECONSIDER` on head `0275227a5d56760d73c191dcf187771c3177de5d` is retained as evidence of the correction cycle. Its C1-C3 blockers were resolved before the final Critic/Reviewer/Verifier sequence.

## Verified acceptance

1. Normal scoped source work and local commit require no SSH authorization/signature.
2. Source writes remain constrained to the Work Block write-set.
3. Staged commits containing out-of-scope paths are rejected.
4. `apply_patch Move to:` destinations are checked and out-of-scope moves are rejected.
5. Complex/unknown mutating Bash fails closed when targets cannot be safely scoped.
6. Normal read/test/build paths remain usable.
7. In the selected private/GitHub Free mode, all `git push` operations are denied in the normal agent path and routed to Owner-controlled publication.
8. OpenCode uses `git push* = deny`, not a permission prompt that can cross the boundary.
9. Consequential GitHub workflow/merge/release/secret mutations remain denied by the normal-agent Hard Stop fixtures.
10. Production/VPS/DB/secrets remain outside normal development authority.
11. Critic/Reviewer/Verifier remain mandatory for successful closeout as configured.
12. This Work Block performed no production deploy, VPS/SSH action, live DB/data mutation, or credential rotation.
13. Durable AzurSysTech documentation distinguishes the Owner-controlled process from technical protected-branch enforcement.

## Durable operating process

Canonical project-specific records:

- `AGENTS.md` — top-level operating contract.
- `docs/engineering-memory/github-free-owner-controlled-flow.md` — durable project decision.
- `.agent/workflows/owner-controlled-github-flow.md` — execution workflow.
- `.agent/skills/git-orchestration-flow/SKILL.md` plus Claude/OpenCode mirrors — runtime Git guidance.
- `.codex/write-gate.md` — Codex-local scope/Owner publication semantics.

The required Owner publication handoff binds repository, feature branch, exact 40-character HEAD SHA, intended remote ref, scope, checks, assurance state, and `Production impact: NONE`.

## Production and data safety

No production mutation is part of this migration closeout.

`deploy-vps.yml` remains manual `workflow_dispatch`, keeps `include_admin=false` by default, and validates an immutable `sha-<40>` image tag against the workflow commit SHA. Docker Publish does not deploy production and its admin publication default is false.

No database migration is run by this Work Block. Historical signed authorization records may remain as legacy audit evidence and are not current authority.

## Residual risks / follow-up

Accepted residual risk:

- private `main` has no technical protected-branch enforcement on GitHub Free; Owner-controlled publication/merge is the selected operational control for the current project volume.

Non-blocking maintenance note:

- `.codex/scripts/lifecycle.py` uses the default isolation label `same_context`, while `AGENTS.md` names the comparable tier `same-session-degraded`. Normalize this terminology in a future control-plane maintenance pass; it does not change current authority or acceptance behavior.

## Closeout state

The implementation/assurance portion of this Work Block is complete. Remaining external step: **Owner merge of PR #12** after the coordination-only closeout head passes deterministic checks.

Do not infer deploy authorization from merge. Production deployment remains a separate Owner-controlled operation.

After merge, close Issue #11 and resume `WB-2026-08-12-showcase-production-multizone` under schema v3 without SSH authorization/bootstrap signing.

Success candidate:

`AZURSYSTECH GITHUB CAPABILITY AUTHORITY MIGRATION VERIFIED`
