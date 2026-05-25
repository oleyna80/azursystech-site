# Work Block Template

## Stage

## Objective

## Role

## Expected result

## Execution mode

- End-to-end autonomous / staged with Owner checkpoints / discussion only
- Continue through approved stages without Owner confirmation unless a Stop condition occurs.

## Skill routing

- Skills checked:
- Skills matched:
- Skills used:
- Skills skipped and why:
- Project-local skill fallback used: yes / no / not needed

## Subagent authorization

- Native subagents authorized when the Orchestrator determines they improve speed, quality, or context hygiene.
- Use one write-capable Coder per approved write-set; keep Reviewer/Verifier subagents read-only unless explicitly approved.
- Native subagents must not launch nested external AI CLI tools for a second verdict.
- External AI audit runner: not authorized / authorized as separate Control Tower assignment with task file, timeout, and fallback.

## Execution topology

- Control Tower only / Control Tower + read-only subagents / Control Tower + one Coder subagent
- Context sharing: scoped prompt / full-history fork only if required
- Subagent assignments:

## Scope

## Out of scope

## Approved write-set

## Dirty baseline

## Acceptance criteria

## Verification tier

## Required checks

## External review inputs

- External reports/prompts:
- Triage rule: external reviewer output is evidence, not acceptance.
- Local verification required before accepting any finding:

## Stop conditions

## Rollback notes

## SSOT updates

- Local-only/ignored SSOT paths:
- Direct evidence markers to verify with `rg -n`:
- `git check-ignore -v` result required: yes / no
