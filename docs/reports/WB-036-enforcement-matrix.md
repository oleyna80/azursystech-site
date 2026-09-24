---
artifact_type: enforcement_audit
work_block_id: WB-036
specification: docs/specs/WB-036.md
revision: v3
status: audited
---

# WB-036 enforcement matrix

`G` = Git-native; `S` = shared policy/validator; `R` = runtime adapter;
`E` = external capability. Git/runtime hooks are deterministic cooperative
guardrails for normal supported execution, not a security boundary against
arbitrary Bash. Published-object CI conformance is a second cooperative check;
required GitHub checks and Owner-controlled capabilities form the consequential
boundary.

| Control point / invariant | Existing enforcement and coverage | Correct layer; gap or overlap | Regression evidence |
|---|---|---|---|
| 1 Bootstrap/admission: root, attached branch, WB/spec/write-set, capability before writes | `lifecycle.py open`, Codex `stage0_write_gate.py` and `pre_tool_use_policy.py`, Claude `work_block_gate.py`, `subagent_topology.py`; partial across runtimes | S for admission, R for session-root/capability events, E for credentials; Codex/Claude duplicate some checks; unknown runtime capability must remain blocked | `scripts/test-github-capability-control-plane.py`, `scripts/test-subagent-topology.py`, adapter gate fixtures |
| 2 Before write: only READY source writes in admitted scope | Codex and Claude pre-tool hooks; controller v1 inert; partial/cooperative | S policy with R event translation preferred; existing adapters duplicate scope logic; Git cannot see pre-staging attempt. Keep current guards in this WB | `.codex/hooks/tests/gate-fixtures.sh`, `.claude/hooks/tests/gate-fixtures.sh` |
| 3 Before freeze: coherent candidate and identity | `lifecycle.py freeze` requires READY and hashes declared source; partial | S lifecycle validator. WB-036 requires recorded passing Git-transition, WB-035 lifecycle/publication, bootstrap-hook, and traceability checks before freeze. A generic machine-readable check manifest is deferred | `docs/reports/WB-036-tests.md`; WB-035 rework/freeze cases |
| 4 Before Reviewer/Verifier: exact freeze, separated contexts, report paths, order | lifecycle prepare/finalize, topology validator; enforced for supported profiles | S lifecycle plus R dispatch. Controlled reports bind separate contexts; native topology applies to Managed/Assured; no change | WB-035 assurance transition regressions |
| 5 After rework: stale assurance invalidated | lifecycle negative verdict returns to READY and clears freeze/review/verification; frozen identity checks deny changed source; enforced on canonical path | S lifecycle; runtime write guards block edits while frozen. Out-of-band edit is caught at assurance/push, not proactively reset; intentional detection | WB-035 `test_controlled_assurance_rework` |
| 6 Before commit: branch/WB trailer, staged scope, forbidden files | `.githooks/commit-msg` checks active trailer/branch; Codex/Claude pre-tool checks staged scope; Git itself lacked `pre-commit`; partial. Both adapters deny a frozen source commit by reusing the READY-only write predicate | G thin hook to S shared index policy. Canonical inactive coordination and bounded terminal closeout require explicit allow cases; malformed inactive state and wrong terminal trailer must fail closed. R admits frozen commits only with the installed G hook and keeps bypass detection as poka-yoke. Published-object CI rechecks branch, trailers, scope, source identity, and assurance; E controls merge | commit-msg fixtures; Git-transition/runtime fixtures; new CI conformance fixtures |
| 7 Before push: exact assured subject, unchanged candidate, no force/default | `.agent/hooks/hard_stop_policy.py` shared predicate called by Codex/Claude Bash adapters; no Git `pre-push`; partial | G thin hook to existing S predicate; reject mismatched Git-provided ref/remote/non-fast-forward. Git event cannot reveal an unused force flag or original argv: R checks recognized commands. Published-object CI rechecks candidate/assurance and branch, but cannot reconstruct push argv or force. E protected branch/ruleset controls consequential targets | `scripts/test-github-capability-control-plane.py` literal-command cases; Git-transition and CI fixtures |
| 8 Before dangerous operations: Owner control | shared hard-stop policy through runtime Bash hooks; governance authority; E GitHub/OS/credentials; cooperative/local and external | E is final boundary; R detects SSH, DB, infra and shell operations Git cannot see. Hooks cannot prove explicit Owner authority; deny by default. Preserve working guards | `.codex/hooks/tests/hard-stop-fixtures.sh`, `.claude/hooks/tests/hard-stop-fixtures.sh` |
| 9 Closeout: durable reports, canonical inactive | `lifecycle.py close`, release-state and process-feedback validators; partial. Terminal push predicate currently requires READY parent gate, contradictory to frozen BLOCKED assurance parent | S lifecycle and durable artifacts; G terminal-child publication predicate; published-object CI repeats exact parent assurance and bounded canonical-inactive child; E Owner merge. Repair parent-gate contradiction while requiring exact committed assurance, candidate, and terminal projection | release-state/process-feedback and WB-035 closeout tests plus Git-transition and CI terminal cases |

## Gaps versus intentional overlap

The material Git transition gap was absence of `pre-commit` and `pre-push` hooks.
Staging the frozen candidate exposed a second material contradiction: both
runtime adapters apply the READY-only source-write predicate to `git commit`,
although an assured frozen candidate has a BLOCKED write gate. This is a
legitimate commit that cannot reach the new Git hook until the adapter treats
the installed hook as the commit authority. Source edits still require READY.
Runtime pre-tool commit/push screening is intentional early defense because
Git-native hooks are cooperative too. The shared Hard Stop predicate is the
existing publication policy; duplicate Codex/Claude hook entrypoints translate
their event formats. Their separate pre-write scope implementations are
duplicate policy and merit later consolidation, but no observed regression in
this WB justifies rewriting them. Controller v1 remains inert and is not a
replacement for the live schema-v3 lifecycle.

Reviewer r15 demonstrated that arbitrary Bash can assemble an indirect
`git commit --no-verify` through `command env -Sbash -c` without matching the
runtime command classifier. The Owner approved a cooperative contract for
WB-036. That bypass remains a known capability-model limit, and agents remain
prohibited from using it. The critical authority invariant is that a local
hook bypass cannot grant merge/deploy authority. The new CI conformance job
must recheck every Git-observable candidate invariant from published objects;
required checks and external Owner controls remain the consequential boundary.
The CI job cannot reconstruct original Bash/Git argv, unused force flags, or
whether a local hook actually ran. This is an intentional residual, not a
claim that the local classifier is a security boundary.

## Exclusions and deferred items

- External GitHub required-check/ruleset, deploy environment, OS/database role
  and credential audits require external-capability evidence; project-local
  tests cannot prove those boundaries. Enabling a newly required check after
  publication remains external Owner/GitHub configuration work.
- Native runtime root/event-binding consolidation, full freeze check manifest,
  and Codex/Claude pre-write policy deduplication are deferred pending a scoped
  contract and equivalence fixtures.
- Git and runtime hooks are bypassable with arbitrary local command execution;
  agents are prohibited from bypassing them. Subject publication is reversible
  cooperative publication. Protected/default mutation and other consequential
  operations remain external Owner controls.

## Implemented alignment

- Thin Git-native `pre-commit` and `pre-push` wrappers now invoke one shared
  Git-transition policy. The active index check binds branch, Critic admission,
  exact write-set, the worktree gate to the staged gate, and the complete
  frozen source projection in the proposed Git tree. Prohibited names are
  rejected at every path depth. The push event check binds remote URL, sole
  subject update, HEAD object, and fast-forward ancestry before calling the
  existing shared publication predicate, which also requires the worktree
  assurance gate to match the gate committed at HEAD.
- Critic admission in the Git hook uses the same resolved disposition as the
  shared publication policy: READY APPROVE/SUPPLEMENT or SKIPPED with an
  explicit nonempty reason. A shared runtime denial that exits with status 0
  is translated to nonzero Git-hook failure; injected inspection-error cases
  cover both Git entrypoints.
- The `commit-msg` hook now checks the canonical inactive template and exact
  active-parent Work Block trailer for a terminal child. Bootstrap checks all
  three executable hooks. The shared terminal publication predicate accepts
  the actual assured BLOCKED parent only with committed Critic, Reviewer,
  Verifier, and unchanged frozen candidate evidence.
- The runtime commit path now delegates frozen source commits to the installed
  Git-native check through one shared predicate in both adapters, while
  rejecting bypass flags, command-level overrides, dynamic executable names,
  and nested shell `-c` invocation. Other
  pre-write and dangerous-operation guards remain early defense;
  consequential authority remains external.
- The published-object CI job runs for every branch push and PR update without
  a path filter. It checks out the event head, anchors the Work Block range to
  the trusted default-branch ancestor, and rechecks each commit plus cumulative
  scope, branch/trailer linkage, frozen source identity, assurance, and bounded
  terminal closeout from committed objects. Its positive and negative fixture
  suite covers active, terminal, and canonical-inactive coordination cases.
- Closeout is conditional on canonical prerequisites; reporting-only remains
  available for unresolved assurance and must never invent successful evidence.
