---
artifact_type: closeout_report
work_block_id: WB-2026-09-11-control-plane-recovery-hardening-027
status: approved
revision: terminal-publication-reconciliation-r2
process_feedback_required: true
process_feedback_contract: 1
---

# Closeout Report — WB-2026-09-11-control-plane-recovery-hardening-027

- **Stage execution state:** completed
- **Review verdict:** READY
- **Verification verdict:** READY
- **Evaluation verdict:** SKIPPED — Standard-tier deterministic control-plane change has no generative evaluation deliverable
- **Drift verdict:** ALIGNED
- **Closeout classification:** SUCCESS
- **Task status:** completed
- **Closeout mode:** success-closeout
- **External VCS state:** non-normative

## Result

The two evidenced control-plane defects were resolved within the approved
scope. Both gate-fixture harnesses now materialize the real compatibility
dependencies in a disposable Git repository and classify hook launch errors as
`ERROR`. The recovery helper remains a narrow script-owned lane that restores
only the exact approved canonical inactive template, permits only the declared
closure-field variants, refuses valid active state and redirected paths, and
uses the existing durable atomic replacement path. Normal hooks remain
fail-closed.

This corrective closeout also reconciles a previously inaccurate Process
Feedback result. The investigation found two separately evidenced
`CONTRACT_MISMATCH` observations with different ownership: the external
Claude/Codex lifecycle-hook JSON mismatch, and the repository-local terminal
publication mismatch that failed to admit the exact lifecycle-bound plan and
tasklist. They remain separate observations. The terminal contract correction
preserves the static allowlist and adds only exact active-parent-derived plan
and tasklist bindings. This corrective revision also fixes the repository-local
inactive governance projection (`PROJECT_MAP.md` now uses `Controlled`, matching
the canonical inactive gate) and narrows `.gitignore` precedence so generated
Python bytecode below `.agent` remains ignored while committed policy sources
remain trackable.

## Assurance

- Admission Critic: native execution/context `01a096ee-5358-7440-804b-6cccb739556b`, `APPROVE`, scope conditions resolved.
- Final Critic: native execution/context `01a09701-65e4-7ac0-bcf0-d1116049e363`, Luna High/high, `APPROVE`, no material findings.
- Fresh Reviewer: native execution/context `01a09735-eef2-7c33-a90d-5a95ad0bbced`, Luna High/high, `READY`, no material findings.
- Fresh Verifier: native execution/context `01a09757-5aff-70d2-b832-43ad63353b02`, Luna High/high, `READY`, no blocking findings.
- Drift: `ALIGNED`; no implementation, contract, documentation, topology, or release-state drift remains in scope.
- Corrective source candidate frozen identity:
  `content-sha256:090c6f2d3e46520c181366b088d85b4dec826d29b0fb43d1f2fadc34535539a2`.
  It covers exactly `.gitignore` and `.codex/scripts/lifecycle.py`; the latter
  fixes exact hidden-path matching for candidate identity. Fresh assurance is
  bound to this identity and the current root/branch. The lifecycle contract
  admits a committed active parent with READY assurance followed by one
  minimal terminal child; no prior assurance was reused for this changed
  source.

## Process Feedback

```yaml process-feedback
contract_version: 1
work_block_id: WB-2026-09-11-control-plane-recovery-hardening-027
date: "2026-09-12"
result: OBSERVATIONS_RECORDED
dimensions:
  documentation:
    state: FRICTION_OBSERVED
    evidence: "The earlier closeout recorded NONE despite repeated lifecycle-hook JSON contract failures; this corrective closeout records the canonical observation."
  contracts_invariants:
    state: CLEAR
    evidence: "Fail-closed normal admission and bounded recovery invariants were preserved and tested."
  tooling_skills:
    state: FRICTION_OBSERVED
    evidence: "The globally enabled security-guidance plugin emits Claude-specific metrics, rewakeSummary, and SessionStart async fields that the active Codex hook schemas reject."
  context_memory:
    state: CLEAR
    evidence: "The recovery baseline, archival WIP tag, native dispatch identities, and current assurance reports are recorded."
  governance_authority:
    state: CLEAR
    evidence: "No architecture, authority boundary, push, merge, deployment, or destructive action was introduced."
  environment_setup:
    state: FRICTION_OBSERVED
    evidence: "A user-level external plugin was registered at the Codex lifecycle boundary with a Claude Code output contract, producing invalid Codex hook output in three phases."
  validation_tests:
    state: CLEAR
    evidence: "Focused and relevant suites passed with reproducible commands and outputs."
  process_overhead_repeated_work:
    state: FRICTION_OBSERVED
    evidence: "The repeated rejected hook outputs created avoidable diagnostic and lifecycle friction across SessionStart, PostToolUse, and Stop."
avoidable_friction_count: 4
observation_ids:
- PF-2026-09-12-codex-hook-json-contract-mismatch
- PF-2026-09-12-terminal-plan-tasklist-publication-mismatch
- PF-2026-09-12-terminal-inactive-governance-projection-mismatch
- PF-2026-09-12-agent-bytecode-ignore-precedence
registry: docs/engineering-memory/process-feedback-registry.yml
```

## Residual Risks and Limitations

The recovery lane is intentionally not a generic state repair mechanism. It
accepts no arguments, cannot target an arbitrary repository or path, requires
the script-owned Git worktree and repository markers, and writes only the
canonical inactive template subject to the two approved closure-field
variants. A future change to the inactive template or marker contract must
update this bounded matrix deliberately. Optional `npm audit` was not
applicable because the change is Bash/Python-only and no dependency manifest
changed.

## Follow-Up Work

Owner integration review is required for the local candidate. No merge,
deployment, PR, tag publication, predecessor-worktree repair, branch cleanup,
or destructive cleanup is part of this closeout. The only permitted
publication action is the exact non-force subject refspec after all terminal
predicates are READY.
