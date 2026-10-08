# WB-005 — Holistic Replacement Assurance — Intent

## Objective

Prove that the complete inert SDLC replacement assembled by WB-0 through WB-4 is activatable, deterministic, rollback-safe, and ready for the separate Owner-controlled WB-6 cutover.

WB-005 does not activate the replacement control plane.

## Base

WB-004 closeout tip:

`de129c8c8e924ff9b1b96a49e853a501f2171f1f`

## Required outcomes

WB-005 must produce one exact assured replacement candidate containing:

- missing but inert production invocation bridges required by cutover;
- one deterministic clean-clone/offline replacement-assurance command;
- a baseline-pinned semantic old-vs-new enforcement comparison corpus;
- an exact inert WB-6 cutover patch;
- a machine-readable cutover manifest;
- a disposable real-entrypoint cutover/rollback rehearsal;
- a cutover checklist;
- deterministic provenance artifacts suitable for post-candidate binding.

The source candidate must receive holistic Critic, Reviewer and Verifier assurance.

## Hard boundary

WB-005 must not modify or activate live:

- Claude hook configuration;
- Codex hook configuration;
- installed Git hook wiring;
- `scripts/bootstrap.sh`;
- GitHub Actions workflows;
- default-branch/merge/deployment authority;
- production credentials or infrastructure.

Those changes exist only as inert cutover payload bytes during WB-005 and are applied only by WB-006.

## Threat model

Git-common-dir installation configuration is a trusted Owner/bootstrap boundary under the cooperative same-user agent model.

It is not claimed to resist an arbitrary malicious local process already holding unrestricted filesystem access under the same OS identity.

Consequential security boundaries remain external OS/runtime controls, credentials, GitHub permissions, protected branches/environments, and Owner-controlled channels.
