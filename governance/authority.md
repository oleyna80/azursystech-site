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

## External Capability Boundary & Private GitHub Free Mode

For repositories hosted on GitHub:
- In the active **AzurSysTech private GitHub Free mode**, normal agent development operates autonomously through local edit, test, stage, and local commit inside the approved Work Block.
- Normal agent flow **stops before any `git push`**, freezes the exact feature-branch HEAD, and generates the canonical **Owner publication handoff**.
- Technical credential presence in the runtime does not grant authority to push.
- The Owner performs or triggers publication of the exact feature branch revision and controls merge to `main`.

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

Hard Stops are consequential operations that the normal agent channel must not perform merely by editing project-local state:
- any remote source publication (`git push`) in the current Owner-controlled Free mode;
- production deployment or live service restart;
- live database mutation or migration apply;
- credential, key, or secret changes;
- destructive version-control/filesystem operations;
- direct push, deletion, or non-fast-forward update of protected/default branches;
- irreversible public/package publish where it changes external state;
- real client-facing communications;
- payment, order, stock, CRM, or other live business-data mutation outside an approved application execution path.
