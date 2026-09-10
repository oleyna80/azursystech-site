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

### Native subagent topology contract

For non-trivial `Managed` and `Assured` Work Blocks, a native capability probe
must be `available` before topology promotion. The required policy is
`native-separate-context-required`: admission binds a distinct native Critic
execution, and successful closeout binds distinct native Critic, Reviewer, and
Verifier executions. Each binding records the Work Block, role, execution and
context identifiers, runtime/adapter/version, source or frozen revision,
repository root, branch, read-only boundary, launch mechanism, topology tier,
probe event, report, status, and observation time.

Capability states `unknown`, `conditional`, `unavailable`, and `launch_failed`
remain explicit degraded/blocked outcomes. They never authorize a main-thread
substitution. Native role separation also does not satisfy
`independent-readonly-root` or `os-isolated`; those stronger root and OS
boundaries remain separately evidenced where required.

## Autonomous Work Block Execution and Private GitHub Mode

This section is the sole canonical authority source for autonomous execution and
Owner escalation at AzurSysTech. Workflows, templates, runtime adapters, and
engineering memory may state operational consequences only and must defer here.

Within one approved, active schema-v3 Work Block, the Orchestrator may complete
Define, planning, implementation, read-only subagent work, corrective loops,
tests, documentation, staging, local commits, Review, and Verification without
routine Owner escalation. Test failures, `CHANGES_REQUIRED`, refactoring, and
other corrective work remain autonomous while the approved requirement, risk,
architecture, authority, and write-set boundaries do not change.

Autonomous remote publication has two distinct subject-candidate paths. An
assured active candidate requires a `READY` write gate, formal Define-quality
evidence where the governance profile requires it, a `READY` Critic, and
`READY` Review and Verification. Its only normal non-force command form pushes
`HEAD` through `origin` to `refs/heads/<subject_branch>`, where the attached
non-default branch exactly matches the active Work Block `subject_branch`.

A final terminal closeout candidate uses that same literal command form, but is
admitted only when committed Git ancestry proves one immediate transition from
that same publication-eligible active parent to a canonical terminal inactive
child. The parent must carry the matching Work Block, exact subject branch,
READY formal Define-quality evidence where the governance profile requires it,
and READY Critic/Review/Verification state. The child must contain
the exact canonical inactive state, the matching `Work-Block:` commit linkage,
and only the minimal lifecycle/closeout coordination allowlist. Inactive state
alone never grants publication authority; arbitrary inactive-state publication
is denied.

For both paths the push must be the sole shell command; it cannot be coupled to
a consequential action, wrapper, or shell command substitution. Runtime
controls fail closed for executable command or process substitutions;
single-quoted literal prose is not an executable substitution. The explicit
command prevents the remote destination from being inferred from mutable
upstream configuration. A successful candidate push is reported to the Owner
for the final `MERGE / REVISION / REJECT` decision; it is not a merge or
deployment authorization. Force/default/protected/tag/release/deletion and
other external hard stops remain Owner-controlled.

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
