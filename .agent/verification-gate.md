# Assurance Gate — Compatibility View

> Human-readable view only. The executable source of truth is
> `.agent/active-work-block.json`.

## Default State

- **Review:** PENDING
- **Verification:** PENDING
- **Evaluation:** PENDING
- **Drift:** PENDING
- **Closeout mode:** pending

## Machine Fields

The active Work Block records four independent assurance functions:

```json
"assurance": {
  "review": {
    "required": true,
    "status": "PENDING",
    "verdict": "PENDING",
    "report": "",
    "isolation": "unknown",
    "skip_reason": ""
  },
  "verification": {
    "required": true,
    "status": "PENDING",
    "verdict": "PENDING",
    "report": "",
    "isolation": "unknown",
    "skip_reason": ""
  },
  "evaluation": {
    "required": false,
    "status": "PENDING",
    "verdict": "PENDING",
    "plan": "",
    "report": "",
    "rubric_revision": "",
    "benchmark_revision": "",
    "isolation": "unknown",
    "skip_reason": ""
  },
  "drift": {
    "required": false,
    "status": "PENDING",
    "verdict": "PENDING",
    "report": "",
    "isolation": "unknown",
    "skip_reason": ""
  }
},
"closeout_mode": "pending"
```

## Verdicts

- Review: `READY | CHANGES_REQUIRED | BLOCKED | UNVERIFIED`
- Verification: `READY | BLOCKED | UNVERIFIED`
- Evaluation: `READY | BLOCKED | UNVERIFIED`
- Drift: `ALIGNED | ALIGNMENT_REQUIRED | BLOCKED | UNVERIFIED`

`SKIPPED` is a function status, not a passing report verdict, and is allowed only
when the function is not required and `skip_reason` is concrete. Required evaluation
cannot be skipped.

## Evaluation Evidence

Evaluation state additionally binds:

- approved plan under `docs/evals/`;
- report under `docs/reports/`;
- rubric and benchmark/dataset revisions;
- actual runtime/model-class/isolation boundary;
- deterministic, output, and observable trajectory result matrices.

Trajectory evidence contains observable tool, gate, check, retry, side-effect, and
artifact events only. It must not contain or require hidden reasoning, private
chain-of-thought, or model scratchpads.

## Evidence

A resolved required function records:

- report under `docs/reports/`;
- actual runtime/integration and isolation in the Work Block/report;
- inspected and uninspected areas;
- commands/checks and outcomes where applicable;
- residual risks;
- non-pending verdict.

Provider or model names do not define the gate. Claude Code, Codex, OpenCode,
file handoff, MCP, plugin, or human review may supply a function when the active
Work Block records the binding and actual boundary.

## Closeout

- `success-closeout` requires passing results for every required function:
  Review `READY`, Verification `READY`, Evaluation `READY` when required, and
  Drift `ALIGNED` when required.
- `reporting-only` is allowed only after required functions are resolved and
  evidence-backed. The Work Block remains blocked and is not merge-, deploy-, or
  release-ready.
- `pending` blocks Claude Code Stop.

Do not edit this Markdown file to change closeout state. Update the machine gate,
approved evaluation plan, and referenced reports.
