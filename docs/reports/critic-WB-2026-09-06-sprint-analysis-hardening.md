# Critic Report — WB-2026-09-06-sprint-analysis-hardening

## Verdict

APPROVE

## Scope review

The current-main skill has a heuristic evidence-gap extractor but no current
trailer-first classification. Historical `00cd532d...` is reference only. The
approved write-set is limited to the current sprint-analysis skill, extractor,
local fixtures, lifecycle records, and WB documentation.

## Required design constraints

- Parse trailers with `git interpret-trailers --parse`, not loose whole-message grep.
- Make `trailer`, `legacy`, `missing`, `malformed-trailer`, and
  `multiple-valid-trailers` deterministic and mutually meaningful.
- A valid trailer outranks every heuristic; no arbitrary ID selection.
- Dirty/ahead state is an evidence caveat, not a breach.
- Preserve incomplete evidence as `UNVERIFIED`, `BLOCKED`, or `DEGRADED`.
- Keep shell portability and output bounded; no database or second hook.

No blocker remains for the approved current-main implementation scope. This
approval grants no merge, deployment, framework, external-provider, or
historical-ref authority.
