# Critic Report — WB-2026-07-15-cleanup-design-routing

## Mission

Review the frozen residual Design Analyst routing pilot for role authority,
runtime parity, Design Brief handoff, historical-scope accuracy, and workflow
scope containment. The Reviewer had no file-change permission.

## Verdict

**SUPPLEMENT**

The canonical skill requires a Design Brief using
`docs/templates/design-brief-template.md`, but neither runtime agent definition
explicitly requires that template. OpenCode also does not name the canonical
`design-direction` skill. Without the explicit references, the two runtimes
can diverge at handoff.

## Required narrow correction

Only these already-approved paths may change:

- `.claude/agents/design-analyst.md`
- `.opencode/agents/design-analyst.md`

Both must explicitly require the canonical `design-direction` skill and
`docs/templates/design-brief-template.md` when producing a Design Brief.

## Response

One Scoped Coder changed only the two required runtime agent definitions. Both
now require the canonical skill and template and state that a Brief does not
approve scope. This frozen correction is submitted for Critic re-review.

## Re-review verdict

**APPROVE**

The Claude and OpenCode definitions now explicitly require canonical
`design-direction` and `docs/templates/design-brief-template.md`. Both retain
the read-only and scope constraints, and their fidelity, limited skill stack,
design dials, visual system, and QA requirements align with the canonical
skill.

## Formal-verifier remediation

The independent readonly verifier then found a template-only mismatch. The
same Scoped Coder changed only `docs/templates/design-brief-template.md`: it
now has one `Motion/source-tool skill` field and all three dials use a 1–10
scale. This frozen remediation awaits Critic re-review.

## Remediation re-review verdict

**APPROVE**

The template's combined selector and three 1–10 dials match the canonical
contract. Both runtime definitions still require the canonical skill and
template while preserving read-only and scope authority.

## Accepted evidence

- Read-only authority, the stage/commit/push prohibitions, and Coder handoff
  are otherwise aligned across the skill and both agent definitions.
- `docs/templates/design-brief-template.md` covers fidelity, skill stack,
  collision guard, design dials, route inventory, visual QA, and Coder handoff.
- The active child plan limits the residual payload to five paths; its historic
  plan lists clean historical paths only as previous pilot evidence.
- `git diff --check`, `scripts/secret-scan.sh tracked`, and
  `bash scripts/bootstrap.sh --check` passed.

## Boundary

No application, hook, config, `.agents/**`, staging, commit, push, deletion,
credential, DB, deploy, or client-facing action is authorized.
