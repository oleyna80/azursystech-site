---
artifact_type: architecture_audit
status: draft
scope: docs-only
not_work_block: true
---

# SDLC Revision Audit

## Purpose

This branch is the durable SSOT for the AzurSysTech SDLC architecture revision.

It is **not a Work Block**, does not grant implementation authority, and must not be used to bypass the existing lifecycle, hook, merge, or deploy controls.

The purpose is to collect findings from WB-036/WB-037, identify root causes, define the target lifecycle model, and later derive bounded implementation Work Blocks.

## Working rule

During the audit phase:

1. Observe and reproduce contradictions.
2. Record findings before changing control-plane code.
3. Separate symptoms from root causes.
4. Complete the transition model before writing the remediation plan.
5. Implement remediation later through separate bounded Work Blocks.

## Current diagnosis

WB-037 became an integration test of the control plane.

Most individual guards behaved fail-closed as designed, but the combined lifecycle could still enter states where every local rule was individually reasonable while the next valid transition was impossible.

The primary architectural problem is therefore not "bad hooks". It is that lifecycle state, Git worktree state, Git index state, Git history state, assurance state, and publication state are not yet represented by one complete transition model.

## Findings register

### F-001 — Assurance disposition lifecycle was incomplete

Optional assurance could remain PENDING while success-closeout required every assurance disposition to be resolved. A supported explicit SKIPPED transition with a non-empty reason was required.

Status: partially remediated during WB-037.

Architectural lesson: every blocking state needs a supported transition to every permitted terminal disposition.

### F-002 — Git command arguments were not equivalent to Git-selected paths

Directory staging could conceal forbidden descendants such as secret-bearing or otherwise forbidden files.

Status: remediated during WB-037.

Architectural lesson: authorization must validate the effective Git selection, not only the command-line path arguments.

### F-003 — Coordination authority was not a first-class lifecycle transition

Owner-authorized durable evidence could still be blocked when the active coordination write-set did not contain the path. A narrow WB-specific amendment was required because the lifecycle did not provide a general bounded coordination-scope transition.

Status: local problem remediated; general design issue remains open.

### F-004 — Candidate transaction and terminal transaction were not formally separated

A success-closeout could occur before the source candidate had been durably committed. Once the lifecycle became inactive, later publication steps could become impossible.

Status: open design issue.

Required direction: candidate commit must precede terminal preparation and lifecycle close.

### F-005 — Contract parsers disagreed on the accepted specification format

The terminal projection parser initially rejected a valid multiline YAML `source_write_set` already used by the specification. Subsequent review found YAML alias, ambiguous scalar, DEL, and C1 control-character edge cases.

Status: implementation prepared and tested locally in WB-037, but not yet published from that WB.

Architectural lesson: one schema/parser contract should be shared across lifecycle, hooks, and published-object conformance.

### F-006 — Owner-authorized recovery had no runtime capability representation

A bounded `git reset --soft` could be explicitly authorized by the Owner yet still be rejected by runtime PreToolUse because the command had implicit index mutations without explicit path targets.

Status: open design issue.

Architectural lesson: recovery authority should be represented as an explicit lifecycle capability, not inferred from arbitrary Git syntax.

### F-007 — Frozen candidate can deadlock with stale Git index

After an authorized soft reset, old source blobs remained staged. After freeze:

- `git restore --staged` was blocked as a source write;
- normal staging required the existing index to already match the frozen candidate.

The desired state existed, but the control plane provided no valid transition to reach it.

Status: OPEN — current systemic blocker discovered at the end of WB-037.

Required direction: add an index-only transition that materializes the exact frozen candidate without changing worktree source bytes or invalidating candidate assurance.

### F-008 — Evidence producers and evidence validators can diverge

Reviewer/Verifier/closeout artifacts have occasionally been structurally valid for the human review purpose but rejected later for missing mandatory metadata or sections.

Status: open design issue.

Architectural lesson: evidence schemas should be explicit, generated/validated close to production time, and should invalidate only the affected evidence layer when source bytes are unchanged.

### F-009 — Assurance invalidation is too coarse for control-plane self-modification

During WB-037, small changes to control-plane source or contract repeatedly forced new Critic, freeze, Reviewer, and Verifier cycles. This is correct for source changes, but the system currently does not clearly distinguish source, contract, evidence, and index-only mutations.

Status: open design issue.

Required direction: define mutation classes and precise invalidation rules.

### F-010 — Component tests were stronger than transaction-level E2E coverage

Individual lifecycle, hook, release-state, Process Feedback, and published-object tests often passed while the next real Git transition still found a new contradiction.

Status: open design issue.

Required direction: add a synthetic end-to-end Work Block transaction fixture that exercises the real sequence through terminal commit and publication conformance.

## Root-cause groups

### RC-A — Incomplete state model

The lifecycle does not yet model worktree, index, history, assurance, and publication state as one coherent transaction.

### RC-B — Distributed transition ownership

Lifecycle scripts, runtime hooks, Git hooks, validators, and CI each encode parts of the transition contract. No single layer owns the complete legal path.

### RC-C — Mutation classes are conflated

Source mutation, contract mutation, evidence repair, and index-only materialization are often treated as the same category of "write".

### RC-D — Self-hosting control-plane changes are expensive

When the control plane changes itself, the same evolving controls are also used to validate the change, creating repeated assurance cycles and exposing hidden contradictions one at a time.

## Audit objective

The revision is complete only when every permitted lifecycle state has:

- explicit preconditions;
- explicit allowed mutation;
- explicit postconditions;
- a clear authority owner;
- a reachable next transition;
- defined assurance invalidation semantics;
- positive and negative transaction tests.

The remediation plan must be derived from that model, not the other way around.
