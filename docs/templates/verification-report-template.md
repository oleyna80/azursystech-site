# Verification Report Template

## Verification Report — [Work Block ID]

- **Date:** [YYYY-MM-DD]
- **Tier:** [lite | standard | full]
- **Sensitive Domains:** [none | auth,payments,db-schema,middleware,hooks,runtime-config,deploy,credentials,live-data,external-provider]
- **Required Verifier Isolation:** [same-session-degraded | independent-readonly-root | os-isolated]
- **Actual Verifier Isolation:** [same-session-degraded | independent-readonly-root | os-isolated]
- **Isolation Evidence and Residual Limits:** [launch mechanism, frozen diff reference, and boundaries not established]
- **Verifier Verdict (evidence; Controller binding separate):** [READY | BLOCKED | UNVERIFIED]
- **Exact Committed Source Candidate SHA:** [40-character SHA]
- **Trusted Controller v1 Verifier Binding:** [matching admission/candidate/evidence reference | not yet bound]
- **GPT Verifier:** [NOT_REQUIRED | READY | DEGRADED]

### Changed Files
- `[path]` — [change]

### Checks
| Check | Result | Evidence |
|---|---|---|
| [check] | [PASS | FAIL | BLOCKED | UNVERIFIED] | [command/file:line] |

### Blockers or Missing Evidence
- [none | concrete blocker, attempted check, missing dependency, and risk]

### Process Feedback Review

- Compare each explicit closeout dimension `state` with available assurance
  evidence; a structurally available mismatch is a missed finding.
- **Missed Process Feedback:** [none observed after checking all eight dimensions | concrete concern with evidence]
- **Unsupported Feedback:** [none observed | observation ID and missing evidence]
- **Classification Concerns:** [none observed | observation ID and category/severity concern]
- **Duplicate/Recurring Candidate:** [none observed | observation ID and duplicate or recurrence evidence]

This verification remains read-only and cannot promote an observation into a
systemic change or authorize a governance mutation.

### Required Next Action
- [trusted publish after exact-candidate assurance | corrective rework | reporting-only/cancelled outcome]

A Verifier report cannot authorize source writes, publication or a Controller
transition. Successful v1 completion requires matching exact-candidate Reviewer
and Verifier `READY` bindings, trusted publish, remote-tip verification and
immutable provenance. `BLOCKED` or `UNVERIFIED` requires rework or
reporting-only disposition; Controller v1 has no `Stage 3 Close` state.
