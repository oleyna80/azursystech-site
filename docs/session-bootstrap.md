# Session Bootstrap

Use this guide at the start of a new session or before a non-trivial Work Block.

## Goal

Load enough current context to act safely without reading the entire repository,
loading every skill/runtime document, or relying on stale memory.

## Installed Controller v1 Authority Check

Resolve the installation's Git common directory and trusted config
`<Git common dir>/azursystech/installation.json`. The config pins repository
identity, external registry and trusted origin/provider facts; payload, environment
or subject-tree values cannot override them. Resolve exact active admission for
this repository/branch and read per-worktree schema-v2 state via
`git rev-parse --path-format=absolute --git-path azursystech/active-work-block.json`.
Linked worktrees share installation identity but have distinct controller state.

Missing/corrupt private state is not INACTIVE and fails closed for operations
requiring state. Admitted pre-WB planning follows the existing path without
fabricated state. Tracked `.agent/active-work-block.json` schema-v3/default state
and historical write-gate/topology records neither grant nor deny authority.
Status/restart reads do not mutate lifecycle. Controller v1 binding, not a log
or template, decides current eligibility under the pinned human-governed profile.

## Progressive Read Strategy

### Always Read for Non-Trivial Work

1. `AGENTS.md`.
2. `.agent/bootstrap-profile.json` when runtime/tool availability matters.
3. The current task request, trusted active admission and Git-private Controller v1 state.
4. The active approved specification and revision.
5. Relevant accepted architecture decisions.
6. The approved evaluation plan when evaluation is required.
7. Current repository state: branch, commit, status, and relevant diff.

`.agent/bootstrap-profile.json` is generated installation evidence. It tells you
which runtime implementation surfaces, evaluation contracts, and skills were
installed. It does not grant Work Block authority, integration admission,
credentials, evaluation approval, or side-effect permission.

### Read Conditionally

- `governance/*` when authority, lifecycle, artifact, evaluation, risk, or capability rules are relevant.
- `.agent/workflows/sdd-protocol.md` for v1 precedence and expressly historical procedure; legacy stages/gates do not override the controller.
- `.agent/ROSTER.md` for logical roles, skill routing, and isolation.
- the active adapter under `runtimes/`.
- runtime-specific policy only when the installation profile contains that surface and the Work Block uses it.
- `docs/evals/` and `docs/reports/evaluations/` only when bound to the active Work Block.
- relevant skills after trigger matching and profile availability checks.
- relevant durable engineering memory and operational logs.
- `PROJECT_MAP.md` and `FILE_REGISTRY.yml` for structural impact.

Do not load all registries, memories, skills, runtime docs, or evaluation logs by
default. Do not treat a deliberately unselected runtime surface as corruption.

## Required Preflight Questions

Before implementation, answer briefly:

- What exact final result must be delivered?
- What installation profile is recorded, and which runtime surfaces are present?
- What governance profile is active?
- What specification/revision and architecture decisions govern the work?
- Does the selected profile require requirements-quality review, REQ/AC/TASK
  traceability, and a pre-execution consistency analysis?
- What is in and out of scope; what paths are in the write-set?
- Are there unrelated dirty or untracked files?
- What side effects, data modes, sensitive domains, and Hard Stops apply?
- What runtime, adapter, capabilities, and actual isolation are available?
- Which logical functions are required: Architect, Critic, Coder, Reviewer,
  Verifier, Evaluator specialization, Drift Auditor?
- Is evaluation required; what plan/rubric/benchmark revisions and observable event sources apply?
- What review, verification, evaluation, and drift evidence is required?
- Do navigation, registry, specification, architecture, or documentation files need updates?

## Authority and Conflict Rules

For product and delivery intent:

1. current Owner instruction or approved change request;
2. approved specification;
3. accepted architecture decisions and external contracts;
4. approved implementation and evaluation plans;
5. active tasklist;
6. review, verification, evaluation, drift, and closeout evidence;
7. durable engineering memory;
8. runtime policy, operational logs, generated and external artifacts.

For agent behavior and permission:

1. current Owner instruction;
2. `AGENTS.md`;
3. `governance/`;
4. trusted external active admission, Git-private schema-v2 state and approved scope/write-set;
5. applicable v1 precedence in `.agent/workflows/sdd-protocol.md`;
6. active runtime/integration adapter;
7. operational logs and generated artifacts.

Plans, scores, judge output, or runtime capability must not silently override an
approved specification or expand authority.

## Define-Quality Preflight

For formal Managed, Assured, and Distributed Work Blocks, read
`governance/define-quality.md` and record the requirements-review, traceability,
and consistency evidence before resolving the Critic gate. Controlled work selects
these checks by risk; Quick Fix and eligible NDR must not create artificial IDs.
These historical quality-profile names describe selected checks, not current
admission or higher autonomy. The records are evidence only; Controller v1 Critic READY binds committed
planning in DEFINE and atomically permits EXECUTE. They do not create admission.

## Evaluation Preflight

When evaluation is required, record:

- evaluation ID, approved plan path/revision, and frozen subject revision;
- deterministic checks and expected evidence;
- output criteria, thresholds, weights, and evaluator types;
- required/prohibited observable trajectory events and event sources;
- rubric, benchmark/dataset, and judge-policy revisions;
- actual runtime/model class/isolation boundary;
- blocking criteria and aggregate verdict rule.

Trajectory evidence contains observable tool, gate, check, retry, side-effect,
stopping, and artifact events only. Never request or store private
chain-of-thought, hidden reasoning, model scratchpads, secrets, or unredacted
protected payloads.

Unavailable checks or event sources are `BLOCKED`, `UNVERIFIED`, or `not_run`,
never `pass`.

## Installation and Runtime Capability Check

Read `.agent/bootstrap-profile.json` and record:

- requested/resolved profile and selected components;
- installed runtime guidance and selected skills;
- expected absent runtime surfaces;
- generated profile validator result.

Then separately record for the runtime used:

- capability available, unavailable, or unknown;
- version/config/auth/smoke evidence;
- actual isolation and observable-event capability;
- fallback and residual limitation;
- whether degraded execution requires later independent evidence.

Static conformance does not prove a live runtime or OS isolation.

## Repository Preflight

```text
Branch:
Commit:
Status:
Unrelated dirty files:
Untracked artifacts:
Installation profile:
Installed runtime surfaces:
Active specification and revision:
Architecture baseline:
Trusted installation common dir/config:
External registry / exact active admission:
Git-private state path / schema-v2 lifecycle:
Active Work Block:
Approved implementation/evaluation plans:
Approved write-set:
Next gate:
```

Inspect relevant uncommitted diffs before planning edits. Never stage or overwrite
unrelated changes silently.

## Portable, Operational, and Evidence State

- current repository source and approved artifacts outrank memory;
- `.agent/bootstrap-profile.json` is installation evidence; tracked
  `.agent/active-work-block.default.json` is legacy portable data, not runtime authority;
- blocked default evaluation is optional, PENDING, unbound, and grants no authority;
- mutable runtime session logs and local scratch files are not durable authority.
