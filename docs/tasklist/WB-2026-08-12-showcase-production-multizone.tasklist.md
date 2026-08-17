# WB-2026-08-12-showcase-production-multizone.tasklist

## In Progress

| ID | Task | AC | Owner | Status |
|---|---|---|---|---|
| S0-01 | Reconcile legacy Work Block to schema v3 and capture pre-implementation evidence. | Plan records scope, no-basePath design, risks, verification, and Hard Stops. | Orchestrator | completed |
| S0-02 | Run initial independent Critic against the original Stage 0 plan. | Critic explicitly challenges all 16 Owner-listed dimensions. | Critic | completed — APPROVE; superseded for source-gate reopening by S0-03 |
| S0-03 | Reconcile the Critic’s verification-contract supplement and run a fresh independent Critic. | Local Docker is optional; PR CI mandates Dockerfile build, Showcase container start, and `GET /demo/health == 200`; fresh Critic returns `APPROVE`. | Orchestrator / Critic | completed — APPROVE |

## Ready

| ID | Task | AC | Priority | Blocked By |
|---|---|---|---|---|
| S1-01 | Reopen the preserved exact source write-set after S0-03 Critic `APPROVE`. | Active state schema v3 / GitHub capability / READY / non-empty preserved source write-set / fresh Critic approve. | P0 | completed — READY |
| S1-02 | Correct the retained candidate: standalone Webpack build and authoritative PR-CI Docker verification. | Local and PR-CI acceptance criteria in the reconciled plan. | P1 | completed — fresh Reviewer/Verifier READY; exact-head CI #132 and Showcase Docker runtime SUCCESS |

## Completed

| ID | Task | Verdict | Date |
|---|---|---|---|
| S1-01 (prior) | Earlier source gate opening for the retained candidate. | Superseded by verification-contract reconciliation | 2026-08-13 |
| S1-02 (prior) | Earlier source implementation/review evidence. | Revalidation required after reconciliation | 2026-08-13 |
| S1-02 | Webpack build and PR-CI Docker health correction. | Fresh source/config assurance passed; exact-head CI #132, Control Plane Contracts, and Showcase Docker runtime passed | 2026-08-17 |

## Blocked

| ID | Task | Verification Verdict | Blocker / Missing Evidence | Corrective Action |
|---|---|---|---|---|
| S1-02 (prior) | Earlier full-tier local verification and local commit | Superseded | The earlier contract incorrectly treated unavailable local Docker runtime proof as a local-commit blocker. | Reconcile the verification model, implement mandatory PR-CI Docker/runtime proof, then rerun assurance. |
