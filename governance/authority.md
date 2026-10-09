# Authority Model

## Purpose

Authority is structural. A runtime, model, plugin, tool, shell capability, or
project-local hook does not authorize an action by itself.

Every action must be permitted by all applicable dimensions:

1. logical role;
2. approved Work Block scope;
3. write set;
4. side-effect class;
5. external capability boundary when the action is consequential;
6. runtime capability and isolation level.

The framework deliberately separates **process guardrails** from **security
boundaries**. Work Blocks, write sets, Critic/Reviewer/Verifier roles, and local
hooks constrain normal agent behavior. GitHub repository rules, least-privilege
credentials, OS isolation, and secret ownership constrain what the agent can
actually do outside that cooperative process.

Deterministic control placement follows `governance/enforcement.md`. The
governance contract defines required invariants; Git hooks, shared validators,
runtime-specific hook adapters, and external platform controls implement those
invariants at the narrowest reliable boundary. An implementation mechanism
never expands authority merely because it can technically perform an action.

The default autonomous boundary is reversible engineering work on the approved
subject branch. Merge, deployment, release, and other consequential external
actions remain separate Owner-authority decisions. Authorization of one does
not imply authorization of another.

## Installed Controller v1 Authority

Controller v1 is the installed runtime authority. Trusted configuration lives at
`<Git common dir>/azursystech/installation.json` and resolves an external registry.
Active admission is required for current authority; immutable admission history
is not reactivated. Repository, branch, base and authority-profile bindings are
immutable. The installed profile is human-governed; no role or document expands it.

Controller state is schema v2, per worktree, under Git-private metadata resolved
by `git rev-parse --path-format=absolute --git-path azursystech/active-work-block.json`.
Missing/corrupt state is not INACTIVE. Pre-WB planning uses the trusted admitted
path. Tracked schema-v3 `.agent/active-work-block.json`, historical gate records,
and legacy lifecycle/topology procedures neither grant nor deny current authority.
Where those documents conflict, this installed v1 contract takes precedence.

## Stable Logical Roles

| Role | Core responsibility | Default write authority |
|---|---|---|
| Owner | Approves objectives, exceptions, consequential external actions, and final business acceptance | Owner-controlled external capability surfaces |
| Orchestrator | Frames Work Blocks, selects topology, controls stage transitions, consolidates evidence, closes work | Governance and coordination artifacts inside scope |
| Architect | Produces architecture, discovery, specification, and plan proposals | Draft architecture/specification artifacts when approved |
| Critic | Challenges scope, assumptions, risks, topology, and verification before execution | Critic report only |
| Coder | Implements the approved change | Approved implementation write set only |
| Reviewer | Reviews the frozen diff for defects, regressions, security, architecture, and maintainability | Review report only |
| Verifier | Gathers evidence against acceptance criteria and contracts | Verification evidence only |

Roles describe authority and accountability, not mandatory separate processes.
One runtime may execute multiple roles when the selected governance profile
permits it. Higher-risk profiles require stronger separation.

## Separate Dimensions

Do not encode runtime or model names as authority-bearing roles.

```yaml
function: code_review
role: reviewer
runtime: claude-code
model_class: balanced_engineering
isolation: separate_session
authority: read_only
```

The same contract may be implemented by another runtime without changing its
authority:

```yaml
function: code_review
role: reviewer
runtime: codex
model_class: strong_reasoning
isolation: separate_subagent
authority: read_only
```

## Isolation Levels & Project Mapping

| Level | Meaning | Typical use |
|---|---|---|
| `same_context` | Same active agent/context performs another function | Advisory or low-risk work only |
| `separate_subagent` | Separate delegated context in the same runtime/session | Read-heavy discovery, criticism, review |
| `separate_session` | Independent top-level session against the same repository state | Independent review or verification |
| `separate_worktree` | Independent branch/worktree and write scope | Parallel bounded implementation |
| `separate_runtime` | Different agent runtime or model family | Adversarial second opinion |
| `os_isolated` | Separate OS user, container, or equivalent security boundary | Credentials, live data, deploy, sensitive verification |

### AzurSysTech Operating Isolation Tiers

AzurSysTech maps declared runtime isolation to assurance tiers:
- `same_context` and `separate_subagent` map to `same-session-degraded` (advisory only for sensitive work) unless a separate top-level read-only root is verified;
- `separate_session` satisfies `independent-readonly-root` only when that root and its access boundary are evidenced;
- `os_isolated` maps to `os-isolated` (required for credentials, live DB, live infra, and production deployment).

A declared isolation level is evidence, not self-authenticating proof.

### Independent assurance and admission

The approved Work Block determines required independent contexts and isolation.
Record actual runtime capability and access boundaries honestly; capability or
native-topology labels do not create admission. Same-context advisory output
cannot replace required independent Critic, Reviewer or Verifier evidence.
Critic READY binds the committed planning revision in DEFINE; Reviewer and
Verifier bind the exact clean committed source candidate in ASSURE. Stronger
filesystem or OS isolation remains separately evidenced where required.

## Autonomous Work Block Execution and Private GitHub Mode

This section is the sole canonical authority source for autonomous execution and
Owner escalation at AzurSysTech. Workflows, templates, runtime adapters, and
engineering memory may state operational consequences only and must defer here.

Within one approved Work Block with trusted active external admission, the
Orchestrator performs planning, scoped implementation, read-only assurance,
corrective loops, tests, approved documentation, staging and local commits
without routine Owner escalation. Controller v1 state and immutable bindings
remain prerequisites. Material requirement, risk, architecture, authority or
scope changes require Owner control and return to DEFINE; implementation rework
returns ASSURE to EXECUTE and requires a new exact candidate.

The schema-v2 lifecycle is INACTIVE, DEFINE, EXECUTE and ASSURE. Trusted open
binds committed planning in DEFINE; Critic READY atomically moves to EXECUTE.
Candidate admission requires a clean exact committed SHA. Reviewer and Verifier
READY must bind that same source_candidate_sha. Missing state is not INACTIVE.

Normal success uses trusted publish, not `close --success` or legacy terminal
closeout publication. Publish permits only the exact non-force subject ref
through trusted origin with Git-derived remote/default facts and a trusted
branch-protection resolver. Unknown protection fails closed; default/protected
branches are denied. Post-candidate source/planning changes, deletions, renames
and merges are denied; only permitted linear coordination changes may form a
later published tip. The actual Git index/history supplies path authority.

Remote exact-tip verification precedes immutable publication provenance while
state remains ASSURE. Only successful verified publication reaches INACTIVE;
failed publication preserves ASSURE. Recorder failure after push is reconciled
against the existing exact remote tip, not treated as a conflicting new source
publication. Terminal historical replay is read-only and never recreates active
admission or changes another worktree/controller.

Report source candidate and exact verified published tip to the Owner for
`MERGE / REVISION / REJECT`. Subject publication is not merge, deployment or
higher-autonomy authorization. Force/default/protected/tag/release/deletion and
other consequential actions remain separately Owner-controlled.

Technical credential presence, a runtime permission prompt, and project-local
state alone do not create authority. They may enable the narrowly authorized
operation only when every condition above and the external repository boundary
also permit it.

Default/protected-branch and production authority are enforced outside mutable project state.
Project-local text files, hooks, signatures, or approval state are cooperative guardrails and not an independent security boundary.

## Non-Expansion Rule

Temporary specialization narrows focus but never expands authority:
- `Reviewer / Security Analyst` remains read-only.
- `Coder / Backend Specialist` may write only the approved backend write set.
- `Verifier / Browser QA` may create only approved evidence artifacts.
- Access to GitHub, shell, Docker, database, browser, MCP, or provider APIs does
  not grant permission to use them for consequential side effects.

## Parallelism

- Parallel read-only roles may inspect the same frozen source state.
- Parallel write roles require non-overlapping write sets and separate
  worktrees/branches.
- Use exactly one Coder for each write set.
- The Orchestrator must consolidate conflicts before verification or closeout.

## Failure and Degraded Assurance

If the required role or isolation level is unavailable:
1. do not silently omit the function;
2. select the narrowest documented fallback;
3. label the result as degraded;
4. record what could not be independently established;
5. keep downstream promotion blocked when the selected governance profile requires stronger assurance.

## Hard Stops

Hard Stops are consequential operations that the normal agent channel must not
perform merely by editing project-local state. The exact assured subject-branch
publication described above is the sole exception for ordinary source push:
- production deployment or live service restart;
- live database mutation or migration apply;
- credential, key, or secret changes;
- destructive version-control/filesystem operations;
- direct/default/protected branch push, remote branch deletion, or any
  force/non-fast-forward/broad/mirror/prune update;
- tags, releases, or other irreversible publication;
- merge or direct protected/default-branch mutation;
- irreversible public/package publish where it changes external state;
- real client-facing communications;
- payment, order, stock, CRM, or other live business-data mutation outside an approved application execution path.
