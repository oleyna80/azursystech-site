# Verification Report — WB-2026-07-15-cleanup-design-routing

## Native Verifier result

**UNVERIFIED for formal closeout; payload checks PASS.**

The native same-session Verifier confirmed that the active 14-path gate
contains all five payload paths and only lifecycle evidence paths. It confirmed
both runtime agents explicitly require canonical `design-direction` and
`docs/templates/design-brief-template.md`, retain read-only/no-side-effect
authority, and state that a Design Brief does not approve scope. The canonical
skill, template, and historic pilot plan are mutually consistent.

## Checks passed

- `git diff --check`
- `bash scripts/bootstrap.sh --check`
- `scripts/secret-scan.sh tracked`
- targeted secret-like scan of the payload
- no-index whitespace checks for untracked payload files

## Formal gate condition

`same-session-degraded` native verification is advisory only under the active
isolation policy. The frozen diff therefore requires a Control-Tower-launched
independent-readonly-root review before this report can record `READY`.

## Formal readonly result

**BLOCKED**

The independent root found one contract conflict in
`docs/templates/design-brief-template.md`: it separates `Motion skill` and
`Source/tool skill` while the canonical skill and runtime definitions allow one
combined motion/source-tool skill. It also makes `MOTION_INTENSITY` and
`VISUAL_DENSITY` categorical while the canonical skill defines all three dials
on a 1–10 scale. All other containment, authority, runtime-reference, and
hygiene checks passed.

## Formal remediation closeout

**READY**

After the one-template remediation and Critic re-review, a separate top-level
readonly root returned `FORMAL_VERDICT: READY`. It confirmed both runtime
definitions require the canonical skill/template, retain no-side-effect and
scope authority, the skill/template/pilot plan align on the bounded stack and
1–10 dials, all five payload paths are in the active write-set, and diff
hygiene passes.
